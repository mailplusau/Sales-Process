/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript

 * Author:               Ankith Ravindran
 * Created on:           Fri Oct 25 2024
 * Modified on:          Fri Oct 25 2024 11:23:42
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */

define([
	"SuiteScripts/jQuery Plugins/Moment JS/moment.min",
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/http",
	"N/log",
	"N/error",
	"N/url",
	"N/format",
	"N/currentRecord",
], function (
	moment,
	email,
	runtime,
	search,
	record,
	http,
	log,
	error,
	url,
	format,
	currentRecord
) {
	var zee = 0;
	var userId = 0;
	var role = 0;

	var baseURL = "https://1048144.app.netsuite.com";
	if (runtime.EnvType == "SANDBOX") {
		baseURL = "https://1048144-sb3.app.netsuite.com";
	}

	role = runtime.getCurrentUser().role;
	var userName = runtime.getCurrentUser().name;
	var userId = runtime.getCurrentUser().id;
	var currRec = currentRecord.get();

	function afterSubmit() {
		$(".zee_label_section").removeClass("hide");
		$(".show_buttons_section").removeClass("hide");
		$(".zee_dropdown_section").removeClass("hide");

		$(".lead_entered_label_section").removeClass("hide");
		$(".lead_entered_div").removeClass("hide");
		$(".modified_date_div").removeClass("hide");

		$(".source_salesrep_label_section").removeClass("hide");
		$(".source_salesrep_section").removeClass("hide");

		$(".filter_buttons_section").removeClass("hide");
		// $(".tabs_section").removeClass("hide");
		$(".table_section").removeClass("hide");
		$(".instruction_div").removeClass("hide");

		$(".header_one").removeClass("hide");
		$(".table_section_1").removeClass("hide");

		$(".loading_section").addClass("hide");
	}

	function pageInit() {
		$("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
		$("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
		$("#body").css("background-color", "#CFE0CE");
		// pageLoad();
		$(".ui.dropdown").dropdown();

		$(document).ready(function () {
			$(".js-example-basic-multiple").select2();
		});

		loadSearch();
		afterSubmit();

		$("#show_filter").click(function () {
			if ($("#show_filter").val() == "SHOW FILTERS") {
				$("#show_filter").val("HIDE FILTERS");
				$("#show_filter").css("background-color", "#F0AECB");
				$("#show_filter").css("color", "#103d39");
			} else {
				$("#show_filter").val("SHOW FILTERS");
				$("#show_filter").css("background-color", "#EAF044");
				$("#show_filter").css("color", "#103d39");
			}
		});

		$("#applyFilter").click(function () {
			var modified_date_from = $("#modified_date_from").val();
			var modified_date_to = $("#modified_date_to").val();
			var source = $("#lead_source").val();
			var sales_campaign = $("#sales_campaign").val();
			var parent_lpo = $("#parent_lpo").val();

			var sales_rep = $("#sales_rep").val();
			var lead_entered_by = $("#lead_entered_by").val();

			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1947&deploy=1&start_date=" +
				modified_date_from +
				"&last_date=" +
				modified_date_to +
				"&source=" +
				source +
				"&sales_rep=" +
				sales_rep +
				"&zee=" +
				zee +
				"&campaign=" +
				sales_campaign +
				"&lpo=" +
				parent_lpo +
				"&lead_entered_by=" +
				lead_entered_by;

			window.location.href = url;
		});

		$("#clearFilter").click(function () {
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1947&deploy=1";

			window.location.href = url;
		});
	}

	function loadSearch() {
		var start_date = $("#modified_date_from").val();
		start_date = dateISOToNetsuite(start_date);
		var last_date = $("#modified_date_to").val();
		last_date = dateISOToNetsuite(last_date);

		console.log("start_date", start_date);
		console.log("last_date", last_date);

		var source = $("#lead_source").val();
		var sales_campaign = $("#sales_campaign").val();
		var parent_lpo = $("#parent_lpo").val();

		var sales_rep = $("#sales_rep").val();
		var lead_entered_by = $("#lead_entered_by").val();

		// NetSuite Search: All Leads - Activity - Reporting 202410
		var allLeadsActitivityReportingSearch = search.load({
			type: "customer",
			id: "customsearch_all_leads_reporting_20241_6",
		});
		if (!isNullorEmpty(start_date) && !isNullorEmpty(last_date)) {
			allLeadsActitivityReportingSearch.filters.push(
				search.createFilter({
					name: "date",
					join: "systemnotes",
					operator: search.Operator.WITHIN,
					values: [start_date, last_date],
				})
			);
		}
		if (!isNullorEmpty(source)) {
			allLeadsActitivityReportingSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: source,
				})
			);
		}
		if (!isNullorEmpty(sales_campaign)) {
			allLeadsActitivityReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "CUSTRECORD_SALES_CUSTOMER",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}
		if (!isNullorEmpty(lead_entered_by)) {
			allLeadsActitivityReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_entered_by,
				})
			);
		}
		if (!isNullorEmpty(sales_rep)) {
			allLeadsActitivityReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					operator: search.Operator.ANYOF,
					values: sales_rep,
				})
			);
		}

		var oldSystemNotesDateByWeek = null;
		var oldCustomerInternalId = null;
		var oldLastSalesRecordInternalId = null;
		var oldLastCommRegRecordInternalId = null;
		var oldSalesRepId = null;
		var oldSalesRepName = null;
		var oldSourceId = null;
		var oldSourceText = null;
		var oldCampaignId = null;
		var oldCampaignText = null;
		var oldCustomerStatusId = null;
		var oldCustomerStatus = null;

		var salesRepJSON = [];
		var totalJSON = [];

		var systemNotesActivitySearchCount = 0;

		allLeadsActitivityReportingSearch
			.run()
			.each(function (allLeadsActitivityReportingResultSet) {
				var systemNotesDateByWeek =
					allLeadsActitivityReportingResultSet.getValue({
						name: "date",
						join: "systemNotes",
						summary: "MAX",
					});

				var systemNotesSetBy = allLeadsActitivityReportingResultSet.getValue({
					name: "name",
					join: "systemNotes",
					summary: "GROUP",
				});
				var systemNotesSetByText = allLeadsActitivityReportingResultSet.getText(
					{
						name: "name",
						join: "systemNotes",
						summary: "GROUP",
					}
				);

				var customerInternalId = allLeadsActitivityReportingResultSet.getValue({
					name: "internalid",
					summary: "GROUP",
				});

				var customerEntityID = allLeadsActitivityReportingResultSet.getValue({
					name: "entityid",
					summary: "GROUP",
				});
				var customerName = allLeadsActitivityReportingResultSet.getValue({
					name: "companyname",
					summary: "GROUP",
				});
				var zeeID = allLeadsActitivityReportingResultSet.getValue({
					name: "partner",
					summary: "GROUP",
				});
				var zeeName = allLeadsActitivityReportingResultSet.getText({
					name: "partner",
					summary: "GROUP",
				});

				var custStage = allLeadsActitivityReportingResultSet
					.getText({
						name: "stage",
						summary: "GROUP",
					})
					.toUpperCase();
				var customerStatusId = allLeadsActitivityReportingResultSet.getValue({
					name: "entitystatus",
					summary: "GROUP",
				});

				var customerStatus = allLeadsActitivityReportingResultSet
					.getText({
						name: "entitystatus",
						summary: "GROUP",
					})
					.toUpperCase();

				var lastSalesRecordInternalId =
					allLeadsActitivityReportingResultSet.getValue({
						name: "internalid",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "MAX",
					});
				if (isNullorEmpty(lastSalesRecordInternalId)) {
					lastSalesRecordInternalId = 0;
				}
				var lastCommRegRecordInternalId =
					allLeadsActitivityReportingResultSet.getValue({
						name: "internalid",
						join: "CUSTRECORD_CUSTOMER",
						summary: "MAX",
					});
				if (isNullorEmpty(lastCommRegRecordInternalId)) {
					lastCommRegRecordInternalId = 0;
				}

				if (systemNotesActivitySearchCount == 0) {
					// var campaignInternalID = null;
					// var campaignName = null;
					// if (!isNullorEmpty(lastSalesRecordInternalId)) {
					// 	var salesRecord = record.load({
					// 		type: "customrecord_sales",
					// 		id: lastSalesRecordInternalId,
					// 	});

					// 	campaignInternalID = salesRecord.getValue({
					// 		fieldId: "custrecord_sales_campaign",
					// 	});
					// 	campaignName = salesRecord.getText({
					// 		fieldId: "custrecord_sales_campaign",
					// 	});
					// }

					if (salesRepJSON.length > 0) {
						var newSalesRep = true;
						for (var p = 0; p < salesRepJSON.length; p++) {
							if (salesRepJSON[p].id == systemNotesSetBy) {
								newSalesRep = false;
								salesRepJSON[p].count = salesRepJSON[p].count + 1;
								var newStatus = true;
								for (var st = 0; st < salesRepJSON[p].statuses.length; st++) {
									if (salesRepJSON[p].statuses[st].id == customerStatusId) {
										newStatus = false;
										salesRepJSON[p].statuses[st].count =
											salesRepJSON[p].statuses[st].count + 1;
									}
								}
								if (newStatus == true) {
									salesRepJSON[p].statuses.push({
										id: customerStatusId,
										name: customerStatus,
										count: 1,
									});
								}

								salesRepJSON[p].salesRecordInternalIDs.push(
									lastSalesRecordInternalId
								);

								var newDate = true;
								for (
									var st = 0;
									st < salesRepJSON[p].systemNotesCalendarWeek.length;
									st++
								) {
									if (
										salesRepJSON[p].systemNotesCalendarWeek[st].date ==
										systemNotesDateByWeek
									) {
										newDate = false;
										salesRepJSON[p].systemNotesCalendarWeek[st].count =
											salesRepJSON[p].systemNotesCalendarWeek[st].count + 1;

										var newWeeklyDateStatus = true;
										for (
											var st1 = 0;
											st1 <
											salesRepJSON[p].systemNotesCalendarWeek[st].statuses
												.length;
											st1++
										) {
											if (
												salesRepJSON[p].systemNotesCalendarWeek[st].statuses[
													st1
												].id == customerStatusId
											) {
												newWeeklyDateStatus = false;
												salesRepJSON[p].systemNotesCalendarWeek[st].statuses[
													st1
												].count =
													salesRepJSON[p].systemNotesCalendarWeek[st].statuses[
														st1
													].count + 1;
											}
										}

										if (newWeeklyDateStatus == true) {
											salesRepJSON[p].systemNotesCalendarWeek[st].statuses.push(
												{
													id: customerStatusId,
													name: customerStatus,
													count: 1,
												}
											);
										}
									}
								}

								if (newDate == true) {
									salesRepJSON[p].systemNotesCalendarWeek.push({
										date: systemNotesDateByWeek,
										count: 1,
										statuses: [],
									});

									salesRepJSON[p].systemNotesCalendarWeek[
										salesRepJSON[p].systemNotesCalendarWeek.length - 1
									].statuses.push({
										id: customerStatusId,
										name: customerStatus,
										count: 1,
									});
								}
							}
						}
						if (newSalesRep == true) {
							salesRepJSON.push({
								id: systemNotesSetBy,
								name: systemNotesSetByText,
								count: 1,
								statuses: [],
								salesRecordInternalIDs: [],
								systemNotesCalendarWeek: [],
							});
							salesRepJSON[salesRepJSON.length - 1].statuses.push({
								id: customerStatusId,
								name: customerStatus,
								count: 1,
							});

							salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
								lastSalesRecordInternalId
							);

							salesRepJSON[
								salesRepJSON.length - 1
							].systemNotesCalendarWeek.push({
								date: systemNotesDateByWeek,
								count: 1,
								statuses: [],
							});
							salesRepJSON[
								salesRepJSON.length - 1
							].systemNotesCalendarWeek[0].statuses.push({
								id: customerStatusId,
								name: customerStatus,
								count: 1,
							});
						}
					} else {
						salesRepJSON.push({
							id: systemNotesSetBy,
							name: systemNotesSetByText,
							count: 1,
							statuses: [],
							salesRecordInternalIDs: [],
							systemNotesCalendarWeek: [],
						});
						salesRepJSON[salesRepJSON.length - 1].statuses.push({
							id: customerStatusId,
							name: customerStatus,
							count: 1,
						});
						salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
							lastSalesRecordInternalId
						);
						salesRepJSON[salesRepJSON.length - 1].systemNotesCalendarWeek.push({
							date: systemNotesDateByWeek,
							count: 1,
							statuses: [],
						});
						salesRepJSON[
							salesRepJSON.length - 1
						].systemNotesCalendarWeek[0].statuses.push({
							id: customerStatusId,
							name: customerStatus,
							count: 1,
						});
					}
				} else if (
					oldCustomerInternalId != null &&
					oldCustomerInternalId != customerInternalId
				) {
					if (totalJSON.length > 0) {
						for (var p = 0; p < totalJSON.length; p++) {
							newSalesRep = false;
							totalJSON[p].count = totalJSON[p].count + 1;

							var newStatus = true;
							for (
								var st = 0;
								st < totalJSON[p].statuses[0].type.length;
								st++
							) {
								if (
									totalJSON[p].statuses[0].type[st].id == oldCustomerStatusId
								) {
									newStatus = false;
									totalJSON[p].statuses[0].type[st].count =
										totalJSON[p].statuses[0].type[st].count + 1;
								}
							}

							if (newStatus == true) {
								totalJSON[p].statuses[0].type.push({
									id: oldCustomerStatusId,
									name: oldCustomerStatus,
									count: 1,
								});
							}

							var newDate = true;
							for (
								var st = 0;
								st < totalJSON[p].systemNotesCalendarWeek.length;
								st++
							) {
								if (
									totalJSON[p].systemNotesCalendarWeek[st].date ==
									oldSystemNotesDateByWeek
								) {
									newDate = false;
									totalJSON[p].systemNotesCalendarWeek[st].count =
										totalJSON[p].systemNotesCalendarWeek[st].count + 1;

									var newWeeklyDateStatus = true;
									for (
										var st1 = 0;
										st1 <
										totalJSON[p].systemNotesCalendarWeek[st].statuses.length;
										st1++
									) {
										if (
											totalJSON[p].systemNotesCalendarWeek[st].statuses[st1]
												.id == oldCustomerStatusId
										) {
											newWeeklyDateStatus = false;
											totalJSON[p].systemNotesCalendarWeek[st].statuses[
												st1
											].count =
												totalJSON[p].systemNotesCalendarWeek[st].statuses[st1]
													.count + 1;
										}
									}

									if (newWeeklyDateStatus == true) {
										totalJSON[p].systemNotesCalendarWeek[st].statuses.push({
											id: oldCustomerStatusId,
											name: oldCustomerStatus,
											count: 1,
										});
									}
								}
							}

							if (newDate == true) {
								totalJSON[p].systemNotesCalendarWeek.push({
									date: oldSystemNotesDateByWeek,
									count: 1,
									statuses: [],
								});

								totalJSON[p].systemNotesCalendarWeek[
									totalJSON[p].systemNotesCalendarWeek.length - 1
								].statuses.push({
									id: oldCustomerStatusId,
									name: oldCustomerStatus,
									count: 1,
								});
							}
						}
					} else {
						totalJSON.push({
							count: 1,
							statuses: [],
							systemNotesCalendarWeek: [],
						});

						totalJSON[totalJSON.length - 1].statuses.push({
							type: [
								{
									id: oldCustomerStatusId,
									name: oldCustomerStatus,
									count: 1,
								},
							],
						});
						totalJSON[totalJSON.length - 1].systemNotesCalendarWeek.push({
							date: oldSystemNotesDateByWeek,
							count: 1,
							statuses: [],
						});
						totalJSON[
							totalJSON.length - 1
						].systemNotesCalendarWeek[0].statuses.push({
							id: oldCustomerStatusId,
							name: oldCustomerStatus,
							count: 1,
						});
					}

					console.log("End of Customer");
					console.log("totalJSON", JSON.stringify(totalJSON));
					console.log("salesRepJSON", JSON.stringify(salesRepJSON));

					// var campaignInternalID = null;
					// var campaignName = null;
					// if (!isNullorEmpty(lastSalesRecordInternalId)) {
					// 	var salesRecord = record.load({
					// 		type: "customrecord_sales",
					// 		id: lastSalesRecordInternalId,
					// 	});

					// 	campaignInternalID = salesRecord.getValue({
					// 		fieldId: "custrecord_sales_campaign",
					// 	});
					// 	campaignName = salesRecord.getText({
					// 		fieldId: "custrecord_sales_campaign",
					// 	});
					// }

					if (salesRepJSON.length > 0) {
						var newSalesRep = true;
						for (var p = 0; p < salesRepJSON.length; p++) {
							if (salesRepJSON[p].id == systemNotesSetBy) {
								newSalesRep = false;
								salesRepJSON[p].count = salesRepJSON[p].count + 1;
								var newStatus = true;
								for (var st = 0; st < salesRepJSON[p].statuses.length; st++) {
									if (salesRepJSON[p].statuses[st].id == customerStatusId) {
										newStatus = false;
										salesRepJSON[p].statuses[st].count =
											salesRepJSON[p].statuses[st].count + 1;
									}
								}
								if (newStatus == true) {
									salesRepJSON[p].statuses.push({
										id: customerStatusId,
										name: customerStatus,
										count: 1,
									});
								}

								salesRepJSON[p].salesRecordInternalIDs.push(
									lastSalesRecordInternalId
								);

								var newDate = true;
								for (
									var st = 0;
									st < salesRepJSON[p].systemNotesCalendarWeek.length;
									st++
								) {
									if (
										salesRepJSON[p].systemNotesCalendarWeek[st].date ==
										systemNotesDateByWeek
									) {
										newDate = false;
										salesRepJSON[p].systemNotesCalendarWeek[st].count =
											salesRepJSON[p].systemNotesCalendarWeek[st].count + 1;

										var newWeeklyDateStatus = true;
										for (
											var st1 = 0;
											st1 <
											salesRepJSON[p].systemNotesCalendarWeek[st].statuses
												.length;
											st1++
										) {
											if (
												salesRepJSON[p].systemNotesCalendarWeek[st].statuses[
													st1
												].id == customerStatusId
											) {
												newWeeklyDateStatus = false;
												salesRepJSON[p].systemNotesCalendarWeek[st].statuses[
													st1
												].count =
													salesRepJSON[p].systemNotesCalendarWeek[st].statuses[
														st1
													].count + 1;
											}
										}

										if (newWeeklyDateStatus == true) {
											salesRepJSON[p].systemNotesCalendarWeek[st].statuses.push(
												{
													id: customerStatusId,
													name: customerStatus,
													count: 1,
												}
											);
										}
									}
								}

								if (newDate == true) {
									salesRepJSON[p].systemNotesCalendarWeek.push({
										date: systemNotesDateByWeek,
										count: 1,
										statuses: [],
									});

									salesRepJSON[p].systemNotesCalendarWeek[
										salesRepJSON[p].systemNotesCalendarWeek.length - 1
									].statuses.push({
										id: customerStatusId,
										name: customerStatus,
										count: 1,
									});
								}
							}
						}
						if (newSalesRep == true) {
							salesRepJSON.push({
								id: systemNotesSetBy,
								name: systemNotesSetByText,
								count: 1,
								statuses: [],
								salesRecordInternalIDs: [],
								systemNotesCalendarWeek: [],
							});
							salesRepJSON[salesRepJSON.length - 1].statuses.push({
								id: customerStatusId,
								name: customerStatus,
								count: 1,
							});

							salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
								lastSalesRecordInternalId
							);

							salesRepJSON[
								salesRepJSON.length - 1
							].systemNotesCalendarWeek.push({
								date: systemNotesDateByWeek,
								count: 1,
								statuses: [],
							});
							salesRepJSON[
								salesRepJSON.length - 1
							].systemNotesCalendarWeek[0].statuses.push({
								id: customerStatusId,
								name: customerStatus,
								count: 1,
							});
						}
					} else {
						salesRepJSON.push({
							id: systemNotesSetBy,
							name: systemNotesSetByText,
							count: 1,
							statuses: [],
							salesRecordInternalIDs: [],
							systemNotesCalendarWeek: [],
						});
						salesRepJSON[salesRepJSON.length - 1].statuses.push({
							id: customerStatusId,
							name: customerStatus,
							count: 1,
						});
						salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
							lastSalesRecordInternalId
						);
						salesRepJSON[salesRepJSON.length - 1].systemNotesCalendarWeek.push({
							date: systemNotesDateByWeek,
							count: 1,
							statuses: [],
						});
						salesRepJSON[
							salesRepJSON.length - 1
						].systemNotesCalendarWeek[0].statuses.push({
							id: customerStatusId,
							name: customerStatus,
							count: 1,
						});
					}
				}

				oldSystemNotesDateByWeek = systemNotesDateByWeek;
				oldCustomerInternalId = customerInternalId;
				oldCustomerStatusId = customerStatusId;
				oldCustomerStatus = customerStatus;
				oldLastSalesRecordInternalId = lastSalesRecordInternalId;
				oldLastCommRegRecordInternalId = lastCommRegRecordInternalId;
				systemNotesActivitySearchCount++;

				return true;
			});

		if (systemNotesActivitySearchCount > 0) {
			if (totalJSON.length > 0) {
				for (var p = 0; p < totalJSON.length; p++) {
					newSalesRep = false;
					totalJSON[p].count = totalJSON[p].count + 1;

					var newStatus = true;
					for (var st = 0; st < totalJSON[p].statuses[0].type.length; st++) {
						if (totalJSON[p].statuses[0].type[st].id == oldCustomerStatusId) {
							newStatus = false;
							totalJSON[p].statuses[0].type[st].count =
								totalJSON[p].statuses[0].type[st].count + 1;
						}
					}

					if (newStatus == true) {
						totalJSON[p].statuses[0].type.push({
							id: oldCustomerStatusId,
							name: oldCustomerStatus,
							count: 1,
						});
					}

					var newDate = true;
					for (
						var st = 0;
						st < totalJSON[p].systemNotesCalendarWeek.length;
						st++
					) {
						if (
							totalJSON[p].systemNotesCalendarWeek[st].date ==
							oldSystemNotesDateByWeek
						) {
							newDate = false;
							totalJSON[p].systemNotesCalendarWeek[st].count =
								totalJSON[p].systemNotesCalendarWeek[st].count + 1;

							var newWeeklyDateStatus = true;
							for (
								var st1 = 0;
								st1 < totalJSON[p].systemNotesCalendarWeek[st].statuses.length;
								st1++
							) {
								if (
									totalJSON[p].systemNotesCalendarWeek[st].statuses[st1].id ==
									oldCustomerStatusId
								) {
									newWeeklyDateStatus = false;
									totalJSON[p].systemNotesCalendarWeek[st].statuses[st1].count =
										totalJSON[p].systemNotesCalendarWeek[st].statuses[st1]
											.count + 1;
								}
							}

							if (newWeeklyDateStatus == true) {
								totalJSON[p].systemNotesCalendarWeek[st].statuses.push({
									id: oldCustomerStatusId,
									name: oldCustomerStatus,
									count: 1,
								});
							}
						}
					}

					if (newDate == true) {
						totalJSON[p].systemNotesCalendarWeek.push({
							date: oldSystemNotesDateByWeek,
							count: 1,
							statuses: [],
						});

						totalJSON[p].systemNotesCalendarWeek[
							totalJSON[p].systemNotesCalendarWeek.length - 1
						].statuses.push({
							id: oldCustomerStatusId,
							name: oldCustomerStatus,
							count: 1,
						});
					}
				}
			} else {
				totalJSON.push({
					count: 1,
					statuses: [],
					systemNotesCalendarWeek: [],
				});

				totalJSON[totalJSON.length - 1].statuses.push({
					type: [
						{
							id: oldCustomerStatusId,
							name: oldCustomerStatus,
							count: 1,
						},
					],
				});
				totalJSON[totalJSON.length - 1].systemNotesCalendarWeek.push({
					date: oldSystemNotesDateByWeek,
					count: 1,
					statuses: [],
				});
				totalJSON[
					totalJSON.length - 1
				].systemNotesCalendarWeek[0].statuses.push({
					id: oldCustomerStatusId,
					name: oldCustomerStatus,
					count: 1,
				});
			}
		}

		console.log("Final");
		console.log("totalJSON", JSON.stringify(totalJSON));
		console.log("salesRepJSON", JSON.stringify(salesRepJSON));

		var mainDataSet = [];

		for (var k = 0; k < totalJSON[0].systemNotesCalendarWeek.length; k++) {
			var statusActivityWeek = totalJSON[0].systemNotesCalendarWeek[k].date;

			var totalLeads = totalJSON[0].systemNotesCalendarWeek[k].count;
			var hotLeads = 0;
			var totalSignedCustomrs = 0;
			var totalNoAnswer = 0;
			var totalExcludedPercentage = 0.0;
			var totalPipeLine = 0;
			var totalLeadToOpportunity = 0;
			var leadToOpportunityPercentage = 0.0;
			var signedConversionPercentage = 0.0;
			var totalCompleted = 0;
			var totalRemaining = 0;
			var remainingPercentage = 0.0;
			var totalFreeTrialPending = 0;
			var totalFreeTrial = 0;

			for (
				var i = 0;
				i < totalJSON[0].systemNotesCalendarWeek[k].statuses.length;
				i++
			) {
				//Status: Customer - Signed
				if (
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 13 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 66
				) {
					totalSignedCustomrs +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Suspect - Hot Lead
				if (totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 57) {
					hotLeads += totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Suspect - No Answer or Suspect - Out of Territory
				if (
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 20 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 64
				) {
					totalNoAnswer +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial
				if (
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 72 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 58 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 50 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 70 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 32 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 71
				) {
					totalPipeLine +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Customer - Free Trial Pending
				if (totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 71) {
					totalFreeTrialPending +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Customer - Free Trial Pending
				if (totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 32) {
					totalFreeTrial +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial or Customer - Signed or Customer - To Be Finalised
				if (
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 72 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 58 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 50 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 70 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 32 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 71 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 13 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 66
				) {
					totalLeadToOpportunity +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}

				//Status: Suspect - No Answer or Suspect - Parking Lot or Suspect - Lost or Suspect - Out of Territory or Suspect - Customer - Lost or Customer - Signed
				if (
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 20 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 62 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 59 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 64 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 22 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 13 ||
					totalJSON[0].systemNotesCalendarWeek[k].statuses[i].id == 66
				) {
					totalCompleted +=
						totalJSON[0].systemNotesCalendarWeek[k].statuses[i].count;
				}
			}
			totalRemaining = totalLeads - totalCompleted;
			remainingPercentage = (totalRemaining / totalLeads) * 100;

			signedConversionPercentage = (totalSignedCustomrs / totalLeads) * 100;

			leadToOpportunityPercentage = (totalLeadToOpportunity / totalLeads) * 100;

			totalExcludedPercentage = (totalNoAnswer / totalLeads) * 100;

			mainDataSet.push([
				convertToDateInputFormat(statusActivityWeek),
				totalLeads,
				hotLeads,
				totalSignedCustomrs,
				totalNoAnswer,
				totalExcludedPercentage.toFixed(0),
				totalPipeLine,
				totalFreeTrial,
				totalFreeTrialPending,
				leadToOpportunityPercentage.toFixed(0),
				signedConversionPercentage.toFixed(0),
				totalCompleted,
				totalRemaining,
				remainingPercentage.toFixed(0),
			]);
		}

		var dataTableWebsiteLeads = $("#websiteLeads").DataTable({
			data: mainDataSet,
			fixedHeader: true,
			responsive: true,
			scrollCollapse: true,
			pageLength: 250,
			order: [[0, "asc"]],
			layout: {
				topStart: {
					buttons: [
						{
							extend: "copy",
							text: "Copy",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "csv",
							text: "CSV",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "excel",
							text: "Excel",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "pdf",
							text: "PDF",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "print",
							text: "Print",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
					],
				},
			},
			columns: [
				{ title: "STATUS ACTIVITY - WEEK" },
				{ title: "Total Lead Count" },
				{ title: "Hot Leads" },
				{ title: "Total Signed Customers" },
				{ title: "Total No Answer & Out of Territory" },
				{ title: "Total Excluded %" },
				{ title: "Prospect Pipeline (including Trials)" },
				{ title: "Total Free Trial" },
				{ title: "Total Free Trial Pending" },
				{ title: "Lead to Opportunity %" },
				{ title: "Signed Conversion %" },
				{ title: "Total Completed" },
				{ title: "Total Remaining" },
				{ title: "Remaining %" },
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [0, 2, 3, 10],
					className: "bolded",
				},
			],
			rowCallback: function (row, data, index) {
				$(row).find("td:eq(0)").css("background-color", "#8E9AC9FF");
				$(row).find("td:eq(2)").css("background-color", "#E9B775");
				$(row).find("td:eq(3)").css("background-color", "#54bf9d");
				$(row).find("td:eq(10)").css("background-color", "#54bf9d");
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;
				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\$,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				// Total Expected Usage over all pages
				total_leads = api
					.column(1)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_total_leads = api
					.column(1, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Total Expected Usage over all pages
				hot_leads = api
					.column(2)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_hot_leads = api
					.column(2, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				signed_leads = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_signed_leads = api
					.column(3, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				no_answer_leads = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_no_answer_leads = api
					.column(4, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				pipeline_leads = api
					.column(6)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_pipeline_leads = api
					.column(6, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				free_trial_leads = api
					.column(7)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_free_trial_leads = api
					.column(7, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				free_trial_pending_leads = api
					.column(8)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_free_trial_pending_leads = api
					.column(8, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_completed_leads = api
					.column(11)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_total_completed_leads = api
					.column(11, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_remaining_leads = api
					.column(12)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_total_remaining_leads = api
					.column(12, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(1).footer()).html(page_total_leads);
				$(api.column(2).footer()).html(page_hot_leads);
				$(api.column(3).footer()).html(page_signed_leads);
				$(api.column(4).footer()).html(page_no_answer_leads);
				$(api.column(6).footer()).html(page_pipeline_leads);
				$(api.column(7).footer()).html(page_free_trial_leads);
				$(api.column(8).footer()).html(page_free_trial_pending_leads);
				$(api.column(11).footer()).html(page_total_completed_leads);
				$(api.column(12).footer()).html(page_total_remaining_leads);
			},
		});

		var salesRepLeadsDataSet = [];
		var childSalesRepLeadsDataSet = [];

		for (var k = 0; k < salesRepJSON.length; k++) {
			childSalesRepLeadsDataSet = [];
			var salesRepName = salesRepJSON[k].name;

			var totalLeads = salesRepJSON[k].count;
			var hotLeads = 0;
			var totalSignedCustomrs = 0;
			var totalNoAnswer = 0;
			var totalExcludedPercentage = 0.0;
			var totalPipeLine = 0;
			var totalLeadToOpportunity = 0;
			var leadToOpportunityPercentage = 0.0;
			var signedConversionPercentage = 0.0;
			var totalCompleted = 0;
			var totalRemaining = 0;
			var remainingPercentage = 0.0;
			var totalFreeTrialPending = 0;
			var totalFreeTrial = 0;

			for (var i = 0; i < salesRepJSON[k].statuses.length; i++) {
				//Status: Customer - Signed
				if (
					salesRepJSON[k].statuses[i].id == 13 ||
					salesRepJSON[k].statuses[i].id == 66
				) {
					totalSignedCustomrs += salesRepJSON[k].statuses[i].count;
				}

				//Status: Suspect - Hot Lead
				if (salesRepJSON[k].statuses[i].id == 57) {
					hotLeads += salesRepJSON[k].statuses[i].count;
				}

				//Status: Suspect - No Answer or Suspect - Out of Territory
				if (
					salesRepJSON[k].statuses[i].id == 20 ||
					salesRepJSON[k].statuses[i].id == 64
				) {
					totalNoAnswer += salesRepJSON[k].statuses[i].count;
				}

				//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial
				if (
					salesRepJSON[k].statuses[i].id == 72 ||
					salesRepJSON[k].statuses[i].id == 58 ||
					salesRepJSON[k].statuses[i].id == 50 ||
					salesRepJSON[k].statuses[i].id == 70 ||
					salesRepJSON[k].statuses[i].id == 32 ||
					salesRepJSON[k].statuses[i].id == 71
				) {
					totalPipeLine += salesRepJSON[k].statuses[i].count;
				}

				//Status: Customer - Free Trial Pending
				if (salesRepJSON[k].statuses[i].id == 71) {
					totalFreeTrialPending += salesRepJSON[k].statuses[i].count;
				}

				//Status: Customer - Free Trial Pending
				if (salesRepJSON[k].statuses[i].id == 32) {
					totalFreeTrial += salesRepJSON[k].statuses[i].count;
				}

				//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial or Customer - Signed or Customer - To Be Finalised
				if (
					salesRepJSON[k].statuses[i].id == 72 ||
					salesRepJSON[k].statuses[i].id == 58 ||
					salesRepJSON[k].statuses[i].id == 50 ||
					salesRepJSON[k].statuses[i].id == 70 ||
					salesRepJSON[k].statuses[i].id == 32 ||
					salesRepJSON[k].statuses[i].id == 71 ||
					salesRepJSON[k].statuses[i].id == 13 ||
					salesRepJSON[k].statuses[i].id == 66
				) {
					totalLeadToOpportunity += salesRepJSON[k].statuses[i].count;
				}

				//Status: Suspect - No Answer or Suspect - Parking Lot or Suspect - Lost or Suspect - Out of Territory or Suspect - Customer - Lost or Customer - Signed
				if (
					salesRepJSON[k].statuses[i].id == 20 ||
					salesRepJSON[k].statuses[i].id == 62 ||
					salesRepJSON[k].statuses[i].id == 59 ||
					salesRepJSON[k].statuses[i].id == 64 ||
					salesRepJSON[k].statuses[i].id == 22 ||
					salesRepJSON[k].statuses[i].id == 13 ||
					salesRepJSON[k].statuses[i].id == 66
				) {
					totalCompleted += salesRepJSON[k].statuses[i].count;
				}
			}
			totalRemaining = totalLeads - totalCompleted;
			remainingPercentage = (totalRemaining / totalLeads) * 100;

			signedConversionPercentage = (totalSignedCustomrs / totalLeads) * 100;

			leadToOpportunityPercentage = (totalLeadToOpportunity / totalLeads) * 100;

			totalExcludedPercentage = (totalNoAnswer / totalLeads) * 100;

			for (var p = 0; p < salesRepJSON[k].systemNotesCalendarWeek.length; p++) {
				var statusActivityWeek =
					salesRepJSON[k].systemNotesCalendarWeek[p].date;

				var totalLeadsBySalesRep =
					salesRepJSON[k].systemNotesCalendarWeek[p].count;
				var hotLeadsBySalesRep = 0;
				var totalSignedCustomrsBySalesRep = 0;
				var totalNoAnswerBySalesRep = 0;
				var totalExcludedPercentageBySalesRep = 0.0;
				var totalPipeLineBySalesRep = 0;
				var totalLeadToOpportunityBySalesRep = 0;
				var leadToOpportunityPercentageBySalesRep = 0.0;
				var signedConversionPercentageBySalesRep = 0.0;
				var totalCompletedBySalesRep = 0;
				var totalRemainingBySalesRep = 0;
				var remainingPercentageBySalesRep = 0.0;
				var totalFreeTrialPendingBySalesRep = 0;
				var totalFreeTrialBySalesRep = 0;

				for (
					var i = 0;
					i < salesRepJSON[k].systemNotesCalendarWeek[p].statuses.length;
					i++
				) {
					//Status: Customer - Signed
					if (
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 13 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 66
					) {
						totalSignedCustomrsBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Suspect - Hot Lead
					if (salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 57) {
						hotLeadsBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Suspect - No Answer or Suspect - Out of Territory
					if (
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 20 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 64
					) {
						totalNoAnswerBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial
					if (
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 72 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 58 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 50 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 70 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 32 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 71
					) {
						totalPipeLineBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Customer - Free Trial Pending
					if (salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 71) {
						totalFreeTrialPendingBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Customer - Free Trial Pending
					if (salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 32) {
						totalFreeTrialBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial or Customer - Signed or Customer - To Be Finalised
					if (
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 72 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 58 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 50 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 70 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 32 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 71 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 13 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 66
					) {
						totalLeadToOpportunityBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}

					//Status: Suspect - No Answer or Suspect - Parking Lot or Suspect - Lost or Suspect - Out of Territory or Suspect - Customer - Lost or Customer - Signed
					if (
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 20 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 62 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 59 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 64 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 22 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 13 ||
						salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].id == 66
					) {
						totalCompletedBySalesRep +=
							salesRepJSON[k].systemNotesCalendarWeek[p].statuses[i].count;
					}
				}
				totalRemainingBySalesRep =
					totalLeadsBySalesRep - totalCompletedBySalesRep;
				remainingPercentageBySalesRep =
					(totalRemainingBySalesRep / totalLeadsBySalesRep) * 100;

				signedConversionPercentageBySalesRep =
					(totalSignedCustomrsBySalesRep / totalLeadsBySalesRep) * 100;

				leadToOpportunityPercentageBySalesRep =
					(totalLeadToOpportunityBySalesRep / totalLeadsBySalesRep) * 100;

				totalExcludedPercentageBySalesRep =
					(totalNoAnswerBySalesRep / totalLeadsBySalesRep) * 100;

				childSalesRepLeadsDataSet.push({
					statusActivityWeek: convertToDateInputFormat(statusActivityWeek),
					totalLeadsBySalesRep: totalLeadsBySalesRep,
					hotLeadsBySalesRep: hotLeadsBySalesRep,
					totalSignedCustomrsBySalesRep: totalSignedCustomrsBySalesRep,
					totalNoAnswerBySalesRep: totalNoAnswerBySalesRep,
					totalExcludedPercentageBySalesRep:
						totalExcludedPercentageBySalesRep.toFixed(0),
					totalPipeLineBySalesRep: totalPipeLineBySalesRep,
					totalFreeTrialBySalesRep: totalFreeTrialBySalesRep,
					totalFreeTrialPendingBySalesRep: totalFreeTrialPendingBySalesRep,
					leadToOpportunityPercentageBySalesRep:
						leadToOpportunityPercentageBySalesRep.toFixed(0),
					signedConversionPercentageBySalesRep:
						signedConversionPercentageBySalesRep.toFixed(0),
					totalCompletedBySalesRep: totalCompletedBySalesRep,
					totalRemainingBySalesRep: totalRemainingBySalesRep,
					remainingPercentageBySalesRep:
						remainingPercentageBySalesRep.toFixed(0),
				});
			}

			salesRepLeadsDataSet.push([
				"",
				salesRepName,
				totalLeads,
				hotLeads,
				totalSignedCustomrs,
				totalNoAnswer,
				totalExcludedPercentage.toFixed(0),
				totalPipeLine,
				totalFreeTrial,
				totalFreeTrialPending,
				leadToOpportunityPercentage.toFixed(0),
				signedConversionPercentage.toFixed(0),
				totalCompleted,
				totalRemaining,
				remainingPercentage.toFixed(0),
				childSalesRepLeadsDataSet,
			]);
		}

		console.log("salesRepLeadsDataSet", JSON.stringify(salesRepLeadsDataSet));

		var dataTableSalesRepLeads = $("#salesRepLeads").DataTable({
			data: salesRepLeadsDataSet,
			fixedHeader: true,
			responsive: true,
			scrollCollapse: true,
			pageLength: 250,
			order: [[1, "asc"]],
			layout: {
				topStart: {
					buttons: [
						{
							extend: "copy",
							text: "Copy",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "csv",
							text: "CSV",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "excel",
							text: "Excel",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "pdf",
							text: "PDF",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "print",
							text: "Print",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
					],
				},
			},
			columns: [
				{
					title: "Expand",
					className: "details-control",
					orderable: false,
					data: null,
					defaultContent: "",
				}, //0
				{ title: "SALES REP" }, //1
				{ title: "Total Lead Count" }, //2
				{ title: "Hot Leads" }, //3
				{ title: "Total Signed Customers" }, //4
				{ title: "Total No Answer & Out of Territory" }, //5
				{ title: "Total Excluded %" }, //6
				{ title: "Prospect Pipeline (including Trials)" }, //7
				{ title: "Total Free Trial" }, //8
				{ title: "Total Free Trial Pending" }, //9
				{ title: "Lead to Opportunity %" }, //10
				{ title: "Signed Conversion %" }, //11
				{ title: "Total Completed" }, //12
				{ title: "Total Remaining" }, //13
				{ title: "Remaining %" }, //14
				{ title: "Child" }, //15
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [1, 3, 4, 11],
					className: "bolded",
				},
				{
					targets: [15],
					visible: false,
				},
			],
			rowCallback: function (row, data, index) {
				$(row).find("td:eq(1)").css("background-color", "#8E9AC9FF");
				$(row).find("td:eq(3)").css("background-color", "#E9B775");
				$(row).find("td:eq(4)").css("background-color", "#54bf9d");
				$(row).find("td:eq(11)").css("background-color", "#54bf9d");
			},
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;
				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === "string"
						? i.replace(/[\$,]/g, "") * 1
						: typeof i === "number"
						? i
						: 0;
				};

				// Total Expected Usage over all pages
				total_leads = api
					.column(2)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_total_leads = api
					.column(2, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Total Expected Usage over all pages
				hot_leads = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_hot_leads = api
					.column(3, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				signed_leads = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_signed_leads = api
					.column(4, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				no_answer_leads = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_no_answer_leads = api
					.column(5, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				pipeline_leads = api
					.column(7)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_pipeline_leads = api
					.column(7, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				free_trial_leads = api
					.column(8)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_free_trial_leads = api
					.column(8, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				free_trial_pending_leads = api
					.column(9)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_free_trial_pending_leads = api
					.column(9, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_completed_leads = api
					.column(12)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_total_completed_leads = api
					.column(12, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_remaining_leads = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				// Page Total Expected Usage over this page
				page_total_remaining_leads = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(2).footer()).html(page_total_leads);
				$(api.column(3).footer()).html(page_hot_leads);
				$(api.column(4).footer()).html(page_signed_leads);
				$(api.column(5).footer()).html(page_no_answer_leads);
				$(api.column(7).footer()).html(page_pipeline_leads);
				$(api.column(8).footer()).html(page_free_trial_leads);
				$(api.column(9).footer()).html(page_free_trial_pending_leads);
				$(api.column(12).footer()).html(page_total_completed_leads);
				$(api.column(13).footer()).html(page_total_remaining_leads);
			},
		});

		dataTableSalesRepLeads.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildRowBySalesRep(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#salesRepLeads tbody").on("click", "td.details-control", function () {
			var tr = $(this).closest("tr");
			var row = dataTableSalesRepLeads.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				destroyChild(row);
				tr.removeClass("shown");
				tr.removeClass("parent");

				$(".expand-button").addClass("btn-primary");
				$(".expand-button").removeClass("btn-light");
			} else {
				// Open this row
				row.child.show();
				tr.addClass("shown");
				tr.addClass("parent");

				$(".expand-button").removeClass("btn-primary");
				$(".expand-button").addClass("btn-light");
			}
		});
	}

	function createChildRowBySalesRep(row) {
		var table = $('<table class="display" width=""/>');
		var childSet = [];

		console.log("customer free trial child row: " + row.data()[15]);

		row.data()[15].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				var invoiceURL = "";
				childSet.push([
					el.statusActivityWeek,
					el.totalLeadsBySalesRep,
					el.hotLeadsBySalesRep,
					el.totalSignedCustomrsBySalesRep,
					el.totalNoAnswerBySalesRep,
					el.totalExcludedPercentageBySalesRep,
					el.totalPipeLineBySalesRep,
					el.totalFreeTrialBySalesRep,
					el.totalFreeTrialPendingBySalesRep,
					el.leadToOpportunityPercentageBySalesRep,
					el.signedConversionPercentageBySalesRep,
					el.totalCompletedBySalesRep,
					el.totalRemainingBySalesRep,
					el.remainingPercentageBySalesRep,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: true,
			bLengthChange: false,
			bFilter: false,
			bInfo: true,
			bAutoWidth: true,
			data: childSet,
			order: [0, "asc"],
			layout: {
				topStart: {
					buttons: [
						{
							extend: "copy",
							text: "Copy",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "csv",
							text: "CSV",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "excel",
							text: "Excel",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "pdf",
							text: "PDF",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "print",
							text: "Print",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
					],
				},
			},
			columns: [
				{ title: "STATUS ACTIVITY - WEEK" },
				{ title: "Total Lead Count" },
				{ title: "Hot Leads" },
				{ title: "Total Signed Customers" },
				{ title: "Total No Answer & Out of Territory" },
				{ title: "Total Excluded %" },
				{ title: "Prospect Pipeline (including Trials)" },
				{ title: "Total Free Trial" },
				{ title: "Total Free Trial Pending" },
				{ title: "Lead to Opportunity %" },
				{ title: "Signed Conversion %" },
				{ title: "Total Completed" },
				{ title: "Total Remaining" },
				{ title: "Remaining %" },
			],
			columnDefs: [
				{
					targets: [0, 2, 3, 10],
					className: "bolded",
				},
			],
			rowCallback: function (row, data) {
				$(row).find("td:eq(0)").css("background-color", "#8E9AC9FF");
				$(row).find("td:eq(2)").css("background-color", "#E9B775");
				$(row).find("td:eq(3)").css("background-color", "#54bf9d");
				$(row).find("td:eq(10)").css("background-color", "#54bf9d");
			},
		});
	}

	function destroyChild(row) {
		// And then hide the row
		row.child.hide();
	}

	function plotChartWeeklyTotalLeads(
		series_data_weekly_leads_inboundLeads,
		series_data_weekly_leads_zeeLeads,
		series_data_weekly_leads_bauLeads,
		series_data_weekly_leads_bauStatusChangeLeads,
		// series_data_weekly_leads_signedUpLeads,
		// series_data_weekly_leads_commencedLeads,
		// series_data_weekly_leads_lostLeads,
		categores
	) {
		// console.log(series_data)

		Highcharts.chart("container_weekly_leads_preview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				// crosshair: true,
				// pointPadding: 0,
				// groupPadding: 0.1,
				style: {
					fontWeight: "bold",
					color: "#0B2447",
				},
				labels: {
					distance: 8,
					style: {
						fontWeight: "bold",
						fontSize: "10px",
						color: "#0B2447",
					},
				},
			},
			yAxis: {
				min: 0,
				title: {
					text: "Total Lead Count",
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						fontSize: "10px",
						color: "#0B2447",
					},
				},
				labels: {
					enabled: true,
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>Week Ending: {point.x}</b><br/>",
				pointFormat: "{series.name}: {point.y}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					groupPadding: 0,
					borderWidth: 0,
					dataLabels: {
						enabled: true,
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "#ffffff",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0,
					groupPadding: 0.5,
				},
			},
			series: [
				{
					name: "Total Leads",
					data: series_data_weekly_leads_inboundLeads,
					color: "#436F9AFF",
				},
				{
					name: "BAU Status Change Leads Actitvity",
					data: series_data_weekly_leads_zeeLeads,
					color: "#46A4ECFF",
				},
				{
					name: "Total Signed Up/Commenced Leads",
					data: series_data_weekly_leads_bauLeads,
					color: "#7EDC77FF",
				},
				{
					name: "Lost Customers",
					data: series_data_weekly_leads_bauStatusChangeLeads,
					color: "#E28787FF",
				},
			],
			// series: [
			// 	{
			// 		name: "Inbound Leads",
			// 		data: series_data_weekly_leads_inboundLeads,
			// 		color: "#436F9AFF",
			// 		stack: 1,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// 	{
			// 		name: "Franchisee Leads",
			// 		data: series_data_weekly_leads_zeeLeads,
			// 		color: "#43539AFF",
			// 		stack: 1,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// 	{
			// 		name: "BAU Leads",
			// 		data: series_data_weekly_leads_bauLeads,
			// 		color: "#9A4396FF",
			// 		stack: 1,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// 	{
			// 		name: "BAU Status Change Leads Actitvity",
			// 		data: series_data_weekly_leads_bauStatusChangeLeads,
			// 		color: "#43849AFF",
			// 		stack: 2,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// 	{
			// 		name: "Signed Up Leads",
			// 		data: series_data_weekly_leads_signedUpLeads,
			// 		color: "#9A7A43FF",
			// 		stack: 3,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// 	{
			// 		name: "Commenced Leads",
			// 		data: series_data_weekly_leads_commencedLeads,
			// 		color: "#439A97",
			// 		stack: 3,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// 	{
			// 		name: "Lost Customers",
			// 		data: series_data_weekly_leads_lostLeads,
			// 		color: "#E28787FF",
			// 		stack: 4,
			// 		style: {
			// 			fontWeight: "bold",
			// 		},
			// 	},
			// ],
		});
	}

	function plotChartInboundLeadsLeads(
		series_data_inbound_leads_totalCount,
		series_data_inbound_leads_hotLeads,
		series_data_inbound_leads_signedLeads,
		series_data_inbound_leads_noAnswerLeads,
		series_data_inbound_leads_totalExcludedPercent,
		series_data_inbound_leads_pipelineLeads,
		series_data_inbound_leads_leadToOpportunity,
		series_data_inbound_leads_signedConversionPercent,
		series_data_inbound_leads_totalCompleted,
		series_data_inbound_leads_totalRemaining,
		series_data_inbound_leads_remainingPercent,
		categores,
		container_name,
		category
	) {
		Highcharts.chart(container_name, {
			chart: {
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				style: {
					fontWeight: "bold",
				},
				labels: {
					style: {
						fontWeight: "bold",
						fontSize: "10px",
					},
				},
			},
			yAxis: {
				title: {
					text: "Lead Count",
				},
			},
			tooltip: {
				crosshairs: true,
				shared: true,
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true,
					},
					enableMouseTracking: false,
				},
			},
			series: [
				{
					name: category + " - Total Leads",
					data: series_data_inbound_leads_totalCount,
				},
				{
					name: category + " - Hot Leads",
					color: "#E9B775",
					style: {
						fontWeight: "bold",
					},
					data: series_data_inbound_leads_hotLeads,
				},
				{
					name: category + " - Signed Customers",
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
					data: series_data_inbound_leads_signedLeads,
				},
				{
					name: category + " - No Answer & Out of Territory",
					color: "#E28787FF",
					style: {
						fontWeight: "bold",
					},
					data: series_data_inbound_leads_noAnswerLeads,
				},
				{
					name: category + " - Pipeline Leads",
					data: series_data_inbound_leads_pipelineLeads,
				},
				{
					name: category + " - Total Completed",
					data: series_data_inbound_leads_totalCompleted,
				},
				{
					name: category + " - Total Remaining",
					data: series_data_inbound_leads_totalRemaining,
				},
			],
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500,
						},
						chartOptions: {
							legend: {
								layout: "horizontal",
								align: "center",
								verticalAlign: "bottom",
							},
						},
					},
				],
			},
		});
	}

	function plotChartBAULeads(
		series_data_inbound_leads_totalCount,
		series_data_inbound_leads_hotLeads,
		series_data_inbound_leads_signedLeads,
		series_data_inbound_leads_noAnswerLeads,
		series_data_inbound_leads_totalExcludedPercent,
		series_data_inbound_leads_pipelineLeads,
		series_data_inbound_leads_freeTrialLeads,
		series_data_inbound_leads_freeTrialPendingLeads,
		series_data_inbound_leads_leadToOpportunity,
		series_data_inbound_leads_signedConversionPercent,
		series_data_inbound_leads_totalCompleted,
		series_data_inbound_leads_totalRemaining,
		series_data_inbound_leads_remainingPercent,
		categores,
		container_name,
		category
	) {
		Highcharts.chart(container_name, {
			chart: {
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				style: {
					fontWeight: "bold",
				},
				labels: {
					style: {
						fontWeight: "bold",
						fontSize: "10px",
					},
				},
			},
			yAxis: {
				title: {
					text: "Lead Count",
				},
			},
			tooltip: {
				headerFormat: "Distance: {point.x:.1f} km<br>",
				pointFormat: "{point.y} m a. s. l.",
				shared: true,
			},
			tooltip: {
				crosshairs: true,
				shared: true,
			},
			plotOptions: {
				line: {
					dataLabels: {
						enabled: true,
					},
					enableMouseTracking: false,
				},
			},
			series: [
				{
					name: category + " - Total Leads",
					data: series_data_inbound_leads_totalCount,
				},
				{
					name: category + " - New Leads",
					color: "#E9B775",
					style: {
						fontWeight: "bold",
					},
					data: series_data_inbound_leads_hotLeads,
				},
				{
					name: category + " - Signed Customers",
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
					data: series_data_inbound_leads_signedLeads,
				},
				{
					name: category + " - No Answer & Out of Territory",
					color: "#E28787FF",
					style: {
						fontWeight: "bold",
					},
					data: series_data_inbound_leads_noAnswerLeads,
				},
				{
					name: category + " - Pipeline Leads",
					data: series_data_inbound_leads_pipelineLeads,
				},
				{
					name: category + " - Free Trial Leads",
					data: series_data_inbound_leads_freeTrialLeads,
				},
				{
					name: category + " - Free Trial Pending Leads",
					data: series_data_inbound_leads_freeTrialPendingLeads,
				},
				{
					name: category + " - Total Completed",
					data: series_data_inbound_leads_totalCompleted,
				},
				{
					name: category + " - Total Remaining",
					data: series_data_inbound_leads_totalRemaining,
				},
			],
			responsive: {
				rules: [
					{
						condition: {
							maxWidth: 500,
						},
						chartOptions: {
							legend: {
								layout: "horizontal",
								align: "center",
								verticalAlign: "bottom",
							},
						},
					},
				],
			},
		});
	}

	/**
	 * @description Converts a date from "M/D/YYYY" format to "YYYY-DD-MM" format.
	 * @param {String} date_mdyyyy - The date string in "D/M/YYYY" format.
	 * @returns {String} The date string in "YYYY-DD-MM" format.
	 */
	function convertToDateInputFormat(date_mdyyyy) {
		// Split the input date string into components
		const [day, month, year] = date_mdyyyy.split("/");

		// Format the date to "YYYY-MM-DD"
		const formattedDate =
			year +
			"-" +
			customPadStart(month, 2, "0") +
			"-" +
			customPadStart(day, 2, "0");

		return formattedDate;
	}
	/**
	 * @description Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length. The padding is applied from the start (left) of the current string.
	 * @param {string} str - The original string to pad.
	 * @param {number} targetLength - The length of the resulting string once the current string has been padded.
	 * @param {string} padString - The string to pad the current string with. Defaults to a space if not provided.
	 * @returns {string} The padded string.
	 */
	function customPadStart(str, targetLength, padString) {
		// Convert the input to a string
		str = String(str);

		// If the target length is less than or equal to the string's length, return the original string
		if (str.length >= targetLength) {
			return str;
		}

		// Calculate the length of the padding needed
		var paddingLength = targetLength - str.length;

		// Repeat the padString enough times to cover the padding length
		var repeatedPadString = customRepeat(
			padString,
			Math.ceil(paddingLength / padString.length)
		);

		// Slice the repeated padString to the exact padding length needed and concatenate with the original string
		return repeatedPadString.slice(0, paddingLength) + str;
	}

	/**
	 * @description Repeats the given string a specified number of times.
	 * @param {string} str - The string to repeat.
	 * @param {number} count - The number of times to repeat the string.
	 * @returns {string} The repeated string.
	 */
	function customRepeat(str, count) {
		// Convert the input to a string
		str = String(str);

		// If the count is 0 or less, return an empty string
		if (count <= 0) {
			return "";
		}

		// Initialize the result string
		var result = "";

		// Repeat the string by concatenating it to the result
		for (var i = 0; i < count; i++) {
			result += str;
		}

		return result;
	}

	/**
	 * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
	 * @param   {String} date_iso       "2020-06-01"
	 * @returns {String} date_netsuite  "1/6/2020"
	 */
	function dateISOToNetsuite(date_iso) {
		var date_netsuite = "";
		if (!isNullorEmpty(date_iso)) {
			var date_utc = new Date(date_iso);
			// var date_netsuite = nlapiDateToString(date_utc);
			var date_netsuite = format.format({
				value: date_utc,
				type: format.Type.DATE,
			});
		}
		return date_netsuite;
	}

	function isNullorEmpty(val) {
		if (
			val == "" ||
			val == null ||
			val == "- None -" ||
			val == 0 ||
			val == "0"
		) {
			return true;
		} else {
			return false;
		}
	}

	function convertTo24Hour(time) {
		// nlapiLogExecution('DEBUG', 'time', time);
		var hours = parseInt(time.substr(0, 2));
		if (time.indexOf("AM") != -1 && hours == 12) {
			time = time.replace("12", "0");
		}
		if (time.indexOf("AM") != -1 && hours < 10) {
			time = time.replace(hours, "0" + hours);
		}
		if (time.indexOf("PM") != -1 && hours < 12) {
			time = time.replace(hours, hours + 12);
		}
		return time.replace(/( AM| PM)/, "");
	}

	function saveRecord() {
		return true;
	}
	return {
		pageInit: pageInit,
		saveRecord: saveRecord,
	};
});
