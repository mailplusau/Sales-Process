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
	"N/portlet",
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
	currentRecord,
	portlet
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
		// $(".show_buttons_section").removeClass("hide");
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

		$("#fullReport").click(function () {
			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();
			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" +
				date_from +
				"&last_date=" +
				date_to +
				"&usage_date_from=2025-02-01&usage_date_to=2025-02-28&date_signed_up_from=&date_signed_up_to=&commence_date_from=&commence_date_to=&cancel_date_from=&cancel_date_to=&source=-4,254557,295896,296333&date_quote_sent_from=&date_quote_sent_to=&sales_rep=null&zee=null&calcprodusage=2&invoice_date_from=&invoice_date_to=&campaign=null&lpo=null&lead_entered_by=null&modified_date_from=undefined&modified_date_to=undefined&status=null&salesactivitynotes=undefined&customertype=2";
			window.open(url, "_blank");
			// window.location.href = url;
		});

		portlet.resize();
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

		// Sales Dashboard - Leads by Status - Monthly Reporting
		var leadsListBySalesRepWeeklySearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_3_3",
		});
		// } else {
		// 	// Sales Dashboard - Leads by Status - Weekly Reporting
		// 	var leadsListBySalesRepWeeklySearch = search.load({
		// 		type: "customer",
		// 		id: "customsearch_leads_reporting_weekly",
		// 	});
		// }

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

				// if (role == 1000) {
				var startDate = weekLeadEntered;
				// } else {
				// 	if (!isNullorEmpty(weekLeadEntered)) {
				// 		var splitMonthV2 = weekLeadEntered.split("/");

				// 		var formattedDate = dateISOToNetsuite(
				// 			splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
				// 		);

				// 		var firstDay = new Date(
				// 			splitMonthV2[0],
				// 			splitMonthV2[1],
				// 			1
				// 		).getDate();
				// 		var lastDay = new Date(
				// 			splitMonthV2[0],
				// 			splitMonthV2[1],
				// 			0
				// 		).getDate();

				// 		if (firstDay < 10) {
				// 			firstDay = "0" + firstDay;
				// 		}

				// 		// var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
				// 		var startDate =
				// 			splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
				// 		var monthsStartDate =
				// 			splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
				// 		// var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
				// 		var lastDate =
				// 			splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
				// 	} else {
				// 		var startDate = "NO DATE";
				// 	}
				// }

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
						suspect_in_qualification;
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
						suspect_in_qualification;
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
						suspect_in_qualification;
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

				overDataSet.push([
					preview_row.dateUsed,
					preview_row.suspect_new,
					preview_row.suspect_hot_lead,
					preview_row.suspect_validated,
					preview_row.suspect_qualified, //4
					preview_row.suspect_unqualified, //5
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
					title: "Customer - Signed", //24
				},
				{
					title: "Total Lead Count", //25
				},
			],
			columnDefs: [
				{
					targets: [0, 5, 19, 23, 24],
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
					total_lead_v2 +
						" (" +
						((total_lead_v2 / total_lead) * 100).toFixed(0) +
						"%)"
				);
				$(api.column(25).footer()).html(total_lead);
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
			customer_signed[data[i][0]] = data[i][24];
			total_leads[data[i][0]] = data[i][25];
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
			series_data31a
		);

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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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
			rowCallback: function (row, data) {},
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

	//! Sales Dashboard in NetSuite Homepage to be shown
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
				text: "Leads - By Status - Month Entered",
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
						format: "{point.percentage:.0f}%",
					},
				},
				series: {
					dataLabels: {
						enabled: true,
						align: "right",
						color: "black",
						style: {
							fontSize: "10px",
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
