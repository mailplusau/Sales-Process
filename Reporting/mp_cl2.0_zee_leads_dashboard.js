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

    var pp_sync = null;
    var date_synced_from = null;
    var date_synced_to = null;

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

    var illiciumTasksDataSet = [];
    var illiciumDateSyncedOutcomeDataSet = [];
    var illiciumOutcomeStatusDataSet = [];
    var illiciumCompletedTasksDataSet = [];

    var prospectplusTasksDataSet = [];
    var prospectplusDateSyncedOutcomeDataSet = [];
    var prospectplusOutcomeStatusDataSet = [];
    var prospectplusCompletedTasksDataSet = [];
    var prospectplusSubCategoryStatusDataSet = [];

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
        $(".leadsCount").removeClass("hide");
        $(".tabsDiv").removeClass("hide");
        $(".leadReviewProcessingLegendContainer").removeClass("hide");

        $(".loading_section").addClass("hide");
    }

    function pageInit() {
        $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
        $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
        $("#body").css("background-color", "#CFE0CE");
        $('.uir-page-title').css('display', 'none');
        $('.uir-header-buttons').css('display', 'none');
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

        pp_sync = $("#pp_sync").val();

        date_synced_from = $("#date_synced_from").val();
        date_synced_from = dateISOToNetsuite(date_synced_from);

        date_synced_to = $("#date_synced_to").val();
        date_synced_to = dateISOToNetsuite(date_synced_to);

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

            console.log("Apply Filter Clicked");

            var date_from = $("#date_from").val();
            var date_to = $("#date_to").val();

            var date_entered_to = $("#date_entered_to").val();
            var date_entered_from = $("#date_entered_from").val();
            var date_synced_from = $("#date_synced_from").val();
            var date_synced_to = $("#date_synced_to").val();
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

            pp_sync = $("#pp_sync").val();

            zee = $("#zee_dropdown").val();

            console.log("date_from: " + date_from);
            console.log("date_to: " + date_to);

            if (isNullorEmpty(date_from) && isNullorEmpty(date_to) && isNullorEmpty(date_synced_from) && isNullorEmpty(date_synced_to) && isNullorEmpty(date_entered_from) && isNullorEmpty(date_entered_to)) {
                alert("Please select a date range in either the Broad Activity Search.");
                return false;
            } else {
                var url =
                    baseURL +
                    "/app/site/hosting/scriptlet.nl?script=2411&deploy=1&start_date=" +
                    date_from +
                    "&last_date=" +
                    date_to +
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
                    "&campaign=" +
                    sales_campaign +
                    "&lead_entered_by=" +
                    lead_entered_by +
                    "&status=" +
                    leadStatus +
                    "&date_synced_from=" +
                    date_synced_from +
                    "&date_synced_to=" +
                    date_synced_to +
                    "&date_entered_from=" +
                    date_entered_from +
                    "&date_entered_to=" +
                    date_entered_to;


                window.location.href = url;
            }


        });

        $(".emailIT").click(function () {

            console.log("Email IT Clicked");

            var date_from = $("#date_from").val();
            var date_to = $("#date_to").val();

            var date_entered_to = $("#date_entered_to").val();
            var date_entered_from = $("#date_entered_from").val();
            var date_synced_from = $("#date_synced_from").val();
            var date_synced_to = $("#date_synced_to").val();
            var date_from = $("#date_from").val();
            var date_to = $("#date_to").val();

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

            pp_sync = $("#pp_sync").val();

            zee = $("#zee_dropdown").val();

            console.log("date_from: " + date_from);
            console.log("date_to: " + date_to);

            //Send Email to IT with the filters applied and the link to the current page
            var emailBody = 'Hi Aleyna,<br><br>Please extract the data with the following filters applied:<br><br>The filters are as follows:<br>';
            if (!isNullorEmpty(date_entered_from) || !isNullorEmpty(date_entered_to)) {
                emailBody += 'Date From: ' + date_from + '<br>';
                emailBody += 'Date To: ' + date_to + '<br>';
            }
            if (!isNullorEmpty(date_signed_up_from) || !isNullorEmpty(date_signed_up_to)) {
                emailBody += 'Date Signed Up From: ' + date_signed_up_from + '<br>';
                emailBody += 'Date Signed Up To: ' + date_signed_up_to + '<br>';
            }
            if (!isNullorEmpty(commencement_start_date) || !isNullorEmpty(commencement_last_date)) {
                emailBody += 'Commencement Start Date: ' + commencement_start_date + '<br>';
                emailBody += 'Commencement Last Date: ' + commencement_last_date + '<br>';
            }
            if (!isNullorEmpty(cancelled_start_date) || !isNullorEmpty(cancelled_last_date)) {
                emailBody += 'Cancelled Start Date: ' + cancelled_start_date + '<br>';
                emailBody += 'Cancelled Last Date: ' + cancelled_last_date + '<br>';
            }
            if (!isNullorEmpty(date_quote_sent_from) || !isNullorEmpty(date_quote_sent_to)) {
                emailBody += 'Date Quote Sent From: ' + date_quote_sent_from + '<br>';
                emailBody += 'Date Quote Sent To: ' + date_quote_sent_to + '<br>';
            }
            if (!isNullorEmpty(source)) {
                emailBody += 'Source: ' + source + '<br>';
            }
            if (!isNullorEmpty(sales_campaign)) {
                emailBody += 'Sales Campaign: ' + sales_campaign + '<br>';
            }
            if (!isNullorEmpty(sales_rep)) {
                emailBody += 'Sales Rep: ' + sales_rep + '<br>';
            }
            if (!isNullorEmpty(leadStatus)) {
                emailBody += 'Lead Status: ' + leadStatus + '<br>';
            }
            if (!isNullorEmpty(zee)) {
                emailBody += 'Zee ID: ' + zee + '<br>';
            }
            emailBody += '<br>The link to the search to be used to extract with the above filters: <a href="https://1048144.app.netsuite.com/app/common/search/searchresults.nl?searchid=9441&saverun=T&whence=">Reporting - All Suspects, Prospects & Customers - Franchisee Reporting Page</a><br><br>';
            emailBody += 'Please extract the data accordingly.<br><br>Best Regards,<br>' + userName;

            email.send({
                author: 112209, //MailPlus team
                body: emailBody,
                // recipients: 'ankith.ravindran@mailplus.com.au',
                recipients: 'aleyna.harnett@mailplus.com.au',
                subject: userName + ' Requested  Sales Dashboard Report',
                cc: ['luke.forbes@mailplus.com.au', 'ankith.ravindran@mailplus.com.au']
            })


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

            var date_synced_from = $("#date_synced_from").val();
            var date_synced_to = $("#date_synced_to").val();
            pp_sync = $("#pp_sync").val();

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
                "/app/site/hosting/scriptlet.nl?script=2411&deploy=1&page_no=" +
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
                customer_type + "&syncWithPP=" + pp_sync + "&start_synced_date=" + date_synced_from + "&last_synced_date=" + date_synced_to;


            window.location.href = url;
        });

        $("#clearFilter").click(function () {
            var url = baseURL + "/app/site/hosting/scriptlet.nl?script=2411&deploy=1";

            window.location.href = url;
        });


        $(".closeModal").click(function () {
            $("#leadStatusModal").hide();
        });

        $("#date_from").click(function () {
            $("#date_entered_to").val('');
            $("#date_entered_from").val('');
            $("#date_synced_from").val('');
            $("#date_synced_to").val('');
        });
        $("#date_to").click(function () {
            $("#date_entered_to").val('');
            $("#date_entered_from").val('');
            $("#date_synced_from").val('');
            $("#date_synced_to").val('');
        });

        $("#date_entered_to").click(function () {
            $("#date_from").val('');
            $("#date_to").val('');
        });
        $("#date_entered_from").click(function () {
            $("#date_from").val('');
            $("#date_to").val('');
        });
        $("#date_synced_from").click(function () {
            $("#date_from").val('');
            $("#date_to").val('');
        });
        $("#date_synced_to").click(function () {
            $("#date_from").val('');
            $("#date_to").val('');
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
                        targets: [0, 1, 2, 3, 4, 6, 7],
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

        var dataTableLeadReviewProcessing = $(
            "#reporting-leadReviewProcessing"
        ).DataTable({
            pageLength: 50,
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
                {
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "INDUSTRY CATEGORY", //7
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //8
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                // var row_color = "";
                // if (
                //     data[4] == "SUSPECT-Customer - Lost" ||
                //     data[4] == "SUSPECT-Lost"
                // ) {
                //     $("td", row).css("background-color", "#e97777");
                // } else if (data[4] == "CUSTOMER-Signed") {
                //     $("td", row).css("background-color", "#ADCF9F");
                // }
            },
            footerCallback: function (row, data, start, end, display) { },
        });

        var dataTableLeadReviewProcessing = $(
            "#reporting-priorityInbound"
        ).DataTable({
            pageLength: 50,
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
                {
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "INDUSTRY CATEGORY", //7
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //8
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                // var row_color = "";

                if (isMoreThanOneDayOld(data[0])) {
                    $("td", row).css("background-color", "#e97777");
                } else {
                    $("td", row).css("background-color", "#F2F2EF");
                }
            },
            footerCallback: function (row, data, start, end, display) { },
        });
        var dataTableLeadReviewProcessing = $(
            "#reporting-fieldPhoneInventory"
        ).DataTable({
            pageLength: 50,
            order: [8, "asc"],
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
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "INDUSTRY CATEGORY", //7
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //8
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                // var row_color = "";
                // if (
                //     data[4] == "SUSPECT-Customer - Lost" ||
                //     data[4] == "SUSPECT-Lost"
                // ) {
                //     $("td", row).css("background-color", "#e97777");
                // } else if (data[4] == "CUSTOMER-Signed") {
                //     $("td", row).css("background-color", "#ADCF9F");
                // }
            },
            footerCallback: function (row, data, start, end, display) { },
        });
        var dataTableLeadReviewProcessing = $(
            "#reporting-activeOutreach"
        ).DataTable({
            pageLength: 50,
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
                {
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "INDUSTRY CATEGORY", //7
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //8
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                // var row_color = "";
                // if (
                //     data[4] == "SUSPECT-Customer - Lost" ||
                //     data[4] == "SUSPECT-Lost"
                // ) {
                //     $("td", row).css("background-color", "#e97777");
                // } else if (data[4] == "CUSTOMER-Signed") {
                //     $("td", row).css("background-color", "#ADCF9F");
                // }
            },
            footerCallback: function (row, data, start, end, display) { },
        });
        var dataTableLeadReviewProcessing = $(
            "#reporting-qualifiedPipeline"
        ).DataTable({
            pageLength: 50,
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
                {
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "DATE QUOTE SENT", //7
                },
                {
                    title: "INDUSTRY CATEGORY", //7
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //8
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                var row_color = "";
                if (data[4] == "PROSPECT-Quote Sent") {
                    $("td", row).css("background-color", "#B5DFA5");
                } else {
                    $("td", row).css("background-color", "#F2F2EF");
                }
            },
            footerCallback: function (row, data, start, end, display) { },
        });
        var dataTableLeadReviewProcessing = $(
            "#reporting-convertedCustomers"
        ).DataTable({
            pageLength: 50,
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
                {
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "DATE QUOTE SENT", //7
                },
                {
                    title: "INDUSTRY CATEGORY", //7
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //8
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                // var row_color = "";
                // if (
                //     data[4] == "SUSPECT-Customer - Lost" ||
                //     data[4] == "SUSPECT-Lost"
                // ) {
                //     $("td", row).css("background-color", "#e97777");
                // } else if (data[4] == "CUSTOMER-Signed") {
                //     $("td", row).css("background-color", "#ADCF9F");
                // }
            },
            footerCallback: function (row, data, start, end, display) { },
        });
        var dataTableLeadReviewProcessing = $(
            "#reporting-closedLost"
        ).DataTable({
            pageLength: 50,
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
                {
                    title: "DATE LEAD ENTERED",
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
                    title: "CAMPAIGN", //6
                },
                {
                    title: "ACCOUNT MANAGER", //7
                },
                {
                    title: "DATE SYNCED WITH PP", //6
                },
                {
                    title: "PP SALES BDR", //7
                },
                {
                    title: "DATE QUOTE SENT", //7
                },
                {
                    title: "CANCELLATION DATE", //8
                },
                {
                    title: "CANCELLATION THEME", //9
                },
                {
                    title: "CANCELLATION CATEGORY", //10
                },
                {
                    title: "INDUSTRY CATEGORY", //11
                },
                {
                    title: "INDUSTRY SUB-CATEGORY", //12
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3, 4, 6, 7],
                    className: "bolded",
                },
            ],
            rowCallback: function (row, data, index) {
                var row_color = "";
                if (
                    data[4] == "SUSPECT-Customer - Lost" ||
                    data[4] == "SUSPECT-Lost"
                ) {
                    $("td", row).css("background-color", "#e97777");
                }
            },
            footerCallback: function (row, data, start, end, display) { },
        });

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

    function destroyChild(row) {
        // And then hide the row
        row.child.hide();
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

    function isMoreThanOneDayOld(dateStr) {

        var dateLeadEntered = dateStr.split('-');
        dateLeadEntered = new Date(dateLeadEntered[0], dateLeadEntered[1] - 1, dateLeadEntered[2]);

        var today = new Date();
        today.setHours(0, 0, 0, 0);
        dateLeadEntered.setHours(0, 0, 0, 0);

        console.log("dateLeadEntered: " + dateLeadEntered);
        console.log("today: " + today);


        var diffInMs = today - dateLeadEntered;
        var diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return diffInDays > 3;
    }

    return {
        pageInit: pageInit,
        saveRecord: saveRecord,
        addFilters: addFilters,
    };
});
