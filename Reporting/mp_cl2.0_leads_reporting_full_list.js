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

	var page_no = 1;

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

	var debtDataSet_shipmate_pending = [];
	var debt_set_shipmate_pending = [];

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
	var shipMatePendingCustomerDataSet = [];
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
	var suspectZeeReviewDataSet = [];
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
			}

			window.location.href = url;
		});


		$(".page_number").click(function () {
			var page_number = $(this).attr("data-id");
			console.log("page_number: " + page_number);
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
					"/app/site/hosting/scriptlet.nl?script=1989&deploy=1&page_no=" +
					page_number + "&start_date=" +
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

		$("#clearFilter").click(function () {
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1989&deploy=1";

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

		if (role == 1000) {
			//Customer Cancellation - Requested Date - All (Monthly)
			var customerCancellationRequestedDateSearch = search.load({
				type: "customer",
				id: "customsearch_cust_cancellation_request_4",
			});
		} else {
			//Customer Cancellation - Requested Date - All
			var customerCancellationRequestedDateSearch = search.load({
				type: "customer",
				id: "customsearch_cust_cancellation_request_3",
			});
		}

		customerCancellationRequestedDateSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custentity_cancellation_requested_date",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custentity_cancellation_requested_date",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			customerCancellationRequestedDateSearch.filters.push(
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
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			customerCancellationRequestedDateSearch.filters.push(
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
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			customerCancellationRequestedDateSearch.filters.push(
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
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			customerCancellationRequestedDateSearch.filters.push(
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
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			customerCancellationRequestedDateSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			customerCancellationRequestedDateSearch.filters.push(
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
			var defaultSearchFilters =
				customerCancellationRequestedDateSearch.filterExpression;

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

			customerCancellationRequestedDateSearch.filterExpression =
				defaultSearchFilters;
		}

		var totalCancellationRequest = 0;
		var customerSavedCount = 0;
		var customerNotSavedCount = 0;
		var customerOnGoing = 0;
		var oldRequestedDate = null;
		var countCustomerCancellationRequest = 0;

		customerCancellationRequestedDateSearch
			.run()
			.each(function (customerCancellationRequestedDateSearchResultSet) {
				var customerCancellationCount = parseInt(
					customerCancellationRequestedDateSearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var requestedDate =
					customerCancellationRequestedDateSearchResultSet.getValue({
						name: "custentity_cancellation_requested_date",
						summary: "GROUP",
					});
				var customerSaved =
					customerCancellationRequestedDateSearchResultSet.getText({
						name: "custentity_customer_saved",
						summary: "GROUP",
					});

				if (role == 1000) {
					var startDate = requestedDate;
				} else {
					var splitMonthV2 = requestedDate.split("/");

					var formattedDate = dateISOToNetsuite(
						splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
					);

					var firstDay = new Date(
						splitMonthV2[0],
						splitMonthV2[1],
						1
					).getDate();
					var lastDay = new Date(splitMonthV2[0], splitMonthV2[1], 0).getDate();

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
				}

				if (oldRequestedDate == null || oldRequestedDate == startDate) {
					totalCancellationRequest =
						totalCancellationRequest + customerCancellationCount;
					if (customerSaved == "Yes") {
						customerSavedCount = customerSavedCount + customerCancellationCount;
					} else if (customerSaved == "No") {
						customerNotSavedCount =
							customerNotSavedCount + customerCancellationCount;
					} else {
						customerOnGoing = customerOnGoing + customerCancellationCount;
					}
				} else if (oldRequestedDate != startDate) {
					debt_setCustomerCancellationRequest.push({
						requestedDate: oldRequestedDate,
						totalCancellationRequest: totalCancellationRequest,
						customerSavedCount: customerSavedCount,
						customerNotSavedCount: customerNotSavedCount,
						customerOnGoing: customerOnGoing,
					});

					totalCancellationRequest = 0;
					customerSavedCount = 0;
					customerNotSavedCount = 0;
					customerOnGoing = 0;

					totalCancellationRequest =
						totalCancellationRequest + customerCancellationCount;
					if (customerSaved == "Yes") {
						customerSavedCount = customerSavedCount + customerCancellationCount;
					} else if (customerSaved == "No") {
						customerNotSavedCount =
							customerNotSavedCount + customerCancellationCount;
					} else {
						customerOnGoing = customerOnGoing + customerCancellationCount;
					}
				}

				oldRequestedDate = startDate;
				countCustomerCancellationRequest++;
				return true;
			});

		if (countCustomerCancellationRequest > 0) {
			debt_setCustomerCancellationRequest.push({
				requestedDate: oldRequestedDate,
				totalCancellationRequest: totalCancellationRequest,
				customerSavedCount: customerSavedCount,
				customerNotSavedCount: customerNotSavedCount,
				customerOnGoing: customerOnGoing,
			});
		}

		var customerCancellationRequestDateDataSet = [];
		if (!isNullorEmpty(debt_setCustomerCancellationRequest)) {
			debt_setCustomerCancellationRequest.forEach(function (
				preview_row,
				index
			) {
				customerCancellationRequestDateDataSet.push([
					preview_row.requestedDate,
					preview_row.totalCancellationRequest,
					preview_row.customerSavedCount,
					preview_row.customerNotSavedCount,
					preview_row.customerOnGoing,
				]);
			});
		}
		console.log(
			"customerCancellationRequestDateDataSet: " +
			customerCancellationRequestDateDataSet
		);

		var month_year_customer = []; // creating array for storing browser
		var customer_cancellation_requested_date_total = [];
		var customer_cancellation_requested_date_saved = [];
		var customer_cancellation_requested_date_notsaved = [];
		var customer_cancellation_requested_date_ongoing = [];

		for (var i = 0; i < customerCancellationRequestDateDataSet.length; i++) {
			month_year_customer.push(customerCancellationRequestDateDataSet[i][0]);
			customer_cancellation_requested_date_total[
				customerCancellationRequestDateDataSet[i][0]
			] = customerCancellationRequestDateDataSet[i][1];
			customer_cancellation_requested_date_saved[
				customerCancellationRequestDateDataSet[i][0]
			] = customerCancellationRequestDateDataSet[i][2];
			customer_cancellation_requested_date_notsaved[
				customerCancellationRequestDateDataSet[i][0]
			] = customerCancellationRequestDateDataSet[i][3];
			customer_cancellation_requested_date_ongoing[
				customerCancellationRequestDateDataSet[i][0]
			] = customerCancellationRequestDateDataSet[i][4];
		}

		var series_data100 = [];
		var series_data101 = [];
		var series_data102 = [];
		var series_data103 = [];
		var categores_customer_cancelled_request_week = []; // creating empty array for highcharts
		// categories
		Object.keys(customer_cancellation_requested_date_total).map(function (
			item,
			key
		) {
			console.log(item);
			series_data100.push(
				parseInt(customer_cancellation_requested_date_total[item])
			);
			series_data101.push(
				parseInt(customer_cancellation_requested_date_saved[item])
			);
			series_data102.push(
				parseInt(customer_cancellation_requested_date_notsaved[item])
			);
			series_data103.push(
				parseInt(customer_cancellation_requested_date_ongoing[item])
			);
			categores_customer_cancelled_request_week.push(item);
		});

		plotChartCustomerCanellationRequested(
			series_data100,
			series_data101,
			series_data102,
			series_data103,
			categores_customer_cancelled_request_week
		);

		//Customer Sales Dashboard - Customer Cancellation - Requested List - All
		var customerCancellationRequesteSearch = search.load({
			type: "customer",
			id: "customsearch_cust_cancellation_request_2",
		});

		customerCancellationRequesteSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custentity_cancellation_requested_date",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custentity_cancellation_requested_date",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			customerCancellationRequesteSearch.filters.push(
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
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			customerCancellationRequesteSearch.filters.push(
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
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			customerCancellationRequesteSearch.filters.push(
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
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			customerCancellationRequesteSearch.filters.push(
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
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			customerCancellationRequesteSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			customerCancellationRequesteSearch.filters.push(
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
			var defaultSearchFilters =
				customerCancellationRequesteSearch.filterExpression;

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

			customerCancellationRequesteSearch.filterExpression =
				defaultSearchFilters;
		}

		var totalCancellationRequest = 0;
		var customerSavedCount = 0;
		var customerNotSavedCount = 0;
		var oldRequestedDate = null;
		var countCustomerCancellationRequest = 0;

		customerCancellationRequesteSearch
			.run()
			.each(function (customerCancellationRequesteSearchResultSet) {
				var customerCancellationRequestDate =
					customerCancellationRequesteSearchResultSet.getValue({
						name: "custentity_cancellation_requested_date",
						summary: "GROUP",
					});
				var customerInternalId =
					customerCancellationRequesteSearchResultSet.getValue({
						name: "internalid",
						summary: "GROUP",
					});
				var customerEntityId =
					customerCancellationRequesteSearchResultSet.getValue({
						name: "entityid",
						summary: "GROUP",
					});
				var customerCompanyName =
					customerCancellationRequesteSearchResultSet.getValue({
						name: "companyname",
						summary: "GROUP",
					});
				var customerZee = customerCancellationRequesteSearchResultSet.getText({
					name: "partner",
					summary: "GROUP",
				});
				var customerCancellationReason =
					customerCancellationRequesteSearchResultSet.getText({
						name: "custentity_service_cancellation_reason",
						summary: "GROUP",
					});

				//New Cancellation Fields: Theme, What & Why
				//New Cancellation Fields - Theme/What & Why
				var cancellationTheme = customerCancellationRequesteSearchResultSet.getText({
					name: "custentity_service_cancellation_theme",
					summary: "GROUP",
				});
				var cancellationWhat = customerCancellationRequesteSearchResultSet.getText({
					name: "custentity_service_cancellation_what",
					summary: "GROUP",
				});
				var cancellationWhy = customerCancellationRequesteSearchResultSet.getText({
					name: "custentity_service_cancellation_why",
					summary: "GROUP",
				});

				var customerCancellationOngoing =
					customerCancellationRequesteSearchResultSet.getText({
						name: "custentity_cancel_ongoing",
						summary: "GROUP",
					});
				var customerSaved = customerCancellationRequesteSearchResultSet.getText(
					{
						name: "custentity_customer_saved",
						summary: "GROUP",
					}
				);
				var customerSavedDate =
					customerCancellationRequesteSearchResultSet.getValue({
						name: "custentity_customer_saved_date",
						summary: "GROUP",
					});
				var monthlyServiceRevenue = parseFloat(
					customerCancellationRequesteSearchResultSet.getValue({
						name: "custentity_monthly_reduc_service_revenue",
						summary: "GROUP",
					})
				);
				var last6MonthsAvgInvoiceValue = parseFloat(
					customerCancellationRequesteSearchResultSet.getValue({
						name: "amount",
						join: "transaction",
						summary: "AVG",
					})
				);

				var customerCancellationRequestDateSplit =
					customerCancellationRequestDate.split("/");

				var formattedDate = dateISOToNetsuite(
					customerCancellationRequestDateSplit[2] +
					"-" +
					customerCancellationRequestDateSplit[1] +
					"-" +
					customerCancellationRequestDateSplit[0]
				);

				var firstDayCustomerCancellationRequestDate = new Date(
					customerCancellationRequestDateSplit[0],
					customerCancellationRequestDateSplit[1],
					1
				).getDate();
				var lastDayCustomerCancellationRequestDate = new Date(
					customerCancellationRequestDateSplit[0],
					customerCancellationRequestDateSplit[1],
					0
				).getDate();

				if (firstDayCustomerCancellationRequestDate < 10) {
					firstDayCustomerCancellationRequestDate =
						"0" + firstDayCustomerCancellationRequestDate;
				}

				// var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
				var startDateCustomerCancellationRequestDate =
					customerCancellationRequestDateSplit[2] +
					"-" +
					customerCancellationRequestDateSplit[1] +
					"-" +
					customerCancellationRequestDateSplit[0];
				var monthsStartDateCustomerCancellationRequestDate =
					customerCancellationRequestDateSplit[2] +
					"-" +
					customerCancellationRequestDateSplit[1] +
					"-" +
					firstDayCustomerCancellationRequestDate;
				// var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
				var lastDateCustomerCancellationRequestDate =
					customerCancellationRequestDateSplit[2] +
					"-" +
					customerCancellationRequestDateSplit[1] +
					"-" +
					lastDayCustomerCancellationRequestDate;

				if (customerSaved == "Yes" || customerSaved == "No") {
					customerCancellationOngoing = "";
				} else {
					customerCancellationOngoing = "Yes";
				}

				if (!isNullorEmpty(customerSavedDate)) {
					var customerSavedDateDateSplit = customerSavedDate.split("/");

					var formattedDate = dateISOToNetsuite(
						customerSavedDateDateSplit[2] +
						"-" +
						customerSavedDateDateSplit[1] +
						"-" +
						customerSavedDateDateSplit[0]
					);

					var firstDayCustomerSavedDate = new Date(
						customerSavedDateDateSplit[0],
						customerSavedDateDateSplit[1],
						1
					).getDate();
					var lastDayCustomerSavedDate = new Date(
						customerSavedDateDateSplit[0],
						customerSavedDateDateSplit[1],
						0
					).getDate();

					if (firstDayCustomerSavedDate < 10) {
						firstDayCustomerSavedDate = "0" + firstDayCustomerSavedDate;
					}

					// var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
					var startDateCustomerSavedDate =
						customerSavedDateDateSplit[2] +
						"-" +
						customerSavedDateDateSplit[1] +
						"-" +
						customerSavedDateDateSplit[0];
					var monthsStartDateCustomerSavedDate =
						customerSavedDateDateSplit[2] +
						"-" +
						customerSavedDateDateSplit[1] +
						"-" +
						firstDayCustomerSavedDate;
					// var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
					var lastDateCustomerSavedDate =
						customerSavedDateDateSplit[2] +
						"-" +
						customerSavedDateDateSplit[1] +
						"-" +
						lastDayCustomerSavedDate;
				} else {
					var startDateCustomerSavedDate = "";
				}

				customerCancellationRequestDataSet.push([
					customerInternalId,
					customerEntityId,
					customerCompanyName,
					customerZee,
					startDateCustomerCancellationRequestDate,
					customerCancellationOngoing,
					customerSaved,
					startDateCustomerSavedDate,
					customerCancellationReason,
					cancellationTheme,
					cancellationWhat,
					cancellationWhy,
					financial(last6MonthsAvgInvoiceValue),
					financial(monthlyServiceRevenue),
				]);

				return true;
			});

		var dataTable3 = $("#mpexusage-cancellation").DataTable({
			data: customerCancellationRequestDataSet,
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
				{ title: "Internal ID" },//0
				{ title: "ID" },//1
				{ title: "Company Name" },//2
				{ title: "Franchisee" },//3
				{ title: "Request Date" },//4
				{ title: "On-going" },//5
				{ title: "Saved" },//6
				{ title: "Saved Date" },//7
				{ title: "Old Cancellation Reason" },//8
				{ title: "Cancellation Theme" },//9
				{ title: "Cancellation What" },//10
				{ title: "Cancellation Why" },//11
				{ title: "Avg Invoice Value - Last 6 Months" },//12
				{ title: "Saved Monthly Service Value" },//13
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [1, 2, 6, 13],
					className: "bolded",
				},
			],
			rowCallback: function (row, data, index) {
				var row_color = "";
				if (data[6] == "No") {
					$("td", row).css("background-color", "#E97777");
				} else if (data[6] == "Yes") {
					$("td", row).css("background-color", "#439A97");
				} else if (data[5] == "Yes") {
					$("td", row).css("background-color", "#f9c67a");
				}
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// Total Expected Usage over all pages
				total_avg_invoice = api
					.column(12)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_avg_invoice = api
					.column(12, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(12).footer()).html(
					formatter.format(page_total_avg_invoice)
				);
				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(13).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
				);
			},
		});

		if (role == 1000) {
			// Website New Leads - Signed - Weekly Reporting (Monthly)
			var customerListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_3",
			});
		} else {
			// Sales Dashboard - Leads - Signed - Weekly Reporting
			var customerListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2",
			});
		}

		customerListBySalesRepWeeklySearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			customerListBySalesRepWeeklySearch.filters.push(
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
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			customerListBySalesRepWeeklySearch.filters.push(
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
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			customerListBySalesRepWeeklySearch.filters.push(
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
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			customerListBySalesRepWeeklySearch.filters.push(
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
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			customerListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			customerListBySalesRepWeeklySearch.filters.push(
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
			var defaultSearchFilters =
				customerListBySalesRepWeeklySearch.filterExpression;

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

			customerListBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		total_customer_signed = 0;
		var count_customer_signed = 0;
		var oldCustomerSignedDate = null;
		var oldCustomerCount = 0;
		var oldCustomerSource = null;

		var source_zee_generated = 0;
		var source_call = 0;
		var source_field_sales = 0;
		var source_website = 0;
		var source_additional_services = 0;
		var source_legal_campaign = 0;
		var other_source = 0;
		var futurePlusCount = 0;
		var ho_generated = 0;
		var lpo_ho_generated = 0;
		var lpo_transition = 0;
		var lpo_inbound_web = 0;
		var lpo_ap_customer = 0;
		var outsourced_ho_generated = 0;
		var outsourced_ho_validated = 0;

		var total_source_count = 0;

		customerListBySalesRepWeeklySearch
			.run()
			.each(function (customerListBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					customerListBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					customerListBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_prospect_opportunity",
						summary: "GROUP",
					});

				var customerSource =
					customerListBySalesRepWeeklySearchResultSet.getValue({
						name: "leadsource",
						summary: "GROUP",
					});

				var customerSourceText =
					customerListBySalesRepWeeklySearchResultSet.getText({
						name: "leadsource",
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

				if (count_customer_signed == 0) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else if (customerSource == "295896") {
						outsourced_ho_generated += parseInt(customerCount);
					} else if (customerSource == "296333") {
						outsourced_ho_validated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated + outsourced_ho_generated + outsourced_ho_validated
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate == startDate
				) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else if (customerSource == "295896") {
						outsourced_ho_generated += parseInt(customerCount);
					} else if (customerSource == "296333") {
						outsourced_ho_validated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated + outsourced_ho_generated + outsourced_ho_validated;
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate != startDate
				) {
					debt_set3.push({
						dateUsed: oldCustomerSignedDate,
						source_zee_generated: source_zee_generated,
						source_call: source_call,
						source_field_sales: source_field_sales,
						source_website: source_website,
						total_source_count: total_source_count,
						source_additional_services: source_additional_services,
						source_legal_campaign: source_legal_campaign,
						other_source: other_source,
						futurePlusCount: futurePlusCount,
						lpo_transition: lpo_transition,
						lpo_ho_generated: lpo_ho_generated,
						lpo_ap_customer: lpo_ap_customer,
						lpo_inbound_web: lpo_inbound_web,
						ho_generated: ho_generated,
						outsourced_ho_generated: outsourced_ho_generated,
						outsourced_ho_validated: outsourced_ho_validated
					});

					source_zee_generated = 0;
					source_call = 0;
					source_field_sales = 0;
					source_website = 0;
					total_source_count = 0;
					source_additional_services = 0;
					source_legal_campaign = 0;
					other_source = 0;
					futurePlusCount = 0;
					ho_generated = 0;
					lpo_ho_generated = 0;
					lpo_transition = 0;
					lpo_inbound_web = 0;
					lpo_ap_customer = 0;
					outsourced_ho_generated = 0;
					outsourced_ho_validated = 0;

					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else if (customerSource == "295896") {
						outsourced_ho_generated += parseInt(customerCount);
					} else if (customerSource == "296333") {
						outsourced_ho_validated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated + outsourced_ho_generated + outsourced_ho_validated;
				}

				// debt_set3.push([
				//     startDate,
				//     customerCount
				// ]);

				oldCustomerCount = customerCount;
				oldCustomerSource = customerSource;
				oldCustomerSignedDate = startDate;
				count_customer_signed++;
				return true;
			});

		if (count_customer_signed > 0) {
			debt_set3.push({
				dateUsed: oldCustomerSignedDate,
				source_zee_generated: source_zee_generated,
				source_call: source_call,
				source_field_sales: source_field_sales,
				source_website: source_website,
				total_source_count: total_source_count,
				source_additional_services: source_additional_services,
				source_legal_campaign: source_legal_campaign,
				other_source: other_source,
				futurePlusCount: futurePlusCount,
				lpo_transition: lpo_transition,
				lpo_ho_generated: lpo_ho_generated,
				lpo_ap_customer: lpo_ap_customer,
				lpo_inbound_web: lpo_inbound_web,
				ho_generated: ho_generated,
				outsourced_ho_generated: outsourced_ho_generated,
				outsourced_ho_validated: outsourced_ho_validated
			});
		}

		console.log("debt_set3: " + JSON.stringify(debt_set3));

		var customerSignedDataSet = [];
		if (!isNullorEmpty(debt_set3)) {
			debt_set3.forEach(function (preview_row, index) {
				customerSignedDataSet.push([
					preview_row.dateUsed,
					preview_row.source_zee_generated,
					preview_row.source_call,
					preview_row.source_field_sales,
					preview_row.source_website,
					preview_row.source_additional_services,
					preview_row.source_legal_campaign,
					preview_row.other_source,
					preview_row.futurePlusCount,
					preview_row.lpo_transition,
					preview_row.lpo_ho_generated,
					preview_row.lpo_ap_customer,
					preview_row.lpo_inbound_web,
					preview_row.ho_generated,
					preview_row.outsourced_ho_generated,
					preview_row.outsourced_ho_validated,
					preview_row.total_source_count,
				]);
			});
		}
		console.log("customerSignedDataSet: " + customerSignedDataSet);

		var month_year_customer = []; // creating array for storing browser
		var customer_signed_source_zee_generatedcount = [];
		var customer_signed_source_callcount = [];
		var customer_signed_source_field_salescount = [];
		var customer_signed_source_websitecount = [];
		var customer_signed_total_source_countcount = [];
		var customer_signed_source_additional_services = [];
		var customer_signed_source_legal_campaign = [];
		var customer_signed_other_source = [];
		var customer_signed_future_plus = [];
		var customer_signed_lpo_transition = [];
		var customer_signed_lpo_ho_generated = [];
		var customer_signed_lpo_ap_customer = [];
		var customer_signed_lpo_inbound_web = [];
		var customer_signed_ho_generated = [];
		var customer_signed_outsourced_ho_generated = [];
		var customer_signed_outsourced_ho_validated = [];

		for (var i = 0; i < customerSignedDataSet.length; i++) {
			month_year_customer.push(customerSignedDataSet[i][0]);
			customer_signed_source_zee_generatedcount[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][1];
			customer_signed_source_callcount[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][2];
			customer_signed_source_field_salescount[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][3];
			customer_signed_source_websitecount[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][4];
			customer_signed_total_source_countcount[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][16];
			customer_signed_source_additional_services[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][5];
			customer_signed_source_legal_campaign[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][6];
			customer_signed_other_source[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][7];
			customer_signed_future_plus[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][8];
			customer_signed_lpo_transition[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][9];
			customer_signed_lpo_ho_generated[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][10];
			customer_signed_lpo_ap_customer[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][11];
			customer_signed_lpo_inbound_web[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][12];
			customer_signed_ho_generated[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][13];
			customer_signed_outsourced_ho_generated[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][14];
			customer_signed_outsourced_ho_validated[customerSignedDataSet[i][0]] =
				customerSignedDataSet[i][15];
		}

		var series_data30 = [];
		var series_data31 = [];
		var series_data32 = [];
		var series_data33 = [];
		var series_data34 = [];
		var series_data35 = [];
		var series_data36 = [];
		var series_data37 = [];
		var series_data38 = [];
		var series_data39 = [];
		var series_data30a = [];
		var series_data31a = [];
		var series_data32a = [];
		var series_data33a = [];
		var series_data34a = [];
		var series_data35a = [];


		var categores_customer_signed_week = []; // creating empty array for highcharts
		// categories
		Object.keys(customer_signed_source_websitecount).map(function (item, key) {
			console.log(item);
			series_data30.push(
				parseInt(customer_signed_source_zee_generatedcount[item])
			);
			series_data31.push(parseInt(customer_signed_source_callcount[item]));
			series_data32.push(
				parseInt(customer_signed_source_field_salescount[item])
			);
			series_data33.push(parseInt(customer_signed_source_websitecount[item]));
			series_data34.push(
				parseInt(customer_signed_total_source_countcount[item])
			);
			series_data35.push(
				parseInt(customer_signed_source_additional_services[item])
			);
			series_data36.push(parseInt(customer_signed_source_legal_campaign[item]));
			series_data37.push(parseInt(customer_signed_other_source[item]));
			series_data38.push(parseInt(customer_signed_future_plus[item]));
			series_data39.push(parseInt(customer_signed_lpo_transition[item]));
			series_data30a.push(parseInt(customer_signed_lpo_ho_generated[item]));
			series_data31a.push(parseInt(customer_signed_lpo_ap_customer[item]));
			series_data32a.push(parseInt(customer_signed_lpo_inbound_web[item]));
			series_data33a.push(parseInt(customer_signed_ho_generated[item]));
			series_data34a.push(parseInt(customer_signed_outsourced_ho_generated[item]));
			series_data35a.push(parseInt(customer_signed_outsourced_ho_validated[item]));
			categores_customer_signed_week.push(item);
		});
		console.log("series_data37: " + series_data37);

		plotChartCustomerSigned(
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
			series_data33a, series_data34a,
			series_data35a
		);

		if (role == 1000) {
			// Sales Dashboard - Website New Leads - ShipMate Pending - Weekly Reporting (Monthly)
			var customerShipMatePendingListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_22",
			});
		} else {
			// Sales Dashboard - Leads - ShipMate Pending - Weekly Reporting
			var customerShipMatePendingListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_7",
			});
		}

		customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
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
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
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
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
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
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
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
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			customerShipMatePendingListBySalesRepWeeklySearch.filters.push(
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
			var defaultSearchFilters =
				customerShipMatePendingListBySalesRepWeeklySearch.filterExpression;

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

			customerShipMatePendingListBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		total_customer_signed = 0;
		var count_customer_signed = 0;
		var oldCustomerSignedDate = null;
		var oldCustomerCount = 0;
		var oldCustomerSource = null;

		var source_zee_generated = 0;
		var source_call = 0;
		var source_field_sales = 0;
		var source_website = 0;
		var source_additional_services = 0;
		var source_legal_campaign = 0;
		var other_source = 0;
		var futurePlusCount = 0;
		var ho_generated = 0;
		var lpo_ho_generated = 0;
		var lpo_transition = 0;
		var lpo_inbound_web = 0;
		var lpo_ap_customer = 0;
		var outsourced_ho_validated = 0;
		var outsourced_ho_generated = 0;

		var total_source_count = 0;

		customerShipMatePendingListBySalesRepWeeklySearch
			.run()
			.each(function (customerShipMatePendingListBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					customerShipMatePendingListBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					customerShipMatePendingListBySalesRepWeeklySearchResultSet.getValue({
						name: "custrecord_comm_date",
						join: "CUSTRECORD_CUSTOMER",
						summary: "GROUP",
					});

				var customerSource =
					customerShipMatePendingListBySalesRepWeeklySearchResultSet.getValue({
						name: "leadsource",
						summary: "GROUP",
					});

				var customerSourceText =
					customerShipMatePendingListBySalesRepWeeklySearchResultSet.getText({
						name: "leadsource",
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

				if (count_customer_signed == 0) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					}
					else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else if (customerSource == "295896") {
						outsourced_ho_generated += parseInt(customerCount);
					} else if (customerSource == "296333") {
						outsourced_ho_validated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated + outsourced_ho_generated + outsourced_ho_validated
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate == startDate
				) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else if (customerSource == "295896") {
						outsourced_ho_generated += parseInt(customerCount);
					} else if (customerSource == "296333") {
						outsourced_ho_validated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated + outsourced_ho_generated + outsourced_ho_validated;
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate != startDate
				) {
					debt_set_shipmate_pending.push({
						dateUsed: oldCustomerSignedDate,
						source_zee_generated: source_zee_generated,
						source_call: source_call,
						source_field_sales: source_field_sales,
						source_website: source_website,
						total_source_count: total_source_count,
						source_additional_services: source_additional_services,
						source_legal_campaign: source_legal_campaign,
						other_source: other_source,
						futurePlusCount: futurePlusCount,
						lpo_transition: lpo_transition,
						lpo_ho_generated: lpo_ho_generated,
						lpo_ap_customer: lpo_ap_customer,
						lpo_inbound_web: lpo_inbound_web,
						ho_generated: ho_generated,
						outsourced_ho_generated: outsourced_ho_generated,
						outsourced_ho_validated: outsourced_ho_validated,
					});

					source_zee_generated = 0;
					source_call = 0;
					source_field_sales = 0;
					source_website = 0;
					total_source_count = 0;
					source_additional_services = 0;
					source_legal_campaign = 0;
					other_source = 0;
					futurePlusCount = 0;
					ho_generated = 0;
					lpo_ho_generated = 0;
					lpo_transition = 0;
					lpo_inbound_web = 0;
					lpo_ap_customer = 0;
					outsourced_ho_validated = 0;
					outsourced_ho_generated = 0;

					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else if (customerSource == "295896") {
						outsourced_ho_generated += parseInt(customerCount);
					} else if (customerSource == "296333") {
						outsourced_ho_validated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated + outsourced_ho_generated + outsourced_ho_validated;
				}

				// debt_set3.push([
				//     startDate,
				//     customerCount
				// ]);

				oldCustomerCount = customerCount;
				oldCustomerSource = customerSource;
				oldCustomerSignedDate = startDate;
				count_customer_signed++;
				return true;
			});

		if (count_customer_signed > 0) {
			debt_set_shipmate_pending.push({
				dateUsed: oldCustomerSignedDate,
				source_zee_generated: source_zee_generated,
				source_call: source_call,
				source_field_sales: source_field_sales,
				source_website: source_website,
				total_source_count: total_source_count,
				source_additional_services: source_additional_services,
				source_legal_campaign: source_legal_campaign,
				other_source: other_source,
				futurePlusCount: futurePlusCount,
				lpo_transition: lpo_transition,
				lpo_ho_generated: lpo_ho_generated,
				lpo_ap_customer: lpo_ap_customer,
				lpo_inbound_web: lpo_inbound_web,
				ho_generated: ho_generated,
				outsourced_ho_generated: outsourced_ho_generated,
				outsourced_ho_validated: outsourced_ho_validated,
			});
		}

		console.log("debt_set_shipmate_pending: " + JSON.stringify(debt_set_shipmate_pending));

		var customerShipMatePendingDataSet = [];
		if (!isNullorEmpty(debt_set_shipmate_pending)) {
			debt_set_shipmate_pending.forEach(function (preview_row, index) {
				customerShipMatePendingDataSet.push([
					preview_row.dateUsed,
					preview_row.source_zee_generated,
					preview_row.source_call,
					preview_row.source_field_sales,
					preview_row.source_website,
					preview_row.source_additional_services,
					preview_row.source_legal_campaign,
					preview_row.other_source,
					preview_row.futurePlusCount,
					preview_row.lpo_transition,
					preview_row.lpo_ho_generated,
					preview_row.lpo_ap_customer,
					preview_row.lpo_inbound_web,
					preview_row.ho_generated,
					preview_row.outsourced_ho_generated,
					preview_row.outsourced_ho_validated,
					preview_row.total_source_count,
				]);
			});
		}
		console.log("customerShipMatePendingDataSet: " + customerShipMatePendingDataSet);

		var month_year_customer = []; // creating array for storing browser
		var customer_shipmate_pending_source_zee_generatedcount = [];
		var customer_shipmate_pending_source_callcount = [];
		var customer_shipmate_pending_source_field_salescount = [];
		var customer_shipmate_pending_source_websitecount = [];
		var customer_shipmate_pending_total_source_countcount = [];
		var customer_shipmate_pending_source_additional_services = [];
		var customer_shipmate_pending_source_legal_campaign = [];
		var customer_shipmate_pending_other_source = [];
		var customer_shipmate_pending_future_plus = [];
		var customer_shipmate_pending_lpo_transition = [];
		var customer_shipmate_pending_lpo_ho_generated = [];
		var customer_shipmate_pending_lpo_ap_customer = [];
		var customer_shipmate_pending_lpo_inbound_web = [];
		var customer_shipmate_pending_ho_generated = [];
		var customer_shipmate_pending_outsourced_ho_generated = [];
		var customer_shipmate_pending_outsourced_ho_validated = [];

		for (var i = 0; i < customerShipMatePendingDataSet.length; i++) {
			month_year_customer.push(customerShipMatePendingDataSet[i][0]);
			customer_shipmate_pending_source_zee_generatedcount[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][1];
			customer_shipmate_pending_source_callcount[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][2];
			customer_shipmate_pending_source_field_salescount[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][3];
			customer_shipmate_pending_source_websitecount[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][4];
			customer_shipmate_pending_total_source_countcount[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][16];
			customer_shipmate_pending_source_additional_services[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][5];
			customer_shipmate_pending_source_legal_campaign[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][6];
			customer_shipmate_pending_other_source[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][7];
			customer_shipmate_pending_future_plus[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][8];
			customer_shipmate_pending_lpo_transition[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][9];
			customer_shipmate_pending_lpo_ho_generated[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][10];
			customer_shipmate_pending_lpo_ap_customer[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][11];
			customer_shipmate_pending_lpo_inbound_web[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][12];
			customer_shipmate_pending_ho_generated[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][13];
			customer_shipmate_pending_outsourced_ho_generated[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][14];
			customer_shipmate_pending_outsourced_ho_validated[customerShipMatePendingDataSet[i][0]] =
				customerShipMatePendingDataSet[i][15];
		}

		var series_shipmate_pending_data30 = [];
		var series_shipmate_pending_data31 = [];
		var series_shipmate_pending_data32 = [];
		var series_shipmate_pending_data33 = [];
		var series_shipmate_pending_data34 = [];
		var series_shipmate_pending_data35 = [];
		var series_shipmate_pending_data36 = [];
		var series_shipmate_pending_data37 = [];
		var series_shipmate_pending_data38 = [];
		var series_shipmate_pending_data39 = [];
		var series_shipmate_pending_data30a = [];
		var series_shipmate_pending_data31a = [];
		var series_shipmate_pending_data32a = [];
		var series_shipmate_pending_data33a = [];
		var series_shipmate_pending_data34a = [];
		var series_shipmate_pending_data35a = [];

		var categores_customer_shipmate_pending_week = []; // creating empty array for highcharts
		// categories
		Object.keys(customer_shipmate_pending_source_websitecount).map(function (item, key) {
			console.log(item);
			series_shipmate_pending_data30.push(
				parseInt(customer_shipmate_pending_source_zee_generatedcount[item])
			);
			series_shipmate_pending_data31.push(parseInt(customer_shipmate_pending_source_callcount[item]));
			series_shipmate_pending_data32.push(
				parseInt(customer_shipmate_pending_source_field_salescount[item])
			);
			series_shipmate_pending_data33.push(parseInt(customer_shipmate_pending_source_websitecount[item]));
			series_shipmate_pending_data34.push(
				parseInt(customer_shipmate_pending_total_source_countcount[item])
			);
			series_data35.push(
				parseInt(customer_shipmate_pending_source_additional_services[item])
			);
			series_shipmate_pending_data36.push(parseInt(customer_shipmate_pending_source_legal_campaign[item]));
			series_shipmate_pending_data37.push(parseInt(customer_shipmate_pending_other_source[item]));
			series_shipmate_pending_data38.push(parseInt(customer_shipmate_pending_future_plus[item]));
			series_shipmate_pending_data39.push(parseInt(customer_shipmate_pending_lpo_transition[item]));
			series_shipmate_pending_data30a.push(parseInt(customer_shipmate_pending_lpo_ho_generated[item]));
			series_shipmate_pending_data31a.push(parseInt(customer_shipmate_pending_lpo_ap_customer[item]));
			series_shipmate_pending_data32a.push(parseInt(customer_shipmate_pending_lpo_inbound_web[item]));
			series_shipmate_pending_data33a.push(parseInt(customer_shipmate_pending_ho_generated[item]));
			series_shipmate_pending_data34a.push(parseInt(customer_shipmate_pending_outsourced_ho_generated[item]));
			series_shipmate_pending_data35a.push(parseInt(customer_shipmate_pending_outsourced_ho_validated[item]));
			categores_customer_shipmate_pending_week.push(item);
		});
		console.log("series_data37: " + series_data37);

		plotChartCustomerShipmatePending(
			series_shipmate_pending_data30,
			series_shipmate_pending_data31,
			series_shipmate_pending_data32,
			series_shipmate_pending_data33,
			series_shipmate_pending_data34,
			series_shipmate_pending_data35,
			series_shipmate_pending_data36,
			series_shipmate_pending_data37,
			categores_customer_shipmate_pending_week,
			series_shipmate_pending_data38,
			series_shipmate_pending_data39,
			series_shipmate_pending_data30a,
			series_shipmate_pending_data31a,
			series_shipmate_pending_data32a,
			series_shipmate_pending_data33a, series_shipmate_pending_data34a,
			series_shipmate_pending_data35a
		);

		if (role == 1000) {
			// Sales Dashbaord - Leads - Trial - Weekly Reporting (Monthly)
			var customerTrialListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_15",
			});
		} else {
			// Sales Dashboard - Leads - Trial - Weekly Reporting
			var customerTrialListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_4",
			});
		}

		customerTrialListBySalesRepWeeklySearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			customerTrialListBySalesRepWeeklySearch.filters.push(
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
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			customerTrialListBySalesRepWeeklySearch.filters.push(
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
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			customerTrialListBySalesRepWeeklySearch.filters.push(
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
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			customerTrialListBySalesRepWeeklySearch.filters.push(
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
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			customerTrialListBySalesRepWeeklySearch.filters.push(
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
			var defaultSearchFilters =
				customerTrialListBySalesRepWeeklySearch.filterExpression;

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

			customerTrialListBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		total_customer_signed = 0;
		var count_customer_signed = 0;
		var oldCustomerSignedDate = null;
		var oldCustomerCount = 0;
		var oldCustomerSource = null;

		var source_zee_generated = 0;
		var source_call = 0;
		var source_field_sales = 0;
		var source_website = 0;
		var source_additional_services = 0;
		var source_legal_campaign = 0;
		var other_source = 0;
		var futurePlusCount = 0;
		var ho_generated = 0;
		var lpo_ho_generated = 0;
		var lpo_transition = 0;
		var lpo_inbound_web = 0;
		var lpo_ap_customer = 0;

		var total_source_count = 0;

		customerTrialListBySalesRepWeeklySearch
			.run()
			.each(function (customerTrialListBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					customerTrialListBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					customerTrialListBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_prospect_opportunity",
						summary: "GROUP",
					});

				var customerSource =
					customerTrialListBySalesRepWeeklySearchResultSet.getValue({
						name: "leadsource",
						summary: "GROUP",
					});

				var customerSourceText =
					customerTrialListBySalesRepWeeklySearchResultSet.getText({
						name: "leadsource",
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
						var startDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
						var monthsStartDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
						var lastDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
					} else {
						var startDate = "NO DATE";
					}
				}

				if (count_customer_signed == 0) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated;
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate == startDate
				) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated;
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate != startDate
				) {
					debt_setTrial.push({
						dateUsed: oldCustomerSignedDate,
						source_zee_generated: source_zee_generated,
						source_call: source_call,
						source_field_sales: source_field_sales,
						source_website: source_website,
						total_source_count: total_source_count,
						source_additional_services: source_additional_services,
						source_legal_campaign: source_legal_campaign,
						other_source: other_source,
						futurePlusCount: futurePlusCount,
						lpo_transition: lpo_transition,
						lpo_ho_generated: lpo_ho_generated,
						lpo_ap_customer: lpo_ap_customer,
						lpo_inbound_web: lpo_inbound_web,
						ho_generated: ho_generated,
					});

					source_zee_generated = 0;
					source_call = 0;
					source_field_sales = 0;
					source_website = 0;
					total_source_count = 0;
					source_additional_services = 0;
					source_legal_campaign = 0;
					other_source = 0;
					futurePlusCount = 0;
					ho_generated = 0;
					lpo_ho_generated = 0;
					lpo_transition = 0;
					lpo_inbound_web = 0;
					lpo_ap_customer = 0;

					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated;
				}

				oldCustomerCount = customerCount;
				oldCustomerSource = customerSource;
				oldCustomerSignedDate = startDate;
				count_customer_signed++;
				return true;
			});

		if (count_customer_signed > 0) {
			debt_setTrial.push({
				dateUsed: oldCustomerSignedDate,
				source_zee_generated: source_zee_generated,
				source_call: source_call,
				source_field_sales: source_field_sales,
				source_website: source_website,
				total_source_count: total_source_count,
				source_additional_services: source_additional_services,
				source_legal_campaign: source_legal_campaign,
				other_source: other_source,
				futurePlusCount: futurePlusCount,
				lpo_transition: lpo_transition,
				lpo_ho_generated: lpo_ho_generated,
				lpo_ap_customer: lpo_ap_customer,
				lpo_inbound_web: lpo_inbound_web,
				ho_generated: ho_generated,
			});
		}

		console.log("debt_setTrial: " + JSON.stringify(debt_setTrial));

		var customerTrialDataSet = [];
		if (!isNullorEmpty(debt_setTrial)) {
			debt_setTrial.forEach(function (preview_row, index) {
				customerTrialDataSet.push([
					preview_row.dateUsed, //0
					preview_row.source_zee_generated, //1
					preview_row.source_call, //2
					preview_row.source_field_sales, //3
					preview_row.source_website, //4
					preview_row.source_additional_services, //5
					preview_row.source_legal_campaign, //6
					preview_row.other_source, //7
					preview_row.futurePlusCount, //8
					preview_row.lpo_transition, //9
					preview_row.lpo_ho_generated, //10
					preview_row.lpo_ap_customer, //11
					preview_row.lpo_inbound_web, //12
					preview_row.ho_generated, //13
					preview_row.total_source_count, //14
				]);
			});
		}
		console.log("customerTrialDataSet: " + customerTrialDataSet);

		var month_year_trial_customer = []; // creating array for storing browser
		var customer_trial_source_zee_generatedcount = [];
		var customer_trial_source_callcount = [];
		var customer_trial_source_field_salescount = [];
		var customer_trial_source_websitecount = [];
		var customer_trial_total_source_countcount = [];
		var customer_trial_source_additional_services = [];
		var customer_trial_source_legal_campaign = [];
		var customer_trial_other_source = [];
		var customer_trial_future_plus = [];
		var customer_trial_lpo_transition = [];
		var customer_trial_lpo_ho_generated = [];
		var customer_trial_lpo_ap_customer = [];
		var customer_trial_lpo_inbound_web = [];
		var customer_trial_ho_generated = [];

		for (var i = 0; i < customerTrialDataSet.length; i++) {
			month_year_trial_customer.push(customerTrialDataSet[i][0]);
			customer_trial_source_zee_generatedcount[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][1];
			customer_trial_source_callcount[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][2];
			customer_trial_source_field_salescount[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][3];
			customer_trial_source_websitecount[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][4];
			customer_trial_total_source_countcount[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][14];
			customer_trial_source_additional_services[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][5];
			customer_trial_source_legal_campaign[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][6];
			customer_trial_other_source[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][7];
			customer_trial_future_plus[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][8];
			customer_trial_lpo_transition[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][9];
			customer_trial_lpo_ho_generated[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][10];
			customer_trial_lpo_ap_customer[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][11];
			customer_trial_lpo_inbound_web[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][12];
			customer_trial_ho_generated[customerTrialDataSet[i][0]] =
				customerTrialDataSet[i][13];
		}

		var series_trial_data30 = [];
		var series_trial_data31 = [];
		var series_trial_data32 = [];
		var series_trial_data33 = [];
		var series_trial_data34 = [];
		var series_trial_data35 = [];
		var series_trial_data36 = [];
		var series_trial_data37 = [];
		var series_trial_data38 = [];
		var series_trial_data39 = [];
		var series_trial_data30a = [];
		var series_trial_data31a = [];
		var series_trial_data32a = [];
		var series_trial_data33a = [];

		var categores_customer_trial_week = []; // creating empty array for highcharts
		// categories
		Object.keys(customer_trial_total_source_countcount).map(function (
			item,
			key
		) {
			console.log(item);
			series_trial_data30.push(
				parseInt(customer_trial_source_zee_generatedcount[item])
			);
			series_trial_data31.push(parseInt(customer_trial_source_callcount[item]));
			series_trial_data32.push(
				parseInt(customer_trial_source_field_salescount[item])
			);
			series_trial_data33.push(
				parseInt(customer_trial_source_websitecount[item])
			);
			series_trial_data34.push(
				parseInt(customer_trial_total_source_countcount[item])
			);
			series_trial_data35.push(
				parseInt(customer_trial_source_additional_services[item])
			);
			series_trial_data36.push(
				parseInt(customer_trial_source_legal_campaign[item])
			);
			series_trial_data37.push(parseInt(customer_trial_other_source[item]));
			series_trial_data38.push(parseInt(customer_trial_future_plus[item]));
			series_trial_data39.push(parseInt(customer_trial_lpo_transition[item]));
			series_trial_data30a.push(
				parseInt(customer_trial_lpo_ho_generated[item])
			);
			series_trial_data31a.push(parseInt(customer_trial_lpo_ap_customer[item]));
			series_trial_data32a.push(parseInt(customer_trial_lpo_inbound_web[item]));
			series_trial_data33a.push(parseInt(customer_trial_ho_generated[item]));
			categores_customer_trial_week.push(item);
		});
		console.log("series_trial_data37: " + series_trial_data37);

		plotChartTrialCustomerSigned(
			series_trial_data30,
			series_trial_data31,
			series_trial_data32,
			series_trial_data33,
			series_trial_data34,
			series_trial_data35,
			series_trial_data36,
			series_trial_data37,
			categores_customer_trial_week,
			series_trial_data38,
			series_trial_data39,
			series_trial_data30a,
			series_trial_data31a,
			series_trial_data32a,
			series_trial_data33a
		);

		//! Update the Search to exlcude Change of Entity & Relocation source
		if (role == 1000) {
			// Sales Dashboard - Leads - Trial Pending- Weekly Reporting (Monthly)
			var customerTrialPendingListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_16",
			});
		} else {
			// Sales Dashboard - Leads - Trial Pending - Weekly Reporting
			var customerTrialPendingListBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_17",
			});
		}

		customerTrialPendingListBySalesRepWeeklySearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
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
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
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
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
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
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
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
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.ANYOF,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			customerTrialPendingListBySalesRepWeeklySearch.filters.push(
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
			var defaultSearchFilters =
				customerTrialPendingListBySalesRepWeeklySearch.filterExpression;

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

			customerTrialPendingListBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		total_customer_signed = 0;
		var count_customer_signed = 0;
		var oldCustomerSignedDate = null;
		var oldCustomerCount = 0;
		var oldCustomerSource = null;

		var source_zee_generated = 0;
		var source_call = 0;
		var source_field_sales = 0;
		var source_website = 0;
		var source_additional_services = 0;
		var source_legal_campaign = 0;
		var other_source = 0;
		var futurePlusCount = 0;
		var ho_generated = 0;
		var lpo_ho_generated = 0;
		var lpo_transition = 0;
		var lpo_inbound_web = 0;
		var lpo_ap_customer = 0;

		var total_source_count = 0;

		customerTrialPendingListBySalesRepWeeklySearch
			.run()
			.each(function (customerTrialPendingListBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					customerTrialPendingListBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					customerTrialPendingListBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_prospect_opportunity",
						summary: "GROUP",
					});

				var customerSource =
					customerTrialPendingListBySalesRepWeeklySearchResultSet.getValue({
						name: "leadsource",
						summary: "GROUP",
					});

				var customerSourceText =
					customerTrialPendingListBySalesRepWeeklySearchResultSet.getText({
						name: "leadsource",
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
						var startDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
						var monthsStartDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
						var lastDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
					} else {
						var startDate = "NO DATE";
					}
				}

				if (count_customer_signed == 0) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated;
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate == startDate
				) {
					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated;
				} else if (
					oldCustomerSignedDate != null &&
					oldCustomerSignedDate != startDate
				) {
					debt_setTrialPending.push({
						dateUsed: oldCustomerSignedDate,
						source_zee_generated: source_zee_generated,
						source_call: source_call,
						source_field_sales: source_field_sales,
						source_website: source_website,
						total_source_count: total_source_count,
						source_additional_services: source_additional_services,
						source_legal_campaign: source_legal_campaign,
						other_source: other_source,
						futurePlusCount: futurePlusCount,
						lpo_transition: lpo_transition,
						lpo_ho_generated: lpo_ho_generated,
						lpo_ap_customer: lpo_ap_customer,
						lpo_inbound_web: lpo_inbound_web,
						ho_generated: ho_generated,
					});

					source_zee_generated = 0;
					source_call = 0;
					source_field_sales = 0;
					source_website = 0;
					total_source_count = 0;
					source_additional_services = 0;
					source_legal_campaign = 0;
					other_source = 0;
					futurePlusCount = 0;
					ho_generated = 0;
					lpo_ho_generated = 0;
					lpo_transition = 0;
					lpo_inbound_web = 0;
					lpo_ap_customer = 0;

					if (customerSource == "-4") {
						//ZEE GENERATED
						source_zee_generated += parseInt(customerCount);
					} else if (customerSource == "17") {
						//INBOUND CALL
						source_call += parseInt(customerCount);
					} else if (customerSource == "239030") {
						//FIELD SALES
						source_field_sales += parseInt(customerCount);
					} else if (customerSource == "254557") {
						//INBOUND - NEW WEBSITE
						source_website += parseInt(customerCount);
					} else if (customerSource == "277970") {
						source_additional_services += parseInt(customerCount);
					} else if (customerSource == "279095") {
						source_legal_campaign += parseInt(customerCount);
					} else if (customerSource == "280411") {
						futurePlusCount += parseInt(customerCount);
					} else if (customerSource == "281559") {
						lpo_transition += parseInt(customerCount);
					} else if (customerSource == "282051") {
						lpo_ho_generated += parseInt(customerCount);
					} else if (customerSource == "282083") {
						lpo_ap_customer += parseInt(customerCount);
					} else if (customerSource == "282085") {
						lpo_inbound_web += parseInt(customerCount);
					} else if (customerSource == "97943") {
						ho_generated += parseInt(customerCount);
					} else {
						other_source += parseInt(customerCount);
					}

					total_source_count =
						source_zee_generated +
						source_call +
						source_field_sales +
						source_website +
						source_additional_services +
						source_legal_campaign +
						other_source +
						futurePlusCount +
						lpo_transition +
						lpo_ho_generated +
						lpo_ap_customer +
						lpo_inbound_web +
						ho_generated;
				}

				oldCustomerCount = customerCount;
				oldCustomerSource = customerSource;
				oldCustomerSignedDate = startDate;
				count_customer_signed++;
				return true;
			});

		if (count_customer_signed > 0) {
			debt_setTrialPending.push({
				dateUsed: oldCustomerSignedDate,
				source_zee_generated: source_zee_generated,
				source_call: source_call,
				source_field_sales: source_field_sales,
				source_website: source_website,
				total_source_count: total_source_count,
				source_additional_services: source_additional_services,
				source_legal_campaign: source_legal_campaign,
				other_source: other_source,
				futurePlusCount: futurePlusCount,
				lpo_transition: lpo_transition,
				lpo_ho_generated: lpo_ho_generated,
				lpo_ap_customer: lpo_ap_customer,
				lpo_inbound_web: lpo_inbound_web,
				ho_generated: ho_generated,
			});
		}

		console.log(
			"debt_setTrialPending: " + JSON.stringify(debt_setTrialPending)
		);

		var customerTrialPendingDataSet = [];
		if (!isNullorEmpty(debt_setTrialPending)) {
			debt_setTrialPending.forEach(function (preview_row, index) {
				customerTrialPendingDataSet.push([
					preview_row.dateUsed, //0
					preview_row.source_zee_generated, //1
					preview_row.source_call, //2
					preview_row.source_field_sales, //3
					preview_row.source_website, //4
					preview_row.source_additional_services, //5
					preview_row.source_legal_campaign, //6
					preview_row.other_source, //7
					preview_row.futurePlusCount, //8
					preview_row.lpo_transition, //9
					preview_row.lpo_ho_generated, //10
					preview_row.lpo_ap_customer, //11
					preview_row.lpo_inbound_web, //12
					preview_row.ho_generated, //13
					preview_row.total_source_count, //14
				]);
			});
		}
		console.log("customerTrialPendingDataSet: " + customerTrialPendingDataSet);

		var month_year_trial_pending_customer = []; // creating array for storing browser
		var customer_trial_pending_source_zee_generatedcount = [];
		var customer_trial_pending_source_callcount = [];
		var customer_trial_pending_source_field_salescount = [];
		var customer_trial_pending_source_websitecount = [];
		var customer_trial_pending_total_source_countcount = [];
		var customer_trial_pending_source_additional_services = [];
		var customer_trial_pending_source_legal_campaign = [];
		var customer_trial_pending_other_source = [];
		var customer_trial_pending_future_plus = [];
		var customer_trial_pending_lpo_transition = [];
		var customer_trial_pending_lpo_ho_generated = [];
		var customer_trial_pending_lpo_ap_customer = [];
		var customer_trial_pending_lpo_inbound_web = [];
		var customer_trial_pending_ho_generated = [];

		for (var i = 0; i < customerTrialPendingDataSet.length; i++) {
			month_year_trial_pending_customer.push(customerTrialPendingDataSet[i][0]);
			customer_trial_pending_source_zee_generatedcount[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][1];
			customer_trial_pending_source_callcount[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][2];
			customer_trial_pending_source_field_salescount[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][3];
			customer_trial_pending_source_websitecount[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][4];
			customer_trial_pending_total_source_countcount[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][14];
			customer_trial_pending_source_additional_services[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][5];
			customer_trial_pending_source_legal_campaign[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][6];
			customer_trial_pending_other_source[customerTrialPendingDataSet[i][0]] =
				customerTrialPendingDataSet[i][7];
			customer_trial_pending_future_plus[customerTrialPendingDataSet[i][0]] =
				customerTrialPendingDataSet[i][8];
			customer_trial_pending_lpo_transition[customerTrialPendingDataSet[i][0]] =
				customerTrialPendingDataSet[i][9];
			customer_trial_pending_lpo_ho_generated[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][10];
			customer_trial_pending_lpo_ap_customer[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][11];
			customer_trial_pending_lpo_inbound_web[
				customerTrialPendingDataSet[i][0]
			] = customerTrialPendingDataSet[i][12];
			customer_trial_pending_ho_generated[customerTrialPendingDataSet[i][0]] =
				customerTrialPendingDataSet[i][13];
		}

		var series_trial_pending_data30 = [];
		var series_trial_pending_data31 = [];
		var series_trial_pending_data32 = [];
		var series_trial_pending_data33 = [];
		var series_trial_pending_data34 = [];
		var series_trial_pending_data35 = [];
		var series_trial_pending_data36 = [];
		var series_trial_pending_data37 = [];
		var series_trial_pending_data38 = [];
		var series_trial_pending_data39 = [];
		var series_trial_pending_data30a = [];
		var series_trial_pending_data31a = [];
		var series_trial_pending_data32a = [];
		var series_trial_pending_data33a = [];

		var categores_customer_trial_pending_week = []; // creating empty array for highcharts
		// categories
		Object.keys(customer_trial_pending_total_source_countcount).map(function (
			item,
			key
		) {
			console.log(item);
			series_trial_pending_data30.push(
				parseInt(customer_trial_pending_source_zee_generatedcount[item])
			);
			series_trial_pending_data31.push(
				parseInt(customer_trial_pending_source_callcount[item])
			);
			series_trial_pending_data32.push(
				parseInt(customer_trial_pending_source_field_salescount[item])
			);
			series_trial_pending_data33.push(
				parseInt(customer_trial_pending_source_websitecount[item])
			);
			series_trial_pending_data34.push(
				parseInt(customer_trial_pending_total_source_countcount[item])
			);
			series_trial_pending_data35.push(
				parseInt(customer_trial_pending_source_additional_services[item])
			);
			series_trial_pending_data36.push(
				parseInt(customer_trial_pending_source_legal_campaign[item])
			);
			series_trial_pending_data37.push(
				parseInt(customer_trial_pending_other_source[item])
			);
			series_trial_pending_data38.push(
				parseInt(customer_trial_pending_future_plus[item])
			);
			series_trial_pending_data39.push(
				parseInt(customer_trial_pending_lpo_transition[item])
			);
			series_trial_pending_data30a.push(
				parseInt(customer_trial_pending_lpo_ho_generated[item])
			);
			series_trial_pending_data31a.push(
				parseInt(customer_trial_pending_lpo_ap_customer[item])
			);
			series_trial_pending_data32a.push(
				parseInt(customer_trial_pending_lpo_inbound_web[item])
			);
			series_trial_pending_data33a.push(
				parseInt(customer_trial_pending_ho_generated[item])
			);
			categores_customer_trial_pending_week.push(item);
		});
		console.log("series_trial_pending_data37: " + series_trial_pending_data37);

		plotChartTrialPendingCustomerSigned(
			series_trial_pending_data30,
			series_trial_pending_data31,
			series_trial_pending_data32,
			series_trial_pending_data33,
			series_trial_pending_data34,
			series_trial_pending_data35,
			series_trial_pending_data36,
			series_trial_pending_data37,
			categores_customer_trial_pending_week,
			series_trial_pending_data38,
			series_trial_pending_data39,
			series_trial_pending_data30a,
			series_trial_pending_data31a,
			series_trial_pending_data32a,
			series_trial_pending_data33a
		);

		if (role == 1000) {
			// Sales Dashbaord - Leads - Prospect - Monthly Reporting
			var prospectWeeklyReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__8",
			});
		} else {
			// Sales Dashboard - Leads - Prospect - Weekly Reporting
			var prospectWeeklyReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_2",
			});
		}

		prospectWeeklyReportingSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			prospectWeeklyReportingSearch.filters.push(
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
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			prospectWeeklyReportingSearch.filters.push(
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
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			prospectWeeklyReportingSearch.filters.push(
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
			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			prospectWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			prospectWeeklyReportingSearch.filters.push(
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
			var defaultSearchFilters = prospectWeeklyReportingSearch.filterExpression;

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

			prospectWeeklyReportingSearch.filterExpression = defaultSearchFilters;
		}

		var count2 = 0;
		var oldDate2 = null;

		total_prospect_count = 0;
		prospecy_quote_sent = 0;
		prospect_no_answer = 0;
		prospect_in_contact = 0;
		var prospect_opportunity = 0;
		var prospect_qualified = 0;

		prospectWeeklyReportingSearch
			.run()
			.each(function (prospectWeeklyReportingSearchResultSet) {
				var prospectCount = parseInt(
					prospectWeeklyReportingSearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered = prospectWeeklyReportingSearchResultSet.getValue({
					name: "formuladate",
					summary: "GROUP",
				});
				var custStatus = parseInt(
					prospectWeeklyReportingSearchResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					})
				);
				var custStatusText = prospectWeeklyReportingSearchResultSet.getText({
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

				if (count2 == 0) {
					if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += parseInt(prospectCount);
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += parseInt(prospectCount);
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - QUALIFIED
						prospect_qualified += parseInt(prospectCount);
					}

					total_prospect_count =
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						prospect_opportunity +
						prospect_qualified;
				} else if (oldDate2 != null && oldDate2 == startDate) {
					if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += prospectCount;
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += prospectCount;
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += prospectCount;
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - OPPORTUNITY
						prospect_qualified += parseInt(prospectCount);
					}

					total_prospect_count =
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						prospect_opportunity +
						prospect_qualified;
				} else if (oldDate2 != null && oldDate2 != startDate) {
					debt_set4.push({
						dateUsed: oldDate2,
						prospecy_quote_sent: prospecy_quote_sent,
						prospect_no_answer: prospect_no_answer,
						prospect_in_contact: prospect_in_contact,
						prospect_opportunity: prospect_opportunity,
						total_prospect_count: total_prospect_count,
						prospect_qualified: prospect_qualified,
					});

					total_prospect_count = 0;
					prospecy_quote_sent = 0;
					prospect_no_answer = 0;
					prospect_in_contact = 0;
					prospect_opportunity = 0;
					prospect_qualified = 0;

					total_leads = 0;

					if (custStatus == 50) {
						//PROSPECT - QUOTE SENT
						prospecy_quote_sent += parseInt(prospectCount);
					} else if (custStatus == 35) {
						//PROSPECT - NO ANSWER
						prospect_no_answer += parseInt(prospectCount);
					} else if (custStatus == 8) {
						//PROSPECT - IN CONTACT
						prospect_in_contact += parseInt(prospectCount);
					} else if (custStatus == 58) {
						//PROSPECT - OPPORTUNITY
						prospect_opportunity += parseInt(prospectCount);
					} else if (custStatus == 70) {
						//PROSPECT - OPPORTUNITY
						prospect_qualified += parseInt(prospectCount);
					}

					total_prospect_count =
						prospecy_quote_sent +
						prospect_no_answer +
						prospect_in_contact +
						prospect_opportunity +
						prospect_qualified;
				}

				count2++;
				oldDate2 = startDate;
				return true;
			});

		if (count2 > 0) {
			debt_set4.push({
				dateUsed: oldDate2,
				prospecy_quote_sent: prospecy_quote_sent,
				prospect_no_answer: prospect_no_answer,
				prospect_in_contact: prospect_in_contact,
				prospect_opportunity: prospect_opportunity,
				total_prospect_count: total_prospect_count,
				prospect_qualified: prospect_qualified,
			});
		}

		previewDataSet2 = [];
		csvPreviewSet2 = [];

		if (!isNullorEmpty(debt_set4)) {
			debt_set4.forEach(function (preview_row, index) {
				previewDataSet2.push([
					preview_row.dateUsed,
					preview_row.prospecy_quote_sent,
					preview_row.prospect_no_answer,
					preview_row.prospect_in_contact,
					preview_row.prospect_opportunity,
					preview_row.total_prospect_count,
					preview_row.prospect_qualified,
				]);
			});
		}

		var month_year = []; // creating array for storing browse

		var prospecy_quote_sent = [];
		var prospect_no_answer = [];
		var prospect_in_contact = [];
		var prospect_opportunity = [];
		var total_prospects_leads = [];
		var prospect_qualified = [];

		for (var i = 0; i < previewDataSet2.length; i++) {
			month_year.push(previewDataSet2[i][0]);
			prospecy_quote_sent[previewDataSet2[i][0]] = previewDataSet2[i][1];
			prospect_no_answer[previewDataSet2[i][0]] = previewDataSet2[i][2];
			prospect_in_contact[previewDataSet2[i][0]] = previewDataSet2[i][3];
			prospect_opportunity[previewDataSet2[i][0]] = previewDataSet2[i][4];
			total_prospects_leads[previewDataSet2[i][0]] = previewDataSet2[i][5];
			prospect_qualified[previewDataSet2[i][0]] = previewDataSet2[i][6];
		}

		var series_data40 = [];
		var series_data41 = [];
		var series_data42 = [];
		var series_data43 = [];
		var series_data44 = [];
		var series_data45 = [];

		var categores5 = []; // creating empty array for highcharts
		// categories
		Object.keys(prospecy_quote_sent).map(function (item, key) {
			series_data40.push(parseInt(prospecy_quote_sent[item]));
			series_data41.push(parseInt(prospect_no_answer[item]));
			series_data42.push(parseInt(prospect_in_contact[item]));
			series_data43.push(parseInt(total_prospects_leads[item]));
			series_data44.push(parseInt(prospect_opportunity[item]));
			series_data45.push(parseInt(prospect_qualified[item]));
			categores5.push(item);
		});

		plotChartProspects(
			series_data40,
			series_data41,
			series_data42,
			series_data43,
			series_data44,
			categores5,
			series_data45
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Prospect Quote Sent - Monthly Reporting
			var prospectOpportunityWeeklyReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__9",
			});
		} else {
			// Sales Dashboard - Leads - Prospect Quote Sent - Weekly Reporting
			var prospectOpportunityWeeklyReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__3",
			});
		}

		prospectOpportunityWeeklyReportingSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
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
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			prospectOpportunityWeeklyReportingSearch.filters.push(
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
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			prospectOpportunityWeeklyReportingSearch.filters.push(
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
			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			prospectOpportunityWeeklyReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			prospectOpportunityWeeklyReportingSearch.filters.push(
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
				prospectOpportunityWeeklyReportingSearch.filterExpression;

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

			prospectOpportunityWeeklyReportingSearch.filterExpression =
				defaultSearchFilters;
		}

		var count2 = 0;
		var oldDate2 = null;

		total_prospect_count = 0;
		prospecy_quote_sent = 0;
		prospect_no_answer = 0;
		prospect_in_contact = 0;
		var prospect_opportunity = 0;

		prospectOpportunityWeeklyReportingSearch
			.run()
			.each(function (prospectOpportunityWeeklyReportingSearchResultSet) {
				var prospectCount = parseInt(
					prospectOpportunityWeeklyReportingSearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					prospectOpportunityWeeklyReportingSearchResultSet.getValue({
						name: "formuladate",
						summary: "GROUP",
					});
				var custStatus = parseInt(
					prospectOpportunityWeeklyReportingSearchResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					})
				);
				var custStatusText =
					prospectOpportunityWeeklyReportingSearchResultSet.getText({
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

				debt_set6.push({
					dateUsed: startDate,
					prospect_quote: prospectCount,
					total_prospect_count: prospectCount,
				});

				return true;
			});

		previewDataSet2 = [];
		csvPreviewSet2 = [];

		console.log("debt_set6: " + debt_set6);

		if (!isNullorEmpty(debt_set6)) {
			debt_set6.forEach(function (preview_row, index) {
				previewDataSet2.push([
					preview_row.dateUsed,
					preview_row.prospect_quote,
					preview_row.total_prospect_count,
				]);
			});
		}

		console.log("previewDataSet2: " + previewDataSet2);

		var month_year = []; // creating array for storing browse

		var prospect_quote = [];
		var total_prospects_leads = [];

		for (var i = 0; i < previewDataSet2.length; i++) {
			month_year.push(previewDataSet2[i][0]);
			prospect_quote[previewDataSet2[i][0]] = previewDataSet2[i][1];
			total_prospects_leads[previewDataSet2[i][0]] = previewDataSet2[i][2];
		}

		var series_data143 = [];
		var series_data144 = [];

		var categores5 = []; // creating empty array for highcharts
		// categories
		Object.keys(prospect_quote).map(function (item, key) {
			series_data143.push(parseInt(total_prospects_leads[item]));
			series_data144.push(parseInt(prospect_quote[item]));
			categores5.push(item);
		});

		plotChartProspectsQuotes(series_data143, series_data144, categores5);

		//!
		// Sales Dashboard - Leads - Prospect Box Sent - Weekly Reporting
		// var prospectBoxSentWeeklyReportingSearch = search.load({
		// 	type: "customer",
		// 	id: "customsearch_leads_reporting_weekly_2_21",
		// });

		// prospectBoxSentWeeklyReportingSearch.filters.push(
		// 	search.createFilter({
		// 		name: "custrecord_salesrep",
		// 		join: "CUSTRECORD_CUSTOMER",
		// 		operator: search.Operator.NONEOF,
		// 		values: [109783],
		// 	})
		// );

		// if (customer_type == "2") {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "companyname",
		// 			join: null,
		// 			operator: search.Operator.DOESNOTSTARTWITH,
		// 			values: "TEST",
		// 		})
		// 	);
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "companyname",
		// 			join: null,
		// 			operator: search.Operator.DOESNOTCONTAIN,
		// 			values: "- Parent",
		// 		})
		// 	);
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "companyname",
		// 			join: null,
		// 			operator: search.Operator.DOESNOTSTARTWITH,
		// 			values: "Shippit Pty Ltd ",
		// 		})
		// 	);
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "companyname",
		// 			join: null,
		// 			operator: search.Operator.DOESNOTSTARTWITH,
		// 			values: "Sendle",
		// 		})
		// 	);
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "companyname",
		// 			join: null,
		// 			operator: search.Operator.DOESNOTSTARTWITH,
		// 			values: "SC -",
		// 		})
		// 	);
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_np_np_customer",
		// 			join: null,
		// 			operator: search.Operator.ANYOF,
		// 			values: "@NONE@",
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(leadStatus)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "entitystatus",
		// 			join: null,
		// 			operator: search.Operator.IS,
		// 			values: leadStatus,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_date_lead_entered",
		// 			join: null,
		// 			operator: search.Operator.ONORAFTER,
		// 			values: date_from,
		// 		})
		// 	);

		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_date_lead_entered",
		// 			join: null,
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: date_to,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(lead_source)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "leadsource",
		// 			join: null,
		// 			operator: search.Operator.IS,
		// 			values: lead_source,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(sales_rep)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_sales_assigned",
		// 			join: "custrecord_sales_customer",
		// 			operator: search.Operator.IS,
		// 			values: sales_rep,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(lead_entered_by)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_lead_entered_by",
		// 			join: null,
		// 			operator: search.Operator.IS,
		// 			values: lead_entered_by,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(sales_campaign)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_sales_campaign",
		// 			join: "custrecord_sales_customer",
		// 			operator: search.Operator.ANYOF,
		// 			values: sales_campaign,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(parent_lpo)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "internalid",
		// 			join: "custentity_lpo_parent_account",
		// 			operator: search.Operator.ANYOF,
		// 			values: parent_lpo,
		// 		})
		// 	);
		// }

		// if (
		// 	!isNullorEmpty(date_quote_sent_from) &&
		// 	!isNullorEmpty(date_quote_sent_to)
		// ) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_date_lead_quote_sent",
		// 			join: null,
		// 			operator: search.Operator.ONORAFTER,
		// 			values: date_quote_sent_from,
		// 		})
		// 	);

		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_date_lead_quote_sent",
		// 			join: null,
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: date_quote_sent_to,
		// 		})
		// 	);
		// }

		// if (
		// 	!isNullorEmpty(date_signed_up_from) &&
		// 	!isNullorEmpty(date_signed_up_to)
		// ) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_comm_date_signup",
		// 			join: "CUSTRECORD_CUSTOMER",
		// 			operator: search.Operator.ONORAFTER,
		// 			values: date_signed_up_from,
		// 		})
		// 	);

		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_comm_date_signup",
		// 			join: "CUSTRECORD_CUSTOMER",
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: date_signed_up_to,
		// 		})
		// 	);
		// }

		// if (
		// 	!isNullorEmpty(commencement_start_date) &&
		// 	!isNullorEmpty(commencement_last_date)
		// ) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_comm_date",
		// 			join: "CUSTRECORD_CUSTOMER",
		// 			operator: search.Operator.ONORAFTER,
		// 			values: commencement_start_date,
		// 		})
		// 	);

		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_comm_date",
		// 			join: "CUSTRECORD_CUSTOMER",
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: commencement_last_date,
		// 		})
		// 	);
		// }

		// if (
		// 	!isNullorEmpty(cancelled_start_date) &&
		// 	!isNullorEmpty(cancelled_last_date)
		// ) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity13",
		// 			join: null,
		// 			operator: search.Operator.ONORAFTER,
		// 			values: cancelled_start_date,
		// 		})
		// 	);

		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity13",
		// 			join: null,
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: cancelled_last_date,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(zee_id)) {
		// 	prospectBoxSentWeeklyReportingSearch.filters.push(
		// 		search.createFilter({
		// 			name: "partner",
		// 			join: null,
		// 			operator: search.Operator.IS,
		// 			values: zee_id,
		// 		})
		// 	);
		// }

		// if (
		// 	!isNullorEmpty(modified_date_from) &&
		// 	!isNullorEmpty(modified_date_to)
		// ) {
		// 	var defaultSearchFilters =
		// 		prospectBoxSentWeeklyReportingSearch.filterExpression;

		// 	console.log(
		// 		"default search filters: " + JSON.stringify(defaultSearchFilters)
		// 	);

		// 	var modifiedDateFilters = [
		// 		[
		// 			["activity.date", "within", [modified_date_from, modified_date_to]],
		// 			"AND",
		// 			[
		// 				"activity.custevent_organiser",
		// 				"anyof",
		// 				"1623053",
		// 				"668712",
		// 				"1797389",
		// 				"1809334",
		// 				"690145",
		// 				"1771076",
		// 				"1813424",
		// 				"696160",
		// 				"668711",
		// 				"1809382",
		// 				"653718",
		// 				"1777309",
		// 				"1819701",
		// 				"1820151",
		// 				"1822089",
		// 			],
		// 		],
		// 		"AND",
		// 		[
		// 			[
		// 				"usernotes.notedate",
		// 				"within",
		// 				[modified_date_from, modified_date_to],
		// 			],
		// 			"AND",
		// 			[
		// 				"usernotes.author",
		// 				"anyof",
		// 				"anyof",
		// 				"1623053",
		// 				"668712",
		// 				"1797389",
		// 				"1809334",
		// 				"690145",
		// 				"1771076",
		// 				"1813424",
		// 				"696160",
		// 				"668711",
		// 				"1809382",
		// 				"653718",
		// 				"1777309",
		// 				"1819701",
		// 				"1820151",
		// 				"1822089",
		// 			],
		// 		],
		// 	];
		// 	console.log(
		// 		"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
		// 	);

		// 	defaultSearchFilters.push("AND");
		// 	defaultSearchFilters.push(modifiedDateFilters);

		// 	console.log(
		// 		"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
		// 	);

		// 	prospectBoxSentWeeklyReportingSearch.filterExpression =
		// 		defaultSearchFilters;
		// }

		// var count2 = 0;
		// var oldDate2 = null;

		// total_prospect_count = 0;
		// prospecy_quote_sent = 0;
		// prospect_no_answer = 0;
		// prospect_in_contact = 0;
		// var prospect_opportunity = 0;

		// prospectBoxSentWeeklyReportingSearch
		// 	.run()
		// 	.each(function (prospectBoxSentWeeklyReportingSearchResultSet) {
		// 		var prospectCount = parseInt(
		// 			prospectBoxSentWeeklyReportingSearchResultSet.getValue({
		// 				name: "internalid",
		// 				summary: "COUNT",
		// 			})
		// 		);
		// 		var weekLeadEntered =
		// 			prospectBoxSentWeeklyReportingSearchResultSet.getValue({
		// 				name: "formuladate",
		// 				summary: "GROUP",
		// 			});
		// 		var custStatus = parseInt(
		// 			prospectBoxSentWeeklyReportingSearchResultSet.getValue({
		// 				name: "entitystatus",
		// 				summary: "GROUP",
		// 			})
		// 		);
		// 		var custStatusText =
		// 			prospectBoxSentWeeklyReportingSearchResultSet.getText({
		// 				name: "entitystatus",
		// 				summary: "GROUP",
		// 			});

		// 		if (role == 1000) {
		// 			var startDate = weekLeadEntered;
		// 		} else {
		// 			if (!isNullorEmpty(weekLeadEntered)) {
		// 				var splitMonthV2 = weekLeadEntered.split("/");

		// 				var formattedDate = dateISOToNetsuite(
		// 					splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
		// 				);

		// 				var firstDay = new Date(
		// 					splitMonthV2[0],
		// 					splitMonthV2[1],
		// 					1
		// 				).getDate();
		// 				var lastDay = new Date(
		// 					splitMonthV2[0],
		// 					splitMonthV2[1],
		// 					0
		// 				).getDate();

		// 				if (firstDay < 10) {
		// 					firstDay = "0" + firstDay;
		// 				}

		// 				// var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
		// 				var startDate =
		// 					splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
		// 				var monthsStartDate =
		// 					splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
		// 				// var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
		// 				var lastDate =
		// 					splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
		// 			} else {
		// 				var startDate = "NO DATE";
		// 			}
		// 		}

		// 		debt_set7.push({
		// 			dateUsed: startDate,
		// 			prospect_quote: prospectCount,
		// 			total_prospect_count: prospectCount,
		// 		});

		// 		return true;
		// 	});

		// previewDataSetBoxSent = [];
		// csvPreviewSet2 = [];

		// console.log("debt_set7: " + debt_set7);

		// if (!isNullorEmpty(debt_set7)) {
		// 	debt_set7.forEach(function (preview_row, index) {
		// 		previewDataSetBoxSent.push([
		// 			preview_row.dateUsed,
		// 			preview_row.prospect_quote,
		// 			preview_row.total_prospect_count,
		// 		]);
		// 	});
		// }

		// console.log("previewDataSetBoxSent: " + previewDataSetBoxSent);

		// var month_year = []; // creating array for storing browse

		// var prospect_box_sent = [];
		// var total_prospects_box_sent_leads = [];

		// for (var i = 0; i < previewDataSetBoxSent.length; i++) {
		// 	month_year.push(previewDataSetBoxSent[i][0]);
		// 	prospect_box_sent[previewDataSetBoxSent[i][0]] =
		// 		previewDataSetBoxSent[i][1];
		// 	total_prospects_box_sent_leads[previewDataSetBoxSent[i][0]] =
		// 		previewDataSetBoxSent[i][2];
		// }

		// var series_data_box_sent143 = [];
		// var series_data_box_sent144 = [];

		// var categores_box_sent5 = []; // creating empty array for highcharts
		// // categories
		// Object.keys(prospect_box_sent).map(function (item, key) {
		// 	series_data_box_sent143.push(
		// 		parseInt(total_prospects_box_sent_leads[item])
		// 	);
		// 	series_data_box_sent144.push(parseInt(prospect_box_sent[item]));
		// 	categores_box_sent5.push(item);
		// });

		// plotChartProspectsBoxSent(
		// 	series_data_box_sent143,
		// 	series_data_box_sent144,
		// 	categores_box_sent5
		// );

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects - Monthly Reporting
			var suspectsListBySalesRepWeeklySearch = search.load({
				type: "lead",
				id: "customsearch_leads_reporting_weekly_2_10",
			});
		} else {
			// Sales Dashboard - Leads - Suspects - Weekly Reporting
			var suspectsListBySalesRepWeeklySearch = search.load({
				type: "lead",
				id: "customsearch_leads_reporting_weekly_2__2",
			});
		}

		if (customer_type == "2") {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsListBySalesRepWeeklySearch.filters.push(
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
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsListBySalesRepWeeklySearch.filters.push(
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
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsListBySalesRepWeeklySearch.filterExpression;

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

			suspectsListBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		total_customer_signed = 0;
		var countSuspects = 0;
		var oldSuspectsWeekLeadEntered = null;

		var total_suspect_count = 0;
		var suspect_new_count = 0;
		var suspect_hot_lead_count = 0;
		var suspect_reassign_count = 0;
		var suspect_qualified_count = 0;
		var suspect_unqualified_count = 0;

		suspectsListBySalesRepWeeklySearch
			.run()
			.each(function (suspectsListBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsListBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsListBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus = suspectsListBySalesRepWeeklySearchResultSet.getValue({
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
						var startDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
						var monthsStartDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
						var lastDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
					} else {
						var startDate = "NO DATE";
					}
				}

				if (countSuspects == 0) {
					if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead_count += parseInt(customerCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign_count += parseInt(customerCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new_count += parseInt(customerCount);
					}
					total_suspect_count =
						suspect_hot_lead_count + suspect_reassign_count + suspect_new_count;
				} else if (
					oldSuspectsWeekLeadEntered != null &&
					oldSuspectsWeekLeadEntered == startDate
				) {
					if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead_count += parseInt(customerCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign_count += parseInt(customerCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new_count += parseInt(customerCount);
					}

					total_suspect_count =
						suspect_hot_lead_count + suspect_reassign_count + suspect_new_count;
				} else if (
					oldSuspectsWeekLeadEntered != null &&
					oldSuspectsWeekLeadEntered != startDate
				) {
					debt_set5.push({
						dateUsed: oldSuspectsWeekLeadEntered,
						suspect_new_count: suspect_new_count,
						suspect_hot_lead_count: suspect_hot_lead_count,
						suspect_reassign_count: suspect_reassign_count,
						total_suspect_count: total_suspect_count,
					});

					total_suspect_count = 0;
					suspect_new_count = 0;
					suspect_hot_lead_count = 0;
					suspect_reassign_count = 0;

					total_leads = 0;

					if (custStatus == 57) {
						//SUSPECT - HOT LEAD
						suspect_hot_lead_count += parseInt(customerCount);
					} else if (custStatus == 60 || custStatus == 40) {
						//SUSPECT - REP REASSIGN
						suspect_reassign_count += parseInt(customerCount);
					} else if (custStatus == 6) {
						//SUSPECT - NEW
						suspect_new_count += parseInt(customerCount);
					}

					total_suspect_count =
						suspect_hot_lead_count + suspect_reassign_count + suspect_new_count;
				}

				oldSuspectsWeekLeadEntered = startDate;
				countSuspects++;
				return true;
			});

		if (countSuspects > 0) {
			debt_set5.push({
				dateUsed: oldSuspectsWeekLeadEntered,
				suspect_new_count: suspect_new_count,
				suspect_hot_lead_count: suspect_hot_lead_count,
				suspect_reassign_count: suspect_reassign_count,
				total_suspect_count: total_suspect_count,
			});
		}

		console.log("debt_set5: " + debt_set5);
		var suspectsChartDatSet = [];
		if (!isNullorEmpty(debt_set5)) {
			debt_set5.forEach(function (preview_row, index) {
				suspectsChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_new_count,
					preview_row.suspect_hot_lead_count,
					preview_row.suspect_reassign_count,
					preview_row.total_suspect_count,
				]);
			});
		}

		console.log("SUSPECTS LEADS GRAPH DATA: " + suspectsChartDatSet);

		var month_year_suspects = []; // creating array for storing browser
		var suspects_new_count = [];
		var suspects_hot_lead_count = [];
		var suspects_reassign_count = [];
		var suspects_total_count = [];

		for (var i = 0; i < suspectsChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsChartDatSet[i][0])) {
				month_year_suspects.push(suspectsChartDatSet[i][0]);
				suspects_new_count[suspectsChartDatSet[i][0]] =
					suspectsChartDatSet[i][1];
				suspects_hot_lead_count[suspectsChartDatSet[i][0]] =
					suspectsChartDatSet[i][2];
				suspects_reassign_count[suspectsChartDatSet[i][0]] =
					suspectsChartDatSet[i][3];
				suspects_total_count[suspectsChartDatSet[i][0]] =
					suspectsChartDatSet[i][4];
			}
		}

		var series_data50 = [];
		var series_data51 = [];
		var series_data52 = [];
		var series_data53 = [];

		var categores_suspects = []; // creating empty array for highcharts
		// categories
		Object.keys(suspects_hot_lead_count).map(function (item, key) {
			series_data50.push(parseInt(suspects_new_count[item]));
			series_data51.push(parseInt(suspects_hot_lead_count[item]));
			series_data52.push(parseInt(suspects_reassign_count[item]));
			series_data53.push(parseInt(suspects_total_count[item]));
			categores_suspects.push(item);
		});

		plotChartSuspects(
			series_data50,
			series_data50,
			series_data51,
			series_data52,
			series_data53,
			categores_suspects
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects Lost - Monthly Reporting
			var suspectsLostBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_11",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Lost - Weekly Reporting
			var suspectsLostBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__4",
			});
		}

		if (customer_type == "2") {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsListBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsLostBySalesRepWeeklySearch.filters.push(
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
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsLostBySalesRepWeeklySearch.filters.push(
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
			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsLostBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsLostBySalesRepWeeklySearch.filterExpression;

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

			suspectsLostBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		total_customer_signed = 0;
		var countSuspectsLost = 0;
		var oldSuspectsLostWeekLeadEntered = null;

		var total_suspect_lost_count = 0;
		var suspect_lost_count = 0;
		var suspect_customer_lost_count = 0;

		suspectsLostBySalesRepWeeklySearch
			.run()
			.each(function (suspectsLostBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsLostBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsLostBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus = suspectsLostBySalesRepWeeklySearchResultSet.getValue({
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

				if (countSuspectsLost == 0) {
					if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost_count += parseInt(customerCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER LOST
						suspect_customer_lost_count += parseInt(customerCount);
					}

					total_suspect_lost_count =
						suspect_lost_count + suspect_customer_lost_count;
				} else if (
					oldSuspectsLostWeekLeadEntered != null &&
					oldSuspectsLostWeekLeadEntered == startDate
				) {
					if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost_count += parseInt(customerCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER LOST
						suspect_customer_lost_count += parseInt(customerCount);
					}

					total_suspect_lost_count =
						suspect_lost_count + suspect_customer_lost_count;
				} else if (
					oldSuspectsLostWeekLeadEntered != null &&
					oldSuspectsLostWeekLeadEntered != startDate
				) {
					debt_setSuspectsLost.push({
						dateUsed: oldSuspectsLostWeekLeadEntered,
						suspect_lost_count: suspect_lost_count,
						suspect_customer_lost_count: suspect_customer_lost_count,
						total_suspect_lost_count: total_suspect_lost_count,
					});

					suspect_lost_count = 0;
					suspect_customer_lost_count = 0;
					total_suspect_lost_count = 0;

					if (custStatus == 59) {
						//SUSPECT - LOST
						suspect_lost_count += parseInt(customerCount);
					} else if (custStatus == 22) {
						//SUSPECT - CUSTOMER LOST
						suspect_customer_lost_count += parseInt(customerCount);
					}

					total_suspect_lost_count =
						suspect_lost_count + suspect_customer_lost_count;
				}

				oldSuspectsLostWeekLeadEntered = startDate;
				countSuspectsLost++;
				return true;
			});

		if (countSuspectsLost > 0) {
			debt_setSuspectsLost.push({
				dateUsed: oldSuspectsLostWeekLeadEntered,
				suspect_lost_count: suspect_lost_count,
				suspect_customer_lost_count: suspect_customer_lost_count,
				total_suspect_lost_count: total_suspect_lost_count,
			});
		}

		var suspectsLostChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsLost)) {
			debt_setSuspectsLost.forEach(function (preview_row, index) {
				suspectsLostChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_lost_count,
					preview_row.suspect_customer_lost_count,
					preview_row.total_suspect_lost_count,
				]);
			});
		}

		console.log("SUSPECTS LOST GRAPH DATA: " + suspectsLostChartDatSet);

		var month_year_suspects_lost = []; // creating array for storing browser
		var suspects_lost = [];
		var suspects_customer_lost = [];
		var suspects_lost_total_count = [];

		for (var i = 0; i < suspectsLostChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsLostChartDatSet[i][0])) {
				month_year_suspects_lost.push(suspectsLostChartDatSet[i][0]);
				suspects_lost[suspectsLostChartDatSet[i][0]] =
					suspectsLostChartDatSet[i][1];
				suspects_customer_lost[suspectsLostChartDatSet[i][0]] =
					suspectsLostChartDatSet[i][2];
				suspects_lost_total_count[suspectsLostChartDatSet[i][0]] =
					suspectsLostChartDatSet[i][3];
			}
		}

		var series_data60 = [];
		var series_data61 = [];
		var series_data62 = [];

		var categores_suspects_lost = []; // creating empty array for highcharts
		// categories
		Object.keys(suspects_lost).map(function (item, key) {
			series_data60.push(parseInt(suspects_lost[item]));
			series_data61.push(parseInt(suspects_customer_lost[item]));
			series_data62.push(parseInt(suspects_lost_total_count[item]));
			categores_suspects_lost.push(item);
		});

		plotChartSuspectsLost(
			series_data60,
			series_data61,
			series_data62,
			categores_suspects_lost
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects Parking Lot - Monthly Reporting
			var suspectsOffPeakPipelineBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_12",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Parking Lot - Weekly Reporting
			var suspectsOffPeakPipelineBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__5",
			});
		}

		if (customer_type == "2") {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
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
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
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
			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsOffPeakPipelineBySalesRepWeeklySearch.filterExpression;

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

			suspectsOffPeakPipelineBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		suspectsOffPeakPipelineBySalesRepWeeklySearch
			.run()
			.each(function (suspectsLostBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsLostBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsLostBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus = suspectsLostBySalesRepWeeklySearchResultSet.getValue({
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

						var startDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
						var monthsStartDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
						var lastDate =
							splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
					} else {
						var startDate = "NO DATE";
					}
				}

				debt_setSuspectsOffPeakPipeline.push({
					dateUsed: startDate,
					suspect_off_peak_pipeline_count: customerCount,
				});

				return true;
			});

		var suspectsOffPeakPipelineChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsOffPeakPipeline)) {
			debt_setSuspectsOffPeakPipeline.forEach(function (preview_row, index) {
				suspectsOffPeakPipelineChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_off_peak_pipeline_count,
				]);
			});
		}

		console.log(
			"SUSPECTS OFF PEAK PIPELINE GRAPH DATA: " +
			suspectsOffPeakPipelineChartDatSet
		);

		var month_year_suspects_off_peak_pipeline = []; // creating array for storing browser
		var suspect_off_peak_pipeline_count = [];

		for (var i = 0; i < suspectsOffPeakPipelineChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsOffPeakPipelineChartDatSet[i][0])) {
				month_year_suspects_off_peak_pipeline.push(
					suspectsOffPeakPipelineChartDatSet[i][0]
				);
				suspect_off_peak_pipeline_count[
					suspectsOffPeakPipelineChartDatSet[i][0]
				] = suspectsOffPeakPipelineChartDatSet[i][1];
			}
		}

		var series_data70 = [];
		var series_data71 = [];

		var categores_suspects_off_peak_pipeline = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_off_peak_pipeline_count).map(function (item, key) {
			series_data70.push(parseInt(suspect_off_peak_pipeline_count[item]));
			categores_suspects_off_peak_pipeline.push(item);
		});

		plotChartSuspectsOffPeakPipeline(series_data70, categores_suspects_lost);

		if (role == 1000) {
			// Search Name: Sales Dashboard - Leads - Suspects Out of Territory - Monthly Reporting
			var suspectsOOTBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_13",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Out of Territory - Weekly Reporting
			var suspectsOOTBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__6",
			});
		}

		if (customer_type == "2") {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsOOTBySalesRepWeeklySearch.filters.push(
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
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsOOTBySalesRepWeeklySearch.filters.push(
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
			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsOOTBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsOOTBySalesRepWeeklySearch.filterExpression;

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

			suspectsOOTBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;
		}

		suspectsOOTBySalesRepWeeklySearch
			.run()
			.each(function (suspectsOOTBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsOOTBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsOOTBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus = suspectsOOTBySalesRepWeeklySearchResultSet.getValue({
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

				debt_setSuspectsOOT.push({
					dateUsed: startDate,
					suspect_oot_count: customerCount,
				});

				return true;
			});

		var suspectsOOTChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsOOT)) {
			debt_setSuspectsOOT.forEach(function (preview_row, index) {
				suspectsOOTChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_oot_count,
				]);
			});
		}

		console.log("SUSPECTS OOT GRAPH DATA: " + suspectsOOTChartDatSet);

		var month_year_suspects_oot = []; // creating array for storing browser
		var suspect_oot_count = [];

		for (var i = 0; i < suspectsOOTChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsOOTChartDatSet[i][0])) {
				month_year_suspects_oot.push(suspectsOOTChartDatSet[i][0]);
				suspect_oot_count[suspectsOOTChartDatSet[i][0]] =
					suspectsOOTChartDatSet[i][1];
			}
		}

		var series_data80 = [];
		var series_data81 = [];

		var categores_suspects_oot = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_oot_count).map(function (item, key) {
			series_data80.push(parseInt(suspect_oot_count[item]));
			categores_suspects_oot.push(item);
		});

		plotChartSuspectsOOT(series_data80, categores_suspects_oot);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects Qualified - Monthly Reporting
			var suspectsQualifiedSalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_suspect_quali_monthly",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Qualified - Weekly Reporting
			var suspectsQualifiedSalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_suspect_quali_weekly",
			});
		}

		if (customer_type == "2") {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
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
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsQualifiedSalesRepWeeklySearch.filters.push(
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
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsQualifiedSalesRepWeeklySearch.filters.push(
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
			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsQualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsQualifiedSalesRepWeeklySearch.filterExpression;

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

			suspectsQualifiedSalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		suspectsQualifiedSalesRepWeeklySearch
			.run()
			.each(function (suspectsQualifiedSalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsQualifiedSalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsQualifiedSalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus =
					suspectsQualifiedSalesRepWeeklySearchResultSet.getValue({
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

				debt_setSuspectsQualified.push({
					dateUsed: startDate,
					suspect_qualified_count: customerCount,
				});

				return true;
			});

		var suspectsQualifiedChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsQualified)) {
			debt_setSuspectsQualified.forEach(function (preview_row, index) {
				suspectsQualifiedChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_qualified_count,
				]);
			});
		}

		console.log(
			"SUSPECTS Follow Up GRAPH DATA: " + suspectsQualifiedChartDatSet
		);

		var month_year_suspects_qualified = []; // creating array for storing browser
		var suspect_qualified_count = [];

		for (var i = 0; i < suspectsQualifiedChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsQualifiedChartDatSet[i][0])) {
				month_year_suspects_qualified.push(suspectsQualifiedChartDatSet[i][0]);
				suspect_qualified_count[suspectsQualifiedChartDatSet[i][0]] =
					suspectsQualifiedChartDatSet[i][1];
			}
		}

		var series_data_qualified_1 = [];

		var categores_suspects_qualified = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_qualified_count).map(function (item, key) {
			series_data_qualified_1.push(parseInt(suspect_qualified_count[item]));
			categores_suspects_qualified.push(item);
		});

		plotChartSuspectsQualified(
			series_data_qualified_1,
			categores_suspects_qualified
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects Unqualified - Monthly Reporting
			var suspectsUnqualifiedSalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_suspect_quali_month_3",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Unqualified - Weekly Reporting
			var suspectsUnqualifiedSalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_suspect_quali_weekl_3",
			});
		}

		if (customer_type == "2") {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
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
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
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
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
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
			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsUnqualifiedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsUnqualifiedSalesRepWeeklySearch.filterExpression;

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

			suspectsQualifiedSalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		suspectsUnqualifiedSalesRepWeeklySearch
			.run()
			.each(function (ssuspectsUnqualifiedSalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					ssuspectsUnqualifiedSalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					ssuspectsUnqualifiedSalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus =
					ssuspectsUnqualifiedSalesRepWeeklySearchResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					});

				if (role == 1000) {
					var startDate = weekLeadEntered;
				} else {
					var splitMonthV2 = weekLeadEntered.split("/");

					var formattedDate = dateISOToNetsuite(
						splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
					);

					var firstDay = new Date(
						splitMonthV2[0],
						splitMonthV2[1],
						1
					).getDate();
					var lastDay = new Date(splitMonthV2[0], splitMonthV2[1], 0).getDate();

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
				}

				debt_setSuspectsUnqualified.push({
					dateUsed: startDate,
					suspect_qualified_count: customerCount,
				});

				return true;
			});

		var suspectsUnqualifiedChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsUnqualified)) {
			debt_setSuspectsUnqualified.forEach(function (preview_row, index) {
				suspectsUnqualifiedChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_qualified_count,
				]);
			});
		}

		console.log(
			"SUSPECTS Follow Up GRAPH DATA: " + suspectsUnqualifiedChartDatSet
		);

		var month_year_suspects_unqualified = []; // creating array for storing browser
		var suspect_unqualified_count = [];

		for (var i = 0; i < suspectsUnqualifiedChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsUnqualifiedChartDatSet[i][0])) {
				month_year_suspects_unqualified.push(
					suspectsUnqualifiedChartDatSet[i][0]
				);
				suspect_unqualified_count[suspectsUnqualifiedChartDatSet[i][0]] =
					suspectsUnqualifiedChartDatSet[i][1];
			}
		}

		var series_data_unqualified_1 = [];

		var categores_suspects_unqualified = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_unqualified_count).map(function (item, key) {
			series_data_unqualified_1.push(parseInt(suspect_unqualified_count[item]));
			categores_suspects_unqualified.push(item);
		});

		plotChartSuspectsUnqualified(
			series_data_unqualified_1,
			categores_suspects_unqualified
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects Validated - Monthly Reporting
			var suspectsValidatedSalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_suspect_quali_month_2",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Validated - Weekly Reporting
			var suspectsValidatedSalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_suspect_quali_weekl_2",
			});
		}

		if (customer_type == "2") {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
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
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsValidatedSalesRepWeeklySearch.filters.push(
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
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsValidatedSalesRepWeeklySearch.filters.push(
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
			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsValidatedSalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsValidatedSalesRepWeeklySearch.filterExpression;

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

			suspectsValidatedSalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		suspectsValidatedSalesRepWeeklySearch
			.run()
			.each(function (suspectsValidatedSalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsValidatedSalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsValidatedSalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus =
					suspectsValidatedSalesRepWeeklySearchResultSet.getValue({
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

				debt_setSuspectsValidated.push({
					dateUsed: startDate,
					suspect_validated_count: customerCount,
				});

				return true;
			});

		var suspectsValidatedChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsValidated)) {
			debt_setSuspectsValidated.forEach(function (preview_row, index) {
				suspectsValidatedChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_validated_count,
				]);
			});
		}

		console.log(
			"SUSPECTS Follow Up GRAPH DATA: " + suspectsValidatedChartDatSet
		);

		var month_year_suspects_validated = []; // creating array for storing browser
		var suspect_validated_count = [];

		for (var i = 0; i < suspectsValidatedChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsValidatedChartDatSet[i][0])) {
				month_year_suspects_validated.push(suspectsValidatedChartDatSet[i][0]);
				suspect_validated_count[suspectsValidatedChartDatSet[i][0]] =
					suspectsValidatedChartDatSet[i][1];
			}
		}

		var series_data_validated_1 = [];

		var categores_suspects_validated = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_validated_count).map(function (item, key) {
			series_data_validated_1.push(parseInt(suspect_validated_count[item]));
			categores_suspects_validated.push(item);
		});

		plotChartSuspectsValidated(
			series_data_validated_1,
			categores_suspects_validated
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects Follow Up - Monthly Reporting
			var suspectsFollowUpBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2_14",
			});
		} else {
			// Sales Dashboard - Leads - Suspects Follow Up - Weekly Reporting
			var suspectsFollowUpBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_weekly_2__7",
			});
		}

		if (customer_type == "2") {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
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
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
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
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
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
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsFollowUpBySalesRepWeeklySearch.filterExpression;

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

			suspectsFollowUpBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		var countSuspectFollowUp = 0;
		var oldStartDateFollowUp;
		var suspectFollowUpCount = 0;
		var suspectLPOFollowUpCount = 0;
		suspectsFollowUpBySalesRepWeeklySearch
			.run()
			.each(function (suspectsFollowUpBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsFollowUpBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsFollowUpBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus =
					suspectsFollowUpBySalesRepWeeklySearchResultSet.getValue({
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

				if (
					!isNullorEmpty(oldStartDateFollowUp) &&
					oldStartDateFollowUp != startDate
				) {
					debt_setSuspectsFollowUp.push({
						dateUsed: oldStartDateFollowUp,
						suspect_follow_up_count: suspectFollowUpCount,
						suspect_lpo_follow_up_count: suspectLPOFollowUpCount,
					});

					suspectFollowUpCount = 0;
					suspectLPOFollowUpCount = 0;
				}

				if (custStatus == 67) {
					suspectLPOFollowUpCount = customerCount;
				} else if (custStatus == 18) {
					suspectFollowUpCount = customerCount;
				}

				countSuspectFollowUp++;
				oldStartDateFollowUp = startDate;
				return true;
			});

		if (countSuspectFollowUp > 0) {
			debt_setSuspectsFollowUp.push({
				dateUsed: oldStartDateFollowUp,
				suspect_follow_up_count: suspectFollowUpCount,
				suspect_lpo_follow_up_count: suspectLPOFollowUpCount,
			});
		}

		var suspectsFollowUpChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsFollowUp)) {
			debt_setSuspectsFollowUp.forEach(function (preview_row, index) {
				suspectsFollowUpChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_follow_up_count,
					preview_row.suspect_lpo_follow_up_count,
				]);
			});
		}

		console.log(
			"SUSPECTS Follow Up GRAPH DATA: " + suspectsFollowUpChartDatSet
		);

		var month_year_suspects_follow_up = []; // creating array for storing browser
		var suspect_follow_up_count = [];
		var suspect_lpo_follow_up_count = [];

		for (var i = 0; i < suspectsFollowUpChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsFollowUpChartDatSet[i][0])) {
				month_year_suspects_follow_up.push(suspectsFollowUpChartDatSet[i][0]);
				suspect_follow_up_count[suspectsFollowUpChartDatSet[i][0]] =
					suspectsFollowUpChartDatSet[i][1];
				suspect_lpo_follow_up_count[suspectsFollowUpChartDatSet[i][0]] =
					suspectsFollowUpChartDatSet[i][2];
			}
		}

		var series_data90 = [];
		var series_data91 = [];

		var categores_suspects_follow_up = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_follow_up_count).map(function (item, key) {
			series_data90.push(parseInt(suspect_follow_up_count[item]));
			series_data91.push(parseInt(suspect_lpo_follow_up_count[item]));
			categores_suspects_follow_up.push(item);
		});

		plotChartSuspectsFollowUp(
			series_data90,
			categores_suspects_follow_up,
			series_data91
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects No Answer - Monthly Reporting
			var suspectsNoAnswerBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_suspects_no_answer_monthly",
			});
		} else {
			// Sales Dashboard - Leads - Suspects No Answer - Weekly Reporting
			var suspectsNoAnswerBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_suspects_no_answer_weekly",
			});
		}

		if (customer_type == "2") {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
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
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
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
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
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
			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsNoAnswerBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsNoAnswerBySalesRepWeeklySearch.filterExpression;

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

			suspectsNoAnswerBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		var countSuspectFollowUp = 0;
		var countSuspectNoAnswer = 0;
		suspectsNoAnswerBySalesRepWeeklySearch
			.run()
			.each(function (suspectsNoAnswerBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsNoAnswerBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsNoAnswerBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus =
					suspectsNoAnswerBySalesRepWeeklySearchResultSet.getValue({
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

				debt_setSuspectsNoAnswer.push({
					dateUsed: startDate,
					suspect_no_answer: customerCount,
				});
				countSuspectFollowUp++;
				oldStartDateFollowUp = startDate;
				return true;
			});

		var suspectsNoAnswerChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsNoAnswer)) {
			debt_setSuspectsNoAnswer.forEach(function (preview_row, index) {
				suspectsNoAnswerChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_no_answer,
				]);
			});
		}

		console.log(
			"SUSPECTS No Answer GRAPH DATA: " + suspectsNoAnswerChartDatSet
		);

		var month_year_suspects_no_answer = []; // creating array for storing browser
		var suspect_no_answer_count = [];

		for (var i = 0; i < suspectsNoAnswerChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsNoAnswerChartDatSet[i][0])) {
				month_year_suspects_no_answer.push(suspectsNoAnswerChartDatSet[i][0]);
				suspect_no_answer_count[suspectsNoAnswerChartDatSet[i][0]] =
					suspectsNoAnswerChartDatSet[i][1];
			}
		}

		var series_data200 = [];
		var series_data201 = [];

		var categores_suspects_no_answer = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_no_answer_count).map(function (item, key) {
			series_data200.push(parseInt(suspect_no_answer_count[item]));
			categores_suspects_no_answer.push(item);
		});

		plotChartSuspectsNoAnswer(
			series_data200,
			categores_suspects_no_answer,
			series_data201
		);

		if (role == 1000) {
			// Sales Dashboard - Leads - Suspects In Contact - Monthly Reporting
			var suspectsInContactBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_suspects_in_contact_monthly",
			});
		} else {
			// Sales Dashboard - Leads - Suspects In Contact - Weekly Reporting
			var suspectsInContactBySalesRepWeeklySearch = search.load({
				type: "customer",
				id: "customsearch_suspects_in_contact_weekly",
			});
		}

		if (customer_type == "2") {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			suspectsFollowUpBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
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
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (
			!isNullorEmpty(date_signed_up_from) &&
			!isNullorEmpty(date_signed_up_to)
		) {
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			suspectsInContactBySalesRepWeeklySearch.filters.push(
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
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			suspectsInContactBySalesRepWeeklySearch.filters.push(
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
			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			suspectsInContactBySalesRepWeeklySearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				suspectsInContactBySalesRepWeeklySearch.filterExpression;

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

			suspectsInContactBySalesRepWeeklySearch.filterExpression =
				defaultSearchFilters;
		}

		var countSuspectFollowUp = 0;
		var countSuspectNoAnswer = 0;
		suspectsInContactBySalesRepWeeklySearch
			.run()
			.each(function (suspectsInContactBySalesRepWeeklySearchResultSet) {
				var customerCount = parseInt(
					suspectsInContactBySalesRepWeeklySearchResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				var weekLeadEntered =
					suspectsInContactBySalesRepWeeklySearchResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});
				var custStatus =
					suspectsInContactBySalesRepWeeklySearchResultSet.getValue({
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

				debt_setSuspectsInContact.push({
					dateUsed: startDate,
					suspect_in_contact: customerCount,
				});
				countSuspectFollowUp++;
				oldStartDateFollowUp = startDate;
				return true;
			});

		var suspectsInContactChartDatSet = [];
		if (!isNullorEmpty(debt_setSuspectsInContact)) {
			debt_setSuspectsInContact.forEach(function (preview_row, index) {
				suspectsInContactChartDatSet.push([
					preview_row.dateUsed,
					preview_row.suspect_in_contact,
				]);
			});
		}

		console.log(
			"SUSPECTS In Contact GRAPH DATA: " + suspectsInContactChartDatSet
		);

		var month_year_suspects_in_contact = []; // creating array for storing browser
		var suspect_in_contact_count = [];

		for (var i = 0; i < suspectsInContactChartDatSet.length; i++) {
			if (!isNullorEmpty(suspectsInContactChartDatSet[i][0])) {
				month_year_suspects_in_contact.push(suspectsInContactChartDatSet[i][0]);
				suspect_in_contact_count[suspectsInContactChartDatSet[i][0]] =
					suspectsInContactChartDatSet[i][1];
			}
		}

		var series_data300 = [];
		var series_data301 = [];

		var categores_suspects_in_contact = []; // creating empty array for highcharts
		// categories
		Object.keys(suspect_in_contact_count).map(function (item, key) {
			series_data300.push(parseInt(suspect_in_contact_count[item]));
			categores_suspects_in_contact.push(item);
		});

		plotChartSuspectsInContact(
			series_data300,
			categores_suspects_no_answer,
			series_data301
		);

		// //? Data Capture Grouped by Source & Campaign
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

		// plotSalesRepChart(
		// 	series_data_entered,
		// 	null,
		// 	salesRepAssignedTeamMemberCategories
		// );

		// plotSalesRepChartCampaign(
		// 	series_data_campaign,
		// 	null,
		// 	salesRepAssignedTeamMemberCategories
		// );

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

			// plotZeeGeneratedSalesRepChart(
			// 	series_data_last_assigned,
			// 	null,
			// 	salesRepAssignedTeamMemberCategories
			// );
		}

		// if (sales_activity_notes == 1) {
		// 	var websiteSuspectsLeadsReportingSearch = search.load({
		// 		type: "customer",
		// 		id: "customsearch_leads_reporting_5_2_2_2_3", //Sales Dashboard - Website Leads - Suspects - Reporting V5
		// 	});
		// } else {
		// var websiteSuspectsLeadsReportingSearch = search.load({
		// 	type: "customer",
		// 	id: "customsearch_suspects_reporting_no_activ", //Sales Dashboard - Leads - Suspects - Reporting V4 (No Activity)
		// });
		if (role == 1000) {
			var websiteSuspectsLeadsReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_5_2_2_2_3_2", //Sales Dashboard - Website Leads - Suspects with Tasks - Reporting V6
			});
		} else {
			var websiteSuspectsLeadsReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_5_2_2_2_3_3", //Sales Dashboard - Website Leads - Suspects with no Tasks - Reporting V6
			});
		}

		// }

		websiteSuspectsLeadsReportingSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			websiteSuspectsLeadsReportingSearch.filters.push(
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
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			websiteSuspectsLeadsReportingSearch.filters.push(
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
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			websiteSuspectsLeadsReportingSearch.filters.push(
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
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			websiteSuspectsLeadsReportingSearch.filters.push(
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
			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			websiteSuspectsLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to) &&
			sales_activity_notes == 1
		) {
			var defaultSearchFilters =
				websiteSuspectsLeadsReportingSearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var modifiedDateFilters = [
				[
					[
						"usernotes.notedate",
						"within",
						[modified_date_from, modified_date_to],
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

			websiteSuspectsLeadsReportingSearch.filterExpression =
				defaultSearchFilters;
		}

		var oldcustInternalID = null;
		var oldcustEntityID = null;
		var oldcustName = null;
		var oldzeeID = null;
		var oldzeeName = null;
		var oldcustStage = null;
		var oldcustStatus = null;
		var oldCustStatusId = 0;
		var olddateLeadEntered = null;
		var oldquoteSentDate = null;
		var olddateLeadLost = null;
		var olddateLeadinContact = null;
		var olddateProspectWon = null;
		var olddateLeadReassigned = null;
		var oldsalesRepId = null;
		var oldsalesRepText = null;
		var oldactivityInternalID = null;
		var oldactivityStartDate = null;
		var oldactivityTitle = null;
		var oldactivityOrganiser = null;
		var oldactivityMessage = null;
		var oldemail48h = null;
		var oldDaysOpen = null;
		var oldCancellationReason = null;
		var oldCancellationTheme = null;
		var oldCancellationWhat = null;
		var oldCancellationWhy = null;
		var oldSource = null;
		var oldProdWeeklyUsage = null;
		var oldAutoSignUp = null;
		var oldPreviousCarrier = null;
		var oldMonthServiceValue = 0.0;
		var oldDateLPOValidated = null;

		var oldAvgInvoiceValue = 0.0;

		var csvSuspectDataSet = [];
		var csvSuspectLostDataSet = [];
		var csvSuspectOffPeakDataSet = [];
		var csvSuspectOOTDataSet = [];
		var csvSuspectFollowUpDataSet = [];
		var csvSuspectQualifiedDataSet = [];
		var csvProspectDataSet = [];
		var csvProspectOpportunityDataSet = [];
		var csvSuspectNoAnswerDataSet = [];
		var csvSuspectInContactDataSet = [];
		var csvProspectQuoteSentDataSet = [];

		console.log(
			"websiteSuspectsLeadsReportingSearch :" +
			websiteSuspectsLeadsReportingSearch
		);

		console.log(
			"default search filters: " +
			JSON.stringify(websiteSuspectsLeadsReportingSearch.filters)
		);

		var websiteSuspectsLeadsReportingSearchCount =
			websiteSuspectsLeadsReportingSearch.runPaged().count;

		var val1 = currentRecord.get();
		var page_no = val1.getValue({
			fieldId: "custpage_page_no",
		});


		console.log(
			"websiteSuspectsLeadsReportingSearchCount: " +
			websiteSuspectsLeadsReportingSearchCount
		);
		var count = 0;

		if (websiteSuspectsLeadsReportingSearchCount < 1000) {
			console.log("Under 1000 leads under the SUSPECTS");
			// if (sales_activity_notes == 1) {
			console.log("websiteSuspectsLeadsReportingSearch with activity");
			websiteSuspectsLeadsReportingSearch
				.run()
				.each(function (suspectsResultSet) {
					var custInternalID = suspectsResultSet.getValue({
						name: "internalid",
						summary: "GROUP",
					});
					var custEntityID = suspectsResultSet.getValue({
						name: "entityid",
						summary: "GROUP",
					});
					var custName = suspectsResultSet.getValue({
						name: "companyname",
						summary: "GROUP",
					});
					var zeeID = suspectsResultSet.getValue({
						name: "partner",
						summary: "GROUP",
					});
					var zeeName = suspectsResultSet.getText({
						name: "partner",
						summary: "GROUP",
					});

					var custStage = suspectsResultSet
						.getText({
							name: "stage",
							summary: "GROUP",
						})
						.toUpperCase();

					var custStatusId = suspectsResultSet.getValue({
						name: "entitystatus",
						summary: "GROUP",
					});

					var custStatus = suspectsResultSet
						.getText({
							name: "entitystatus",
							summary: "GROUP",
						})
						.toUpperCase();

					var dateLeadEntered = suspectsResultSet.getValue({
						name: "custentity_date_lead_entered",
						summary: "GROUP",
					});

					var quoteSentDate = suspectsResultSet.getValue({
						name: "custentity_date_lead_quote_sent",
						summary: "GROUP",
					});

					var dateLeadLost = suspectsResultSet.getValue({
						name: "custentity_date_lead_lost",
						summary: "GROUP",
					});
					var dateLeadinContact = suspectsResultSet.getValue({
						name: "custentity_date_prospect_in_contact",
						summary: "GROUP",
					});

					var dateProspectWon = suspectsResultSet.getValue({
						name: "custentity_date_prospect_opportunity",
						summary: "GROUP",
					});

					var dateLeadReassigned = suspectsResultSet.getValue({
						name: "custentity_date_suspect_reassign",
						summary: "GROUP",
					});

					var salesRepId = suspectsResultSet.getValue({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					});
					var salesRepText = suspectsResultSet.getText({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
						summary: "GROUP",
					});

					var email48h = suspectsResultSet.getText({
						name: "custentity_48h_email_sent",
						summary: "GROUP",
					});

					var daysOpen = suspectsResultSet.getValue({
						name: "formulanumeric",
						summary: "GROUP",
					});

					var cancellationReason = suspectsResultSet.getText({
						name: "custentity_service_cancellation_reason",
						summary: "GROUP",
					});

					//New Cancellation Fields - Theme/What & Why
					var cancellationTheme = suspectsResultSet.getText({
						name: "custentity_service_cancellation_theme",
						summary: "GROUP",
					});
					var cancellationWhat = suspectsResultSet.getText({
						name: "custentity_service_cancellation_what",
						summary: "GROUP",
					});
					var cancellationWhy = suspectsResultSet.getText({
						name: "custentity_service_cancellation_why",
						summary: "GROUP",
					});

					var source = suspectsResultSet.getText({
						name: "leadsource",
						summary: "GROUP",
					});

					var productWeeklyUsage = suspectsResultSet.getText({
						name: "custentity_form_mpex_usage_per_week",
						summary: "GROUP",
					});

					var autoSignUp = suspectsResultSet.getValue({
						name: "custentity_auto_sign_up",
						summary: "GROUP",
					});

					var previousCarrier = suspectsResultSet.getText({
						name: "custentity_previous_carrier",
						summary: "GROUP",
					});

					var monthlyServiceValue = suspectsResultSet.getValue({
						name: "custentity_cust_monthly_service_value",
						summary: "GROUP",
					});

					var avgInvoiceValue = suspectsResultSet.getValue({
						name: "total",
						join: "transaction",
						summary: "AVG",
					});

					var dateLPOValidated = suspectsResultSet.getValue({
						name: "custentity_date_lpo_validated",
						summary: "GROUP",
					});

					var tasksInternalID = suspectsResultSet.getValue({
						name: "internalid",
						join: "task",
						summary: "GROUP",
					});
					var taskDate = suspectsResultSet.getValue({
						name: "duedate",
						join: "task",
						summary: "GROUP",
					});
					var taskTitle = suspectsResultSet.getValue({
						name: "title",
						join: "task",
						summary: "GROUP",
					});
					var taskAssignedTo = suspectsResultSet.getText({
						name: "assigned",
						join: "task",
						summary: "GROUP",
					});
					var taskAssignedTo = suspectsResultSet.getText({
						name: "assigned",
						join: "task",
						summary: "GROUP",
					});
					var taskStatus = suspectsResultSet.getText({
						name: "status",
						join: "task",
						summary: "GROUP",
					});
					var taskComment = suspectsResultSet.getText({
						name: "message",
						join: "task",
						summary: "GROUP",
					});

					// var userNotesInternalID = suspectsResultSet.getValue({
					// 	name: "internalid",
					// 	join: "userNotes",
					// 	summary: "GROUP",
					// });
					// var userNotesTitle = suspectsResultSet.getValue({
					// 	name: "title",
					// 	join: "userNotes",
					// 	summary: "GROUP",
					// });
					// var userNotesStartDate = suspectsResultSet.getValue({
					// 	name: "notedate",
					// 	join: "userNotes",
					// 	summary: "GROUP",
					// });
					// if (!isNullorEmpty(userNotesStartDate)) {
					// 	var userNotesStartDateTimeArray = userNotesStartDate.split(" ");
					// 	var userNotesStartDateArray =
					// 		userNotesStartDateTimeArray[0].split("/");
					// 	if (parseInt(userNotesStartDateArray[1]) < 10) {
					// 		userNotesStartDateArray[1] = "0" + userNotesStartDateArray[1];
					// 	}

					// 	if (parseInt(userNotesStartDateArray[0]) < 10) {
					// 		userNotesStartDateArray[0] = "0" + userNotesStartDateArray[0];
					// 	}
					// 	userNotesStartDate =
					// 		userNotesStartDateArray[2] +
					// 		"-" +
					// 		userNotesStartDateArray[1] +
					// 		"-" +
					// 		userNotesStartDateArray[0];
					// }
					// var userNotesOrganiser = suspectsResultSet.getText({
					// 	name: "author",
					// 	join: "userNotes",
					// 	summary: "GROUP",
					// });
					// var userNotesMessage = suspectsResultSet.getValue({
					// 	name: "note",
					// 	join: "userNotes",
					// 	summary: "GROUP",
					// });

					// console.log("userNotesInternalID: " + userNotesInternalID);
					// console.log("userNotesTitle: " + userNotesTitle);
					// console.log("userNotesStartDate: " + userNotesStartDate);
					// console.log("userNotesOrganiser: " + userNotesOrganiser);
					// console.log("userNotesMessage: " + userNotesMessage);
					console.log("custStage: " + custStage);
					console.log("custStatus: " + custStatus);

					if (!isNullorEmpty(monthlyServiceValue)) {
						monthlyServiceValue = financial(parseFloat(monthlyServiceValue));
					} else {
						monthlyServiceValue = 0.0;
					}

					if (!isNullorEmpty(avgInvoiceValue) && parseInt(avgInvoiceValue) > 0) {
						avgInvoiceValue = financial(parseFloat(avgInvoiceValue));
					} else {
						avgInvoiceValue = 0.0;
					}

					var dateLeadEnteredSplit = dateLeadEntered.split("/");
					if (parseInt(dateLeadEnteredSplit[1]) < 10) {
						dateLeadEnteredSplit[1] = "0" + dateLeadEnteredSplit[1];
					}

					if (parseInt(dateLeadEnteredSplit[0]) < 10) {
						dateLeadEnteredSplit[0] = "0" + dateLeadEnteredSplit[0];
					}
					dateLeadEntered =
						dateLeadEnteredSplit[2] +
						"-" +
						dateLeadEnteredSplit[1] +
						"-" +
						dateLeadEnteredSplit[0];

					if (!isNullorEmpty(dateLeadLost)) {
						var dateLeadLostSplit = dateLeadLost.split("/");
						// var dateLeadEnteredSplit = dateLeadEntered.split('/');

						var dateEntered = new Date(
							dateLeadEnteredSplit[2],
							dateLeadEnteredSplit[1] - 1,
							dateLeadEnteredSplit[0]
						);
						var dateLost = new Date(
							dateLeadLostSplit[2],
							dateLeadLostSplit[1] - 1,
							dateLeadLostSplit[0]
						);

						var difference = dateLost.getTime() - dateEntered.getTime();
						daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

						var weeks = Math.floor(daysOpen / 7);
						daysOpen = daysOpen - weeks * 2;

						// Handle special cases
						var startDay = dateEntered.getDay();
						var endDay = dateLost.getDay();

						// Remove weekend not previously removed.
						if (startDay - endDay > 1) daysOpen = daysOpen - 2;

						// Remove start day if span starts on Sunday but ends before Saturday
						if (startDay == 0 && endDay != 6) {
							daysOpen = daysOpen - 1;
						}

						// Remove end day if span ends on Saturday but starts after Sunday
						if (endDay == 6 && startDay != 0) {
							daysOpen = daysOpen - 1;
						}
					} else if (!isNullorEmpty(dateProspectWon)) {
						var dateProspectWonSplit = dateProspectWon.split("/");

						if (parseInt(dateProspectWonSplit[1]) < 10) {
							dateProspectWonSplit[1] = "0" + dateProspectWonSplit[1];
						}

						if (parseInt(dateProspectWonSplit[0]) < 10) {
							dateProspectWonSplit[0] = "0" + dateProspectWonSplit[0];
						}

						dateProspectWon =
							dateProspectWonSplit[2] +
							"-" +
							dateProspectWonSplit[1] +
							"-" +
							dateProspectWonSplit[0];

						var dateLeadLostSplit = dateLeadLost.split("/");
						// var dateLeadEnteredSplit = dateLeadEntered.split('/');

						var dateEntered = new Date(
							dateLeadEnteredSplit[2],
							dateLeadEnteredSplit[1] - 1,
							dateLeadEnteredSplit[0]
						);
						dateProspectWon = new Date(
							dateProspectWonSplit[2],
							dateProspectWonSplit[1] - 1,
							dateProspectWonSplit[0]
						);

						var difference = dateProspectWon.getTime() - dateEntered.getTime();
						daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

						var weeks = Math.floor(daysOpen / 7);
						daysOpen = daysOpen - weeks * 2;

						// Handle special cases
						var startDay = dateEntered.getDay();
						var endDay = dateProspectWon.getDay();

						// Remove weekend not previously removed.
						if (startDay - endDay > 1) daysOpen = daysOpen - 2;

						// Remove start day if span starts on Sunday but ends before Saturday
						if (startDay == 0 && endDay != 6) {
							daysOpen = daysOpen - 1;
						}

						// Remove end day if span ends on Saturday but starts after Sunday
						if (endDay == 6 && startDay != 0) {
							daysOpen = daysOpen - 1;
						}

						dateProspectWon =
							dateProspectWonSplit[2] +
							"-" +
							dateProspectWonSplit[1] +
							"-" +
							dateProspectWonSplit[0];
					} else if (!isNullorEmpty(quoteSentDate)) {
						var dateQuoteSentSplit = quoteSentDate.split("/");

						if (parseInt(dateQuoteSentSplit[1]) < 10) {
							dateQuoteSentSplit[1] = "0" + dateQuoteSentSplit[1];
						}

						if (parseInt(dateQuoteSentSplit[0]) < 10) {
							dateQuoteSentSplit[0] = "0" + dateQuoteSentSplit[0];
						}

						quoteSentDate =
							dateQuoteSentSplit[2] +
							"-" +
							dateQuoteSentSplit[1] +
							"-" +
							dateQuoteSentSplit[0];

						var dateLeadLostSplit = dateLeadLost.split("/");
						// var dateLeadEnteredSplit = dateLeadEntered.split('/');

						var dateEntered = new Date(
							dateLeadEnteredSplit[2],
							dateLeadEnteredSplit[1] - 1,
							dateLeadEnteredSplit[0]
						);
						quoteSentDate = new Date(
							dateQuoteSentSplit[2],
							dateQuoteSentSplit[1] - 1,
							dateQuoteSentSplit[0]
						);

						var difference = quoteSentDate.getTime() - dateEntered.getTime();
						daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

						var weeks = Math.floor(daysOpen / 7);
						daysOpen = daysOpen - weeks * 2;

						// Handle special cases
						var startDay = dateEntered.getDay();
						var endDay = quoteSentDate.getDay();

						// Remove weekend not previously removed.
						if (startDay - endDay > 1) daysOpen = daysOpen - 2;

						// Remove start day if span starts on Sunday but ends before Saturday
						if (startDay == 0 && endDay != 6) {
							daysOpen = daysOpen - 1;
						}

						// Remove end day if span ends on Saturday but starts after Sunday
						if (endDay == 6 && startDay != 0) {
							daysOpen = daysOpen - 1;
						}

						quoteSentDate =
							dateQuoteSentSplit[2] +
							"-" +
							dateQuoteSentSplit[1] +
							"-" +
							dateQuoteSentSplit[0];
					}
					if (!isNullorEmpty(dateLPOValidated)) {
						var dateLPOValidatedSplit = dateLPOValidated.split("/");
						// var dateLeadEnteredSplit = dateLeadEntered.split('/');

						var dateEntered = new Date(
							dateLeadEnteredSplit[2],
							dateLeadEnteredSplit[1] - 1,
							dateLeadEnteredSplit[0]
						);
						var dateValidated = new Date(
							dateLPOValidatedSplit[2],
							dateLPOValidatedSplit[1] - 1,
							dateLPOValidatedSplit[0]
						);

						var difference = dateValidated.getTime() - dateEntered.getTime();
						daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

						var weeks = Math.floor(daysOpen / 7);
						daysOpen = daysOpen - weeks * 2;

						// Handle special cases
						var startDay = dateEntered.getDay();
						var endDay = dateValidated.getDay();

						// Remove weekend not previously removed.
						if (startDay - endDay > 1) daysOpen = daysOpen - 2;

						// Remove start day if span starts on Sunday but ends before Saturday
						if (startDay == 0 && endDay != 6) {
							daysOpen = daysOpen - 1;
						}

						// Remove end day if span ends on Saturday but starts after Sunday
						if (endDay == 6 && startDay != 0) {
							daysOpen = daysOpen - 1;
						}
					} else {
						// var dateLeadLostSplit = dateLeadLost.split('/');
						// var dateLeadEnteredSplit = dateLeadEntered.split('/');

						var dateEntered = new Date(
							dateLeadEnteredSplit[2],
							dateLeadEnteredSplit[1] - 1,
							dateLeadEnteredSplit[0]
						);
						var todayDate = new Date();

						var difference = todayDate.getTime() - dateEntered.getTime();
						daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

						var weeks = Math.floor(daysOpen / 7);
						daysOpen = daysOpen - weeks * 2;

						// Handle special cases
						var startDay = dateEntered.getDay();
						var endDay = todayDate.getDay();

						// Remove weekend not previously removed.
						if (startDay - endDay > 1) daysOpen = daysOpen - 2;

						// Remove start day if span starts on Sunday but ends before Saturday
						if (startDay == 0 && endDay != 6) {
							daysOpen = daysOpen - 1;
						}

						// Remove end day if span ends on Saturday but starts after Sunday
						if (endDay == 6 && startDay != 0) {
							daysOpen = daysOpen - 1;
						}
					}

					if (count == 0) {
						console.log("inside count == 0");

						if (!isNullorEmpty(tasksInternalID)) {
							console.log("inside usernotes internal id");
							console.log("custStage: " + custStage);
							console.log("custStatus: " + custStatus);
							if (
								custStage == "SUSPECT" &&
								custStatus != "SUSPECT-CUSTOMER - LOST" &&
								custStatus != "SUSPECT-PARKING LOT" &&
								custStatus != "SUSPECT-LOST" &&
								custStatus != "SUSPECT-OUT OF TERRITORY" &&
								custStatus != "SUSPECT-FOLLOW-UP" &&
								custStatus != "SUSPECT-QUALIFIED" &&
								custStatus != "SUSPECT-LPO FOLLOW-UP" &&
								custStatus != "SUSPECT-NO ANSWER" &&
								custStatus != "SUSPECT-IN CONTACT"
							) {
								console.log("inside suspect new");
								suspectActivityCount++;
								suspectChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								(custStatus == "SUSPECT-CUSTOMER - LOST" ||
									custStatus == "SUSPECT-LOST")
							) {
								console.log("inside suspect lost");
								suspectActivityCount++;
								suspectLostChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-PARKING LOT"
							) {
								console.log("inside suspect parking lot");
								suspectActivityCount++;
								suspectOffPeakChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-OUT OF TERRITORY"
							) {
								console.log("inside suspect OOT");
								suspectActivityCount++;
								suspectOOTChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								(custStatus == "SUSPECT-FOLLOW-UP" ||
									custStatus == "SUSPECT-LPO FOLLOW-UP")
							) {
								console.log("inside suspect follow-up");
								suspectActivityCount++;
								suspectFollowUpChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-QUALIFIED"
							) {
								console.log("inside suspect qualifeid");
								suspectActivityCount++;
								suspectQualifiedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-UNQUALIFIED"
							) {
								console.log("inside suspect unqualifeid");
								suspectActivityCount++;
								suspectUnqualifiedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-VALIDATED"
							) {
								console.log("inside suspect validated");
								suspectActivityCount++;
								suspectValidatedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-FRANCHISEE REVIEW"
							) {
								console.log("inside suspect franchisee review");
								suspectActivityCount++;
								suspectZeeReviewChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-NO ANSWER"
							) {
								console.log("inside suspect no answer");
								suspectActivityCount++;
								suspectNoAnswerChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-IN CONTACT"
							) {
								console.log("inside SUSPECT-IN CONTACT");
								suspectActivityCount++;
								suspectInContactChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							}
						}
					} else if (count > 0 && oldcustInternalID == custInternalID) {
						console.log(
							"inside count > 0 && (oldcustInternalID == custInternalID)"
						);

						if (!isNullorEmpty(tasksInternalID)) {
							console.log("inside usernotes internal id");
							if (
								custStage == "SUSPECT" &&
								custStatus != "SUSPECT-CUSTOMER - LOST" &&
								custStatus != "SUSPECT-PARKING LOT" &&
								custStatus != "SUSPECT-LOST" &&
								custStatus != "SUSPECT-OUT OF TERRITORY" &&
								custStatus != "SUSPECT-FOLLOW-UP" &&
								custStatus != "SUSPECT-QUALIFIED" &&
								custStatus != "SUSPECT-LPO FOLLOW-UP" &&
								custStatus != "SUSPECT-NO ANSWER" &&
								custStatus != "SUSPECT-IN CONTACT"
							) {
								console.log("inside suspect new");
								suspectActivityCount++;
								suspectChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								(custStatus == "SUSPECT-CUSTOMER - LOST" ||
									custStatus == "SUSPECT-LOST")
							) {
								console.log("inside suspect lost");
								suspectActivityCount++;
								suspectLostChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-PARKING LOT"
							) {
								console.log("inside suspect parking lot");
								suspectActivityCount++;
								suspectOffPeakChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-OUT OF TERRITORY"
							) {
								console.log("inside suspect OOT");
								suspectActivityCount++;
								suspectOOTChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								(custStatus == "SUSPECT-FOLLOW-UP" ||
									custStatus == "SUSPECT-LPO FOLLOW-UP")
							) {
								console.log("inside suspect follow-up");
								suspectActivityCount++;
								suspectFollowUpChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-QUALIFIED"
							) {
								console.log("inside suspect qualifeid");
								suspectActivityCount++;
								suspectQualifiedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-UNQUALIFIED"
							) {
								console.log("inside suspect unqualifeid");
								suspectActivityCount++;
								suspectUnqualifiedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-VALIDATED"
							) {
								console.log("inside suspect validated");
								suspectActivityCount++;
								suspectValidatedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-FRANCHISEE REVIEW"
							) {
								console.log("inside suspect franchisee review");
								suspectActivityCount++;
								suspectZeeReviewChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-NO ANSWER"
							) {
								console.log("inside suspect no answer");
								suspectActivityCount++;
								suspectNoAnswerChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-IN CONTACT"
							) {
								console.log("inside SUSPECT-IN CONTACT");
								suspectActivityCount++;
								suspectInContactChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							}
						}
					} else if (count > 0 && oldcustInternalID != custInternalID) {
						if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus != "SUSPECT-CUSTOMER - LOST" &&
							oldcustStatus != "SUSPECT-PARKING LOT" &&
							oldcustStatus != "SUSPECT-LOST" &&
							oldcustStatus != "SUSPECT-OUT OF TERRITORY" &&
							oldcustStatus != "SUSPECT-FOLLOW-UP" &&
							oldcustStatus != "SUSPECT-QUALIFIED" &&
							oldcustStatus != "SUSPECT-LPO FOLLOW-UP" &&
							oldcustStatus != "SUSPECT-VALIDATED" &&
							oldcustStatus != "SUSPECT-NO ANSWER" &&
							oldcustStatus != "SUSPECT-IN CONTACT" &&
							oldcustStatus != "SUSPECT-UNQUALIFIED"
						) {
							suspectDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldemail48h,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectChildDataSet,
							]);

							csvSuspectDataSet.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldemail48h,
								oldDaysOpen,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							(oldcustStatus == "SUSPECT-CUSTOMER - LOST" ||
								oldcustStatus == "SUSPECT-LOST")
						) {
							suspectLostDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateProspectWon,
								olddateLeadLost,
								oldemail48h,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldCancellationReason,
								oldCancellationTheme,
								oldCancellationWhat,
								oldCancellationWhy,
								oldMonthServiceValue,
								oldAvgInvoiceValue,
								oldsalesRepText,
								suspectLostChildDataSet,
							]);
							csvSuspectLostDataSet.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateProspectWon,
								olddateLeadLost,
								oldemail48h,
								oldDaysOpen,
								oldCancellationReason,
								oldMonthServiceValue,
								oldAvgInvoiceValue,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-PARKING LOT"
						) {
							suspectOffPeakDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateLeadReassigned,
								olddateLeadLost,
								oldemail48h,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldCancellationReason,
								oldMonthServiceValue,
								oldsalesRepText,
								suspectOffPeakChildDataSet,
							]);
							csvSuspectOffPeakDataSet.push([
								,
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateLeadReassigned,
								olddateLeadLost,
								oldemail48h,
								oldDaysOpen,
								oldCancellationReason,
								oldMonthServiceValue,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-OUT OF TERRITORY"
						) {
							suspectOOTDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateLeadReassigned,
								olddateLeadLost,
								oldemail48h,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldCancellationReason,
								oldMonthServiceValue,
								oldsalesRepText,
								suspectOOTChildDataSet,
							]);

							csvSuspectOOTDataSet.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateLeadReassigned,
								olddateLeadLost,
								oldemail48h,
								oldDaysOpen,
								oldCancellationReason,
								oldMonthServiceValue,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							(oldcustStatus == "SUSPECT-FOLLOW-UP" ||
								oldcustStatus == "SUSPECT-LPO FOLLOW-UP")
						) {
							suspectFollowUpDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateLeadReassigned,
								olddateLeadLost,
								oldemail48h,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldCancellationReason,
								oldMonthServiceValue,
								oldsalesRepText,
								suspectFollowUpChildDataSet,
							]);

							csvSuspectFollowUpDataSet.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateLeadReassigned,
								olddateLeadLost,
								oldemail48h,
								oldDaysOpen,
								oldCancellationReason,
								oldMonthServiceValue,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-QUALIFIED"
						) {
							suspectQualifiedDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectQualifiedChildDataSet,
							]);

							csvSuspectQualifiedDataSet.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldDaysOpen,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-UNQUALIFIED"
						) {
							suspectUnqualifiedDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectQualifiedChildDataSet,
							]);

							csvSuspectQualifiedDataSet.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldDaysOpen,
								oldsalesRepText,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-FRANCHISEE REVIEW"
						) {
							suspectZeeReviewDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldDateLPOValidated,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectZeeReviewChildDataSet,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-VALIDATED"
						) {
							suspectValidatedDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldDateLPOValidated,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectQualifiedChildDataSet,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-NO ANSWER"
						) {
							suspectNoAnswerDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectNoAnswerChildDataSet,
							]);
						} else if (
							oldcustStage == "SUSPECT" &&
							oldcustStatus == "SUSPECT-IN CONTACT"
						) {
							suspectInContactDataSet.push([
								"",
								oldcustInternalID,
								'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
								oldcustInternalID +
								'" target="_blank" style="">' +
								oldcustEntityID +
								"</a>",
								oldcustName,
								oldzeeName,
								oldcustStatus,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldsalesRepText,
								suspectInContactChildDataSet,
							]);
						}
						prospectChildDataSet = [];
						prospectOpportunityChildDataSet = [];
						prospectQuoteSentChildDataSet = [];
						prospectBoxSentChildDataSet = [];
						suspectChildDataSet = [];
						suspectFollowUpChildDataSet = [];
						suspectLostChildDataSet = [];
						suspectOOTChildDataSet = [];
						suspectQualifiedChildDataSet = [];
						suspectUnqualifiedChildDataSet = [];
						suspectOffPeakChildDataSet = [];
						suspectNoAnswerChildDataSet = [];
						suspectInContactChildDataSet = [];
						suspectZeeReviewChildDataSet = [];
						suspectValidatedChildDataSet = [];

						if (!isNullorEmpty(tasksInternalID)) {
							if (
								custStage == "SUSPECT" &&
								custStatus != "SUSPECT-CUSTOMER - LOST" &&
								custStatus != "SUSPECT-PARKING LOT" &&
								custStatus != "SUSPECT-LOST" &&
								custStatus != "SUSPECT-OUT OF TERRITORY" &&
								custStatus != "SUSPECT-FOLLOW-UP" &&
								custStatus != "SUSPECT-QUALIFIED" &&
								custStatus != "SUSPECT-LPO FOLLOW-UP" &&
								custStatus != "SUSPECT-NO ANSWER" &&
								custStatus != "SUSPECT-IN CONTACT"
							) {
								suspectActivityCount++;
								suspectChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								(custStatus == "SUSPECT-CUSTOMER - LOST" ||
									custStatus == "SUSPECT-LOST")
							) {
								suspectActivityCount++;
								suspectLostChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-PARKING LOT"
							) {
								suspectActivityCount++;
								suspectOffPeakChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-OUT OF TERRITORY"
							) {
								suspectActivityCount++;
								suspectOOTChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								(custStatus == "SUSPECT-FOLLOW-UP" ||
									custStatus == "SUSPECT-LPO FOLLOW-UP")
							) {
								suspectActivityCount++;
								suspectFollowUpChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-QUALIFIED"
							) {
								suspectActivityCount++;
								suspectQualifiedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-UNQUALIFIED"
							) {
								suspectActivityCount++;
								suspectUnqualifiedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-VALIDATED"
							) {
								suspectActivityCount++;
								suspectValidatedChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-FRANCHISEE REVIEW"
							) {
								console.log("inside suspect franchisee review");
								suspectActivityCount++;
								suspectZeeReviewChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-NO ANSWER"
							) {
								suspectActivityCount++;
								suspectNoAnswerChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							} else if (
								custStage == "SUSPECT" &&
								custStatus == "SUSPECT-IN CONTACT"
							) {
								suspectActivityCount++;
								suspectInContactChildDataSet.push({
									tasksInternalID: tasksInternalID,
									taskDate: taskDate,
									taskTitle: taskTitle,
									taskAssignedTo: taskAssignedTo,
									taskStatus: taskStatus,
									taskComment: taskComment,
								});
							}
						}
					}
					console.log(
						"suspectInContactChildDataSet: " + suspectInContactChildDataSet
					);
					oldcustInternalID = custInternalID;
					oldcustEntityID = custEntityID;
					oldcustName = custName;
					oldzeeID = zeeID;
					oldzeeName = zeeName;
					oldcustStage = custStage;
					oldcustStatus = custStatus;
					oldCustStatusId = custStatusId;
					olddateLeadEntered = dateLeadEntered;
					oldquoteSentDate = quoteSentDate;
					olddateLeadLost = dateLeadLost;
					olddateLeadinContact = dateLeadinContact;
					olddateProspectWon = dateProspectWon;
					oldDateLPOValidated = dateLPOValidated;
					olddateLeadReassigned = dateLeadReassigned;
					oldsalesRepId = salesRepId;
					oldsalesRepText = salesRepText;
					oldemail48h = email48h;
					oldDaysOpen = daysOpen;
					oldCancellationReason = cancellationReason;
					oldCancellationTheme = cancellationTheme;
					oldCancellationWhat = cancellationWhat;
					oldCancellationWhy = cancellationWhy;
					oldSource = source;
					oldProdWeeklyUsage = productWeeklyUsage;
					oldAutoSignUp = autoSignUp;
					oldPreviousCarrier = previousCarrier;
					oldMonthServiceValue = monthlyServiceValue;
					oldAvgInvoiceValue = avgInvoiceValue;
					count++;
					return true;
				});
			console.log(
				"suspectInContactChildDataSet: " + suspectInContactChildDataSet
			);
			if (count > 0) {
				if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus != "SUSPECT-CUSTOMER - LOST" &&
					oldcustStatus != "SUSPECT-PARKING LOT" &&
					oldcustStatus != "SUSPECT-LOST" &&
					oldcustStatus != "SUSPECT-OUT OF TERRITORY" &&
					oldcustStatus != "SUSPECT-FOLLOW-UP" &&
					oldcustStatus != "SUSPECT-QUALIFIED" &&
					oldcustStatus != "SUSPECT-LPO FOLLOW-UP" &&
					oldcustStatus != "SUSPECT-VALIDATED" &&
					oldcustStatus != "SUSPECT-NO ANSWER" &&
					oldcustStatus != "SUSPECT-IN CONTACT" &&
					oldcustStatus != "SUSPECT-UNQUALIFIED"
				) {
					suspectDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectChildDataSet,
					]);

					csvSuspectDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldemail48h,
						oldDaysOpen,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					(oldcustStatus == "SUSPECT-CUSTOMER - LOST" ||
						oldcustStatus == "SUSPECT-LOST")
				) {
					suspectLostDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateProspectWon,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldCancellationTheme,
						oldCancellationWhat,
						oldCancellationWhy,
						oldMonthServiceValue,
						oldAvgInvoiceValue,
						oldsalesRepText,
						suspectLostChildDataSet,
					]);

					csvSuspectLostDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateProspectWon,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldAvgInvoiceValue,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-PARKING LOT"
				) {
					suspectOffPeakDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
						suspectOffPeakChildDataSet,
					]);

					csvSuspectOffPeakDataSet.push([
						,
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-QUALIFIED"
				) {
					suspectQualifiedDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectQualifiedChildDataSet,
					]);

					csvSuspectQualifiedDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDaysOpen,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-UNQUALIFIED"
				) {
					suspectUnqualifiedDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectQualifiedChildDataSet,
					]);

					csvSuspectQualifiedDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDaysOpen,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-VALIDATED"
				) {
					suspectValidatedDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDateLPOValidated,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectQualifiedChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-FRANCHISEE REVIEW"
				) {
					suspectZeeReviewDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDateLPOValidated,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectZeeReviewChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-NO ANSWER"
				) {
					suspectNoAnswerDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectNoAnswerChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-IN CONTACT"
				) {
					suspectInContactDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectInContactChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-OUT OF TERRITORY"
				) {
					suspectOOTDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
						suspectOOTChildDataSet,
					]);

					csvSuspectOOTDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-FOLLOW-UP"
				) {
					suspectFollowUpDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
						suspectFollowUpChildDataSet,
					]);

					csvSuspectFollowUpDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
					]);
				}
			}
		} else {
			console.log("Over 1000 leads under the SUSPECTS");
			var val1 = currentRecord.get();
			var page_no = val1.getValue({
				fieldId: "custpage_page_no",
			});

			var totalPageCount = parseInt(websiteSuspectsLeadsReportingSearchCount / 1000) + 1;
			var rangeStart = (parseInt(page_no) - 1) * 1001;
			var rangeEnd = rangeStart + 1000;

			val1.setValue({
				fieldId: "custpage_total_page_no",
				value: totalPageCount,
			});

			var suspectsResultSet = websiteSuspectsLeadsReportingSearch
				.run()
				.getRange({
					start: rangeStart,
					end: rangeEnd,
				});

			console.log("Over 1000 leads under the SUSPECTS: ", suspectsResultSet.length);

			for (var i = 0; i < suspectsResultSet.length; i++) {
				var custInternalID = suspectsResultSet[i].getValue({
					name: "internalid",
					summary: "GROUP",
				});
				var custEntityID = suspectsResultSet[i].getValue({
					name: "entityid",
					summary: "GROUP",
				});
				var custName = suspectsResultSet[i].getValue({
					name: "companyname",
					summary: "GROUP",
				});
				var zeeID = suspectsResultSet[i].getValue({
					name: "partner",
					summary: "GROUP",
				});
				var zeeName = suspectsResultSet[i].getText({
					name: "partner",
					summary: "GROUP",
				});

				var custStage = suspectsResultSet[i]
					.getText({
						name: "stage",
						summary: "GROUP",
					})
					.toUpperCase();

				var custStatusId = suspectsResultSet[i].getValue({
					name: "entitystatus",
					summary: "GROUP",
				});

				var custStatus = suspectsResultSet[i]
					.getText({
						name: "entitystatus",
						summary: "GROUP",
					})
					.toUpperCase();

				var dateLeadEntered = suspectsResultSet[i].getValue({
					name: "custentity_date_lead_entered",
					summary: "GROUP",
				});

				var quoteSentDate = suspectsResultSet[i].getValue({
					name: "custentity_date_lead_quote_sent",
					summary: "GROUP",
				});

				var dateLeadLost = suspectsResultSet[i].getValue({
					name: "custentity_date_lead_lost",
					summary: "GROUP",
				});
				var dateLeadinContact = suspectsResultSet[i].getValue({
					name: "custentity_date_prospect_in_contact",
					summary: "GROUP",
				});

				var dateProspectWon = suspectsResultSet[i].getValue({
					name: "custentity_date_prospect_opportunity",
					summary: "GROUP",
				});

				var dateLeadReassigned = suspectsResultSet[i].getValue({
					name: "custentity_date_suspect_reassign",
					summary: "GROUP",
				});

				var salesRepId = suspectsResultSet[i].getValue({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});
				var salesRepText = suspectsResultSet[i].getText({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var email48h = suspectsResultSet[i].getText({
					name: "custentity_48h_email_sent",
					summary: "GROUP",
				});

				var daysOpen = suspectsResultSet[i].getValue({
					name: "formulanumeric",
					summary: "GROUP",
				});

				var cancellationReason = suspectsResultSet[i].getText({
					name: "custentity_service_cancellation_reason",
					summary: "GROUP",
				});

				//New Cancellation Fields - Theme/What & Why
				var cancellationTheme = suspectsResultSet[i].getText({
					name: "custentity_service_cancellation_theme",
					summary: "GROUP",
				});
				var cancellationWhat = suspectsResultSet[i].getText({
					name: "custentity_service_cancellation_what",
					summary: "GROUP",
				});
				var cancellationWhy = suspectsResultSet[i].getText({
					name: "custentity_service_cancellation_why",
					summary: "GROUP",
				});


				var source = suspectsResultSet[i].getText({
					name: "leadsource",
					summary: "GROUP",
				});

				var productWeeklyUsage = suspectsResultSet[i].getText({
					name: "custentity_form_mpex_usage_per_week",
					summary: "GROUP",
				});

				var autoSignUp = suspectsResultSet[i].getValue({
					name: "custentity_auto_sign_up",
					summary: "GROUP",
				});

				var previousCarrier = suspectsResultSet[i].getText({
					name: "custentity_previous_carrier",
					summary: "GROUP",
				});

				var monthlyServiceValue = suspectsResultSet[i].getValue({
					name: "custentity_cust_monthly_service_value",
					summary: "GROUP",
				});

				var avgInvoiceValue = suspectsResultSet[i].getValue({
					name: "total",
					join: "transaction",
					summary: "AVG",
				});

				var dateLPOValidated = suspectsResultSet[i].getValue({
					name: "custentity_date_lpo_validated",
					summary: "GROUP",
				});

				var tasksInternalID = suspectsResultSet[i].getValue({
					name: "internalid",
					join: "task",
					summary: "GROUP",
				});
				var taskDate = suspectsResultSet[i].getValue({
					name: "duedate",
					join: "task",
					summary: "GROUP",
				});
				var taskTitle = suspectsResultSet[i].getValue({
					name: "title",
					join: "task",
					summary: "GROUP",
				});
				var taskAssignedTo = suspectsResultSet[i].getText({
					name: "assigned",
					join: "task",
					summary: "GROUP",
				});
				var taskAssignedTo = suspectsResultSet[i].getText({
					name: "assigned",
					join: "task",
					summary: "GROUP",
				});
				var taskStatus = suspectsResultSet[i].getText({
					name: "status",
					join: "task",
					summary: "GROUP",
				});
				var taskComment = suspectsResultSet[i].getText({
					name: "message",
					join: "task",
					summary: "GROUP",
				});

				// var userNotesInternalID = suspectsResultSet.getValue({
				// 	name: "internalid",
				// 	join: "userNotes",
				// 	summary: "GROUP",
				// });
				// var userNotesTitle = suspectsResultSet.getValue({
				// 	name: "title",
				// 	join: "userNotes",
				// 	summary: "GROUP",
				// });
				// var userNotesStartDate = suspectsResultSet.getValue({
				// 	name: "notedate",
				// 	join: "userNotes",
				// 	summary: "GROUP",
				// });
				// if (!isNullorEmpty(userNotesStartDate)) {
				// 	var userNotesStartDateTimeArray = userNotesStartDate.split(" ");
				// 	var userNotesStartDateArray =
				// 		userNotesStartDateTimeArray[0].split("/");
				// 	if (parseInt(userNotesStartDateArray[1]) < 10) {
				// 		userNotesStartDateArray[1] = "0" + userNotesStartDateArray[1];
				// 	}

				// 	if (parseInt(userNotesStartDateArray[0]) < 10) {
				// 		userNotesStartDateArray[0] = "0" + userNotesStartDateArray[0];
				// 	}
				// 	userNotesStartDate =
				// 		userNotesStartDateArray[2] +
				// 		"-" +
				// 		userNotesStartDateArray[1] +
				// 		"-" +
				// 		userNotesStartDateArray[0];
				// }
				// var userNotesOrganiser = suspectsResultSet.getText({
				// 	name: "author",
				// 	join: "userNotes",
				// 	summary: "GROUP",
				// });
				// var userNotesMessage = suspectsResultSet.getValue({
				// 	name: "note",
				// 	join: "userNotes",
				// 	summary: "GROUP",
				// });

				// console.log("userNotesInternalID: " + userNotesInternalID);
				// console.log("userNotesTitle: " + userNotesTitle);
				// console.log("userNotesStartDate: " + userNotesStartDate);
				// console.log("userNotesOrganiser: " + userNotesOrganiser);
				// console.log("userNotesMessage: " + userNotesMessage);
				console.log("custStage: " + custStage);
				console.log("custStatus: " + custStatus);

				if (!isNullorEmpty(monthlyServiceValue)) {
					monthlyServiceValue = financial(parseFloat(monthlyServiceValue));
				} else {
					monthlyServiceValue = 0.0;
				}

				if (!isNullorEmpty(avgInvoiceValue) && parseInt(avgInvoiceValue) > 0) {
					avgInvoiceValue = financial(parseFloat(avgInvoiceValue));
				} else {
					avgInvoiceValue = 0.0;
				}

				var dateLeadEnteredSplit = dateLeadEntered.split("/");
				if (parseInt(dateLeadEnteredSplit[1]) < 10) {
					dateLeadEnteredSplit[1] = "0" + dateLeadEnteredSplit[1];
				}

				if (parseInt(dateLeadEnteredSplit[0]) < 10) {
					dateLeadEnteredSplit[0] = "0" + dateLeadEnteredSplit[0];
				}
				dateLeadEntered =
					dateLeadEnteredSplit[2] +
					"-" +
					dateLeadEnteredSplit[1] +
					"-" +
					dateLeadEnteredSplit[0];

				if (!isNullorEmpty(dateLeadLost)) {
					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var dateLost = new Date(
						dateLeadLostSplit[2],
						dateLeadLostSplit[1] - 1,
						dateLeadLostSplit[0]
					);

					var difference = dateLost.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateLost.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				} else if (!isNullorEmpty(dateProspectWon)) {
					var dateProspectWonSplit = dateProspectWon.split("/");

					if (parseInt(dateProspectWonSplit[1]) < 10) {
						dateProspectWonSplit[1] = "0" + dateProspectWonSplit[1];
					}

					if (parseInt(dateProspectWonSplit[0]) < 10) {
						dateProspectWonSplit[0] = "0" + dateProspectWonSplit[0];
					}

					dateProspectWon =
						dateProspectWonSplit[2] +
						"-" +
						dateProspectWonSplit[1] +
						"-" +
						dateProspectWonSplit[0];

					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					dateProspectWon = new Date(
						dateProspectWonSplit[2],
						dateProspectWonSplit[1] - 1,
						dateProspectWonSplit[0]
					);

					var difference = dateProspectWon.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateProspectWon.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}

					dateProspectWon =
						dateProspectWonSplit[2] +
						"-" +
						dateProspectWonSplit[1] +
						"-" +
						dateProspectWonSplit[0];
				} else if (!isNullorEmpty(quoteSentDate)) {
					var dateQuoteSentSplit = quoteSentDate.split("/");

					if (parseInt(dateQuoteSentSplit[1]) < 10) {
						dateQuoteSentSplit[1] = "0" + dateQuoteSentSplit[1];
					}

					if (parseInt(dateQuoteSentSplit[0]) < 10) {
						dateQuoteSentSplit[0] = "0" + dateQuoteSentSplit[0];
					}

					quoteSentDate =
						dateQuoteSentSplit[2] +
						"-" +
						dateQuoteSentSplit[1] +
						"-" +
						dateQuoteSentSplit[0];

					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					quoteSentDate = new Date(
						dateQuoteSentSplit[2],
						dateQuoteSentSplit[1] - 1,
						dateQuoteSentSplit[0]
					);

					var difference = quoteSentDate.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = quoteSentDate.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}

					quoteSentDate =
						dateQuoteSentSplit[2] +
						"-" +
						dateQuoteSentSplit[1] +
						"-" +
						dateQuoteSentSplit[0];
				}
				if (!isNullorEmpty(dateLPOValidated)) {
					var dateLPOValidatedSplit = dateLPOValidated.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var dateValidated = new Date(
						dateLPOValidatedSplit[2],
						dateLPOValidatedSplit[1] - 1,
						dateLPOValidatedSplit[0]
					);

					var difference = dateValidated.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateValidated.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				} else {
					// var dateLeadLostSplit = dateLeadLost.split('/');
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var todayDate = new Date();

					var difference = todayDate.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = todayDate.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				}

				if (count == 0) {
					console.log("inside count == 0");

					if (!isNullorEmpty(tasksInternalID)) {
						console.log("inside usernotes internal id");
						console.log("custStage: " + custStage);
						console.log("custStatus: " + custStatus);
						if (
							custStage == "SUSPECT" &&
							custStatus != "SUSPECT-CUSTOMER - LOST" &&
							custStatus != "SUSPECT-PARKING LOT" &&
							custStatus != "SUSPECT-LOST" &&
							custStatus != "SUSPECT-OUT OF TERRITORY" &&
							custStatus != "SUSPECT-FOLLOW-UP" &&
							custStatus != "SUSPECT-QUALIFIED" &&
							custStatus != "SUSPECT-LPO FOLLOW-UP" &&
							custStatus != "SUSPECT-NO ANSWER" &&
							custStatus != "SUSPECT-IN CONTACT"
						) {
							console.log("inside suspect new");
							suspectActivityCount++;
							suspectChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							(custStatus == "SUSPECT-CUSTOMER - LOST" ||
								custStatus == "SUSPECT-LOST")
						) {
							console.log("inside suspect lost");
							suspectActivityCount++;
							suspectLostChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-PARKING LOT"
						) {
							console.log("inside suspect parking lot");
							suspectActivityCount++;
							suspectOffPeakChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-OUT OF TERRITORY"
						) {
							console.log("inside suspect OOT");
							suspectActivityCount++;
							suspectOOTChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							(custStatus == "SUSPECT-FOLLOW-UP" ||
								custStatus == "SUSPECT-LPO FOLLOW-UP")
						) {
							console.log("inside suspect follow-up");
							suspectActivityCount++;
							suspectFollowUpChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-QUALIFIED"
						) {
							console.log("inside suspect qualifeid");
							suspectActivityCount++;
							suspectQualifiedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-UNQUALIFIED"
						) {
							console.log("inside suspect unqualifeid");
							suspectActivityCount++;
							suspectUnqualifiedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-VALIDATED"
						) {
							console.log("inside suspect validated");
							suspectActivityCount++;
							suspectValidatedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-FRANCHISEE REVIEW"
						) {
							console.log("inside suspect validated");
							suspectActivityCount++;
							suspectZeeReviewChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-NO ANSWER"
						) {
							console.log("inside suspect no answer");
							suspectActivityCount++;
							suspectNoAnswerChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-IN CONTACT"
						) {
							console.log("inside SUSPECT-IN CONTACT");
							suspectActivityCount++;
							suspectInContactChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						}
					}
				} else if (count > 0 && oldcustInternalID == custInternalID) {
					console.log(
						"inside count > 0 && (oldcustInternalID == custInternalID)"
					);

					if (!isNullorEmpty(tasksInternalID)) {
						console.log("inside usernotes internal id");
						if (
							custStage == "SUSPECT" &&
							custStatus != "SUSPECT-CUSTOMER - LOST" &&
							custStatus != "SUSPECT-PARKING LOT" &&
							custStatus != "SUSPECT-LOST" &&
							custStatus != "SUSPECT-OUT OF TERRITORY" &&
							custStatus != "SUSPECT-FOLLOW-UP" &&
							custStatus != "SUSPECT-QUALIFIED" &&
							custStatus != "SUSPECT-LPO FOLLOW-UP" &&
							custStatus != "SUSPECT-NO ANSWER" &&
							custStatus != "SUSPECT-IN CONTACT"
						) {
							console.log("inside suspect new");
							suspectActivityCount++;
							suspectChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							(custStatus == "SUSPECT-CUSTOMER - LOST" ||
								custStatus == "SUSPECT-LOST")
						) {
							console.log("inside suspect lost");
							suspectActivityCount++;
							suspectLostChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-PARKING LOT"
						) {
							console.log("inside suspect parking lot");
							suspectActivityCount++;
							suspectOffPeakChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-OUT OF TERRITORY"
						) {
							console.log("inside suspect OOT");
							suspectActivityCount++;
							suspectOOTChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							(custStatus == "SUSPECT-FOLLOW-UP" ||
								custStatus == "SUSPECT-LPO FOLLOW-UP")
						) {
							console.log("inside suspect follow-up");
							suspectActivityCount++;
							suspectFollowUpChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-QUALIFIED"
						) {
							console.log("inside suspect qualifeid");
							suspectActivityCount++;
							suspectQualifiedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-UNQUALIFIED"
						) {
							console.log("inside suspect unqualifeid");
							suspectActivityCount++;
							suspectUnqualifiedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-VALIDATED"
						) {
							console.log("inside suspect validated");
							suspectActivityCount++;
							suspectValidatedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-FRANCHISEE REVIEW"
						) {
							console.log("inside suspect franchisee review");
							suspectActivityCount++;
							suspectZeeReviewChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-NO ANSWER"
						) {
							console.log("inside suspect no answer");
							suspectActivityCount++;
							suspectNoAnswerChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-IN CONTACT"
						) {
							console.log("inside SUSPECT-IN CONTACT");
							suspectActivityCount++;
							suspectInContactChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						}
					}
				} else if (count > 0 && oldcustInternalID != custInternalID) {
					if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus != "SUSPECT-CUSTOMER - LOST" &&
						oldcustStatus != "SUSPECT-PARKING LOT" &&
						oldcustStatus != "SUSPECT-LOST" &&
						oldcustStatus != "SUSPECT-OUT OF TERRITORY" &&
						oldcustStatus != "SUSPECT-FOLLOW-UP" &&
						oldcustStatus != "SUSPECT-QUALIFIED" &&
						oldcustStatus != "SUSPECT-LPO FOLLOW-UP" &&
						oldcustStatus != "SUSPECT-VALIDATED" &&
						oldcustStatus != "SUSPECT-NO ANSWER" &&
						oldcustStatus != "SUSPECT-IN CONTACT" &&
						oldcustStatus != "SUSPECT-UNQUALIFIED"
					) {
						suspectDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectChildDataSet,
						]);

						csvSuspectDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldemail48h,
							oldDaysOpen,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						(oldcustStatus == "SUSPECT-CUSTOMER - LOST" ||
							oldcustStatus == "SUSPECT-LOST")
					) {
						suspectLostDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateProspectWon,
							olddateLeadLost,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldCancellationReason,
							oldCancellationTheme,
							oldCancellationWhat,
							oldCancellationWhy,
							oldMonthServiceValue,
							oldAvgInvoiceValue,
							oldsalesRepText,
							suspectLostChildDataSet,
						]);
						csvSuspectLostDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateProspectWon,
							olddateLeadLost,
							oldemail48h,
							oldDaysOpen,
							oldCancellationReason,
							oldMonthServiceValue,
							oldAvgInvoiceValue,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-PARKING LOT"
					) {
						suspectOffPeakDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateLeadReassigned,
							olddateLeadLost,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldCancellationReason,
							oldMonthServiceValue,
							oldsalesRepText,
							suspectOffPeakChildDataSet,
						]);
						csvSuspectOffPeakDataSet.push([
							,
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateLeadReassigned,
							olddateLeadLost,
							oldemail48h,
							oldDaysOpen,
							oldCancellationReason,
							oldMonthServiceValue,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-OUT OF TERRITORY"
					) {
						suspectOOTDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateLeadReassigned,
							olddateLeadLost,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldCancellationReason,
							oldMonthServiceValue,
							oldsalesRepText,
							suspectOOTChildDataSet,
						]);

						csvSuspectOOTDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateLeadReassigned,
							olddateLeadLost,
							oldemail48h,
							oldDaysOpen,
							oldCancellationReason,
							oldMonthServiceValue,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						(oldcustStatus == "SUSPECT-FOLLOW-UP" ||
							oldcustStatus == "SUSPECT-LPO FOLLOW-UP")
					) {
						suspectFollowUpDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateLeadReassigned,
							olddateLeadLost,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldCancellationReason,
							oldMonthServiceValue,
							oldsalesRepText,
							suspectFollowUpChildDataSet,
						]);

						csvSuspectFollowUpDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							olddateLeadReassigned,
							olddateLeadLost,
							oldemail48h,
							oldDaysOpen,
							oldCancellationReason,
							oldMonthServiceValue,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-QUALIFIED"
					) {
						suspectQualifiedDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectQualifiedChildDataSet,
						]);

						csvSuspectQualifiedDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldDaysOpen,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-UNQUALIFIED"
					) {
						suspectUnqualifiedDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectQualifiedChildDataSet,
						]);

						csvSuspectQualifiedDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldDaysOpen,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-VALIDATED"
					) {
						suspectValidatedDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldDateLPOValidated,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectQualifiedChildDataSet,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-FRANCHISEE REVIEW"
					) {
						suspectZeeReviewDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldDateLPOValidated,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectZeeReviewChildDataSet,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-NO ANSWER"
					) {
						suspectNoAnswerDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectNoAnswerChildDataSet,
						]);
					} else if (
						oldcustStage == "SUSPECT" &&
						oldcustStatus == "SUSPECT-IN CONTACT"
					) {
						suspectInContactDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldPreviousCarrier,
							olddateLeadEntered,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldsalesRepText,
							suspectInContactChildDataSet,
						]);
					}
					prospectChildDataSet = [];
					prospectOpportunityChildDataSet = [];
					prospectQuoteSentChildDataSet = [];
					prospectBoxSentChildDataSet = [];
					suspectChildDataSet = [];
					suspectFollowUpChildDataSet = [];
					suspectLostChildDataSet = [];
					suspectOOTChildDataSet = [];
					suspectQualifiedChildDataSet = [];
					suspectUnqualifiedChildDataSet = [];
					suspectOffPeakChildDataSet = [];
					suspectNoAnswerChildDataSet = [];
					suspectInContactChildDataSet = [];
					suspectZeeReviewChildDataSet = [];
					suspectValidatedChildDataSet = [];

					if (!isNullorEmpty(tasksInternalID)) {
						if (
							custStage == "SUSPECT" &&
							custStatus != "SUSPECT-CUSTOMER - LOST" &&
							custStatus != "SUSPECT-PARKING LOT" &&
							custStatus != "SUSPECT-LOST" &&
							custStatus != "SUSPECT-OUT OF TERRITORY" &&
							custStatus != "SUSPECT-FOLLOW-UP" &&
							custStatus != "SUSPECT-QUALIFIED" &&
							custStatus != "SUSPECT-LPO FOLLOW-UP" &&
							custStatus != "SUSPECT-NO ANSWER" &&
							custStatus != "SUSPECT-IN CONTACT"
						) {
							suspectActivityCount++;
							suspectChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							(custStatus == "SUSPECT-CUSTOMER - LOST" ||
								custStatus == "SUSPECT-LOST")
						) {
							suspectActivityCount++;
							suspectLostChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-PARKING LOT"
						) {
							suspectActivityCount++;
							suspectOffPeakChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-OUT OF TERRITORY"
						) {
							suspectActivityCount++;
							suspectOOTChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							(custStatus == "SUSPECT-FOLLOW-UP" ||
								custStatus == "SUSPECT-LPO FOLLOW-UP")
						) {
							suspectActivityCount++;
							suspectFollowUpChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-QUALIFIED"
						) {
							suspectActivityCount++;
							suspectQualifiedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-UNQUALIFIED"
						) {
							suspectActivityCount++;
							suspectUnqualifiedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-VALIDATED"
						) {
							suspectActivityCount++;
							suspectValidatedChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-FRANCHISEE REVIEW"
						) {
							suspectActivityCount++;
							suspectZeeReviewChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-NO ANSWER"
						) {
							suspectActivityCount++;
							suspectNoAnswerChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						} else if (
							custStage == "SUSPECT" &&
							custStatus == "SUSPECT-IN CONTACT"
						) {
							suspectActivityCount++;
							suspectInContactChildDataSet.push({
								tasksInternalID: tasksInternalID,
								taskDate: taskDate,
								taskTitle: taskTitle,
								taskAssignedTo: taskAssignedTo,
								taskStatus: taskStatus,
								taskComment: taskComment,
							});
						}
					}
				}
				console.log(
					"suspectInContactChildDataSet: " + suspectInContactChildDataSet
				);
				oldcustInternalID = custInternalID;
				oldcustEntityID = custEntityID;
				oldcustName = custName;
				oldzeeID = zeeID;
				oldzeeName = zeeName;
				oldcustStage = custStage;
				oldcustStatus = custStatus;
				oldCustStatusId = custStatusId;
				olddateLeadEntered = dateLeadEntered;
				oldquoteSentDate = quoteSentDate;
				olddateLeadLost = dateLeadLost;
				olddateLeadinContact = dateLeadinContact;
				olddateProspectWon = dateProspectWon;
				oldDateLPOValidated = dateLPOValidated;
				olddateLeadReassigned = dateLeadReassigned;
				oldsalesRepId = salesRepId;
				oldsalesRepText = salesRepText;
				oldemail48h = email48h;
				oldDaysOpen = daysOpen;
				oldCancellationReason = cancellationReason;
				oldSource = source;
				oldProdWeeklyUsage = productWeeklyUsage;
				oldAutoSignUp = autoSignUp;
				oldPreviousCarrier = previousCarrier;
				oldMonthServiceValue = monthlyServiceValue;
				oldAvgInvoiceValue = avgInvoiceValue;
				oldCancellationTheme = cancellationTheme;
				oldCancellationWhat = cancellationWhat;
				oldCancellationWhy = cancellationWhy;
				count++;
			}

			if (count > 0) {
				if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus != "SUSPECT-CUSTOMER - LOST" &&
					oldcustStatus != "SUSPECT-PARKING LOT" &&
					oldcustStatus != "SUSPECT-LOST" &&
					oldcustStatus != "SUSPECT-OUT OF TERRITORY" &&
					oldcustStatus != "SUSPECT-FOLLOW-UP" &&
					oldcustStatus != "SUSPECT-QUALIFIED" &&
					oldcustStatus != "SUSPECT-LPO FOLLOW-UP" &&
					oldcustStatus != "SUSPECT-VALIDATED" &&
					oldcustStatus != "SUSPECT-NO ANSWER" &&
					oldcustStatus != "SUSPECT-IN CONTACT" &&
					oldcustStatus != "SUSPECT-UNQUALIFIED"
				) {
					suspectDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectChildDataSet,
					]);

					csvSuspectDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldemail48h,
						oldDaysOpen,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					(oldcustStatus == "SUSPECT-CUSTOMER - LOST" ||
						oldcustStatus == "SUSPECT-LOST")
				) {
					suspectLostDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateProspectWon,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldCancellationTheme,
						oldCancellationWhat,
						oldCancellationWhy,
						oldMonthServiceValue,
						oldAvgInvoiceValue,
						oldsalesRepText,
						suspectLostChildDataSet,
					]);

					csvSuspectLostDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateProspectWon,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldAvgInvoiceValue,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-PARKING LOT"
				) {
					suspectOffPeakDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
						suspectOffPeakChildDataSet,
					]);

					csvSuspectOffPeakDataSet.push([
						,
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-QUALIFIED"
				) {
					suspectQualifiedDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectQualifiedChildDataSet,
					]);

					csvSuspectQualifiedDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDaysOpen,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-UNQUALIFIED"
				) {
					suspectUnqualifiedDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectQualifiedChildDataSet,
					]);

					csvSuspectQualifiedDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDaysOpen,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-VALIDATED"
				) {
					suspectValidatedDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDateLPOValidated,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectQualifiedChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-FRANCHISEE REVIEW"
				) {
					suspectZeeReviewDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldDateLPOValidated,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectZeeReviewChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-NO ANSWER"
				) {
					suspectNoAnswerDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectNoAnswerChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-IN CONTACT"
				) {
					suspectInContactDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldsalesRepText,
						suspectInContactChildDataSet,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-OUT OF TERRITORY"
				) {
					suspectOOTDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
						suspectOOTChildDataSet,
					]);

					csvSuspectOOTDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
					]);
				} else if (
					oldcustStage == "SUSPECT" &&
					oldcustStatus == "SUSPECT-FOLLOW-UP"
				) {
					suspectFollowUpDataSet.push([
						"",
						oldcustInternalID,
						'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
						oldcustInternalID +
						'" target="_blank" style="">' +
						oldcustEntityID +
						"</a>",
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
						suspectFollowUpChildDataSet,
					]);

					csvSuspectFollowUpDataSet.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldcustStatus,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateLeadReassigned,
						olddateLeadLost,
						oldemail48h,
						oldDaysOpen,
						oldCancellationReason,
						oldMonthServiceValue,
						oldsalesRepText,
					]);
				}
			}
		}

		console.log("suspectNoAnswerDatSet: " + suspectNoAnswerDataSet);
		console.log("suspectInContactDataSet: " + suspectInContactDataSet);
		console.log("suspectLostDataSet: " + suspectLostDataSet);

		//! PROSPECT LEADS REPORTING SEARCH
		if (sales_activity_notes == 1) {
			var websiteProspectLeadsReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_5_2", //Sales Dashboard - Leads - Prospects - Reporting V2
			});
		} else {
			var websiteProspectLeadsReportingSearch = search.load({
				type: "customer",
				id: "customsearch_leads_reporting_5_2_3", //Sales Dashboard - Leads - Prospects - Reporting V2 - No Activity
			});
		}


		websiteProspectLeadsReportingSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			websiteProspectLeadsReportingSearch.filters.push(
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
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			websiteProspectLeadsReportingSearch.filters.push(
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
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			websiteProspectLeadsReportingSearch.filters.push(
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
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			websiteProspectLeadsReportingSearch.filters.push(
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
			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			websiteProspectLeadsReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				websiteProspectLeadsReportingSearch.filterExpression;

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

			websiteProspectLeadsReportingSearch.filterExpression =
				defaultSearchFilters;
		}

		var oldcustInternalID = null;
		var oldcustEntityID = null;
		var oldcustName = null;
		var oldzeeID = null;
		var oldzeeName = null;
		var oldcustStage = null;
		var oldcustStatus = null;
		var oldCustStatusId = 0;
		var olddateLeadEntered = null;
		var oldquoteSentDate = null;
		var olddateLeadLost = null;
		var olddateLeadinContact = null;
		var olddateProspectWon = null;
		var olddateLeadReassigned = null;
		var oldsalesRepId = null;
		var oldsalesRepText = null;
		var oldactivityInternalID = null;
		var oldactivityStartDate = null;
		var oldactivityTitle = null;
		var oldactivityOrganiser = null;
		var oldactivityMessage = null;
		var oldemail48h = null;
		var oldDaysOpen = null;
		var oldCancellationReason = null;
		var oldSource = null;
		var oldProdWeeklyUsage = null;
		var oldAutoSignUp = null;
		var oldPreviousCarrier = null;
		var oldMonthServiceValue = 0.0;
		var oldDateLPOValidated = null;

		var oldAvgInvoiceValue = 0.0;

		var csvSuspectDataSet = [];
		var csvSuspectLostDataSet = [];
		var csvSuspectOffPeakDataSet = [];
		var csvSuspectOOTDataSet = [];
		var csvSuspectFollowUpDataSet = [];
		var csvSuspectQualifiedDataSet = [];
		var csvProspectDataSet = [];
		var csvProspectOpportunityDataSet = [];
		var csvSuspectNoAnswerDataSet = [];
		var csvSuspectInContactDataSet = [];
		var csvProspectQuoteSentDataSet = [];

		var websiteProspectLeadsReportingSearchCount =
			websiteProspectLeadsReportingSearch.runPaged().count;

		console.log(
			"websiteProspectLeadsReportingSearchCount: " +
			websiteProspectLeadsReportingSearchCount
		);
		var count = 0;

		var custCount = 0;
		var currentSalesRecordId = null;
		var currentCustCampaign = null;
		var currentCustCampaignId = null;
		var currentLastAssigned = null;
		var currentLastAssignedId = null;

		var lastAssigned = [];
		var customerSource = [];
		var customerCampaign = [];

		websiteProspectLeadsReportingSearch
			.run()
			.each(function (prospectResultSet) {
				var custInternalID = prospectResultSet.getValue({
					name: "internalid",
					summary: "GROUP",
				});
				var custEntityID = prospectResultSet.getValue({
					name: "entityid",
					summary: "GROUP",
				});
				var custName = prospectResultSet.getValue({
					name: "companyname",
					summary: "GROUP",
				});
				var zeeID = prospectResultSet.getValue({
					name: "partner",
					summary: "GROUP",
				});
				var zeeName = prospectResultSet.getText({
					name: "partner",
					summary: "GROUP",
				});

				var custStage = prospectResultSet
					.getText({
						name: "stage",
						summary: "GROUP",
					})
					.toUpperCase();

				var custStatusId = prospectResultSet.getValue({
					name: "entitystatus",
					summary: "GROUP",
				});

				var custStatus = prospectResultSet
					.getText({
						name: "entitystatus",
						summary: "GROUP",
					})
					.toUpperCase();

				var dateLeadEntered = prospectResultSet.getValue({
					name: "custentity_date_lead_entered",
					summary: "GROUP",
				});

				var quoteSentDate = prospectResultSet.getValue({
					name: "custentity_date_lead_quote_sent",
					summary: "GROUP",
				});

				var dateLeadLost = prospectResultSet.getValue({
					name: "custentity_date_lead_lost",
					summary: "GROUP",
				});
				var dateLeadinContact = prospectResultSet.getValue({
					name: "custentity_date_prospect_in_contact",
					summary: "GROUP",
				});

				var dateProspectWon = prospectResultSet.getValue({
					name: "custentity_date_prospect_opportunity",
					summary: "GROUP",
				});

				var dateLeadReassigned = prospectResultSet.getValue({
					name: "custentity_date_suspect_reassign",
					summary: "GROUP",
				});

				var salesRepId = prospectResultSet.getValue({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});
				var salesRepText = prospectResultSet.getText({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var activityInternalID = prospectResultSet.getValue({
					name: "internalid",
					join: "activity",
					summary: "GROUP",
				});
				var activityStartDate = prospectResultSet.getValue({
					name: "startdate",
					join: "activity",
					summary: "GROUP",
				});
				if (!isNullorEmpty(activityStartDate)) {
					// var userNotesStartDateTimeArray = userNotesStartDate.split(' ');
					var activityStartDateArray = activityStartDate.split("/");
					if (parseInt(activityStartDateArray[1]) < 10) {
						activityStartDateArray[1] = "0" + activityStartDateArray[1];
					}

					if (parseInt(activityStartDateArray[0]) < 10) {
						activityStartDateArray[0] = "0" + activityStartDateArray[0];
					}
					activityStartDate =
						activityStartDateArray[2] +
						"-" +
						activityStartDateArray[1] +
						"-" +
						activityStartDateArray[0];
				}
				var activityTitle = prospectResultSet.getValue({
					name: "title",
					join: "activity",
					summary: "GROUP",
				});

				if (
					isNullorEmpty(
						prospectResultSet.getText({
							name: "custevent_organiser",
							join: "activity",
							summary: "GROUP",
						})
					)
				) {
					var activityOrganiser = prospectResultSet.getText({
						name: "assigned",
						join: "activity",
						summary: "GROUP",
					});
				} else {
					var activityOrganiser = prospectResultSet.getText({
						name: "custevent_organiser",
						join: "activity",
						summary: "GROUP",
					});
				}

				var activityMessage = prospectResultSet.getValue({
					name: "message",
					join: "activity",
					summary: "GROUP",
				});

				var email48h = prospectResultSet.getText({
					name: "custentity_48h_email_sent",
					summary: "GROUP",
				});

				var daysOpen = prospectResultSet.getValue({
					name: "formulanumeric",
					summary: "GROUP",
				});

				var cancellationReason = prospectResultSet.getText({
					name: "custentity_service_cancellation_reason",
					summary: "GROUP",
				});

				var source = prospectResultSet.getText({
					name: "leadsource",
					summary: "GROUP",
				});

				var productWeeklyUsage = prospectResultSet.getText({
					name: "custentity_form_mpex_usage_per_week",
					summary: "GROUP",
				});

				var autoSignUp = prospectResultSet.getValue({
					name: "custentity_auto_sign_up",
					summary: "GROUP",
				});

				var previousCarrier = prospectResultSet.getText({
					name: "custentity_previous_carrier",
					summary: "GROUP",
				});

				var monthlyServiceValue = prospectResultSet.getValue({
					name: "custentity_cust_monthly_service_value",
					summary: "GROUP",
				});

				var avgInvoiceValue = prospectResultSet.getValue({
					name: "total",
					join: "transaction",
					summary: "AVG",
				});

				var dateLPOValidated = prospectResultSet.getValue({
					name: "custentity_date_lpo_validated",
					summary: "GROUP",
				});

				var userNotesInternalID = prospectResultSet.getValue({
					name: "internalid",
					join: "userNotes",
					summary: "GROUP",
				});
				var userNotesTitle = prospectResultSet.getValue({
					name: "title",
					join: "userNotes",
					summary: "GROUP",
				});
				var userNotesStartDate = prospectResultSet.getValue({
					name: "notedate",
					join: "userNotes",
					summary: "GROUP",
				});
				if (!isNullorEmpty(userNotesStartDate)) {
					var userNotesStartDateTimeArray = userNotesStartDate.split(" ");
					var userNotesStartDateArray =
						userNotesStartDateTimeArray[0].split("/");
					if (parseInt(userNotesStartDateArray[1]) < 10) {
						userNotesStartDateArray[1] = "0" + userNotesStartDateArray[1];
					}

					if (parseInt(userNotesStartDateArray[0]) < 10) {
						userNotesStartDateArray[0] = "0" + userNotesStartDateArray[0];
					}
					userNotesStartDate =
						userNotesStartDateArray[2] +
						"-" +
						userNotesStartDateArray[1] +
						"-" +
						userNotesStartDateArray[0];
				}
				var userNotesOrganiser = prospectResultSet.getText({
					name: "author",
					join: "userNotes",
					summary: "GROUP",
				});
				var userNotesMessage = prospectResultSet.getValue({
					name: "note",
					join: "userNotes",
					summary: "GROUP",
				});

				var salesRepId = prospectResultSet.getValue({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});
				var salesRepText = prospectResultSet.getText({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var salesCampaignId = prospectResultSet.getValue({
					name: "custrecord_sales_campaign",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});
				var salesCampaignText = prospectResultSet.getText({
					name: "custrecord_sales_campaign",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var salesRecordInternalId = prospectResultSet.getValue({
					name: "internalid",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				if (!isNullorEmpty(monthlyServiceValue)) {
					monthlyServiceValue = financial(parseFloat(monthlyServiceValue));
				} else {
					monthlyServiceValue = 0.0;
				}

				if (!isNullorEmpty(avgInvoiceValue) && parseInt(avgInvoiceValue) > 0) {
					avgInvoiceValue = financial(parseFloat(avgInvoiceValue));
				} else {
					avgInvoiceValue = 0.0;
				}

				var dateLeadEnteredSplit = dateLeadEntered.split("/");
				if (parseInt(dateLeadEnteredSplit[1]) < 10) {
					dateLeadEnteredSplit[1] = "0" + dateLeadEnteredSplit[1];
				}

				if (parseInt(dateLeadEnteredSplit[0]) < 10) {
					dateLeadEnteredSplit[0] = "0" + dateLeadEnteredSplit[0];
				}
				dateLeadEntered =
					dateLeadEnteredSplit[2] +
					"-" +
					dateLeadEnteredSplit[1] +
					"-" +
					dateLeadEnteredSplit[0];

				if (!isNullorEmpty(dateLeadLost)) {
					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var dateLost = new Date(
						dateLeadLostSplit[2],
						dateLeadLostSplit[1] - 1,
						dateLeadLostSplit[0]
					);

					var difference = dateLost.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateLost.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				} else if (!isNullorEmpty(dateProspectWon)) {
					var dateProspectWonSplit = dateProspectWon.split("/");

					if (parseInt(dateProspectWonSplit[1]) < 10) {
						dateProspectWonSplit[1] = "0" + dateProspectWonSplit[1];
					}

					if (parseInt(dateProspectWonSplit[0]) < 10) {
						dateProspectWonSplit[0] = "0" + dateProspectWonSplit[0];
					}

					dateProspectWon =
						dateProspectWonSplit[2] +
						"-" +
						dateProspectWonSplit[1] +
						"-" +
						dateProspectWonSplit[0];

					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					dateProspectWon = new Date(
						dateProspectWonSplit[2],
						dateProspectWonSplit[1] - 1,
						dateProspectWonSplit[0]
					);

					var difference = dateProspectWon.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateProspectWon.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}

					dateProspectWon =
						dateProspectWonSplit[2] +
						"-" +
						dateProspectWonSplit[1] +
						"-" +
						dateProspectWonSplit[0];
				} else if (!isNullorEmpty(quoteSentDate)) {
					var dateQuoteSentSplit = quoteSentDate.split("/");

					if (parseInt(dateQuoteSentSplit[1]) < 10) {
						dateQuoteSentSplit[1] = "0" + dateQuoteSentSplit[1];
					}

					if (parseInt(dateQuoteSentSplit[0]) < 10) {
						dateQuoteSentSplit[0] = "0" + dateQuoteSentSplit[0];
					}

					quoteSentDate =
						dateQuoteSentSplit[2] +
						"-" +
						dateQuoteSentSplit[1] +
						"-" +
						dateQuoteSentSplit[0];

					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					quoteSentDate = new Date(
						dateQuoteSentSplit[2],
						dateQuoteSentSplit[1] - 1,
						dateQuoteSentSplit[0]
					);

					var difference = quoteSentDate.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = quoteSentDate.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}

					quoteSentDate =
						dateQuoteSentSplit[2] +
						"-" +
						dateQuoteSentSplit[1] +
						"-" +
						dateQuoteSentSplit[0];
				}
				if (!isNullorEmpty(dateLPOValidated)) {
					var dateLPOValidatedSplit = dateLPOValidated.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var dateValidated = new Date(
						dateLPOValidatedSplit[2],
						dateLPOValidatedSplit[1] - 1,
						dateLPOValidatedSplit[0]
					);

					var difference = dateValidated.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateValidated.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				} else {
					// var dateLeadLostSplit = dateLeadLost.split('/');
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var todayDate = new Date();

					var difference = todayDate.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = todayDate.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				}

				if (count == 0) {
					currentSalesRecordId = salesRecordInternalId;
					currentCustCampaign = salesCampaignText;
					currentCustCampaignId = salesCampaignId;
					currentLastAssignedId = salesRepId;
					currentLastAssigned = salesRepText;

					if (
						!isNullorEmpty(activityTitle) &&
						!isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
							prospectChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					} else if (
						!isNullorEmpty(activityTitle) &&
						isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					} else if (
						isNullorEmpty(activityTitle) &&
						!isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					}
				} else if (count > 0 && oldcustInternalID == custInternalID) {
					if (
						!isNullorEmpty(activityTitle) &&
						!isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
							prospectChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					} else if (
						!isNullorEmpty(activityTitle) &&
						isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					} else if (
						isNullorEmpty(activityTitle) &&
						!isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					}
				} else if (count > 0 && oldcustInternalID != custInternalID) {
					console.log("oldcustName: " + oldcustName);
					console.log("oldSource: " + oldSource);
					console.log("currentLastAssignedId: " + currentLastAssignedId);
					console.log("currentLastAssigned: " + currentLastAssigned);
					console.log("currentCustCampaign: " + currentCustCampaign);
					console.log("lastAssigned: " + JSON.stringify(lastAssigned));
					console.log("customerCampaign: " + JSON.stringify(customerCampaign));

					if (lastAssigned.length > 0) {
						var newRep = true;
						for (var p = 0; p < lastAssigned.length; p++) {
							if (lastAssigned[p].id == currentLastAssignedId) {
								newRep = false;
								lastAssigned[p].count = lastAssigned[p].count + 1;
								var newRepSource = true;
								for (
									var s = 0;
									s < lastAssigned[p].details[0].source.length;
									s++
								) {
									console.log("source count (s): " + s);
									console.log(
										"lastAssigned[p].details[0].source[s].name: " +
										lastAssigned[p].details[0].source[s].name
									);
									console.log(
										"lastAssigned[p].details[0].source[s].name == oldSource: " +
										lastAssigned[p].details[0].source[s].name ==
										oldSource
									);
									if (lastAssigned[p].details[0].source[s].name == oldSource) {
										newRepSource = false;
										lastAssigned[p].details[0].source[s].count =
											lastAssigned[p].details[0].source[s].count + 1;

										var newRepCampaign = true;
										for (
											var c = 0;
											c < lastAssigned[p].details[0].source[s].campaign.length;
											c++
										) {
											if (
												lastAssigned[p].details[0].source[s].campaign[c].name ==
												currentCustCampaign
											) {
												newRepCampaign = false;
												lastAssigned[p].details[0].source[s].campaign[c].count =
													lastAssigned[p].details[0].source[s].campaign[c]
														.count + 1;
											}
										}
										if (newRepCampaign == true) {
											lastAssigned[p].details[0].source[s].campaign.push({
												name: currentCustCampaign,
												count: 1,
											});
										}
									}
								}
								var newRepStatus = true;
								for (
									var st = 0;
									st < lastAssigned[p].status[0].type.length;
									st++
								) {
									if (
										lastAssigned[p].status[0].type[st].id == oldCustStatusId
									) {
										newRepStatus = false;
										lastAssigned[p].status[0].type[st].count =
											lastAssigned[p].status[0].type[st].count + 1;
									}
								}
								console.log("newRepSource: " + newRepSource);
								if (newRepSource == true) {
									lastAssigned[p].details[0].source.push({
										id: oldSourceId,
										name: oldSource,
										count: 1,
										campaign: [
											{
												id: currentCustCampaignId,
												name: currentCustCampaign,
												count: 1,
											},
										],
									});
								}
								if (newRepStatus == true) {
									lastAssigned[p].status[0].type.push({
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									});
								}
							}
						}
						if (newRep == true) {
							lastAssigned.push({
								id: currentLastAssignedId,
								name: currentLastAssigned,
								count: 1,
								status: [],
								details: [],
							});

							lastAssigned[lastAssigned.length - 1].status.push({
								type: [
									{
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									},
								],
							});

							lastAssigned[lastAssigned.length - 1].details.push({
								source: [
									{
										id: oldSourceId,
										name: oldSource,
										count: 1,
										campaign: [
											{
												id: currentCustCampaignId,
												name: currentCustCampaign,
												count: 1,
											},
										],
									},
								],
							});
						}
					} else {
						lastAssigned.push({
							id: currentLastAssignedId,
							name: currentLastAssigned,
							count: 1,
							status: [],
							details: [],
						});

						lastAssigned[lastAssigned.length - 1].status.push({
							type: [
								{
									id: oldCustStatusId,
									name: oldcustStatus,
									count: 1,
								},
							],
						});
						lastAssigned[lastAssigned.length - 1].details.push({
							source: [
								{
									id: oldSourceId,
									name: oldSource,
									count: 1,
									campaign: [
										{
											id: currentCustCampaignId,
											name: currentCustCampaign,
											count: 1,
										},
									],
								},
							],
						});
					}

					if (customerCampaign.length > 0) {
						var newCampaign = true;
						for (var p = 0; p < customerCampaign.length; p++) {
							if (customerCampaign[p].id == currentCustCampaignId) {
								newCampaign = false;
								customerCampaign[p].count = customerCampaign[p].count + 1;

								var newCampaignStatus = true;
								for (
									var st = 0;
									st < customerCampaign[p].status[0].type.length;
									st++
								) {
									if (
										customerCampaign[p].status[0].type[st].id == oldCustStatusId
									) {
										newCampaignStatus = false;
										customerCampaign[p].status[0].type[st].count =
											customerCampaign[p].status[0].type[st].count + 1;
									}
								}

								if (newCampaignStatus == true) {
									customerCampaign[p].status[0].type.push({
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									});
								}
							}
						}
						if (newCampaign == true) {
							customerCampaign.push({
								id: currentCustCampaignId,
								name: currentCustCampaign,
								count: 1,
								status: [],
							});

							customerCampaign[customerCampaign.length - 1].status.push({
								type: [
									{
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									},
								],
							});
						}
					} else {
						customerCampaign.push({
							id: currentCustCampaignId,
							name: currentCustCampaign,
							count: 1,
							status: [],
						});

						customerCampaign[customerCampaign.length - 1].status.push({
							type: [
								{
									id: oldCustStatusId,
									name: oldcustStatus,
									count: 1,
								},
							],
						});
					}

					if (customerSource.length > 0) {
						var newSource = true;
						for (var p = 0; p < customerSource.length; p++) {
							if (customerSource[p].id == oldSourceId) {
								newSource = false;
								customerSource[p].count = customerSource[p].count + 1;

								var newSourceStatus = true;
								for (
									var st = 0;
									st < customerSource[p].status[0].type.length;
									st++
								) {
									if (
										customerSource[p].status[0].type[st].id == oldCustStatusId
									) {
										newSourceStatus = false;
										customerSource[p].status[0].type[st].count =
											customerSource[p].status[0].type[st].count + 1;
									}
								}

								if (newSourceStatus == true) {
									customerSource[p].status[0].type.push({
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									});
								}
							}
						}
						if (newSource == true) {
							customerSource.push({
								id: oldSourceId,
								name: oldSource,
								count: 1,
								status: [],
							});

							customerSource[customerSource.length - 1].status.push({
								type: [
									{
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									},
								],
							});
						}
					} else {
						customerSource.push({
							id: oldSourceId,
							name: oldSource,
							count: 1,
							status: [],
						});

						customerSource[customerSource.length - 1].status.push({
							type: [
								{
									id: oldCustStatusId,
									name: oldcustStatus,
									count: 1,
								},
							],
						});
					}

					if (
						oldcustStage == "PROSPECT" &&
						oldcustStatus != "PROSPECT-QUOTE SENT" &&
						oldcustStatus != "PROSPECT-BOX SENT"
					) {
						// totalProspectCount++;
						// if (oldcustStatus == 50) {
						//     //PROSPECT - QUOTE SENT
						//     totalProspectQuoteSentCount++;
						// } else if (oldcustStatus == 35) {
						//     //PROSPECT - NO ANSWER
						//     totalProspectNoAnswerCount++
						// } else if (oldcustStatus == 8) {
						//     //PROSPECT - IN CONTACT
						//     totalProspectInContactCount++
						// }
						prospectDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldMonthServiceValue,
							oldsalesRepText,
							prospectChildDataSet,
						]);

						csvProspectDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							oldemail48h,
							oldDaysOpen,
							oldMonthServiceValue,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "PROSPECT" &&
						oldcustStatus == "PROSPECT-QUOTE SENT"
					) {
						// totalProspectCount++;
						// if (oldcustStatus == 50) {
						//     //PROSPECT - QUOTE SENT
						//     totalProspectQuoteSentCount++;
						// } else if (oldcustStatus == 35) {
						//     //PROSPECT - NO ANSWER
						//     totalProspectNoAnswerCount++
						// } else if (oldcustStatus == 8) {
						//     //PROSPECT - IN CONTACT
						//     totalProspectInContactCount++
						// }
						prospectQuoteSentDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldMonthServiceValue,
							oldsalesRepText,
							prospectQuoteSentChildDataSet,
						]);
						csvProspectQuoteSentDataSet.push([
							oldcustInternalID,
							oldcustEntityID,
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							oldemail48h,
							oldDaysOpen,
							oldMonthServiceValue,
							oldsalesRepText,
						]);
					} else if (
						oldcustStage == "PROSPECT" &&
						oldcustStatus == "PROSPECT-BOX SENT"
					) {
						// totalProspectCount++;
						// if (oldcustStatus == 50) {
						//     //PROSPECT - QUOTE SENT
						//     totalProspectQuoteSentCount++;
						// } else if (oldcustStatus == 35) {
						//     //PROSPECT - NO ANSWER
						//     totalProspectNoAnswerCount++
						// } else if (oldcustStatus == 8) {
						//     //PROSPECT - IN CONTACT
						//     totalProspectInContactCount++
						// }
						prospectBoxSentDataSet.push([
							"",
							oldcustInternalID,
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>",
							oldcustName,
							oldzeeName,
							oldcustStatus,
							oldSource,
							oldProdWeeklyUsage,
							oldPreviousCarrier,
							olddateLeadEntered,
							oldquoteSentDate,
							oldemail48h,
							'<input type="button" value="' +
							oldDaysOpen +
							'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
							oldcustInternalID +
							'" style="background-color: #095C7B;border-radius: 30px">',
							oldMonthServiceValue,
							oldsalesRepText,
							prospectBoxSentChildDataSet,
						]);
					}

					prospectChildDataSet = [];
					prospectOpportunityChildDataSet = [];
					prospectQuoteSentChildDataSet = [];
					suspectChildDataSet = [];
					suspectFollowUpChildDataSet = [];
					suspectLostChildDataSet = [];
					suspectOOTChildDataSet = [];
					suspectQualifiedChildDataSet = [];
					suspectOffPeakChildDataSet = [];
					suspectNoAnswerChildDataSet = [];
					suspectInContactChildDataSet = [];

					existingCustomer = false;
					custCount = 0;

					currentSalesRecordId = null;
					currentCustCampaign = null;
					currentCustCampaignId = null;
					currentLastAssigned = null;
					currentLastAssignedId = null;

					currentSalesRecordId = salesRecordInternalId;
					currentCustCampaign = salesCampaignText;
					currentCustCampaignId = salesCampaignId;
					currentLastAssignedId = salesRepId;
					currentLastAssigned = salesRepText;

					if (
						!isNullorEmpty(activityTitle) &&
						!isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
							prospectChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					} else if (
						!isNullorEmpty(activityTitle) &&
						isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					} else if (
						isNullorEmpty(activityTitle) &&
						!isNullorEmpty(userNotesInternalID)
					) {
						if (
							custStage == "PROSPECT" &&
							custStatus != "PROSPECT-QUOTE SENT" &&
							custStatus != "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-QUOTE SENT"
						) {
							prospectActivityCount++;
							prospectQuoteSentChildDataSet.push({
								activityInternalID: userNotesInternalID,
								activityStartDate: userNotesStartDate,
								activityTitle: userNotesTitle,
								activityOrganiser: userNotesOrganiser,
								activityMessage: userNotesMessage,
							});
						} else if (
							custStage == "PROSPECT" &&
							custStatus == "PROSPECT-BOX SENT"
						) {
							prospectActivityCount++;
							prospectBoxSentChildDataSet.push({
								activityInternalID: activityInternalID,
								activityStartDate: activityStartDate,
								activityTitle: activityTitle,
								activityOrganiser: activityOrganiser,
								activityMessage: activityMessage,
							});
						}
					}
				}

				oldcustInternalID = custInternalID;
				oldcustEntityID = custEntityID;
				oldcustName = custName;
				oldzeeID = zeeID;
				oldzeeName = zeeName;
				oldcustStage = custStage;
				oldcustStatus = custStatus;
				oldCustStatusId = custStatusId;
				olddateLeadEntered = dateLeadEntered;
				oldquoteSentDate = quoteSentDate;
				olddateLeadLost = dateLeadLost;
				olddateLeadinContact = dateLeadinContact;
				olddateProspectWon = dateProspectWon;
				oldDateLPOValidated = dateLPOValidated;
				olddateLeadReassigned = dateLeadReassigned;
				oldsalesRepId = salesRepId;
				oldsalesRepText = salesRepText;
				oldactivityInternalID = activityInternalID;
				oldactivityStartDate = activityStartDate;
				oldactivityTitle = activityTitle;
				oldactivityOrganiser = activityOrganiser;
				oldactivityMessage = activityMessage;
				oldemail48h = email48h;
				oldDaysOpen = daysOpen;
				oldCancellationReason = cancellationReason;
				oldSource = source;
				oldProdWeeklyUsage = productWeeklyUsage;
				oldAutoSignUp = autoSignUp;
				oldPreviousCarrier = previousCarrier;
				oldMonthServiceValue = monthlyServiceValue;
				oldAvgInvoiceValue = avgInvoiceValue;
				count++;
				return true;
			});

		if (count > 0) {
			console.log("oldcustName: " + oldcustName);
			console.log("oldSource: " + oldSource);
			console.log("currentLastAssignedId: " + currentLastAssignedId);
			console.log("currentLastAssigned: " + currentLastAssigned);
			console.log("currentCustCampaign: " + currentCustCampaign);
			console.log("lastAssigned: " + JSON.stringify(lastAssigned));
			console.log("customerCampaign: " + JSON.stringify(customerCampaign));

			if (lastAssigned.length > 0) {
				var newRep = true;
				for (var p = 0; p < lastAssigned.length; p++) {
					if (lastAssigned[p].id == currentLastAssignedId) {
						newRep = false;
						lastAssigned[p].count = lastAssigned[p].count + 1;
						var newRepSource = true;
						for (var s = 0; s < lastAssigned[p].details[0].source.length; s++) {
							console.log("source count (s): " + s);
							console.log(
								"lastAssigned[p].details[0].source[s].name: " +
								lastAssigned[p].details[0].source[s].name
							);
							console.log(
								"lastAssigned[p].details[0].source[s].name == oldSource: " +
								lastAssigned[p].details[0].source[s].name ==
								oldSource
							);
							if (lastAssigned[p].details[0].source[s].name == oldSource) {
								newRepSource = false;
								lastAssigned[p].details[0].source[s].count =
									lastAssigned[p].details[0].source[s].count + 1;

								var newRepCampaign = true;
								for (
									var c = 0;
									c < lastAssigned[p].details[0].source[s].campaign.length;
									c++
								) {
									if (
										lastAssigned[p].details[0].source[s].campaign[c].name ==
										currentCustCampaign
									) {
										newRepCampaign = false;
										lastAssigned[p].details[0].source[s].campaign[c].count =
											lastAssigned[p].details[0].source[s].campaign[c].count +
											1;
									}
								}
								if (newRepCampaign == true) {
									lastAssigned[p].details[0].source[s].campaign.push({
										name: currentCustCampaign,
										count: 1,
									});
								}
							}
						}
						var newRepStatus = true;
						for (var st = 0; st < lastAssigned[p].status[0].type.length; st++) {
							if (lastAssigned[p].status[0].type[st].id == oldCustStatusId) {
								newRepStatus = false;
								lastAssigned[p].status[0].type[st].count =
									lastAssigned[p].status[0].type[st].count + 1;
							}
						}
						console.log("newRepSource: " + newRepSource);
						if (newRepSource == true) {
							lastAssigned[p].details[0].source.push({
								id: oldSourceId,
								name: oldSource,
								count: 1,
								campaign: [
									{
										id: currentCustCampaignId,
										name: currentCustCampaign,
										count: 1,
									},
								],
							});
						}
						if (newRepStatus == true) {
							lastAssigned[p].status[0].type.push({
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							});
						}
					}
				}
				if (newRep == true) {
					lastAssigned.push({
						id: currentLastAssignedId,
						name: currentLastAssigned,
						count: 1,
						status: [],
						details: [],
					});

					lastAssigned[lastAssigned.length - 1].status.push({
						type: [
							{
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							},
						],
					});

					lastAssigned[lastAssigned.length - 1].details.push({
						source: [
							{
								id: oldSourceId,
								name: oldSource,
								count: 1,
								campaign: [
									{
										id: currentCustCampaignId,
										name: currentCustCampaign,
										count: 1,
									},
								],
							},
						],
					});
				}
			} else {
				lastAssigned.push({
					id: currentLastAssignedId,
					name: currentLastAssigned,
					count: 1,
					status: [],
					details: [],
				});

				lastAssigned[lastAssigned.length - 1].status.push({
					type: [
						{
							id: oldCustStatusId,
							name: oldcustStatus,
							count: 1,
						},
					],
				});
				lastAssigned[lastAssigned.length - 1].details.push({
					source: [
						{
							id: oldSourceId,
							name: oldSource,
							count: 1,
							campaign: [
								{
									id: currentCustCampaignId,
									name: currentCustCampaign,
									count: 1,
								},
							],
						},
					],
				});
			}

			if (customerCampaign.length > 0) {
				var newCampaign = true;
				for (var p = 0; p < customerCampaign.length; p++) {
					if (customerCampaign[p].id == currentCustCampaignId) {
						newCampaign = false;
						customerCampaign[p].count = customerCampaign[p].count + 1;

						var newCampaignStatus = true;
						for (
							var st = 0;
							st < customerCampaign[p].status[0].type.length;
							st++
						) {
							if (
								customerCampaign[p].status[0].type[st].id == oldCustStatusId
							) {
								newCampaignStatus = false;
								customerCampaign[p].status[0].type[st].count =
									customerCampaign[p].status[0].type[st].count + 1;
							}
						}

						if (newCampaignStatus == true) {
							customerCampaign[p].status[0].type.push({
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							});
						}
					}
				}
				if (newCampaign == true) {
					customerCampaign.push({
						id: currentCustCampaignId,
						name: currentCustCampaign,
						count: 1,
						status: [],
					});

					customerCampaign[customerCampaign.length - 1].status.push({
						type: [
							{
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							},
						],
					});
				}
			} else {
				customerCampaign.push({
					id: currentCustCampaignId,
					name: currentCustCampaign,
					count: 1,
					status: [],
				});

				customerCampaign[customerCampaign.length - 1].status.push({
					type: [
						{
							id: oldCustStatusId,
							name: oldcustStatus,
							count: 1,
						},
					],
				});
			}

			if (customerSource.length > 0) {
				var newSource = true;
				for (var p = 0; p < customerSource.length; p++) {
					if (customerSource[p].id == oldSourceId) {
						newSource = false;
						customerSource[p].count = customerSource[p].count + 1;

						var newSourceStatus = true;
						for (
							var st = 0;
							st < customerSource[p].status[0].type.length;
							st++
						) {
							if (customerSource[p].status[0].type[st].id == oldCustStatusId) {
								newSourceStatus = false;
								customerSource[p].status[0].type[st].count =
									customerSource[p].status[0].type[st].count + 1;
							}
						}

						if (newSourceStatus == true) {
							customerSource[p].status[0].type.push({
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							});
						}
					}
				}
				if (newSource == true) {
					customerSource.push({
						id: oldSourceId,
						name: oldSource,
						count: 1,
						status: [],
					});

					customerSource[customerSource.length - 1].status.push({
						type: [
							{
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							},
						],
					});
				}
			} else {
				customerSource.push({
					id: oldSourceId,
					name: oldSource,
					count: 1,
					status: [],
				});

				customerSource[customerSource.length - 1].status.push({
					type: [
						{
							id: oldCustStatusId,
							name: oldcustStatus,
							count: 1,
						},
					],
				});
			}

			if (
				oldcustStage == "PROSPECT" &&
				oldcustStatus != "PROSPECT-QUOTE SENT" &&
				oldcustStatus != "PROSPECT-BOX SENT"
			) {
				// totalProspectCount++;
				// if (oldcustStatus == 50) {
				//     //PROSPECT - QUOTE SENT
				//     totalProspectQuoteSentCount++;
				// } else if (oldcustStatus == 35) {
				//     //PROSPECT - NO ANSWER
				//     totalProspectNoAnswerCount++
				// } else if (oldcustStatus == 8) {
				//     //PROSPECT - IN CONTACT
				//     totalProspectInContactCount++
				// }
				prospectDataSet.push([
					"",
					oldcustInternalID,
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					oldcustInternalID +
					'" target="_blank" style="">' +
					oldcustEntityID +
					"</a>",
					oldcustName,
					oldzeeName,
					oldcustStatus,
					oldSource,
					oldProdWeeklyUsage,
					oldPreviousCarrier,
					olddateLeadEntered,
					oldquoteSentDate,
					oldemail48h,
					'<input type="button" value="' +
					oldDaysOpen +
					'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
					oldcustInternalID +
					'" style="background-color: #095C7B;border-radius: 30px">',
					oldMonthServiceValue,
					oldsalesRepText,
					prospectChildDataSet,
				]);

				csvProspectDataSet.push([
					oldcustInternalID,
					oldcustEntityID,
					oldcustName,
					oldzeeName,
					oldcustStatus,
					oldSource,
					oldProdWeeklyUsage,
					oldPreviousCarrier,
					olddateLeadEntered,
					oldquoteSentDate,
					oldemail48h,
					oldDaysOpen,
					oldMonthServiceValue,
					oldsalesRepText,
				]);
			} else if (
				oldcustStage == "PROSPECT" &&
				oldcustStatus == "PROSPECT-QUOTE SENT"
			) {
				// totalProspectCount++;
				// if (oldcustStatus == 50) {
				//     //PROSPECT - QUOTE SENT
				//     totalProspectQuoteSentCount++;
				// } else if (oldcustStatus == 35) {
				//     //PROSPECT - NO ANSWER
				//     totalProspectNoAnswerCount++
				// } else if (oldcustStatus == 8) {
				//     //PROSPECT - IN CONTACT
				//     totalProspectInContactCount++
				// }
				prospectQuoteSentDataSet.push([
					"",
					oldcustInternalID,
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					oldcustInternalID +
					'" target="_blank" style="">' +
					oldcustEntityID +
					"</a>",
					oldcustName,
					oldzeeName,
					oldcustStatus,
					oldSource,
					oldProdWeeklyUsage,
					oldPreviousCarrier,
					olddateLeadEntered,
					oldquoteSentDate,
					oldemail48h,
					'<input type="button" value="' +
					oldDaysOpen +
					'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
					oldcustInternalID +
					'" style="background-color: #095C7B;border-radius: 30px">',
					oldMonthServiceValue,
					oldsalesRepText,
					prospectQuoteSentChildDataSet,
				]);
				csvProspectQuoteSentDataSet.push([
					oldcustInternalID,
					oldcustEntityID,
					oldcustName,
					oldzeeName,
					oldcustStatus,
					oldSource,
					oldProdWeeklyUsage,
					oldPreviousCarrier,
					olddateLeadEntered,
					oldquoteSentDate,
					oldemail48h,
					oldDaysOpen,
					oldMonthServiceValue,
					oldsalesRepText,
				]);
			} else if (
				oldcustStage == "PROSPECT" &&
				oldcustStatus == "PROSPECT-BOX SENT"
			) {
				// totalProspectCount++;
				// if (oldcustStatus == 50) {
				//     //PROSPECT - QUOTE SENT
				//     totalProspectQuoteSentCount++;
				// } else if (oldcustStatus == 35) {
				//     //PROSPECT - NO ANSWER
				//     totalProspectNoAnswerCount++
				// } else if (oldcustStatus == 8) {
				//     //PROSPECT - IN CONTACT
				//     totalProspectInContactCount++
				// }
				prospectBoxSentDataSet.push([
					"",
					oldcustInternalID,
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					oldcustInternalID +
					'" target="_blank" style="">' +
					oldcustEntityID +
					"</a>",
					oldcustName,
					oldzeeName,
					oldcustStatus,
					oldSource,
					oldProdWeeklyUsage,
					oldPreviousCarrier,
					olddateLeadEntered,
					oldquoteSentDate,
					oldemail48h,
					'<input type="button" value="' +
					oldDaysOpen +
					'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
					oldcustInternalID +
					'" style="background-color: #095C7B;border-radius: 30px">',
					oldMonthServiceValue,
					oldsalesRepText,
					prospectBoxSentChildDataSet,
				]);
			}
		}

		console.log("PROSPECTS - QUOTE SENT & OPPORTUNITY");
		console.log("lastAssigned: " + JSON.stringify(lastAssigned));
		console.log("customerCampaign: " + JSON.stringify(customerCampaign));
		console.log("customerSource: " + JSON.stringify(customerSource));

		//!
		var series_data_signed_source = [];
		var series_data_signed_campaign = [];
		var series_data_quote_sent = [];
		var series_data_box_sent = [];
		var series_data_opportunities = [];
		var series_data_free_trial = [];
		var lastAssignedTeamMemberCategories = [];
		var dataCaptureTeamMemberLPOCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var dataQuoteSent = new Array(lastAssigned.length).fill(0);
		var dataOpportunities = new Array(lastAssigned.length).fill(0);
		var dataBoxSent = new Array(lastAssigned.length).fill(0);
		for (var x = 0; x < lastAssigned.length; x++) {
			lastAssignedTeamMemberCategories[x] = lastAssigned[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + lastAssigned[x].name);
			console.log(
				"details: " + JSON.stringify(lastAssigned[x].details[0].source)
			);

			for (y = 0; y < lastAssigned[x].status[0].type.length; y++) {
				console.log("Status Name: " + lastAssigned[x].status[0].type[y].name);
				console.log("Status Count: " + lastAssigned[x].status[0].type[y].count);

				if (lastAssigned[x].status[0].type[y].id == 50) {
					console.log(
						"before series_data_quote_sent: " +
						JSON.stringify(series_data_quote_sent)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_quote_sent.length; j++) {
						if (
							series_data_quote_sent[j].name ==
							lastAssigned[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_quote_sent[j].data[x] =
								lastAssigned[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						dataQuoteSent = new Array(lastAssigned.length).fill(0);
						dataQuoteSent[x] = lastAssigned[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_quote_sent.push({
							name: lastAssigned[x].status[0].type[y].name,
							data: dataQuoteSent,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (lastAssigned[x].status[0].type[y].id == 72) {
					console.log(
						"before series_data_box_sent: " +
						JSON.stringify(series_data_box_sent)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_box_sent.length; j++) {
						if (
							series_data_box_sent[j].name ==
							lastAssigned[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_box_sent[j].data[x] =
								lastAssigned[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						dataBoxSent = new Array(lastAssigned.length).fill(0);
						dataBoxSent[x] = lastAssigned[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_box_sent.push({
							name: lastAssigned[x].status[0].type[y].name,
							data: dataBoxSent,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (lastAssigned[x].status[0].type[y].id == 58) {
					console.log(
						"before series_data_opportunities: " +
						JSON.stringify(series_data_opportunities)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_opportunities.length; j++) {
						if (
							series_data_opportunities[j].name ==
							lastAssigned[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_opportunities[j].data[x] =
								lastAssigned[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						dataOpportunities = new Array(lastAssigned.length).fill(0);
						dataOpportunities[x] = lastAssigned[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_opportunities.push({
							name: lastAssigned[x].status[0].type[y].name,
							data: dataOpportunities,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}
			}
		}
		console.log(
			"lastAssignedTeamMemberCategories: " +
			JSON.stringify(lastAssignedTeamMemberCategories)
		);
		console.log(
			"series_data_quote_sent: " + JSON.stringify(series_data_quote_sent)
		);
		console.log(
			"series_data_box_sent: " + JSON.stringify(series_data_box_sent)
		);
		plotChartQuoteSentByLastAssigned(
			series_data_quote_sent,
			null,
			lastAssignedTeamMemberCategories
		);
		plotChartBoxSentByLastAssigned(
			series_data_box_sent,
			null,
			lastAssignedTeamMemberCategories
		);
		plotChartOpportunityByLastAssigned(
			series_data_opportunities,
			null,
			lastAssignedTeamMemberCategories
		);

		//!
		var series_data_signed_source = [];
		var series_data_signed_campaign = [];
		var series_data_campaign_quote_sent = [];
		var series_data_campaign_box_sent = [];
		var series_data_campaign_opportunities = [];

		var campaignCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var campaignQuoteSent = new Array(customerCampaign.length).fill(0);
		var campaignBoxSent = new Array(customerCampaign.length).fill(0);
		var campaignOpportunites = new Array(customerCampaign.length).fill(0);
		var campaignFreeTrialPending = new Array(customerCampaign.length).fill(0);
		for (var x = 0; x < customerCampaign.length; x++) {
			campaignCategories[x] = customerCampaign[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + customerCampaign[x].name);
			// console.log('details: ' + JSON.stringify(customerCampaign[x].details[0].source));

			for (y = 0; y < customerCampaign[x].status[0].type.length; y++) {
				console.log(
					"Status Name: " + customerCampaign[x].status[0].type[y].name
				);
				console.log(
					"Status Count: " + customerCampaign[x].status[0].type[y].count
				);

				if (customerCampaign[x].status[0].type[y].id == 50) {
					console.log(
						"before series_data_campaign_quote_sent: " +
						JSON.stringify(series_data_campaign_quote_sent)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_campaign_quote_sent.length; j++) {
						if (
							series_data_campaign_quote_sent[j].name ==
							customerCampaign[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_campaign_quote_sent[j].data[x] =
								customerCampaign[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						campaignQuoteSent = new Array(customerCampaign.length).fill(0);
						campaignQuoteSent[x] = customerCampaign[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_campaign_quote_sent.push({
							name: customerCampaign[x].status[0].type[y].name,
							data: campaignQuoteSent,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerCampaign[x].status[0].type[y].id == 72) {
					console.log(
						"before series_data_campaign_box_sent: " +
						JSON.stringify(series_data_campaign_box_sent)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_campaign_box_sent.length; j++) {
						if (
							series_data_campaign_box_sent[j].name ==
							customerCampaign[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_campaign_box_sent[j].data[x] =
								customerCampaign[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						campaignBoxSent = new Array(customerCampaign.length).fill(0);
						campaignBoxSent[x] = customerCampaign[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_campaign_box_sent.push({
							name: customerCampaign[x].status[0].type[y].name,
							data: campaignBoxSent,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerCampaign[x].status[0].type[y].id == 58) {
					console.log(
						"before series_data_campaign_opportunities: " +
						JSON.stringify(series_data_campaign_opportunities)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_campaign_opportunities.length; j++) {
						if (
							series_data_campaign_opportunities[j].name ==
							customerCampaign[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_campaign_opportunities[j].data[x] =
								customerCampaign[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						campaignOpportunites = new Array(customerCampaign.length).fill(0);
						campaignOpportunites[x] =
							customerCampaign[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_campaign_opportunities.push({
							name: customerCampaign[x].status[0].type[y].name,
							data: campaignOpportunites,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				// console.log('after series_data_source: ' + JSON.stringify(series_data_source));
			}
		}
		plotChartQuoteSentByCampaign(
			series_data_campaign_quote_sent,
			null,
			campaignCategories
		);
		plotChartBoxSentByCampaign(
			series_data_campaign_box_sent,
			null,
			campaignCategories
		);
		plotChartOpportunityByCampaign(
			series_data_campaign_opportunities,
			null,
			campaignCategories
		);

		//!
		//!
		var series_data_signed_source = [];
		var series_data_signed_campaign = [];
		var series_data_source_quote_sent = [];
		var series_data_source_box_sent = [];
		var series_data_source_opportunities = [];

		var sourceCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var sourceQuoteSent = new Array(customerSource.length).fill(0);
		var sourceBoxSent = new Array(customerSource.length).fill(0);
		var sourceOpportunities = new Array(customerSource.length).fill(0);
		for (var x = 0; x < customerSource.length; x++) {
			sourceCategories[x] = customerSource[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + customerSource[x].name);
			// console.log('details: ' + JSON.stringify(customerSource[x].details[0].source));

			for (y = 0; y < customerSource[x].status[0].type.length; y++) {
				console.log("Status Name: " + customerSource[x].status[0].type[y].name);
				console.log(
					"Status Count: " + customerSource[x].status[0].type[y].count
				);

				if (customerSource[x].status[0].type[y].id == 50) {
					console.log(
						"before series_data_source_quote_sent: " +
						JSON.stringify(series_data_source_quote_sent)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_source_quote_sent.length; j++) {
						if (
							series_data_source_quote_sent[j].name ==
							customerSource[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_source_quote_sent[j].data[x] =
								customerSource[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						sourceQuoteSent = new Array(customerSource.length).fill(0);
						sourceQuoteSent[x] = customerSource[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_source_quote_sent.push({
							name: customerSource[x].status[0].type[y].name,
							data: sourceQuoteSent,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerSource[x].status[0].type[y].id == 72) {
					console.log(
						"before series_data_source_box_sent: " +
						JSON.stringify(series_data_source_box_sent)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_source_box_sent.length; j++) {
						if (
							series_data_source_box_sent[j].name ==
							customerSource[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_source_quote_sent[j].data[x] =
								customerSource[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						sourceBoxSent = new Array(customerSource.length).fill(0);
						sourceBoxSent[x] = customerSource[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_source_box_sent.push({
							name: customerSource[x].status[0].type[y].name,
							data: sourceBoxSent,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerSource[x].status[0].type[y].id == 58) {
					console.log(
						"before series_data_source_opportunities: " +
						JSON.stringify(series_data_source_opportunities)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_source_opportunities.length; j++) {
						if (
							series_data_source_opportunities[j].name ==
							customerSource[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_source_opportunities[j].data[x] =
								customerSource[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						sourceOpportunities = new Array(customerSource.length).fill(0);
						sourceOpportunities[x] = customerSource[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_source_opportunities.push({
							name: customerSource[x].status[0].type[y].name,
							data: sourceOpportunities,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}
			}
		}
		plotChartQuoteSentBySource(
			series_data_source_quote_sent,
			null,
			sourceCategories
		);
		plotChartBoxSentBySource(
			series_data_source_box_sent,
			null,
			sourceCategories
		);
		plotChartOpportunityBySource(
			series_data_source_opportunities,
			null,
			sourceCategories
		);

		console.log("prospects hidden");

		var websiteCustomersReportingSearch = search.load({
			type: "customer",
			// id: 'customsearch_leads_reporting_4' //Website Leads - Customer Signed - Reporting
			// id: 'customsearch_leads_reporting_4_2' //Website Leads - Customer Signed - Reporting V2
			id: "customsearch_leads_reporting_4_2_3", //Sales Dashboard - Leads - Customer Signed - Reporting 202408
		});

		websiteCustomersReportingSearch.filters.push(
			search.createFilter({
				name: "custrecord_salesrep",
				join: "CUSTRECORD_CUSTOMER",
				operator: search.Operator.NONEOF,
				values: [109783],
			})
		);

		if (customer_type == "2") {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "TEST",
				})
			);
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTCONTAIN,
					values: "- Parent",
				})
			);
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Shippit Pty Ltd ",
				})
			);
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "Sendle",
				})
			);
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "companyname",
					join: null,
					operator: search.Operator.DOESNOTSTARTWITH,
					values: "SC -",
				})
			);
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_np_np_customer",
					join: null,
					operator: search.Operator.ANYOF,
					values: "@NONE@",
				})
			);
		}

		if (!isNullorEmpty(leadStatus)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "entitystatus",
					join: null,
					operator: search.Operator.IS,
					values: leadStatus,
				})
			);
		}

		if (!isNullorEmpty(zee_id)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_entered",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_from,
				})
			);

			websiteCustomersReportingSearch.filters.push(
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
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: date_signed_up_from,
				})
			);

			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date_signup",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORBEFORE,
					values: date_signed_up_to,
				})
			);

			// websiteCustomersReportingSearch.filters.push(
			// 	search.createFilter({
			// 		name: "custrecord_sale_type",
			// 		join: "CUSTRECORD_CUSTOMER",
			// 		operator: search.Operator.ANYOF,
			// 		values: [1, 5, 11],
			// 	})
			// );
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			websiteCustomersReportingSearch.filters.push(
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
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: cancelled_start_date,
				})
			);

			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity13",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: cancelled_last_date,
				})
			);
		}

		if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "trandate",
					join: "transaction",
					operator: search.Operator.ONORAFTER,
					values: invoice_date_from,
				})
			);

			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "trandate",
					join: "transaction",
					operator: search.Operator.ONORBEFORE,
					values: invoice_date_to,
				})
			);
		}

		if (!isNullorEmpty(lead_source)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "leadsource",
					join: null,
					operator: search.Operator.IS,
					values: lead_source,
				})
			);
		}

		if (!isNullorEmpty(sales_rep)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_assigned",
					join: "custrecord_sales_customer",
					operator: search.Operator.IS,
					values: sales_rep,
				})
			);
		}

		if (!isNullorEmpty(lead_entered_by)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_lead_entered_by",
					join: null,
					operator: search.Operator.IS,
					values: lead_entered_by,
				})
			);
		}

		if (!isNullorEmpty(sales_campaign)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custrecord_sales_campaign",
					join: "custrecord_sales_customer",
					operator: search.Operator.ANYOF,
					values: sales_campaign,
				})
			);
		}

		if (!isNullorEmpty(parent_lpo)) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: "custentity_lpo_parent_account",
					operator: search.Operator.ANYOF,
					values: parent_lpo,
				})
			);
		}

		if (!isNullorEmpty(invoice_type)) {
			if (invoice_type == "2") {
				websiteCustomersReportingSearch.filters.push(
					search.createFilter({
						name: "trandate",
						join: "transaction",
						operator: search.Operator.ANYOF,
						values: 8,
					})
				);
			} else if (invoice_type == "1") {
				websiteCustomersReportingSearch.filters.push(
					search.createFilter({
						name: "custbody_inv_type",
						join: "transaction",
						operator: search.Operator.ANYOF,
						values: "@NONE@",
					})
				);
			}
		}

		if (
			!isNullorEmpty(date_quote_sent_from) &&
			!isNullorEmpty(date_quote_sent_to)
		) {
			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORAFTER,
					values: date_quote_sent_from,
				})
			);

			websiteCustomersReportingSearch.filters.push(
				search.createFilter({
					name: "custentity_date_lead_quote_sent",
					join: null,
					operator: search.Operator.ONORBEFORE,
					values: date_quote_sent_to,
				})
			);
		}

		if (
			!isNullorEmpty(modified_date_from) &&
			!isNullorEmpty(modified_date_to)
		) {
			var defaultSearchFilters =
				websiteCustomersReportingSearch.filterExpression;

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
			];

			console.log(
				"modifiedDateFilters filters: " + JSON.stringify(modifiedDateFilters)
			);

			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(modifiedDateFilters);

			console.log(
				"signed customer defaultSearchFilters filters: " +
				JSON.stringify(defaultSearchFilters)
			);

			websiteCustomersReportingSearch.filterExpression = defaultSearchFilters;
		}

		var oldcustInternalID = null;
		var oldcustEntityID = null;
		var oldcustName = null;
		var oldzeeID = null;
		var oldzeeName = null;
		var oldcustStage = null;
		var oldcustStatus = null;
		var oldCustStatusId = 0;
		var olddateLeadEntered = null;
		var oldquoteSentDate = null;
		var olddateLeadLost = null;
		var olddateLeadinContact = null;
		var olddateProspectWon = null;
		var olddateLeadReassigned = null;
		var oldsalesRepId = null;
		var oldsalesRepText = null;
		var oldactivityInternalID = null;
		var oldactivityStartDate = null;
		var oldactivityTitle = null;
		var oldactivityOrganiser = null;
		var oldactivityMessage = null;
		var oldemail48h = null;
		var oldDaysOpen = null;
		var oldCancellationReason = null;
		var oldSource = null;
		var oldProdWeeklyUsage = null;
		var oldAutoSignUp = null;
		var oldPreviousCarrier = null;
		var oldMonthServiceValue = 0.0;
		var oldMonthlyReductionServiceValue = 0.0;
		var oldMonthlyExtraServiceValue = 0.0;
		var oldMinCommDate = null;
		var oldTnCAgreedDate = null;
		var oldZeeVisitedDate = null;
		var oldLPOCommsToCustomer = null;
		var oldGiftBoxActivated = null;

		var oldInvoiceNumber = null;
		var oldinvoiceDate = null;
		var oldInvoiceType = null;
		var oldInvoiceAmount = null;
		var oldInvoiceStatus = null;
		var oldInvoiceItem = null;

		var invoiceTotal = 0.0;
		var invoiceServiceTotal = 0.0;
		var invoiceProductsTotal = 0.0;
		var showInvoice = true;

		var oldTrialEndDate = null;

		var existingCustomer = false;
		var oldExistingCustomer;

		var oldLeadEnteredById = null;
		var oldLeadEnteredByText = null;

		var oldSourceId = null;

		var count = 0;

		csvCustomerSignedExport = [];
		csvExistingCustomerSignedExport = [];
		csvTrialCustomerSignedExport = [];

		var custCount = 0;
		var currentSalesRecordId = null;
		var currentCustCampaign = null;
		var currentCustCampaignId = null;
		var currentLastAssigned = null;
		var currentLastAssignedId = null;

		var lastAssigned = [];
		var customerSource = [];
		var customerCampaign = [];

		websiteCustomersReportingSearch
			.run()
			.each(function (custListCommenceTodaySet) {
				var custInternalID = custListCommenceTodaySet.getValue({
					name: "internalid",
					summary: "GROUP",
				});
				var custEntityID = custListCommenceTodaySet.getValue({
					name: "entityid",
					summary: "GROUP",
				});
				var custName = custListCommenceTodaySet.getValue({
					name: "companyname",
					summary: "GROUP",
				});
				var zeeID = custListCommenceTodaySet.getValue({
					name: "partner",
					summary: "GROUP",
				});
				var zeeName = custListCommenceTodaySet.getText({
					name: "partner",
					summary: "GROUP",
				});

				var custStage = custListCommenceTodaySet
					.getText({
						name: "stage",
						summary: "GROUP",
					})
					.toUpperCase();

				var custStatusId = custListCommenceTodaySet.getValue({
					name: "entitystatus",
					summary: "GROUP",
				});

				var custStatus = custListCommenceTodaySet
					.getText({
						name: "entitystatus",
						summary: "GROUP",
					})
					.toUpperCase();

				var dateLeadEntered = custListCommenceTodaySet.getValue({
					name: "custentity_date_lead_entered",
					summary: "GROUP",
				});

				var quoteSentDate = custListCommenceTodaySet.getValue({
					name: "custentity_date_lead_quote_sent",
					summary: "GROUP",
				});

				var dateLeadLost = custListCommenceTodaySet.getValue({
					name: "custentity_date_lead_lost",
					summary: "GROUP",
				});
				var dateLeadinContact = custListCommenceTodaySet.getValue({
					name: "custentity_date_prospect_in_contact",
					summary: "GROUP",
				});

				var dateProspectWon = custListCommenceTodaySet.getValue({
					name: "custentity_date_prospect_opportunity",
					summary: "GROUP",
				});

				var dateLeadReassigned = custListCommenceTodaySet.getValue({
					name: "custentity_date_suspect_reassign",
					summary: "GROUP",
				});

				var maapImplementationDate = custListCommenceTodaySet.getValue({
					name: "custentity_maap_implementdate",
					summary: "GROUP",
				});

				console.log("custName: " + custName);
				console.log("maapImplementationDate: " + maapImplementationDate);

				var salesRepId = custListCommenceTodaySet.getValue({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});
				var salesRepText = custListCommenceTodaySet.getText({
					name: "custrecord_sales_assigned",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var salesCampaignId = custListCommenceTodaySet.getValue({
					name: "custrecord_sales_campaign",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});
				var salesCampaignText = custListCommenceTodaySet.getText({
					name: "custrecord_sales_campaign",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var salesRecordInternalId = custListCommenceTodaySet.getValue({
					name: "internalid",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "GROUP",
				});

				var leadEnteredById = custListCommenceTodaySet.getValue({
					name: "custentity_lead_entered_by",
					summary: "GROUP",
				});
				var leadEnteredByText = custListCommenceTodaySet.getText({
					name: "custentity_lead_entered_by",
					summary: "GROUP",
				});

				// var invoiceDocumentNumber = custListCommenceTodaySet.getValue({
				//     name: "tranid",
				//     join: "transaction",
				//     summary: "GROUP",
				// })
				// var invoiceDate = custListCommenceTodaySet.getValue({
				//     name: "trandate",
				//     join: "transaction",
				//     summary: "GROUP",
				// })
				// var invoiceType = custListCommenceTodaySet.getText({
				//     name: "custbody_inv_type",
				//     join: "transaction",
				//     summary: "GROUP",
				// })

				// var invoiceAmount = custListCommenceTodaySet.getValue({
				//     name: "total",
				//     join: "transaction",
				//     summary: "GROUP",
				// })

				// var invoiceStatus = custListCommenceTodaySet.getText({
				//     name: "statusref",
				//     join: "transaction",
				//     summary: "GROUP",
				// })

				var email48h = custListCommenceTodaySet.getText({
					name: "custentity_48h_email_sent",
					summary: "GROUP",
				});

				var daysOpen = custListCommenceTodaySet.getValue({
					name: "formulanumeric",
					summary: "GROUP",
				});

				var cancellationReason = custListCommenceTodaySet.getText({
					name: "custentity_service_cancellation_reason",
					summary: "GROUP",
				});

				var source = custListCommenceTodaySet.getText({
					name: "leadsource",
					summary: "GROUP",
				});
				var sourceId = custListCommenceTodaySet.getValue({
					name: "leadsource",
					summary: "GROUP",
				});

				var productWeeklyUsage = custListCommenceTodaySet.getText({
					name: "custentity_form_mpex_usage_per_week",
					summary: "GROUP",
				});

				var autoSignUp = custListCommenceTodaySet.getValue({
					name: "custentity_auto_sign_up",
					summary: "GROUP",
				});

				var previousCarrier = custListCommenceTodaySet.getText({
					name: "custentity_previous_carrier",
					summary: "GROUP",
				});

				var monthlyServiceValue = custListCommenceTodaySet.getValue({
					name: "custentity_cust_monthly_service_value",
					summary: "GROUP",
				});

				var monthlyExtraServiceValue = custListCommenceTodaySet.getValue({
					name: "custentity_monthly_extra_service_revenue",
					summary: "GROUP",
				});

				var monthlyReductionServiceValue = custListCommenceTodaySet.getValue({
					name: "custentity_monthly_reduc_service_revenue",
					summary: "GROUP",
				});

				var d1 = dateProspectWon.split("/");
				var c = maapImplementationDate.split("/");

				// console.log('d1[1]: ' + d1[1])
				// console.log('c[1]: ' + c[1])
				// console.log('d1[2]: ' + d1[2])
				// console.log('c[2]: ' + c[2])



				// if (
				// 	isNullorEmpty(maapImplementationDate) ||
				// 	(d1[1] == c[1] && d1[2] == c[2])
				// ) {
				// 	existingCustomer = false;
				// } else {
				// 	existingCustomer = true;
				// }



				var maxCommDate = custListCommenceTodaySet.getValue({
					name: "custrecord_comm_date",
					join: "CUSTRECORD_CUSTOMER",
					summary: "MAX",
				});

				console.log("maxCommDate: " + maxCommDate);

				if (areDatesWithinTwoWeeks(maxCommDate, maapImplementationDate)) {
					existingCustomer = false;
				} else {
					existingCustomer = true;
				}

				console.log("existingCustomer: " + existingCustomer);

				var trialEndDate = custListCommenceTodaySet.getValue({
					name: "custentity_customer_trial_expiry_date",
					summary: "GROUP",
				});

				var tncAgreedDate = custListCommenceTodaySet.getValue({
					name: "custentity_terms_conditions_agree_date",
					summary: "GROUP",
				});
				var zeeVisitedDate = custListCommenceTodaySet.getValue({
					name: "custentity_mp_toll_zeevisit_memo",
					summary: "GROUP",
				});
				var lpoCommsToCustomer = custListCommenceTodaySet.getValue({
					name: "custentity_lpo_comms_to_customer",
					summary: "GROUP",
				});
				var giftBoxActivated = custListCommenceTodaySet.getValue({
					name: "custentity_gift_box_activated",
					summary: "GROUP",
				});

				if (giftBoxActivated == 1 || giftBoxActivated == "1") {
					giftBoxActivated = "Yes";
				}

				if (!isNullorEmpty(monthlyServiceValue)) {
					monthlyServiceValue = parseFloat(monthlyServiceValue);
				} else {
					monthlyServiceValue = 0.0;
				}
				if (!isNullorEmpty(monthlyExtraServiceValue)) {
					monthlyExtraServiceValue = parseFloat(monthlyExtraServiceValue);
				} else {
					monthlyExtraServiceValue = 0.0;
				}
				if (!isNullorEmpty(monthlyReductionServiceValue)) {
					monthlyReductionServiceValue = parseFloat(
						monthlyReductionServiceValue
					);
				} else {
					monthlyReductionServiceValue = 0.0;
				}

				// if (isNullorEmpty(invoiceType) || invoiceType == '- None -') {
				//     invoiceType = 'Service'
				// }

				if (!isNullorEmpty(maxCommDate)) {
					var maxCommDateSplit = maxCommDate.split("/");

					if (parseInt(maxCommDateSplit[1]) < 10) {
						maxCommDateSplit[1] = "0" + maxCommDateSplit[1];
					}

					if (parseInt(maxCommDateSplit[0]) < 10) {
						maxCommDateSplit[0] = "0" + maxCommDateSplit[0];
					}

					maxCommDate =
						maxCommDateSplit[2] +
						"-" +
						maxCommDateSplit[1] +
						"-" +
						maxCommDateSplit[0];
				}

				var dateLeadEnteredSplit = dateLeadEntered.split("/");
				if (parseInt(dateLeadEnteredSplit[1]) < 10) {
					dateLeadEnteredSplit[1] = "0" + dateLeadEnteredSplit[1];
				}

				if (parseInt(dateLeadEnteredSplit[0]) < 10) {
					dateLeadEnteredSplit[0] = "0" + dateLeadEnteredSplit[0];
				}
				dateLeadEntered =
					dateLeadEnteredSplit[2] +
					"-" +
					dateLeadEnteredSplit[1] +
					"-" +
					dateLeadEnteredSplit[0];

				if (!isNullorEmpty(dateLeadLost)) {
					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var dateLost = new Date(
						dateLeadLostSplit[2],
						dateLeadLostSplit[1] - 1,
						dateLeadLostSplit[0]
					);

					var difference = dateLost.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateLost.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				} else if (!isNullorEmpty(dateProspectWon)) {
					var dateProspectWonSplit = dateProspectWon.split("/");

					if (parseInt(dateProspectWonSplit[1]) < 10) {
						dateProspectWonSplit[1] = "0" + dateProspectWonSplit[1];
					}

					if (parseInt(dateProspectWonSplit[0]) < 10) {
						dateProspectWonSplit[0] = "0" + dateProspectWonSplit[0];
					}

					dateProspectWon =
						dateProspectWonSplit[2] +
						"-" +
						dateProspectWonSplit[1] +
						"-" +
						dateProspectWonSplit[0];

					var dateLeadLostSplit = dateLeadLost.split("/");
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					dateProspectWon = new Date(
						dateProspectWonSplit[2],
						dateProspectWonSplit[1] - 1,
						dateProspectWonSplit[0]
					);

					var difference = dateProspectWon.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = dateProspectWon.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}

					dateProspectWon =
						dateProspectWonSplit[2] +
						"-" +
						dateProspectWonSplit[1] +
						"-" +
						dateProspectWonSplit[0];
				} else {
					// var dateLeadLostSplit = dateLeadLost.split('/');
					// var dateLeadEnteredSplit = dateLeadEntered.split('/');

					var dateEntered = new Date(
						dateLeadEnteredSplit[2],
						dateLeadEnteredSplit[1] - 1,
						dateLeadEnteredSplit[0]
					);
					var todayDate = new Date();

					var difference = todayDate.getTime() - dateEntered.getTime();
					daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

					var weeks = Math.floor(daysOpen / 7);
					daysOpen = daysOpen - weeks * 2;

					// Handle special cases
					var startDay = dateEntered.getDay();
					var endDay = todayDate.getDay();

					// Remove weekend not previously removed.
					if (startDay - endDay > 1) daysOpen = daysOpen - 2;

					// Remove start day if span starts on Sunday but ends before Saturday
					if (startDay == 0 && endDay != 6) {
						daysOpen = daysOpen - 1;
					}

					// Remove end day if span ends on Saturday but starts after Sunday
					if (endDay == 6 && startDay != 0) {
						daysOpen = daysOpen - 1;
					}
				}

				// if (!isNullorEmpty(invoiceDate)) {
				//     var invoiceDateSplit = invoiceDate.split('/');

				//     if (parseInt(invoiceDateSplit[1]) < 10) {
				//         invoiceDateSplit[1] = '0' + invoiceDateSplit[1]
				//     }

				//     if (parseInt(invoiceDateSplit[0]) < 10) {
				//         invoiceDateSplit[0] = '0' + invoiceDateSplit[0]
				//     }

				//     invoiceDate = invoiceDateSplit[2] + '-' + invoiceDateSplit[1] + '-' +
				//         invoiceDateSplit[0];
				// }

				if (!isNullorEmpty(trialEndDate)) {
					var trialEndDateSplit = trialEndDate.split("/");

					if (parseInt(trialEndDateSplit[1]) < 10) {
						trialEndDateSplit[1] = "0" + trialEndDateSplit[1];
					}

					if (parseInt(trialEndDateSplit[0]) < 10) {
						trialEndDateSplit[0] = "0" + trialEndDateSplit[0];
					}

					trialEndDate =
						trialEndDateSplit[2] +
						"-" +
						trialEndDateSplit[1] +
						"-" +
						trialEndDateSplit[0];
				}

				if (!isNullorEmpty(tncAgreedDate)) {
					var tncAgreedDateSplit = tncAgreedDate.split("/");

					if (parseInt(tncAgreedDateSplit[1]) < 10) {
						tncAgreedDateSplit[1] = "0" + tncAgreedDateSplit[1];
					}

					if (parseInt(tncAgreedDateSplit[0]) < 10) {
						tncAgreedDateSplit[0] = "0" + tncAgreedDateSplit[0];
					}

					tncAgreedDate =
						tncAgreedDateSplit[2] +
						"-" +
						tncAgreedDateSplit[1] +
						"-" +
						tncAgreedDateSplit[0];
				}

				if (!isNullorEmpty(zeeVisitedDate)) {
					var zeeVisitedDateSplit = zeeVisitedDate.split("/");

					if (parseInt(zeeVisitedDateSplit[1]) < 10) {
						zeeVisitedDateSplit[1] = "0" + zeeVisitedDateSplit[1];
					}

					if (parseInt(zeeVisitedDateSplit[0]) < 10) {
						zeeVisitedDateSplit[0] = "0" + zeeVisitedDateSplit[0];
					}

					zeeVisitedDate =
						zeeVisitedDateSplit[2] +
						"-" +
						zeeVisitedDateSplit[1] +
						"-" +
						zeeVisitedDateSplit[0];
				}
				if (!isNullorEmpty(quoteSentDate)) {
					var quoteSentDateSplit = quoteSentDate.split("/");

					if (parseInt(quoteSentDateSplit[1]) < 10) {
						quoteSentDateSplit[1] = "0" + quoteSentDateSplit[1];
					}

					if (parseInt(quoteSentDateSplit[0]) < 10) {
						quoteSentDateSplit[0] = "0" + quoteSentDateSplit[0];
					}

					quoteSentDate =
						quoteSentDateSplit[2] +
						"-" +
						quoteSentDateSplit[1] +
						"-" +
						quoteSentDateSplit[0];
				}

				if (count == 0) {
					currentSalesRecordId = salesRecordInternalId;
					currentCustCampaign = salesCampaignText;
					currentCustCampaignId = salesCampaignId;
					currentLastAssignedId = salesRepId;
					currentLastAssigned = salesRepText;
				} else if (count > 0 && oldcustInternalID == custInternalID) {
				} else if (count > 0 && oldcustInternalID != custInternalID) {
					console.log("oldcustName: " + oldcustName);
					console.log("oldSource: " + oldSource);
					console.log("currentLastAssignedId: " + currentLastAssignedId);
					console.log("currentLastAssigned: " + currentLastAssigned);
					console.log("currentCustCampaign: " + currentCustCampaign);
					console.log("lastAssigned: " + JSON.stringify(lastAssigned));
					console.log("customerCampaign: " + JSON.stringify(customerCampaign));

					if (lastAssigned.length > 0) {
						var newRep = true;
						for (var p = 0; p < lastAssigned.length; p++) {
							if (lastAssigned[p].id == currentLastAssignedId) {
								newRep = false;
								lastAssigned[p].count = lastAssigned[p].count + 1;
								var newRepSource = true;
								for (
									var s = 0;
									s < lastAssigned[p].details[0].source.length;
									s++
								) {
									console.log("source count (s): " + s);
									console.log(
										"lastAssigned[p].details[0].source[s].name: " +
										lastAssigned[p].details[0].source[s].name
									);
									console.log(
										"lastAssigned[p].details[0].source[s].name == oldSource: " +
										lastAssigned[p].details[0].source[s].name ==
										oldSource
									);
									if (lastAssigned[p].details[0].source[s].name == oldSource) {
										newRepSource = false;
										lastAssigned[p].details[0].source[s].count =
											lastAssigned[p].details[0].source[s].count + 1;

										var newRepCampaign = true;
										for (
											var c = 0;
											c < lastAssigned[p].details[0].source[s].campaign.length;
											c++
										) {
											if (
												lastAssigned[p].details[0].source[s].campaign[c].name ==
												currentCustCampaign
											) {
												newRepCampaign = false;
												lastAssigned[p].details[0].source[s].campaign[c].count =
													lastAssigned[p].details[0].source[s].campaign[c]
														.count + 1;
											}
										}
										if (newRepCampaign == true) {
											lastAssigned[p].details[0].source[s].campaign.push({
												name: currentCustCampaign,
												count: 1,
											});
										}
									}
								}
								var newRepStatus = true;
								for (
									var st = 0;
									st < lastAssigned[p].status[0].type.length;
									st++
								) {
									if (
										lastAssigned[p].status[0].type[st].id == oldCustStatusId
									) {
										newRepStatus = false;
										lastAssigned[p].status[0].type[st].count =
											lastAssigned[p].status[0].type[st].count + 1;
									}
								}
								console.log("newRepSource: " + newRepSource);
								if (newRepSource == true) {
									lastAssigned[p].details[0].source.push({
										id: oldSourceId,
										name: oldSource,
										count: 1,
										campaign: [
											{
												id: currentCustCampaignId,
												name: currentCustCampaign,
												count: 1,
											},
										],
									});
								}
								if (newRepStatus == true) {
									lastAssigned[p].status[0].type.push({
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									});
								}
							}
						}
						if (newRep == true) {
							lastAssigned.push({
								id: currentLastAssignedId,
								name: currentLastAssigned,
								count: 1,
								status: [],
								details: [],
							});

							lastAssigned[lastAssigned.length - 1].status.push({
								type: [
									{
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									},
								],
							});

							lastAssigned[lastAssigned.length - 1].details.push({
								source: [
									{
										id: oldSourceId,
										name: oldSource,
										count: 1,
										campaign: [
											{
												id: currentCustCampaignId,
												name: currentCustCampaign,
												count: 1,
											},
										],
									},
								],
							});
						}
					} else {
						lastAssigned.push({
							id: currentLastAssignedId,
							name: currentLastAssigned,
							count: 1,
							status: [],
							details: [],
						});

						lastAssigned[lastAssigned.length - 1].status.push({
							type: [
								{
									id: oldCustStatusId,
									name: oldcustStatus,
									count: 1,
								},
							],
						});
						lastAssigned[lastAssigned.length - 1].details.push({
							source: [
								{
									id: oldSourceId,
									name: oldSource,
									count: 1,
									campaign: [
										{
											id: currentCustCampaignId,
											name: currentCustCampaign,
											count: 1,
										},
									],
								},
							],
						});
					}

					if (customerCampaign.length > 0) {
						var newCampaign = true;
						for (var p = 0; p < customerCampaign.length; p++) {
							if (customerCampaign[p].id == currentCustCampaignId) {
								newCampaign = false;
								customerCampaign[p].count = customerCampaign[p].count + 1;

								var newCampaignStatus = true;
								for (
									var st = 0;
									st < customerCampaign[p].status[0].type.length;
									st++
								) {
									if (
										customerCampaign[p].status[0].type[st].id == oldCustStatusId
									) {
										newCampaignStatus = false;
										customerCampaign[p].status[0].type[st].count =
											customerCampaign[p].status[0].type[st].count + 1;
									}
								}

								if (newCampaignStatus == true) {
									customerCampaign[p].status[0].type.push({
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									});
								}
							}
						}
						if (newCampaign == true) {
							customerCampaign.push({
								id: currentCustCampaignId,
								name: currentCustCampaign,
								count: 1,
								status: [],
							});

							customerCampaign[customerCampaign.length - 1].status.push({
								type: [
									{
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									},
								],
							});
						}
					} else {
						customerCampaign.push({
							id: currentCustCampaignId,
							name: currentCustCampaign,
							count: 1,
							status: [],
						});

						customerCampaign[customerCampaign.length - 1].status.push({
							type: [
								{
									id: oldCustStatusId,
									name: oldcustStatus,
									count: 1,
								},
							],
						});
					}

					if (customerSource.length > 0) {
						var newSource = true;
						for (var p = 0; p < customerSource.length; p++) {
							if (customerSource[p].id == oldSourceId) {
								newSource = false;
								customerSource[p].count = customerSource[p].count + 1;

								var newSourceStatus = true;
								for (
									var st = 0;
									st < customerSource[p].status[0].type.length;
									st++
								) {
									if (
										customerSource[p].status[0].type[st].id == oldCustStatusId
									) {
										newSourceStatus = false;
										customerSource[p].status[0].type[st].count =
											customerSource[p].status[0].type[st].count + 1;
									}
								}

								if (newSourceStatus == true) {
									customerSource[p].status[0].type.push({
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									});
								}
							}
						}
						if (newSource == true) {
							customerSource.push({
								id: oldSourceId,
								name: oldSource,
								count: 1,
								status: [],
							});

							customerSource[customerSource.length - 1].status.push({
								type: [
									{
										id: oldCustStatusId,
										name: oldcustStatus,
										count: 1,
									},
								],
							});
						}
					} else {
						customerSource.push({
							id: oldSourceId,
							name: oldSource,
							count: 1,
							status: [],
						});

						customerSource[customerSource.length - 1].status.push({
							type: [
								{
									id: oldCustStatusId,
									name: oldcustStatus,
									count: 1,
								},
							],
						});
					}

					if (oldcustStage == "CUSTOMER") {
						totalCustomerCount++;

						var express_speed = 0;
						var standard_speed = 0;
						var total_usage = 0;
						if (calcprodusage != "2") {
							if (
								!isNullorEmpty(usage_date_from) &&
								!isNullorEmpty(usage_date_to)
							) {
								// Customer Product Usage - Total MP Express, Standard & Premium
								var mpexUsageResults = search.load({
									type: "customrecord_customer_product_stock",
									id: "customsearch6846",
								});

								mpexUsageResults.filters.push(
									search.createFilter({
										name: "internalid",
										join: "custrecord_cust_prod_stock_customer",
										operator: search.Operator.ANYOF,
										values: parseInt(oldcustInternalID),
									})
								);

								if (
									!isNullorEmpty(usage_date_from) &&
									!isNullorEmpty(usage_date_to)
								) {
									mpexUsageResults.filters.push(
										search.createFilter({
											name: "custrecord_cust_date_stock_used",
											join: null,
											operator: search.Operator.ONORAFTER,
											values: usage_date_from,
										})
									);
									mpexUsageResults.filters.push(
										search.createFilter({
											name: "custrecord_cust_date_stock_used",
											join: null,
											operator: search.Operator.ONORBEFORE,
											values: usage_date_to,
										})
									);
								}

								mpexUsageResults.run().each(function (mpexUsageSet) {
									var deliverySpeed = mpexUsageSet.getValue({
										name: "custrecord_delivery_speed",
										summary: "GROUP",
									});
									var deliverySpeedText = mpexUsageSet.getText({
										name: "custrecord_delivery_speed",
										summary: "GROUP",
									});

									var mpexUsage = parseInt(
										mpexUsageSet.getValue({
											name: "name",
											summary: "COUNT",
										})
									);

									if (deliverySpeed == 2 || deliverySpeedText == "- None -") {
										express_speed += mpexUsage;
									} else if (deliverySpeed == 1) {
										standard_speed += mpexUsage;
									}
									total_usage += express_speed + standard_speed;

									return true;
								});
							}
						}

						var usage_date_from_split = usage_date_from.split("/");

						if (parseInt(usage_date_from_split[1]) < 10) {
							usage_date_from_split[1] = "0" + usage_date_from_split[1];
						}

						if (parseInt(usage_date_from_split[0]) < 10) {
							usage_date_from_split[0] = "0" + usage_date_from_split[0];
						}

						var daily_usage_from =
							usage_date_from_split[2] +
							"-" +
							usage_date_from_split[1] +
							"-" +
							usage_date_from_split[0];

						var usage_date_to_split = usage_date_to.split("/");

						if (parseInt(usage_date_to_split[1]) < 10) {
							usage_date_to_split[1] = "0" + usage_date_to_split[1];
						}

						if (parseInt(usage_date_to_split[0]) < 10) {
							usage_date_to_split[0] = "0" + usage_date_to_split[0];
						}

						var daily_usage_to =
							usage_date_to_split[2] +
							"-" +
							usage_date_to_split[1] +
							"-" +
							usage_date_to_split[0];

						var mpExpStdUsageLink =
							'<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important;border-radius: 15px"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&custid=' +
							oldcustInternalID +
							"&start_date=" +
							daily_usage_from +
							"&last_date=" +
							daily_usage_to +
							"&zee=" +
							oldzeeID +
							'" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

						var customerIdLink =
							'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
							oldcustInternalID +
							'" target="_blank" style="">' +
							oldcustEntityID +
							"</a>";

						console.log("oldcustName: " + oldcustName);
						console.log("existingCustomer: " + oldExistingCustomer);

						if (oldCustStatusId == 32) {
							console.log(
								"freetrial child data" + JSON.stringify(customerChildDataSet)
							);
							trialCustomerDataSet.push([
								"",
								oldcustInternalID,
								customerIdLink,
								oldcustName,
								oldzeeName,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateProspectWon,
								oldTnCAgreedDate,
								oldZeeVisitedDate,
								oldLPOCommsToCustomer,
								oldTrialEndDate,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldMonthServiceValue,
								oldLeadEnteredByText,
								currentCustCampaign,
								currentLastAssigned,
								customerChildDataSet,
							]);
						} else if (oldCustStatusId == 71) {
							console.log(
								"freetrial child data" + JSON.stringify(customerChildDataSet)
							);
							trialPendingCustomerDataSet.push([
								"",
								oldcustInternalID,
								customerIdLink,
								oldcustName,
								oldzeeName,
								oldSource,
								oldPreviousCarrier,
								olddateLeadEntered,
								oldquoteSentDate,
								olddateProspectWon,
								oldTnCAgreedDate,
								oldZeeVisitedDate,
								oldLPOCommsToCustomer,
								oldTrialEndDate,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldMonthServiceValue,
								oldLeadEnteredByText,
								currentCustCampaign,
								currentLastAssigned,
								customerChildDataSet,
							]);
						} else if (oldCustStatusId == 73) {
							console.log(
								"freetrial child data" + JSON.stringify(customerChildDataSet)
							);
							shipMatePendingCustomerDataSet.push([
								oldcustInternalID,
								customerIdLink,
								oldcustName,
								oldzeeName,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								// express_speed,
								// standard_speed,
								mpExpStdUsageLink,
								olddateLeadEntered,
								oldquoteSentDate,
								// oldemail48h,
								olddateProspectWon,
								oldMinCommDate,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldMonthServiceValue,
								invoiceServiceTotal.toFixed(2),
								invoiceProductsTotal.toFixed(2),
								invoiceTotal.toFixed(2),
								oldGiftBoxActivated,
								oldLeadEnteredByText,
								currentCustCampaign,
								currentLastAssigned,
								oldAutoSignUp,
								customerChildDataSet,
							]);
						} else if (
							(!isNullorEmpty(oldMonthlyExtraServiceValue) &&
								parseInt(oldMonthlyExtraServiceValue) != 0) ||
							(!isNullorEmpty(oldMonthlyReductionServiceValue) &&
								parseInt(oldMonthlyReductionServiceValue) != 0) ||
							oldExistingCustomer == true
						) {
							existingCustomerDataSet.push([
								"",
								oldcustInternalID,
								customerIdLink,
								oldcustName,
								oldzeeName,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								// express_speed,
								// standard_speed,
								mpExpStdUsageLink,
								olddateLeadEntered,
								oldquoteSentDate,
								// oldemail48h,
								olddateProspectWon,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldMonthServiceValue,
								invoiceServiceTotal.toFixed(2),
								invoiceProductsTotal.toFixed(2),
								invoiceTotal.toFixed(2),
								oldGiftBoxActivated,
								oldLeadEnteredByText,
								currentCustCampaign,
								currentLastAssigned,
								oldAutoSignUp,
								customerChildDataSet,
							]);

							csvExistingCustomerSignedExport.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldSource,
								express_speed,
								standard_speed,
								olddateLeadEntered,
								olddateProspectWon,
								oldMonthServiceValue,
								oldsalesRepText,
								oldAutoSignUp,
								oldInvoiceNumber,
								oldinvoiceDate,
								oldInvoiceType,
								oldInvoiceAmount,
								oldInvoiceStatus,
							]);
						} else {
							customerDataSet.push([
								oldcustInternalID,
								customerIdLink,
								oldcustName,
								oldzeeName,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								// express_speed,
								// standard_speed,
								mpExpStdUsageLink,
								olddateLeadEntered,
								oldquoteSentDate,
								// oldemail48h,
								olddateProspectWon,
								oldMinCommDate,
								'<input type="button" value="' +
								oldDaysOpen +
								'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
								oldcustInternalID +
								'" style="background-color: #095C7B;border-radius: 30px">',
								oldMonthServiceValue,
								invoiceServiceTotal.toFixed(2),
								invoiceProductsTotal.toFixed(2),
								invoiceTotal.toFixed(2),
								oldGiftBoxActivated,
								oldLeadEnteredByText,
								currentCustCampaign,
								currentLastAssigned,
								oldAutoSignUp,
								customerChildDataSet,
							]);

							csvCustomerSignedExport.push([
								oldcustInternalID,
								oldcustEntityID,
								oldcustName,
								oldzeeName,
								oldSource,
								oldProdWeeklyUsage,
								oldPreviousCarrier,
								express_speed,
								standard_speed,
								olddateLeadEntered,
								oldquoteSentDate,
								oldemail48h,
								olddateProspectWon,
								oldDaysOpen,
								oldMonthServiceValue,
								oldsalesRepText,
								oldAutoSignUp,
								oldInvoiceNumber,
								oldinvoiceDate,
								oldInvoiceType,
								oldInvoiceAmount,
								oldInvoiceStatus,
							]);
						}
					}

					oldInvoiceNumber = null;
					oldinvoiceDate = null;
					oldInvoiceType = null;
					oldInvoiceStatus = null;
					oldInvoiceAmount = 0.0;
					oldInvoiceItem = null;

					showInvoice = true;

					invoiceTotal = 0;
					invoiceServiceTotal = 0.0;
					invoiceProductsTotal = 0.0;
					customerChildDataSet = [];
					customerChildStatusDataSet = [];

					existingCustomer = false;
					custCount = 0;

					currentSalesRecordId = null;
					currentCustCampaign = null;
					currentCustCampaignId = null;
					currentLastAssigned = null;
					currentLastAssignedId = null;

					currentSalesRecordId = salesRecordInternalId;
					currentCustCampaign = salesCampaignText;
					currentCustCampaignId = salesCampaignId;
					currentLastAssignedId = salesRepId;
					currentLastAssigned = salesRepText;
				}

				oldcustInternalID = custInternalID;
				oldcustEntityID = custEntityID;
				oldcustName = custName;
				oldzeeID = zeeID;
				oldzeeName = zeeName;
				oldcustStage = custStage;
				oldcustStatus = custStatus;
				oldCustStatusId = custStatusId;
				olddateLeadEntered = dateLeadEntered;
				oldquoteSentDate = quoteSentDate;
				olddateLeadLost = dateLeadLost;
				olddateLeadinContact = dateLeadinContact;
				olddateProspectWon = dateProspectWon;
				olddateLeadReassigned = dateLeadReassigned;
				oldsalesRepId = salesRepId;
				oldsalesRepText = salesRepText;
				oldLeadEnteredById = leadEnteredById;
				oldLeadEnteredByText = leadEnteredByText;
				// oldactivityInternalID = activityInternalID;
				// oldactivityStartDate = activityStartDate;
				// oldactivityTitle = activityTitle;
				// oldactivityOrganiser = activityOrganiser;
				// oldactivityMessage = activityMessage;
				oldemail48h = email48h;
				oldDaysOpen = daysOpen;
				oldCancellationReason = cancellationReason;
				oldSource = source;
				oldSourceId = sourceId;
				oldProdWeeklyUsage = productWeeklyUsage;
				oldAutoSignUp = autoSignUp;
				oldPreviousCarrier = previousCarrier;
				oldMonthServiceValue = monthlyServiceValue;
				oldMonthlyReductionServiceValue = monthlyReductionServiceValue;
				oldMonthlyExtraServiceValue = monthlyExtraServiceValue;
				oldMinCommDate = maxCommDate;
				oldTrialEndDate = trialEndDate;
				oldTnCAgreedDate = tncAgreedDate;
				oldZeeVisitedDate = zeeVisitedDate;
				oldLPOCommsToCustomer = lpoCommsToCustomer;
				oldGiftBoxActivated = giftBoxActivated;
				// oldInvoiceNumber = invoiceDocumentNumber;
				// oldinvoiceDate = invoiceDate;
				// oldInvoiceType = invoiceType;
				// oldInvoiceAmount = invoiceAmount;
				// oldInvoiceStatus = invoiceStatus;
				oldExistingCustomer = existingCustomer;
				// oldInvoiceItem = invoiceItem;

				// if (oldInvoiceItem == 'Credit Card Surcharge') {
				//     showInvoice = false;
				// }
				custCount++;
				count++;

				console.log("signed customer count: " + count);
				return true;
			});

		if (count > 0) {
			console.log("oldcustName: " + oldcustName);
			console.log("oldSource: " + oldSource);
			console.log("currentLastAssignedId: " + currentLastAssignedId);
			console.log("currentLastAssigned: " + currentLastAssigned);
			console.log("currentCustCampaign: " + currentCustCampaign);
			console.log("lastAssigned: " + JSON.stringify(lastAssigned));
			console.log("customerCampaign: " + JSON.stringify(customerCampaign));

			if (lastAssigned.length > 0) {
				var newRep = true;
				for (var p = 0; p < lastAssigned.length; p++) {
					if (lastAssigned[p].id == currentLastAssignedId) {
						newRep = false;
						lastAssigned[p].count = lastAssigned[p].count + 1;
						var newRepSource = true;
						for (var s = 0; s < lastAssigned[p].details[0].source.length; s++) {
							console.log("source count (s): " + s);
							console.log(
								"lastAssigned[p].details[0].source[s].name: " +
								lastAssigned[p].details[0].source[s].name
							);
							console.log(
								"lastAssigned[p].details[0].source[s].name == oldSource: " +
								lastAssigned[p].details[0].source[s].name ==
								oldSource
							);
							if (lastAssigned[p].details[0].source[s].name == oldSource) {
								newRepSource = false;
								lastAssigned[p].details[0].source[s].count =
									lastAssigned[p].details[0].source[s].count + 1;

								var newRepCampaign = true;
								for (
									var c = 0;
									c < lastAssigned[p].details[0].source[s].campaign.length;
									c++
								) {
									if (
										lastAssigned[p].details[0].source[s].campaign[c].name ==
										currentCustCampaign
									) {
										newRepCampaign = false;
										lastAssigned[p].details[0].source[s].campaign[c].count =
											lastAssigned[p].details[0].source[s].campaign[c].count +
											1;
									}
								}
								if (newRepCampaign == true) {
									lastAssigned[p].details[0].source[s].campaign.push({
										name: currentCustCampaign,
										count: 1,
									});
								}
							}
						}
						var newRepStatus = true;
						for (var st = 0; st < lastAssigned[p].status[0].type.length; st++) {
							if (lastAssigned[p].status[0].type[st].id == oldCustStatusId) {
								newRepStatus = false;
								lastAssigned[p].status[0].type[st].count =
									lastAssigned[p].status[0].type[st].count + 1;
							}
						}
						console.log("newRepSource: " + newRepSource);
						if (newRepSource == true) {
							lastAssigned[p].details[0].source.push({
								id: oldSourceId,
								name: oldSource,
								count: 1,
								campaign: [
									{
										id: currentCustCampaignId,
										name: currentCustCampaign,
										count: 1,
									},
								],
							});
						}
						if (newRepStatus == true) {
							lastAssigned[p].status[0].type.push({
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							});
						}
					}
				}
				if (newRep == true) {
					lastAssigned.push({
						id: currentLastAssignedId,
						name: currentLastAssigned,
						count: 1,
						status: [],
						details: [],
					});

					lastAssigned[lastAssigned.length - 1].status.push({
						type: [
							{
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							},
						],
					});

					lastAssigned[lastAssigned.length - 1].details.push({
						source: [
							{
								id: oldSourceId,
								name: oldSource,
								count: 1,
								campaign: [
									{
										id: currentCustCampaignId,
										name: currentCustCampaign,
										count: 1,
									},
								],
							},
						],
					});
				}
			} else {
				lastAssigned.push({
					id: currentLastAssignedId,
					name: currentLastAssigned,
					count: 1,
					status: [],
					details: [],
				});

				lastAssigned[lastAssigned.length - 1].status.push({
					type: [
						{
							id: oldCustStatusId,
							name: oldcustStatus,
							count: 1,
						},
					],
				});
				lastAssigned[lastAssigned.length - 1].details.push({
					source: [
						{
							id: oldSourceId,
							name: oldSource,
							count: 1,
							campaign: [
								{
									id: currentCustCampaignId,
									name: currentCustCampaign,
									count: 1,
								},
							],
						},
					],
				});
			}

			if (customerCampaign.length > 0) {
				var newCampaign = true;
				for (var p = 0; p < customerCampaign.length; p++) {
					if (customerCampaign[p].id == currentCustCampaignId) {
						newCampaign = false;
						customerCampaign[p].count = customerCampaign[p].count + 1;

						var newCampaignStatus = true;
						for (
							var st = 0;
							st < customerCampaign[p].status[0].type.length;
							st++
						) {
							if (
								customerCampaign[p].status[0].type[st].id == oldCustStatusId
							) {
								newCampaignStatus = false;
								customerCampaign[p].status[0].type[st].count =
									customerCampaign[p].status[0].type[st].count + 1;
							}
						}

						if (newCampaignStatus == true) {
							customerCampaign[p].status[0].type.push({
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							});
						}
					}
				}
				if (newCampaign == true) {
					customerCampaign.push({
						id: currentCustCampaignId,
						name: currentCustCampaign,
						count: 1,
						status: [],
					});

					customerCampaign[customerCampaign.length - 1].status.push({
						type: [
							{
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							},
						],
					});
				}
			} else {
				customerCampaign.push({
					id: currentCustCampaignId,
					name: currentCustCampaign,
					count: 1,
					status: [],
				});

				customerCampaign[customerCampaign.length - 1].status.push({
					type: [
						{
							id: oldCustStatusId,
							name: oldcustStatus,
							count: 1,
						},
					],
				});
			}

			if (customerSource.length > 0) {
				var newSource = true;
				for (var p = 0; p < customerSource.length; p++) {
					if (customerSource[p].id == oldSourceId) {
						newSource = false;
						customerSource[p].count = customerSource[p].count + 1;

						var newSourceStatus = true;
						for (
							var st = 0;
							st < customerSource[p].status[0].type.length;
							st++
						) {
							if (customerSource[p].status[0].type[st].id == oldCustStatusId) {
								newSourceStatus = false;
								customerSource[p].status[0].type[st].count =
									customerSource[p].status[0].type[st].count + 1;
							}
						}

						if (newSourceStatus == true) {
							customerSource[p].status[0].type.push({
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							});
						}
					}
				}
				if (newSource == true) {
					customerSource.push({
						id: oldSourceId,
						name: oldSource,
						count: 1,
						status: [],
					});

					customerSource[customerSource.length - 1].status.push({
						type: [
							{
								id: oldCustStatusId,
								name: oldcustStatus,
								count: 1,
							},
						],
					});
				}
			} else {
				customerSource.push({
					id: oldSourceId,
					name: oldSource,
					count: 1,
					status: [],
				});

				customerSource[customerSource.length - 1].status.push({
					type: [
						{
							id: oldCustStatusId,
							name: oldcustStatus,
							count: 1,
						},
					],
				});
			}

			if (oldcustStage == "CUSTOMER") {
				customerActivityCount++;
				// if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && showInvoice == true && isNullorEmpty(oldInvoiceItem)) {
				//     customerChildDataSet.push({
				//         invoiceDocumentNumber: oldInvoiceNumber,
				//         invoiceDate: oldinvoiceDate,
				//         invoiceType: oldInvoiceType,
				//         invoiceAmount: oldInvoiceAmount,
				//         invoiceStatus: oldInvoiceStatus
				//     });

				//     invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
				//     if (oldInvoiceType == 'Service') {
				//         invoiceServiceTotal = invoiceServiceTotal + parseFloat(oldInvoiceAmount);
				//     } else {
				//         invoiceProductsTotal = invoiceProductsTotal + parseFloat(oldInvoiceAmount);
				//     }
				// }

				totalCustomerCount++;

				var express_speed = 0;
				var standard_speed = 0;
				var total_usage = 0;
				if (calcprodusage != "2") {
					if (
						!isNullorEmpty(usage_date_from) &&
						!isNullorEmpty(usage_date_to)
					) {
						//Customer Product Usage - Total MP Express, Standard & Premium
						var mpexUsageResults = search.load({
							type: "customrecord_customer_product_stock",
							id: "customsearch6846",
						});

						mpexUsageResults.filters.push(
							search.createFilter({
								name: "internalid",
								join: "custrecord_cust_prod_stock_customer",
								operator: search.Operator.ANYOF,
								values: parseInt(oldcustInternalID),
							})
						);

						if (
							!isNullorEmpty(usage_date_from) &&
							!isNullorEmpty(usage_date_to)
						) {
							mpexUsageResults.filters.push(
								search.createFilter({
									name: "custrecord_cust_date_stock_used",
									join: null,
									operator: search.Operator.ONORAFTER,
									values: usage_date_from,
								})
							);
							mpexUsageResults.filters.push(
								search.createFilter({
									name: "custrecord_cust_date_stock_used",
									join: null,
									operator: search.Operator.ONORBEFORE,
									values: usage_date_to,
								})
							);
						}

						mpexUsageResults.run().each(function (mpexUsageSet) {
							var deliverySpeed = mpexUsageSet.getValue({
								name: "custrecord_delivery_speed",
								summary: "GROUP",
							});
							var deliverySpeedText = mpexUsageSet.getText({
								name: "custrecord_delivery_speed",
								summary: "GROUP",
							});

							var mpexUsage = parseInt(
								mpexUsageSet.getValue({
									name: "name",
									summary: "COUNT",
								})
							);

							if (deliverySpeed == 2 || deliverySpeedText == "- None -") {
								express_speed += mpexUsage;
							} else if (deliverySpeed == 1) {
								standard_speed += mpexUsage;
							}
							total_usage += express_speed + standard_speed;

							return true;
						});
					}
				}

				var usage_date_from_split = usage_date_from.split("/");

				if (parseInt(usage_date_from_split[1]) < 10) {
					usage_date_from_split[1] = "0" + usage_date_from_split[1];
				}

				if (parseInt(usage_date_from_split[0]) < 10) {
					usage_date_from_split[0] = "0" + usage_date_from_split[0];
				}

				var daily_usage_from =
					usage_date_from_split[2] +
					"-" +
					usage_date_from_split[1] +
					"-" +
					usage_date_from_split[0];

				var usage_date_to_split = usage_date_to.split("/");

				if (parseInt(usage_date_to_split[1]) < 10) {
					usage_date_to_split[1] = "0" + usage_date_to_split[1];
				}

				if (parseInt(usage_date_to_split[0]) < 10) {
					usage_date_to_split[0] = "0" + usage_date_to_split[0];
				}

				var daily_usage_to =
					usage_date_to_split[2] +
					"-" +
					usage_date_to_split[1] +
					"-" +
					usage_date_to_split[0];

				var mpExpStdUsageLink =
					'<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important; border-radius: 15px"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&custid=' +
					oldcustInternalID +
					"&start_date=" +
					daily_usage_from +
					"&last_date=" +
					daily_usage_to +
					"&zee=" +
					oldzeeID +
					'" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

				var customerIdLink =
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					oldcustInternalID +
					'" target="_blank" style="">' +
					oldcustEntityID +
					"</a>";

				// var d1 = new Date(olddateProspectWon);
				// var d2 = new Date(oldMinCommDate);

				// var existingCustomer = false;

				// if (d2 < d1) {
				//     existingCustomer = true;
				// }

				// var d1 = new Date(olddateLeadEntered);
				// var d2 = new Date(oldMinCommDate);

				// if (d2 < d1) {
				//     existingCustomer = true;
				// }

				if (oldCustStatusId == 32) {
					console.log(
						"freetrial child data" + JSON.stringify(customerChildDataSet)
					);
					trialCustomerDataSet.push([
						"",
						oldcustInternalID,
						customerIdLink,
						oldcustName,
						oldzeeName,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateProspectWon,
						oldTnCAgreedDate,
						oldZeeVisitedDate,
						oldLPOCommsToCustomer,
						oldTrialEndDate,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldMonthServiceValue,
						oldLeadEnteredByText,
						currentCustCampaign,
						currentLastAssigned,
						customerChildDataSet,
					]);
				} else if (oldCustStatusId == 71) {
					console.log(
						"freetrial child data" + JSON.stringify(customerChildDataSet)
					);
					trialPendingCustomerDataSet.push([
						"",
						oldcustInternalID,
						customerIdLink,
						oldcustName,
						oldzeeName,
						oldSource,
						oldPreviousCarrier,
						olddateLeadEntered,
						oldquoteSentDate,
						olddateProspectWon,
						oldTnCAgreedDate,
						oldZeeVisitedDate,
						oldLPOCommsToCustomer,
						oldTrialEndDate,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldMonthServiceValue,
						oldLeadEnteredByText,
						currentCustCampaign,
						currentLastAssigned,
						customerChildDataSet,
					]);
				} else if (oldCustStatusId == 73) {
					console.log(
						"freetrial child data" + JSON.stringify(customerChildDataSet)
					);
					shipMatePendingCustomerDataSet.push([
						oldcustInternalID,
						customerIdLink,
						oldcustName,
						oldzeeName,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						// express_speed,
						// standard_speed,
						mpExpStdUsageLink,
						olddateLeadEntered,
						oldquoteSentDate,
						// oldemail48h,
						olddateProspectWon,
						oldMinCommDate,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldMonthServiceValue,
						invoiceServiceTotal.toFixed(2),
						invoiceProductsTotal.toFixed(2),
						invoiceTotal.toFixed(2),
						oldGiftBoxActivated,
						oldLeadEnteredByText,
						currentCustCampaign,
						currentLastAssigned,
						oldAutoSignUp,
						customerChildDataSet,
					]);
				} else if (
					(!isNullorEmpty(oldMonthlyExtraServiceValue) &&
						parseInt(oldMonthlyExtraServiceValue) != 0) ||
					(!isNullorEmpty(oldMonthlyReductionServiceValue) &&
						parseInt(oldMonthlyReductionServiceValue) != 0) ||
					oldExistingCustomer == true
				) {
					existingCustomerDataSet.push([
						"",
						oldcustInternalID,
						customerIdLink,
						oldcustName,
						oldzeeName,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						// express_speed,
						// standard_speed,
						mpExpStdUsageLink,
						olddateLeadEntered,
						oldquoteSentDate,
						// oldemail48h,
						olddateProspectWon,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldMonthServiceValue,
						invoiceServiceTotal.toFixed(2),
						invoiceProductsTotal.toFixed(2),
						invoiceTotal.toFixed(2),
						oldGiftBoxActivated,
						oldLeadEnteredByText,
						currentCustCampaign,
						currentLastAssigned,
						oldAutoSignUp,
						customerChildDataSet,
					]);

					csvExistingCustomerSignedExport.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldSource,
						express_speed,
						standard_speed,
						olddateLeadEntered,
						olddateProspectWon,
						oldMonthServiceValue,
						oldsalesRepText,
						oldAutoSignUp,
						oldInvoiceNumber,
						oldinvoiceDate,
						oldInvoiceType,
						oldInvoiceAmount,
						oldInvoiceStatus,
					]);
				} else {
					customerDataSet.push([
						oldcustInternalID,
						customerIdLink,
						oldcustName,
						oldzeeName,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						// express_speed,
						// standard_speed,
						mpExpStdUsageLink,
						olddateLeadEntered,
						oldquoteSentDate,
						// oldemail48h,
						olddateProspectWon,
						oldMinCommDate,
						'<input type="button" value="' +
						oldDaysOpen +
						'" class="form-control btn btn-primary show_status_timeline" id="" data-id="' +
						oldcustInternalID +
						'" style="background-color: #095C7B;border-radius: 30px">',
						oldMonthServiceValue,
						invoiceServiceTotal.toFixed(2),
						invoiceProductsTotal.toFixed(2),
						invoiceTotal.toFixed(2),
						oldGiftBoxActivated,
						oldLeadEnteredByText,
						currentCustCampaign,
						currentLastAssigned,
						oldAutoSignUp,
						customerChildDataSet,
					]);

					csvCustomerSignedExport.push([
						oldcustInternalID,
						oldcustEntityID,
						oldcustName,
						oldzeeName,
						oldSource,
						oldProdWeeklyUsage,
						oldPreviousCarrier,
						express_speed,
						standard_speed,
						olddateLeadEntered,
						oldquoteSentDate,
						oldemail48h,
						olddateProspectWon,
						oldDaysOpen,
						oldMonthServiceValue,
						oldsalesRepText,
						oldAutoSignUp,
						oldInvoiceNumber,
						oldinvoiceDate,
						oldInvoiceType,
						oldInvoiceAmount,
						oldInvoiceStatus,
					]);
				}
			}
		}

		console.log("customerDataSet: " + customerDataSet);
		console.log("existingCustomerDataSet: " + existingCustomerDataSet);
		console.log("trialCustomerDataSet: " + trialCustomerDataSet);
		console.log("trialPendingCustomerDataSet: " + trialPendingCustomerDataSet);
		console.log("shipMatePendingCustomerDataSet: " + shipMatePendingCustomerDataSet);
		console.log("csvCustomerSignedExport: " + prospectDataSet);

		console.log("lastAssigned: " + JSON.stringify(lastAssigned));
		console.log("customerCampaign: " + JSON.stringify(customerCampaign));

		//!
		var series_data_signed_source = [];
		var series_data_signed_campaign = [];
		var series_data_signed = [];
		var series_data_trial_pending = [];
		var series_data_free_trial = [];
		var series_lpo_data_source = [];
		var series_lpo_data_campaign = [];
		var lastAssignedTeamMemberCategories = [];
		var dataCaptureTeamMemberLPOCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var dataSigned = new Array(lastAssigned.length).fill(0);
		var dataLPOSource = new Array(lastAssigned.length).fill(0);
		var dataLPOCampaign = new Array(lastAssigned.length).fill(0);
		var resetDataSource = new Array(lastAssigned.length).fill(0);
		for (var x = 0; x < lastAssigned.length; x++) {
			lastAssignedTeamMemberCategories[x] = lastAssigned[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + lastAssigned[x].name);
			console.log(
				"details: " + JSON.stringify(lastAssigned[x].details[0].source)
			);
			// for (y = 0; y < lastAssigned[x].details[0].source.length; y++) {
			//     sourceLeadCount[x][y] = lastAssigned[x].details[0].source[y].count;
			//     sourceName[x][y] = lastAssigned[x].details[0].source[y].name;

			//     console.log('Source Name: ' + lastAssigned[x].details[0].source[y].name);
			//     console.log('Source Count: ' + lastAssigned[x].details[0].source[y].count);

			//     console.log('before series_data_source: ' + JSON.stringify(series_data_source));
			//     var source_exists = false;
			//     for (var j = 0; j < series_data_source.length; j++) {
			//         if (series_data_source[j].name == sourceName[x][y]) {
			//             source_exists = true;
			//             series_data_source[j].data[x] = lastAssigned[x].details[0].source[y].count
			//         }
			//     }
			//     if (source_exists == false) {
			//         dataSource = new Array(lastAssigned.length).fill(0);
			//         dataSource[x] = lastAssigned[x].details[0].source[y].count;

			//         var colorCodeSource;
			//         if (source_list.includes((lastAssigned[x].details[0].source[y].id).toString()) == true) {
			//             colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].details[0].source[y].id).toString())];
			//         }

			//         series_data_source.push({
			//             name: sourceName[x][y],
			//             data: dataSource,
			//             color: colorCodeSource,
			//             style: {
			//                 fontWeight: 'bold',
			//             }
			//         });
			//     }

			//     console.log('after series_data_source: ' + JSON.stringify(series_data_source));

			//     for (z = 0; z < lastAssigned[x].details[0].source[y].campaign.length; z++) {

			//         console.log('Campaign Name: ' + lastAssigned[x].details[0].source[y].campaign[z].name);
			//         console.log('Campaign Count: ' + lastAssigned[x].details[0].source[y].campaign[z].count);

			//         console.log('before series_data_campaign: ' + JSON.stringify(series_data_campaign));

			//         var campaign_exists = false;
			//         var lpo_campaign_exists = false;
			//         var lpo_source_exists = false;
			//         for (var j = 0; j < series_data_campaign.length; j++) {

			//             if (series_data_campaign[j].name == lastAssigned[x].details[0].source[y].campaign[z].name) {
			//                 campaign_exists = true;
			//                 series_data_campaign[j].data[x] += lastAssigned[x].details[0].source[y].campaign[z].count
			//             }
			//         }
			//         if (campaign_exists == false) {
			//             dataSource = new Array(lastAssigned.length).fill(0);
			//             dataSource[x] = lastAssigned[x].details[0].source[y].campaign[z].count;

			//             var colorCodeCampaign;
			//             if (campaign_list.includes((lastAssigned[x].details[0].source[y].campaign[z].id).toString()) == true) {
			//                 colorCodeCampaign = campaign_list_color[campaign_list.indexOf((lastAssigned[x].details[0].source[y].campaign[z].id).toString())];
			//             }

			//             series_data_campaign.push({
			//                 name: lastAssigned[x].details[0].source[y].campaign[z].name,
			//                 data: dataSource,
			//                 color: colorCodeCampaign,
			//                 style: {
			//                     fontWeight: 'bold',
			//                 }
			//             });
			//         }

			//         if (lastAssigned[x].details[0].source[y].campaign[z].name == 'LPO - BAU' || lastAssigned[x].details[0].source[y].campaign[z].name == 'LPO') {
			//             lastAssigned[x] = lastAssigned[x].name;

			//             for (var j = 0; j < series_lpo_data_source.length; j++) {

			//                 if (series_lpo_data_source[j].name == lastAssigned[x].details[0].source[y].name) {
			//                     lpo_source_exists = true;
			//                     series_lpo_data_source[j].data[x] += lastAssigned[x].details[0].source[y].count
			//                 }
			//             }

			//             if (lpo_source_exists == false) {
			//                 dataLPOSource = new Array(lastAssigned.length).fill(0);
			//                 dataLPOSource[x] = lastAssigned[x].details[0].source[y].count;

			//                 var colorCodeSource;
			//                 if (source_list.includes((lastAssigned[x].details[0].source[y].id).toString()) == true) {
			//                     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].details[0].source[y].id).toString())];
			//                 }

			//                 series_lpo_data_source.push({
			//                     name: lastAssigned[x].details[0].source[y].name,
			//                     data: dataLPOSource,
			//                     color: colorCodeSource,
			//                     style: {
			//                         fontWeight: 'bold',
			//                     }
			//                 });
			//             }

			//             for (var j = 0; j < series_lpo_data_campaign.length; j++) {

			//                 if (series_lpo_data_campaign[j].name == lastAssigned[x].details[0].source[y].campaign[z].name) {
			//                     lpo_campaign_exists = true;
			//                     series_lpo_data_campaign[j].data[x] += lastAssigned[x].details[0].source[y].campaign[z].count
			//                 }
			//             }

			//             if (lpo_campaign_exists == false) {
			//                 dataLPOCampaign = new Array(lastAssigned.length).fill(0);
			//                 dataLPOCampaign[x] = lastAssigned[x].details[0].source[y].campaign[z].count;

			//                 var colorCodeLPOCampaign;
			//                 if (campaign_list.indexOf((lastAssigned[x].details[0].source[y].campaign[z].id).toString()) != -1) {
			//                     colorCodeLPOCampaign = campaign_list_color[campaign_list.indexOf((lastAssigned[x].details[0].source[y].campaign[z].id).toString())];
			//                 }

			//                 series_lpo_data_campaign.push({
			//                     name: lastAssigned[x].details[0].source[y].campaign[z].name,
			//                     data: dataLPOCampaign,
			//                     color: colorCodeLPOCampaign,
			//                     style: {
			//                         fontWeight: 'bold',
			//                     }
			//                 });
			//             }
			//         }

			//     }
			//     console.log('after series_data_campaign: ' + JSON.stringify(series_data_campaign));
			//     console.log('after series_lpo_data_source: ' + JSON.stringify(series_lpo_data_source));
			//     console.log('after series_lpo_data_campaign: ' + JSON.stringify(series_lpo_data_campaign));

			// }

			for (y = 0; y < lastAssigned[x].status[0].type.length; y++) {
				console.log("Status Name: " + lastAssigned[x].status[0].type[y].name);
				console.log("Status Count: " + lastAssigned[x].status[0].type[y].count);

				if (
					lastAssigned[x].status[0].type[y].id == 13 ||
					lastAssigned[x].status[0].type[y].id == 66
				) {
					console.log(
						"before series_data_signed: " + JSON.stringify(series_data_signed)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_signed.length; j++) {
						if (
							series_data_signed[j].name ==
							lastAssigned[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_signed[j].data[x] =
								lastAssigned[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						dataSigned = new Array(lastAssigned.length).fill(0);
						dataSigned[x] = lastAssigned[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_signed.push({
							name: lastAssigned[x].status[0].type[y].name,
							data: dataSigned,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (lastAssigned[x].status[0].type[y].id == 32) {
					console.log(
						"before series_data_free_trial: " +
						JSON.stringify(series_data_free_trial)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_free_trial.length; j++) {
						if (
							series_data_free_trial[j].name ==
							lastAssigned[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_free_trial[j].data[x] =
								lastAssigned[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						dataSigned = new Array(lastAssigned.length).fill(0);
						dataSigned[x] = lastAssigned[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_free_trial.push({
							name: lastAssigned[x].status[0].type[y].name,
							data: dataSigned,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (lastAssigned[x].status[0].type[y].id == 71) {
					console.log(
						"before series_data_trial_pending: " +
						JSON.stringify(series_data_trial_pending)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_trial_pending.length; j++) {
						if (
							series_data_trial_pending[j].name ==
							lastAssigned[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_trial_pending[j].data[x] =
								lastAssigned[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						dataSigned = new Array(lastAssigned.length).fill(0);
						dataSigned[x] = lastAssigned[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_trial_pending.push({
							name: lastAssigned[x].status[0].type[y].name,
							data: dataSigned,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				// console.log('after series_data_source: ' + JSON.stringify(series_data_source));
			}
		}
		console.log(
			"lastAssignedTeamMemberCategories: " +
			JSON.stringify(lastAssignedTeamMemberCategories)
		);
		console.log("series_data_signed: " + JSON.stringify(series_data_signed));
		plotChartSignedByLastAssigned(
			series_data_signed,
			null,
			lastAssignedTeamMemberCategories
		);
		plotChartFreeTrialByLastAssigned(
			series_data_free_trial,
			null,
			lastAssignedTeamMemberCategories
		);
		plotChartFreeTrialPendingByLastAssigned(
			series_data_trial_pending,
			null,
			lastAssignedTeamMemberCategories
		);
		// plotChartSignedCampaign(series_data_signed_source, null, lastAssignedTeamMemberCategories)

		//!
		var series_data_signed_source = [];
		var series_data_signed_campaign = [];
		var series_data_campaign_signed = [];
		var series_data_campaign_trial_pending = [];
		var series_data_campaign_free_trial = [];

		var campaignCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var campaignSigned = new Array(customerCampaign.length).fill(0);
		var campaignFreeTrial = new Array(customerCampaign.length).fill(0);
		var campaignFreeTrialPending = new Array(customerCampaign.length).fill(0);
		for (var x = 0; x < customerCampaign.length; x++) {
			campaignCategories[x] = customerCampaign[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + customerCampaign[x].name);
			// console.log('details: ' + JSON.stringify(customerCampaign[x].details[0].source));

			for (y = 0; y < customerCampaign[x].status[0].type.length; y++) {
				console.log(
					"Status Name: " + customerCampaign[x].status[0].type[y].name
				);
				console.log(
					"Status Count: " + customerCampaign[x].status[0].type[y].count
				);

				if (
					customerCampaign[x].status[0].type[y].id == 13 ||
					customerCampaign[x].status[0].type[y].id == 66
				) {
					console.log(
						"before series_data_campaign_signed: " +
						JSON.stringify(series_data_campaign_signed)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_campaign_signed.length; j++) {
						if (
							series_data_campaign_signed[j].name ==
							customerCampaign[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_campaign_signed[j].data[x] =
								customerCampaign[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						campaignSigned = new Array(customerCampaign.length).fill(0);
						campaignSigned[x] = customerCampaign[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_campaign_signed.push({
							name: customerCampaign[x].status[0].type[y].name,
							data: campaignSigned,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerCampaign[x].status[0].type[y].id == 32) {
					console.log(
						"before series_data_campaign_free_trial: " +
						JSON.stringify(series_data_campaign_free_trial)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_campaign_free_trial.length; j++) {
						if (
							series_data_campaign_free_trial[j].name ==
							customerCampaign[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_campaign_free_trial[j].data[x] =
								customerCampaign[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						campaignFreeTrial = new Array(customerCampaign.length).fill(0);
						campaignFreeTrial[x] = customerCampaign[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_campaign_free_trial.push({
							name: customerCampaign[x].status[0].type[y].name,
							data: campaignFreeTrial,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerCampaign[x].status[0].type[y].id == 71) {
					console.log(
						"before series_data_campaign_trial_pending: " +
						JSON.stringify(series_data_campaign_trial_pending)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_campaign_trial_pending.length; j++) {
						if (
							series_data_campaign_trial_pending[j].name ==
							customerCampaign[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_campaign_trial_pending[j].data[x] =
								customerCampaign[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						campaignFreeTrial = new Array(customerCampaign.length).fill(0);
						campaignFreeTrial[x] = customerCampaign[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_campaign_trial_pending.push({
							name: customerCampaign[x].status[0].type[y].name,
							data: campaignFreeTrial,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				// console.log('after series_data_source: ' + JSON.stringify(series_data_source));
			}
		}
		plotChartSignedByCampaign(
			series_data_campaign_signed,
			null,
			campaignCategories
		);
		plotChartFreeTrialByCampaign(
			series_data_campaign_free_trial,
			null,
			campaignCategories
		);
		plotChartFreeTrialPendingByCampaign(
			series_data_campaign_trial_pending,
			null,
			campaignCategories
		);

		//!
		//!
		var series_data_signed_source = [];
		var series_data_signed_campaign = [];
		var series_data_source_signed = [];
		var series_data_source_trial_pending = [];
		var series_data_source_free_trial = [];

		var sourceCategories = [];
		var sourceLeadCount = [];
		var sourceName = [];
		var sourceSigned = new Array(customerSource.length).fill(0);
		var sourceFreeTrial = new Array(customerSource.length).fill(0);
		var sourceFreeTrialPending = new Array(customerSource.length).fill(0);
		for (var x = 0; x < customerSource.length; x++) {
			sourceCategories[x] = customerSource[x].name;
			sourceLeadCount[x] = [];
			sourceName[x] = [];
			console.log("name: " + customerSource[x].name);
			// console.log('details: ' + JSON.stringify(customerSource[x].details[0].source));

			for (y = 0; y < customerSource[x].status[0].type.length; y++) {
				console.log("Status Name: " + customerSource[x].status[0].type[y].name);
				console.log(
					"Status Count: " + customerSource[x].status[0].type[y].count
				);

				if (
					customerSource[x].status[0].type[y].id == 13 ||
					customerSource[x].status[0].type[y].id == 66
				) {
					console.log(
						"before series_data_source_signed: " +
						JSON.stringify(series_data_source_signed)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_source_signed.length; j++) {
						if (
							series_data_source_signed[j].name ==
							customerSource[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_source_signed[j].data[x] =
								customerSource[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						sourceSigned = new Array(customerSource.length).fill(0);
						sourceSigned[x] = customerSource[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_source_signed.push({
							name: customerSource[x].status[0].type[y].name,
							data: sourceSigned,
							color: "#439A97",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerSource[x].status[0].type[y].id == 32) {
					console.log(
						"before series_data_source_free_trial: " +
						JSON.stringify(series_data_source_free_trial)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_source_free_trial.length; j++) {
						if (
							series_data_source_free_trial[j].name ==
							customerSource[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_source_free_trial[j].data[x] =
								customerSource[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						sourceFreeTrial = new Array(customerSource.length).fill(0);
						sourceFreeTrial[x] = customerSource[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_source_free_trial.push({
							name: customerSource[x].status[0].type[y].name,
							data: sourceFreeTrial,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				if (customerSource[x].status[0].type[y].id == 71) {
					console.log(
						"before series_data_source_trial_pending: " +
						JSON.stringify(series_data_source_trial_pending)
					);
					var status_exists = false;
					for (var j = 0; j < series_data_source_trial_pending.length; j++) {
						if (
							series_data_source_trial_pending[j].name ==
							customerSource[x].status[0].type[y].name
						) {
							status_exists = true;
							series_data_source_trial_pending[j].data[x] =
								customerSource[x].status[0].type[y].count;
						}
					}
					if (status_exists == false) {
						sourceFreeTrialPending = new Array(customerSource.length).fill(0);
						sourceFreeTrialPending[x] =
							customerSource[x].status[0].type[y].count;

						// var colorCodeSource;
						// if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
						//     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
						// }

						series_data_source_trial_pending.push({
							name: customerSource[x].status[0].type[y].name,
							data: sourceFreeTrialPending,
							color: "#ADCF9F",
							style: {
								fontWeight: "bold",
							},
						});
					}
				}

				// console.log('after series_data_source: ' + JSON.stringify(series_data_source));
			}
		}
		plotChartSignedBySource(series_data_source_signed, null, sourceCategories);
		plotChartFreeTrialBySource(
			series_data_source_free_trial,
			null,
			sourceCategories
		);
		plotChartFreeTrialPendingBySource(
			series_data_source_trial_pending,
			null,
			sourceCategories
		);

		var dataTableExisitngCustomers = $(
			"#mpexusage-existing_customers"
		).DataTable({
			data: existingCustomerDataSet,
			pageLength: 250,
			order: [[11, "des"]],
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
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Source" }, //5
				{ title: "Product Weekly Usage" }, //6
				{ title: "Previous Carrier" }, //7
				// { title: 'MP Express' },//8
				// { title: 'MP Standard' },//9
				{ title: "Daily Usage" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				// { title: '48h Email Sent' },
				{ title: "Date - Prospect Won" }, //11
				{ title: "Days Open" }, //12
				{ title: "Expected Monthly Service" }, //13
				{ title: "Total Service Invoice" }, //14
				{ title: "Total Product Invoice" }, //15
				{ title: "Total Invoice" }, //16
				{ title: "Gift Box Activated?" }, //17
				{ title: "Lead Entered By" }, //18
				{ title: "Sales Campaign" }, //19
				{ title: "Sales Rep" }, //20
				{ title: "Auto Signed Up" }, //21
				{ title: "Child Table" }, //22
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [21, 22],
					visible: false,
				},
				{
					targets: [2, 3, 4, 11, 13, 14, 15, 16, 17],
					className: "bolded",
				},
				{
					targets: [0, 8, 12],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				var row_color = "";
				if (data[5] == "Additional Services") {
					$("td", row).css("background-color", "#86A3B8");
					// } else if (!isNullorEmpty(data[19])) {
					//     data[21].forEach(function (el) {
					//         if (isNullorEmpty(el.invoiceDocumentNumber) || parseFloat(el.invoiceAmount) == 0 || el.invoiceDocumentNumber == 'Memorized') {
					//             row_color = ''

					//         } else {
					//             row_color = '#53BF9D'
					//         }
					//     });
					//     $('td', row).css('background-color', row_color);
				} else if (!isNullorEmpty(data[13])) {
					$("td", row).css("background-color", "#ADCF9F");
				}
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// // Total MP Express Usage
				// total_mp_exp_usage = api
				//     .column(8)
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Page Total MP Express Usage
				// page_mp_exp_usage = api
				//     .column(8, {
				//         page: 'current'
				//     })
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Total MP Standard Usage
				// total_mp_std_usage = api
				//     .column(9)
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Page Total MP Standard Usage
				// page_mp_std_usage = api
				//     .column(9, {
				//         page: 'current'
				//     })
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_service_invoice_amount = api
					.column(14)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_service_invoice_amount = api
					.column(14, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prod_nvoice_amount = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_prod_invoice_amount = api
					.column(15, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Expected Usage over all pages
				total_invoice_amount = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_invoice_amount = api
					.column(16, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// $(api.column(8).footer()).html(
				//     page_mp_exp_usage
				// );
				// $(api.column(9).footer()).html(
				//     page_mp_std_usage
				// );

				// Update footer
				$(api.column(13).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(14).footer()).html(
					formatter.format(pagetotal_service_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(15).footer()).html(
					formatter.format(pagetotal_prod_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(16).footer()).html(
					formatter.format(pagetotal_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);
			},
		});

		dataTableExisitngCustomers.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildExisting(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-existing_customers tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableExisitngCustomers.row(tr);

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

		var dataTableTrialCustomers = $("#mpexusage-trial_customers").DataTable({
			data: trialCustomerDataSet,
			pageLength: 250,
			order: [[13, "asc"]],
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
					title: "Expand Status Change",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Source" }, //5
				{ title: "Previous Carrier" }, //6
				{ title: "Date - Lead Entered" }, //7
				{ title: "Date - Quote Sent" }, //8
				{ title: "Date - Prospect Won" }, //9
				{ title: "T & C's Agreed Date" }, //10
				{ title: "Franchisee Visited Date" }, //11
				{ title: "LPO Comms to Customer" }, //12
				{ title: "Trial End Date" }, //13
				{ title: "Days Open" }, //14
				{ title: "Expected Monthly Service" }, //15
				{ title: "Lead Entered By" }, //16
				{ title: "Sales Campaign" }, //17
				{ title: "Sales Rep" }, //18
				{ title: "Child Table" }, //19
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [2, 3, 4, 12, 13],
					className: "bolded",
				},
				{
					targets: [19],
					visible: false,
				},
				{
					targets: [0, 14],
					className: "notexport",
				},
			],
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				total_monthly_service_value = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(15).footer()).html(
					formatter.format(total_monthly_service_value)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);
			},
		});

		dataTableTrialCustomers.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildTrialCustomers(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-trial_customers tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableTrialCustomers.row(tr);

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

		var dataTableTrialPendingCustomers = $(
			"#mpexusage-trial_pending_customers"
		).DataTable({
			data: trialPendingCustomerDataSet,
			pageLength: 250,
			order: [[14, "asc"]],
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
					title: "Expand Status Change",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Source" }, //5
				{ title: "Previous Carrier" }, //6
				{ title: "Date - Lead Entered" }, //7
				{ title: "Date - Quote Sent" }, //8
				{ title: "Date - Prospect Won" }, //9
				{ title: "T & C's Agreed Date" }, //10
				{ title: "Franchisee Visited Date" }, //11
				{ title: "LPO Comms to Customer" }, //12
				{ title: "Trial End Date" }, //13
				{ title: "Days Open" }, //14
				{ title: "Expected Monthly Service" }, //15
				{ title: "Lead Entered By" }, //16
				{ title: "Sales Campaign" }, //17
				{ title: "Sales Rep" }, //18
				{ title: "Child Table" }, //19
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [2, 3, 4, 12, 13],
					className: "bolded",
				},
				{
					targets: [19],
					visible: false,
				},
				{
					targets: [0, 14],
					className: "notexport",
				},
			],
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				total_monthly_service_value = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				$(api.column(15).footer()).html(
					formatter.format(total_monthly_service_value)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);
			},
		});

		dataTableTrialPendingCustomers.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildTrialPendingCustomers(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-trial_pending_customers tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableTrialPendingCustomers.row(tr);

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

		var dataTable = $("#mpexusage-customer").DataTable({
			data: customerDataSet,
			pageLength: 250,
			order: [[11, "des"]],
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
				// {
				// 	title: "Expand",
				// 	className: "dt-control",
				// 	orderable: false,
				// 	data: null,
				// 	defaultContent:
				// 		'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				// }, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Source" }, //5
				{ title: "Product Weekly Usage" }, //6
				{ title: "Previous Carrier" }, //7
				// { title: 'MP Express' },//8
				// { title: 'MP Standard' },//9
				{ title: "Daily Usage" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				// { title: '48h Email Sent' },
				{ title: "Date - Prospect Won" }, //11
				{ title: "Service Commencement Date" }, //12
				{ title: "Days Open" }, //13
				{ title: "Expected Monthly Service" }, //14
				{ title: "Total Service Invoice" }, //15
				{ title: "Total Product Invoice" }, //16
				{ title: "Total Invoice" }, //17
				{ title: "Gift Box Activated?" }, //18
				{ title: "Lead Entered By" }, //19
				{ title: "Sales Campaign" }, //20
				{ title: "Sales Rep" }, //21
				{ title: "Auto Signed Up" }, //22
				// { title: "Child Table" }, //22
			],
			autoWidth: false,
			// columnDefs: [
			// 	{
			// 		targets: [21, 22],
			// 		visible: false,
			// 	},
			// 	{
			// 		targets: [2, 3, 4, 11, 13, 14, 15, 16, 17],
			// 		className: "bolded",
			// 	},
			// 	{
			// 		targets: [0, 8, 12],
			// 		className: "notexport",
			// 	},
			// ],
			columnDefs: [
				{
					targets: [21],
					visible: false,
				},
				{
					targets: [1, 2, 3, 10, 13, 14, 15, 16, 17],
					className: "bolded",
				},
				{
					targets: [7, 12],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				var row_color = "";
				// if (data[5] == "Additional Services") {
				// 	$("td", row).css("background-color", "#86A3B8");
				// 	// } else if (!isNullorEmpty(data[19])) {
				// 	//     data[21].forEach(function (el) {
				// 	//         if (isNullorEmpty(el.invoiceDocumentNumber) || parseFloat(el.invoiceAmount) == 0 || el.invoiceDocumentNumber == 'Memorized') {
				// 	//             row_color = ''

				// 	//         } else {
				// 	//             row_color = '#53BF9D'
				// 	//         }
				// 	//     });
				// 	//     $('td', row).css('background-color', row_color);
				// } else if (!isNullorEmpty(data[13])) {
				// 	$("td", row).css("background-color", "#ADCF9F");
				// }
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// // Total MP Express Usage
				// total_mp_exp_usage = api
				//     .column(8)
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Page Total MP Express Usage
				// page_mp_exp_usage = api
				//     .column(8, {
				//         page: 'current'
				//     })
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Total MP Standard Usage
				// total_mp_std_usage = api
				//     .column(9)
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Page Total MP Standard Usage
				// page_mp_std_usage = api
				//     .column(9, {
				//         page: 'current'
				//     })
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_service_invoice_amount = api
					.column(14)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_service_invoice_amount = api
					.column(14, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prod_nvoice_amount = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_prod_invoice_amount = api
					.column(15, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Expected Usage over all pages
				total_invoice_amount = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_invoice_amount = api
					.column(16, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// $(api.column(8).footer()).html(
				//     page_mp_exp_usage
				// );
				// $(api.column(9).footer()).html(
				//     page_mp_std_usage
				// );

				// Update footer
				$(api.column(13).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(14).footer()).html(
					formatter.format(pagetotal_service_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(15).footer()).html(
					formatter.format(pagetotal_prod_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(16).footer()).html(
					formatter.format(pagetotal_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);
			},
		});

		var dataTable = $("#mpexusage-shipmate_pending").DataTable({
			data: shipMatePendingCustomerDataSet,
			pageLength: 250,
			order: [[11, "des"]],
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
				// {
				// 	title: "Expand",
				// 	className: "dt-control",
				// 	orderable: false,
				// 	data: null,
				// 	defaultContent:
				// 		'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				// }, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Source" }, //5
				{ title: "Product Weekly Usage" }, //6
				{ title: "Previous Carrier" }, //7
				// { title: 'MP Express' },//8
				// { title: 'MP Standard' },//9
				{ title: "Daily Usage" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				// { title: '48h Email Sent' },
				{ title: "Date - Prospect Won" }, //11
				{ title: "Service Commencement Date" }, //12
				{ title: "Days Open" }, //13
				{ title: "Expected Monthly Service" }, //14
				{ title: "Total Service Invoice" }, //15
				{ title: "Total Product Invoice" }, //16
				{ title: "Total Invoice" }, //17
				{ title: "Gift Box Activated?" }, //18
				{ title: "Lead Entered By" }, //19
				{ title: "Sales Campaign" }, //20
				{ title: "Sales Rep" }, //21
				{ title: "Auto Signed Up" }, //22
				// { title: "Child Table" }, //22
			],
			autoWidth: false,
			// columnDefs: [
			// 	{
			// 		targets: [21, 22],
			// 		visible: false,
			// 	},
			// 	{
			// 		targets: [2, 3, 4, 11, 13, 14, 15, 16, 17],
			// 		className: "bolded",
			// 	},
			// 	{
			// 		targets: [0, 8, 12],
			// 		className: "notexport",
			// 	},
			// ],
			columnDefs: [
				{
					targets: [21],
					visible: false,
				},
				{
					targets: [1, 2, 3, 10, 13, 14, 15, 16, 17],
					className: "bolded",
				},
				{
					targets: [7, 12],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				var row_color = "";
				// if (data[5] == "Additional Services") {
				// 	$("td", row).css("background-color", "#86A3B8");
				// 	// } else if (!isNullorEmpty(data[19])) {
				// 	//     data[21].forEach(function (el) {
				// 	//         if (isNullorEmpty(el.invoiceDocumentNumber) || parseFloat(el.invoiceAmount) == 0 || el.invoiceDocumentNumber == 'Memorized') {
				// 	//             row_color = ''

				// 	//         } else {
				// 	//             row_color = '#53BF9D'
				// 	//         }
				// 	//     });
				// 	//     $('td', row).css('background-color', row_color);
				// } else if (!isNullorEmpty(data[13])) {
				// 	$("td", row).css("background-color", "#ADCF9F");
				// }
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// // Total MP Express Usage
				// total_mp_exp_usage = api
				//     .column(8)
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Page Total MP Express Usage
				// page_mp_exp_usage = api
				//     .column(8, {
				//         page: 'current'
				//     })
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Total MP Standard Usage
				// total_mp_std_usage = api
				//     .column(9)
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// // Page Total MP Standard Usage
				// page_mp_std_usage = api
				//     .column(9, {
				//         page: 'current'
				//     })
				//     .data()
				//     .reduce(function (a, b) {
				//         return intVal(a) + intVal(b);
				//     }, 0);

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_service_invoice_amount = api
					.column(14)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_service_invoice_amount = api
					.column(14, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				total_prod_nvoice_amount = api
					.column(15)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_prod_invoice_amount = api
					.column(15, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Total Expected Usage over all pages
				total_invoice_amount = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				pagetotal_invoice_amount = api
					.column(16, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// $(api.column(8).footer()).html(
				//     page_mp_exp_usage
				// );
				// $(api.column(9).footer()).html(
				//     page_mp_std_usage
				// );

				// Update footer
				$(api.column(13).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(14).footer()).html(
					formatter.format(pagetotal_service_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(15).footer()).html(
					formatter.format(pagetotal_prod_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);

				$(api.column(16).footer()).html(
					formatter.format(pagetotal_invoice_amount)
					// '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
				);
			},
		});

		// dataTable.rows().every(function () {
		// 	// this.child(format(this.data())).show();
		// 	this.child(createChild(this)); // Add Child Tables
		// 	this.child.hide(); // Hide Child Tables on Open
		// });

		// $("#mpexusage-customer tbody").on("click", "td.dt-control", function () {
		// 	var tr = $(this).closest("tr");
		// 	var row = dataTable.row(tr);

		// 	if (row.child.isShown()) {
		// 		// This row is already open - close it
		// 		destroyChild(row);
		// 		tr.removeClass("shown");
		// 		tr.removeClass("parent");

		// 		$(".expand-button").addClass("btn-primary");
		// 		$(".expand-button").removeClass("btn-light");
		// 	} else {
		// 		// Open this row
		// 		row.child.show();
		// 		tr.addClass("shown");
		// 		tr.addClass("parent");

		// 		$(".expand-button").removeClass("btn-primary");
		// 		$(".expand-button").addClass("btn-light");
		// 	}
		// });

		console.log("prospectDataSet: " + prospectDataSet);

		var dataTable2 = $(
			"#mpexusage-prospects_quoteSent_incontact_noanswer"
		).DataTable({
			data: prospectDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Product Weekly Usage" }, //7
				{ title: "Previous Carrier" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				{ title: "48h Email Sent" }, //11
				{ title: "Days Open" }, //12
				{ title: "Monthly Service Value" }, //13
				{ title: "Sales Rep" }, //14
				{ title: "Child Table" }, //15
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [15],
					visible: false,
				},
				{
					targets: [2, 3, 4, 5, 12, 13],
					className: "bolded",
				},
				{
					targets: [0, 12],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[5] == "PROSPECT-OPPORTUNITY") {
					$("td", row).css("background-color", "#ADCF9F");
				} else if (isNullorEmpty(data[15]) && data[5] != "PROSPECT-NO ANSWER") {
					$("td", row).css("background-color", "#f9c67a");
				} else if (!isNullorEmpty(data[15])) {
					// var row_color = '#f9c67a'
					// data[15].forEach(function (el) {
					//     if (!isNullorEmpty(el)) {
					//         if (el.activityOrganiser == 'Kerina Helliwell' || el.activityOrganiser == 'David Gdanski' || el.activityOrganiser == 'Lee Russell' || el.activityOrganiser == 'Belinda Urbani' || el.activityOrganiser == 'Luke Forbes' || el.activityOrganiser == 'Bobbi G Yengbie') {
					//             row_color = ''
					//         }
					//     }
					// });
					// $('td', row).css('background-color', row_color);
				}
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(13).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
				);
			},
		});

		dataTable2.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChild2(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-prospects_quoteSent_incontact_noanswer tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTable2.row(tr);

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

		console.log("prospectDataSet: " + prospectDataSet);

		var dataTableOpportunity = $("#mpexusage-prospects_opportunites").DataTable(
			{
				data: prospectQuoteSentDataSet,
				pageLength: 250,
				order: [10, "desc"],
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
						className: "dt-control",
						orderable: false,
						data: null,
						defaultContent:
							'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
					}, //0
					{ title: "Internal ID" }, //1
					{ title: "ID" }, //2
					{ title: "Company Name" }, //3
					{ title: "Franchisee" }, //4
					{ title: "Status" }, //5
					{ title: "Source" }, //6
					{ title: "Product Weekly Usage" }, //7
					{ title: "Previous Carrier" }, //8
					{ title: "Date - Lead Entered" }, //9
					{ title: "Date - Quote Sent" }, //10
					{ title: "48h Email Sent" }, //11
					{ title: "Days Open" }, //12
					{ title: "Monthly Service Value" }, //13
					{ title: "Sales Rep" }, //14
					{ title: "Child Table" }, //15
				],
				autoWidth: false,
				columnDefs: [
					{
						targets: [15],
						visible: false,
					},
					{
						targets: [2, 3, 4, 5, 12, 13],
						className: "bolded",
					},
					{
						targets: [0, 12],
						className: "notexport",
					},
				],
				rowCallback: function (row, data, index) {
					if (data[5] == "PROSPECT-QUOTE SENT") {
						$("td", row).css("background-color", "#ADCF9F");
					} else if (
						isNullorEmpty(data[15]) &&
						data[5] != "PROSPECT-NO ANSWER"
					) {
						$("td", row).css("background-color", "#f9c67a");
					} else if (!isNullorEmpty(data[15])) {
						var row_color = "#f9c67a";
						data[15].forEach(function (el) {
							if (!isNullorEmpty(el)) {
								if (
									el.activityOrganiser == "Kerina Helliwell" ||
									el.activityOrganiser == "David Gdanski" ||
									el.activityOrganiser == "Lee Russell" ||
									el.activityOrganiser == "Belinda Urbani" ||
									el.activityOrganiser == "Luke Forbes" ||
									el.activityOrganiser == "Bobbi G Yengbie"
								) {
									row_color = "";
								}
							}
						});
						$("td", row).css("background-color", row_color);
					}
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

					const formatter = new Intl.NumberFormat("en-AU", {
						style: "currency",
						currency: "AUD",
						minimumFractionDigits: 2,
					});

					// Total Expected Usage over all pages
					total_monthly_service_revenue = api
						.column(13)
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Page Total Expected Usage over this page
					page_total_monthly_service_revenue = api
						.column(13, {
							page: "current",
						})
						.data()
						.reduce(function (a, b) {
							return intVal(a) + intVal(b);
						}, 0);

					// Update footer
					$(api.column(13).footer()).html(
						formatter.format(page_total_monthly_service_revenue)
					);
				},
			}
		);

		dataTableOpportunity.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChild2(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-prospects_opportunites tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableOpportunity.row(tr);

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

		console.log("prospectBoxSentDataSet: " + prospectBoxSentDataSet);

		var dataTableBoxSent = $("#mpexusage-prospects_box_sent").DataTable({
			data: prospectBoxSentDataSet,
			pageLength: 250,
			order: [10, "desc"],
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
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Product Weekly Usage" }, //7
				{ title: "Previous Carrier" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				{ title: "48h Email Sent" }, //11
				{ title: "Days Open" }, //12
				{ title: "Monthly Service Value" }, //13
				{ title: "Sales Rep" }, //14
				{ title: "Child Table" }, //15
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [15],
					visible: false,
				},
				{
					targets: [2, 3, 4, 5, 12, 13],
					className: "bolded",
				},
				{
					targets: [0, 12],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[5] == "PROSPECT-QUOTE SENT") {
					$("td", row).css("background-color", "#ADCF9F");
				} else if (isNullorEmpty(data[15]) && data[5] != "PROSPECT-NO ANSWER") {
					$("td", row).css("background-color", "#f9c67a");
				} else if (!isNullorEmpty(data[15])) {
					var row_color = "#f9c67a";
					data[15].forEach(function (el) {
						if (!isNullorEmpty(el)) {
							if (
								el.activityOrganiser == "Kerina Helliwell" ||
								el.activityOrganiser == "David Gdanski" ||
								el.activityOrganiser == "Lee Russell" ||
								el.activityOrganiser == "Belinda Urbani" ||
								el.activityOrganiser == "Luke Forbes" ||
								el.activityOrganiser == "Bobbi G Yengbie"
							) {
								row_color = "";
							}
						}
					});
					$("td", row).css("background-color", row_color);
				}
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(13)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(13, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(13).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
				);
			},
		});

		dataTableBoxSent.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChild2(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-prospects_box_sent tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableBoxSent.row(tr);

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

		console.log("suspectDataSet: " + suspectDataSet);

		var dataTable3 = $("#mpexusage-suspects").DataTable({
			data: suspectDataSet,
			pageLength: 250,
			order: [8, "desc"],
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
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Previous Carrier" }, //7
				{ title: "Date - Lead Entered" }, //8
				{ title: "48H Email Sent?" }, //9
				{ title: "Days Open" }, //10
				{ title: "Sales Rep" }, //11
				{ title: "Child Table" }, //12
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [12],
					visible: false,
				},
				{
					targets: [2, 3, 4, 5, 6, 8, 10],
					className: "bolded",
				},
				{
					taregts: [0, 10],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				console.log(JSON.stringify(data[12]));
				console.log(data[12].length);

				if (isNullorEmpty(data[12])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
			footerCallback: function (row, data, start, end, display) { },
		});

		dataTable3.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildSuspectsNew(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects tbody").on("click", "td.dt-control", function () {
			var tr = $(this).closest("tr");
			var row = dataTable3.row(tr);

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

		console.log("suspectQualifiedDataSet: " + suspectQualifiedDataSet);

		var dataTableQualified = $("#mpexusage-suspects_qualified").DataTable({
			data: suspectQualifiedDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Previous Carrier" }, //7
				{ title: "Date - Lead Entered" }, //8
				{ title: "Days Open" }, //9
				{ title: "Sales Rep" }, //10
				{ title: "Child Table" }, //11
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [11],
					visible: false,
				},
				{
					targets: [2, 3, 4, 6, 9, 10],
					className: "bolded",
				},
				{
					targets: [0, 9],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (isNullorEmpty(data[11])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
			footerCallback: function (row, data, start, end, display) { },
		});

		dataTableQualified.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildQualified(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_qualified tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableQualified.row(tr);

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

		console.log("suspectUnqualifiedDataSet: " + suspectUnqualifiedDataSet);

		var dataTableUnqualified = $("#mpexusage-suspects_unqualified").DataTable({
			data: suspectUnqualifiedDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Previous Carrier" }, //7
				{ title: "Date - Lead Entered" }, //8
				{ title: "Days Open" }, //9
				{ title: "Sales Rep" }, //10
				{ title: "Child Table" }, //11
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [11],
					visible: false,
				},
				{
					targets: [2, 3, 4, 6, 9, 10],
					className: "bolded",
				},
				{
					targets: [0, 9],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (isNullorEmpty(data[11])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
			footerCallback: function (row, data, start, end, display) { },
		});

		dataTableUnqualified.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildUnqualified(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_unqualified tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableUnqualified.row(tr);

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

		var dataTableValidated = $("#mpexusage-suspects_validated").DataTable({
			data: suspectValidatedDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Previous Carrier" }, //7
				{ title: "Date - Lead Entered" }, //8
				{ title: "Date - LPO Validated" }, //9
				{ title: "Days Open" }, //10
				{ title: "Sales Rep" }, //11
				{ title: "Child Table" }, //12
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [12],
					visible: false,
				},
				{
					targets: [2, 3, 4, 6, 9, 10],
					className: "bolded",
				},
				{
					targets: [0, 10],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				console.log("mpexusage-suspects_qualified");
				console.log(JSON.stringify(data[12]));
				console.log(data[12].length);

				if (isNullorEmpty(data[12])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
			footerCallback: function (row, data, start, end, display) { },
		});

		var dataTableZeeReview = $("#mpexusage-suspects_zee_review").DataTable({
			data: suspectZeeReviewDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Previous Carrier" }, //7
				{ title: "Date - Lead Entered" }, //8
				{ title: "Date - LPO Validated" }, //9
				{ title: "Days Open" }, //10
				{ title: "Sales Rep" }, //11
				{ title: "Child Table" }, //12
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [12],
					visible: false,
				},
				{
					targets: [2, 3, 4, 6, 9, 10],
					className: "bolded",
				},
				{
					targets: [0, 10],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				console.log("mpexusage-suspects_qualified");
				console.log(JSON.stringify(data[12]));
				console.log(data[12].length);

				if (isNullorEmpty(data[12])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
			footerCallback: function (row, data, start, end, display) { },
		});

		dataTableZeeReview.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildValidated(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_zee_review tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableValidated.row(tr);

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

		console.log("suspectOffPeakDataSet: " + suspectOffPeakDataSet);

		var dataTable5 = $("#mpexusage-suspects_off_peak_pipeline").DataTable({
			data: suspectOffPeakDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Product Weekly Usage" }, //7
				{ title: "Previous Carrier" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				{ title: "Date - Lead Reassigned" }, //11
				{ title: "Date - Lead Lost" }, //12
				{ title: "48H Email Sent?" }, //13
				{ title: "Days Open" }, //14
				{ title: "Cancellation Reason" }, //15
				{ title: "Monthly Service Value" }, //16
				{ title: "Sales Rep" }, //17
				{ title: "Child Table" }, //18
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [18],
					visible: false,
				},
				{
					targets: [2, 3, 4, 14, 15],
					className: "bolded",
				},
				{
					targets: [0, 14],
					className: "notexported",
				},
			],
			rowCallback: function (row, data, index) {
				if (isNullorEmpty(data[18])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
		});

		dataTable5.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChild3(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_off_peak_pipeline tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTable5.row(tr);

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

		console.log("suspectLostDataSet: " + suspectLostDataSet);

		var dataTable6 = $("#mpexusage-suspects_lost").DataTable({
			data: suspectLostDataSet,
			pageLength: 250,
			order: [12, "desc"],
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
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Product Weekly Usage" }, //7
				{ title: "Previous Carrier" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				{ title: "Date - Prospect Won" }, //11
				{ title: "Date - Lead Lost" }, //12
				{ title: "48H Email Sent?" }, //13
				{ title: "Days Open" }, //14
				{ title: "Old Cancellation Reason" }, //15
				{ title: "Cancellation Theme" }, //16
				{ title: "Cancellation What" }, //17
				{ title: "Cancellation Why" }, //18
				{ title: "Monthly Service Value" }, //19
				{ title: "Avg Invoice - Last 3 Months" }, //20
				{ title: "Sales Rep" }, //21
				{ title: "Child Table" }, //22
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [22],
					visible: false,
				},
				{
					targets: [2, 3, 4, 14, 16, 17, 18],
					className: "bolded",
				},
				{
					targets: [0, 14],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				console.log(JSON.stringify(data[22]));
				console.log(data[22].length);

				if (isNullorEmpty(data[22])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (!isNullorEmpty(data[20])) {
					$("td", row).css("background-color", "#E86252");
					$("td", row).css("font-weight", "bold");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					// $('td', row).css('background-color', '#EBB3A9');
				}
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(19)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(19, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(19).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
				);

				// Total Expected Usage over all pages
				total_avg_monthly_service_revenue = api
					.column(20)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_avg_monthly_service_revenue = api
					.column(20, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(20).footer()).html(
					formatter.format(page_total_avg_monthly_service_revenue)
				);
			},
		});

		dataTable6.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildSuspectLost(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_lost tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTable6.row(tr);

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

		console.log("suspectOOTDataSet: " + suspectOOTDataSet);

		var dataTable7 = $("#mpexusage-suspects_oot").DataTable({
			data: suspectOOTDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Product Weekly Usage" }, //7
				{ title: "Previous Carrier" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				{ title: "Date - Lead Reassigned" }, //11
				{ title: "Date - Lead Lost" }, //12
				{ title: "48H Email Sent?" }, //13
				{ title: "Days Open" }, //14
				{ title: "Cancellation Reason" }, //15
				{ title: "Monthly Service Value" }, //16
				{ title: "Sales Rep" }, //17
				{ title: "Child Table" }, //18
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [18],
					visible: false,
				},
				{
					targets: [2, 3, 4, 14, 15],
					className: "bolded",
				},
				{
					targets: [0, 14],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (isNullorEmpty(data[18])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
		});

		dataTable7.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChild3(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_oot tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTable7.row(tr);

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

		console.log("suspectFollowUpDataSet: " + suspectFollowUpDataSet);

		var dataTable8 = $("#mpexusage-suspects_followup").DataTable({
			data: suspectFollowUpDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Product Weekly Usage" }, //7
				{ title: "Previous Carrier" }, //8
				{ title: "Date - Lead Entered" }, //9
				{ title: "Date - Quote Sent" }, //10
				{ title: "Date - Lead Reassigned" }, //11
				{ title: "Date - Lead Lost" }, //12
				{ title: "48H Email Sent?" }, //13
				{ title: "Days Open" }, //14
				{ title: "Cancellation Reason" }, //15
				{ title: "Monthly Service Value" }, //16
				{ title: "Sales Rep" }, //17
				{ title: "Child Table" }, //18
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [18],
					visible: false,
				},
				{
					targets: [2, 3, 4, 14, 15],
					className: "bolded",
				},
				{
					taregts: [0, 14],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (isNullorEmpty(data[18])) {
					$("td", row).css("background-color", "#f9c67a");
				}
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

				const formatter = new Intl.NumberFormat("en-AU", {
					style: "currency",
					currency: "AUD",
					minimumFractionDigits: 2,
				});

				// Total Expected Usage over all pages
				total_monthly_service_revenue = api
					.column(16)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Page Total Expected Usage over this page
				page_total_monthly_service_revenue = api
					.column(16, {
						page: "current",
					})
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(16).footer()).html(
					formatter.format(page_total_monthly_service_revenue)
				);
			},
		});

		dataTable8.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChild3(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_followup tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTable8.row(tr);

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

		console.log("suspectNoAnswerDataSet: " + suspectNoAnswerDataSet);

		var dataTableSuspectNoAnswer = $("#mpexusage-suspects_no_answer").DataTable(
			{
				data: suspectNoAnswerDataSet,
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
					{
						title: "Expand",
						className: "dt-control",
						orderable: false,
						data: null,
						defaultContent:
							'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
					}, //0
					{ title: "Internal ID" }, //1
					{ title: "ID" }, //2
					{ title: "Company Name" }, //3
					{ title: "Franchisee" }, //4
					{ title: "Status" }, //5
					{ title: "Source" }, //6
					{ title: "Previous Carrier" }, //7
					{ title: "Date - Lead Entered" }, //8
					{ title: "Days Open" }, //9
					{ title: "Sales Rep" }, //10
					{ title: "Child Table" }, //11
				],
				autoWidth: false,
				columnDefs: [
					{
						targets: [11],
						visible: false,
					},
					{
						targets: [2, 3, 4, 6, 9, 10],
						className: "bolded",
					},
					{
						targets: [0, 9],
						className: "notexport",
					},
				],
				rowCallback: function (row, data, index) {
					console.log(
						data[3] + " Suspects No Answer Child Data Set: " + data[11]
					);
					if (isNullorEmpty(data[11])) {
						$("td", row).css("background-color", "#f9c67a");
					}

					if (
						data[5].toUpperCase() == "SUSPECT-LOST" ||
						data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
					) {
						$("td", row).css("background-color", "#FF8787");
					}
				},
				footerCallback: function (row, data, start, end, display) { },
			}
		);

		dataTableSuspectNoAnswer.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildNoAnswerInContact(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_no_answer tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableSuspectNoAnswer.row(tr);

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

		var dataTableSuspectInContact = $(
			"#mpexusage-suspects_in_contact"
		).DataTable({
			data: suspectInContactDataSet,
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
				{
					title: "Expand",
					className: "dt-control",
					orderable: false,
					data: null,
					defaultContent:
						'<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
				}, //0
				{ title: "Internal ID" }, //1
				{ title: "ID" }, //2
				{ title: "Company Name" }, //3
				{ title: "Franchisee" }, //4
				{ title: "Status" }, //5
				{ title: "Source" }, //6
				{ title: "Previous Carrier" }, //7
				{ title: "Date - Lead Entered" }, //8
				{ title: "Days Open" }, //9
				{ title: "Sales Rep" }, //10
				{ title: "Child Table" }, //11
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [11],
					visible: false,
				},
				{
					targets: [2, 3, 4, 6, 9, 10],
					className: "bolded",
				},
				{
					targets: [0, 9],
					className: "notexport",
				},
			],
			rowCallback: function (row, data, index) {
				if (isNullorEmpty(data[11])) {
					$("td", row).css("background-color", "#f9c67a");
				}

				if (
					data[5].toUpperCase() == "SUSPECT-LOST" ||
					data[5].toUpperCase() == "SUSPECT-OUT OF TERRITORY"
				) {
					$("td", row).css("background-color", "#FF8787");
				}
			},
			footerCallback: function (row, data, start, end, display) { },
		});

		dataTableSuspectInContact.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildNoAnswerInContact(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#mpexusage-suspects_in_contact tbody").on(
			"click",
			"td.dt-control",
			function () {
				var tr = $(this).closest("tr");
				var row = dataTableSuspectInContact.row(tr);

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

		// saveCustomerCsvPreview(csvCustomerSignedExport);
		// saveExistingCustomerCsvPreview(csvExistingCustomerSignedExport);
		// saveProspectCsvPreview(csvProspectDataSet);
		// saveProspectOpportunityCsvPreview(csvProspectOpportunityDataSet);
		// saveSuspectCsvPreview(csvSuspectDataSet);
		// saveSuspectOffPeakCsvPreview(csvSuspectOffPeakDataSet);
		// saveSuspectLostCsvPreview(csvSuspectLostDataSet);
		// saveSuspectOOTCsvPreview(csvSuspectOOTDataSet);
		// saveSuspectFollowUpCsvPreview(csvSuspectFollowUpDataSet);

		// loadDatatable(debt_set, debt_set2);
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
		row.data()[22].forEach(function (el) {
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
			// 		"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
		series_data31a
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
		zee_series_data30a
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
		salesrep_series_data29a
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
		series_data31a
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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

	function plotChart(series_data, series_data2, categores) {
		// Highcharts.chart("container_source_preview", {
		// 	chart: {
		// 		backgroundColor: "#CFE0CE",
		// 		zoomType: "xy",
		// 		type: "column",
		// 	},
		// 	title: {
		// 		text: "Leads - By Lead Entered - Lead Source",
		// 		style: {
		// 			fontWeight: "bold",
		// 			color: "#0B2447",
		// 			fontSize: "12px",
		// 		},
		// 	},
		// 	xAxis: {
		// 		categories: categores,
		// 		crosshair: true,
		// 		color: "#103D39",
		// 		style: {
		// 			fontWeight: "bold",
		// 		},
		// 		labels: {
		// 			style: {
		// 				fontWeight: "bold",
		// 				fontSize: "10px",
		// 			},
		// 		},
		// 	},
		// 	yAxis: {
		// 		min: 0,
		// 		title: {
		// 			text: "Total Lead Count",
		// 			style: {
		// 				fontWeight: "bold",
		// 				color: "#0B2447",
		// 				fontSize: "12px",
		// 			},
		// 		},
		// 		stackLabels: {
		// 			enabled: true,
		// 			style: {
		// 				fontWeight: "bold",
		// 				fontSize: "10px",
		// 			},
		// 		},
		// 		labels: {
		// 			style: {
		// 				fontSize: "10px",
		// 			},
		// 		},
		// 	},
		// 	tooltip: {
		// 		headerFormat: "<b>{point.key}</b><br/>",
		// 		pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
		// 		style: {
		// 			fontSize: "10px",
		// 		},
		// 	},
		// 	plotOptions: {
		// 		column: {
		// 			stacking: "normal",
		// 			dataLabels: {
		// 				enabled: true,
		// 			},
		// 		},
		// 		series: {
		// 			dataLabels: {
		// 				enabled: true,
		// 				align: "right",
		// 				color: "black",
		// 				x: -10,
		// 			},
		// 			pointPadding: 0.1,
		// 			groupPadding: 0,
		// 		},
		// 	},
		// 	tooltip: {
		// 		headerFormat: "<b>{point.key}</b><br/>",
		// 		pointFormat:
		// 			"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
		// 	},
		// 	series: series_data,
		// });
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					"{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					color: "#FCE09B",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
		series_data33a, series_data34a, series_data35a
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					name: "Outsourced - Head Office Generated",
					data: series_data34a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Outsourced - Head Office Validated",
					data: series_data35a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
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

	function plotChartCustomerShipmatePending(
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
		series_data33a, series_data34a, series_data35a
	) {
		// console.log(series_data)

		Highcharts.chart("container_shipmate_pending_customer", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Customer ShipMate Pending by Source - Week Commenced",
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
				pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
				style: {
					fontSize: "10px",
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
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
					name: "Outsourced - Head Office Generated",
					data: series_data34a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Outsourced - Head Office Validated",
					data: series_data35a,
					color: "#103d39",
					style: {
						fontWeight: "bold",
					},
				},
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

	function areDatesWithinTwoWeeks(date1, date2) {
		// Helper function to parse date strings
		function parseDate(dateStr) {
			const [day, month, year] = dateStr.split('/').map(Number);
			return new Date(year, month - 1, day);
		}

		const parsedDate1 = parseDate(date1);
		const parsedDate2 = parseDate(date2);

		// Calculate the difference in time
		const timeDifference = Math.abs(parsedDate1 - parsedDate2);

		// Calculate the difference in days
		const dayDifference = timeDifference / (1000 * 3600 * 24);

		// Check if the difference is within 14 days (2 weeks)
		return dayDifference <= 14;
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
