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


define(['SuiteScripts/jQuery Plugins/Moment JS/moment.min', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
],
    function (moment, email, runtime, search, record, http, log, error, url, format,
        currentRecord) {
        var zee = 0;
        var userId = 0;
        var role = 0;

        var baseURL = 'https://1048144.app.netsuite.com';
        if (runtime.EnvType == "SANDBOX") {
            baseURL = 'https://1048144-sb3.app.netsuite.com';
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
        var leadStatus = null;

        var total_months = 14;

        var today = new Date();
        var today_day_in_month = today.getDate();
        var today_day_in_week = today.getDay();
        var today_month = today.getMonth() + 1;
        var today_year = today.getFullYear();

        var total_leads = 0;

        if (today_day_in_month < 10) {
            today_day_in_month = '0' + today_day_in_month;
        }

        if (today_month < 10) {
            today_month = '0' + (today_month);
        }

        var todayString = today_day_in_month + '/' + today_month + '/' +
            today_year;

        var current_year_month = today_year + '-' + today_month;
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

        var salesRecordLastAssignedListIds = [
            409635, //Ankith
            1623053, //Aleyna
            1822089, //Alison
            668712, //Belinda
            696160, //Kerina
            668711, //Lee
            1809382, //Liam
            653718, //Luke
            1820151, //Paul
            1844985, //Shaheer
            1819701, //Stefania
        ]

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
        var prospectQualifiedChildDataSet = [];
        var suspectNoAnswerChildDataSet = [];
        var suspectInContactChildDataSet = [];
        var suspectChildDataSet = []
        var suspectOffPeakChildDataSet = [];;
        var suspectLostChildDataSet = [];
        var suspectOOTChildDataSet = [];
        var suspectQualifiedChildDataSet = [];
        var suspectUnqualifiedChildDataSet = [];
        var suspectValidatedChildDataSet = [];
        var suspectFollowUpChildDataSet = [];
        var customerCancellationRequestDataSet = [];


        var totalSuspectCount = 0;
        var customerActivityCount = 0;
        var totalCustomerCount = 0;
        var suspectActivityCount = 0;
        var prospectActivityCount = 0;
        var totalProspectCount = 0;

        var employee_list = []
        var employee_list_color = []

        var campaign_list = []
        var campaign_list_color = []

        var source_list = []
        var source_list_color = []

        function pageLoad() {
            $('.zee_label_section').addClass('hide');
            $('.zee_dropdown_section').addClass('hide');
            $('.source_salesrep_label_section').addClass('hide');
            $('.source_salesrep_section').addClass('hide');

            $('.loading_section').removeClass('hide');
        }

        function afterSubmit() {
            $('.zee_label_section').removeClass('hide');
            $('.show_buttons_section').removeClass('hide');
            $('.zee_dropdown_section').removeClass('hide');

            $('.lead_entered_label_section').removeClass('hide');
            $('.lead_entered_div').removeClass('hide');
            $('.modified_date_div').removeClass('hide');
            if (role != 1000) {
                $('.quote_sent_label_section').removeClass('hide');
                $('.quote_sent_div').removeClass('hide');
                $('.usage_label_section').removeClass('hide');
                $('.calcprodusage_div').removeClass('hide');
                $('.salesactivitynotes_div').removeClass('hide');
                $('.usage_date_div').removeClass('hide');
                $('.invoice_label_section').removeClass('hide');
                $('.invoice_date_type_div').removeClass('hide');

            }

            $('.source_salesrep_label_section').removeClass('hide');
            $('.source_salesrep_section').removeClass('hide');

            $('.signed_up_label_section').removeClass('hide');
            $('.signed_up_div').removeClass('hide');

            $('.filter_buttons_section').removeClass('hide');
            $('.tabs_section').removeClass('hide');
            $('.table_section').removeClass('hide');
            $('.instruction_div').removeClass('hide');
            // if (userId == 409635) {
            //     $('.development_message').removeClass('hide');
            // }
            $('.scorecard_percentage').removeClass('hide');
            $('.status_dropdown_section').removeClass('hide');

            $('.loading_section').addClass('hide');
        }

        function pageInit() {

            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");
            // pageLoad();
            $('.ui.dropdown').dropdown();

            $(document).ready(function () {
                $('.js-example-basic-multiple').select2();
            });

            debtDataSet = [];
            debt_set = [];

            date_from = $('#date_from').val();
            date_from = dateISOToNetsuite(date_from);

            date_to = $('#date_to').val();
            date_to = dateISOToNetsuite(date_to);

            modified_date_from = $('#modified_date_from').val();
            modified_date_from = dateISOToNetsuite(modified_date_from);

            modified_date_to = $('#modified_date_to').val();
            modified_date_to = dateISOToNetsuite(modified_date_to);

            usage_date_from = $('#usage_date_from').val();
            usage_date_from = dateISOToNetsuite(usage_date_from);

            usage_date_to = $('#usage_date_to').val();
            usage_date_to = dateISOToNetsuite(usage_date_to);

            date_signed_up_from = $('#date_signed_up_from').val();
            date_signed_up_from = dateISOToNetsuite(date_signed_up_from);

            date_signed_up_to = $('#date_signed_up_to').val();
            date_signed_up_to = dateISOToNetsuite(date_signed_up_to);


            date_quote_sent_from = $('#date_quote_sent_from').val();
            date_quote_sent_from = dateISOToNetsuite(date_quote_sent_from);

            date_quote_sent_to = $('#date_quote_sent_to').val();
            date_quote_sent_to = dateISOToNetsuite(date_quote_sent_to);

            lead_source = $('#lead_source').val();
            sales_campaign = $('#sales_campaign').val();
            lead_entered_by = $('#lead_entered_by').val();
            parent_lpo = $('#parent_lpo').val();
            sales_rep = $('#sales_rep').val();
            invoice_type = $('#invoice_type').val();
            calcprodusage = $('#calc_prod_usage').val();
            sales_activity_notes = $('#sales_activity_notes').val();
            leadStatus = $('#cust_status').val();

            invoice_date_from = $('#invoice_date_from').val();
            invoice_date_from = dateISOToNetsuite(invoice_date_from);
            invoice_date_to = $('#invoice_date_to').val();
            invoice_date_to = dateISOToNetsuite(invoice_date_to);


            /**
             *  Auto Load Submit Search and Load Results on Page Initialisation
             */

            submitSearch();
            var dataTable = $('#customer_benchmark_preview').DataTable();


            var today = new Date();
            var today_year = today.getFullYear();
            var today_month = today.getMonth();
            var today_day = today.getDate();

            $("#showGuide").click(function () {

                if ($('#show_filter').val() == 'HIDE FILTERS') {
                    $('#show_filter').trigger('click');
                }
                $("#myModal").show();

                return false;

            })

            $('.close').click(function () {
                $("#myModal").hide();
            });

            $("#show_filter").click(function () {
                if ($('#show_filter').val() == 'SHOW FILTERS') {
                    $('#show_filter').val('HIDE FILTERS');
                    $('#show_filter').css("background-color", "#F0AECB");
                    $('#show_filter').css("color", "#103d39");
                } else {
                    $('#show_filter').val('SHOW FILTERS');
                    $('#show_filter').css("background-color", "#EAF044 !important");
                    $('#show_filter').css("color", "#103d39");
                }

            });


            $("#applyFilter").click(function () {

                var date_from = $('#date_from').val();
                var date_to = $('#date_to').val();

                var modified_date_from = $('#modified_date_from').val();
                var modified_date_to = $('#modified_date_to').val();

                var usage_date_from = $('#usage_date_from').val();
                var usage_date_to = $('#usage_date_to').val();


                var date_signed_up_from = $('#date_signed_up_from').val();
                var date_signed_up_to = $('#date_signed_up_to').val();

                var date_quote_sent_from = $('#date_quote_sent_from').val();
                var date_quote_sent_to = $('#date_quote_sent_to').val();

                var invoice_date_from = $('#invoice_date_from').val();
                var invoice_date_to = $('#invoice_date_to').val();
                var invoice_type = $('#invoice_type').val();
                var source = $('#lead_source').val();
                var sales_campaign = $('#sales_campaign').val();
                var parent_lpo = $('#parent_lpo').val();

                var sales_rep = $('#sales_rep').val();
                var lead_entered_by = $('#lead_entered_by').val();
                calcprodusage = $('#calc_prod_usage').val();
                sales_activity_notes = $('#sales_activity_notes').val();

                leadStatus = $('#cust_status').val();

                zee = $(
                    '#zee_dropdown').val();

                if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
                    if ((isNullorEmpty(date_signed_up_from) || isNullorEmpty(date_signed_up_to))) {
                        alert('Please enter the date signed up filter');
                        return false;
                    }
                } else if ((isNullorEmpty(date_to) || isNullorEmpty(date_from)) && (isNullorEmpty(usage_date_from) || isNullorEmpty(usage_date_to)) && (isNullorEmpty(date_signed_up_from) || isNullorEmpty(date_signed_up_to))) {
                    alert('Please enter the date filter');
                    return false;
                }

                if (!(isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to))) {

                }


                if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1915&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage + "&invoice_date_from=" + invoice_date_from + '&invoice_date_to=' + invoice_date_to + '&campaign=' + sales_campaign + '&lpo=' + parent_lpo + '&lead_entered_by=' + lead_entered_by + '&modified_date_from=' + modified_date_from + '&modified_date_to=' + modified_date_to + '&status=' + leadStatus + '&salesactivitynotes=1';

                } else {
                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage + "&invoice_date_from=" + invoice_date_from + '&invoice_date_to=' + invoice_date_to + '&campaign=' + sales_campaign + '&lpo=' + parent_lpo + '&lead_entered_by=' + lead_entered_by + '&modified_date_from=' + modified_date_from + '&modified_date_to=' + modified_date_to + '&status=' + leadStatus + '&salesactivitynotes=' + sales_activity_notes;

                }


                window.location.href = url;

            });

            $("#clearFilter").click(function () {

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1"

                window.location.href = url;

            });

            $("#showTotal").click(function () {


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&showTotal=T"


                window.location.href = url;

            });

            $(".show_status_timeline").click(function () {

                var custInternalID = $(this).attr("data-id");

                console.log('Inside Modal: ' + custInternalID);

                // Lead Status Timeline
                var leadStatusTimelineSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_lead_status_timeline'
                });


                leadStatusTimelineSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: parseInt(custInternalID)
                }));

                var statusTimeLineTable = '<style>table#statusTimeLineTable {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#statusTimeLineTable th{text-align: center;} .bolded{font-weight: bold;}</style>';
                statusTimeLineTable += '<div class="table_section "><table id="statusTimeLineTable" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
                statusTimeLineTable += '<thead style="color: white;background-color: #103D39;">';
                statusTimeLineTable += '<tr class="text-center">';
                statusTimeLineTable += '<td>DATE</td>';
                statusTimeLineTable += '<td>SET BY</td>';
                statusTimeLineTable += '<td>OLD STATUS</td>';
                statusTimeLineTable += '<td>TIME IN OLD STATUS </td>';
                statusTimeLineTable += '<td>NEW STATUS</td>';
                statusTimeLineTable += '</tr>';
                statusTimeLineTable += '</thead>';

                statusTimeLineTable += '<tbody id="" >';

                var oldStatusDate = null;
                var timeInStatusDays = 0;
                var totalTimeInStatusDays = 0;

                leadStatusTimelineSearch.run().each(function (leadStatusTimelineResultSet) {

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
                        name: "entitystatus"
                    });

                    var systemNotesDateSplitSpace = systemNotesDate.split(' ');
                    var systemNotesTime = convertTo24Hour(systemNotesDateSplitSpace[1] + ' ' + systemNotesDateSplitSpace[2])
                    var systemNotesDateSplit = systemNotesDateSplitSpace[0].split('/')
                    if (parseInt(systemNotesDateSplit[1]) < 10) {
                        systemNotesDateSplit[1] = '0' + systemNotesDateSplit[1]
                    }

                    if (parseInt(systemNotesDateSplit[0]) < 10) {
                        systemNotesDateSplit[0] = '0' + systemNotesDateSplit[0]
                    }

                    systemNotesDate = systemNotesDateSplit[2] + '-' + systemNotesDateSplit[1] + '-' +
                        systemNotesDateSplit[0];

                    // console.log('systemNotesDate: ' + systemNotesDate);
                    // console.log('oldStatusDate: ' + oldStatusDate);

                    var onlyStatusDate = systemNotesDate

                    if (!isNullorEmpty(oldStatusDate)) {

                        console.log('systemNotesDate: ' + systemNotesDate);
                        console.log('oldStatusDate: ' + oldStatusDate);

                        var date1 = new Date(systemNotesDate);
                        var date2 = new Date(oldStatusDate);

                        console.log('date1: ' + date1);
                        console.log('date2: ' + date2);

                        var difference = date1.getTime() - date2.getTime();
                        timeInStatusDays = Math.ceil(difference / (1000 * 3600 * 24));

                        console.log('timeInStatusDays: ' + timeInStatusDays);

                        var weeks = Math.floor(timeInStatusDays / 7);
                        timeInStatusDays = timeInStatusDays - (weeks * 2);

                        console.log('timeInStatusDays: ' + timeInStatusDays);

                        console.log('date1: ' + date1);
                        console.log('date2: ' + date2);

                        // Handle special cases
                        var startDay = date1.getDay();
                        var endDay = date2.getDay();

                        console.log('startDay: ' + startDay);
                        console.log('endDay: ' + endDay);

                        console.log('timeInStatusDays: ' + timeInStatusDays);
                        console.log('(startDay - endDay): ' + (startDay - endDay));

                        // Remove weekend not previously removed.   
                        // if ((startDay - endDay) > 1) {
                        //     console.log('inside (startDay - endDay): ' + ((startDay - endDay) > 1));
                        //     timeInStatusDays = timeInStatusDays - 2;
                        // }


                        console.log('timeInStatusDays: ' + timeInStatusDays);

                        // Remove start day if span starts on Sunday but ends before Saturday
                        if (startDay == 0 && endDay != 6) {
                            timeInStatusDays = timeInStatusDays - 1;
                        }

                        console.log('timeInStatusDays: ' + timeInStatusDays);

                        // Remove end day if span ends on Saturday but starts after Sunday
                        if (endDay == 6 && startDay != 0) {
                            timeInStatusDays = timeInStatusDays - 1;
                        }

                        // timeInStatusDays = systemNotesDate - oldStatusDate;
                    }
                    console.log('timeInStatusDays: ' + timeInStatusDays);
                    systemNotesDate = systemNotesDate + ' ' + systemNotesTime

                    statusTimeLineTable += '<tr>';
                    statusTimeLineTable += '<td>' + systemNotesDate + '</td>';
                    statusTimeLineTable += '<td>' + systemNotesSetBy + '</td>';
                    statusTimeLineTable += '<td>' + oldStatus + '</td>';
                    statusTimeLineTable += '<td>' + timeInStatusDays + '</td>';
                    statusTimeLineTable += '<td>' + newStatus + '</td>';

                    statusTimeLineTable += '</tr>';

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

                console.log('salesRepInternalId: ' + salesRepInternalId)
                var date_from = $('#date_from').val();
                var date_to = $('#date_to').val();

                var modified_date_from = $('#modified_date_from').val();
                var modified_date_to = $('#modified_date_to').val();

                var date_signed_up_from = $('#date_signed_up_from').val();
                var date_signed_up_to = $('#date_signed_up_to').val();

                var date_quote_sent_from = $('#date_quote_sent_from').val();
                var date_quote_sent_to = $('#date_quote_sent_to').val();

                var lead_source = $('#lead_source').val();
                var sales_campaign = $('#sales_campaign').val();
                var parent_lpo = $('#parent_lpo').val();

                var lead_entered_by = $('#lead_entered_by').val();
                var leadStatus = $('#cust_status').val();

                var zee_id = $(
                    '#zee_dropdown').val();

                date_from = dateISOToNetsuite(date_from);
                date_to = dateISOToNetsuite(date_to);
                modified_date_from = dateISOToNetsuite(modified_date_from);
                modified_date_to = dateISOToNetsuite(modified_date_to);

                usage_date_from = dateISOToNetsuite(usage_date_from);
                date_signed_up_from = dateISOToNetsuite(date_signed_up_from);
                date_signed_up_to = dateISOToNetsuite(date_signed_up_to);
                date_quote_sent_from = dateISOToNetsuite(date_quote_sent_from);
                date_quote_sent_to = dateISOToNetsuite(date_quote_sent_to);


                console.log('date_from: ' + date_from);
                console.log('date_to ' + date_to);

                console.log('modified_date_from: ' + modified_date_from);
                console.log('modified_date_to ' + modified_date_to);

                console.log('date_signed_up_from: ' + date_signed_up_from);
                console.log('date_signed_up_to ' + date_signed_up_to);

                console.log('date_quote_sent_from: ' + date_quote_sent_from);
                console.log('date_quote_sent_to ' + date_quote_sent_to);

                console.log('lead_source ' + lead_source);
                console.log('sales_campaign ' + sales_campaign);
                console.log('parent_lpo ' + parent_lpo);
                console.log('zee_id ' + zee_id);


                // Lead Status Timeline - Grouped By Sales Rep
                var leadSalesRepTimelineSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_lead_status_timeline_2_2'
                });

                if (!isNullorEmpty(leadStatus)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: leadStatus
                    }));
                }



                if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_from
                    }));

                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_to
                    }));
                }

                if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_signed_up_from
                    }));

                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_signed_up_to
                    }));
                }

                if (!isNullorEmpty(lead_source)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_source
                    }));
                }

                if (!isNullorEmpty(salesRepInternalId)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_assigned',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: salesRepInternalId
                    }));
                }

                if (!isNullorEmpty(lead_entered_by)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_lead_entered_by',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_entered_by
                    }));
                }

                if (!isNullorEmpty(sales_campaign)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.ANYOF,
                        values: sales_campaign
                    }));
                }

                if (!isNullorEmpty(parent_lpo)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.ANYOF,
                        values: parent_lpo
                    }));
                }

                if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_quote_sent_from
                    }));

                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_quote_sent_to
                    }));
                }

                if (!isNullorEmpty(zee_id)) {
                    leadSalesRepTimelineSearch.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zee_id
                    }));
                }

                // var defaultSearchFilters = leadSalesRepTimelineSearch.filterExpression;

                // console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                    var defaultSearchFilters = leadSalesRepTimelineSearch.filterExpression;

                    console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                    var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                    console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                    defaultSearchFilters.push('AND');
                    defaultSearchFilters.push(modifiedDateFilters);

                    console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


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


                leadSalesRepTimelineSearch.run().each(function (leadSalesRepTimelineResultSet) {

                    console.log('inside the search')
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

                    var systemNotesDateSplitSpace = systemNotesDate.split(' ');
                    var systemNotesTime = convertTo24Hour(systemNotesDateSplitSpace[1] + ' ' + systemNotesDateSplitSpace[2])
                    var systemNotesDateSplit = systemNotesDateSplitSpace[0].split('/')
                    if (parseInt(systemNotesDateSplit[1]) < 10) {
                        systemNotesDateSplit[1] = '0' + systemNotesDateSplit[1]
                    }

                    if (parseInt(systemNotesDateSplit[0]) < 10) {
                        systemNotesDateSplit[0] = '0' + systemNotesDateSplit[0]
                    }

                    systemNotesDate = systemNotesDateSplit[2] + '-' + systemNotesDateSplit[1] + '-' +
                        systemNotesDateSplit[0];

                    var onlyStatusDate = systemNotesDate

                    console.log('customerName: ' + customerName)
                    console.log('onlyStatusDate: ' + onlyStatusDate)
                    console.log('oldStatusDate: ' + oldStatusDate)

                    if (!isNullorEmpty(oldStatusDate) && oldStatus != '- None -') {


                        var date1 = new Date(systemNotesDate);
                        var date2 = new Date(oldStatusDate);

                        var difference = date1.getTime() - date2.getTime();
                        timeInStatusDays = Math.ceil(difference / (1000 * 3600 * 24));

                    }
                    console.log('timeInStatusDays: ' + timeInStatusDays)
                    systemNotesDate = systemNotesDate + ' ' + systemNotesTime
                    console.log('systemNotesDate: ' + systemNotesDate)
                    if (countSalesRepTimeline == 0 || oldCustomerInternalId == customerInternalId) {
                        childStatusTimeline.push({
                            systemNotesDate: systemNotesDate,
                            oldStatus: oldStatus,
                            timeInStatusDays: timeInStatusDays,
                            newStatus: newStatus,
                        })
                    } else if (oldCustomerInternalId != customerInternalId) {
                        salesRepTimeLineCustomerArray.push(['',
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldCustomerInternalId + '" target="_blank" style="">' + oldCustomerId + '</a>',
                            oldCustomerName,
                            oldCustomerZee,
                            oldCustomerCurrentStatus,
                            oldCustomerSource,
                            childStatusTimeline
                        ]);

                        childStatusTimeline = [];

                        childStatusTimeline.push({
                            systemNotesDate: systemNotesDate,
                            oldStatus: oldStatus,
                            timeInStatusDays: timeInStatusDays,
                            newStatus: newStatus,
                        })
                    }

                    oldCustomerInternalId = customerInternalId;
                    oldCustomerId = customerId;
                    oldCustomerName = customerName
                    oldCustomerCurrentStatus = customerCurrentStatus;
                    oldCustomerSource = customerSource;
                    oldCustomerZee = customerZee;

                    oldStatusDate = onlyStatusDate;

                    countSalesRepTimeline++;
                    return true;
                });

                if (countSalesRepTimeline > 0) {
                    salesRepTimeLineCustomerArray.push(['',
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldCustomerInternalId + '" target="_blank" style="">' + oldCustomerId + '</a>',
                        oldCustomerName,
                        oldCustomerZee,
                        oldCustomerCurrentStatus,
                        oldCustomerSource,
                        childStatusTimeline
                    ]);
                }


                // statusTimeLineTable += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="3"><b>TOTAL WORKING DAYS</b></th><th style="text-align: center"><b>' + totalTimeInStatusDays + '</b></th><th></th></tfoot>';
                // statusTimeLineTable += '</tbody></table></div>';

                var dataTableSalesRepTimelinePreview = $('#salesrep_timeline_table').DataTable({
                    destroy: true,
                    data: salesRepTimeLineCustomerArray,
                    pageLength: 50,
                    order: [2, 'asc'],
                    layout: {
                        topStart: {
                            buttons: [{
                                extend: 'copy', text: 'Copy',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'csv', text: 'CSV',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'excel', text: 'Excel',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'pdf', text: 'PDF',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'print', text: 'Print',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }],
                        }
                    },
                    columns: [{
                        title: 'STATUS TIMELINE',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    }, {
                        title: 'ID'//1
                    }, {
                        title: 'COMPANY NAME'//2
                    }, {
                        title: 'FRANCHISEE'//3
                    }, {
                        title: 'STATUS'//4
                    }, {
                        title: 'SOURCE'//5
                    }, {
                        title: 'CHILD TABLE'//6
                    }],
                    columnDefs: [{
                        targets: [0, 1, 2, 3],
                        className: 'bolded'
                    }, {
                        targets: [6],
                        visible: false
                    }],
                    rowCallback: function (row, data, index) {
                        var row_color = ''
                        if (data[4] == 'SUSPECT-Customer - Lost' || data[4] == 'SUSPECT-Lost') {
                            $('td', row).css('background-color', '#e97777');
                        } else if (data[4] == 'CUSTOMER-Signed') {
                            $('td', row).css('background-color', '#ADCF9F');
                        }
                    },
                    footerCallback: function (row, data, start, end, display) { }

                });

                dataTableSalesRepTimelinePreview.rows().every(function () {
                    // this.child(format(this.data())).show();
                    this.child(createChildSalesRepTimeline(this)) // Add Child Tables
                    this.child.hide(); // Hide Child Tables on Open
                });

                $('#salesrep_timeline_table tbody').on('click', 'td.dt-control', function () {

                    var tr = $(this).closest('tr');
                    var row = dataTableSalesRepTimelinePreview.row(tr);

                    if (row.child.isShown()) {
                        // This row is already open - close it
                        destroyChild(row);
                        tr.removeClass('shown');
                        tr.removeClass('parent');

                        $('.expand-button').addClass('btn-primary');
                        $('.expand-button').removeClass('btn-light')
                    } else {
                        // Open this row
                        row.child.show();
                        tr.addClass('shown');
                        tr.addClass('parent');

                        $('.expand-button').removeClass('btn-primary');
                        $('.expand-button').addClass('btn-light')
                    }
                });


                $("#leadSalesRepModal .modal-title").text(salesRepName + '\'s Customer List');
                $("#leadSalesRepModal").show();

            });

            $(".closeSalesRepModal").click(function () {
                $("#leadSalesRepModal").hide();
            });
        }

        //Initialise the DataTable with headers.
        function submitSearch() {


            // userId = $('#user_dropdown option:selected').val();
            zee = $(
                '#zee_dropdown').val();

            // if (userId == 409635) {
            loadDatatable(zee, userId);
            // }

            console.log('Loaded Results');
            afterSubmit();
        }

        //Function to add the filters and relaod the page
        function addFilters() {

            zee = $('#zee_dropdown').val();
            // userId = $('#user_dropdown option:selected').val();

            var url = baseURL +
                '/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=' + zee +
                '&user_id=' +
                userId
            window.location.href = url;
        }

        function loadDatatable(zee_id, userId) {

            console.log('Website New Leads - Signed - Weekly Reporting')
            console.log('date_from: ' + date_from);
            console.log('date_to ' + date_to);

            console.log('modified_date_from: ' + modified_date_from);
            console.log('modified_date_to ' + modified_date_to);

            console.log('usage_date_from: ' + usage_date_from);
            console.log('usage_date_to ' + usage_date_to);

            console.log('usage_date_from: ' + usage_date_from);
            console.log('usage_date_to ' + usage_date_to);


            console.log('date_signed_up_from: ' + date_signed_up_from);
            console.log('date_signed_up_to ' + date_signed_up_to);

            console.log('date_quote_sent_from: ' + date_quote_sent_from);
            console.log('date_quote_sent_to ' + date_quote_sent_to);

            console.log('lead_source ' + lead_source);
            console.log('sales_campaign ' + sales_campaign);
            console.log('parent_lpo ' + parent_lpo);
            console.log('sales_rep ' + sales_rep);
            console.log('invoice_type ' + invoice_type);
            console.log('invoice_date_from ' + invoice_date_from);
            console.log('invoice_date_to ' + invoice_date_to);

            console.log('zee_id ' + zee_id);

            // if (role != 1000) {
            console.log('date_from:' + date_from);
            console.log('date_to:' + date_to);
            console.log('leadStatus:' + leadStatus);
            console.log('sales_activity_notes:' + sales_activity_notes);

            var employee_list_string = currRec.getValue({
                fieldId: 'custpage_employee_list'
            });
            var employee_list_color_string = currRec.getValue({
                fieldId: 'custpage_employee_list_color'
            });

            if (!isNullorEmpty(employee_list_string)) {
                employee_list = employee_list_string.split(',')
            }

            if (!isNullorEmpty(employee_list_color_string)) {
                employee_list_color = employee_list_color_string.split(',')
            }

            var campaign_list_string = currRec.getValue({
                fieldId: 'custpage_campaign_list'
            });
            var campaign_list_color_string = currRec.getValue({
                fieldId: 'custpage_campaign_list_color'
            });

            if (!isNullorEmpty(campaign_list_string)) {
                campaign_list = campaign_list_string.split(',')
            }

            if (!isNullorEmpty(campaign_list_color_string)) {
                campaign_list_color = campaign_list_color_string.split(',')
            }

            console.log('employee_list ' + employee_list);
            console.log('employee_list_color ' + employee_list_color);

            console.log('campaign_list ' + campaign_list);
            console.log('campaign_list_color ' + campaign_list_color);


            var source_list_string = currRec.getValue({
                fieldId: 'custpage_source_list'
            });
            var source_list_color_string = currRec.getValue({
                fieldId: 'custpage_source_list_color'
            });

            if (!isNullorEmpty(source_list_string)) {
                source_list = source_list_string.split(',')
            }

            if (!isNullorEmpty(source_list_color_string)) {
                source_list_color = source_list_color_string.split(',')
            }

            console.log('source_list ' + source_list);
            console.log('source_list_color ' + source_list_color);

            if (role == 1000 && isNullorEmpty(zee_id) && isNullorEmpty(sales_rep) && !isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                alert('Please select Sales Rep while selecting the Modified Date From & To filters.');
                return false;
            }

            console.log('Before Search Name: Zee Lead by Status - Weekly Reporting')

            //Search Name: Zee Lead by Status - System Notes - Weekly Reporting
            var qualifiedLeadCountSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_3__7'
            });



            if (!isNullorEmpty(zee_id)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(leadStatus)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }


            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }


            if (!isNullorEmpty(parent_lpo)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }


            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = qualifiedLeadCountSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [[["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

                qualifiedLeadCountSearch.filterExpression = defaultSearchFilters;

            }


            var totalLeadCount = 0;
            var totalCustomerCount = 0;
            var totalSuspectCount = 0;
            var totalProspectCount = 0;
            var totalCustomerLostCount = 0;
            var totalQualifiedLeadCount = 0;
            var totalLeadLost = 0;

            qualifiedLeadCountSearch.run().each(function (
                qualifiedLeadCountSearchResultSet) {
                var leadCount = parseInt(qualifiedLeadCountSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var dateLeadEntered = qualifiedLeadCountSearchResultSet.getValue({
                    name: 'custentity_date_lead_entered',
                    summary: 'GROUP'
                });
                var leadStatus = qualifiedLeadCountSearchResultSet.getText({
                    name: 'entitystatus',
                    summary: 'GROUP'
                });
                var leadStatusId = qualifiedLeadCountSearchResultSet.getValue({
                    name: 'entitystatus',
                    summary: 'GROUP'
                });

                var leadStatusSplit = leadStatus.split('-');

                totalLeadCount = totalLeadCount + leadCount;

                if (leadStatusId == 22) {
                    totalCustomerLostCount = totalCustomerLostCount + leadCount;
                }

                if (leadStatusId == 13 || leadStatusId == 66) {
                    totalCustomerCount = totalCustomerCount + leadCount;
                }

                if (leadStatusSplit[0].toUpperCase() == 'SUSPECT' && leadStatusId != 59) {
                    totalSuspectCount = totalSuspectCount + leadCount;
                }

                if (leadStatusSplit[0].toUpperCase() == 'PROSPECT') {
                    totalProspectCount = totalProspectCount + leadCount;
                }

                if (leadStatusId == 59) {
                    totalLeadLost = totalLeadLost + leadCount;
                }

                return true;
            });

            // Create the chart
            Highcharts.chart('container-progress', {
                chart: {
                    type: 'pie',
                    backgroundColor: '#CFE0CE',
                },
                title: {
                    text: '',
                },
                accessibility: {
                    announceNewData: {
                        enabled: true
                    },
                    point: {
                        valueSuffix: ''
                    }
                },

                plotOptions: {
                    series: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: [{
                            enabled: true,
                            distance: 20,
                            style: {
                                fontSize: '1.2em',
                                textOutline: 'none',
                                opacity: 0.7
                            }
                        }, {
                            enabled: true,
                            distance: -40,
                            format: '{point.y:.0f}',
                            style: {
                                fontSize: '1.2em',
                                textOutline: 'none',
                                opacity: 0.7
                            }
                        }]
                    }
                },

                tooltip: {
                    valueSuffix: '',
                    style: {
                        fontSize: '1.2em'
                    }
                },

                series: [
                    {
                        name: 'Leads',
                        colorByPoint: true,
                        data: [
                            {
                                name: 'Customers',
                                y: totalCustomerCount,
                                sliced: true,
                                selected: true,
                                color: '#5cb3b0',
                            },
                            {
                                name: 'Prospects',
                                y: totalProspectCount,
                                sliced: true,
                                color: '#adcf9f',
                            },
                            {
                                name: 'Suspects',
                                y: totalSuspectCount,
                                sliced: true,
                                color: '#FEBE8C',
                            },
                            {
                                name: 'Suspects - Lost',
                                y: totalLeadLost,
                                sliced: true,
                                color: '#e97677',
                            },
                            {
                                name: 'Customers - Lost',
                                y: totalCustomerLostCount,
                                sliced: true,
                                color: '#e76252',
                            }
                        ]
                    }
                ]
            });

            // Leads by Status - system Notes - Weekly Reporting 
            var leadsListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_7'
            });


            if (!isNullorEmpty(leadStatus)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = leadsListBySalesRepWeeklySearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

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
            prospect_no_answer = 0;
            prospect_in_contact = 0;
            suspect_follow_up = 0;
            var prospect_qualified = 0;
            suspect_new = 0;

            suspect_lpo_followup = 0;
            suspect_qualified = 0;
            suspect_unqualified = 0;

            suspect_validated = 0;
            customer_free_trial = 0;
            customer_free_trial_pending = 0;

            suspect_no_answer = 0;
            suspect_in_contact = 0;


            leadsListBySalesRepWeeklySearch.run().each(function (
                prospectListBySalesRepWeeklyResultSet) {


                var prospectCount = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "date",
                    join: "systemNotes",
                    summary: "GROUP",
                });
                var custStatus = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP",
                    label: "Status"
                }));
                var custStatusText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP",
                    label: "Status"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
                    if (!isNullorEmpty(weekLeadEntered)) {
                        var splitMonthV2 = weekLeadEntered.split('/');

                        var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);

                        var firstDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 1).getDate();
                        var lastDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 0).getDate();

                        if (firstDay < 10) {
                            firstDay = '0' + firstDay;
                        }

                        // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var startDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            splitMonthV2[0];
                        var monthsStartDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            firstDay;
                        // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var lastDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            lastDay
                    } else {
                        var startDate = 'NO DATE'
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                } else if (oldDate1 != null &&
                    oldDate1 == startDate) {

                    if (custStatus == 13 || custStatus == 66) {
                        //CUSTOMER _ SIGNED
                        customer_signed += prospectCount;
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead += prospectCount
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost += prospectCount
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot += parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost += prospectCount
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign += prospectCount
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                } else if (oldDate1 != null &&
                    oldDate1 != startDate) {

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
                        customer_free_trial_pending: customer_free_trial_pending

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

                    if (custStatus == 13 || custStatus == 66) {
                        //CUSTOMER _ SIGNED
                        customer_signed = prospectCount;
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead = prospectCount
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost = prospectCount
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot = parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost = prospectCount
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign = prospectCount
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified
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
                    customer_free_trial_pending: customer_free_trial_pending
                });
            }

            console.log('debt_set2: ' + JSON.stringify(debt_set2));

            previewDataSet = [];
            csvPreviewSet = [];

            var overDataSet = [];


            if (!isNullorEmpty(debt_set2)) {
                debt_set2
                    .forEach(function (preview_row, index) {

                        var hotLeadPercentage = parseInt((preview_row.suspect_hot_lead / preview_row.total_leads) * 100);
                        var hotLeadCol = preview_row.suspect_hot_lead + ' (' + hotLeadPercentage + '%)';

                        var quoteSentPercentage = parseInt((preview_row.prospecy_quote_sent / preview_row.total_leads) * 100);
                        var quoteSentCol = preview_row.prospecy_quote_sent + ' (' + quoteSentPercentage + '%)';


                        var reassignPercentage = parseInt((preview_row.suspect_reassign / preview_row.total_leads) * 100);
                        var reassignCol = preview_row.suspect_reassign + ' (' + reassignPercentage + '%)';

                        var noAnswerPercentage = parseInt((preview_row.prospect_no_answer / preview_row.total_leads) * 100);
                        var noAnswerCol = preview_row.prospect_no_answer + ' (' + noAnswerPercentage + '%)';

                        var inContactPercentage = parseInt((preview_row.prospect_in_contact / preview_row.total_leads) * 100);
                        var inContactCol = preview_row.prospect_in_contact + ' (' + inContactPercentage + '%)';


                        var offPeakPercentage = parseInt((preview_row.suspect_off_peak_pipeline / preview_row.total_leads) * 100);
                        var offPeakCol = preview_row.suspect_off_peak_pipeline + ' (' + offPeakPercentage + '%)';

                        var lostPercentage = parseInt((preview_row.suspect_lost / preview_row.total_leads) * 100);
                        var lostCol = preview_row.suspect_lost + ' (' + lostPercentage + '%)';

                        var ootPercentage = parseInt((preview_row.suspect_oot / preview_row.total_leads) * 100);
                        var ootCol = preview_row.suspect_oot + ' (' + ootPercentage + '%)';

                        var custLostPercentage = parseInt((preview_row.suspect_customer_lost / preview_row.total_leads) * 100);
                        var custLostCol = preview_row.suspect_customer_lost + ' (' + custLostPercentage + '%)';

                        var oppPercentage = parseInt((preview_row.prospect_opportunity / preview_row.total_leads) * 100);
                        var oppCol = preview_row.prospect_opportunity + ' (' + oppPercentage + '%)';

                        var signedPercentage = parseInt((preview_row.customer_signed / preview_row.total_leads) * 100);
                        var signedCol = preview_row.customer_signed + ' (' + signedPercentage + '%)';

                        var suspectFollowUpPErcentage = parseInt((preview_row.suspect_follow_up / preview_row.total_leads) * 100);
                        var followUpCol = preview_row.suspect_follow_up + ' (' + suspectFollowUpPErcentage + '%)';

                        var suspectNewPercentage = parseInt((preview_row.suspect_new / preview_row.total_leads) * 100);
                        var suspectNewCol = preview_row.suspect_new + ' (' + suspectNewPercentage + '%)';

                        var suspectQualifiedPercentage = parseInt((preview_row.suspect_qualified / preview_row.total_leads) * 100);
                        var suspectQualifiedCol = preview_row.suspect_qualified + ' (' + suspectQualifiedPercentage + '%)';

                        var suspectUnqualifiedPercentage = parseInt((preview_row.suspect_unqualified / preview_row.total_leads) * 100);
                        var suspectUnqualifiedCol = preview_row.suspect_unqualified + ' (' + suspectUnqualifiedPercentage + '%)';

                        var suspectLPOFollowupPercentage = parseInt((preview_row.suspect_lpo_followup / preview_row.total_leads) * 100);
                        var suspectLPOFollowupwCol = preview_row.suspect_lpo_followup + ' (' + suspectLPOFollowupPercentage + '%)';

                        var suspectValidatedPercentage = parseInt((preview_row.suspect_validated / preview_row.total_leads) * 100);
                        var suspectValidatedCol = preview_row.suspect_validated + ' (' + suspectValidatedPercentage + '%)';

                        var customerFreeTrialPercentage = parseInt((preview_row.customer_free_trial / preview_row.total_leads) * 100);
                        var customerFreeTrialCol = preview_row.customer_free_trial + ' (' + customerFreeTrialPercentage + '%)';

                        var customerFreeTrialPendingPercentage = parseInt((preview_row.customer_free_trial_pending / preview_row.total_leads) * 100);
                        var customerFreeTrialPendingCol = preview_row.customer_free_trial_pending + ' (' + customerFreeTrialPendingPercentage + '%)';

                        var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                        var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                        var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                        var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';

                        var prospectQualifiedPercentage = parseInt((preview_row.prospect_qualified / preview_row.total_leads) * 100);
                        var prospectQualifiedCol = preview_row.prospect_qualified + ' (' + prospectQualifiedPercentage + '%)';


                        overDataSet.push([preview_row.dateUsed,
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
                        preview_row.prospecy_quote_sent,
                        preview_row.customer_free_trial_pending,
                        preview_row.customer_free_trial,
                        preview_row.customer_signed,
                        preview_row.total_leads
                        ]);


                        previewDataSet.push([preview_row.dateUsed,
                            suspectNewCol,
                            hotLeadCol,
                            suspectQualifiedCol,
                            suspectUnqualifiedCol,
                            suspectValidatedCol,
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
                            signedCol,
                        preview_row.total_leads
                        ]);

                    });
            }

            console.log('previewDataSet');
            console.log(previewDataSet);

            var dataTablePreview = $('#mpexusage-preview').DataTable({
                destroy: true,
                data: previewDataSet,
                pageLength: 1000,
                responsive: true,
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [{
                    title: 'Period'//0
                }, {
                    title: 'Suspect - New'//1
                }, {
                    title: 'Suspect - Hot Lead'//2
                }, {
                    title: 'Suspect - Qualified'//3
                }, {
                    title: 'Suspect - Unqualified'//4
                }, {
                    title: 'Suspect - Validated'//5
                }, {
                    title: 'Suspect - Reassign'//6
                }, {
                    title: 'Suspect - Follow Up'//7
                }, {
                    title: 'Suspect - LPO Follow Up'//8
                }, {
                    title: 'Suspect - No Answer'//9
                }, {
                    title: 'Suspect - In Contact'//10
                }, {
                    title: 'Prospect - In Contact'//11
                }, {
                    title: 'Suspect - Parking Lot'//12
                }, {
                    title: 'Suspect - Lost'//13
                }, {
                    title: 'Suspect - Out of Territory'//14
                }, {
                    title: 'Suspect - Customer - Lost'//15
                }, {
                    title: 'Prospect - Opportunity'//16
                }, {
                    title: 'Prospect - Qualified'//17
                }, {
                    title: 'Prospect - Quote Sent'//18
                }, {
                    title: 'Customer - Free Trial Pending'//19
                }, {
                    title: 'Customer - Free Trial'//20
                }, {
                    title: 'Customer - Signed'//21
                }, {
                    title: 'Total Status Change Count'//22
                }],
                columnDefs: [{
                    targets: [0, 5, 17, 19, 20],
                    className: 'bolded'
                }], footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return parseInt(i);
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })
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

                    // Total Lead Count
                    total_lead = api
                        .column(22)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    total_prospect_qualified = api
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(1).footer()).html(
                        total_suspect_new + ' (' + ((total_suspect_new / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(2).footer()).html(
                        total_suspect_hot_lead + ' (' + ((total_suspect_hot_lead / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(3).footer()).html(
                        total_suspect_qualified + ' (' + ((total_suspect_qualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(4).footer()).html(
                        total_suspect_unqualified + ' (' + ((total_suspect_unqualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(5).footer()).html(
                        total_suspect_validated + ' (' + ((total_suspect_validated / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(6).footer()).html(
                        total_suspect_reassign + ' (' + ((total_suspect_reassign / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(7).footer()).html(
                        total_suspect_followup + ' (' + ((total_suspect_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(8).footer()).html(
                        total_suspect_lpo_followup + ' (' + ((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(9).footer()).html(
                        total_suspect_no_answer + ' (' + ((total_suspect_no_answer / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(10).footer()).html(
                        total_suspect_in_contact + ' (' + ((total_suspect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(11).footer()).html(
                        total_prospect_in_contact + ' (' + ((total_prospect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(12).footer()).html(
                        total_suspect_off_peak_pipeline + ' (' + ((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(13).footer()).html(
                        total_suspect_lost + ' (' + ((total_suspect_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(14).footer()).html(
                        total_suspect_oot + ' (' + ((total_suspect_oot / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(15).footer()).html(
                        total_suspect_customer_lost + ' (' + ((total_suspect_customer_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(16).footer()).html(
                        total_prospect_opportunity + ' (' + ((total_prospect_opportunity / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(17).footer()).html(
                        total_prospect_qualified + ' (' + ((total_prospect_qualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(18).footer()).html(
                        total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                    );



                    $(api.column(19).footer()).html(
                        total_customer_free_trial_pending + ' (' + ((total_customer_free_trial_pending / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(20).footer()).html(
                        total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(21).footer()).html(
                        total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(22).footer()).html(
                        total_lead
                    );

                }

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
            var total_leads = [];

            for (var i = 0; i < data.length; i++) {
                month_year.push(data[i][0]);
                suspect_new[data[i][0]] = data[i][1]
                suspect_hot_lead[data[i][0]] = data[i][2]
                suspect_qualified[data[i][0]] = data[i][3]
                suspect_unqualified[data[i][0]] = data[i][4]
                suspect_validated[data[i][0]] = data[i][5]
                suspect_reassign[data[i][0]] = data[i][6]
                suspect_follow_up[data[i][0]] = data[i][7]
                suspect_lpo_followup[data[i][0]] = data[i][8]
                suspect_no_answer[data[i][0]] = data[i][9]
                suspect_in_contact[data[i][0]] = data[i][10]
                prospect_in_contact[data[i][0]] = data[i][11]
                suspect_off_peak_pipeline[data[i][0]] = data[i][12]
                suspect_lost[data[i][0]] = data[i][13]
                suspect_oot[data[i][0]] = data[i][14]
                suspect_customer_lost[data[i][0]] = data[i][15]
                prospect_opportunity[data[i][0]] = data[i][16]
                prospect_qualified[data[i][0]] = data[i][17]
                prospecy_quote_sent[data[i][0]] = data[i][18]
                customer_free_trial_pending[data[i][0]] = data[i][19];
                customer_free_trial[data[i][0]] = data[i][20];
                customer_signed[data[i][0]] = data[i][21];
                total_leads[data[i][0]] = data[i][22]
            }
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
                categores1.push(item)
            });


            plotChartPreview(series_data20,
                series_data21,
                series_data22,
                series_data23,
                series_data24,
                series_data25,
                series_data26,
                series_data27,
                series_data28,
                series_data29, series_data31, series_data32, series_data33, series_data34, categores1, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a, series_data26a, series_data27a, series_data28a)



            //TODO - LPO Preview
            if ((isNullorEmpty(lead_source) || isNullorEmpty(sales_campaign) || lead_source == 282083 || lead_source == 282051 || lead_source == 282085 || lead_source == 281559 || sales_campaign == 69)) {

                // LPO New Leads by Status - Weekly Reporting
                var lpoLeadsListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_4'
                });


                if (!isNullorEmpty(leadStatus)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: leadStatus
                    }));
                }

                if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_from
                    }));

                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_to
                    }));
                }

                if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_signed_up_from
                    }));

                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_signed_up_to
                    }));
                }

                if (!isNullorEmpty(lead_source)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_source
                    }));
                }

                if (!isNullorEmpty(sales_rep)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_assigned',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: sales_rep
                    }));
                }

                if (!isNullorEmpty(lead_entered_by)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_lead_entered_by',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_entered_by
                    }));
                }

                if (!isNullorEmpty(sales_campaign)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.ANYOF,
                        values: sales_campaign
                    }));
                }

                if (!isNullorEmpty(parent_lpo)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.ANYOF,
                        values: parent_lpo
                    }));
                }

                if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_quote_sent_from
                    }));

                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_quote_sent_to
                    }));
                }

                if (!isNullorEmpty(zee_id)) {
                    lpoLeadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zee_id
                    }));
                }

                if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                    var defaultSearchFilters = lpoLeadsListBySalesRepWeeklySearch.filterExpression;

                    console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                    var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                    console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                    defaultSearchFilters.push('AND');
                    defaultSearchFilters.push(modifiedDateFilters);

                    console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

                    lpoLeadsListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;

                }

                var count1 = 0;
                var oldParentLPOName = null;

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
                var suspect_qualified = 0;

                var suspect_validated = 0;
                var customer_free_trial = 0;
                var customer_free_trial_pending = 0;

                var suspect_no_answer = 0;
                var suspect_in_contact = 0;


                lpoLeadsListBySalesRepWeeklySearch.run().each(function (
                    lpoLeadsListBySalesRepWeeklyResultSet) {


                    var prospectCount = parseInt(lpoLeadsListBySalesRepWeeklyResultSet.getValue({
                        name: 'internalid',
                        summary: 'COUNT'
                    }));

                    var custStatus = parseInt(lpoLeadsListBySalesRepWeeklyResultSet.getValue({
                        name: "entitystatus",
                        summary: "GROUP"
                    }));
                    var custStatusText = lpoLeadsListBySalesRepWeeklyResultSet.getText({
                        name: "entitystatus",
                        summary: "GROUP"
                    });
                    var parentLPOName = lpoLeadsListBySalesRepWeeklyResultSet.getText({
                        name: "custentity_lpo_parent_account",
                        summary: "GROUP"
                    });

                    if (isNullorEmpty(parentLPOName)) {
                        parentLPOName = 'Unassigned'
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
                        }

                        total_leads = customer_signed +
                            suspect_hot_lead +
                            suspect_lost +
                            suspect_customer_lost +
                            suspect_reassign +
                            prospecy_quote_sent +
                            prospect_no_answer +
                            prospect_in_contact +
                            suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending

                    } else if (oldParentLPOName != null &&
                        oldParentLPOName == parentLPOName) {

                        if (custStatus == 13 || custStatus == 66) {
                            //CUSTOMER _ SIGNED
                            customer_signed += prospectCount;
                        } else if (custStatus == 57) {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += prospectCount
                        } else if (custStatus == 59) {
                            //SUSPECT - LOST
                            suspect_lost += prospectCount
                        } else if (custStatus == 64) {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (custStatus == 22) {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += prospectCount
                        } else if (custStatus == 60 || custStatus == 40) {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += prospectCount
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
                        }

                        total_leads = customer_signed +
                            suspect_hot_lead +
                            suspect_lost +
                            suspect_customer_lost +
                            suspect_reassign +
                            prospecy_quote_sent +
                            prospect_no_answer +
                            prospect_in_contact +
                            suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending

                    } else if (oldDate1 != null &&
                        oldParentLPOName != parentLPOName) {

                        lpo_debt_set2.push({
                            lpoparentname: oldParentLPOName,
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
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_validated: suspect_validated,
                            customer_free_trial: customer_free_trial,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_qualified: prospect_qualified,
                            customer_free_trial_pending: customer_free_trial_pending
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
                        suspect_lpo_followup = 0;
                        total_leads = 0;
                        prospect_qualified = 0;

                        suspect_validated = 0;
                        customer_free_trial = 0;
                        customer_free_trial_pending = 0;
                        suspect_no_answer = 0;
                        suspect_in_contact = 0;

                        if (custStatus == 13 || custStatus == 66) {
                            //CUSTOMER _ SIGNED
                            customer_signed = prospectCount;
                        } else if (custStatus == 57) {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = prospectCount
                        } else if (custStatus == 59) {
                            //SUSPECT - LOST
                            suspect_lost = prospectCount
                        } else if (custStatus == 64) {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (custStatus == 22) {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = prospectCount
                        } else if (custStatus == 60 || custStatus == 40) {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = prospectCount
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
                            //PROSPECT QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        }

                        total_leads = customer_signed +
                            suspect_hot_lead +
                            suspect_lost +
                            suspect_customer_lost +
                            suspect_reassign +
                            prospecy_quote_sent +
                            prospect_no_answer +
                            prospect_in_contact +
                            suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending
                    }

                    count1++;
                    oldParentLPOName = parentLPOName;
                    return true;
                });


                if (count1 > 0) {
                    lpo_debt_set2.push({
                        lpoparentname: oldParentLPOName,
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
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_validated: suspect_validated,
                        customer_free_trial: customer_free_trial,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_qualified: prospect_qualified,
                        customer_free_trial_pending: customer_free_trial_pending
                    });
                }

                console.log('lpo_debt_set2: ' + JSON.stringify(lpo_debt_set2));

                lpo_previewDataSet = [];
                lpo_csvPreviewSet = [];

                var lpo_overDataSet = [];


                if (!isNullorEmpty(lpo_debt_set2)) {
                    lpo_debt_set2
                        .forEach(function (preview_row, index) {

                            var hotLeadPercentage = parseInt((preview_row.suspect_hot_lead / preview_row.total_leads) * 100);
                            var hotLeadCol = preview_row.suspect_hot_lead + ' (' + hotLeadPercentage + '%)';

                            var quoteSentPercentage = parseInt((preview_row.prospecy_quote_sent / preview_row.total_leads) * 100);
                            var quoteSentCol = preview_row.prospecy_quote_sent + ' (' + quoteSentPercentage + '%)';


                            var reassignPercentage = parseInt((preview_row.suspect_reassign / preview_row.total_leads) * 100);
                            var reassignCol = preview_row.suspect_reassign + ' (' + reassignPercentage + '%)';

                            var noAnswerPercentage = parseInt((preview_row.prospect_no_answer / preview_row.total_leads) * 100);
                            var noAnswerCol = preview_row.prospect_no_answer + ' (' + noAnswerPercentage + '%)';

                            var inContactPercentage = parseInt((preview_row.prospect_in_contact / preview_row.total_leads) * 100);
                            var inContactCol = preview_row.prospect_in_contact + ' (' + inContactPercentage + '%)';


                            var offPeakPercentage = parseInt((preview_row.suspect_off_peak_pipeline / preview_row.total_leads) * 100);
                            var offPeakCol = preview_row.suspect_off_peak_pipeline + ' (' + offPeakPercentage + '%)';

                            var lostPercentage = parseInt((preview_row.suspect_lost / preview_row.total_leads) * 100);
                            var lostCol = preview_row.suspect_lost + ' (' + lostPercentage + '%)';

                            var ootPercentage = parseInt((preview_row.suspect_oot / preview_row.total_leads) * 100);
                            var ootCol = preview_row.suspect_oot + ' (' + ootPercentage + '%)';

                            var custLostPercentage = parseInt((preview_row.suspect_customer_lost / preview_row.total_leads) * 100);
                            var custLostCol = preview_row.suspect_customer_lost + ' (' + custLostPercentage + '%)';

                            var oppPercentage = parseInt((preview_row.prospect_opportunity / preview_row.total_leads) * 100);
                            var oppCol = preview_row.prospect_opportunity + ' (' + oppPercentage + '%)';

                            var signedPercentage = parseInt((preview_row.customer_signed / preview_row.total_leads) * 100);
                            var signedCol = preview_row.customer_signed + ' (' + signedPercentage + '%)';

                            var suspectFollowUpPErcentage = parseInt((preview_row.suspect_follow_up / preview_row.total_leads) * 100);
                            var followUpCol = preview_row.suspect_follow_up + ' (' + suspectFollowUpPErcentage + '%)';

                            var suspectNewPercentage = parseInt((preview_row.suspect_new / preview_row.total_leads) * 100);
                            var suspectNewCol = preview_row.suspect_new + ' (' + suspectNewPercentage + '%)';

                            var suspectQualifiedPercentage = parseInt((preview_row.suspect_qualified / preview_row.total_leads) * 100);
                            var suspectQualifiedCol = preview_row.suspect_qualified + ' (' + suspectQualifiedPercentage + '%)';

                            var suspectLPOFollowupPercentage = parseInt((preview_row.suspect_lpo_followup / preview_row.total_leads) * 100);
                            var suspectLPOFollowupwCol = preview_row.suspect_lpo_followup + ' (' + suspectLPOFollowupPercentage + '%)';

                            var suspectValidatedPercentage = parseInt((preview_row.suspect_validated / preview_row.total_leads) * 100);
                            var suspectValidatedCol = preview_row.suspect_validated + ' (' + suspectValidatedPercentage + '%)';

                            var customerFreeTrialPercentage = parseInt((preview_row.customer_free_trial / preview_row.total_leads) * 100);
                            var customerFreeTrialCol = preview_row.customer_free_trial + ' (' + customerFreeTrialPercentage + '%)';

                            var customerFreeTrialPendingPercentage = parseInt((preview_row.customer_free_trial_pending / preview_row.total_leads) * 100);
                            var customerFreeTrialPendingCol = preview_row.customer_free_trial_pending + ' (' + customerFreeTrialPendingPercentage + '%)';

                            var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                            var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                            var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                            var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';

                            var prospectQualifiedPercentage = parseInt((preview_row.prospect_qualified / preview_row.total_leads) * 100);
                            var prospectQualifiedCol = preview_row.prospect_qualified + ' (' + prospectQualifiedPercentage + '%)';


                            lpo_overDataSet.push([preview_row.lpoparentname,
                            preview_row.suspect_new,
                            preview_row.suspect_hot_lead,
                            preview_row.suspect_qualified,
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
                            preview_row.prospecy_quote_sent,
                            preview_row.customer_free_trial_pending,
                            preview_row.customer_free_trial,
                            preview_row.customer_signed,
                            preview_row.total_leads
                            ]);


                            lpo_previewDataSet.push([preview_row.lpoparentname,
                                suspectNewCol,
                                hotLeadCol,
                                suspectQualifiedCol,
                                suspectValidatedCol,
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
                                signedCol,
                            preview_row.total_leads
                            ]);

                        });
                }

                console.log('lpo_previewDataSet');
                console.log(lpo_previewDataSet);

                var dataTableLPOPreview = $('#mpexusage-lpo_overview').DataTable({
                    destroy: true,
                    data: lpo_previewDataSet,
                    pageLength: 1000,
                    layout: {
                        topStart: {
                            buttons: [{
                                extend: 'copy', text: 'Copy',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'csv', text: 'CSV',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'excel', text: 'Excel',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'pdf', text: 'PDF',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'print', text: 'Print',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }],
                        }
                    },
                    columns: [{
                        title: 'LPO Name'//0
                    }, {
                        title: 'Suspect - New'//1
                    }, {
                        title: 'Suspect - Hot Lead'//2
                    }, {
                        title: 'Suspect - Qualified'//3
                    }, {
                        title: 'Suspect - Validated'//4
                    }, {
                        title: 'Suspect - Reassign'//5
                    }, {
                        title: 'Suspect - Follow Up'//6
                    }, {
                        title: 'Suspect - LPO Follow Up'//7
                    }, {
                        title: 'Suspect - No Answer'//8
                    }, {
                        title: 'Suspect - In Contact'//9
                    }, {
                        title: 'Prospect - In Contact'//10
                    }, {
                        title: 'Suspect - Parking Lot'//11
                    }, {
                        title: 'Suspect - Lost'//12
                    }, {
                        title: 'Suspect - Out of Territory'//13
                    }, {
                        title: 'Suspect - Customer - Lost'//14
                    }, {
                        title: 'Prospect - Opportunity'//15
                    }, {
                        title: 'Prospect - Qualified'//16
                    }, {
                        title: 'Prospect - Quote Sent'//17
                    }, {
                        title: 'Customer - Free Trial Pending'//18
                    }, {
                        title: 'Customer - Free Trial'//19
                    }, {
                        title: 'Customer - Signed'//20
                    }, {
                        title: 'Total Status Change Count'//21
                    }],
                    columnDefs: [{
                        targets: [0, 4, 17, 19, 20],
                        className: 'bolded'
                    }], footerCallback: function (row, data, start, end, display) {
                        var api = this.api(),
                            data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return parseInt(i);
                        };

                        const formatter = new Intl.NumberFormat('en-AU', {
                            style: 'currency',
                            currency: 'AUD',
                            minimumFractionDigits: 2
                        })
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

                        // Total Suspect Validated
                        total_suspect_validated = api
                            .column(4)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Suspect Reassign
                        total_suspect_reassign = api
                            .column(5)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Suspect Follow Up
                        total_suspect_followup = api
                            .column(6)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Suspect LPO Follow Up
                        total_suspect_lpo_followup = api
                            .column(7)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Suspect No Answer
                        total_suspect_no_answer = api
                            .column(8)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);


                        // Total Suspect In Contact
                        total_suspect_in_contact = api
                            .column(9)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);


                        // Total Prospect In Contact
                        total_prospect_in_contact = api
                            .column(10)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);


                        // Total Suspect Off Peak Pipline
                        total_suspect_off_peak_pipeline = api
                            .column(11)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);


                        // Total Suspect Lost
                        total_suspect_lost = api
                            .column(12)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);


                        // Total Suspect Out of Territory
                        total_suspect_oot = api
                            .column(13)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);


                        // Total Suspect Customer Lost
                        total_suspect_customer_lost = api
                            .column(14)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Prospect Opportunity
                        total_prospect_opportunity = api
                            .column(15)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        total_prospect_qualified = api
                            .column(16)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Prospect Quoite Sent
                        total_prospect_quote_sent = api
                            .column(17)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Customer Free Trial Pending
                        total_customer_free_trial_pending = api
                            .column(18)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Customer Free Trial
                        total_customer_free_trial = api
                            .column(19)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Customer Signed
                        total_customer_signed = api
                            .column(20)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Total Lead Count
                        total_lead = api
                            .column(21)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Update footer
                        $(api.column(1).footer()).html(
                            total_suspect_new + ' (' + ((total_suspect_new / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(2).footer()).html(
                            total_suspect_hot_lead + ' (' + ((total_suspect_hot_lead / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(3).footer()).html(
                            total_suspect_qualified + ' (' + ((total_suspect_qualified / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(4).footer()).html(
                            total_suspect_validated + ' (' + ((total_suspect_validated / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(5).footer()).html(
                            total_suspect_reassign + ' (' + ((total_suspect_reassign / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(6).footer()).html(
                            total_suspect_followup + ' (' + ((total_suspect_followup / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(7).footer()).html(
                            total_suspect_lpo_followup + ' (' + ((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(8).footer()).html(
                            total_suspect_no_answer + ' (' + ((total_suspect_no_answer / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(9).footer()).html(
                            total_suspect_in_contact + ' (' + ((total_suspect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(10).footer()).html(
                            total_prospect_in_contact + ' (' + ((total_prospect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(11).footer()).html(
                            total_suspect_off_peak_pipeline + ' (' + ((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(12).footer()).html(
                            total_suspect_lost + ' (' + ((total_suspect_lost / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(13).footer()).html(
                            total_suspect_oot + ' (' + ((total_suspect_oot / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(14).footer()).html(
                            total_suspect_customer_lost + ' (' + ((total_suspect_customer_lost / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(15).footer()).html(
                            total_prospect_opportunity + ' (' + ((total_prospect_opportunity / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(16).footer()).html(
                            total_prospect_qualified + ' (' + ((total_prospect_qualified / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(17).footer()).html(
                            total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(18).footer()).html(
                            total_customer_free_trial_pending + ' (' + ((total_customer_free_trial_pending / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(19).footer()).html(
                            total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(20).footer()).html(
                            total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(21).footer()).html(
                            total_lead
                        );

                    }

                });

                saveCsv(lpo_previewDataSet);

                var lpo_data = lpo_overDataSet;

                var lpo_month_year = []; // creating array for storing browser
                var lpo_customer_signed = [];
                var lpo_suspect_hot_lead = [];
                var lpo_suspect_reassign = [];
                var lpo_suspect_lost = [];
                var lpo_suspect_oot = [];
                var lpo_suspect_customer_lost = [];
                var lpo_suspect_off_peak_pipeline = [];
                var lpo_prospect_opportunity = [];
                var lpo_prospect_qualified = [];
                var lpo_prospecy_quote_sent = [];
                var lpo_prospect_no_answer = [];
                var lpo_prospect_in_contact = [];
                var lpo_suspect_follow_up = [];
                var lpo_suspect_new = [];
                var lpo_suspect_qualified = [];
                var lpo_suspect_lpo_followup = [];
                var lpo_suspect_validated = [];
                var lpo_customer_free_trial = [];
                var lpo_customer_free_trial_pending = [];
                var lpo_suspect_no_answer = [];
                var lpo_suspect_in_contact = [];
                var lpo_total_leads = [];

                for (var i = 0; i < lpo_data.length; i++) {
                    lpo_month_year.push(lpo_data[i][0]);
                    lpo_suspect_new[lpo_data[i][0]] = lpo_data[i][1]
                    lpo_suspect_hot_lead[lpo_data[i][0]] = lpo_data[i][2]
                    lpo_suspect_qualified[lpo_data[i][0]] = lpo_data[i][3]
                    lpo_suspect_validated[lpo_data[i][0]] = lpo_data[i][4]
                    lpo_suspect_reassign[lpo_data[i][0]] = lpo_data[i][5]
                    lpo_suspect_follow_up[lpo_data[i][0]] = lpo_data[i][6]
                    lpo_suspect_lpo_followup[lpo_data[i][0]] = lpo_data[i][7]
                    lpo_suspect_no_answer[lpo_data[i][0]] = lpo_data[i][8]
                    lpo_suspect_in_contact[lpo_data[i][0]] = lpo_data[i][9]
                    lpo_prospect_in_contact[lpo_data[i][0]] = lpo_data[i][10]
                    lpo_suspect_off_peak_pipeline[lpo_data[i][0]] = lpo_data[i][11]
                    lpo_suspect_lost[lpo_data[i][0]] = lpo_data[i][12]
                    lpo_suspect_oot[lpo_data[i][0]] = lpo_data[i][13]
                    lpo_suspect_customer_lost[lpo_data[i][0]] = lpo_data[i][14]
                    lpo_prospect_opportunity[lpo_data[i][0]] = lpo_data[i][15]
                    lpo_prospect_qualified[lpo_data[i][0]] = lpo_data[i][16]
                    lpo_prospecy_quote_sent[lpo_data[i][0]] = lpo_data[i][17]
                    lpo_customer_free_trial_pending[lpo_data[i][0]] = lpo_data[i][18];
                    lpo_customer_free_trial[lpo_data[i][0]] = lpo_data[i][19];
                    lpo_customer_signed[lpo_data[i][0]] = lpo_data[i][20];
                    lpo_total_leads[lpo_data[i][0]] = lpo_data[i][21]
                }
                var lpo_count = {}; // creating object for getting categories with
                // count
                lpo_month_year.forEach(function (i) {
                    lpo_count[i] = (lpo_count[i] || 0) + 1;
                });

                var lpo_series_data20 = [];
                var lpo_series_data21 = [];
                var lpo_series_data22 = [];
                var lpo_series_data23 = [];
                var lpo_series_data24 = [];
                var lpo_series_data25 = [];
                var lpo_series_data26 = [];
                var lpo_series_data27 = [];
                var lpo_series_data28 = [];
                var lpo_series_data29 = [];
                var lpo_series_data30 = [];
                var lpo_series_data31 = [];
                var lpo_series_data32 = [];
                var lpo_series_data33 = [];
                var lpo_series_data34 = [];
                var lpo_series_data20a = [];
                var lpo_series_data21a = [];
                var lpo_series_data22a = [];
                var lpo_series_data23a = [];
                var lpo_series_data24a = [];
                var lpo_series_data25a = [];
                var lpo_series_data26a = [];
                var lpo_series_data27a = [];

                var lpo_categores1 = []; // creating empty array for highcharts
                // categories
                Object.keys(lpo_total_leads).map(function (item, key) {
                    lpo_series_data20.push(parseInt(lpo_customer_signed[item]));
                    lpo_series_data21.push(parseInt(lpo_suspect_hot_lead[item]));
                    lpo_series_data22.push(parseInt(lpo_suspect_reassign[item]));
                    lpo_series_data23.push(parseInt(lpo_suspect_lost[item]));
                    lpo_series_data24.push(parseInt(lpo_suspect_customer_lost[item]));
                    lpo_series_data25.push(parseInt(lpo_suspect_off_peak_pipeline[item]));
                    lpo_series_data26.push(parseInt(lpo_prospecy_quote_sent[item]));
                    lpo_series_data27.push(parseInt(lpo_prospect_no_answer[item]));
                    lpo_series_data28.push(parseInt(lpo_prospect_in_contact[item]));
                    lpo_series_data29.push(parseInt(lpo_total_leads[item]));
                    lpo_series_data31.push(parseInt(lpo_prospect_opportunity[item]));
                    lpo_series_data32.push(parseInt(lpo_suspect_oot[item]));
                    lpo_series_data33.push(parseInt(lpo_suspect_follow_up[item]));
                    lpo_series_data34.push(parseInt(lpo_suspect_new[item]));
                    lpo_series_data20a.push(parseInt(lpo_suspect_qualified[item]));
                    lpo_series_data21a.push(parseInt(lpo_suspect_lpo_followup[item]));
                    lpo_series_data22a.push(parseInt(lpo_suspect_validated[item]));
                    lpo_series_data23a.push(parseInt(lpo_customer_free_trial[item]));
                    lpo_series_data24a.push(parseInt(lpo_suspect_no_answer[item]));
                    lpo_series_data25a.push(parseInt(lpo_suspect_in_contact[item]));
                    lpo_series_data26a.push(parseInt(lpo_prospect_qualified[item]));
                    lpo_series_data27a.push(parseInt(lpo_customer_free_trial_pending[item]));
                    lpo_categores1.push(item)
                });


                plotLPOChartPreview(lpo_series_data20,
                    lpo_series_data21,
                    lpo_series_data22,
                    lpo_series_data23,
                    lpo_series_data24,
                    lpo_series_data25,
                    lpo_series_data26,
                    lpo_series_data27,
                    lpo_series_data28,
                    lpo_series_data29, lpo_series_data31, lpo_series_data32, lpo_series_data33, lpo_series_data34, lpo_categores1, lpo_series_data20a, lpo_series_data21a, lpo_series_data22a, lpo_series_data23a, lpo_series_data24a, lpo_series_data25a, lpo_series_data26a, lpo_series_data27a)
            }


            if (role != 1000 && (isNullorEmpty(lead_source) || lead_source == -4)) {
                //TODO - Zee Preview

                // Franchisee Generated Leads by Status - Weekly Reporting
                var zeeLeadsByStatusWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_4_2'
                });


                if (!isNullorEmpty(leadStatus)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: leadStatus
                    }));
                }

                if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_from
                    }));

                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_to
                    }));
                }

                if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_signed_up_from
                    }));

                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_signed_up_to
                    }));
                }

                if (!isNullorEmpty(lead_source)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_source
                    }));
                }

                if (!isNullorEmpty(sales_rep)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_assigned',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: sales_rep
                    }));
                }

                if (!isNullorEmpty(lead_entered_by)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_lead_entered_by',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_entered_by
                    }));
                }

                if (!isNullorEmpty(sales_campaign)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.ANYOF,
                        values: sales_campaign
                    }));
                }

                if (!isNullorEmpty(parent_lpo)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.ANYOF,
                        values: parent_lpo
                    }));
                }

                if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_quote_sent_from
                    }));

                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_quote_sent_to
                    }));
                }

                if (!isNullorEmpty(zee_id)) {
                    zeeLeadsByStatusWeeklySearch.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zee_id
                    }));
                }

                if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                    var defaultSearchFilters = zeeLeadsByStatusWeeklySearch.filterExpression;

                    console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));


                    var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                    console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                    defaultSearchFilters.push('AND');
                    defaultSearchFilters.push(modifiedDateFilters);

                    console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


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

                var suspect_validated = 0;
                var customer_free_trial = 0;
                var customer_free_trial_pending = 0;

                var suspect_no_answer = 0;
                var suspect_in_contact = 0;


                zeeLeadsByStatusWeeklySearch.run().each(function (
                    zeeLeadsByStatusWeeklySearchResultSet) {


                    var prospectCount = parseInt(zeeLeadsByStatusWeeklySearchResultSet.getValue({
                        name: 'internalid',
                        summary: 'COUNT'
                    }));

                    var custStatus = parseInt(zeeLeadsByStatusWeeklySearchResultSet.getValue({
                        name: "entitystatus",
                        summary: "GROUP"
                    }));
                    var custStatusText = zeeLeadsByStatusWeeklySearchResultSet.getText({
                        name: "entitystatus",
                        summary: "GROUP"
                    });
                    var zeeName = zeeLeadsByStatusWeeklySearchResultSet.getText({
                        name: "partner",
                        summary: "GROUP"
                    });

                    if (isNullorEmpty(zeeName)) {
                        zeeName = 'Unassigned'
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
                        }

                        total_leads = customer_signed +
                            suspect_hot_lead +
                            suspect_lost +
                            suspect_customer_lost +
                            suspect_reassign +
                            prospecy_quote_sent +
                            prospect_no_answer +
                            prospect_in_contact +
                            suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                    } else if (oldZeeName != null &&
                        oldZeeName == zeeName) {

                        if (custStatus == 13 || custStatus == 66) {
                            //CUSTOMER _ SIGNED
                            customer_signed += prospectCount;
                        } else if (custStatus == 57) {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += prospectCount
                        } else if (custStatus == 59) {
                            //SUSPECT - LOST
                            suspect_lost += prospectCount
                        } else if (custStatus == 64) {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (custStatus == 22) {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += prospectCount
                        } else if (custStatus == 60 || custStatus == 40) {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += prospectCount
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
                        }

                        total_leads = customer_signed +
                            suspect_hot_lead +
                            suspect_lost +
                            suspect_customer_lost +
                            suspect_reassign +
                            prospecy_quote_sent +
                            prospect_no_answer +
                            prospect_in_contact +
                            suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                    } else if (oldDate1 != null &&
                        oldZeeName != zeeName) {

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
                            customer_free_trial_pending: customer_free_trial_pending
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

                        if (custStatus == 13 || custStatus == 66) {
                            //CUSTOMER _ SIGNED
                            customer_signed = prospectCount;
                        } else if (custStatus == 57) {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = prospectCount
                        } else if (custStatus == 59) {
                            //SUSPECT - LOST
                            suspect_lost = prospectCount
                        } else if (custStatus == 64) {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (custStatus == 22) {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = prospectCount
                        } else if (custStatus == 60 || custStatus == 40) {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = prospectCount
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
                        }

                        total_leads = customer_signed +
                            suspect_hot_lead +
                            suspect_lost +
                            suspect_customer_lost +
                            suspect_reassign +
                            prospecy_quote_sent +
                            prospect_no_answer +
                            prospect_in_contact +
                            suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified
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
                        customer_free_trial_pending: customer_free_trial_pending
                    });
                }

                console.log('zee_debt_set2: ' + JSON.stringify(zee_debt_set2));

                zee_previewDataSet = [];
                zee_csvPreviewSet = [];

                var zee_overDataSet = [];


                if (!isNullorEmpty(zee_debt_set2)) {
                    zee_debt_set2
                        .forEach(function (preview_row, index) {

                            var hotLeadPercentage = parseInt((preview_row.suspect_hot_lead / preview_row.total_leads) * 100);
                            var hotLeadCol = preview_row.suspect_hot_lead + ' (' + hotLeadPercentage + '%)';

                            var quoteSentPercentage = parseInt((preview_row.prospecy_quote_sent / preview_row.total_leads) * 100);
                            var quoteSentCol = preview_row.prospecy_quote_sent + ' (' + quoteSentPercentage + '%)';


                            var reassignPercentage = parseInt((preview_row.suspect_reassign / preview_row.total_leads) * 100);
                            var reassignCol = preview_row.suspect_reassign + ' (' + reassignPercentage + '%)';

                            var noAnswerPercentage = parseInt((preview_row.prospect_no_answer / preview_row.total_leads) * 100);
                            var noAnswerCol = preview_row.prospect_no_answer + ' (' + noAnswerPercentage + '%)';

                            var inContactPercentage = parseInt((preview_row.prospect_in_contact / preview_row.total_leads) * 100);
                            var inContactCol = preview_row.prospect_in_contact + ' (' + inContactPercentage + '%)';


                            var offPeakPercentage = parseInt((preview_row.suspect_off_peak_pipeline / preview_row.total_leads) * 100);
                            var offPeakCol = preview_row.suspect_off_peak_pipeline + ' (' + offPeakPercentage + '%)';

                            var lostPercentage = parseInt((preview_row.suspect_lost / preview_row.total_leads) * 100);
                            var lostCol = preview_row.suspect_lost + ' (' + lostPercentage + '%)';

                            var ootPercentage = parseInt((preview_row.suspect_oot / preview_row.total_leads) * 100);
                            var ootCol = preview_row.suspect_oot + ' (' + ootPercentage + '%)';

                            var custLostPercentage = parseInt((preview_row.suspect_customer_lost / preview_row.total_leads) * 100);
                            var custLostCol = preview_row.suspect_customer_lost + ' (' + custLostPercentage + '%)';

                            var oppPercentage = parseInt((preview_row.prospect_opportunity / preview_row.total_leads) * 100);
                            var oppCol = preview_row.prospect_opportunity + ' (' + oppPercentage + '%)';

                            var signedPercentage = parseInt((preview_row.customer_signed / preview_row.total_leads) * 100);
                            var signedCol = preview_row.customer_signed + ' (' + signedPercentage + '%)';

                            var suspectFollowUpPErcentage = parseInt((preview_row.suspect_follow_up / preview_row.total_leads) * 100);
                            var followUpCol = preview_row.suspect_follow_up + ' (' + suspectFollowUpPErcentage + '%)';

                            var suspectNewPercentage = parseInt((preview_row.suspect_new / preview_row.total_leads) * 100);
                            var suspectNewCol = preview_row.suspect_new + ' (' + suspectNewPercentage + '%)';

                            var suspectQualifiedPercentage = parseInt((preview_row.suspect_qualified / preview_row.total_leads) * 100);
                            var suspectQualifiedCol = preview_row.suspect_qualified + ' (' + suspectQualifiedPercentage + '%)';

                            var suspectUnqualifiedPercentage = parseInt((preview_row.suspect_unqualified / preview_row.total_leads) * 100);
                            var suspectUnqualifiedCol = preview_row.suspect_unqualified + ' (' + suspectUnqualifiedPercentage + '%)';

                            var suspectLPOFollowupPercentage = parseInt((preview_row.suspect_lpo_followup / preview_row.total_leads) * 100);
                            var suspectLPOFollowupwCol = preview_row.suspect_lpo_followup + ' (' + suspectLPOFollowupPercentage + '%)';

                            var suspectValidatedPercentage = parseInt((preview_row.suspect_validated / preview_row.total_leads) * 100);
                            var suspectValidatedCol = preview_row.suspect_validated + ' (' + suspectValidatedPercentage + '%)';

                            var customerFreeTrialPercentage = parseInt((preview_row.customer_free_trial / preview_row.total_leads) * 100);
                            var customerFreeTrialCol = preview_row.customer_free_trial + ' (' + customerFreeTrialPercentage + '%)';

                            var customerFreeTrialPendingPercentage = parseInt((preview_row.customer_free_trial_pending / preview_row.total_leads) * 100);
                            var customerFreeTrialPendingCol = preview_row.customer_free_trial_pending + ' (' + customerFreeTrialPendingPercentage + '%)';

                            var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                            var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                            var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                            var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';

                            var prospectQualifiedPercentage = parseInt((preview_row.prospect_qualified / preview_row.total_leads) * 100);
                            var prospectQualifiedCol = preview_row.prospect_qualified + ' (' + prospectQualifiedPercentage + '%)';


                            zee_overDataSet.push([preview_row.zeeName,
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
                            preview_row.prospecy_quote_sent,
                            preview_row.customer_free_trial_pending,
                            preview_row.customer_free_trial,
                            preview_row.customer_signed,
                            preview_row.total_leads
                            ]);


                            zee_previewDataSet.push([preview_row.zeeName,
                                suspectNewCol,
                                hotLeadCol,
                                suspectQualifiedCol,
                                suspectUnqualifiedCol,
                                suspectValidatedCol,
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
                                signedCol,
                            preview_row.total_leads
                            ]);

                        });
                }

                console.log('zee_previewDataSet');
                console.log(zee_previewDataSet);

                var dataTableZeePreview = $('#mpexusage-zee_overview').DataTable({
                    destroy: true,
                    data: zee_previewDataSet,
                    pageLength: 1000,
                    layout: {
                        topStart: {
                            buttons: [{
                                extend: 'copy', text: 'Copy',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'csv', text: 'CSV',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'excel', text: 'Excel',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'pdf', text: 'PDF',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }, {
                                extend: 'print', text: 'Print',
                                className: 'btn btn-default exportButtons',
                                exportOptions: {
                                    columns: ':not(.notexport)'
                                }
                            }],
                        }
                    },
                    columns: [{
                        title: 'Franchisee'//0
                    }, {
                        title: 'Suspect - New'//1
                    }, {
                        title: 'Suspect - Hot Lead'//2
                    }, {
                        title: 'Suspect - Qualified'//3
                    }, {
                        title: 'Suspect - Unualified'//4
                    }, {
                        title: 'Suspect - Validated'//5
                    }, {
                        title: 'Suspect - Reassign'//6
                    }, {
                        title: 'Suspect - Follow Up'//7
                    }, {
                        title: 'Suspect - LPO Follow Up'//8
                    }, {
                        title: 'Suspect - No Answer'//9
                    }, {
                        title: 'Suspect - In Contact'//10
                    }, {
                        title: 'Prospect - In Contact'//11
                    }, {
                        title: 'Suspect - Parking Lot'//12
                    }, {
                        title: 'Suspect - Lost'//13
                    }, {
                        title: 'Suspect - Out of Territory'//14
                    }, {
                        title: 'Suspect - Customer - Lost'//15
                    }, {
                        title: 'Prospect - Opportunity'//16
                    }, {
                        title: 'Prospect - Qualified'//17
                    }, {
                        title: 'Prospect - Quote Sent'//18
                    }, {
                        title: 'Customer - Free Trial Pending'//19
                    }, {
                        title: 'Customer - Free Trial'//20
                    }, {
                        title: 'Customer - Signed'//21
                    }, {
                        title: 'Total Lead Count'//22
                    }],
                    columnDefs: [{
                        targets: [0, 4, 18, 20, 21],
                        className: 'bolded'
                    }], footerCallback: function (row, data, start, end, display) {
                        var api = this.api(),
                            data;

                        // Remove the formatting to get integer data for summation
                        var intVal = function (i) {
                            return parseInt(i);
                        };

                        const formatter = new Intl.NumberFormat('en-AU', {
                            style: 'currency',
                            currency: 'AUD',
                            minimumFractionDigits: 2
                        })
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

                        // Total Lead Count
                        total_lead = api
                            .column(22)
                            .data()
                            .reduce(function (a, b) {
                                return intVal(a) + intVal(b);
                            }, 0);

                        // Update footer
                        $(api.column(1).footer()).html(
                            total_suspect_new + ' (' + ((total_suspect_new / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(2).footer()).html(
                            total_suspect_hot_lead + ' (' + ((total_suspect_hot_lead / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(3).footer()).html(
                            total_suspect_qualified + ' (' + ((total_suspect_qualified / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(4).footer()).html(
                            total_suspect_unqualified + ' (' + ((total_suspect_unqualified / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(5).footer()).html(
                            total_suspect_validated + ' (' + ((total_suspect_validated / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(6).footer()).html(
                            total_suspect_reassign + ' (' + ((total_suspect_reassign / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(7).footer()).html(
                            total_suspect_followup + ' (' + ((total_suspect_followup / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(8).footer()).html(
                            total_suspect_lpo_followup + ' (' + ((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(9).footer()).html(
                            total_suspect_no_answer + ' (' + ((total_suspect_no_answer / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(10).footer()).html(
                            total_suspect_in_contact + ' (' + ((total_suspect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(11).footer()).html(
                            total_prospect_in_contact + ' (' + ((total_prospect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(12).footer()).html(
                            total_suspect_off_peak_pipeline + ' (' + ((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(13).footer()).html(
                            total_suspect_lost + ' (' + ((total_suspect_lost / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(14).footer()).html(
                            total_suspect_oot + ' (' + ((total_suspect_oot / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(15).footer()).html(
                            total_suspect_customer_lost + ' (' + ((total_suspect_customer_lost / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(16).footer()).html(
                            total_prospect_opportunity + ' (' + ((total_prospect_opportunity / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(17).footer()).html(
                            total_prospect_qualified + ' (' + ((total_prospect_qualified / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(18).footer()).html(
                            total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(19).footer()).html(
                            total_customer_free_trial_pending + ' (' + ((total_customer_free_trial_pending / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(20).footer()).html(
                            total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                        );

                        $(api.column(21).footer()).html(
                            total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                        );
                        $(api.column(22).footer()).html(
                            total_lead
                        );

                    }

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
                var zee_suspect_no_answer = [];
                var zee_suspect_in_contact = [];
                var zee_total_leads = [];

                for (var i = 0; i < zee_data.length; i++) {
                    zee_month_year.push(zee_data[i][0]);
                    zee_suspect_new[zee_data[i][0]] = zee_data[i][1]
                    zee_suspect_hot_lead[zee_data[i][0]] = zee_data[i][2]
                    zee_suspect_qualified[zee_data[i][0]] = zee_data[i][3]
                    zee_suspect_unqualified[zee_data[i][0]] = zee_data[i][4]
                    zee_suspect_validated[zee_data[i][0]] = zee_data[i][5]
                    zee_suspect_reassign[zee_data[i][0]] = zee_data[i][6]
                    zee_suspect_follow_up[zee_data[i][0]] = zee_data[i][7]
                    zee_suspect_lpo_followup[zee_data[i][0]] = zee_data[i][8]
                    zee_suspect_no_answer[zee_data[i][0]] = zee_data[i][9]
                    zee_suspect_in_contact[zee_data[i][0]] = zee_data[i][10]
                    zee_prospect_in_contact[zee_data[i][0]] = zee_data[i][11]
                    zee_suspect_off_peak_pipeline[zee_data[i][0]] = zee_data[i][12]
                    zee_suspect_lost[zee_data[i][0]] = zee_data[i][13]
                    zee_suspect_oot[zee_data[i][0]] = zee_data[i][14]
                    zee_suspect_customer_lost[zee_data[i][0]] = zee_data[i][15]
                    zee_prospect_opportunity[zee_data[i][0]] = zee_data[i][16]
                    zee_prospect_qualified[zee_data[i][0]] = zee_data[i][17]
                    zee_prospecy_quote_sent[zee_data[i][0]] = zee_data[i][18]
                    zee_customer_free_trial_pending[zee_data[i][0]] = zee_data[i][19];
                    zee_customer_free_trial[zee_data[i][0]] = zee_data[i][20];
                    zee_customer_signed[zee_data[i][0]] = zee_data[i][21];
                    zee_total_leads[zee_data[i][0]] = zee_data[i][22]
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
                    zee_series_data27a.push(parseInt(zee_customer_free_trial_pending[item]));
                    zee_categores1.push(item)
                });


                plotZeeChartPreview(zee_series_data20,
                    zee_series_data21,
                    zee_series_data22,
                    zee_series_data23,
                    zee_series_data24,
                    zee_series_data25,
                    zee_series_data26,
                    zee_series_data27,
                    zee_series_data28,
                    zee_series_data29, zee_series_data31, zee_series_data32, zee_series_data33, zee_series_data34, zee_categores1, zee_series_data20a, zee_series_data21a, zee_series_data22a, zee_series_data23a, zee_series_data24a, zee_series_data25a, zee_series_data26a, zee_series_data27a, zee_series_data28a)
            }

            //TODO - Sales Rep Overview
            // Website New Leads by Status - Sales Rep Reporting
            var leadsListBySalesRepStatusSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_5'
            });


            if (!isNullorEmpty(leadStatus)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                leadsListBySalesRepStatusSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = leadsListBySalesRepStatusSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

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
            var prospect_no_answer = 0;
            var prospect_in_contact = 0;
            var suspect_follow_up = 0;
            var suspect_new = 0;

            var suspect_lpo_followup = 0;
            var suspect_qualified = 0;
            var suspect_unqualified = 0;

            var suspect_validated = 0;
            var customer_free_trial = 0;
            var customer_free_trial_pending = 0;

            var suspect_no_answer = 0;
            var suspect_in_contact = 0;


            leadsListBySalesRepStatusSearch.run().each(function (
                lleadsListBySalesRepStatusResultSet) {


                var prospectCount = parseInt(lleadsListBySalesRepStatusResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));

                var custStatus = parseInt(lleadsListBySalesRepStatusResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                }));
                var custStatusText = lleadsListBySalesRepStatusResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
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
                    salesRepAssigned = 'Unassigned'
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                } else if (oldSalesRepAssigned != null &&
                    oldSalesRepAssigned == salesRepAssigned) {

                    if (custStatus == 13 || custStatus == 66) {
                        //CUSTOMER _ SIGNED
                        customer_signed += prospectCount;
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead += prospectCount
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost += prospectCount
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot += parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost += prospectCount
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign += prospectCount
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                } else if (oldDate1 != null &&
                    oldSalesRepAssigned != salesRepAssigned) {

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
                        customer_free_trial_pending: customer_free_trial_pending
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

                    if (custStatus == 13 || custStatus == 66) {
                        //CUSTOMER _ SIGNED
                        customer_signed = prospectCount;
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead = prospectCount
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost = prospectCount
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot = parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost = prospectCount
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign = prospectCount
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified
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
                    customer_free_trial_pending: customer_free_trial_pending
                });
            }

            console.log('salesrep_debt_set2: ' + JSON.stringify(salesrep_debt_set2));

            salesrep_previewDataSet = [];
            salesrep_csvPreviewSet = [];

            var salesrep_overDataSet = [];


            if (!isNullorEmpty(salesrep_debt_set2)) {
                salesrep_debt_set2
                    .forEach(function (preview_row, index) {

                        var hotLeadPercentage = parseInt((parseInt(preview_row.suspect_hot_lead) / parseInt(preview_row.total_leads)) * 100);
                        var hotLeadCol = preview_row.suspect_hot_lead + ' (' + hotLeadPercentage + '%)';

                        var quoteSentPercentage = parseInt((preview_row.prospecy_quote_sent / preview_row.total_leads) * 100);
                        var quoteSentCol = preview_row.prospecy_quote_sent + ' (' + quoteSentPercentage + '%)';


                        var reassignPercentage = parseInt((preview_row.suspect_reassign / preview_row.total_leads) * 100);
                        var reassignCol = preview_row.suspect_reassign + ' (' + reassignPercentage + '%)';

                        var noAnswerPercentage = parseInt((preview_row.prospect_no_answer / preview_row.total_leads) * 100);
                        var noAnswerCol = preview_row.prospect_no_answer + ' (' + noAnswerPercentage + '%)';

                        var inContactPercentage = parseInt((preview_row.prospect_in_contact / preview_row.total_leads) * 100);
                        var inContactCol = preview_row.prospect_in_contact + ' (' + inContactPercentage + '%)';


                        var offPeakPercentage = parseInt((preview_row.suspect_off_peak_pipeline / preview_row.total_leads) * 100);
                        var offPeakCol = preview_row.suspect_off_peak_pipeline + ' (' + offPeakPercentage + '%)';

                        var lostPercentage = parseInt((preview_row.suspect_lost / preview_row.total_leads) * 100);
                        var lostCol = preview_row.suspect_lost + ' (' + lostPercentage + '%)';

                        var ootPercentage = parseInt((preview_row.suspect_oot / preview_row.total_leads) * 100);
                        var ootCol = preview_row.suspect_oot + ' (' + ootPercentage + '%)';

                        var custLostPercentage = parseInt((preview_row.suspect_customer_lost / preview_row.total_leads) * 100);
                        var custLostCol = preview_row.suspect_customer_lost + ' (' + custLostPercentage + '%)';

                        var oppPercentage = parseInt((preview_row.prospect_opportunity / preview_row.total_leads) * 100);
                        var oppCol = preview_row.prospect_opportunity + ' (' + oppPercentage + '%)';

                        var signedPercentage = parseInt((preview_row.customer_signed / preview_row.total_leads) * 100);
                        var signedCol = preview_row.customer_signed + ' (' + signedPercentage + '%)';

                        var suspectFollowUpPErcentage = parseInt((preview_row.suspect_follow_up / preview_row.total_leads) * 100);
                        var followUpCol = preview_row.suspect_follow_up + ' (' + suspectFollowUpPErcentage + '%)';

                        var suspectNewPercentage = parseInt((preview_row.suspect_new / preview_row.total_leads) * 100);
                        var suspectNewCol = preview_row.suspect_new + ' (' + suspectNewPercentage + '%)';

                        var suspectQualifiedPercentage = parseInt((preview_row.suspect_qualified / preview_row.total_leads) * 100);
                        var suspectQualifiedCol = preview_row.suspect_qualified + ' (' + suspectQualifiedPercentage + '%)';

                        var suspectUnqualifiedPercentage = parseInt((preview_row.suspect_unqualified / preview_row.total_leads) * 100);
                        var suspectUnqualifiedCol = preview_row.suspect_unqualified + ' (' + suspectUnqualifiedPercentage + '%)';

                        var suspectLPOFollowupPercentage = parseInt((preview_row.suspect_lpo_followup / preview_row.total_leads) * 100);
                        var suspectLPOFollowupwCol = preview_row.suspect_lpo_followup + ' (' + suspectLPOFollowupPercentage + '%)';

                        var suspectValidatedPercentage = parseInt((preview_row.suspect_validated / preview_row.total_leads) * 100);
                        var suspectValidatedCol = preview_row.suspect_validated + ' (' + suspectValidatedPercentage + '%)';

                        var customerFreeTrialPercentage = parseInt((preview_row.customer_free_trial / preview_row.total_leads) * 100);
                        var customerFreeTrialCol = preview_row.customer_free_trial + ' (' + customerFreeTrialPercentage + '%)';

                        var customerFreeTrialPendingPercentage = parseInt((preview_row.customer_free_trial_pending / preview_row.total_leads) * 100);
                        var customerFreeTrialPendingCol = preview_row.customer_free_trial_pending + ' (' + customerFreeTrialPendingPercentage + '%)';

                        var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                        var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                        var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                        var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';

                        var prospectQualifiedPercentage = parseInt((preview_row.prospect_qualified / preview_row.total_leads) * 100);
                        var prospectQualifiedCol = preview_row.prospect_qualified + ' (' + suspectInContactPercentage + '%)';


                        salesrep_overDataSet.push([preview_row.lpoparentname,
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
                        preview_row.prospecy_quote_sent,
                        preview_row.customer_free_trial_pending,
                        preview_row.customer_free_trial,
                        preview_row.customer_signed,
                        preview_row.total_leads,
                        preview_row.lpoparentnameid
                        ]);


                        salesrep_previewDataSet.push([preview_row.lpoparentname,
                            suspectNewCol,
                            hotLeadCol,
                            suspectQualifiedCol,
                            suspectUnqualifiedCol,
                            suspectValidatedCol,
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
                            signedCol,
                        preview_row.total_leads,
                        '<input type="button" value="' + preview_row.total_leads + '" class="form-control btn btn-primary show_salesrep_status_timeline" id="" data-id="' + preview_row.lpoparentnameid + '" data-name="' + preview_row.lpoparentname + '" style="background-color: #095C7B;border-radius: 30px">',
                        preview_row.lpoparentnameid,

                        ]);

                    });
            }

            console.log('salesrep_previewDataSet');
            console.log(salesrep_previewDataSet);

            var dataTableLPOPreview = $('#mpexusage-salesrep_overview').DataTable({
                destroy: true,
                data: salesrep_previewDataSet,
                pageLength: 1000,
                order: [[21, 'des']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [{
                    title: 'Lead Gen/Lead Quali/BDM/Account Manager'//0
                }, {
                    title: 'Suspect - New'//1
                }, {
                    title: 'Suspect - Hot Lead'//2
                }, {
                    title: 'Suspect - Qualified'//3
                }, {
                    title: 'Suspect - Unqualified'//4
                }, {
                    title: 'Suspect - Validated'//5
                }, {
                    title: 'Suspect - Reassign'//6
                }, {
                    title: 'Suspect - Follow Up'//7
                }, {
                    title: 'Suspect - LPO Follow Up'//8
                }, {
                    title: 'Suspect - No Answer'//9
                }, {
                    title: 'Suspect - In Contact'//10
                }, {
                    title: 'Prospect - In Contact'//11
                }, {
                    title: 'Suspect - Parking Lot'//12
                }, {
                    title: 'Suspect - Lost'//13
                }, {
                    title: 'Suspect - Out of Territory'//14
                }, {
                    title: 'Suspect - Customer - Lost'//15
                }, {
                    title: 'Prospect - Opportunity'//16
                }, {
                    title: 'Prospect - Qualified'//17
                }, {
                    title: 'Prospect - Quote Sent'//18
                }, {
                    title: 'Customer - Free Trial Pending'//19
                }, {
                    title: 'Customer - Free Trial'//20
                }, {
                    title: 'Customer - Signed'//21
                }, {
                    title: 'Total Lead Count'//22
                }, {
                    title: 'Show Leads'//23
                }, {
                    title: 'Sales Rep ID'//24
                }],
                columnDefs: [{
                    targets: [0, 5, 18, 20, 21, 22],
                    className: 'bolded'
                }, {
                    targets: [24],
                    visible: false
                },
                {
                    targets: [23, 24],
                    className: 'notexport'
                }
                ],
                footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return parseInt(i);
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })
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

                    // Total Lead Count
                    total_lead = api
                        .column(22)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(1).footer()).html(
                        total_suspect_new + ' (' + ((total_suspect_new / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(2).footer()).html(
                        total_suspect_hot_lead + ' (' + ((total_suspect_hot_lead / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(3).footer()).html(
                        total_suspect_qualified + ' (' + ((total_suspect_qualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(4).footer()).html(
                        total_suspect_unqualified + ' (' + ((total_suspect_unqualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(5).footer()).html(
                        total_suspect_validated + ' (' + ((total_suspect_validated / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(6).footer()).html(
                        total_suspect_reassign + ' (' + ((total_suspect_reassign / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(7).footer()).html(
                        total_suspect_followup + ' (' + ((total_suspect_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(8).footer()).html(
                        total_suspect_lpo_followup + ' (' + ((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(9).footer()).html(
                        total_suspect_no_answer + ' (' + ((total_suspect_no_answer / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(10).footer()).html(
                        total_suspect_in_contact + ' (' + ((total_suspect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(11).footer()).html(
                        total_prospect_in_contact + ' (' + ((total_prospect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(12).footer()).html(
                        total_suspect_off_peak_pipeline + ' (' + ((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(13).footer()).html(
                        total_suspect_lost + ' (' + ((total_suspect_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(14).footer()).html(
                        total_suspect_oot + ' (' + ((total_suspect_oot / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(15).footer()).html(
                        total_suspect_customer_lost + ' (' + ((total_suspect_customer_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(16).footer()).html(
                        total_prospect_opportunity + ' (' + ((total_prospect_opportunity / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(17).footer()).html(
                        total_prospect_qualified + ' (' + ((total_prospect_qualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(18).footer()).html(
                        total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(19).footer()).html(
                        total_customer_free_trial_pending + ' (' + ((total_customer_free_trial_pending / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(20).footer()).html(
                        total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(21).footer()).html(
                        total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(22).footer()).html(
                        total_lead
                    );

                }

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
            var salesrep_prospect_no_answer = [];
            var salesrep_prospect_in_contact = [];
            var salesrep_suspect_follow_up = [];
            var salesrep_suspect_new = [];
            var salesrep_suspect_qualified = [];
            var salesrep_suspect_unqualified = [];
            var salesrep_suspect_lpo_followup = [];
            var salesrep_suspect_validated = [];
            var salesrep_customer_free_trial_pending = [];
            var salesrep_customer_free_trial = [];
            var salesrep_suspect_no_answer = [];
            var salesrep_suspect_in_contact = [];
            var salesrep_total_leads = [];

            for (var i = 0; i < salesrep_data.length; i++) {
                salesrep_month_year.push(salesrep_data[i][0]);
                salesrep_suspect_new[salesrep_data[i][0]] = salesrep_data[i][1]
                salesrep_suspect_hot_lead[salesrep_data[i][0]] = salesrep_data[i][2]
                salesrep_suspect_qualified[salesrep_data[i][0]] = salesrep_data[i][3]
                salesrep_suspect_unqualified[salesrep_data[i][0]] = salesrep_data[i][4]
                salesrep_suspect_validated[salesrep_data[i][0]] = salesrep_data[i][5]
                salesrep_suspect_reassign[salesrep_data[i][0]] = salesrep_data[i][6]
                salesrep_suspect_follow_up[salesrep_data[i][0]] = salesrep_data[i][7]
                salesrep_suspect_lpo_followup[salesrep_data[i][0]] = salesrep_data[i][8]
                salesrep_suspect_no_answer[salesrep_data[i][0]] = salesrep_data[i][9]
                salesrep_suspect_in_contact[salesrep_data[i][0]] = salesrep_data[i][10]
                salesrep_prospect_in_contact[salesrep_data[i][0]] = salesrep_data[i][11]
                salesrep_suspect_off_peak_pipeline[salesrep_data[i][0]] = salesrep_data[i][12]
                salesrep_suspect_lost[salesrep_data[i][0]] = salesrep_data[i][13]
                salesrep_suspect_oot[salesrep_data[i][0]] = salesrep_data[i][14]
                salesrep_suspect_customer_lost[salesrep_data[i][0]] = salesrep_data[i][15]
                salesrep_prospect_opportunity[salesrep_data[i][0]] = salesrep_data[i][16]
                salesrep_prospect_qualified[salesrep_data[i][0]] = salesrep_data[i][17]
                salesrep_prospecy_quote_sent[salesrep_data[i][0]] = salesrep_data[i][18]
                salesrep_customer_free_trial_pending[salesrep_data[i][0]] = salesrep_data[i][19];
                salesrep_customer_free_trial[salesrep_data[i][0]] = salesrep_data[i][20];
                salesrep_customer_signed[salesrep_data[i][0]] = salesrep_data[i][21];
                salesrep_total_leads[salesrep_data[i][0]] = salesrep_data[i][22]
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

            var salesrep_categores1 = []; // creating empty array for highcharts
            // categories
            Object.keys(salesrep_total_leads).map(function (item, key) {
                salesrep_series_data20.push(parseInt(salesrep_customer_signed[item]));
                salesrep_series_data21.push(parseInt(salesrep_suspect_hot_lead[item]));
                salesrep_series_data22.push(parseInt(salesrep_suspect_reassign[item]));
                salesrep_series_data23.push(parseInt(salesrep_suspect_lost[item]));
                salesrep_series_data24.push(parseInt(salesrep_suspect_customer_lost[item]));
                salesrep_series_data25.push(parseInt(salesrep_suspect_off_peak_pipeline[item]));
                salesrep_series_data26.push(parseInt(salesrep_prospecy_quote_sent[item]));
                salesrep_series_data27.push(parseInt(salesrep_prospect_no_answer[item]));
                salesrep_series_data28.push(parseInt(salesrep_prospect_in_contact[item]));
                salesrep_series_data29.push(parseInt(salesrep_total_leads[item]));
                salesrep_series_data31.push(parseInt(salesrep_prospect_opportunity[item]));
                salesrep_series_data32.push(parseInt(salesrep_suspect_oot[item]));
                salesrep_series_data33.push(parseInt(salesrep_suspect_follow_up[item]));
                salesrep_series_data34.push(parseInt(salesrep_suspect_new[item]));
                salesrep_series_data20a.push(parseInt(salesrep_suspect_qualified[item]));
                salesrep_series_data28a.push(parseInt(salesrep_suspect_unqualified[item]));
                salesrep_series_data21a.push(parseInt(salesrep_suspect_lpo_followup[item]));
                salesrep_series_data22a.push(parseInt(salesrep_suspect_validated[item]));
                salesrep_series_data23a.push(parseInt(salesrep_customer_free_trial[item]));
                salesrep_series_data24a.push(parseInt(salesrep_suspect_no_answer[item]));
                salesrep_series_data25a.push(parseInt(salesrep_suspect_in_contact[item]));
                salesrep_series_data26a.push(parseInt(salesrep_prospect_qualified[item]));
                salesrep_series_data27a.push(parseInt(salesrep_customer_free_trial_pending[item]));
                salesrep_categores1.push(item)
            });


            plotSalesRepChartPreview(salesrep_series_data20,
                salesrep_series_data21,
                salesrep_series_data22,
                salesrep_series_data23,
                salesrep_series_data24,
                salesrep_series_data25,
                salesrep_series_data26,
                salesrep_series_data27,
                salesrep_series_data28,
                salesrep_series_data29, salesrep_series_data31, salesrep_series_data32, salesrep_series_data33, salesrep_series_data34, salesrep_categores1, salesrep_series_data20a, salesrep_series_data21a, salesrep_series_data22a, salesrep_series_data23a, salesrep_series_data24a, salesrep_series_data25a, salesrep_series_data26a, salesrep_series_data27a, salesrep_series_data28a)

            //? DATA CAPTURE OVERVIEW

            //Leads by Status - System Notes - Data Capture Reporting
            var leadsListByDataCaptureStatusSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_5__3'
            });


            if (!isNullorEmpty(leadStatus)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                leadsListByDataCaptureStatusSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = leadsListByDataCaptureStatusSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


                leadsListByDataCaptureStatusSearch.filterExpression = defaultSearchFilters;


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
            var prospect_no_answer = 0;
            var prospect_in_contact = 0;
            var suspect_follow_up = 0;
            var suspect_new = 0;

            var suspect_lpo_followup = 0;
            var suspect_qualified = 0;
            var suspect_unqualified = 0;

            var suspect_validated = 0;
            var customer_free_trial = 0;
            var customer_free_trial_pending = 0;

            var suspect_no_answer = 0;
            var suspect_in_contact = 0;


            leadsListByDataCaptureStatusSearch.run().each(function (
                leadsListByDataCaptureStatusSearchResultSet) {


                var prospectCount = parseInt(leadsListByDataCaptureStatusSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));

                var custStatus = parseInt(leadsListByDataCaptureStatusSearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                }));
                var custStatusText = leadsListByDataCaptureStatusSearchResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
                });
                var dataCaptureAssigned = leadsListByDataCaptureStatusSearchResultSet.getText({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                var dataCaptureAssignedId = leadsListByDataCaptureStatusSearchResultSet.getValue({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                if (isNullorEmpty(dataCaptureAssigned)) {
                    dataCaptureAssigned = 'Franchisees'
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                } else if (oldDataCaptureAssigned != null &&
                    oldDataCaptureAssigned == dataCaptureAssigned) {

                    if (custStatus == 13 || custStatus == 66) {
                        //CUSTOMER _ SIGNED
                        customer_signed += prospectCount;
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead += prospectCount
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost += prospectCount
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot += parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost += prospectCount
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign += prospectCount
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified

                } else if (oldDataCaptureAssigned != null &&
                    oldDataCaptureAssigned != dataCaptureAssigned) {

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
                        customer_free_trial_pending: customer_free_trial_pending
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

                    if (custStatus == 13 || custStatus == 66) {
                        //CUSTOMER _ SIGNED
                        customer_signed = prospectCount;
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead = prospectCount
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost = prospectCount
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot = parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost = prospectCount
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign = prospectCount
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact + prospect_qualified + customer_free_trial_pending + suspect_unqualified
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
                    customer_free_trial_pending: customer_free_trial_pending
                });
            }

            console.log('datacapture_debt_set2: ' + JSON.stringify(datacapture_debt_set2));

            datacapture_previewDataSet = [];
            datacapture_csvPreviewSet = [];

            var datacapture_overDataSet = [];


            if (!isNullorEmpty(datacapture_debt_set2)) {
                datacapture_debt_set2
                    .forEach(function (preview_row, index) {

                        var hotLeadPercentage = parseInt((parseInt(preview_row.suspect_hot_lead) / parseInt(preview_row.total_leads)) * 100);
                        var hotLeadCol = preview_row.suspect_hot_lead + ' (' + hotLeadPercentage + '%)';

                        var quoteSentPercentage = parseInt((preview_row.prospecy_quote_sent / preview_row.total_leads) * 100);
                        var quoteSentCol = preview_row.prospecy_quote_sent + ' (' + quoteSentPercentage + '%)';


                        var reassignPercentage = parseInt((preview_row.suspect_reassign / preview_row.total_leads) * 100);
                        var reassignCol = preview_row.suspect_reassign + ' (' + reassignPercentage + '%)';

                        var noAnswerPercentage = parseInt((preview_row.prospect_no_answer / preview_row.total_leads) * 100);
                        var noAnswerCol = preview_row.prospect_no_answer + ' (' + noAnswerPercentage + '%)';

                        var inContactPercentage = parseInt((preview_row.prospect_in_contact / preview_row.total_leads) * 100);
                        var inContactCol = preview_row.prospect_in_contact + ' (' + inContactPercentage + '%)';


                        var offPeakPercentage = parseInt((preview_row.suspect_off_peak_pipeline / preview_row.total_leads) * 100);
                        var offPeakCol = preview_row.suspect_off_peak_pipeline + ' (' + offPeakPercentage + '%)';

                        var lostPercentage = parseInt((preview_row.suspect_lost / preview_row.total_leads) * 100);
                        var lostCol = preview_row.suspect_lost + ' (' + lostPercentage + '%)';

                        var ootPercentage = parseInt((preview_row.suspect_oot / preview_row.total_leads) * 100);
                        var ootCol = preview_row.suspect_oot + ' (' + ootPercentage + '%)';

                        var custLostPercentage = parseInt((preview_row.suspect_customer_lost / preview_row.total_leads) * 100);
                        var custLostCol = preview_row.suspect_customer_lost + ' (' + custLostPercentage + '%)';

                        var oppPercentage = parseInt((preview_row.prospect_opportunity / preview_row.total_leads) * 100);
                        var oppCol = preview_row.prospect_opportunity + ' (' + oppPercentage + '%)';

                        var signedPercentage = parseInt((preview_row.customer_signed / preview_row.total_leads) * 100);
                        var signedCol = preview_row.customer_signed + ' (' + signedPercentage + '%)';

                        var suspectFollowUpPErcentage = parseInt((preview_row.suspect_follow_up / preview_row.total_leads) * 100);
                        var followUpCol = preview_row.suspect_follow_up + ' (' + suspectFollowUpPErcentage + '%)';

                        var suspectNewPercentage = parseInt((preview_row.suspect_new / preview_row.total_leads) * 100);
                        var suspectNewCol = preview_row.suspect_new + ' (' + suspectNewPercentage + '%)';

                        var suspectQualifiedPercentage = parseInt((preview_row.suspect_qualified / preview_row.total_leads) * 100);
                        var suspectQualifiedCol = preview_row.suspect_qualified + ' (' + suspectQualifiedPercentage + '%)';

                        var suspectUnqualifiedPercentage = parseInt((preview_row.suspect_unqualified / preview_row.total_leads) * 100);
                        var suspectUnqualifiedCol = preview_row.suspect_unqualified + ' (' + suspectUnqualifiedPercentage + '%)';

                        var suspectLPOFollowupPercentage = parseInt((preview_row.suspect_lpo_followup / preview_row.total_leads) * 100);
                        var suspectLPOFollowupwCol = preview_row.suspect_lpo_followup + ' (' + suspectLPOFollowupPercentage + '%)';

                        var suspectValidatedPercentage = parseInt((preview_row.suspect_validated / preview_row.total_leads) * 100);
                        var suspectValidatedCol = preview_row.suspect_validated + ' (' + suspectValidatedPercentage + '%)';

                        var customerFreeTrialPercentage = parseInt((preview_row.customer_free_trial / preview_row.total_leads) * 100);
                        var customerFreeTrialCol = preview_row.customer_free_trial + ' (' + customerFreeTrialPercentage + '%)';

                        var customerFreeTrialPendingPercentage = parseInt((preview_row.customer_free_trial_pending / preview_row.total_leads) * 100);
                        var customerFreeTrialPendingCol = preview_row.customer_free_trial_pending + ' (' + customerFreeTrialPendingPercentage + '%)';

                        var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                        var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                        var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                        var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';

                        var prospectQualifiedPercentage = parseInt((preview_row.prospect_qualified / preview_row.total_leads) * 100);
                        var prospectQualifiedCol = preview_row.prospect_qualified + ' (' + suspectInContactPercentage + '%)';


                        datacapture_overDataSet.push([preview_row.lpoparentname,
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
                        preview_row.prospecy_quote_sent,
                        preview_row.customer_free_trial_pending,
                        preview_row.customer_free_trial,
                        preview_row.customer_signed,
                        preview_row.total_leads,
                        preview_row.lpoparentnameid
                        ]);


                        datacapture_previewDataSet.push([preview_row.lpoparentname,
                            suspectNewCol,
                            hotLeadCol,
                            suspectQualifiedCol,
                            suspectUnqualifiedCol,
                            suspectValidatedCol,
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
                            signedCol,
                        preview_row.total_leads,
                        preview_row.lpoparentnameid,

                        ]);

                    });
            }

            console.log('datacapture_previewDataSet');
            console.log(datacapture_previewDataSet);

            var dataTableLPOPreview = $('#mpexusage-datacapture_overview').DataTable({
                destroy: true,
                data: datacapture_previewDataSet,
                pageLength: 1000,
                order: [[22, 'des']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [{
                    title: 'Lead Gen/Lead Quali/BDM/Account Manager'//0
                }, {
                    title: 'Suspect - New'//1
                }, {
                    title: 'Suspect - Hot Lead'//2
                }, {
                    title: 'Suspect - Qualified'//3
                }, {
                    title: 'Suspect - Unqualified'//4
                }, {
                    title: 'Suspect - Validated'//5
                }, {
                    title: 'Suspect - Reassign'//6
                }, {
                    title: 'Suspect - Follow Up'//7
                }, {
                    title: 'Suspect - LPO Follow Up'//8
                }, {
                    title: 'Suspect - No Answer'//9
                }, {
                    title: 'Suspect - In Contact'//10
                }, {
                    title: 'Prospect - In Contact'//11
                }, {
                    title: 'Suspect - Parking Lot'//12
                }, {
                    title: 'Suspect - Lost'//13
                }, {
                    title: 'Suspect - Out of Territory'//14
                }, {
                    title: 'Suspect - Customer - Lost'//15
                }, {
                    title: 'Prospect - Opportunity'//16
                }, {
                    title: 'Prospect - Qualified'//17
                }, {
                    title: 'Prospect - Quote Sent'//18
                }, {
                    title: 'Customer - Free Trial Pending'//19
                }, {
                    title: 'Customer - Free Trial'//20
                }, {
                    title: 'Customer - Signed'//21
                }, {
                    title: 'Total Lead Count'//22
                }, {
                    title: 'Sales Rep ID'//24
                }],
                columnDefs: [{
                    targets: [0, 5, 18, 20, 21, 22],
                    className: 'bolded'
                }, {
                    targets: [23],
                    visible: false
                },
                {
                    targets: [23],
                    className: 'notexport'
                }
                ],
                footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;

                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return parseInt(i);
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })
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

                    // Total Lead Count
                    total_lead = api
                        .column(22)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(1).footer()).html(
                        total_suspect_new + ' (' + ((total_suspect_new / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(2).footer()).html(
                        total_suspect_hot_lead + ' (' + ((total_suspect_hot_lead / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(3).footer()).html(
                        total_suspect_qualified + ' (' + ((total_suspect_qualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(4).footer()).html(
                        total_suspect_unqualified + ' (' + ((total_suspect_unqualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(5).footer()).html(
                        total_suspect_validated + ' (' + ((total_suspect_validated / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(6).footer()).html(
                        total_suspect_reassign + ' (' + ((total_suspect_reassign / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(7).footer()).html(
                        total_suspect_followup + ' (' + ((total_suspect_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(8).footer()).html(
                        total_suspect_lpo_followup + ' (' + ((total_suspect_lpo_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(9).footer()).html(
                        total_suspect_no_answer + ' (' + ((total_suspect_no_answer / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(10).footer()).html(
                        total_suspect_in_contact + ' (' + ((total_suspect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(11).footer()).html(
                        total_prospect_in_contact + ' (' + ((total_prospect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(12).footer()).html(
                        total_suspect_off_peak_pipeline + ' (' + ((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(13).footer()).html(
                        total_suspect_lost + ' (' + ((total_suspect_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(14).footer()).html(
                        total_suspect_oot + ' (' + ((total_suspect_oot / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(15).footer()).html(
                        total_suspect_customer_lost + ' (' + ((total_suspect_customer_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(16).footer()).html(
                        total_prospect_opportunity + ' (' + ((total_prospect_opportunity / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(17).footer()).html(
                        total_prospect_qualified + ' (' + ((total_prospect_qualified / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(18).footer()).html(
                        total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(19).footer()).html(
                        total_customer_free_trial_pending + ' (' + ((total_customer_free_trial_pending / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(20).footer()).html(
                        total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(21).footer()).html(
                        total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(22).footer()).html(
                        total_lead
                    );

                }

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
            var datacapture_prospect_no_answer = [];
            var datacapture_prospect_in_contact = [];
            var datacapture_suspect_follow_up = [];
            var datacapture_suspect_new = [];
            var datacapture_suspect_qualified = [];
            var datacapture_suspect_unqualified = [];
            var datacapture_suspect_lpo_followup = [];
            var datacapture_suspect_validated = [];
            var datacapture_customer_free_trial_pending = [];
            var datacapture_customer_free_trial = [];
            var datacapture_suspect_no_answer = [];
            var datacapture_suspect_in_contact = [];
            var datacapture_total_leads = [];

            for (var i = 0; i < datacapture_data.length; i++) {
                datacapture_month_year.push(datacapture_data[i][0]);
                datacapture_suspect_new[datacapture_data[i][0]] = datacapture_data[i][1]
                datacapture_suspect_hot_lead[datacapture_data[i][0]] = datacapture_data[i][2]
                datacapture_suspect_qualified[datacapture_data[i][0]] = datacapture_data[i][3]
                datacapture_suspect_unqualified[datacapture_data[i][0]] = datacapture_data[i][4]
                datacapture_suspect_validated[datacapture_data[i][0]] = datacapture_data[i][5]
                datacapture_suspect_reassign[datacapture_data[i][0]] = datacapture_data[i][6]
                datacapture_suspect_follow_up[datacapture_data[i][0]] = datacapture_data[i][7]
                datacapture_suspect_lpo_followup[datacapture_data[i][0]] = datacapture_data[i][8]
                datacapture_suspect_no_answer[datacapture_data[i][0]] = datacapture_data[i][9]
                datacapture_suspect_in_contact[datacapture_data[i][0]] = datacapture_data[i][10]
                datacapture_prospect_in_contact[datacapture_data[i][0]] = datacapture_data[i][11]
                datacapture_suspect_off_peak_pipeline[datacapture_data[i][0]] = datacapture_data[i][12]
                datacapture_suspect_lost[datacapture_data[i][0]] = datacapture_data[i][13]
                datacapture_suspect_oot[datacapture_data[i][0]] = datacapture_data[i][14]
                datacapture_suspect_customer_lost[datacapture_data[i][0]] = datacapture_data[i][15]
                datacapture_prospect_opportunity[datacapture_data[i][0]] = datacapture_data[i][16]
                datacapture_prospect_qualified[datacapture_data[i][0]] = datacapture_data[i][17]
                datacapture_prospecy_quote_sent[datacapture_data[i][0]] = datacapture_data[i][18]
                datacapture_customer_free_trial_pending[datacapture_data[i][0]] = datacapture_data[i][19];
                datacapture_customer_free_trial[datacapture_data[i][0]] = datacapture_data[i][20];
                datacapture_customer_signed[datacapture_data[i][0]] = datacapture_data[i][21];
                datacapture_total_leads[datacapture_data[i][0]] = datacapture_data[i][22]
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

            var datacapture_categores1 = []; // creating empty array for highcharts
            // categories
            Object.keys(datacapture_total_leads).map(function (item, key) {
                datacapture_series_data20.push(parseInt(datacapture_customer_signed[item]));
                datacapture_series_data21.push(parseInt(datacapture_suspect_hot_lead[item]));
                datacapture_series_data22.push(parseInt(datacapture_suspect_reassign[item]));
                datacapture_series_data23.push(parseInt(datacapture_suspect_lost[item]));
                datacapture_series_data24.push(parseInt(datacapture_suspect_customer_lost[item]));
                datacapture_series_data25.push(parseInt(datacapture_suspect_off_peak_pipeline[item]));
                datacapture_series_data26.push(parseInt(datacapture_prospecy_quote_sent[item]));
                datacapture_series_data27.push(parseInt(datacapture_prospect_no_answer[item]));
                datacapture_series_data28.push(parseInt(datacapture_prospect_in_contact[item]));
                datacapture_series_data29.push(parseInt(datacapture_total_leads[item]));
                datacapture_series_data31.push(parseInt(datacapture_prospect_opportunity[item]));
                datacapture_series_data32.push(parseInt(datacapture_suspect_oot[item]));
                datacapture_series_data33.push(parseInt(datacapture_suspect_follow_up[item]));
                datacapture_series_data34.push(parseInt(datacapture_suspect_new[item]));
                datacapture_series_data20a.push(parseInt(datacapture_suspect_qualified[item]));
                datacapture_series_data28a.push(parseInt(datacapture_suspect_unqualified[item]));
                datacapture_series_data21a.push(parseInt(datacapture_suspect_lpo_followup[item]));
                datacapture_series_data22a.push(parseInt(datacapture_suspect_validated[item]));
                datacapture_series_data23a.push(parseInt(datacapture_customer_free_trial[item]));
                datacapture_series_data24a.push(parseInt(datacapture_suspect_no_answer[item]));
                datacapture_series_data25a.push(parseInt(datacapture_suspect_in_contact[item]));
                datacapture_series_data26a.push(parseInt(datacapture_prospect_qualified[item]));
                datacapture_series_data27a.push(parseInt(datacapture_customer_free_trial_pending[item]));
                datacapture_categores1.push(item)
            });

            console.log('datacapture_categores1: ' + JSON.stringify(datacapture_categores1));


            plotDataCaptureChartPreview(datacapture_series_data20,
                datacapture_series_data21,
                datacapture_series_data22,
                datacapture_series_data23,
                datacapture_series_data24,
                datacapture_series_data25,
                datacapture_series_data26,
                datacapture_series_data27,
                datacapture_series_data28,
                datacapture_series_data29, datacapture_series_data31, datacapture_series_data32, datacapture_series_data33, datacapture_series_data34, datacapture_categores1, datacapture_series_data20a, datacapture_series_data21a, datacapture_series_data22a, datacapture_series_data23a, datacapture_series_data24a, datacapture_series_data25a, datacapture_series_data26a, datacapture_series_data27a, datacapture_series_data28a)

            //? Data Capture Grouped by Source & Campaign
            //Leads by Source & Campaign - System Notes - Data Capture Reporting
            var leadsListByDataCaptureSourceCampaignSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_5__4'
            });


            if (!isNullorEmpty(leadStatus)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                leadsListByDataCaptureSourceCampaignSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = leadsListByDataCaptureSourceCampaignSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


                leadsListByDataCaptureSourceCampaignSearch.filterExpression = defaultSearchFilters;


            }

            var count1 = 0;
            var total_leads = 0;
            var total_leads_per_source = 0
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


            leadsListByDataCaptureSourceCampaignSearch.run().each(function (
                leadsListByDataCaptureSourceCampaignSearchResultSet) {


                var prospectCount = parseInt(leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));

                var custLeadSource = parseInt(leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
                    name: "leadsource",
                    summary: "GROUP",
                }));
                var custLeadSourceText = leadsListByDataCaptureSourceCampaignSearchResultSet.getText({
                    name: "leadsource",
                    summary: "GROUP",
                });

                var custCampaign = parseInt(leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
                    name: "custrecord_sales_campaign",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                }));
                var custCampaignText = leadsListByDataCaptureSourceCampaignSearchResultSet.getText({
                    name: "custrecord_sales_campaign",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });


                var dataCaptureAssigned = leadsListByDataCaptureSourceCampaignSearchResultSet.getText({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                var dataCaptureAssignedId = leadsListByDataCaptureSourceCampaignSearchResultSet.getValue({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                if (isNullorEmpty(dataCaptureAssigned)) {
                    dataCaptureAssigned = 'Franchisees'
                }

                console.log('dataCaptureAssigned: ' + dataCaptureAssigned);
                console.log('custLeadSourceText: ' + custLeadSourceText);
                console.log('custCampaignText: ' + custCampaignText);
                console.log('prospectCount: ' + prospectCount);

                console.log('oldDataCaptureAssigned: ' + oldDataCaptureAssigned);
                console.log('custLeadSource: ' + custLeadSource);
                console.log('oldDataCaptureSourceId: ' + oldDataCaptureSourceId);


                if (count1 == 0) {
                    total_leads += prospectCount
                    total_leads_assigned += prospectCount
                    total_leads_per_source += prospectCount

                    dataCaptureTeam.push({
                        'id': dataCaptureAssignedId,
                        'name': dataCaptureAssigned,
                        'count': total_leads_assigned,
                        "details": []
                    });

                    dataCaptureTeam[dataCaptureTeam.length - 1].details.push({
                        'source': [{
                            'id': custLeadSource,
                            'name': custLeadSourceText,
                            'count': prospectCount,
                            'campaign': [{
                                'id': custCampaign,
                                'name': custCampaignText,
                                'count': prospectCount
                            }]
                        }]
                    })


                } else if (oldDataCaptureAssigned != null &&
                    oldDataCaptureAssigned == dataCaptureAssigned) {
                    total_leads_assigned += prospectCount

                    dataCaptureTeam[dataCaptureTeam.length - 1].count = total_leads_assigned;
                    var sourceLength = dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source.length;

                    if (custLeadSource == oldDataCaptureSourceId) {
                        total_leads_per_source += prospectCount
                        console.log('total_leads: ' + total_leads);
                        dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source[sourceLength - 1].count = total_leads_per_source;
                        dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source[sourceLength - 1].campaign.push({
                            'id': custCampaign,
                            'name': custCampaignText,
                            'count': prospectCount
                        })
                    } else if (custLeadSource != oldDataCaptureSourceId) {

                        total_leads_per_source = 0;
                        total_leads_per_source += prospectCount

                        dataCaptureTeam[dataCaptureTeam.length - 1].details[0].source.push({
                            'id': custLeadSource,
                            'name': custLeadSourceText,
                            'count': total_leads_per_source,
                            'campaign': [{
                                'id': custCampaign,
                                'name': custCampaignText,
                                'count': prospectCount
                            }]
                        })
                    }

                } else if (oldDataCaptureAssigned != null &&
                    oldDataCaptureAssigned != dataCaptureAssigned) {


                    total_leads = 0;
                    total_leads_assigned = 0;
                    total_leads_per_source = 0;

                    total_leads += prospectCount;
                    total_leads_assigned += prospectCount;
                    total_leads_per_source += prospectCount;

                    console.log('dataCaptureTeam: ' + JSON.stringify(dataCaptureTeam));

                    dataCaptureTeam.push({
                        'id': dataCaptureAssignedId,
                        'name': dataCaptureAssigned,
                        'count': total_leads_assigned,
                        "details": []
                    });

                    dataCaptureTeam[dataCaptureTeam.length - 1].details.push({
                        'source': [{
                            'id': custLeadSource,
                            'name': custLeadSourceText,
                            'count': total_leads_per_source,
                            'campaign': [{
                                'id': custCampaign,
                                'name': custCampaignText,
                                'count': prospectCount
                            }]
                        }]
                    })

                }
                console.log('total_leads: ' + total_leads);
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


            console.log('dataCaptureTeam: ' + JSON.stringify(dataCaptureTeam));


            var series_data_source = [];
            var series_data_campaign = [];
            var series_lpo_data_source = [];
            var series_lpo_data_campaign = [];
            var dataCaptureTeamMemberCategories = [];
            var dataCaptureTeamMemberLPOCategories = [];
            var sourceLeadCount = [];
            var sourceName = [];
            var dataSource = new Array(dataCaptureTeam.length).fill(0);
            var dataLPOSource = new Array(dataCaptureTeam.length).fill(0);
            var dataLPOCampaign = new Array(dataCaptureTeam.length).fill(0);
            var resetDataSource = new Array(dataCaptureTeam.length).fill(0);
            for (var x = 0; x < dataCaptureTeam.length; x++) {
                dataCaptureTeamMemberCategories[x] = dataCaptureTeam[x].name;
                sourceLeadCount[x] = [];
                sourceName[x] = [];
                console.log('name: ' + dataCaptureTeam[x].name);
                console.log('details: ' + JSON.stringify(dataCaptureTeam[x].details[0].source));
                for (y = 0; y < dataCaptureTeam[x].details[0].source.length; y++) {
                    sourceLeadCount[x][y] = dataCaptureTeam[x].details[0].source[y].count;
                    sourceName[x][y] = dataCaptureTeam[x].details[0].source[y].name;

                    console.log('Source Name: ' + dataCaptureTeam[x].details[0].source[y].name);
                    console.log('Source Count: ' + dataCaptureTeam[x].details[0].source[y].count);

                    console.log('before series_data_source: ' + JSON.stringify(series_data_source));
                    var source_exists = false;
                    for (var j = 0; j < series_data_source.length; j++) {
                        if (series_data_source[j].name == sourceName[x][y]) {
                            source_exists = true;
                            series_data_source[j].data[x] = dataCaptureTeam[x].details[0].source[y].count
                        }
                    }
                    if (source_exists == false) {
                        dataSource = new Array(dataCaptureTeam.length).fill(0);
                        dataSource[x] = dataCaptureTeam[x].details[0].source[y].count;

                        var colorCodeSource;
                        if (source_list.includes((dataCaptureTeam[x].details[0].source[y].id).toString()) == true) {
                            colorCodeSource = source_list_color[source_list.indexOf((dataCaptureTeam[x].details[0].source[y].id).toString())];
                        }

                        series_data_source.push({
                            name: sourceName[x][y],
                            data: dataSource,
                            color: colorCodeSource,
                            style: {
                                fontWeight: 'bold',
                            }
                        });
                    }


                    console.log('after series_data_source: ' + JSON.stringify(series_data_source));

                    for (z = 0; z < dataCaptureTeam[x].details[0].source[y].campaign.length; z++) {

                        console.log('Campaign Name: ' + dataCaptureTeam[x].details[0].source[y].campaign[z].name);
                        console.log('Campaign Count: ' + dataCaptureTeam[x].details[0].source[y].campaign[z].count);

                        console.log('before series_data_campaign: ' + JSON.stringify(series_data_campaign));

                        var campaign_exists = false;
                        var lpo_campaign_exists = false;
                        var lpo_source_exists = false;
                        for (var j = 0; j < series_data_campaign.length; j++) {

                            if (series_data_campaign[j].name == dataCaptureTeam[x].details[0].source[y].campaign[z].name) {
                                campaign_exists = true;
                                series_data_campaign[j].data[x] += dataCaptureTeam[x].details[0].source[y].campaign[z].count
                            }
                        }
                        if (campaign_exists == false) {
                            dataSource = new Array(dataCaptureTeam.length).fill(0);
                            dataSource[x] = dataCaptureTeam[x].details[0].source[y].campaign[z].count;


                            var colorCodeCampaign;
                            if (campaign_list.includes((dataCaptureTeam[x].details[0].source[y].campaign[z].id).toString()) == true) {
                                colorCodeCampaign = campaign_list_color[campaign_list.indexOf((dataCaptureTeam[x].details[0].source[y].campaign[z].id).toString())];
                            }


                            series_data_campaign.push({
                                name: dataCaptureTeam[x].details[0].source[y].campaign[z].name,
                                data: dataSource,
                                color: colorCodeCampaign,
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }

                        if (dataCaptureTeam[x].details[0].source[y].campaign[z].name == 'LPO - BAU' || dataCaptureTeam[x].details[0].source[y].campaign[z].name == 'LPO') {
                            dataCaptureTeamMemberLPOCategories[x] = dataCaptureTeam[x].name;

                            for (var j = 0; j < series_lpo_data_source.length; j++) {

                                if (series_lpo_data_source[j].name == dataCaptureTeam[x].details[0].source[y].name) {
                                    lpo_source_exists = true;
                                    series_lpo_data_source[j].data[x] += dataCaptureTeam[x].details[0].source[y].count
                                }
                            }

                            if (lpo_source_exists == false) {
                                dataLPOSource = new Array(dataCaptureTeam.length).fill(0);
                                dataLPOSource[x] = dataCaptureTeam[x].details[0].source[y].count;

                                var colorCodeSource;
                                if (source_list.includes((dataCaptureTeam[x].details[0].source[y].id).toString()) == true) {
                                    colorCodeSource = source_list_color[source_list.indexOf((dataCaptureTeam[x].details[0].source[y].id).toString())];
                                }

                                series_lpo_data_source.push({
                                    name: dataCaptureTeam[x].details[0].source[y].name,
                                    data: dataLPOSource,
                                    color: colorCodeSource,
                                    style: {
                                        fontWeight: 'bold',
                                    }
                                });
                            }

                            for (var j = 0; j < series_lpo_data_campaign.length; j++) {

                                if (series_lpo_data_campaign[j].name == dataCaptureTeam[x].details[0].source[y].campaign[z].name) {
                                    lpo_campaign_exists = true;
                                    series_lpo_data_campaign[j].data[x] += dataCaptureTeam[x].details[0].source[y].campaign[z].count
                                }
                            }

                            if (lpo_campaign_exists == false) {
                                dataLPOCampaign = new Array(dataCaptureTeam.length).fill(0);
                                dataLPOCampaign[x] = dataCaptureTeam[x].details[0].source[y].campaign[z].count;

                                var colorCodeLPOCampaign;
                                if (campaign_list.indexOf((dataCaptureTeam[x].details[0].source[y].campaign[z].id).toString()) != -1) {
                                    colorCodeLPOCampaign = campaign_list_color[campaign_list.indexOf((dataCaptureTeam[x].details[0].source[y].campaign[z].id).toString())];
                                }

                                series_lpo_data_campaign.push({
                                    name: dataCaptureTeam[x].details[0].source[y].campaign[z].name,
                                    data: dataLPOCampaign,
                                    color: colorCodeLPOCampaign,
                                    style: {
                                        fontWeight: 'bold',
                                    }
                                });
                            }
                        }


                    }
                    console.log('after series_data_campaign: ' + JSON.stringify(series_data_campaign));
                    console.log('after series_lpo_data_source: ' + JSON.stringify(series_lpo_data_source));
                    console.log('after series_lpo_data_campaign: ' + JSON.stringify(series_lpo_data_campaign));

                }

            }

            console.log('dataCaptureTeamMemberCategories')
            console.log(dataCaptureTeamMemberCategories)

            console.log('series_data_source')
            console.log(series_data_source)

            console.log('series_data_campaign')
            console.log(series_data_campaign)

            console.log('dataCaptureTeamMemberLPOCategories')
            console.log(dataCaptureTeamMemberLPOCategories);

            console.log('series_lpo_data_campaign')
            console.log(series_lpo_data_campaign)

            console.log('series_lpo_data_source')
            console.log(series_lpo_data_source)


            var removedArrayPositions = []
            var existingArrayPositions = []
            var series_new_lpo_data_campaign = []
            var series_new_lpo_data_source = []

            for (var i = 0; i < dataCaptureTeamMemberLPOCategories.length; i++) {
                if (dataCaptureTeamMemberLPOCategories[i] != null) {
                    existingArrayPositions.push(i);
                } else {
                    removedArrayPositions.push(i);
                }

            }

            console.log('dataCaptureTeamMemberLPOCategories')
            console.log(dataCaptureTeamMemberLPOCategories);

            console.log('removedArrayPositions')
            console.log(removedArrayPositions);

            var dataCaptureTeamMemberLPOCategoriesUpdated = [];

            for (var t = 0; t < dataCaptureTeamMemberLPOCategories.length; t++) {
                if (removedArrayPositions.includes(t)) {

                } else {
                    dataCaptureTeamMemberLPOCategoriesUpdated.push(dataCaptureTeamMemberLPOCategories[t])
                }
            }

            console.log('dataCaptureTeamMemberLPOCategoriesUpdated')
            console.log(dataCaptureTeamMemberLPOCategoriesUpdated);

            var new_lpo_campaign_count = []

            for (var i = 0; i < series_lpo_data_campaign.length; i++) {
                for (var r = 0; r < series_lpo_data_campaign[i].data.length; r++) {
                    if (removedArrayPositions.indexOf(r) != -1) {

                    } else {
                        new_lpo_campaign_count[new_lpo_campaign_count.length] = series_lpo_data_campaign[i].data[r];
                    }
                }
                series_new_lpo_data_campaign.push({
                    name: series_lpo_data_campaign[i].name,
                    data: new_lpo_campaign_count,
                    color: series_lpo_data_campaign[i].color,
                    style: {
                        fontWeight: 'bold',
                    }
                })
                // series_new_lpo_data_campaign[i].data = new_lpo_campaign_count;
            }

            console.log('series_new_lpo_data_campaign')
            console.log(series_new_lpo_data_campaign)

            var new_lpo_source_count = []

            for (var a = 0; a < series_lpo_data_source.length; a++) {
                new_lpo_source_count = []
                for (var b = 0; b < series_lpo_data_source[a].data.length; b++) {
                    console.log('b: ' + b)
                    console.log('removedArrayPositions.indexOf(b): ' + removedArrayPositions.indexOf(b))
                    if (removedArrayPositions.indexOf(b) != -1) {

                    } else {
                        new_lpo_source_count[new_lpo_source_count.length] = series_lpo_data_source[a].data[b];
                    }
                }
                series_new_lpo_data_source.push({
                    name: series_lpo_data_source[a].name,
                    data: new_lpo_source_count,
                    color: series_lpo_data_source[a].color,
                    style: {
                        fontWeight: 'bold',
                    }
                })
                // series_new_lpo_data_source[i].data = new_lpo_source_count;
            }

            console.log('series_new_lpo_data_source')
            console.log(series_new_lpo_data_source)

            plotChart(series_data_source, null, dataCaptureTeamMemberCategories)
            plotChartDataCaptureOverview(series_data_source, null, dataCaptureTeamMemberCategories)

            plotChartCampaign(series_data_campaign, null, dataCaptureTeamMemberCategories)
            plotChartDataCaptureOverviewCampaign(series_data_campaign, null, dataCaptureTeamMemberCategories)

            plotChartLPOCampaign(series_new_lpo_data_campaign, null, dataCaptureTeamMemberLPOCategoriesUpdated)
            plotChartLPOSource(series_new_lpo_data_source, null, dataCaptureTeamMemberLPOCategoriesUpdated)


            //?BY SALES REP ASSIGNED - LEAD ENTERED BY & CAMPAIGN
            //Leads by Lead Entered - System Notes - Sales Rep Reporting
            var leadsListBySalesRepDataCaptureCampaignSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_5__5'
            });


            if (!isNullorEmpty(leadStatus)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = leadsListBySalesRepDataCaptureCampaignSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


                leadsListBySalesRepDataCaptureCampaignSearch.filterExpression = defaultSearchFilters;


            }

            var count1 = 0;
            var total_leads = 0;
            var total_leads_assigned = 0;
            var total_leads_entered = 0;
            var oldStatusChangeSetBy = null;
            var oldStatusChangeSetById = null;

            var oldSalesRepAssigned = null;
            var oldSalesRepAssignedId = null;

            var oldDataCaptureCampaign = null;
            var oldDataCaptureCampaignId = null;


            var dataCaptureBySource = {};
            var datatCaptureBySourceId = {};

            var salesRepAssignedTeam = [];


            leadsListBySalesRepDataCaptureCampaignSearch.run().each(function (
                leadsListBySalesRepDataCaptureCampaignSearchResultSet) {


                var prospectCount = parseInt(leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));

                var custSalesRepAssigned = parseInt(leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                }));
                var custSalesRepAssignedText = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });

                var custCampaign = parseInt(leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                    name: "custrecord_sales_campaign",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                }));
                var custCampaignText = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
                    name: "custrecord_sales_campaign",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });


                var statusChangeSetBy = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                var statusChangeSetById = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                if (isNullorEmpty(statusChangeSetBy)) {
                    statusChangeSetBy = 'Franchisees'
                }
                if (isNullorEmpty(statusChangeSetById)) {
                    statusChangeSetById = -4
                }

                if (count1 == 0) {
                    total_leads += prospectCount
                    total_leads_assigned += prospectCount
                    total_leads_entered += prospectCount

                    salesRepAssignedTeam.push({
                        'id': custSalesRepAssigned,
                        'name': custSalesRepAssignedText,
                        'count': total_leads_assigned,
                        "details": []
                    });

                    salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details.push({
                        'enteredBy': [{
                            'id': statusChangeSetById,
                            'name': statusChangeSetBy,
                            'count': total_leads_entered,
                            'campaign': [{
                                'id': custCampaign,
                                'name': custCampaignText,
                                'count': prospectCount
                            }]
                        }]
                    })


                } else if (oldSalesRepAssignedId != null &&
                    oldSalesRepAssignedId == custSalesRepAssigned) {
                    total_leads_assigned += prospectCount


                    salesRepAssignedTeam[salesRepAssignedTeam.length - 1].count = total_leads_assigned;
                    var enteredByLength = salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details[0].enteredBy.length;

                    if (statusChangeSetById == statusChangeSetById) {
                        total_leads += prospectCount;
                        total_leads_entered += prospectCount;
                        salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details[0].enteredBy[enteredByLength - 1].count = total_leads_entered;
                        salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details[0].enteredBy[enteredByLength - 1].campaign.push({
                            'id': custCampaign,
                            'name': custCampaignText,
                            'count': prospectCount
                        })
                    } else if (statusChangeSetById != statusChangeSetById) {

                        total_leads_entered = 0;
                        // total_leads += prospectCount;
                        salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details[0].enteredBy.push({
                            'id': statusChangeSetById,
                            'name': statusChangeSetBy,
                            'count': total_leads_entered,
                            'campaign': [{
                                'id': custCampaign,
                                'name': custCampaignText,
                                'count': prospectCount
                            }]
                        })
                    }

                } else if (oldSalesRepAssignedId != null &&
                    oldSalesRepAssignedId != custSalesRepAssigned) {
                    console.log('salesRepAssignedTeam(' + oldSalesRepAssigned + '): ' + JSON.stringify(salesRepAssignedTeam));

                    total_leads = 0;
                    total_leads_assigned = 0;
                    total_leads_entered = 0;

                    total_leads += prospectCount;
                    total_leads_assigned += prospectCount
                    total_leads_entered += prospectCount

                    salesRepAssignedTeam.push({
                        'id': custSalesRepAssigned,
                        'name': custSalesRepAssignedText,
                        'count': total_leads_assigned,
                        "details": []
                    });

                    salesRepAssignedTeam[salesRepAssignedTeam.length - 1].details.push({
                        'enteredBy': [{
                            'id': statusChangeSetById,
                            'name': statusChangeSetBy,
                            'count': total_leads_entered,
                            'campaign': [{
                                'id': custCampaign,
                                'name': custCampaignText,
                                'count': prospectCount
                            }]
                        }]
                    })

                }

                count1++;
                oldStatusChangeSetBy = statusChangeSetBy;
                oldStatusChangeSetById = statusChangeSetById;
                oldSalesRepAssigned = custSalesRepAssignedText;
                oldSalesRepAssignedId = custSalesRepAssigned;
                oldDataCaptureCampaignId = custCampaign;
                oldDataCaptureCampaign = custCampaignText;
                return true;
            });


            console.log('salesRepAssignedTeam: ' + JSON.stringify(salesRepAssignedTeam));


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
                console.log('name: ' + salesRepAssignedTeam[x].name);
                console.log('details: ' + JSON.stringify(salesRepAssignedTeam[x].details[0].enteredBy));
                for (y = 0; y < salesRepAssignedTeam[x].details[0].enteredBy.length; y++) {
                    enteredLeadCount[x][y] = salesRepAssignedTeam[x].details[0].enteredBy[y].count;
                    enteredName[x][y] = salesRepAssignedTeam[x].details[0].enteredBy[y].name;

                    console.log('enteredBy Name: ' + salesRepAssignedTeam[x].details[0].enteredBy[y].name);
                    console.log('enteredBy Count: ' + salesRepAssignedTeam[x].details[0].enteredBy[y].count);

                    console.log('before series_data_entered: ' + JSON.stringify(series_data_entered));
                    var entered_by_exists = false;
                    for (var j = 0; j < series_data_entered.length; j++) {
                        if (series_data_entered[j].name == enteredName[x][y]) {
                            entered_by_exists = true;
                            series_data_entered[j].data[x] = salesRepAssignedTeam[x].details[0].enteredBy[y].count
                        }
                    }
                    if (entered_by_exists == false) {
                        dataEntered = new Array(salesRepAssignedTeam.length).fill(0);
                        dataEntered[x] = salesRepAssignedTeam[x].details[0].enteredBy[y].count;

                        var colorCode = '#ffffff'
                        if (employee_list.indexOf(salesRepAssignedTeam[x].details[0].enteredBy[y].id) != -1) {
                            colorCode = employee_list_color[employee_list.indexOf(salesRepAssignedTeam[x].details[0].enteredBy[y].id)];
                        }

                        if (enteredName[x][y] == 'Portal') {
                            colorCode = '#0F6292'
                        } else if (enteredName[x][y] == 'Franchisees') {
                            colorCode = '#508b9b'
                        }

                        series_data_entered.push({
                            name: enteredName[x][y],
                            data: dataEntered,
                            color: colorCode,
                            style: {
                                fontWeight: 'bold',
                            }
                        });
                    }


                    console.log('after series_data_entered: ' + JSON.stringify(series_data_entered));

                    for (z = 0; z < salesRepAssignedTeam[x].details[0].enteredBy[y].campaign.length; z++) {

                        console.log('Campaign Name: ' + salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].name);
                        console.log('Campaign Count: ' + salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].count);

                        console.log('before series_data_campaign: ' + JSON.stringify(series_data_campaign));

                        var campaign_exists = false;
                        for (var j = 0; j < series_data_campaign.length; j++) {

                            if (series_data_campaign[j].name == salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].name) {
                                campaign_exists = true;
                                series_data_campaign[j].data[x] += salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].count
                            }
                        }
                        if (campaign_exists == false) {
                            dataEntered = new Array(salesRepAssignedTeam.length).fill(0);
                            dataEntered[x] = salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].count;

                            var colorCodeCampaign;
                            if (campaign_list.indexOf((salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].id).toString()) != -1) {
                                colorCodeCampaign = campaign_list_color[campaign_list.indexOf((salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].id).toString())];
                            }

                            series_data_campaign.push({
                                name: salesRepAssignedTeam[x].details[0].enteredBy[y].campaign[z].name,
                                data: dataEntered,
                                color: colorCodeCampaign,
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }


                    }
                    console.log('after series_data_campaign: ' + JSON.stringify(series_data_campaign));

                }

            }

            console.log('salesRepAssignedTeamMemberCategories')
            console.log(salesRepAssignedTeamMemberCategories)

            console.log('series_data_entered')
            console.log(series_data_entered)

            console.log('series_data_campaign')
            console.log(series_data_campaign)


            plotSalesRepChart(series_data_entered, null, salesRepAssignedTeamMemberCategories)

            plotSalesRepChartCampaign(series_data_campaign, null, salesRepAssignedTeamMemberCategories)

            //?Franchisee Generated Leads Assgined to Sales Rep
            if (role != 1000 && (isNullorEmpty(lead_source) || lead_source == -4)) {

                //Franchisee Generated Leads by System Notes Set By - Weekly Reporting
                var leadsListByZeeGeneratedLastAssignedSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_4__4'
                });


                if (!isNullorEmpty(leadStatus)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: leadStatus
                    }));
                }

                if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_from
                    }));

                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_to
                    }));
                }

                if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                    leadsListBySalesRepDataCaptureCampaignSearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_signed_up_from
                    }));

                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custentity_date_prospect_opportunity',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_signed_up_to
                    }));
                }

                if (!isNullorEmpty(lead_source)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_source
                    }));
                }

                if (!isNullorEmpty(sales_rep)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_assigned',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: sales_rep
                    }));
                }

                if (!isNullorEmpty(lead_entered_by)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custentity_lead_entered_by',
                        join: null,
                        operator: search.Operator.IS,
                        values: lead_entered_by
                    }));
                }

                if (!isNullorEmpty(sales_campaign)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.ANYOF,
                        values: sales_campaign
                    }));
                }

                if (!isNullorEmpty(parent_lpo)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.ANYOF,
                        values: parent_lpo
                    }));
                }

                if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_quote_sent_from
                    }));

                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_quote_sent',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_quote_sent_to
                    }));
                }

                if (!isNullorEmpty(zee_id)) {
                    leadsListByZeeGeneratedLastAssignedSearch.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zee_id
                    }));
                }

                if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                    var defaultSearchFilters = leadsListByZeeGeneratedLastAssignedSearch.filterExpression;

                    console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                    var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                    console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                    defaultSearchFilters.push('AND');
                    defaultSearchFilters.push(modifiedDateFilters);

                    console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


                    leadsListByZeeGeneratedLastAssignedSearch.filterExpression = defaultSearchFilters;


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


                leadsListByZeeGeneratedLastAssignedSearch.run().each(function (
                    leadsListBySalesRepDataCaptureCampaignSearchResultSet) {


                    var prospectCount = parseInt(leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                        name: 'internalid',
                        summary: 'COUNT'
                    }));

                    var custSalesRepAssigned = parseInt(leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                        name: "name",
                        join: "systemNotes",
                        summary: "GROUP",
                    }));
                    var custSalesRepAssignedText = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
                        name: "name",
                        join: "systemNotes",
                        summary: "GROUP",
                    });


                    var zeeGenerated = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getText({
                        name: "partner",
                        summary: "GROUP",
                    });

                    var zeeGeneratedId = leadsListBySalesRepDataCaptureCampaignSearchResultSet.getValue({
                        name: "partner",
                        summary: "GROUP",
                    });

                    if (count1 == 0) {
                        total_leads += prospectCount
                        total_leads_assigned += prospectCount

                        zeeGeneratedTeam.push({
                            'id': zeeGeneratedId,
                            'name': zeeGenerated,
                            'count': total_leads_assigned,
                            "details": []
                        });

                        zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details.push({
                            'lastAssigned': [{
                                'id': custSalesRepAssigned,
                                'name': custSalesRepAssignedText,
                                'count': prospectCount,
                            }]
                        })


                    } else if (oldzeeGeneratedId != null &&
                        oldzeeGeneratedId == zeeGeneratedId) {
                        total_leads_assigned += prospectCount


                        zeeGeneratedTeam[zeeGeneratedTeam.length - 1].count = total_leads_assigned;
                        var lastAssignedLength = zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details[0].lastAssigned.length;

                        if (custSalesRepAssigned == oldCustSalesRepAssigned) {
                            total_leads += prospectCount;
                            zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details[0].lastAssigned[lastAssignedLength - 1].count += total_leads;

                        } else if (custSalesRepAssigned != oldCustSalesRepAssigned) {

                            // total_leads += prospectCount;
                            zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details[0].lastAssigned.push({
                                'id': custSalesRepAssigned,
                                'name': custSalesRepAssignedText,
                                'count': prospectCount,
                            })
                        }

                    } else if (oldzeeGeneratedId != null &&
                        oldzeeGeneratedId != zeeGeneratedId) {

                        total_leads = 0;
                        total_leads_assigned = 0;

                        total_leads += prospectCount;
                        total_leads_assigned += prospectCount

                        zeeGeneratedTeam.push({
                            'id': zeeGeneratedId,
                            'name': zeeGenerated,
                            'count': total_leads_assigned,
                            "details": []
                        });

                        zeeGeneratedTeam[zeeGeneratedTeam.length - 1].details.push({
                            'lastAssigned': [{
                                'id': custSalesRepAssigned,
                                'name': custSalesRepAssignedText,
                                'count': prospectCount,

                            }]
                        })

                    }

                    count1++;
                    oldCustSalesRepAssigned = custSalesRepAssigned;
                    oldCustSalesRepAssignedText = custSalesRepAssignedText;
                    oldzeeGenerated = zeeGenerated;
                    oldzeeGeneratedId = zeeGeneratedId;
                    return true;
                });


                console.log('zeeGeneratedTeam: ' + JSON.stringify(zeeGeneratedTeam));


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
                    console.log('name: ' + zeeGeneratedTeam[x].name);
                    console.log('details: ' + JSON.stringify(zeeGeneratedTeam[x].details[0].lastAssigned));
                    for (y = 0; y < zeeGeneratedTeam[x].details[0].lastAssigned.length; y++) {
                        enteredLeadCount[x][y] = zeeGeneratedTeam[x].details[0].lastAssigned[y].count;
                        enteredName[x][y] = zeeGeneratedTeam[x].details[0].lastAssigned[y].name;

                        console.log('lastAssigned Name: ' + zeeGeneratedTeam[x].details[0].lastAssigned[y].name);
                        console.log('lastAssigned Count: ' + zeeGeneratedTeam[x].details[0].lastAssigned[y].count);

                        console.log('before series_data_last_assigned: ' + JSON.stringify(series_data_last_assigned));
                        var entered_by_exists = false;
                        for (var j = 0; j < series_data_last_assigned.length; j++) {
                            if (series_data_last_assigned[j].name == enteredName[x][y]) {
                                entered_by_exists = true;
                                series_data_last_assigned[j].data[x] = zeeGeneratedTeam[x].details[0].lastAssigned[y].count
                            }
                        }
                        if (entered_by_exists == false) {
                            dataLastAssigned = new Array(zeeGeneratedTeam.length).fill(0);
                            dataLastAssigned[x] = zeeGeneratedTeam[x].details[0].lastAssigned[y].count;

                            var colorCode = '#ffffff'
                            if (employee_list.indexOf((zeeGeneratedTeam[x].details[0].lastAssigned[y].id).toString()) != -1) {
                                colorCode = employee_list_color[employee_list.indexOf((zeeGeneratedTeam[x].details[0].lastAssigned[y].id).toString())];
                            }

                            if (enteredName[x][y] == 'Portal') {
                                colorCode = '#0F6292'
                            } else if (enteredName[x][y] == 'Franchisees') {
                                colorCode = '#508b9b'
                            }

                            series_data_last_assigned.push({
                                name: enteredName[x][y],
                                data: dataLastAssigned,
                                color: colorCode,
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }


                        console.log('after series_data_last_assigned: ' + JSON.stringify(series_data_last_assigned));


                    }

                }

                console.log('salesRepAssignedTeamMemberCategories')
                console.log(salesRepAssignedTeamMemberCategories)

                console.log('series_data_last_assigned')
                console.log(series_data_last_assigned)


                plotZeeGeneratedSalesRepChart(series_data_last_assigned, null, salesRepAssignedTeamMemberCategories)
            }


            var websiteCustomersReportingSearch = search.load({
                type: 'customer',
                // id: 'customsearch_leads_reporting_4' //Website Leads - Customer Signed - Reporting
                // id: 'customsearch_leads_reporting_4_2' //Website Leads - Customer Signed - Reporting V2
                id: 'customsearch_leads_reporting_4_2_3' //Website Leads - Customer Signed - Reporting V2
            });

            if (!isNullorEmpty(leadStatus)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'trandate',
                    join: 'transaction',
                    operator: search.Operator.ONORAFTER,
                    values: invoice_date_from
                }));

                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'trandate',
                    join: 'transaction',
                    operator: search.Operator.ONORBEFORE,
                    values: invoice_date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }


            if (!isNullorEmpty(invoice_type)) {
                if (invoice_type == '2') {
                    websiteCustomersReportingSearch.filters.push(search.createFilter({
                        name: 'trandate',
                        join: 'transaction',
                        operator: search.Operator.ANYOF,
                        values: 8
                    }));
                } else if (invoice_type == '1') {
                    websiteCustomersReportingSearch.filters.push(search.createFilter({
                        name: 'custbody_inv_type',
                        join: 'transaction',
                        operator: search.Operator.ANYOF,
                        values: "@NONE@"
                    }));
                }

            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                websiteCustomersReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = websiteCustomersReportingSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]

                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('signed customer defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

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

            var count = 0;

            csvCustomerSignedExport = [];
            csvExistingCustomerSignedExport = [];
            csvTrialCustomerSignedExport = [];
            var custCount = 0;
            var currentSalesRecordId = null;
            var currentCustCampaign = null;
            var currentLastAssigned = null;
            var currentLastAssignedId = null;

            var lastAssigned = [];
            var customerCampaign = [];
            var customerSource = [];

            websiteCustomersReportingSearch.run().each(function (custListCommenceTodaySet) {

                var custInternalID = custListCommenceTodaySet.getValue({
                    name: 'internalid',
                    summary: "GROUP",
                });
                var custEntityID = custListCommenceTodaySet.getValue({
                    name: 'entityid',
                    summary: "GROUP",
                });
                var custName = custListCommenceTodaySet.getValue({
                    name: 'companyname',
                    summary: "GROUP",
                });
                var zeeID = custListCommenceTodaySet.getValue({
                    name: 'partner',
                    summary: "GROUP",
                });
                var zeeName = custListCommenceTodaySet.getText({
                    name: 'partner',
                    summary: "GROUP",
                });

                var custStage = (custListCommenceTodaySet.getText({
                    name: 'stage',
                    summary: "GROUP",
                })).toUpperCase();

                var custStatusId = custListCommenceTodaySet.getValue({
                    name: 'entitystatus',
                    summary: "GROUP",
                })

                var custStatus = custListCommenceTodaySet.getText({
                    name: 'entitystatus',
                    summary: "GROUP",
                }).toUpperCase();

                var dateLeadEntered = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP",
                });

                var quoteSentDate = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_quote_sent",
                    summary: "GROUP",
                });

                var dateLeadLost = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_lead_lost',
                    summary: "GROUP",
                });
                var dateLeadinContact = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_prospect_in_contact',
                    summary: "GROUP",
                });

                var dateProspectWon = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_prospect_opportunity',
                    summary: "GROUP",
                });

                var dateLeadReassigned = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_suspect_reassign',
                    summary: "GROUP",
                });

                var maapImplementationDate = custListCommenceTodaySet.getValue({
                    name: 'custentity_maap_implementdate',
                    summary: "GROUP",
                });

                console.log('custName: ' + custName)
                console.log('maapImplementationDate: ' + maapImplementationDate)

                var salesRepId = custListCommenceTodaySet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
                    summary: "GROUP",
                });
                var salesRepText = custListCommenceTodaySet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
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
                    name: 'internalid',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
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
                    name: 'custentity_48h_email_sent',
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

                var monthlyServiceValue = (custListCommenceTodaySet.getValue({
                    name: "custentity_cust_monthly_service_value",
                    summary: "GROUP",
                }));

                var monthlyExtraServiceValue = (custListCommenceTodaySet.getValue({
                    name: "custentity_monthly_extra_service_revenue",
                    summary: "GROUP",
                }));

                var monthlyReductionServiceValue = (custListCommenceTodaySet.getValue({
                    name: "custentity_monthly_reduc_service_revenue",
                    summary: "GROUP",
                }));

                var d1 = dateProspectWon.split("/");
                var c = maapImplementationDate.split("/");

                // console.log('d1[1]: ' + d1[1])
                // console.log('c[1]: ' + c[1])
                // console.log('d1[2]: ' + d1[2])
                // console.log('c[2]: ' + c[2])

                if (isNullorEmpty(maapImplementationDate) || ((d1[1] == c[1]) && (d1[2] == c[2]))) {
                    existingCustomer = false
                } else {
                    existingCustomer = true;
                }

                console.log('existingCustomer: ' + existingCustomer)

                var minCommDate = (custListCommenceTodaySet.getValue({
                    name: "custrecord_comm_date",
                    join: "CUSTRECORD_CUSTOMER",
                    summary: "MIN"
                }));

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
                    monthlyReductionServiceValue = parseFloat(monthlyReductionServiceValue);
                } else {
                    monthlyReductionServiceValue = 0.0;
                }

                // if (isNullorEmpty(invoiceType) || invoiceType == '- None -') {
                //     invoiceType = 'Service'
                // }

                if (!isNullorEmpty(minCommDate)) {
                    var minCommDateSplit = minCommDate.split('/');

                    if (parseInt(minCommDateSplit[1]) < 10) {
                        minCommDateSplit[1] = '0' + minCommDateSplit[1]
                    }

                    if (parseInt(minCommDateSplit[0]) < 10) {
                        minCommDateSplit[0] = '0' + minCommDateSplit[0]
                    }

                    minCommDate = minCommDateSplit[2] + '-' + minCommDateSplit[1] + '-' +
                        minCommDateSplit[0];
                }

                var dateLeadEnteredSplit = dateLeadEntered.split('/');
                if (parseInt(dateLeadEnteredSplit[1]) < 10) {
                    dateLeadEnteredSplit[1] = '0' + dateLeadEnteredSplit[1]
                }

                if (parseInt(dateLeadEnteredSplit[0]) < 10) {
                    dateLeadEnteredSplit[0] = '0' + dateLeadEnteredSplit[0]
                }
                dateLeadEntered = dateLeadEnteredSplit[2] + '-' + dateLeadEnteredSplit[1] + '-' + dateLeadEnteredSplit[0]

                if (!isNullorEmpty(dateLeadLost)) {
                    var dateLeadLostSplit = dateLeadLost.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    var dateLost = new Date(dateLeadLostSplit[2], dateLeadLostSplit[1] - 1, dateLeadLostSplit[0]);

                    var difference = dateLost.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = dateLost.getDay();

                    // Remove weekend not previously removed.   
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

                    // Remove start day if span starts on Sunday but ends before Saturday
                    if (startDay == 0 && endDay != 6) {
                        daysOpen = daysOpen - 1;
                    }

                    // Remove end day if span ends on Saturday but starts after Sunday
                    if (endDay == 6 && startDay != 0) {
                        daysOpen = daysOpen - 1;
                    }

                } else if (!isNullorEmpty(dateProspectWon)) {
                    var dateProspectWonSplit = dateProspectWon.split('/');

                    if (parseInt(dateProspectWonSplit[1]) < 10) {
                        dateProspectWonSplit[1] = '0' + dateProspectWonSplit[1]
                    }

                    if (parseInt(dateProspectWonSplit[0]) < 10) {
                        dateProspectWonSplit[0] = '0' + dateProspectWonSplit[0]
                    }

                    dateProspectWon = dateProspectWonSplit[2] + '-' + dateProspectWonSplit[1] + '-' +
                        dateProspectWonSplit[0];

                    var dateLeadLostSplit = dateLeadLost.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    dateProspectWon = new Date(dateProspectWonSplit[2], dateProspectWonSplit[1] - 1, dateProspectWonSplit[0]);

                    var difference = dateProspectWon.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = dateProspectWon.getDay();

                    // Remove weekend not previously removed.   
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

                    // Remove start day if span starts on Sunday but ends before Saturday
                    if (startDay == 0 && endDay != 6) {
                        daysOpen = daysOpen - 1;
                    }

                    // Remove end day if span ends on Saturday but starts after Sunday
                    if (endDay == 6 && startDay != 0) {
                        daysOpen = daysOpen - 1;
                    }

                    dateProspectWon = dateProspectWonSplit[2] + '-' + dateProspectWonSplit[1] + '-' +
                        dateProspectWonSplit[0];



                } else {
                    // var dateLeadLostSplit = dateLeadLost.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    var todayDate = new Date();

                    var difference = todayDate.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = todayDate.getDay();

                    // Remove weekend not previously removed.   
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

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
                    var trialEndDateSplit = trialEndDate.split('/');

                    if (parseInt(trialEndDateSplit[1]) < 10) {
                        trialEndDateSplit[1] = '0' + trialEndDateSplit[1]
                    }

                    if (parseInt(trialEndDateSplit[0]) < 10) {
                        trialEndDateSplit[0] = '0' + trialEndDateSplit[0]
                    }

                    trialEndDate = trialEndDateSplit[2] + '-' + trialEndDateSplit[1] + '-' +
                        trialEndDateSplit[0];
                }

                if (!isNullorEmpty(tncAgreedDate)) {
                    var tncAgreedDateSplit = tncAgreedDate.split('/');

                    if (parseInt(tncAgreedDateSplit[1]) < 10) {
                        tncAgreedDateSplit[1] = '0' + tncAgreedDateSplit[1]
                    }

                    if (parseInt(tncAgreedDateSplit[0]) < 10) {
                        tncAgreedDateSplit[0] = '0' + tncAgreedDateSplit[0]
                    }

                    tncAgreedDate = tncAgreedDateSplit[2] + '-' + tncAgreedDateSplit[1] + '-' +
                        tncAgreedDateSplit[0];
                }

                if (!isNullorEmpty(zeeVisitedDate)) {
                    var zeeVisitedDateSplit = zeeVisitedDate.split('/');

                    if (parseInt(zeeVisitedDateSplit[1]) < 10) {
                        zeeVisitedDateSplit[1] = '0' + zeeVisitedDateSplit[1]
                    }

                    if (parseInt(zeeVisitedDateSplit[0]) < 10) {
                        zeeVisitedDateSplit[0] = '0' + zeeVisitedDateSplit[0]
                    }

                    zeeVisitedDate = zeeVisitedDateSplit[2] + '-' + zeeVisitedDateSplit[1] + '-' +
                        zeeVisitedDateSplit[0];
                }
                if (!isNullorEmpty(quoteSentDate)) {
                    var quoteSentDateSplit = quoteSentDate.split('/');

                    if (parseInt(quoteSentDateSplit[1]) < 10) {
                        quoteSentDateSplit[1] = '0' + quoteSentDateSplit[1]
                    }

                    if (parseInt(quoteSentDateSplit[0]) < 10) {
                        quoteSentDateSplit[0] = '0' + quoteSentDateSplit[0]
                    }

                    quoteSentDate = quoteSentDateSplit[2] + '-' + quoteSentDateSplit[1] + '-' +
                        quoteSentDateSplit[0];
                }

                if (count == 0) {
                    currentSalesRecordId = salesRecordInternalId
                    currentCustCampaign = salesCampaignText
                    currentCustCampaignId = salesCampaignId
                    currentLastAssignedId = salesRepId
                    currentLastAssigned = salesRepText

                } else if (count > 0 && (oldcustInternalID == custInternalID)) {

                    // if (oldInvoiceNumber == invoiceDocumentNumber) {
                    // } else if (oldInvoiceNumber != invoiceDocumentNumber) {
                    //     customerActivityCount++
                    //     if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && showInvoice == true && isNullorEmpty(oldInvoiceItem)) {
                    //         customerChildDataSet.push({
                    //             invoiceDocumentNumber: oldInvoiceNumber,
                    //             invoiceDate: oldinvoiceDate,
                    //             invoiceType: oldInvoiceType,
                    //             invoiceAmount: oldInvoiceAmount,
                    //             invoiceStatus: oldInvoiceStatus,
                    //         });

                    //         invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                    //         if (oldInvoiceType == 'Service') {
                    //             invoiceServiceTotal = invoiceServiceTotal + parseFloat(oldInvoiceAmount);
                    //         } else {
                    //             invoiceProductsTotal = invoiceProductsTotal + parseFloat(oldInvoiceAmount);
                    //         }
                    //     }

                    //     csvCustomerSignedExport.push([
                    //         oldcustInternalID,
                    //         oldcustEntityID,
                    //         oldcustName,
                    //         oldzeeName,
                    //         oldSource,
                    //         oldProdWeeklyUsage,
                    //         oldPreviousCarrier,
                    //         express_speed,
                    //         standard_speed,
                    //         olddateLeadEntered,
                    //         oldquoteSentDate,
                    //         oldemail48h,
                    //         olddateProspectWon,
                    //         oldDaysOpen,
                    //         oldMonthServiceValue,
                    //         oldsalesRepText,
                    //         oldAutoSignUp,
                    //         oldInvoiceNumber,
                    //         oldinvoiceDate,
                    //         oldInvoiceType,
                    //         oldInvoiceAmount,
                    //         oldInvoiceStatus
                    //     ]);

                    //     oldInvoiceNumber = null;
                    //     oldinvoiceDate = null;
                    //     oldInvoiceType = null;
                    //     oldInvoiceAmount = null;
                    //     oldInvoiceStatus = null;
                    //     oldInvoiceItem = null;

                    //     showInvoice = true;

                    // }


                } else if (count > 0 && (oldcustInternalID != custInternalID)) {

                    console.log('oldcustName: ' + oldcustName);
                    console.log('oldSource: ' + oldSource);
                    console.log('currentLastAssignedId: ' + currentLastAssignedId);
                    console.log('currentLastAssigned: ' + currentLastAssigned);
                    console.log('currentCustCampaign: ' + currentCustCampaign);
                    console.log('lastAssigned: ' + JSON.stringify(lastAssigned));
                    console.log('customerCampaign: ' + JSON.stringify(customerCampaign));

                    if (lastAssigned.length > 0) {
                        var newRep = true;
                        for (var p = 0; p < lastAssigned.length; p++) {
                            if (lastAssigned[p].id == currentLastAssignedId) {
                                newRep = false;
                                lastAssigned[p].count = lastAssigned[p].count + 1;
                                var newRepSource = true;
                                for (var s = 0; s < lastAssigned[p].details[0].source.length; s++) {
                                    console.log('source count (s): ' + s);
                                    console.log('lastAssigned[p].details[0].source[s].name: ' + lastAssigned[p].details[0].source[s].name);
                                    console.log('lastAssigned[p].details[0].source[s].name == oldSource: ' + lastAssigned[p].details[0].source[s].name == oldSource);
                                    if (lastAssigned[p].details[0].source[s].name == oldSource) {
                                        newRepSource = false;
                                        lastAssigned[p].details[0].source[s].count = lastAssigned[p].details[0].source[s].count + 1;

                                        var newRepCampaign = true;
                                        for (var c = 0; c < lastAssigned[p].details[0].source[s].campaign.length; c++) {
                                            if (lastAssigned[p].details[0].source[s].campaign[c].name == currentCustCampaign) {
                                                newRepCampaign = false;
                                                lastAssigned[p].details[0].source[s].campaign[c].count = lastAssigned[p].details[0].source[s].campaign[c].count + 1;
                                            }
                                        }
                                        if (newRepCampaign == true) {
                                            lastAssigned[p].details[0].source[s].campaign.push({
                                                'name': currentCustCampaign,
                                                'count': 1
                                            })
                                        }
                                    }
                                }
                                var newRepStatus = true;
                                for (var st = 0; st < lastAssigned[p].status[0].type.length; st++) {

                                    if (lastAssigned[p].status[0].type[st].id == oldCustStatusId) {
                                        newRepStatus = false;
                                        lastAssigned[p].status[0].type[st].count = lastAssigned[p].status[0].type[st].count + 1;
                                    }
                                }
                                console.log('newRepSource: ' + newRepSource);
                                if (newRepSource == true) {
                                    lastAssigned[p].details[0].source.push({
                                        'id': oldSourceId,
                                        'name': oldSource,
                                        'count': 1,
                                        'campaign': [{
                                            'id': currentCustCampaignId,
                                            'name': currentCustCampaign,
                                            'count': 1
                                        }]
                                    })
                                }
                                if (newRepStatus == true) {
                                    lastAssigned[p].status[0].type.push({
                                        'id': oldCustStatusId,
                                        'name': oldcustStatus,
                                        'count': 1,
                                    })
                                }
                            }
                        }
                        if (newRep == true) {
                            lastAssigned.push({
                                'id': currentLastAssignedId,
                                'name': currentLastAssigned,
                                'count': 1,
                                'status': [],
                                "details": []
                            });

                            lastAssigned[lastAssigned.length - 1].status.push({
                                'type': [{
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                }]
                            })

                            lastAssigned[lastAssigned.length - 1].details.push({
                                'source': [{
                                    'id': oldSourceId,
                                    'name': oldSource,
                                    'count': 1,
                                    'campaign': [{
                                        'id': currentCustCampaignId,
                                        'name': currentCustCampaign,
                                        'count': 1
                                    }]
                                }]
                            })
                        }
                    } else {
                        lastAssigned.push({
                            'id': currentLastAssignedId,
                            'name': currentLastAssigned,
                            'count': 1,
                            "status": [],
                            "details": []
                        });

                        lastAssigned[lastAssigned.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })
                        lastAssigned[lastAssigned.length - 1].details.push({
                            'source': [{
                                'id': oldSourceId,
                                'name': oldSource,
                                'count': 1,
                                'campaign': [{
                                    'id': currentCustCampaignId,
                                    'name': currentCustCampaign,
                                    'count': 1
                                }]
                            }]
                        })
                    }

                    if (customerCampaign.length > 0) {
                        var newCampaign = true;
                        for (var p = 0; p < customerCampaign.length; p++) {
                            if (customerCampaign[p].id == currentCustCampaignId) {
                                newCampaign = false;
                                customerCampaign[p].count = customerCampaign[p].count + 1;

                                var newCampaignStatus = true;
                                for (var st = 0; st < customerCampaign[p].status[0].type.length; st++) {

                                    if (customerCampaign[p].status[0].type[st].id == oldCustStatusId) {
                                        newCampaignStatus = false;
                                        customerCampaign[p].status[0].type[st].count = customerCampaign[p].status[0].type[st].count + 1;
                                    }
                                }

                                if (newCampaignStatus == true) {
                                    customerCampaign[p].status[0].type.push({
                                        'id': oldCustStatusId,
                                        'name': oldcustStatus,
                                        'count': 1,
                                    })
                                }
                            }
                        }
                        if (newCampaign == true) {
                            customerCampaign.push({
                                'id': currentCustCampaignId,
                                'name': currentCustCampaign,
                                'count': 1,
                                "status": [],
                            });

                            customerCampaign[customerCampaign.length - 1].status.push({
                                'type': [{
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                }]
                            })
                        }
                    } else {
                        customerCampaign.push({
                            'id': currentCustCampaignId,
                            'name': currentCustCampaign,
                            'count': 1,
                            "status": [],
                        });

                        customerCampaign[customerCampaign.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })

                    }

                    if (customerSource.length > 0) {
                        var newSource = true;
                        for (var p = 0; p < customerSource.length; p++) {
                            if (customerSource[p].id == oldSourceId) {
                                newSource = false;
                                customerSource[p].count = customerSource[p].count + 1;

                                var newSourceStatus = true;
                                for (var st = 0; st < customerSource[p].status[0].type.length; st++) {

                                    if (customerSource[p].status[0].type[st].id == oldCustStatusId) {
                                        newSourceStatus = false;
                                        customerSource[p].status[0].type[st].count = customerSource[p].status[0].type[st].count + 1;
                                    }
                                }

                                if (newSourceStatus == true) {
                                    customerSource[p].status[0].type.push({
                                        'id': oldCustStatusId,
                                        'name': oldcustStatus,
                                        'count': 1,
                                    })
                                }
                            }
                        }
                        if (newSource == true) {
                            customerSource.push({
                                'id': oldSourceId,
                                'name': oldSource,
                                'count': 1,
                                "status": [],
                            });

                            customerSource[customerSource.length - 1].status.push({
                                'type': [{
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                }]
                            })
                        }
                    } else {
                        customerSource.push({
                            'id': oldSourceId,
                            'name': oldSource,
                            'count': 1,
                            "status": [],
                        });

                        customerSource[customerSource.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })

                    }


                    if (oldcustStage == 'CUSTOMER') {

                        // if (oldInvoiceNumber != invoiceDocumentNumber) {
                        //     customerActivityCount++
                        //     if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && showInvoice == true && isNullorEmpty(oldInvoiceItem)) {
                        //         customerChildDataSet.push({
                        //             invoiceDocumentNumber: oldInvoiceNumber,
                        //             invoiceDate: oldinvoiceDate,
                        //             invoiceType: oldInvoiceType,
                        //             invoiceAmount: oldInvoiceAmount,
                        //             invoiceStatus: oldInvoiceStatus,
                        //         });

                        //         invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                        //         if (oldInvoiceType == 'Service') {
                        //             invoiceServiceTotal = invoiceServiceTotal + parseFloat(oldInvoiceAmount);
                        //         } else {
                        //             invoiceProductsTotal = invoiceProductsTotal + parseFloat(oldInvoiceAmount);
                        //         }
                        //     }
                        // }



                        totalCustomerCount++;

                        var express_speed = 0;
                        var standard_speed = 0;
                        var total_usage = 0;
                        if (calcprodusage != '2') {
                            if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                                // Customer Product Usage - Total MP Express, Standard & Premium
                                var mpexUsageResults = search.load({
                                    type: 'customrecord_customer_product_stock',
                                    id: 'customsearch6846'
                                });


                                mpexUsageResults.filters.push(search.createFilter({
                                    name: 'internalid',
                                    join: 'custrecord_cust_prod_stock_customer',
                                    operator: search.Operator.ANYOF,
                                    values: parseInt(oldcustInternalID)
                                }));

                                if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                                    mpexUsageResults.filters.push(search.createFilter({
                                        name: 'custrecord_cust_date_stock_used',
                                        join: null,
                                        operator: search.Operator.ONORAFTER,
                                        values: usage_date_from
                                    }));
                                    mpexUsageResults.filters.push(search.createFilter({
                                        name: 'custrecord_cust_date_stock_used',
                                        join: null,
                                        operator: search.Operator.ONORBEFORE,
                                        values: usage_date_to
                                    }));

                                }



                                mpexUsageResults.run().each(function (mpexUsageSet) {

                                    var deliverySpeed = mpexUsageSet.getValue({
                                        name: 'custrecord_delivery_speed',
                                        summary: 'GROUP'
                                    });
                                    var deliverySpeedText = mpexUsageSet.getText({
                                        name: 'custrecord_delivery_speed',
                                        summary: 'GROUP'
                                    });


                                    var mpexUsage = parseInt(mpexUsageSet.getValue({
                                        name: 'name',
                                        summary: 'COUNT'
                                    }));

                                    if (deliverySpeed == 2 ||
                                        deliverySpeedText == '- None -') {
                                        express_speed += mpexUsage;
                                    } else if (deliverySpeed == 1) {
                                        standard_speed += mpexUsage;
                                    }
                                    total_usage += express_speed + standard_speed;

                                    return true;
                                });
                            }
                        }


                        var usage_date_from_split = usage_date_from.split('/');

                        if (parseInt(usage_date_from_split[1]) < 10) {
                            usage_date_from_split[1] = '0' + usage_date_from_split[1]
                        }

                        if (parseInt(usage_date_from_split[0]) < 10) {
                            usage_date_from_split[0] = '0' + usage_date_from_split[0]
                        }

                        var daily_usage_from = usage_date_from_split[2] + '-' + usage_date_from_split[1] + '-' +
                            usage_date_from_split[0];

                        var usage_date_to_split = usage_date_to.split('/');

                        if (parseInt(usage_date_to_split[1]) < 10) {
                            usage_date_to_split[1] = '0' + usage_date_to_split[1]
                        }

                        if (parseInt(usage_date_to_split[0]) < 10) {
                            usage_date_to_split[0] = '0' + usage_date_to_split[0]
                        }

                        var daily_usage_to = usage_date_to_split[2] + '-' + usage_date_to_split[1] + '-' +
                            usage_date_to_split[0];


                        var mpExpStdUsageLink =
                            '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important;border-radius: 15px"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&custid=' + oldcustInternalID + '&start_date=' + daily_usage_from + '&last_date=' + daily_usage_to + '&zee=' + oldzeeID + '" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

                        var customerIdLink =
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>';

                        console.log('oldcustName: ' + oldcustName);
                        console.log('existingCustomer: ' + oldExistingCustomer);

                        if (oldCustStatusId == 32) {
                            console.log('freetrial child data' + JSON.stringify(customerChildDataSet))
                            trialCustomerDataSet.push(['',
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
                                '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                                oldMonthServiceValue,
                                oldLeadEnteredByText,
                                currentLastAssigned,
                                customerChildDataSet
                            ]);
                        } else if (oldCustStatusId == 71) {
                            console.log('freetrial child data' + JSON.stringify(customerChildDataSet))
                            trialPendingCustomerDataSet.push(['',
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
                                '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                                oldMonthServiceValue,
                                oldLeadEnteredByText,
                                currentLastAssigned,
                                customerChildDataSet
                            ]);
                        } else if ((!isNullorEmpty(oldMonthlyExtraServiceValue) && parseInt(oldMonthlyExtraServiceValue) != 0) || (!isNullorEmpty(oldMonthlyReductionServiceValue) && parseInt(oldMonthlyReductionServiceValue) != 0) || oldExistingCustomer == true) {
                            existingCustomerDataSet.push(['',
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
                                '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                                oldMonthServiceValue,
                                invoiceServiceTotal.toFixed(2),
                                invoiceProductsTotal.toFixed(2),
                                invoiceTotal.toFixed(2),
                                oldLeadEnteredByText,
                                currentLastAssigned,
                                oldAutoSignUp,
                                customerChildDataSet
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
                                oldInvoiceStatus
                            ]);

                        } else {
                            customerDataSet.push(['',
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
                                '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                                oldMonthServiceValue,
                                invoiceServiceTotal.toFixed(2),
                                invoiceProductsTotal.toFixed(2),
                                invoiceTotal.toFixed(2),
                                oldLeadEnteredByText,
                                currentLastAssigned,
                                oldAutoSignUp,
                                customerChildDataSet
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
                                oldInvoiceStatus
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

                    currentSalesRecordId = salesRecordInternalId
                    currentCustCampaign = salesCampaignText
                    currentCustCampaignId = salesCampaignId
                    currentLastAssignedId = salesRepId
                    currentLastAssigned = salesRepText

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
                oldMinCommDate = minCommDate
                oldTrialEndDate = trialEndDate;
                oldTnCAgreedDate = tncAgreedDate;
                oldZeeVisitedDate = zeeVisitedDate;
                oldLPOCommsToCustomer = lpoCommsToCustomer;
                // oldInvoiceNumber = invoiceDocumentNumber;
                // oldinvoiceDate = invoiceDate;
                // oldInvoiceType = invoiceType;
                // oldInvoiceAmount = invoiceAmount;
                // oldInvoiceStatus = invoiceStatus;
                oldExistingCustomer = existingCustomer
                // oldInvoiceItem = invoiceItem;

                // if (oldInvoiceItem == 'Credit Card Surcharge') {
                //     showInvoice = false;
                // }
                custCount++;
                count++

                console.log('signed customer count: ' + count);
                return true;
            });

            if (count > 0) {

                if (lastAssigned.length > 0) {
                    var newRep = true;
                    for (var p = 0; p < lastAssigned.length; p++) {
                        if (lastAssigned[p].id == currentLastAssignedId) {
                            newRep = false;
                            lastAssigned[p].count = lastAssigned[p].count + 1;
                            var newRepSource = true;
                            for (var s = 0; s < lastAssigned[p].details[0].source.length; s++) {
                                console.log('source count (s): ' + s);
                                console.log('lastAssigned[p].details[0].source[s].name: ' + lastAssigned[p].details[0].source[s].name);
                                console.log('lastAssigned[p].details[0].source[s].name == oldSource: ' + lastAssigned[p].details[0].source[s].name == oldSource);
                                if (lastAssigned[p].details[0].source[s].name == oldSource) {
                                    newRepSource = false;
                                    lastAssigned[p].details[0].source[s].count = lastAssigned[p].details[0].source[s].count + 1;

                                    var newRepCampaign = true;
                                    for (var c = 0; c < lastAssigned[p].details[0].source[s].campaign.length; c++) {
                                        if (lastAssigned[p].details[0].source[s].campaign[c].name == currentCustCampaign) {
                                            newRepCampaign = false;
                                            lastAssigned[p].details[0].source[s].campaign[c].count = lastAssigned[p].details[0].source[s].campaign[c].count + 1;
                                        }
                                    }
                                    if (newRepCampaign == true) {
                                        lastAssigned[p].details[0].source[s].campaign.push({
                                            'name': currentCustCampaign,
                                            'count': 1
                                        })
                                    }
                                }
                            }
                            var newRepStatus = true;
                            for (var st = 0; st < lastAssigned[p].status[0].type.length; st++) {

                                if (lastAssigned[p].status[0].type[st].id == oldCustStatusId) {
                                    newRepStatus = false;
                                    lastAssigned[p].status[0].type[st].count = lastAssigned[p].status[0].type[st].count + 1;
                                }
                            }
                            console.log('newRepSource: ' + newRepSource);
                            if (newRepSource == true) {
                                lastAssigned[p].details[0].source.push({
                                    'id': oldSourceId,
                                    'name': oldSource,
                                    'count': 1,
                                    'campaign': [{
                                        'id': currentCustCampaignId,
                                        'name': currentCustCampaign,
                                        'count': 1
                                    }]
                                })
                            }
                            if (newRepStatus == true) {
                                lastAssigned[p].status[0].type.push({
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                })
                            }
                        }
                    }
                    if (newRep == true) {
                        lastAssigned.push({
                            'id': currentLastAssignedId,
                            'name': currentLastAssigned,
                            'count': 1,
                            'status': [],
                            "details": []
                        });

                        lastAssigned[lastAssigned.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })

                        lastAssigned[lastAssigned.length - 1].details.push({
                            'source': [{
                                'id': oldSourceId,
                                'name': oldSource,
                                'count': 1,
                                'campaign': [{
                                    'id': currentCustCampaignId,
                                    'name': currentCustCampaign,
                                    'count': 1
                                }]
                            }]
                        })
                    }
                } else {
                    lastAssigned.push({
                        'id': currentLastAssignedId,
                        'name': currentLastAssigned,
                        'count': 1,
                        "status": [],
                        "details": []
                    });

                    lastAssigned[lastAssigned.length - 1].status.push({
                        'type': [{
                            'id': oldCustStatusId,
                            'name': oldcustStatus,
                            'count': 1,
                        }]
                    })
                    lastAssigned[lastAssigned.length - 1].details.push({
                        'source': [{
                            'id': oldSourceId,
                            'name': oldSource,
                            'count': 1,
                            'campaign': [{
                                'id': currentCustCampaignId,
                                'name': currentCustCampaign,
                                'count': 1
                            }]
                        }]
                    })
                }

                if (customerCampaign.length > 0) {
                    var newCampaign = true;
                    for (var p = 0; p < lastAssigned.length; p++) {
                        if (customerCampaign[p].id == currentCustCampaignId) {
                            newCampaign = false;
                            customerCampaign[p].count = customerCampaign[p].count + 1;

                            var newCampaignStatus = true;
                            for (var st = 0; st < customerCampaign[p].status[0].type.length; st++) {

                                if (customerCampaign[p].status[0].type[st].id == oldCustStatusId) {
                                    newCampaignStatus = false;
                                    customerCampaign[p].status[0].type[st].count = customerCampaign[p].status[0].type[st].count + 1;
                                }
                            }

                            if (newCampaignStatus == true) {
                                customerCampaign[p].status[0].type.push({
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                })
                            }
                        }
                    }
                    if (newCampaign == true) {
                        customerCampaign.push({
                            'id': currentCustCampaignId,
                            'name': currentCustCampaign,
                            'count': 1,
                            "status": [],
                        });

                        customerCampaign[lastAssigned.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })
                    }
                } else {
                    customerCampaign.push({
                        'id': currentCustCampaignId,
                        'name': currentCustCampaign,
                        'count': 1,
                        "status": [],
                    });

                    customerCampaign[lastAssigned.length - 1].status.push({
                        'type': [{
                            'id': oldCustStatusId,
                            'name': oldcustStatus,
                            'count': 1,
                        }]
                    })

                }

                if (customerSource.length > 0) {
                    var newSource = true;
                    for (var p = 0; p < customerSource.length; p++) {
                        if (customerSource[p].id == oldSourceId) {
                            newSource = false;
                            customerSource[p].count = customerSource[p].count + 1;

                            var newSourceStatus = true;
                            for (var st = 0; st < customerSource[p].status[0].type.length; st++) {

                                if (customerSource[p].status[0].type[st].id == oldCustStatusId) {
                                    newSourceStatus = false;
                                    customerSource[p].status[0].type[st].count = customerSource[p].status[0].type[st].count + 1;
                                }
                            }

                            if (newSourceStatus == true) {
                                customerSource[p].status[0].type.push({
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                })
                            }
                        }
                    }
                    if (newSource == true) {
                        customerSource.push({
                            'id': oldSourceId,
                            'name': oldSource,
                            'count': 1,
                            "status": [],
                        });

                        customerSource[customerSource.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })
                    }
                } else {
                    customerSource.push({
                        'id': oldSourceId,
                        'name': oldSource,
                        'count': 1,
                        "status": [],
                    });

                    customerSource[customerSource.length - 1].status.push({
                        'type': [{
                            'id': oldCustStatusId,
                            'name': oldcustStatus,
                            'count': 1,
                        }]
                    })

                }

                if (oldcustStage == 'CUSTOMER') {

                    customerActivityCount++
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
                    if (calcprodusage != '2') {
                        if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                            //Customer Product Usage - Total MP Express, Standard & Premium
                            var mpexUsageResults = search.load({
                                type: 'customrecord_customer_product_stock',
                                id: 'customsearch6846'
                            });


                            mpexUsageResults.filters.push(search.createFilter({
                                name: 'internalid',
                                join: 'custrecord_cust_prod_stock_customer',
                                operator: search.Operator.ANYOF,
                                values: parseInt(oldcustInternalID)
                            }));

                            if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                                mpexUsageResults.filters.push(search.createFilter({
                                    name: 'custrecord_cust_date_stock_used',
                                    join: null,
                                    operator: search.Operator.ONORAFTER,
                                    values: usage_date_from
                                }));
                                mpexUsageResults.filters.push(search.createFilter({
                                    name: 'custrecord_cust_date_stock_used',
                                    join: null,
                                    operator: search.Operator.ONORBEFORE,
                                    values: usage_date_to
                                }));

                            }



                            mpexUsageResults.run().each(function (mpexUsageSet) {

                                var deliverySpeed = mpexUsageSet.getValue({
                                    name: 'custrecord_delivery_speed',
                                    summary: 'GROUP'
                                });
                                var deliverySpeedText = mpexUsageSet.getText({
                                    name: 'custrecord_delivery_speed',
                                    summary: 'GROUP'
                                });


                                var mpexUsage = parseInt(mpexUsageSet.getValue({
                                    name: 'name',
                                    summary: 'COUNT'
                                }));

                                if (deliverySpeed == 2 ||
                                    deliverySpeedText == '- None -') {
                                    express_speed += mpexUsage;
                                } else if (deliverySpeed == 1) {
                                    standard_speed += mpexUsage;
                                }
                                total_usage += express_speed + standard_speed;

                                return true;
                            });
                        }
                    }

                    var usage_date_from_split = usage_date_from.split('/');

                    if (parseInt(usage_date_from_split[1]) < 10) {
                        usage_date_from_split[1] = '0' + usage_date_from_split[1]
                    }

                    if (parseInt(usage_date_from_split[0]) < 10) {
                        usage_date_from_split[0] = '0' + usage_date_from_split[0]
                    }

                    var daily_usage_from = usage_date_from_split[2] + '-' + usage_date_from_split[1] + '-' +
                        usage_date_from_split[0];

                    var usage_date_to_split = usage_date_to.split('/');

                    if (parseInt(usage_date_to_split[1]) < 10) {
                        usage_date_to_split[1] = '0' + usage_date_to_split[1]
                    }

                    if (parseInt(usage_date_to_split[0]) < 10) {
                        usage_date_to_split[0] = '0' + usage_date_to_split[0]
                    }

                    var daily_usage_to = usage_date_to_split[2] + '-' + usage_date_to_split[1] + '-' +
                        usage_date_to_split[0];


                    var mpExpStdUsageLink =
                        '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important; border-radius: 15px"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1712&deploy=1&custid=' + oldcustInternalID + '&start_date=' + daily_usage_from + '&last_date=' + daily_usage_to + '&zee=' + oldzeeID + '" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

                    var customerIdLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>';

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
                        console.log('freetrial child data' + JSON.stringify(customerChildDataSet))
                        trialCustomerDataSet.push(['',
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
                            '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                            oldMonthServiceValue,
                            oldLeadEnteredByText,
                            currentLastAssigned,
                            customerChildDataSet
                        ]);
                    } else if (oldCustStatusId == 71) {
                        console.log('freetrial child data' + JSON.stringify(customerChildDataSet))
                        trialPendingCustomerDataSet.push(['',
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
                            '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                            oldMonthServiceValue,
                            oldLeadEnteredByText,
                            currentLastAssigned,
                            customerChildDataSet
                        ]);
                    } else if ((!isNullorEmpty(oldMonthlyExtraServiceValue) && parseInt(oldMonthlyExtraServiceValue) != 0) || (!isNullorEmpty(oldMonthlyReductionServiceValue) && parseInt(oldMonthlyReductionServiceValue) != 0) || oldExistingCustomer == true) {
                        existingCustomerDataSet.push(['',
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
                            '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                            oldMonthServiceValue,
                            invoiceServiceTotal.toFixed(2),
                            invoiceProductsTotal.toFixed(2),
                            invoiceTotal.toFixed(2),
                            oldLeadEnteredByText,
                            currentLastAssigned,
                            oldAutoSignUp,
                            customerChildDataSet
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
                            oldInvoiceStatus
                        ]);

                    } else {
                        customerDataSet.push(['',
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
                            '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                            oldMonthServiceValue,
                            invoiceServiceTotal.toFixed(2),
                            invoiceProductsTotal.toFixed(2),
                            invoiceTotal.toFixed(2),
                            oldLeadEnteredByText,
                            currentLastAssigned,
                            oldAutoSignUp,
                            customerChildDataSet
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
                            oldInvoiceStatus
                        ]);
                    }
                }
            }

            console.log('customerDataSet: ' + customerDataSet);
            console.log('existingCustomerDataSet: ' + existingCustomerDataSet);
            console.log('trialCustomerDataSet: ' + trialCustomerDataSet);
            console.log('trialPendingCustomerDataSet: ' + trialPendingCustomerDataSet);
            console.log('csvCustomerSignedExport: ' + prospectDataSet);

            console.log('lastAssigned: ' + JSON.stringify(lastAssigned));
            console.log('customerCampaign: ' + JSON.stringify(customerCampaign));

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
                console.log('name: ' + lastAssigned[x].name);
                console.log('details: ' + JSON.stringify(lastAssigned[x].details[0].source));
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

                    console.log('Status Name: ' + lastAssigned[x].status[0].type[y].name);
                    console.log('Status Count: ' + lastAssigned[x].status[0].type[y].count);

                    if (lastAssigned[x].status[0].type[y].id == 13 || lastAssigned[x].status[0].type[y].id == 66) {
                        console.log('before series_data_signed: ' + JSON.stringify(series_data_signed));
                        var status_exists = false;
                        for (var j = 0; j < series_data_signed.length; j++) {
                            if (series_data_signed[j].name == lastAssigned[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_signed[j].data[x] = lastAssigned[x].status[0].type[y].count
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
                                color: '#439A97',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (lastAssigned[x].status[0].type[y].id == 32) {
                        console.log('before series_data_free_trial: ' + JSON.stringify(series_data_free_trial));
                        var status_exists = false;
                        for (var j = 0; j < series_data_free_trial.length; j++) {
                            if (series_data_free_trial[j].name == lastAssigned[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_free_trial[j].data[x] = lastAssigned[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (lastAssigned[x].status[0].type[y].id == 71) {
                        console.log('before series_data_trial_pending: ' + JSON.stringify(series_data_trial_pending));
                        var status_exists = false;
                        for (var j = 0; j < series_data_trial_pending.length; j++) {
                            if (series_data_trial_pending[j].name == lastAssigned[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_trial_pending[j].data[x] = lastAssigned[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }




                    // console.log('after series_data_source: ' + JSON.stringify(series_data_source));


                }

            }
            console.log('lastAssignedTeamMemberCategories: ' + JSON.stringify(lastAssignedTeamMemberCategories));
            console.log('series_data_signed: ' + JSON.stringify(series_data_signed));
            plotChartSignedByLastAssigned(series_data_signed, null, lastAssignedTeamMemberCategories)
            plotChartFreeTrialByLastAssigned(series_data_free_trial, null, lastAssignedTeamMemberCategories)
            plotChartFreeTrialPendingByLastAssigned(series_data_trial_pending, null, lastAssignedTeamMemberCategories)
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
                console.log('name: ' + customerCampaign[x].name);
                // console.log('details: ' + JSON.stringify(customerCampaign[x].details[0].source));


                for (y = 0; y < customerCampaign[x].status[0].type.length; y++) {

                    console.log('Status Name: ' + customerCampaign[x].status[0].type[y].name);
                    console.log('Status Count: ' + customerCampaign[x].status[0].type[y].count);

                    if (customerCampaign[x].status[0].type[y].id == 13 || customerCampaign[x].status[0].type[y].id == 66) {
                        console.log('before series_data_campaign_signed: ' + JSON.stringify(series_data_campaign_signed));
                        var status_exists = false;
                        for (var j = 0; j < series_data_campaign_signed.length; j++) {
                            if (series_data_campaign_signed[j].name == customerCampaign[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_campaign_signed[j].data[x] = customerCampaign[x].status[0].type[y].count
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
                                color: '#439A97',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (customerCampaign[x].status[0].type[y].id == 32) {
                        console.log('before series_data_campaign_free_trial: ' + JSON.stringify(series_data_campaign_free_trial));
                        var status_exists = false;
                        for (var j = 0; j < series_data_campaign_free_trial.length; j++) {
                            if (series_data_campaign_free_trial[j].name == customerCampaign[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_campaign_free_trial[j].data[x] = customerCampaign[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (customerCampaign[x].status[0].type[y].id == 71) {
                        console.log('before series_data_campaign_trial_pending: ' + JSON.stringify(series_data_campaign_trial_pending));
                        var status_exists = false;
                        for (var j = 0; j < series_data_campaign_trial_pending.length; j++) {
                            if (series_data_campaign_trial_pending[j].name == customerCampaign[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_campaign_trial_pending[j].data[x] = customerCampaign[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }




                    // console.log('after series_data_source: ' + JSON.stringify(series_data_source));


                }

            }
            plotChartSignedByCampaign(series_data_campaign_signed, null, campaignCategories)
            plotChartFreeTrialByCampaign(series_data_campaign_free_trial, null, campaignCategories)
            plotChartFreeTrialPendingByCampaign(series_data_campaign_trial_pending, null, campaignCategories)

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
                console.log('name: ' + customerSource[x].name);
                // console.log('details: ' + JSON.stringify(customerSource[x].details[0].source));


                for (y = 0; y < customerSource[x].status[0].type.length; y++) {

                    console.log('Status Name: ' + customerSource[x].status[0].type[y].name);
                    console.log('Status Count: ' + customerSource[x].status[0].type[y].count);

                    if (customerSource[x].status[0].type[y].id == 13 || customerSource[x].status[0].type[y].id == 66) {
                        console.log('before series_data_source_signed: ' + JSON.stringify(series_data_source_signed));
                        var status_exists = false;
                        for (var j = 0; j < series_data_source_signed.length; j++) {
                            if (series_data_source_signed[j].name == customerSource[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_source_signed[j].data[x] = customerSource[x].status[0].type[y].count
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
                                color: '#439A97',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (customerSource[x].status[0].type[y].id == 32) {
                        console.log('before series_data_source_free_trial: ' + JSON.stringify(series_data_source_free_trial));
                        var status_exists = false;
                        for (var j = 0; j < series_data_source_free_trial.length; j++) {
                            if (series_data_source_free_trial[j].name == customerSource[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_source_free_trial[j].data[x] = customerSource[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (customerSource[x].status[0].type[y].id == 71) {
                        console.log('before series_data_source_trial_pending: ' + JSON.stringify(series_data_source_trial_pending));
                        var status_exists = false;
                        for (var j = 0; j < series_data_source_trial_pending.length; j++) {
                            if (series_data_source_trial_pending[j].name == customerSource[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_source_trial_pending[j].data[x] = customerSource[x].status[0].type[y].count
                            }
                        }
                        if (status_exists == false) {
                            sourceFreeTrialPending = new Array(customerSource.length).fill(0);
                            sourceFreeTrialPending[x] = customerSource[x].status[0].type[y].count;

                            // var colorCodeSource;
                            // if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
                            //     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
                            // }

                            series_data_source_trial_pending.push({
                                name: customerSource[x].status[0].type[y].name,
                                data: sourceFreeTrialPending,
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }




                    // console.log('after series_data_source: ' + JSON.stringify(series_data_source));


                }

            }
            plotChartSignedBySource(series_data_source_signed, null, sourceCategories)
            plotChartFreeTrialBySource(series_data_source_free_trial, null, sourceCategories)
            plotChartFreeTrialPendingBySource(series_data_source_trial_pending, null, sourceCategories)

            var dataTableExisitngCustomers = $('#mpexusage-existing_customers').DataTable({
                data: existingCustomerDataSet,
                pageLength: 250,
                order: [[11, 'des']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },//0
                    { title: 'Internal ID' },//1
                    { title: 'ID' },//2
                    { title: 'Company Name' },//3
                    { title: 'Franchisee' },//4
                    { title: 'Source' },//5
                    { title: 'Product Weekly Usage' },//6
                    { title: 'Previous Carrier' },//7
                    // { title: 'MP Express' },//8
                    // { title: 'MP Standard' },//9
                    { title: 'Daily Usage' },//8
                    { title: 'Date - Lead Entered' },//9
                    { title: 'Date - Quote Sent' },//10
                    // { title: '48h Email Sent' },
                    { title: 'Date - Prospect Won' },//11
                    { title: 'Days Open' },//12
                    { title: 'Expected Monthly Service' },//13
                    { title: 'Total Service Invoice' },//14
                    { title: 'Total Product Invoice' },//15
                    { title: 'Total Invoice' },//16
                    { title: 'Lead Entered By' },//17
                    { title: 'Sales Rep' },//18
                    { title: 'Auto Signed Up' },//19
                    { title: 'Child Table' }//20
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [19, 20],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 11, 13, 14, 15, 16],
                        className: 'bolded'
                    }, {
                        targets: [0, 8, 12],
                        className: 'notexport'
                    }
                ],
                rowCallback: function (row, data, index) {

                    var row_color = ''
                    if (data[5] == 'Additional Services') {
                        $('td', row).css('background-color', '#86A3B8');
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
                        $('td', row).css('background-color', '#ADCF9F');
                    }
                }, footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })

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
                            page: 'current'
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
                            page: 'current'
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
                            page: 'current'
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
                            page: 'current'
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

                }
            });

            dataTableExisitngCustomers.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildExisting(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-existing_customers tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableExisitngCustomers.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    destroyChild(row);
                    tr.removeClass('shown');
                    tr.removeClass('parent');

                    $('.expand-button').addClass('btn-primary');
                    $('.expand-button').removeClass('btn-light')
                } else {
                    // Open this row
                    row.child.show();
                    tr.addClass('shown');
                    tr.addClass('parent');

                    $('.expand-button').removeClass('btn-primary');
                    $('.expand-button').addClass('btn-light')
                }
            });


            var dataTableTrialCustomers = $('#mpexusage-trial_customers').DataTable({
                data: trialCustomerDataSet,
                pageLength: 250,
                order: [[13, 'asc']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [{
                    title: 'Expand Status Change',
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                }, //0
                { title: 'Internal ID' }, //1
                { title: 'ID' }, //2
                { title: 'Company Name' },//3
                { title: 'Franchisee' },//4
                { title: 'Source' },//5
                { title: 'Previous Carrier' },//6
                { title: 'Date - Lead Entered' },//7
                { title: 'Date - Quote Sent' },//8
                { title: 'Date - Prospect Won' },//9
                { title: 'T & C\'s Agreed Date' },//10
                { title: 'Franchisee Visited Date' },//11
                { title: 'LPO Comms to Customer' },//12
                { title: 'Trial End Date' },//13
                { title: 'Days Open' },//14
                { title: 'Expected Monthly Service' },//15
                { title: 'Lead Entered By' },//16
                { title: 'Sales Rep' },//17
                { title: 'Child Table' },//18
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [2, 3, 4, 12, 13],
                        className: 'bolded'
                    },
                    {
                        targets: [18],
                        visible: false
                    },
                    {
                        targets: [0, 14],
                        className: 'notexport'
                    }
                ],
                footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })

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


                }
            });

            dataTableTrialCustomers.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildTrialCustomers(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });


            $('#mpexusage-trial_customers tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableTrialCustomers.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    destroyChild(row);
                    tr.removeClass('shown');
                    tr.removeClass('parent');

                    $('.expand-button').addClass('btn-primary');
                    $('.expand-button').removeClass('btn-light')
                } else {
                    // Open this row
                    row.child.show();
                    tr.addClass('shown');
                    tr.addClass('parent');

                    $('.expand-button').removeClass('btn-primary');
                    $('.expand-button').addClass('btn-light')
                }
            });

            var dataTableTrialPendingCustomers = $('#mpexusage-trial_pending_customers').DataTable({
                data: trialPendingCustomerDataSet,
                pageLength: 250,
                order: [[14, 'asc']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [{
                    title: 'Expand Status Change',
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                }, //0
                { title: 'Internal ID' }, //1
                { title: 'ID' }, //2
                { title: 'Company Name' },//3
                { title: 'Franchisee' },//4
                { title: 'Source' },//5
                { title: 'Previous Carrier' },//6
                { title: 'Date - Lead Entered' },//7
                { title: 'Date - Quote Sent' },//8
                { title: 'Date - Prospect Won' },//9
                { title: 'T & C\'s Agreed Date' },//10
                { title: 'Franchisee Visited Date' },//11
                { title: 'LPO Comms to Customer' },//12
                { title: 'Trial End Date' },//13
                { title: 'Days Open' },//14
                { title: 'Expected Monthly Service' },//15
                { title: 'Lead Entered By' },//16
                { title: 'Sales Rep' },//17
                { title: 'Child Table' },//18
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [2, 3, 4, 12, 13],
                        className: 'bolded'
                    },
                    {
                        targets: [18],
                        visible: false
                    },
                    {
                        targets: [0, 14],
                        className: 'notexport'
                    }
                ],
                footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })

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


                }
            });

            dataTableTrialPendingCustomers.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildTrialPendingCustomers(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });


            $('#mpexusage-trial_pending_customers tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableTrialPendingCustomers.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    destroyChild(row);
                    tr.removeClass('shown');
                    tr.removeClass('parent');

                    $('.expand-button').addClass('btn-primary');
                    $('.expand-button').removeClass('btn-light')
                } else {
                    // Open this row
                    row.child.show();
                    tr.addClass('shown');
                    tr.addClass('parent');

                    $('.expand-button').removeClass('btn-primary');
                    $('.expand-button').addClass('btn-light')
                }
            });


            var dataTable = $('#mpexusage-customer').DataTable({
                data: customerDataSet,
                pageLength: 250,
                order: [[11, 'des']],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },//0
                    { title: 'Internal ID' },//1
                    { title: 'ID' },//2
                    { title: 'Company Name' },//3
                    { title: 'Franchisee' },//4
                    { title: 'Source' },//5
                    { title: 'Product Weekly Usage' },//6
                    { title: 'Previous Carrier' },//7
                    // { title: 'MP Express' },//8
                    // { title: 'MP Standard' },//9
                    { title: 'Daily Usage' },//8
                    { title: 'Date - Lead Entered' },//9
                    { title: 'Date - Quote Sent' },//10
                    // { title: '48h Email Sent' },
                    { title: 'Date - Prospect Won' },//11
                    { title: 'Days Open' },//12
                    { title: 'Expected Monthly Service' },//13
                    { title: 'Total Service Invoice' },//14
                    { title: 'Total Product Invoice' },//15
                    { title: 'Total Invoice' },//16
                    { title: 'Lead Entered By' },//17
                    { title: 'Sales Rep' },//18
                    { title: 'Auto Signed Up' },//19
                    { title: 'Child Table' }//20
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [19, 20],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 11, 13, 14, 15, 16],
                        className: 'bolded'
                    }, {
                        targets: [0, 8, 12],
                        className: 'notexport'
                    }
                ],
                rowCallback: function (row, data, index) {

                    var row_color = ''
                    if (data[5] == 'Additional Services') {
                        $('td', row).css('background-color', '#86A3B8');
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
                        $('td', row).css('background-color', '#ADCF9F');
                    }
                }, footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })

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
                            page: 'current'
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
                            page: 'current'
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
                            page: 'current'
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
                            page: 'current'
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

                }
            });

            dataTable.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-customer tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    destroyChild(row);
                    tr.removeClass('shown');
                    tr.removeClass('parent');

                    $('.expand-button').addClass('btn-primary');
                    $('.expand-button').removeClass('btn-light')
                } else {
                    // Open this row
                    row.child.show();
                    tr.addClass('shown');
                    tr.addClass('parent');

                    $('.expand-button').removeClass('btn-primary');
                    $('.expand-button').addClass('btn-light')
                }
            });

            var websiteProspectLeadsReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_5_2' //Website Leads - Reporting V2
            });

            if (!isNullorEmpty(leadStatus)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }


            if (!isNullorEmpty(sales_campaign)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                websiteProspectLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = websiteProspectLeadsReportingSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]

                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

                websiteProspectLeadsReportingSearch.filterExpression = defaultSearchFilters;

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

            var websiteProspectLeadsReportingSearchCount = websiteProspectLeadsReportingSearch.runPaged().count;

            console.log('websiteProspectLeadsReportingSearchCount: ' + websiteProspectLeadsReportingSearchCount)
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

            websiteProspectLeadsReportingSearch.run().each(function (prospectResultSet) {

                var custInternalID = prospectResultSet.getValue({
                    name: 'internalid',
                    summary: "GROUP",
                });
                var custEntityID = prospectResultSet.getValue({
                    name: 'entityid',
                    summary: "GROUP",
                });
                var custName = prospectResultSet.getValue({
                    name: 'companyname',
                    summary: "GROUP",
                });
                var zeeID = prospectResultSet.getValue({
                    name: 'partner',
                    summary: "GROUP",
                });
                var zeeName = prospectResultSet.getText({
                    name: 'partner',
                    summary: "GROUP",
                });

                var custStage = (prospectResultSet.getText({
                    name: 'stage',
                    summary: "GROUP",
                })).toUpperCase();

                var custStatusId = prospectResultSet.getValue({
                    name: 'entitystatus',
                    summary: "GROUP",
                })

                var custStatus = prospectResultSet.getText({
                    name: 'entitystatus',
                    summary: "GROUP",
                }).toUpperCase();

                var dateLeadEntered = prospectResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP",
                });

                var quoteSentDate = prospectResultSet.getValue({
                    name: "custentity_date_lead_quote_sent",
                    summary: "GROUP",
                });

                var dateLeadLost = prospectResultSet.getValue({
                    name: 'custentity_date_lead_lost',
                    summary: "GROUP",
                });
                var dateLeadinContact = prospectResultSet.getValue({
                    name: 'custentity_date_prospect_in_contact',
                    summary: "GROUP",
                });

                var dateProspectWon = prospectResultSet.getValue({
                    name: 'custentity_date_prospect_opportunity',
                    summary: "GROUP",
                });

                var dateLeadReassigned = prospectResultSet.getValue({
                    name: 'custentity_date_suspect_reassign',
                    summary: "GROUP",
                });

                var salesRepId = prospectResultSet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
                    summary: "GROUP",
                });
                var salesRepText = prospectResultSet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
                    summary: "GROUP",
                });

                var activityInternalID = prospectResultSet.getValue({
                    name: "internalid",
                    join: "activity",
                    summary: "GROUP",
                })
                var activityStartDate = prospectResultSet.getValue({
                    name: "startdate",
                    join: "activity",
                    summary: "GROUP",
                })
                if (!isNullorEmpty(activityStartDate)) {
                    // var userNotesStartDateTimeArray = userNotesStartDate.split(' ');
                    var activityStartDateArray = activityStartDate.split('/');
                    if (parseInt(activityStartDateArray[1]) < 10) {
                        activityStartDateArray[1] = '0' + activityStartDateArray[1]
                    }

                    if (parseInt(activityStartDateArray[0]) < 10) {
                        activityStartDateArray[0] = '0' + activityStartDateArray[0]
                    }
                    activityStartDate = activityStartDateArray[2] + '-' + activityStartDateArray[1] + '-' + activityStartDateArray[0]
                }
                var activityTitle = prospectResultSet.getValue({
                    name: "title",
                    join: "activity",
                    summary: "GROUP",
                })


                if (isNullorEmpty(prospectResultSet.getText({
                    name: "custevent_organiser",
                    join: "activity",
                    summary: "GROUP",
                }))) {
                    var activityOrganiser = prospectResultSet.getText({
                        name: "assigned",
                        join: "activity",
                        summary: "GROUP",
                    })
                } else {
                    var activityOrganiser = prospectResultSet.getText({
                        name: "custevent_organiser",
                        join: "activity",
                        summary: "GROUP",
                    })
                }


                var activityMessage = prospectResultSet.getValue({
                    name: "message",
                    join: "activity",
                    summary: "GROUP",
                })

                var email48h = prospectResultSet.getText({
                    name: 'custentity_48h_email_sent',
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

                var monthlyServiceValue = (prospectResultSet.getValue({
                    name: "custentity_cust_monthly_service_value",
                    summary: "GROUP",
                }));

                var avgInvoiceValue = (prospectResultSet.getValue({
                    name: "total",
                    join: "transaction",
                    summary: "AVG",
                }));

                var dateLPOValidated = prospectResultSet.getValue({
                    name: 'custentity_date_lpo_validated',
                    summary: "GROUP",
                });


                var userNotesInternalID = prospectResultSet.getValue({
                    name: "internalid",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesTitle = prospectResultSet.getValue({
                    name: "title",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesStartDate = prospectResultSet.getValue({
                    name: "notedate",
                    join: "userNotes",
                    summary: "GROUP",
                })
                if (!isNullorEmpty(userNotesStartDate)) {
                    var userNotesStartDateTimeArray = userNotesStartDate.split(' ');
                    var userNotesStartDateArray = userNotesStartDateTimeArray[0].split('/');
                    if (parseInt(userNotesStartDateArray[1]) < 10) {
                        userNotesStartDateArray[1] = '0' + userNotesStartDateArray[1]
                    }

                    if (parseInt(userNotesStartDateArray[0]) < 10) {
                        userNotesStartDateArray[0] = '0' + userNotesStartDateArray[0]
                    }
                    userNotesStartDate = userNotesStartDateArray[2] + '-' + userNotesStartDateArray[1] + '-' + userNotesStartDateArray[0]
                }
                var userNotesOrganiser = prospectResultSet.getText({
                    name: "author",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesMessage = prospectResultSet.getValue({
                    name: "note",
                    join: "userNotes",
                    summary: "GROUP",
                })

                var salesRepId = prospectResultSet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
                    summary: "GROUP",
                });
                var salesRepText = prospectResultSet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
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
                    name: 'internalid',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
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

                var dateLeadEnteredSplit = dateLeadEntered.split('/');
                if (parseInt(dateLeadEnteredSplit[1]) < 10) {
                    dateLeadEnteredSplit[1] = '0' + dateLeadEnteredSplit[1]
                }

                if (parseInt(dateLeadEnteredSplit[0]) < 10) {
                    dateLeadEnteredSplit[0] = '0' + dateLeadEnteredSplit[0]
                }
                dateLeadEntered = dateLeadEnteredSplit[2] + '-' + dateLeadEnteredSplit[1] + '-' + dateLeadEnteredSplit[0]


                if (!isNullorEmpty(dateLeadLost)) {
                    var dateLeadLostSplit = dateLeadLost.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    var dateLost = new Date(dateLeadLostSplit[2], dateLeadLostSplit[1] - 1, dateLeadLostSplit[0]);

                    var difference = dateLost.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = dateLost.getDay();

                    // Remove weekend not previously removed.
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

                    // Remove start day if span starts on Sunday but ends before Saturday
                    if (startDay == 0 && endDay != 6) {
                        daysOpen = daysOpen - 1;
                    }

                    // Remove end day if span ends on Saturday but starts after Sunday
                    if (endDay == 6 && startDay != 0) {
                        daysOpen = daysOpen - 1;
                    }

                } else if (!isNullorEmpty(dateProspectWon)) {
                    var dateProspectWonSplit = dateProspectWon.split('/');

                    if (parseInt(dateProspectWonSplit[1]) < 10) {
                        dateProspectWonSplit[1] = '0' + dateProspectWonSplit[1]
                    }

                    if (parseInt(dateProspectWonSplit[0]) < 10) {
                        dateProspectWonSplit[0] = '0' + dateProspectWonSplit[0]
                    }

                    dateProspectWon = dateProspectWonSplit[2] + '-' + dateProspectWonSplit[1] + '-' +
                        dateProspectWonSplit[0];

                    var dateLeadLostSplit = dateLeadLost.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    dateProspectWon = new Date(dateProspectWonSplit[2], dateProspectWonSplit[1] - 1, dateProspectWonSplit[0]);

                    var difference = dateProspectWon.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = dateProspectWon.getDay();

                    // Remove weekend not previously removed.
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

                    // Remove start day if span starts on Sunday but ends before Saturday
                    if (startDay == 0 && endDay != 6) {
                        daysOpen = daysOpen - 1;
                    }

                    // Remove end day if span ends on Saturday but starts after Sunday
                    if (endDay == 6 && startDay != 0) {
                        daysOpen = daysOpen - 1;
                    }

                    dateProspectWon = dateProspectWonSplit[2] + '-' + dateProspectWonSplit[1] + '-' +
                        dateProspectWonSplit[0];

                } else if (!isNullorEmpty(quoteSentDate)) {
                    var dateQuoteSentSplit = quoteSentDate.split('/');

                    if (parseInt(dateQuoteSentSplit[1]) < 10) {
                        dateQuoteSentSplit[1] = '0' + dateQuoteSentSplit[1]
                    }

                    if (parseInt(dateQuoteSentSplit[0]) < 10) {
                        dateQuoteSentSplit[0] = '0' + dateQuoteSentSplit[0]
                    }

                    quoteSentDate = dateQuoteSentSplit[2] + '-' + dateQuoteSentSplit[1] + '-' +
                        dateQuoteSentSplit[0];

                    var dateLeadLostSplit = dateLeadLost.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    quoteSentDate = new Date(dateQuoteSentSplit[2], dateQuoteSentSplit[1] - 1, dateQuoteSentSplit[0]);

                    var difference = quoteSentDate.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = quoteSentDate.getDay();

                    // Remove weekend not previously removed.
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

                    // Remove start day if span starts on Sunday but ends before Saturday
                    if (startDay == 0 && endDay != 6) {
                        daysOpen = daysOpen - 1;
                    }

                    // Remove end day if span ends on Saturday but starts after Sunday
                    if (endDay == 6 && startDay != 0) {
                        daysOpen = daysOpen - 1;
                    }

                    quoteSentDate = dateQuoteSentSplit[2] + '-' + dateQuoteSentSplit[1] + '-' +
                        dateQuoteSentSplit[0];
                } if (!isNullorEmpty(dateLPOValidated)) {
                    var dateLPOValidatedSplit = dateLPOValidated.split('/');
                    // var dateLeadEnteredSplit = dateLeadEntered.split('/');

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    var dateValidated = new Date(dateLPOValidatedSplit[2], dateLPOValidatedSplit[1] - 1, dateLPOValidatedSplit[0]);

                    var difference = dateValidated.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = dateValidated.getDay();

                    // Remove weekend not previously removed.
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

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

                    var dateEntered = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1, dateLeadEnteredSplit[0]);
                    var todayDate = new Date();

                    var difference = todayDate.getTime() - dateEntered.getTime();
                    daysOpen = Math.ceil(difference / (1000 * 3600 * 24));

                    var weeks = Math.floor(daysOpen / 7);
                    daysOpen = daysOpen - (weeks * 2);

                    // Handle special cases
                    var startDay = dateEntered.getDay();
                    var endDay = todayDate.getDay();

                    // Remove weekend not previously removed.
                    if (startDay - endDay > 1)
                        daysOpen = daysOpen - 2;

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
                    currentSalesRecordId = salesRecordInternalId
                    currentCustCampaign = salesCampaignText
                    currentCustCampaignId = salesCampaignId
                    currentLastAssignedId = salesRepId
                    currentLastAssigned = salesRepText

                    if (!isNullorEmpty(activityTitle) && !isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                            prospectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        }
                    } else if (!isNullorEmpty(activityTitle) && isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    } else if (isNullorEmpty(activityTitle) && !isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        }
                    }

                } else if (count > 0 && (oldcustInternalID == custInternalID)) {
                    if (!isNullorEmpty(activityTitle) && !isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                            prospectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        }
                    } else if (!isNullorEmpty(activityTitle) && isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    } else if (isNullorEmpty(activityTitle) && !isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        }
                    }

                } else if (count > 0 && (oldcustInternalID != custInternalID)) {

                    console.log('oldcustName: ' + oldcustName);
                    console.log('oldSource: ' + oldSource);
                    console.log('currentLastAssignedId: ' + currentLastAssignedId);
                    console.log('currentLastAssigned: ' + currentLastAssigned);
                    console.log('currentCustCampaign: ' + currentCustCampaign);
                    console.log('lastAssigned: ' + JSON.stringify(lastAssigned));
                    console.log('customerCampaign: ' + JSON.stringify(customerCampaign));

                    if (lastAssigned.length > 0) {
                        var newRep = true;
                        for (var p = 0; p < lastAssigned.length; p++) {
                            if (lastAssigned[p].id == currentLastAssignedId) {
                                newRep = false;
                                lastAssigned[p].count = lastAssigned[p].count + 1;
                                var newRepSource = true;
                                for (var s = 0; s < lastAssigned[p].details[0].source.length; s++) {
                                    console.log('source count (s): ' + s);
                                    console.log('lastAssigned[p].details[0].source[s].name: ' + lastAssigned[p].details[0].source[s].name);
                                    console.log('lastAssigned[p].details[0].source[s].name == oldSource: ' + lastAssigned[p].details[0].source[s].name == oldSource);
                                    if (lastAssigned[p].details[0].source[s].name == oldSource) {
                                        newRepSource = false;
                                        lastAssigned[p].details[0].source[s].count = lastAssigned[p].details[0].source[s].count + 1;

                                        var newRepCampaign = true;
                                        for (var c = 0; c < lastAssigned[p].details[0].source[s].campaign.length; c++) {
                                            if (lastAssigned[p].details[0].source[s].campaign[c].name == currentCustCampaign) {
                                                newRepCampaign = false;
                                                lastAssigned[p].details[0].source[s].campaign[c].count = lastAssigned[p].details[0].source[s].campaign[c].count + 1;
                                            }
                                        }
                                        if (newRepCampaign == true) {
                                            lastAssigned[p].details[0].source[s].campaign.push({
                                                'name': currentCustCampaign,
                                                'count': 1
                                            })
                                        }
                                    }
                                }
                                var newRepStatus = true;
                                for (var st = 0; st < lastAssigned[p].status[0].type.length; st++) {

                                    if (lastAssigned[p].status[0].type[st].id == oldCustStatusId) {
                                        newRepStatus = false;
                                        lastAssigned[p].status[0].type[st].count = lastAssigned[p].status[0].type[st].count + 1;
                                    }
                                }
                                console.log('newRepSource: ' + newRepSource);
                                if (newRepSource == true) {
                                    lastAssigned[p].details[0].source.push({
                                        'id': oldSourceId,
                                        'name': oldSource,
                                        'count': 1,
                                        'campaign': [{
                                            'id': currentCustCampaignId,
                                            'name': currentCustCampaign,
                                            'count': 1
                                        }]
                                    })
                                }
                                if (newRepStatus == true) {
                                    lastAssigned[p].status[0].type.push({
                                        'id': oldCustStatusId,
                                        'name': oldcustStatus,
                                        'count': 1,
                                    })
                                }
                            }
                        }
                        if (newRep == true) {
                            lastAssigned.push({
                                'id': currentLastAssignedId,
                                'name': currentLastAssigned,
                                'count': 1,
                                'status': [],
                                "details": []
                            });

                            lastAssigned[lastAssigned.length - 1].status.push({
                                'type': [{
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                }]
                            })

                            lastAssigned[lastAssigned.length - 1].details.push({
                                'source': [{
                                    'id': oldSourceId,
                                    'name': oldSource,
                                    'count': 1,
                                    'campaign': [{
                                        'id': currentCustCampaignId,
                                        'name': currentCustCampaign,
                                        'count': 1
                                    }]
                                }]
                            })
                        }
                    } else {
                        lastAssigned.push({
                            'id': currentLastAssignedId,
                            'name': currentLastAssigned,
                            'count': 1,
                            "status": [],
                            "details": []
                        });

                        lastAssigned[lastAssigned.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })
                        lastAssigned[lastAssigned.length - 1].details.push({
                            'source': [{
                                'id': oldSourceId,
                                'name': oldSource,
                                'count': 1,
                                'campaign': [{
                                    'id': currentCustCampaignId,
                                    'name': currentCustCampaign,
                                    'count': 1
                                }]
                            }]
                        })
                    }

                    if (customerCampaign.length > 0) {
                        var newCampaign = true;
                        for (var p = 0; p < customerCampaign.length; p++) {
                            if (customerCampaign[p].id == currentCustCampaignId) {
                                newCampaign = false;
                                customerCampaign[p].count = customerCampaign[p].count + 1;

                                var newCampaignStatus = true;
                                for (var st = 0; st < customerCampaign[p].status[0].type.length; st++) {

                                    if (customerCampaign[p].status[0].type[st].id == oldCustStatusId) {
                                        newCampaignStatus = false;
                                        customerCampaign[p].status[0].type[st].count = customerCampaign[p].status[0].type[st].count + 1;
                                    }
                                }

                                if (newCampaignStatus == true) {
                                    customerCampaign[p].status[0].type.push({
                                        'id': oldCustStatusId,
                                        'name': oldcustStatus,
                                        'count': 1,
                                    })
                                }
                            }
                        }
                        if (newCampaign == true) {
                            customerCampaign.push({
                                'id': currentCustCampaignId,
                                'name': currentCustCampaign,
                                'count': 1,
                                "status": [],
                            });

                            customerCampaign[customerCampaign.length - 1].status.push({
                                'type': [{
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                }]
                            })
                        }
                    } else {
                        customerCampaign.push({
                            'id': currentCustCampaignId,
                            'name': currentCustCampaign,
                            'count': 1,
                            "status": [],
                        });

                        customerCampaign[customerCampaign.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })

                    }

                    if (customerSource.length > 0) {
                        var newSource = true;
                        for (var p = 0; p < customerSource.length; p++) {
                            if (customerSource[p].id == oldSourceId) {
                                newSource = false;
                                customerSource[p].count = customerSource[p].count + 1;

                                var newSourceStatus = true;
                                for (var st = 0; st < customerSource[p].status[0].type.length; st++) {

                                    if (customerSource[p].status[0].type[st].id == oldCustStatusId) {
                                        newSourceStatus = false;
                                        customerSource[p].status[0].type[st].count = customerSource[p].status[0].type[st].count + 1;
                                    }
                                }

                                if (newSourceStatus == true) {
                                    customerSource[p].status[0].type.push({
                                        'id': oldCustStatusId,
                                        'name': oldcustStatus,
                                        'count': 1,
                                    })
                                }
                            }
                        }
                        if (newSource == true) {
                            customerSource.push({
                                'id': oldSourceId,
                                'name': oldSource,
                                'count': 1,
                                "status": [],
                            });

                            customerSource[customerSource.length - 1].status.push({
                                'type': [{
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                }]
                            })
                        }
                    } else {
                        customerSource.push({
                            'id': oldSourceId,
                            'name': oldSource,
                            'count': 1,
                            "status": [],
                        });

                        customerSource[customerSource.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })

                    }

                    if (oldcustStage == 'PROSPECT' && oldcustStatus != 'PROSPECT-QUOTE SENT') {

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
                        prospectDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldProdWeeklyUsage,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldquoteSentDate,
                            oldemail48h,
                            '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                            oldMonthServiceValue,
                            oldsalesRepText,
                            prospectChildDataSet
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
                            oldsalesRepText
                        ]);


                    } else if (oldcustStage == 'PROSPECT' && oldcustStatus == 'PROSPECT-QUOTE SENT') {

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
                        prospectQuoteSentDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldProdWeeklyUsage,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldquoteSentDate,
                            oldemail48h,
                            '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                            oldMonthServiceValue,
                            oldsalesRepText,
                            prospectQuoteSentChildDataSet
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
                            oldsalesRepText
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

                    currentSalesRecordId = salesRecordInternalId
                    currentCustCampaign = salesCampaignText
                    currentCustCampaignId = salesCampaignId
                    currentLastAssignedId = salesRepId
                    currentLastAssigned = salesRepText

                    if (!isNullorEmpty(activityTitle) && !isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                            prospectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        }
                    } else if (!isNullorEmpty(activityTitle) && isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    } else if (isNullorEmpty(activityTitle) && !isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-QUOTE SENT') {
                            prospectActivityCount++
                            prospectQuoteSentChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
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
                count++
                return true;
            });

            if (count > 0) {
                console.log('oldcustName: ' + oldcustName);
                console.log('oldSource: ' + oldSource);
                console.log('currentLastAssignedId: ' + currentLastAssignedId);
                console.log('currentLastAssigned: ' + currentLastAssigned);
                console.log('currentCustCampaign: ' + currentCustCampaign);
                console.log('lastAssigned: ' + JSON.stringify(lastAssigned));
                console.log('customerCampaign: ' + JSON.stringify(customerCampaign));

                if (lastAssigned.length > 0) {
                    var newRep = true;
                    for (var p = 0; p < lastAssigned.length; p++) {
                        if (lastAssigned[p].id == currentLastAssignedId) {
                            newRep = false;
                            lastAssigned[p].count = lastAssigned[p].count + 1;
                            var newRepSource = true;
                            for (var s = 0; s < lastAssigned[p].details[0].source.length; s++) {
                                console.log('source count (s): ' + s);
                                console.log('lastAssigned[p].details[0].source[s].name: ' + lastAssigned[p].details[0].source[s].name);
                                console.log('lastAssigned[p].details[0].source[s].name == oldSource: ' + lastAssigned[p].details[0].source[s].name == oldSource);
                                if (lastAssigned[p].details[0].source[s].name == oldSource) {
                                    newRepSource = false;
                                    lastAssigned[p].details[0].source[s].count = lastAssigned[p].details[0].source[s].count + 1;

                                    var newRepCampaign = true;
                                    for (var c = 0; c < lastAssigned[p].details[0].source[s].campaign.length; c++) {
                                        if (lastAssigned[p].details[0].source[s].campaign[c].name == currentCustCampaign) {
                                            newRepCampaign = false;
                                            lastAssigned[p].details[0].source[s].campaign[c].count = lastAssigned[p].details[0].source[s].campaign[c].count + 1;
                                        }
                                    }
                                    if (newRepCampaign == true) {
                                        lastAssigned[p].details[0].source[s].campaign.push({
                                            'name': currentCustCampaign,
                                            'count': 1
                                        })
                                    }
                                }
                            }
                            var newRepStatus = true;
                            for (var st = 0; st < lastAssigned[p].status[0].type.length; st++) {

                                if (lastAssigned[p].status[0].type[st].id == oldCustStatusId) {
                                    newRepStatus = false;
                                    lastAssigned[p].status[0].type[st].count = lastAssigned[p].status[0].type[st].count + 1;
                                }
                            }
                            console.log('newRepSource: ' + newRepSource);
                            if (newRepSource == true) {
                                lastAssigned[p].details[0].source.push({
                                    'id': oldSourceId,
                                    'name': oldSource,
                                    'count': 1,
                                    'campaign': [{
                                        'id': currentCustCampaignId,
                                        'name': currentCustCampaign,
                                        'count': 1
                                    }]
                                })
                            }
                            if (newRepStatus == true) {
                                lastAssigned[p].status[0].type.push({
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                })
                            }
                        }
                    }
                    if (newRep == true) {
                        lastAssigned.push({
                            'id': currentLastAssignedId,
                            'name': currentLastAssigned,
                            'count': 1,
                            'status': [],
                            "details": []
                        });

                        lastAssigned[lastAssigned.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })

                        lastAssigned[lastAssigned.length - 1].details.push({
                            'source': [{
                                'id': oldSourceId,
                                'name': oldSource,
                                'count': 1,
                                'campaign': [{
                                    'id': currentCustCampaignId,
                                    'name': currentCustCampaign,
                                    'count': 1
                                }]
                            }]
                        })
                    }
                } else {
                    lastAssigned.push({
                        'id': currentLastAssignedId,
                        'name': currentLastAssigned,
                        'count': 1,
                        "status": [],
                        "details": []
                    });

                    lastAssigned[lastAssigned.length - 1].status.push({
                        'type': [{
                            'id': oldCustStatusId,
                            'name': oldcustStatus,
                            'count': 1,
                        }]
                    })
                    lastAssigned[lastAssigned.length - 1].details.push({
                        'source': [{
                            'id': oldSourceId,
                            'name': oldSource,
                            'count': 1,
                            'campaign': [{
                                'id': currentCustCampaignId,
                                'name': currentCustCampaign,
                                'count': 1
                            }]
                        }]
                    })
                }

                if (customerCampaign.length > 0) {
                    var newCampaign = true;
                    for (var p = 0; p < customerCampaign.length; p++) {
                        if (customerCampaign[p].id == currentCustCampaignId) {
                            newCampaign = false;
                            customerCampaign[p].count = customerCampaign[p].count + 1;

                            var newCampaignStatus = true;
                            for (var st = 0; st < customerCampaign[p].status[0].type.length; st++) {

                                if (customerCampaign[p].status[0].type[st].id == oldCustStatusId) {
                                    newCampaignStatus = false;
                                    customerCampaign[p].status[0].type[st].count = customerCampaign[p].status[0].type[st].count + 1;
                                }
                            }

                            if (newCampaignStatus == true) {
                                customerCampaign[p].status[0].type.push({
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                })
                            }
                        }
                    }
                    if (newCampaign == true) {
                        customerCampaign.push({
                            'id': currentCustCampaignId,
                            'name': currentCustCampaign,
                            'count': 1,
                            "status": [],
                        });

                        customerCampaign[customerCampaign.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })
                    }
                } else {
                    customerCampaign.push({
                        'id': currentCustCampaignId,
                        'name': currentCustCampaign,
                        'count': 1,
                        "status": [],
                    });

                    customerCampaign[customerCampaign.length - 1].status.push({
                        'type': [{
                            'id': oldCustStatusId,
                            'name': oldcustStatus,
                            'count': 1,
                        }]
                    })

                }

                if (customerSource.length > 0) {
                    var newSource = true;
                    for (var p = 0; p < customerSource.length; p++) {
                        if (customerSource[p].id == oldSourceId) {
                            newSource = false;
                            customerSource[p].count = customerSource[p].count + 1;

                            var newSourceStatus = true;
                            for (var st = 0; st < customerSource[p].status[0].type.length; st++) {

                                if (customerSource[p].status[0].type[st].id == oldCustStatusId) {
                                    newSourceStatus = false;
                                    customerSource[p].status[0].type[st].count = customerSource[p].status[0].type[st].count + 1;
                                }
                            }

                            if (newSourceStatus == true) {
                                customerSource[p].status[0].type.push({
                                    'id': oldCustStatusId,
                                    'name': oldcustStatus,
                                    'count': 1,
                                })
                            }
                        }
                    }
                    if (newSource == true) {
                        customerSource.push({
                            'id': oldSourceId,
                            'name': oldSource,
                            'count': 1,
                            "status": [],
                        });

                        customerSource[customerSource.length - 1].status.push({
                            'type': [{
                                'id': oldCustStatusId,
                                'name': oldcustStatus,
                                'count': 1,
                            }]
                        })
                    }
                } else {
                    customerSource.push({
                        'id': oldSourceId,
                        'name': oldSource,
                        'count': 1,
                        "status": [],
                    });

                    customerSource[customerSource.length - 1].status.push({
                        'type': [{
                            'id': oldCustStatusId,
                            'name': oldcustStatus,
                            'count': 1,
                        }]
                    })

                }

                if (oldcustStage == 'PROSPECT' && oldcustStatus != 'PROSPECT-QUOTE SENT') {

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
                    prospectDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldProdWeeklyUsage,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldquoteSentDate,
                        oldemail48h,
                        '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                        oldMonthServiceValue,
                        oldsalesRepText,
                        prospectChildDataSet
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
                        oldsalesRepText
                    ]);


                } else if (oldcustStage == 'PROSPECT' && oldcustStatus == 'PROSPECT-QUOTE SENT') {

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
                    prospectQuoteSentDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldProdWeeklyUsage,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldquoteSentDate,
                        oldemail48h,
                        '<input type="button" value="' + oldDaysOpen + '" class="form-control btn btn-primary show_status_timeline" id="" data-id="' + oldcustInternalID + '" style="background-color: #095C7B;border-radius: 30px">',
                        oldMonthServiceValue,
                        oldsalesRepText,
                        prospectQuoteSentChildDataSet
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
                        oldsalesRepText
                    ]);


                }
            }

            console.log('PROSPECTS - QUOTE SENT & OPPORTUNITY')
            console.log('lastAssigned: ' + JSON.stringify(lastAssigned));
            console.log('customerCampaign: ' + JSON.stringify(customerCampaign));
            console.log('customerSource: ' + JSON.stringify(customerSource));

            //!
            var series_data_signed_source = [];
            var series_data_signed_campaign = [];
            var series_data_quote_sent = [];
            var series_data_opportunities = [];
            var series_data_free_trial = [];
            var lastAssignedTeamMemberCategories = [];
            var dataCaptureTeamMemberLPOCategories = [];
            var sourceLeadCount = [];
            var sourceName = [];
            var dataQuoteSent = new Array(lastAssigned.length).fill(0);
            var dataOpportunities = new Array(lastAssigned.length).fill(0);
            for (var x = 0; x < lastAssigned.length; x++) {
                lastAssignedTeamMemberCategories[x] = lastAssigned[x].name;
                sourceLeadCount[x] = [];
                sourceName[x] = [];
                console.log('name: ' + lastAssigned[x].name);
                console.log('details: ' + JSON.stringify(lastAssigned[x].details[0].source));

                for (y = 0; y < lastAssigned[x].status[0].type.length; y++) {

                    console.log('Status Name: ' + lastAssigned[x].status[0].type[y].name);
                    console.log('Status Count: ' + lastAssigned[x].status[0].type[y].count);

                    if (lastAssigned[x].status[0].type[y].id == 50) {
                        console.log('before series_data_quote_sent: ' + JSON.stringify(series_data_quote_sent));
                        var status_exists = false;
                        for (var j = 0; j < series_data_quote_sent.length; j++) {
                            if (series_data_quote_sent[j].name == lastAssigned[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_quote_sent[j].data[x] = lastAssigned[x].status[0].type[y].count
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
                                color: '#439A97',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (lastAssigned[x].status[0].type[y].id == 58) {
                        console.log('before series_data_opportunities: ' + JSON.stringify(series_data_opportunities));
                        var status_exists = false;
                        for (var j = 0; j < series_data_opportunities.length; j++) {
                            if (series_data_opportunities[j].name == lastAssigned[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_opportunities[j].data[x] = lastAssigned[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                }

            }
            console.log('lastAssignedTeamMemberCategories: ' + JSON.stringify(lastAssignedTeamMemberCategories));
            console.log('series_data_quote_sent: ' + JSON.stringify(series_data_quote_sent));
            plotChartQuoteSentByLastAssigned(series_data_quote_sent, null, lastAssignedTeamMemberCategories)
            plotChartOpportunityByLastAssigned(series_data_opportunities, null, lastAssignedTeamMemberCategories)

            //!
            var series_data_signed_source = [];
            var series_data_signed_campaign = [];
            var series_data_campaign_quote_sent = [];
            var series_data_campaign_opportunities = [];

            var campaignCategories = [];
            var sourceLeadCount = [];
            var sourceName = [];
            var campaignQuoteSent = new Array(customerCampaign.length).fill(0);
            var campaignOpportunites = new Array(customerCampaign.length).fill(0);
            var campaignFreeTrialPending = new Array(customerCampaign.length).fill(0);
            for (var x = 0; x < customerCampaign.length; x++) {
                campaignCategories[x] = customerCampaign[x].name;
                sourceLeadCount[x] = [];
                sourceName[x] = [];
                console.log('name: ' + customerCampaign[x].name);
                // console.log('details: ' + JSON.stringify(customerCampaign[x].details[0].source));


                for (y = 0; y < customerCampaign[x].status[0].type.length; y++) {

                    console.log('Status Name: ' + customerCampaign[x].status[0].type[y].name);
                    console.log('Status Count: ' + customerCampaign[x].status[0].type[y].count);

                    if (customerCampaign[x].status[0].type[y].id == 50) {
                        console.log('before series_data_campaign_quote_sent: ' + JSON.stringify(series_data_campaign_quote_sent));
                        var status_exists = false;
                        for (var j = 0; j < series_data_campaign_quote_sent.length; j++) {
                            if (series_data_campaign_quote_sent[j].name == customerCampaign[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_campaign_quote_sent[j].data[x] = customerCampaign[x].status[0].type[y].count
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
                                color: '#439A97',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }

                    if (customerCampaign[x].status[0].type[y].id == 58) {
                        console.log('before series_data_campaign_opportunities: ' + JSON.stringify(series_data_campaign_opportunities));
                        var status_exists = false;
                        for (var j = 0; j < series_data_campaign_opportunities.length; j++) {
                            if (series_data_campaign_opportunities[j].name == customerCampaign[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_campaign_opportunities[j].data[x] = customerCampaign[x].status[0].type[y].count
                            }
                        }
                        if (status_exists == false) {
                            campaignOpportunites = new Array(customerCampaign.length).fill(0);
                            campaignOpportunites[x] = customerCampaign[x].status[0].type[y].count;

                            // var colorCodeSource;
                            // if (source_list.includes((lastAssigned[x].status[0].type[y].id).toString()) == true) {
                            //     colorCodeSource = source_list_color[source_list.indexOf((lastAssigned[x].status[0].type[y].id).toString())];
                            // }

                            series_data_campaign_opportunities.push({
                                name: customerCampaign[x].status[0].type[y].name,
                                data: campaignOpportunites,
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }




                    // console.log('after series_data_source: ' + JSON.stringify(series_data_source));


                }

            }
            plotChartQuoteSentByCampaign(series_data_campaign_quote_sent, null, campaignCategories)
            plotChartOpportunityByCampaign(series_data_campaign_opportunities, null, campaignCategories)


            //!
            //!
            var series_data_signed_source = [];
            var series_data_signed_campaign = [];
            var series_data_source_quote_sent = [];
            var series_data_source_opportunities = [];

            var sourceCategories = [];
            var sourceLeadCount = [];
            var sourceName = [];
            var sourceQuoteSent = new Array(customerSource.length).fill(0);
            var sourceOpportunities = new Array(customerSource.length).fill(0);
            for (var x = 0; x < customerSource.length; x++) {
                sourceCategories[x] = customerSource[x].name;
                sourceLeadCount[x] = [];
                sourceName[x] = [];
                console.log('name: ' + customerSource[x].name);
                // console.log('details: ' + JSON.stringify(customerSource[x].details[0].source));


                for (y = 0; y < customerSource[x].status[0].type.length; y++) {

                    console.log('Status Name: ' + customerSource[x].status[0].type[y].name);
                    console.log('Status Count: ' + customerSource[x].status[0].type[y].count);

                    if (customerSource[x].status[0].type[y].id == 50) {
                        console.log('before series_data_source_quote_sent: ' + JSON.stringify(series_data_source_quote_sent));
                        var status_exists = false;
                        for (var j = 0; j < series_data_source_quote_sent.length; j++) {
                            if (series_data_source_quote_sent[j].name == customerSource[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_source_quote_sent[j].data[x] = customerSource[x].status[0].type[y].count
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
                                color: '#439A97',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }


                    if (customerSource[x].status[0].type[y].id == 58) {
                        console.log('before series_data_source_opportunities: ' + JSON.stringify(series_data_source_opportunities));
                        var status_exists = false;
                        for (var j = 0; j < series_data_source_opportunities.length; j++) {
                            if (series_data_source_opportunities[j].name == customerSource[x].status[0].type[y].name) {
                                status_exists = true;
                                series_data_source_opportunities[j].data[x] = customerSource[x].status[0].type[y].count
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
                                color: '#ADCF9F',
                                style: {
                                    fontWeight: 'bold',
                                }
                            });
                        }
                    }
                }

            }
            plotChartQuoteSentBySource(series_data_source_quote_sent, null, sourceCategories)
            plotChartOpportunityBySource(series_data_source_opportunities, null, sourceCategories)

            console.log('prospects hidden');

            console.log('prospectDataSet: ' + prospectDataSet)

            var dataTable2 = $('#mpexusage-prospects_quoteSent_incontact_noanswer').DataTable({
                data: prospectDataSet,
                pageLength: 250,
                order: [],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },//0
                    { title: 'Internal ID' },//1
                    { title: 'ID' },//2
                    { title: 'Company Name' },//3
                    { title: 'Franchisee' },//4
                    { title: 'Status' },//5
                    { title: 'Source' },//6
                    { title: 'Product Weekly Usage' },//7
                    { title: 'Previous Carrier' },//8
                    { title: 'Date - Lead Entered' },//9
                    { title: 'Date - Quote Sent' },//10
                    { title: '48h Email Sent' },//11
                    { title: 'Days Open' },//12
                    { title: 'Monthly Service Value' },//13
                    { title: 'Sales Rep' },//14
                    { title: 'Child Table' }//15
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [15],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 5, 12, 13],
                        className: 'bolded'
                    },
                    {
                        targets: [0, 12],
                        className: 'notexport'
                    }
                ],
                rowCallback: function (row, data, index) {
                    if (data[5] == 'PROSPECT-OPPORTUNITY') {
                        $('td', row).css('background-color', '#ADCF9F');
                    } else if (isNullorEmpty(data[15]) && data[5] != 'PROSPECT-NO ANSWER') {
                        $('td', row).css('background-color', '#f9c67a');
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
                }, footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })

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
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(13).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                    );

                }
            });

            dataTable2.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild2(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-prospects_quoteSent_incontact_noanswer tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable2.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    destroyChild(row);
                    tr.removeClass('shown');
                    tr.removeClass('parent');

                    $('.expand-button').addClass('btn-primary');
                    $('.expand-button').removeClass('btn-light')
                } else {
                    // Open this row
                    row.child.show();
                    tr.addClass('shown');
                    tr.addClass('parent');

                    $('.expand-button').removeClass('btn-primary');
                    $('.expand-button').addClass('btn-light')
                }
            });

            console.log('prospectDataSet: ' + prospectDataSet)

            var dataTableOpportunity = $('#mpexusage-prospects_opportunites').DataTable({
                data: prospectQuoteSentDataSet,
                pageLength: 250,
                order: [10, 'desc'],
                layout: {
                    topStart: {
                        buttons: [{
                            extend: 'copy', text: 'Copy',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'csv', text: 'CSV',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'excel', text: 'Excel',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'pdf', text: 'PDF',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }, {
                            extend: 'print', text: 'Print',
                            className: 'btn btn-default exportButtons',
                            exportOptions: {
                                columns: ':not(.notexport)'
                            }
                        }],
                    }
                },
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },//0
                    { title: 'Internal ID' },//1
                    { title: 'ID' },//2
                    { title: 'Company Name' },//3
                    { title: 'Franchisee' },//4
                    { title: 'Status' },//5
                    { title: 'Source' },//6
                    { title: 'Product Weekly Usage' },//7
                    { title: 'Previous Carrier' },//8
                    { title: 'Date - Lead Entered' },//9
                    { title: 'Date - Quote Sent' },//10
                    { title: '48h Email Sent' },//11
                    { title: 'Days Open' },//12
                    { title: 'Monthly Service Value' },//13
                    { title: 'Sales Rep' },//14
                    { title: 'Child Table' }//15
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [15],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 5, 12, 13],
                        className: 'bolded'
                    }, {
                        targets: [0, 12],
                        className: 'notexport'
                    }
                ],
                rowCallback: function (row, data, index) {
                    if (data[5] == 'PROSPECT-QUOTE SENT') {
                        $('td', row).css('background-color', '#ADCF9F');
                    } else if (isNullorEmpty(data[15]) && data[5] != 'PROSPECT-NO ANSWER') {
                        $('td', row).css('background-color', '#f9c67a');
                    } else if (!isNullorEmpty(data[15])) {
                        var row_color = '#f9c67a'
                        data[15].forEach(function (el) {
                            if (!isNullorEmpty(el)) {
                                if (el.activityOrganiser == 'Kerina Helliwell' || el.activityOrganiser == 'David Gdanski' || el.activityOrganiser == 'Lee Russell' || el.activityOrganiser == 'Belinda Urbani' || el.activityOrganiser == 'Luke Forbes' || el.activityOrganiser == 'Bobbi G Yengbie') {
                                    row_color = ''
                                }
                            }
                        });
                        $('td', row).css('background-color', row_color);
                    }
                }, footerCallback: function (row, data, start, end, display) {
                    var api = this.api(),
                        data;
                    // Remove the formatting to get integer data for summation
                    var intVal = function (i) {
                        return typeof i === 'string' ?
                            i.replace(/[\$,]/g, '') * 1 :
                            typeof i === 'number' ?
                                i : 0;
                    };

                    const formatter = new Intl.NumberFormat('en-AU', {
                        style: 'currency',
                        currency: 'AUD',
                        minimumFractionDigits: 2
                    })

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
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(13).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                    );

                }
            });

            dataTableOpportunity.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild2(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-prospects_opportunites tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableOpportunity.row(tr);

                if (row.child.isShown()) {
                    // This row is already open - close it
                    destroyChild(row);
                    tr.removeClass('shown');
                    tr.removeClass('parent');

                    $('.expand-button').addClass('btn-primary');
                    $('.expand-button').removeClass('btn-light')
                } else {
                    // Open this row
                    row.child.show();
                    tr.addClass('shown');
                    tr.addClass('parent');

                    $('.expand-button').removeClass('btn-primary');
                    $('.expand-button').addClass('btn-light')
                }
            });


            // // Leads - Signed - Last Assigned
            // var customerListBySalesRepWeeklySearch = search.load({
            //     type: 'customer',
            //     id: 'customsearch_leads_reporting_weekly_2_5'
            // });

            // if (!isNullorEmpty(leadStatus)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'entitystatus',
            //         join: null,
            //         operator: search.Operator.IS,
            //         values: leadStatus
            //     }));
            // }


            // if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_date_lead_entered',
            //         join: null,
            //         operator: search.Operator.ONORAFTER,
            //         values: date_from
            //     }));

            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_date_lead_entered',
            //         join: null,
            //         operator: search.Operator.ONORBEFORE,
            //         values: date_to
            //     }));
            // }

            // if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_date_prospect_opportunity',
            //         join: null,
            //         operator: search.Operator.ONORAFTER,
            //         values: date_signed_up_from
            //     }));

            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_date_prospect_opportunity',
            //         join: null,
            //         operator: search.Operator.ONORBEFORE,
            //         values: date_signed_up_to
            //     }));
            // }

            // if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_date_lead_quote_sent',
            //         join: null,
            //         operator: search.Operator.ONORAFTER,
            //         values: date_quote_sent_from
            //     }));

            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_date_lead_quote_sent',
            //         join: null,
            //         operator: search.Operator.ONORBEFORE,
            //         values: date_quote_sent_to
            //     }));
            // }

            // if (!isNullorEmpty(lead_source)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'leadsource',
            //         join: null,
            //         operator: search.Operator.ANYOF,
            //         values: lead_source
            //     }));
            // }

            // if (!isNullorEmpty(sales_rep)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custrecord_sales_assigned',
            //         join: 'custrecord_sales_customer',
            //         operator: search.Operator.IS,
            //         values: sales_rep
            //     }));
            // }

            // if (!isNullorEmpty(lead_entered_by)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custentity_lead_entered_by',
            //         join: null,
            //         operator: search.Operator.IS,
            //         values: lead_entered_by
            //     }));
            // }

            // if (!isNullorEmpty(sales_campaign)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'custrecord_sales_campaign',
            //         join: 'custrecord_sales_customer',
            //         operator: search.Operator.ANYOF,
            //         values: sales_campaign
            //     }));
            // }

            // if (!isNullorEmpty(zee_id)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'partner',
            //         join: null,
            //         operator: search.Operator.IS,
            //         values: zee_id
            //     }));
            // }

            // if (!isNullorEmpty(parent_lpo)) {
            //     customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
            //         name: 'internalid',
            //         join: 'custentity_lpo_parent_account',
            //         operator: search.Operator.ANYOF,
            //         values: parent_lpo
            //     }));
            // }


            // if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
            //     var defaultSearchFilters = customerListBySalesRepWeeklySearch.filterExpression;

            //     console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

            //     var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.oldvalue", "isnotempty", ""], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
            //     console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

            //     defaultSearchFilters.push('AND');
            //     defaultSearchFilters.push(modifiedDateFilters);

            //     console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


            //     customerListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;


            // }


            // total_customer_signed = 0;
            // var count_customer_signed = 0;
            // var oldCustomerSignedDate = null;
            // var oldCustomerCount = 0;
            // var oldCustomerSource = null;
            // var oldCustomerCampaign = null;


            // var oldSalesRecordInternalId = null;
            // var oldCustomerInternalId = 0;
            // var oldLastAssigned = null;

            // var series_data_source = [];
            // var series_data_campaign = [];
            // var salesRepAssignedTeamMemberCategories = [];

            // customerListBySalesRepWeeklySearch.run().each(function (
            //     customerListBySalesRepWeeklySearchResultSet) {


            //     var lastAssigned = customerListBySalesRepWeeklySearchResultSet.getText({
            //         name: "custrecord_sales_assigned",
            //         join: "CUSTRECORD_SALES_CUSTOMER",
            //         summary: "GROUP",
            //     });

            //     var customerInternalId = customerListBySalesRepWeeklySearchResultSet.getValue({
            //         name: "internalid",
            //         summary: "GROUP",
            //     });

            //     var customerSource = customerListBySalesRepWeeklySearchResultSet.getValue({
            //         name: "leadsource",
            //         summary: "GROUP"
            //     });

            //     var customerSourceText = customerListBySalesRepWeeklySearchResultSet.getText({
            //         name: "leadsource",
            //         summary: "GROUP"
            //     });

            //     var customerCampaign = customerListBySalesRepWeeklySearchResultSet.getValue({
            //         name: "custrecord_sales_campaign",
            //         join: "CUSTRECORD_SALES_CUSTOMER",
            //         summary: "GROUP",
            //     });

            //     var customerCampaignText = customerListBySalesRepWeeklySearchResultSet.getText({
            //         name: "custrecord_sales_campaign",
            //         join: "CUSTRECORD_SALES_CUSTOMER",
            //         summary: "GROUP",
            //     });

            //     console.log('lastAssigned' + lastAssigned)
            //     console.log('customerInternalId' + customerInternalId)

            //     if (count_customer_signed == 0) {


            //     } else if (oldCustomerInternalId != null &&
            //         oldCustomerInternalId == customerInternalId) {

            //         if (oldCustomerSource == customerSource) {

            //         } else {

            //         }


            //     } else if (oldCustomerInternalId != null &&
            //         oldCustomerInternalId != customerInternalId) {



            //         if (oldCustomerSource == '-4') {
            //             //ZEE GENERATED
            //             source_zee_generated++;
            //         } else if (oldCustomerSource == '17') {
            //             //INBOUND CALL
            //             source_call++;
            //         } else if (oldCustomerSource == '239030') {
            //             //FIELD SALES
            //             source_field_sales++;
            //         } else if (oldCustomerSource == '254557') {
            //             //INBOUND - NEW WEBSITE
            //             source_website++;
            //         } else if (oldCustomerSource == '277970') {
            //             source_additional_services++;
            //         } else if (oldCustomerSource == '279095') {
            //             source_legal_campaign++;
            //         } else if (oldCustomerSource == '280411') {
            //             futurePlusCount++;
            //         } else if (oldCustomerSource == '281559') {
            //             lpo_transition++;
            //         } else if (oldCustomerSource == '282051') {
            //             lpo_ho_generated++;
            //         } else if (oldCustomerSource == '282083') {
            //             lpo_ap_customer++;
            //         } else if (oldCustomerSource == '282085') {
            //             lpo_inbound_web++;
            //         } else if (oldCustomerSource == '97943') {
            //             ho_generated++;
            //         } else {
            //             other_source++;
            //         }

            //         total_source_count =
            //             source_zee_generated +
            //             source_call +
            //             source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

            //         debt_set3.push({
            //             dateUsed: oldLastAssigned,
            //             source_zee_generated: source_zee_generated,
            //             source_call: source_call,
            //             source_field_sales: source_field_sales,
            //             source_website: source_website,
            //             total_source_count: total_source_count,
            //             source_additional_services: source_additional_services,
            //             source_legal_campaign: source_legal_campaign,
            //             other_source: other_source,
            //             futurePlusCount: futurePlusCount,
            //             lpo_transition: lpo_transition,
            //             lpo_ho_generated: lpo_ho_generated,
            //             lpo_ap_customer: lpo_ap_customer,
            //             lpo_inbound_web: lpo_inbound_web,
            //             ho_generated: ho_generated
            //         });

            //         console.log('debt_set3(' + oldLastAssigned + ')' + JSON.stringify(debt_set3))

            //         source_zee_generated = 0;
            //         source_call = 0;
            //         source_field_sales = 0;
            //         source_website = 0;
            //         total_source_count = 0;
            //         source_additional_services = 0;
            //         source_legal_campaign = 0;
            //         other_source = 0;
            //         futurePlusCount = 0;
            //         ho_generated = 0;
            //         lpo_ho_generated = 0;
            //         lpo_transition = 0;
            //         lpo_inbound_web = 0;
            //         lpo_ap_customer = 0;


            //     }

            //     // oldCustomerCount = customerCount;
            //     oldCustomerSource = customerSource;
            //     oldCustomeoldCustomerCampaignSource = customerCampaign;
            //     oldLastAssigned = lastAssigned;
            //     oldCustomerInternalId = customerInternalId;
            //     count_customer_signed++;


            //     return true;
            // });

            // if (count_customer_signed > 0) {
            //     console.log('oldCustomerInternalId' + oldCustomerInternalId)
            //     console.log('oldCustomerSource' + oldCustomerSource)

            //     if (oldCustomerSource == '-4') {
            //         //ZEE GENERATED
            //         source_zee_generated++;
            //     } else if (oldCustomerSource == '17') {
            //         //INBOUND CALL
            //         source_call++;
            //     } else if (oldCustomerSource == '239030') {
            //         //FIELD SALES
            //         source_field_sales++;
            //     } else if (oldCustomerSource == '254557') {
            //         //INBOUND - NEW WEBSITE
            //         source_website++;
            //     } else if (oldCustomerSource == '277970') {
            //         source_additional_services++;
            //     } else if (oldCustomerSource == '279095') {
            //         source_legal_campaign++;
            //     } else if (oldCustomerSource == '280411') {
            //         futurePlusCount++;
            //     } else if (oldCustomerSource == '281559') {
            //         lpo_transition++;
            //     } else if (oldCustomerSource == '282051') {
            //         lpo_ho_generated++;
            //     } else if (oldCustomerSource == '282083') {
            //         lpo_ap_customer++;
            //     } else if (oldCustomerSource == '282085') {
            //         lpo_inbound_web++;
            //     } else if (oldCustomerSource == '97943') {
            //         ho_generated++;
            //     } else {
            //         other_source++;
            //     }

            //     total_source_count =
            //         source_zee_generated +
            //         source_call +
            //         source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;
            //     debt_set3.push({
            //         dateUsed: oldLastAssigned,
            //         source_zee_generated: source_zee_generated,
            //         source_call: source_call,
            //         source_field_sales: source_field_sales,
            //         source_website: source_website,
            //         total_source_count: total_source_count,
            //         source_additional_services: source_additional_services,
            //         source_legal_campaign: source_legal_campaign,
            //         other_source: other_source,
            //         futurePlusCount: futurePlusCount,
            //         lpo_transition: lpo_transition,
            //         lpo_ho_generated: lpo_ho_generated,
            //         lpo_ap_customer: lpo_ap_customer,
            //         lpo_inbound_web: lpo_inbound_web,
            //         ho_generated: ho_generated
            //     });
            // }

            // console.log('debt_set3 last: ' + JSON.stringify(debt_set3));

            // var customerSignedDataSet = [];
            // if (!isNullorEmpty(debt_set3)) {
            //     debt_set3
            //         .forEach(function (preview_row, index) {

            //             customerSignedDataSet.push([preview_row.dateUsed,
            //             preview_row.source_zee_generated,
            //             preview_row.source_call,
            //             preview_row.source_field_sales,
            //             preview_row.source_website,
            //             preview_row.source_additional_services,
            //             preview_row.source_legal_campaign,
            //             preview_row.other_source,
            //             preview_row.futurePlusCount,
            //             preview_row.lpo_transition,
            //             preview_row.lpo_ho_generated,
            //             preview_row.lpo_ap_customer,
            //             preview_row.lpo_inbound_web,
            //             preview_row.ho_generated,
            //             preview_row.total_source_count
            //             ]);

            //         });
            // }
            // console.log('customerSignedDataSet: ' + customerSignedDataSet)

            // var month_year_customer = []; // creating array for storing browser
            // var customer_signed_source_zee_generatedcount = [];
            // var customer_signed_source_callcount = [];
            // var customer_signed_source_field_salescount = [];
            // var customer_signed_source_websitecount = [];
            // var customer_signed_total_source_countcount = [];
            // var customer_signed_source_additional_services = [];
            // var customer_signed_source_legal_campaign = [];
            // var customer_signed_other_source = [];
            // var customer_signed_future_plus = [];
            // var customer_signed_lpo_transition = [];
            // var customer_signed_lpo_ho_generated = [];
            // var customer_signed_lpo_ap_customer = [];
            // var customer_signed_lpo_inbound_web = [];
            // var customer_signed_ho_generated = [];

            // for (var i = 0; i < customerSignedDataSet.length; i++) {
            //     month_year_customer.push(customerSignedDataSet[i][0]);
            //     customer_signed_source_zee_generatedcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][1]
            //     customer_signed_source_callcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][2]
            //     customer_signed_source_field_salescount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][3]
            //     customer_signed_source_websitecount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][4]
            //     customer_signed_total_source_countcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][14]
            //     customer_signed_source_additional_services[customerSignedDataSet[i][0]] = customerSignedDataSet[i][5]
            //     customer_signed_source_legal_campaign[customerSignedDataSet[i][0]] = customerSignedDataSet[i][6]
            //     customer_signed_other_source[customerSignedDataSet[i][0]] = customerSignedDataSet[i][7]
            //     customer_signed_future_plus[customerSignedDataSet[i][0]] = customerSignedDataSet[i][8]
            //     customer_signed_lpo_transition[customerSignedDataSet[i][0]] = customerSignedDataSet[i][9]
            //     customer_signed_lpo_ho_generated[customerSignedDataSet[i][0]] = customerSignedDataSet[i][10]
            //     customer_signed_lpo_ap_customer[customerSignedDataSet[i][0]] = customerSignedDataSet[i][11]
            //     customer_signed_lpo_inbound_web[customerSignedDataSet[i][0]] = customerSignedDataSet[i][12]
            //     customer_signed_ho_generated[customerSignedDataSet[i][0]] = customerSignedDataSet[i][13]
            // }

            // var series_data30 = [];
            // var series_data31 = [];
            // var series_data32 = [];
            // var series_data33 = [];
            // var series_data34 = [];
            // var series_data35 = [];
            // var series_data36 = [];
            // var series_data37 = [];
            // var series_data38 = [];
            // var series_data39 = [];
            // var series_data30a = [];
            // var series_data31a = [];
            // var series_data32a = [];
            // var series_data33a = [];


            // var categores_customer_signed_week = []; // creating empty array for highcharts
            // // categories
            // Object.keys(customer_signed_source_websitecount).map(function (item, key) {
            //     console.log(item)
            //     series_data30.push(parseInt(customer_signed_source_zee_generatedcount[item]));
            //     series_data31.push(parseInt(customer_signed_source_callcount[item]));
            //     series_data32.push(parseInt(customer_signed_source_field_salescount[item]));
            //     series_data33.push(parseInt(customer_signed_source_websitecount[item]));
            //     series_data34.push(parseInt(customer_signed_total_source_countcount[item]));
            //     series_data35.push(parseInt(customer_signed_source_additional_services[item]));
            //     series_data36.push(parseInt(customer_signed_source_legal_campaign[item]));
            //     series_data37.push(parseInt(customer_signed_other_source[item]));
            //     series_data38.push(parseInt(customer_signed_future_plus[item]));
            //     series_data39.push(parseInt(customer_signed_lpo_transition[item]));
            //     series_data30a.push(parseInt(customer_signed_lpo_ho_generated[item]));
            //     series_data31a.push(parseInt(customer_signed_lpo_ap_customer[item]));
            //     series_data32a.push(parseInt(customer_signed_lpo_inbound_web[item]));
            //     series_data33a.push(parseInt(customer_signed_ho_generated[item]));
            //     categores_customer_signed_week.push(item)
            // });
            // console.log('series_data37: ' + series_data37)

            // plotChartCustomerSignedSource(series_data30, series_data31,
            //     series_data32,
            //     series_data33,
            //     series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a);
            // plotChartCustomerSignedCampaign(series_data30, series_data31,
            //     series_data32,
            //     series_data33,
            //     series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a);


            // Leads - Signed - System Notes Date Weekly Reporting
            var customerListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2_6'
            });


            if (!isNullorEmpty(leadStatus)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                customerListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }


            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = customerListBySalesRepWeeklySearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));


                customerListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;


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
            var debt_set3 = [];

            customerListBySalesRepWeeklySearch.run().each(function (
                customerListBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(customerListBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = customerListBySalesRepWeeklySearchResultSet.getValue({
                    name: "date",
                    join: "systemNotes",
                    summary: "GROUP",
                });

                var customerSource = customerListBySalesRepWeeklySearchResultSet.getValue({
                    name: "leadsource",
                    summary: "GROUP"
                });

                var customerSourceText = customerListBySalesRepWeeklySearchResultSet.getText({
                    name: "leadsource",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
                    if (!isNullorEmpty(weekLeadEntered)) {
                        var splitMonthV2 = weekLeadEntered.split('/');

                        var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);

                        var firstDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 1).getDate();
                        var lastDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 0).getDate();

                        if (firstDay < 10) {
                            firstDay = '0' + firstDay;
                        }

                        // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var startDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            splitMonthV2[0];
                        var monthsStartDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            firstDay;
                        // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var lastDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            lastDay
                    } else {
                        var startDate = 'NO DATE'
                    }

                }

                if (count_customer_signed == 0) {

                    if (customerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated += parseInt(customerCount);
                    } else if (customerSource == '17') {
                        //INBOUND CALL
                        source_call += parseInt(customerCount);
                    } else if (customerSource == '239030') {
                        //FIELD SALES
                        source_field_sales += parseInt(customerCount);
                    } else if (customerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website += parseInt(customerCount);
                    } else if (customerSource == '277970') {
                        source_additional_services += parseInt(customerCount)
                    } else if (customerSource == '279095') {
                        source_legal_campaign += parseInt(customerCount)
                    } else if (customerSource == '280411') {
                        futurePlusCount += parseInt(customerCount)
                    } else if (customerSource == '281559') {
                        lpo_transition += parseInt(customerCount)
                    } else if (customerSource == '282051') {
                        lpo_ho_generated += parseInt(customerCount)
                    } else if (customerSource == '282083') {
                        lpo_ap_customer += parseInt(customerCount)
                    } else if (customerSource == '282085') {
                        lpo_inbound_web += parseInt(customerCount)
                    } else if (customerSource == '97943') {
                        ho_generated += parseInt(customerCount)
                    } else {
                        other_source += parseInt(customerCount)
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

                } else if (oldCustomerSignedDate != null &&
                    oldCustomerSignedDate == startDate) {

                    if (customerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated += parseInt(customerCount);
                    } else if (customerSource == '17') {
                        //INBOUND CALL
                        source_call += parseInt(customerCount);
                    } else if (customerSource == '239030') {
                        //FIELD SALES
                        source_field_sales += parseInt(customerCount);
                    } else if (customerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website += parseInt(customerCount);
                    } else if (customerSource == '277970') {
                        source_additional_services += parseInt(customerCount)
                    } else if (customerSource == '279095') {
                        source_legal_campaign += parseInt(customerCount)
                    } else if (customerSource == '280411') {
                        futurePlusCount += parseInt(customerCount)
                    } else if (customerSource == '281559') {
                        lpo_transition += parseInt(customerCount)
                    } else if (customerSource == '282051') {
                        lpo_ho_generated += parseInt(customerCount)
                    } else if (customerSource == '282083') {
                        lpo_ap_customer += parseInt(customerCount)
                    } else if (customerSource == '282085') {
                        lpo_inbound_web += parseInt(customerCount)
                    } else if (customerSource == '97943') {
                        ho_generated += parseInt(customerCount)
                    } else {
                        other_source += parseInt(customerCount)
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

                } else if (oldCustomerSignedDate != null &&
                    oldCustomerSignedDate != startDate) {

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
                        ho_generated: ho_generated
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


                    if (customerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated += parseInt(customerCount);
                    } else if (customerSource == '17') {
                        //INBOUND CALL
                        source_call += parseInt(customerCount);
                    } else if (customerSource == '239030') {
                        //FIELD SALES
                        source_field_sales += parseInt(customerCount);
                    } else if (customerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website += parseInt(customerCount);
                    } else if (customerSource == '277970') {
                        source_additional_services += parseInt(customerCount)
                    } else if (customerSource == '279095') {
                        source_legal_campaign += parseInt(customerCount)
                    } else if (customerSource == '280411') {
                        futurePlusCount += parseInt(customerCount)
                    } else if (customerSource == '281559') {
                        lpo_transition += parseInt(customerCount)
                    } else if (customerSource == '282051') {
                        lpo_ho_generated += parseInt(customerCount)
                    } else if (customerSource == '282083') {
                        lpo_ap_customer += parseInt(customerCount)
                    } else if (customerSource == '282085') {
                        lpo_inbound_web += parseInt(customerCount)
                    } else if (customerSource == '97943') {
                        ho_generated += parseInt(customerCount)
                    } else {
                        other_source += parseInt(customerCount)
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;
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
                    ho_generated: ho_generated
                });
            }

            console.log('debt_set3: ' + JSON.stringify(debt_set3));

            var customerSignedDataSet = [];
            if (!isNullorEmpty(debt_set3)) {
                debt_set3
                    .forEach(function (preview_row, index) {

                        customerSignedDataSet.push([preview_row.dateUsed,
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
                        preview_row.total_source_count
                        ]);

                    });
            }
            console.log('customerSignedDataSet: ' + customerSignedDataSet)

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

            for (var i = 0; i < customerSignedDataSet.length; i++) {
                month_year_customer.push(customerSignedDataSet[i][0]);
                customer_signed_source_zee_generatedcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][1]
                customer_signed_source_callcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][2]
                customer_signed_source_field_salescount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][3]
                customer_signed_source_websitecount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][4]
                customer_signed_total_source_countcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][14]
                customer_signed_source_additional_services[customerSignedDataSet[i][0]] = customerSignedDataSet[i][5]
                customer_signed_source_legal_campaign[customerSignedDataSet[i][0]] = customerSignedDataSet[i][6]
                customer_signed_other_source[customerSignedDataSet[i][0]] = customerSignedDataSet[i][7]
                customer_signed_future_plus[customerSignedDataSet[i][0]] = customerSignedDataSet[i][8]
                customer_signed_lpo_transition[customerSignedDataSet[i][0]] = customerSignedDataSet[i][9]
                customer_signed_lpo_ho_generated[customerSignedDataSet[i][0]] = customerSignedDataSet[i][10]
                customer_signed_lpo_ap_customer[customerSignedDataSet[i][0]] = customerSignedDataSet[i][11]
                customer_signed_lpo_inbound_web[customerSignedDataSet[i][0]] = customerSignedDataSet[i][12]
                customer_signed_ho_generated[customerSignedDataSet[i][0]] = customerSignedDataSet[i][13]
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


            var categores_customer_signed_week = []; // creating empty array for highcharts
            // categories
            Object.keys(customer_signed_source_websitecount).map(function (item, key) {
                console.log(item)
                series_data30.push(parseInt(customer_signed_source_zee_generatedcount[item]));
                series_data31.push(parseInt(customer_signed_source_callcount[item]));
                series_data32.push(parseInt(customer_signed_source_field_salescount[item]));
                series_data33.push(parseInt(customer_signed_source_websitecount[item]));
                series_data34.push(parseInt(customer_signed_total_source_countcount[item]));
                series_data35.push(parseInt(customer_signed_source_additional_services[item]));
                series_data36.push(parseInt(customer_signed_source_legal_campaign[item]));
                series_data37.push(parseInt(customer_signed_other_source[item]));
                series_data38.push(parseInt(customer_signed_future_plus[item]));
                series_data39.push(parseInt(customer_signed_lpo_transition[item]));
                series_data30a.push(parseInt(customer_signed_lpo_ho_generated[item]));
                series_data31a.push(parseInt(customer_signed_lpo_ap_customer[item]));
                series_data32a.push(parseInt(customer_signed_lpo_inbound_web[item]));
                series_data33a.push(parseInt(customer_signed_ho_generated[item]));
                categores_customer_signed_week.push(item)
            });
            console.log('series_data37: ' + series_data37)

            plotChartCustomerSigned(series_data30, series_data31,
                series_data32,
                series_data33,
                series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a);

            // Leads - Trial - Last Assigned
            var customerTrialListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2_18'
            });


            if (!isNullorEmpty(leadStatus)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                customerTrialListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = customerTrialListBySalesRepWeeklySearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

                customerTrialListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;


            }


            total_customer_signed = 0;
            var count_customer_signed = 0;
            var oldLastAssigned = null;
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
            var oldSalesRecordInternalId = null;
            var oldCustomerInternalId = 0;

            customerTrialListBySalesRepWeeklySearch.run().each(function (
                customerTrialListBySalesRepWeeklySearchResultSet) {


                // var customerCount = parseInt(customerTrialListBySalesRepWeeklySearchResultSet.getValue({
                //     name: 'internalid',
                //     summary: 'COUNT'
                // }));
                var lastAssigned = customerTrialListBySalesRepWeeklySearchResultSet.getText({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });

                var customerInternalId = customerTrialListBySalesRepWeeklySearchResultSet.getValue({
                    name: "internalid",
                    summary: "GROUP",
                });

                var customerSource = customerTrialListBySalesRepWeeklySearchResultSet.getValue({
                    name: "leadsource",
                    summary: "GROUP"
                });

                var customerSourceText = customerTrialListBySalesRepWeeklySearchResultSet.getText({
                    name: "leadsource",
                    summary: "GROUP"
                });

                if (count_customer_signed == 0) {


                } else if (oldCustomerInternalId != null &&
                    oldCustomerInternalId == customerInternalId) {



                } else if (oldCustomerInternalId != null &&
                    oldCustomerInternalId != customerInternalId) {

                    console.log('oldCustomerInternalId' + oldCustomerInternalId)
                    console.log('oldCustomerSource' + oldCustomerSource)

                    if (oldCustomerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated++;
                    } else if (oldCustomerSource == '17') {
                        //INBOUND CALL
                        source_call++;
                    } else if (oldCustomerSource == '239030') {
                        //FIELD SALES
                        source_field_sales++;
                    } else if (oldCustomerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website++;
                    } else if (oldCustomerSource == '277970') {
                        source_additional_services++;
                    } else if (oldCustomerSource == '279095') {
                        source_legal_campaign++;
                    } else if (oldCustomerSource == '280411') {
                        futurePlusCount++;
                    } else if (oldCustomerSource == '281559') {
                        lpo_transition++;
                    } else if (oldCustomerSource == '282051') {
                        lpo_ho_generated++;
                    } else if (oldCustomerSource == '282083') {
                        lpo_ap_customer++;
                    } else if (oldCustomerSource == '282085') {
                        lpo_inbound_web++;
                    } else if (oldCustomerSource == '97943') {
                        ho_generated++;
                    } else {
                        other_source++;
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

                    debt_setTrial.push({
                        dateUsed: oldLastAssigned,
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
                        ho_generated: ho_generated
                    });

                    console.log('debt_setTrial(' + oldLastAssigned + ')' + debt_setTrial)

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


                }

                // oldCustomerCount = customerCount;
                oldCustomerSource = customerSource;
                oldLastAssigned = lastAssigned;
                oldCustomerInternalId = customerInternalId;
                count_customer_signed++;
                return true;
            });

            if (count_customer_signed > 0) {


                if (oldCustomerSource == '-4') {
                    //ZEE GENERATED
                    source_zee_generated++;
                } else if (oldCustomerSource == '17') {
                    //INBOUND CALL
                    source_call++;
                } else if (oldCustomerSource == '239030') {
                    //FIELD SALES
                    source_field_sales++;
                } else if (oldCustomerSource == '254557') {
                    //INBOUND - NEW WEBSITE
                    source_website++;
                } else if (oldCustomerSource == '277970') {
                    source_additional_services++;
                } else if (oldCustomerSource == '279095') {
                    source_legal_campaign++;
                } else if (oldCustomerSource == '280411') {
                    futurePlusCount++;
                } else if (oldCustomerSource == '281559') {
                    lpo_transition++;
                } else if (oldCustomerSource == '282051') {
                    lpo_ho_generated++;
                } else if (oldCustomerSource == '282083') {
                    lpo_ap_customer++;
                } else if (oldCustomerSource == '282085') {
                    lpo_inbound_web++;
                } else if (oldCustomerSource == '97943') {
                    ho_generated++;
                } else {
                    other_source++;
                }

                total_source_count =
                    source_zee_generated +
                    source_call +
                    source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

                debt_setTrial.push({
                    dateUsed: oldLastAssigned,
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
                    ho_generated: ho_generated
                });
            }

            console.log('debt_setTrial: ' + JSON.stringify(debt_setTrial));

            var customerTrialDataSet = [];
            if (!isNullorEmpty(debt_setTrial)) {
                debt_setTrial
                    .forEach(function (preview_row, index) {

                        customerTrialDataSet.push([preview_row.dateUsed,//0
                        preview_row.source_zee_generated,//1
                        preview_row.source_call,//2
                        preview_row.source_field_sales,//3
                        preview_row.source_website,//4
                        preview_row.source_additional_services,//5
                        preview_row.source_legal_campaign,//6
                        preview_row.other_source,//7
                        preview_row.futurePlusCount,//8
                        preview_row.lpo_transition,//9
                        preview_row.lpo_ho_generated,//10
                        preview_row.lpo_ap_customer,//11
                        preview_row.lpo_inbound_web,//12
                        preview_row.ho_generated,//13
                        preview_row.total_source_count//14
                        ]);

                    });
            }
            console.log('customerTrialDataSet: ' + customerTrialDataSet)

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
                customer_trial_source_zee_generatedcount[customerTrialDataSet[i][0]] = customerTrialDataSet[i][1]
                customer_trial_source_callcount[customerTrialDataSet[i][0]] = customerTrialDataSet[i][2]
                customer_trial_source_field_salescount[customerTrialDataSet[i][0]] = customerTrialDataSet[i][3]
                customer_trial_source_websitecount[customerTrialDataSet[i][0]] = customerTrialDataSet[i][4]
                customer_trial_total_source_countcount[customerTrialDataSet[i][0]] = customerTrialDataSet[i][14]
                customer_trial_source_additional_services[customerTrialDataSet[i][0]] = customerTrialDataSet[i][5]
                customer_trial_source_legal_campaign[customerTrialDataSet[i][0]] = customerTrialDataSet[i][6]
                customer_trial_other_source[customerTrialDataSet[i][0]] = customerTrialDataSet[i][7]
                customer_trial_future_plus[customerTrialDataSet[i][0]] = customerTrialDataSet[i][8]
                customer_trial_lpo_transition[customerTrialDataSet[i][0]] = customerTrialDataSet[i][9]
                customer_trial_lpo_ho_generated[customerTrialDataSet[i][0]] = customerTrialDataSet[i][10]
                customer_trial_lpo_ap_customer[customerTrialDataSet[i][0]] = customerTrialDataSet[i][11]
                customer_trial_lpo_inbound_web[customerTrialDataSet[i][0]] = customerTrialDataSet[i][12]
                customer_trial_ho_generated[customerTrialDataSet[i][0]] = customerTrialDataSet[i][13]
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
            Object.keys(customer_trial_total_source_countcount).map(function (item, key) {
                console.log(item)
                series_trial_data30.push(parseInt(customer_trial_source_zee_generatedcount[item]));
                series_trial_data31.push(parseInt(customer_trial_source_callcount[item]));
                series_trial_data32.push(parseInt(customer_trial_source_field_salescount[item]));
                series_trial_data33.push(parseInt(customer_trial_source_websitecount[item]));
                series_trial_data34.push(parseInt(customer_trial_total_source_countcount[item]));
                series_trial_data35.push(parseInt(customer_trial_source_additional_services[item]));
                series_trial_data36.push(parseInt(customer_trial_source_legal_campaign[item]));
                series_trial_data37.push(parseInt(customer_trial_other_source[item]));
                series_trial_data38.push(parseInt(customer_trial_future_plus[item]));
                series_trial_data39.push(parseInt(customer_trial_lpo_transition[item]));
                series_trial_data30a.push(parseInt(customer_trial_lpo_ho_generated[item]));
                series_trial_data31a.push(parseInt(customer_trial_lpo_ap_customer[item]));
                series_trial_data32a.push(parseInt(customer_trial_lpo_inbound_web[item]));
                series_trial_data33a.push(parseInt(customer_trial_ho_generated[item]));
                categores_customer_trial_week.push(item)
            });
            console.log('series_trial_data37: ' + series_trial_data37)

            plotChartTrialCustomerSigned(series_trial_data30, series_trial_data31,
                series_trial_data32,
                series_trial_data33,
                series_trial_data34, series_trial_data35, series_trial_data36, series_trial_data37, categores_customer_trial_week, series_trial_data38, series_trial_data39, series_trial_data30a, series_trial_data31a, series_trial_data32a, series_trial_data33a);


            //! Update the Search to exlcude Change of Entity & Relocation source

            //Leads - Trial Pending - Last Assigned
            var customerTrialPendingListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2_19'
            });


            if (!isNullorEmpty(leadStatus)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                customerTrialPendingListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = customerTrialPendingListBySalesRepWeeklySearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));

                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

                customerTrialPendingListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;


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

            customerTrialPendingListBySalesRepWeeklySearch.run().each(function (
                customerTrialPendingListBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(customerTrialPendingListBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = customerTrialPendingListBySalesRepWeeklySearchResultSet.getText({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });

                var customerSource = customerTrialPendingListBySalesRepWeeklySearchResultSet.getValue({
                    name: "leadsource",
                    summary: "GROUP"
                });

                var customerSourceText = customerTrialPendingListBySalesRepWeeklySearchResultSet.getText({
                    name: "leadsource",
                    summary: "GROUP"
                });


                if (count_customer_signed == 0) {

                    if (customerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated += parseInt(customerCount);
                    } else if (customerSource == '17') {
                        //INBOUND CALL
                        source_call += parseInt(customerCount);
                    } else if (customerSource == '239030') {
                        //FIELD SALES
                        source_field_sales += parseInt(customerCount);
                    } else if (customerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website += parseInt(customerCount);
                    } else if (customerSource == '277970') {
                        source_additional_services += parseInt(customerCount)
                    } else if (customerSource == '279095') {
                        source_legal_campaign += parseInt(customerCount)
                    } else if (customerSource == '280411') {
                        futurePlusCount += parseInt(customerCount)
                    } else if (customerSource == '281559') {
                        lpo_transition += parseInt(customerCount)
                    } else if (customerSource == '282051') {
                        lpo_ho_generated += parseInt(customerCount)
                    } else if (customerSource == '282083') {
                        lpo_ap_customer += parseInt(customerCount)
                    } else if (customerSource == '282085') {
                        lpo_inbound_web += parseInt(customerCount)
                    } else if (customerSource == '97943') {
                        ho_generated += parseInt(customerCount)
                    } else {
                        other_source += parseInt(customerCount)
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

                } else if (oldCustomerSignedDate != null &&
                    oldCustomerSignedDate == weekLeadEntered) {

                    if (customerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated += parseInt(customerCount);
                    } else if (customerSource == '17') {
                        //INBOUND CALL
                        source_call += parseInt(customerCount);
                    } else if (customerSource == '239030') {
                        //FIELD SALES
                        source_field_sales += parseInt(customerCount);
                    } else if (customerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website += parseInt(customerCount);
                    } else if (customerSource == '277970') {
                        source_additional_services += parseInt(customerCount)
                    } else if (customerSource == '279095') {
                        source_legal_campaign += parseInt(customerCount)
                    } else if (customerSource == '280411') {
                        futurePlusCount += parseInt(customerCount)
                    } else if (customerSource == '281559') {
                        lpo_transition += parseInt(customerCount)
                    } else if (customerSource == '282051') {
                        lpo_ho_generated += parseInt(customerCount)
                    } else if (customerSource == '282083') {
                        lpo_ap_customer += parseInt(customerCount)
                    } else if (customerSource == '282085') {
                        lpo_inbound_web += parseInt(customerCount)
                    } else if (customerSource == '97943') {
                        ho_generated += parseInt(customerCount)
                    } else {
                        other_source += parseInt(customerCount)
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;

                } else if (oldCustomerSignedDate != null &&
                    oldCustomerSignedDate != weekLeadEntered) {

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
                        ho_generated: ho_generated
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


                    if (customerSource == '-4') {
                        //ZEE GENERATED
                        source_zee_generated += parseInt(customerCount);
                    } else if (customerSource == '17') {
                        //INBOUND CALL
                        source_call += parseInt(customerCount);
                    } else if (customerSource == '239030') {
                        //FIELD SALES
                        source_field_sales += parseInt(customerCount);
                    } else if (customerSource == '254557') {
                        //INBOUND - NEW WEBSITE
                        source_website += parseInt(customerCount);
                    } else if (customerSource == '277970') {
                        source_additional_services += parseInt(customerCount)
                    } else if (customerSource == '279095') {
                        source_legal_campaign += parseInt(customerCount)
                    } else if (customerSource == '280411') {
                        futurePlusCount += parseInt(customerCount)
                    } else if (customerSource == '281559') {
                        lpo_transition += parseInt(customerCount)
                    } else if (customerSource == '282051') {
                        lpo_ho_generated += parseInt(customerCount)
                    } else if (customerSource == '282083') {
                        lpo_ap_customer += parseInt(customerCount)
                    } else if (customerSource == '282085') {
                        lpo_inbound_web += parseInt(customerCount)
                    } else if (customerSource == '97943') {
                        ho_generated += parseInt(customerCount)
                    } else {
                        other_source += parseInt(customerCount)
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services + source_legal_campaign + other_source + futurePlusCount + lpo_transition + lpo_ho_generated + lpo_ap_customer + lpo_inbound_web + ho_generated;
                }

                oldCustomerCount = customerCount;
                oldCustomerSource = customerSource;
                oldCustomerSignedDate = weekLeadEntered;
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
                    ho_generated: ho_generated
                });
            }

            console.log('debt_setTrialPending: ' + JSON.stringify(debt_setTrialPending));

            var customerTrialPendingDataSet = [];
            if (!isNullorEmpty(debt_setTrialPending)) {
                debt_setTrialPending
                    .forEach(function (preview_row, index) {

                        customerTrialPendingDataSet.push([preview_row.dateUsed,//0
                        preview_row.source_zee_generated,//1
                        preview_row.source_call,//2
                        preview_row.source_field_sales,//3
                        preview_row.source_website,//4
                        preview_row.source_additional_services,//5
                        preview_row.source_legal_campaign,//6
                        preview_row.other_source,//7
                        preview_row.futurePlusCount,//8
                        preview_row.lpo_transition,//9
                        preview_row.lpo_ho_generated,//10
                        preview_row.lpo_ap_customer,//11
                        preview_row.lpo_inbound_web,//12
                        preview_row.ho_generated,//13
                        preview_row.total_source_count//14
                        ]);

                    });
            }
            console.log('customerTrialPendingDataSet: ' + customerTrialPendingDataSet)

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
                customer_trial_pending_source_zee_generatedcount[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][1]
                customer_trial_pending_source_callcount[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][2]
                customer_trial_pending_source_field_salescount[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][3]
                customer_trial_pending_source_websitecount[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][4]
                customer_trial_pending_total_source_countcount[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][14]
                customer_trial_pending_source_additional_services[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][5]
                customer_trial_pending_source_legal_campaign[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][6]
                customer_trial_pending_other_source[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][7]
                customer_trial_pending_future_plus[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][8]
                customer_trial_pending_lpo_transition[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][9]
                customer_trial_pending_lpo_ho_generated[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][10]
                customer_trial_pending_lpo_ap_customer[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][11]
                customer_trial_pending_lpo_inbound_web[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][12]
                customer_trial_pending_ho_generated[customerTrialPendingDataSet[i][0]] = customerTrialPendingDataSet[i][13]
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
            Object.keys(customer_trial_pending_total_source_countcount).map(function (item, key) {
                console.log(item)
                series_trial_pending_data30.push(parseInt(customer_trial_pending_source_zee_generatedcount[item]));
                series_trial_pending_data31.push(parseInt(customer_trial_pending_source_callcount[item]));
                series_trial_pending_data32.push(parseInt(customer_trial_pending_source_field_salescount[item]));
                series_trial_pending_data33.push(parseInt(customer_trial_pending_source_websitecount[item]));
                series_trial_pending_data34.push(parseInt(customer_trial_pending_total_source_countcount[item]));
                series_trial_pending_data35.push(parseInt(customer_trial_pending_source_additional_services[item]));
                series_trial_pending_data36.push(parseInt(customer_trial_pending_source_legal_campaign[item]));
                series_trial_pending_data37.push(parseInt(customer_trial_pending_other_source[item]));
                series_trial_pending_data38.push(parseInt(customer_trial_pending_future_plus[item]));
                series_trial_pending_data39.push(parseInt(customer_trial_pending_lpo_transition[item]));
                series_trial_pending_data30a.push(parseInt(customer_trial_pending_lpo_ho_generated[item]));
                series_trial_pending_data31a.push(parseInt(customer_trial_pending_lpo_ap_customer[item]));
                series_trial_pending_data32a.push(parseInt(customer_trial_pending_lpo_inbound_web[item]));
                series_trial_pending_data33a.push(parseInt(customer_trial_pending_ho_generated[item]));
                categores_customer_trial_pending_week.push(item)
            });
            console.log('series_trial_pending_data37: ' + series_trial_pending_data37)

            plotChartTrialPendingCustomerSigned(series_trial_pending_data30, series_trial_pending_data31,
                series_trial_pending_data32,
                series_trial_pending_data33,
                series_trial_pending_data34, series_trial_pending_data35, series_trial_pending_data36, series_trial_pending_data37, categores_customer_trial_pending_week, series_trial_pending_data38, series_trial_pending_data39, series_trial_pending_data30a, series_trial_pending_data31a, series_trial_pending_data32a, series_trial_pending_data33a);
            // loadDatatable(debt_set, debt_set2);



            // Leads - Prospect Quote Sent - System Notes Date Weekly Reporting
            var prospectOpportunityWeeklyReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2_20'
            });


            if (!isNullorEmpty(leadStatus)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }



            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                prospectOpportunityWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                var defaultSearchFilters = prospectOpportunityWeeklyReportingSearch.filterExpression;

                console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));


                var modifiedDateFilters = [["systemnotes.field", "anyof", "CUSTJOB.KENTITYSTATUS"], "AND", ["systemnotes.name", "anyof", salesRecordLastAssignedListIds], "AND", ["systemnotes.date", "within", [modified_date_from, modified_date_to]]]
                console.log('modifiedDateFilters filters: ' + JSON.stringify(modifiedDateFilters));

                defaultSearchFilters.push('AND');
                defaultSearchFilters.push(modifiedDateFilters);

                console.log('defaultSearchFilters filters: ' + JSON.stringify(defaultSearchFilters));

                prospectOpportunityWeeklyReportingSearch.filterExpression = defaultSearchFilters;

            }

            var count2 = 0;
            var oldDate2 = null;

            total_prospect_count = 0;
            prospecy_quote_sent = 0;
            prospect_no_answer = 0;
            prospect_in_contact = 0;
            var prospect_opportunity = 0;


            prospectOpportunityWeeklyReportingSearch.run().each(function (
                prospectOpportunityWeeklyReportingSearchResultSet) {


                var prospectCount = parseInt(prospectOpportunityWeeklyReportingSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = prospectOpportunityWeeklyReportingSearchResultSet.getValue({
                    name: "date",
                    join: "systemNotes",
                    summary: "GROUP",
                });
                var custStatus = parseInt(prospectOpportunityWeeklyReportingSearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                }));
                var custStatusText = prospectOpportunityWeeklyReportingSearchResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
                    if (!isNullorEmpty(weekLeadEntered)) {
                        var splitMonthV2 = weekLeadEntered.split('/');

                        var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);


                        var firstDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 1).getDate();
                        var lastDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 0).getDate();

                        if (firstDay < 10) {
                            firstDay = '0' + firstDay;
                        }

                        // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var startDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            splitMonthV2[0];
                        var monthsStartDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            firstDay;
                        // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var lastDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                            lastDay
                    } else {
                        var startDate = 'NO DATE'
                    }

                }

                debt_set6.push({
                    dateUsed: startDate,
                    prospect_quote: prospectCount,
                    total_prospect_count: prospectCount
                });

                return true;
            });

            previewDataSet2 = [];
            csvPreviewSet2 = [];

            console.log('debt_set6: ' + debt_set6);


            if (!isNullorEmpty(debt_set6)) {
                debt_set6
                    .forEach(function (preview_row, index) {

                        previewDataSet2.push([preview_row.dateUsed,
                        preview_row.prospect_quote,
                        preview_row.total_prospect_count
                        ]);

                    });
            }

            console.log('previewDataSet2: ' + previewDataSet2);

            var month_year = []; // creating array for storing browse

            var prospect_quote = [];
            var total_prospects_leads = [];

            for (var i = 0; i < previewDataSet2.length; i++) {
                month_year.push(previewDataSet2[i][0]);
                prospect_quote[previewDataSet2[i][0]] = previewDataSet2[i][1]
                total_prospects_leads[previewDataSet2[i][0]] = previewDataSet2[i][2]
            }

            var series_data143 = [];
            var series_data144 = [];

            var categores5 = []; // creating empty array for highcharts
            // categories
            Object.keys(prospect_quote).map(function (item, key) {

                series_data143.push(parseInt(total_prospects_leads[item]));
                series_data144.push(parseInt(prospect_quote[item]));
                categores5.push(item)
            });


            plotChartProspectsQuotes(
                series_data143, series_data144, categores5);


            debt_set = [];
            debt_set2 = [];

        }

        function createChild(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];

            // console.log('customer child row: ' + row.data()[19]);

            row.data()[20].forEach(function (el) {
                if (!isNullorEmpty(el)) {
                    var invoiceURL = '';
                    childSet.push([el.invoiceDocumentNumber, el.invoiceDate, el.invoiceType, el.invoiceAmount, el.invoiceStatus
                    ]);
                }
            });
            // Display it the child row
            row.child(table).show();

            // Initialise as a DataTable
            var usersTable = table.DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bInfo": false,
                "bAutoWidth": false,
                data: childSet,
                order: [1, 'desc'],
                columns: [
                    { title: 'Invoice Number' },
                    { title: 'Invoice Date' },
                    { title: 'Invoice Type' },
                    { title: 'Invoice Amount' },
                    { title: 'Invoice Status' }
                ],
                columnDefs: [],
                rowCallback: function (row, data) {

                    if (data[4] == 'Paid In Full') {
                        $('td', row).css('background-color', '#C7F2A4');
                    }
                }
            });
        }

        function createChildTrialCustomers(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];

            console.log('customer free trial child row: ' + row.data()[16]);

            row.data()[18].forEach(function (el) {
                if (!isNullorEmpty(el)) {
                    var invoiceURL = '';
                    childSet.push([el.invoiceDocumentNumber, el.invoiceDate, el.invoiceType, el.invoiceAmount, el.invoiceStatus
                    ]);
                }
            });
            // Display it the child row
            row.child(table).show();

            // Initialise as a DataTable
            var usersTable = table.DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bInfo": false,
                "bAutoWidth": false,
                data: childSet,
                order: [1, 'desc'],
                columns: [
                    { title: 'Invoice Number' },
                    { title: 'Invoice Date' },
                    { title: 'Invoice Type' },
                    { title: 'Invoice Amount' },
                    { title: 'Invoice Status' }
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                }
            });
        }

        function createChildTrialPendingCustomers(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];

            console.log('customer free trial child row: ' + row.data()[16]);

            row.data()[18].forEach(function (el) {
                if (!isNullorEmpty(el)) {
                    var invoiceURL = '';
                    childSet.push([el.invoiceDocumentNumber, el.invoiceDate, el.invoiceType, el.invoiceAmount, el.invoiceStatus
                    ]);
                }
            });
            // Display it the child row
            row.child(table).show();

            // Initialise as a DataTable
            var usersTable = table.DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bInfo": false,
                "bAutoWidth": false,
                data: childSet,
                order: [1, 'desc'],
                columns: [
                    { title: 'Invoice Number' },
                    { title: 'Invoice Date' },
                    { title: 'Invoice Type' },
                    { title: 'Invoice Amount' },
                    { title: 'Invoice Status' }
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                }
            });
        }

        function createChildExisting(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];

            // console.log('customer child row: ' + row.data()[19]);

            row.data()[20].forEach(function (el) {
                if (!isNullorEmpty(el)) {
                    var invoiceURL = '';
                    childSet.push([el.invoiceDocumentNumber, el.invoiceDate, el.invoiceType, el.invoiceAmount, el.invoiceStatus
                    ]);
                }
            });
            // Display it the child row
            row.child(table).show();

            // Initialise as a DataTable
            var usersTable = table.DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bInfo": false,
                "bAutoWidth": false,
                data: childSet,
                order: [1, 'desc'],
                columns: [
                    { title: 'Invoice Number' },
                    { title: 'Invoice Date' },
                    { title: 'Invoice Type' },
                    { title: 'Invoice Amount' },
                    { title: 'Invoice Status' }
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                    if (data[4] == 'Paid In Full') {
                        $('td', row).css('background-color', '#C7F2A4');
                    }
                }
            });
        }

        function createChildSalesRepTimeline(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];

            console.log('customer free trial child row: ' + row.data()[16]);

            row.data()[6].forEach(function (el) {
                if (!isNullorEmpty(el)) {
                    var invoiceURL = '';
                    childSet.push([el.systemNotesDate, el.oldStatus, el.timeInStatusDays, el.newStatus
                    ]);
                }
            });
            // Display it the child row
            row.child(table).show();

            // Initialise as a DataTable
            var usersTable = table.DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bInfo": false,
                "bAutoWidth": false,
                data: childSet,
                order: [0, 'asc'],
                columns: [
                    { title: 'DATE' },
                    { title: 'OLD STATUS' },
                    { title: 'DAYS IN OLD STATUS' },
                    { title: 'NEW STATUS' },
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                }
            });
        }

        function createChild2(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[15].forEach(function (el) {

                if (!isNullorEmpty(el)) {
                    childSet.push([el.activityInternalID, el.activityStartDate, el.activityTitle, el.activityOrganiser, el.activityMessage
                    ]);
                }
            });
            // Display it the child row
            row.child(table).show();

            // Initialise as a DataTable
            var usersTable = table.DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bFilter": false,
                "bInfo": false,
                "bAutoWidth": false,
                data: childSet,
                order: [1, 'desc'],
                columns: [
                    { title: 'Internal Id ' },
                    { title: 'Date' },
                    { title: 'Title' },
                    { title: 'Organiser' },
                    { title: 'Message' }
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                }
            });
        }

        function destroyChild(row) {
            // And then hide the row
            row.child.hide();
        }

        function plotSalesRepChart(series_data, series_data2, categores) {
            Highcharts.chart('container_entered_sales_rep_preview', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Sales Rep Assigned - Status Change By',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotZeeGeneratedSalesRepChart(series_data, series_data2, categores) {
            Highcharts.chart('container_zee_overview_last_assigned', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Franchisee - Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotSalesRepChartCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_campaign_sales_rep_preview', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Sales Rep Assigned - Status Change By',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a, series_data26a, series_data27a, series_data28a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_preview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Leads - By Status - Week Status Changed Activity',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Customer - Signed',
                    data: series_data20,
                    color: '#439A97',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial',
                    data: series_data23a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial Pending',
                    data: series_data27a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - Quote Sent',
                    data: series_data26,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Opportunity',
                    data: series_data31,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Qualified',
                    data: series_data26a,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - New',
                    data: series_data34,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Hot Lead',
                    data: series_data21,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Qualified',
                    data: series_data20a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Unqualified',
                    data: series_data28a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Validated',
                    data: series_data22a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Reassign',
                    data: series_data22,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Follow Up',
                    data: series_data33,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - LPO Follow Up',
                    data: series_data21a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - No Answer',
                    data: series_data24a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - In Contact',
                    data: series_data25a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Parking Lot',
                    data: series_data25,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - In Contact',
                    data: series_data28,
                    color: '#59C1BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Lost',
                    data: series_data23,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Out of Territory',
                    data: series_data32,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer - Lost',
                    data: series_data24,
                    color: '#e86252',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotLPOChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a, series_data26a, series_data27a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_lpo_overview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'LPO Leads - By Status - Parent LPO\'s',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Customer - Signed',
                    data: series_data20,
                    color: '#439A97',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial',
                    data: series_data23a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial Pending',
                    data: series_data27a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - Quote Sent',
                    data: series_data26,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Opportunity',
                    data: series_data31,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Qualified',
                    data: series_data26a,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - New',
                    data: series_data34,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Hot Lead',
                    data: series_data21,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Qualified',
                    data: series_data20a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Validated',
                    data: series_data22a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Reassign',
                    data: series_data22,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Follow Up',
                    data: series_data33,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - LPO Follow Up',
                    data: series_data21a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - No Answer',
                    data: series_data24a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - In Contact',
                    data: series_data25a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Parking Lot',
                    data: series_data25,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - In Contact',
                    data: series_data28,
                    color: '#59C1BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Lost',
                    data: series_data23,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Out of Territory',
                    data: series_data32,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer - Lost',
                    data: series_data24,
                    color: '#e86252',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotZeeChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a, series_data26a, series_data27a, zee_series_data28a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_zee_overview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Franchisee Leads - By Status',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Customer - Signed',
                    data: series_data20,
                    color: '#439A97',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial',
                    data: series_data23a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial Pending',
                    data: series_data27a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - Quote Sent',
                    data: series_data26,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Opportunity',
                    data: series_data31,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Qualified',
                    data: series_data26a,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - New',
                    data: series_data34,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Hot Lead',
                    data: series_data21,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Qualified',
                    data: series_data20a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                },
                {
                    name: 'Suspect - Unqualified',
                    data: zee_series_data28a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                },
                {
                    name: 'Suspect - Validated',
                    data: series_data22a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Reassign',
                    data: series_data22,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Follow Up',
                    data: series_data33,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - LPO Follow Up',
                    data: series_data21a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - No Answer',
                    data: series_data24a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - In Contact',
                    data: series_data25a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Parking Lot',
                    data: series_data25,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - In Contact',
                    data: series_data28,
                    color: '#59C1BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Lost',
                    data: series_data23,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Out of Territory',
                    data: series_data32,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer - Lost',
                    data: series_data24,
                    color: '#e86252',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotSalesRepChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a, series_data26a, series_data27a, series_data28a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_salesrep_overview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Leads - By Sales Rep & Status',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Customer - Signed',
                    data: series_data20,
                    color: '#439A97',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial',
                    data: series_data23a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial Pending',
                    data: series_data27a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - Quote Sent',
                    data: series_data26,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Opportunity',
                    data: series_data31,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Qualified',
                    data: series_data25a,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - New',
                    data: series_data34,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Hot Lead',
                    data: series_data21,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Qualified',
                    data: series_data20a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Unqualified',
                    data: series_data28a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Validated',
                    data: series_data22a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Reassign',
                    data: series_data22,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Follow Up',
                    data: series_data33,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - LPO Follow Up',
                    data: series_data21a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - No Answer',
                    data: series_data24a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - In Contact',
                    data: series_data25a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Parking Lot',
                    data: series_data25,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - In Contact',
                    data: series_data28,
                    color: '#59C1BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Lost',
                    data: series_data23,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Out of Territory',
                    data: series_data32,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer - Lost',
                    data: series_data24,
                    color: '#e86252',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotDataCaptureChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a, series_data26a, series_data27a, series_data28a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_datacapture_overview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                }, title: {
                    text: 'Leads - By Data Capture Team & Status',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Customer - Signed',
                    data: series_data20,
                    color: '#439A97',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial',
                    data: series_data23a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Customer - Free Trial Pending',
                    data: series_data27a,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - Quote Sent',
                    data: series_data26,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Opportunity',
                    data: series_data31,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospects - Qualified',
                    data: series_data25a,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - New',
                    data: series_data34,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Hot Lead',
                    data: series_data21,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Qualified',
                    data: series_data20a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Unqualified',
                    data: series_data28a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Validated',
                    data: series_data22a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Reassign',
                    data: series_data22,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Follow Up',
                    data: series_data33,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - LPO Follow Up',
                    data: series_data21a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - No Answer',
                    data: series_data24a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - In Contact',
                    data: series_data25a,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Parking Lot',
                    data: series_data25,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - In Contact',
                    data: series_data28,
                    color: '#59C1BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Lost',
                    data: series_data23,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Out of Territory',
                    data: series_data32,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer - Lost',
                    data: series_data24,
                    color: '#e86252',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSignedByLastAssigned(series_data, series_data2, categores) {
            Highcharts.chart('container_last_assigned', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Lead Entered - Lead Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartFreeTrialByLastAssigned(series_data, series_data2, categores) {
            Highcharts.chart('container_trial_last_assigned', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Lead Entered - Lead Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartFreeTrialPendingByLastAssigned(series_data, series_data2, categores) {
            Highcharts.chart('container_trial_pending_last_assigned', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Lead Entered - Lead Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartSignedByCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_signed_campaign', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Signed',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartFreeTrialByCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_trial_campaign', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Free Trial',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartFreeTrialPendingByCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_trial_pending_campaign', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Free Trial Pending',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }


        function plotChartSignedBySource(series_data, series_data2, categores) {
            Highcharts.chart('container_signed_source', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Signed',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartFreeTrialBySource(series_data, series_data2, categores) {
            Highcharts.chart('container_trial_source', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Free Trial',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartFreeTrialPendingBySource(series_data, series_data2, categores) {
            Highcharts.chart('container_trial_pending_source', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Free Trial Pending',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }


        function plotChart(series_data, series_data2, categores) {
            Highcharts.chart('container_source_preview', {
                chart: {
                    height: (8 / 16 * 100) + '%',
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By User Status Change - Lead Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartDataCaptureOverview(series_data, series_data2, categores) {
            Highcharts.chart('container_source_datacapture_preview', {
                chart: {
                    height: (8 / 16 * 100) + '%',
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - - By User Status Change - Lead Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_campaign_preview', {
                chart: {
                    height: (8 / 16 * 100) + '%',
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By User Status Change -  Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartDataCaptureOverviewCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_campaign_datacapture_preview', {
                chart: {
                    height: (8 / 16 * 100) + '%',
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By User Status Change -  Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartLPOCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_lpo_campaign_datacapture_preview', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By User Status Change - Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartLPOSource(series_data, series_data2, categores) {
            Highcharts.chart('container_lpo_source_datacapture_preview', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By User Status Change - Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Status Changes',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartCustomerSigned(series_data30, series_data31,
            series_data32,
            series_data33,
            series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_customer', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Customer Signed by Source - Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    }
                },
                xAxis: {
                    categories: categores_customer_signed_week,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '10px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Franchisee Generated',
                    data: series_data30,
                    color: '#FFD4B2',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Call',
                    data: series_data31,
                    color: '#FFF6BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Field Sales',
                    data: series_data32,
                    color: '#CEEDC7',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Website',
                    data: series_data33,
                    color: '#86C8BC',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Additional Services',
                    data: series_data35,
                    color: '#86A3B8',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Legal Campaign',
                    data: series_data36,
                    color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'FuturePlus',
                    data: series_data38,
                    color: '#0f9564',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO Transition',
                    data: series_data39,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Head Office Generated',
                    data: series_data30a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - AP Customer',
                    data: series_data31a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Inbound Web',
                    data: series_data32a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Head Office Generated',
                    data: series_data33a,
                    color: '#103d39',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Other Source',
                    data: series_data37,
                    // color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartCustomerSignedCampaign(series_data30, series_data31,
            series_data32,
            series_data33,
            series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_customer', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Customer Signed by Source - Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    }
                },
                xAxis: {
                    categories: categores_customer_signed_week,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '10px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Franchisee Generated',
                    data: series_data30,
                    color: '#FFD4B2',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Call',
                    data: series_data31,
                    color: '#FFF6BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Field Sales',
                    data: series_data32,
                    color: '#CEEDC7',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Website',
                    data: series_data33,
                    color: '#86C8BC',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Additional Services',
                    data: series_data35,
                    color: '#86A3B8',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Legal Campaign',
                    data: series_data36,
                    color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'FuturePlus',
                    data: series_data38,
                    color: '#0f9564',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO Transition',
                    data: series_data39,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Head Office Generated',
                    data: series_data30a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - AP Customer',
                    data: series_data31a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Inbound Web',
                    data: series_data32a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Head Office Generated',
                    data: series_data33a,
                    color: '#103d39',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Other Source',
                    data: series_data37,
                    // color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartTrialCustomerSigned(series_data30, series_data31,
            series_data32,
            series_data33,
            series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_trial_customers', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Trail Customers by Source - Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    }
                },
                xAxis: {
                    categories: categores_customer_signed_week,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '10px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Franchisee Generated',
                    data: series_data30,
                    color: '#FFD4B2',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Call',
                    data: series_data31,
                    color: '#FFF6BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Field Sales',
                    data: series_data32,
                    color: '#CEEDC7',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Website',
                    data: series_data33,
                    color: '#86C8BC',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Additional Services',
                    data: series_data35,
                    color: '#86A3B8',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Legal Campaign',
                    data: series_data36,
                    color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'FuturePlus',
                    data: series_data38,
                    color: '#0f9564',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO Transition',
                    data: series_data39,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Head Office Generated',
                    data: series_data30a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - AP Customer',
                    data: series_data31a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Inbound Web',
                    data: series_data32a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Head Office Generated',
                    data: series_data33a,
                    color: '#103d39',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Other Source',
                    data: series_data37,
                    // color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartTrialPendingCustomerSigned(series_data30, series_data31,
            series_data32,
            series_data33,
            series_data34, series_data35, series_data36, series_data37, categores_customer_signed_week, series_data38, series_data39, series_data30a, series_data31a, series_data32a, series_data33a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_trial_pending_customers', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Trail Pending Customers by Source - Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    }
                },
                xAxis: {
                    categories: categores_customer_signed_week,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '10px'
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '10px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Franchisee Generated',
                    data: series_data30,
                    color: '#FFD4B2',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Call',
                    data: series_data31,
                    color: '#FFF6BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Field Sales',
                    data: series_data32,
                    color: '#CEEDC7',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Inbound - Website',
                    data: series_data33,
                    color: '#86C8BC',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Additional Services',
                    data: series_data35,
                    color: '#86A3B8',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Legal Campaign',
                    data: series_data36,
                    color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'FuturePlus',
                    data: series_data38,
                    color: '#0f9564',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO Transition',
                    data: series_data39,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Head Office Generated',
                    data: series_data30a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - AP Customer',
                    data: series_data31a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'LPO - Inbound Web',
                    data: series_data32a,
                    color: '#dc1928',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Head Office Generated',
                    data: series_data33a,
                    color: '#103d39',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Other Source',
                    data: series_data37,
                    // color: '#748DA6',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartQuoteSentByLastAssigned(series_data, series_data2, categores) {
            Highcharts.chart('container_prospect_quote_sent_last_assigned', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }
        function plotChartOpportunityByLastAssigned(series_data, series_data2, categores) {
            Highcharts.chart('container_prospect_opportunity_last_assigned', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Last Assigned',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }
        function plotChartQuoteSentByCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_prospect_quote_sent_campaign', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Signed',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }
        function plotChartOpportunityByCampaign(series_data, series_data2, categores) {
            Highcharts.chart('container_prospect_opportunity_campaign', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Campaign',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Free Trial',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartQuoteSentBySource(series_data, series_data2, categores) {
            Highcharts.chart('container_prospect_quote_sent_source', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Signed',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }
        function plotChartOpportunityBySource(series_data, series_data2, categores) {
            Highcharts.chart('container_prospect_opportunity_source', {
                chart: {
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy',
                    type: 'column'
                }, title: {
                    text: 'Leads - By Source',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    color: '#103D39',
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Free Trial',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            x: -10
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}<br/> Total'
                },
                series: series_data

            });
        }

        function plotChartProspectsQuotes(
            series_data43, series_data44, categores5) {
            Highcharts.chart(
                'container_prospects_opportunites', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Prospects - Weekly Quotes',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores5,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    },
                    labels: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '10px'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count',
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '12px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '10px'
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
                            fontSize: '10px'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
                    style: {
                        fontSize: '10px'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            align: 'right',
                            color: 'black',
                            style: {
                                fontSize: '12px'
                            }
                        },
                        pointPadding: 0.1,
                        groupPadding: 0
                    }
                },
                series: [{
                    name: 'Prospect - Quote Sent',
                    data: series_data44,
                    color: '#ADCF9F',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
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
            var headers = ["Customer Internal ID", "Customer Entity ID",
                "Customer Name",
                "Franchisee", "Sign Up Date", "Commencement Date", "Sales Rep",
                "Expected Weekly Usage", "Online Expected Weekly Usage",
                "No. of Weeks Used", "Total No. of Weeks (since Commencement)",
                "Avg Weekly Usage", "Sorting", "MPEX Customer"
            ]
            headers = headers.join(';'); // .join(', ')

            var csv = sep + "\n" + headers + "\n";


            ordersDataSet.forEach(function (row) {
                row = row.join(';');
                csv += row;
                csv += "\n";
            });

            var val1 = currentRecord.get();
            val1.setValue({
                fieldId: 'custpage_overview_table_csv',
                value: csv
            });


            return true;
        }

        function replaceAll(string) {
            return string.split("/").join("-");
        }

        function formatDate(testDate) {
            console.log('testDate: ' + testDate);
            var responseDate = format.format({
                value: testDate,
                type: format.Type.DATE
            });
            console.log('responseDate: ' + responseDate);
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
            if (typeof (x) == 'string') {
                x = parseFloat(x);
            }
            if (isNullorEmpty(x) || isNaN(x)) {
                return "$0.00";
            } else {
                return x.toLocaleString('en-AU', {
                    style: 'currency',
                    currency: 'AUD'
                });
            }
        }
        /**
         * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
         * @param   {String} date_iso       "2020-06-01"
         * @returns {String} date_netsuite  "1/6/2020"
         */
        function dateISOToNetsuite(date_iso) {
            var date_netsuite = '';
            if (!isNullorEmpty(date_iso)) {
                var date_utc = new Date(date_iso);
                // var date_netsuite = nlapiDateToString(date_utc);
                var date_netsuite = format.format({
                    value: date_utc,
                    type: format.Type.DATE
                });
            }
            return date_netsuite;
        }


        function isNullorEmpty(val) {
            if (val == '' || val == null || val == '- None -' || val == 0 || val == '0') {
                return true;
            } else {
                return false;
            }
        }

        function convertTo24Hour(time) {
            // nlapiLogExecution('DEBUG', 'time', time);
            var hours = parseInt(time.substr(0, 2));
            if (time.indexOf('AM') != -1 && hours == 12) {
                time = time.replace('12', '0');
            }
            if (time.indexOf('AM') != -1 && hours < 10) {
                time = time.replace(hours, ('0' + hours));
            }
            if (time.indexOf('PM') != -1 && hours < 12) {
                time = time.replace(hours, (hours + 12));
            }
            return time.replace(/( AM| PM)/, '');
        }


        return {
            pageInit: pageInit,
            saveRecord: saveRecord,
            addFilters: addFilters
        }
    });