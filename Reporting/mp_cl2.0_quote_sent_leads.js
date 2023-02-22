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

        var invoiceType = null;

        var no_of_working_days = [];
        var invoiceTypeServices = [];
        var invoiceTypeMPEX = [];
        var invoiceTypeNeoPost = [];


        var customer_count_with_no_mpex_usage = [];
        var customer_count_with_mpex_usage = [];
        var customer_count_with_orange_mpex_usage = [];
        var customer_count_with_white_mpex_usage = [];
        var customer_count = 0;
        var uniqueArray = [];

        var total_revenue_per_state = [];

        var month;
        var weekdays_current_month;

        var total_months = 14;

        var today = new Date();
        var today_day_in_month = today.getDate();
        var today_day_in_week = today.getDay();
        var today_month = today.getMonth() + 1;
        var today_year = today.getFullYear();

        var lee_lead_count = 0;
        var kerina_lead_count = 0;
        var david_lead_count = 0;
        var belinda_lead_count = 0;
        var total_lead_count = 0;

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
            // duringSubmit();

            dataTable = $('#mpexusage-preview').DataTable({
                destroy: true,
                data: debtDataSet2,
                pageLength: 1000,
                order: [0],
                columns: [{
                    title: 'Calendar Week'
                }, {
                    title: 'Lee Russell'
                }, {
                    title: 'Kerina Helliwell'
                }, {
                    title: 'David Gdanski'
                }, {
                    title: 'Belinda Urbani'
                }, {
                    title: 'Total Lead Count'
                }],
                columnDefs: [{
                    targets: [0, 5],
                    className: 'bolded'
                }],
                rowCallback: function (row, data, index) { }
            });

            dataTable = $('#mpexusage-customer').DataTable({
                destroy: true,
                data: debtDataSet,
                pageLength: 1000,
                order: [8],
                columns: [{
                    title: 'Customer Internal ID'
                }, {
                    title: 'ID'
                }, {
                    title: 'Company Name'
                }, {
                    title: 'Franchisee'
                }, {
                    title: '48h Email Sent'
                }, {
                    title: 'Sales Rep Assigned'
                }, {
                    title: 'Date Lead Entered'
                }, {
                    title: 'Date Quote Sent'
                }, {
                    title: 'Days Open'
                }],
                columnDefs: [{
                    targets: [],
                    className: 'bolded'
                }],
                rowCallback: function (row, data, index) { }
            });

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
            //Website Leads - Prospect Quote Sent
            var custListCommenceTodayResults = search.load({
                type: 'customer',
                id: 'customsearch_web_leads_prosp_quote_sent'
            });

            if (!isNullorEmpty(zee_id)) {
                custListCommenceTodayResults.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            console.log('userId: ' + userId)

            if (!isNullorEmpty(userId) && role != 3) {
                custListCommenceTodayResults.filters.push(search.createFilter({
                    name: 'custrecord_salesrep',
                    join: 'custrecord_customer',
                    operator: search.Operator.IS,
                    values: userId
                }));
            }

            custListCommenceTodayResults.run().each(function (
                custListCommenceTodaySet) {

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

                var dateLeadEntered = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_entered"
                });

                var quoteSentDate = custListCommenceTodaySet.getValue({
                    name: "custentity_date_lead_quote_sent"
                });

                var email = custListCommenceTodaySet.getValue({
                    name: 'email'
                });
                var serviceEmail = custListCommenceTodaySet.getValue({
                    name: 'custentity_email_service'
                });

                var phone = custListCommenceTodaySet.getValue({
                    name: 'phone'
                });

                var salesRepId = custListCommenceTodaySet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });
                var salesRepText = custListCommenceTodaySet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });

                var daysOpen = custListCommenceTodaySet.getValue({
                    name: 'formulanumeric'
                });

                var contactid = custListCommenceTodaySet.getValue({
                    name: 'internalid',
                    join: 'contact'
                });

                var contactEmail = custListCommenceTodaySet.getValue({
                    name: 'email',
                    join: 'contact'
                });

                var email48h = custListCommenceTodaySet.getText({
                    name: 'custentity_48h_email_sent'
                });


                debt_set.push({
                    custInternalID: custInternalID,
                    custEntityID: custEntityID,
                    custName: custName,
                    zeeID: zeeID,
                    zeeName: zeeName,
                    dateLeadEntered: dateLeadEntered,
                    quoteSentDate: quoteSentDate,
                    daysOpen: daysOpen,
                    salesRepId: salesRepId,
                    salesRepText: salesRepText,
                    email48h: email48h
                });

                return true;
            });
            console.log(debt_set);


            // Website Leads - Prospect Quote Sent - Weekly
            var prospectListBySalesRepWeeklySearch = search.load({
                type: 'customer',
                id: 'customsearch_web_leads_prosp_quote_sen_3'
            });

            var count = 0;
            var oldDate = null;


            prospectListBySalesRepWeeklySearch.run().each(function (
                prospectListBySalesRepWeeklyResultSet) {


                var prospectCount = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: 'entityid',
                    summary: 'COUNT'
                }));
                var weekLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP",
                });
                var salesRepAssigned = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });
                var salesRepAssignedText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "GROUP",
                });

                console.log('prospectCount: ' + prospectCount);
                console.log('salesRepAssigned: ' + salesRepAssigned);
                console.log('total_lead_count: ' + total_lead_count);

                if (count == 0) {
                    if (salesRepAssigned == 668711) { //Lee
                        lee_lead_count = prospectCount;
                    } else if (salesRepAssigned == 696160) { //Kerina
                        kerina_lead_count = prospectCount;
                    } else if (salesRepAssigned == 690145) { //David
                        david_lead_count = prospectCount;
                    } else if (salesRepAssigned == 668712) { //Belinda
                        belinda_lead_count = prospectCount;
                    }
                    total_lead_count = lee_lead_count + kerina_lead_count + david_lead_count + belinda_lead_count
                    console.log('total_lead_count: ' + total_lead_count);

                } else if (oldDate != null &&
                    oldDate == weekLeadEntered) {

                    if (salesRepAssigned == 668711) { //Lee
                        lee_lead_count += prospectCount;
                    } else if (salesRepAssigned == 696160) { //Kerina
                        kerina_lead_count += prospectCount;
                    } else if (salesRepAssigned == 690145) { //David
                        david_lead_count += prospectCount;
                    } else if (salesRepAssigned == 668712) { //Belinda
                        belinda_lead_count += prospectCount;
                    }

                    total_lead_count = lee_lead_count + kerina_lead_count + david_lead_count + belinda_lead_count;
                    console.log('total_lead_count: ' + total_lead_count);

                } else if (oldDate != null &&
                    oldDate != weekLeadEntered) {

                    debt_set2.push({
                        dateUsed: oldDate,
                        lee_lead_count: lee_lead_count,
                        kerina_lead_count: kerina_lead_count,
                        david_lead_count: david_lead_count,
                        belinda_lead_count: belinda_lead_count,
                        total_usage: total_lead_count
                    });

                    lee_lead_count = 0;
                    kerina_lead_count = 0;
                    david_lead_count = 0;
                    belinda_lead_count = 0;
                    total_lead_count = 0;

                    if (salesRepAssigned == 668711) { //Lee
                        lee_lead_count = prospectCount;
                    } else if (salesRepAssigned == 696160) { //Kerina
                        kerina_lead_count = prospectCount;
                    } else if (salesRepAssigned == 690145) { //David
                        david_lead_count = prospectCount;
                    } else if (salesRepAssigned == 668712) { //Belinda
                        belinda_lead_count = prospectCount;
                    }
                    total_lead_count = lee_lead_count + kerina_lead_count + david_lead_count + belinda_lead_count
                }

                count++;
                oldDate = weekLeadEntered;
                return true;
            });
            console.log(debt_set2);

            if (count > 0) {
                debt_set2.push({
                    dateUsed: oldDate,
                    lee_lead_count: lee_lead_count,
                    kerina_lead_count: kerina_lead_count,
                    david_lead_count: david_lead_count,
                    belinda_lead_count: belinda_lead_count,
                    total_usage: total_lead_count
                });
            }

            loadDatatable(debt_set, debt_set2);
            debt_set = [];
            debt_set2 = [];

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
            downloadCsv: downloadCsv,
            addFilters: addFilters
        }
    });
