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
		$(".show_buttons_section").removeClass("hide");
		$(".zee_dropdown_section").removeClass("hide");
		$(".data-range_note").removeClass("hide");

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

		$("#show_filter").click(function () {
			if ($("#show_filter").val() == "SHOW DESCRIPTION") {
				$("#show_filter").val("HIDE DESCRIPTION");
				$("#show_filter").css("background-color", "#F0AECB");
				$("#show_filter").css("color", "#103d39");
			} else {
				$("#show_filter").val("SHOW DESCRIPTION");
				$("#show_filter").css("background-color", "#EAF044 !important");
				$("#show_filter").css("color", "#103d39");
			}
		});

		$("#fullReport").click(function () {
			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();
			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=&last_date=&usage_date_from=2025-02-01&usage_date_to=2025-02-28&date_signed_up_from=&date_signed_up_to=&commence_date_from=&commence_date_to=&cancel_date_from=&cancel_date_to=&source==null&date_quote_sent_from=&date_quote_sent_to=&sales_rep=null&zee=null&calcprodusage=2&invoice_date_from=&invoice_date_to=&campaign=null&lpo=null&lead_entered_by=null&modified_date_from=undefined&modified_date_to=undefined&status=null&salesactivitynotes=undefined&customertype=2" + "&syncWithPP=1" + "&start_synced_date=" + date_from + "&last_synced_date=" + date_to;
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

		//Sales Dashboard for Zee - Leads by Status
		var leadsListBySalesRepWeeklySearch = search.load({
			type: "customer",
			id: "customsearch_leads_reporting_weekly_3_11",
		});

		// Sales Dashboard - Leads by Status - Monthly Reporting
		// var leadsListBySalesRepWeeklySearch = search.load({
		// 	type: "customer",
		// 	id: "customsearch_leads_reporting_weekly_3_3",
		// });
		// Sales Dashboard for Zee - Leads by Status - Monthly Reporting by Date Synced with ProspectPlus
		// var leadsListBySalesRepWeeklySearch = search.load({
		// 	type: "customer",
		// 	id: "customsearch_leads_reporting_weekly_3_10",
		// });
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

		// if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
		// 	leadsListBySalesRepWeeklySearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_lead_synced_to_firebase",
		// 			join: null,
		// 			operator: search.Operator.ANYOF,
		// 			values: 1,
		// 		})
		// 	);
		// 	leadsListBySalesRepWeeklySearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_cf_date_sent",
		// 			join: "custrecord_sales_customer",
		// 			operator: search.Operator.ONORAFTER,
		// 			values: date_from,
		// 		})
		// 	);

		// 	leadsListBySalesRepWeeklySearch.filters.push(
		// 		search.createFilter({
		// 			name: "custrecord_cf_date_sent",
		// 			join: "custrecord_sales_customer",
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: date_to,
		// 		})
		// 	);
		// }

		// if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
		// 	leadsListBySalesRepWeeklySearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_date_lead_entered",
		// 			join: null,
		// 			operator: search.Operator.ONORAFTER,
		// 			values: date_from,
		// 		})
		// 	);

		// 	leadsListBySalesRepWeeklySearch.filters.push(
		// 		search.createFilter({
		// 			name: "custentity_date_lead_entered",
		// 			join: null,
		// 			operator: search.Operator.ONORBEFORE,
		// 			values: date_to,
		// 		})
		// 	);
		// }


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
			!isNullorEmpty(date_from) &&
			!isNullorEmpty(date_to)
		) {
			var defaultSearchFilters =
				leadsListBySalesRepWeeklySearch.filterExpression;

			console.log(
				"default search filters: " + JSON.stringify(defaultSearchFilters)
			);

			var customAdditionalFilters = [
				[["custentity_date_lead_entered", "within", [date_from, date_to]], "OR", [["custrecord_sales_customer.custrecord_cf_date_sent", "within", [date_from, date_to]], "AND", ["custrecord_sales_customer.custrecord_sales_campaign", "anyof", "96", "94", "90", "70", "92"]]]
			];



			defaultSearchFilters.push("AND");
			defaultSearchFilters.push(customAdditionalFilters);

			console.log(
				"defaultSearchFilters filters: " + JSON.stringify(defaultSearchFilters)
			);

			leadsListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;
		}

		var count1 = 0;
		var oldDate1 = null;
		var oldStatus = null;
		var oldStatusText = null;

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
		suspect_franchisee_review = 0;

		leadsListBySalesRepWeeklySearch
			.run()
			.each(function (prospectListBySalesRepWeeklyResultSet) {
				var prospectCount = parseInt(
					prospectListBySalesRepWeeklyResultSet.getValue({
						name: "internalid",
						summary: "COUNT",
					})
				);
				// var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
				// 	name: "custentity_date_lead_entered",
				// 	summary: "GROUP",
				// });
				// var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
				// 	name: "custrecord_cf_date_sent",
				// 	join: "CUSTRECORD_SALES_CUSTOMER",
				// 	summary: "GROUP",
				// });
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
				// var startDate = weekLeadEntered;
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

				if (count1 == 0 || (oldStatus != null && oldStatus == custStatus)) {
					total_leads += prospectCount
				} else if (oldStatus != null && oldStatus != custStatus) {
					debt_set2.push({
						// dateUsed: oldDate1,
						custStatus: oldStatus,
						custStatusText: oldStatusText,
						total_leads: total_leads,
					});

					total_leads = 0;


					total_leads += prospectCount;
				}

				count1++;
				// oldDate1 = startDate;
				oldStatus = custStatus;
				oldStatusText = custStatusText;
				return true;
			});

		if (count1 > 0) {
			debt_set2.push({
				custStatus: oldStatus,
				custStatusText: oldStatusText,
				total_leads: total_leads,
			});
		}

		console.log("debt_set2: " + JSON.stringify(debt_set2));

		previewDataSet = [];
		csvPreviewSet = [];

		var overDataSet = [];

		if (!isNullorEmpty(debt_set2)) {
			debt_set2.forEach(function (preview_row, index) {


				overDataSet.push([
					preview_row.custStatus,
					preview_row.custStatusText,
					preview_row.total_leads,
				]);

				previewDataSet.push([
					preview_row.custStatus,
					preview_row.custStatusText,
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
					title: "Status ID", //0
				},
				{
					title: "Status Text", //1
				},
				{
					title: "Total Lead Count", //2
				}
			],
			columnDefs: [
				{
					targets: [1, 2],
					className: "bolded",
				},
			],
			footerCallback: function (row, data, start, end, display) {

			},
		});

		saveCsv(previewDataSet);

		var data = overDataSet;

		var status_text = [];
		var status_id = [];
		var total_leads = [];


		for (var i = 0; i < data.length; i++) {
			status_text.push(data[i][1]);
			status_id[data[i][1]] = data[i][0];
			total_leads[data[i][1]] = data[i][2];

		}

		console.log("total_leads" + total_leads);

		var count = {}; // creating object for getting categories with
		// count
		status_text.forEach(function (i) {
			count[i] = (count[i] || 0) + 1;
		});

		var series_data31a = [];

		var categores1 = [
			'Lead Review & Processing',
			'Priority Inbound (Immediate Sales Action)',
			'Field & Phone Inventory (Ready for Outreach)',
			'Active Outreach (Engaged)',
			'Qualified Pipeline',
			'Converted Customers',
			'Closed/Lost'
		]; // creating empty array for highcharts
		// categories

		var leadReviewQ = [];
		var leadReviewQCount = 0;
		var priorityInboundQ = [];
		var priorityInboundQCount = 0;
		var syncQ = [];
		var syncQCount = 0;
		var activeOutreachQ = [];
		var activeOutreachQCount = 0;
		var qualifiedQ = [];
		var qualifiedQCount = 0;
		var convertedC = [];
		var convertedCCount = 0;
		var closedQ = [];
		var closedQCount = 0;

		Object.keys(total_leads).map(function (item, key) {

			series_data31a.push(parseInt(total_leads[item]));
			// categores1.push(item);


			if (status_id[item] == 6 || status_id[item] == 39) {
				// Lead Review & Processing - New & Franchisee Review
				leadReviewQCount += parseInt(total_leads[item]);
			}

			if (status_id[item] == 57) {
				// Priority Inbound (Immediate Sales Action) - Hot Lead
				priorityInboundQCount += parseInt(total_leads[item]);
			}

			if (status_id[item] == 68 || status_id[item] == 38) {
				// Field & Phone Inventory (Ready for Outreach) - Validated & Unqualified
				syncQCount += parseInt(total_leads[item]);
			}

			if (status_id[item] == 34 || status_id[item] == 30 || status_id[item] == 60 || status_id[item] == 18 || status_id[item] == 67 || status_id[item] == 20 || status_id[item] == 69 || status_id[item] == 8) {
				// Active Outreach (Engaged) - Pre-Qualification, In-Qualification, Re-assign, Follow-up, LPO Follow-up, No Answer, In Contact
				activeOutreachQCount += parseInt(total_leads[item]);
			}

			if (status_id[item] == 58 || status_id[item] == 70 || status_id[item] == 72 || status_id[item] == 50 || status_id[item] == 32 || status_id[item] == 71 || status_id[item] == 42) {
				// Qualified Pipeline - Opportunity, Qualified, Box Sent, Quote Sent, Free Trial Pending, Free Trial
				qualifiedQCount += parseInt(total_leads[item]);
			}

			if (status_id[item] == 13 || status_id[item] == 66) {
				// Converted Customers - Signed & Customer To Be Finalised
				convertedCCount += parseInt(total_leads[item]);
			}

			if (status_id[item] == 59 || status_id[item] == 64 || status_id[item] == 22 || status_id[item] == 62) {
				// Closed/Lost - Lost, OOT, Customer Lost, Off Peak Pipeline
				closedQCount += parseInt(total_leads[item]);
			}


		});

		console.log("leadReviewQCount: " + leadReviewQCount);
		console.log("priorityInboundQCount: " + priorityInboundQCount);
		console.log("syncQCount: " + syncQCount);
		console.log("activeOutreachQCount: " + activeOutreachQCount);
		console.log("qualifiedQCount: " + qualifiedQCount);
		console.log("convertedCCount: " + convertedCCount);
		console.log("closedQCount: " + closedQCount);

		leadReviewQ = [leadReviewQCount, 0, 0, 0, 0, 0, 0];
		priorityInboundQ = [0, priorityInboundQCount, 0, 0, 0, 0, 0];
		syncQ = [0, 0, syncQCount, 0, 0, 0, 0];
		activeOutreachQ = [0, 0, 0, activeOutreachQCount, 0, 0, 0];
		qualifiedQ = [0, 0, 0, 0, qualifiedQCount, 0, 0];
		convertedC = [0, 0, 0, 0, 0, convertedCCount, 0];
		closedQ = [0, 0, 0, 0, 0, 0, closedQCount];

		// leadReviewQ.push(parseInt(suspect_new[item]) + parseInt(suspect_franchisee_review[item]));
		// priorityInboundQ.push(parseInt(suspect_hot_lead[item]));
		// syncQ.push(parseInt(suspect_validated[item]) + parseInt(suspect_unqualified[item]));
		// activeOutreachQ.push(parseInt(suspect_pre_qualification[item]) + parseInt(suspect_in_qualification[item]) + parseInt(suspect_reassign[item]) + parseInt(suspect_follow_up[item]) + parseInt(suspect_lpo_followup[item]) + parseInt(suspect_no_answer[item]) + parseInt(suspect_in_contact[item]) + parseInt(prospect_in_contact[item]) + parseInt(prospect_no_answer[item]));
		// qualifiedQ.push(parseInt(prospect_opportunity[item]) + parseInt(prospect_qualified[item]) + parseInt(prospecy_box_sent[item]) + parseInt(prospecy_quote_sent[item]) + parseInt(customer_free_trial_pending[item]) + parseInt(customer_free_trial[item]));
		// convertedC.push(parseInt(customer_signed[item]) + parseInt(suspect_qualified[item]));
		// closedQ.push(parseInt(suspect_lost[item]) + parseInt(suspect_oot[item]) + parseInt(suspect_customer_lost[item]) + parseInt(suspect_off_peak_pipeline[item]));

		console.log("categores1: " + categores1);
		console.log("leadReviewQ: " + leadReviewQ);
		console.log("priorityInboundQ: " + priorityInboundQ);
		console.log("syncQ: " + syncQ);
		console.log("activeOutreachQ: " + activeOutreachQ);
		console.log("qualifiedQ: " + qualifiedQ);
		console.log("convertedC: " + convertedC);
		console.log("closedQ: " + closedQ);


		plotChartConsolidatedStatuses(leadReviewQ, priorityInboundQ, syncQ, activeOutreachQ, qualifiedQ, convertedC, closedQ, categores1);


		// plotChartPreview(
		// 	series_data20,
		// 	series_data21,
		// 	series_data22,
		// 	series_data23,
		// 	series_data24,
		// 	series_data25,
		// 	series_data26,
		// 	series_data27,
		// 	series_data28,
		// 	series_data29,
		// 	series_data31,
		// 	series_data32,
		// 	series_data33,
		// 	series_data34,
		// 	categores1,
		// 	series_data20a,
		// 	series_data21a,
		// 	series_data22a,
		// 	series_data23a,
		// 	series_data24a,
		// 	series_data25a,
		// 	series_data26a,
		// 	series_data27a,
		// 	series_data28a,
		// 	series_data29a,
		// 	series_data30a,
		// 	series_data31a
		// );

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

	//!Sales Dashboard Charts on NetSuite Homepage for Franchisees consolidated
	function plotChartConsolidatedStatuses(leadReviewQ, priorityInboundQ, syncQ, activeOutreachQ, qualifiedQ, convertedC, closedQ, categores1) {
		Highcharts.chart("container_preview", {
			chart: {
				type: "column",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "Lead Lifecycle & Conversion Pipeline",
				style: {
					fontWeight: "bold",
					color: "#0B2447",
					fontSize: "12px",
				},
			},
			xAxis: {
				categories: categores1,
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
				// stackLabels: {
				// 	enabled: true,
				// 	style: {
				// 		fontWeight: "bold",
				// 		fontSize: "10px",
				// 	},
				// },
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
						inside: true, // Inside the columns
						format: '{y}' // Display the exact value
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
					name: "Lead Review & Processing",
					data: leadReviewQ,
					color: "#37474F",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Priority Inbound (Immediate Sales Action)",
					data: priorityInboundQ,
					color: "#3F51B5",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Field & Phone Inventory (Ready for Outreach)",
					data: syncQ,
					color: "#B674EFFF",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Active Outreach (Engaged)",
					data: activeOutreachQ,
					color: "#1976D2",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Qualified Pipeline",
					data: qualifiedQ,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Converted Customers",
					data: convertedC,
					color: "#439A97",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Closed",
					data: closedQ,
					color: "#e86252",
					style: {
						fontWeight: "bold",
					},
				},
			],
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
				text: "Leads - By Status - Month Synced with ProspectPlus",
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
					name: "Qualified Appointments",
					data: series_data20a,
					color: "#3E6D9C",
					style: {
						fontWeight: "bold",
						fontSize: "10px",
					},
				},
				{
					name: "Synced with ProspectPlus",
					data: series_data28a,
					color: "#B674EFFF",
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
