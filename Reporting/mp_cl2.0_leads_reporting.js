/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-24T10:22:37+11:00
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


        var customerDataSet = [];
        var prospectDataSet = [];
        var prospectOpportunityDataSet = [];
        var suspectDataSet = [];
        var suspectLostDataSet = [];
        var suspectOffPeakDataSet = [];
        var suspectOOTDataSet = [];
        var suspectFollowUpDataSet = [];


        var customerChildDataSet = [];
        var prospectChildDataSet = [];
        var prospectOpportunityChildDataSet = [];
        var suspectChildDataSet = []
        var suspectOffPeakChildDataSet = [];;
        var suspectLostChildDataSet = [];
        var suspectOOTChildDataSet = [];
        var suspectFollowUpChildDataSet = [];


        var totalSuspectCount = 0;
        var customerActivityCount = 0;
        var totalCustomerCount = 0;
        var suspectActivityCount = 0;
        var prospectActivityCount = 0;
        var totalProspectCount = 0;



        function pageLoad() {
            $('.range_filter_section').addClass('hide');
            $('.range_filter_section_top').addClass('hide');
            $('.date_filter_section').addClass('hide');
            $('.period_dropdown_section').addClass('hide');

            $('.loading_section').removeClass('hide');
        }

        function beforeSubmit() {
            $('#customer_benchmark_preview').hide();
            $('#customer_benchmark_preview').addClass('hide');

            $('.loading_section').removeClass('hide');
        }

        function afterSubmit() {
            $('.date_filter_section').removeClass('hide');
            $('.period_dropdown_section').removeClass('hide');

            $('.loading_section').addClass('hide');


            if (!isNullorEmpty($('#result_customer_benchmark').val())) {
                $('#customer_benchmark_preview').removeClass('hide');
                $('#customer_benchmark_preview').show();
            }

            $('#result_customer_benchmark').on('change', function () {
                $('#customer_benchmark_preview').removeClass('hide');
                $('#customer_benchmark_preview').show();
            });

            $('#customer_benchmark_preview').removeClass('hide');
            $('#customer_benchmark_preview').show();
        }

        function pageInit() {

            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");


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
            invoice_type = $('#invoice_type').val();




            /**
             *  Submit Button Function
             */
            $('#submit').click(function () {
                // Ajax request
                var fewSeconds = 10;
                var btn = $(this);
                btn.addClass('disabled');
                // btn.addClass('')
                setTimeout(function () {
                    btn.removeClass('disabled');
                }, fewSeconds * 1000);



                beforeSubmit();
                submitSearch();

                return true;
            });


            /**
             *  Auto Load Submit Search and Load Results on Page Initialisation
             */
            pageLoad();
            submitSearch();
            var dataTable = $('#customer_benchmark_preview').DataTable();


            var today = new Date();
            var today_year = today.getFullYear();
            var today_month = today.getMonth();
            var today_day = today.getDate();

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

                if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
                    if ((isNullorEmpty(date_signed_up_from) || isNullorEmpty(date_signed_up_to))) {
                        alert('Please enter the date signed up filter');
                        return false;
                    }
                } else if ((isNullorEmpty(date_to) || isNullorEmpty(date_from)) && (isNullorEmpty(usage_date_from) || isNullorEmpty(usage_date_to)) && (isNullorEmpty(date_signed_up_from) || isNullorEmpty(date_signed_up_to))) {
                    alert('Please enter the date filter');
                    return false;
                }

                if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&invoice_date_from=" + invoice_date_from + '&invoice_date_to=' + invoice_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&invoice_type=' + invoice_type + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to;
                } else if ((isNullorEmpty(date_to) || isNullorEmpty(date_from))) {
                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&date_signed_up_from=" + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to;
                } else if ((isNullorEmpty(usage_date_from) || isNullorEmpty(usage_date_to))) {
                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to;
                } else {
                    var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&start_date=" + date_from + '&last_date=' + date_to + '&usage_date_from=' + usage_date_from + '&usage_date_to=' + usage_date_to + '&date_signed_up_from=' + date_signed_up_from + '&date_signed_up_to=' + date_signed_up_to + '&source=' + source + '&date_quote_sent_from=' + date_quote_sent_from + '&date_quote_sent_to=' + date_quote_sent_to;
                }



                window.location.href = url;

            });

            $("#showTotal").click(function () {


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1678&deploy=1&showTotal=T"


                window.location.href = url;

            });


        }

        function adhocNewCustomers() {
            if (isNullorEmpty(invoiceType)) {
                var url = baseURL +
                    "/app/site/hosting/scriptlet.nl?script=1226&deploy=1";
            } else {
                var url = baseURL +
                    "/app/site/hosting/scriptlet.nl?script=1226&deploy=1&invoicetype=" +
                    invoiceType;
            }

            window.location.href = url;
        }

        //Initialise the DataTable with headers.
        function submitSearch() {


            // userId = $('#user_dropdown option:selected').val();
            zee = $(
                '#zee_dropdown option:selected').val();

            loadDebtRecord(zee, userId);

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

        function loadDebtRecord(zee_id, userId) {


            // Website New Leads - Signed - Weekly Reporting
            var customerListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2'
            });

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
                    operator: search.Operator.IS,
                    values: lead_source
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
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services

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
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services

                } else if (oldCustomerSignedDate != null &&
                    oldCustomerSignedDate != startDate) {

                    debt_set3.push({
                        dateUsed: oldCustomerSignedDate,
                        source_zee_generated: source_zee_generated,
                        source_call: source_call,
                        source_field_sales: source_field_sales,
                        source_website: source_website,
                        total_source_count: total_source_count,
                        source_additional_services: source_additional_services
                    });

                    source_zee_generated = 0;
                    source_call = 0;
                    source_field_sales = 0;
                    source_website = 0;
                    total_source_count = 0;
                    source_additional_services = 0;


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
                    }

                    total_source_count =
                        source_zee_generated +
                        source_call +
                        source_field_sales + source_website + source_additional_services
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
                    source_additional_services: source_additional_services
                });
            }

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

            for (var i = 0; i < customerSignedDataSet.length; i++) {
                month_year_customer.push(customerSignedDataSet[i][0]);
                customer_signed_source_zee_generatedcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][1]
                customer_signed_source_callcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][2]
                customer_signed_source_field_salescount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][3]
                customer_signed_source_websitecount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][4]
                customer_signed_total_source_countcount[customerSignedDataSet[i][0]] = customerSignedDataSet[i][6]
                customer_signed_source_additional_services[customerSignedDataSet[i][0]] = customerSignedDataSet[i][5]
            }

            var series_data30 = [];
            var series_data31 = [];
            var series_data32 = [];
            var series_data33 = [];
            var series_data34 = [];
            var series_data35 = [];


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
                categores_customer_signed_week.push(item)
            });


            plotChartCustomerSigned(series_data30, series_data31,
                series_data32,
                series_data33,
                series_data34, series_data35, categores_customer_signed_week);

            // Website New Leads - Prospect - Weekly Reporting
            var prospectWeeklyReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2_2'
            });

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


            // Website New Leads - Prospect Opportunity - Weekly Reporting
            var prospectOpportunityWeeklyReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2__3'
            });

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

                debt_set6.push({
                    dateUsed: startDate,
                    prospect_opportunity: prospectCount,
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
                        preview_row.prospect_opportunity,
                        preview_row.total_prospect_count
                        ]);

                    });
            }

            console.log('previewDataSet2: ' + previewDataSet2);

            var month_year = []; // creating array for storing browse

            var prospect_opportunity = [];
            var total_prospects_leads = [];

            for (var i = 0; i < previewDataSet2.length; i++) {
                month_year.push(previewDataSet2[i][0]);
                prospect_opportunity[previewDataSet2[i][0]] = previewDataSet2[i][1]
                total_prospects_leads[previewDataSet2[i][0]] = previewDataSet2[i][2]
            }

            var series_data143 = [];
            var series_data144 = [];

            var categores5 = []; // creating empty array for highcharts
            // categories
            Object.keys(prospect_opportunity).map(function (item, key) {

                series_data143.push(parseInt(total_prospects_leads[item]));
                series_data144.push(parseInt(prospect_opportunity[item]));
                categores5.push(item)
            });


            plotChartProspectsOpportunities(
                series_data143, series_data144, categores5);


            // Website New Leads - Suspects - Weekly Reporting
            var suspectsListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2__2'
            });

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

            total_customer_signed = 0;
            var countSuspects = 0;
            var oldSuspectsWeekLeadEntered = null;

            var total_suspect_count = 0;
            var suspect_new_count = 0;
            var suspect_hot_lead_count = 0;
            var suspect_reassign_count = 0;


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


            // Website New Leads - Suspects Lost - Weekly Reporting
            var suspectsLostBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2__4'
            });

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

            // Website New Leads - Suspects Off Peak Pipeline - Weekly Reporting
            var suspectsOffPeakPipelineBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2__5'
            });

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


            // Website New Leads - Suspects Out of Territory - Weekly Reporting
            var suspectsOOTBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2__6'
            });

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

            // Website New Leads - Suspects Follow Up - Weekly Reporting
            var suspectsFollowUpBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly_2__7'
            });

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



                debt_setSuspectsFollowUp.push({
                    dateUsed: startDate,
                    suspect_follow_up_count: customerCount
                });


                return true;
            });


            var suspectsFollowUpChartDatSet = [];
            if (!isNullorEmpty(debt_setSuspectsFollowUp)) {
                debt_setSuspectsFollowUp
                    .forEach(function (preview_row, index) {

                        suspectsFollowUpChartDatSet.push([preview_row.dateUsed,
                        preview_row.suspect_follow_up_count
                        ]);

                    });
            }


            console.log('SUSPECTS Follow Up GRAPH DATA: ' + suspectsFollowUpChartDatSet)

            var month_year_suspects_follow_up = []; // creating array for storing browser
            var suspect_follow_up_count = [];

            for (var i = 0; i < suspectsFollowUpChartDatSet.length; i++) {

                if (!isNullorEmpty(suspectsFollowUpChartDatSet[i][0])) {
                    month_year_suspects_follow_up.push(suspectsFollowUpChartDatSet[i][0]);
                    suspect_follow_up_count[suspectsFollowUpChartDatSet[i][0]] = suspectsFollowUpChartDatSet[i][1]
                }


            }

            var series_data90 = [];
            var series_data91 = [];


            var categores_suspects_follow_up = []; // creating empty array for highcharts
            // categories
            Object.keys(suspect_follow_up_count).map(function (item, key) {
                series_data90.push(parseInt(suspect_follow_up_count[item]));
                categores_suspects_follow_up.push(item)
            });


            plotChartSuspectsFollowUp(series_data90,
                categores_suspects_follow_up);

            // Website New Leads by Status - Weekly Reporting
            var leadsListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_weekly'
            });

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



                if (count1 == 0) {

                    if (custStatus == 13) {
                        //CUSTOMER _ SIGNED
                        customer_signed += parseInt(prospectCount);
                    } else if (custStatus == 57) {
                        //SUSPECT - HOT LEAD
                        suspect_hot_lead += parseInt(prospectCount);
                    } else if (custStatus == 59) {
                        //SUSPECT - LOST
                        suspect_lost += parseInt(prospectCount);
                    } else if (custStatus == 64) {
                        //SUSPECT - OUT OF TERRITORY
                        suspect_oot = parseInt(prospectCount);
                    } else if (custStatus == 22) {
                        //SUSPECT - CUSTOMER - LOST
                        suspect_customer_lost += parseInt(prospectCount);
                    } else if (custStatus == 60 || custStatus == 40) {
                        //SUSPECT - REP REASSIGN
                        suspect_reassign += parseInt(prospectCount);
                    } else if (custStatus == 50) {
                        //PROSPECT - QUOTE SENT
                        prospecy_quote_sent += parseInt(prospectCount);
                    } else if (custStatus == 35) {
                        //PROSPECT - NO ANSWER
                        prospect_no_answer += parseInt(prospectCount);
                    } else if (custStatus == 8) {
                        //PROSPECT - IN CONTACT
                        prospect_in_contact += parseInt(prospectCount);
                    } else if (custStatus == 62) {
                        //SUSPECT - OFF PEAK PIPELINE
                        suspect_off_peak_pipeline += parseInt(prospectCount);
                    } else if (custStatus == 58) {
                        //PROSPECT - OPPORTUNITY
                        prospect_opportunity += parseInt(prospectCount);
                    } else if (custStatus == 18) {
                        //SUSPECT - FOLLOW UP
                        suspect_follow_up += parseInt(prospectCount);
                    } else if (custStatus == 6) {
                        //SUSPECT - NEW
                        suspect_new += parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new

                } else if (oldDate1 != null &&
                    oldDate1 == startDate) {

                    if (custStatus == 13) {
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
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new

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
                        suspect_new: suspect_new
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
                    suspecy_new = 0;

                    total_leads = 0;

                    if (custStatus == 13) {
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
                        suspect_follow_up += parseInt(prospectCount);
                    } else if (custStatus == 6) {
                        //SUSPECT - NEW
                        suspect_new += parseInt(prospectCount);
                    }

                    total_leads = customer_signed +
                        suspect_hot_lead +
                        suspect_lost +
                        suspect_customer_lost +
                        suspect_reassign +
                        prospecy_quote_sent +
                        prospect_no_answer +
                        prospect_in_contact +
                        suspect_off_peak_pipeline + prospect_opportunity + suspect_oot + suspect_follow_up + suspect_new
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
                    suspect_new: suspect_new
                });
            }

            console.log('debt_set2: ' + debt_set2);

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


                        overDataSet.push([preview_row.dateUsed,
                        preview_row.suspect_new,
                        preview_row.suspect_hot_lead,
                        preview_row.prospecy_quote_sent,
                        preview_row.suspect_reassign,
                        preview_row.suspect_follow_up,
                        preview_row.prospect_no_answer,
                        preview_row.prospect_in_contact,
                        preview_row.suspect_off_peak_pipeline,
                        preview_row.suspect_lost,
                        preview_row.suspect_oot,
                        preview_row.suspect_customer_lost,
                        preview_row.prospect_opportunity,
                        preview_row.customer_signed,
                        preview_row.total_leads
                        ]);


                        previewDataSet.push([preview_row.dateUsed,
                            suspectNewCol,
                            hotLeadCol,
                            quoteSentCol,
                            reassignCol,
                            followUpCol,
                            noAnswerCol,
                            inContactCol,
                            offPeakCol,
                            lostCol,
                            ootCol,
                            custLostCol,
                            oppCol,
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
                    title: 'Period'
                }, {
                    title: 'Suspect - New'
                }, {
                    title: 'Suspect - Hot Lead'
                }, {
                    title: 'Prospect - Quote Sent'
                }, {
                    title: 'Suspect - Reassign'
                }, {
                    title: 'Suspect - Follow Up'
                }, {
                    title: 'Prospect - No answer'
                }, {
                    title: 'Prospect - In Contact'
                }, {
                    title: 'Suspect - Off Peak Pipeline'
                }, {
                    title: 'Suspect - Lost'
                }, {
                    title: 'Suspect - Out of Territory'
                }, {
                    title: 'Suspect - Customer - Lost'
                }, {
                    title: 'Prospect - Opportunity'
                }, {
                    title: 'Customer - Signed'
                }, {
                    title: 'Total Lead Count'
                }],
                columnDefs: [{
                    targets: [0, 12, 13, 14],
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

                    // Total Prospect Quoite Sent
                    total_prospect_quote_sent = api
                        .column(3)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Suspect Reassign
                    total_suspect_reassign = api
                        .column(4)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Suspect Follow Up
                    total_suspect_followup = api
                        .column(5)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total Prospect No Answer
                    total_prospect_no_answer = api
                        .column(6)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Prospect In Contact
                    total_prospect_in_contact = api
                        .column(7)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Suspect Off Peak Pipline
                    total_suspect_off_peak_pipeline = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Suspect Lost
                    total_suspect_lost = api
                        .column(9)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Suspect Out of Territory
                    total_suspect_oot = api
                        .column(10)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Suspect Customer Lost
                    total_suspect_customer_lost = api
                        .column(11)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Prospect Opportunity
                    total_prospect_opportunity = api
                        .column(12)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Customer Signed
                    total_customer_signed = api
                        .column(13)
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);


                    // Total Lead Count
                    total_lead = api
                        .column(14)
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
                        total_prospect_quote_sent + ' (' + ((total_prospect_quote_sent / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(4).footer()).html(
                        total_suspect_reassign + ' (' + ((total_suspect_reassign / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(5).footer()).html(
                        total_suspect_followup + ' (' + ((total_suspect_followup / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(6).footer()).html(
                        total_prospect_no_answer + ' (' + ((total_prospect_no_answer / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(7).footer()).html(
                        total_prospect_in_contact + ' (' + ((total_prospect_in_contact / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(8).footer()).html(
                        total_suspect_off_peak_pipeline + ' (' + ((total_suspect_off_peak_pipeline / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(9).footer()).html(
                        total_suspect_lost + ' (' + ((total_suspect_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(10).footer()).html(
                        total_suspect_oot + ' (' + ((total_suspect_oot / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(11).footer()).html(
                        total_suspect_customer_lost + ' (' + ((total_suspect_customer_lost / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(12).footer()).html(
                        total_prospect_opportunity + ' (' + ((total_prospect_opportunity / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(13).footer()).html(
                        total_customer_signed + ' (' + ((total_customer_signed / total_lead) * 100).toFixed(0) + '%)'
                    );
                    $(api.column(14).footer()).html(
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
            var total_leads = [];

            for (var i = 0; i < data.length; i++) {
                month_year.push(data[i][0]);
                suspect_new[data[i][0]] = data[i][1]
                customer_signed[data[i][0]] = data[i][13]
                suspect_hot_lead[data[i][0]] = data[i][2]
                suspect_reassign[data[i][0]] = data[i][4]
                suspect_follow_up[data[i][0]] = data[i][5]
                suspect_lost[data[i][0]] = data[i][9]
                suspect_oot[data[i][0]] = data[i][10]
                suspect_customer_lost[data[i][0]] = data[i][11]
                suspect_off_peak_pipeline[data[i][0]] = data[i][8]
                prospecy_quote_sent[data[i][0]] = data[i][3]
                prospect_no_answer[data[i][0]] = data[i][6]
                prospect_in_contact[data[i][0]] = data[i][7]
                prospect_opportunity[data[i][0]] = data[i][12]
                total_leads[data[i][0]] = data[i][14]
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
                series_data29, series_data31, series_data32, series_data33, series_data34, categores1)

            //Website Leads - Reporting
            var websiteLeadsReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting'
            });

            if (!isNullorEmpty(zee_id)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
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




            var count = 0;

            websiteLeadsReportingSearch.run().each(function (custListCommenceTodaySet) {

                var custInternalID = custListCommenceTodaySet.getValue({
                    name: 'internalid'
                });
                var custEntityID = custListCommenceTodaySet.getValue({
                    name: 'entityid'
                });
                var custName = custListCommenceTodaySet.getValue({
                    name: 'companyname'
                });
                var zeeID = custListCommenceTodaySet.getValue({
                    name: 'partner'
                });
                var zeeName = custListCommenceTodaySet.getText({
                    name: 'partner'
                });

                var custStage = (custListCommenceTodaySet.getText({
                    name: 'stage'
                })).toUpperCase();

                var custStatusId = custListCommenceTodaySet.getValue({
                    name: 'entitystatus'
                })

                var custStatus = custListCommenceTodaySet.getText({
                    name: 'entitystatus'
                }).toUpperCase();

                var dateLeadEntered = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_entered"
                });

                var quoteSentDate = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_quote_sent"
                });

                var dateLeadLost = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_lead_lost'
                });
                var dateLeadinContact = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_prospect_in_contact'
                });

                var dateProspectWon = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_prospect_opportunity'
                });

                var dateLeadReassigned = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_suspect_reassign'
                });

                var salesRepId = custListCommenceTodaySet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });
                var salesRepText = custListCommenceTodaySet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });

                var activityInternalID = custListCommenceTodaySet.getValue({
                    name: "internalid",
                    join: "activity"
                })
                var activityStartDate = custListCommenceTodaySet.getValue({
                    name: "startdate",
                    join: "activity",
                })
                var activityTitle = custListCommenceTodaySet.getValue({
                    name: "title",
                    join: "activity"
                })


                if (isNullorEmpty(custListCommenceTodaySet.getText({
                    name: "custevent_organiser",
                    join: "activity"
                }))) {
                    var activityOrganiser = custListCommenceTodaySet.getText({
                        name: "assigned",
                        join: "activity"
                    })
                } else {
                    var activityOrganiser = custListCommenceTodaySet.getText({
                        name: "custevent_organiser",
                        join: "activity"
                    })
                }


                var activityMessage = custListCommenceTodaySet.getValue({
                    name: "message",
                    join: "activity"
                })

                var email48h = custListCommenceTodaySet.getText({
                    name: 'custentity_48h_email_sent'
                });

                var daysOpen = custListCommenceTodaySet.getValue({
                    name: "formulanumeric",
                });

                var cancellationReason = custListCommenceTodaySet.getText({
                    name: "custentity_service_cancellation_reason",
                });

                var source = custListCommenceTodaySet.getText({
                    name: "leadsource",
                });

                var productWeeklyUsage = custListCommenceTodaySet.getText({
                    name: "custentity_form_mpex_usage_per_week",
                });

                var autoSignUp = custListCommenceTodaySet.getValue({
                    name: "custentity_auto_sign_up",
                });

                var previousCarrier = custListCommenceTodaySet.getText({
                    name: "custentity_previous_carrier",
                });

                var monthlyServiceValue = (custListCommenceTodaySet.getValue({
                    name: "custentity_cust_monthly_service_value",
                }));

                if (!isNullorEmpty(monthlyServiceValue)) {
                    monthlyServiceValue = parseFloat(monthlyServiceValue);
                } else {
                    monthlyServiceValue = 0.0;
                }


                if (!isNullorEmpty(dateLeadLost)) {
                    var dateLeadLostSplit = dateLeadLost.split('/');
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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
                } else {
                    // var dateLeadLostSplit = dateLeadLost.split('/');
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-OFF PEAK PIPELINE' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP') {
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
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
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
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-FOLLOW-UP') {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-OPPORTUNITY') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-OPPORTUNITY') {
                            prospectActivityCount++
                            prospectOpportunityChildDataSet.push({
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
                    }

                } else if (count > 0 && (oldcustInternalID == custInternalID)) {
                    if (!isNullorEmpty(activityTitle)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-OFF PEAK PIPELINE' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP') {
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
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
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
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-FOLLOW-UP') {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-OPPORTUNITY') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-OPPORTUNITY') {
                            prospectActivityCount++
                            prospectOpportunityChildDataSet.push({
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
                    }
                } else if (count > 0 && (oldcustInternalID != custInternalID)) {

                    if (oldcustStage == 'SUSPECT' && oldcustStatus != 'SUSPECT-CUSTOMER - LOST' && oldcustStatus != 'SUSPECT-OFF PEAK PIPELINE' && oldcustStatus != 'SUSPECT-LOST' && oldcustStatus != 'SUSPECT-OUT OF TERRITORY' && oldcustStatus != 'SUSPECT-FOLLOW-UP') {

                        // totalSuspectCount++;
                        // if (oldCustStatusId == 57) {
                        //     //SUSPECT - HOT LEAD
                        //     totalSuspectHotLeadCount++;
                        // } else if (oldCustStatusId == 6) {
                        //     //SUSPECT - NEW
                        //     // totalSuspect++
                        // } else if (oldCustStatusId == 22) {
                        //     SUSPECT - CUSTOMER - LOST
                        //     totalSuspectCustomerLostCount++
                        // } else if (oldcustStaoldCustStatusIdtus == 57) {
                        //     //SUSPECT - REP REASSIGN
                        //     totalSuspectRepReassign++;
                        // }

                        suspectDataSet.push(['',
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
                            suspectChildDataSet
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && (oldcustStatus == 'SUSPECT-CUSTOMER - LOST' || oldcustStatus == 'SUSPECT-LOST')) {

                        // totalSuspectCount++;
                        // if (oldcustStatus == 57) {
                        //     //SUSPECT - HOT LEAD
                        //     totalSuspectHotLeadCount++;
                        // } else if (oldcustStatus == 59) {
                        //     //SUSPECT - LOST
                        //     totalSuspectLostCount++
                        // } else if (oldcustStatus == 22) {
                        //     //SUSPECT - CUSTOMER - LOST
                        //     totalSuspectCustomerLostCount++
                        // } else if (oldcustStatus == 57) {
                        //     //SUSPECT - REP REASSIGN
                        //     totalSuspectRepReassign++;
                        // }

                        suspectLostDataSet.push(['',
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
                            suspectLostChildDataSet
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-OFF PEAK PIPELINE') {

                        // totalSuspectCount++;
                        // if (oldcustStatus == 57) {
                        //     //SUSPECT - HOT LEAD
                        //     totalSuspectHotLeadCount++;
                        // } else if (oldcustStatus == 59) {
                        //     //SUSPECT - LOST
                        //     totalSuspectLostCount++
                        // } else if (oldcustStatus == 22) {
                        //     //SUSPECT - CUSTOMER - LOST
                        //     totalSuspectCustomerLostCount++
                        // } else if (oldcustStatus == 57) {
                        //     //SUSPECT - REP REASSIGN
                        //     totalSuspectRepReassign++;
                        // }

                        suspectOffPeakDataSet.push(['',
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
                            suspectOffPeakChildDataSet
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-OUT OF TERRITORY') {

                        // totalSuspectCount++;
                        // if (oldcustStatus == 57) {
                        //     //SUSPECT - HOT LEAD
                        //     totalSuspectHotLeadCount++;
                        // } else if (oldcustStatus == 59) {
                        //     //SUSPECT - LOST
                        //     totalSuspectLostCount++
                        // } else if (oldcustStatus == 22) {
                        //     //SUSPECT - CUSTOMER - LOST
                        //     totalSuspectCustomerLostCount++
                        // } else if (oldcustStatus == 57) {
                        //     //SUSPECT - REP REASSIGN
                        //     totalSuspectRepReassign++;
                        // }

                        suspectOOTDataSet.push(['',
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
                            suspectOOTChildDataSet
                        ]);
                    } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-FOLLOW-UP') {

                        // totalSuspectCount++;
                        // if (oldcustStatus == 57) {
                        //     //SUSPECT - HOT LEAD
                        //     totalSuspectHotLeadCount++;
                        // } else if (oldcustStatus == 59) {
                        //     //SUSPECT - LOST
                        //     totalSuspectLostCount++
                        // } else if (oldcustStatus == 22) {
                        //     //SUSPECT - CUSTOMER - LOST
                        //     totalSuspectCustomerLostCount++
                        // } else if (oldcustStatus == 57) {
                        //     //SUSPECT - REP REASSIGN
                        //     totalSuspectRepReassign++;
                        // }

                        suspectFollowUpDataSet.push(['',
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
                            suspectFollowUpChildDataSet
                        ]);
                    } else if (oldcustStage == 'PROSPECT' && oldcustStatus != 'PROSPECT-OPPORTUNITY') {

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
                            prospectChildDataSet
                        ]);


                    } else if (oldcustStage == 'PROSPECT' && oldcustStatus == 'PROSPECT-OPPORTUNITY') {

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
                        prospectOpportunityDataSet.push(['',
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
                            prospectOpportunityChildDataSet
                        ]);


                    }
                    // else if (oldcustStage == 'CUSTOMER') {

                    //     totalCustomerCount++;

                    //     var express_speed = 0;
                    //     var standard_speed = 0;
                    //     var total_usage = 0;
                    //     if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                    //         // Customer Product Usage - Total MP Express & Standard
                    //         var mpexUsageResults = search.load({
                    //             type: 'customrecord_customer_product_stock',
                    //             id: 'customsearch6846'
                    //         });


                    //         mpexUsageResults.filters.push(search.createFilter({
                    //             name: 'internalid',
                    //             join: 'custrecord_cust_prod_stock_customer',
                    //             operator: search.Operator.ANYOF,
                    //             values: parseInt(oldcustInternalID)
                    //         }));

                    //         if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                    //             mpexUsageResults.filters.push(search.createFilter({
                    //                 name: 'custrecord_cust_date_stock_used',
                    //                 join: null,
                    //                 operator: search.Operator.ONORAFTER,
                    //                 values: usage_date_from
                    //             }));
                    //             mpexUsageResults.filters.push(search.createFilter({
                    //                 name: 'custrecord_cust_date_stock_used',
                    //                 join: null,
                    //                 operator: search.Operator.ONORBEFORE,
                    //                 values: usage_date_to
                    //             }));

                    //         }



                    //         mpexUsageResults.run().each(function (mpexUsageSet) {

                    //             var deliverySpeed = mpexUsageSet.getValue({
                    //                 name: 'custrecord_delivery_speed',
                    //                 summary: 'GROUP'
                    //             });
                    //             var deliverySpeedText = mpexUsageSet.getText({
                    //                 name: 'custrecord_delivery_speed',
                    //                 summary: 'GROUP'
                    //             });


                    //             var mpexUsage = parseInt(mpexUsageSet.getValue({
                    //                 name: 'name',
                    //                 summary: 'COUNT'
                    //             }));

                    //             if (deliverySpeed == 2 ||
                    //                 deliverySpeedText == '- None -') {
                    //                 express_speed += mpexUsage;
                    //             } else if (deliverySpeed == 1) {
                    //                 standard_speed += mpexUsage;
                    //             }
                    //             total_usage += express_speed + standard_speed;

                    //             return true;
                    //         });
                    //     }

                    //     console.log(oldcustName + 'MP Exp: ' + express_speed);
                    //     console.log(oldcustName + 'MP Std: ' + standard_speed);

                    //     var mpExpStdUsageLink =
                    //         '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + oldcustInternalID + '" target="_blank" style="color: white !important;">TOTAL USAGE</a></button>';

                    //     customerDataSet.push(['',
                    //         oldcustInternalID,
                    //         oldcustEntityID,
                    //         oldcustName,
                    //         oldzeeName,
                    //         oldSource,
                    //         oldProdWeeklyUsage,
                    //         oldPreviousCarrier,
                    //         express_speed,
                    //         standard_speed,
                    //         mpExpStdUsageLink,
                    //         olddateLeadEntered,
                    //         oldquoteSentDate,
                    //         oldemail48h,
                    //         olddateProspectWon,
                    //         oldDaysOpen,
                    //         oldMonthServiceValue,
                    //         oldsalesRepText,
                    //         oldAutoSignUp,
                    //         customerChildDataSet
                    //     ]);


                    // }

                    // customerChildDataSet = [];
                    prospectChildDataSet = [];
                    prospectOpportunityChildDataSet = [];
                    suspectChildDataSet = [];
                    suspectFollowUpChildDataSet = [];
                    suspectLostChildDataSet = [];
                    suspectOOTChildDataSet = [];
                    suspectOffPeakChildDataSet = [];

                    if (!isNullorEmpty(activityTitle)) {
                        if (custStage == 'SUSPECT' && custStatus != 'SUSPECT-CUSTOMER - LOST' && custStatus != 'SUSPECT-OFF PEAK PIPELINE' && custStatus != 'SUSPECT-LOST' && custStatus != 'SUSPECT-OUT OF TERRITORY' && custStatus != 'SUSPECT-FOLLOW-UP') {
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
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-OFF PEAK PIPELINE') {
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
                        } else if (custStage == 'SUSPECT' && custStatus == 'SUSPECT-FOLLOW-UP') {
                            suspectActivityCount++
                            suspectFollowUpChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus != 'PROSPECT-OPPORTUNITY') {
                            prospectActivityCount++
                            prospectChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            })
                        } else if (custStage == 'PROSPECT' && custStatus == 'PROSPECT-OPPORTUNITY') {
                            prospectActivityCount++
                            prospectOpportunityChildDataSet.push({
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
                count++
                return true;
            });

            if (count > 0) {

                if (oldcustStage == 'SUSPECT' && oldcustStatus != 'SUSPECT-CUSTOMER - LOST' && oldcustStatus != 'SUSPECT-OFF PEAK PIPELINE' && oldcustStatus != 'SUSPECT-LOST' && oldcustStatus != 'SUSPECT-OUT OF TERRITORY' && oldcustStatus != 'SUSPECT-FOLLOW-UP') {

                    // totalSuspectCount++;
                    // if (oldCustStatusId == 57) {
                    //     //SUSPECT - HOT LEAD
                    //     // totalSuspectHotLeadCount++;
                    // } else if (oldCustStatusId == 6) {
                    //     //SUSPECT - NEW
                    //     // totalSuspect++
                    // } else if (oldCustStatusId == 22) {
                    //     //SUSPECT - CUSTOMER - LOST
                    //     totalSuspectCustomerLostCount++
                    // } else if (oldcustStaoldCustStatusIdtus == 57) {
                    //     //SUSPECT - REP REASSIGN
                    //     totalSuspectRepReassign++;
                    // }

                    suspectDataSet.push(['',
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
                        suspectChildDataSet
                    ]);
                } else if (oldcustStage == 'SUSPECT' && (oldcustStatus == 'SUSPECT-CUSTOMER - LOST' || oldcustStatus == 'SUSPECT-LOST')) {

                    // totalSuspectCount++;
                    // if (oldcustStatus == 57) {
                    //     //SUSPECT - HOT LEAD
                    //     totalSuspectHotLeadCount++;
                    // } else if (oldcustStatus == 59) {
                    //     //SUSPECT - LOST
                    //     totalSuspectLostCount++
                    // } else if (oldcustStatus == 22) {
                    //     //SUSPECT - CUSTOMER - LOST
                    //     totalSuspectCustomerLostCount++
                    // } else if (oldcustStatus == 57) {
                    //     //SUSPECT - REP REASSIGN
                    //     totalSuspectRepReassign++;
                    // }

                    suspectLostDataSet.push(['',
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
                        suspectLostChildDataSet
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-OFF PEAK PIPELINE') {

                    // totalSuspectCount++;
                    // if (oldcustStatus == 57) {
                    //     //SUSPECT - HOT LEAD
                    //     totalSuspectHotLeadCount++;
                    // } else if (oldcustStatus == 59) {
                    //     //SUSPECT - LOST
                    //     totalSuspectLostCount++
                    // } else if (oldcustStatus == 22) {
                    //     //SUSPECT - CUSTOMER - LOST
                    //     totalSuspectCustomerLostCount++
                    // } else if (oldcustStatus == 57) {
                    //     //SUSPECT - REP REASSIGN
                    //     totalSuspectRepReassign++;
                    // }

                    suspectOffPeakDataSet.push(['',
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
                        suspectOffPeakChildDataSet
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-OUT OF TERRITORY') {

                    // totalSuspectCount++;
                    // if (oldcustStatus == 57) {
                    //     //SUSPECT - HOT LEAD
                    //     totalSuspectHotLeadCount++;
                    // } else if (oldcustStatus == 59) {
                    //     //SUSPECT - LOST
                    //     totalSuspectLostCount++
                    // } else if (oldcustStatus == 22) {
                    //     //SUSPECT - CUSTOMER - LOST
                    //     totalSuspectCustomerLostCount++
                    // } else if (oldcustStatus == 57) {
                    //     //SUSPECT - REP REASSIGN
                    //     totalSuspectRepReassign++;
                    // }

                    suspectOOTDataSet.push(['',
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
                        suspectOOTChildDataSet
                    ]);
                } else if (oldcustStage == 'SUSPECT' && oldcustStatus == 'SUSPECT-FOLLOW-UP') {

                    // totalSuspectCount++;
                    // if (oldcustStatus == 57) {
                    //     //SUSPECT - HOT LEAD
                    //     totalSuspectHotLeadCount++;
                    // } else if (oldcustStatus == 59) {
                    //     //SUSPECT - LOST
                    //     totalSuspectLostCount++
                    // } else if (oldcustStatus == 22) {
                    //     //SUSPECT - CUSTOMER - LOST
                    //     totalSuspectCustomerLostCount++
                    // } else if (oldcustStatus == 57) {
                    //     //SUSPECT - REP REASSIGN
                    //     totalSuspectRepReassign++;
                    // }

                    suspectFollowUpDataSet.push(['',
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
                        suspectFollowUpChildDataSet
                    ]);
                } else if (oldcustStage == 'PROSPECT' && oldcustStatus != 'PROSPECT-OPPORTUNITY') {

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
                        prospectChildDataSet
                    ]);

                } else if (oldcustStage == 'PROSPECT' && oldcustStatus == 'PROSPECT-OPPORTUNITY') {

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
                    prospectOpportunityDataSet.push(['',
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
                        prospectOpportunityChildDataSet
                    ]);


                }
                // else
                //     if (oldcustStage == 'CUSTOMER') {

                //     totalCustomerCount++;

                //     var express_speed = 0;
                //     var standard_speed = 0;
                //     var total_usage = 0;
                //     if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                //         // Customer Product Usage - Total MP Express & Standard
                //         var mpexUsageResults = search.load({
                //             type: 'customrecord_customer_product_stock',
                //             id: 'customsearch6846'
                //         });


                //         mpexUsageResults.filters.push(search.createFilter({
                //             name: 'internalid',
                //             join: 'custrecord_cust_prod_stock_customer',
                //             operator: search.Operator.ANYOF,
                //             values: parseInt(oldcustInternalID)
                //         }));

                //         if (!isNullorEmpty(usage_date_from) && !isNullorEmpty(usage_date_to)) {
                //             mpexUsageResults.filters.push(search.createFilter({
                //                 name: 'custrecord_cust_date_stock_used',
                //                 join: null,
                //                 operator: search.Operator.ONORAFTER,
                //                 values: usage_date_from
                //             }));
                //             mpexUsageResults.filters.push(search.createFilter({
                //                 name: 'custrecord_cust_date_stock_used',
                //                 join: null,
                //                 operator: search.Operator.ONORBEFORE,
                //                 values: usage_date_to
                //             }));

                //         }



                //         mpexUsageResults.run().each(function (mpexUsageSet) {

                //             var deliverySpeed = mpexUsageSet.getValue({
                //                 name: 'custrecord_delivery_speed',
                //                 summary: 'GROUP'
                //             });
                //             var deliverySpeedText = mpexUsageSet.getText({
                //                 name: 'custrecord_delivery_speed',
                //                 summary: 'GROUP'
                //             });


                //             var mpexUsage = parseInt(mpexUsageSet.getValue({
                //                 name: 'name',
                //                 summary: 'COUNT'
                //             }));

                //             if (deliverySpeed == 2 ||
                //                 deliverySpeedText == '- None -') {
                //                 express_speed += mpexUsage;
                //             } else if (deliverySpeed == 1) {
                //                 standard_speed += mpexUsage;
                //             }
                //             total_usage += express_speed + standard_speed;

                //             return true;
                //         });
                //     }

                //     console.log(oldcustName + 'MP Exp: ' + express_speed);
                //     console.log(oldcustName + 'MP Std: ' + standard_speed);

                //     var mpExpStdUsageLink =
                //         '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + oldcustInternalID + '" target="_blank" style="color: white !important;">TOTAL USAGE</a></button>';

                //     customerDataSet.push(['',
                //         oldcustInternalID,
                //         oldcustEntityID,
                //         oldcustName,
                //         oldzeeName,
                //         oldSource,
                //         oldProdWeeklyUsage,
                //         oldPreviousCarrier,
                //         express_speed,
                //         standard_speed,
                //         mpExpStdUsageLink,
                //         olddateLeadEntered,
                //         oldquoteSentDate,
                //         oldemail48h,
                //         olddateProspectWon,
                //         oldDaysOpen,
                //         oldMonthServiceValue,
                //         oldsalesRepText,
                //         oldAutoSignUp,
                //         customerChildDataSet
                //     ]);

                // }
            }


            //New Search:
            //Website Leads - Customer Signed - Reporting
            var websiteLeadsReportingSearch = search.load({
                type: 'customer',
                id: 'customsearch_leads_reporting_4'
            });

            if (!isNullorEmpty(zee_id)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_entered',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_to
                }));
            }

            if (!isNullorEmpty(date_signed_up_from) && !isNullorEmpty(date_signed_up_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_prospect_opportunity',
                    join: null,
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to
                }));
            }

            if (!isNullorEmpty(invoice_date_from) && !isNullorEmpty(invoice_date_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'trandate',
                    join: 'transaction',
                    operator: search.Operator.ONORAFTER,
                    values: invoice_date_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'trandate',
                    join: 'transaction',
                    operator: search.Operator.ONORBEFORE,
                    values: invoice_date_to
                }));
            }

            if (!isNullorEmpty(lead_source)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'leadsource',
                    join: null,
                    operator: search.Operator.IS,
                    values: lead_source
                }));
            }


            if (!isNullorEmpty(invoice_type)) {
                if (invoice_type == '2') {
                    websiteLeadsReportingSearch.filters.push(search.createFilter({
                        name: 'trandate',
                        join: 'transaction',
                        operator: search.Operator.ANYOF,
                        values: 8
                    }));
                } else if (invoice_type == '1') {
                    websiteLeadsReportingSearch.filters.push(search.createFilter({
                        name: 'custbody_inv_type',
                        join: 'transaction',
                        operator: search.Operator.ANYOF,
                        values: "@NONE@"
                    }));
                }

            }

            if (!isNullorEmpty(date_quote_sent_from) && !isNullorEmpty(date_quote_sent_to)) {
                websiteLeadsReportingSearch.filters.push(search.createFilter({
                    name: 'custentity_date_lead_quote_sent',
                    join: null,
                    operator: search.Operator.ONORAFTER,
                    values: date_quote_sent_from
                }));

                websiteLeadsReportingSearch.filters.push(search.createFilter({
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


            var count = 0;

            csvCustomerSignedExport = [];

            websiteLeadsReportingSearch.run().each(function (custListCommenceTodaySet) {

                var custInternalID = custListCommenceTodaySet.getValue({
                    name: 'internalid'
                });
                var custEntityID = custListCommenceTodaySet.getValue({
                    name: 'entityid'
                });
                var custName = custListCommenceTodaySet.getValue({
                    name: 'companyname'
                });
                var zeeID = custListCommenceTodaySet.getValue({
                    name: 'partner'
                });
                var zeeName = custListCommenceTodaySet.getText({
                    name: 'partner'
                });

                var custStage = (custListCommenceTodaySet.getText({
                    name: 'stage'
                })).toUpperCase();

                var custStatusId = custListCommenceTodaySet.getValue({
                    name: 'entitystatus'
                })

                var custStatus = custListCommenceTodaySet.getText({
                    name: 'entitystatus'
                }).toUpperCase();

                var dateLeadEntered = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_entered"
                });

                var quoteSentDate = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_quote_sent"
                });

                var dateLeadLost = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_lead_lost'
                });
                var dateLeadinContact = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_prospect_in_contact'
                });

                var dateProspectWon = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_prospect_opportunity'
                });

                var dateLeadReassigned = custListCommenceTodaySet.getValue({
                    name: 'custentity_date_suspect_reassign'
                });

                var salesRepId = custListCommenceTodaySet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });
                var salesRepText = custListCommenceTodaySet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });

                var invoiceDocumentNumber = custListCommenceTodaySet.getValue({
                    name: "tranid",
                    join: "transaction"
                })
                var invoiceDate = custListCommenceTodaySet.getValue({
                    name: "trandate",
                    join: "transaction",
                })
                var invoiceType = custListCommenceTodaySet.getText({
                    name: "custbody_inv_type",
                    join: "transaction"
                })

                var invoiceAmount = custListCommenceTodaySet.getValue({
                    name: "amount",
                    join: "transaction"
                })

                var invoiceStatus = custListCommenceTodaySet.getText({
                    name: "statusref",
                    join: "transaction"
                })

                var invoiceItem = custListCommenceTodaySet.getText({
                    name: "item",
                    join: "transaction"
                })

                var email48h = custListCommenceTodaySet.getText({
                    name: 'custentity_48h_email_sent'
                });

                var daysOpen = custListCommenceTodaySet.getValue({
                    name: "formulanumeric",
                });

                var cancellationReason = custListCommenceTodaySet.getText({
                    name: "custentity_service_cancellation_reason",
                });

                var source = custListCommenceTodaySet.getText({
                    name: "leadsource",
                });

                var productWeeklyUsage = custListCommenceTodaySet.getText({
                    name: "custentity_form_mpex_usage_per_week",
                });

                var autoSignUp = custListCommenceTodaySet.getValue({
                    name: "custentity_auto_sign_up",
                });

                var previousCarrier = custListCommenceTodaySet.getText({
                    name: "custentity_previous_carrier",
                });

                var monthlyServiceValue = (custListCommenceTodaySet.getValue({
                    name: "custentity_cust_monthly_service_value",
                }));

                var monthlyExtraServiceValue = (custListCommenceTodaySet.getValue({
                    name: "custentity_monthly_extra_service_revenue",
                }));

                if (source == 'Additional Services') {
                    monthlyServiceValue = parseFloat(monthlyExtraServiceValue);
                } 

                if (!isNullorEmpty(monthlyServiceValue)) {
                    monthlyServiceValue = parseFloat(monthlyServiceValue);
                } else {
                    monthlyServiceValue = 0.0;
                }

                



                // if (isNullorEmpty(invoiceDocumentNumber)) {
                //     invoiceDocumentNumber = 'N/A'
                // }

                // if (isNullorEmpty(invoiceDate)) {
                //     invoiceDate = 'N/A'
                // }

                if (isNullorEmpty(invoiceType)) {
                    invoiceType = 'Service'
                }

                // if (isNullorEmpty(invoiceAmount) || invoiceAmount.toString() == '.00') {
                //     invoiceAmount = 'N/A'
                // }

                console.log('invoiceDocumentNumber ' + invoiceDocumentNumber)
                console.log('invoiceDate ' + invoiceDate)
                console.log('invoiceType ' + invoiceType)
                console.log('invoiceAmount ' + invoiceAmount)
                console.log('invocieItem ' + invoiceItem)


                if (!isNullorEmpty(dateLeadLost)) {
                    var dateLeadLostSplit = dateLeadLost.split('/');
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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
                    var dateLeadEnteredSplit = dateLeadEntered.split('/');

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

                if (count == 0) {
                    // if (!isNullorEmpty(activityTitle)) {
                    //     if (custStage == 'CUSTOMER') {
                    //         customerActivityCount++
                    //         customerChildDataSet.push({
                    //             invoiceDocumentNumber: invoiceDocumentNumber,
                    //             invoiceDate: invoiceDate,
                    //             invoiceType: invoiceType,
                    //             invoiceAmount: invoiceAmount
                    //         })
                    //     }
                    // }

                    // if (invoiceDocumentNumber != 'Memorized' && parseFloat(invoiceAmount) > 0 && isNullorEmpty(invoiceItem)) {
                    //     invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                    // }

                } else if (count > 0 && (oldcustInternalID == custInternalID)) {

                    console.log('oldcustInternalID: ' + oldcustInternalID)
                    console.log('oldInvoiceNumber: ' + oldInvoiceNumber)
                    console.log('oldinvoiceDate: ' + oldinvoiceDate)
                    console.log('oldInvoiceType: ' + oldInvoiceType)
                    console.log('oldInvoiceAmount: ' + oldInvoiceAmount)

                    if (oldInvoiceNumber == invoiceDocumentNumber) {
                        // if (oldInvoiceNumber != 'Memorized' && parseFloat(oldInvoiceAmount) > 0 && isNullorEmpty(oldInvoiceItem)) {
                        //     invoiceTotal = invoiceTotal + parseFloat(oldInvoiceAmount);
                        // }
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

                        console.log('customerChildDataSet: ' + JSON.stringify(customerChildDataSet))

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

                        console.log('oldcustInternalID: ' + oldcustInternalID)
                        console.log('oldInvoiceNumber: ' + oldInvoiceNumber)
                        console.log('oldinvoiceDate: ' + oldinvoiceDate)
                        console.log('oldInvoiceType: ' + oldInvoiceType)
                        console.log('oldInvoiceAmount: ' + oldInvoiceAmount)

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

                        console.log('customerChildDataSet: ' + JSON.stringify(customerChildDataSet))



                        totalCustomerCount++;

                        var express_speed = 0;
                        var standard_speed = 0;
                        var total_usage = 0;
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

                        console.log(oldcustName + 'MP Exp: ' + express_speed);
                        console.log(oldcustName + 'MP Std: ' + standard_speed);

                        var mpExpStdUsageLink =
                            '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + oldcustInternalID + '" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

                        customerDataSet.push(['',
                            oldcustInternalID,
                            oldcustEntityID,
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

                oldInvoiceNumber = invoiceDocumentNumber;
                oldinvoiceDate = invoiceDate;
                oldInvoiceType = invoiceType;
                oldInvoiceAmount = invoiceAmount;
                oldInvoiceStatus = invoiceStatus;
                oldInvoiceItem = invoiceItem;

                if (oldInvoiceItem == 'Credit Card Surcharge') {
                    showInvoice = false;
                }

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

                    console.log(oldcustName + 'MP Exp: ' + express_speed);
                    console.log(oldcustName + 'MP Std: ' + standard_speed);

                    var mpExpStdUsageLink =
                        '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;padding-bottom: 40px !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + oldcustInternalID + '" target="_blank" style="color: white !important;">TOTAL </br> USAGE</a></button>';

                    customerDataSet.push(['',
                        oldcustInternalID,
                        oldcustEntityID,
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

            console.log('customerDataSet: ' + customerDataSet);
            console.log('csvCustomerSignedExport: ' + csvCustomerSignedExport);

            saveCustomerCsvPreview(csvCustomerSignedExport);

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
                    console.log(JSON.stringify(data[14]));
                    console.log(data[15].length);
                    if (data[5] == 'PROSPECT-OPPORTUNITY') {
                        $('td', row).css('background-color', '#ADCF9F');
                    } else if (isNullorEmpty(data[15]) && data[5] != 'PROSPECT-NO ANSWER') {
                        $('td', row).css('background-color', '#f9c67a');
                    } else if (!isNullorEmpty(data[15])) {
                        var row_color = '#f9c67a'
                        data[15].forEach(function (el) {
                            console.log(data[3]);
                            console.log(el.activityOrganiser);
                            if (!isNullorEmpty(el)) {
                                if (el.activityOrganiser == 'Kerina Helliwell' || el.activityOrganiser == 'David Gdanski' || el.activityOrganiser == 'Lee Russell' || el.activityOrganiser == 'Belinda Urbani') {
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
                data: prospectOpportunityDataSet,
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
                    console.log(JSON.stringify(data[15]));
                    console.log(data[15].length);
                    if (data[5] == 'PROSPECT-OPPORTUNITY') {
                        $('td', row).css('background-color', '#ADCF9F');
                    } else if (isNullorEmpty(data[15]) && data[5] != 'PROSPECT-NO ANSWER') {
                        $('td', row).css('background-color', '#f9c67a');
                    } else if (!isNullorEmpty(data[15])) {
                        var row_color = '#f9c67a'
                        data[15].forEach(function (el) {
                            console.log(data[3]);
                            console.log(el.activityOrganiser);
                            if (!isNullorEmpty(el)) {
                                if (el.activityOrganiser == 'Kerina Helliwell' || el.activityOrganiser == 'David Gdanski' || el.activityOrganiser == 'Lee Russell' || el.activityOrganiser == 'Belinda Urbani') {
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
                    console.log(JSON.stringify(data[18]));
                    console.log(data[18].length);

                    if (isNullorEmpty(data[18])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
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

            dataTable3.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild3(this)) // Add Child Tables
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
                    console.log(JSON.stringify(data[18]));
                    console.log(data[18].length);

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
                    console.log(JSON.stringify(data[18]));
                    console.log(data[18].length);

                    if (isNullorEmpty(data[18])) {
                        $('td', row).css('background-color', '#f9c67a');
                    }

                    if (data[5].toUpperCase() == 'SUSPECT-LOST' || data[5].toUpperCase() == 'SUSPECT-OUT OF TERRITORY') {
                        $('td', row).css('background-color', '#FF8787');
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

            dataTable6.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild3(this)) // Add Child Tables
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
                    console.log(JSON.stringify(data[18]));
                    console.log(data[18].length);

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
                    console.log(JSON.stringify(data[18]));
                    console.log(data[18].length);

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

        function loadDatatable(debt_rows, debt_rows2) {

            debtDataSet = [];
            csvSet = [];

            debtDataSet2 = [];
            csvSet2 = [];

            if (!isNullorEmpty(debt_rows)) {
                debt_rows.forEach(function (debt_row, index) {


                    var linkURL =
                        '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
                        debt_row.custInternalID +
                        '" href="https://1048144.app.netsuite.com/app/crm/calendar/task.nl?l=T&invitee=' +
                        debt_row.custInternalID + '&company=' + debt_row.custInternalID +
                        '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;">SCHEDULE DATE/TIME</a></button> <button class="form-control btn btn-xs btn-warning" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
                        debt_row.custInternalID +
                        '"  data-type="noanswer" class="noAnswer" style="cursor: pointer !important;color: white;">NO ANSWER</a></button> <button class="form-control btn btn-xs btn-danger" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
                        debt_row.custInternalID +
                        '" data-type="completed" class="2WeekCallCompletedModalPopUP" style="cursor: pointer !important;color: white;">LOST</a></button>';

                    var customerIDLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                        debt_row.custInternalID + '&whence=" target="_blank"><b>' +
                        debt_row.custEntityID + '</b></a>';

                    var sendSignUpEmail =
                        '<a data-id="' +
                        debt_row.custInternalID +
                        '" data-sales="' +
                        debt_row.salesRepId +
                        '" data-contact="' +
                        debt_row.contactid +
                        '" data-contactemail="' +
                        debt_row.contactEmail +
                        '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

                    var commDateSplit = debt_row.quoteSentDate.split('/');

                    var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
                        commDateSplit[0]);
                    var commDateParsed = format.parse({
                        value: commDate,
                        type: format.Type.DATE
                    });
                    var commDateFormatted = format.format({
                        value: commDate,
                        type: format.Type.DATE
                    });


                    var dateLeadEnteredSplit = debt_row.dateLeadEntered.split('/');

                    var dateLeadEnteredDate = new Date(dateLeadEnteredSplit[2], dateLeadEnteredSplit[1] - 1,
                        dateLeadEnteredSplit[0]);
                    var dateLeadEnteredDateParsed = format.parse({
                        value: dateLeadEnteredDate,
                        type: format.Type.DATE
                    });
                    var dateLeadEnteredDateFormatted = format.format({
                        value: dateLeadEnteredDate,
                        type: format.Type.DATE
                    });

                    debtDataSet.push([debt_row.custInternalID,
                        customerIDLink, debt_row.custName, debt_row.zeeName, debt_row.email48h, debt_row.salesRepText, dateLeadEnteredDateFormatted, commDateFormatted, debt_row.daysOpen
                    ]);
                });
            }

            var datatable = $('#mpexusage-customer').DataTable();
            datatable.clear();
            datatable.rows.add(debtDataSet);
            datatable.draw();

            if (!isNullorEmpty(debt_rows2)) {
                debt_rows2.forEach(function (debt_row2, index2) {

                    var month = debt_row2.dateUsed;
                    console.log(month);
                    var splitMonth = month.split('-');
                    var splitMonthV2 = month.split('/');

                    var formattedDate = dateISOToNetsuite(splitMonthV2[2] + '-' + splitMonthV2[1] + '-' + splitMonthV2[0]);

                    var parsedDate = format.parse({
                        value: month,
                        type: format.Type.DATE
                    });

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


                    var detailedInvoiceURLMonth =
                        '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1627&deploy=1&zee=' +
                        zee + '&start_date=' + monthsStartDate + '&last_date=' + lastDate +
                        '" target=_blank>VIEW (monthly)</a> | <a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1625&deploy=1&zee=' +
                        zee + '&start_date=' + startDate + '&last_date=' + lastDate +
                        '" target=_blank>VIEW (daily)</a>';


                    debtDataSet2.push([startDate,
                        debt_row2.lee_lead_count,
                        debt_row2.kerina_lead_count, debt_row2.david_lead_count, debt_row2.belinda_lead_count, debt_row2.total_usage
                    ]);
                });
            }

            var datatable2 = $('#mpexusage-preview').DataTable();
            datatable2.clear();
            datatable2.rows.add(debtDataSet2);
            datatable2.draw();

            var data = datatable2.rows().data();


            var month_year = [];
            var leeLeadCount = [];
            var kerinaLeadCount = [];
            var davidLeadCount = [];
            var belindaLeadCount = [];
            var totalUsage = [];

            for (var i = 0; i < data.length; i++) {
                month_year.push(data[i][0]);
                leeLeadCount[data[i][0]] = data[i][1];
                kerinaLeadCount[data[i][0]] = data[i][2];
                davidLeadCount[data[i][0]] = data[i][3];
                belindaLeadCount[data[i][0]] = data[i][4]; // creating
                totalUsage[data[i][0]] = data[i][5]; //

            }
            var count = {}; // creating object for getting categories with
            // count
            month_year.forEach(function (i) {
                count[i] = (count[i] || 0) + 1;
            });

            var series_data_lee = [];
            var series_data_kerina = [];
            var series_data_david = [];
            var series_data_belinda = [];
            var series_data_total = [];
            var categores = [];
            Object.keys(leeLeadCount).map(function (item, key) {
                series_data_lee.push(parseInt(leeLeadCount[item]));
                series_data_kerina.push(parseInt(kerinaLeadCount[item]));
                series_data_david.push(parseInt(davidLeadCount[item]));
                series_data_belinda.push(parseInt(belindaLeadCount[item]));
                series_data_total.push(parseInt(totalUsage[item]));
                categores.push(item)
            });
            plotChartSpeedUsage(series_data_lee, series_data_kerina, series_data_david, series_data_belinda, series_data_total, categores)

            return true;
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
            series_data29, series_data31, series_data32, series_data33, series_data34, categores) {
            // console.log(series_data)

            Highcharts.chart(
                'container_preview', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Website Leads - By Status - Week Entered'
                },
                xAxis: {
                    categories: categores,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    text: 'Prospects - Weekly Quote Sent / In Contact / No Answer'
                },
                xAxis: {
                    categories: categores5,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    text: 'Prospects - Weekly Opportunities'
                },
                xAxis: {
                    categories: categores5,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    text: 'Suspects - Hot Lead - Week Entered'
                },
                xAxis: {
                    categories: categores_suspects,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    text: 'Suspects - Lost - Week Entered'
                },
                xAxis: {
                    categories: categores_suspects_lost,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    name: 'Suspect - Lost',
                    data: series_data60,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Suspect - Customer -Lost',
                    data: series_data61,
                    color: '#E97777',
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
                    text: 'Suspects - Off Peak Pipeline - Week Entered'
                },
                xAxis: {
                    categories: categores_suspects_off_peak_pipeline,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    name: 'Suspect - Lost',
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
                    text: 'Suspects - Out of Territory - Week Entered'
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
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    name: 'Suspect - Out of Territory',
                    data: series_data80,
                    color: '#E97777',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartSuspectsFollowUp(series_data90, categores_suspects_follow_up) {
            // console.log(series_data)

            Highcharts.chart(
                'container_suspects_followup', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Suspects - Follow Up - Week Entered'
                },
                xAxis: {
                    categories: categores_suspects_follow_up,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                    name: 'Suspect - Follow Up',
                    data: series_data90,
                    color: '',
                    style: {
                        fontWeight: 'bold',
                    }
                }]
            });
        }

        function plotChartCustomerSigned(series_data30, series_data31,
            series_data32,
            series_data33,
            series_data34, series_data35, categores_customer_signed_week) {
            // console.log(series_data)

            Highcharts.chart(
                'container_customer', {
                chart: {
                    type: 'column',
                    backgroundColor: '#CFE0CE',
                }, title: {
                    text: 'Customer Signed by Source - Week Signed Up'
                },
                xAxis: {
                    categories: categores_customer_signed_week,
                    crosshair: true,
                    style: {
                        fontWeight: 'bold',
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total Lead Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Total Usage'
                        },
                        stackLabels: {
                            enabled: true,
                            style: {
                                fontWeight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
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

        /**
         * Load the string stored in the hidden field 'custpage_table_csv'.
         * Converts it to a CSV file.
         * Creates a hidden link to download the file and triggers the click of the link.
         */
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
            var filename = 'MPEX New Customer List_' + today + '.csv';
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);


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
                fieldId: 'custpage_table_csv',
                value: csv
            });


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

        function stateIDPublicHolidaysRecord(state) {
            switch (state) {
                case 1:
                    return 1; //NSW
                    break;
                case 2:
                    return 6; //QLD
                    break;
                case 3:
                    return 5; //VIC
                    break;
                case 4:
                    return 3; //SA
                    break;
                case 5:
                    return 7; //TAS
                    break;
                case 6:
                    return 4; //ACT
                    break;
                case 7:
                    return 2; //WA
                    break;
                case 8:
                    return 8; //NT
                    break;
                default:
                    return null;
                    break;
            }
        }

        function stateID(state) {
            state = state.toUpperCase();
            switch (state) {
                case 'ACT':
                    return 6
                    break;
                case 'NSW':
                    return 1
                    break;
                case 'NT':
                    return 8
                    break;
                case 'QLD':
                    return 2
                    break;
                case 'SA':
                    return 4
                    break;
                case 'TAS':
                    return 5
                    break;
                case 'VIC':
                    return 3
                    break;
                case 'WA':
                    return 7
                    break;
                default:
                    return 0;
                    break;
            }
        }
        /**
         * Sets the values of `date_from` and `date_to` based on the selected option in the '#period_dropdown'.
         */
        function selectDate() {
            var period_selected = $('#period_dropdown option:selected').val();
            var today = new Date();
            var today_day_in_month = today.getDate();
            var today_day_in_week = today.getDay();
            var today_month = today.getMonth();
            var today_year = today.getFullYear();

            var today_date = new Date(Date.UTC(today_year, today_month,
                today_day_in_month))

            switch (period_selected) {
                case "this_week":
                    // This method changes the variable "today" and sets it on the previous monday
                    if (today_day_in_week == 0) {
                        var monday = new Date(Date.UTC(today_year, today_month,
                            today_day_in_month - 6));
                    } else {
                        var monday = new Date(Date.UTC(today_year, today_month,
                            today_day_in_month - today_day_in_week + 1));
                    }
                    var date_from = monday.toISOString().split('T')[0];
                    var date_to = today_date.toISOString().split('T')[0];
                    break;

                case "last_week":
                    var today_day_in_month = today.getDate();
                    var today_day_in_week = today.getDay();
                    // This method changes the variable "today" and sets it on the previous monday
                    if (today_day_in_week == 0) {
                        var previous_sunday = new Date(Date.UTC(today_year, today_month,
                            today_day_in_month - 7));
                    } else {
                        var previous_sunday = new Date(Date.UTC(today_year, today_month,
                            today_day_in_month - today_day_in_week));
                    }

                    var previous_sunday_year = previous_sunday.getFullYear();
                    var previous_sunday_month = previous_sunday.getMonth();
                    var previous_sunday_day_in_month = previous_sunday.getDate();

                    var monday_before_sunday = new Date(Date.UTC(previous_sunday_year,
                        previous_sunday_month, previous_sunday_day_in_month - 6));

                    var date_from = monday_before_sunday.toISOString().split('T')[0];
                    var date_to = previous_sunday.toISOString().split('T')[0];
                    break;

                case "this_month":
                    var first_day_month = new Date(Date.UTC(today_year, today_month));
                    var date_from = first_day_month.toISOString().split('T')[0];
                    var date_to = today_date.toISOString().split('T')[0];
                    break;

                case "last_month":
                    var first_day_previous_month = new Date(Date.UTC(today_year,
                        today_month - 1));
                    var last_day_previous_month = new Date(Date.UTC(today_year,
                        today_month, 0));
                    var date_from = first_day_previous_month.toISOString().split('T')[
                        0];
                    var date_to = last_day_previous_month.toISOString().split('T')[0];
                    break;

                case "full_year":
                    var first_day_in_year = new Date(Date.UTC(today_year, 0));
                    var date_from = first_day_in_year.toISOString().split('T')[0];
                    var date_to = today_date.toISOString().split('T')[0];
                    break;

                case "financial_year":
                    if (today_month >= 6) {
                        var first_july = new Date(Date.UTC(today_year, 6));
                    } else {
                        var first_july = new Date(Date.UTC(today_year - 1, 6));
                    }
                    var date_from = first_july.toISOString().split('T')[0];
                    var date_to = today_date.toISOString().split('T')[0];
                    break;

                default:
                    var date_from = '';
                    var date_to = '';
                    break;
            }
            $('#date_from').val(date_from);
            $('#date_to').val(date_to);
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
        function downloadCustomerCsv() {

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
            adhocNewCustomers: adhocNewCustomers,
            downloadCustomerCsv: downloadCustomerCsv,
            addFilters: addFilters
        }
    });
