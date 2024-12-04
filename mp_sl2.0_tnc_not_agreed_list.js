/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Mon Dec 02 2024
 * Modified on:          Mon Dec 02 2024 13:18:07
 * SuiteScript Version:  2.0 
 * Description:          Page that displays a list of customers that have not accepted the T&C's
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */

define([
	"SuiteScripts/jQuery Plugins/Moment JS/moment.min",
	"N/ui/serverWidget",
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/https",
	"N/log",
	"N/redirect",
	"N/url",
	"N/format",
], function (
	moment,
	ui,
	email,
	runtime,
	search,
	record,
	https,
	log,
	redirect,
	url,
	format
) {
	var role = 0;
	var userId = 0;
	var zee = 0;

	var customerListTNCNotAcceptedTableHTML = "";
	var customerListTNCNotAcceptedTaskSetupTableHTML = "";

	function onRequest(context) {
		var baseURL = "https://system.na2.netsuite.com";
		if (runtime.EnvType == "SANDBOX") {
			baseURL = "https://system.sandbox.netsuite.com";
		}
		userId = runtime.getCurrentUser().id;
		pageUserId = runtime.getCurrentUser().id;

		role = runtime.getCurrentUser().role;

		if (context.request.method === "GET") {
			var start_date = context.request.parameters.start_date;
			var last_date = context.request.parameters.last_date;

			var form = ui.createForm({
				title: "Customer List - T&C's Not Accepted",
			});

			var inlineHtml =
				'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.0.7/css/dataTables.dataTables.css"><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.0.2/css/buttons.dataTables.css"><link rel = "stylesheet" type = "text/css" href = "https://cdn.datatables.net/responsive/3.0.3/css/responsive.dataTables.css" ><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/fixedheader/4.0.1/css/fixedHeader.dataTables.css"></link><script type = "text/javascript" charset = "utf8" src = "https://cdn.datatables.net/2.0.7/js/dataTables.js" ></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/dataTables.buttons.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.html5.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.print.min.js"></script><script type = "text/javascript" charset = "utf8" src = "https://cdn.datatables.net/responsive/3.0.3/js/dataTables.responsive.js" ></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/responsive/3.0.3/js/responsive.dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/fixedheader/4.0.1/js/dataTables.fixedHeader.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/fixedheader/4.0.1/js/fixedHeader.dataTables.js"></script><link href = "//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel = "stylesheet" ><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script>';
			inlineHtml +=
				'<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>';
			inlineHtml +=
				'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">';
			inlineHtml +=
				'<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>';
			// Semantic Select
			inlineHtml +=
				'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">';
			inlineHtml +=
				'<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>';

			inlineHtml +=
				"<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;} .tableVerticalAlign{vertical-align: middle !important;} .tableAlignTextCenter{text-align: center !important;} .buttonShadow{border-radius:30px;background:#fff;box-shadow:18px 18px 36px #a3a3a3,-18px -18px 36px #fff}</style>";
			var completeTaskIcon =
				"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Complete Task</title><g id='check_fill' fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#5cb85c' d='M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0'/></g></svg>";

			//Loading Section that gets displayed when the page is being loaded
			inlineHtml += loadingSection();

			var scheduleTaskIcon =
				"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Send Reminder Email/SMS to Customer and Setup Task for Sales Rep</title><g id='mail_send_fill' fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#5cb3b0' d='M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1h2v1h16V7.423l-6.935 6.935a1.5 1.5 0 0 1-2.121 0L4 7.414V8H2V6a2 2 0 0 1 2-2zM6 13a1 1 0 0 1 .117 1.993L6 15H1a1 1 0 0 1-.117-1.993L1 13zm-1-3a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2z'/></g></svg>";

			inlineHtml +=
				'<div class="container instruction_div hide" style="background-color: #F6F8F9FF;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b>Purpose</b>: This page list down customers that have not accepted the T&C\'s with a commencement date on or after 1st September 2024.</br><ol><li><b>INITIAL CUSTOMER LIST</b>: Tab shows the list of customers that have not accepted the T&C\'s and no reminder Email/SMS has been sent out or task been setup for the Sales Rep<ul><li><b>' +
				scheduleTaskIcon +
				" REMINDER EMAIL/SMS & SCHEDULE TASK</b>: Click this button to send out a reminder Email and SMS to the customer to accept the T&C's. This will also setup a task for the Sales Rep to followup.</li></ul></li><li><b>EMAIL/SMS SENT & TASK SETUP</b>: Tab shows the list of customers for which the reminder email has been sent out and task created for the Sales Rep. </br></li></ol><b><i style='color: red;'>If the commencement date is earlier than today's date, the row is highlighted in red. If the commencement date is the same as today's date, the row is highlighted in orange.</i></b></div>";

			inlineHtml += spacing();

			//Assign Color Codes to employees
			//Search Name: Active Employees - Sales Team
			var salesTeamSearch = search.load({
				type: "employee",
				id: "customsearch_active_employees_3",
			});

			// inlineHtml += spacing();
			// inlineHtml += "</div></div></div></br></br>";

			inlineHtml += addUserNotesModal();
			inlineHtml += scheduleTask(salesTeamSearch);

			//NetSuite Search:Customer List - T&C's Not Agreed (1st Sept 2024 Onwards)
			var custListTNCNotAcceptedSearch = search.load({
				type: "customer",
				id: "customsearch_cust_list_t_c_agreed_2_2",
			});

			var scheduleTaskIcon =
				"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Send Reminder Email/SMS to Customer and Setup Task for Sales Rep</title><g id='mail_send_fill' fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#FFFFFFFF' d='M20 4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1h2v1h16V7.423l-6.935 6.935a1.5 1.5 0 0 1-2.121 0L4 7.414V8H2V6a2 2 0 0 1 2-2zM6 13a1 1 0 0 1 .117 1.993L6 15H1a1 1 0 0 1-.117-1.993L1 13zm-1-3a1 1 0 1 1 0 2H2a1 1 0 1 1 0-2z'/></g></svg>";
			var completeTaskIcon =
				"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Complete Task</title><g id='check_fill' fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F6F8F9FF' d='M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0'/></g></svg>";

			var count = 0;

			custListTNCNotAcceptedSearch
				.run()
				.each(function (custListTNCNotAcceptedSearchResult) {
					var custInternalID = custListTNCNotAcceptedSearchResult.getValue({
						name: "internalid",
						summary: "GROUP",
					});
					var custEntityID = custListTNCNotAcceptedSearchResult.getValue({
						name: "entityid",
						summary: "GROUP",
					});
					var custName = custListTNCNotAcceptedSearchResult.getValue({
						name: "companyname",
						summary: "GROUP",
					});
					var zeeID = custListTNCNotAcceptedSearchResult.getValue({
						name: "partner",
						summary: "GROUP",
					});
					var zeeName = custListTNCNotAcceptedSearchResult.getText({
						name: "partner",
						summary: "GROUP",
					});

					var custStatusId = custListTNCNotAcceptedSearchResult.getValue({
						name: "entitystatus",
						summary: "GROUP",
					});

					var custStatus = custListTNCNotAcceptedSearchResult.getText({
						name: "entitystatus",
						summary: "GROUP",
					});
					var leadSource = custListTNCNotAcceptedSearchResult.getText({
						name: "leadsource",
						summary: "GROUP",
					});

					var salesRecordInternalId =
						custListTNCNotAcceptedSearchResult.getValue({
							name: "internalid",
							join: "CUSTRECORD_SALES_CUSTOMER",
							summary: "MAX",
						});
					var commRegInternalID = custListTNCNotAcceptedSearchResult.getValue({
						name: "internalid",
						join: "CUSTRECORD_CUSTOMER",
						summary: "MAX",
					});
					var commDate = custListTNCNotAcceptedSearchResult.getValue({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						summary: "GROUP",
					});
					var saleType = custListTNCNotAcceptedSearchResult.getText({
						name: "custrecord_sale_type",
						join: "CUSTRECORD_CUSTOMER",
						summary: "GROUP",
					});

					if (!isNullorEmpty(salesRecordInternalId)) {
						var salesRecord = record.load({
							type: "customrecord_sales",
							id: salesRecordInternalId,
						});

						var salesRepAssigned = salesRecord.getText({
							fieldId: "custrecord_sales_assigned",
						});
						var salesCampaign = salesRecord.getText({
							fieldId: "custrecord_sales_campaign",
						});
					} else {
						var salesRepAssigned = "";
						var salesCampaign = "";
					}

					// if (!isNullorEmpty(commRegInternalID)) {
					// 	var commRegRecord = record.load({
					// 		type: "customrecord_commencement_register",
					// 		id: commRegInternalID,
					// 	});
					// 	var commDate = commRegRecord.getValue({
					// 		fieldId: "custrecord_comm_date",
					// 	});
					// } else {
					// 	var commDate = "";
					// }

					if (!isNullorEmpty(commDate)) {
						var commDateSplit = commDate.split("/");
						if (parseInt(commDateSplit[1]) < 10) {
							commDateSplit[1] = "0" + commDateSplit[1];
						}
						if (parseInt(commDateSplit[0]) < 10) {
							commDateSplit[0] = "0" + commDateSplit[0];
						}
						commDate =
							commDateSplit[2] +
							"-" +
							commDateSplit[1] +
							"-" +
							commDateSplit[0];
					}

					//Search Name: Customer List - T&C's Not Agreed (1st Sept 2024 Onwards) - Task List
					var tncCustomerListTaskListSearch = search.load({
						type: "customer",
						id: "customsearch_cust_list_t_c_agreed_2_2_2",
					});
					tncCustomerListTaskListSearch.filters.push(
						search.createFilter({
							name: "internalid",
							join: null,
							operator: search.Operator.IS,
							values: custInternalID,
						})
					);

					var taskInternalId = "";
					var taskTitle = "";
					var taskDueDate = "";
					var taskTime = "";
					var taskSalesRepAssigned = "";
					var taskSalesRepAssignedText = "";
					var taskStatus = "";
					var taskCount = 0;
					var taskNotes = "";
					var taskCancelled = "No";
					var taskCreatedDate = "";
					var taskCompletedDate = "";

					tncCustomerListTaskListSearch
						.run()
						.each(function (tncCustomerListTaskListSearchResult) {
							taskInternalId = tncCustomerListTaskListSearchResult.getValue({
								name: "internalid",
								join: "task",
								summary: "GROUP",
							});

							taskTitle = tncCustomerListTaskListSearchResult.getValue({
								name: "title",
								join: "task",
								summary: "GROUP",
							});
							taskDueDate = tncCustomerListTaskListSearchResult.getValue({
								name: "duedate",
								join: "task",
								summary: "GROUP",
							});
							taskDueDate = convertDateToYYYYMMDD(taskDueDate);

							taskSalesRepAssigned =
								tncCustomerListTaskListSearchResult.getValue({
									name: "assigned",
									join: "task",
									summary: "GROUP",
								});

							taskSalesRepAssignedText =
								tncCustomerListTaskListSearchResult.getText({
									name: "assigned",
									join: "task",
									summary: "GROUP",
								});
							taskStatus = tncCustomerListTaskListSearchResult.getText({
								name: "status",
								join: "task",
								summary: "GROUP",
							});
							taskNotes = tncCustomerListTaskListSearchResult.getValue({
								name: "message",
								join: "task",
								summary: "GROUP",
							});
							taskCancelled = tncCustomerListTaskListSearchResult.getValue({
								name: "custevent_task_cancelled",
								join: "task",
								summary: "GROUP",
							});
							taskCreatedDate = tncCustomerListTaskListSearchResult.getValue({
								name: "createddate",
								join: "task",
								summary: "GROUP",
							});
							taskCompletedDate = tncCustomerListTaskListSearchResult.getValue({
								name: "completeddate",
								join: "task",
								summary: "GROUP",
							});
							taskCreatedDate = convertDateTimeToYYYYMMDD(taskCreatedDate);
							if (!isNullorEmpty(taskCompletedDate)) {
								// taskCompletedDate = convertToDateInputFormat(taskCompletedDate);
							}

							if (taskCancelled == 1) {
								taskCancelled = "Yes";
							}

							taskCount++;
							return true;
						});

					var customerIdLink =
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						custInternalID +
						'" target="_blank" style="">' +
						custEntityID +
						"</a>";

					if (taskCount == 0) {
						//Create the Table Rows for the Unqualified Leads.
						customerListTNCNotAcceptedTableHTML +=
							'<tr><td class="tableVerticalAlign"><button class="form-control btn btn-xs btn-success " style="width: fit-content;border-radius: 30px;background-color: #5cb3b0;"><a data-id="' +
							custInternalID +
							'" data-salesrecord="' +
							salesRecordInternalId +
							'" data-type="completed" class="scheduleTask" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
							scheduleTaskIcon +
							"</a></button></td>";

						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + custInternalID + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + customerIdLink + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + custName + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + zeeName + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + leadSource + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + custStatus + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + salesRepAssigned + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + salesCampaign + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + saleType + "</td>";
						customerListTNCNotAcceptedTableHTML +=
							"<td class='tableVerticalAlign'>" + commDate + "</td></tr>";
					} else {
						if (taskStatus == "Completed") {
							//Create the Table Rows for the Unqualified Leads.
							customerListTNCNotAcceptedTaskSetupTableHTML +=
								'<tr><td class="tableVerticalAlign"></td>';
						} else {
							//Create the Table Rows for the Unqualified Leads.
							customerListTNCNotAcceptedTaskSetupTableHTML +=
								'<tr><td class="tableVerticalAlign"><button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
								taskInternalId +
								'" data-type="completed" class="taskCompleted" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
								completeTaskIcon +
								"</a></button></td>";
						}

						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + custInternalID + "</td>"; //1
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + customerIdLink + "</td>"; //2
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + custName + "</td>"; //3
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + zeeName + "</td>"; //4
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + leadSource + "</td>"; //5
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + custStatus + "</td>"; //6
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + salesRepAssigned + "</td>"; //7
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + salesCampaign + "</td>"; //8
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + saleType + "</td>"; //9
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + commDate + "</td>"; //10
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + taskCreatedDate + "</td>"; //11
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + taskDueDate + "</td>"; //12

						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" +
							taskSalesRepAssignedText +
							"</td>"; //13
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" + taskStatus + "</td>"; //14
						customerListTNCNotAcceptedTaskSetupTableHTML +=
							"<td class='tableVerticalAlign'>" +
							calculateDaysBetween(taskDueDate) +
							"</td></tr>"; //15
					}

					count++;
					log.debug({
						title: "customerListTNCNotAcceptedTableHTML",
						details: customerListTNCNotAcceptedTableHTML,
					});
					return true;
				});

			log.debug({
				title: "customerListTNCNotAcceptedTableHTML",
				details: customerListTNCNotAcceptedTableHTML,
			});

			inlineHtml += '<div class="tabs_section hide">';
			// Tabs headers
			inlineHtml +=
				"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
			inlineHtml +=
				".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
			inlineHtml += "</style>";

			inlineHtml +=
				'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

			inlineHtml +=
				'<li role="presentation" class="active"><a data-toggle="tab" href="#requested" style="border-radius: 30px"><b>INITIAL CUSTOMER LIST</b></a></li>';
			inlineHtml +=
				'<li role="presentation" class=""><a data-toggle="tab" href="#scheduled" style="border-radius: 30px"><b>EMAIL/SMS SENT & TASK SETUP</b></a></li>';

			inlineHtml += "</ul></div>";

			inlineHtml += '<div class="tab-content">';
			inlineHtml +=
				'<div role="tabpanel" class="tab-pane active" id="requested">';
			inlineHtml += dataTable(
				"customer_list",
				customerListTNCNotAcceptedTableHTML
			);
			inlineHtml += "</div>";
			inlineHtml += '<div role="tabpanel" class="tab-pane" id="scheduled">';
			inlineHtml += dataTable(
				"customer_list_schedule",
				customerListTNCNotAcceptedTaskSetupTableHTML
			);
			inlineHtml += "</div>";

			inlineHtml += "</div></div>";

			form
				.addField({
					id: "preview_table",
					label: "inlinehtml",
					type: "inlinehtml",
				})
				.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW,
				}).defaultValue = inlineHtml;

			form.clientScriptFileId = 7344646;

			context.response.writePage(form);
		} else {
		}
	}

	/*
	 * PURPOSE : HTML code to generate the Modal Pop-up
	 *  PARAMS :  -
	 * RETURNS : HTML
	 *   NOTES :
	 */
	function scheduleTask(salesTeamSearch) {
		var inlineHtml =
			'<div id="myModalScheduleTask" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">ShipMate Onboarding Task</h3></div>';

		inlineHtml += '<div class="modal-body" style="padding: 2px 16px;">';

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 weekly_usage"><div class="input-group"><span class="input-group-addon" id="weekly_usage_text">ASSIGN TO SALES REP <span class="mandatory">*</span></span><select id="schedule_sales_rep_assigned" class="form-control schedule_sales_rep_assigned" ><option></option>';

		salesTeamSearch.run().each(function (salesTeamSearchResult) {
			var employee_id = salesTeamSearchResult.getValue("internalid");
			var first_name = salesTeamSearchResult.getValue("firstname");
			var last_name = salesTeamSearchResult.getValue("lastname");
			var name = salesTeamSearchResult.getValue("entityid");
			var mobilephone = salesTeamSearchResult.getValue("mobilephone");

			inlineHtml +=
				'<option value="' +
				employee_id +
				'" data-name="' +
				name +
				'" data-mobile="' +
				mobilephone +
				'" >' +
				name +
				"</option>";

			return true;
		});
		inlineHtml += "</select></div></div>";
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<input type="text" id="schedule_task_id" value="" hidden/><input type="text" id="schedule_customer_id" value="" hidden/><div class="col-xs-6 date_section"><div class="input-group"><span class="input-group-addon">SET APPOINTMENT DATE <span class="mandatory">*</span></span><input type="date" id="schedule_date" class="form-control" /></div></div>';
		inlineHtml +=
			'<div class="col-xs-6 time_section"><div class="input-group"><span class="input-group-addon">SET APPOINTMENT TIME <span class="mandatory">*</span></span><input type="time" id="schedule_time" class="form-control" /></div></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<div class="col-xs-12 task_notes"><div class="input-group"><span class="input-group-addon">NOTES </span><textarea class="form-control schedule_note" rows="4" cols="50"></textarea></div></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="Schedule Appointment" class="form-control btn-primary" id="scheduleOnboarding" style="background-color: #095C7B; border-radius: 30px;"/></div></div></div>';

		return inlineHtml;
	}

	/**
	 * The table that will display the differents invoices linked to the
	 * franchisee and the time period.
	 *
	 * @return {String} inlineHtml
	 */
	function dataTable(name, inlineTableRows) {
		var inlineHtml =
			"<style>table#mpexusage-" +
			name +
			" {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#mpexusage-" +
			name +
			" th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
		inlineHtml +=
			'<div class="table_section hide"><table id="mpexusage-' +
			name +
			'" class="table table-responsive display customer tablesorter row-border cell-border compact" style="width: 100%;border: 2px solid #103d39;background-color: #ffffff">';
		inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
		inlineHtml += '<tr class="text-center">';
		inlineHtml += "</tr>";
		inlineHtml += "</thead>";

		inlineHtml += '<tbody id="result_usage_' + name + '" >';

		inlineHtml += inlineTableRows;

		inlineHtml += "</table></div>";
		return inlineHtml;
	}

	/**
	 * The header showing that the results are loading.
	 * @returns {String} `inlineQty`
	 */
	function loadingSection() {
		var inlineHtml =
			'<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
		inlineHtml += '<div class="row">';
		inlineHtml += '<div class="col-xs-12 ">';
		inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
		inlineHtml += "</div></div></div></br></br>";
		inlineHtml += '<div class="wrapper loading_section">';
		inlineHtml += '<div class="blue ball"></div>';
		inlineHtml += '<div class="red ball"></div>';
		inlineHtml += '<div class="yellow ball"></div>';
		inlineHtml += '<div class="green ball"></div>';

		inlineHtml += "</div>";

		return inlineHtml;
	}

	/**
	 * @description Calculates the number of days between two dates.
	 * @param {String} startDate - The start date in "YYYY-MM-DD" format.
	 * @param {String} endDate - The end date in "YYYY-MM-DD" format.
	 * @returns {Number}  An object containing the difference in years, months, and days.
	 */
	function calculateDaysBetweenDates(startDate, endDate) {
		var [startyear, startmonth, startday] = startDate.split("-");
		var startDate2 = new Date(startyear, startmonth - 1, startday);

		var [endyear, endmonth, endday] = endDate.split("-");
		var endDate2 = new Date(endyear, endmonth - 1, endday);

		var years = endDate2.getFullYear() - startDate2.getFullYear();
		var months = endDate2.getMonth() - startDate2.getMonth();
		var days = endDate2.getDate() - startDate2.getDate();

		// Adjust for negative days
		if (days < 0) {
			months--;
			days += new Date(
				endDate2.getFullYear(),
				endDate2.getMonth(),
				0
			).getDate();
		}

		// Adjust for negative months
		if (months < 0) {
			years--;
			months += 12;
		}

		return years + " years, " + months + " months, and " + days + " days";
	}

	function calculateDaysBetween(date) {
		log.debug({
			title: "inside calculatedaysbetween > date",
			details: date,
		});
		var [year, month, day] = date.split("-");
		var inputDate = new Date(year, month - 1, day);
		var today = new Date();
		log.debug({
			title: "inside calculatedaysbetween > today",
			details: today,
		});
		today.setHours(today.getHours() + 11);
		log.debug({
			title: "inside calculatedaysbetween > today",
			details: today,
		});
		// var inputDate = new Date(date);
		var timeDifference = today - inputDate;
		var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		log.debug({
			title: "inside calculatedaysbetween > daysDifference",
			details: daysDifference,
		});
		return daysDifference;
	}

	function convertDateTimeToYYYYMMDD(dateTime) {
		var datePart = dateTime.split(" ")[0];
		var parts = datePart.split("/");
		if (parseInt(parts[1]) < 10) {
			var month = "0" + parts[1];
		} else {
			var month = parts[1];
		}
		// var month = parts[1];
		if (parseInt(parts[0]) < 10) {
			var day = "0" + parts[0];
		} else {
			var day = parts[0];
		}
		var year = parts[2];
		return year + "-" + month + "-" + day;
	}

	/**
	 * @description Converts a date from "YYYY-DD-MM" format to NetSuite date format "M/D/YYYY".
	 * @param {String} date_yyyymmdd - The date string in "YYYY-MM-DD" format.
	 * @returns {String} The date string in NetSuite date format "DD/MM/YYYY".
	 */
	function convertToNetSuiteDate(date_yyyymmdd) {
		// Split the input date string into components
		var [year, month, day] = date_yyyymmdd.split("-");

		// Create a new Date object using the parsed components
		var date = new Date(year, month - 1, day); // month is zero-based

		// Format the date to "DD/MM/YYYY"
		var formattedDate =
			customPadStart(date.getDate().toString(), 2, "0") +
			"/" +
			customPadStart((date.getMonth() + 1).toString(), 2, "0") +
			"/" +
			date.getFullYear();

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
	 * @description Gets the current financial year in Australia in "YYYY-MM-DD" format.
	 * @returns {Object} An object containing the start and end dates of the financial year.
	 */
	function getCurrentFinancialYearAustralia() {
		var today = new Date();
		var currentYear = today.getFullYear();
		var currentMonth = today.getMonth() + 1; // Months are zero-based

		var startYear, endYear;

		// Financial year in Australia starts on July 1st and ends on June 30th
		if (currentMonth >= 7) {
			startYear = currentYear;
			endYear = currentYear + 1;
		} else {
			startYear = currentYear - 1;
			endYear = currentYear;
		}

		var startDate = startYear + "-07-01";
		var endDate = endYear + "-06-30";

		return {
			startDate: startDate,
			endDate: endDate,
		};
	}

	/*
	 * PURPOSE : HTML code to generate the Modal Pop-up
	 *  PARAMS :  -
	 * RETURNS : HTML
	 *   NOTES :
	 */
	function addUserNotesModal() {
		var inlineHtml =
			'<div id="myModalUserNote" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">Add User Note</h3></div>';

		inlineHtml += '<div class="modal-body" style="padding: 2px 16px;">';

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml += '<input type="text" id="customer_id" value="" hidden/>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<div class="col-xs-12 task_notes"><div class="input-group"><span class="input-group-addon">NOTES </span><textarea class="form-control userNote" rows="4" cols="50"></textarea></div></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="Save User Notes" class="form-control btn-primary" id="createNote" style="background-color: #095C7B; border-radius: 30px;"/></div></div></div>';

		return inlineHtml;
	}

	/*
	 * PURPOSE : HTML code to generate the Modal Pop-up
	 *  PARAMS :  -
	 * RETURNS : HTML
	 *   NOTES :
	 */
	function cancelOnBoardingModal() {
		var inlineHtml =
			'<div id="myModalCancelOnboarding" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">Cancel Onboarding</h3></div>';

		inlineHtml += '<div class="modal-body" style="padding: 2px 16px;">';

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<input type="text" id="task_id" value="" hidden/><input type="text" id="customer_id" value="" hidden/>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<div class="col-xs-12 task_notes"><div class="input-group"><span class="input-group-addon">NOTES </span><textarea class="form-control cancelOnboardingNotes" rows="4" cols="50"></textarea></div></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="Cancel Onboarding" class="form-control btn-danger" id="cancelOnBoarding" style="border-radius: 30px;"/></div></div></div>';

		return inlineHtml;
	}

	/*
	 * PURPOSE : ADDS SPACING
	 *  PARAMS :
	 * RETURNS : INLINEHTML
	 *   NOTES :
	 */
	function spacing() {
		var inlineHtml =
			'<div class="form-group spacing_section" style="height: 50px;">';
		inlineHtml += '<div class="row">';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		return inlineHtml;
	}

	/**
	 * @description Converts a date from "dd/mm/yyyy" format to "yyyy-mm-dd" format.
	 * @param {string} dateStr - The date string in "dd/mm/yyyy" format.
	 * @returns {string} The date string in "yyyy-mm-dd" format.
	 */
	function convertDateToYYYYMMDD(dateStr) {
		var parts = dateStr.split("/");
		var day = parts[0];
		var month = parts[1];
		var year = parts[2];
		return year + "-" + month + "-" + day;
	}

	/**
	 * @description
	 * @author Ankith Ravindran (AR)
	 * @date 24/09/2024
	 * @param {*} todayDate
	 * @returns {*}
	 */
	function GetFormattedDate(todayDate) {
		var month = pad(todayDate.getMonth() + 1);
		var day = pad(todayDate.getDate());
		var year = todayDate.getFullYear();
		return year + "-" + month + "-" + day;
	}

	function pad(s) {
		return s < 10 ? "0" + s : s;
	}

	function isNullorEmpty(val) {
		if (val == "" || val == null || val == undefined || val == "null") {
			return true;
		} else {
			return false;
		}
	}

	function randomHexColorCode() {
		var n = (Math.random() * 0xfffff * 1000000).toString(16);
		return "#" + n.slice(0, 6);
	}

	return {
		onRequest: onRequest,
	};
});
