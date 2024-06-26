/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript

 * Author:               Ankith Ravindran
 * Created on:           Sun Jun 21 2024
 * Modified on:          Sun Jun 21 2024 08:26:33
 * SuiteScript Version:  2.0 
 * Description:          ClientScript for the page that displays the snapshot of the sttus transition of the leads/prospects & customers.  
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
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

        var debtDataSet = [];
        var debt_set = [];

        var debtDataSet2 = [];
        var debt_set2 = [];
        var lpo_debt_set2 = [];
        var zee_debt_set2 = [];
        var salesrep_debt_set2 = [];


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
        var suspectValidatedChildDataSet = [];
        var suspectFollowUpChildDataSet = [];
        var customerCancellationRequestDataSet = [];


        var totalSuspectCount = 0;
        var customerActivityCount = 0;
        var totalCustomerCount = 0;
        var suspectActivityCount = 0;
        var prospectActivityCount = 0;
        var totalProspectCount = 0;



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

            modified_date_from = $('#modified_date_from').val();
            modified_date_from = dateISOToNetsuite(modified_date_from);

            modified_date_to = $('#modified_date_to').val();
            modified_date_to = dateISOToNetsuite(modified_date_to);

            lead_source = $('#lead_source').val();
            sales_campaign = $('#sales_campaign').val();
            lead_entered_by = $('#lead_entered_by').val();
            parent_lpo = $('#parent_lpo').val();
            sales_rep = $('#sales_rep').val();

            leadStatus = $('#cust_status').val();
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

                var modified_date_from = $('#modified_date_from').val();
                var modified_date_to = $('#modified_date_to').val();
                var source = $('#lead_source').val();
                var sales_campaign = $('#sales_campaign').val();
                var parent_lpo = $('#parent_lpo').val();

                var sales_rep = $('#sales_rep').val();
                var lead_entered_by = $('#lead_entered_by').val();

                leadStatus = $('#cust_status').val();

                zee = $(
                    '#zee_dropdown').val();

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1886&deploy=1&sales_rep=" + sales_rep + '&zee=' + zee + '&campaign=' + sales_campaign + '&lpo=' + parent_lpo + '&lead_entered_by=' + lead_entered_by + '&modified_date_from=' + modified_date_from + '&modified_date_to=' + modified_date_to + '&status=' + leadStatus;

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

            $(".closeSalesRepModal").click(function () {
                $("#leadSalesRepModal").hide();
            });
        }

        //Initialise the DataTable with headers.
        function submitSearch() {

            // userId = $('#user_dropdown option:selected').val();
            zee = $(
                '#zee_dropdown').val();

            loadDatatable(zee, userId);

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

            console.log('modified_date_from: ' + modified_date_from);
            console.log('modified_date_to ' + modified_date_to);
            console.log('lead_source ' + lead_source);
            console.log('sales_campaign ' + sales_campaign);
            console.log('parent_lpo ' + parent_lpo);
            console.log('sales_rep ' + sales_rep);

            console.log('zee_id ' + zee_id);

            // if (role != 1000) {
            console.log('leadStatus:' + leadStatus);
            if (role == 1000 && isNullorEmpty(zee_id) && isNullorEmpty(sales_rep) && !isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                alert('Please select Sales Rep while selecting the Modified Date From & To filters.');
                return false;
            }

            // Website New Leads by Status - Weekly Reporting - System Notes
            var leadsListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_6'
            });


            if (!isNullorEmpty(leadStatus)) {
                console.log('inside leadStatus filter')
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                console.log('inside modified_date_from & modified_date_to filter')
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'date',
                    join: 'systemnotes',
                    operator: search.Operator.ONORAFTER,
                    values: modified_date_from
                }));

                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'date',
                    join: 'systemnotes',
                    operator: search.Operator.ONORBEFORE,
                    values: modified_date_to
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
                    name: 'name',
                    join: 'systemnotes',
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
                console.log('inside sales_campaign filter')
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


            if (!isNullorEmpty(zee_id)) {
                leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            var count1 = 0;
            var previousOldCustStatus = null;

            var customer_signed = 0;
            var total_customer_signed = 0;
            var suspect_hot_lead = 0;
            var total_suspect_hot_lead = 0;
            var suspect_reassign = 0;
            var total_suspect_reassign = 0;
            var suspect_lost = 0;
            var total_suspect_lost = 0;
            var suspect_oot = 0;
            var total_suspect_oot = 0;
            var suspect_customer_lost = 0;
            var total_suspect_customer_lost = 0;
            var suspect_off_peak_pipeline = 0;
            var total_suspect_off_peak_pipeline = 0;
            var prospect_opportunity = 0;
            var total_prospect_opportunity = 0;
            var prospecy_quote_sent = 0;
            var total_prospect_quote_sent = 0;
            var prospect_no_answer = 0;
            var total_prospect_no_answer = 0;
            var prospect_in_contact = 0;
            var total_prospect_in_contact = 0;
            var suspect_follow_up = 0;
            var total_suspect_follow_up = 0;
            var prospect_qualified = 0;
            var total_prospect_qualified = 0;
            var suspect_new = 0;
            var total_suspect_new = 0;

            var suspect_lpo_followup = 0;
            var total_suspect_lpo_followup = 0;
            var suspect_qualified = 0;
            var total_suspect_qualified = 0;

            var suspect_validated = 0;
            var total_suspect_validated = 0;
            var customer_free_trial = 0;
            var total_customer_free_trial = 0;
            var customer_free_trial_pending = 0;
            var total_customer_free_trial_pending = 0;

            var suspect_no_answer = 0;
            var total_suspect_no_answer = 0;
            var suspect_in_contact = 0;
            var total_suspect_in_contact = 0;

            var defaultSearchFilters = leadsListBySalesRepWeeklySearch.filterExpression;

            console.log('default search filters: ' + JSON.stringify(defaultSearchFilters));


            leadsListBySalesRepWeeklySearch.run().each(function (
                prospectListBySalesRepWeeklyResultSet) {


                var prospectCount = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var custStatus = (prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "oldvalue",
                    join: "systemNotes",
                    summary: "GROUP",
                })).toUpperCase();

                var newCustStatus = (prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "newvalue",
                    join: "systemNotes",
                    summary: "GROUP",
                })).toUpperCase();

                console.log('prospectCount: ' + prospectCount);
                console.log('custStatus: ' + custStatus);
                console.log('newCustStatus: ' + newCustStatus);


                if (count1 == 0) {

                    if (custStatus == 'CUSTOMER-SIGNED(100%)' || custStatus == 'CUSTOMER-TO BE FINALISED') {

                        total_customer_signed = parseInt(prospectCount);
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        total_suspect_hot_lead = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        total_suspect_lost = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        total_suspect_oot = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        total_suspect_customer_lost = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-REP REASSIGN' || custStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        total_suspect_reassign = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        total_prospect_quote_sent = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        total_prospect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        total_prospect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-PARKING LOT' || custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        total_suspect_off_peak_pipeline = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        total_prospect_opportunity = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        total_suspect_follow_up = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        total_suspect_new = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        total_suspect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        total_suspect_lpo_followup = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        total_suspect_validated = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial_pending = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        total_suspect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        total_suspect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        total_prospect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    }

                } else if (previousOldCustStatus != null &&
                    previousOldCustStatus == custStatus) {

                    if (previousOldCustStatus == 'CUSTOMER-SIGNED(100%)' || previousOldCustStatus == 'CUSTOMER-TO BE FINALISED') {
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        total_customer_signed += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        total_suspect_hot_lead += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        total_suspect_lost += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        total_suspect_oot += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        total_suspect_customer_lost += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-REP REASSIGN' || previousOldCustStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        total_suspect_reassign += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        total_prospect_quote_sent += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        total_prospect_no_answer += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        total_prospect_in_contact += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-PARKING LOT' || previousOldCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        total_suspect_off_peak_pipeline += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        total_prospect_opportunity += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        total_suspect_follow_up += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        total_suspect_new += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        total_suspect_qualified += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        total_suspect_lpo_followup += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        total_suspect_validated += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial_pending += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        total_suspect_no_answer += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        total_suspect_in_contact += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        total_prospect_qualified += parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot += parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified += parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial += parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed += parseInt(prospectCount);
                        }
                    }

                } else if (previousOldCustStatus != null &&
                    previousOldCustStatus != custStatus) {

                    if (previousOldCustStatus == 'CUSTOMER-SIGNED(100%)' || previousOldCustStatus == 'CUSTOMER-TO BE FINALISED') {
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        debt_set2[20] = {
                            title: 'Customer - Signed', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_customer_signed
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        debt_set2[1] = {
                            title: 'Suspect - Hot Lead', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_hot_lead
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        debt_set2[12] = {
                            title: 'Suspect - Lost', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_lost
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        debt_set2[13] = {
                            title: 'Suspect - Out of Territory', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_oot
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        debt_set2[14] = {
                            title: 'Suspect - Customer - Lost', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_customer_lost
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-REP REASSIGN' || previousOldCustStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        debt_set2[4] = {
                            title: 'Suspect - Rep Reassign', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_reassign
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        debt_set2[17] = {
                            title: 'Prospect - Quote Sent', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_quote_sent
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        debt_set2[9] = {
                            title: 'Prospect - No Answer', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_no_answer
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        debt_set2[10] = {
                            title: 'Prospect - In Answer', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_in_contact
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-PARKING LOT' || previousOldCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        debt_set2[11] = {
                            title: 'Prospect - Parking Lot', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_off_peak_pipeline
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        debt_set2[15] = {
                            title: 'Prospect - Opportunity', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_opportunity
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        debt_set2[5] = {
                            title: 'Suspect - Follow Up', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_follow_up
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        debt_set2[0] = {
                            title: 'Suspect - New', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_new
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        debt_set2[2] = {
                            title: 'Suspect - Qualified', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_qualified
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        debt_set2[6] = {
                            title: 'Suspect - LPO Follow Up', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_lpo_followup
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        debt_set2[3] = {
                            title: 'Suspect - Validated', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_validated
                        }
                    } else if (previousOldCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        debt_set2[19] = {
                            title: 'Customer - Free Trial', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_customer_free_trial
                        }
                    } else if (previousOldCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        debt_set2[18] = {
                            title: 'Customer - Pending Free Trial', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_customer_free_trial_pending
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        debt_set2[7] = {
                            title: 'Suspect - No Answer', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_no_answer
                        }
                    } else if (previousOldCustStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        debt_set2[8] = {
                            title: 'Suspect - In Contact', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_in_contact
                        }
                    } else if (previousOldCustStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        debt_set2[16] = {
                            title: 'Prospect - Qualified', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_qualified
                        }
                    }


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

                    if (custStatus == 'CUSTOMER-SIGNED(100%)' || custStatus == 'CUSTOMER-TO BE FINALISED') {

                        total_customer_signed = parseInt(prospectCount);
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        total_suspect_hot_lead = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        total_suspect_lost = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        total_suspect_oot = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        total_suspect_customer_lost = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-REP REASSIGN' || custStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        total_suspect_reassign = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        total_prospect_quote_sent = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        total_prospect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        total_prospect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-PARKING LOT' || custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        total_suspect_off_peak_pipeline = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        total_prospect_opportunity = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        total_suspect_follow_up = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        total_suspect_new = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        total_suspect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        total_suspect_lpo_followup = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        total_suspect_validated = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial_pending = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        total_suspect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        total_suspect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        total_prospect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    }
                }

                count1++;
                previousOldCustStatus = custStatus;
                return true;
            });


            if (count1 > 0) {

                if (previousOldCustStatus == 'CUSTOMER-SIGNED(100%)' || previousOldCustStatus == 'CUSTOMER-TO BE FINALISED') {
                    //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                    debt_set2[20] = {
                        title: 'Customer - Signed', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_customer_signed
                    }
                } else if (previousOldCustStatus == 'SUSPECT-HOT LEAD') {
                    //SUSPECT - HOT LEAD
                    debt_set2[1] = {
                        title: 'Suspect - Hot Lead', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_hot_lead
                    }
                } else if (previousOldCustStatus == 'SUSPECT-LOST') {
                    //SUSPECT - LOST
                    debt_set2[12] = {
                        title: 'Suspect - Lost', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_lost
                    }
                } else if (previousOldCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                    //SUSPECT - OUT OF TERRITORY
                    debt_set2[13] = {
                        title: 'Suspect - Out of Territory', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_oot
                    }
                } else if (previousOldCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                    //SUSPECT - CUSTOMER - LOST
                    debt_set2[14] = {
                        title: 'Suspect - Customer - Lost', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_customer_lost
                    }
                } else if (previousOldCustStatus == 'SUSPECT-REP REASSIGN' || previousOldCustStatus == 'SUSPECT-REASSIGN') {
                    //SUSPECT - REP REASSIGN
                    debt_set2[4] = {
                        title: 'Suspect - Rep Reassign', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_reassign
                    }
                } else if (previousOldCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                    //PROSPECT - QUOTE SENT
                    debt_set2[17] = {
                        title: 'Prospect - Quote Sent', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_quote_sent
                    }
                } else if (previousOldCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                    //PROSPECT - NO ANSWER
                    debt_set2[9] = {
                        title: 'Prospect - No Answer', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_no_answer
                    }
                } else if (previousOldCustStatus == 'PROSPECT-IN CONTACT(6%)') {
                    //PROSPECT - IN CONTACT
                    debt_set2[10] = {
                        title: 'Prospect - In Answer', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_in_contact
                    }
                } else if (previousOldCustStatus == 'SUSPECT-PARKING LOT' || previousOldCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                    //SUSPECT - OFF PEAK PIPELINE
                    debt_set2[11] = {
                        title: 'Prospect - Parking Lot', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_off_peak_pipeline
                    }
                } else if (previousOldCustStatus == 'PROSPECT-OPPORTUNITY') {
                    //PROSPECT - OPPORTUNITY
                    debt_set2[15] = {
                        title: 'Prospect - Opportunity', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_opportunity
                    }
                } else if (previousOldCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                    //SUSPECT - FOLLOW UP
                    debt_set2[5] = {
                        title: 'Suspect - Follow Up', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_follow_up
                    }
                } else if (previousOldCustStatus == 'SUSPECT-NEW') {
                    //SUSPECT - NEW
                    debt_set2[0] = {
                        title: 'Suspect - New', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_new
                    }
                } else if (previousOldCustStatus == 'SUSPECT-QUALIFIED') {
                    //SUSPECT - QUALIFIED
                    debt_set2[2] = {
                        title: 'Suspect - Qualified', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_qualified
                    }
                } else if (previousOldCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                    //SUSPECT - LPO FOLLOW UP
                    debt_set2[6] = {
                        title: 'Suspect - LPO Follow Up', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_lpo_followup
                    }
                } else if (previousOldCustStatus == 'SUSPECT-VALIDATED') {
                    //SUSPECT - VALIDATED
                    debt_set2[3] = {
                        title: 'Suspect - Validated', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_validated
                    }
                } else if (previousOldCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                    //CUSTOMER - FREE TRIAL
                    debt_set2[19] = {
                        title: 'Customer - Free Trial', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_customer_free_trial
                    }
                } else if (previousOldCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                    //CUSTOMER - FREE TRIAL
                    debt_set2[18] = {
                        title: 'Customer - Pending Free Trial', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_customer_free_trial_pending
                    }
                } else if (previousOldCustStatus == 'SUSPECT-NO ANSWER') {
                    //SUSPECT - NO ANSWER
                    debt_set2[7] = {
                        title: 'Suspect - No Answer', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_no_answer
                    }
                } else if (previousOldCustStatus == 'SUSPECT-IN CONTACT') {
                    //SUSPECT - IN CONTACT
                    debt_set2[8] = {
                        title: 'Suspect - In Contact', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_in_contact
                    }
                } else if (previousOldCustStatus == 'PROSPECT-QUALIFIED') {
                    //PROSPECT - QUALIFIED
                    debt_set2[16] = {
                        title: 'Prospect - Qualified', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_qualified
                    }
                }
            }

            console.log('debt_set2: ' + JSON.stringify(debt_set2));

            var previewDataSet = [];
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

                        var totalLeadsCol = preview_row.total_leads + '';

                        overDataSet.push([preview_row.title,
                        preview_row.suspect_new,
                        preview_row.suspect_hot_lead,
                        preview_row.suspect_qualified,
                        preview_row.suspect_validated,
                        preview_row.suspect_reassign,
                        preview_row.suspect_follow_up,
                        preview_row.suspect_lpo_followup,
                        preview_row.suspect_no_answer,
                        preview_row.suspect_in_contact,
                        preview_row.prospect_no_answer,
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
                        preview_row.customer_signed
                        ]);


                        previewDataSet.push([preview_row.title,
                            suspectNewCol,
                            hotLeadCol,
                            suspectQualifiedCol,
                            suspectValidatedCol,
                            reassignCol,
                            followUpCol,
                            suspectLPOFollowupwCol,
                            suspectNoAnswerCol,
                            suspectInContactCol,
                            noAnswerCol,
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
                        preview_row.total_leads.toString(),
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
                "ordering": false,
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
                columnDefs: [{
                    targets: [0, 3, 4, 18, 19, 20, 21, 22],
                    className: 'bolded'
                }],
                rowCallback: function (row, data, index) {


                    if (data[0] == 'Suspect - Customer - Lost' || data[0] == 'Suspect - Lost') {
                        $('td', row).css('background-color', '#E9B775');
                    }

                    $('td', row).eq(0).css('background-color', '#045d7b');
                    $('td', row).eq(0).css('color', '#ffffff');

                    if (data[13] != '0 (0%)') {
                        $('td', row).eq(13).css('background-color', '#e97577');
                    }

                    if (data[15] != '0 (0%)') {
                        $('td', row).eq(15).css('background-color', '#e97577');
                    }

                    if (data[21] != '0 (0%)') {
                        $('td', row).eq(21).css('background-color', '#54bf9d');
                    }

                    if (data[20] != '0 (0%)') {
                        $('td', row).eq(20).css('background-color', '#54bf9d');
                    }

                    if (data[19] != '0 (0%)') {
                        $('td', row).eq(19).css('background-color', '#54bf9d');
                    }

                },
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
                    total_lead_2 = api
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
                        total_suspect_new
                    );
                    $(api.column(2).footer()).html(
                        total_suspect_hot_lead
                    );
                    $(api.column(3).footer()).html(
                        total_suspect_qualified
                    );
                    $(api.column(4).footer()).html(
                        total_suspect_validated
                    );
                    $(api.column(5).footer()).html(
                        total_suspect_reassign
                    );
                    $(api.column(6).footer()).html(
                        total_suspect_followup
                    );
                    $(api.column(7).footer()).html(
                        total_suspect_lpo_followup
                    );
                    $(api.column(8).footer()).html(
                        total_suspect_no_answer
                    );
                    $(api.column(9).footer()).html(
                        total_suspect_in_contact
                    );
                    $(api.column(10).footer()).html(
                        total_prospect_in_contact
                    );
                    $(api.column(11).footer()).html(
                        total_suspect_off_peak_pipeline
                    );
                    $(api.column(12).footer()).html(
                        total_suspect_lost
                    );
                    $(api.column(13).footer()).html(
                        total_suspect_oot
                    );
                    $(api.column(14).footer()).html(
                        total_suspect_customer_lost
                    );
                    $(api.column(15).footer()).html(
                        total_prospect_opportunity
                    );
                    $(api.column(16).footer()).html(
                        total_prospect_qualified
                    );
                    $(api.column(17).footer()).html(
                        total_prospect_quote_sent
                    );



                    $(api.column(18).footer()).html(
                        total_customer_free_trial_pending
                    );

                    $(api.column(19).footer()).html(
                        total_customer_free_trial
                    );
                    $(api.column(20).footer()).html(
                        total_customer_signed
                    );
                    $(api.column(21).footer()).html(
                        total_lead
                    );
                    $(api.column(22).footer()).html(
                        total_lead_2
                    );

                }

            });

            console.log('after table creation');

            //
            // Website New Leads by Customer - Weekly Reporting - System Notes
            var leadsByCustomerWeeklySystemNotesSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_6_2'
            });


            if (!isNullorEmpty(leadStatus)) {
                console.log('inside leadStatus filter')
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                console.log('inside modified_date_from & modified_date_to filter')
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'date',
                    join: 'systemnotes',
                    operator: search.Operator.ONORAFTER,
                    values: modified_date_from
                }));

                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'date',
                    join: 'systemnotes',
                    operator: search.Operator.ONORBEFORE,
                    values: modified_date_to
                }));
            }


            if (!isNullorEmpty(lead_source)) {
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'name',
                    join: 'systemnotes',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                console.log('inside sales_campaign filter')
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }


            if (!isNullorEmpty(zee_id)) {
                leadsByCustomerWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            var count2 = 0;
            var oldCustomerId = null;
            var oldCustomerName = null;
            var oldCustomerFranchiseeText = null;
            var oldCustomerStatusText = null;
            var customerChildStatusTransition = [];
            var customerListDataSet = [];

            var customer_signed = [];
            var suspect_hot_lead = [];
            var suspect_reassign = [];
            var suspect_lost = [];
            var suspect_oot = [];
            var suspect_customer_lost = [];
            var suspect_off_peak_pipeline = [];
            var prospect_opportunity = [];
            var prospect_quote_sent = [];
            var prospect_no_answer = [];
            var prospect_in_contact = [];
            var suspect_follow_up = [];
            var prospect_qualified = [];
            var suspect_new = [];
            var suspect_lpo_followup = [];
            var suspect_qualified = [];
            var suspect_validated = [];
            var customer_free_trial = [];
            var customer_free_trial_pending = [];
            var suspect_no_answer = [];
            var suspect_in_contact = [];

            var customer_signed_total = 0;
            var suspect_hot_lead_total = 0;
            var suspect_reassign_total = 0;
            var suspect_lost_total = 0;
            var suspect_oot_total = 0;
            var suspect_customer_lost_total = 0;
            var suspect_off_peak_pipeline_total = 0;
            var prospect_opportunity_total = 0;
            var prospect_quote_sent_total = 0;
            var prospect_no_answer_total = 0;
            var prospect_in_contact_total = 0;
            var suspect_follow_up_total = 0;
            var prospect_qualified_total = 0;
            var suspect_new_total = 0;
            var suspect_lpo_followup_total = 0;
            var suspect_qualified_total = 0;
            var suspect_validated_total = 0;
            var customer_free_trial_total = 0;
            var customer_free_trial_pending_total = 0;
            var suspect_no_answer_total = 0;
            var suspect_in_contact_total = 0;

            var lostCustomer = '';
            var newSignUp = '';

            var oldLostCustomer = null;
            var oldNewSignUp = null;

            leadsByCustomerWeeklySystemNotesSearch.run().each(function (
                leadsByCustomerWeeklySystemNotesSearchResultSet) {

                var customerId = leadsByCustomerWeeklySystemNotesSearchResultSet.getValue({
                    name: "entityid",
                    summary: "GROUP"
                })

                var customerName = leadsByCustomerWeeklySystemNotesSearchResultSet.getValue({
                    name: "companyname",
                    summary: "GROUP"
                })

                var customerFranchiseeID = leadsByCustomerWeeklySystemNotesSearchResultSet.getValue({
                    name: "partner",
                    summary: "GROUP"
                })

                var customerFranchiseeText = leadsByCustomerWeeklySystemNotesSearchResultSet.getText({
                    name: "partner",
                    summary: "GROUP"
                })

                var customerStatusText = leadsByCustomerWeeklySystemNotesSearchResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
                })

                var systemNotesDate = leadsByCustomerWeeklySystemNotesSearchResultSet.getValue({
                    name: "date",
                    join: "systemNotes",
                    summary: "GROUP",
                })
                var systemNotesSetBy = leadsByCustomerWeeklySystemNotesSearchResultSet.getText({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                })

                var oldCustStatus = (leadsByCustomerWeeklySystemNotesSearchResultSet.getValue({
                    name: "oldvalue",
                    join: "systemNotes",
                    summary: "GROUP",
                })).toUpperCase();

                var newCustStatus = (leadsByCustomerWeeklySystemNotesSearchResultSet.getValue({
                    name: "newvalue",
                    join: "systemNotes",
                    summary: "GROUP",
                })).toUpperCase();

                if (count2 > 0 && (oldCustomerId != customerId)) {
                    customerListDataSet.push(['',
                        oldCustomerId,
                        oldCustomerName,
                        oldCustomerFranchiseeText,
                        oldCustomerStatusText,
                        oldNewSignUp,
                        oldLostCustomer,
                        customerChildStatusTransition
                    ]);

                    if (oldCustomerStatusText.toUpperCase() == 'CUSTOMER-SIGNED' || oldCustomerStatusText.toUpperCase() == 'CUSTOMER-TO BE FINALISED') {
                        customer_signed.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        customer_signed_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-HOT LEAD') {
                        suspect_hot_lead.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_hot_lead_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-LOST') {
                        suspect_lost.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_lost_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        suspect_oot.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_oot_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-CUSTOMER - LOSTSUSPECT-CUSTOMER - LOST') {
                        suspect_customer_lost.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_customer_lost_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-REP REASSIGN' || oldCustomerStatusText.toUpperCase() == 'SUSPECT-REASSIGN') {
                        suspect_reassign.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_reassign_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-QUOTE SENT') {
                        prospect_quote_sent.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        prospect_quote_sent_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-NO ANSWER') {
                        prospect_no_answer.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        prospect_no_answer_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-IN CONTACT') {
                        prospect_in_contact.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        prospect_in_contact_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-PARKING LOT' || oldCustomerStatusText.toUpperCase() == 'SUSPECT-OFF PEAK PIPELINE') {
                        suspect_off_peak_pipeline.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_off_peak_pipeline_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-OPPORTUNITY') {
                        suspect_off_peak_pipeline.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_off_peak_pipeline_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-FOLLOW-UP') {
                        suspect_follow_up.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_follow_up_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-NEW') {
                        suspect_new.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_new_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-QUALIFIED') {
                        suspect_qualified.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_qualified_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-LPO FOLLOW-UP') {
                        suspect_lpo_followup.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_lpo_followup_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-VALIDATED') {
                        suspect_validated.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_validated_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'CUSTOMER-FREE TRIAL') {
                        customer_free_trial.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        customer_free_trial_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'CUSTOMER-FREE TRIAL PENDING') {
                        customer_free_trial_pending.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        customer_free_trial_pending_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-NO ANSWER') {
                        suspect_no_answer.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_no_answer_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-IN CONTACT') {
                        suspect_in_contact.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        suspect_in_contact_total++;
                    } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-QUALIFIED') {
                        prospect_qualified.push({
                            customerId: oldCustomerId,
                            customerName: oldCustomerName,
                            customerFranchiseeText: oldCustomerFranchiseeText,
                        });
                        prospect_qualified_total++;
                    }

                    customerChildStatusTransition = [];
                    lostCustomer = '';
                    newSignUp = '';
                }

                if (oldCustStatus == 'SUSPECT-CUSTOMER - LOST' && (newCustStatus == 'CUSTOMER-SIGNED' || newCustStatus == 'CUSTOMER-TO BE FINALISED')) {
                    lostCustomer = 'YES';
                } else if (newCustStatus == 'CUSTOMER-SIGNED' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                    newSignUp = 'YES';
                }
                customerChildStatusTransition.push({
                    systemNotesDate: systemNotesDate,
                    systemNotesSetBy: systemNotesSetBy,
                    oldCustStatus: oldCustStatus,
                    newCustStatus: newCustStatus,
                });



                oldCustomerId = customerId;
                oldCustomerName = customerName;
                oldCustomerFranchiseeText = customerFranchiseeText;
                oldCustomerStatusText = customerStatusText;
                oldLostCustomer = lostCustomer;
                oldNewSignUp = newSignUp;
                count2++;
                return true;
            });

            if (count2 > 0) {
                customerListDataSet.push(['',
                    oldCustomerId,
                    oldCustomerName,
                    oldCustomerFranchiseeText,
                    oldCustomerStatusText,
                    oldNewSignUp,
                    oldLostCustomer,
                    customerChildStatusTransition
                ]);

                if (oldCustomerStatusText.toUpperCase() == 'CUSTOMER-SIGNED' || oldCustomerStatusText.toUpperCase() == 'CUSTOMER-TO BE FINALISED') {
                    customer_signed.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    customer_signed_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-HOT LEAD') {
                    suspect_hot_lead.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_hot_lead_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-LOST') {
                    suspect_lost.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_lost_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                    suspect_oot.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_oot_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-CUSTOMER - LOST') {
                    suspect_customer_lost.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_customer_lost_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-REP REASSIGN' || oldCustomerStatusText.toUpperCase() == 'SUSPECT-REASSIGN') {
                    suspect_reassign.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_reassign_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-QUOTE SENT') {
                    prospect_quote_sent.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    prospect_quote_sent_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-NO ANSWER') {
                    prospect_no_answer.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    prospect_no_answer_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-IN CONTACT') {
                    prospect_in_contact.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    prospect_in_contact_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-PARKING LOT' || oldCustomerStatusText.toUpperCase() == 'SUSPECT-OFF PEAK PIPELINE') {
                    suspect_off_peak_pipeline.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_off_peak_pipeline_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-OPPORTUNITY') {
                    suspect_off_peak_pipeline.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_off_peak_pipeline_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-FOLLOW-UP') {
                    suspect_follow_up.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_follow_up_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-NEW') {
                    suspect_new.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_new_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-QUALIFIED') {
                    suspect_qualified.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_qualified_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-LPO FOLLOW-UP') {
                    suspect_lpo_followup.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_lpo_followup_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-VALIDATED') {
                    suspect_validated.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_validated_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'CUSTOMER-FREE TRIAL') {
                    customer_free_trial.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    customer_free_trial_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'CUSTOMER-FREE TRIAL PENDING') {
                    customer_free_trial_pending.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    customer_free_trial_pending_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-NO ANSWER') {
                    suspect_no_answer.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_no_answer_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'SUSPECT-IN CONTACT') {
                    suspect_in_contact.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    suspect_in_contact_total++;
                } else if (oldCustomerStatusText.toUpperCase() == 'PROSPECT-QUALIFIED') {
                    prospect_qualified.push({
                        customerId: oldCustomerId,
                        customerName: oldCustomerName,
                        customerFranchiseeText: oldCustomerFranchiseeText,
                    });
                    prospect_qualified_total++;
                }
            }

            var currentStatusCount = [];
            currentStatusCount.push(['', "Suspect - New", suspect_new_total, suspect_new]);
            currentStatusCount.push(['', "Suspect - Hot Lead", suspect_hot_lead_total, suspect_hot_lead]);
            currentStatusCount.push(['', "Suspect - Qualified", suspect_qualified_total, suspect_qualified]);
            currentStatusCount.push(['', "Suspect - Validated", suspect_validated_total, suspect_validated]);
            currentStatusCount.push(['', "Suspect - Reassign", suspect_reassign_total, suspect_reassign]);
            currentStatusCount.push(['', "Suspect - Follow Up", suspect_follow_up_total, suspect_follow_up]);
            currentStatusCount.push(['', "Suspect - LPO Follow Up", suspect_lpo_followup_total, suspect_lpo_followup]);
            currentStatusCount.push(['', "Suspect - No Answer", suspect_no_answer_total, suspect_no_answer]);
            currentStatusCount.push(['', "Suspect - In Contact", suspect_in_contact_total, suspect_in_contact]);
            currentStatusCount.push(['', "Prospect - No Answer", prospect_no_answer_total, prospect_no_answer]);
            currentStatusCount.push(['', "Prospect - In Contact", prospect_in_contact_total, prospect_in_contact]);
            currentStatusCount.push(['', "Prospect - In Contact", prospect_in_contact_total, prospect_in_contact]);
            currentStatusCount.push(['', "Suspect - Parking Lot", suspect_off_peak_pipeline_total, suspect_off_peak_pipeline]);
            currentStatusCount.push(['', "Suspect - Lost", suspect_lost_total, suspect_lost]);
            currentStatusCount.push(['', "Suspect - Out of Territory", suspect_oot_total, suspect_oot]);
            currentStatusCount.push(['', "Suspect - Customer - Lost", suspect_customer_lost_total, suspect_customer_lost]);
            currentStatusCount.push(['', "Prospect - Opportunity", prospect_opportunity_total, prospect_opportunity]);
            currentStatusCount.push(['', "Prospect - Qualified", prospect_opportunity_total, prospect_opportunity]);
            currentStatusCount.push(['', "Prospect - Quote Sent", prospect_quote_sent_total, prospect_quote_sent]);
            currentStatusCount.push(['', "Customer - Free Trial Pending", customer_free_trial_pending_total, customer_free_trial_pending]);
            currentStatusCount.push(['', "Customer - Free Trial", customer_free_trial_total, customer_free_trial]);
            currentStatusCount.push(['', "Customer - Signed", customer_signed_total, customer_signed]);


            var dataTableCustomerList = $('#mpexusage-cust_list').DataTable({
                destroy: true,
                data: customerListDataSet,
                pageLength: 1000,
                responsive: true,
                order: [[4, 'asc']],
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
                    title: 'Expand',
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                }, {
                    title: 'Customer ID'//1
                }, {
                    title: 'Company Name'//2
                }, {
                    title: 'Franchisee'//3
                }, {
                    title: 'Status'//4
                }, {
                    title: 'New Sign-Up?'//5
                }, {
                    title: 'Lost Customer Sign-Up?'//6
                }, {
                    title: 'Child Table' //7
                }
                ],
                columnDefs: [{
                    targets: [1, 2, 4, 5, 6],
                    className: 'bolded'
                }, {
                    targets: [7],
                    visible: false
                },],
                rowCallback: function (row, data, index) {
                    if (data[4] == 'SUSPECT-Lost' || data[4] == 'SUSPECT-Customer - Lost') {
                        $('td', row).css('background-color', '#e97577');
                    } else if (data[4] == 'CUSTOMER-To Be Finalised' || data[4] == 'CUSTOMER-Signed') {
                        if (data[5] == 'YES') {
                            $('td', row).css('background-color', '#54bf9d');
                        } else {
                            $('td', row).css('background-color', '#adcf9f');
                        }
                    } else if (data[4] == 'Customer-Free Trial') {
                        $('td', row).css('background-color', '#E0FBE2');
                    }
                },
                footerCallback: function (row, data, start, end, display) {

                }

            });

            dataTableCustomerList.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createCustomerListTableChild(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-cust_list tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableCustomerList.row(tr);

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


            var dataTableByStatusCustomerList = $('#mpexusage-status_cust_list').DataTable({
                destroy: true,
                data: currentStatusCount,
                pageLength: 1000,
                responsive: true,
                order: [[2, 'desc']],
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
                    title: 'Expand',
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                }, {
                    title: 'Current Status'//1
                }, {
                    title: 'Lead/Customer Count'//2
                }, {
                    title: 'Child Table' //3
                }
                ],
                columnDefs: [{
                    targets: [1, 2],
                    className: 'bolded'
                }, {
                    targets: [0, 2],
                    className: 'col-xs-1'
                }, {
                    targets: [3],
                    visible: false
                },],
                rowCallback: function (row, data, index) {
                    if (data[1] == 'Suspect - Lost' || data[1] == 'Suspect - Customer - Lost') {
                        $('td', row).css('background-color', '#e97577');
                    } else if (data[1] == 'Customer - To Be Finalised' || data[1] == 'Customer - Signed') {
                        $('td', row).css('background-color', '#54bf9d');
                    } else if (data[1] == 'Customer - Free Trial') {
                        $('td', row).css('background-color', '#E0FBE2');
                    }
                },
                createdRow: function (row, data, dataIndex) {
                    $('td', row).eq(2).removeClass('dt-type-numeric');
                },
                footerCallback: function (row, data, start, end, display) {

                }

            });

            dataTableByStatusCustomerList.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createByStatusCustomerListTableChild(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-status_cust_list tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableByStatusCustomerList.row(tr);

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

            // Website New Leads by Sales Rep - Weekly Reporting - System Notes
            var leadsBySalesRepWeeklySystemNotesSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_6__2'
            });


            if (!isNullorEmpty(leadStatus)) {
                console.log('inside leadStatus filter')
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'entitystatus',
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatus
                }));
            }

            if (!isNullorEmpty(modified_date_from) && !isNullorEmpty(modified_date_to)) {
                console.log('inside modified_date_from & modified_date_to filter')
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'date',
                    join: 'systemnotes',
                    operator: search.Operator.ONORAFTER,
                    values: modified_date_from
                }));

                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'date',
                    join: 'systemnotes',
                    operator: search.Operator.ONORBEFORE,
                    values: modified_date_to
                }));
            }


            if (!isNullorEmpty(lead_source)) {
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'name',
                    join: 'systemnotes',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                console.log('inside sales_campaign filter')
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }


            if (!isNullorEmpty(zee_id)) {
                leadsBySalesRepWeeklySystemNotesSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }


            var count3 = 0;
            var oldSystemNotesSetBy = null;
            var oldSystemNotesStatus = null;
            var customer_signed = 0;
            var total_customer_signed = 0;
            var suspect_hot_lead = 0;
            var total_suspect_hot_lead = 0;
            var suspect_reassign = 0;
            var total_suspect_reassign = 0;
            var suspect_lost = 0;
            var total_suspect_lost = 0;
            var suspect_oot = 0;
            var total_suspect_oot = 0;
            var suspect_customer_lost = 0;
            var total_suspect_customer_lost = 0;
            var suspect_off_peak_pipeline = 0;
            var total_suspect_off_peak_pipeline = 0;
            var prospect_opportunity = 0;
            var total_prospect_opportunity = 0;
            var prospecy_quote_sent = 0;
            var total_prospect_quote_sent = 0;
            var prospect_no_answer = 0;
            var total_prospect_no_answer = 0;
            var prospect_in_contact = 0;
            var total_prospect_in_contact = 0;
            var suspect_follow_up = 0;
            var total_suspect_follow_up = 0;
            var prospect_qualified = 0;
            var total_prospect_qualified = 0;
            var suspect_new = 0;
            var total_suspect_new = 0;

            var suspect_lpo_followup = 0;
            var total_suspect_lpo_followup = 0;
            var suspect_qualified = 0;
            var total_suspect_qualified = 0;

            var suspect_validated = 0;
            var total_suspect_validated = 0;
            var customer_free_trial = 0;
            var total_customer_free_trial = 0;
            var customer_free_trial_pending = 0;
            var total_customer_free_trial_pending = 0;

            var suspect_no_answer = 0;
            var total_suspect_no_answer = 0;
            var suspect_in_contact = 0;
            var total_suspect_in_contact = 0;

            var salesRepStatusTransitionChildSet = [];
            var statusTransitionBySalesRepDataSet = [];
            var uniqueSalesRepCount = 0;
            var totalLeadCountBySalesRep = 0;

            leadsBySalesRepWeeklySystemNotesSearch.run().each(function (
                leadsBySalesRepWeeklySystemNotesSearchResultSet) {

                var prospectCount = parseInt(leadsBySalesRepWeeklySystemNotesSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));

                var systemNotesSetBy = leadsBySalesRepWeeklySystemNotesSearchResultSet.getText({
                    name: "name",
                    join: "systemNotes",
                    summary: "GROUP",
                })

                var custStatus = (leadsBySalesRepWeeklySystemNotesSearchResultSet.getValue({
                    name: "oldvalue",
                    join: "systemNotes",
                    summary: "GROUP",
                })).toUpperCase();

                var newCustStatus = (leadsBySalesRepWeeklySystemNotesSearchResultSet.getValue({
                    name: "newvalue",
                    join: "systemNotes",
                    summary: "GROUP",
                })).toUpperCase();


                if (count3 == 0) {
                    if (custStatus == 'CUSTOMER-SIGNED(100%)' || custStatus == 'CUSTOMER-TO BE FINALISED') {

                        total_customer_signed = parseInt(prospectCount);
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        total_suspect_hot_lead = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        total_suspect_lost = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        total_suspect_oot = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        total_suspect_customer_lost = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-REP REASSIGN' || custStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        total_suspect_reassign = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        total_prospect_quote_sent = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        total_prospect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        total_prospect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-PARKING LOT' || custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        total_suspect_off_peak_pipeline = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        total_prospect_opportunity = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        total_suspect_follow_up = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        total_suspect_new = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        total_suspect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        total_suspect_lpo_followup = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        total_suspect_validated = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial_pending = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        total_suspect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        total_suspect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        total_prospect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    }

                } else if (count3 > 0 && (oldSystemNotesSetBy == systemNotesSetBy)) {
                    if (oldSystemNotesStatus != null &&
                        oldSystemNotesStatus == custStatus) {

                        if (oldSystemNotesStatus == 'CUSTOMER-SIGNED(100%)' || oldSystemNotesStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                            total_customer_signed += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            total_suspect_hot_lead += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            total_suspect_lost += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            total_suspect_oot += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            total_suspect_customer_lost += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-REP REASSIGN' || oldSystemNotesStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            total_suspect_reassign += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            total_prospect_quote_sent += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            total_prospect_no_answer += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-IN CONTACT(6%)') {
                            //PROSPECT - IN CONTACT
                            total_prospect_in_contact += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-PARKING LOT' || oldSystemNotesStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - OFF PEAK PIPELINE
                            total_suspect_off_peak_pipeline += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            total_prospect_opportunity += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            total_suspect_follow_up += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            total_suspect_new += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            total_suspect_qualified += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            total_suspect_lpo_followup += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-VALIDATED') {
                            //SUSPECT - VALIDATED
                            total_suspect_validated += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            total_customer_free_trial += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL
                            total_customer_free_trial_pending += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            total_suspect_no_answer += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            total_suspect_in_contact += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            total_prospect_qualified += parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot += parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified += parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial += parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed += parseInt(prospectCount);
                            }
                        }

                    } else if (oldSystemNotesStatus != null &&
                        oldSystemNotesStatus != custStatus) {



                        if (oldSystemNotesStatus == 'CUSTOMER-SIGNED(100%)' || oldSystemNotesStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                            salesRepStatusTransitionChildSet[20] = {
                                title: 'Customer - Signed', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_customer_signed
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            salesRepStatusTransitionChildSet[1] = {
                                title: 'Suspect - Hot Lead', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_hot_lead
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            salesRepStatusTransitionChildSet[12] = {
                                title: 'Suspect - Lost', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_lost
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            salesRepStatusTransitionChildSet[13] = {
                                title: 'Suspect - Out of Territory', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_oot
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            salesRepStatusTransitionChildSet[14] = {
                                title: 'Suspect - Customer - Lost', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_customer_lost
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-REP REASSIGN' || oldSystemNotesStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            salesRepStatusTransitionChildSet[4] = {
                                title: 'Suspect - Rep Reassign', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_reassign
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            salesRepStatusTransitionChildSet[17] = {
                                title: 'Prospect - Quote Sent', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_prospect_quote_sent
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            salesRepStatusTransitionChildSet[9] = {
                                title: 'Prospect - No Answer', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_prospect_no_answer
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-IN CONTACT(6%)') {
                            //PROSPECT - IN CONTACT
                            salesRepStatusTransitionChildSet[10] = {
                                title: 'Prospect - In Answer', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_prospect_in_contact
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-PARKING LOT' || oldSystemNotesStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - OFF PEAK PIPELINE
                            salesRepStatusTransitionChildSet[11] = {
                                title: 'Prospect - Parking Lot', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_off_peak_pipeline
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            salesRepStatusTransitionChildSet[15] = {
                                title: 'Prospect - Opportunity', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_prospect_opportunity
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            salesRepStatusTransitionChildSet[5] = {
                                title: 'Suspect - Follow Up', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_follow_up
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            salesRepStatusTransitionChildSet[0] = {
                                title: 'Suspect - New', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_new
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            salesRepStatusTransitionChildSet[2] = {
                                title: 'Suspect - Qualified', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_qualified
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            salesRepStatusTransitionChildSet[6] = {
                                title: 'Suspect - LPO Follow Up', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_lpo_followup
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-VALIDATED') {
                            //SUSPECT - VALIDATED
                            salesRepStatusTransitionChildSet[3] = {
                                title: 'Suspect - Validated', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_validated
                            }
                        } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            salesRepStatusTransitionChildSet[19] = {
                                title: 'Customer - Free Trial', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_customer_free_trial
                            }
                        } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL
                            salesRepStatusTransitionChildSet[18] = {
                                title: 'Customer - Pending Free Trial', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_customer_free_trial_pending
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            salesRepStatusTransitionChildSet[7] = {
                                title: 'Suspect - No Answer', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_no_answer
                            }
                        } else if (oldSystemNotesStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            salesRepStatusTransitionChildSet[8] = {
                                title: 'Suspect - In Contact', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_suspect_in_contact
                            }
                        } else if (oldSystemNotesStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            salesRepStatusTransitionChildSet[16] = {
                                title: 'Prospect - Qualified', suspect_new: suspect_new,
                                suspect_hot_lead: suspect_hot_lead,
                                suspect_qualified: suspect_qualified,
                                suspect_validated: suspect_validated,
                                suspect_reassign: suspect_reassign,
                                suspect_follow_up: suspect_follow_up,
                                suspect_lpo_followup: suspect_lpo_followup,
                                suspect_no_answer: suspect_no_answer,
                                suspect_in_contact: suspect_in_contact,
                                prospect_no_answer: prospect_no_answer,
                                prospect_in_contact: prospect_in_contact,
                                suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                                suspect_lost: suspect_lost,
                                suspect_oot: suspect_oot,
                                suspect_customer_lost: suspect_customer_lost,
                                prospect_opportunity: prospect_opportunity,
                                prospect_qualified: prospect_qualified,
                                prospecy_quote_sent: prospecy_quote_sent,
                                customer_free_trial_pending: customer_free_trial_pending,
                                customer_free_trial: customer_free_trial,
                                customer_signed: customer_signed,
                                total_leads: total_prospect_qualified
                            }
                        }


                        customer_signed = 0;
                        total_customer_signed = 0;
                        suspect_hot_lead = 0;
                        total_suspect_hot_lead = 0;
                        suspect_reassign = 0;
                        total_suspect_reassign = 0;
                        suspect_lost = 0;
                        total_suspect_lost = 0;
                        suspect_oot = 0;
                        total_suspect_oot = 0;
                        suspect_customer_lost = 0;
                        total_suspect_customer_lost = 0;
                        suspect_off_peak_pipeline = 0;
                        total_suspect_off_peak_pipeline = 0;
                        prospect_opportunity = 0;
                        total_prospect_opportunity = 0;
                        prospecy_quote_sent = 0;
                        total_prospect_quote_sent = 0;
                        prospect_no_answer = 0;
                        total_prospect_no_answer = 0;
                        prospect_in_contact = 0;
                        total_prospect_in_contact = 0;
                        suspect_follow_up = 0;
                        total_suspect_follow_up = 0;
                        prospect_qualified = 0;
                        total_prospect_qualified = 0;
                        suspect_new = 0;
                        total_suspect_new = 0;

                        suspect_lpo_followup = 0;
                        total_suspect_lpo_followup = 0;
                        suspect_qualified = 0;
                        total_suspect_qualified = 0;

                        suspect_validated = 0;
                        total_suspect_validated = 0;
                        customer_free_trial = 0;
                        total_customer_free_trial = 0;
                        customer_free_trial_pending = 0;
                        total_customer_free_trial_pending = 0;

                        suspect_no_answer = 0;
                        total_suspect_no_answer = 0;
                        suspect_in_contact = 0;
                        total_suspect_in_contact = 0;

                        if (custStatus == 'CUSTOMER-SIGNED(100%)' || custStatus == 'CUSTOMER-TO BE FINALISED') {

                            total_customer_signed = parseInt(prospectCount);
                            //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            total_suspect_hot_lead = parseInt(prospectCount);
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            total_suspect_lost = parseInt(prospectCount);
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            total_suspect_oot = parseInt(prospectCount);
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            total_suspect_customer_lost = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-REP REASSIGN' || custStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            total_suspect_reassign = parseInt(prospectCount);
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            total_prospect_quote_sent = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            total_prospect_no_answer = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'PROSPECT-IN CONTACT(6%)') {
                            //PROSPECT - IN CONTACT
                            total_prospect_in_contact = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-PARKING LOT' || custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - OFF PEAK PIPELINE
                            total_suspect_off_peak_pipeline = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            total_prospect_opportunity = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            total_suspect_follow_up = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            total_suspect_new = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            total_suspect_qualified = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            total_suspect_lpo_followup = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-VALIDATED') {
                            //SUSPECT - VALIDATED
                            total_suspect_validated = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            total_customer_free_trial = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL
                            total_customer_free_trial_pending = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            total_suspect_no_answer = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            total_suspect_in_contact = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        } else if (custStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            total_prospect_qualified = parseInt(prospectCount)
                            if (newCustStatus == 'SUSPECT-NEW') {
                                //SUSPECT - NEW
                                suspect_new = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                                //SUSPECT - HOT LEAD
                                suspect_hot_lead = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                                //SUSPECT - QUALIFIED
                                suspect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                                //SUSPECT - VALIDATED
                                suspect_validated = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                                //SUSPECT - REP REASSIGN
                                suspect_reassign = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                                //SUSPECT - FOLLOW UP
                                suspect_follow_up = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                                //SUSPECT - LPO FOLLOW UP
                                suspect_lpo_followup = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                                //SUSPECT - NO ANSWER
                                suspect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                                //PROSPECT - NO ANSWER
                                prospect_no_answer = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                                //SUSPECT - IN CONTACT
                                suspect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                                //PROSPECT - IN CONTACT
                                prospect_in_contact = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                                //SUSPECT - OFF PEAK PIPELINE
                                suspect_off_peak_pipeline = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-LOST') {
                                //SUSPECT - LOST
                                suspect_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                                //SUSPECT - OUT OF TERRITORY
                                suspect_oot = parseInt(prospectCount);
                            } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                                //SUSPECT - CUSTOMER - LOST
                                suspect_customer_lost = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                                //PROSPECT - OPPORTUNITY
                                prospect_opportunity = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                                //PROSPECT - QUALIFIED
                                prospect_qualified = parseInt(prospectCount);
                            } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                                //PROSPECT - QUOTE SENT
                                prospecy_quote_sent = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                                //CUSTOMER - FREE TRIAL PENDING
                                customer_free_trial_pending = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                                //CUSTOMER - FREE TRIAL
                                customer_free_trial = parseInt(prospectCount);
                            } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                                //CUSTOMER _ SIGNED
                                customer_signed = parseInt(prospectCount);
                            }
                        }
                    }
                } else if (count3 > 0 && (oldSystemNotesSetBy != systemNotesSetBy)) {

                    if (oldSystemNotesStatus == 'CUSTOMER-SIGNED(100%)' || oldSystemNotesStatus == 'CUSTOMER-TO BE FINALISED') {
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        salesRepStatusTransitionChildSet[20] = {
                            title: 'Customer - Signed', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_customer_signed
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        salesRepStatusTransitionChildSet[1] = {
                            title: 'Suspect - Hot Lead', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_hot_lead
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        salesRepStatusTransitionChildSet[12] = {
                            title: 'Suspect - Lost', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_lost
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        salesRepStatusTransitionChildSet[13] = {
                            title: 'Suspect - Out of Territory', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_oot
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        salesRepStatusTransitionChildSet[14] = {
                            title: 'Suspect - Customer - Lost', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_customer_lost
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-REP REASSIGN' || oldSystemNotesStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        salesRepStatusTransitionChildSet[4] = {
                            title: 'Suspect - Rep Reassign', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_reassign
                        }
                    } else if (oldSystemNotesStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        salesRepStatusTransitionChildSet[17] = {
                            title: 'Prospect - Quote Sent', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_quote_sent
                        }
                    } else if (oldSystemNotesStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        salesRepStatusTransitionChildSet[9] = {
                            title: 'Prospect - No Answer', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_no_answer
                        }
                    } else if (oldSystemNotesStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        salesRepStatusTransitionChildSet[10] = {
                            title: 'Prospect - In Answer', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_in_contact
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-PARKING LOT' || oldSystemNotesStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        salesRepStatusTransitionChildSet[11] = {
                            title: 'Prospect - Parking Lot', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_off_peak_pipeline
                        }
                    } else if (oldSystemNotesStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        salesRepStatusTransitionChildSet[15] = {
                            title: 'Prospect - Opportunity', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_opportunity
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        salesRepStatusTransitionChildSet[5] = {
                            title: 'Suspect - Follow Up', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_follow_up
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        salesRepStatusTransitionChildSet[0] = {
                            title: 'Suspect - New', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_new
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        salesRepStatusTransitionChildSet[2] = {
                            title: 'Suspect - Qualified', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_qualified
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        salesRepStatusTransitionChildSet[6] = {
                            title: 'Suspect - LPO Follow Up', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_lpo_followup
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        salesRepStatusTransitionChildSet[3] = {
                            title: 'Suspect - Validated', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_validated
                        }
                    } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        salesRepStatusTransitionChildSet[19] = {
                            title: 'Customer - Free Trial', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_customer_free_trial
                        }
                    } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        salesRepStatusTransitionChildSet[18] = {
                            title: 'Customer - Pending Free Trial', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_customer_free_trial_pending
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        salesRepStatusTransitionChildSet[7] = {
                            title: 'Suspect - No Answer', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_no_answer
                        }
                    } else if (oldSystemNotesStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        salesRepStatusTransitionChildSet[8] = {
                            title: 'Suspect - In Contact', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_suspect_in_contact
                        }
                    } else if (oldSystemNotesStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        salesRepStatusTransitionChildSet[16] = {
                            title: 'Prospect - Qualified', suspect_new: suspect_new,
                            suspect_hot_lead: suspect_hot_lead,
                            suspect_qualified: suspect_qualified,
                            suspect_validated: suspect_validated,
                            suspect_reassign: suspect_reassign,
                            suspect_follow_up: suspect_follow_up,
                            suspect_lpo_followup: suspect_lpo_followup,
                            suspect_no_answer: suspect_no_answer,
                            suspect_in_contact: suspect_in_contact,
                            prospect_no_answer: prospect_no_answer,
                            prospect_in_contact: prospect_in_contact,
                            suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                            suspect_lost: suspect_lost,
                            suspect_oot: suspect_oot,
                            suspect_customer_lost: suspect_customer_lost,
                            prospect_opportunity: prospect_opportunity,
                            prospect_qualified: prospect_qualified,
                            prospecy_quote_sent: prospecy_quote_sent,
                            customer_free_trial_pending: customer_free_trial_pending,
                            customer_free_trial: customer_free_trial,
                            customer_signed: customer_signed,
                            total_leads: total_prospect_qualified
                        }
                    }

                    if (oldSystemNotesSetBy == 'Aleyna A Harnett') {
                        statusTransitionBySalesRepDataSet.push(['', "Aleyna A Harnett", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Alison Savona') {
                        statusTransitionBySalesRepDataSet.push(['', "Alison Savona", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Belinda Urbani') {
                        statusTransitionBySalesRepDataSet.push(['', "Belinda Urbani", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Kerina Helliwell') {
                        statusTransitionBySalesRepDataSet.push(['', "Kerina Helliwell", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Lee Russell') {
                        statusTransitionBySalesRepDataSet.push(['', "Lee Russell", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Liam Pike') {
                        statusTransitionBySalesRepDataSet.push(['', "Liam Pike", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Luke Forbes') {
                        statusTransitionBySalesRepDataSet.push(['', "Luke Forbes", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Paul D McIntosh') {
                        statusTransitionBySalesRepDataSet.push(['', "Paul D McIntosh", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    } else if (oldSystemNotesSetBy == 'Stefania Ferreyra') {
                        statusTransitionBySalesRepDataSet.push(['', "Stefania Ferreyra", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                    }


                    customer_signed = 0;
                    total_customer_signed = 0;
                    suspect_hot_lead = 0;
                    total_suspect_hot_lead = 0;
                    suspect_reassign = 0;
                    total_suspect_reassign = 0;
                    suspect_lost = 0;
                    total_suspect_lost = 0;
                    suspect_oot = 0;
                    total_suspect_oot = 0;
                    suspect_customer_lost = 0;
                    total_suspect_customer_lost = 0;
                    suspect_off_peak_pipeline = 0;
                    total_suspect_off_peak_pipeline = 0;
                    prospect_opportunity = 0;
                    total_prospect_opportunity = 0;
                    prospecy_quote_sent = 0;
                    total_prospect_quote_sent = 0;
                    prospect_no_answer = 0;
                    total_prospect_no_answer = 0;
                    prospect_in_contact = 0;
                    total_prospect_in_contact = 0;
                    suspect_follow_up = 0;
                    total_suspect_follow_up = 0;
                    prospect_qualified = 0;
                    total_prospect_qualified = 0;
                    suspect_new = 0;
                    total_suspect_new = 0;

                    suspect_lpo_followup = 0;
                    total_suspect_lpo_followup = 0;
                    suspect_qualified = 0;
                    total_suspect_qualified = 0;

                    suspect_validated = 0;
                    total_suspect_validated = 0;
                    customer_free_trial = 0;
                    total_customer_free_trial = 0;
                    customer_free_trial_pending = 0;
                    total_customer_free_trial_pending = 0;

                    suspect_no_answer = 0;
                    total_suspect_no_answer = 0;
                    suspect_in_contact = 0;
                    total_suspect_in_contact = 0;
                    salesRepStatusTransitionChildSet = [];
                    totalLeadCountBySalesRep = 0;

                    if (custStatus == 'CUSTOMER-SIGNED(100%)' || custStatus == 'CUSTOMER-TO BE FINALISED') {

                        total_customer_signed = parseInt(prospectCount);
                        //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-HOT LEAD') {
                        //SUSPECT - HOT LEAD
                        total_suspect_hot_lead = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LOST') {
                        //SUSPECT - LOST
                        total_suspect_lost = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-OUT OF TERRITORY') {
                        //SUSPECT - OUT OF TERRITORY
                        total_suspect_oot = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-CUSTOMER - LOST') {
                        //SUSPECT - CUSTOMER - LOST
                        total_suspect_customer_lost = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-REP REASSIGN' || custStatus == 'SUSPECT-REASSIGN') {
                        //SUSPECT - REP REASSIGN
                        total_suspect_reassign = parseInt(prospectCount);
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUOTE SENT(50%)') {
                        //PROSPECT - QUOTE SENT
                        total_prospect_quote_sent = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-NO ANSWER(3%)') {
                        //PROSPECT - NO ANSWER
                        total_prospect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-IN CONTACT(6%)') {
                        //PROSPECT - IN CONTACT
                        total_prospect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-PARKING LOT' || custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                        //SUSPECT - OFF PEAK PIPELINE
                        total_suspect_off_peak_pipeline = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-OPPORTUNITY') {
                        //PROSPECT - OPPORTUNITY
                        total_prospect_opportunity = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                        //SUSPECT - FOLLOW UP
                        total_suspect_follow_up = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NEW') {
                        //SUSPECT - NEW
                        total_suspect_new = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-QUALIFIED') {
                        //SUSPECT - QUALIFIED
                        total_suspect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-LPO FOLLOW-UP') {
                        //SUSPECT - LPO FOLLOW UP
                        total_suspect_lpo_followup = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-VALIDATED') {
                        //SUSPECT - VALIDATED
                        total_suspect_validated = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                        //CUSTOMER - FREE TRIAL
                        total_customer_free_trial_pending = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-NO ANSWER') {
                        //SUSPECT - NO ANSWER
                        total_suspect_no_answer = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'SUSPECT-IN CONTACT') {
                        //SUSPECT - IN CONTACT
                        total_suspect_in_contact = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    } else if (custStatus == 'PROSPECT-QUALIFIED') {
                        //PROSPECT - QUALIFIED
                        total_prospect_qualified = parseInt(prospectCount)
                        if (newCustStatus == 'SUSPECT-NEW') {
                            //SUSPECT - NEW
                            suspect_new = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-HOT LEAD') {
                            //SUSPECT - HOT LEAD
                            suspect_hot_lead = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-QUALIFIED') {
                            //SUSPECT - QUALIFIED
                            suspect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-VALIDATED' || newCustStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                            //SUSPECT - VALIDATED
                            suspect_validated = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-REP REASSIGN' || newCustStatus == 'SUSPECT-REASSIGN') {
                            //SUSPECT - REP REASSIGN
                            suspect_reassign = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                            //SUSPECT - FOLLOW UP
                            suspect_follow_up = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LPO FOLLOW-UP') {
                            //SUSPECT - LPO FOLLOW UP
                            suspect_lpo_followup = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-NO ANSWER') {
                            //SUSPECT - NO ANSWER
                            suspect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-NO ANSWER(3%)') {
                            //PROSPECT - NO ANSWER
                            prospect_no_answer = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-IN CONTACT') {
                            //SUSPECT - IN CONTACT
                            suspect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-IN CONTACT') {
                            //PROSPECT - IN CONTACT
                            prospect_in_contact = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-PARKING LOT') {
                            //SUSPECT - OFF PEAK PIPELINE
                            suspect_off_peak_pipeline = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-LOST') {
                            //SUSPECT - LOST
                            suspect_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-OUT OF TERRITORY') {
                            //SUSPECT - OUT OF TERRITORY
                            suspect_oot = parseInt(prospectCount);
                        } else if (newCustStatus == 'SUSPECT-CUSTOMER - LOST') {
                            //SUSPECT - CUSTOMER - LOST
                            suspect_customer_lost = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-OPPORTUNITY') {
                            //PROSPECT - OPPORTUNITY
                            prospect_opportunity = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUALIFIED') {
                            //PROSPECT - QUALIFIED
                            prospect_qualified = parseInt(prospectCount);
                        } else if (newCustStatus == 'PROSPECT-QUOTE SENT(50%)') {
                            //PROSPECT - QUOTE SENT
                            prospecy_quote_sent = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                            //CUSTOMER - FREE TRIAL PENDING
                            customer_free_trial_pending = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                            //CUSTOMER - FREE TRIAL
                            customer_free_trial = parseInt(prospectCount);
                        } else if (newCustStatus == 'CUSTOMER-SIGNED(100%)' || newCustStatus == 'CUSTOMER-TO BE FINALISED') {
                            //CUSTOMER _ SIGNED
                            customer_signed = parseInt(prospectCount);
                        }
                    }
                }




                oldSystemNotesStatus = custStatus
                oldSystemNotesSetBy = systemNotesSetBy;
                totalLeadCountBySalesRep += parseInt(prospectCount)
                count3++;
                return true;
            });

            if (count3 > 0) {
                if (oldSystemNotesStatus == 'CUSTOMER-SIGNED(100%)' || oldSystemNotesStatus == 'CUSTOMER-TO BE FINALISED') {
                    //CUSTOMER _ SIGNED or CUSTOMER - TO BE FINALISED
                    salesRepStatusTransitionChildSet[20] = {
                        title: 'Customer - Signed', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_customer_signed
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-HOT LEAD') {
                    //SUSPECT - HOT LEAD
                    salesRepStatusTransitionChildSet[1] = {
                        title: 'Suspect - Hot Lead', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_hot_lead
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-LOST') {
                    //SUSPECT - LOST
                    salesRepStatusTransitionChildSet[12] = {
                        title: 'Suspect - Lost', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_lost
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-OUT OF TERRITORY') {
                    //SUSPECT - OUT OF TERRITORY
                    salesRepStatusTransitionChildSet[13] = {
                        title: 'Suspect - Out of Territory', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_oot
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-CUSTOMER - LOST') {
                    //SUSPECT - CUSTOMER - LOST
                    salesRepStatusTransitionChildSet[14] = {
                        title: 'Suspect - Customer - Lost', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_customer_lost
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-REP REASSIGN' || oldSystemNotesStatus == 'SUSPECT-REASSIGN') {
                    //SUSPECT - REP REASSIGN
                    salesRepStatusTransitionChildSet[4] = {
                        title: 'Suspect - Rep Reassign', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_reassign
                    }
                } else if (oldSystemNotesStatus == 'PROSPECT-QUOTE SENT(50%)') {
                    //PROSPECT - QUOTE SENT
                    salesRepStatusTransitionChildSet[17] = {
                        title: 'Prospect - Quote Sent', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_quote_sent
                    }
                } else if (oldSystemNotesStatus == 'PROSPECT-NO ANSWER(3%)') {
                    //PROSPECT - NO ANSWER
                    salesRepStatusTransitionChildSet[9] = {
                        title: 'Prospect - No Answer', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_no_answer
                    }
                } else if (oldSystemNotesStatus == 'PROSPECT-IN CONTACT(6%)') {
                    //PROSPECT - IN CONTACT
                    salesRepStatusTransitionChildSet[10] = {
                        title: 'Prospect - In Answer', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_in_contact
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-PARKING LOT' || oldSystemNotesStatus == 'SUSPECT-OFF PEAK PIPELINE') {
                    //SUSPECT - OFF PEAK PIPELINE
                    salesRepStatusTransitionChildSet[11] = {
                        title: 'Prospect - Parking Lot', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_off_peak_pipeline
                    }
                } else if (oldSystemNotesStatus == 'PROSPECT-OPPORTUNITY') {
                    //PROSPECT - OPPORTUNITY
                    salesRepStatusTransitionChildSet[15] = {
                        title: 'Prospect - Opportunity', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_opportunity
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-FOLLOW-UP(2%)') {
                    //SUSPECT - FOLLOW UP
                    salesRepStatusTransitionChildSet[5] = {
                        title: 'Suspect - Follow Up', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_follow_up
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-NEW') {
                    //SUSPECT - NEW
                    salesRepStatusTransitionChildSet[0] = {
                        title: 'Suspect - New', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_new
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-QUALIFIED') {
                    //SUSPECT - QUALIFIED
                    salesRepStatusTransitionChildSet[2] = {
                        title: 'Suspect - Qualified', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_qualified
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-LPO FOLLOW-UP') {
                    //SUSPECT - LPO FOLLOW UP
                    salesRepStatusTransitionChildSet[6] = {
                        title: 'Suspect - LPO Follow Up', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_lpo_followup
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-VALIDATED') {
                    //SUSPECT - VALIDATED
                    salesRepStatusTransitionChildSet[3] = {
                        title: 'Suspect - Validated', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_validated
                    }
                } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL(95%)') {
                    //CUSTOMER - FREE TRIAL
                    salesRepStatusTransitionChildSet[19] = {
                        title: 'Customer - Free Trial', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_customer_free_trial
                    }
                } else if (oldSystemNotesStatus == 'CUSTOMER-FREE TRIAL PENDING') {
                    //CUSTOMER - FREE TRIAL
                    salesRepStatusTransitionChildSet[18] = {
                        title: 'Customer - Pending Free Trial', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_customer_free_trial_pending
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-NO ANSWER') {
                    //SUSPECT - NO ANSWER
                    salesRepStatusTransitionChildSet[7] = {
                        title: 'Suspect - No Answer', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_no_answer
                    }
                } else if (oldSystemNotesStatus == 'SUSPECT-IN CONTACT') {
                    //SUSPECT - IN CONTACT
                    salesRepStatusTransitionChildSet[8] = {
                        title: 'Suspect - In Contact', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_suspect_in_contact
                    }
                } else if (oldSystemNotesStatus == 'PROSPECT-QUALIFIED') {
                    //PROSPECT - QUALIFIED
                    salesRepStatusTransitionChildSet[16] = {
                        title: 'Prospect - Qualified', suspect_new: suspect_new,
                        suspect_hot_lead: suspect_hot_lead,
                        suspect_qualified: suspect_qualified,
                        suspect_validated: suspect_validated,
                        suspect_reassign: suspect_reassign,
                        suspect_follow_up: suspect_follow_up,
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        suspect_off_peak_pipeline: suspect_off_peak_pipeline,
                        suspect_lost: suspect_lost,
                        suspect_oot: suspect_oot,
                        suspect_customer_lost: suspect_customer_lost,
                        prospect_opportunity: prospect_opportunity,
                        prospect_qualified: prospect_qualified,
                        prospecy_quote_sent: prospecy_quote_sent,
                        customer_free_trial_pending: customer_free_trial_pending,
                        customer_free_trial: customer_free_trial,
                        customer_signed: customer_signed,
                        total_leads: total_prospect_qualified
                    }
                }

                if (oldSystemNotesSetBy == 'Aleyna A Harnett') {
                    statusTransitionBySalesRepDataSet.push(['', "Aleyna A Harnett", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Alison Savona') {
                    statusTransitionBySalesRepDataSet.push(['', "Alison Savona", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Belinda Urbani') {
                    statusTransitionBySalesRepDataSet.push(['', "Belinda Urbani", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Kerina Helliwell') {
                    statusTransitionBySalesRepDataSet.push(['', "Kerina Helliwell", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Lee Russell') {
                    statusTransitionBySalesRepDataSet.push(['', "Lee Russell", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Liam Pike') {
                    statusTransitionBySalesRepDataSet.push(['', "Liam Pike", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Luke Forbes') {
                    statusTransitionBySalesRepDataSet.push(['', "Luke Forbes", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Paul D McIntosh') {
                    statusTransitionBySalesRepDataSet.push(['', "Paul D McIntosh", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                } else if (oldSystemNotesSetBy == 'Stefania Ferreyra') {
                    statusTransitionBySalesRepDataSet.push(['', "Stefania Ferreyra", totalLeadCountBySalesRep, salesRepStatusTransitionChildSet])
                }
            }

            console.log()

            var dataTableSalesRepList = $('#mpexusage-sales_rep_list').DataTable({
                destroy: true,
                data: statusTransitionBySalesRepDataSet,
                pageLength: 1000,
                responsive: true,
                order: [[2, 'desc']],
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
                    title: 'Expand',
                    className: 'dt-control',
                    orderable: false,
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-primary expand-button" style="background-color: #095C7B;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                }, {
                    title: 'Sales Rep'//1
                }, {
                    title: 'Count of Status Transitions'//2
                }, {
                    title: 'Child Table' //3
                }],
                columnDefs: [{
                    targets: [1, 2],
                    className: 'bolded'
                }, {
                    targets: [0, 2],
                    className: 'col-xs-1'
                }, {
                    targets: [3],
                    visible: false
                }],
                rowCallback: function (row, data, index) {
                },
                footerCallback: function (row, data, start, end, display) {

                }

            });

            dataTableSalesRepList.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createSalesRepListTableChild(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-sales_rep_list tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableSalesRepList.row(tr);

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


            debt_set = [];
            debt_set2 = [];

        }

        function destroyChild(row) {
            // And then hide the row
            row.child.hide();
        }

        function createCustomerListTableChild(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[7].forEach(function (el) {

                if (!isNullorEmpty(el)) {
                    childSet.push([el.systemNotesDate, el.systemNotesSetBy, el.oldCustStatus, el.newCustStatus]);
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
                    { title: 'System Notes Date' },
                    { title: 'Set By' },
                    { title: 'Old Status' },
                    { title: 'New Status' },
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                }
            });
        }

        function createByStatusCustomerListTableChild(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[3].forEach(function (el) {

                if (!isNullorEmpty(el)) {
                    childSet.push([el.customerId, el.customerName, el.customerFranchiseeText]);
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
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                ],
                columnDefs: [],
                rowCallback: function (row, data) {
                }
            });
        }

        function createSalesRepListTableChild(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="100%"/>');
            var previewDataSet = [];
            row.data()[3].forEach(function (preview_row) {

                if (!isNullorEmpty(preview_row)) {
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

                    var totalLeadsCol = preview_row.total_leads + '';
                    previewDataSet.push([preview_row.title,
                        suspectNewCol,
                        hotLeadCol,
                        suspectQualifiedCol,
                        suspectValidatedCol,
                        reassignCol,
                        followUpCol,
                        suspectLPOFollowupwCol,
                        suspectNoAnswerCol,
                        suspectInContactCol,
                        noAnswerCol,
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
                    preview_row.total_leads.toString(),
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
                "bAutoWidth": true,
                data: previewDataSet,
                "ordering": false,
                columns: [{
                    title: 'Transition From and To', className: 'table-bg-color',//0
                }, {
                    title: 'Suspect - New', className: 'table-bg-color',//1
                }, {
                    title: 'Suspect - Hot Lead', className: 'table-bg-color',//2
                }, {
                    title: 'Suspect - Qualified', className: 'table-bg-color',//3
                }, {
                    title: 'Suspect - Validated', className: 'table-bg-color',//4
                }, {
                    title: 'Suspect - Reassign', className: 'table-bg-color',//5
                }, {
                    title: 'Suspect - Follow Up', className: 'table-bg-color',//6
                }, {
                    title: 'Suspect - LPO Follow Up', className: 'table-bg-color',//7
                }, {
                    title: 'Suspect - No Answer', className: 'table-bg-color',//8
                }, {
                    title: 'Suspect - In Contact', className: 'table-bg-color',//9
                }, {
                    title: 'Prospect - No Answer', className: 'table-bg-color',//10
                }, {
                    title: 'Prospect - In Contact', className: 'table-bg-color',//11
                }, {
                    title: 'Suspect - Parking Lot', className: 'table-bg-color',//12
                }, {
                    title: 'Suspect - Lost', className: 'table-bg-color',//13
                }, {
                    title: 'Suspect - Out of Territory', className: 'table-bg-color',//14
                }, {
                    title: 'Suspect - Customer - Lost', className: 'table-bg-color',//15
                }, {
                    title: 'Prospect - Opportunity', className: 'table-bg-color',//16
                }, {
                    title: 'Prospect - Qualified', className: 'table-bg-color',//17
                }, {
                    title: 'Prospect - Quote Sent', className: 'table-bg-color',//18
                }, {
                    title: 'Customer - Free Trial Pending', className: 'table-bg-color',//19
                }, {
                    title: 'Customer - Free Trial', className: 'table-bg-color',//20
                }, {
                    title: 'Customer - Signed', className: 'table-bg-color',//21
                }],
                columnDefs: [],
                rowCallback: function (row, data) {
                    if (data[0] == 'Suspect - Customer - Lost' || data[0] == 'Suspect - Lost') {
                        $('td', row).css('background-color', '#E9B775');
                    }

                    $('td', row).eq(0).css('background-color', '#045d7b');
                    $('td', row).eq(0).css('color', '#ffffff');

                    if (data[13] != '0 (0%)') {
                        $('td', row).eq(13).css('background-color', '#e97577');
                    }

                    if (data[15] != '0 (0%)') {
                        $('td', row).eq(15).css('background-color', '#e97577');
                    }

                    if (data[21] != '0 (0%)') {
                        $('td', row).eq(21).css('background-color', '#54bf9d');
                    }

                    if (data[20] != '0 (0%)') {
                        $('td', row).eq(20).css('background-color', '#54bf9d');
                    }

                    if (data[19] != '0 (0%)') {
                        $('td', row).eq(19).css('background-color', '#54bf9d');
                    }
                }
            });
        }


        function saveRecord() {

            return true;
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