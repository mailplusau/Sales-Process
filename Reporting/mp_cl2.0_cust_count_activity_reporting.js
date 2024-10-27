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
			var date_range = $("#date_range").val();
			console.log("date_range", date_range);
			var url =
				"https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1939&deploy=1&date_range=" +
				date_range;

			window.location.href = url;
		});

		$("#clearFilter").click(function () {
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1939&deploy=1";

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
							}
						}
						if (newSalesRep == true) {
							salesRepJSON.push({
								id: systemNotesSetBy,
								name: systemNotesSetByText,
								count: 1,
								statuses: [],
								salesRecordInternalIDs: [],
							});
							salesRepJSON[salesRepJSON.length - 1].statuses.push({
								id: customerStatusId,
								name: customerStatus,
								count: 1,
							});

							salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
								lastSalesRecordInternalId
							);
						}
					} else {
						salesRepJSON.push({
							id: systemNotesSetBy,
							name: systemNotesSetByText,
							count: 1,
							statuses: [],
							salesRecordInternalIDs: [],
						});
						salesRepJSON[salesRepJSON.length - 1].statuses.push({
							id: customerStatusId,
							name: customerStatus,
							count: 1,
						});
						salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
							lastSalesRecordInternalId
						);
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
											salesRep: salesRepJSON,
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
									salesRep: salesRepJSON,
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
							salesRep: salesRepJSON,
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
							}
						}
						if (newSalesRep == true) {
							salesRepJSON.push({
								id: systemNotesSetBy,
								name: systemNotesSetByText,
								count: 1,
								statuses: [],
								salesRecordInternalIDs: [],
							});
							salesRepJSON[salesRepJSON.length - 1].statuses.push({
								id: customerStatusId,
								name: customerStatus,
								count: 1,
							});

							salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
								lastSalesRecordInternalId
							);
						}
					} else {
						salesRepJSON.push({
							id: systemNotesSetBy,
							name: systemNotesSetByText,
							count: 1,
							statuses: [],
							salesRecordInternalIDs: [],
						});
						salesRepJSON[salesRepJSON.length - 1].statuses.push({
							id: customerStatusId,
							name: customerStatus,
							count: 1,
						});
						salesRepJSON[salesRepJSON.length - 1].salesRecordInternalIDs.push(
							lastSalesRecordInternalId
						);
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
									salesRep: salesRepJSON,
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
							salesRep: salesRepJSON,
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
					salesRep: salesRepJSON,
				});
			}
		}

		console.log("Final");
		console.log("totalJSON", JSON.stringify(totalJSON));
		console.log("salesRepJSON", JSON.stringify(salesRepJSON));

		var mainDataSet = [];

		for (var k = 0; k < totalJSON[0].systemNotesCalendarWeek.length; k++) {}

		// for (
		// 	var k = 0;
		// 	k < totalJSON[0].systemNotesCalendarWeek[0].type.length;
		// 	k++
		// ) {
		// 	var totalLeads = totalJSON[0].count;
		// 	var hotLeads = 0;
		// 	var totalSignedCustomrs = 0;
		// 	var totalNoAnswer = 0;
		// 	var totalExcludedPercentage = 0.0;
		// 	var totalPipeLine = 0;
		// 	var totalLeadToOpportunity = 0;
		// 	var leadToOpportunityPercentage = 0.0;
		// 	var signedConversionPercentage = 0.0;
		// 	var totalCompleted = 0;
		// 	var totalRemaining = 0;
		// 	var remainingPercentage = 0.0;
		// 	var totalFreeTrialPending = 0;
		// 	var totalFreeTrial = 0;
		// 	for (var i = 0; i < totalJSON[0].statuses[0].type.length; i++) {
		// 		//Status: Customer - Signed
		// 		if (
		// 			totalJSON[0].statuses[0].type[i].id == 13 ||
		// 			totalJSON[0].statuses[0].type[i].id == 66
		// 		) {
		// 			totalSignedCustomrs += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Suspect - Hot Lead
		// 		if (totalJSON[0].statuses[0].type[i].id == 57) {
		// 			hotLeads += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Suspect - No Answer or Suspect - Out of Territory
		// 		if (
		// 			totalJSON[0].statuses[0].type[i].id == 20 ||
		// 			totalJSON[0].statuses[0].type[i].id == 64
		// 		) {
		// 			totalNoAnswer += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial
		// 		if (
		// 			totalJSON[0].statuses[0].type[i].id == 72 ||
		// 			totalJSON[0].statuses[0].type[i].id == 58 ||
		// 			totalJSON[0].statuses[0].type[i].id == 50 ||
		// 			totalJSON[0].statuses[0].type[i].id == 70 ||
		// 			totalJSON[0].statuses[0].type[i].id == 32 ||
		// 			totalJSON[0].statuses[0].type[i].id == 71
		// 		) {
		// 			totalPipeLine += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Customer - Free Trial Pending
		// 		if (totalJSON[0].statuses[0].type[i].id == 71) {
		// 			totalFreeTrialPending += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Customer - Free Trial Pending
		// 		if (totalJSON[0].statuses[0].type[i].id == 32) {
		// 			totalFreeTrial += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Prospect - Opportunity or Prospect - Qualified or Prospect - Box Sent or Prospect - Quote Sent or Customer - Free Trial Pending or Customer - Free Trial or Customer - Signed or Customer - To Be Finalised
		// 		if (
		// 			totalJSON[0].statuses[0].type[i].id == 72 ||
		// 			totalJSON[0].statuses[0].type[i].id == 58 ||
		// 			totalJSON[0].statuses[0].type[i].id == 50 ||
		// 			totalJSON[0].statuses[0].type[i].id == 70 ||
		// 			totalJSON[0].statuses[0].type[i].id == 32 ||
		// 			totalJSON[0].statuses[0].type[i].id == 71 ||
		// 			totalJSON[0].statuses[0].type[i].id == 13 ||
		// 			totalJSON[0].statuses[0].type[i].id == 66
		// 		) {
		// 			totalLeadToOpportunity += totalJSON[0].statuses[0].type[i].count;
		// 		}

		// 		//Status: Suspect - No Answer or Suspect - Parking Lot or Suspect - Lost or Suspect - Out of Territory or Suspect - Customer - Lost or Customer - Signed
		// 		if (
		// 			totalJSON[0].statuses[0].type[i].id == 20 ||
		// 			totalJSON[0].statuses[0].type[i].id == 62 ||
		// 			totalJSON[0].statuses[0].type[i].id == 59 ||
		// 			totalJSON[0].statuses[0].type[i].id == 64 ||
		// 			totalJSON[0].statuses[0].type[i].id == 22 ||
		// 			totalJSON[0].statuses[0].type[i].id == 13 ||
		// 			totalJSON[0].statuses[0].type[i].id == 66
		// 		) {
		// 			totalCompleted += totalJSON[0].statuses[0].type[i].count;
		// 		}
		// 	}
		// 	totalRemaining = totalLeads - totalCompleted;
		// 	remainingPercentage = (totalRemaining / totalLeads) * 100;

		// 	signedConversionPercentage = (totalSignedCustomrs / totalLeads) * 100;

		// 	leadToOpportunityPercentage = (totalLeadToOpportunity / totalLeads) * 100;

		// 	totalExcludedPercentage = (totalNoAnswer / totalLeads) * 100;

		// 	mainDataSet.push([totalJSON[0].systemNotesCalendarWeek[0].type[k].date]);
		// }

		var dataTableWebsiteLeads = $("#websiteLeads").DataTable({
			data: mainDataSet,
			fixedHeader: true,
			responsive: true,
			scrollCollapse: true,
			pageLength: 250,
			order: [],
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
					targets: [0, 2, 3, 8],
					className: "bolded",
				},
			],
			rowCallback: function (row, data, index) {
				$(row).find("td:eq(0)").css("background-color", "#8E9AC9FF");
				$(row).find("td:eq(2)").css("background-color", "#E9B775");
				$(row).find("td:eq(3)").css("background-color", "#54bf9d");
				$(row).find("td:eq(8)").css("background-color", "#54bf9d");
			},
			footerCallback: function (row, data, start, end, display) {},
		});
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
