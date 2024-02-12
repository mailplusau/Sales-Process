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
    'N/error', 'N/url', 'N/format', 'N/currentRecord', 'N/portlet'
],
    function (email, runtime, search, record, http, log, error, url, format,
        currentRecord, portlet) {
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
        var sales_rep = null;
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

        var debtDataSetSuspectsOffPeakPipeline = [];
        var debt_setSuspectsOffPeakPipeline = [];

        var debtDataSetSuspectsOOT = [];
        var debt_setSuspectsOOT = [];


        var debtDataSetSuspectsFollowUp = [];
        var debt_setSuspectsFollowUp = [];
        var debt_setSuspectsQualified = [];

        var debt_setCustomerCancellationRequest = [];


        var customerDataSet = [];
        var existingCustomerDataSet = [];
        var prospectDataSet = [];
        var prospectOpportunityDataSet = [];
        var suspectDataSet = [];
        var suspectLostDataSet = [];
        var suspectOffPeakDataSet = [];
        var suspectOOTDataSet = [];
        var suspectFollowUpDataSet = [];
        var suspectQualifiedDataSet = [];


        var customerChildDataSet = [];
        var existingCustomerChildDataSet = [];
        var prospectChildDataSet = [];
        var prospectOpportunityChildDataSet = [];
        var suspectChildDataSet = []
        var suspectOffPeakChildDataSet = [];;
        var suspectLostChildDataSet = [];
        var suspectOOTChildDataSet = [];
        var suspectQualifiedChildDataSet = [];
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
            $('.data-range_note').addClass('hide');

            $('.loading_section').removeClass('hide');
        }

        function afterSubmit() {
            // $('.date_filter_section').removeClass('hide');
            // $('.period_dropdown_section').removeClass('hide');




            // if (!isNullorEmpty($('#result_customer_benchmark').val())) {
            //     $('#customer_benchmark_preview').removeClass('hide');
            //     $('#customer_benchmark_preview').show();
            // }

            // $('#result_customer_benchmark').on('change', function () {
            //     $('#customer_benchmark_preview').removeClass('hide');
            //     $('#customer_benchmark_preview').show();
            // });

            // $('#customer_benchmark_preview').removeClass('hide');
            // $('#customer_benchmark_preview').show();
            if (role != 1000) {
                // $('.zee_label_section').removeClass('hide');
                // $('.zee_dropdown_section').removeClass('hide');
                // $('.calcprodusage_div').removeClass('hide');
                // $('.table_section').removeClass('hide');
                // $('.usage_label_section').removeClass('hide');
                // $('.lead_entered_label_section').removeClass('hide');
                // $('.lead_entered_div').removeClass('hide');
            }

            $('.show_buttons_section').removeClass('hide');

            // $('.source_salesrep_label_section').removeClass('hide');
            // $('.source_salesrep_section').removeClass('hide');

            // $('.quote_sent_label_section').removeClass('hide');
            // $('.quote_sent_div').removeClass('hide');
            // $('.signed_up_label_section').removeClass('hide');
            // $('.signed_up_div').removeClass('hide');
            $('.highcharts-figure').addClass('hide');
            $('.tab-content').addClass('hide');
            // if (userId == 626428) {
            //     $('.highcharts-figure').addClass('hide');
            // } else {
            // $('.usage_date_div').removeClass('hide');
            // $('.invoice_label_section').removeClass('hide');
            // $('.invoice_date_type_div').removeClass('hide');

            // $('.tabs_section').removeClass('hide');
            // $('.data-range_note').removeClass('hide');
            // }
            $('.filter_buttons_section').removeClass('hide');
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


            // date_quote_sent_from = $('#date_quote_sent_from').val();
            // date_quote_sent_from = dateISOToNetsuite(date_quote_sent_from);

            // date_quote_sent_to = $('#date_quote_sent_to').val();
            // date_quote_sent_to = dateISOToNetsuite(date_quote_sent_to);

            lead_source = $('#lead_source').val();
            sales_rep = $('#sales_rep').val();
            // invoice_type = $('#invoice_type').val();
            calcprodusage = $('#calc_prod_usage').val();

            // invoice_date_from = $('#invoice_date_from').val();
            // invoice_date_from = dateISOToNetsuite(invoice_date_from);
            // invoice_date_to = $('#invoice_date_to').val();
            // invoice_date_to = dateISOToNetsuite(invoice_date_to);


            /**
             *  Auto Load Submit Search and Load Results on Page Initialisation
             */

            submitSearch();
            var dataTable = $('#customer_benchmark_preview').DataTable();


            var today = new Date();
            var today_year = today.getFullYear();
            var today_month = today.getMonth();
            var today_day = today.getDate();

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

                var sales_rep = $('#sales_rep').val();
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

                // if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
                //     var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&invoice_date_from=" + invoice_date_from + '&invoice_date_to=' + invoice_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&invoice_type=' + invoice_type + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage;
                // } else if ((isNullorEmpty(date_to) || isNullorEmpty(date_from))) {
                //     var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&date_signed_up_from=" + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage;
                // } else if ((isNullorEmpty(usage_date_from) || isNullorEmpty(usage_date_to))) {
                //     var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage;
                // } else {
                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to + '&sales_rep=' + sales_rep + '&zee=' + zee + '&calcprodusage=' + calcprodusage + "&invoice_date_from=" + invoice_date_from + '&invoice_date_to=' + invoice_date_to;
                // }

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

            $("#fullReport").click(function () {

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1"
                window.open(url, '_blank')
                // window.location.href = url;

            });

            $("#enter_leads").click(function () {

                var url = "https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1706&deploy=1&compid=1048144&script=1706&deploy=1&compid=1048144&script=1706&deploy=1&whence="
                window.open(url, '_blank')
                // window.location.href = url;

            });

            portlet.resize();
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

            console.log('date_signed_up_from: ' + date_signed_up_from);
            console.log('date_signed_up_to ' + date_signed_up_to);

            // console.log('date_quote_sent_from: ' + date_quote_sent_from);
            // console.log('date_quote_sent_to ' + date_quote_sent_to);

            // console.log('lead_source ' + lead_source);
            // console.log('sales_rep ' + sales_rep);
            // console.log('invoice_type ' + invoice_type);
            // console.log('invoice_date_from ' + invoice_date_from);
            // console.log('invoice_date_to ' + invoice_date_to);

            console.log('zee_id ' + zee_id);
            // if (userId == 1645493) {
            console.log('date_from:' + date_from);
            console.log('date_to:' + date_to);
            if (role == 1000) {
                //Zee Lead by Status - Monthly Reporting
                var qualifiedLeadCountSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_zee_lead_by_status_monthly'
                });
            } else {
                //Zee Lead by Status - Monthly Reporting
                var qualifiedLeadCountSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_zee_lead_by_status_monthly'
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


            var totalLeadCount = 0;
            var totalCustomerCount = 0;
            var totalSuspectCount = 0;
            var totalProspectCount = 0;
            var totalCustomerLostCount = 0;
            var totalQualifiedLeadCount = 0;
            var totalLeadLost = 0;
            var totalLeadGeneratedCount = 0;

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

                if (leadStatusSplit[0].toUpperCase() == 'SUSPECT') {
                    totalSuspectCount = totalSuspectCount + leadCount;
                }

                if (leadStatusSplit[0].toUpperCase() == 'PROSPECT') {
                    totalProspectCount = totalProspectCount + leadCount;
                }

                if (leadStatusId == 59) {
                    totalLeadLost = totalLeadLost + leadCount;
                }

                totalLeadGeneratedCount++;
                return true;
            });

            if (totalLeadGeneratedCount > 0) {
                // Create the chart
                Highcharts.chart('container-progress', {
                    chart: {
                        type: 'pie'
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
                                // distance: -40,
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
                                    // sliced: true,
                                    color: '#adcf9f',
                                },
                                {
                                    name: 'Suspects',
                                    y: totalSuspectCount,
                                    // sliced: true,
                                    color: '#FEBE8C',
                                },
                                {
                                    name: 'Suspects - Lost',
                                    y: totalLeadLost,
                                    // sliced: true,
                                    color: '#e97677',
                                },
                                {
                                    name: 'Customers - Lost',
                                    y: totalCustomerLostCount,
                                    // sliced: true,
                                    color: '#e76252',
                                }
                            ]
                        }
                    ]
                });
            } else {
                $('.no_leads_text').removeClass('hide')
                $('#noleads').text('You have not generated any leads in the past 3 months. Please click the button below to enter in leads. ')
            }



            // const gaugeOptions = {
            //     chart: {
            //         type: 'solidgauge',
            //         // backgroundColor: '#CFE0CE',
            //         // height: (4 / 16 * 100) + '%',
            //         // zoomType: 'xy'
            //     },

            //     title: null,

            //     pane: {
            //         center: ['50%', '85%'],
            //         size: '100%',
            //         startAngle: -90,
            //         endAngle: 90,
            //         background: {
            //             backgroundColor:
            //                 Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            //             innerRadius: '60%',
            //             outerRadius: '100%',
            //             shape: 'arc'
            //         }
            //     },

            //     exporting: {
            //         enabled: false
            //     },

            //     tooltip: {
            //         enabled: true
            //     },

            //     // the value axis
            //     yAxis: {
            //         stops: [
            //             [0, '#095c7b'], // green
            //             // [0.4, '#DDDF0D'], // yellow
            //             // [0.2, '#DF5353'] // red
            //         ],
            //         lineWidth: 0,
            //         tickWidth: 0,
            //         minorTickInterval: null,
            //         tickAmount: 1,
            //         title: {
            //             y: -70
            //         },
            //         labels: {
            //             y: 16
            //         }
            //     },

            //     plotOptions: {
            //         solidgauge: {
            //             dataLabels: {
            //                 y: parseInt(totalQualifiedLeadCount),
            //                 borderWidth: 0,
            //                 useHTML: true
            //             }
            //         }
            //     }
            // };

            // // The speed gauge
            // const chartSpeed = Highcharts.chart('container-progress', Highcharts.merge(gaugeOptions, {
            //     yAxis: {
            //         min: 0,
            //         max: parseInt(totalLeadCount),
            //         title: {
            //             text: ''
            //         },
            //         labels: {
            //             formatter: function () {
            //                 return this.value + ' Leads';
            //             }
            //         }
            //     },

            //     credits: {
            //         enabled: false
            //     },

            //     series: [{
            //         name: 'Qualified Leads',
            //         data: [parseInt(totalQualifiedLeadCount)],
            //         dataLabels: {
            //             format:
            //                 '<div style="text-align:center">' +
            //                 '<span style="font-size:25px">{y}</span><br/>' +
            //                 '<span style="font-size:12px;opacity:0.4">Qualified Leads</span>' +
            //                 '</div>'
            //         },
            //         tooltip: {
            //             valueSuffix: ' '
            //         }
            //     }]

            // }));


            // const gaugeOptionsLeadLost = {
            //     chart: {
            //         type: 'solidgauge',
            //         // backgroundColor: '#CFE0CE',
            //         // height: (4 / 16 * 100) + '%',
            //         // zoomType: 'xy'
            //     },

            //     title: null,

            //     pane: {
            //         center: ['50%', '85%'],
            //         size: '100%',
            //         startAngle: -90,
            //         endAngle: 90,
            //         background: {
            //             backgroundColor:
            //                 Highcharts.defaultOptions.legend.backgroundColor || '#EEE',
            //             innerRadius: '60%',
            //             outerRadius: '100%',
            //             shape: 'arc'
            //         }
            //     },

            //     exporting: {
            //         enabled: false
            //     },

            //     tooltip: {
            //         enabled: true
            //     },

            //     // the value axis
            //     yAxis: {
            //         stops: [
            //             [0, '#095c7b'], // green
            //             // [0.4, '#DDDF0D'], // yellow
            //             // [0.2, '#DF5353'] // red
            //         ],
            //         lineWidth: 0,
            //         tickWidth: 0,
            //         minorTickInterval: null,
            //         tickAmount: 1,
            //         title: {
            //             y: -70
            //         },
            //         labels: {
            //             y: 16
            //         }
            //     },

            //     plotOptions: {
            //         solidgauge: {
            //             dataLabels: {
            //                 y: parseInt(totalLeadLost),
            //                 borderWidth: 0,
            //                 useHTML: true
            //             }
            //         }
            //     }
            // };

            // // The speed gauge
            // const chartSpeedLeadLost = Highcharts.chart('container-progress-lost', Highcharts.merge(gaugeOptionsLeadLost, {
            //     yAxis: {
            //         min: 0,
            //         max: parseInt(totalLeadCount),
            //         title: {
            //             text: ''
            //         },
            //         labels: {
            //             formatter: function () {
            //                 return this.value + ' Leads';
            //             }
            //         }
            //     },

            //     credits: {
            //         enabled: false
            //     },

            //     series: [{
            //         name: 'Lost Leads',
            //         data: [parseInt(totalLeadLost)],
            //         dataLabels: {
            //             format:
            //                 '<div style="text-align:center">' +
            //                 '<span style="font-size:25px">{y}</span><br/>' +
            //                 '<span style="font-size:12px;opacity:0.4">Lost Leads</span>' +
            //                 '</div>'
            //         },
            //         tooltip: {
            //             valueSuffix: ' '
            //         }
            //     }]

            // }));

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

                    // console.log('data[2]: ' + data[2])

                    // console.log('data[11]: ' + data[11])
                    // var dateUsedArray = data[1].split('/');
                    // var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
                    // var dateAfter2Days = new Date();
                    // dateAfter2Days.setDate(date.getDate() + 2);
                    // var today = new Date();
                    // console.log('date: ' + date)
                    // console.log('today: ' + today)
                    // console.log('dateAfter2Days: ' + dateAfter2Days)
                    // console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
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

                    // console.log('data[2]: ' + data[2])

                    // console.log('data[11]: ' + data[11])
                    // var dateUsedArray = data[1].split('/');
                    // var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
                    // var dateAfter2Days = new Date();
                    // dateAfter2Days.setDate(date.getDate() + 2);
                    // var today = new Date();
                    // console.log('date: ' + date)
                    // console.log('today: ' + today)
                    // console.log('dateAfter2Days: ' + dateAfter2Days)
                    // console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
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

                    // console.log('data[2]: ' + data[2])

                    // console.log('data[11]: ' + data[11])
                    // var dateUsedArray = data[1].split('/');
                    // var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
                    // var dateAfter2Days = new Date();
                    // dateAfter2Days.setDate(date.getDate() + 2);
                    // var today = new Date();
                    // console.log('date: ' + date)
                    // console.log('today: ' + today)
                    // console.log('dateAfter2Days: ' + dateAfter2Days)
                    // console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
                    // if (isNullorEmpty(data[11]) && today >= dateAfter2Days) {
                    //     $('td', row).css('background-color', '#FF8787');
                    // } else if (data[11] == 'delivered') {
                    //     $('td', row).css('background-color', '#C7F2A4');
                    // }
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

                    // console.log('data[2]: ' + data[2])

                    // console.log('data[11]: ' + data[11])
                    // var dateUsedArray = data[1].split('/');
                    // var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
                    // var dateAfter2Days = new Date();
                    // dateAfter2Days.setDate(date.getDate() + 2);
                    // var today = new Date();
                    // console.log('date: ' + date)
                    // console.log('today: ' + today)
                    // console.log('dateAfter2Days: ' + dateAfter2Days)
                    // console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
                    // if (isNullorEmpty(data[11]) && today >= dateAfter2Days) {
                    //     $('td', row).css('background-color', '#FF8787');
                    // } else if (data[11] == 'delivered') {
                    //     $('td', row).css('background-color', '#C7F2A4');
                    // }
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

                    // console.log('data[2]: ' + data[2])

                    // console.log('data[11]: ' + data[11])
                    // var dateUsedArray = data[1].split('/');
                    // var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
                    // var dateAfter2Days = new Date();
                    // dateAfter2Days.setDate(date.getDate() + 2);
                    // var today = new Date();
                    // console.log('date: ' + date)
                    // console.log('today: ' + today)
                    // console.log('dateAfter2Days: ' + dateAfter2Days)
                    // console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
                    // if (isNullorEmpty(data[11]) && today >= dateAfter2Days) {
                    //     $('td', row).css('background-color', '#FF8787');
                    // } else if (data[11] == 'delivered') {
                    //     $('td', row).css('background-color', '#C7F2A4');
                    // }
                }
            });
        }

        function destroyChild(row) {
            // And then hide the row
            row.child.hide();
        }

        /**{
                    title: 'Period'
                }, {
                    title: 'Suspect - Hot Lead'
                }, {
                    title: 'Prospect - Quote Sent'
                }, {
                    title: 'Suspect - Reassign'
                }, {
                    title: 'Prospect - No answer'
                }, {
                    title: 'Prospect - In Contact'
                }, {
                    title: 'Suspect - Off Peak Pipeline'
                }, {
                    title: 'Suspect - Lost'
                },{
                    title: 'Suspect - Customer - Lost'
                },{
                    title: 'Customer - Signed'
                }, {
                    title: 'Total Lead Count'
                } */

        function plotChartPreview(series_data20,
            series_data21,
            series_data22,
            series_data23,
            series_data24,
            series_data25,
            series_data26,
            series_data27,
            series_data28,
            series_data29, series_data31, series_data32, series_data33, series_data34, categores, series_data20a, series_data21a) {
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
                    name: 'Prospects - Opportunity',
                    data: series_data31,
                    color: '#ADCF9F',
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
                    name: 'Suspect - Off Peak Pipeline',
                    data: series_data25,
                    color: '#FEBE8C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - Quote Sent',
                    data: series_data26,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - No Answer',
                    data: series_data27,
                    color: '#59C1BD',
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
                    text: 'Prospects - Weekly Quote Sent / In Contact / No Answer',
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
                    name: 'Prospect - Quote Sent',
                    data: series_data40,
                    color: '#3E6D9C',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Prospect - No Answer',
                    data: series_data41,
                    color: '#59C1BD',
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

        function plotChartProspectsOpportunities(
            series_data43, series_data44, categores5) {
            // console.log(series_data)

            Highcharts.chart(
                'container_prospects_opportunites', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Prospects - Weekly Opportunities',
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
                    name: 'Prospect - Opportunity',
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
                    text: 'Suspects - Off Peak Pipeline - Week Entered',
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
                    name: 'Suspect - Off Peak Pipeline',
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


        function plotChartSpeedUsage(series_data_lee, series_data_kerina, series_data_david, series_data_belinda, series_data_total, categores) {
            console.log(series_data_lee)
            console.log(series_data_kerina)
            console.log(series_data_david)
            console.log(series_data_belinda)
            console.log(categores)
            Highcharts
                .chart(
                    'container_preview', {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: categores,
                        crosshair: true,
                        style: {
                            fontWeight: 'bold',
                        },
                        labels: {
                            style: {
                                fontSize: '10px'
                            }
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total Usage',
                            style: {
                                fontWeight: 'bold',
                                color: '#0B2447',
                                fontSize: '10px'
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
                        name: 'Lee',
                        data: series_data_lee,
                        // color: '#108372',
                        style: {
                            fontWeight: 'bold',
                        }
                    }, {
                        name: 'Kerina',
                        data: series_data_kerina,
                        // color: '#f15729',
                        style: {
                            fontWeight: 'bold',
                        }
                    }, {
                        name: 'David',
                        data: series_data_david,
                        // color: '#f15729',
                        style: {
                            fontWeight: 'bold',
                        }
                    }, {
                        name: 'Belinda',
                        data: series_data_belinda,
                        // color: '#f15729',
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

            /**
             *                      csvSuspectLostDataSet.push([
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
             */

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

            /**
             * csvSuspectOOTDataSet.push([
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
             */

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

            /**
             * csvSuspectFollowUpDataSet.push([
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
             */

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

            /**
             *  ccsvSuspectOffPeakDataSet.push([,
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
             */

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

            /**
             *  csvSuspectDataSet.push([
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
                        oldsalesRepText
                    ]);
             */

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

            /**
             * csvProspectOpportunityDataSet.push([
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
             */

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

        function formatAMPM() {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
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
        /**
         * [getDate description] - Get the current date
         * @return {[String]} [description] - return the string date
         */
        function getDate() {
            var date = new Date();
            date = format.format({
                value: date,
                type: format.Type.DATE,
                timezone: format.Timezone.AUSTRALIA_SYDNEY
            });

            return date;
        }

        function isNullorEmpty(val) {
            if (val == '' || val == null) {
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
