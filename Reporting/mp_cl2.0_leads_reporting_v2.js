/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript

 * Author:               Ankith Ravindran
 * Created on:           Tue Apr 18 2023
 * Modified on:          2024-07-10T05:12:54.193Z
 * SuiteScript Version:  2.0 
 * Description:          Client script for the reporting page that shows reporting based on the leads that come into the system and the customers that have been signed up based on the leads. 
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
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

	var date_from = null;
	var date_to = null;

	var modified_date_from = null;
	var modified_date_to = null;

	var usage_date_from = null;
	var usage_date_to = null;

	var date_signed_up_from = null;
	var date_signed_up_to = null;

	var commencement_start_date = null;
	var commencement_last_date = null;
	var cancelled_start_date = null;
	var cancelled_last_date = null;

	var date_quote_sent_to = null;
	var date_quote_sent_from = null;

	var invoice_date_from = null;
	var invoice_date_to = null;
	var invoice_type = null;

	var invoiceType = null;
	var lead_source = null;
	var sales_campaign = null;
	var parent_lpo = null;
	var sales_rep = null;
	var lead_entered_by = null;
	var calcprodusage = null;
	var sales_activity_notes = null;
	var customer_type = null;
	var leadStatus = null;

	var total_months = 14;

	var today = new Date();
	var today_day_in_month = today.getDate();
	var today_day_in_week = today.getDay();
	var today_month = today.getMonth() + 1;
	var today_year = today.getFullYear();

	var total_leads = 0;

	if (today_day_in_month < 10) {
		today_day_in_month = "0" + today_day_in_month;
	}

	if (today_month < 10) {
		today_month = "0" + today_month;
	}

	var todayString = today_day_in_month + "/" + today_month + "/" + today_year;

	var current_year_month = today_year + "-" + today_month;
	var difference_months = total_months - parseInt(today_month);

	function isWeekday(year, month, day) {
		var day = new Date(year, month, day).getDay();
		return day != 0 && day != 6;
	}

	function getWeekdaysInMonth(month, year) {
		var days = daysInMonth(month, year);
		var weekdays = 0;
		for (var i = 0; i < days; i++) {
			if (isWeekday(year, month, i + 1)) weekdays++;
		}
		return weekdays;
	}

	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}

	var debtDataSet = [];
	var debt_set = [];

	var debtDataSet2 = [];
	var debt_set2 = [];
	var lpo_debt_set2 = [];
	var zee_debt_set2 = [];
	var salesrep_debt_set2 = [];
	var datacapture_debt_set2 = [];

	var debtDataSet3 = [];
	var debt_set3 = [];

	var debtDataSet4 = [];
	var debt_set4 = [];

	var debtDataSet5 = [];
	var debt_set5 = [];

	var debtDataSet6 = [];
	var debt_set6 = [];

	var debtDataSet7 = [];
	var debt_set7 = [];

	var debtDataSetSuspectsLost = [];
	var debt_setSuspectsLost = [];

	var debtDataSetTrial = [];
	var debt_setTrial = [];
	var debt_setTrialPending = [];

	var debtDataSetSuspectsOffPeakPipeline = [];
	var debt_setSuspectsOffPeakPipeline = [];

	var debtDataSetSuspectsOOT = [];
	var debt_setSuspectsOOT = [];

	var debtDataSetSuspectsFollowUp = [];
	var debt_setSuspectsFollowUp = [];
	var debt_setSuspectsNoAnswer = [];
	var debt_setSuspectsInContact = [];
	var debt_setSuspectsQualified = [];
	var debt_setSuspectsUnqualified = [];
	var debt_setSuspectsValidated = [];

	var debt_setCustomerCancellationRequest = [];

	var customerDataSet = [];
	var existingCustomerDataSet = [];
	var trialCustomerDataSet = [];
	var trialPendingCustomerDataSet = [];
	var prospectDataSet = [];
	var prospectOpportunityDataSet = [];
	var prospectQUualifiedDataSet = [];
	var prospectQuoteSentDataSet = [];
	var prospectBoxSentDataSet = [];
	var suspectDataSet = [];
	var suspectLostDataSet = [];
	var suspectOffPeakDataSet = [];
	var suspectOOTDataSet = [];
	var suspectFollowUpDataSet = [];
	var suspectQualifiedDataSet = [];
	var suspectUnqualifiedDataSet = [];
	var suspectValidatedDataSet = [];
	var suspectNoAnswerDataSet = [];
	var suspectInContactDataSet = [];

	var customerChildDataSet = [];
	var customerChildStatusDataSet = [];
	var existingCustomerChildDataSet = [];
	var prospectChildDataSet = [];
	var prospectOpportunityChildDataSet = [];
	var prospectQuoteSentChildDataSet = [];
	var prospectBoxSentChildDataSet = [];
	var prospectQualifiedChildDataSet = [];
	var suspectNoAnswerChildDataSet = [];
	var suspectInContactChildDataSet = [];
	var suspectChildDataSet = [];
	var suspectOffPeakChildDataSet = [];
	var suspectLostChildDataSet = [];
	var suspectOOTChildDataSet = [];
	var suspectQualifiedChildDataSet = [];
	var suspectUnqualifiedChildDataSet = [];
	var suspectValidatedChildDataSet = [];
	var suspectFollowUpChildDataSet = [];
	var customerCancellationRequestDataSet = [];
	var callForceTasksDataSet = [];
	var callForceDateSyncedOutcomeDataSet = [];
	var callForceOutcomeStatusDataSet = [];
	var callForceCompletedTasksDataSet = [];

	var totalSuspectCount = 0;
	var customerActivityCount = 0;
	var totalCustomerCount = 0;
	var suspectActivityCount = 0;
	var prospectActivityCount = 0;
	var totalProspectCount = 0;

	var employee_list = [];
	var employee_list_color = [];

	var campaign_list = [];
	var campaign_list_color = [];

	var source_list = [];
	var source_list_color = [];

	function pageLoad() {
		$(".zee_label_section").addClass("hide");
		$(".zee_dropdown_section").addClass("hide");
		$(".source_salesrep_label_section").addClass("hide");
		$(".source_salesrep_section").addClass("hide");

		$(".loading_section").removeClass("hide");
	}

	function afterSubmit() {
		$(".zee_label_section").removeClass("hide");
		$(".show_buttons_section").removeClass("hide");
		$(".zee_dropdown_section").removeClass("hide");

		$(".lead_entered_label_section").removeClass("hide");
		$(".lead_entered_div").removeClass("hide");
		$(".modified_date_div").removeClass("hide");
		if (role != 1000) {
			$(".quote_sent_label_section").removeClass("hide");
			$(".quote_sent_div").removeClass("hide");
			$(".usage_label_section").removeClass("hide");
			$(".calcprodusage_div").removeClass("hide");
			// $('.salesactivitynotes_div').removeClass('hide');
			$(".usage_date_div").removeClass("hide");
			$(".invoice_label_section").removeClass("hide");
			$(".invoice_date_type_div").removeClass("hide");
		}

		$(".source_salesrep_label_section").removeClass("hide");
		$(".source_salesrep_section").removeClass("hide");

		$(".signed_up_label_section").removeClass("hide");
		$(".signed_up_div").removeClass("hide");

		$(".filter_buttons_section").removeClass("hide");
		$(".tabs_section").removeClass("hide");
		$(".table_section").removeClass("hide");
		$(".instruction_div").removeClass("hide");
		// if (userId == 409635) {
		//     $('.development_message').removeClass('hide');
		// }
		$(".scorecard_percentage").removeClass("hide");
		$(".status_dropdown_section").removeClass("hide");

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

		debtDataSet = [];
		debt_set = [];

		date_from = $("#date_from").val();
		date_from = dateISOToNetsuite(date_from);

		date_to = $("#date_to").val();
		date_to = dateISOToNetsuite(date_to);

		modified_date_from = $("#modified_date_from").val();
		modified_date_from = dateISOToNetsuite(modified_date_from);

		modified_date_to = $("#modified_date_to").val();
		modified_date_to = dateISOToNetsuite(modified_date_to);

		usage_date_from = $("#usage_date_from").val();
		usage_date_from = dateISOToNetsuite(usage_date_from);

		usage_date_to = $("#usage_date_to").val();
		usage_date_to = dateISOToNetsuite(usage_date_to);

		date_signed_up_from = $("#date_signed_up_from").val();
		date_signed_up_from = dateISOToNetsuite(date_signed_up_from);

		date_signed_up_to = $("#date_signed_up_to").val();
		date_signed_up_to = dateISOToNetsuite(date_signed_up_to);

		date_quote_sent_from = $("#date_quote_sent_from").val();
		date_quote_sent_from = dateISOToNetsuite(date_quote_sent_from);

		date_quote_sent_to = $("#date_quote_sent_to").val();
		date_quote_sent_to = dateISOToNetsuite(date_quote_sent_to);

		commencement_start_date = $("#commencement_date_from").val();
		commencement_start_date = dateISOToNetsuite(commencement_start_date);
		commencement_last_date = $("#commencement_date_to").val();
		commencement_last_date = dateISOToNetsuite(commencement_last_date);
		cancelled_start_date = $("#cancellation_date_from").val();
		cancelled_start_date = dateISOToNetsuite(cancelled_start_date);
		cancelled_last_date = $("#cancellation_date_to").val();
		cancelled_last_date = dateISOToNetsuite(cancelled_last_date);

		lead_source = $("#lead_source").val();
		sales_campaign = $("#sales_campaign").val();
		lead_entered_by = $("#lead_entered_by").val();
		parent_lpo = $("#parent_lpo").val();
		sales_rep = $("#sales_rep").val();
		invoice_type = $("#invoice_type").val();
		calcprodusage = $("#calc_prod_usage").val();
		sales_activity_notes = $("#sales_activity_notes").val();
		customer_type = $("#customer_type").val();
		leadStatus = $("#cust_status").val();

		invoice_date_from = $("#invoice_date_from").val();
		invoice_date_from = dateISOToNetsuite(invoice_date_from);
		invoice_date_to = $("#invoice_date_to").val();
		invoice_date_to = dateISOToNetsuite(invoice_date_to);

		/**
		 *  Auto Load Submit Search and Load Results on Page Initialisation
		 */

		submitSearch();
		var dataTable = $("#customer_benchmark_preview").DataTable();

		var today = new Date();
		var today_year = today.getFullYear();
		var today_month = today.getMonth();
		var today_day = today.getDate();

		$("#showGuide").click(function () {
			if ($("#show_filter").val() == "HIDE FILTERS") {
				$("#show_filter").trigger("click");
			}
			$("#myModal").show();

			return false;
		});

		$(".close").click(function () {
			$("#myModal").hide();
		});

		$("#show_filter").click(function () {
			if ($("#show_filter").val() == "SHOW FILTERS") {
				$("#show_filter").val("HIDE FILTERS");
				$("#show_filter").css("background-color", "#F0AECB");
				$("#show_filter").css("color", "#103d39");
			} else {
				$("#show_filter").val("SHOW FILTERS");
				$("#show_filter").css("background-color", "#EAF044 !important");
				$("#show_filter").css("color", "#103d39");
			}
		});

		$("#applyFilter").click(function () {
			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();

			var modified_date_from = $("#modified_date_from").val();
			var modified_date_to = $("#modified_date_to").val();

			var usage_date_from = $("#usage_date_from").val();
			var usage_date_to = $("#usage_date_to").val();

			var date_signed_up_from = $("#date_signed_up_from").val();
			var date_signed_up_to = $("#date_signed_up_to").val();

			var commencement_start_date = $("#commencement_date_from").val();
			var commencement_last_date = $("#commencement_date_to").val();
			var cancelled_start_date = $("#cancellation_date_from").val();
			var cancelled_last_date = $("#cancellation_date_to").val();

			var date_quote_sent_from = $("#date_quote_sent_from").val();
			var date_quote_sent_to = $("#date_quote_sent_to").val();

			var invoice_date_from = $("#invoice_date_from").val();
			var invoice_date_to = $("#invoice_date_to").val();
			var invoice_type = $("#invoice_type").val();
			var source = $("#lead_source").val();
			var sales_campaign = $("#sales_campaign").val();
			var parent_lpo = $("#parent_lpo").val();

			var sales_rep = $("#sales_rep").val();
			var lead_entered_by = $("#lead_entered_by").val();
			calcprodusage = $("#calc_prod_usage").val();
			sales_activity_notes = $("#sales_activity_notes").val();
			customer_type = $("#customer_type").val();

			leadStatus = $("#cust_status").val();

			zee = $("#zee_dropdown").val();

			if (
				!isNullorEmpty(invoice_date_from) &&
				!isNullorEmpty(invoice_date_to)
			) {
				if (
					isNullorEmpty(date_signed_up_from) ||
					isNullorEmpty(date_signed_up_to)
				) {
					alert("Please enter the date signed up filter");
					return false;
				}
			} else if (
				(isNullorEmpty(date_to) || isNullorEmpty(date_from)) &&
				(isNullorEmpty(usage_date_from) || isNullorEmpty(usage_date_to)) &&
				(isNullorEmpty(date_signed_up_from) || isNullorEmpty(date_signed_up_to))
			) {
				alert("Please enter the date filter");
				return false;
			}

			if (!(isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to))) {
			}

			if (
				!isNullorEmpty(modified_date_from) &&
				!isNullorEmpty(modified_date_to)
			) {
				var url =
					baseURL +
					"/app/site/hosting/scriptlet.nl?script=1915&deploy=1&start_date=" +
					date_from +
					"&last_date=" +
					date_to +
					"&usage_date_from=" +
					usage_date_from +
					"&usage_date_to=" +
					usage_date_to +
					"&date_signed_up_from=" +
					date_signed_up_from +
					"&date_signed_up_to=" +
					date_signed_up_to +
					"&commence_date_from=" +
					commencement_start_date +
					"&commence_date_to=" +
					commencement_last_date +
					"&cancel_date_from=" +
					cancelled_start_date +
					"&cancel_date_to=" +
					cancelled_last_date +
					"&source=" +
					source +
					"&date_quote_sent_from=" +
					date_quote_sent_from +
					"&date_quote_sent_to=" +
					date_quote_sent_to +
					"&sales_rep=" +
					sales_rep +
					"&zee=" +
					zee +
					"&calcprodusage=" +
					calcprodusage +
					"&invoice_date_from=" +
					invoice_date_from +
					"&invoice_date_to=" +
					invoice_date_to +
					"&campaign=" +
					sales_campaign +
					"&lpo=" +
					parent_lpo +
					"&lead_entered_by=" +
					lead_entered_by +
					"&modified_date_from=" +
					modified_date_from +
					"&modified_date_to=" +
					modified_date_to +
					"&status=" +
					leadStatus +
					"&salesactivitynotes=1&customertype=" +
					customer_type;
			} else {
				var url =
					baseURL +
					"/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" +
					date_from +
					"&last_date=" +
					date_to +
					"&usage_date_from=" +
					usage_date_from +
					"&usage_date_to=" +
					usage_date_to +
					"&date_signed_up_from=" +
					date_signed_up_from +
					"&date_signed_up_to=" +
					date_signed_up_to +
					"&commence_date_from=" +
					commencement_start_date +
					"&commence_date_to=" +
					commencement_last_date +
					"&cancel_date_from=" +
					cancelled_start_date +
					"&cancel_date_to=" +
					cancelled_last_date +
					"&source=" +
					source +
					"&date_quote_sent_from=" +
					date_quote_sent_from +
					"&date_quote_sent_to=" +
					date_quote_sent_to +
					"&sales_rep=" +
					sales_rep +
					"&zee=" +
					zee +
					"&calcprodusage=" +
					calcprodusage +
					"&invoice_date_from=" +
					invoice_date_from +
					"&invoice_date_to=" +
					invoice_date_to +
					"&campaign=" +
					sales_campaign +
					"&lpo=" +
					parent_lpo +
					"&lead_entered_by=" +
					lead_entered_by +
					"&modified_date_from=" +
					modified_date_from +
					"&modified_date_to=" +
					modified_date_to +
					"&status=" +
					leadStatus +
					"&salesactivitynotes=" +
					sales_activity_notes +
					"&customertype=" +
					customer_type;
			}

			window.location.href = url;
		});

		$("#full_report").click(function () {
			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();

			var modified_date_from = $("#modified_date_from").val();
			var modified_date_to = $("#modified_date_to").val();

			var usage_date_from = $("#usage_date_from").val();
			var usage_date_to = $("#usage_date_to").val();

			var date_signed_up_from = $("#date_signed_up_from").val();
			var date_signed_up_to = $("#date_signed_up_to").val();

			var commencement_start_date = $("#commencement_date_from").val();
			var commencement_last_date = $("#commencement_date_to").val();
			var cancelled_start_date = $("#cancellation_date_from").val();
			var cancelled_last_date = $("#cancellation_date_to").val();

			var date_quote_sent_from = $("#date_quote_sent_from").val();
			var date_quote_sent_to = $("#date_quote_sent_to").val();

			var invoice_date_from = $("#invoice_date_from").val();
			var invoice_date_to = $("#invoice_date_to").val();
			var invoice_type = $("#invoice_type").val();
			var source = $("#lead_source").val();
			var sales_campaign = $("#sales_campaign").val();
			var parent_lpo = $("#parent_lpo").val();

			var sales_rep = $("#sales_rep").val();
			var lead_entered_by = $("#lead_entered_by").val();
			calcprodusage = $("#calc_prod_usage").val();
			sales_activity_notes = $("#sales_activity_notes").val();
			customer_type = $("#customer_type").val();

			leadStatus = $("#cust_status").val();

			zee = $("#zee_dropdown").val();

			if (
				!isNullorEmpty(invoice_date_from) &&
				!isNullorEmpty(invoice_date_to)
			) {
				if (
					isNullorEmpty(date_signed_up_from) ||
					isNullorEmpty(date_signed_up_to)
				) {
					alert("Please enter the date signed up filter");
					return false;
				}
			} else if (
				(isNullorEmpty(date_to) || isNullorEmpty(date_from)) &&
				(isNullorEmpty(usage_date_from) || isNullorEmpty(usage_date_to)) &&
				(isNullorEmpty(date_signed_up_from) || isNullorEmpty(date_signed_up_to))
			) {
				alert("Please enter the date filter");
				return false;
			}

			if (!(isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to))) {
			}

			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1989&deploy=1&start_date=" +
				date_from +
				"&last_date=" +
				date_to +
				"&usage_date_from=" +
				usage_date_from +
				"&usage_date_to=" +
				usage_date_to +
				"&date_signed_up_from=" +
				date_signed_up_from +
				"&date_signed_up_to=" +
				date_signed_up_to +
				"&commence_date_from=" +
				commencement_start_date +
				"&commence_date_to=" +
				commencement_last_date +
				"&cancel_date_from=" +
				cancelled_start_date +
				"&cancel_date_to=" +
				cancelled_last_date +
				"&source=" +
				source +
				"&date_quote_sent_from=" +
				date_quote_sent_from +
				"&date_quote_sent_to=" +
				date_quote_sent_to +
				"&sales_rep=" +
				sales_rep +
				"&zee=" +
				zee +
				"&calcprodusage=" +
				calcprodusage +
				"&invoice_date_from=" +
				invoice_date_from +
				"&invoice_date_to=" +
				invoice_date_to +
				"&campaign=" +
				sales_campaign +
				"&lpo=" +
				parent_lpo +
				"&lead_entered_by=" +
				lead_entered_by +
				"&modified_date_from=" +
				modified_date_from +
				"&modified_date_to=" +
				modified_date_to +
				"&status=" +
				leadStatus +
				"&salesactivitynotes=" +
				sales_activity_notes +
				"&customertype=" +
				customer_type;

			window.open(url, "_blank");
			// window.location.href = url;
		});

		$("#clearFilter").click(function () {
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1";

			window.location.href = url;
		});

		$("#showTotal").click(function () {
			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1678&deploy=1&showTotal=T";

			window.location.href = url;
		});

		$(".show_status_timeline").click(function () {
			var custInternalID = $(this).attr("data-id");

			console.log("Inside Modal: " + custInternalID);

			// Lead Status Timeline
			var leadStatusTimelineSearch = search.load({
				type: "customer",
				id: "customsearch_lead_status_timeline",
			});

			leadStatusTimelineSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: null,
					operator: search.Operator.ANYOF,
					values: parseInt(custInternalID),
				})
			);

			var statusTimeLineTable =
				"<style>table#statusTimeLineTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#statusTimeLineTable th{text-align: center;} .bolded{font-weight: bold;}</style>";
			statusTimeLineTable +=
				'<div class="table_section "><table id="statusTimeLineTable" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
			statusTimeLineTable +=
				'<thead style="color: white;background-color: #103D39;">';
			statusTimeLineTable += '<tr class="text-center">';
			statusTimeLineTable += "<td>DATE</td>";
			statusTimeLineTable += "<td>SET BY</td>";
			statusTimeLineTable += "<td>OLD STATUS</td>";
			statusTimeLineTable += "<td>TIME IN OLD STATUS </td>";
			statusTimeLineTable += "<td>NEW STATUS</td>";
			statusTimeLineTable += "</tr>";
			statusTimeLineTable += "</thead>";

			statusTimeLineTable += '<tbody id="" >';

			var oldStatusDate = null;
			var timeInStatusDays = 0;
			var totalTimeInStatusDays = 0;

			leadStatusTimelineSearch
				.run()
				.each(function (leadStatusTimelineResultSet) {
					var systemNotesDate = leadStatusTimelineResultSet.getValue({
						name: "date",
						join: "systemNotes",
					});

					var systemNotesSetBy = leadStatusTimelineResultSet.getText({
						name: "name",
						join: "systemNotes",
					});
					var oldStatus = leadStatusTimelineResultSet.getValue({
						name: "oldvalue",
						join: "systemNotes",
					});

					var newStatus = leadStatusTimelineResultSet.getValue({
						name: "newvalue",
						join: "systemNotes",
					});

					var currentStatus = leadStatusTimelineResultSet.getValue({
						name: "entitystatus",
					});

					var systemNotesDateSplitSpace = systemNotesDate.split(" ");
					var systemNotesTime = convertTo24Hour(
						systemNotesDateSplitSpace[1] + " " + systemNotesDateSplitSpace[2]
					);
					var systemNotesDateSplit = systemNotesDateSplitSpace[0].split("/");
					if (parseInt(systemNotesDateSplit[1]) < 10) {
						systemNotesDateSplit[1] = "0" + systemNotesDateSplit[1];
					}

					if (parseInt(systemNotesDateSplit[0]) < 10) {
						systemNotesDateSplit[0] = "0" + systemNotesDateSplit[0];
					}

					systemNotesDate =
						systemNotesDateSplit[2] +
						"-" +
						systemNotesDateSplit[1] +
						"-" +
						systemNotesDateSplit[0];

					// console.log('systemNotesDate: ' + systemNotesDate);
					// console.log('oldStatusDate: ' + oldStatusDate);

					var onlyStatusDate = systemNotesDate;

					if (!isNullorEmpty(oldStatusDate)) {
						console.log("systemNotesDate: " + systemNotesDate);
						console.log("oldStatusDate: " + oldStatusDate);

						var date1 = new Date(systemNotesDate);
						var date2 = new Date(oldStatusDate);

						console.log("date1: " + date1);
						console.log("date2: " + date2);

						var difference = date1.getTime() - date2.getTime();
						timeInStatusDays = Math.ceil(difference / (1000 * 3600 * 24));

						console.log("timeInStatusDays: " + timeInStatusDays);

						var weeks = Math.floor(timeInStatusDays / 7);
						timeInStatusDays = timeInStatusDays - weeks * 2;

						console.log("timeInStatusDays: " + timeInStatusDays);

						console.log("date1: " + date1);
						console.log("date2: " + date2);

						// Handle special cases
						var startDay = date1.getDay();
						var endDay = date2.getDay();

						console.log("startDay: " + startDay);
						console.log("endDay: " + endDay);

						console.log("timeInStatusDays: " + timeInStatusDays);
						console.log("(startDay - endDay): " + (startDay - endDay));

						// Remove weekend not previously removed.
						// if ((startDay - endDay) > 1) {
						//     console.log('inside (startDay - endDay): ' + ((startDay - endDay) > 1));
						//     timeInStatusDays = timeInStatusDays - 2;
						// }

						console.log("timeInStatusDays: " + timeInStatusDays);

						// Remove start day if span starts on Sunday but ends before Saturday
						if (startDay == 0 && endDay != 6) {
							timeInStatusDays = timeInStatusDays - 1;
						}

						console.log("timeInStatusDays: " + timeInStatusDays);

						// Remove end day if span ends on Saturday but starts after Sunday
						if (endDay == 6 && startDay != 0) {
							timeInStatusDays = timeInStatusDays - 1;
						}

						// timeInStatusDays = systemNotesDate - oldStatusDate;
					}
					console.log("timeInStatusDays: " + timeInStatusDays);
					systemNotesDate = systemNotesDate + " " + systemNotesTime;

					statusTimeLineTable += "<tr>";
					statusTimeLineTable += "<td>" + systemNotesDate + "</td>";
					statusTimeLineTable += "<td>" + systemNotesSetBy + "</td>";
					statusTimeLineTable += "<td>" + oldStatus + "</td>";
					statusTimeLineTable += "<td>" + timeInStatusDays + "</td>";
					statusTimeLineTable += "<td>" + newStatus + "</td>";

					statusTimeLineTable += "</tr>";

					oldStatusDate = onlyStatusDate;

					totalTimeInStatusDays += timeInStatusDays;

					return true;
				});

			// statusTimeLineTable += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="3"><b>TOTAL WORKING DAYS</b></th><th style="text-align: center"><b>' + totalTimeInStatusDays + '</b></th><th></th></tfoot>';
			// statusTimeLineTable += '</tbody></table></div>';

			$("#leadStatusModal .modal-body").html(statusTimeLineTable);
			$("#leadStatusModal").show();
		});

		$(".closeModal").click(function () {
			$("#leadStatusModal").hide();
		});

		$(".show_salesrep_status_timeline").click(function () {
			var salesRepInternalId = $(this).attr("data-id");
			var salesRepName = $(this).attr("data-name");

			console.log("salesRepInternalId: " + salesRepInternalId);
			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();

			var modified_date_from = $("#modified_date_from").val();
			var modified_date_to = $("#modified_date_to").val();

			var date_signed_up_from = $("#date_signed_up_from").val();
			var date_signed_up_to = $("#date_signed_up_to").val();

			var date_quote_sent_from = $("#date_quote_sent_from").val();
			var date_quote_sent_to = $("#date_quote_sent_to").val();

			var lead_source = $("#lead_source").val();
			var sales_campaign = $("#sales_campaign").val();
			var parent_lpo = $("#parent_lpo").val();

			var lead_entered_by = $("#lead_entered_by").val();
			var leadStatus = $("#cust_status").val();

			var zee_id = $("#zee_dropdown").val();

			date_from = dateISOToNetsuite(date_from);
			date_to = dateISOToNetsuite(date_to);
			modified_date_from = dateISOToNetsuite(modified_date_from);
			modified_date_to = dateISOToNetsuite(modified_date_to);

			usage_date_from = dateISOToNetsuite(usage_date_from);
			date_signed_up_from = dateISOToNetsuite(date_signed_up_from);
			date_signed_up_to = dateISOToNetsuite(date_signed_up_to);
			date_quote_sent_from = dateISOToNetsuite(date_quote_sent_from);
			date_quote_sent_to = dateISOToNetsuite(date_quote_sent_to);

			console.log("date_from: " + date_from);
			console.log("date_to " + date_to);

			console.log("modified_date_from: " + modified_date_from);
			console.log("modified_date_to " + modified_date_to);

			console.log("date_signed_up_from: " + date_signed_up_from);
			console.log("date_signed_up_to " + date_signed_up_to);

			console.log("date_quote_sent_from: " + date_quote_sent_from);
			console.log("date_quote_sent_to " + date_quote_sent_to);

			console.log("lead_source " + lead_source);
			console.log("sales_campaign " + sales_campaign);
			console.log("parent_lpo " + parent_lpo);
			console.log("zee_id " + zee_id);

			// Lead Status Timeline - Grouped By Sales Rep
			var leadSalesRepTimelineSearch = search.load({
				type: "customer",
				id: "customsearch_lead_status_timeline_2_2",
			});

			if (!isNullorEmpty(leadStatus)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			leadSalesRepTimelineSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.IS,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(salesRepInternalId)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: salesRepInternalId,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (!isNullorEmpty(sales_campaign)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				leadSalesRepTimelineSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			// var defaultSearchFilters = leadSalesRepTimelineSearch.filterExpression;

			// console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

			if (
				!isNullorEmpty(modified_date_from) &&
				!isNullorEmpty(modified_date_to)
			) {
				var defaultSearchFilters = leadSalesRepTimelineSearch.filterExpression;

				console.log(
					"default search filters: " + JSON.stringify(defaultSearchFilters)
				);

				var modifiedDateFilters = [
					[
						["activity.date", "within", [modified_date_from, modified_date_to]],
						"AND",
						[
							"activity.custevent_organiser",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
					"AND",
					[
						[
							"usernotes.notedate",
							"within",
							[modified_date_from, modified_date_to],
						],
						"AND",
						[
							"usernotes.author",
							"anyof",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
				];
				console.log(
					"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
				);

				defaultSearchFilters.push("AND");
				defaultSearchFilters.push(modifiedDateFilters);

				console.log(
					"defaultSearchFilters filters: " +
					JSON.stringify(defaultSearchFilters)
				);

				leadSalesRepTimelineSearch.filterExpression = defaultSearchFilters;
			}

			var oldCustomerInternalId;
			var oldCustomerId;
			var oldCustomerName;
			var oldCustomerCurrentStatus;
			var oldCustomerSource;
			var oldCustomerZee;
			var oldStatusDate;

			var salesRepTimeLineCustomerArray = [];
			var childStatusTimeline = [];

			var countSalesRepTimeline = 0;

			leadSalesRepTimelineSearch
				.run()
				.each(function (leadSalesRepTimelineResultSet) {
					console.log("inside the search");
					var customerInternalId = leadSalesRepTimelineResultSet.getValue({
						name: "internalid",
						summary: "GROUP",
					});
					var customerId = leadSalesRepTimelineResultSet.getValue({
						name: "entityid",
						summary: "GROUP",
					});
					var customerName = leadSalesRepTimelineResultSet.getValue({
						name: "companyname",
						summary: "GROUP",
					});
					var customerCurrentStatus = leadSalesRepTimelineResultSet.getText({
						name: "entitystatus",
						summary: "GROUP",
					});

					var salesRepAssigned = leadSalesRepTimelineResultSet.getValue({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					});

					var oldStatus = leadSalesRepTimelineResultSet.getValue({
						name: "oldvalue",
						join: "systemNotes",
						summary: "GROUP",
					});

					var newStatus = leadSalesRepTimelineResultSet.getValue({
						name: "newvalue",
						join: "systemNotes",
						summary: "GROUP",
					});

					var systemNotesDate = leadSalesRepTimelineResultSet.getValue({
						name: "date",
						join: "systemNotes",
						summary: "GROUP",
					});

					var customerSource = leadSalesRepTimelineResultSet.getText({
						name: "leadsource",
						summary: "GROUP",
					});
					var customerZee = leadSalesRepTimelineResultSet.getText({
						name: "partner",
						summary: "GROUP",
					});

					var timeInStatusDays = 0;

					var systemNotesDateSplitSpace = systemNotesDate.split(" ");
					var systemNotesTime = convertTo24Hour(
						systemNotesDateSplitSpace[1] + " " + systemNotesDateSplitSpace[2]
					);
					var systemNotesDateSplit = systemNotesDateSplitSpace[0].split("/");
					if (parseInt(systemNotesDateSplit[1]) < 10) {
						systemNotesDateSplit[1] = "0" + systemNotesDateSplit[1];
					}

					if (parseInt(systemNotesDateSplit[0]) < 10) {
						systemNotesDateSplit[0] = "0" + systemNotesDateSplit[0];
					}

					systemNotesDate =
						systemNotesDateSplit[2] +
						"-" +
						systemNotesDateSplit[1] +
						"-" +
						systemNotesDateSplit[0];

					var onlyStatusDate = systemNotesDate;

					console.log("customerName: " + customerName);
					console.log("onlyStatusDate: " + onlyStatusDate);
					console.log("oldStatusDate: " + oldStatusDate);

					if (!isNullorEmpty(oldStatusDate) && oldStatus != "- None -") {
						var date1 = new Date(systemNotesDate);
						var date2 = new Date(oldStatusDate);

						var difference = date1.getTime() - date2.getTime();
						timeInStatusDays = Math.ceil(difference / (1000 * 3600 * 24));
					}
					console.log("timeInStatusDays: " + timeInStatusDays);
					systemNotesDate = systemNotesDate + " " + systemNotesTime;
					console.log("systemNotesDate: " + systemNotesDate);
					if (
						countSalesRepTimeline == 0 ||
						oldCustomerInternalId == customerInternalId
					) {
						childStatusTimeline.push({
							systemNotesDate: systemNotesDate,
							oldStatus: oldStatus,
							timeInStatusDays: timeInStatusDays,
							newStatus: newStatus,
						});
					} else if (oldCustomerInternalId != customerInternalId) {
						salesRepTimeLineCustomerArray.push([
							"",
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldCustomerInternalId +
							'" target="_blank" style="">' +
							oldCustomerId +
							"</a>",
							oldCustomerName,
							oldCustomerZee,
							oldCustomerCurrentStatus,
							oldCustomerSource,
							childStatusTimeline,
						]);

						childStatusTimeline = [];

						childStatusTimeline.push({
							systemNotesDate: systemNotesDate,
							oldStatus: oldStatus,
							timeInStatusDays: timeInStatusDays,
							newStatus: newStatus,
						});
					}

					oldCustomerInternalId = customerInternalId;
					oldCustomerId = customerId;
					oldCustomerName = customerName;
					oldCustomerCurrentStatus = customerCurrentStatus;
					oldCustomerSource = customerSource;
					oldCustomerZee = customerZee;

					oldStatusDate = onlyStatusDate;

					countSalesRepTimeline++;
					return true;
				});

			if (countSalesRepTimeline > 0) {
				salesRepTimeLineCustomerArray.push([
					"",
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					oldCustomerInternalId +
					'" target="_blank" style="">' +
					oldCustomerId +
					"</a>",
					oldCustomerName,
					oldCustomerZee,
					oldCustomerCurrentStatus,
					oldCustomerSource,
					childStatusTimeline,
				]);
			}

			// statusTimeLineTable += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="3"><b>TOTAL WORKING DAYS</b></th><th style="text-align: center"><b>' + totalTimeInStatusDays + '</b></th><th></th></tfoot>';
			// statusTimeLineTable += '</tbody></table></div>';

			var dataTableSalesRepTimelinePreview = $(
				"#salesrep_timeline_table"
			).DataTable({
				destroy: true,
				data: salesRepTimeLineCustomerArray,
				pageLength: 50,
				order: [2, "asc"],
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
						title: "STATUS TIMELINE",
						className: "dt-control",
						orderable: false,
						data: null,
						defaultContent:
							'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
					},
					{
						title: "ID", //1
					},
					{
						title: "COMPANY NAME", //2
					},
					{
						title: "FRANCHISEE", //3
					},
					{
						title: "STATUS", //4
					},
					{
						title: "SOURCE", //5
					},
					{
						title: "CHILD TABLE", //6
					},
				],
				columnDefs: [
					{
						targets: [0, 1, 2, 3],
						className: "bolded",
					},
					{
						targets: [6],
						visible: false,
					},
				],
				rowCallback: function (row, data, index) {
					var row_color = "";
					if (
						data[4] == "SUSPECT-Customer - Lost" ||
						data[4] == "SUSPECT-Lost"
					) {
						$("td", row).css("background-color", "#e97777");
					} else if (data[4] == "CUSTOMER-Signed") {
						$("td", row).css("background-color", "#ADCF9F");
					}
				},
				footerCallback: function (row, data, start, end, display) { },
			});

			dataTableSalesRepTimelinePreview.rows().every(function () {
				// this.child(format(this.data())).show();
				this.child(createChildSalesRepTimeline(this)); // Add Child Tables
				this.child.hide(); // Hide Child Tables on Open
			});

			$("#salesrep_timeline_table tbody").on(
				"click",
				"td.dt-control",
				function () {
					var tr = $(this).closest("tr");
					var row = dataTableSalesRepTimelinePreview.row(tr);

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
				}
			);

			$("#leadSalesRepModal .modal-title").text(
				salesRepName + "'s Customer List"
			);
			$("#leadSalesRepModal").show();
		});

		$(".closeSalesRepModal").click(function () {
			$("#leadSalesRepModal").hide();
		});
	}

	//Initialise the DataTable with headers.
	function submitSearch() {
		// userId = $('#user_dropdown option:selected').val();
		zee = $("#zee_dropdown").val();

		// if (userId == 409635) {
		loadDatatable(zee, userId);
		// }

		console.log("Loaded Results");
		afterSubmit();
	}

	//Function to add the filters and relaod the page
	function addFilters() {
		zee = $("#zee_dropdown").val();
		// userId = $('#user_dropdown option:selected').val();

		var url =
			baseURL +
			"/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=" +
			zee +
			"&user_id=" +
			userId;
		window.location.href = url;
	}

	function loadDatatable(zee_id, userId) {
		console.log("Website New Leads - Signed - Weekly Reporting");
		console.log("date_from: " + date_from);
		console.log("date_to " + date_to);

		console.log("modified_date_from: " + modified_date_from);
		console.log("modified_date_to " + modified_date_to);

		console.log("usage_date_from: " + usage_date_from);
		console.log("usage_date_to " + usage_date_to);

		console.log("usage_date_from: " + usage_date_from);
		console.log("usage_date_to " + usage_date_to);

		console.log("commence_date_from: " + commencement_start_date);
		console.log("commence_date_to " + commencement_last_date);
		console.log("cancel_date_from: " + cancelled_start_date);
		console.log("cancel_date_to " + cancelled_last_date);

		console.log("date_signed_up_from: " + date_signed_up_from);
		console.log("date_signed_up_to " + date_signed_up_to);

		console.log("date_quote_sent_from: " + date_quote_sent_from);
		console.log("date_quote_sent_to " + date_quote_sent_to);

		console.log("lead_source " + lead_source);
		console.log("sales_campaign " + sales_campaign);
		console.log("parent_lpo " + parent_lpo);
		console.log("sales_rep " + sales_rep);
		console.log("invoice_type " + invoice_type);
		console.log("invoice_date_from " + invoice_date_from);
		console.log("invoice_date_to " + invoice_date_to);

		console.log("zee_id " + zee_id);

		// if (role != 1000) {
		console.log("date_from:" + date_from);
		console.log("date_to:" + date_to);
		console.log("leadStatus:" + leadStatus);
		console.log("sales_activity_notes:" + sales_activity_notes);
		console.log("customer_type:" + customer_type);

		var employee_list_string = currRec.getValue({
			fieldId: "custpage_employee_list",
		});
		var employee_list_color_string = currRec.getValue({
			fieldId: "custpage_employee_list_color",
		});

		if (!isNullorEmpty(employee_list_string)) {
			employee_list = employee_list_string.split(",");
		}

		if (!isNullorEmpty(employee_list_color_string)) {
			employee_list_color = employee_list_color_string.split(",");
		}

		var campaign_list_string = currRec.getValue({
			fieldId: "custpage_campaign_list",
		});
		var campaign_list_color_string = currRec.getValue({
			fieldId: "custpage_campaign_list_color",
		});

		if (!isNullorEmpty(campaign_list_string)) {
			campaign_list = campaign_list_string.split(",");
		}

		if (!isNullorEmpty(campaign_list_color_string)) {
			campaign_list_color = campaign_list_color_string.split(",");
		}

		console.log("employee_list " + employee_list);
		console.log("employee_list_color " + employee_list_color);

		console.log("campaign_list " + campaign_list);
		console.log("campaign_list_color " + campaign_list_color);

		var source_list_string = currRec.getValue({
			fieldId: "custpage_source_list",
		});
		var source_list_color_string = currRec.getValue({
			fieldId: "custpage_source_list_color",
		});

		if (!isNullorEmpty(source_list_string)) {
			source_list = source_list_string.split(",");
		}

		if (!isNullorEmpty(source_list_color_string)) {
			source_list_color = source_list_color_string.split(",");
		}

		console.log("source_list " + source_list);
		console.log("source_list_color " + source_list_color);

		if (
			role == 1000 &&
			isNullorEmpty(zee_id) &&
			isNullorEmpty(sales_rep) &&
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			alert(
				"Please select Sales Rep while selecting the Modified Date From & To filters."
			);
			return false;
		}

		var showCallForceTasks = false;
		var showFranchiseeLeadsPieChart = false;

		if (isNullorEmpty(sales_campaign)) {
			// showCallForceTasks = true;
			// showFranchiseeLeadsPieChart = true;
		} else {
			if (sales_campaign.indexOf(",") != -1) {
				var campaignArray = sales_campaign.split(",");
			} else {
				var campaignArray = [];
				campaignArray.push(sales_campaign);
			}

			console.log("campaignArray.length: " + campaignArray.length);

			for (var y = 0; y < campaignArray.length; y++) {
				if (parseInt(campaignArray[y]) == 87) {
					showCallForceTasks = true;
				}
				if (parseInt(campaignArray[y]) == 70) {
					showFranchiseeLeadsPieChart = true;
				}
			}
		}

		if (showFranchiseeLeadsPieChart == true) {
			console.log("Before Search Name: Zee Lead by Status - Weekly Reporting");
			if (role == 1000) {
				//Search Name: Zee Lead by Status - Monthly Reporting
				var qualifiedLeadCountSearch = search.load({
					type: "customer",
					id: "customsearch_zee_lead_by_status_monthly",
				});
			} else {
				//Search Name: Zee Lead by Status - Weekly Reporting
				var qualifiedLeadCountSearch = search.load({
					type: "customer",
					id: "customsearch_leads_reporting_weekly_3__2",
				});
			}

			qualifiedLeadCountSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (!isNullorEmpty(zee_id)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(cancelled_start_date) &&
				!isNullorEmpty(cancelled_last_date)
			) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity13",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: cancelled_start_date,
					})
				);

				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity13",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: cancelled_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(sales_campaign)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}

			if (customer_type == "2") {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "TEST",
					})
				);
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				qualifiedLeadCountSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			if (
				!isNullorEmpty(modified_date_from) &&
				!isNullorEmpty(modified_date_to)
			) {
				var defaultSearchFilters = qualifiedLeadCountSearch.filterExpression;

				console.log(
					"default search filters: " + JSON.stringify(defaultSearchFilters)
				);

				var modifiedDateFilters = [
					[
						["activity.date", "within", [modified_date_from, modified_date_to]],
						"AND",
						[
							"activity.custevent_organiser",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
					"AND",
					[
						[
							"usernotes.notedate",
							"within",
							[modified_date_from, modified_date_to],
						],
						"AND",
						[
							"usernotes.author",
							"anyof",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
				];
				console.log(
					"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
				);

				defaultSearchFilters.push("AND");
				defaultSearchFilters.push(modifiedDateFilters);

				console.log(
					"defaultSearchFilters filters: " +
					JSON.stringify(defaultSearchFilters)
				);

				qualifiedLeadCountSearch.filterExpression = defaultSearchFilters;
			}

			var totalLeadCount = 0;
			var totalCustomerCount = 0;
			var totalSuspectCount = 0;
			var totalProspectCount = 0;
			var totalCustomerLostCount = 0;
			var totalQualifiedLeadCount = 0;
			var totalLeadLost = 0;

			qualifiedLeadCountSearch
				.run()
				.each(function (qualifiedLeadCountSearchResultSet) {
					var leadCount = parseInt(
						qualifiedLeadCountSearchResultSet.getValue({
							name: "internalid",
							summary: "COUNT",
						})
					);
					var dateLeadEntered = qualifiedLeadCountSearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
					var leadStatus = qualifiedLeadCountSearchResultSet.getText({
						name: "entitystatus",
						summary: "GROUP",
					});
					var leadStatusId = qualifiedLeadCountSearchResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					});

					var leadStatusSplit = leadStatus.split("-");

					totalLeadCount = totalLeadCount + leadCount;

					if (leadStatusId == 22) {
						totalCustomerLostCount = totalCustomerLostCount + leadCount;
					}

					if (leadStatusId == 13 || leadStatusId == 66) {
						totalCustomerCount = totalCustomerCount + leadCount;
					}

					if (
						leadStatusSplit[0].toUpperCase() == "SUSPECT" &&
						leadStatusId != 59
					) {
						totalSuspectCount = totalSuspectCount + leadCount;
					}

					if (leadStatusSplit[0].toUpperCase() == "PROSPECT") {
						totalProspectCount = totalProspectCount + leadCount;
					}

					if (leadStatusId == 59) {
						totalLeadLost = totalLeadLost + leadCount;
					}

					return true;
				});

			// Create the chart
			Highcharts.chart("container-progress", {
				chart: {
					type: "pie",
					backgroundColor: "#CFE0CE",
				},
				title: {
					text: "",
				},
				accessibility: {
					announceNewData: {
						enabled: true,
					},
					point: {
						valueSuffix: "",
					},
				},

				plotOptions: {
					series: {
						allowPointSelect: true,
						cursor: "pointer",
						dataLabels: [
							{
								enabled: true,
								distance: 20,
								style: {
									fontSize: "1.2em",
									textOutline: "none",
									opacity: 0.7,
								},
							},
							{
								enabled: true,
								distance: -40,
								format: "{point.y:.0f}",
								style: {
									fontSize: "1.2em",
									textOutline: "none",
									opacity: 0.7,
								},
							},
						],
					},
				},

				tooltip: {
					valueSuffix: "",
					style: {
						fontSize: "1.2em",
					},
				},

				series: [
					{
						name: "Leads",
						colorByPoint: true,
						data: [
							{
								name: "Customers",
								y: totalCustomerCount,
								sliced: true,
								selected: true,
								color: "#5cb3b0",
							},
							{
								name: "Prospects",
								y: totalProspectCount,
								sliced: true,
								color: "#adcf9f",
							},
							{
								name: "Suspects",
								y: totalSuspectCount,
								sliced: true,
								color: "#FEBE8C",
							},
							{
								name: "Suspects - Lost",
								y: totalLeadLost,
								sliced: true,
								color: "#e97677",
							},
							{
								name: "Customers - Lost",
								y: totalCustomerLostCount,
								sliced: true,
								color: "#e76252",
							},
						],
					},
				],
			});
		}

		console.log("showCallForceTasks: " + showCallForceTasks);

		//!Creating a reporting tab based on the tasks created for the Call Force campaign.
		if (showCallForceTasks == true) {
			//Get the count of the list of leads sent to Call Force
			//Call Force Campaign - Suspect Unqualified List
			var callForceLeadsListSearch = search.load({
				type: "customer",
				id: "customsearch_lpo_unqualifed_list_3",
			});

			callForceLeadsListSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "TEST",
					})
				);
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}
			if (!isNullorEmpty(sales_campaign)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}
			if (!isNullorEmpty(parent_lpo)) {
				callForceLeadsListSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			var callForceLeadsListCount = callForceLeadsListSearch.runPaged().count;

			//Get the count of leads that is Qualified but with No Appointment
			//NetSuite Search:Call Force Campaign - Suspect Qualified List - With No Tasks
			var qualifiedLeadsListWithNoTasksSearch = search.load({
				type: "customer",
				id: "customsearch_lpo_unqualifed_list_2_3",
			});

			qualifiedLeadsListWithNoTasksSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "TEST",
					})
				);
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}
			if (!isNullorEmpty(sales_campaign)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}
			if (!isNullorEmpty(parent_lpo)) {
				qualifiedLeadsListWithNoTasksSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			var totalQualifiedLeadWithNoTasks = 0;

			qualifiedLeadsListWithNoTasksSearch
				.run()
				.each(function (qualifiedLeadsListSearchResult) {
					var custInternalID = qualifiedLeadsListSearchResult.getValue({
						name: "internalid",
						summary: "GROUP",
					});
					//NetSuite Search: Call Force Tasks - All
					var callForceAllTasksSearch = search.load({
						type: "task",
						id: "customsearch9085",
					});
					callForceAllTasksSearch.filters.push(
						search.createFilter({
							name: "internalid",
							join: "companyCustomer",
							operator: search.Operator.IS,
							values: custInternalID,
						})
					);

					var callForceAllTasksSearchCount =
						callForceAllTasksSearch.runPaged().count;

					if (callForceAllTasksSearchCount == 0) {
						totalQualifiedLeadWithNoTasks++;
					}
					return true;
				});

			//Sales Reporting - Call Force Campaign - With Tasks
			var callForceTasksSearch = search.load({
				type: "customer",
				id: "customsearch_lpo_unqualifed_list_2_2_2",
			});

			callForceTasksSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "TEST",
					})
				);
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}
			if (!isNullorEmpty(sales_campaign)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}
			if (!isNullorEmpty(parent_lpo)) {
				callForceTasksSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			var countCallForceTasks = 0;
			var oldCallForceDate = null;

			var scheduledCallForceTasks = 0;
			var rescheduledCallForceTasks = 0;
			var completedCallForceTasks = 0;
			var totalCallForceTasks = 0;

			var totalCompletedTasks = 0;
			var totalScheduledTasks = 0;
			var totalRescheduledTasks = 0;

			callForceTasksSearch.run().each(function (callForceTasksSearchResultSet) {
				var tasksCount = parseInt(
					callForceTasksSearchResultSet.getValue({
						name: "internalid",
						join: "task",
						summary: "COUNT",
					})
				);

				var taskDate = callForceTasksSearchResultSet.getValue({
					name: "duedate",
					join: "task",
					summary: "GROUP",
				});

				var taskStatus = callForceTasksSearchResultSet.getText({
					name: "status",
					join: "task",
					summary: "GROUP",
				});

				var taskTitle = callForceTasksSearchResultSet
					.getValue({
						name: "formulatext",
						summary: "GROUP",
						formula: "TRIM(REGEXP_SUBSTR({task.title},'^[^-]*'))",
					})
					.toString();

				if (countCallForceTasks == 0 || taskDate == oldCallForceDate) {
					if (taskTitle.replace(/\s+$/, "") == "Rescheduled Call Force Appointment") {
						rescheduledCallForceTasks = rescheduledCallForceTasks + tasksCount;
						totalRescheduledTasks = totalRescheduledTasks + tasksCount;
					} else {
						if (taskStatus == "Completed") {
							completedCallForceTasks = completedCallForceTasks + tasksCount;
							totalCompletedTasks = totalCompletedTasks + tasksCount;
						} else if (taskStatus == "Not Started") {
							scheduledCallForceTasks = scheduledCallForceTasks + tasksCount;
							totalScheduledTasks = totalScheduledTasks + tasksCount;
						}
					}

					totalCallForceTasks = totalCallForceTasks + tasksCount;
				} else if (taskDate != oldCallForceDate) {
					var taskDueDate = convertToDateInputFormat(oldCallForceDate);

					callForceTasksDataSet.push([
						taskDueDate,
						scheduledCallForceTasks,
						rescheduledCallForceTasks,
						completedCallForceTasks,
						totalCallForceTasks,
					]);

					scheduledCallForceTasks = 0;
					rescheduledCallForceTasks = 0;
					completedCallForceTasks = 0;
					totalCallForceTasks = 0;

					if (taskTitle.replace(/\s+$/, "") == "Rescheduled Call Force Appointment") {
						rescheduledCallForceTasks = rescheduledCallForceTasks + tasksCount;
						totalRescheduledTasks = totalRescheduledTasks + tasksCount;
					} else {
						if (taskStatus == "Completed") {
							completedCallForceTasks = completedCallForceTasks + tasksCount;
							totalCompletedTasks = totalCompletedTasks + tasksCount;
						} else if (taskStatus == "Not Started") {
							scheduledCallForceTasks = scheduledCallForceTasks + tasksCount;
							totalScheduledTasks = totalScheduledTasks + tasksCount;
						}
					}
					totalCallForceTasks = totalCallForceTasks + tasksCount;
				}

				oldCallForceDate = taskDate;
				countCallForceTasks++;
				return true;
			});

			if (countCallForceTasks > 0) {
				var taskDueDate = convertToDateInputFormat(oldCallForceDate);

				callForceTasksDataSet.push([
					taskDueDate,
					scheduledCallForceTasks,
					rescheduledCallForceTasks,
					completedCallForceTasks,
					totalCallForceTasks,
				]);
			}

			console.log("callForceTasksDataSet" + callForceTasksDataSet);

			var dataTable3 = $("#mpexusage-callforcetasks").DataTable({
				data: callForceTasksDataSet,
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
					{ title: "Task Date (Week Starting)" },
					{ title: "Scheduled Tasks" },
					{ title: "Rescheduled Tasks" },
					{ title: "Completed Tasks" },
					{ title: "Total Tasks" },
				],
				autoWidth: true,
				columnDefs: [
					{
						targets: [0, 4],
						className: "bolded",
					},
				],
				rowCallback: function (row, data, index) {
					var row_color = "";
					if (parseInt(data[1]) > 0) {
						$(row).find("td:eq(1)").css("background-color", "#f9c67a");
					}
					if (parseInt(data[3]) > 0) {
						$(row).find("td:eq(3)").css("background-color", "#439A97");
					}
				},
				footerCallback: function (row, data, start, end, display) {
					var api = this.api(),
						data;

					// Remove the formatting to get integer data for summation
					var intVal = function (i) {
						return parseInt(i);
					};

					// Total Customer Free Trial Pending
					total_scheduled = api
						.column(1)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial
					total_rescheduled = api
						.column(2)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Signed
					total_completed = api
						.column(3)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_total = api
						.column(4)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					$(api.column(1).footer()).html(total_scheduled);
					$(api.column(2).footer()).html(total_rescheduled);
					$(api.column(3).footer()).html(total_completed);
					$(api.column(4).footer()).html(total_total);
				},
			});

			// Create the pie chart for Call Force Tasks & Leads
			Highcharts.chart("container-callforce_progress", {
				chart: {
					type: "pie",
					backgroundColor: "#CFE0CE",
				},
				title: {
					text: "",
				},
				accessibility: {
					announceNewData: {
						enabled: true,
					},
					point: {
						valueSuffix: "",
					},
				},

				plotOptions: {
					pie: {
						allowPointSelect: true,
						borderWidth: 2,
						cursor: "pointer",
						dataLabels: {
							enabled: true,
							format: "<b>{point.name}</b><br>{point.y:.0f}",
							distance: 20,
							style: {
								textOutline: "none",
								opacity: 0.7,
							},
						},
					},
				},
				tooltip: {
					headerFormat: "",
					pointFormat:
						'<span style="color:{point.color}">\u25cf</span> ' +
						"{point.name}: <b>{point.y:.0f}</b>",
				},
				series: [
					{
						name: "Leads",
						colorByPoint: true,
						animation: {
							duration: 2000,
						},
						data: [
							{
								name: "Qualified Leads - Completed Appointment",
								y: totalCompletedTasks,
								sliced: true,
								selected: true,
								color: "#5cb3b0",
							},
							{
								name: "Unqualified Leads - Sent to Call Force",
								y: callForceLeadsListCount,
								sliced: false,
								color: "#7FCAFFFF",
							},
							{
								name: "Qualified Leads - Scheduled Appointment",
								y: totalScheduledTasks,
								sliced: false,
								color: "#FEBE8C",
							},
							{
								name: "Qualified Leads - No Appointment",
								y: totalQualifiedLeadWithNoTasks,
								sliced: false,
								color: "#F5F0F0FF",
							},
						],
					},
				],
			});

			//Call Force 202501 Campaign - Count by Date Synced and Outcome
			var callForceLeadsCountBydateSyncedOutcomeSearch = search.load({
				type: "customer",
				id: "customsearch_callforce_count_sync_outcom",
			});

			callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				// callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
				// 	search.createFilter({
				// 		name: "companyname",
				// 		join: null,
				// 		operator: search.Operator.DOESNOTSTARTWITH,
				// 		values: "TEST",
				// 	})
				// );
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				callForceLeadsCountBydateSyncedOutcomeSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			var oldCallforceSyncDate = null;
			var countCallforceSyncDateCount = 0;

			var total_no_outcome = 0;
			var total_not_interested = 0;
			var total_no_answer = 0;
			var total_voicemail = 0;
			var total_wrong_number = 0;
			var total_disconnected = 0;
			var total_remove_from_list = 0;
			var total_busy = 0;
			var total_callback = 0;
			var total_email_interested = 0;
			var total_email_brush_off = 0;
			var total_interested = 0;
			var total_leads = 0;

			callForceLeadsCountBydateSyncedOutcomeSearch
				.run()
				.each(function (callForceLeadsCountBydateSyncedOutcomeResultSet) {
					var callforceLeadCount = parseInt(
						callForceLeadsCountBydateSyncedOutcomeResultSet.getValue({
							name: "internalid",
							summary: "COUNT",
						})
					);

					var callforceSyncDate =
						callForceLeadsCountBydateSyncedOutcomeResultSet.getValue({
							name: "custrecord_cf_date_sent",
							join: "CUSTRECORD_SALES_CUSTOMER",
							summary: "GROUP",
						});

					var callforceSyncDateSplit = callforceSyncDate.split("/");
					callforceSyncDate =
						callforceSyncDateSplit[2] +
						"-" +
						callforceSyncDateSplit[1] +
						"-" +
						callforceSyncDateSplit[0];

					var callforceOutcome = callForceLeadsCountBydateSyncedOutcomeResultSet
						.getValue({
							name: "custrecord_cf_call_outcome",
							join: "CUSTRECORD_SALES_CUSTOMER",
							summary: "GROUP",
						})
						.toLowerCase();

					console.log("callforceSyncDate: " + callforceSyncDate);
					console.log("callforceOutcome: " + callforceOutcome);
					console.log("callforceLeadCount: " + callforceLeadCount);

					if (
						countCallforceSyncDateCount != 0 &&
						callforceSyncDate != oldCallforceSyncDate
					) {
						var totalNoOutcomePercentage = parseInt(
							(total_no_outcome / total_leads) * 100
						);
						var totalNoOutcomeCol =
							total_no_outcome + " (" + totalNoOutcomePercentage + "%)";

						var totalNotInterestedPercentage = parseInt(
							(total_not_interested / total_leads) * 100
						);
						var totalNotInterestedCol =
							total_not_interested + " (" + totalNotInterestedPercentage + "%)";

						var totalNoAnswerPercentage = parseInt(
							(total_no_answer / total_leads) * 100
						);
						var totalNoAnswerCol =
							total_no_answer + " (" + totalNoAnswerPercentage + "%)";

						var totalVoicemailPercentage = parseInt(
							(total_voicemail / total_leads) * 100
						);
						var totalVoicemailCol =
							total_voicemail + " (" + totalVoicemailPercentage + "%)";

						var totalWrongNumberPercentage = parseInt(
							(total_wrong_number / total_leads) * 100
						);
						var totalWrongNumberCol =
							total_wrong_number + " (" + totalWrongNumberPercentage + "%)";

						var totalDisconnectedPercentage = parseInt(
							(total_disconnected / total_leads) * 100
						);
						var totalDisconnectedCol =
							total_disconnected + " (" + totalDisconnectedPercentage + "%)";

						var totalRemoveFromListPercentage = parseInt(
							(total_remove_from_list / total_leads) * 100
						);
						var totalRemoveFromListCol =
							total_remove_from_list +
							" (" +
							totalRemoveFromListPercentage +
							"%)";

						var totalBusyPercentage = parseInt(
							(total_busy / total_leads) * 100
						);
						var totalBusyCol = total_busy + " (" + totalBusyPercentage + "%)";

						var totalCallBackPercentage = parseInt(
							(total_callback / total_leads) * 100
						);
						var totalCallBackCol =
							total_callback + " (" + totalCallBackPercentage + "%)";

						var totalEmailInterestedPercentage = parseInt(
							(total_email_interested / total_leads) * 100
						);
						var totalEmailInterestedCol =
							total_email_interested +
							" (" +
							totalEmailInterestedPercentage +
							"%)";

						var totalEmailBrushOffPercentage = parseInt(
							(total_email_brush_off / total_leads) * 100
						);
						var totalEmailBrushOffCol =
							total_email_brush_off +
							" (" +
							totalEmailBrushOffPercentage +
							"%)";

						var totalInterestedPercentage = parseInt(
							(total_interested / total_leads) * 100
						);
						var totalInterestedCol =
							total_interested + " (" + totalInterestedPercentage + "%)";

						callForceDateSyncedOutcomeDataSet.push([
							oldCallforceSyncDate,
							totalNoOutcomeCol,
							totalNotInterestedCol,
							totalNoAnswerCol,
							totalVoicemailCol,
							totalWrongNumberCol,
							totalDisconnectedCol,
							totalRemoveFromListCol,
							totalBusyCol,
							totalCallBackCol,
							totalEmailInterestedCol,
							totalEmailBrushOffCol,
							totalInterestedCol,
							total_leads,
						]);

						total_no_outcome = 0;
						total_not_interested = 0;
						total_no_answer = 0;
						total_voicemail = 0;
						total_wrong_number = 0;
						total_disconnected = 0;
						total_remove_from_list = 0;
						total_busy = 0;
						total_callback = 0;
						total_email_interested = 0;
						total_email_brush_off = 0;
						total_interested = 0;
						total_leads = 0;
					}

					if (callforceOutcome == "not_interested") {
						total_not_interested += callforceLeadCount;
					} else if (callforceOutcome == "no_answer") {
						total_no_answer += callforceLeadCount;
					} else if (callforceOutcome == "voicemail") {
						total_voicemail += callforceLeadCount;
					} else if (callforceOutcome == "wrong_number") {
						total_wrong_number += callforceLeadCount;
					} else if (callforceOutcome == "disconnected") {
						total_disconnected += callforceLeadCount;
					} else if (callforceOutcome == "remove_from_list") {
						total_remove_from_list += callforceLeadCount;
					} else if (callforceOutcome == "busy") {
						total_busy += callforceLeadCount;
					} else if (callforceOutcome == "callback") {
						total_callback += callforceLeadCount;
					} else if (callforceOutcome == "email_interested") {
						total_email_interested += callforceLeadCount;
					} else if (callforceOutcome == "email_brush_off") {
						total_email_brush_off += callforceLeadCount;
					} else if (callforceOutcome == "interested") {
						total_interested += callforceLeadCount;
					} else {
						total_no_outcome += callforceLeadCount;
					}

					total_leads += callforceLeadCount;

					oldCallforceSyncDate = callforceSyncDate;
					countCallforceSyncDateCount++;
					return true;
				});

			console.log(
				"countCallforceSyncDateCount: " + countCallforceSyncDateCount
			);
			if (countCallforceSyncDateCount > 0) {
				var totalNoOutcomePercentage = parseInt(
					(total_no_outcome / total_leads) * 100
				).toFixed(0);
				var totalNoOutcomeCol =
					total_no_outcome + " (" + totalNoOutcomePercentage + "%)";

				var totalNotInterestedPercentage = parseInt(
					(total_not_interested / total_leads) * 100
				).toFixed(0);
				var totalNotInterestedCol =
					total_not_interested + " (" + totalNotInterestedPercentage + "%)";

				var totalNoAnswerPercentage = parseInt(
					(total_no_answer / total_leads) * 100
				).toFixed(0);
				var totalNoAnswerCol =
					total_no_answer + " (" + totalNoAnswerPercentage + "%)";

				var totalVoicemailPercentage = parseInt(
					(total_voicemail / total_leads) * 100
				).toFixed(0);
				var totalVoicemailCol =
					total_voicemail + " (" + totalVoicemailPercentage + "%)";

				var totalWrongNumberPercentage = parseInt(
					(total_wrong_number / total_leads) * 100
				).toFixed(0);
				var totalWrongNumberCol =
					total_wrong_number + " (" + totalWrongNumberPercentage + "%)";

				var totalDisconnectedPercentage = parseInt(
					(total_disconnected / total_leads) * 100
				).toFixed(0);
				var totalDisconnectedCol =
					total_disconnected + " (" + totalDisconnectedPercentage + "%)";

				var totalRemoveFromListPercentage = parseInt(
					(total_remove_from_list / total_leads) * 100
				).toFixed(0);
				var totalRemoveFromListCol =
					total_remove_from_list + " (" + totalRemoveFromListPercentage + "%)";

				var totalBusyPercentage = parseInt(
					(total_busy / total_leads) * 100
				).toFixed(0);
				var totalBusyCol = total_busy + " (" + totalBusyPercentage + "%)";

				var totalCallBackPercentage = parseInt(
					(total_callback / total_leads) * 100
				).toFixed(0);
				var totalCallBackCol =
					total_callback + " (" + totalCallBackPercentage + "%)";

				var totalEmailInterestedPercentage = parseInt(
					(total_email_interested / total_leads) * 100
				).toFixed(0);
				var totalEmailInterestedCol =
					total_email_interested + " (" + totalEmailInterestedPercentage + "%)";

				var totalEmailBrushOffPercentage = parseInt(
					(total_email_brush_off / total_leads) * 100
				).toFixed(0);
				var totalEmailBrushOffCol =
					total_email_brush_off + " (" + totalEmailBrushOffPercentage + "%)";

				var totalInterestedPercentage = parseInt(
					(total_interested / total_leads) * 100
				).toFixed(0);
				var totalInterestedCol =
					total_interested + " (" + totalInterestedPercentage + "%)";

				callForceDateSyncedOutcomeDataSet.push([
					oldCallforceSyncDate,
					totalNoOutcomeCol,
					totalNotInterestedCol,
					totalNoAnswerCol,
					totalVoicemailCol,
					totalWrongNumberCol,
					totalDisconnectedCol,
					totalRemoveFromListCol,
					totalBusyCol,
					totalCallBackCol,
					totalEmailInterestedCol,
					totalEmailBrushOffCol,
					totalInterestedCol,
					total_leads,
				]);
			}

			console.log(
				"callForceDateSyncedOutcomeDataSet" + callForceDateSyncedOutcomeDataSet
			);

			var dataTableCallForceDateSyncedOutcome = $(
				"#mpexusage-callForceDateSyncedOutcome"
			).DataTable({
				data: callForceDateSyncedOutcomeDataSet,
				pageLength: 250,
				order: [],
				responsive: true,
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
					{ title: "Period" }, //0
					{ title: "No Outcome" }, //1
					{ title: "Not Interested" }, //2
					{ title: "No Answer" }, //3
					{ title: "Voicemail" }, //4
					{ title: "Wrong Number" }, //5
					{ title: "Disconnected" }, //6
					{ title: "Remove From List" }, //7
					{ title: "Busy" }, //8
					{ title: "Call Back" }, //9
					{ title: "Email Interested" }, //10
					{ title: "Email Brush Off" }, //11
					{ title: "Interested" }, //12
					{ title: "Total" }, //13
				],
				autoWidth: true,
				columnDefs: [
					{
						targets: [0, 10, 11, 12],
						className: "bolded",
					},
				],
				rowCallback: function (row, data, index) {
					var row_color = ""
					$(row).find("td:eq(10)").css("background-color", "#b1ecc7");
					$(row).find("td:eq(11)").css("background-color", "#f9c67a");
					$(row).find("td:eq(12)").css("background-color", "#439A97");

				},
				footerCallback: function (row, data, start, end, display) {
					var api = this.api(),
						data;

					// Remove the formatting to get integer data for summation
					var intVal = function (i) {
						return parseInt(i);
					};

					// Total Customer Free Trial Pending
					total_no_outcome = api
						.column(1)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_not_interested = api
						.column(2)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial
					total_no_answer = api
						.column(3)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Signed
					total_voicemail = api
						.column(4)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_wrong_number = api
						.column(5)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_disconnected = api
						.column(6)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_remove_from_list = api
						.column(7)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_busy = api
						.column(8)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_callback = api
						.column(9)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_email_interested = api
						.column(10)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_email_brush_off = api
						.column(11)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_interested = api
						.column(12)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);
					total_leads = api
						.column(13)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					$(api.column(1).footer()).html(
						total_no_outcome +
						" (" +
						((total_no_outcome / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(2).footer()).html(
						total_not_interested +
						" (" +
						((total_not_interested / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(3).footer()).html(
						total_no_answer +
						" (" +
						((total_no_answer / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(4).footer()).html(
						total_voicemail +
						" (" +
						((total_voicemail / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(5).footer()).html(
						total_wrong_number +
						" (" +
						((total_wrong_number / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(6).footer()).html(
						total_disconnected +
						" (" +
						((total_disconnected / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(7).footer()).html(
						total_remove_from_list +
						" (" +
						((total_remove_from_list / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(8).footer()).html(
						total_busy +
						" (" +
						((total_busy / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(9).footer()).html(
						total_callback +
						" (" +
						((total_callback / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(10).footer()).html(
						total_email_interested +
						" (" +
						((total_email_interested / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(11).footer()).html(
						total_email_brush_off +
						" (" +
						((total_email_brush_off / total_leads) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(12).footer()).html(
						total_interested +
						" (" +
						((total_interested / total_leads) * 100).toFixed(0) +
						"%)"
					);

					// $(api.column(1).footer()).html(total_no_outcome);
					// $(api.column(2).footer()).html(total_not_interested);
					// $(api.column(3).footer()).html(total_no_answer);
					// $(api.column(4).footer()).html(total_voicemail);
					// $(api.column(5).footer()).html(total_wrong_number);
					// $(api.column(6).footer()).html(total_disconnected);
					// $(api.column(7).footer()).html(total_remove_from_list);
					// $(api.column(8).footer()).html(total_busy);
					// $(api.column(9).footer()).html(total_callback);
					// $(api.column(10).footer()).html(total_email_interested);
					// $(api.column(11).footer()).html(total_email_brush_off);
					// $(api.column(12).footer()).html(total_interested);
					$(api.column(13).footer()).html(total_leads);
				},
			});

			//Call Force 202501 Campaign - Count by Outcome & Lead Status
			var callForceLeadsCountByOutcomeStatusSearch = search.load({
				type: "customer",
				id: "customsearch_callforce202501_unqualifi_7",
			});

			callForceLeadsCountByOutcomeStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				// callForceLeadsCountByOutcomeStatusSearch.filters.push(
				// 	search.createFilter({
				// 		name: "companyname",
				// 		join: null,
				// 		operator: search.Operator.DOESNOTSTARTWITH,
				// 		values: "TEST",
				// 	})
				// );
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				callForceLeadsCountByOutcomeStatusSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			var oldCallforceOutcome = null;
			var countCallforceSyncOutcomeCount = 0;

			var customer_signed = 0;
			var customer_shipmate_pending = 0;
			var suspect_hot_lead = 0;
			var suspect_reassign = 0;
			var suspect_lost = 0;
			var suspect_customer_lost = 0;
			var suspect_off_peak_pipeline = 0;
			var prospect_opportunity = 0;
			var prospecy_quote_sent = 0;
			var prospecy_box_sent = 0;
			var prospect_no_answer = 0;
			var prospect_in_contact = 0;
			var suspect_oot = 0;
			var suspect_pre_qualification = 0;
			var suspect_new = 0;
			var suspect_qualified = 0;
			var suspect_pre_qualification = 0;
			var suspect_in_qualification = 0;
			var suspect_unqualified = 0;
			var suspect_in_qualification = 0;
			var total_leads = 0;
			var prospect_qualified = 0;

			var suspect_validated = 0;
			var customer_free_trial = 0;
			var customer_free_trial_pending = 0;
			var suspect_no_answer = 0;
			var suspect_in_contact = 0;

			callForceLeadsCountByOutcomeStatusSearch
				.run()
				.each(function (callForceLeadsCountByOutcomeStatusResultSet) {
					var prospectCount = parseInt(
						callForceLeadsCountByOutcomeStatusResultSet.getValue({
							name: "internalid",
							summary: "COUNT",
						})
					);

					var custStatus = callForceLeadsCountByOutcomeStatusResultSet.getValue(
						{
							name: "entitystatus",
							summary: "GROUP",
						}
					);

					var callforceOutcome =
						callForceLeadsCountByOutcomeStatusResultSet.getValue({
							name: "custrecord_cf_call_outcome",
							join: "CUSTRECORD_SALES_CUSTOMER",
							summary: "GROUP",
						});

					console.log("prospectCount: " + prospectCount);
					console.log("custStatus: " + custStatus);
					console.log("callforceOutcome: " + callforceOutcome);

					if (
						countCallforceSyncOutcomeCount != 0 &&
						callforceOutcome != oldCallforceOutcome
					) {
						callForceOutcomeStatusDataSet.push({
							callOutcome: oldCallforceOutcome,
							suspect_hot_lead: suspect_hot_lead,
							prospecy_quote_sent: prospecy_quote_sent,
							suspect_reassign: suspect_reassign,
							prospect_no_answer: prospect_no_answer,
							prospect_in_contact: prospect_in_contact,
							suspect_off_peak_pipeline: suspect_off_peak_pipeline,
							suspect_lost: suspect_lost,
							suspect_customer_lost: suspect_customer_lost,
							prospect_opportunity: prospect_opportunity,
							customer_signed: customer_signed,
							total_leads: total_leads,
							suspect_oot: suspect_oot,
							suspect_pre_qualification: suspect_pre_qualification,
							suspect_new: suspect_new,
							suspect_qualified: suspect_qualified,
							suspect_unqualified: suspect_unqualified,
							suspect_in_qualification: suspect_in_qualification,
							suspect_validated: suspect_validated,
							customer_free_trial: customer_free_trial,
							suspect_no_answer: suspect_no_answer,
							suspect_in_contact: suspect_in_contact,
							prospect_qualified: prospect_qualified,
							customer_free_trial_pending: customer_free_trial_pending,
							customer_shipmate_pending: customer_shipmate_pending,
							prospect_box_sent: prospecy_box_sent,
						});

						customer_signed = 0;
						suspect_hot_lead = 0;
						suspect_reassign = 0;
						suspect_lost = 0;
						suspect_customer_lost = 0;
						suspect_off_peak_pipeline = 0;
						prospect_opportunity = 0;
						prospecy_quote_sent = 0;
						prospecy_box_sent = 0;
						prospect_no_answer = 0;
						prospect_in_contact = 0;
						suspect_oot = 0;
						suspect_pre_qualification = 0;
						suspect_new = 0;
						suspect_qualified = 0;
						suspect_pre_qualification = 0;
						suspect_in_qualification = 0;
						suspect_unqualified = 0;
						suspect_in_qualification = 0;
						total_leads = 0;
						prospect_qualified = 0;
						customer_shipmate_pending = 0;

						suspect_validated = 0;
						customer_free_trial = 0;
						customer_free_trial_pending = 0;
						suspect_no_answer = 0;
						suspect_in_contact = 0;
					}

					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//SUSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//SUSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_pre_qualification +
						suspect_new +
						suspect_qualified +
						suspect_in_qualification +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent + customer_shipmate_pending;

					oldCallforceOutcome = callforceOutcome;
					countCallforceSyncOutcomeCount++;
					return true;
				});

			console.log(
				"countCallforceSyncOutcomeCount: " + countCallforceSyncOutcomeCount
			);
			if (countCallforceSyncOutcomeCount > 0) {
				callForceOutcomeStatusDataSet.push({
					callOutcome: oldCallforceOutcome,
					suspect_hot_lead: suspect_hot_lead,
					prospecy_quote_sent: prospecy_quote_sent,
					suspect_reassign: suspect_reassign,
					prospect_no_answer: prospect_no_answer,
					prospect_in_contact: prospect_in_contact,
					suspect_off_peak_pipeline: suspect_off_peak_pipeline,
					suspect_lost: suspect_lost,
					suspect_customer_lost: suspect_customer_lost,
					prospect_opportunity: prospect_opportunity,
					customer_signed: customer_signed,
					total_leads: total_leads,
					suspect_oot: suspect_oot,
					suspect_pre_qualification: suspect_pre_qualification,
					suspect_new: suspect_new,
					suspect_qualified: suspect_qualified,
					suspect_unqualified: suspect_unqualified,
					suspect_in_qualification: suspect_in_qualification,
					suspect_validated: suspect_validated,
					customer_free_trial: customer_free_trial,
					suspect_no_answer: suspect_no_answer,
					suspect_in_contact: suspect_in_contact,
					prospect_qualified: prospect_qualified,
					customer_free_trial_pending: customer_free_trial_pending,
					customer_shipmate_pending: customer_shipmate_pending,
					prospect_box_sent: prospecy_box_sent,
				});
			}

			console.log(
				"callForceOutcomeStatusDataSet" + callForceOutcomeStatusDataSet
			);

			outcomeStatusDataSet = [];
			if (!isNullorEmpty(callForceOutcomeStatusDataSet)) {
				callForceOutcomeStatusDataSet.forEach(function (preview_row, index) {
					var hotLeadPercentage = parseInt(
						(preview_row.suspect_hot_lead / preview_row.total_leads) * 100
					);
					var hotLeadCol =
						preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

					var quoteSentPercentage = parseInt(
						(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
					);
					var quoteSentCol =
						preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

					var boxSentPercentage = parseInt(
						(preview_row.prospect_box_sent / preview_row.total_leads) * 100
					);
					var boxSentCol =
						preview_row.prospect_box_sent + " (" + boxSentPercentage + "%)";

					var reassignPercentage = parseInt(
						(preview_row.suspect_reassign / preview_row.total_leads) * 100
					);
					var reassignCol =
						preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

					var noAnswerPercentage = parseInt(
						(preview_row.prospect_no_answer / preview_row.total_leads) * 100
					);
					var noAnswerCol =
						preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

					var inContactPercentage = parseInt(
						(preview_row.prospect_in_contact / preview_row.total_leads) * 100
					);
					var inContactCol =
						preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

					var offPeakPercentage = parseInt(
						(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
						100
					);
					var offPeakCol =
						preview_row.suspect_off_peak_pipeline +
						" (" +
						offPeakPercentage +
						"%)";

					var lostPercentage = parseInt(
						(preview_row.suspect_lost / preview_row.total_leads) * 100
					);
					var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

					var ootPercentage = parseInt(
						(preview_row.suspect_oot / preview_row.total_leads) * 100
					);
					var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

					var custLostPercentage = parseInt(
						(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
					);
					var custLostCol =
						preview_row.suspect_customer_lost +
						" (" +
						custLostPercentage +
						"%)";

					var oppPercentage = parseInt(
						(preview_row.prospect_opportunity / preview_row.total_leads) * 100
					);
					var oppCol =
						preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

					var signedPercentage = parseInt(
						(preview_row.customer_signed / preview_row.total_leads) * 100
					);
					var signedCol =
						preview_row.customer_signed + " (" + signedPercentage + "%)";

					var suspectPreQualificationPercentage = parseInt(
						(preview_row.suspect_pre_qualification / preview_row.total_leads) *
						100
					);
					var preQualiCol =
						preview_row.suspect_pre_qualification +
						" (" +
						suspectPreQualificationPercentage +
						"%)";

					var suspectNewPercentage = parseInt(
						(preview_row.suspect_new / preview_row.total_leads) * 100
					);
					var suspectNewCol =
						preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

					var suspectQualifiedPercentage = parseInt(
						(preview_row.suspect_qualified / preview_row.total_leads) * 100
					);
					var suspectQualifiedCol =
						preview_row.suspect_qualified +
						" (" +
						suspectQualifiedPercentage +
						"%)";

					var suspectUnqualifiedPercentage = parseInt(
						(preview_row.suspect_unqualified / preview_row.total_leads) * 100
					);
					var suspectUnqualifiedCol =
						preview_row.suspect_unqualified +
						" (" +
						suspectUnqualifiedPercentage +
						"%)";

					var suspectInQualificationPercentage = parseInt(
						(preview_row.suspect_in_qualification / preview_row.total_leads) *
						100
					);
					var inQualiCol =
						preview_row.suspect_in_qualification +
						" (" +
						suspectInQualificationPercentage +
						"%)";

					var suspectValidatedPercentage = parseInt(
						(preview_row.suspect_validated / preview_row.total_leads) * 100
					);
					var suspectValidatedCol =
						preview_row.suspect_validated +
						" (" +
						suspectValidatedPercentage +
						"%)";

					var customerFreeTrialPercentage = parseInt(
						(preview_row.customer_free_trial / preview_row.total_leads) * 100
					);
					var customerFreeTrialCol =
						preview_row.customer_free_trial +
						" (" +
						customerFreeTrialPercentage +
						"%)";

					var customerShipMatePendingPercentage = parseInt(
						(preview_row.customer_shipmate_pending / preview_row.total_leads) * 100
					);
					var customerShipMatePendingCol =
						preview_row.customer_shipmate_pending +
						" (" +
						customerShipMatePendingPercentage +
						"%)";

					var customerFreeTrialPendingPercentage = parseInt(
						(preview_row.customer_free_trial_pending /
							preview_row.total_leads) *
						100
					);
					var customerFreeTrialPendingCol =
						preview_row.customer_free_trial_pending +
						" (" +
						customerFreeTrialPendingPercentage +
						"%)";

					var suspectNoAnswerPercentage = parseInt(
						(preview_row.suspect_no_answer / preview_row.total_leads) * 100
					);
					var suspectNoAnswerCol =
						preview_row.suspect_no_answer +
						" (" +
						suspectNoAnswerPercentage +
						"%)";

					var suspectInContactPercentage = parseInt(
						(preview_row.suspect_in_contact / preview_row.total_leads) * 100
					);
					var suspectInContactCol =
						preview_row.suspect_in_contact +
						" (" +
						suspectInContactPercentage +
						"%)";

					var prospectQualifiedPercentage = parseInt(
						(preview_row.prospect_qualified / preview_row.total_leads) * 100
					);
					var prospectQualifiedCol =
						preview_row.prospect_qualified +
						" (" +
						prospectQualifiedPercentage +
						"%)";

					outcomeStatusDataSet.push([
						preview_row.callOutcome,
						suspectNewCol,
						hotLeadCol,
						suspectValidatedCol,
						suspectUnqualifiedCol,
						suspectQualifiedCol,
						preQualiCol,
						inQualiCol,
						reassignCol,
						suspectNoAnswerCol,
						suspectInContactCol,
						inContactCol,
						offPeakCol,
						lostCol,
						ootCol,
						custLostCol,
						oppCol,
						prospectQualifiedCol,
						boxSentCol,
						quoteSentCol,
						customerFreeTrialPendingCol,
						customerFreeTrialCol,
						customerShipMatePendingCol,
						signedCol,
						preview_row.total_leads,
					]);
				});
			}

			var dataTableCallForceDateSyncedOutcome = $(
				"#mpexusage-callForceOutcomeStatus"
			).DataTable({
				data: outcomeStatusDataSet,
				pageLength: 250,
				order: [23, "desc"],
				responsive: true,
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
						title: "Outcome", //0
					},
					{
						title: "Suspect - New", //1
					},
					{
						title: "Suspect - Hot Lead", //2
					},
					{
						title: "Suspect - Validated", //5
					},
					{
						title: "Suspect - Unqualified", //4
					},
					{
						title: "Suspect - Qualified", //3
					},
					{
						title: "Suspect - Pre Qualification", //7
					},
					{
						title: "Suspect - In Qualification", //8
					},
					{
						title: "Suspect - Reassign", //6
					},
					{
						title: "Suspect - No Answer", //9
					},
					{
						title: "Suspect - In Contact", //10
					},
					{
						title: "Prospect - In Contact", //11
					},
					{
						title: "Suspect - Parking Lot", //12
					},
					{
						title: "Suspect - Lost", //13
					},
					{
						title: "Suspect - Out of Territory", //14
					},
					{
						title: "Suspect - Customer - Lost", //15
					},
					{
						title: "Prospect - Opportunity", //16
					},
					{
						title: "Prospect - Qualified", //17
					},
					{
						title: "Prospect - Box Sent", //18
					},
					{
						title: "Prospect - Quote Sent", //19
					},
					{
						title: "Customer - Free Trial Pending", //20
					},
					{
						title: "Customer - Free Trial", //21
					},
					{
						title: "Customer - ShipMate Pending", //22
					},
					{
						title: "Customer - Signed", //23
					},
					{
						title: "Total Lead Count", //24
					},
				],
				columnDefs: [
					{
						targets: [0, 5, 6, 7, 17, 19, 22, 23],
						className: "bolded",
					},
				],
				rowCallback: function (row, data, index) {
					var row_color = "";
					if (data[0] == "Interested") {
						$(row).css("background-color", "#439A97");
					}
					if (data[0] == "Email_Interested") {
						$(row).css("background-color", "#B0ECC6FF");
					}
					if (data[0] == "Email_Brush_off") {
						$(row).css("background-color", "#fdbe8c");
					}

				},
				footerCallback: function (row, data, start, end, display) {
					var api = this.api(),
						data;

					// Remove the formatting to get integer data for summation
					var intVal = function (i) {
						return parseInt(i);
					};

					const formatter = new Intl.NumberFormat("en-AU", {
						style: "currency",
						currency: "AUD",
						minimumFractionDigits: 2,
					});
					// Total Suspect New Lead Count
					total_suspect_new = api
						.column(1)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Hot Lead Count
					total_suspect_hot_lead = api
						.column(2)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Qualified Count
					total_suspect_qualified = api
						.column(3)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Unqualified Count
					total_suspect_unqualified = api
						.column(4)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Validated
					total_suspect_validated = api
						.column(5)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Reassign
					total_suspect_reassign = api
						.column(6)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Follow Up
					total_suspect_followup = api
						.column(7)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect LPO Follow Up
					total_suspect_lpo_followup = api
						.column(8)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect No Answer
					total_suspect_no_answer = api
						.column(9)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect In Contact
					total_suspect_in_contact = api
						.column(10)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect In Contact
					total_prospect_in_contact = api
						.column(11)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Off Peak Pipline
					total_suspect_off_peak_pipeline = api
						.column(12)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Lost
					total_suspect_lost = api
						.column(13)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Out of Territory
					total_suspect_oot = api
						.column(14)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Customer Lost
					total_suspect_customer_lost = api
						.column(15)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect Opportunity
					total_prospect_opportunity = api
						.column(16)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_prospect_qualified = api
						.column(17)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_prospect_box_sent = api
						.column(18)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect Quoite Sent
					total_prospect_quote_sent = api
						.column(19)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial Pending
					total_customer_free_trial_pending = api
						.column(20)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial
					total_customer_free_trial = api
						.column(21)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Signed
					total_customer_shipmate_pending = api
						.column(22)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Signed
					total_customer_signed = api
						.column(23)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Lead Count
					total_lead = api
						.column(24)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Update footer
					$(api.column(1).footer()).html(
						total_suspect_new +
						" (" +
						((total_suspect_new / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(2).footer()).html(
						total_suspect_hot_lead +
						" (" +
						((total_suspect_hot_lead / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(3).footer()).html(
						total_suspect_qualified +
						" (" +
						((total_suspect_qualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(4).footer()).html(
						total_suspect_unqualified +
						" (" +
						((total_suspect_unqualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(5).footer()).html(
						total_suspect_validated +
						" (" +
						((total_suspect_validated / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(6).footer()).html(
						total_suspect_reassign +
						" (" +
						((total_suspect_reassign / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(7).footer()).html(
						total_suspect_followup +
						" (" +
						((total_suspect_followup / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(8).footer()).html(
						total_suspect_lpo_followup +
						" (" +
						((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(9).footer()).html(
						total_suspect_no_answer +
						" (" +
						((total_suspect_no_answer / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(10).footer()).html(
						total_suspect_in_contact +
						" (" +
						((total_suspect_in_contact / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(11).footer()).html(
						total_prospect_in_contact +
						" (" +
						((total_prospect_in_contact / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(12).footer()).html(
						total_suspect_off_peak_pipeline +
						" (" +
						((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(
							0
						) +
						"%)"
					);
					$(api.column(13).footer()).html(
						total_suspect_lost +
						" (" +
						((total_suspect_lost / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(14).footer()).html(
						total_suspect_oot +
						" (" +
						((total_suspect_oot / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(15).footer()).html(
						total_suspect_customer_lost +
						" (" +
						((total_suspect_customer_lost / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(16).footer()).html(
						total_prospect_opportunity +
						" (" +
						((total_prospect_opportunity / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(17).footer()).html(
						total_prospect_qualified +
						" (" +
						((total_prospect_qualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(18).footer()).html(
						total_prospect_box_sent +
						" (" +
						((total_prospect_box_sent / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(19).footer()).html(
						total_prospect_quote_sent +
						" (" +
						((total_prospect_quote_sent / total_lead) * 100).toFixed(0) +
						"%)"
					);

					$(api.column(20).footer()).html(
						total_customer_free_trial_pending +
						" (" +
						((total_customer_free_trial_pending / total_lead) * 100).toFixed(
							0
						) +
						"%)"
					);

					$(api.column(21).footer()).html(
						total_customer_free_trial +
						" (" +
						((total_customer_free_trial / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(22).footer()).html(
						total_customer_shipmate_pending +
						" (" +
						((total_customer_shipmate_pending / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(23).footer()).html(
						total_customer_signed +
						" (" +
						((total_customer_signed / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(24).footer()).html(total_lead);
				},
			});

			//Sales Reporting - Call Force Campaign - Completed Tasks
			var callForceCompletedTasksCurrentStatusSearch = search.load({
				type: "customer",
				id: "customsearch_lpo_unqualifed_list_2_2_2_2",
			});

			callForceCompletedTasksCurrentStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				// callForceCompletedTasksCurrentStatusSearch.filters.push(
				// 	search.createFilter({
				// 		name: "companyname",
				// 		join: null,
				// 		operator: search.Operator.DOESNOTSTARTWITH,
				// 		values: "TEST",
				// 	})
				// );
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.ANYOF,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				callForceCompletedTasksCurrentStatusSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			var oldCompletedTaskDate = null;
			var countCompletedTasks = 0;

			var customer_signed = 0;
			var suspect_hot_lead = 0;
			var suspect_reassign = 0;
			var suspect_lost = 0;
			var suspect_customer_lost = 0;
			var suspect_off_peak_pipeline = 0;
			var prospect_opportunity = 0;
			var prospecy_quote_sent = 0;
			var prospecy_box_sent = 0;
			var prospect_no_answer = 0;
			var prospect_in_contact = 0;
			var suspect_oot = 0;
			var suspect_pre_qualification = 0;
			var suspect_new = 0;
			var suspect_qualified = 0;
			var suspect_pre_qualification = 0;
			var suspect_in_qualification = 0;
			var suspect_unqualified = 0;
			var suspect_in_qualification = 0;
			var total_leads = 0;
			var prospect_qualified = 0;

			var suspect_validated = 0;
			var customer_free_trial = 0;
			var customer_free_trial_pending = 0;
			var customer_shipmate_pending = 0;
			var suspect_no_answer = 0;
			var suspect_in_contact = 0;

			callForceCompletedTasksCurrentStatusSearch
				.run()
				.each(function (callForceLeadsCountByOutcomeStatusResultSet) {
					var prospectCount = parseInt(
						callForceLeadsCountByOutcomeStatusResultSet.getValue({
							name: "internalid",
							join: "task",
							summary: "COUNT",
						})
					);

					var custStatus = callForceLeadsCountByOutcomeStatusResultSet.getValue(
						{
							name: "entitystatus",
							summary: "GROUP",
						}
					);

					var completedTaskDate =
						callForceLeadsCountByOutcomeStatusResultSet.getValue({
							name: "completeddate",
							join: "task",
							summary: "GROUP",
						});

					var callforceCompletedDateSplit = completedTaskDate.split("/");
					completedTaskDate =
						callforceCompletedDateSplit[2] +
						"-" +
						callforceCompletedDateSplit[1] +
						"-" +
						callforceCompletedDateSplit[0];

					if (
						countCompletedTasks != 0 &&
						completedTaskDate != oldCompletedTaskDate
					) {
						callForceCompletedTasksDataSet.push({
							callOutcome: oldCompletedTaskDate,
							suspect_hot_lead: suspect_hot_lead,
							prospecy_quote_sent: prospecy_quote_sent,
							suspect_reassign: suspect_reassign,
							prospect_no_answer: prospect_no_answer,
							prospect_in_contact: prospect_in_contact,
							suspect_off_peak_pipeline: suspect_off_peak_pipeline,
							suspect_lost: suspect_lost,
							suspect_customer_lost: suspect_customer_lost,
							prospect_opportunity: prospect_opportunity,
							customer_signed: customer_signed,
							total_leads: total_leads,
							suspect_oot: suspect_oot,
							suspect_pre_qualification: suspect_pre_qualification,
							suspect_new: suspect_new,
							suspect_qualified: suspect_qualified,
							suspect_unqualified: suspect_unqualified,
							suspect_in_qualification: suspect_in_qualification,
							suspect_validated: suspect_validated,
							customer_free_trial: customer_free_trial,
							suspect_no_answer: suspect_no_answer,
							suspect_in_contact: suspect_in_contact,
							prospect_qualified: prospect_qualified,
							customer_free_trial_pending: customer_free_trial_pending,
							prospect_box_sent: prospecy_box_sent,
							customer_shipmate_pending: customer_shipmate_pending
						});

						customer_signed = 0;
						suspect_hot_lead = 0;
						suspect_reassign = 0;
						suspect_lost = 0;
						suspect_customer_lost = 0;
						suspect_off_peak_pipeline = 0;
						prospect_opportunity = 0;
						prospecy_quote_sent = 0;
						prospecy_box_sent = 0;
						prospect_no_answer = 0;
						prospect_in_contact = 0;
						suspect_oot = 0;
						suspect_pre_qualification = 0;
						suspect_new = 0;
						suspect_qualified = 0;
						suspect_pre_qualification = 0;
						suspect_in_qualification = 0;
						suspect_unqualified = 0;
						suspect_in_qualification = 0;
						total_leads = 0;
						prospect_qualified = 0;

						suspect_validated = 0;
						customer_free_trial = 0;
						customer_free_trial_pending = 0;
						suspect_no_answer = 0;
						suspect_in_contact = 0;
						customer_shipmate_pending = 0;
					}

					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//SUSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//SUSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_pre_qualification +
						suspect_new +
						suspect_qualified +
						suspect_in_qualification +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent + customer_shipmate_pending

					oldCompletedTaskDate = completedTaskDate;
					countCompletedTasks++;
					return true;
				});

			console.log("countCompletedTasks: " + countCompletedTasks);
			if (countCompletedTasks > 0) {
				callForceCompletedTasksDataSet.push({
					callOutcome: oldCompletedTaskDate,
					suspect_hot_lead: suspect_hot_lead,
					prospecy_quote_sent: prospecy_quote_sent,
					suspect_reassign: suspect_reassign,
					prospect_no_answer: prospect_no_answer,
					prospect_in_contact: prospect_in_contact,
					suspect_off_peak_pipeline: suspect_off_peak_pipeline,
					suspect_lost: suspect_lost,
					suspect_customer_lost: suspect_customer_lost,
					prospect_opportunity: prospect_opportunity,
					customer_signed: customer_signed,
					total_leads: total_leads,
					suspect_oot: suspect_oot,
					suspect_pre_qualification: suspect_pre_qualification,
					suspect_new: suspect_new,
					suspect_qualified: suspect_qualified,
					suspect_unqualified: suspect_unqualified,
					suspect_in_qualification: suspect_in_qualification,
					suspect_validated: suspect_validated,
					customer_free_trial: customer_free_trial,
					suspect_no_answer: suspect_no_answer,
					suspect_in_contact: suspect_in_contact,
					prospect_qualified: prospect_qualified,
					customer_free_trial_pending: customer_free_trial_pending,
					prospect_box_sent: prospecy_box_sent,
					customer_shipmate_pending: customer_shipmate_pending
				});
			}

			console.log(
				"callForceOutcomeStatusDataSet" + callForceOutcomeStatusDataSet
			);

			completedTasksStatusDataSet = [];
			if (!isNullorEmpty(callForceCompletedTasksDataSet)) {
				callForceCompletedTasksDataSet.forEach(function (preview_row, index) {
					var hotLeadPercentage = parseInt(
						(preview_row.suspect_hot_lead / preview_row.total_leads) * 100
					);
					var hotLeadCol =
						preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

					var quoteSentPercentage = parseInt(
						(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
					);
					var quoteSentCol =
						preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

					var boxSentPercentage = parseInt(
						(preview_row.prospect_box_sent / preview_row.total_leads) * 100
					);
					var boxSentCol =
						preview_row.prospect_box_sent + " (" + boxSentPercentage + "%)";

					var reassignPercentage = parseInt(
						(preview_row.suspect_reassign / preview_row.total_leads) * 100
					);
					var reassignCol =
						preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

					var noAnswerPercentage = parseInt(
						(preview_row.prospect_no_answer / preview_row.total_leads) * 100
					);
					var noAnswerCol =
						preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

					var inContactPercentage = parseInt(
						(preview_row.prospect_in_contact / preview_row.total_leads) * 100
					);
					var inContactCol =
						preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

					var offPeakPercentage = parseInt(
						(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
						100
					);
					var offPeakCol =
						preview_row.suspect_off_peak_pipeline +
						" (" +
						offPeakPercentage +
						"%)";

					var lostPercentage = parseInt(
						(preview_row.suspect_lost / preview_row.total_leads) * 100
					);
					var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

					var ootPercentage = parseInt(
						(preview_row.suspect_oot / preview_row.total_leads) * 100
					);
					var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

					var custLostPercentage = parseInt(
						(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
					);
					var custLostCol =
						preview_row.suspect_customer_lost +
						" (" +
						custLostPercentage +
						"%)";

					var oppPercentage = parseInt(
						(preview_row.prospect_opportunity / preview_row.total_leads) * 100
					);
					var oppCol =
						preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

					var signedPercentage = parseInt(
						(preview_row.customer_signed / preview_row.total_leads) * 100
					);
					var signedCol =
						preview_row.customer_signed + " (" + signedPercentage + "%)";

					var suspectPreQualificationPercentage = parseInt(
						(preview_row.suspect_pre_qualification / preview_row.total_leads) *
						100
					);
					var preQualiCol =
						preview_row.suspect_pre_qualification +
						" (" +
						suspectPreQualificationPercentage +
						"%)";

					var suspectNewPercentage = parseInt(
						(preview_row.suspect_new / preview_row.total_leads) * 100
					);
					var suspectNewCol =
						preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

					var suspectQualifiedPercentage = parseInt(
						(preview_row.suspect_qualified / preview_row.total_leads) * 100
					);
					var suspectQualifiedCol =
						preview_row.suspect_qualified +
						" (" +
						suspectQualifiedPercentage +
						"%)";

					var suspectUnqualifiedPercentage = parseInt(
						(preview_row.suspect_unqualified / preview_row.total_leads) * 100
					);
					var suspectUnqualifiedCol =
						preview_row.suspect_unqualified +
						" (" +
						suspectUnqualifiedPercentage +
						"%)";

					var suspectInQualificationPercentage = parseInt(
						(preview_row.suspect_in_qualification / preview_row.total_leads) *
						100
					);
					var inQualiCol =
						preview_row.suspect_in_qualification +
						" (" +
						suspectInQualificationPercentage +
						"%)";

					var suspectValidatedPercentage = parseInt(
						(preview_row.suspect_validated / preview_row.total_leads) * 100
					);
					var suspectValidatedCol =
						preview_row.suspect_validated +
						" (" +
						suspectValidatedPercentage +
						"%)";

					var customerFreeTrialPercentage = parseInt(
						(preview_row.customer_free_trial / preview_row.total_leads) * 100
					);
					var customerFreeTrialCol =
						preview_row.customer_free_trial +
						" (" +
						customerFreeTrialPercentage +
						"%)";

					var customerShipMatePendingPercentage = parseInt(
						(preview_row.customer_shipmate_pending / preview_row.total_leads) * 100
					);
					var customerShipMatePendingCol =
						preview_row.customer_shipmate_pending +
						" (" +
						customerShipMatePendingPercentage +
						"%)";

					var customerFreeTrialPendingPercentage = parseInt(
						(preview_row.customer_free_trial_pending /
							preview_row.total_leads) *
						100
					);
					var customerFreeTrialPendingCol =
						preview_row.customer_free_trial_pending +
						" (" +
						customerFreeTrialPendingPercentage +
						"%)";

					var suspectNoAnswerPercentage = parseInt(
						(preview_row.suspect_no_answer / preview_row.total_leads) * 100
					);
					var suspectNoAnswerCol =
						preview_row.suspect_no_answer +
						" (" +
						suspectNoAnswerPercentage +
						"%)";

					var suspectInContactPercentage = parseInt(
						(preview_row.suspect_in_contact / preview_row.total_leads) * 100
					);
					var suspectInContactCol =
						preview_row.suspect_in_contact +
						" (" +
						suspectInContactPercentage +
						"%)";

					var prospectQualifiedPercentage = parseInt(
						(preview_row.prospect_qualified / preview_row.total_leads) * 100
					);
					var prospectQualifiedCol =
						preview_row.prospect_qualified +
						" (" +
						prospectQualifiedPercentage +
						"%)";

					completedTasksStatusDataSet.push([
						preview_row.callOutcome,
						suspectNewCol,
						hotLeadCol,
						suspectValidatedCol,
						suspectUnqualifiedCol,
						suspectQualifiedCol,
						preQualiCol,
						inQualiCol,
						reassignCol,
						suspectNoAnswerCol,
						suspectInContactCol,
						inContactCol,
						offPeakCol,
						lostCol,
						ootCol,
						custLostCol,
						oppCol,
						prospectQualifiedCol,
						boxSentCol,
						quoteSentCol,
						customerFreeTrialPendingCol,
						customerFreeTrialCol,
						customerShipMatePendingCol,
						signedCol,
						preview_row.total_leads,
					]);
				});
			}

			var dataTableCallForceDateSyncedOutcome = $(
				"#mpexusage-callForceCompletedTasksCurrentStatus"
			).DataTable({
				data: completedTasksStatusDataSet,
				pageLength: 250,
				order: [],
				responsive: true,
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
						title: "Date Appointment Completed", //0
					},
					{
						title: "Suspect - New", //1
					},
					{
						title: "Suspect - Hot Lead", //2
					},
					{
						title: "Suspect - Validated", //5
					},
					{
						title: "Suspect - Unqualified", //4
					},
					{
						title: "Suspect - Qualified", //3
					},
					{
						title: "Suspect - Pre Qualification", //7
					},
					{
						title: "Suspect - In Qualification", //8
					},
					{
						title: "Suspect - Reassign", //6
					},
					{
						title: "Suspect - No Answer", //9
					},
					{
						title: "Suspect - In Contact", //10
					},
					{
						title: "Prospect - In Contact", //11
					},
					{
						title: "Suspect - Parking Lot", //12
					},
					{
						title: "Suspect - Lost", //13
					},
					{
						title: "Suspect - Out of Territory", //14
					},
					{
						title: "Suspect - Customer - Lost", //15
					},
					{
						title: "Prospect - Opportunity", //16
					},
					{
						title: "Prospect - Qualified", //17
					},
					{
						title: "Prospect - Box Sent", //18
					},
					{
						title: "Prospect - Quote Sent", //19
					},
					{
						title: "Customer - Free Trial Pending", //20
					},
					{
						title: "Customer - Free Trial", //21
					},
					{
						title: "Customer - ShipMate Pending", //22
					},
					{
						title: "Customer - Signed", //23
					},
					{
						title: "Total Lead Count", //24
					},
				],
				columnDefs: [
					{
						targets: [0, 5, 6, 7, 19, 22, 23],
						className: "bolded",
					},
				],
				footerCallback: function (row, data, start, end, display) {
					var api = this.api(),
						data;

					// Remove the formatting to get integer data for summation
					var intVal = function (i) {
						return parseInt(i);
					};

					const formatter = new Intl.NumberFormat("en-AU", {
						style: "currency",
						currency: "AUD",
						minimumFractionDigits: 2,
					});
					// Total Suspect New Lead Count
					total_suspect_new = api
						.column(1)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Hot Lead Count
					total_suspect_hot_lead = api
						.column(2)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Qualified Count
					total_suspect_qualified = api
						.column(3)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Unqualified Count
					total_suspect_unqualified = api
						.column(4)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Validated
					total_suspect_validated = api
						.column(5)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Reassign
					total_suspect_reassign = api
						.column(6)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Follow Up
					total_suspect_followup = api
						.column(7)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect LPO Follow Up
					total_suspect_lpo_followup = api
						.column(8)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect No Answer
					total_suspect_no_answer = api
						.column(9)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect In Contact
					total_suspect_in_contact = api
						.column(10)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect In Contact
					total_prospect_in_contact = api
						.column(11)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Off Peak Pipline
					total_suspect_off_peak_pipeline = api
						.column(12)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Lost
					total_suspect_lost = api
						.column(13)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Out of Territory
					total_suspect_oot = api
						.column(14)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Customer Lost
					total_suspect_customer_lost = api
						.column(15)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect Opportunity
					total_prospect_opportunity = api
						.column(16)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_prospect_qualified = api
						.column(17)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_prospect_box_sent = api
						.column(18)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect Quoite Sent
					total_prospect_quote_sent = api
						.column(19)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial Pending
					total_customer_free_trial_pending = api
						.column(20)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial
					total_customer_free_trial = api
						.column(21)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer ShipMate Pending
					total_customer_shipmate_pending = api
						.column(22)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Signed
					total_customer_signed = api
						.column(23)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Lead Count
					total_lead = api
						.column(24)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Update footer
					$(api.column(1).footer()).html(
						total_suspect_new +
						" (" +
						((total_suspect_new / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(2).footer()).html(
						total_suspect_hot_lead +
						" (" +
						((total_suspect_hot_lead / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(3).footer()).html(
						total_suspect_qualified +
						" (" +
						((total_suspect_qualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(4).footer()).html(
						total_suspect_unqualified +
						" (" +
						((total_suspect_unqualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(5).footer()).html(
						total_suspect_validated +
						" (" +
						((total_suspect_validated / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(6).footer()).html(
						total_suspect_reassign +
						" (" +
						((total_suspect_reassign / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(7).footer()).html(
						total_suspect_followup +
						" (" +
						((total_suspect_followup / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(8).footer()).html(
						total_suspect_lpo_followup +
						" (" +
						((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(9).footer()).html(
						total_suspect_no_answer +
						" (" +
						((total_suspect_no_answer / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(10).footer()).html(
						total_suspect_in_contact +
						" (" +
						((total_suspect_in_contact / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(11).footer()).html(
						total_prospect_in_contact +
						" (" +
						((total_prospect_in_contact / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(12).footer()).html(
						total_suspect_off_peak_pipeline +
						" (" +
						((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(
							0
						) +
						"%)"
					);
					$(api.column(13).footer()).html(
						total_suspect_lost +
						" (" +
						((total_suspect_lost / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(14).footer()).html(
						total_suspect_oot +
						" (" +
						((total_suspect_oot / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(15).footer()).html(
						total_suspect_customer_lost +
						" (" +
						((total_suspect_customer_lost / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(16).footer()).html(
						total_prospect_opportunity +
						" (" +
						((total_prospect_opportunity / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(17).footer()).html(
						total_prospect_qualified +
						" (" +
						((total_prospect_qualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(18).footer()).html(
						total_prospect_box_sent +
						" (" +
						((total_prospect_box_sent / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(19).footer()).html(
						total_prospect_quote_sent +
						" (" +
						((total_prospect_quote_sent / total_lead) * 100).toFixed(0) +
						"%)"
					);

					$(api.column(20).footer()).html(
						total_customer_free_trial_pending +
						" (" +
						((total_customer_free_trial_pending / total_lead) * 100).toFixed(
							0
						) +
						"%)"
					);

					$(api.column(21).footer()).html(
						total_customer_free_trial +
						" (" +
						((total_customer_free_trial / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(22).footer()).html(
						total_customer_shipmate_pending +
						" (" +
						((total_customer_shipmate_pending / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(23).footer()).html(
						total_customer_signed +
						" (" +
						((total_customer_signed / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(24).footer()).html(total_lead);
				},
			});
		}

		if (role == 1000) {
			// Sales Dashboard - Leads by Status - Monthly Reporting
			var leadsListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_3",
			});
		} else {
			// Sales Dashboard - Leads by Status - Weekly Reporting
			var leadsListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly",
			});
		}

		leadsListBySalesRepWeeklySearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(cancelled_start_date) &&
			!isNullorEmpty(cancelled_last_date)
		) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				leadsListBySalesRepWeeklySearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var modifiedDateFilters = [
				[
					["activity.date", "within", [modified_date_from, modified_date_to]],
					"AND",
					[
						"activity.custevent_organiser",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
				"AND",
				[
					[
						"usernotes.notedate",
						"within",
						[modified_date_from, modified_date_to],
					],
					"AND",
					[
						"usernotes.author",
						"anyof",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
			];
			console.log(
				"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
			);

			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(modifiedDateFilters);

			console.log(
				"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;
		}

		var count1 = 0;
		var oldDate1 = null;

		customer_signed = 0;
		suspect_hot_lead = 0;
		suspect_reassign = 0;
		suspect_lost = 0;
		var suspect_oot = 0;
		suspect_customer_lost = 0;
		suspect_off_peak_pipeline = 0;
		var prospect_opportunity = 0;
		prospecy_quote_sent = 0;
		prospecy_box_sent = 0;
		prospect_no_answer = 0;
		prospect_in_contact = 0;
		suspect_follow_up = 0;
		var prospect_qualified = 0;
		suspect_new = 0;

		suspect_lpo_followup = 0;
		suspect_qualified = 0;
		suspect_unqualified = 0;
		var suspect_pre_qualification = 0;
		var suspect_in_qualification = 0;

		suspect_validated = 0;
		customer_free_trial = 0;
		customer_free_trial_pending = 0;
		customer_shipmate_pending = 0;

		suspect_no_answer = 0;
		suspect_in_contact = 0;

		leadsListBySalesRepWeeklySearch
			.run()
			.each(function (prospectListBySalesRepWeeklyResultSet) {
				var prospectCount = parseInt(
					prospectListBySalesRepWeeklyResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
					name: "custentity_date_lead_entered",
					summary: "GROUP",
				});
				var custStatus = parseInt(
					prospectListBySalesRepWeeklyResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					})
				);
				var custStatusText = prospectListBySalesRepWeeklyResultSet.getText({
					name: "entitystatus",
					summary: "GROUP",
				});

				if (role == 1000) {
					var startDate = weekLeadEntered;
				} else {
					if (!isNullorEmpty(weekLeadEntered)) {
						var splitMonthV2 = weekLeadEntered.split("/");

						var formattedDate = dateISOToNetsuite(
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
						);

						var firstDay = new Date(
							splitMonthV2[0],
							splitMonthV2[1],
							1
						).getDate();
						var lastDay = new Date(
							splitMonthV2[0],
							splitMonthV2[1],
							0
						).getDate();

						if (firstDay < 10) {
							firstDay = "0" + firstDay;
						}

						// var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
						var startDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
						var monthsStartDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
						// var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
						var lastDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
					} else {
						var startDate = "NO DATE";
					}
				}

				if (count1 == 0) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = parseInt(prospectCount);
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = parseInt(prospectCount);
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = parseInt(prospectCount);
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = parseInt(prospectCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = parseInt(prospectCount);
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = parseInt(prospectCount);
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = parseInt(prospectCount);
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification + customer_shipmate_pending;
				} else if (oldDate1 != null && oldDate1 == startDate) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed += prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead += prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost += prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot += parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost += prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign += prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent += parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline += prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up += parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new += parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified += parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified += parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup += parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated += parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial += parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial_pending += parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer += parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified += parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification += parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification += parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending += parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification +
						customer_shipmate_pending;
				} else if (oldDate1 != null && oldDate1 != startDate) {
					debt_set2.push({
						dateUsed: oldDate1,
						suspect_hot_lead: suspect_hot_lead,
						prospecy_quote_sent: prospecy_quote_sent,
						suspect_reassign: suspect_reassign,
						prospect_no_answer: prospect_no_answer,
						prospect_in_contact: prospect_in_contact,
						suspect_off_peak_pipeline: suspect_off_peak_pipeline,
						suspect_lost: suspect_lost,
						suspect_customer_lost: suspect_customer_lost,
						prospect_opportunity: prospect_opportunity,
						customer_signed: customer_signed,
						total_leads: total_leads,
						suspect_oot: suspect_oot,
						suspect_follow_up: suspect_follow_up,
						suspect_new: suspect_new,
						suspect_qualified: suspect_qualified,
						suspect_unqualified: suspect_unqualified,
						suspect_lpo_followup: suspect_lpo_followup,
						suspect_validated: suspect_validated,
						customer_free_trial: customer_free_trial,
						suspect_no_answer: suspect_no_answer,
						suspect_in_contact: suspect_in_contact,
						prospect_qualified: prospect_qualified,
						customer_free_trial_pending: customer_free_trial_pending,
						prospect_box_sent: prospecy_box_sent,
						suspect_pre_qualification: suspect_pre_qualification,
						suspect_in_qualification: suspect_in_qualification,
						customer_shipmate_pending: customer_shipmate_pending
					});

					customer_signed = 0;
					suspect_hot_lead = 0;
					suspect_reassign = 0;
					suspect_lost = 0;
					suspect_customer_lost = 0;
					suspect_off_peak_pipeline = 0;
					prospect_opportunity = 0;
					prospecy_quote_sent = 0;
					prospecy_box_sent = 0;
					prospect_no_answer = 0;
					prospect_in_contact = 0;
					suspect_oot = 0;
					suspect_follow_up = 0;
					suspect_new = 0;
					suspect_qualified = 0;
					suspect_unqualified = 0;
					suspect_lpo_followup = 0;
					total_leads = 0;
					prospect_qualified = 0;

					suspect_validated = 0;
					customer_free_trial = 0;
					customer_free_trial_pending = 0;
					suspect_no_answer = 0;
					suspect_in_contact = 0;
					suspect_pre_qualification = 0;
					suspect_in_qualification = 0;
					customer_shipmate_pending = 0;

					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}
					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification + customer_shipmate_pending;
				}

				count1++;
				oldDate1 = startDate;
				return true;
			});

		if (count1 > 0) {
			debt_set2.push({
				dateUsed: oldDate1,
				suspect_hot_lead: suspect_hot_lead,
				prospecy_quote_sent: prospecy_quote_sent,
				suspect_reassign: suspect_reassign,
				prospect_no_answer: prospect_no_answer,
				prospect_in_contact: prospect_in_contact,
				suspect_off_peak_pipeline: suspect_off_peak_pipeline,
				suspect_lost: suspect_lost,
				suspect_customer_lost: suspect_customer_lost,
				prospect_opportunity: prospect_opportunity,
				customer_signed: customer_signed,
				total_leads: total_leads,
				suspect_oot: suspect_oot,
				suspect_follow_up: suspect_follow_up,
				suspect_new: suspect_new,
				suspect_qualified: suspect_qualified,
				suspect_unqualified: suspect_unqualified,
				suspect_lpo_followup: suspect_lpo_followup,
				suspect_validated: suspect_validated,
				customer_free_trial: customer_free_trial,
				suspect_no_answer: suspect_no_answer,
				suspect_in_contact: suspect_in_contact,
				prospect_qualified: prospect_qualified,
				customer_free_trial_pending: customer_free_trial_pending,
				prospect_box_sent: prospecy_box_sent,
				suspect_pre_qualification: suspect_pre_qualification,
				suspect_in_qualification: suspect_in_qualification,
				customer_shipmate_pending: customer_shipmate_pending
			});
		}

		console.log("debt_set2: " + JSON.stringify(debt_set2));

		previewDataSet = [];
		csvPreviewSet = [];

		var overDataSet = [];

		if (!isNullorEmpty(debt_set2)) {
			debt_set2.forEach(function (preview_row, index) {
				var hotLeadPercentage = parseInt(
					(preview_row.suspect_hot_lead / preview_row.total_leads) * 100
				);
				var hotLeadCol =
					preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

				var quoteSentPercentage = parseInt(
					(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
				);
				var quoteSentCol =
					preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

				var boxSentPercentage = parseInt(
					(preview_row.prospect_box_sent / preview_row.total_leads) * 100
				);
				var boxSentCol =
					preview_row.prospect_box_sent + " (" + boxSentPercentage + "%)";

				var reassignPercentage = parseInt(
					(preview_row.suspect_reassign / preview_row.total_leads) * 100
				);
				var reassignCol =
					preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

				var noAnswerPercentage = parseInt(
					(preview_row.prospect_no_answer / preview_row.total_leads) * 100
				);
				var noAnswerCol =
					preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

				var inContactPercentage = parseInt(
					(preview_row.prospect_in_contact / preview_row.total_leads) * 100
				);
				var inContactCol =
					preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

				var offPeakPercentage = parseInt(
					(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
					100
				);
				var offPeakCol =
					preview_row.suspect_off_peak_pipeline +
					" (" +
					offPeakPercentage +
					"%)";

				var lostPercentage = parseInt(
					(preview_row.suspect_lost / preview_row.total_leads) * 100
				);
				var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

				var ootPercentage = parseInt(
					(preview_row.suspect_oot / preview_row.total_leads) * 100
				);
				var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

				var custLostPercentage = parseInt(
					(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
				);
				var custLostCol =
					preview_row.suspect_customer_lost + " (" + custLostPercentage + "%)";

				var oppPercentage = parseInt(
					(preview_row.prospect_opportunity / preview_row.total_leads) * 100
				);
				var oppCol =
					preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

				var signedPercentage = parseInt(
					(preview_row.customer_signed / preview_row.total_leads) * 100
				);
				var signedCol =
					preview_row.customer_signed + " (" + signedPercentage + "%)";

				var suspectFollowUpPErcentage = parseInt(
					(preview_row.suspect_follow_up / preview_row.total_leads) * 100
				);
				var followUpCol =
					preview_row.suspect_follow_up +
					" (" +
					suspectFollowUpPErcentage +
					"%)";

				var suspectNewPercentage = parseInt(
					(preview_row.suspect_new / preview_row.total_leads) * 100
				);
				var suspectNewCol =
					preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

				var suspectQualifiedPercentage = parseInt(
					(preview_row.suspect_qualified / preview_row.total_leads) * 100
				);
				var suspectQualifiedCol =
					preview_row.suspect_qualified +
					" (" +
					suspectQualifiedPercentage +
					"%)";

				var suspectUnqualifiedPercentage = parseInt(
					(preview_row.suspect_unqualified / preview_row.total_leads) * 100
				);
				var suspectUnqualifiedCol =
					preview_row.suspect_unqualified +
					" (" +
					suspectUnqualifiedPercentage +
					"%)";

				var suspectLPOFollowupPercentage = parseInt(
					(preview_row.suspect_lpo_followup / preview_row.total_leads) * 100
				);
				var suspectLPOFollowupwCol =
					preview_row.suspect_lpo_followup +
					" (" +
					suspectLPOFollowupPercentage +
					"%)";

				var suspectValidatedPercentage = parseInt(
					(preview_row.suspect_validated / preview_row.total_leads) * 100
				);
				var suspectValidatedCol =
					preview_row.suspect_validated +
					" (" +
					suspectValidatedPercentage +
					"%)";

				var customerFreeTrialPercentage = parseInt(
					(preview_row.customer_free_trial / preview_row.total_leads) * 100
				);
				var customerFreeTrialCol =
					preview_row.customer_free_trial +
					" (" +
					customerFreeTrialPercentage +
					"%)";

				var customerFreeTrialPendingPercentage = parseInt(
					(preview_row.customer_free_trial_pending / preview_row.total_leads) *
					100
				);
				var customerFreeTrialPendingCol =
					preview_row.customer_free_trial_pending +
					" (" +
					customerFreeTrialPendingPercentage +
					"%)";

				var suspectNoAnswerPercentage = parseInt(
					(preview_row.suspect_no_answer / preview_row.total_leads) * 100
				);
				var suspectNoAnswerCol =
					preview_row.suspect_no_answer +
					" (" +
					suspectNoAnswerPercentage +
					"%)";

				var suspectInContactPercentage = parseInt(
					(preview_row.suspect_in_contact / preview_row.total_leads) * 100
				);
				var suspectInContactCol =
					preview_row.suspect_in_contact +
					" (" +
					suspectInContactPercentage +
					"%)";

				var prospectQualifiedPercentage = parseInt(
					(preview_row.prospect_qualified / preview_row.total_leads) * 100
				);
				var prospectQualifiedCol =
					preview_row.prospect_qualified +
					" (" +
					prospectQualifiedPercentage +
					"%)";

				var suspectPreQualifcationPercentage = parseInt(
					(preview_row.suspect_pre_qualification / preview_row.total_leads) *
					100
				);
				var suspectPreQualificationCol =
					preview_row.suspect_pre_qualification +
					" (" +
					suspectPreQualifcationPercentage +
					"%)";

				var suspectInQualificationPercentage = parseInt(
					(preview_row.suspect_in_qualification / preview_row.total_leads) * 100
				);
				var suspectInQualificationCol =
					preview_row.suspect_in_qualification +
					" (" +
					suspectInQualificationPercentage +
					"%)";

				var customerShipMatePendingPercentage = parseInt(
					(preview_row.customer_shipmate_pending / preview_row.total_leads) * 100
				);
				var customerShipMatePendingCol =
					preview_row.customer_shipmate_pending +
					" (" +
					customerShipMatePendingPercentage +
					"%)";

				overDataSet.push([
					preview_row.dateUsed,
					preview_row.suspect_new,
					preview_row.suspect_hot_lead,
					preview_row.suspect_validated,
					preview_row.suspect_qualified,
					preview_row.suspect_unqualified,
					preview_row.suspect_pre_qualification,
					preview_row.suspect_in_qualification,
					preview_row.suspect_reassign,
					preview_row.suspect_follow_up,
					preview_row.suspect_no_answer,
					preview_row.suspect_in_contact,
					preview_row.suspect_lpo_followup,
					preview_row.prospect_in_contact,
					preview_row.suspect_off_peak_pipeline,
					preview_row.suspect_lost,
					preview_row.suspect_oot,
					preview_row.suspect_customer_lost,
					preview_row.prospect_opportunity,
					preview_row.prospect_qualified,
					preview_row.prospect_box_sent,
					preview_row.prospecy_quote_sent,
					preview_row.customer_free_trial_pending,
					preview_row.customer_free_trial,
					preview_row.customer_shipmate_pending,
					preview_row.customer_signed,
					preview_row.total_leads,
				]);

				previewDataSet.push([
					preview_row.dateUsed,
					suspectNewCol,
					hotLeadCol,
					suspectValidatedCol,
					suspectQualifiedCol,
					suspectUnqualifiedCol,
					suspectPreQualificationCol,
					suspectInQualificationCol,
					reassignCol,
					followUpCol,
					suspectLPOFollowupwCol,
					suspectNoAnswerCol,
					suspectInContactCol,
					inContactCol,
					offPeakCol,
					lostCol,
					ootCol,
					custLostCol,
					oppCol,
					prospectQualifiedCol,
					boxSentCol,
					quoteSentCol,
					customerFreeTrialPendingCol,
					customerFreeTrialCol,
					customerShipMatePendingCol,
					signedCol,
					preview_row.total_leads,
				]);
			});
		}

		console.log("previewDataSet");
		console.log(previewDataSet);

		var dataTablePreview = $("#mpexusage-preview").DataTable({
			destroy: true,
			data: previewDataSet,
			pageLength: 1000,
			responsive: true,
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
					title: "Period", //0
				},
				{
					title: "Suspect - New", //1
				},
				{
					title: "Suspect - Hot Lead", //2
				},
				{
					title: "Suspect - Validated", //3
				},
				{
					title: "Suspect - Qualified", //4
				},
				{
					title: "Suspect - Unqualified", //5
				},
				{
					title: "Suspect - Pre Qualification", //6
				},
				{
					title: "Suspect - In Qualification", //7
				},
				{
					title: "Suspect - Reassign", //8
				},
				{
					title: "Suspect - Follow Up", //9
				},
				{
					title: "Suspect - LPO Follow Up", //10
				},
				{
					title: "Suspect - No Answer", //11
				},
				{
					title: "Suspect - In Contact", //12
				},
				{
					title: "Prospect - In Contact", //13
				},
				{
					title: "Suspect - Parking Lot", //14
				},
				{
					title: "Suspect - Lost", //15
				},
				{
					title: "Suspect - Out of Territory", //16
				},
				{
					title: "Suspect - Customer - Lost", //17
				},
				{
					title: "Prospect - Opportunity", //18
				},
				{
					title: "Prospect - Qualified", //19
				},
				{
					title: "Prospect - Box Sent", //20
				},
				{
					title: "Prospect - Quote Sent", //21
				},
				{
					title: "Customer - Free Trial Pending", //22
				},
				{
					title: "Customer - Free Trial", //23
				},
				{
					title: "Customer - ShipMate Pending", //24
				},
				{
					title: "Customer - Signed", //25
				},
				{
					title: "Total Lead Count", //26
				},
			],
			columnDefs: [
				{
					targets: [0, 5, 19, 23, 24, 25],
					className: "bolded",
				},
			],
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return parseInt(i);
				};

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});
				// Total Suspect New Lead Count
				total_suspect_new = api
					.column(1)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Hot Lead Count
				total_suspect_hot_lead = api
					.column(2)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Qualified Count
				total_suspect_qualified = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Unqualified Count
				total_suspect_unqualified = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Validated
				total_suspect_validated = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Reassign
				total_suspect_reassign = api
					.column(6)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Follow Up
				total_suspect_followup = api
					.column(7)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect LPO Follow Up
				total_suspect_lpo_followup = api
					.column(8)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect No Answer
				total_suspect_no_answer = api
					.column(9)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect In Contact
				total_suspect_in_contact = api
					.column(10)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect In Contact
				total_prospect_in_contact = api
					.column(11)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Off Peak Pipline
				total_suspect_off_peak_pipeline = api
					.column(12)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Lost
				total_suspect_lost = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Out of Territory
				total_suspect_oot = api
					.column(14)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Customer Lost
				total_suspect_customer_lost = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Opportunity
				total_prospect_opportunity = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prospect_qualified = api
					.column(17)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prospect_box_sent = api
					.column(18)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Quoite Sent
				total_prospect_quote_sent = api
					.column(19)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Free Trial Pending
				total_customer_free_trial_pending = api
					.column(20)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Free Trial
				total_customer_free_trial = api
					.column(21)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Signed
				total_customer_signed = api
					.column(22)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_v1 = api
					.column(23)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_shipmate_pending = api
					.column(24)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_v2 = api
					.column(25)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Lead Count
				total_lead = api
					.column(26)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(1).footer()).html(
					total_suspect_new +
					" (" +
					((total_suspect_new / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(2).footer()).html(
					total_suspect_hot_lead +
					" (" +
					((total_suspect_hot_lead / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(3).footer()).html(
					total_suspect_qualified +
					" (" +
					((total_suspect_qualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(4).footer()).html(
					total_suspect_unqualified +
					" (" +
					((total_suspect_unqualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(5).footer()).html(
					total_suspect_validated +
					" (" +
					((total_suspect_validated / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(6).footer()).html(
					total_suspect_reassign +
					" (" +
					((total_suspect_reassign / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(7).footer()).html(
					total_suspect_followup +
					" (" +
					((total_suspect_followup / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(8).footer()).html(
					total_suspect_lpo_followup +
					" (" +
					((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(9).footer()).html(
					total_suspect_no_answer +
					" (" +
					((total_suspect_no_answer / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(10).footer()).html(
					total_suspect_in_contact +
					" (" +
					((total_suspect_in_contact / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(11).footer()).html(
					total_prospect_in_contact +
					" (" +
					((total_prospect_in_contact / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(12).footer()).html(
					total_suspect_off_peak_pipeline +
					" (" +
					((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(13).footer()).html(
					total_suspect_lost +
					" (" +
					((total_suspect_lost / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(14).footer()).html(
					total_suspect_oot +
					" (" +
					((total_suspect_oot / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(15).footer()).html(
					total_suspect_customer_lost +
					" (" +
					((total_suspect_customer_lost / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(16).footer()).html(
					total_prospect_opportunity +
					" (" +
					((total_prospect_opportunity / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(17).footer()).html(
					total_prospect_qualified +
					" (" +
					((total_prospect_qualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(18).footer()).html(
					total_prospect_box_sent +
					" (" +
					((total_prospect_box_sent / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(19).footer()).html(
					total_prospect_quote_sent +
					" (" +
					((total_prospect_quote_sent / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(20).footer()).html(
					total_customer_free_trial_pending +
					" (" +
					((total_customer_free_trial_pending / total_lead) * 100).toFixed(
						0
					) +
					"%)"
				);

				$(api.column(21).footer()).html(
					total_customer_free_trial +
					" (" +
					((total_customer_free_trial / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(22).footer()).html(
					total_customer_signed +
					" (" +
					((total_customer_signed / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(23).footer()).html(
					total_lead_v1 +
					" (" +
					((total_lead_v1 / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(24).footer()).html(
					total_lead_shipmate_pending +
					" (" +
					((total_lead_shipmate_pending / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(25).footer()).html(
					total_lead_v2 +
					" (" +
					((total_lead_v2 / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(26).footer()).html(total_lead);
			},
		});

		saveCsv(previewDataSet);

		var data = overDataSet;

		var month_year = []; // creating array for storing browser
		var customer_signed = [];
		var suspect_hot_lead = [];
		var suspect_reassign = [];
		var suspect_lost = [];
		var suspect_oot = [];
		var suspect_customer_lost = [];
		var suspect_off_peak_pipeline = [];
		var prospect_opportunity = [];
		var prospect_qualified = [];
		var prospecy_quote_sent = [];
		var prospecy_box_sent = [];
		var prospect_no_answer = [];
		var prospect_in_contact = [];
		var suspect_follow_up = [];
		var suspect_new = [];
		var suspect_qualified = [];
		var suspect_unqualified = [];
		var suspect_lpo_followup = [];
		var suspect_validated = [];
		var customer_free_trial = [];
		var customer_free_trial_pending = [];
		var customer_shipmate_pending = [];
		var susect_no_answer = [];
		var suspect_in_contact = [];
		var suspect_pre_qualification = [];
		var suspect_in_qualification = [];
		var total_leads = [];

		for (var i = 0; i < data.length; i++) {
			month_year.push(data[i][0]);
			suspect_new[data[i][0]] = data[i][1];
			suspect_hot_lead[data[i][0]] = data[i][2];
			suspect_qualified[data[i][0]] = data[i][4];
			suspect_unqualified[data[i][0]] = data[i][5];
			suspect_validated[data[i][0]] = data[i][3];
			suspect_pre_qualification[data[i][0]] = data[i][6];
			suspect_in_qualification[data[i][0]] = data[i][7];
			suspect_reassign[data[i][0]] = data[i][8];
			suspect_follow_up[data[i][0]] = data[i][9];
			suspect_lpo_followup[data[i][0]] = data[i][10];
			suspect_no_answer[data[i][0]] = data[i][11];
			suspect_in_contact[data[i][0]] = data[i][12];
			prospect_in_contact[data[i][0]] = data[i][13];
			suspect_off_peak_pipeline[data[i][0]] = data[i][14];
			suspect_lost[data[i][0]] = data[i][15];
			suspect_oot[data[i][0]] = data[i][16];
			suspect_customer_lost[data[i][0]] = data[i][17];
			prospect_opportunity[data[i][0]] = data[i][18];
			prospect_qualified[data[i][0]] = data[i][19];
			prospecy_box_sent[data[i][0]] = data[i][20];
			prospecy_quote_sent[data[i][0]] = data[i][21];
			customer_free_trial_pending[data[i][0]] = data[i][22];
			customer_free_trial[data[i][0]] = data[i][23];
			customer_shipmate_pending[data[i][0]] = data[i][24];
			customer_signed[data[i][0]] = data[i][25];
			total_leads[data[i][0]] = data[i][26];
		}

		console.log("prospecy_box_sent" + prospecy_box_sent);

		var count = {}; // creating object for getting categories with
		// count
		month_year.forEach(function (i) {
			count[i] = (count[i] || 0) + 1;
		});

		var series_data20 = [];
		var series_data21 = [];
		var series_data22 = [];
		var series_data23 = [];
		var series_data24 = [];
		var series_data25 = [];
		var series_data26 = [];
		var series_data27 = [];
		var series_data28 = [];
		var series_data29 = [];
		var series_data30 = [];
		var series_data31 = [];
		var series_data32 = [];
		var series_data33 = [];
		var series_data34 = [];
		var series_data20a = [];
		var series_data21a = [];
		var series_data22a = [];
		var series_data23a = [];
		var series_data24a = [];
		var series_data25a = [];
		var series_data26a = [];
		var series_data27a = [];
		var series_data28a = [];
		var series_data29a = [];
		var series_data30a = [];
		var series_data31a = [];
		var series_data32b = [];

		var categores1 = []; // creating empty array for highcharts
		// categories
		Object.keys(prospecy_quote_sent).map(function (item, key) {
			series_data20.push(parseInt(customer_signed[item]));
			series_data21.push(parseInt(suspect_hot_lead[item]));
			series_data22.push(parseInt(suspect_reassign[item]));
			series_data23.push(parseInt(suspect_lost[item]));
			series_data24.push(parseInt(suspect_customer_lost[item]));
			series_data25.push(parseInt(suspect_off_peak_pipeline[item]));
			series_data26.push(parseInt(prospecy_quote_sent[item]));
			series_data27.push(parseInt(prospect_no_answer[item]));
			series_data28.push(parseInt(prospect_in_contact[item]));
			series_data29.push(parseInt(total_leads[item]));
			series_data31.push(parseInt(prospect_opportunity[item]));
			series_data32.push(parseInt(suspect_oot[item]));
			series_data33.push(parseInt(suspect_follow_up[item]));
			series_data34.push(parseInt(suspect_new[item]));
			series_data20a.push(parseInt(suspect_qualified[item]));
			series_data28a.push(parseInt(suspect_unqualified[item]));
			series_data21a.push(parseInt(suspect_lpo_followup[item]));
			series_data22a.push(parseInt(suspect_validated[item]));
			series_data23a.push(parseInt(customer_free_trial[item]));
			series_data24a.push(parseInt(suspect_no_answer[item]));
			series_data25a.push(parseInt(suspect_in_contact[item]));
			series_data26a.push(parseInt(prospect_qualified[item]));
			series_data27a.push(parseInt(customer_free_trial_pending[item]));
			series_data29a.push(parseInt(prospecy_box_sent[item]));
			series_data30a.push(parseInt(suspect_pre_qualification[item]));
			series_data31a.push(parseInt(suspect_in_qualification[item]));
			series_data32b.push(parseInt(customer_shipmate_pending[item]));
			categores1.push(item);
		});

		plotChartPreview(
			series_data20,
			series_data21,
			series_data22,
			series_data23,
			series_data24,
			series_data25,
			series_data26,
			series_data27,
			series_data28,
			series_data29,
			series_data31,
			series_data32,
			series_data33,
			series_data34,
			categores1,
			series_data20a,
			series_data21a,
			series_data22a,
			series_data23a,
			series_data24a,
			series_data25a,
			series_data26a,
			series_data27a,
			series_data28a,
			series_data29a,
			series_data30a,
			series_data31a, series_data32b
		);

		//Status by Quote Sent
		// if (role == 1000) {
		// 	// Sales Dashboard - Leads by Status - Monthly Reporting
		// 	var leadsListBySalesRepWeeklySearch = search.load({
		// 		type: "customer",
		// 		id: "customsearch_leads_reporting_weekly_3",
		// 	});
		// } else {
		// Sales Dashboard - Leads by Status - Weekly Reporting
		var leadsListByQuoteSentWeeklySearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_8",
		});
		// }

		leadsListByQuoteSentWeeklySearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			leadsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(cancelled_start_date) &&
			!isNullorEmpty(cancelled_last_date)
		) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			leadsListByQuoteSentWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		var count1 = 0;
		var oldDate1 = null;

		customer_signed = 0;
		suspect_hot_lead = 0;
		suspect_reassign = 0;
		suspect_lost = 0;
		var suspect_oot = 0;
		suspect_customer_lost = 0;
		suspect_off_peak_pipeline = 0;
		var prospect_opportunity = 0;
		prospecy_quote_sent = 0;
		prospecy_box_sent = 0;
		prospect_no_answer = 0;
		prospect_in_contact = 0;
		suspect_follow_up = 0;
		var prospect_qualified = 0;
		suspect_new = 0;

		suspect_lpo_followup = 0;
		suspect_qualified = 0;
		suspect_unqualified = 0;
		var suspect_pre_qualification = 0;
		var suspect_in_qualification = 0;

		suspect_validated = 0;
		customer_free_trial = 0;
		customer_free_trial_pending = 0;
		customer_shipmate_pending = 0;

		suspect_no_answer = 0;
		suspect_in_contact = 0;

		var debt_set_status_by_quote_sent = []

		leadsListByQuoteSentWeeklySearch
			.run()
			.each(function (leadsListByQuoteSentWeeklySearchResult) {
				var prospectCount = parseInt(
					leadsListByQuoteSentWeeklySearchResult.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered = leadsListByQuoteSentWeeklySearchResult.getValue({
					name: "custentity_date_lead_quote_sent",
					summary: "GROUP",
				});
				var custStatus = parseInt(
					leadsListByQuoteSentWeeklySearchResult.getValue({
						name: "entitystatus",
						summary: "GROUP",
					})
				);
				var custStatusText = leadsListByQuoteSentWeeklySearchResult.getText({
					name: "entitystatus",
					summary: "GROUP",
				});

				if (role == 1000) {
					var startDate = weekLeadEntered;
				} else {
					if (!isNullorEmpty(weekLeadEntered)) {
						var splitMonthV2 = weekLeadEntered.split("/");

						var formattedDate = dateISOToNetsuite(
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
						);

						var firstDay = new Date(
							splitMonthV2[0],
							splitMonthV2[1],
							1
						).getDate();
						var lastDay = new Date(
							splitMonthV2[0],
							splitMonthV2[1],
							0
						).getDate();

						if (firstDay < 10) {
							firstDay = "0" + firstDay;
						}

						// var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
						var startDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
						var monthsStartDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
						// var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
						var lastDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
					} else {
						var startDate = "NO DATE";
					}
				}

				if (count1 == 0) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = parseInt(prospectCount);
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = parseInt(prospectCount);
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = parseInt(prospectCount);
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = parseInt(prospectCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = parseInt(prospectCount);
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = parseInt(prospectCount);
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = parseInt(prospectCount);
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification + customer_shipmate_pending;
				} else if (oldDate1 != null && oldDate1 == startDate) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed += prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead += prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost += prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot += parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost += prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign += prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent += parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline += prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up += parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new += parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified += parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified += parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup += parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated += parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial += parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial_pending += parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer += parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified += parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification += parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification += parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending += parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification + customer_shipmate_pending;
				} else if (oldDate1 != null && oldDate1 != startDate) {
					debt_set_status_by_quote_sent.push({
						dateUsed: oldDate1,
						suspect_hot_lead: suspect_hot_lead,
						prospecy_quote_sent: prospecy_quote_sent,
						suspect_reassign: suspect_reassign,
						prospect_no_answer: prospect_no_answer,
						prospect_in_contact: prospect_in_contact,
						suspect_off_peak_pipeline: suspect_off_peak_pipeline,
						suspect_lost: suspect_lost,
						suspect_customer_lost: suspect_customer_lost,
						prospect_opportunity: prospect_opportunity,
						customer_signed: customer_signed,
						total_leads: total_leads,
						suspect_oot: suspect_oot,
						suspect_follow_up: suspect_follow_up,
						suspect_new: suspect_new,
						suspect_qualified: suspect_qualified,
						suspect_unqualified: suspect_unqualified,
						suspect_lpo_followup: suspect_lpo_followup,
						suspect_validated: suspect_validated,
						customer_free_trial: customer_free_trial,
						suspect_no_answer: suspect_no_answer,
						suspect_in_contact: suspect_in_contact,
						prospect_qualified: prospect_qualified,
						customer_free_trial_pending: customer_free_trial_pending,
						prospect_box_sent: prospecy_box_sent,
						suspect_pre_qualification: suspect_pre_qualification,
						suspect_in_qualification: suspect_in_qualification,
						customer_shipmate_pending: customer_shipmate_pending
					});

					customer_signed = 0;
					suspect_hot_lead = 0;
					suspect_reassign = 0;
					suspect_lost = 0;
					suspect_customer_lost = 0;
					suspect_off_peak_pipeline = 0;
					prospect_opportunity = 0;
					prospecy_quote_sent = 0;
					prospecy_box_sent = 0;
					prospect_no_answer = 0;
					prospect_in_contact = 0;
					suspect_oot = 0;
					suspect_follow_up = 0;
					suspect_new = 0;
					suspect_qualified = 0;
					suspect_unqualified = 0;
					suspect_lpo_followup = 0;
					total_leads = 0;
					prospect_qualified = 0;

					suspect_validated = 0;
					customer_free_trial = 0;
					customer_free_trial_pending = 0;
					suspect_no_answer = 0;
					suspect_in_contact = 0;
					suspect_pre_qualification = 0;
					suspect_in_qualification = 0;
					customer_shipmate_pending = 0;

					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - Box SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification + customer_shipmate_pending;
				}

				count1++;
				oldDate1 = startDate;
				return true;
			});

		if (count1 > 0) {
			debt_set_status_by_quote_sent.push({
				dateUsed: oldDate1,
				suspect_hot_lead: suspect_hot_lead,
				prospecy_quote_sent: prospecy_quote_sent,
				suspect_reassign: suspect_reassign,
				prospect_no_answer: prospect_no_answer,
				prospect_in_contact: prospect_in_contact,
				suspect_off_peak_pipeline: suspect_off_peak_pipeline,
				suspect_lost: suspect_lost,
				suspect_customer_lost: suspect_customer_lost,
				prospect_opportunity: prospect_opportunity,
				customer_signed: customer_signed,
				total_leads: total_leads,
				suspect_oot: suspect_oot,
				suspect_follow_up: suspect_follow_up,
				suspect_new: suspect_new,
				suspect_qualified: suspect_qualified,
				suspect_unqualified: suspect_unqualified,
				suspect_lpo_followup: suspect_lpo_followup,
				suspect_validated: suspect_validated,
				customer_free_trial: customer_free_trial,
				suspect_no_answer: suspect_no_answer,
				suspect_in_contact: suspect_in_contact,
				prospect_qualified: prospect_qualified,
				customer_free_trial_pending: customer_free_trial_pending,
				prospect_box_sent: prospecy_box_sent,
				suspect_pre_qualification: suspect_pre_qualification,
				suspect_in_qualification: suspect_in_qualification,
				customer_shipmate_pending: customer_shipmate_pending
			});
		}

		console.log("debt_set_status_by_quote_sent: " + JSON.stringify(debt_set_status_by_quote_sent));

		quoteSentByStatusDataSet = [];
		csvPreviewSet = [];

		var overQuoteSentByStatusDataSet = [];

		if (!isNullorEmpty(debt_set_status_by_quote_sent)) {
			debt_set_status_by_quote_sent.forEach(function (preview_row, index) {
				var hotLeadPercentage = parseInt(
					(preview_row.suspect_hot_lead / preview_row.total_leads) * 100
				);
				var hotLeadCol =
					preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

				var quoteSentPercentage = parseInt(
					(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
				);
				var quoteSentCol =
					preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

				var boxSentPercentage = parseInt(
					(preview_row.prospect_box_sent / preview_row.total_leads) * 100
				);
				var boxSentCol =
					preview_row.prospect_box_sent + " (" + boxSentPercentage + "%)";

				var reassignPercentage = parseInt(
					(preview_row.suspect_reassign / preview_row.total_leads) * 100
				);
				var reassignCol =
					preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

				var noAnswerPercentage = parseInt(
					(preview_row.prospect_no_answer / preview_row.total_leads) * 100
				);
				var noAnswerCol =
					preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

				var inContactPercentage = parseInt(
					(preview_row.prospect_in_contact / preview_row.total_leads) * 100
				);
				var inContactCol =
					preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

				var offPeakPercentage = parseInt(
					(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
					100
				);
				var offPeakCol =
					preview_row.suspect_off_peak_pipeline +
					" (" +
					offPeakPercentage +
					"%)";

				var lostPercentage = parseInt(
					(preview_row.suspect_lost / preview_row.total_leads) * 100
				);
				var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

				var ootPercentage = parseInt(
					(preview_row.suspect_oot / preview_row.total_leads) * 100
				);
				var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

				var custLostPercentage = parseInt(
					(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
				);
				var custLostCol =
					preview_row.suspect_customer_lost + " (" + custLostPercentage + "%)";

				var oppPercentage = parseInt(
					(preview_row.prospect_opportunity / preview_row.total_leads) * 100
				);
				var oppCol =
					preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

				var signedPercentage = parseInt(
					(preview_row.customer_signed / preview_row.total_leads) * 100
				);
				var signedCol =
					preview_row.customer_signed + " (" + signedPercentage + "%)";

				var suspectFollowUpPErcentage = parseInt(
					(preview_row.suspect_follow_up / preview_row.total_leads) * 100
				);
				var followUpCol =
					preview_row.suspect_follow_up +
					" (" +
					suspectFollowUpPErcentage +
					"%)";

				var suspectNewPercentage = parseInt(
					(preview_row.suspect_new / preview_row.total_leads) * 100
				);
				var suspectNewCol =
					preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

				var suspectQualifiedPercentage = parseInt(
					(preview_row.suspect_qualified / preview_row.total_leads) * 100
				);
				var suspectQualifiedCol =
					preview_row.suspect_qualified +
					" (" +
					suspectQualifiedPercentage +
					"%)";

				var suspectUnqualifiedPercentage = parseInt(
					(preview_row.suspect_unqualified / preview_row.total_leads) * 100
				);
				var suspectUnqualifiedCol =
					preview_row.suspect_unqualified +
					" (" +
					suspectUnqualifiedPercentage +
					"%)";

				var suspectLPOFollowupPercentage = parseInt(
					(preview_row.suspect_lpo_followup / preview_row.total_leads) * 100
				);
				var suspectLPOFollowupwCol =
					preview_row.suspect_lpo_followup +
					" (" +
					suspectLPOFollowupPercentage +
					"%)";

				var suspectValidatedPercentage = parseInt(
					(preview_row.suspect_validated / preview_row.total_leads) * 100
				);
				var suspectValidatedCol =
					preview_row.suspect_validated +
					" (" +
					suspectValidatedPercentage +
					"%)";

				var customerFreeTrialPercentage = parseInt(
					(preview_row.customer_free_trial / preview_row.total_leads) * 100
				);
				var customerFreeTrialCol =
					preview_row.customer_free_trial +
					" (" +
					customerFreeTrialPercentage +
					"%)";

				var customerFreeTrialPendingPercentage = parseInt(
					(preview_row.customer_free_trial_pending / preview_row.total_leads) *
					100
				);
				var customerFreeTrialPendingCol =
					preview_row.customer_free_trial_pending +
					" (" +
					customerFreeTrialPendingPercentage +
					"%)";

				var customerShipMatePendingPercentage = parseInt(
					(preview_row.customer_shipmate_pending / preview_row.total_leads) *
					100
				);
				var customerShipMatePendingCol =
					preview_row.customer_shipmate_pending +
					" (" +
					customerShipMatePendingPercentage +
					"%)";

				var suspectNoAnswerPercentage = parseInt(
					(preview_row.suspect_no_answer / preview_row.total_leads) * 100
				);
				var suspectNoAnswerCol =
					preview_row.suspect_no_answer +
					" (" +
					suspectNoAnswerPercentage +
					"%)";

				var suspectInContactPercentage = parseInt(
					(preview_row.suspect_in_contact / preview_row.total_leads) * 100
				);
				var suspectInContactCol =
					preview_row.suspect_in_contact +
					" (" +
					suspectInContactPercentage +
					"%)";

				var prospectQualifiedPercentage = parseInt(
					(preview_row.prospect_qualified / preview_row.total_leads) * 100
				);
				var prospectQualifiedCol =
					preview_row.prospect_qualified +
					" (" +
					prospectQualifiedPercentage +
					"%)";

				var suspectPreQualifcationPercentage = parseInt(
					(preview_row.suspect_pre_qualification / preview_row.total_leads) *
					100
				);
				var suspectPreQualificationCol =
					preview_row.suspect_pre_qualification +
					" (" +
					suspectPreQualifcationPercentage +
					"%)";

				var suspectInQualificationPercentage = parseInt(
					(preview_row.suspect_in_qualification / preview_row.total_leads) * 100
				);
				var suspectInQualificationCol =
					preview_row.suspect_in_qualification +
					" (" +
					suspectInQualificationPercentage +
					"%)";

				overQuoteSentByStatusDataSet.push([
					preview_row.dateUsed,//0
					preview_row.suspect_new,//1
					preview_row.suspect_hot_lead,//2
					preview_row.suspect_validated,//3
					preview_row.suspect_qualified,//4
					preview_row.suspect_unqualified,//5
					preview_row.suspect_pre_qualification,//6
					preview_row.suspect_in_qualification,//7
					preview_row.suspect_reassign,//8
					preview_row.suspect_follow_up,//9
					preview_row.suspect_no_answer,//10
					preview_row.suspect_in_contact,//11
					preview_row.suspect_lpo_followup,//12
					preview_row.prospect_in_contact,//13
					preview_row.suspect_off_peak_pipeline,//14
					preview_row.suspect_lost,//15
					preview_row.suspect_oot,//16
					preview_row.suspect_customer_lost,//17
					preview_row.prospect_opportunity,//18
					preview_row.prospect_qualified,//19
					preview_row.prospect_box_sent,//20
					preview_row.prospecy_quote_sent,//21
					preview_row.customer_free_trial_pending,//22
					preview_row.customer_free_trial,//23
					preview_row.customer_shipmate_pending,//24
					preview_row.customer_signed,//25
					preview_row.total_leads,//26
				]);

				quoteSentByStatusDataSet.push([
					preview_row.dateUsed,
					suspectNewCol,
					hotLeadCol,
					suspectValidatedCol,
					suspectQualifiedCol,
					suspectUnqualifiedCol,
					suspectPreQualificationCol,
					suspectInQualificationCol,
					reassignCol,
					followUpCol,
					suspectLPOFollowupwCol,
					suspectNoAnswerCol,
					suspectInContactCol,
					inContactCol,
					offPeakCol,
					lostCol,
					ootCol,
					custLostCol,
					oppCol,
					prospectQualifiedCol,
					boxSentCol,
					quoteSentCol,
					customerFreeTrialPendingCol,
					customerFreeTrialCol,
					customerShipMatePendingCol,
					signedCol,
					preview_row.total_leads,
				]);
			});
		}

		console.log("overQuoteSentByStatusDataSet");
		console.log(JSON.stringify(overQuoteSentByStatusDataSet));

		console.log("quoteSentByStatusDataSet");
		console.log(quoteSentByStatusDataSet);

		saveCsv(quoteSentByStatusDataSet);

		var data = overQuoteSentByStatusDataSet;

		var month_year = []; // creating array for storing browser
		var customer_signed = [];
		var suspect_hot_lead = [];
		var suspect_reassign = [];
		var suspect_lost = [];
		var suspect_oot = [];
		var suspect_customer_lost = [];
		var suspect_off_peak_pipeline = [];
		var prospect_opportunity = [];
		var prospect_qualified = [];
		var prospecy_quote_sent = [];
		var prospecy_box_sent = [];
		var prospect_no_answer = [];
		var prospect_in_contact = [];
		var suspect_follow_up = [];
		var suspect_new = [];
		var suspect_qualified = [];
		var suspect_unqualified = [];
		var suspect_lpo_followup = [];
		var suspect_validated = [];
		var customer_free_trial = [];
		var customer_free_trial_pending = [];
		var customer_shipmate_pending = [];
		var susect_no_answer = [];
		var suspect_in_contact = [];
		var suspect_pre_qualification = [];
		var suspect_in_qualification = [];
		var total_leads = [];

		for (var i = 0; i < data.length; i++) {
			month_year.push(data[i][0]);
			suspect_new[data[i][0]] = data[i][1];
			suspect_hot_lead[data[i][0]] = data[i][2];
			suspect_qualified[data[i][0]] = data[i][4];
			suspect_unqualified[data[i][0]] = data[i][5];
			suspect_validated[data[i][0]] = data[i][3];
			suspect_pre_qualification[data[i][0]] = data[i][6];
			suspect_in_qualification[data[i][0]] = data[i][7];
			suspect_reassign[data[i][0]] = data[i][8];
			suspect_follow_up[data[i][0]] = data[i][9];
			suspect_lpo_followup[data[i][0]] = data[i][10];
			suspect_no_answer[data[i][0]] = data[i][11];
			suspect_in_contact[data[i][0]] = data[i][12];
			prospect_in_contact[data[i][0]] = data[i][13];
			suspect_off_peak_pipeline[data[i][0]] = data[i][14];
			suspect_lost[data[i][0]] = data[i][15];
			suspect_oot[data[i][0]] = data[i][16];
			suspect_customer_lost[data[i][0]] = data[i][17];
			prospect_opportunity[data[i][0]] = data[i][18];
			prospect_qualified[data[i][0]] = data[i][19];
			prospecy_box_sent[data[i][0]] = data[i][20];
			prospecy_quote_sent[data[i][0]] = data[i][21];
			customer_free_trial_pending[data[i][0]] = data[i][22];
			customer_free_trial[data[i][0]] = data[i][23];
			customer_shipmate_pending[data[i][0]] = data[i][24];
			customer_signed[data[i][0]] = data[i][25];
			total_leads[data[i][0]] = data[i][26];
		}

		// console.log("prospecy_box_sent" + prospecy_box_sent);

		var count = {}; // creating object for getting categories with
		// count
		month_year.forEach(function (i) {
			count[i] = (count[i] || 0) + 1;
		});

		var series_data20 = [];
		var series_data21 = [];
		var series_data22 = [];
		var series_data23 = [];
		var series_data24 = [];
		var series_data25 = [];
		var series_data26 = [];
		var series_data27 = [];
		var series_data28 = [];
		var series_data29 = [];
		var series_data30 = [];
		var series_data31 = [];
		var series_data32 = [];
		var series_data33 = [];
		var series_data34 = [];
		var series_data20a = [];
		var series_data21a = [];
		var series_data22a = [];
		var series_data23a = [];
		var series_data24a = [];
		var series_data25a = [];
		var series_data26a = [];
		var series_data27a = [];
		var series_data28a = [];
		var series_data29a = [];
		var series_data30a = [];
		var series_data31a = [];
		var series_data32a = [];

		var categores1 = []; // creating empty array for highcharts
		// categories
		Object.keys(prospecy_quote_sent).map(function (item, key) {
			series_data20.push(parseInt(customer_signed[item]));
			series_data21.push(parseInt(suspect_hot_lead[item]));
			series_data22.push(parseInt(suspect_reassign[item]));
			series_data23.push(parseInt(suspect_lost[item]));
			series_data24.push(parseInt(suspect_customer_lost[item]));
			series_data25.push(parseInt(suspect_off_peak_pipeline[item]));
			series_data26.push(parseInt(prospecy_quote_sent[item]));
			series_data27.push(parseInt(prospect_no_answer[item]));
			series_data28.push(parseInt(prospect_in_contact[item]));
			series_data29.push(parseInt(total_leads[item]));
			series_data31.push(parseInt(prospect_opportunity[item]));
			series_data32.push(parseInt(suspect_oot[item]));
			series_data33.push(parseInt(suspect_follow_up[item]));
			series_data34.push(parseInt(suspect_new[item]));
			series_data20a.push(parseInt(suspect_qualified[item]));
			series_data28a.push(parseInt(suspect_unqualified[item]));
			series_data21a.push(parseInt(suspect_lpo_followup[item]));
			series_data22a.push(parseInt(suspect_validated[item]));
			series_data23a.push(parseInt(customer_free_trial[item]));
			series_data24a.push(parseInt(suspect_no_answer[item]));
			series_data25a.push(parseInt(suspect_in_contact[item]));
			series_data26a.push(parseInt(prospect_qualified[item]));
			series_data27a.push(parseInt(customer_free_trial_pending[item]));
			series_data29a.push(parseInt(prospecy_box_sent[item]));
			series_data30a.push(parseInt(suspect_pre_qualification[item]));
			series_data31a.push(parseInt(suspect_in_qualification[item]));
			series_data32a.push(parseInt(customer_shipmate_pending[item]));
			categores1.push(item);
		});

		plotChartPreviewQuoteSentByStatus(
			series_data20,
			series_data21,
			series_data22,
			series_data23,
			series_data24,
			series_data25,
			series_data26,
			series_data27,
			series_data28,
			series_data29,
			series_data31,
			series_data32,
			series_data33,
			series_data34,
			categores1,
			series_data20a,
			series_data21a,
			series_data22a,
			series_data23a,
			series_data24a,
			series_data25a,
			series_data26a,
			series_data27a,
			series_data28a,
			series_data29a,
			series_data30a,
			series_data31a,
			series_data32a
		);

		if (role != 1000) {
			// TODO - Zee Preview

			// Sales Dashboard - Franchisee Generated Leads by Status - Weekly Reporting
			// var zeeLeadsByStatusWeeklySearch = search.load({
			// 	type: "customer",
			// 	id: "customsearch_leads_reporting_weekly_4_2",
			// });

			//Sales Dashboard - Leads by Status & Zee - Weekly Reporting
			var zeeLeadsByStatusWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_4__5",
			});

			zeeLeadsByStatusWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "TEST",
					})
				);
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(cancelled_start_date) &&
				!isNullorEmpty(cancelled_last_date)
			) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity13",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: cancelled_start_date,
					})
				);

				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity13",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: cancelled_last_date,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.IS,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (!isNullorEmpty(sales_campaign)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				zeeLeadsByStatusWeeklySearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (
				!isNullorEmpty(modified_date_from) &&
				!isNullorEmpty(modified_date_to)
			) {
				var defaultSearchFilters =
					zeeLeadsByStatusWeeklySearch.filterExpression;

				console.log(
					"default search filters: " + JSON.stringify(defaultSearchFilters)
				);

				var modifiedDateFilters = [
					[
						["activity.date", "within", [modified_date_from, modified_date_to]],
						"AND",
						[
							"activity.custevent_organiser",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
					"AND",
					[
						[
							"usernotes.notedate",
							"within",
							[modified_date_from, modified_date_to],
						],
						"AND",
						[
							"usernotes.author",
							"anyof",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
				];
				console.log(
					"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
				);

				defaultSearchFilters.push("AND");
				defaultSearchFilters.push(modifiedDateFilters);

				console.log(
					"defaultSearchFilters filters: " +
					JSON.stringify(defaultSearchFilters)
				);

				zeeLeadsByStatusWeeklySearch.filterExpression = defaultSearchFilters;
			}

			var count1 = 0;
			var oldZeeName = null;

			var customer_signed = 0;
			var suspect_hot_lead = 0;
			var suspect_reassign = 0;
			var suspect_lost = 0;
			var suspect_oot = 0;
			var suspect_customer_lost = 0;
			var suspect_off_peak_pipeline = 0;
			var prospect_opportunity = 0;
			var prospect_qualified = 0;
			var prospecy_quote_sent = 0;
			var prospect_no_answer = 0;
			var prospect_in_contact = 0;
			var suspect_follow_up = 0;
			var suspect_new = 0;

			var suspect_lpo_followup = 0;
			var suspect_qualified = 0;
			var suspect_unqualified = 0;
			var suspect_pre_qualification = 0;
			var suspect_in_qualification = 0;

			var suspect_validated = 0;
			var customer_free_trial = 0;
			var customer_free_trial_pending = 0;
			var customer_shipmate_pending = 0;

			var suspect_no_answer = 0;
			var suspect_in_contact = 0;

			zeeLeadsByStatusWeeklySearch
				.run()
				.each(function (zeeLeadsByStatusWeeklySearchResultSet) {
					var prospectCount = parseInt(
						zeeLeadsByStatusWeeklySearchResultSet.getValue({
							name: "internalid",
							summary: "COUNT",
						})
					);

					var custStatus = parseInt(
						zeeLeadsByStatusWeeklySearchResultSet.getValue({
							name: "entitystatus",
							summary: "GROUP",
						})
					);
					var custStatusText = zeeLeadsByStatusWeeklySearchResultSet.getText({
						name: "entitystatus",
						summary: "GROUP",
					});
					var zeeName = zeeLeadsByStatusWeeklySearchResultSet.getText({
						name: "partner",
						summary: "GROUP",
					});

					if (isNullorEmpty(zeeName)) {
						zeeName = "Unassigned";
					}

					if (count1 == 0) {
						if (custStatus == 13 || custStatus == 66) {
							//CUSTOMER _ SIGNED
							customer_signed = parseInt(prospectCount);
						} else if (custStatus == 57) {
							//SUSPECT - HOT LEAD
							suspect_hot_lead = parseInt(prospectCount);
						} else if (custStatus == 59) {
							//SUSPECT - LOST
							suspect_lost = parseInt(prospectCount);
						} else if (custStatus == 64) {
							//SUSPECT - OUT OF TERRITORY
							suspect_oot = parseInt(prospectCount);
						} else if (custStatus == 22) {
							//SUSPECT - CUSTOMER - LOST
							suspect_customer_lost = parseInt(prospectCount);
						} else if (custStatus == 60 || custStatus == 40) {
							//SUSPECT - REP REASSIGN
							suspect_reassign = parseInt(prospectCount);
						} else if (custStatus == 50) {
							//PROSPECT - QUOTE SENT
							prospecy_quote_sent = parseInt(prospectCount);
						} else if (custStatus == 35) {
							//PROSPECT - NO ANSWER
							prospect_no_answer = parseInt(prospectCount);
						} else if (custStatus == 8) {
							//PROSPECT - IN CONTACT
							prospect_in_contact = parseInt(prospectCount);
						} else if (custStatus == 62) {
							//SUSPECT - OFF PEAK PIPELINE
							suspect_off_peak_pipeline = parseInt(prospectCount);
						} else if (custStatus == 58) {
							//PROSPECT - OPPORTUNITY
							prospect_opportunity = parseInt(prospectCount);
						} else if (custStatus == 18) {
							//SUSPECT - FOLLOW UP
							suspect_follow_up = parseInt(prospectCount);
						} else if (custStatus == 6) {
							//SUSPECT - NEW
							suspect_new = parseInt(prospectCount);
						} else if (custStatus == 42) {
							//SUSPECT - QUALIFIED
							suspect_qualified = parseInt(prospectCount);
						} else if (custStatus == 38) {
							//SUSPECT - UNQUALIFIED
							suspect_unqualified = parseInt(prospectCount);
						} else if (custStatus == 67) {
							//SUSPECT - LPO FOLLOW UP
							suspect_lpo_followup = parseInt(prospectCount);
						} else if (custStatus == 68) {
							//SUSPECT - VALIDATED
							suspect_validated = parseInt(prospectCount);
						} else if (custStatus == 32) {
							//CUSTOMER - FREE TRIAL
							customer_free_trial = parseInt(prospectCount);
						} else if (custStatus == 32) {
							//CUSTOMER - FREE TRIAL PENDING
							customer_free_trial_pending = parseInt(prospectCount);
						} else if (custStatus == 20) {
							//SUSPECT - NO ANSWER
							suspect_no_answer = parseInt(prospectCount);
						} else if (custStatus == 69) {
							//SUSPECT - IN CONTACT
							suspect_in_contact = parseInt(prospectCount);
						} else if (custStatus == 70) {
							//PROSPECT - QUALIFIED
							prospect_qualified = parseInt(prospectCount);
						} else if (custStatus == 30) {
							//PROSPECT - IN QUALIFICATION
							suspect_in_qualification = parseInt(prospectCount);
						} else if (custStatus == 34) {
							//PROSPECT - PRE QUALIFICATION
							suspect_pre_qualification = parseInt(prospectCount);
						} else if (custStatus == 73) {
							//CUSTOMER - SHIPMATE PENDING
							customer_shipmate_pending = parseInt(prospectCount);
						}

						total_leads =
							customer_signed +
							suspect_hot_lead +
							suspect_lost +
							suspect_customer_lost +
							suspect_reassign +
							prospecy_quote_sent +
							prospect_no_answer +
							prospect_in_contact +
							suspect_off_peak_pipeline +
							prospect_opportunity +
							suspect_oot +
							suspect_follow_up +
							suspect_new +
							suspect_qualified +
							suspect_lpo_followup +
							suspect_validated +
							customer_free_trial +
							suspect_no_answer +
							suspect_in_contact +
							prospect_qualified +
							customer_free_trial_pending +
							suspect_unqualified +
							suspect_pre_qualification +
							suspect_in_qualification + customer_shipmate_pending
					} else if (oldZeeName != null && oldZeeName == zeeName) {
						if (custStatus == 13 || custStatus == 66) {
							//CUSTOMER _ SIGNED
							customer_signed += prospectCount;
						} else if (custStatus == 57) {
							//SUSPECT - HOT LEAD
							suspect_hot_lead += prospectCount;
						} else if (custStatus == 59) {
							//SUSPECT - LOST
							suspect_lost += prospectCount;
						} else if (custStatus == 64) {
							//SUSPECT - OUT OF TERRITORY
							suspect_oot += parseInt(prospectCount);
						} else if (custStatus == 22) {
							//SUSPECT - CUSTOMER - LOST
							suspect_customer_lost += prospectCount;
						} else if (custStatus == 60 || custStatus == 40) {
							//SUSPECT - REP REASSIGN
							suspect_reassign += prospectCount;
						} else if (custStatus == 50) {
							//PROSPECT - QUOTE SENT
							prospecy_quote_sent += prospectCount;
						} else if (custStatus == 35) {
							//PROSPECT - NO ANSWER
							prospect_no_answer += prospectCount;
						} else if (custStatus == 8) {
							//PROSPECT - IN CONTACT
							prospect_in_contact += prospectCount;
						} else if (custStatus == 62) {
							//SUSPECT - OFF PEAK PIPELINE
							suspect_off_peak_pipeline += prospectCount;
						} else if (custStatus == 58) {
							//PROSPECT - OPPORTUNITY
							prospect_opportunity += parseInt(prospectCount);
						} else if (custStatus == 18) {
							//SUSPECT - FOLLOW UP
							suspect_follow_up += parseInt(prospectCount);
						} else if (custStatus == 6) {
							//SUSPECT - NEW
							suspect_new += parseInt(prospectCount);
						} else if (custStatus == 42) {
							//SUSPECT - QUALIFIED
							suspect_qualified += parseInt(prospectCount);
						} else if (custStatus == 38) {
							//SUSPECT - UNQUALIFIED
							suspect_unqualified += parseInt(prospectCount);
						} else if (custStatus == 67) {
							//SUSPECT - LPO FOLLOW UP
							suspect_lpo_followup += parseInt(prospectCount);
						} else if (custStatus == 68) {
							//SUSPECT - VALIDATED
							suspect_validated += parseInt(prospectCount);
						} else if (custStatus == 32) {
							//CUSTOMER - FREE TRIAL
							customer_free_trial += parseInt(prospectCount);
						} else if (custStatus == 71) {
							//CUSTOMER - FREE TRIAL PENDING
							customer_free_trial_pending += parseInt(prospectCount);
						} else if (custStatus == 20) {
							//SUSPECT - NO ANSWER
							suspect_no_answer += parseInt(prospectCount);
						} else if (custStatus == 69) {
							//SUSPECT - IN CONTACT
							suspect_in_contact += parseInt(prospectCount);
						} else if (custStatus == 70) {
							//PROSPECT - QUALIFIED
							prospect_qualified += parseInt(prospectCount);
						} else if (custStatus == 30) {
							//PROSPECT - IN QUALIFICATION
							suspect_in_qualification += parseInt(prospectCount);
						} else if (custStatus == 34) {
							//PROSPECT - PRE QUALIFICATION
							suspect_pre_qualification += parseInt(prospectCount);
						} else if (custStatus == 73) {
							//CUSTOMER - SHIPMATE PENDING
							customer_shipmate_pending += parseInt(prospectCount);
						}

						total_leads =
							customer_signed +
							suspect_hot_lead +
							suspect_lost +
							suspect_customer_lost +
							suspect_reassign +
							prospecy_quote_sent +
							prospect_no_answer +
							prospect_in_contact +
							suspect_off_peak_pipeline +
							prospect_opportunity +
							suspect_oot +
							suspect_follow_up +
							suspect_new +
							suspect_qualified +
							suspect_lpo_followup +
							suspect_validated +
							customer_free_trial +
							suspect_no_answer +
							suspect_in_contact +
							prospect_qualified +
							customer_free_trial_pending +
							suspect_unqualified +
							suspect_pre_qualification +
							suspect_in_qualification + customer_shipmate_pending;
					} else if (oldDate1 != null && oldZeeName != zeeName) {
						zee_debt_set2.push({
							zeeName: oldZeeName,
							suspect_hot_lead: suspect_hot_lead,
							prospecy_quote_sent: prospecy_quote_sent,
							suspect_reassign: suspect_reassign,
							prospect_no_answer: prospect_no_answer,
							prospect_in_contact: prospect_in_contact,
							suspect_off_peak_pipeline: suspect_off_peak_pipeline,
							suspect_lost: suspect_lost,
							suspect_customer_lost: suspect_customer_lost,
							prospect_opportunity: prospect_opportunity,
							customer_signed: customer_signed,
							total_leads: total_leads,
							suspect_oot: suspect_oot,
							suspect_follow_up: suspect_follow_up,
							suspect_new: suspect_new,
							suspect_qualified: suspect_qualified,
							suspect_unqualified: suspect_unqualified,
							suspect_lpo_followup: suspect_lpo_followup,
							suspect_validated: suspect_validated,
							customer_free_trial: customer_free_trial,
							suspect_no_answer: suspect_no_answer,
							suspect_in_contact: suspect_in_contact,
							prospect_qualified: prospect_qualified,
							customer_free_trial_pending: customer_free_trial_pending,
							suspect_pre_qualification: suspect_pre_qualification,
							suspect_in_qualification: suspect_in_qualification,
							customer_shipmate_pending: customer_shipmate_pending
						});

						customer_signed = 0;
						suspect_hot_lead = 0;
						suspect_reassign = 0;
						suspect_lost = 0;
						suspect_customer_lost = 0;
						suspect_off_peak_pipeline = 0;
						prospect_opportunity = 0;
						prospecy_quote_sent = 0;
						prospect_no_answer = 0;
						prospect_in_contact = 0;
						suspect_oot = 0;
						suspect_follow_up = 0;
						suspect_new = 0;
						suspect_qualified = 0;
						suspect_unqualified = 0;
						suspect_lpo_followup = 0;
						total_leads = 0;
						prospect_qualified = 0;

						suspect_validated = 0;
						customer_free_trial = 0;
						customer_free_trial_pending = 0;
						suspect_no_answer = 0;
						suspect_in_contact = 0;
						suspect_pre_qualification = 0;
						suspect_in_qualification = 0;
						customer_shipmate_pending = 0;

						if (custStatus == 13 || custStatus == 66) {
							//CUSTOMER _ SIGNED
							customer_signed = prospectCount;
						} else if (custStatus == 57) {
							//SUSPECT - HOT LEAD
							suspect_hot_lead = prospectCount;
						} else if (custStatus == 59) {
							//SUSPECT - LOST
							suspect_lost = prospectCount;
						} else if (custStatus == 64) {
							//SUSPECT - OUT OF TERRITORY
							suspect_oot = parseInt(prospectCount);
						} else if (custStatus == 22) {
							//SUSPECT - CUSTOMER - LOST
							suspect_customer_lost = prospectCount;
						} else if (custStatus == 60 || custStatus == 40) {
							//SUSPECT - REP REASSIGN
							suspect_reassign = prospectCount;
						} else if (custStatus == 50) {
							//PROSPECT - QUOTE SENT
							prospecy_quote_sent = prospectCount;
						} else if (custStatus == 35) {
							//PROSPECT - NO ANSWER
							prospect_no_answer = prospectCount;
						} else if (custStatus == 8) {
							//PROSPECT - IN CONTACT
							prospect_in_contact = prospectCount;
						} else if (custStatus == 62) {
							//SUSPECT - OFF PEAK PIPELINE
							suspect_off_peak_pipeline = prospectCount;
						} else if (custStatus == 58) {
							//PROSPECT - OPPORTUNITY
							prospect_opportunity = parseInt(prospectCount);
						} else if (custStatus == 18) {
							//SUSPECT - FOLLOW UP
							suspect_follow_up = parseInt(prospectCount);
						} else if (custStatus == 6) {
							//SUSPECT - NEW
							suspect_new = parseInt(prospectCount);
						} else if (custStatus == 42) {
							//SUSPECT - QUALIFIED
							suspect_qualified = parseInt(prospectCount);
						} else if (custStatus == 38) {
							//SUSPECT - UNQUALIFIED
							suspect_unqualified = parseInt(prospectCount);
						} else if (custStatus == 67) {
							//SUSPECT - LPO FOLLOW UP
							suspect_lpo_followup = parseInt(prospectCount);
						} else if (custStatus == 68) {
							//SUSPECT - VALIDATED
							suspect_validated = parseInt(prospectCount);
						} else if (custStatus == 32) {
							//CUSTOMER - FREE TRIAL
							customer_free_trial = parseInt(prospectCount);
						} else if (custStatus == 32) {
							//CUSTOMER - FREE TRIAL PENDING
							customer_free_trial_pending = parseInt(prospectCount);
						} else if (custStatus == 20) {
							//SUSPECT - NO ANSWER
							suspect_no_answer = parseInt(prospectCount);
						} else if (custStatus == 69) {
							//SUSPECT - IN CONTACT
							suspect_in_contact = parseInt(prospectCount);
						} else if (custStatus == 70) {
							//PROSPECT QUALIFIED
							prospect_qualified = parseInt(prospectCount);
						} else if (custStatus == 30) {
							//PROSPECT - IN QUALIFICATION
							suspect_in_qualification = parseInt(prospectCount);
						} else if (custStatus == 34) {
							//PROSPECT - PRE QUALIFICATION
							suspect_pre_qualification = parseInt(prospectCount);
						} else if (custStatus == 73) {
							//CUSTOMER - SHIPMATE PENDING
							customer_shipmate_pending = parseInt(prospectCount);
						}

						total_leads =
							customer_signed +
							suspect_hot_lead +
							suspect_lost +
							suspect_customer_lost +
							suspect_reassign +
							prospecy_quote_sent +
							prospect_no_answer +
							prospect_in_contact +
							suspect_off_peak_pipeline +
							prospect_opportunity +
							suspect_oot +
							suspect_follow_up +
							suspect_new +
							suspect_qualified +
							suspect_lpo_followup +
							suspect_validated +
							customer_free_trial +
							suspect_no_answer +
							suspect_in_contact +
							prospect_qualified +
							customer_free_trial_pending +
							suspect_unqualified +
							suspect_pre_qualification +
							suspect_in_qualification + customer_shipmate_pending;
					}

					count1++;
					oldZeeName = zeeName;
					return true;
				});

			if (count1 > 0) {
				zee_debt_set2.push({
					zeeName: oldZeeName,
					suspect_hot_lead: suspect_hot_lead,
					prospecy_quote_sent: prospecy_quote_sent,
					suspect_reassign: suspect_reassign,
					prospect_no_answer: prospect_no_answer,
					prospect_in_contact: prospect_in_contact,
					suspect_off_peak_pipeline: suspect_off_peak_pipeline,
					suspect_lost: suspect_lost,
					suspect_customer_lost: suspect_customer_lost,
					prospect_opportunity: prospect_opportunity,
					customer_signed: customer_signed,
					total_leads: total_leads,
					suspect_oot: suspect_oot,
					suspect_follow_up: suspect_follow_up,
					suspect_new: suspect_new,
					suspect_qualified: suspect_qualified,
					suspect_unqualified: suspect_unqualified,
					suspect_lpo_followup: suspect_lpo_followup,
					suspect_validated: suspect_validated,
					customer_free_trial: customer_free_trial,
					suspect_no_answer: suspect_no_answer,
					suspect_in_contact: suspect_in_contact,
					prospect_qualified: prospect_qualified,
					customer_free_trial_pending: customer_free_trial_pending,
					suspect_pre_qualification: suspect_pre_qualification,
					suspect_in_qualification: suspect_in_qualification,
					customer_shipmate_pending: customer_shipmate_pending
				});
			}

			console.log("zee_debt_set2: " + JSON.stringify(zee_debt_set2));

			zee_previewDataSet = [];
			zee_csvPreviewSet = [];

			var zee_overDataSet = [];

			if (!isNullorEmpty(zee_debt_set2)) {
				zee_debt_set2.forEach(function (preview_row, index) {
					var hotLeadPercentage = parseInt(
						(preview_row.suspect_hot_lead / preview_row.total_leads) * 100
					);
					var hotLeadCol =
						preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

					var quoteSentPercentage = parseInt(
						(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
					);
					var quoteSentCol =
						preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

					var reassignPercentage = parseInt(
						(preview_row.suspect_reassign / preview_row.total_leads) * 100
					);
					var reassignCol =
						preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

					var noAnswerPercentage = parseInt(
						(preview_row.prospect_no_answer / preview_row.total_leads) * 100
					);
					var noAnswerCol =
						preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

					var inContactPercentage = parseInt(
						(preview_row.prospect_in_contact / preview_row.total_leads) * 100
					);
					var inContactCol =
						preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

					var offPeakPercentage = parseInt(
						(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
						100
					);
					var offPeakCol =
						preview_row.suspect_off_peak_pipeline +
						" (" +
						offPeakPercentage +
						"%)";

					var lostPercentage = parseInt(
						(preview_row.suspect_lost / preview_row.total_leads) * 100
					);
					var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

					var ootPercentage = parseInt(
						(preview_row.suspect_oot / preview_row.total_leads) * 100
					);
					var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

					var custLostPercentage = parseInt(
						(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
					);
					var custLostCol =
						preview_row.suspect_customer_lost +
						" (" +
						custLostPercentage +
						"%)";

					var oppPercentage = parseInt(
						(preview_row.prospect_opportunity / preview_row.total_leads) * 100
					);
					var oppCol =
						preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

					var signedPercentage = parseInt(
						(preview_row.customer_signed / preview_row.total_leads) * 100
					);
					var signedCol =
						preview_row.customer_signed + " (" + signedPercentage + "%)";

					var suspectFollowUpPErcentage = parseInt(
						(preview_row.suspect_follow_up / preview_row.total_leads) * 100
					);
					var followUpCol =
						preview_row.suspect_follow_up +
						" (" +
						suspectFollowUpPErcentage +
						"%)";

					var suspectNewPercentage = parseInt(
						(preview_row.suspect_new / preview_row.total_leads) * 100
					);
					var suspectNewCol =
						preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

					var suspectQualifiedPercentage = parseInt(
						(preview_row.suspect_qualified / preview_row.total_leads) * 100
					);
					var suspectQualifiedCol =
						preview_row.suspect_qualified +
						" (" +
						suspectQualifiedPercentage +
						"%)";

					var suspectUnqualifiedPercentage = parseInt(
						(preview_row.suspect_unqualified / preview_row.total_leads) * 100
					);
					var suspectUnqualifiedCol =
						preview_row.suspect_unqualified +
						" (" +
						suspectUnqualifiedPercentage +
						"%)";

					var suspectLPOFollowupPercentage = parseInt(
						(preview_row.suspect_lpo_followup / preview_row.total_leads) * 100
					);
					var suspectLPOFollowupwCol =
						preview_row.suspect_lpo_followup +
						" (" +
						suspectLPOFollowupPercentage +
						"%)";

					var suspectValidatedPercentage = parseInt(
						(preview_row.suspect_validated / preview_row.total_leads) * 100
					);
					var suspectValidatedCol =
						preview_row.suspect_validated +
						" (" +
						suspectValidatedPercentage +
						"%)";

					var customerFreeTrialPercentage = parseInt(
						(preview_row.customer_free_trial / preview_row.total_leads) * 100
					);
					var customerFreeTrialCol =
						preview_row.customer_free_trial +
						" (" +
						customerFreeTrialPercentage +
						"%)";

					var customerFreeTrialPendingPercentage = parseInt(
						(preview_row.customer_free_trial_pending /
							preview_row.total_leads) *
						100
					);
					var customerFreeTrialPendingCol =
						preview_row.customer_free_trial_pending +
						" (" +
						customerFreeTrialPendingPercentage +
						"%)";

					var customerShipMatePendingPercentage = parseInt(
						(preview_row.customer_shipmate_pending /
							preview_row.total_leads) *
						100
					);
					var customerShipMatePendingCol =
						preview_row.customer_shipmate_pending +
						" (" +
						customerShipMatePendingPercentage +
						"%)";

					var suspectNoAnswerPercentage = parseInt(
						(preview_row.suspect_no_answer / preview_row.total_leads) * 100
					);
					var suspectNoAnswerCol =
						preview_row.suspect_no_answer +
						" (" +
						suspectNoAnswerPercentage +
						"%)";

					var suspectInContactPercentage = parseInt(
						(preview_row.suspect_in_contact / preview_row.total_leads) * 100
					);
					var suspectInContactCol =
						preview_row.suspect_in_contact +
						" (" +
						suspectInContactPercentage +
						"%)";

					var prospectQualifiedPercentage = parseInt(
						(preview_row.prospect_qualified / preview_row.total_leads) * 100
					);
					var prospectQualifiedCol =
						preview_row.prospect_qualified +
						" (" +
						prospectQualifiedPercentage +
						"%)";

					var suspectPreQualificationPercentage = parseInt(
						(preview_row.suspect_pre_qualification / preview_row.total_leads) *
						100
					);
					var suspectPreQualificationCol =
						preview_row.suspect_pre_qualification +
						" (" +
						suspectPreQualificationPercentage +
						"%)";

					var suspectInQualificationPercentage = parseInt(
						(preview_row.suspect_in_qualification / preview_row.total_leads) *
						100
					);
					var suspectInQualificationCol =
						preview_row.suspect_in_qualification +
						" (" +
						suspectInQualificationPercentage +
						"%)";

					zee_overDataSet.push([
						preview_row.zeeName,
						preview_row.suspect_new,
						preview_row.suspect_hot_lead,
						preview_row.suspect_validated,
						preview_row.suspect_qualified,
						preview_row.suspect_unqualified,
						preview_row.suspect_pre_qualification,
						preview_row.suspect_in_qualification,
						preview_row.suspect_reassign,
						preview_row.suspect_follow_up,
						preview_row.suspect_no_answer,
						preview_row.suspect_in_contact,
						preview_row.suspect_lpo_followup,
						preview_row.prospect_in_contact,
						preview_row.suspect_off_peak_pipeline,
						preview_row.suspect_lost,
						preview_row.suspect_oot,
						preview_row.suspect_customer_lost,
						preview_row.prospect_opportunity,
						preview_row.prospect_qualified,
						preview_row.prospecy_quote_sent,
						preview_row.customer_free_trial_pending,
						preview_row.customer_free_trial,
						preview_row.customer_shipmate_pending,
						preview_row.customer_signed,
						preview_row.total_leads,
					]);

					zee_previewDataSet.push([
						preview_row.zeeName,
						suspectNewCol,
						hotLeadCol,
						suspectValidatedCol,
						suspectQualifiedCol,
						suspectUnqualifiedCol,
						suspectPreQualificationCol,
						suspectInQualificationCol,
						reassignCol,
						followUpCol,
						suspectLPOFollowupwCol,
						suspectNoAnswerCol,
						suspectInContactCol,
						inContactCol,
						offPeakCol,
						lostCol,
						ootCol,
						custLostCol,
						oppCol,
						prospectQualifiedCol,
						quoteSentCol,
						customerFreeTrialPendingCol,
						customerFreeTrialCol,
						customerShipMatePendingCol,
						signedCol,
						preview_row.total_leads,
					]);
				});
			}

			console.log("zee_previewDataSet");
			console.log(zee_previewDataSet);

			var dataTableZeePreview = $("#mpexusage-zee_overview").DataTable({
				destroy: true,
				data: zee_previewDataSet,
				pageLength: 1000,
				order: [24, "desc"],
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
						title: "Franchisee", //0
					},
					{
						title: "Suspect - New", //1
					},
					{
						title: "Suspect - Hot Lead", //2
					},
					{
						title: "Suspect - Validated", //3
					},
					{
						title: "Suspect - Qualified", //4
					},
					{
						title: "Suspect - Unqualified", //5
					},
					{
						title: "Suspect - Pre Qualification", //6
					},
					{
						title: "Suspect - In Qualification", //7
					},
					{
						title: "Suspect - Reassign", //8
					},
					{
						title: "Suspect - Follow Up", //9
					},
					{
						title: "Suspect - LPO Follow Up", //10
					},
					{
						title: "Suspect - No Answer", //11
					},
					{
						title: "Suspect - In Contact", //12
					},
					{
						title: "Prospect - In Contact", //13
					},
					{
						title: "Suspect - Parking Lot", //14
					},
					{
						title: "Suspect - Lost", //15
					},
					{
						title: "Suspect - Out of Territory", //16
					},
					{
						title: "Suspect - Customer - Lost", //17
					},
					{
						title: "Prospect - Opportunity", //18
					},
					{
						title: "Prospect - Qualified", //19
					},
					{
						title: "Prospect - Quote Sent", //20
					},
					{
						title: "Customer - Free Trial Pending", //21
					},
					{
						title: "Customer - Free Trial", //22
					},
					{
						title: "Customer - ShipMate Pending", //23
					},
					{
						title: "Customer - Signed", //24
					},
					{
						title: "Total Lead Count", //25
					},
				],
				columnDefs: [
					{
						targets: [0, 4, 20, 22, 23, 24],
						className: "bolded",
					},
				],
				footerCallback: function (row, data, start, end, display) {
					var api = this.api(),
						data;

					// Remove the formatting to get integer data for summation
					var intVal = function (i) {
						return parseInt(i);
					};

					const formatter = new Intl.NumberFormat("en-AU", {
						style: "currency",
						currency: "AUD",
						minimumFractionDigits: 2,
					});
					// Total Suspect New Lead Count
					total_suspect_new = api
						.column(1)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Hot Lead Count
					total_suspect_hot_lead = api
						.column(2)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Qualified Count
					total_suspect_qualified = api
						.column(3)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Unqualified Count
					total_suspect_unqualified = api
						.column(4)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Validated
					total_suspect_validated = api
						.column(5)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Reassign
					total_suspect_reassign = api
						.column(6)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Follow Up
					total_suspect_followup = api
						.column(7)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect LPO Follow Up
					total_suspect_lpo_followup = api
						.column(8)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect No Answer
					total_suspect_no_answer = api
						.column(9)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect In Contact
					total_suspect_in_contact = api
						.column(10)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect In Contact
					total_prospect_in_contact = api
						.column(11)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Off Peak Pipline
					total_suspect_off_peak_pipeline = api
						.column(12)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Lost
					total_suspect_lost = api
						.column(13)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Out of Territory
					total_suspect_oot = api
						.column(14)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Suspect Customer Lost
					total_suspect_customer_lost = api
						.column(15)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect Opportunity
					total_prospect_opportunity = api
						.column(16)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_prospect_qualified = api
						.column(17)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Prospect Quoite Sent
					total_prospect_quote_sent = api
						.column(18)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial Pending
					total_customer_free_trial_pending = api
						.column(19)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Free Trial
					total_customer_free_trial = api
						.column(20)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Customer Signed
					total_customer_signed = api
						.column(21)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_lead_v1 = api
						.column(22)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_lead_shipmate_pending = api
						.column(23)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					total_lead_v2 = api
						.column(24)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Total Lead Count
					total_lead = api
						.column(25)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Update footer
					$(api.column(1).footer()).html(
						total_suspect_new +
						" (" +
						((total_suspect_new / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(2).footer()).html(
						total_suspect_hot_lead +
						" (" +
						((total_suspect_hot_lead / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(3).footer()).html(
						total_suspect_qualified +
						" (" +
						((total_suspect_qualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(4).footer()).html(
						total_suspect_unqualified +
						" (" +
						((total_suspect_unqualified / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(5).footer()).html(
						total_suspect_validated +
						" (" +
						((total_suspect_validated / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(6).footer()).html(
						total_suspect_reassign +
						" (" +
						((total_suspect_reassign / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(7).footer()).html(
						total_suspect_followup +
						" (" +
						((total_suspect_followup / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(8).footer()).html(
						total_suspect_lpo_followup +
						" (" +
						((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(9).footer()).html(
						total_suspect_no_answer +
						" (" +
						((total_suspect_no_answer / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(10).footer()).html(
						total_suspect_in_contact +
						" (" +
						((total_suspect_in_contact / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(11).footer()).html(
						total_prospect_in_contact +
						" (" +
						((total_prospect_in_contact / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(12).footer()).html(
						total_suspect_off_peak_pipeline +
						" (" +
						((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(
							0
						) +
						"%)"
					);
					$(api.column(13).footer()).html(
						total_suspect_lost +
						" (" +
						((total_suspect_lost / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(14).footer()).html(
						total_suspect_oot +
						" (" +
						((total_suspect_oot / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(15).footer()).html(
						total_suspect_customer_lost +
						" (" +
						((total_suspect_customer_lost / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(16).footer()).html(
						total_prospect_opportunity +
						" (" +
						((total_prospect_opportunity / total_lead) * 100).toFixed(0) +
						"%)"
					);

					$(api.column(17).footer()).html(
						total_prospect_qualified +
						" (" +
						((total_prospect_qualified / total_lead) * 100).toFixed(0) +
						"%)"
					);

					$(api.column(18).footer()).html(
						total_prospect_quote_sent +
						" (" +
						((total_prospect_quote_sent / total_lead) * 100).toFixed(0) +
						"%)"
					);

					$(api.column(19).footer()).html(
						total_customer_free_trial_pending +
						" (" +
						((total_customer_free_trial_pending / total_lead) * 100).toFixed(
							0
						) +
						"%)"
					);

					$(api.column(20).footer()).html(
						total_customer_free_trial +
						" (" +
						((total_customer_free_trial / total_lead) * 100).toFixed(0) +
						"%)"
					);

					$(api.column(21).footer()).html(
						total_customer_signed +
						" (" +
						((total_customer_signed / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(22).footer()).html(
						total_lead_v1 +
						" (" +
						((total_lead_v1 / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(23).footer()).html(
						total_lead_shipmate_pending +
						" (" +
						((total_lead_shipmate_pending / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(24).footer()).html(
						total_lead_v2 +
						" (" +
						((total_lead_v2 / total_lead) * 100).toFixed(0) +
						"%)"
					);
					$(api.column(25).footer()).html(total_lead);
				},
			});

			saveCsv(zee_previewDataSet);

			var zee_data = zee_overDataSet;

			var zee_month_year = []; // creating array for storing browser
			var zee_customer_signed = [];
			var zee_suspect_hot_lead = [];
			var zee_suspect_reassign = [];
			var zee_suspect_lost = [];
			var zee_suspect_oot = [];
			var zee_suspect_customer_lost = [];
			var zee_suspect_off_peak_pipeline = [];
			var zee_prospect_opportunity = [];
			var zee_prospect_qualified = [];
			var zee_prospecy_quote_sent = [];
			var zee_prospect_no_answer = [];
			var zee_prospect_in_contact = [];
			var zee_suspect_follow_up = [];
			var zee_suspect_new = [];
			var zee_suspect_qualified = [];
			var zee_suspect_unqualified = [];
			var zee_suspect_lpo_followup = [];
			var zee_suspect_validated = [];
			var zee_customer_free_trial = [];
			var zee_customer_free_trial_pending = [];
			var zee_customer_shipmate_pending = [];
			var zee_suspect_no_answer = [];
			var zee_suspect_in_contact = [];
			var zee_suspect_pre_qualification = [];
			var zee_suspect_in_qualification = [];
			var zee_total_leads = [];

			for (var i = 0; i < zee_data.length; i++) {
				zee_month_year.push(zee_data[i][0]);
				zee_suspect_new[zee_data[i][0]] = zee_data[i][1];
				zee_suspect_hot_lead[zee_data[i][0]] = zee_data[i][2];
				zee_suspect_qualified[zee_data[i][0]] = zee_data[i][5];
				zee_suspect_unqualified[zee_data[i][0]] = zee_data[i][4];
				zee_suspect_validated[zee_data[i][0]] = zee_data[i][3];
				zee_suspect_pre_qualification[zee_data[i][0]] = zee_data[i][6];
				zee_suspect_in_qualification[zee_data[i][0]] = zee_data[i][7];
				zee_suspect_reassign[zee_data[i][0]] = zee_data[i][8];
				zee_suspect_follow_up[zee_data[i][0]] = zee_data[i][9];
				zee_suspect_lpo_followup[zee_data[i][0]] = zee_data[i][10];
				zee_suspect_no_answer[zee_data[i][0]] = zee_data[i][11];
				zee_suspect_in_contact[zee_data[i][0]] = zee_data[i][12];
				zee_prospect_in_contact[zee_data[i][0]] = zee_data[i][13];
				zee_suspect_off_peak_pipeline[zee_data[i][0]] = zee_data[i][14];
				zee_suspect_lost[zee_data[i][0]] = zee_data[i][15];
				zee_suspect_oot[zee_data[i][0]] = zee_data[i][16];
				zee_suspect_customer_lost[zee_data[i][0]] = zee_data[i][17];
				zee_prospect_opportunity[zee_data[i][0]] = zee_data[i][18];
				zee_prospect_qualified[zee_data[i][0]] = zee_data[i][19];
				zee_prospecy_quote_sent[zee_data[i][0]] = zee_data[i][20];
				zee_customer_free_trial_pending[zee_data[i][0]] = zee_data[i][21];
				zee_customer_free_trial[zee_data[i][0]] = zee_data[i][22];
				zee_customer_shipmate_pending[zee_data[i][0]] = zee_data[i][23];
				zee_customer_signed[zee_data[i][0]] = zee_data[i][24];
				zee_total_leads[zee_data[i][0]] = zee_data[i][25];
			}
			var zee_count = {}; // creating object for getting categories with
			// count
			zee_month_year.forEach(function (i) {
				zee_count[i] = (zee_count[i] || 0) + 1;
			});

			var zee_series_data20 = [];
			var zee_series_data21 = [];
			var zee_series_data22 = [];
			var zee_series_data23 = [];
			var zee_series_data24 = [];
			var zee_series_data25 = [];
			var zee_series_data26 = [];
			var zee_series_data27 = [];
			var zee_series_data28 = [];
			var zee_series_data29 = [];
			var zee_series_data30 = [];
			var zee_series_data31 = [];
			var zee_series_data32 = [];
			var zee_series_data33 = [];
			var zee_series_data34 = [];
			var zee_series_data20a = [];
			var zee_series_data21a = [];
			var zee_series_data22a = [];
			var zee_series_data23a = [];
			var zee_series_data24a = [];
			var zee_series_data25a = [];
			var zee_series_data26a = [];
			var zee_series_data27a = [];
			var zee_series_data28a = [];
			var zee_series_data29a = [];
			var zee_series_data30a = [];
			var zee_series_data31a = [];

			var zee_categores1 = []; // creating empty array for highcharts
			// categories
			Object.keys(zee_total_leads).map(function (item, key) {
				zee_series_data20.push(parseInt(zee_customer_signed[item]));
				zee_series_data21.push(parseInt(zee_suspect_hot_lead[item]));
				zee_series_data22.push(parseInt(zee_suspect_reassign[item]));
				zee_series_data23.push(parseInt(zee_suspect_lost[item]));
				zee_series_data24.push(parseInt(zee_suspect_customer_lost[item]));
				zee_series_data25.push(parseInt(zee_suspect_off_peak_pipeline[item]));
				zee_series_data26.push(parseInt(zee_prospecy_quote_sent[item]));
				zee_series_data27.push(parseInt(zee_prospect_no_answer[item]));
				zee_series_data28.push(parseInt(zee_prospect_in_contact[item]));
				zee_series_data29.push(parseInt(zee_total_leads[item]));
				zee_series_data31.push(parseInt(zee_prospect_opportunity[item]));
				zee_series_data32.push(parseInt(zee_suspect_oot[item]));
				zee_series_data33.push(parseInt(zee_suspect_follow_up[item]));
				zee_series_data34.push(parseInt(zee_suspect_new[item]));
				zee_series_data20a.push(parseInt(zee_suspect_qualified[item]));
				zee_series_data28a.push(parseInt(zee_suspect_unqualified[item]));
				zee_series_data21a.push(parseInt(zee_suspect_lpo_followup[item]));
				zee_series_data22a.push(parseInt(zee_suspect_validated[item]));
				zee_series_data23a.push(parseInt(zee_customer_free_trial[item]));
				zee_series_data24a.push(parseInt(zee_suspect_no_answer[item]));
				zee_series_data25a.push(parseInt(zee_suspect_in_contact[item]));
				zee_series_data26a.push(parseInt(zee_prospect_qualified[item]));
				zee_series_data27a.push(
					parseInt(zee_customer_free_trial_pending[item])
				);
				zee_series_data29a.push(parseInt(zee_suspect_pre_qualification[item]));
				zee_series_data30a.push(parseInt(zee_suspect_in_qualification[item]));
				zee_series_data31a.push(parseInt(zee_customer_shipmate_pending[item]));
				zee_categores1.push(item);
			});

			plotZeeChartPreview(
				zee_series_data20,
				zee_series_data21,
				zee_series_data22,
				zee_series_data23,
				zee_series_data24,
				zee_series_data25,
				zee_series_data26,
				zee_series_data27,
				zee_series_data28,
				zee_series_data29,
				zee_series_data31,
				zee_series_data32,
				zee_series_data33,
				zee_series_data34,
				zee_categores1,
				zee_series_data20a,
				zee_series_data21a,
				zee_series_data22a,
				zee_series_data23a,
				zee_series_data24a,
				zee_series_data25a,
				zee_series_data26a,
				zee_series_data27a,
				zee_series_data28a,
				zee_series_data29a,
				zee_series_data30a, zee_series_data31a
			);
		}

		//TODO - Sales Rep Overview
		// Sales Dashboard - Leads by Status - Sales Rep Reporting
		var leadsListBySalesRepStatusSearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_5",
		});

		leadsListBySalesRepStatusSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(cancelled_start_date) &&
			!isNullorEmpty(cancelled_last_date)
		) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			leadsListBySalesRepStatusSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				leadsListBySalesRepStatusSearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var modifiedDateFilters = [
				[
					["activity.date", "within", [modified_date_from, modified_date_to]],
					"AND",
					[
						"activity.custevent_organiser",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
				"AND",
				[
					[
						"usernotes.notedate",
						"within",
						[modified_date_from, modified_date_to],
					],
					"AND",
					[
						"usernotes.author",
						"anyof",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
			];
			console.log(
				"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
			);

			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(modifiedDateFilters);

			console.log(
				"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListBySalesRepStatusSearch.filterExpression = defaultSearchFilters;
		}

		var count1 = 0;
		var oldSalesRepAssigned = null;
		var oldSalesRepAssignedId = null;

		var customer_signed = 0;
		var suspect_hot_lead = 0;
		var suspect_reassign = 0;
		var suspect_lost = 0;
		var suspect_oot = 0;
		var suspect_customer_lost = 0;
		var suspect_off_peak_pipeline = 0;
		var prospect_opportunity = 0;
		var prospect_qualified = 0;
		var prospecy_quote_sent = 0;
		var prospecy_box_sent = 0;
		var prospect_no_answer = 0;
		var prospect_in_contact = 0;
		var suspect_follow_up = 0;
		var suspect_new = 0;

		var suspect_lpo_followup = 0;
		var suspect_qualified = 0;
		var suspect_in_qualification = 0;
		var suspect_pre_qualification = 0;
		var suspect_unqualified = 0;

		var suspect_validated = 0;
		var customer_free_trial = 0;
		var customer_free_trial_pending = 0;
		var customer_shipmate_pending = 0;

		var suspect_no_answer = 0;
		var suspect_in_contact = 0;

		leadsListBySalesRepStatusSearch
			.run()
			.each(function (lleadsListBySalesRepStatusResultSet) {
				var prospectCount = parseInt(
					lleadsListBySalesRepStatusResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);

				var custStatus = parseInt(
					lleadsListBySalesRepStatusResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					})
				);
				var custStatusText = lleadsListBySalesRepStatusResultSet.getText({
					name: "entitystatus",
					summary: "GROUP",
				});
				var salesRepAssigned = lleadsListBySalesRepStatusResultSet.getText({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var salesRepAssignedId = lleadsListBySalesRepStatusResultSet.getValue({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				if (isNullorEmpty(salesRepAssigned)) {
					salesRepAssigned = "Unassigned";
				}

				if (count1 == 0) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = parseInt(prospectCount);
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = parseInt(prospectCount);
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = parseInt(prospectCount);
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = parseInt(prospectCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = parseInt(prospectCount);
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = parseInt(prospectCount);
					} else if (custStatus == 72) {
						//PROSPECT - BOX SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = parseInt(prospectCount);
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL Pending
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_in_qualification +
						suspect_pre_qualification +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent + customer_shipmate_pending;
				} else if (
					oldSalesRepAssigned != null &&
					oldSalesRepAssigned == salesRepAssigned
				) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed += prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead += prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost += prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot += parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost += prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign += prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - BOX SENT
						prospecy_box_sent += parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline += prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up += parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new += parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified += parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified += parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup += parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated += parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial += parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending += parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer += parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified += parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification += parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification += parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending += parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_in_qualification +
						suspect_pre_qualification +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent + customer_shipmate_pending
				} else if (
					oldDate1 != null &&
					oldSalesRepAssigned != salesRepAssigned
				) {
					salesrep_debt_set2.push({
						lpoparentnameid: oldSalesRepAssignedId,
						lpoparentname: oldSalesRepAssigned,
						suspect_hot_lead: suspect_hot_lead,
						prospecy_quote_sent: prospecy_quote_sent,
						suspect_reassign: suspect_reassign,
						prospect_no_answer: prospect_no_answer,
						prospect_in_contact: prospect_in_contact,
						suspect_off_peak_pipeline: suspect_off_peak_pipeline,
						suspect_lost: suspect_lost,
						suspect_customer_lost: suspect_customer_lost,
						prospect_opportunity: prospect_opportunity,
						customer_signed: customer_signed,
						total_leads: total_leads,
						suspect_oot: suspect_oot,
						suspect_follow_up: suspect_follow_up,
						suspect_new: suspect_new,
						suspect_qualified: suspect_qualified,
						suspect_unqualified: suspect_unqualified,
						suspect_lpo_followup: suspect_lpo_followup,
						suspect_validated: suspect_validated,
						customer_free_trial: customer_free_trial,
						suspect_no_answer: suspect_no_answer,
						suspect_in_contact: suspect_in_contact,
						prospect_qualified: prospect_qualified,
						customer_free_trial_pending: customer_free_trial_pending,
						prospect_box_sent: prospecy_box_sent,
						suspect_in_qualification: suspect_in_qualification,
						suspect_pre_qualification: suspect_pre_qualification,
						customer_shipmate_pending: customer_shipmate_pending
					});

					customer_signed = 0;
					suspect_hot_lead = 0;
					suspect_reassign = 0;
					suspect_lost = 0;
					suspect_customer_lost = 0;
					suspect_off_peak_pipeline = 0;
					prospect_opportunity = 0;
					prospecy_quote_sent = 0;
					prospecy_box_sent = 0;
					prospect_no_answer = 0;
					prospect_in_contact = 0;
					suspect_oot = 0;
					suspect_follow_up = 0;
					suspect_new = 0;
					suspect_qualified = 0;
					suspect_in_qualification = 0;
					suspect_pre_qualification = 0;
					suspect_unqualified = 0;
					suspect_lpo_followup = 0;
					total_leads = 0;
					prospect_qualified = 0;

					suspect_validated = 0;
					customer_free_trial = 0;
					customer_free_trial_pending = 0;
					suspect_no_answer = 0;
					suspect_in_contact = 0;
					customer_shipmate_pending = 0;

					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - BOX SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_in_qualification +
						suspect_pre_qualification +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent + customer_shipmate_pending;
				}

				count1++;
				oldSalesRepAssigned = salesRepAssigned;
				oldSalesRepAssignedId = salesRepAssignedId;
				return true;
			});

		if (count1 > 0) {
			salesrep_debt_set2.push({
				lpoparentnameid: oldSalesRepAssignedId,
				lpoparentname: oldSalesRepAssigned,
				suspect_hot_lead: suspect_hot_lead,
				prospecy_quote_sent: prospecy_quote_sent,
				suspect_reassign: suspect_reassign,
				prospect_no_answer: prospect_no_answer,
				prospect_in_contact: prospect_in_contact,
				suspect_off_peak_pipeline: suspect_off_peak_pipeline,
				suspect_lost: suspect_lost,
				suspect_customer_lost: suspect_customer_lost,
				prospect_opportunity: prospect_opportunity,
				customer_signed: customer_signed,
				total_leads: total_leads,
				suspect_oot: suspect_oot,
				suspect_follow_up: suspect_follow_up,
				suspect_new: suspect_new,
				suspect_qualified: suspect_qualified,
				suspect_unqualified: suspect_unqualified,
				suspect_lpo_followup: suspect_lpo_followup,
				suspect_validated: suspect_validated,
				customer_free_trial: customer_free_trial,
				suspect_no_answer: suspect_no_answer,
				suspect_in_contact: suspect_in_contact,
				prospect_qualified: prospect_qualified,
				customer_free_trial_pending: customer_free_trial_pending,
				prospect_box_sent: prospecy_box_sent,
				suspect_in_qualification: suspect_in_qualification,
				suspect_pre_qualification: suspect_pre_qualification,
				customer_shipmate_pending: customer_shipmate_pending
			});
		}

		console.log("salesrep_debt_set2: " + JSON.stringify(salesrep_debt_set2));

		salesrep_previewDataSet = [];
		salesrep_csvPreviewSet = [];

		var salesrep_overDataSet = [];

		if (!isNullorEmpty(salesrep_debt_set2)) {
			salesrep_debt_set2.forEach(function (preview_row, index) {
				var hotLeadPercentage = parseInt(
					(parseInt(preview_row.suspect_hot_lead) /
						parseInt(preview_row.total_leads)) *
					100
				);
				var hotLeadCol =
					preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

				var quoteSentPercentage = parseInt(
					(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
				);
				var quoteSentCol =
					preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

				var boxSentPercentage = parseInt(
					(preview_row.prospect_box_sent / preview_row.total_leads) * 100
				);
				var boxSentCol =
					preview_row.prospect_box_sent + " (" + boxSentPercentage + "%)";

				var reassignPercentage = parseInt(
					(preview_row.suspect_reassign / preview_row.total_leads) * 100
				);
				var reassignCol =
					preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

				var noAnswerPercentage = parseInt(
					(preview_row.prospect_no_answer / preview_row.total_leads) * 100
				);
				var noAnswerCol =
					preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

				var inContactPercentage = parseInt(
					(preview_row.prospect_in_contact / preview_row.total_leads) * 100
				);
				var inContactCol =
					preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

				var offPeakPercentage = parseInt(
					(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
					100
				);
				var offPeakCol =
					preview_row.suspect_off_peak_pipeline +
					" (" +
					offPeakPercentage +
					"%)";

				var lostPercentage = parseInt(
					(preview_row.suspect_lost / preview_row.total_leads) * 100
				);
				var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

				var ootPercentage = parseInt(
					(preview_row.suspect_oot / preview_row.total_leads) * 100
				);
				var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

				var custLostPercentage = parseInt(
					(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
				);
				var custLostCol =
					preview_row.suspect_customer_lost + " (" + custLostPercentage + "%)";

				var oppPercentage = parseInt(
					(preview_row.prospect_opportunity / preview_row.total_leads) * 100
				);
				var oppCol =
					preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

				var signedPercentage = parseInt(
					(preview_row.customer_signed / preview_row.total_leads) * 100
				);
				var signedCol =
					preview_row.customer_signed + " (" + signedPercentage + "%)";

				var suspectFollowUpPErcentage = parseInt(
					(preview_row.suspect_follow_up / preview_row.total_leads) * 100
				);
				var followUpCol =
					preview_row.suspect_follow_up +
					" (" +
					suspectFollowUpPErcentage +
					"%)";

				var suspectNewPercentage = parseInt(
					(preview_row.suspect_new / preview_row.total_leads) * 100
				);
				var suspectNewCol =
					preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

				var suspectQualifiedPercentage = parseInt(
					(preview_row.suspect_qualified / preview_row.total_leads) * 100
				);
				var suspectQualifiedCol =
					preview_row.suspect_qualified +
					" (" +
					suspectQualifiedPercentage +
					"%)";

				var suspectUnqualifiedPercentage = parseInt(
					(preview_row.suspect_unqualified / preview_row.total_leads) * 100
				);
				var suspectUnqualifiedCol =
					preview_row.suspect_unqualified +
					" (" +
					suspectUnqualifiedPercentage +
					"%)";

				var suspectLPOFollowupPercentage = parseInt(
					(preview_row.suspect_lpo_followup / preview_row.total_leads) * 100
				);
				var suspectLPOFollowupwCol =
					preview_row.suspect_lpo_followup +
					" (" +
					suspectLPOFollowupPercentage +
					"%)";

				var suspectValidatedPercentage = parseInt(
					(preview_row.suspect_validated / preview_row.total_leads) * 100
				);
				var suspectValidatedCol =
					preview_row.suspect_validated +
					" (" +
					suspectValidatedPercentage +
					"%)";

				var customerFreeTrialPercentage = parseInt(
					(preview_row.customer_free_trial / preview_row.total_leads) * 100
				);
				var customerFreeTrialCol =
					preview_row.customer_free_trial +
					" (" +
					customerFreeTrialPercentage +
					"%)";

				var customerFreeTrialPendingPercentage = parseInt(
					(preview_row.customer_free_trial_pending / preview_row.total_leads) *
					100
				);
				var customerFreeTrialPendingCol =
					preview_row.customer_free_trial_pending +
					" (" +
					customerFreeTrialPendingPercentage +
					"%)";

				var customerShipMatePendingPercentage = parseInt(
					(preview_row.customer_shipmate_pending / preview_row.total_leads) *
					100
				);
				var customerShipMatePendingCol =
					preview_row.customer_shipmate_pending +
					" (" +
					customerShipMatePendingPercentage +
					"%)";

				var suspectNoAnswerPercentage = parseInt(
					(preview_row.suspect_no_answer / preview_row.total_leads) * 100
				);
				var suspectNoAnswerCol =
					preview_row.suspect_no_answer +
					" (" +
					suspectNoAnswerPercentage +
					"%)";

				var suspectInContactPercentage = parseInt(
					(preview_row.suspect_in_contact / preview_row.total_leads) * 100
				);
				var suspectInContactCol =
					preview_row.suspect_in_contact +
					" (" +
					suspectInContactPercentage +
					"%)";

				var prospectQualifiedPercentage = parseInt(
					(preview_row.prospect_qualified / preview_row.total_leads) * 100
				);
				var prospectQualifiedCol =
					preview_row.prospect_qualified +
					" (" +
					prospectQualifiedPercentage +
					"%)";

				var suspectInQualificationPercentage = parseInt(
					(preview_row.suspect_in_qualification / preview_row.total_leads) * 100
				);
				var suspectInQualificationCol =
					preview_row.suspect_in_qualification +
					" (" +
					suspectInQualificationPercentage +
					"%)";

				var suspectPreQualificationPercentage = parseInt(
					(preview_row.suspect_pre_qualification / preview_row.total_leads) *
					100
				);
				var suspectPreQualificationCol =
					preview_row.suspect_pre_qualification +
					" (" +
					suspectPreQualificationPercentage +
					"%)";

				salesrep_overDataSet.push([
					preview_row.lpoparentname,
					preview_row.suspect_new,
					preview_row.suspect_hot_lead,
					preview_row.suspect_qualified,
					preview_row.suspect_unqualified,
					preview_row.suspect_validated,
					preview_row.suspect_reassign,
					preview_row.suspect_follow_up,
					preview_row.suspect_no_answer,
					preview_row.suspect_in_contact,
					preview_row.suspect_lpo_followup,
					preview_row.prospect_in_contact,
					preview_row.suspect_off_peak_pipeline,
					preview_row.suspect_lost,
					preview_row.suspect_oot,
					preview_row.suspect_customer_lost,
					preview_row.prospect_opportunity,
					preview_row.prospect_qualified,
					preview_row.prospect_box_sent,
					preview_row.prospecy_quote_sent,
					preview_row.customer_free_trial_pending,
					preview_row.customer_free_trial,
					preview_row.customer_shipmate_pending,
					preview_row.customer_signed,
					preview_row.total_leads,
					preview_row.lpoparentnameid,
				]);

				salesrep_previewDataSet.push([
					preview_row.lpoparentname,
					suspectNewCol,
					hotLeadCol,
					suspectValidatedCol,
					suspectUnqualifiedCol,
					suspectQualifiedCol,
					suspectInQualificationCol,
					suspectPreQualificationCol,
					reassignCol,
					followUpCol,
					suspectLPOFollowupwCol,
					suspectNoAnswerCol,
					suspectInContactCol,
					inContactCol,
					offPeakCol,
					lostCol,
					ootCol,
					custLostCol,
					oppCol,
					prospectQualifiedCol,
					boxSentCol,
					quoteSentCol,
					customerFreeTrialPendingCol,
					customerFreeTrialCol,
					customerShipMatePendingCol,
					signedCol,
					preview_row.total_leads,
					'<input type="button" value="' +
					preview_row.total_leads +
					'" class="form-control btn btn-primary show_salesrep_status_timeline" id="" data-id="' +
					preview_row.lpoparentnameid +
					'" data-name="' +
					preview_row.lpoparentname +
					'" style="background-color: #095C7B;border-radius: 30px">',
					preview_row.lpoparentnameid,
				]);
			});
		}

		console.log("salesrep_previewDataSet");
		console.log(salesrep_previewDataSet);

		var dataTableLPOPreview = $("#mpexusage-salesrep_overview").DataTable({
			destroy: true,
			data: salesrep_previewDataSet,
			pageLength: 1000,
			order: [[21, "des"]],
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
					title: "Lead Gen/Lead Quali/BDM/Account Manager", //0
				},
				{
					title: "Suspect - New", //1
				},
				{
					title: "Suspect - Hot Lead", //2
				},
				{
					title: "Suspect - Validated", //3
				},
				{
					title: "Suspect - Unqualified", //4
				},
				{
					title: "Suspect - Qualified", //5
				},
				{
					title: "Suspect - Pre Qualification", //6
				},
				{
					title: "Suspect - In Qualification", //7
				},
				{
					title: "Suspect - Reassign", //8
				},
				{
					title: "Suspect - Follow Up", //9
				},
				{
					title: "Suspect - LPO Follow Up", //10
				},
				{
					title: "Suspect - No Answer", //11
				},
				{
					title: "Suspect - In Contact", //12
				},
				{
					title: "Prospect - In Contact", //13
				},
				{
					title: "Suspect - Parking Lot", //14
				},
				{
					title: "Suspect - Lost", //15
				},
				{
					title: "Suspect - Out of Territory", //16
				},
				{
					title: "Suspect - Customer - Lost", //17
				},
				{
					title: "Prospect - Opportunity", //18
				},
				{
					title: "Prospect - Qualified", //19
				},
				{
					title: "Prospect - Box Sent", //20
				},
				{
					title: "Prospect - Quote Sent", //21
				},
				{
					title: "Customer - Free Trial Pending", //22
				},
				{
					title: "Customer - Free Trial", //23
				},
				{
					title: "Customer - ShipMate Pending", //24
				},
				{
					title: "Customer - Signed", //25
				},
				{
					title: "Total Lead Count", //26
				},
				{
					title: "Show Leads", //27
				},
				{
					title: "Sales Rep ID", //28
				},
			],
			columnDefs: [
				{
					targets: [0, 5, 20, 23, 24, 25, 26],
					className: "bolded",
				},
				{
					targets: [28],
					visible: false,
				},
				{
					targets: [27, 28],
					className: "notexport",
				},
			],
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return parseInt(i);
				};

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});
				// Total Suspect New Lead Count
				total_suspect_new = api
					.column(1)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Hot Lead Count
				total_suspect_hot_lead = api
					.column(2)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Qualified Count
				total_suspect_qualified = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Unqualified Count
				total_suspect_unqualified = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Validated
				total_suspect_validated = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Reassign
				total_suspect_reassign = api
					.column(6)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Follow Up
				total_suspect_followup = api
					.column(7)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect LPO Follow Up
				total_suspect_lpo_followup = api
					.column(8)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect No Answer
				total_suspect_no_answer = api
					.column(9)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect In Contact
				total_suspect_in_contact = api
					.column(10)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect In Contact
				total_prospect_in_contact = api
					.column(11)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Off Peak Pipline
				total_suspect_off_peak_pipeline = api
					.column(12)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Lost
				total_suspect_lost = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Out of Territory
				total_suspect_oot = api
					.column(14)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Customer Lost
				total_suspect_customer_lost = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Opportunity
				total_prospect_opportunity = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prospect_qualified = api
					.column(17)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prospect_box_sent = api
					.column(18)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Quoite Sent
				total_prospect_quote_sent = api
					.column(19)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Free Trial Pending
				total_customer_free_trial_pending = api
					.column(20)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Free Trial
				total_customer_free_trial = api
					.column(21)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Signed
				total_customer_signed = api
					.column(22)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Lead Count
				total_lead_v1 = api
					.column(23)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_shipmate_pending = api
					.column(24)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_v2 = api
					.column(25)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead = api
					.column(26)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(1).footer()).html(
					total_suspect_new +
					" (" +
					((total_suspect_new / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(2).footer()).html(
					total_suspect_hot_lead +
					" (" +
					((total_suspect_hot_lead / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(3).footer()).html(
					total_suspect_qualified +
					" (" +
					((total_suspect_qualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(4).footer()).html(
					total_suspect_unqualified +
					" (" +
					((total_suspect_unqualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(5).footer()).html(
					total_suspect_validated +
					" (" +
					((total_suspect_validated / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(6).footer()).html(
					total_suspect_reassign +
					" (" +
					((total_suspect_reassign / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(7).footer()).html(
					total_suspect_followup +
					" (" +
					((total_suspect_followup / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(8).footer()).html(
					total_suspect_lpo_followup +
					" (" +
					((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(9).footer()).html(
					total_suspect_no_answer +
					" (" +
					((total_suspect_no_answer / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(10).footer()).html(
					total_suspect_in_contact +
					" (" +
					((total_suspect_in_contact / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(11).footer()).html(
					total_prospect_in_contact +
					" (" +
					((total_prospect_in_contact / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(12).footer()).html(
					total_suspect_off_peak_pipeline +
					" (" +
					((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(13).footer()).html(
					total_suspect_lost +
					" (" +
					((total_suspect_lost / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(14).footer()).html(
					total_suspect_oot +
					" (" +
					((total_suspect_oot / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(15).footer()).html(
					total_suspect_customer_lost +
					" (" +
					((total_suspect_customer_lost / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(16).footer()).html(
					total_prospect_opportunity +
					" (" +
					((total_prospect_opportunity / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(17).footer()).html(
					total_prospect_qualified +
					" (" +
					((total_prospect_qualified / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(18).footer()).html(
					total_prospect_box_sent +
					" (" +
					((total_prospect_box_sent / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(19).footer()).html(
					total_prospect_quote_sent +
					" (" +
					((total_prospect_quote_sent / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(20).footer()).html(
					total_customer_free_trial_pending +
					" (" +
					((total_customer_free_trial_pending / total_lead) * 100).toFixed(
						0
					) +
					"%)"
				);

				$(api.column(21).footer()).html(
					total_customer_free_trial +
					" (" +
					((total_customer_free_trial / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(22).footer()).html(
					total_customer_signed +
					" (" +
					((total_customer_signed / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(23).footer()).html(
					total_lead_v1 +
					" (" +
					((total_lead_v1 / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(24).footer()).html(
					total_lead_shipmate_pending +
					" (" +
					((total_lead_shipmate_pending / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(25).footer()).html(
					total_lead_v2 +
					" (" +
					((total_lead_v2 / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(26).footer()).html(total_lead);
			},
		});

		saveCsv(salesrep_previewDataSet);

		var salesrep_data = salesrep_overDataSet;

		var salesrep_month_year = []; // creating array for storing browser
		var salesrep_customer_signed = [];
		var salesrep_suspect_hot_lead = [];
		var salesrep_suspect_reassign = [];
		var salesrep_suspect_lost = [];
		var salesrep_suspect_oot = [];
		var salesrep_suspect_customer_lost = [];
		var salesrep_suspect_off_peak_pipeline = [];
		var salesrep_prospect_opportunity = [];
		var salesrep_prospect_qualified = [];
		var salesrep_prospecy_quote_sent = [];
		var salesrep_prospecy_box_sent = [];
		var salesrep_prospect_no_answer = [];
		var salesrep_prospect_in_contact = [];
		var salesrep_suspect_follow_up = [];
		var salesrep_suspect_new = [];
		var salesrep_suspect_qualified = [];
		var salesrep_suspect_unqualified = [];
		var salesrep_suspect_lpo_followup = [];
		var salesrep_suspect_validated = [];
		var salesrep_customer_free_trial_pending = [];
		var salesrep_customer_shipmate_pending = [];
		var salesrep_customer_free_trial = [];
		var salesrep_suspect_no_answer = [];
		var salesrep_suspect_in_contact = [];
		var salesrep_total_leads = [];

		for (var i = 0; i < salesrep_data.length; i++) {
			salesrep_month_year.push(salesrep_data[i][0]);
			salesrep_suspect_new[salesrep_data[i][0]] = salesrep_data[i][1];
			salesrep_suspect_hot_lead[salesrep_data[i][0]] = salesrep_data[i][2];
			salesrep_suspect_qualified[salesrep_data[i][0]] = salesrep_data[i][3];
			salesrep_suspect_unqualified[salesrep_data[i][0]] = salesrep_data[i][4];
			salesrep_suspect_validated[salesrep_data[i][0]] = salesrep_data[i][5];
			salesrep_suspect_reassign[salesrep_data[i][0]] = salesrep_data[i][6];
			salesrep_suspect_follow_up[salesrep_data[i][0]] = salesrep_data[i][7];
			salesrep_suspect_lpo_followup[salesrep_data[i][0]] = salesrep_data[i][8];
			salesrep_suspect_no_answer[salesrep_data[i][0]] = salesrep_data[i][9];
			salesrep_suspect_in_contact[salesrep_data[i][0]] = salesrep_data[i][10];
			salesrep_prospect_in_contact[salesrep_data[i][0]] = salesrep_data[i][11];
			salesrep_suspect_off_peak_pipeline[salesrep_data[i][0]] =
				salesrep_data[i][12];
			salesrep_suspect_lost[salesrep_data[i][0]] = salesrep_data[i][13];
			salesrep_suspect_oot[salesrep_data[i][0]] = salesrep_data[i][14];
			salesrep_suspect_customer_lost[salesrep_data[i][0]] =
				salesrep_data[i][15];
			salesrep_prospect_opportunity[salesrep_data[i][0]] = salesrep_data[i][16];
			salesrep_prospect_qualified[salesrep_data[i][0]] = salesrep_data[i][17];
			salesrep_prospecy_box_sent[salesrep_data[i][0]] = salesrep_data[i][18];
			salesrep_prospecy_quote_sent[salesrep_data[i][0]] = salesrep_data[i][19];
			salesrep_customer_free_trial_pending[salesrep_data[i][0]] =
				salesrep_data[i][20];
			salesrep_customer_free_trial[salesrep_data[i][0]] = salesrep_data[i][21];
			salesrep_customer_shipmate_pending[salesrep_data[i][0]] = salesrep_data[i][22];
			salesrep_customer_signed[salesrep_data[i][0]] = salesrep_data[i][23];
			salesrep_total_leads[salesrep_data[i][0]] = salesrep_data[i][24];
		}
		var salesrep_count = {}; // creating object for getting categories with
		// count
		salesrep_month_year.forEach(function (i) {
			salesrep_count[i] = (salesrep_count[i] || 0) + 1;
		});

		var salesrep_series_data20 = [];
		var salesrep_series_data21 = [];
		var salesrep_series_data22 = [];
		var salesrep_series_data23 = [];
		var salesrep_series_data24 = [];
		var salesrep_series_data25 = [];
		var salesrep_series_data26 = [];
		var salesrep_series_data27 = [];
		var salesrep_series_data28 = [];
		var salesrep_series_data29 = [];
		var salesrep_series_data30 = [];
		var salesrep_series_data31 = [];
		var salesrep_series_data32 = [];
		var salesrep_series_data33 = [];
		var salesrep_series_data34 = [];
		var salesrep_series_data20a = [];
		var salesrep_series_data21a = [];
		var salesrep_series_data22a = [];
		var salesrep_series_data23a = [];
		var salesrep_series_data24a = [];
		var salesrep_series_data25a = [];
		var salesrep_series_data26a = [];
		var salesrep_series_data27a = [];
		var salesrep_series_data28a = [];
		var salesrep_series_data29a = [];
		var salesrep_series_data30a = [];

		var salesrep_categores1 = []; // creating empty array for highcharts
		// categories
		Object.keys(salesrep_total_leads).map(function (item, key) {
			salesrep_series_data20.push(parseInt(salesrep_customer_signed[item]));
			salesrep_series_data21.push(parseInt(salesrep_suspect_hot_lead[item]));
			salesrep_series_data22.push(parseInt(salesrep_suspect_reassign[item]));
			salesrep_series_data23.push(parseInt(salesrep_suspect_lost[item]));
			salesrep_series_data24.push(
				parseInt(salesrep_suspect_customer_lost[item])
			);
			salesrep_series_data25.push(
				parseInt(salesrep_suspect_off_peak_pipeline[item])
			);
			salesrep_series_data26.push(parseInt(salesrep_prospecy_quote_sent[item]));
			salesrep_series_data27.push(parseInt(salesrep_prospect_no_answer[item]));
			salesrep_series_data28.push(parseInt(salesrep_prospect_in_contact[item]));
			salesrep_series_data29.push(parseInt(salesrep_total_leads[item]));
			salesrep_series_data31.push(
				parseInt(salesrep_prospect_opportunity[item])
			);
			salesrep_series_data32.push(parseInt(salesrep_suspect_oot[item]));
			salesrep_series_data33.push(parseInt(salesrep_suspect_follow_up[item]));
			salesrep_series_data34.push(parseInt(salesrep_suspect_new[item]));
			salesrep_series_data20a.push(parseInt(salesrep_suspect_qualified[item]));
			salesrep_series_data28a.push(
				parseInt(salesrep_suspect_unqualified[item])
			);
			salesrep_series_data21a.push(
				parseInt(salesrep_suspect_lpo_followup[item])
			);
			salesrep_series_data22a.push(parseInt(salesrep_suspect_validated[item]));
			salesrep_series_data23a.push(
				parseInt(salesrep_customer_free_trial[item])
			);
			salesrep_series_data24a.push(parseInt(salesrep_suspect_no_answer[item]));
			salesrep_series_data25a.push(parseInt(salesrep_suspect_in_contact[item]));
			salesrep_series_data26a.push(parseInt(salesrep_prospect_qualified[item]));
			salesrep_series_data27a.push(
				parseInt(salesrep_customer_free_trial_pending[item])
			);
			salesrep_series_data29a.push(parseInt(salesrep_prospecy_box_sent[item]));
			salesrep_series_data30a.push(parseInt(salesrep_customer_shipmate_pending[item]));
			salesrep_categores1.push(item);
		});

		plotSalesRepChartPreview(
			salesrep_series_data20,
			salesrep_series_data21,
			salesrep_series_data22,
			salesrep_series_data23,
			salesrep_series_data24,
			salesrep_series_data25,
			salesrep_series_data26,
			salesrep_series_data27,
			salesrep_series_data28,
			salesrep_series_data29,
			salesrep_series_data31,
			salesrep_series_data32,
			salesrep_series_data33,
			salesrep_series_data34,
			salesrep_categores1,
			salesrep_series_data20a,
			salesrep_series_data21a,
			salesrep_series_data22a,
			salesrep_series_data23a,
			salesrep_series_data24a,
			salesrep_series_data25a,
			salesrep_series_data26a,
			salesrep_series_data27a,
			salesrep_series_data28a,
			salesrep_series_data29a, salesrep_series_data30a
		);

		//? DATA CAPTURE OVERVIEW

		//Sales Dashboard - Leads by Status - Data Capture Reporting
		var leadsListByDataCaptureStatusSearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_5_2",
		});

		leadsListByDataCaptureStatusSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(cancelled_start_date) &&
			!isNullorEmpty(cancelled_last_date)
		) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			leadsListByDataCaptureStatusSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				leadsListByDataCaptureStatusSearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var modifiedDateFilters = [
				[
					["activity.date", "within", [modified_date_from, modified_date_to]],
					"AND",
					[
						"activity.custevent_organiser",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
				"AND",
				[
					[
						"usernotes.notedate",
						"within",
						[modified_date_from, modified_date_to],
					],
					"AND",
					[
						"usernotes.author",
						"anyof",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
			];
			console.log(
				"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
			);

			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(modifiedDateFilters);

			console.log(
				"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListByDataCaptureStatusSearch.filterExpression =
				defaultSearchFilters;
		}

		var count1 = 0;
		var oldDataCaptureAssigned = null;
		var oldDataCaptureAssignedId = null;

		var customer_signed = 0;
		var suspect_hot_lead = 0;
		var suspect_reassign = 0;
		var suspect_lost = 0;
		var suspect_oot = 0;
		var suspect_customer_lost = 0;
		var suspect_off_peak_pipeline = 0;
		var prospect_opportunity = 0;
		var prospect_qualified = 0;
		var prospecy_quote_sent = 0;
		var prospecy_box_sent = 0;
		var prospect_no_answer = 0;
		var prospect_in_contact = 0;
		var suspect_follow_up = 0;
		var suspect_new = 0;

		var suspect_lpo_followup = 0;
		var suspect_qualified = 0;
		var suspect_unqualified = 0;
		var suspect_in_qualification = 0;
		var suspect_pre_qualification = 0;

		var suspect_validated = 0;
		var customer_free_trial = 0;
		var customer_free_trial_pending = 0;
		var customer_shipmate_pending = 0;

		var suspect_no_answer = 0;
		var suspect_in_contact = 0;

		leadsListByDataCaptureStatusSearch
			.run()
			.each(function (leadsListByDataCaptureStatusSearchResultSet) {
				var prospectCount = parseInt(
					leadsListByDataCaptureStatusSearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);

				var custStatus = parseInt(
					leadsListByDataCaptureStatusSearchResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					})
				);
				var custStatusText =
					leadsListByDataCaptureStatusSearchResultSet.getText({
						name: "entitystatus",
						summary: "GROUP",
					});
				var dataCaptureAssigned =
					leadsListByDataCaptureStatusSearchResultSet.getText({
						name: "custentity_lead_entered_by",
						summary: "GROUP",
					});

				var dataCaptureAssignedId =
					leadsListByDataCaptureStatusSearchResultSet.getValue({
						name: "custentity_lead_entered_by",
						summary: "GROUP",
					});

				if (isNullorEmpty(dataCaptureAssigned)) {
					dataCaptureAssigned = "Franchisees";
				}

				if (count1 == 0) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = parseInt(prospectCount);
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = parseInt(prospectCount);
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = parseInt(prospectCount);
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = parseInt(prospectCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = parseInt(prospectCount);
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = parseInt(prospectCount);
					} else if (custStatus == 72) {
						//PROSPECT - BOX SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = parseInt(prospectCount);
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL Pending
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_in_qualification +
						suspect_pre_qualification + customer_shipmate_pending
				} else if (
					oldDataCaptureAssigned != null &&
					oldDataCaptureAssigned == dataCaptureAssigned
				) {
					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed += prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead += prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost += prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot += parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost += prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign += prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - BOX SENT
						prospecy_box_sent += parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline += prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up += parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new += parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified += parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified += parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup += parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated += parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial += parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending += parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer += parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified += parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification += parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification += parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending += parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_in_qualification +
						suspect_pre_qualification + customer_shipmate_pending
				} else if (
					oldDataCaptureAssigned != null &&
					oldDataCaptureAssigned != dataCaptureAssigned
				) {
					datacapture_debt_set2.push({
						lpoparentnameid: oldDataCaptureAssignedId,
						lpoparentname: oldDataCaptureAssigned,
						suspect_hot_lead: suspect_hot_lead,
						prospecy_quote_sent: prospecy_quote_sent,
						suspect_reassign: suspect_reassign,
						prospect_no_answer: prospect_no_answer,
						prospect_in_contact: prospect_in_contact,
						suspect_off_peak_pipeline: suspect_off_peak_pipeline,
						suspect_lost: suspect_lost,
						suspect_customer_lost: suspect_customer_lost,
						prospect_opportunity: prospect_opportunity,
						customer_signed: customer_signed,
						total_leads: total_leads,
						suspect_oot: suspect_oot,
						suspect_follow_up: suspect_follow_up,
						suspect_new: suspect_new,
						suspect_qualified: suspect_qualified,
						suspect_unqualified: suspect_unqualified,
						suspect_lpo_followup: suspect_lpo_followup,
						suspect_validated: suspect_validated,
						customer_free_trial: customer_free_trial,
						suspect_no_answer: suspect_no_answer,
						suspect_in_contact: suspect_in_contact,
						prospect_qualified: prospect_qualified,
						customer_free_trial_pending: customer_free_trial_pending,
						prospect_box_sent: prospecy_box_sent,
						suspect_pre_qualification: suspect_pre_qualification,
						suspect_in_qualification: suspect_in_qualification,
						customer_shipmate_pending: customer_shipmate_pending
					});

					customer_signed = 0;
					suspect_hot_lead = 0;
					suspect_reassign = 0;
					suspect_lost = 0;
					suspect_customer_lost = 0;
					suspect_off_peak_pipeline = 0;
					prospect_opportunity = 0;
					prospecy_quote_sent = 0;
					prospecy_box_sent = 0;
					prospect_no_answer = 0;
					prospect_in_contact = 0;
					suspect_oot = 0;
					suspect_follow_up = 0;
					suspect_new = 0;
					suspect_qualified = 0;
					suspect_unqualified = 0;
					suspect_lpo_followup = 0;
					total_leads = 0;
					prospect_qualified = 0;

					suspect_validated = 0;
					customer_free_trial = 0;
					customer_free_trial_pending = 0;
					suspect_no_answer = 0;
					suspect_in_contact = 0;
					suspect_in_qualification = 0;
					suspect_pre_qualification = 0;
					customer_shipmate_pending = 0;

					if (custStatus == 13 || custStatus == 66) {
						//CUSTOMER _ SIGNED
						customer_signed = prospectCount;
					} else if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead = prospectCount;
					} else if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost = prospectCount;
					} else if (custStatus == 64) {
						//SUSPECT - OUT OF TERRITORY
						suspect_oot = parseInt(prospectCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER - LOST
						suspect_customer_lost = prospectCount;
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign = prospectCount;
					} else if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent = prospectCount;
					} else if (custStatus == 72) {
						//PROSPECT - BOX SENT
						prospecy_box_sent = parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer = prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact = prospectCount;
					} else if (custStatus == 62) {
						//SUSPECT - OFF PEAK PIPELINE
						suspect_off_peak_pipeline = prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity = parseInt(prospectCount);
					} else if (custStatus == 18) {
						//SUSPECT - FOLLOW UP
						suspect_follow_up = parseInt(prospectCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new = parseInt(prospectCount);
					} else if (custStatus == 42) {
						//SUSPECT - QUALIFIED
						suspect_qualified = parseInt(prospectCount);
					} else if (custStatus == 38) {
						//SUSPECT - UNQUALIFIED
						suspect_unqualified = parseInt(prospectCount);
					} else if (custStatus == 67) {
						//SUSPECT - LPO FOLLOW UP
						suspect_lpo_followup = parseInt(prospectCount);
					} else if (custStatus == 68) {
						//SUSPECT - VALIDATED
						suspect_validated = parseInt(prospectCount);
					} else if (custStatus == 32) {
						//CUSTOMER - FREE TRIAL
						customer_free_trial = parseInt(prospectCount);
					} else if (custStatus == 71) {
						//CUSTOMER - FREE TRIAL PENDING
						customer_free_trial_pending = parseInt(prospectCount);
					} else if (custStatus == 20) {
						//SUSPECT - NO ANSWER
						suspect_no_answer = parseInt(prospectCount);
					} else if (custStatus == 69) {
						//SUSPECT - IN CONTACT
						suspect_in_contact = parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified = parseInt(prospectCount);
					} else if (custStatus == 30) {
						//PROSPECT - IN QUALIFICATION
						suspect_in_qualification = parseInt(prospectCount);
					} else if (custStatus == 34) {
						//PROSPECT - PRE QUALIFICATION
						suspect_pre_qualification = parseInt(prospectCount);
					} else if (custStatus == 73) {
						//CUSTOMER - SHIPMATE PENDING
						customer_shipmate_pending = parseInt(prospectCount);
					}

					total_leads =
						customer_signed +
						suspect_hot_lead +
						suspect_lost +
						suspect_customer_lost +
						suspect_reassign +
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						suspect_off_peak_pipeline +
						prospect_opportunity +
						suspect_oot +
						suspect_follow_up +
						suspect_new +
						suspect_qualified +
						suspect_lpo_followup +
						suspect_validated +
						customer_free_trial +
						suspect_no_answer +
						suspect_in_contact +
						prospect_qualified +
						customer_free_trial_pending +
						suspect_unqualified +
						prospecy_box_sent +
						suspect_pre_qualification +
						suspect_in_qualification + customer_shipmate_pending
				}

				count1++;
				oldDataCaptureAssigned = dataCaptureAssigned;
				oldDataCaptureAssignedId = dataCaptureAssignedId;
				return true;
			});

		if (count1 > 0) {
			datacapture_debt_set2.push({
				lpoparentnameid: oldDataCaptureAssignedId,
				lpoparentname: oldDataCaptureAssigned,
				suspect_hot_lead: suspect_hot_lead,
				prospecy_quote_sent: prospecy_quote_sent,
				suspect_reassign: suspect_reassign,
				prospect_no_answer: prospect_no_answer,
				prospect_in_contact: prospect_in_contact,
				suspect_off_peak_pipeline: suspect_off_peak_pipeline,
				suspect_lost: suspect_lost,
				suspect_customer_lost: suspect_customer_lost,
				prospect_opportunity: prospect_opportunity,
				customer_signed: customer_signed,
				total_leads: total_leads,
				suspect_oot: suspect_oot,
				suspect_follow_up: suspect_follow_up,
				suspect_new: suspect_new,
				suspect_qualified: suspect_qualified,
				suspect_unqualified: suspect_unqualified,
				suspect_lpo_followup: suspect_lpo_followup,
				suspect_validated: suspect_validated,
				customer_free_trial: customer_free_trial,
				suspect_no_answer: suspect_no_answer,
				suspect_in_contact: suspect_in_contact,
				prospect_qualified: prospect_qualified,
				customer_free_trial_pending: customer_free_trial_pending,
				prospect_box_sent: prospecy_box_sent,
				suspect_pre_qualification: suspect_pre_qualification,
				suspect_in_qualification: suspect_in_qualification,
				customer_shipmate_pending: customer_shipmate_pending
			});
		}

		console.log(
			"datacapture_debt_set2: " + JSON.stringify(datacapture_debt_set2)
		);

		datacapture_previewDataSet = [];
		datacapture_csvPreviewSet = [];

		var datacapture_overDataSet = [];

		if (!isNullorEmpty(datacapture_debt_set2)) {
			datacapture_debt_set2.forEach(function (preview_row, index) {
				var hotLeadPercentage = parseInt(
					(parseInt(preview_row.suspect_hot_lead) /
						parseInt(preview_row.total_leads)) *
					100
				);
				var hotLeadCol =
					preview_row.suspect_hot_lead + " (" + hotLeadPercentage + "%)";

				var quoteSentPercentage = parseInt(
					(preview_row.prospecy_quote_sent / preview_row.total_leads) * 100
				);
				var quoteSentCol =
					preview_row.prospecy_quote_sent + " (" + quoteSentPercentage + "%)";

				var boxSentPercentage = parseInt(
					(preview_row.prospect_box_sent / preview_row.total_leads) * 100
				);
				var boxSentCol =
					preview_row.prospect_box_sent + " (" + boxSentPercentage + "%)";

				var reassignPercentage = parseInt(
					(preview_row.suspect_reassign / preview_row.total_leads) * 100
				);
				var reassignCol =
					preview_row.suspect_reassign + " (" + reassignPercentage + "%)";

				var noAnswerPercentage = parseInt(
					(preview_row.prospect_no_answer / preview_row.total_leads) * 100
				);
				var noAnswerCol =
					preview_row.prospect_no_answer + " (" + noAnswerPercentage + "%)";

				var inContactPercentage = parseInt(
					(preview_row.prospect_in_contact / preview_row.total_leads) * 100
				);
				var inContactCol =
					preview_row.prospect_in_contact + " (" + inContactPercentage + "%)";

				var offPeakPercentage = parseInt(
					(preview_row.suspect_off_peak_pipeline / preview_row.total_leads) *
					100
				);
				var offPeakCol =
					preview_row.suspect_off_peak_pipeline +
					" (" +
					offPeakPercentage +
					"%)";

				var lostPercentage = parseInt(
					(preview_row.suspect_lost / preview_row.total_leads) * 100
				);
				var lostCol = preview_row.suspect_lost + " (" + lostPercentage + "%)";

				var ootPercentage = parseInt(
					(preview_row.suspect_oot / preview_row.total_leads) * 100
				);
				var ootCol = preview_row.suspect_oot + " (" + ootPercentage + "%)";

				var custLostPercentage = parseInt(
					(preview_row.suspect_customer_lost / preview_row.total_leads) * 100
				);
				var custLostCol =
					preview_row.suspect_customer_lost + " (" + custLostPercentage + "%)";

				var oppPercentage = parseInt(
					(preview_row.prospect_opportunity / preview_row.total_leads) * 100
				);
				var oppCol =
					preview_row.prospect_opportunity + " (" + oppPercentage + "%)";

				var signedPercentage = parseInt(
					(preview_row.customer_signed / preview_row.total_leads) * 100
				);
				var signedCol =
					preview_row.customer_signed + " (" + signedPercentage + "%)";

				var suspectFollowUpPErcentage = parseInt(
					(preview_row.suspect_follow_up / preview_row.total_leads) * 100
				);
				var followUpCol =
					preview_row.suspect_follow_up +
					" (" +
					suspectFollowUpPErcentage +
					"%)";

				var suspectNewPercentage = parseInt(
					(preview_row.suspect_new / preview_row.total_leads) * 100
				);
				var suspectNewCol =
					preview_row.suspect_new + " (" + suspectNewPercentage + "%)";

				var suspectQualifiedPercentage = parseInt(
					(preview_row.suspect_qualified / preview_row.total_leads) * 100
				);
				var suspectQualifiedCol =
					preview_row.suspect_qualified +
					" (" +
					suspectQualifiedPercentage +
					"%)";

				var suspectUnqualifiedPercentage = parseInt(
					(preview_row.suspect_unqualified / preview_row.total_leads) * 100
				);
				var suspectUnqualifiedCol =
					preview_row.suspect_unqualified +
					" (" +
					suspectUnqualifiedPercentage +
					"%)";

				var suspectLPOFollowupPercentage = parseInt(
					(preview_row.suspect_lpo_followup / preview_row.total_leads) * 100
				);
				var suspectLPOFollowupwCol =
					preview_row.suspect_lpo_followup +
					" (" +
					suspectLPOFollowupPercentage +
					"%)";

				var suspectValidatedPercentage = parseInt(
					(preview_row.suspect_validated / preview_row.total_leads) * 100
				);
				var suspectValidatedCol =
					preview_row.suspect_validated +
					" (" +
					suspectValidatedPercentage +
					"%)";

				var customerFreeTrialPercentage = parseInt(
					(preview_row.customer_free_trial / preview_row.total_leads) * 100
				);
				var customerFreeTrialCol =
					preview_row.customer_free_trial +
					" (" +
					customerFreeTrialPercentage +
					"%)";

				var customerFreeTrialPendingPercentage = parseInt(
					(preview_row.customer_free_trial_pending / preview_row.total_leads) *
					100
				);
				var customerFreeTrialPendingCol =
					preview_row.customer_free_trial_pending +
					" (" +
					customerFreeTrialPendingPercentage +
					"%)";

				var suspectNoAnswerPercentage = parseInt(
					(preview_row.suspect_no_answer / preview_row.total_leads) * 100
				);
				var suspectNoAnswerCol =
					preview_row.suspect_no_answer +
					" (" +
					suspectNoAnswerPercentage +
					"%)";

				var suspectInContactPercentage = parseInt(
					(preview_row.suspect_in_contact / preview_row.total_leads) * 100
				);
				var suspectInContactCol =
					preview_row.suspect_in_contact +
					" (" +
					suspectInContactPercentage +
					"%)";

				var prospectQualifiedPercentage = parseInt(
					(preview_row.prospect_qualified / preview_row.total_leads) * 100
				);
				var prospectQualifiedCol =
					preview_row.prospect_qualified +
					" (" +
					prospectQualifiedPercentage +
					"%)";

				var suspectPreQualificationPercentage = parseInt(
					(preview_row.suspect_pre_qualification / preview_row.total_leads) *
					100
				);
				var suspectPreQualificationCol =
					preview_row.suspect_pre_qualification +
					" (" +
					suspectPreQualificationPercentage +
					"%)";

				var suspectInQualificationPercentage = parseInt(
					(preview_row.suspect_in_qualification / preview_row.total_leads) * 100
				);
				var suspectInQualificationCol =
					preview_row.suspect_in_qualification +
					" (" +
					suspectInQualificationPercentage +
					"%)";

				var customerShipMatePendingPercentage = parseInt(
					(preview_row.customer_shipmate_pending / preview_row.total_leads) * 100
				);
				var customerShipMatePendingCol =
					preview_row.customer_shipmate_pending +
					" (" +
					customerShipMatePendingPercentage +
					"%)";

				datacapture_overDataSet.push([
					preview_row.lpoparentname, //0
					preview_row.suspect_new, //1
					preview_row.suspect_hot_lead, //2
					preview_row.suspect_qualified, //3
					preview_row.suspect_unqualified, //4
					preview_row.suspect_validated, //5
					preview_row.suspect_pre_qualification, //6
					preview_row.suspect_in_qualification, //7
					preview_row.suspect_reassign, //8
					preview_row.suspect_follow_up, //9
					preview_row.suspect_no_answer, //10
					preview_row.suspect_in_contact, //11
					preview_row.suspect_lpo_followup, //12
					preview_row.prospect_in_contact, //13
					preview_row.suspect_off_peak_pipeline, //14
					preview_row.suspect_lost, //15
					preview_row.suspect_oot, //16
					preview_row.suspect_customer_lost, //17
					preview_row.prospect_opportunity, //18
					preview_row.prospect_qualified, //19
					preview_row.prospect_box_sent, //20
					preview_row.prospecy_quote_sent, //21
					preview_row.customer_free_trial_pending, //22
					preview_row.customer_free_trial, //23
					preview_row.customer_shipmate_pending, //24
					preview_row.customer_signed, //25
					preview_row.total_leads, //26
					preview_row.lpoparentnameid, //27
				]);

				datacapture_previewDataSet.push([
					preview_row.lpoparentname,
					suspectNewCol,
					hotLeadCol,
					suspectValidatedCol,
					suspectUnqualifiedCol,
					suspectQualifiedCol,
					suspectPreQualificationCol,
					suspectInQualificationCol,
					reassignCol,
					followUpCol,
					suspectLPOFollowupwCol,
					suspectNoAnswerCol,
					suspectInContactCol,
					inContactCol,
					offPeakCol,
					lostCol,
					ootCol,
					custLostCol,
					oppCol,
					prospectQualifiedCol,
					boxSentCol,
					quoteSentCol,
					customerFreeTrialPendingCol,
					customerFreeTrialCol,
					customerShipMatePendingCol,
					signedCol,
					preview_row.total_leads,
					preview_row.lpoparentnameid,
				]);
			});
		}

		console.log("datacapture_previewDataSet");
		console.log(datacapture_previewDataSet);

		var dataTableLPOPreview = $("#mpexusage-datacapture_overview").DataTable({
			destroy: true,
			data: datacapture_previewDataSet,
			pageLength: 1000,
			order: [[22, "des"]],
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
					title: "Lead Gen/Lead Quali/BDM/Account Manager", //0
				},
				{
					title: "Suspect - New", //1
				},
				{
					title: "Suspect - Hot Lead", //2
				},
				{
					title: "Suspect - Validated", //3
				},
				{
					title: "Suspect - Unqualified", //4
				},
				{
					title: "Suspect - Qualified", //5
				},
				{
					title: "Suspect - Pre Qualification", //6
				},
				{
					title: "Suspect - In Qualification", //7
				},
				{
					title: "Suspect - Reassign", //8
				},
				{
					title: "Suspect - Follow Up", //9
				},
				{
					title: "Suspect - LPO Follow Up", //10
				},
				{
					title: "Suspect - No Answer", //11
				},
				{
					title: "Suspect - In Contact", //12
				},
				{
					title: "Prospect - In Contact", //13
				},
				{
					title: "Suspect - Parking Lot", //14
				},
				{
					title: "Suspect - Lost", //15
				},
				{
					title: "Suspect - Out of Territory", //16
				},
				{
					title: "Suspect - Customer - Lost", //17
				},
				{
					title: "Prospect - Opportunity", //18
				},
				{
					title: "Prospect - Qualified", //19
				},
				{
					title: "Prospect - Box Sent", //20
				},
				{
					title: "Prospect - Quote Sent", //21
				},
				{
					title: "Customer - Free Trial Pending", //22
				},
				{
					title: "Customer - Free Trial", //23
				},
				{
					title: "Customer - ShipMate Pending", //24
				},
				{
					title: "Customer - Signed", //25
				},
				{
					title: "Total Lead Count", //26
				},
				{
					title: "Sales Rep ID", //27
				},
			],
			columnDefs: [
				{
					targets: [0, 3, 5, 20, 23, 24, 25, 26],
					className: "bolded",
				},
				{
					targets: [27],
					visible: false,
				},
				{
					targets: [26],
					className: "notexport",
				},
			],
			footerCallback: function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return parseInt(i);
				};

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});
				// Total Suspect New Lead Count
				total_suspect_new = api
					.column(1)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Hot Lead Count
				total_suspect_hot_lead = api
					.column(2)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Qualified Count
				total_suspect_qualified = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Unqualified Count
				total_suspect_unqualified = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Validated
				total_suspect_validated = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Reassign
				total_suspect_reassign = api
					.column(6)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Follow Up
				total_suspect_followup = api
					.column(7)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect LPO Follow Up
				total_suspect_lpo_followup = api
					.column(8)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect No Answer
				total_suspect_no_answer = api
					.column(9)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect In Contact
				total_suspect_in_contact = api
					.column(10)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect In Contact
				total_prospect_in_contact = api
					.column(11)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Off Peak Pipline
				total_suspect_off_peak_pipeline = api
					.column(12)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Lost
				total_suspect_lost = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Out of Territory
				total_suspect_oot = api
					.column(14)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Suspect Customer Lost
				total_suspect_customer_lost = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Opportunity
				total_prospect_opportunity = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prospect_qualified = api
					.column(17)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Quoite Sent
				total_prospect_box_sent = api
					.column(18)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Prospect Quoite Sent
				total_prospect_quote_sent = api
					.column(19)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Free Trial Pending
				total_customer_free_trial_pending = api
					.column(20)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Free Trial
				total_customer_free_trial = api
					.column(21)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Customer Signed
				total_customer_signed = api
					.column(22)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_v1 = api
					.column(23)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_shipmate_pending = api
					.column(24)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_lead_v2 = api
					.column(25)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Lead Count
				total_lead = api
					.column(26)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(1).footer()).html(
					total_suspect_new +
					" (" +
					((total_suspect_new / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(2).footer()).html(
					total_suspect_hot_lead +
					" (" +
					((total_suspect_hot_lead / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(3).footer()).html(
					total_suspect_qualified +
					" (" +
					((total_suspect_qualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(4).footer()).html(
					total_suspect_unqualified +
					" (" +
					((total_suspect_unqualified / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(5).footer()).html(
					total_suspect_validated +
					" (" +
					((total_suspect_validated / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(6).footer()).html(
					total_suspect_reassign +
					" (" +
					((total_suspect_reassign / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(7).footer()).html(
					total_suspect_followup +
					" (" +
					((total_suspect_followup / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(8).footer()).html(
					total_suspect_lpo_followup +
					" (" +
					((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(9).footer()).html(
					total_suspect_no_answer +
					" (" +
					((total_suspect_no_answer / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(10).footer()).html(
					total_suspect_in_contact +
					" (" +
					((total_suspect_in_contact / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(11).footer()).html(
					total_prospect_in_contact +
					" (" +
					((total_prospect_in_contact / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(12).footer()).html(
					total_suspect_off_peak_pipeline +
					" (" +
					((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(13).footer()).html(
					total_suspect_lost +
					" (" +
					((total_suspect_lost / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(14).footer()).html(
					total_suspect_oot +
					" (" +
					((total_suspect_oot / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(15).footer()).html(
					total_suspect_customer_lost +
					" (" +
					((total_suspect_customer_lost / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(16).footer()).html(
					total_prospect_opportunity +
					" (" +
					((total_prospect_opportunity / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(17).footer()).html(
					total_prospect_qualified +
					" (" +
					((total_prospect_qualified / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(18).footer()).html(
					total_prospect_box_sent +
					" (" +
					((total_prospect_box_sent / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(19).footer()).html(
					total_prospect_quote_sent +
					" (" +
					((total_prospect_quote_sent / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(20).footer()).html(
					total_customer_free_trial_pending +
					" (" +
					((total_customer_free_trial_pending / total_lead) * 100).toFixed(
						0
					) +
					"%)"
				);

				$(api.column(21).footer()).html(
					total_customer_free_trial +
					" (" +
					((total_customer_free_trial / total_lead) * 100).toFixed(0) +
					"%)"
				);

				$(api.column(22).footer()).html(
					total_customer_signed +
					" (" +
					((total_customer_signed / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(23).footer()).html(
					total_lead_v1 +
					" (" +
					((total_lead_v1 / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(24).footer()).html(
					total_shipmate_pending +
					" (" +
					((total_shipmate_pending / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(25).footer()).html(
					total_lead_v2 +
					" (" +
					((total_lead_v2 / total_lead) * 100).toFixed(0) +
					"%)"
				);
				$(api.column(26).footer()).html(total_lead);
			},
		});

		saveCsv(datacapture_previewDataSet);

		var datacapture_data = datacapture_overDataSet;

		var datacapture_month_year = []; // creating array for storing browser
		var datacapture_customer_signed = [];
		var datacapture_suspect_hot_lead = [];
		var datacapture_suspect_reassign = [];
		var datacapture_suspect_lost = [];
		var datacapture_suspect_oot = [];
		var datacapture_suspect_customer_lost = [];
		var datacapture_suspect_off_peak_pipeline = [];
		var datacapture_prospect_opportunity = [];
		var datacapture_prospect_qualified = [];
		var datacapture_prospecy_quote_sent = [];
		var datacapture_prospecy_box_sent = [];
		var datacapture_prospect_no_answer = [];
		var datacapture_prospect_in_contact = [];
		var datacapture_suspect_follow_up = [];
		var datacapture_suspect_new = [];
		var datacapture_suspect_qualified = [];
		var datacapture_suspect_unqualified = [];
		var datacapture_suspect_lpo_followup = [];
		var datacapture_suspect_validated = [];
		var datacapture_customer_free_trial_pending = [];
		var datacapture_customer_shipmate_pending = [];
		var datacapture_customer_free_trial = [];
		var datacapture_suspect_no_answer = [];
		var datacapture_suspect_in_contact = [];
		var datacapture_suspect_pre_qualifcaition = [];
		var datacapture_suspect_in_qualification = [];
		var datacapture_total_leads = [];

		for (var i = 0; i < datacapture_data.length; i++) {
			datacapture_month_year.push(datacapture_data[i][0]);
			datacapture_suspect_new[datacapture_data[i][0]] = datacapture_data[i][1];
			datacapture_suspect_hot_lead[datacapture_data[i][0]] =
				datacapture_data[i][2];
			datacapture_suspect_validated[datacapture_data[i][0]] =
				datacapture_data[i][5];
			datacapture_suspect_unqualified[datacapture_data[i][0]] =
				datacapture_data[i][4];
			datacapture_suspect_qualified[datacapture_data[i][0]] =
				datacapture_data[i][3];
			datacapture_suspect_pre_qualifcaition[datacapture_data[i][0]] =
				datacapture_data[i][6];
			datacapture_suspect_in_qualification[datacapture_data[i][0]] =
				datacapture_data[i][7];
			datacapture_suspect_reassign[datacapture_data[i][0]] =
				datacapture_data[i][8];
			datacapture_suspect_follow_up[datacapture_data[i][0]] =
				datacapture_data[i][9];
			datacapture_suspect_lpo_followup[datacapture_data[i][0]] =
				datacapture_data[i][10];
			datacapture_suspect_no_answer[datacapture_data[i][0]] =
				datacapture_data[i][11];
			datacapture_suspect_in_contact[datacapture_data[i][0]] =
				datacapture_data[i][12];
			datacapture_prospect_in_contact[datacapture_data[i][0]] =
				datacapture_data[i][13];
			datacapture_suspect_off_peak_pipeline[datacapture_data[i][0]] =
				datacapture_data[i][14];
			datacapture_suspect_lost[datacapture_data[i][0]] =
				datacapture_data[i][15];
			datacapture_suspect_oot[datacapture_data[i][0]] = datacapture_data[i][16];
			datacapture_suspect_customer_lost[datacapture_data[i][0]] =
				datacapture_data[i][17];
			datacapture_prospect_opportunity[datacapture_data[i][0]] =
				datacapture_data[i][18];
			datacapture_prospect_qualified[datacapture_data[i][0]] =
				datacapture_data[i][19];
			datacapture_prospecy_box_sent[datacapture_data[i][0]] =
				datacapture_data[i][20];
			datacapture_prospecy_quote_sent[datacapture_data[i][0]] =
				datacapture_data[i][21];
			datacapture_customer_free_trial_pending[datacapture_data[i][0]] =
				datacapture_data[i][22];
			datacapture_customer_free_trial[datacapture_data[i][0]] =
				datacapture_data[i][23];
			datacapture_customer_shipmate_pending[datacapture_data[i][0]] =
				datacapture_data[i][24];
			datacapture_customer_signed[datacapture_data[i][0]] =
				datacapture_data[i][25];
			datacapture_total_leads[datacapture_data[i][0]] = datacapture_data[i][26];
		}
		var datacapture_count = {}; // creating object for getting categories with
		// count
		datacapture_month_year.forEach(function (i) {
			datacapture_count[i] = (datacapture_count[i] || 0) + 1;
		});

		var datacapture_series_data20 = [];
		var datacapture_series_data21 = [];
		var datacapture_series_data22 = [];
		var datacapture_series_data23 = [];
		var datacapture_series_data24 = [];
		var datacapture_series_data25 = [];
		var datacapture_series_data26 = [];
		var datacapture_series_data27 = [];
		var datacapture_series_data28 = [];
		var datacapture_series_data29 = [];
		var datacapture_series_data30 = [];
		var datacapture_series_data31 = [];
		var datacapture_series_data32 = [];
		var datacapture_series_data33 = [];
		var datacapture_series_data34 = [];
		var datacapture_series_data20a = [];
		var datacapture_series_data21a = [];
		var datacapture_series_data22a = [];
		var datacapture_series_data23a = [];
		var datacapture_series_data24a = [];
		var datacapture_series_data25a = [];
		var datacapture_series_data26a = [];
		var datacapture_series_data27a = [];
		var datacapture_series_data28a = [];
		var datacapture_series_data29a = [];
		var datacapture_series_data30a = [];
		var datacapture_series_data31a = [];
		var datacapture_series_data32a = [];

		var datacapture_categores1 = []; // creating empty array for highcharts
		// categories
		Object.keys(datacapture_total_leads).map(function (item, key) {
			datacapture_series_data20.push(
				parseInt(datacapture_customer_signed[item])
			);
			datacapture_series_data21.push(
				parseInt(datacapture_suspect_hot_lead[item])
			);
			datacapture_series_data22.push(
				parseInt(datacapture_suspect_reassign[item])
			);
			datacapture_series_data23.push(parseInt(datacapture_suspect_lost[item]));
			datacapture_series_data24.push(
				parseInt(datacapture_suspect_customer_lost[item])
			);
			datacapture_series_data25.push(
				parseInt(datacapture_suspect_off_peak_pipeline[item])
			);
			datacapture_series_data26.push(
				parseInt(datacapture_prospecy_quote_sent[item])
			);
			datacapture_series_data27.push(
				parseInt(datacapture_prospect_no_answer[item])
			);
			datacapture_series_data28.push(
				parseInt(datacapture_prospect_in_contact[item])
			);
			datacapture_series_data29.push(parseInt(datacapture_total_leads[item]));
			datacapture_series_data31.push(
				parseInt(datacapture_prospect_opportunity[item])
			);
			datacapture_series_data32.push(parseInt(datacapture_suspect_oot[item]));
			datacapture_series_data33.push(
				parseInt(datacapture_suspect_follow_up[item])
			);
			datacapture_series_data34.push(parseInt(datacapture_suspect_new[item]));
			datacapture_series_data20a.push(
				parseInt(datacapture_suspect_qualified[item])
			);
			datacapture_series_data28a.push(
				parseInt(datacapture_suspect_unqualified[item])
			);
			datacapture_series_data21a.push(
				parseInt(datacapture_suspect_lpo_followup[item])
			);
			datacapture_series_data22a.push(
				parseInt(datacapture_suspect_validated[item])
			);
			datacapture_series_data23a.push(
				parseInt(datacapture_customer_free_trial[item])
			);
			datacapture_series_data24a.push(
				parseInt(datacapture_suspect_no_answer[item])
			);
			datacapture_series_data25a.push(
				parseInt(datacapture_suspect_in_contact[item])
			);
			datacapture_series_data26a.push(
				parseInt(datacapture_prospect_qualified[item])
			);
			datacapture_series_data27a.push(
				parseInt(datacapture_customer_free_trial_pending[item])
			);
			datacapture_series_data29a.push(
				parseInt(datacapture_prospecy_box_sent[item])
			);
			datacapture_series_data30a.push(
				parseInt(datacapture_suspect_pre_qualifcaition[item])
			);
			datacapture_series_data31a.push(
				parseInt(datacapture_suspect_in_qualification[item])
			);
			datacapture_series_data32a.push(
				parseInt(datacapture_customer_shipmate_pending[item])
			);
			datacapture_categores1.push(item);
		});

		console.log(
			"datacapture_categores1: " + JSON.stringify(datacapture_categores1)
		);

		plotDataCaptureChartPreview(
			datacapture_series_data20,
			datacapture_series_data21,
			datacapture_series_data22,
			datacapture_series_data23,
			datacapture_series_data24,
			datacapture_series_data25,
			datacapture_series_data26,
			datacapture_series_data27,
			datacapture_series_data28,
			datacapture_series_data29,
			datacapture_series_data31,
			datacapture_series_data32,
			datacapture_series_data33,
			datacapture_series_data34,
			datacapture_categores1,
			datacapture_series_data20a,
			datacapture_series_data21a,
			datacapture_series_data22a,
			datacapture_series_data23a,
			datacapture_series_data24a,
			datacapture_series_data25a,
			datacapture_series_data26a,
			datacapture_series_data27a,
			datacapture_series_data28a,
			datacapture_series_data29a,
			datacapture_series_data30a,
			datacapture_series_data31a, datacapture_series_data32a
		);

		//? Data Capture Grouped by Source & Campaign
		//Sales Dashboard - Leads by Source & Campaign - Data Capture Reporting
		console.log(
			"Sales Dashboard - Leads by Source & Campaign - Data Capture Reporting"
		);
		console.log("date_signed_up_from: " + date_signed_up_from);
		console.log("date_signed_up_to: " + date_signed_up_to);
		var leadsListByDataCaptureSourceCampaignSearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_5__2",
		});

		leadsListByDataCaptureSourceCampaignSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(cancelled_start_date) &&
			!isNullorEmpty(cancelled_last_date)
		) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			leadsListByDataCaptureSourceCampaignSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				leadsListByDataCaptureSourceCampaignSearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var modifiedDateFilters = [
				[
					["activity.date", "within", [modified_date_from, modified_date_to]],
					"AND",
					[
						"activity.custevent_organiser",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
				"AND",
				[
					[
						"usernotes.notedate",
						"within",
						[modified_date_from, modified_date_to],
					],
					"AND",
					[
						"usernotes.author",
						"anyof",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
			];
			console.log(
				"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
			);

			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(modifiedDateFilters);

			console.log(
				"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListByDataCaptureSourceCampaignSearch.filterExpression =
				defaultSearchFilters;
		}

		var count1 = 0;
		var total_leads = 0;
		var total_leads_per_source = 0;
		var total_leads_assigned = 0;
		var oldDataCaptureAssigned = null;
		var oldDataCaptureAssignedId = null;

		var oldDataCaptureSource = null;
		var oldDataCaptureSourceId = null;

		var oldDataCaptureCampaign = null;
		var oldDataCaptureCampaignId = null;

		var dataCaptureBySource = {};
		var datatCaptureBySourceId = {};

		var dataCaptureTeam = [];

		leadsListByDataCaptureSourceCampaignSearch
			.run()
			.each(function (leadsListByDataCaptureSourceCampaignSearchResultSet) {
				var prospectCount = parseInt(
					leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);

				var custLeadSource = parseInt(
					leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
						name: "leadsource",
						summary: "GROUP",
					})
				);
				var custLeadSourceText =
					leadsListByDataCaptureSourceCampaignSearchResultSet.getText({
						name: "leadsource",
						summary: "GROUP",
					});

				var custCampaign = parseInt(
					leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
						name: "custrecord_sales_campaign",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					})
				);
				var custCampaignText =
					leadsListByDataCaptureSourceCampaignSearchResultSet.getText({
						name: "custrecord_sales_campaign",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					});

				var dataCaptureAssigned =
					leadsListByDataCaptureSourceCampaignSearchResultSet.getText({
						name: "custentity_lead_entered_by",
						summary: "GROUP",
					});

				var dataCaptureAssignedId =
					leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
						name: "custentity_lead_entered_by",
						summary: "GROUP",
					});

				if (isNullorEmpty(dataCaptureAssigned)) {
					dataCaptureAssigned = "Franchisees";
				}

				console.log("dataCaptureAssigned: " + dataCaptureAssigned);
				console.log("custLeadSourceText: " + custLeadSourceText);
				console.log("custCampaignText: " + custCampaignText);
				console.log("prospectCount: " + prospectCount);

				console.log("oldDataCaptureAssigned: " + oldDataCaptureAssigned);
				console.log("custLeadSource: " + custLeadSource);
				console.log("oldDataCaptureSourceId: " + oldDataCaptureSourceId);

				if (count1 == 0) {
					total_leads += prospectCount;
					total_leads_assigned += prospectCount;
					total_leads_per_source += prospectCount;

					dataCaptureTeam.push({
						id: dataCaptureAssignedId,
						name: dataCaptureAssigned,
						count: total_leads_assigned,
						details: [],
					});

					dataCaptureTeam[dataCaptureTeam.length - 1].details.push({
						source: [
							{
								id: custLeadSource,
								name: custLeadSourceText,
								count: prospectCount,
								campaign: [
									{
										id: custCampaign,
										name: custCampaignText,
										count: prospectCount,
									},
								],
							},
						],
					});
				} else if (
					oldDataCaptureAssigned != null &&
					oldDataCaptureAssigned == dataCaptureAssigned
				) {
					total_leads_assigned += prospectCount;

					dataCaptureTeam[dataCaptureTeam.length - 1].count =
						total_leads_assigned;
					var sourceLength =
						dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source
							.length;

					if (custLeadSource == oldDataCaptureSourceId) {
						total_leads_per_source += prospectCount;
						console.log("total_leads: " + total_leads);
						dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source[
							sourceLength - 1
						].count = total_leads_per_source;
						dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source[
							sourceLength - 1
						].campaign.push({
							id: custCampaign,
							name: custCampaignText,
							count: prospectCount,
						});
					} else if (custLeadSource != oldDataCaptureSourceId) {
						total_leads_per_source = 0;
						total_leads_per_source += prospectCount;

						dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source.push({
							id: custLeadSource,
							name: custLeadSourceText,
							count: total_leads_per_source,
							campaign: [
								{
									id: custCampaign,
									name: custCampaignText,
									count: prospectCount,
								},
							],
						});
					}
				} else if (
					oldDataCaptureAssigned != null &&
					oldDataCaptureAssigned != dataCaptureAssigned
				) {
					total_leads = 0;
					total_leads_assigned = 0;
					total_leads_per_source = 0;

					total_leads += prospectCount;
					total_leads_assigned += prospectCount;
					total_leads_per_source += prospectCount;

					console.log("dataCaptureTeam: " + JSON.stringify(dataCaptureTeam));

					dataCaptureTeam.push({
						id: dataCaptureAssignedId,
						name: dataCaptureAssigned,
						count: total_leads_assigned,
						details: [],
					});

					dataCaptureTeam[dataCaptureTeam.length - 1].details.push({
						source: [
							{
								id: custLeadSource,
								name: custLeadSourceText,
								count: total_leads_per_source,
								campaign: [
									{
										id: custCampaign,
										name: custCampaignText,
										count: prospectCount,
									},
								],
							},
						],
					});
				}
				console.log("total_leads: " + total_leads);
				count1++;
				oldDataCaptureAssigned = dataCaptureAssigned;
				oldDataCaptureAssignedId = dataCaptureAssignedId;
				oldDataCaptureSourceId = custLeadSource;
				oldDataCaptureSource = custLeadSourceText;
				oldDataCaptureCampaignId = custCampaign;
				oldDataCaptureCampaign = custCampaignText;
				return true;
			});

		if (count1 > 0) {
		}

		console.log("dataCaptureTeam: " + JSON.stringify(dataCaptureTeam));

		var series_data_source = [];
		var series_data_campaign = [];
		// var series_lpo_data_source = [];
		// var series_lpo_data_campaign = [];
		var dataCaptureTeamMemberCategories = [];
		var dataCaptureTeamMemberLPOCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var dataSource = new Array(dataCaptureTeam.length).fill(0);
		// var dataLPOSource = new Array(dataCaptureTeam.length).fill(0);
		// var dataLPOCampaign = new Array(dataCaptureTeam.length).fill(0);
		var resetDataSource = new Array(dataCaptureTeam.length).fill(0);
		for (var x = 0; x < dataCaptureTeam.length; x++) {
			dataCaptureTeamMemberCategories[x] = dataCaptureTeam[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + dataCaptureTeam[x].name);
			console.log(
				"details: " + JSON.stringify(dataCaptureTeam[x].details[0].source)
			);
			for (y = 0; y < dataCaptureTeam[x].details[0].source.length; y++) {
				sourceLeadCount[x][y] = dataCaptureTeam[x].details[0].source[y].count;
				sourceName[x][y] = dataCaptureTeam[x].details[0].source[y].name;

				console.log(
					"Source Name: " + dataCaptureTeam[x].details[0].source[y].name
				);
				console.log(
					"Source Count: " + dataCaptureTeam[x].details[0].source[y].count
				);

				console.log(
					"before series_data_source: " + JSON.stringify(series_data_source)
				);
				var source_exists = false;
				for (var j = 0; j < series_data_source.length; j++) {
					if (series_data_source[j].name == sourceName[x][y]) {
						source_exists = true;
						series_data_source[j].data[x] =
							dataCaptureTeam[x].details[0].source[y].count;
					}
				}
				if (source_exists == false) {
					dataSource = new Array(dataCaptureTeam.length).fill(0);
					dataSource[x] = dataCaptureTeam[x].details[0].source[y].count;

					var colorCodeSource;
					if (
						source_list.includes(
							dataCaptureTeam[x].details[0].source[y].id.toString()
						) == true
					) {
						colorCodeSource =
							source_list_color[
							source_list.indexOf(
								dataCaptureTeam[x].details[0].source[y].id.toString()
							)
							];
					}

					series_data_source.push({
						name: sourceName[x][y],
						data: dataSource,
						color: colorCodeSource,
						style: {
							fontWeight: "bold",
						},
					});
				}

				console.log(
					"after series_data_source: " + JSON.stringify(series_data_source)
				);

				for (
					z = 0;
					z < dataCaptureTeam[x].details[0].source[y].campaign.length;
					z++
				) {
					console.log(
						"Campaign Name: " +
						dataCaptureTeam[x].details[0].source[y].campaign[z].name
					);
					console.log(
						"Campaign Count: " +
						dataCaptureTeam[x].details[0].source[y].campaign[z].count
					);

					console.log(
						"before series_data_campaign: " +
						JSON.stringify(series_data_campaign)
					);

					var campaign_exists = false;
					var lpo_campaign_exists = false;
					var lpo_source_exists = false;
					for (var j = 0; j < series_data_campaign.length; j++) {
						if (
							series_data_campaign[j].name ==
							dataCaptureTeam[x].details[0].source[y].campaign[z].name
						) {
							campaign_exists = true;
							series_data_campaign[j].data[x] +=
								dataCaptureTeam[x].details[0].source[y].campaign[z].count;
						}
					}
					if (campaign_exists == false) {
						dataSource = new Array(dataCaptureTeam.length).fill(0);
						dataSource[x] =
							dataCaptureTeam[x].details[0].source[y].campaign[z].count;

						var colorCodeCampaign;
						if (
							campaign_list.includes(
								dataCaptureTeam[x].details[0].source[y].campaign[
									z
								].id.toString()
							) == true
						) {
							colorCodeCampaign =
								campaign_list_color[
								campaign_list.indexOf(
									dataCaptureTeam[x].details[0].source[y].campaign[
										z
									].id.toString()
								)
								];
						}

						series_data_campaign.push({
							name: dataCaptureTeam[x].details[0].source[y].campaign[z].name,
							data: dataSource,
							color: colorCodeCampaign,
							style: {
								fontWeight: "bold",
							},
						});
					}


				}
				console.log(
					"after series_data_campaign: " + JSON.stringify(series_data_campaign)
				);

			}
		}

		console.log("dataCaptureTeamMemberCategories");
		console.log(dataCaptureTeamMemberCategories);

		console.log("series_data_source");
		console.log(series_data_source);

		console.log("series_data_campaign");
		console.log(series_data_campaign);

		console.log("dataCaptureTeamMemberLPOCategories");
		console.log(dataCaptureTeamMemberLPOCategories);

		var removedArrayPositions = [];
		var existingArrayPositions = [];


		plotChart(series_data_source, null, dataCaptureTeamMemberCategories);
		plotChartDataCaptureOverview(
			series_data_source,
			null,
			dataCaptureTeamMemberCategories
		);

		plotChartCampaign(
			series_data_campaign,
			null,
			dataCaptureTeamMemberCategories
		);
		plotChartDataCaptureOverviewCampaign(
			series_data_campaign,
			null,
			dataCaptureTeamMemberCategories
		);

		//?BY SALES REP ASSIGNED - LEAD ENTERED BY & CAMPAIGN
		//Sales Dashboard - Leads by Lead Entered - Sales Rep Reporting
		console.log(
			"Sales Dashboard - Leads by Lead Entered - Sales Rep Reporting"
		);
		console.log("date_signed_up_from: " + date_signed_up_from);
		console.log("date_signed_up_to: " + date_signed_up_to);
		var leadsListBySalesRepDataCaptureCampaignSearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_5_3",
		});

		leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(cancelled_start_date) &&
			!isNullorEmpty(cancelled_last_date)
		) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			leadsListBySalesRepDataCaptureCampaignSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				leadsListBySalesRepDataCaptureCampaignSearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var modifiedDateFilters = [
				[
					["activity.date", "within", [modified_date_from, modified_date_to]],
					"AND",
					[
						"activity.custevent_organiser",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
				"AND",
				[
					[
						"usernotes.notedate",
						"within",
						[modified_date_from, modified_date_to],
					],
					"AND",
					[
						"usernotes.author",
						"anyof",
						"anyof",
						"1623053",
						"668712",
						"1797389",
						"1809334",
						"690145",
						"1771076",
						"1813424",
						"696160",
						"668711",
						"1809382",
						"653718",
						"1777309",
						"1819701",
						"1820151",
						"1822089",
					],
				],
			];
			console.log(
				"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
			);

			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(modifiedDateFilters);

			console.log(
				"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListBySalesRepDataCaptureCampaignSearch.filterExpression =
				defaultSearchFilters;
		}

		var count1 = 0;
		var total_leads = 0;
		var total_leads_assigned = 0;
		var oldDataCaptureAssigned = null;
		var oldDataCaptureAssignedId = null;

		var oldDataCaptureLastAssigned = null;
		var oldDataCaptureLastAssignedId = null;

		var oldDataCaptureCampaign = null;
		var oldDataCaptureCampaignId = null;

		var dataCaptureBySource = {};
		var datatCaptureBySourceId = {};

		var salesRepAssignedTeam = [];

		leadsListBySalesRepDataCaptureCampaignSearch
			.run()
			.each(function (leadsListBySalesRepDataCaptureCampaignSearchResultSet) {
				var prospectCount = parseInt(
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);

				var custSalesRepAssigned = parseInt(
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					})
				);
				var custSalesRepAssignedText =
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					});

				var custCampaign = parseInt(
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
						name: "custrecord_sales_campaign",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					})
				);
				var custCampaignText =
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
						name: "custrecord_sales_campaign",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					});

				var dataCaptureAssigned =
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
						name: "custentity_lead_entered_by",
						summary: "GROUP",
					});

				var dataCaptureAssignedId =
					leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
						name: "custentity_lead_entered_by",
						summary: "GROUP",
					});

				if (isNullorEmpty(dataCaptureAssigned)) {
					dataCaptureAssigned = "Franchisees";
				}
				if (isNullorEmpty(dataCaptureAssignedId)) {
					dataCaptureAssignedId = -4;
				}

				if (count1 == 0) {
					total_leads += prospectCount;
					total_leads_assigned += prospectCount;

					salesRepAssignedTeam.push({
						id: custSalesRepAssigned,
						name: custSalesRepAssignedText,
						count: total_leads_assigned,
						details: [],
					});

					salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details.push({
						enteredBy: [
							{
								id: dataCaptureAssignedId,
								name: dataCaptureAssigned,
								count: prospectCount,
								campaign: [
									{
										id: custCampaign,
										name: custCampaignText,
										count: prospectCount,
									},
								],
							},
						],
					});
				} else if (
					oldDataCaptureLastAssignedId != null &&
					oldDataCaptureLastAssignedId == custSalesRepAssigned
				) {
					total_leads_assigned += prospectCount;

					salesRepAssignedTeam[salesRepAssignedTeam.length - 1].count =
						total_leads_assigned;
					var enteredByLength =
						salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details[0]
							.enteredBy.length;

					if (dataCaptureAssignedId == oldDataCaptureAssignedId) {
						total_leads += prospectCount;
						salesRepAssignedTeam[
							salesRepAssignedTeam.length - 1
						].details[0].enteredBy[enteredByLength - 1].count = total_leads;
						salesRepAssignedTeam[
							salesRepAssignedTeam.length - 1
						].details[0].enteredBy[enteredByLength - 1].campaign.push({
							id: custCampaign,
							name: custCampaignText,
							count: prospectCount,
						});
					} else if (dataCaptureAssignedId != oldDataCaptureAssignedId) {
						// total_leads += prospectCount;
						salesRepAssignedTeam[
							salesRepAssignedTeam.length - 1
						].details[0].enteredBy.push({
							id: dataCaptureAssignedId,
							name: dataCaptureAssigned,
							count: prospectCount,
							campaign: [
								{
									id: custCampaign,
									name: custCampaignText,
									count: prospectCount,
								},
							],
						});
					}
				} else if (
					oldDataCaptureLastAssignedId != null &&
					oldDataCaptureLastAssignedId != custSalesRepAssigned
				) {
					console.log(
						"salesRepAssignedTeam(" +
						oldDataCaptureAssigned +
						"): " +
						JSON.stringify(salesRepAssignedTeam)
					);

					total_leads = 0;
					total_leads_assigned = 0;

					total_leads += prospectCount;
					total_leads_assigned += prospectCount;

					salesRepAssignedTeam.push({
						id: custSalesRepAssigned,
						name: custSalesRepAssignedText,
						count: total_leads_assigned,
						details: [],
					});

					salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details.push({
						enteredBy: [
							{
								id: dataCaptureAssignedId,
								name: dataCaptureAssigned,
								count: prospectCount,
								campaign: [
									{
										id: custCampaign,
										name: custCampaignText,
										count: prospectCount,
									},
								],
							},
						],
					});
				}

				count1++;
				oldDataCaptureAssigned = dataCaptureAssigned;
				oldDataCaptureAssignedId = dataCaptureAssignedId;
				oldDataCaptureLastAssigned = custSalesRepAssignedText;
				oldDataCaptureLastAssignedId = custSalesRepAssigned;
				oldDataCaptureCampaignId = custCampaign;
				oldDataCaptureCampaign = custCampaignText;
				return true;
			});

		console.log(
			"salesRepAssignedTeam: " + JSON.stringify(salesRepAssignedTeam)
		);

		var series_data_entered = [];
		var series_data_campaign = [];
		var salesRepAssignedTeamMemberCategories = [];
		var enteredLeadCount = [];
		var enteredName = [];
		var dataEntered = new Array(dataCaptureTeam.length).fill(0);
		var dataLPOSource = new Array(dataCaptureTeam.length).fill(0);
		var dataLPOCampaign = new Array(dataCaptureTeam.length).fill(0);
		var resetDataSource = new Array(dataCaptureTeam.length).fill(0);
		for (var x = 0; x < salesRepAssignedTeam.length; x++) {
			salesRepAssignedTeamMemberCategories[x] = salesRepAssignedTeam[x].name;
			enteredLeadCount[x] = [];
			enteredName[x] = [];
			console.log("name: " + salesRepAssignedTeam[x].name);
			console.log(
				"details: " +
				JSON.stringify(salesRepAssignedTeam[x].details[0].enteredBy)
			);
			for (
				y = 0;
				y < salesRepAssignedTeam[x].details[0].enteredBy.length;
				y++
			) {
				enteredLeadCount[x][y] =
					salesRepAssignedTeam[x].details[0].enteredBy[y].count;
				enteredName[x][y] =
					salesRepAssignedTeam[x].details[0].enteredBy[y].name;

				console.log(
					"enteredBy Name: " +
					salesRepAssignedTeam[x].details[0].enteredBy[y].name
				);
				console.log(
					"enteredBy Count: " +
					salesRepAssignedTeam[x].details[0].enteredBy[y].count
				);

				console.log(
					"before series_data_entered: " + JSON.stringify(series_data_entered)
				);
				var entered_by_exists = false;
				for (var j = 0; j < series_data_entered.length; j++) {
					if (series_data_entered[j].name == enteredName[x][y]) {
						entered_by_exists = true;
						series_data_entered[j].data[x] =
							salesRepAssignedTeam[x].details[0].enteredBy[y].count;
					}
				}
				if (entered_by_exists == false) {
					dataEntered = new Array(salesRepAssignedTeam.length).fill(0);
					dataEntered[x] =
						salesRepAssignedTeam[x].details[0].enteredBy[y].count;

					var colorCode = "#ffffff";
					if (
						employee_list.indexOf(
							salesRepAssignedTeam[x].details[0].enteredBy[y].id
						) != -1
					) {
						colorCode =
							employee_list_color[
							employee_list.indexOf(
								salesRepAssignedTeam[x].details[0].enteredBy[y].id
							)
							];
					}

					if (enteredName[x][y] == "Portal") {
						colorCode = "#0F6292";
					} else if (enteredName[x][y] == "Franchisees") {
						colorCode = "#508b9b";
					}

					series_data_entered.push({
						name: enteredName[x][y],
						data: dataEntered,
						color: colorCode,
						style: {
							fontWeight: "bold",
						},
					});
				}

				console.log(
					"after series_data_entered: " + JSON.stringify(series_data_entered)
				);

				for (
					z = 0;
					z < salesRepAssignedTeam[x].details[0].enteredBy[y].campaign.length;
					z++
				) {
					console.log(
						"Campaign Name: " +
						salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].name
					);
					console.log(
						"Campaign Count: " +
						salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].count
					);

					console.log(
						"before series_data_campaign: " +
						JSON.stringify(series_data_campaign)
					);

					var campaign_exists = false;
					for (var j = 0; j < series_data_campaign.length; j++) {
						if (
							series_data_campaign[j].name ==
							salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].name
						) {
							campaign_exists = true;
							series_data_campaign[j].data[x] +=
								salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[
									z
								].count;
						}
					}
					if (campaign_exists == false) {
						dataEntered = new Array(salesRepAssignedTeam.length).fill(0);
						dataEntered[x] =
							salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].count;

						var colorCodeCampaign;
						if (
							campaign_list.indexOf(
								salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[
									z
								].id.toString()
							) != -1
						) {
							colorCodeCampaign =
								campaign_list_color[
								campaign_list.indexOf(
									salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[
										z
									].id.toString()
								)
								];
						}

						series_data_campaign.push({
							name: salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z]
								.name,
							data: dataEntered,
							color: colorCodeCampaign,
							style: {
								fontWeight: "bold",
							},
						});
					}
				}
				console.log(
					"after series_data_campaign: " + JSON.stringify(series_data_campaign)
				);
			}
		}

		console.log("salesRepAssignedTeamMemberCategories");
		console.log(salesRepAssignedTeamMemberCategories);

		console.log("series_data_entered");
		console.log(series_data_entered);

		console.log("series_data_campaign");
		console.log(series_data_campaign);

		plotSalesRepChart(
			series_data_entered,
			null,
			salesRepAssignedTeamMemberCategories
		);

		plotSalesRepChartCampaign(
			series_data_campaign,
			null,
			salesRepAssignedTeamMemberCategories
		);

		//?Franchisee Generated Leads Assgined to Sales Rep
		console.log("lead_source: " + lead_source);
		console.log("date_signed_up_from: " + date_signed_up_from);
		console.log("date_signed_up_to: " + date_signed_up_to);
		if (role != 1000) {
			//Sales Dashboard - Franchisee Generated Leads by Last Assigned - Weekly Reporting
			// var leadsListByZeeGeneratedLastAssignedSearch = search.load({
			// 	type: "customer",
			// 	id: "customsearch_leads_reporting_weekly_4__3",
			// });

			//Sales Dashboard - Leads by Zee & Last Assigned - Weekly Reporting
			var leadsListByZeeGeneratedLastAssignedSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_4__6",
			});

			leadsListByZeeGeneratedLastAssignedSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.NONEOF,
					values: [109783],
				})
			);

			if (customer_type == "2") {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "TEST",
					})
				);
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTCONTAIN,
						values: "- Parent",
					})
				);
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Shippit Pty Ltd ",
					})
				);
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "Sendle",
					})
				);
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "companyname",
						join: null,
						operator: search.Operator.DOESNOTSTARTWITH,
						values: "SC -",
					})
				);
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity_np_np_customer",
						join: null,
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}

			if (!isNullorEmpty(leadStatus)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: leadStatus,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			if (
				!isNullorEmpty(date_signed_up_from) &&
				!isNullorEmpty(date_signed_up_to)
			) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: date_signed_up_from,
					})
				);

				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date_signup",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: date_signed_up_to,
					})
				);
			}

			if (
				!isNullorEmpty(commencement_start_date) &&
				!isNullorEmpty(commencement_last_date)
			) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORAFTER,
						values: commencement_start_date,
					})
				);

				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						operator: search.Operator.ONORBEFORE,
						values: commencement_last_date,
					})
				);
			}

			if (
				!isNullorEmpty(cancelled_start_date) &&
				!isNullorEmpty(cancelled_last_date)
			) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity13",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: cancelled_start_date,
					})
				);

				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity13",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: cancelled_last_date,
					})
				);
			}

			if (!isNullorEmpty(lead_source)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.IS,
						values: lead_source,
					})
				);
			}

			if (!isNullorEmpty(sales_rep)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: sales_rep,
					})
				);
			}

			if (!isNullorEmpty(lead_entered_by)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity_lead_entered_by",
						join: null,
						operator: search.Operator.IS,
						values: lead_entered_by,
					})
				);
			}

			if (!isNullorEmpty(sales_campaign)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.ANYOF,
						values: sales_campaign,
					})
				);
			}

			if (!isNullorEmpty(parent_lpo)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parent_lpo,
					})
				);
			}

			if (
				!isNullorEmpty(date_quote_sent_from) &&
				!isNullorEmpty(date_quote_sent_to)
			) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_quote_sent_from,
					})
				);

				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_quote_sent",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_quote_sent_to,
					})
				);
			}

			if (!isNullorEmpty(zee_id)) {
				leadsListByZeeGeneratedLastAssignedSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (
				!isNullorEmpty(modified_date_from) &&
				!isNullorEmpty(modified_date_to)
			) {
				var defaultSearchFilters =
					leadsListByZeeGeneratedLastAssignedSearch.filterExpression;

				console.log(
					"default search filters: " + JSON.stringify(defaultSearchFilters)
				);

				var modifiedDateFilters = [
					[
						["activity.date", "within", [modified_date_from, modified_date_to]],
						"AND",
						[
							"activity.custevent_organiser",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
					"AND",
					[
						[
							"usernotes.notedate",
							"within",
							[modified_date_from, modified_date_to],
						],
						"AND",
						[
							"usernotes.author",
							"anyof",
							"anyof",
							"1623053",
							"668712",
							"1797389",
							"1809334",
							"690145",
							"1771076",
							"1813424",
							"696160",
							"668711",
							"1809382",
							"653718",
							"1777309",
							"1819701",
							"1820151",
							"1822089",
						],
					],
				];
				console.log(
					"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
				);

				defaultSearchFilters.push("AND");
				defaultSearchFilters.push(modifiedDateFilters);

				console.log(
					"defaultSearchFilters filters: " +
					JSON.stringify(defaultSearchFilters)
				);

				leadsListByZeeGeneratedLastAssignedSearch.filterExpression =
					defaultSearchFilters;
			}

			var count1 = 0;
			var total_leads = 0;
			var total_leads_assigned = 0;
			var oldCustSalesRepAssigned = null;
			var oldCustSalesRepAssignedText = null;

			var oldzeeGenerated = null;
			var oldzeeGeneratedId = null;

			var oldDataCaptureCampaign = null;
			var oldDataCaptureCampaignId = null;

			var dataCaptureBySource = {};
			var datatCaptureBySourceId = {};

			var zeeGeneratedTeam = [];

			var defaultSearchFilters =
				leadsListByZeeGeneratedLastAssignedSearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListByZeeGeneratedLastAssignedSearch
				.run()
				.each(function (leadsListBySalesRepDataCaptureCampaignSearchResultSet) {
					var prospectCount = parseInt(
						leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
							name: "internalid",
							summary: "COUNT",
						})
					);

					var custSalesRepAssigned = parseInt(
						leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
							name: "custrecord_sales_assigned",
							join: "CUSTRECORD_SALES_CUSTOMER",
							summary: "GROUP",
						})
					);
					var custSalesRepAssignedText =
						leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
							name: "custrecord_sales_assigned",
							join: "CUSTRECORD_SALES_CUSTOMER",
							summary: "GROUP",
						});

					var zeeGenerated =
						leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
							name: "partner",
							summary: "GROUP",
						});

					var zeeGeneratedId =
						leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
							name: "partner",
							summary: "GROUP",
						});

					// if (isNullorEmpty(dataCaptureAssigned)) {
					//     dataCaptureAssigned = 'Franchisees'
					// }
					// if (isNullorEmpty(dataCaptureAssignedId)) {
					//     dataCaptureAssignedId = -4
					// }

					if (count1 == 0) {
						total_leads += prospectCount;
						total_leads_assigned += prospectCount;

						zeeGeneratedTeam.push({
							id: zeeGeneratedId,
							name: zeeGenerated,
							count: total_leads_assigned,
							details: [],
						});

						zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details.push({
							lastAssigned: [
								{
									id: custSalesRepAssigned,
									name: custSalesRepAssignedText,
									count: prospectCount,
								},
							],
						});
					} else if (
						oldzeeGeneratedId != null &&
						oldzeeGeneratedId == zeeGeneratedId
					) {
						total_leads_assigned += prospectCount;

						zeeGeneratedTeam[zeeGeneratedTeam.length - 1].count =
							total_leads_assigned;
						var lastAssignedLength =
							zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details[0]
								.lastAssigned.length;

						if (custSalesRepAssigned == oldCustSalesRepAssigned) {
							total_leads += prospectCount;
							zeeGeneratedTeam[
								zeeGeneratedTeam.length - 1
							].details[0].lastAssigned[lastAssignedLength - 1].count =
								total_leads;
						} else if (custSalesRepAssigned != oldCustSalesRepAssigned) {
							// total_leads += prospectCount;
							zeeGeneratedTeam[
								zeeGeneratedTeam.length - 1
							].details[0].lastAssigned.push({
								id: custSalesRepAssigned,
								name: custSalesRepAssignedText,
								count: prospectCount,
							});
						}
					} else if (
						oldzeeGeneratedId != null &&
						oldzeeGeneratedId != zeeGeneratedId
					) {
						total_leads = 0;
						total_leads_assigned = 0;

						total_leads += prospectCount;
						total_leads_assigned += prospectCount;

						zeeGeneratedTeam.push({
							id: zeeGeneratedId,
							name: zeeGenerated,
							count: total_leads_assigned,
							details: [],
						});

						zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details.push({
							lastAssigned: [
								{
									id: custSalesRepAssigned,
									name: custSalesRepAssignedText,
									count: prospectCount,
								},
							],
						});
					}

					count1++;
					oldCustSalesRepAssigned = custSalesRepAssigned;
					oldCustSalesRepAssignedText = custSalesRepAssignedText;
					oldzeeGenerated = zeeGenerated;
					oldzeeGeneratedId = zeeGeneratedId;
					return true;
				});

			console.log("zeeGeneratedTeam: " + JSON.stringify(zeeGeneratedTeam));

			var series_data_last_assigned = [];
			var series_data_campaign = [];
			var salesRepAssignedTeamMemberCategories = [];
			var enteredLeadCount = [];
			var enteredName = [];
			var dataLastAssigned = new Array(dataCaptureTeam.length).fill(0);
			var dataLPOSource = new Array(dataCaptureTeam.length).fill(0);
			var dataLPOCampaign = new Array(dataCaptureTeam.length).fill(0);
			var resetDataSource = new Array(dataCaptureTeam.length).fill(0);
			for (var x = 0; x < zeeGeneratedTeam.length; x++) {
				salesRepAssignedTeamMemberCategories[x] = zeeGeneratedTeam[x].name;
				enteredLeadCount[x] = [];
				enteredName[x] = [];
				console.log("name: " + zeeGeneratedTeam[x].name);
				console.log(
					"details: " +
					JSON.stringify(zeeGeneratedTeam[x].details[0].lastAssigned)
				);
				for (
					y = 0;
					y < zeeGeneratedTeam[x].details[0].lastAssigned.length;
					y++
				) {
					enteredLeadCount[x][y] =
						zeeGeneratedTeam[x].details[0].lastAssigned[y].count;
					enteredName[x][y] =
						zeeGeneratedTeam[x].details[0].lastAssigned[y].name;

					console.log(
						"lastAssigned Name: " +
						zeeGeneratedTeam[x].details[0].lastAssigned[y].name
					);
					console.log(
						"lastAssigned Count: " +
						zeeGeneratedTeam[x].details[0].lastAssigned[y].count
					);

					console.log(
						"before series_data_last_assigned: " +
						JSON.stringify(series_data_last_assigned)
					);
					var entered_by_exists = false;
					for (var j = 0; j < series_data_last_assigned.length; j++) {
						if (series_data_last_assigned[j].name == enteredName[x][y]) {
							entered_by_exists = true;
							series_data_last_assigned[j].data[x] =
								zeeGeneratedTeam[x].details[0].lastAssigned[y].count;
						}
					}
					if (entered_by_exists == false) {
						dataLastAssigned = new Array(zeeGeneratedTeam.length).fill(0);
						dataLastAssigned[x] =
							zeeGeneratedTeam[x].details[0].lastAssigned[y].count;

						var colorCode = "#ffffff";
						if (
							employee_list.indexOf(
								zeeGeneratedTeam[x].details[0].lastAssigned[y].id.toString()
							) != -1
						) {
							colorCode =
								employee_list_color[
								employee_list.indexOf(
									zeeGeneratedTeam[x].details[0].lastAssigned[y].id.toString()
								)
								];
						}

						if (enteredName[x][y] == "Portal") {
							colorCode = "#0F6292";
						} else if (enteredName[x][y] == "Franchisees") {
							colorCode = "#508b9b";
						}

						series_data_last_assigned.push({
							name: enteredName[x][y],
							data: dataLastAssigned,
							color: colorCode,
							style: {
								fontWeight: "bold",
							},
						});
					}

					console.log(
						"after series_data_last_assigned: " +
						JSON.stringify(series_data_last_assigned)
					);
				}
			}

			console.log("salesRepAssignedTeamMemberCategories");
			console.log(salesRepAssignedTeamMemberCategories);

			console.log("series_data_last_assigned");
			console.log(series_data_last_assigned);

			plotZeeGeneratedSalesRepChart(
				series_data_last_assigned,
				null,
				salesRepAssignedTeamMemberCategories
			);
		}

		

		console.log("prospects hidden");

		
		debt_set = [];
		debt_set2 = [];
	}

	function createChild(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];

		// console.log('customer child row: ' + row.data()[19]);

		row.data()[22].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				var invoiceURL = "";
				childSet.push([
					el.invoiceDocumentNumber,
					el.invoiceDate,
					el.invoiceType,
					el.invoiceAmount,
					el.invoiceStatus,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Invoice Number" },
				{ title: "Invoice Date" },
				{ title: "Invoice Type" },
				{ title: "Invoice Amount" },
				{ title: "Invoice Status" },
			],
			columnDefs: [],
			rowCallback: function (row, data) {
				if (data[4] == "Paid In Full") {
					$("td", row).css("background-color", "#C7F2A4");
				}
			},
		});
	}

	function createChildTrialCustomers(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];

		console.log("customer free trial child row: " + row.data()[16]);

		row.data()[19].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				var invoiceURL = "";
				childSet.push([
					el.invoiceDocumentNumber,
					el.invoiceDate,
					el.invoiceType,
					el.invoiceAmount,
					el.invoiceStatus,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Invoice Number" },
				{ title: "Invoice Date" },
				{ title: "Invoice Type" },
				{ title: "Invoice Amount" },
				{ title: "Invoice Status" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildTrialPendingCustomers(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];

		console.log("customer free trial child row: " + row.data()[16]);

		row.data()[19].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				var invoiceURL = "";
				childSet.push([
					el.invoiceDocumentNumber,
					el.invoiceDate,
					el.invoiceType,
					el.invoiceAmount,
					el.invoiceStatus,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Invoice Number" },
				{ title: "Invoice Date" },
				{ title: "Invoice Type" },
				{ title: "Invoice Amount" },
				{ title: "Invoice Status" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildSalesRepTimeline(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];

		console.log("customer free trial child row: " + row.data()[16]);

		row.data()[6].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				var invoiceURL = "";
				childSet.push([
					el.systemNotesDate,
					el.oldStatus,
					el.timeInStatusDays,
					el.newStatus,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [0, "asc"],
			columns: [
				{ title: "DATE" },
				{ title: "OLD STATUS" },
				{ title: "DAYS IN OLD STATUS" },
				{ title: "NEW STATUS" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildExisting(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];

		// console.log('customer child row: ' + row.data()[19]);

		row.data()[22].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				var invoiceURL = "";
				childSet.push([
					el.invoiceDocumentNumber,
					el.invoiceDate,
					el.invoiceType,
					el.invoiceAmount,
					el.invoiceStatus,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Invoice Number" },
				{ title: "Invoice Date" },
				{ title: "Invoice Type" },
				{ title: "Invoice Amount" },
				{ title: "Invoice Status" },
			],
			columnDefs: [],
			rowCallback: function (row, data) {
				if (data[4] == "Paid In Full") {
					$("td", row).css("background-color", "#C7F2A4");
				}
			},
		});
	}

	function createChild2(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[15].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.activityInternalID,
					el.activityStartDate,
					el.activityTitle,
					el.activityOrganiser,
					el.activityMessage,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Organiser" },
				{ title: "Message" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildSuspectLost(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[19].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}
	function createChild3(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[18].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id" },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildSuspectsNew(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[12].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildQualified(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[11].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildUnqualified(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[11].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildValidated(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[12].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function createChildNoAnswerInContact(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[11].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.tasksInternalID,
					el.taskDate,
					el.taskTitle,
					el.taskAssignedTo,
					el.taskStatus,
					el.taskComment,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Assigned To" },
				{ title: "Status" },
				{ title: "Comment" },
			],
			columnDefs: [],
			rowCallback: function (row, data) { },
		});
	}

	function destroyChild(row) {
		// And then hide the row
		row.child.hide();
	}

	function plotSalesRepChart(series_data, series_data2, categores) {
		Highcharts.chart("container_entered_sales_rep_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Sales Rep Assigned - Lead Entered By",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotZeeGeneratedSalesRepChart(series_data, series_data2, categores) {
		Highcharts.chart("container_zee_overview_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Franchisee - Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				// formatter: function () {
				// 	return '<b>{this.key}</b>: <b>{this.x}</b><br/>{this.series.name}: {this.y}<br/>Total: {this.stackTotal}';
				// },
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			// tooltip: {
			// 	headerFormat: "<b>{point.key}</b><br/>",
			// 	pointFormat:
			// 		"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			// },
			series: series_data,
		});
	}

	function plotSalesRepChartCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_campaign_sales_rep_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Sales Rep Assigned - Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartPreview(
		series_data20,
		series_data21,
		series_data22,
		series_data23,
		series_data24,
		series_data25,
		series_data26,
		series_data27,
		series_data28,
		series_data29,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		categores,
		series_data20a,
		series_data21a,
		series_data22a,
		series_data23a,
		series_data24a,
		series_data25a,
		series_data26a,
		series_data27a,
		series_data28a,
		series_data29a,
		series_data30a,
		series_data31a, series_data32b
	) {
		// console.log(series_data)

		Highcharts.chart("container_preview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Leads - By Status - Week Entered",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Customer - Signed",
					data: series_data20,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - ShipMate Pending",
					data: series_data32b,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial",
					data: series_data23a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial Pending",
					data: series_data27a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Quote Sent",
					data: series_data26,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Box Sent",
					data: series_data29a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Opportunity",
					data: series_data31,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Qualified",
					data: series_data26a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data28,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data34,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Hot Lead",
					data: series_data21,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Qualified",
					data: series_data20a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Pre Qualification",
					data: series_data30a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Qualification",
					data: series_data31a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Unqualified",
					data: series_data28a,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Validated",
					data: series_data22a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data22,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Follow Up",
					data: series_data33,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data21a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - No Answer",
					data: series_data24a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Contact",
					data: series_data25a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Parking Lot",
					data: series_data25,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Lost",
					data: series_data23,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Out of Territory",
					data: series_data32,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer - Lost",
					data: series_data24,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartPreviewQuoteSentByStatus(
		series_data20,
		series_data21,
		series_data22,
		series_data23,
		series_data24,
		series_data25,
		series_data26,
		series_data27,
		series_data28,
		series_data29,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		categores,
		series_data20a,
		series_data21a,
		series_data22a,
		series_data23a,
		series_data24a,
		series_data25a,
		series_data26a,
		series_data27a,
		series_data28a,
		series_data29a,
		series_data30a,
		series_data31a, series_data32a
	) {
		// console.log(series_data)

		Highcharts.chart("container_preview_quote_sent", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Leads - By Status - Week Quote Sent",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Customer - Signed",
					data: series_data20,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - ShipMate Pending",
					data: series_data32a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial",
					data: series_data23a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial Pending",
					data: series_data27a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Quote Sent",
					data: series_data26,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Box Sent",
					data: series_data29a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Opportunity",
					data: series_data31,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Qualified",
					data: series_data26a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data28,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data34,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Hot Lead",
					data: series_data21,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Qualified",
					data: series_data20a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Pre Qualification",
					data: series_data30a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Qualification",
					data: series_data31a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Unqualified",
					data: series_data28a,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Validated",
					data: series_data22a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data22,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Follow Up",
					data: series_data33,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data21a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - No Answer",
					data: series_data24a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Contact",
					data: series_data25a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Parking Lot",
					data: series_data25,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Lost",
					data: series_data23,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Out of Territory",
					data: series_data32,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer - Lost",
					data: series_data24,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotLPOChartPreview(
		series_data20,
		series_data21,
		series_data22,
		series_data23,
		series_data24,
		series_data25,
		series_data26,
		series_data27,
		series_data28,
		series_data29,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		categores,
		series_data20a,
		series_data21a,
		series_data22a,
		series_data23a,
		series_data24a,
		series_data25a,
		series_data26a,
		series_data27a
	) {
		// console.log(series_data)

		Highcharts.chart("container_lpo_overview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "LPO Leads - By Status - Parent LPO's",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Customer - Signed",
					data: series_data20,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial",
					data: series_data23a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial Pending",
					data: series_data27a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Quote Sent",
					data: series_data26,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Opportunity",
					data: series_data31,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Qualified",
					data: series_data26a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data34,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Hot Lead",
					data: series_data21,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Qualified",
					data: series_data20a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Validated",
					data: series_data22a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data22,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Follow Up",
					data: series_data33,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data21a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - No Answer",
					data: series_data24a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Contact",
					data: series_data25a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Parking Lot",
					data: series_data25,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data28,
					color: "#59C1BD",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Lost",
					data: series_data23,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Out of Territory",
					data: series_data32,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer - Lost",
					data: series_data24,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotZeeChartPreview(
		series_data20,
		series_data21,
		series_data22,
		series_data23,
		series_data24,
		series_data25,
		series_data26,
		series_data27,
		series_data28,
		series_data29,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		categores,
		series_data20a,
		series_data21a,
		series_data22a,
		series_data23a,
		series_data24a,
		series_data25a,
		series_data26a,
		series_data27a,
		zee_series_data28a,
		zee_series_data29a,
		zee_series_data30a, zee_series_data31a
	) {
		// console.log(series_data)

		Highcharts.chart("container_zee_overview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Franchisee Leads - By Status",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Customer - Signed",
					data: series_data20,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - ShipMate Pending",
					data: zee_series_data31a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial",
					data: series_data23a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial Pending",
					data: series_data27a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Quote Sent",
					data: series_data26,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Opportunity",
					data: series_data31,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Qualified",
					data: series_data26a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data28,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data34,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Hot Lead",
					data: series_data21,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Qualified",
					data: series_data20a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Pre Qualification",
					data: zee_series_data29a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Qualification",
					data: zee_series_data30a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Unqualified",
					data: zee_series_data28a,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Validated",
					data: series_data22a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data22,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Follow Up",
					data: series_data33,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data21a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - No Answer",
					data: series_data24a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Contact",
					data: series_data25a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Parking Lot",
					data: series_data25,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Lost",
					data: series_data23,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Out of Territory",
					data: series_data32,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer - Lost",
					data: series_data24,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotSalesRepChartPreview(
		series_data20,
		series_data21,
		series_data22,
		series_data23,
		series_data24,
		series_data25,
		series_data26,
		series_data27,
		series_data28,
		series_data29,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		categores,
		series_data20a,
		series_data21a,
		series_data22a,
		series_data23a,
		series_data24a,
		series_data25a,
		series_data26a,
		series_data27a,
		series_data28a,
		salesrep_series_data29a, salesrep_series_data30a
	) {
		// console.log(series_data)

		Highcharts.chart("container_salesrep_overview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Leads - By Sales Rep & Status",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Customer - Signed",
					data: series_data20,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - ShipMate Pending",
					data: salesrep_series_data30a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial",
					data: series_data23a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial Pending",
					data: series_data27a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Quote Sent",
					data: series_data26,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Opportunity",
					data: series_data31,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Box Sent",
					data: salesrep_series_data29a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Qualified",
					data: series_data25a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data28,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data34,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Hot Lead",
					data: series_data21,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Qualified",
					data: series_data20a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Unqualified",
					data: series_data28a,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Validated",
					data: series_data22a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data22,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Follow Up",
					data: series_data33,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data21a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - No Answer",
					data: series_data24a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Contact",
					data: series_data25a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Parking Lot",
					data: series_data25,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},

				{
					name: "Suspect - Lost",
					data: series_data23,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Out of Territory",
					data: series_data32,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer - Lost",
					data: series_data24,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotDataCaptureChartPreview(
		series_data20,
		series_data21,
		series_data22,
		series_data23,
		series_data24,
		series_data25,
		series_data26,
		series_data27,
		series_data28,
		series_data29,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		categores,
		series_data20a,
		series_data21a,
		series_data22a,
		series_data23a,
		series_data24a,
		series_data25a,
		series_data26a,
		series_data27a,
		series_data28a,
		series_data29a,
		series_data30a,
		series_data31a, datacapture_series_data32a
	) {
		// console.log(series_data)

		Highcharts.chart("container_datacapture_overview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
			},
			title: {
				text: "Leads - By Data Capture Team & Status",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Customer - Signed",
					data: series_data20,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - ShipMate Pending",
					data: datacapture_series_data32a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial",
					data: series_data23a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Customer - Free Trial Pending",
					data: series_data27a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Quote Sent",
					data: series_data26,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Box Sent",
					data: series_data29a,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Opportunity",
					data: series_data31,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospects - Qualified",
					data: series_data25a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data28,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data34,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Hot Lead",
					data: series_data21,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Qualified",
					data: series_data20a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Unqualified",
					data: series_data28a,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Validated",
					data: series_data22a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Pre Qualification",
					data: series_data30a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Qualificaition",
					data: series_data31a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data22,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Follow Up",
					data: series_data33,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data21a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - No Answer",
					data: series_data24a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - In Contact",
					data: series_data25a,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Parking Lot",
					data: series_data25,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Lost",
					data: series_data23,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Out of Territory",
					data: series_data32,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer - Lost",
					data: series_data24,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChart(series_data, series_data2, categores) {
		Highcharts.chart("container_source_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Lead Entered - Lead Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartSignedByLastAssigned(series_data, series_data2, categores) {
		Highcharts.chart("container_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartQuoteSentByLastAssigned(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_prospect_quote_sent_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartBoxSentByLastAssigned(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_prospect_box_sent_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartFreeTrialByLastAssigned(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_trial_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartOpportunityByLastAssigned(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_prospect_opportunity_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartFreeTrialPendingByLastAssigned(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_trial_pending_last_assigned", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Last Assigned",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartSignedByCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_signed_campaign", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Signed",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartQuoteSentByCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_prospect_quote_sent_campaign", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Signed",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartBoxSentByCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_prospect_box_sent_campaign", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Signed",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartFreeTrialByCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_trial_campaign", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Free Trial",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartOpportunityByCampaign(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_prospect_opportunity_campaign", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Free Trial",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartFreeTrialPendingByCampaign(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_trial_pending_campaign", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Free Trial Pending",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartSignedBySource(series_data, series_data2, categores) {
		Highcharts.chart("container_signed_source", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Signed",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartQuoteSentBySource(series_data, series_data2, categores) {
		Highcharts.chart("container_prospect_quote_sent_source", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Signed",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartBoxSentBySource(series_data, series_data2, categores) {
		Highcharts.chart("container_prospect_box_sent_source", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Signed",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartFreeTrialBySource(series_data, series_data2, categores) {
		Highcharts.chart("container_trial_source", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Free Trial",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartOpportunityBySource(series_data, series_data2, categores) {
		Highcharts.chart("container_prospect_opportunity_source", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Free Trial",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartFreeTrialPendingBySource(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_trial_pending_source", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
				min: 0,
				title: {
					text: "Total Free Trial Pending",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartDataCaptureOverview(series_data, series_data2, categores) {
		Highcharts.chart("container_source_datacapture_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Lead Entered - Lead Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_campaign_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Lead Entered - Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartDataCaptureOverviewCampaign(
		series_data,
		series_data2,
		categores
	) {
		Highcharts.chart("container_campaign_datacapture_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Lead Entered - Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartLPOCampaign(series_data, series_data2, categores) {
		Highcharts.chart("container_lpo_campaign_datacapture_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Lead Entered - Campaign",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartLPOSource(series_data, series_data2, categores) {
		Highcharts.chart("container_lpo_source_datacapture_preview", {
			chart: {
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
				type: "column",
			},
			title: {
				text: "Leads - By Lead Entered - Source",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				color: "#103D39",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						x: -10,
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat:
					"{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}<br/> Total",
			},
			series: series_data,
		});
	}

	function plotChartCustomerCanellationRequested(
		series_data100,
		series_data101,
		series_data102,
		series_data103,
		categores
	) {
		// console.log(series_data)

		Highcharts.chart("container_cancellation", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Cancellation Request - Week Requested",
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
				min: 0,
				title: {
					text: "Total Cancellation Request Count",
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Saved",
					data: series_data101,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "On going",
					data: series_data103,
					color: "#f9c67a",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Not Saved",
					data: series_data102,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartProspects(
		series_data40,
		series_data41,
		series_data42,
		series_data43,
		series_data44,
		categores5,
		series_data45
	) {
		// console.log(series_data)

		Highcharts.chart("container_quoteSent_incontact_noanswer", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Prospects - Weekly Opportunity / In Contact",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores5,
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
						color: "#0B2447",
						fontSize: "10px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
			},
			series: [
				{
					name: "Prospect - Opportunity",
					data: series_data44,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - In Contact",
					data: series_data42,
					color: "#59C1BD",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Prospect - Qualified",
					data: series_data45,
					color: "#59C1BD",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartProspectsQuotes(series_data43, series_data44, categores5) {
		Highcharts.chart("container_prospects_opportunites", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Prospects - Weekly Quotes",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores5,
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
				min: 0,
				title: {
					text: "Total Lead Count",
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Prospect - Quote Sent",
					data: series_data44,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartProspectsBoxSent(series_data43, series_data44, categores5) {
		Highcharts.chart("container_prospects_box", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Prospects - Weekly Box Sent",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores5,
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
				min: 0,
				title: {
					text: "Total Lead Count",
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Prospect - Box Sent",
					data: series_data44,
					color: "#ADCF9F",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspects(
		series_data50,
		series_data50,
		series_data51,
		series_data52,
		series_data53,
		categores_suspects
	) {
		// console.log(series_data)

		Highcharts.chart("container_suspects", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Hot Lead - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects,
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
				min: 0,
				title: {
					text: "Total Lead Count",
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Hot Lead",
					data: series_data51,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - New",
					data: series_data50,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Reassign",
					data: series_data52,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsLost(
		series_data60,
		series_data61,
		series_data62,
		categores_suspects_lost
	) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_lost", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Lost - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects_lost,
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
				min: 0,
				title: {
					text: "Total Lead Count",
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Lost",
					data: series_data60,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - Customer -Lost",
					data: series_data61,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsOffPeakPipeline(
		series_data70,
		categores_suspects_off_peak_pipeline
	) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_off_peak_pipeline", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Parking Lot - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects_off_peak_pipeline,
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
						color: "#0B2447",
						fontSize: "10px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Parking Lot",
					data: series_data70,
					color: "#FEBE8C",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsOOT(series_data80, categores_suspects_oot) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_oot", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Out of Territory - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects_oot,
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
						color: "#0B2447",
						fontSize: "10px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Out of Territory",
					data: series_data80,
					color: "#E97777",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsValidated(series_data90, categores_validated) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_validated", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Validated - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_validated,
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Validated",
					data: series_data90,
					color: "#FCE09B",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}
	function plotChartSuspectsQualified(series_data90, categores_qualified) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_qualified", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Qualified - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_qualified,
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Qualified",
					data: series_data90,
					color: "#FCE09B",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsUnqualified(series_data90, categores_qualified) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_unqualified", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Unqualified - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_qualified,
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Unqualified",
					data: series_data90,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsFollowUp(
		series_data90,
		categores_suspects_follow_up,
		series_data91
	) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_followup", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - Follow Up - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects_follow_up,
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - Follow Up",
					data: series_data90,
					color: "#AED2FF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Suspect - LPO Follow Up",
					data: series_data91,
					color: "#8ECDDD",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsNoAnswer(
		series_data200,
		categores_suspects_no_answer,
		series_data201
	) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_no_answer", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - No Answer - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects_no_answer,
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - No Answer",
					data: series_data200,
					color: "#FCE09B",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartSuspectsInContact(
		series_data300,
		categores_suspects_in_contact,
		series_data301
	) {
		// console.log(series_data)

		Highcharts.chart("container_suspects_in_contact", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Suspects - In Contact - Week Entered",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores_suspects_in_contact,
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
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Suspect - In Contact",
					data: series_data300,
					color: "#FCE09B",
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartTrialCustomerSigned(
		series_data30,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		series_data35,
		series_data36,
		series_data37,
		categores_customer_signed_week,
		series_data38,
		series_data39,
		series_data30a,
		series_data31a,
		series_data32a,
		series_data33a
	) {
		// console.log(series_data)

		Highcharts.chart("container_trial_customers", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Trail Customers by Source - Week Signed Up",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "10px",
				},
			},
			xAxis: {
				categories: categores_customer_signed_week,
				crosshair: true,
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "10px",
				},
				labels: {
					style: {
						fontWeight: "bold",
						fontSize: "10px",
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
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Franchisee Generated",
					data: series_data30,
					color: "#FFD4B2",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Inbound - Call",
					data: series_data31,
					color: "#FFF6BD",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Field Sales",
					data: series_data32,
					color: "#CEEDC7",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Inbound - Website",
					data: series_data33,
					color: "#86C8BC",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Additional Services",
					data: series_data35,
					color: "#86A3B8",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Legal Campaign",
					data: series_data36,
					color: "#748DA6",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "FuturePlus",
					data: series_data38,
					color: "#0f9564",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO Transition",
					data: series_data39,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - Head Office Generated",
					data: series_data30a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - AP Customer",
					data: series_data31a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - Inbound Web",
					data: series_data32a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Head Office Generated",
					data: series_data33a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Other Source",
					data: series_data37,
					// color: '#748DA6',
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartTrialPendingCustomerSigned(
		series_data30,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		series_data35,
		series_data36,
		series_data37,
		categores_customer_signed_week,
		series_data38,
		series_data39,
		series_data30a,
		series_data31a,
		series_data32a,
		series_data33a
	) {
		// console.log(series_data)

		Highcharts.chart("container_trial_pending_customers", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Trail Pending Customers by Source - Week Signed Up",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "10px",
				},
			},
			xAxis: {
				categories: categores_customer_signed_week,
				crosshair: true,
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "10px",
				},
				labels: {
					style: {
						fontWeight: "bold",
						fontSize: "10px",
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
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Franchisee Generated",
					data: series_data30,
					color: "#FFD4B2",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Inbound - Call",
					data: series_data31,
					color: "#FFF6BD",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Field Sales",
					data: series_data32,
					color: "#CEEDC7",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Inbound - Website",
					data: series_data33,
					color: "#86C8BC",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Additional Services",
					data: series_data35,
					color: "#86A3B8",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Legal Campaign",
					data: series_data36,
					color: "#748DA6",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "FuturePlus",
					data: series_data38,
					color: "#0f9564",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO Transition",
					data: series_data39,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - Head Office Generated",
					data: series_data30a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - AP Customer",
					data: series_data31a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - Inbound Web",
					data: series_data32a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Head Office Generated",
					data: series_data33a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Other Source",
					data: series_data37,
					// color: '#748DA6',
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function plotChartCustomerSigned(
		series_data30,
		series_data31,
		series_data32,
		series_data33,
		series_data34,
		series_data35,
		series_data36,
		series_data37,
		categores_customer_signed_week,
		series_data38,
		series_data39,
		series_data30a,
		series_data31a,
		series_data32a,
		series_data33a
	) {
		// console.log(series_data)

		Highcharts.chart("container_customer", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Customer Signed by Source - Week Signed Up",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "10px",
				},
			},
			xAxis: {
				categories: categores_customer_signed_week,
				crosshair: true,
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "10px",
				},
				labels: {
					style: {
						fontWeight: "bold",
						fontSize: "10px",
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
						fontSize: "10px",
					},
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
						color: "#0B2447",
						fontSize: "12px",
					},
				},
				labels: {
					style: {
						fontSize: "10px",
					},
				},
			},
			tooltip: {
				headerFormat: "<b>{point.key}</b><br/>",
				pointFormat: "{series.name}: {point.y}({point.percentage:.0f}%)<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "12px",
						},
					},
					pointPadding: 0.1,
					groupPadding: 0,
				},
			},
			series: [
				{
					name: "Franchisee Generated",
					data: series_data30,
					color: "#FFD4B2",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Inbound - Call",
					data: series_data31,
					color: "#FFF6BD",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Field Sales",
					data: series_data32,
					color: "#CEEDC7",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Inbound - Website",
					data: series_data33,
					color: "#86C8BC",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Additional Services",
					data: series_data35,
					color: "#86A3B8",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Legal Campaign",
					data: series_data36,
					color: "#748DA6",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "FuturePlus",
					data: series_data38,
					color: "#0f9564",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO Transition",
					data: series_data39,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - Head Office Generated",
					data: series_data30a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - AP Customer",
					data: series_data31a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "LPO - Inbound Web",
					data: series_data32a,
					color: "#dc1928",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Head Office Generated",
					data: series_data33a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Other Source",
					data: series_data37,
					// color: '#748DA6',
					style: {
						fontWeight: "bold",
					},
				},
			],
		});
	}

	function saveRecord() {
		return true;
	}

	/**
	 * Create the CSV and store it in the hidden field 'custpage_table_csv' as a string.
	 * @param {Array} ordersDataSet The `billsDataSet` created in `loadDatatable()`.
	 */
	function saveCsv(ordersDataSet) {
		var sep = "sep=;";
		var headers = [
			"Customer Internal ID",
			"Customer Entity ID",
			"Customer Name",
			"Franchisee",
			"Sign Up Date",
			"Commencement Date",
			"Sales Rep",
			"Expected Weekly Usage",
			"Online Expected Weekly Usage",
			"No. of Weeks Used",
			"Total No. of Weeks (since Commencement)",
			"Avg Weekly Usage",
			"Sorting",
			"MPEX Customer",
		];
		headers = headers.join(";"); // .join(', ')

		var csv = sep + "\n" + headers + "\n";

		ordersDataSet.forEach(function (row) {
			row = row.join(";");
			csv += row;
			csv += "\n";
		});

		var val1 = currentRecord.get();
		val1.setValue({
			fieldId: "custpage_overview_table_csv",
			value: csv,
		});

		return true;
	}

	function replaceAll(string) {
		return string.split("/").join("-");
	}

	function formatDate(testDate) {
		console.log("testDate: " + testDate);
		var responseDate = format.format({
			value: testDate,
			type: format.Type.DATE,
		});
		console.log("responseDate: " + responseDate);
		return responseDate;
	}

	function replaceAll(string) {
		return string.split("/").join("-");
	}

	/**
	 * @param   {Number} x
	 * @returns {String} The same number, formatted in Australian dollars.
	 */
	function financial(x) {
		if (typeof x == "string") {
			x = parseFloat(x);
		}
		if (isNullorEmpty(x) || isNaN(x)) {
			return "$0.00";
		} else {
			return x.toLocaleString("en-AU", {
				style: "currency",
				currency: "AUD",
			});
		}
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

	return {
		pageInit: pageInit,
		saveRecord: saveRecord,
		addFilters: addFilters,
	};
});
