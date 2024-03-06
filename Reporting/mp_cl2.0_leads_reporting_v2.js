/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript

 * Author:               Ankith Ravindran
 * Created on:           Tue Apr 18 2023
 * Modified on:          Tue Apr 18 2023 11:22:39
 * SuiteScript Version:  2.0 
 * Description:          Client script for the reporting page that shows reporting based on the leads that come into the system and the customers that have been signed up based on the leads. 
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
],
    function (email, runtime, search, record, http, log, error, url, format,
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
        var prospectDataSet = [];
        var prospectOpportunityDataSet = [];
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
        var existingCustomerChildDataSet = [];
        var prospectChildDataSet = [];
        var prospectOpportunityChildDataSet = [];
        var prospectQuoteSentChildDataSet = [];
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
            if (role != 1000) {
                $('.quote_sent_label_section').removeClass('hide');
                $('.quote_sent_div').removeClass('hide');
                $('.usage_label_section').removeClass('hide');
                $('.calcprodusage_div').removeClass('hide');
                $('.usage_date_div').removeClass('hide');
                $('.invoice_label_section').removeClass('hide');
                $('.invoice_date_type_div').removeClass('hide');
                $('.source_salesrep_label_section').removeClass('hide');
                $('.source_salesrep_section').removeClass('hide');
            }

            $('.signed_up_label_section').removeClass('hide');
            $('.signed_up_div').removeClass('hide');

            $('.filter_buttons_section').removeClass('hide');
            $('.tabs_section').removeClass('hide');
            $('.table_section').removeClass('hide');
            $('.instruction_div').removeClass('hide');
            $('.scorecard_percentage').removeClass('hide');

            $('.loading_section').addClass('hide');
        }

        function pageInit() {

            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");
            // pageLoad();


            debtDataSet = [];
            debt_set = [];

            date_from = $('#date_from').val();
            date_from = dateISOToNetsuite(date_from);

            date_to = $('#date_to').val();
            date_to = dateISOToNetsuite(date_to);

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

                zee = $(
                    '#zee_dropdown option:selected').val();

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


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage + "&invoice_date_from=" + invoice_date_from + '&invoice_date_to=' + invoice_date_to + '&campaign=' + sales_campaign + '&lpo=' + parent_lpo + '&lead_entered_by=' + lead_entered_by;


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


        }

        //Initialise the DataTable with headers.
        function submitSearch() {


            // userId = $('#user_dropdown option:selected').val();
            zee = $(
                '#zee_dropdown option:selected').val();

            loadDatatable(zee, userId);

            console.log('Loaded Results');
            afterSubmit();
        }

        //Function to add the filters and relaod the page
        function addFilters() {

            zee = $('#zee_dropdown option:selected').val();
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
            if (role == 1000) {
                //Search Name: Zee Lead by Status - Monthly Reporting
                var qualifiedLeadCountSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_zee_lead_by_status_monthly'
                });
            } else {
                //Search Name: Zee Lead by Status - Weekly Reporting
                var qualifiedLeadCountSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_3__2'
                });
            }


            if (!isNullorEmpty(zee_id)) {
                qualifiedLeadCountSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
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

            if (role == 1000) {
                //Customer Cancellation - Requested Date - All (Monthly)
                var customerCancellationRequestedDateSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_cust_cancellation_request_4'
                });
            } else {
                //Customer Cancellation - Requested Date - All
                var customerCancellationRequestedDateSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_cust_cancellation_request_3'
                });
            }


            if (!isNullorEmpty(zee_id)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_cancellation_requested_date',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_cancellation_requested_date',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }


            if (!isNullorEmpty(sales_rep)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }


            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                customerCancellationRequestedDateSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            var totalCancellationRequest = 0;
            var customerSavedCount = 0;
            var customerNotSavedCount = 0;
            var customerOnGoing = 0;
            var oldRequestedDate = null;
            var countCustomerCancellationRequest = 0;

            customerCancellationRequestedDateSearch.run().each(function (
                customerCancellationRequestedDateSearchResultSet) {

                var customerCancellationCount = parseInt(customerCancellationRequestedDateSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var requestedDate = customerCancellationRequestedDateSearchResultSet.getValue({
                    name: 'custentity_cancellation_requested_date',
                    summary: 'GROUP'
                });
                var customerSaved = customerCancellationRequestedDateSearchResultSet.getText({
                    name: 'custentity_customer_saved',
                    summary: 'GROUP'
                });

                if (role == 1000) {
                    var startDate = requestedDate;

                } else {
                    var splitMonthV2 = requestedDate.split('/');

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
                }

                if (oldRequestedDate == null || (oldRequestedDate == startDate)) {
                    totalCancellationRequest = totalCancellationRequest + customerCancellationCount;
                    if (customerSaved == 'Yes') {
                        customerSavedCount = customerSavedCount + customerCancellationCount;
                    } else if (customerSaved == 'No') {
                        customerNotSavedCount = customerNotSavedCount + customerCancellationCount;
                    } else {
                        customerOnGoing = customerOnGoing + customerCancellationCount
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

                    totalCancellationRequest = totalCancellationRequest + customerCancellationCount;
                    if (customerSaved == 'Yes') {
                        customerSavedCount = customerSavedCount + customerCancellationCount;
                    } else if (customerSaved == 'No') {
                        customerNotSavedCount = customerNotSavedCount + customerCancellationCount;
                    } else {
                        customerOnGoing = customerOnGoing + customerCancellationCount
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
                debt_setCustomerCancellationRequest
                    .forEach(function (preview_row, index) {

                        customerCancellationRequestDateDataSet.push([preview_row.requestedDate,
                        preview_row.totalCancellationRequest,
                        preview_row.customerSavedCount,
                        preview_row.customerNotSavedCount,
                        preview_row.customerOnGoing,
                        ]);

                    });
            }
            console.log('customerCancellationRequestDateDataSet: ' + customerCancellationRequestDateDataSet)

            var month_year_customer = []; // creating array for storing browser
            var customer_cancellation_requested_date_total = [];
            var customer_cancellation_requested_date_saved = [];
            var customer_cancellation_requested_date_notsaved = [];
            var customer_cancellation_requested_date_ongoing = [];

            for (var i = 0; i < customerCancellationRequestDateDataSet.length; i++) {
                month_year_customer.push(customerCancellationRequestDateDataSet[i][0]);
                customer_cancellation_requested_date_total[customerCancellationRequestDateDataSet[i][0]] = customerCancellationRequestDateDataSet[i][1]
                customer_cancellation_requested_date_saved[customerCancellationRequestDateDataSet[i][0]] = customerCancellationRequestDateDataSet[i][2]
                customer_cancellation_requested_date_notsaved[customerCancellationRequestDateDataSet[i][0]] = customerCancellationRequestDateDataSet[i][3]
                customer_cancellation_requested_date_ongoing[customerCancellationRequestDateDataSet[i][0]] = customerCancellationRequestDateDataSet[i][4]
            }

            var series_data100 = [];
            var series_data101 = [];
            var series_data102 = [];
            var series_data103 = [];
            var categores_customer_cancelled_request_week = []; // creating empty array for highcharts
            // categories
            Object.keys(customer_cancellation_requested_date_total).map(function (item, key) {
                console.log(item)
                series_data100.push(parseInt(customer_cancellation_requested_date_total[item]));
                series_data101.push(parseInt(customer_cancellation_requested_date_saved[item]));
                series_data102.push(parseInt(customer_cancellation_requested_date_notsaved[item]));
                series_data103.push(parseInt(customer_cancellation_requested_date_ongoing[item]));
                categores_customer_cancelled_request_week.push(item)
            });


            plotChartCustomerCanellationRequested(series_data100, series_data101,
                series_data102, series_data103, categores_customer_cancelled_request_week);

            //Customer Cancellation - Requested List - All
            var customerCancellationRequesteSearch = search.load({
                type: 'customer',
                id: 'customsearch_cust_cancellation_request_2'
            });

            if (!isNullorEmpty(zee_id)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_cancellation_requested_date',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_cancellation_requested_date',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }


            if (!isNullorEmpty(sales_rep)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {

                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                customerCancellationRequesteSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }



            var totalCancellationRequest = 0;
            var customerSavedCount = 0;
            var customerNotSavedCount = 0;
            var oldRequestedDate = null;
            var countCustomerCancellationRequest = 0;

            customerCancellationRequesteSearch.run().each(function (
                customerCancellationRequesteSearchResultSet) {

                var customerCancellationRequestDate = customerCancellationRequesteSearchResultSet.getValue({
                    name: 'custentity_cancellation_requested_date',
                    summary: "GROUP",
                });
                var customerInternalId = customerCancellationRequesteSearchResultSet.getValue({
                    name: 'internalid',
                    summary: "GROUP",
                });
                var customerEntityId = customerCancellationRequesteSearchResultSet.getValue({
                    name: 'entityid',
                    summary: "GROUP",
                });
                var customerCompanyName = customerCancellationRequesteSearchResultSet.getValue({
                    name: 'companyname',
                    summary: "GROUP",
                });
                var customerZee = customerCancellationRequesteSearchResultSet.getText({
                    name: 'partner',
                    summary: "GROUP",
                });
                var customerCancellationReason = customerCancellationRequesteSearchResultSet.getText({
                    name: 'custentity_service_cancellation_reason',
                    summary: "GROUP",
                });
                var customerCancellationOngoing = customerCancellationRequesteSearchResultSet.getText({
                    name: 'custentity_cancel_ongoing',
                    summary: "GROUP",
                });
                var customerSaved = customerCancellationRequesteSearchResultSet.getText({
                    name: 'custentity_customer_saved',
                    summary: "GROUP",
                });
                var customerSavedDate = customerCancellationRequesteSearchResultSet.getValue({
                    name: 'custentity_customer_saved_date',
                    summary: "GROUP",
                });
                var monthlyServiceRevenue = parseFloat(customerCancellationRequesteSearchResultSet.getValue({
                    name: 'custentity_monthly_reduc_service_revenue',
                    summary: "GROUP",
                }));
                var last6MonthsAvgInvoiceValue = parseFloat(customerCancellationRequesteSearchResultSet.getValue({
                    name: "amount",
                    join: "transaction",
                    summary: "AVG"
                }));



                var customerCancellationRequestDateSplit = customerCancellationRequestDate.split('/');

                var formattedDate = dateISOToNetsuite(customerCancellationRequestDateSplit[2] + '-' + customerCancellationRequestDateSplit[1] + '-' + customerCancellationRequestDateSplit[0]);

                var firstDayCustomerCancellationRequestDate = new Date(customerCancellationRequestDateSplit[0], (customerCancellationRequestDateSplit[1]), 1).getDate();
                var lastDayCustomerCancellationRequestDate = new Date(customerCancellationRequestDateSplit[0], (customerCancellationRequestDateSplit[1]), 0).getDate();

                if (firstDayCustomerCancellationRequestDate < 10) {
                    firstDayCustomerCancellationRequestDate = '0' + firstDayCustomerCancellationRequestDate;
                }

                // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                var startDateCustomerCancellationRequestDate = customerCancellationRequestDateSplit[2] + '-' + customerCancellationRequestDateSplit[1] + '-' +
                    customerCancellationRequestDateSplit[0];
                var monthsStartDateCustomerCancellationRequestDate = customerCancellationRequestDateSplit[2] + '-' + customerCancellationRequestDateSplit[1] + '-' +
                    firstDayCustomerCancellationRequestDate;
                // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                var lastDateCustomerCancellationRequestDate = customerCancellationRequestDateSplit[2] + '-' + customerCancellationRequestDateSplit[1] + '-' +
                    lastDayCustomerCancellationRequestDate

                if (customerSaved == 'Yes' || customerSaved == 'No') {
                    customerCancellationOngoing = '';
                } else {
                    customerCancellationOngoing = 'Yes';
                }


                if (!isNullorEmpty(customerSavedDate)) {
                    var customerSavedDateDateSplit = customerSavedDate.split('/');

                    var formattedDate = dateISOToNetsuite(customerSavedDateDateSplit[2] + '-' + customerSavedDateDateSplit[1] + '-' + customerSavedDateDateSplit[0]);

                    var firstDayCustomerSavedDate = new Date(customerSavedDateDateSplit[0], (customerSavedDateDateSplit[1]), 1).getDate();
                    var lastDayCustomerSavedDate = new Date(customerSavedDateDateSplit[0], (customerSavedDateDateSplit[1]), 0).getDate();

                    if (firstDayCustomerSavedDate < 10) {
                        firstDayCustomerSavedDate = '0' + firstDayCustomerSavedDate;
                    }

                    // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                    var startDateCustomerSavedDate = customerSavedDateDateSplit[2] + '-' + customerSavedDateDateSplit[1] + '-' +
                        customerSavedDateDateSplit[0];
                    var monthsStartDateCustomerSavedDate = customerSavedDateDateSplit[2] + '-' + customerSavedDateDateSplit[1] + '-' +
                        firstDayCustomerSavedDate;
                    // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                    var lastDateCustomerSavedDate = customerSavedDateDateSplit[2] + '-' + customerSavedDateDateSplit[1] + '-' +
                        lastDayCustomerSavedDate
                } else {
                    var startDateCustomerSavedDate = '';
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
                    financial(last6MonthsAvgInvoiceValue),
                    financial(monthlyServiceRevenue)
                ]
                );

                return true;
            });




            var dataTable3 = $('#mpexusage-cancellation').DataTable({
                data: customerCancellationRequestDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Request Date' },
                    { title: 'On-going' },
                    { title: 'Saved' },
                    { title: 'Saved Date' },
                    { title: 'Cancellation Reason' },
                    { title: 'Avg Invoice Value - Last 6 Months' },
                    { title: 'Saved Monthly Service Value' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [1, 2, 6, 10],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {
                    var row_color = ''
                    if (data[6] == 'No') {
                        $('td', row).css('background-color', '#E97777');
                    } else if (data[6] == 'Yes') {
                        $('td', row).css('background-color', '#439A97');
                    } else if (data[5] == 'Yes') {
                        $('td', row).css('background-color', '#f9c67a');
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
                    total_avg_invoice = api
                        .column(9)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_avg_invoice = api
                        .column(9, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(9).footer()).html(
                        formatter.format(page_total_avg_invoice)
                    );
                    // Total Expected Usage over all pages
                    total_monthly_service_revenue = api
                        .column(10)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_monthly_service_revenue = api
                        .column(10, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(10).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                    );

                }
            });


            if (role == 1000) {
                // Website New Leads - Signed - Weekly Reporting (Monthly)
                var customerListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_3'
                });
            } else {
                // Website New Leads - Signed - Weekly Reporting
                var customerListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2'
                });
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

            customerListBySalesRepWeeklySearch.run().each(function (
                customerListBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(customerListBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = customerListBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_prospect_opportunity",
                    summary: "GROUP"
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


            if (role == 1000) {
                // Website New Leads - Trial - Weekly Reporting (Monthly)
                var customerTrialListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_15'
                });
            } else {
                // Website New Leads - Trial - Weekly Reporting
                var customerTrialListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_4'
                });
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

            customerTrialListBySalesRepWeeklySearch.run().each(function (
                customerTrialListBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(customerTrialListBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = customerTrialListBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_prospect_opportunity",
                    summary: "GROUP"
                });

                var customerSource = customerTrialListBySalesRepWeeklySearchResultSet.getValue({
                    name: "leadsource",
                    summary: "GROUP"
                });

                var customerSourceText = customerTrialListBySalesRepWeeklySearchResultSet.getText({
                    name: "leadsource",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
                    var splitMonthV2 = weekLeadEntered.split('/');

                    var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);

                    var firstDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 1).getDate();
                    var lastDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 0).getDate();

                    if (firstDay < 10) {
                        firstDay = '0' + firstDay;
                    }
                    var startDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        splitMonthV2[0];
                    var monthsStartDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        firstDay;
                    var lastDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        lastDay
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

            if (role == 1000) {
                // Website New Leads - Prospect - Monthly Reporting
                var prospectWeeklyReportingSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__8'
                });
            } else {
                // Website New Leads - Prospect - Weekly Reporting
                var prospectWeeklyReportingSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_2'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }


            if (!isNullorEmpty(zee_id)) {
                prospectWeeklyReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            var count2 = 0;
            var oldDate2 = null;

            total_prospect_count = 0;
            prospecy_quote_sent = 0;
            prospect_no_answer = 0;
            prospect_in_contact = 0;
            var prospect_opportunity = 0;


            prospectWeeklyReportingSearch.run().each(function (
                prospectWeeklyReportingSearchResultSet) {


                var prospectCount = parseInt(prospectWeeklyReportingSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = prospectWeeklyReportingSearchResultSet.getValue({
                    name: "formuladate",
                    summary: "GROUP",
                });
                var custStatus = parseInt(prospectWeeklyReportingSearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                }));
                var custStatusText = prospectWeeklyReportingSearchResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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
                    }

                    total_prospect_count =
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact + prospect_opportunity

                } else if (oldDate2 != null &&
                    oldDate2 == startDate) {

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
                    }

                    total_prospect_count =
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact + prospect_opportunity

                } else if (oldDate2 != null &&
                    oldDate2 != startDate) {

                    debt_set4.push({
                        dateUsed: oldDate2,
                        prospecy_quote_sent: prospecy_quote_sent,
                        prospect_no_answer: prospect_no_answer,
                        prospect_in_contact: prospect_in_contact,
                        prospect_opportunity: prospect_opportunity,
                        total_prospect_count: total_prospect_count
                    });

                    total_prospect_count = 0;
                    prospecy_quote_sent = 0;
                    prospect_no_answer = 0;
                    prospect_in_contact = 0;
                    prospect_opportunity = 0;

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
                    }

                    total_prospect_count =
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact + prospect_opportunity
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
                    total_prospect_count: total_prospect_count
                });
            }

            previewDataSet2 = [];
            csvPreviewSet2 = [];


            if (!isNullorEmpty(debt_set4)) {
                debt_set4
                    .forEach(function (preview_row, index) {

                        previewDataSet2.push([preview_row.dateUsed,
                        preview_row.prospecy_quote_sent,
                        preview_row.prospect_no_answer,
                        preview_row.prospect_in_contact,
                        preview_row.prospect_opportunity,
                        preview_row.total_prospect_count
                        ]);

                    });
            }

            var month_year = []; // creating array for storing browse

            var prospecy_quote_sent = [];
            var prospect_no_answer = [];
            var prospect_in_contact = [];
            var prospect_opportunity = [];
            var total_prospects_leads = [];

            for (var i = 0; i < previewDataSet2.length; i++) {
                month_year.push(previewDataSet2[i][0]);
                prospecy_quote_sent[previewDataSet2[i][0]] = previewDataSet2[i][1]
                prospect_no_answer[previewDataSet2[i][0]] = previewDataSet2[i][2]
                prospect_in_contact[previewDataSet2[i][0]] = previewDataSet2[i][3]
                prospect_opportunity[previewDataSet2[i][0]] = previewDataSet2[i][4]
                total_prospects_leads[previewDataSet2[i][0]] = previewDataSet2[i][5]
            }


            var series_data40 = [];
            var series_data41 = [];
            var series_data42 = [];
            var series_data43 = [];
            var series_data44 = [];

            var categores5 = []; // creating empty array for highcharts
            // categories
            Object.keys(prospecy_quote_sent).map(function (item, key) {
                series_data40.push(parseInt(prospecy_quote_sent[item]));
                series_data41.push(parseInt(prospect_no_answer[item]));
                series_data42.push(parseInt(prospect_in_contact[item]));
                series_data43.push(parseInt(total_prospects_leads[item]));
                series_data44.push(parseInt(prospect_opportunity[item]));
                categores5.push(item)
            });


            plotChartProspects(series_data40,
                series_data41,
                series_data42,
                series_data43, series_data44, categores5);

            if (role == 1000) {
                // Website New Leads - Prospect Quote Sent - Monthly Reporting
                var prospectOpportunityWeeklyReportingSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__9'
                });
            } else {
                // Website New Leads - Prospect Quote Sent - Weekly Reporting
                var prospectOpportunityWeeklyReportingSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__3'
                });
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
                    name: "formuladate",
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

            if (role == 1000) {
                // Website New Leads - Suspects - Monthly Reporting
                var suspectsListBySalesRepWeeklySearch = search.load({
                    type: 'lead',
                    id: 'customsearch_leads_reporting_weekly_2_10'
                });
            } else {
                // Website New Leads - Suspects - Weekly Reporting
                var suspectsListBySalesRepWeeklySearch = search.load({
                    type: 'lead',
                    id: 'customsearch_leads_reporting_weekly_2__2'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }


            if (!isNullorEmpty(zee_id)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            total_customer_signed = 0;
            var countSuspects = 0;
            var oldSuspectsWeekLeadEntered = null;

            var total_suspect_count = 0;
            var suspect_new_count = 0;
            var suspect_hot_lead_count = 0;
            var suspect_reassign_count = 0;
            var suspect_qualified_count = 0;


            suspectsListBySalesRepWeeklySearch.run().each(function (
                suspectsListBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsListBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsListBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsListBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
                    var splitMonthV2 = weekLeadEntered.split('/');

                    var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);

                    var firstDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 1).getDate();
                    var lastDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 0).getDate();

                    if (firstDay < 10) {
                        firstDay = '0' + firstDay;
                    }
                    var startDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        splitMonthV2[0];
                    var monthsStartDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        firstDay;
                    var lastDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        lastDay
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
                        suspect_hot_lead_count +
                        suspect_reassign_count +
                        suspect_new_count

                } else if (oldSuspectsWeekLeadEntered != null &&
                    oldSuspectsWeekLeadEntered == startDate) {

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
                        suspect_hot_lead_count +
                        suspect_reassign_count +
                        suspect_new_count

                } else if (oldSuspectsWeekLeadEntered != null &&
                    oldSuspectsWeekLeadEntered != startDate) {

                    debt_set5.push({
                        dateUsed: oldSuspectsWeekLeadEntered,
                        suspect_new_count: suspect_new_count,
                        suspect_hot_lead_count: suspect_hot_lead_count,
                        suspect_reassign_count: suspect_reassign_count,
                        total_suspect_count: total_suspect_count
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
                        suspect_hot_lead_count +
                        suspect_reassign_count +
                        suspect_new_count
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
                    total_suspect_count: total_suspect_count
                });
            }

            console.log('debt_set5: ' + debt_set5)
            var suspectsChartDatSet = [];
            if (!isNullorEmpty(debt_set5)) {
                debt_set5
                    .forEach(function (preview_row, index) {

                        suspectsChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_new_count,
                        preview_row.suspect_hot_lead_count,
                        preview_row.suspect_reassign_count,
                        preview_row.total_suspect_count
                        ]);

                    });
            }


            console.log('SUSPECTS LEADS GRAPH DATA: ' + suspectsChartDatSet)

            var month_year_suspects = []; // creating array for storing browser
            var suspects_new_count = [];
            var suspects_hot_lead_count = [];
            var suspects_reassign_count = [];
            var suspects_total_count = [];

            for (var i = 0; i < suspectsChartDatSet.length; i++) {
                if (!isNullorEmpty(suspectsChartDatSet[i][0])) {
                    month_year_suspects.push(suspectsChartDatSet[i][0]);
                    suspects_new_count[suspectsChartDatSet[i][0]] = suspectsChartDatSet[i][1]
                    suspects_hot_lead_count[suspectsChartDatSet[i][0]] = suspectsChartDatSet[i][2]
                    suspects_reassign_count[suspectsChartDatSet[i][0]] = suspectsChartDatSet[i][3]
                    suspects_total_count[suspectsChartDatSet[i][0]] = suspectsChartDatSet[i][4]
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
                categores_suspects.push(item)
            });


            plotChartSuspects(series_data50, series_data50,
                series_data51,
                series_data52,
                series_data53, categores_suspects);

            if (role == 1000) {
                // Website New Leads - Suspects Lost - Monthly Reporting
                var suspectsLostBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_11'
                });
            } else {
                // Website New Leads - Suspects Lost - Weekly Reporting
                var suspectsLostBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__4'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsLostBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            total_customer_signed = 0;
            var countSuspectsLost = 0;
            var oldSuspectsLostWeekLeadEntered = null;

            var total_suspect_lost_count = 0;
            var suspect_lost_count = 0;
            var suspect_customer_lost_count = 0;


            suspectsLostBySalesRepWeeklySearch.run().each(function (
                suspectsLostBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsLostBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsLostBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsLostBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {

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
                        suspect_lost_count +
                        suspect_customer_lost_count

                } else if (oldSuspectsLostWeekLeadEntered != null &&
                    oldSuspectsLostWeekLeadEntered == startDate) {

                    if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost_count += parseInt(customerCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER LOST
                        suspect_customer_lost_count += parseInt(customerCount);
                    }

                    total_suspect_lost_count =
                        suspect_lost_count +
                        suspect_customer_lost_count

                } else if (oldSuspectsLostWeekLeadEntered != null &&
                    oldSuspectsLostWeekLeadEntered != startDate) {

                    debt_setSuspectsLost.push({
                        dateUsed: oldSuspectsLostWeekLeadEntered,
                        suspect_lost_count: suspect_lost_count,
                        suspect_customer_lost_count: suspect_customer_lost_count,
                        total_suspect_lost_count: total_suspect_lost_count
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
                        suspect_lost_count +
                        suspect_customer_lost_count
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
                    total_suspect_lost_count: total_suspect_lost_count
                });
            }

            var suspectsLostChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsLost)) {
                debt_setSuspectsLost
                    .forEach(function (preview_row, index) {

                        suspectsLostChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_lost_count,
                        preview_row.suspect_customer_lost_count,
                        preview_row.total_suspect_lost_count
                        ]);

                    });
            }


            console.log('SUSPECTS LOST GRAPH DATA: ' + suspectsLostChartDatSet)

            var month_year_suspects_lost = []; // creating array for storing browser
            var suspects_lost = [];
            var suspects_customer_lost = [];
            var suspects_lost_total_count = [];

            for (var i = 0; i < suspectsLostChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsLostChartDatSet[i][0])) {
                    month_year_suspects_lost.push(suspectsLostChartDatSet[i][0]);
                    suspects_lost[suspectsLostChartDatSet[i][0]] = suspectsLostChartDatSet[i][1]
                    suspects_customer_lost[suspectsLostChartDatSet[i][0]] = suspectsLostChartDatSet[i][2]
                    suspects_lost_total_count[suspectsLostChartDatSet[i][0]] = suspectsLostChartDatSet[i][3]
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
                categores_suspects_lost.push(item)
            });


            plotChartSuspectsLost(series_data60, series_data61,
                series_data62,
                categores_suspects_lost);

            if (role == 1000) {
                // Website New Leads - Suspects Parking Lot - Monthly Reporting
                var suspectsOffPeakPipelineBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_12'
                });
            } else {
                // Website New Leads - Suspects Parking Lot - Weekly Reporting
                var suspectsOffPeakPipelineBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__5'
                });
            }



            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsOffPeakPipelineBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            suspectsOffPeakPipelineBySalesRepWeeklySearch.run().each(function (
                suspectsLostBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsLostBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsLostBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsLostBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
                    var splitMonthV2 = weekLeadEntered.split('/');

                    var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);

                    var firstDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 1).getDate();
                    var lastDay = new Date(splitMonthV2[0], (splitMonthV2[1]), 0).getDate();

                    if (firstDay < 10) {
                        firstDay = '0' + firstDay;
                    }

                    var startDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        splitMonthV2[0];
                    var monthsStartDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        firstDay;
                    var lastDate = splitMonthV2[2] + '-' + splitMonthV2[1] + '-' +
                        lastDay

                }

                debt_setSuspectsOffPeakPipeline.push({
                    dateUsed: startDate,
                    suspect_off_peak_pipeline_count: customerCount
                });


                return true;
            });


            var suspectsOffPeakPipelineChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsOffPeakPipeline)) {
                debt_setSuspectsOffPeakPipeline
                    .forEach(function (preview_row, index) {

                        suspectsOffPeakPipelineChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_off_peak_pipeline_count
                        ]);

                    });
            }


            console.log('SUSPECTS OFF PEAK PIPELINE GRAPH DATA: ' + suspectsOffPeakPipelineChartDatSet)

            var month_year_suspects_off_peak_pipeline = []; // creating array for storing browser
            var suspect_off_peak_pipeline_count = [];

            for (var i = 0; i < suspectsOffPeakPipelineChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsOffPeakPipelineChartDatSet[i][0])) {
                    month_year_suspects_off_peak_pipeline.push(suspectsOffPeakPipelineChartDatSet[i][0]);
                    suspect_off_peak_pipeline_count[suspectsOffPeakPipelineChartDatSet[i][0]] = suspectsOffPeakPipelineChartDatSet[i][1]
                }


            }

            var series_data70 = [];
            var series_data71 = [];


            var categores_suspects_off_peak_pipeline = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_off_peak_pipeline_count).map(function (item, key) {
                series_data70.push(parseInt(suspect_off_peak_pipeline_count[item]));
                categores_suspects_off_peak_pipeline.push(item)
            });


            plotChartSuspectsOffPeakPipeline(series_data70,
                categores_suspects_lost);

            if (role == 1000) {
                // Search Name: Website New Leads - Suspects Out of Territory - Monthly Reporting
                var suspectsOOTBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_13'
                });
            } else {
                // Website New Leads - Suspects Out of Territory - Weekly Reporting
                var suspectsOOTBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__6'
                });
            }



            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsOOTBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }


            suspectsOOTBySalesRepWeeklySearch.run().each(function (
                suspectsOOTBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsOOTBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsOOTBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsOOTBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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

                }

                debt_setSuspectsOOT.push({
                    dateUsed: startDate,
                    suspect_oot_count: customerCount
                });


                return true;
            });


            var suspectsOOTChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsOOT)) {
                debt_setSuspectsOOT
                    .forEach(function (preview_row, index) {

                        suspectsOOTChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_oot_count
                        ]);

                    });
            }


            console.log('SUSPECTS OOT GRAPH DATA: ' + suspectsOOTChartDatSet)

            var month_year_suspects_oot = []; // creating array for storing browser
            var suspect_oot_count = [];

            for (var i = 0; i < suspectsOOTChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsOOTChartDatSet[i][0])) {
                    month_year_suspects_oot.push(suspectsOOTChartDatSet[i][0]);
                    suspect_oot_count[suspectsOOTChartDatSet[i][0]] = suspectsOOTChartDatSet[i][1]
                }


            }

            var series_data80 = [];
            var series_data81 = [];


            var categores_suspects_oot = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_oot_count).map(function (item, key) {
                series_data80.push(parseInt(suspect_oot_count[item]));
                categores_suspects_oot.push(item)
            });


            plotChartSuspectsOOT(series_data80,
                categores_suspects_oot);


            if (role == 1000) {
                // Website New Leads - Suspects Qualified - Monthly Reporting
                var suspectsQualifiedSalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_suspect_quali_monthly'
                });
            } else {
                // Website New Leads - Suspects Qualified - Weekly Reporting
                var suspectsQualifiedSalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_suspect_quali_weekly'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsQualifiedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }


            suspectsQualifiedSalesRepWeeklySearch.run().each(function (
                suspectsQualifiedSalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsQualifiedSalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsQualifiedSalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsQualifiedSalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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

                }

                debt_setSuspectsQualified.push({
                    dateUsed: startDate,
                    suspect_qualified_count: customerCount
                });


                return true;
            });


            var suspectsQualifiedChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsQualified)) {
                debt_setSuspectsQualified
                    .forEach(function (preview_row, index) {

                        suspectsQualifiedChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_qualified_count
                        ]);

                    });
            }


            console.log('SUSPECTS Follow Up GRAPH DATA: ' + suspectsQualifiedChartDatSet)

            var month_year_suspects_qualified = []; // creating array for storing browser
            var suspect_qualified_count = [];

            for (var i = 0; i < suspectsQualifiedChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsQualifiedChartDatSet[i][0])) {
                    month_year_suspects_qualified.push(suspectsQualifiedChartDatSet[i][0]);
                    suspect_qualified_count[suspectsQualifiedChartDatSet[i][0]] = suspectsQualifiedChartDatSet[i][1]
                }


            }

            var series_data_qualified_1 = [];

            var categores_suspects_qualified = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_qualified_count).map(function (item, key) {
                series_data_qualified_1.push(parseInt(suspect_qualified_count[item]));
                categores_suspects_qualified.push(item)
            });


            plotChartSuspectsQualified(series_data_qualified_1,
                categores_suspects_qualified);

            if (role == 1000) {
                // Website New Leads - Suspects Validated - Monthly Reporting
                var suspectsValidatedSalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_suspect_quali_month_2'
                });
            } else {
                // Website New Leads - Suspects Validated - Weekly Reporting
                var suspectsValidatedSalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_suspect_quali_weekl_2'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsValidatedSalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }


            suspectsValidatedSalesRepWeeklySearch.run().each(function (
                suspectsValidatedSalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsValidatedSalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsValidatedSalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsValidatedSalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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

                }

                debt_setSuspectsValidated.push({
                    dateUsed: startDate,
                    suspect_validated_count: customerCount
                });


                return true;
            });


            var suspectsValidatedChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsValidated)) {
                debt_setSuspectsValidated
                    .forEach(function (preview_row, index) {

                        suspectsValidatedChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_validated_count
                        ]);

                    });
            }


            console.log('SUSPECTS Follow Up GRAPH DATA: ' + suspectsValidatedChartDatSet)

            var month_year_suspects_validated = []; // creating array for storing browser
            var suspect_validated_count = [];

            for (var i = 0; i < suspectsValidatedChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsValidatedChartDatSet[i][0])) {
                    month_year_suspects_validated.push(suspectsValidatedChartDatSet[i][0]);
                    suspect_validated_count[suspectsValidatedChartDatSet[i][0]] = suspectsValidatedChartDatSet[i][1]
                }


            }

            var series_data_validated_1 = [];

            var categores_suspects_validated = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_validated_count).map(function (item, key) {
                series_data_validated_1.push(parseInt(suspect_validated_count[item]));
                categores_suspects_validated.push(item)
            });


            plotChartSuspectsValidated(series_data_validated_1,
                categores_suspects_validated);


            if (role == 1000) {
                // Website New Leads - Suspects Follow Up - Monthly Reporting
                var suspectsFollowUpBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2_14'
                });
            } else {
                // Website New Leads - Suspects Follow Up - Weekly Reporting
                var suspectsFollowUpBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_2__7'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            var countSuspectFollowUp = 0;
            var oldStartDateFollowUp;
            var suspectFollowUpCount = 0;
            var suspectLPOFollowUpCount = 0;
            suspectsFollowUpBySalesRepWeeklySearch.run().each(function (
                suspectsFollowUpBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsFollowUpBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsFollowUpBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsFollowUpBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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

                }

                if (!isNullorEmpty(oldStartDateFollowUp) && oldStartDateFollowUp != startDate) {
                    debt_setSuspectsFollowUp.push({
                        dateUsed: oldStartDateFollowUp,
                        suspect_follow_up_count: suspectFollowUpCount,
                        suspect_lpo_follow_up_count: suspectLPOFollowUpCount
                    });

                    suspectFollowUpCount = 0;
                    suspectLPOFollowUpCount = 0;
                }

                if (custStatus == 67) {
                    suspectLPOFollowUpCount = customerCount
                } else if (custStatus == 18) {
                    suspectFollowUpCount = customerCount
                }



                countSuspectFollowUp++;
                oldStartDateFollowUp = startDate;
                return true;
            });

            if (countSuspectFollowUp > 0) {
                debt_setSuspectsFollowUp.push({
                    dateUsed: oldStartDateFollowUp,
                    suspect_follow_up_count: suspectFollowUpCount,
                    suspect_lpo_follow_up_count: suspectLPOFollowUpCount
                });
            }

            var suspectsFollowUpChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsFollowUp)) {
                debt_setSuspectsFollowUp
                    .forEach(function (preview_row, index) {

                        suspectsFollowUpChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_follow_up_count, preview_row.suspect_lpo_follow_up_count
                        ]);

                    });
            }


            console.log('SUSPECTS Follow Up GRAPH DATA: ' + suspectsFollowUpChartDatSet)

            var month_year_suspects_follow_up = []; // creating array for storing browser
            var suspect_follow_up_count = [];
            var suspect_lpo_follow_up_count = [];

            for (var i = 0; i < suspectsFollowUpChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsFollowUpChartDatSet[i][0])) {
                    month_year_suspects_follow_up.push(suspectsFollowUpChartDatSet[i][0]);
                    suspect_follow_up_count[suspectsFollowUpChartDatSet[i][0]] = suspectsFollowUpChartDatSet[i][1]
                    suspect_lpo_follow_up_count[suspectsFollowUpChartDatSet[i][0]] = suspectsFollowUpChartDatSet[i][2]
                }


            }

            var series_data90 = [];
            var series_data91 = [];


            var categores_suspects_follow_up = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_follow_up_count).map(function (item, key) {
                series_data90.push(parseInt(suspect_follow_up_count[item]));
                series_data91.push(parseInt(suspect_lpo_follow_up_count[item]));
                categores_suspects_follow_up.push(item)
            });


            plotChartSuspectsFollowUp(series_data90,
                categores_suspects_follow_up, series_data91);

            if (role == 1000) {
                // Website New Leads - Suspects No Answer - Monthly Reporting
                var suspectsNoAnswerBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_suspects_no_answer_monthly'
                });
            } else {
                // Website New Leads - Suspects No Answer - Weekly Reporting
                var suspectsNoAnswerBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_suspects_no_answer_weekly'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsNoAnswerBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            var countSuspectFollowUp = 0;
            var countSuspectNoAnswer = 0;
            suspectsNoAnswerBySalesRepWeeklySearch.run().each(function (
                suspectsNoAnswerBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsNoAnswerBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsNoAnswerBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsNoAnswerBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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

                }


                debt_setSuspectsNoAnswer.push({
                    dateUsed: startDate,
                    suspect_no_answer: customerCount
                });
                countSuspectFollowUp++;
                oldStartDateFollowUp = startDate;
                return true;
            });


            var suspectsNoAnswerChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsNoAnswer)) {
                debt_setSuspectsNoAnswer
                    .forEach(function (preview_row, index) {

                        suspectsNoAnswerChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_no_answer
                        ]);

                    });
            }


            console.log('SUSPECTS No Answer GRAPH DATA: ' + suspectsNoAnswerChartDatSet)

            var month_year_suspects_no_answer = []; // creating array for storing browser
            var suspect_no_answer_count = [];

            for (var i = 0; i < suspectsNoAnswerChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsNoAnswerChartDatSet[i][0])) {
                    month_year_suspects_no_answer.push(suspectsNoAnswerChartDatSet[i][0]);
                    suspect_no_answer_count[suspectsNoAnswerChartDatSet[i][0]] = suspectsNoAnswerChartDatSet[i][1]
                }


            }

            var series_data200 = [];
            var series_data201 = [];


            var categores_suspects_no_answer = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_no_answer_count).map(function (item, key) {
                series_data200.push(parseInt(suspect_no_answer_count[item]));
                categores_suspects_no_answer.push(item)
            });


            plotChartSuspectsNoAnswer(series_data200,
                categores_suspects_no_answer, series_data201);

            if (role == 1000) {
                // Website New Leads - Suspects In Contact - Monthly Reporting
                var suspectsInContactBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_suspects_in_contact_monthly'
                });
            } else {
                // Website New Leads - Suspects In Contact - Weekly Reporting
                var suspectsInContactBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_suspects_in_contact_weekly'
                });
            }


            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                suspectsFollowUpBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }

            if (!isNullorEmpty(sales_campaign)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
            }

            if (!isNullorEmpty(zee_id)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                suspectsInContactBySalesRepWeeklySearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            var countSuspectFollowUp = 0;
            var countSuspectNoAnswer = 0;
            suspectsInContactBySalesRepWeeklySearch.run().each(function (
                suspectsInContactBySalesRepWeeklySearchResultSet) {


                var customerCount = parseInt(suspectsInContactBySalesRepWeeklySearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = suspectsInContactBySalesRepWeeklySearchResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = suspectsInContactBySalesRepWeeklySearchResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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

                }


                debt_setSuspectsInContact.push({
                    dateUsed: startDate,
                    suspect_in_contact: customerCount
                });
                countSuspectFollowUp++;
                oldStartDateFollowUp = startDate;
                return true;
            });


            var suspectsInContactChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsInContact)) {
                debt_setSuspectsInContact
                    .forEach(function (preview_row, index) {

                        suspectsInContactChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_in_contact
                        ]);

                    });
            }


            console.log('SUSPECTS In Contact GRAPH DATA: ' + suspectsInContactChartDatSet)

            var month_year_suspects_in_contact = []; // creating array for storing browser
            var suspect_in_contact_count = [];

            for (var i = 0; i < suspectsInContactChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsInContactChartDatSet[i][0])) {
                    month_year_suspects_in_contact.push(suspectsInContactChartDatSet[i][0]);
                    suspect_in_contact_count[suspectsInContactChartDatSet[i][0]] = suspectsInContactChartDatSet[i][1]
                }


            }

            var series_data300 = [];
            var series_data301 = [];


            var categores_suspects_in_contact = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_in_contact_count).map(function (item, key) {
                series_data300.push(parseInt(suspect_in_contact_count[item]));
                categores_suspects_in_contact.push(item)
            });


            plotChartSuspectsInContact(series_data300,
                categores_suspects_no_answer, series_data301);

            if (role == 1000) {
                // Website New Leads by Status - Monthly Reporting
                var leadsListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_3'
                });
            } else {
                // Website New Leads by Status - Weekly Reporting
                var leadsListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly'
                });
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
            suspect_new = 0;

            suspect_lpo_followup = 0;
            suspect_qualified = 0;

            suspect_validated = 0;
            customer_free_trial = 0;

            suspect_no_answer = 0;
            suspect_in_contact = 0;


            leadsListBySalesRepWeeklySearch.run().each(function (
                prospectListBySalesRepWeeklyResultSet) {


                var prospectCount = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: 'internalid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP"
                });
                var custStatus = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP"
                }));
                var custStatusText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP"
                });

                if (role == 1000) {
                    var startDate = weekLeadEntered;

                } else {
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
                    } else if (custStatus == 20) {
                        //SUSPECT - NO ANSWER
                        suspect_no_answer = parseInt(prospectCount);
                    } else if (custStatus == 69) {
                        //SUSPECT - IN CONTACT
                        suspect_in_contact = parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact

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
                    } else if (custStatus == 67) {
                        //SUSPECT - LPO FOLLOW UP
                        suspect_lpo_followup += parseInt(prospectCount);
                    } else if (custStatus == 68) {
                        //SUSPECT - VALIDATED
                        suspect_validated += parseInt(prospectCount);
                    } else if (custStatus == 32) {
                        //CUSTOMER - FREE TRIAL
                        customer_free_trial += parseInt(prospectCount);
                    } else if (custStatus == 20) {
                        //SUSPECT - NO ANSWER
                        suspect_no_answer += parseInt(prospectCount);
                    } else if (custStatus == 69) {
                        //SUSPECT - IN CONTACT
                        suspect_in_contact += parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact

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
                        suspect_lpo_followup: suspect_lpo_followup,
                        suspect_validated: suspect_validated,
                        customer_free_trial: customer_free_trial,
                        suspect_no_answer: suspect_no_answer,
                        suspect_in_contact: suspect_in_contact
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

                    suspect_validated = 0;
                    customer_free_trial = 0;
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
                    } else if (custStatus == 20) {
                        //SUSPECT - NO ANSWER
                        suspect_no_answer = parseInt(prospectCount);
                    } else if (custStatus == 69) {
                        //SUSPECT - IN CONTACT
                        suspect_in_contact = parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact
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
                    suspect_lpo_followup: suspect_lpo_followup,
                    suspect_validated: suspect_validated,
                    customer_free_trial: customer_free_trial,
                    suspect_no_answer: suspect_no_answer,
                    suspect_in_contact: suspect_in_contact
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

                        var suspectLPOFollowupPercentage = parseInt((preview_row.suspect_lpo_followup / preview_row.total_leads) * 100);
                        var suspectLPOFollowupwCol = preview_row.suspect_lpo_followup + ' (' + suspectLPOFollowupPercentage + '%)';

                        var suspectValidatedPercentage = parseInt((preview_row.suspect_validated / preview_row.total_leads) * 100);
                        var suspectValidatedCol = preview_row.suspect_validated + ' (' + suspectValidatedPercentage + '%)';

                        var customerFreeTrialPercentage = parseInt((preview_row.customer_free_trial / preview_row.total_leads) * 100);
                        var customerFreeTrialCol = preview_row.customer_free_trial + ' (' + customerFreeTrialPercentage + '%)';

                        var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                        var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                        var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                        var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';


                        overDataSet.push([preview_row.dateUsed,
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
                        preview_row.prospecy_quote_sent,
                        preview_row.customer_free_trial,
                        preview_row.customer_signed,
                        preview_row.total_leads
                        ]);


                        previewDataSet.push([preview_row.dateUsed,
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
                            quoteSentCol,
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
                columns: [{
                    title: 'Period'//0
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
                    title: 'Prospect - Quote Sent'//16
                }, {
                    title: 'Customer - Free Trial'//17
                }, {
                    title: 'Customer - Signed'//18
                }, {
                    title: 'Total Lead Count'//19
                }],
                columnDefs: [{
                    targets: [0, 4, 16, 17, 18],
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

                    // Total Prospect Quoite Sent
                    total_prospect_quote_sent = api
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Customer Free Trial
                    total_customer_free_trial = api
                        .column(17)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Customer Signed
                    total_customer_signed = api
                        .column(18)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Lead Count
                    total_lead = api
                        .column(19)
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
                        total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(17).footer()).html(
                        total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(18).footer()).html(
                        total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(19).footer()).html(
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
            var prospecy_quote_sent = [];
            var prospect_no_answer = [];
            var prospect_in_contact = [];
            var suspect_follow_up = [];
            var suspect_new = [];
            var suspect_qualified = [];
            var suspect_lpo_followup = [];
            var suspect_validated = [];
            var customer_free_trial = [];
            var susect_no_answer = [];
            var suspect_in_contact = [];
            var total_leads = [];

            for (var i = 0; i < data.length; i++) {
                month_year.push(data[i][0]);
                suspect_new[data[i][0]] = data[i][1]
                suspect_hot_lead[data[i][0]] = data[i][2]
                suspect_qualified[data[i][0]] = data[i][3]
                suspect_validated[data[i][0]] = data[i][4]
                suspect_reassign[data[i][0]] = data[i][5]
                suspect_follow_up[data[i][0]] = data[i][6]
                suspect_lpo_followup[data[i][0]] = data[i][7]
                suspect_no_answer[data[i][0]] = data[i][8]
                suspect_in_contact[data[i][0]] = data[i][9]
                prospect_in_contact[data[i][0]] = data[i][10]
                suspect_off_peak_pipeline[data[i][0]] = data[i][11]
                suspect_lost[data[i][0]] = data[i][12]
                suspect_oot[data[i][0]] = data[i][13]
                suspect_customer_lost[data[i][0]] = data[i][14]
                prospect_opportunity[data[i][0]] = data[i][15]
                prospecy_quote_sent[data[i][0]] = data[i][16]
                customer_free_trial[data[i][0]] = data[i][17];
                customer_signed[data[i][0]] = data[i][18];
                total_leads[data[i][0]] = data[i][19]
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
                series_data21a.push(parseInt(suspect_lpo_followup[item]));
                series_data22a.push(parseInt(suspect_validated[item]));
                series_data23a.push(parseInt(customer_free_trial[item]));
                series_data24a.push(parseInt(suspect_no_answer[item]));
                series_data25a.push(parseInt(suspect_in_contact[item]));
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
                series_data29, series_data31, series_data32, series_data33, series_data34, categores1, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a)



            //TODO - LPO Preview

            if (role == 1000) {
                // LPO New Leads by Status - Monthly Reporting
                var lpoLeadsListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_3_2'
                });
            } else {
                // LPO New Leads by Status - Weekly Reporting
                var lpoLeadsListBySalesRepWeeklySearch = search.load({
                    type: 'customer',
                    id: 'customsearch_leads_reporting_weekly_4'
                });
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
            var prospecy_quote_sent = 0;
            var prospect_no_answer = 0;
            var prospect_in_contact = 0;
            var suspect_follow_up = 0;
            var suspect_new = 0;

            var suspect_lpo_followup = 0;
            var suspect_qualified = 0;

            var suspect_validated = 0;
            var customer_free_trial = 0;

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
                    } else if (custStatus == 20) {
                        //SUSPECT - NO ANSWER
                        suspect_no_answer = parseInt(prospectCount);
                    } else if (custStatus == 69) {
                        //SUSPECT - IN CONTACT
                        suspect_in_contact = parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact

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
                    } else if (custStatus == 20) {
                        //SUSPECT - NO ANSWER
                        suspect_no_answer += parseInt(prospectCount);
                    } else if (custStatus == 69) {
                        //SUSPECT - IN CONTACT
                        suspect_in_contact += parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact

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
                        suspect_in_contact: suspect_in_contact
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

                    suspect_validated = 0;
                    customer_free_trial = 0;
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
                    } else if (custStatus == 20) {
                        //SUSPECT - NO ANSWER
                        suspect_no_answer = parseInt(prospectCount);
                    } else if (custStatus == 69) {
                        //SUSPECT - IN CONTACT
                        suspect_in_contact = parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new + suspect_qualified + suspect_lpo_followup + suspect_validated + customer_free_trial + suspect_no_answer + suspect_in_contact
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
                    suspect_in_contact: suspect_in_contact
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

                        var suspectNoAnswerPercentage = parseInt((preview_row.suspect_no_answer / preview_row.total_leads) * 100);
                        var suspectNoAnswerCol = preview_row.suspect_no_answer + ' (' + suspectNoAnswerPercentage + '%)';

                        var suspectInContactPercentage = parseInt((preview_row.suspect_in_contact / preview_row.total_leads) * 100);
                        var suspectInContactCol = preview_row.suspect_in_contact + ' (' + suspectInContactPercentage + '%)';


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
                        preview_row.prospecy_quote_sent,
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
                            quoteSentCol,
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
                    title: 'Prospect - Quote Sent'//16
                }, {
                    title: 'Customer - Free Trial'//17
                }, {
                    title: 'Customer - Signed'//18
                }, {
                    title: 'Total Lead Count'//19
                }],
                columnDefs: [{
                    targets: [0, 4, 16, 17, 18],
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

                    // Total Prospect Quoite Sent
                    total_prospect_quote_sent = api
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Customer Free Trial
                    total_customer_free_trial = api
                        .column(17)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Customer Signed
                    total_customer_signed = api
                        .column(18)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Lead Count
                    total_lead = api
                        .column(19)
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
                        total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                    );

                    $(api.column(17).footer()).html(
                        total_customer_free_trial + ' (' + ((total_customer_free_trial / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(18).footer()).html(
                        total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(19).footer()).html(
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
            var lpo_prospecy_quote_sent = [];
            var lpo_prospect_no_answer = [];
            var lpo_prospect_in_contact = [];
            var lpo_suspect_follow_up = [];
            var lpo_suspect_new = [];
            var lpo_suspect_qualified = [];
            var lpo_suspect_lpo_followup = [];
            var lpo_suspect_validated = [];
            var lpo_customer_free_trial = [];
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
                lpo_prospecy_quote_sent[lpo_data[i][0]] = lpo_data[i][16]
                lpo_customer_free_trial[lpo_data[i][0]] = lpo_data[i][17];
                lpo_customer_signed[lpo_data[i][0]] = lpo_data[i][18];
                lpo_total_leads[lpo_data[i][0]] = lpo_data[i][19]
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
                lpo_series_data29, lpo_series_data31, lpo_series_data32, lpo_series_data33, lpo_series_data34, lpo_categores1, lpo_series_data20a, lpo_series_data21a, lpo_series_data22a, lpo_series_data23a, lpo_series_data24a, lpo_series_data25a)


            var websiteSuspectsLeadsReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_5_2_2' //Website Leads - Reporting V2
            });

            if (!isNullorEmpty(zee_id)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(sales_rep)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: sales_rep
                }));
            }

            if (!isNullorEmpty(lead_entered_by)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_lead_entered_by',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_entered_by
                }));
            }


            if (!isNullorEmpty(sales_campaign)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_campaign',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: sales_campaign
                }));
            }

            if (!isNullorEmpty(parent_lpo)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custentity_lpo_parent_account',
                    operator: search.Operator.ANYOF,
                    values: parent_lpo
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                websiteSuspectsLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_quote_sent_to
                }));
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

            var websiteSuspectsLeadsReportingSearchCount = websiteSuspectsLeadsReportingSearch.runPaged().count;

            console.log('websiteSuspectsLeadsReportingSearchCount: ' + websiteSuspectsLeadsReportingSearchCount)
            var count = 0;

            websiteSuspectsLeadsReportingSearch.run().each(function (suspectsResultSet) {

                var custInternalID = suspectsResultSet.getValue({
                    name: 'internalid',
                    summary: "GROUP",
                });
                var custEntityID = suspectsResultSet.getValue({
                    name: 'entityid',
                    summary: "GROUP",
                });
                var custName = suspectsResultSet.getValue({
                    name: 'companyname',
                    summary: "GROUP",
                });
                var zeeID = suspectsResultSet.getValue({
                    name: 'partner',
                    summary: "GROUP",
                });
                var zeeName = suspectsResultSet.getText({
                    name: 'partner',
                    summary: "GROUP",
                });

                var custStage = (suspectsResultSet.getText({
                    name: 'stage',
                    summary: "GROUP",
                })).toUpperCase();

                var custStatusId = suspectsResultSet.getValue({
                    name: 'entitystatus',
                    summary: "GROUP",
                })

                var custStatus = suspectsResultSet.getText({
                    name: 'entitystatus',
                    summary: "GROUP",
                }).toUpperCase();

                var dateLeadEntered = suspectsResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP",
                });

                var quoteSentDate = suspectsResultSet.getValue({
                    name: "custentity_date_lead_quote_sent",
                    summary: "GROUP",
                });

                var dateLeadLost = suspectsResultSet.getValue({
                    name: 'custentity_date_lead_lost',
                    summary: "GROUP",
                });
                var dateLeadinContact = suspectsResultSet.getValue({
                    name: 'custentity_date_prospect_in_contact',
                    summary: "GROUP",
                });

                var dateProspectWon = suspectsResultSet.getValue({
                    name: 'custentity_date_prospect_opportunity',
                    summary: "GROUP",
                });

                var dateLeadReassigned = suspectsResultSet.getValue({
                    name: 'custentity_date_suspect_reassign',
                    summary: "GROUP",
                });

                var salesRepId = suspectsResultSet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
                    summary: "GROUP",
                });
                var salesRepText = suspectsResultSet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER',
                    summary: "GROUP",
                });

                var activityInternalID = suspectsResultSet.getValue({
                    name: "internalid",
                    join: "activity",
                    summary: "GROUP",
                })
                var activityStartDate = suspectsResultSet.getValue({
                    name: "startdate",
                    join: "activity",
                    summary: "GROUP",
                })
                var activityTitle = suspectsResultSet.getValue({
                    name: "title",
                    join: "activity",
                    summary: "GROUP",
                })


                if (isNullorEmpty(suspectsResultSet.getText({
                    name: "custevent_organiser",
                    join: "activity",
                    summary: "GROUP",
                }))) {
                    var activityOrganiser = suspectsResultSet.getText({
                        name: "assigned",
                        join: "activity",
                        summary: "GROUP",
                    })
                } else {
                    var activityOrganiser = suspectsResultSet.getText({
                        name: "custevent_organiser",
                        join: "activity",
                        summary: "GROUP",
                    })
                }


                var activityMessage = suspectsResultSet.getValue({
                    name: "message",
                    join: "activity",
                    summary: "GROUP",
                })

                var email48h = suspectsResultSet.getText({
                    name: 'custentity_48h_email_sent',
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

                var monthlyServiceValue = (suspectsResultSet.getValue({
                    name: "custentity_cust_monthly_service_value",
                    summary: "GROUP",
                }));

                var avgInvoiceValue = (suspectsResultSet.getValue({
                    name: "total",
                    join: "transaction",
                    summary: "AVG",
                }));

                var dateLPOValidated = suspectsResultSet.getValue({
                    name: 'custentity_date_lpo_validated',
                    summary: "GROUP",
                });


                var userNotesInternalID = suspectsResultSet.getValue({
                    name: "internalid",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesTitle = suspectsResultSet.getValue({
                    name: "title",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesStartDate = suspectsResultSet.getValue({
                    name: "notedate",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesOrganiser = suspectsResultSet.getText({
                    name: "author",
                    join: "userNotes",
                    summary: "GROUP",
                })
                var userNotesMessage = suspectsResultSet.getValue({
                    name: "note",
                    join: "userNotes",
                    summary: "GROUP",
                })

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
                    if (!isNullorEmpty(activityTitle)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-PARKING LOT' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP' && custStatus != 'SUSPECT-QUALIFIED' && custStatus != 'SUSPECT-LPO FOLLOW-UP' && custStatus != 'SUSPECT-NO ANSWER' && custStatus != 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-CUSTOMER - LOST' || custStatus == 'SUSPECT-LOST')) {
                            suspectActivityCount++
                            suspectLostChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-PARKING LOT') {
                            suspectActivityCount++
                            suspectOffPeakChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            suspectActivityCount++
                            suspectOOTChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-NO ANSWER') {
                            suspectActivityCount++
                            suspectNoAnswerChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectInContactChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-FOLLOW-UP' || custStatus != 'SUSPECT-LPO FOLLOW-UP')) {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-QUALIFIED') {
                            suspectActivityCount++
                            suspectQualifiedChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-VALIDATED') {
                            suspectActivityCount++
                            suspectValidatedChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    } else if (!isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-PARKING LOT' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP' && custStatus != 'SUSPECT-QUALIFIED' && custStatus != 'SUSPECT-LPO FOLLOW-UP' && custStatus != 'SUSPECT-NO ANSWER' && custStatus != 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-CUSTOMER - LOST' || custStatus == 'SUSPECT-LOST')) {
                            suspectActivityCount++
                            suspectLostChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-PARKING LOT') {
                            suspectActivityCount++
                            suspectOffPeakChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            suspectActivityCount++
                            suspectOOTChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-FOLLOW-UP' || custStatus != 'SUSPECT-LPO FOLLOW-UP')) {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-QUALIFIED') {
                            suspectActivityCount++
                            suspectQualifiedChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-VALIDATED') {
                            suspectActivityCount++
                            suspectValidatedChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-NO ANSWER') {
                            suspectActivityCount++
                            suspectNoAnswerChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectInContactChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    }

                } else if (count > 0 && (oldcustInternalID == custInternalID)) {
                    if (!isNullorEmpty(activityTitle)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-OPARKING LOT' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP' && custStatus != 'SUSPECT-QUALIFIED' && custStatus != 'SUSPECT-LPO FOLLOW-UP' && custStatus != 'SUSPECT-NO ANSWER' && custStatus != 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-CUSTOMER - LOST' || custStatus == 'SUSPECT-LOST')) {
                            suspectActivityCount++
                            suspectLostChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-PARKING LOT') {
                            suspectActivityCount++
                            suspectOffPeakChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            suspectActivityCount++
                            suspectOOTChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-FOLLOW-UP' || custStatus == 'SUSPECT-LPO FOLLOW-UP')) {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-QUALIFIED') {
                            suspectActivityCount++
                            suspectQualifiedChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-VALIDATED') {
                            suspectActivityCount++
                            suspectValidatedChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-NO ANSWER') {
                            suspectActivityCount++
                            suspectNoAnswerChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectInContactChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    } else if (!isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-PARKING LOT' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP' && custStatus != 'SUSPECT-QUALIFIED' && custStatus != 'SUSPECT-LPO FOLLOW-UP' && custStatus != 'SUSPECT-NO ANSWER' && custStatus != 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-CUSTOMER - LOST' || custStatus == 'SUSPECT-LOST')) {
                            suspectActivityCount++
                            suspectLostChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-PARKING LOT') {
                            suspectActivityCount++
                            suspectOffPeakChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            suspectActivityCount++
                            suspectOOTChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-FOLLOW-UP' || custStatus != 'SUSPECT-LPO FOLLOW-UP')) {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-QUALIFIED') {
                            suspectActivityCount++
                            suspectQualifiedChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-VALIDATED') {
                            suspectActivityCount++
                            suspectValidatedChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-NO ANSWER') {
                            suspectActivityCount++
                            suspectNoAnswerChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectInContactChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    }

                } else if (count > 0 && (oldcustInternalID != custInternalID)) {

                    if (oldcustStage == 'SUSPECT' && oldcustStatus != 'SUSPECT-CUSTOMER - LOST' && oldcustStatus != 'SUSPECT-PARKING LOT' && oldcustStatus != 'SUSPECT-LOST' && oldcustStatus != 'SUSPECT-OUT OF TERRITORY' && oldcustStatus != 'SUSPECT-FOLLOW-UP' && oldcustStatus != 'SUSPECT-QUALIFIED' && oldcustStatus != 'SUSPECT-LPO FOLLOW-UP' && oldcustStatus != 'SUSPECT-VALIDATED' && oldcustStatus != 'SUSPECT-NO ANSWER' && oldcustStatus != 'SUSPECT-IN CONTACT') {

                        suspectDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldemail48h,
                            oldDaysOpen,
                            oldsalesRepText,
                            suspectChildDataSet
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
                            oldsalesRepText
                        ]);



                    } else if (oldcustStage == 'SUSPECT' && (oldcustStatus == 'SUSPECT-CUSTOMER - LOST' || oldcustStatus == 'SUSPECT-LOST')) {


                        suspectLostDataSet.push(['',
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
                            olddateProspectWon,
                            olddateLeadLost,
                            oldemail48h,
                            oldDaysOpen,
                            oldCancellationReason,
                            oldMonthServiceValue, oldAvgInvoiceValue,
                            oldsalesRepText,
                            suspectLostChildDataSet
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
                            oldMonthServiceValue, oldAvgInvoiceValue,
                            oldsalesRepText
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-PARKING LOT') {

                        suspectOffPeakDataSet.push(['',
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
                            olddateLeadReassigned,
                            olddateLeadLost,
                            oldemail48h,
                            oldDaysOpen,
                            oldCancellationReason,
                            oldMonthServiceValue,
                            oldsalesRepText,
                            suspectOffPeakChildDataSet
                        ]);
                        csvSuspectOffPeakDataSet.push([,
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
                            oldsalesRepText
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-OUT OF TERRITORY') {


                        suspectOOTDataSet.push(['',
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
                            olddateLeadReassigned,
                            olddateLeadLost,
                            oldemail48h,
                            oldDaysOpen,
                            oldCancellationReason,
                            oldMonthServiceValue,
                            oldsalesRepText,
                            suspectOOTChildDataSet
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
                            oldsalesRepText
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && (oldcustStatus == 'SUSPECT-FOLLOW-UP' || oldcustStatus == 'SUSPECT-LPO FOLLOW-UP')) {

                        suspectFollowUpDataSet.push(['',
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
                            olddateLeadReassigned,
                            olddateLeadLost,
                            oldemail48h,
                            oldDaysOpen,
                            oldCancellationReason,
                            oldMonthServiceValue,
                            oldsalesRepText,
                            suspectFollowUpChildDataSet
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
                            oldsalesRepText
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-QUALIFIED') {

                        suspectQualifiedDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldDaysOpen,
                            oldsalesRepText,
                            suspectQualifiedChildDataSet
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
                            oldsalesRepText
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-VALIDATED') {

                        suspectValidatedDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldDateLPOValidated,
                            oldDaysOpen,
                            oldsalesRepText,
                            suspectQualifiedChildDataSet
                        ]);

                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-NO ANSWER') {

                        suspectNoAnswerDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldDaysOpen,
                            oldsalesRepText,
                            suspectNoAnswerChildDataSet
                        ]);

                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-IN CONTACT') {

                        suspectInContactDataSet.push(['',
                            oldcustInternalID,
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                            oldcustName,
                            oldzeeName,
                            oldcustStatus,
                            oldSource,
                            oldPreviousCarrier,
                            olddateLeadEntered,
                            oldDaysOpen,
                            oldsalesRepText,
                            suspectInContactChildDataSet
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

                    if (!isNullorEmpty(activityTitle)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-PARKING LOT' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP' && custStatus != 'SUSPECT-QUALIFIED' && custStatus != 'SUSPECT-LPO FOLLOW-UP' && custStatus != 'SUSPECT-NO ANSWER' && custStatus != 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-CUSTOMER - LOST' || custStatus == 'SUSPECT-LOST')) {
                            suspectActivityCount++
                            suspectLostChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-PARKING LOT') {
                            suspectActivityCount++
                            suspectOffPeakChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            suspectActivityCount++
                            suspectOOTChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-FOLLOW-UP' || custStatus == 'SUSPECT-LPO FOLLOW-UP')) {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                        else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-QUALIFIED') {
                            suspectActivityCount++
                            suspectQualifiedChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-VALIDATED') {
                            suspectActivityCount++
                            suspectValidatedChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-NO ANSWER') {
                            suspectActivityCount++
                            suspectNoAnswerChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectInContactChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        }
                    } else if (!isNullorEmpty(userNotesInternalID)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-PARKING LOT' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP' && custStatus != 'SUSPECT-QUALIFIED' && custStatus != 'SUSPECT-LPO FOLLOW-UP' && custStatus != 'SUSPECT-NO ANSWER' && custStatus != 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-CUSTOMER - LOST' || custStatus == 'SUSPECT-LOST')) {
                            suspectActivityCount++
                            suspectLostChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-PARKING LOT') {
                            suspectActivityCount++
                            suspectOffPeakChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OUT OF TERRITORY') {
                            suspectActivityCount++
                            suspectOOTChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && (custStatus == 'SUSPECT-FOLLOW-UP' || custStatus != 'SUSPECT-LPO FOLLOW-UP')) {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-QUALIFIED') {
                            suspectActivityCount++
                            suspectQualifiedChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-VALIDATED') {
                            suspectActivityCount++
                            suspectValidatedChildDataSet.push({
                                activityInternalID: userNotesInternalID,
                                activityStartDate: userNotesStartDate,
                                activityTitle: userNotesTitle,
                                activityOrganiser: userNotesOrganiser,
                                activityMessage: userNotesMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-NO ANSWER') {
                            suspectActivityCount++
                            suspectNoAnswerChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-IN CONTACT') {
                            suspectActivityCount++
                            suspectInContactChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
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

                if (oldcustStage == 'SUSPECT' && oldcustStatus != 'SUSPECT-CUSTOMER - LOST' && oldcustStatus != 'SUSPECT-PARKING LOT' && oldcustStatus != 'SUSPECT-LOST' && oldcustStatus != 'SUSPECT-OUT OF TERRITORY' && oldcustStatus != 'SUSPECT-FOLLOW-UP' && oldcustStatus != 'SUSPECT-QUALIFIED' && oldcustStatus != 'SUSPECT-LPO FOLLOW-UP' && oldcustStatus != 'SUSPECT-VALIDATED' && oldcustStatus != 'SUSPECT-NO ANSWER' && oldcustStatus != 'SUSPECT-IN CONTACT') {

                    suspectDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldemail48h,
                        oldDaysOpen,
                        oldsalesRepText,
                        suspectChildDataSet
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
                        oldsalesRepText
                    ]);
                } else if (oldcustStage == 'SUSPECT' && (oldcustStatus == 'SUSPECT-CUSTOMER - LOST' || oldcustStatus == 'SUSPECT-LOST')) {

                    suspectLostDataSet.push(['',
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
                        olddateProspectWon,
                        olddateLeadLost,
                        oldemail48h,
                        oldDaysOpen,
                        oldCancellationReason,
                        oldMonthServiceValue, oldAvgInvoiceValue,
                        oldsalesRepText,
                        suspectLostChildDataSet
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
                        oldMonthServiceValue, oldAvgInvoiceValue,
                        oldsalesRepText
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-PARKING LOT') {

                    suspectOffPeakDataSet.push(['',
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
                        olddateLeadReassigned,
                        olddateLeadLost,
                        oldemail48h,
                        oldDaysOpen,
                        oldCancellationReason,
                        oldMonthServiceValue,
                        oldsalesRepText,
                        suspectOffPeakChildDataSet
                    ]);

                    csvSuspectOffPeakDataSet.push([,
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
                        oldsalesRepText
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-QUALIFIED') {

                    suspectQualifiedDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldDaysOpen,
                        oldsalesRepText,
                        suspectQualifiedChildDataSet
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
                        oldsalesRepText
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-VALIDATED') {

                    suspectValidatedDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldDateLPOValidated,
                        oldDaysOpen,
                        oldsalesRepText,
                        suspectQualifiedChildDataSet
                    ]);

                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-NO ANSWER') {

                    suspectNoAnswerDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldDaysOpen,
                        oldsalesRepText,
                        suspectNoAnswerChildDataSet
                    ]);

                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-IN CONTACT') {

                    suspectInContactDataSet.push(['',
                        oldcustInternalID,
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>',
                        oldcustName,
                        oldzeeName,
                        oldcustStatus,
                        oldSource,
                        oldPreviousCarrier,
                        olddateLeadEntered,
                        oldDaysOpen,
                        oldsalesRepText,
                        suspectInContactChildDataSet
                    ]);

                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-OUT OF TERRITORY') {

                    suspectOOTDataSet.push(['',
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
                        olddateLeadReassigned,
                        olddateLeadLost,
                        oldemail48h,
                        oldDaysOpen,
                        oldCancellationReason,
                        oldMonthServiceValue,
                        oldsalesRepText,
                        suspectOOTChildDataSet
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
                        oldsalesRepText
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-FOLLOW-UP') {

                    suspectFollowUpDataSet.push(['',
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
                        olddateLeadReassigned,
                        olddateLeadLost,
                        oldemail48h,
                        oldDaysOpen,
                        oldCancellationReason,
                        oldMonthServiceValue,
                        oldsalesRepText,
                        suspectFollowUpChildDataSet
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
                        oldsalesRepText
                    ]);
                }
            }

            console.log('suspectNoAnswerDatSet: ' + suspectNoAnswerDataSet);
            console.log('suspectInContactDataSet: ' + suspectInContactDataSet);


            var websiteProspectLeadsReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_5_2' //Website Leads - Reporting V2
            });

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
                    if (!isNullorEmpty(activityTitle)) {
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
                    } else if (!isNullorEmpty(userNotesInternalID)) {
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
                    if (!isNullorEmpty(activityTitle)) {
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
                    } else if (!isNullorEmpty(userNotesInternalID)) {
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
                            oldDaysOpen,
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
                            oldDaysOpen,
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

                    if (!isNullorEmpty(activityTitle)) {
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
                        // else if (custStage == 'CUSTOMER') {
                        //     customerActivityCount++
                        //     customerChildDataSet.push({
                        //         activityInternalID: activityInternalID,
                        //         activityStartDate: activityStartDate,
                        //         activityTitle: activityTitle,
                        //         activityOrganiser: activityOrganiser,
                        //         activityMessage: activityMessage
                        //     })
                        // }
                    } else if (!isNullorEmpty(userNotesInternalID)) {
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

                if (oldcustStage == 'PROSPECT' && oldcustStatus == 'PROSPECT-QUOTE SENT') {


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
                        oldDaysOpen,
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




            console.log('prospects hidden');



            var websiteCustomersReportingSearch = search.load({
                type: 'customer',
                // id: 'customsearch_leads_reporting_4' //Website Leads - Customer Signed - Reporting
                id: 'customsearch_leads_reporting_4_2' //Website Leads - Customer Signed - Reporting V2
            });

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


            var count = 0;

            csvCustomerSignedExport = [];
            csvExistingCustomerSignedExport = [];
            csvTrialCustomerSignedExport = [];

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

                var invoiceDocumentNumber = custListCommenceTodaySet.getValue({
                    name: "tranid",
                    join: "transaction",
                    summary: "GROUP",
                })
                var invoiceDate = custListCommenceTodaySet.getValue({
                    name: "trandate",
                    join: "transaction",
                    summary: "GROUP",
                })
                var invoiceType = custListCommenceTodaySet.getText({
                    name: "custbody_inv_type",
                    join: "transaction",
                    summary: "GROUP",
                })

                var invoiceAmount = custListCommenceTodaySet.getValue({
                    name: "total",
                    join: "transaction",
                    summary: "GROUP",
                })

                var invoiceStatus = custListCommenceTodaySet.getText({
                    name: "statusref",
                    join: "transaction",
                    summary: "GROUP",
                })

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

                var minCommDate = (custListCommenceTodaySet.getValue({
                    name: "custrecord_comm_date",
                    join: "CUSTRECORD_CUSTOMER",
                    summary: "MIN"
                }));

                var trialEndDate = custListCommenceTodaySet.getValue({
                    name: "custentity_customer_trial_expiry_date",
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

                if (isNullorEmpty(invoiceType) || invoiceType == '- None -') {
                    invoiceType = 'Service'
                }

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

                if (!isNullorEmpty(invoiceDate)) {
                    var invoiceDateSplit = invoiceDate.split('/');

                    if (parseInt(invoiceDateSplit[1]) < 10) {
                        invoiceDateSplit[1] = '0' + invoiceDateSplit[1]
                    }

                    if (parseInt(invoiceDateSplit[0]) < 10) {
                        invoiceDateSplit[0] = '0' + invoiceDateSplit[0]
                    }

                    invoiceDate = invoiceDateSplit[2] + '-' + invoiceDateSplit[1] + '-' +
                        invoiceDateSplit[0];
                }


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

                if (count == 0) {

                } else if (count > 0 && (oldcustInternalID == custInternalID)) {

                    if (oldInvoiceNumber == invoiceDocumentNumber) {
                    } else if (oldInvoiceNumber != invoiceDocumentNumber) {
                        customerActivityCount++
                        if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && showInvoice == true && isNullorEmpty(oldInvoiceItem)) {
                            customerChildDataSet.push({
                                invoiceDocumentNumber: oldInvoiceNumber,
                                invoiceDate: oldinvoiceDate,
                                invoiceType: oldInvoiceType,
                                invoiceAmount: oldInvoiceAmount,
                                invoiceStatus: oldInvoiceStatus
                            });

                            invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                            if (oldInvoiceType == 'Service') {
                                invoiceServiceTotal = invoiceServiceTotal + parseFloat(oldInvoiceAmount);
                            } else {
                                invoiceProductsTotal = invoiceProductsTotal + parseFloat(oldInvoiceAmount);
                            }
                        }

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

                        oldInvoiceNumber = null;
                        oldinvoiceDate = null;
                        oldInvoiceType = null;
                        oldInvoiceAmount = null;
                        oldInvoiceStatus = null;
                        oldInvoiceItem = null;

                        showInvoice = true;

                    }


                } else if (count > 0 && (oldcustInternalID != custInternalID)) {

                    if (oldcustStage == 'CUSTOMER') {

                        if (oldInvoiceNumber != invoiceDocumentNumber) {
                            customerActivityCount++
                            if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && showInvoice == true && isNullorEmpty(oldInvoiceItem)) {
                                customerChildDataSet.push({
                                    invoiceDocumentNumber: oldInvoiceNumber,
                                    invoiceDate: oldinvoiceDate,
                                    invoiceType: oldInvoiceType,
                                    invoiceAmount: oldInvoiceAmount,
                                    invoiceStatus: oldInvoiceStatus
                                });

                                invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                                if (oldInvoiceType == 'Service') {
                                    invoiceServiceTotal = invoiceServiceTotal + parseFloat(oldInvoiceAmount);
                                } else {
                                    invoiceProductsTotal = invoiceProductsTotal + parseFloat(oldInvoiceAmount);
                                }
                            }
                        }



                        totalCustomerCount++;

                        var express_speed = 0;
                        var standard_speed = 0;
                        var total_usage = 0;
                        if (calcprodusage != '2') {
                            if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                                // Customer Product Usage - Total MP Express & Standard
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
                            '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + oldcustInternalID + '&start_date=' + daily_usage_from + '&last_date=' + daily_usage_to + '&zee=' + oldzeeID + '" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

                        var customerIdLink =
                            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + oldcustInternalID + '" target="_blank" style="">' + oldcustEntityID + '</a>';

                        if ((!isNullorEmpty(oldMonthlyExtraServiceValue) && parseInt(oldMonthlyExtraServiceValue) != 0) || (!isNullorEmpty(oldMonthlyReductionServiceValue) && parseInt(oldMonthlyReductionServiceValue) != 0)) {
                            existingCustomerDataSet.push(['',
                                oldcustInternalID,
                                customerIdLink,
                                oldcustName,
                                oldzeeName,
                                oldSource,
                                oldProdWeeklyUsage,
                                oldPreviousCarrier,
                                express_speed,
                                standard_speed,
                                mpExpStdUsageLink,
                                olddateLeadEntered,
                                oldquoteSentDate,
                                // oldemail48h,
                                olddateProspectWon,
                                oldDaysOpen,
                                oldMonthServiceValue,
                                invoiceServiceTotal.toFixed(2),
                                invoiceProductsTotal.toFixed(2),
                                invoiceTotal.toFixed(2),
                                oldsalesRepText,
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

                        } else if (oldCustStatusId == 32) {
                            trialCustomerDataSet.push([
                                oldcustInternalID,
                                customerIdLink,
                                oldcustName,
                                oldzeeName,
                                oldSource,
                                oldProdWeeklyUsage,
                                oldPreviousCarrier,
                                express_speed,
                                standard_speed,
                                mpExpStdUsageLink,
                                olddateLeadEntered,
                                oldquoteSentDate,
                                olddateProspectWon,
                                oldTrialEndDate,
                                oldDaysOpen,
                                oldMonthServiceValue,
                                oldsalesRepText,
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
                                express_speed,
                                standard_speed,
                                mpExpStdUsageLink,
                                olddateLeadEntered,
                                oldquoteSentDate,
                                // oldemail48h,
                                olddateProspectWon,
                                oldDaysOpen,
                                oldMonthServiceValue,
                                invoiceServiceTotal.toFixed(2),
                                invoiceProductsTotal.toFixed(2),
                                invoiceTotal.toFixed(2),
                                oldsalesRepText,
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

                    // if (!isNullorEmpty(activityTitle)) {
                    //     if (custStage == 'CUSTOMER') {
                    //         customerActivityCount++
                    //         customerChildDataSet.push({
                    //             activityInternalID: activityInternalID,
                    //             activityStartDate: activityStartDate,
                    //             activityTitle: activityTitle,
                    //             activityOrganiser: activityOrganiser,
                    //             activityMessage: activityMessage
                    //         })
                    //     }
                    // }

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
                // oldactivityInternalID = activityInternalID;
                // oldactivityStartDate = activityStartDate;
                // oldactivityTitle = activityTitle;
                // oldactivityOrganiser = activityOrganiser;
                // oldactivityMessage = activityMessage;
                oldemail48h = email48h;
                oldDaysOpen = daysOpen;
                oldCancellationReason = cancellationReason;
                oldSource = source;
                oldProdWeeklyUsage = productWeeklyUsage;
                oldAutoSignUp = autoSignUp;
                oldPreviousCarrier = previousCarrier;
                oldMonthServiceValue = monthlyServiceValue;
                oldMonthlyReductionServiceValue = monthlyReductionServiceValue;
                oldMonthlyExtraServiceValue = monthlyExtraServiceValue;
                oldMinCommDate = minCommDate
                oldTrialEndDate = trialEndDate;
                oldInvoiceNumber = invoiceDocumentNumber;
                oldinvoiceDate = invoiceDate;
                oldInvoiceType = invoiceType;
                oldInvoiceAmount = invoiceAmount;
                oldInvoiceStatus = invoiceStatus;
                // oldInvoiceItem = invoiceItem;

                // if (oldInvoiceItem == 'Credit Card Surcharge') {
                //     showInvoice = false;
                // }

                count++
                return true;
            });

            if (count > 0) {

                if (oldcustStage == 'CUSTOMER') {

                    customerActivityCount++
                    if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && showInvoice == true && isNullorEmpty(oldInvoiceItem)) {
                        customerChildDataSet.push({
                            invoiceDocumentNumber: oldInvoiceNumber,
                            invoiceDate: oldinvoiceDate,
                            invoiceType: oldInvoiceType,
                            invoiceAmount: oldInvoiceAmount,
                            invoiceStatus: oldInvoiceStatus
                        });

                        invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                        if (oldInvoiceType == 'Service') {
                            invoiceServiceTotal = invoiceServiceTotal + parseFloat(oldInvoiceAmount);
                        } else {
                            invoiceProductsTotal = invoiceProductsTotal + parseFloat(oldInvoiceAmount);
                        }
                    }


                    totalCustomerCount++;

                    var express_speed = 0;
                    var standard_speed = 0;
                    var total_usage = 0;
                    if (calcprodusage != '2') {
                        if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                            // Customer Product Usage - Total MP Express & Standard
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
                        '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + oldcustInternalID + '&start_date=' + daily_usage_from + '&last_date=' + daily_usage_to + '&zee=' + oldzeeID + '" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

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

                    if ((!isNullorEmpty(oldMonthlyExtraServiceValue) && parseInt(oldMonthlyExtraServiceValue) != 0) || (!isNullorEmpty(oldMonthlyReductionServiceValue) && parseInt(oldMonthlyReductionServiceValue) != 0)) {
                        existingCustomerDataSet.push(['',
                            oldcustInternalID,
                            customerIdLink,
                            oldcustName,
                            oldzeeName,
                            oldSource,
                            oldProdWeeklyUsage,
                            oldPreviousCarrier,
                            express_speed,
                            standard_speed,
                            mpExpStdUsageLink,
                            olddateLeadEntered,
                            oldquoteSentDate,
                            // oldemail48h,
                            olddateProspectWon,
                            oldDaysOpen,
                            oldMonthServiceValue,
                            invoiceServiceTotal.toFixed(2),
                            invoiceProductsTotal.toFixed(2),
                            invoiceTotal.toFixed(2),
                            oldsalesRepText,
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
                    } else if (oldCustStatusId == 32) {
                        trialCustomerDataSet.push([
                            oldcustInternalID,
                            customerIdLink,
                            oldcustName,
                            oldzeeName,
                            oldSource,
                            oldProdWeeklyUsage,
                            oldPreviousCarrier,
                            express_speed,
                            standard_speed,
                            mpExpStdUsageLink,
                            olddateLeadEntered,
                            oldquoteSentDate,
                            olddateProspectWon,
                            oldTrialEndDate,
                            oldDaysOpen,
                            oldMonthServiceValue,
                            oldsalesRepText,
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
                            express_speed,
                            standard_speed,
                            mpExpStdUsageLink,
                            olddateLeadEntered,
                            oldquoteSentDate,
                            // oldemail48h,
                            olddateProspectWon,
                            oldDaysOpen,
                            oldMonthServiceValue,
                            invoiceServiceTotal.toFixed(2),
                            invoiceProductsTotal.toFixed(2),
                            invoiceTotal.toFixed(2),
                            oldsalesRepText,
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
            console.log('csvCustomerSignedExport: ' + prospectDataSet);

            var dataTableExisitngCustomers = $('#mpexusage-existing_customers').DataTable({
                data: existingCustomerDataSet,
                pageLength: 250,
                order: [[13, 'des']],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'MP Express' },
                    { title: 'MP Standard' },
                    { title: 'Daily Usage' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    // { title: '48h Email Sent' },
                    { title: 'Date - Prospect Won' },
                    { title: 'Days Open' },
                    { title: 'Expected Monthly Service' },
                    { title: 'Total Service Invoice' },
                    { title: 'Total Product Invoice' },
                    { title: 'Total Invoice' },
                    { title: 'Sales Rep' },
                    { title: 'Auto Signed Up' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [20, 21],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 13, 15, 16, 17, 18],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    var row_color = ''
                    if (data[5] == 'Additional Services') {
                        $('td', row).css('background-color', '#86A3B8');
                    } else if (!isNullorEmpty(data[21])) {
                        data[21].forEach(function (el) {

                            if (isNullorEmpty(el.invoiceDocumentNumber) || parseFloat(el.invoiceAmount) == 0 || el.invoiceDocumentNumber == 'Memorized') {
                                row_color = ''

                            } else {
                                row_color = '#53BF9D'
                            }
                        });
                        $('td', row).css('background-color', row_color);

                    } else if (!isNullorEmpty(data[15])) {
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

                    // Total MP Express Usage
                    total_mp_exp_usage = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total MP Express Usage
                    page_mp_exp_usage = api
                        .column(8, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total MP Standard Usage
                    total_mp_std_usage = api
                        .column(9)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total MP Standard Usage
                    page_mp_std_usage = api
                        .column(9, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Expected Usage over all pages
                    total_monthly_service_revenue = api
                        .column(15)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_monthly_service_revenue = api
                        .column(15, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    total_service_invoice_amount = api
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    pagetotal_service_invoice_amount = api
                        .column(16, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    total_prod_nvoice_amount = api
                        .column(17)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    pagetotal_prod_invoice_amount = api
                        .column(17, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Expected Usage over all pages
                    total_invoice_amount = api
                        .column(18)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    pagetotal_invoice_amount = api
                        .column(18, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    $(api.column(8).footer()).html(
                        page_mp_exp_usage
                    );
                    $(api.column(9).footer()).html(
                        page_mp_std_usage
                    );

                    // Update footer
                    $(api.column(15).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );

                    $(api.column(16).footer()).html(
                        formatter.format(pagetotal_service_invoice_amount)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );

                    $(api.column(17).footer()).html(
                        formatter.format(pagetotal_prod_invoice_amount)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );

                    $(api.column(18).footer()).html(
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
                columns: [
                    { title: 'Internal ID' }, //0
                    { title: 'ID' }, //1
                    { title: 'Company Name' },//2
                    { title: 'Franchisee' },//3
                    { title: 'Source' },//4
                    { title: 'Product Weekly Usage' },//5
                    { title: 'Previous Carrier' },//6
                    { title: 'MP Express' },//7
                    { title: 'MP Standard' },//8
                    { title: 'Daily Usage' },//9
                    { title: 'Date - Lead Entered' },//10
                    { title: 'Date - Quote Sent' },//11
                    { title: 'Date - Prospect Won' },//12
                    { title: 'Trial End Date' },//13
                    { title: 'Days Open' },//14
                    { title: 'Expected Monthly Service' },//15
                    { title: 'Sales Rep' },//16
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [2, 3, 4, 12, 13],
                        className: 'bolded'
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

                    // Total MP Express Usage
                    total_mp_exp_usage = api
                        .column(7)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total MP Express Usage
                    page_mp_exp_usage = api
                        .column(7, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total MP Standard Usage
                    total_mp_std_usage = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total MP Standard Usage
                    page_mp_std_usage = api
                        .column(8, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Expected Usage over all pages
                    total_monthly_service_revenue = api
                        .column(15)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_monthly_service_revenue = api
                        .column(15, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);



                    // Update footer
                    $(api.column(15).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );



                }
            });



            var dataTable = $('#mpexusage-customer').DataTable({
                data: customerDataSet,
                pageLength: 250,
                order: [[13, 'des']],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'MP Express' },
                    { title: 'MP Standard' },
                    { title: 'Daily Usage' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    // { title: '48h Email Sent' },
                    { title: 'Date - Prospect Won' },
                    { title: 'Days Open' },
                    { title: 'Expected Monthly Service' },
                    { title: 'Total Service Invoice' },
                    { title: 'Total Product Invoice' },
                    { title: 'Total Invoice' },
                    { title: 'Sales Rep' },
                    { title: 'Auto Signed Up' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [20, 21],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 13, 15, 16, 17, 18],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    var row_color = ''
                    if (data[5] == 'Additional Services') {
                        $('td', row).css('background-color', '#86A3B8');
                    } else if (!isNullorEmpty(data[21])) {
                        data[21].forEach(function (el) {

                            if (isNullorEmpty(el.invoiceDocumentNumber) || parseFloat(el.invoiceAmount) == 0 || el.invoiceDocumentNumber == 'Memorized') {
                                row_color = ''

                            } else {
                                row_color = '#53BF9D'
                            }
                        });
                        $('td', row).css('background-color', row_color);

                    } else if (!isNullorEmpty(data[15])) {
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

                    // Total MP Express Usage
                    total_mp_exp_usage = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total MP Express Usage
                    page_mp_exp_usage = api
                        .column(8, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total MP Standard Usage
                    total_mp_std_usage = api
                        .column(9)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total MP Standard Usage
                    page_mp_std_usage = api
                        .column(9, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Expected Usage over all pages
                    total_monthly_service_revenue = api
                        .column(15)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_monthly_service_revenue = api
                        .column(15, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    total_service_invoice_amount = api
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    pagetotal_service_invoice_amount = api
                        .column(16, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    total_prod_nvoice_amount = api
                        .column(17)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    pagetotal_prod_invoice_amount = api
                        .column(17, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Expected Usage over all pages
                    total_invoice_amount = api
                        .column(18)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    pagetotal_invoice_amount = api
                        .column(18, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    $(api.column(8).footer()).html(
                        page_mp_exp_usage
                    );
                    $(api.column(9).footer()).html(
                        page_mp_std_usage
                    );

                    // Update footer
                    $(api.column(15).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );

                    $(api.column(16).footer()).html(
                        formatter.format(pagetotal_service_invoice_amount)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );

                    $(api.column(17).footer()).html(
                        formatter.format(pagetotal_prod_invoice_amount)
                        // '$' + page_total_monthly_service_revenue.toFixed(2).toLocaleString()
                    );

                    $(api.column(18).footer()).html(
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



            console.log('prospectDataSet: ' + prospectDataSet)

            var dataTable2 = $('#mpexusage-prospects_quoteSent_incontact_noanswer').DataTable({
                data: prospectDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    { title: '48h Email Sent' },
                    { title: 'Days Open' },
                    { title: 'Monthly Service Value' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
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
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    { title: '48h Email Sent' },
                    { title: 'Days Open' },
                    { title: 'Monthly Service Value' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
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


            console.log('suspectDataSet: ' + suspectDataSet);

            var dataTable3 = $('#mpexusage-suspects').DataTable({
                data: suspectDataSet,
                pageLength: 250,
                order: [8, 'desc'],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: '48H Email Sent?' },
                    { title: 'Days Open' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [12],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 5, 6, 8, 10],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {
                    console.log(JSON.stringify(data[12]));
                    console.log(data[12].length);

                    if (isNullorEmpty(data[12])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }, footerCallback: function (row, data, start, end, display) {

                }
            });

            dataTable3.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildSuspectsNew(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable3.row(tr);

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

            console.log('suspectQualifiedDataSet: ' + suspectQualifiedDataSet);

            var dataTableQualified = $('#mpexusage-suspects_qualified').DataTable({
                data: suspectQualifiedDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Days Open' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [11],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 6, 9, 10],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    if (isNullorEmpty(data[11])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }, footerCallback: function (row, data, start, end, display) {

                }
            });

            dataTableQualified.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildQualified(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_qualified tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableQualified.row(tr);

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

            var dataTableValidated = $('#mpexusage-suspects_validated').DataTable({
                data: suspectValidatedDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - LPO Validated' },
                    { title: 'Days Open' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [12],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 6, 9, 10],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {
                    console.log('mpexusage-suspects_qualified');
                    console.log(JSON.stringify(data[12]));
                    console.log(data[12].length);

                    if (isNullorEmpty(data[12])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }, footerCallback: function (row, data, start, end, display) {


                }
            });

            dataTableValidated.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildValidated(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_validated tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableValidated.row(tr);

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


            console.log('suspectOffPeakDataSet: ' + suspectOffPeakDataSet);

            var dataTable5 = $('#mpexusage-suspects_off_peak_pipeline').DataTable({
                data: suspectOffPeakDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    { title: 'Date - Lead Reassigned' },
                    { title: 'Date - Lead Lost' },
                    { title: '48H Email Sent?' },
                    { title: 'Days Open' },
                    { title: 'Cancellation Reason' },
                    { title: 'Monthly Service Value' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [18],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 14, 15],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    if (isNullorEmpty(data[18])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }
            });

            dataTable5.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild3(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_off_peak_pipeline tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable5.row(tr);

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


            console.log('suspectLostDataSet: ' + suspectLostDataSet);

            var dataTable6 = $('#mpexusage-suspects_lost').DataTable({
                data: suspectLostDataSet,
                pageLength: 250,
                order: [12, 'desc'],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    { title: 'Date - Prospect Won' },
                    { title: 'Date - Lead Lost' },
                    { title: '48H Email Sent?' },
                    { title: 'Days Open' },
                    { title: 'Cancellation Reason' },
                    { title: 'Monthly Service Value' },
                    { title: 'Avg Invoice - Last 3 Months' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [19],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 14, 15],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {
                    console.log(JSON.stringify(data[19]));
                    console.log(data[19].length);

                    if (isNullorEmpty(data[19])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (!isNullorEmpty(data[17])) {

                        $('td', row).css('background-color', '#E86252');
                        $('td', row).css('font-weight', 'bold');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        // $('td', row).css('background-color', '#EBB3A9');
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
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_monthly_service_revenue = api
                        .column(16, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(16).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                    );

                    // Total Expected Usage over all pages
                    total_avg_monthly_service_revenue = api
                        .column(17)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_avg_monthly_service_revenue = api
                        .column(17, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(17).footer()).html(
                        formatter.format(page_total_avg_monthly_service_revenue)
                    );

                }
            });

            dataTable6.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildSuspectLost(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_lost tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable6.row(tr);

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



            console.log('suspectOOTDataSet: ' + suspectOOTDataSet);

            var dataTable7 = $('#mpexusage-suspects_oot').DataTable({
                data: suspectOOTDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    { title: 'Date - Lead Reassigned' },
                    { title: 'Date - Lead Lost' },
                    { title: '48H Email Sent?' },
                    { title: 'Days Open' },
                    { title: 'Cancellation Reason' },
                    { title: 'Monthly Service Value' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [18],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 14, 15],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    if (isNullorEmpty(data[18])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }
            });

            dataTable7.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild3(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_oot tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable7.row(tr);

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


            console.log('suspectFollowUpDataSet: ' + suspectFollowUpDataSet);

            var dataTable8 = $('#mpexusage-suspects_followup').DataTable({
                data: suspectFollowUpDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Product Weekly Usage' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Date - Quote Sent' },
                    { title: 'Date - Lead Reassigned' },
                    { title: 'Date - Lead Lost' },
                    { title: '48H Email Sent?' },
                    { title: 'Days Open' },
                    { title: 'Cancellation Reason' },
                    { title: 'Monthly Service Value' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [18],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 14, 15],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    if (isNullorEmpty(data[18])) {
                        $('td', row).css('background-color', '#f9c67a');
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
                        .column(16)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Page Total Expected Usage over this page
                    page_total_monthly_service_revenue = api
                        .column(16, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Update footer
                    $(api.column(16).footer()).html(
                        formatter.format(page_total_monthly_service_revenue)
                    );

                }
            });

            dataTable8.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild3(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_followup tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTable8.row(tr);

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

            console.log('suspectNoAnswerDataSet: ' + suspectNoAnswerDataSet);


            var dataTableSuspectNoAnswer = $('#mpexusage-suspects_no_answer').DataTable({
                data: suspectNoAnswerDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Days Open' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [11],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 6, 9, 10],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {
                    console.log(data[3] + ' Suspects No Answer Child Data Set: ' + data[11]);
                    if (isNullorEmpty(data[11])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }, footerCallback: function (row, data, start, end, display) {


                }
            });

            dataTableSuspectNoAnswer.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildNoAnswerInContact(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_no_answer tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableSuspectNoAnswer.row(tr);

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



            var dataTableSuspectInContact = $('#mpexusage-suspects_in_contact').DataTable({
                data: suspectInContactDataSet,
                pageLength: 250,
                order: [],
                columns: [
                    {
                        title: 'Expand',
                        className: 'dt-control',
                        orderable: false,
                        data: null,
                        defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>',
                    },
                    { title: 'Internal ID' },
                    { title: 'ID' },
                    { title: 'Company Name' },
                    { title: 'Franchisee' },
                    { title: 'Status' },
                    { title: 'Source' },
                    { title: 'Previous Carrier' },
                    { title: 'Date - Lead Entered' },
                    { title: 'Days Open' },
                    { title: 'Sales Rep' },
                    { title: 'Child Table' }
                ],
                autoWidth: false,
                columnDefs: [
                    {
                        targets: [11],
                        visible: false
                    },
                    {
                        targets: [2, 3, 4, 6, 9, 10],
                        className: 'bolded'
                    }
                ],
                rowCallback: function (row, data, index) {

                    if (isNullorEmpty(data[11])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
                    }


                }, footerCallback: function (row, data, start, end, display) {


                }
            });

            dataTableSuspectInContact.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChildNoAnswerInContact(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects_in_contact tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = dataTableSuspectInContact.row(tr);

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

            row.data()[21].forEach(function (el) {
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
        function createChildExisting(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];

            // console.log('customer child row: ' + row.data()[19]);

            row.data()[21].forEach(function (el) {
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

        function createChildSuspectLost(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[19].forEach(function (el) {

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
        function createChild3(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[18].forEach(function (el) {

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

        function createChildSuspectsNew(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[12].forEach(function (el) {

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

        function createChildQualified(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[11].forEach(function (el) {

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


        function createChildValidated(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[12].forEach(function (el) {

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


        function createChildNoAnswerInContact(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[11].forEach(function (el) {

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

        function plotChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a) {
            // console.log(series_data)

            Highcharts.chart(
                'container_preview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Website Leads - By Status - Week Entered',
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

        function plotLPOChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a, series_data22a, series_data23a, series_data24a, series_data25a) {
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

        function plotChartCustomerCanellationRequested(series_data100,
            series_data101,
            series_data102, series_data103, categores) {
            // console.log(series_data)

            Highcharts.chart(
                'container_cancellation', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Cancellation Request - Week Requested',
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
                        text: 'Total Cancellation Request Count',
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
                    name: 'Saved',
                    data: series_data101,
                    color: '#439A97',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'On going',
                    data: series_data103,
                    color: '#f9c67a',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Not Saved',
                    data: series_data102,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartProspects(series_data40,
            series_data41,
            series_data42,
            series_data43, series_data44, categores5) {
            // console.log(series_data)

            Highcharts.chart(
                'container_quoteSent_incontact_noanswer', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Prospects - Weekly Opportunity / In Contact',
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
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: '#0B2447',
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
                    }
                },
                series: [{
                    name: 'Prospect - Opportunity',
                    data: series_data44,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - In Contact',
                    data: series_data42,
                    color: '#59C1BD',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
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

        function plotChartSuspects(series_data50, series_data50,
            series_data51,
            series_data52,
            series_data53, categores_suspects) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Hot Lead - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects,
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
                    name: 'Suspect - Hot Lead',
                    data: series_data51,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - New',
                    data: series_data50,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Reassign',
                    data: series_data52,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                },]
            });
        }

        function plotChartSuspectsLost(series_data60, series_data61,
            series_data62, categores_suspects_lost) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_lost', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Lost - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects_lost,
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
                    name: 'Suspect - Lost',
                    data: series_data60,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer -Lost',
                    data: series_data61,
                    color: '#e86252',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSuspectsOffPeakPipeline(series_data70, categores_suspects_off_peak_pipeline) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_off_peak_pipeline', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Parking Lot - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects_off_peak_pipeline,
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
                            color: '#0B2447',
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
                    name: 'Suspect - Parking Lot',
                    data: series_data70,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSuspectsOOT(series_data80, categores_suspects_oot) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_oot', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Out of Territory - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects_oot,
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
                            color: '#0B2447',
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
                    name: 'Suspect - Out of Territory',
                    data: series_data80,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSuspectsValidated(series_data90, categores_validated) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_validated', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Validated - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_validated,
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
                            fontWeight: 'bold'
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
                    name: 'Suspect - Validated',
                    data: series_data90,
                    color: '#FCE09B',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }
        function plotChartSuspectsQualified(series_data90, categores_qualified) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_qualified', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Qualified - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_qualified,
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
                            fontWeight: 'bold'
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
                    name: 'Suspect - Qualified',
                    data: series_data90,
                    color: '#FCE09B',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSuspectsFollowUp(series_data90, categores_suspects_follow_up, series_data91) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_followup', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Follow Up - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects_follow_up,
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
                            fontWeight: 'bold'
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
                    name: 'Suspect - Follow Up',
                    data: series_data90,
                    color: '#AED2FF',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - LPO Follow Up',
                    data: series_data91,
                    color: '#8ECDDD',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }


        function plotChartSuspectsNoAnswer(series_data200, categores_suspects_no_answer, series_data201) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_no_answer', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - No Answer - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects_no_answer,
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
                            fontWeight: 'bold'
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
                    name: 'Suspect - No Answer',
                    data: series_data200,
                    color: '#FCE09B',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSuspectsInContact(series_data300, categores_suspects_in_contact, series_data301) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_in_contact', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - In Contact - Week Entered',
                    style: {
                        fontWeight: 'bold',
                        color: '#0B2447',
                        fontSize: '12px'
                    }
                },
                xAxis: {
                    categories: categores_suspects_in_contact,
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
                            fontWeight: 'bold'
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
                    name: 'Suspect - In Contact',
                    data: series_data300,
                    color: '#FCE09B',
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
                    text: 'Trail Customers by Source - Week Signed Up',
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
                    text: 'Customer Signed by Source - Week Signed Up',
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

        /**
         * Create the CSV and store it in the hidden field
         * 'custpage_table_csv' as a string.
         *
         * @param {Array}
         */
        function saveCustomerCsvPreview(ordersDataSet) {
            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'MP Express Usage',
                'MP Standard Usage',
                'Date - Lead Entered',
                'Date - Quote Sent',
                '48h Email Sent',
                'Date - Prospect Won',
                'Days Open',
                'Monthly Service Value',
                'Sales Rep',
                'Auto Signed Up',
                'Invoice Document Number',
                'Invoice Date',
                'Invoice Type',
                'Invoice Amount',
                'Invoice Status'
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
                fieldId: 'custpage_table_csv',
                value: csv
            });

            return true;
        }

        /**
         * Create the CSV and store it in the hidden field
         * 'custpage_table_csv' as a string.
         *
         * @param {Array}
         */
        function saveProspectOpportunityCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                '48h Email',
                'Days Open',
                'Monthly Service Value',
                'Sales Rep'
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
                fieldId: 'custpage_prospect_opportunity_table_csv',
                value: csv
            });

            return true;
        }
        /**
         * Create the CSV and store it in the hidden field
         * 'custpage_table_csv' as a string.
         *
         * @param {Array}
         */
        function saveSuspectLostCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                'Date - Prospect Won',
                'Date - Lead Lost',
                '48h Email',
                'Days Open',
                'Cancellation Reason',
                'Monthly Service Value',
                'Avg Invoice Value',
                'Sales Rep'
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
                fieldId: 'custpage_suspect_lost_table_csv',
                value: csv
            });

            return true;
        }
        function saveSuspectOOTCsvPreview(ordersDataSet) {
            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                'Date - Lead Reassigned',
                'Date - Lead Lost',
                '48h Email',
                'Days Open',
                'Cancellation Reason',
                'Monthly Service Value',
                'Sales Rep'
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
                fieldId: 'custpage_suspect_oot_table_csv',
                value: csv
            });

            return true;
        }
        function saveSuspectFollowUpCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                'Date - Lead Reassigned',
                'Date - Lead Lost',
                '48h Email',
                'Days Open',
                'Cancellation Reason',
                'Monthly Service Value',
                'Sales Rep'
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
                fieldId: 'custpage_suspect_followup_table_csv',
                value: csv
            });

            return true;
        }
        function saveSuspectOffPeakCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                'Date - Lead Reassigned',
                'Date - Lead Lost',
                '48h Email',
                'Days Open',
                'Cancellation Reason',
                'Monthly Service Value',
                'Sales Rep'
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
                fieldId: 'custpage_suspect_offpeak_table_csv',
                value: csv
            });

            return true;
        }
        function saveSuspectCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                'Date - Prospect Won',
                'Date - Lead Lost',
                '48h Email',
                'Days Open',
                'Cancellation Reason',
                'Monthly Service Value',
                'Sales Rep'
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
                fieldId: 'custpage_suspect_table_csv',
                value: csv
            });

            return true;
        }
        /**
         * Create the CSV and store it in the hidden field
         * 'custpage_table_csv' as a string.
         *
         * @param {Array}
         */
        function saveProspectCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Status',
                'Source',
                'Product Weekly Usage',
                'Previous Carrier',
                'Date - Lead Entered',
                'Date - Quote Sent',
                '48h Email',
                'Days Open',
                'Monthly Service Value',
                'Sales Rep'
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
                fieldId: 'custpage_prospect_table_csv',
                value: csv
            });

            return true;
        }
        /**
         * Create the CSV and store it in the hidden field
         * 'custpage_table_csv' as a string.
         *
         * @param {Array}
         */
        function saveExistingCustomerCsvPreview(ordersDataSet) {

            var sep = "sep=;";
            headers = [
                'Internal ID',
                'ID',
                'Company Name',
                'Franchisee',
                'Source',
                'MP Express Usage',
                'MP Standard Usage',
                'Date - Lead Entered',
                'Date - Prospect Won',
                'Monthly Service Value',
                'Sales Rep',
                'Auto Signed Up',
                'Invoice Document Number',
                'Invoice Date',
                'Invoice Type',
                'Invoice Amount',
                'Invoice Status'
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
                fieldId: 'custpage_existing_customer_table_csv',
                value: csv
            });

            return true;
        }


        function downloadCsv() {

            var today = new Date();
            today = formatDate(today);
            var val1 = currentRecord.get();
            var csv = val1.getValue({
                fieldId: 'custpage_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFile = new Blob([csv], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFile);
            var filename = 'Signed Customers_' + today + '.csv';
            a.href = url;
            a.download = filename;
            a.click();

            var csv_overview = val1.getValue({
                fieldId: 'custpage_overview_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileOverview = new Blob([csv_overview], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileOverview);
            var filenameOverview = 'Lead Reporting - Overview - By Lead Entered_' + today + '.csv';
            a.href = url;
            a.download = filenameOverview;
            a.click();

            var csv_existing = val1.getValue({
                fieldId: 'custpage_existing_customer_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileExisting = new Blob([csv_existing], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileExisting);
            var filenameExisting = 'Existing Customers_' + today + '.csv';
            a.href = url;
            a.download = filenameExisting;
            a.click();


            var csv_prospect = val1.getValue({
                fieldId: 'custpage_prospect_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileProspect = new Blob([csv_prospect], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileProspect);
            var filenameProspect = 'Prospects_' + today + '.csv';
            a.href = url;
            a.download = filenameProspect;
            a.click();


            var csv_prospect_opp = val1.getValue({
                fieldId: 'custpage_prospect_opportunity_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileProspectOpp = new Blob([csv_prospect_opp], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileProspectOpp);
            var filenameProspectOpp = 'Prospects Opportunity_' + today + '.csv';
            a.href = url;
            a.download = filenameProspectOpp;
            a.click();


            var csv_suspect = val1.getValue({
                fieldId: 'custpage_suspect_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileSuspect = new Blob([csv_suspect], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileSuspect);
            var filenameSuspect = 'Suspects_' + today + '.csv';
            a.href = url;
            a.download = filenameSuspect;
            a.click();

            var csv_suspect_lost = val1.getValue({
                fieldId: 'custpage_suspect_lost_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileSuspectLost = new Blob([csv_suspect_lost], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileSuspectLost);
            var filenameSuspectLost = 'Suspects Lost_' + today + '.csv';
            a.href = url;
            a.download = filenameSuspectLost;
            a.click();

            var csv_suspect_offpeak = val1.getValue({
                fieldId: 'custpage_suspect_offpeak_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileSuspectOffPeak = new Blob([csv_suspect_offpeak], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileSuspectOffPeak);
            var filenameSuspectOffPeak = 'Suspects Off Peak_' + today + '.csv';
            a.href = url;
            a.download = filenameSuspectOffPeak;
            a.click();

            var csv_suspect_followup = val1.getValue({
                fieldId: 'custpage_suspect_followup_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileSuspectFollowUp = new Blob([csv_suspect_followup], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileSuspectFollowUp);
            var filenameSuspectFollowUp = 'Suspects Follow Up_' + today + '.csv';
            a.href = url;
            a.download = filenameSuspectFollowUp;
            a.click();

            var csv_suspect_oot = val1.getValue({
                fieldId: 'custpage_suspect_oot_table_csv',
            });
            today = replaceAll(today);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            var content_type = 'text/csv';
            var csvFileSuspectOOT = new Blob([csv_suspect_oot], {
                type: content_type
            });
            var url = window.URL.createObjectURL(csvFileSuspectOOT);
            var filenameSuspectOOT = 'Suspects Follow Up_' + today + '.csv';
            a.href = url;
            a.download = filenameSuspectOOT;
            a.click();

            window.URL.revokeObjectURL(url);


        };

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
        return {
            pageInit: pageInit,
            saveRecord: saveRecord,
            downloadCsv: downloadCsv,
            addFilters: addFilters
        }
    });