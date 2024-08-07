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

            var val1 = currentRecord.get();
            paramUserId = val1.getValue({
                fieldId: 'custpage_sales_rep_id'
            });

            $("#applyFilter").click(function () {

                userId = $('#user_dropdown option:selected').val();

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1657&deploy=1&user=" + userId;


                window.location.href = url;
            });





            debtDataSet = [];
            debt_set = [];

            debtDataSet2 = [];
            debt_set2 = [];

            /**
             *  Submit Button Function
             */
            $('#submit').click(function () {
                // Ajax request
                var fewSeconds = 10;
                var btn = $(this);
                btn.addClass('disabled');
                // btn.addClass('')
                // setTimeout(function () {
                //     btn.removeClass('disabled');
                // }, fewSeconds * 1000);

                debtDataSet = [];
                debt_set = [];

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

            /**
             *  Click for Instructions Section Collapse
             */
            $('.collapse').on('shown.bs.collapse', function () {
                $(".range_filter_section_top").css("padding-top", "500px");
            })
            $('.collapse').on('hide.bs.collapse', function () {
                $(".range_filter_section_top").css("padding-top", "0px");
            })

            $(".2WeekCallCompletedModalPopUP").click(function () {
                var customerInternalID = $(this).attr("data-custid");
                var commRegInternalID = $(this).attr("data-id");
                var salesRecordId = $(this).attr("data-salesrecord");
                var type = $(this).attr("data-type");
                console.log('inside modal')
                $("#customer_id").val(customerInternalID);
                $("#comm_reg_id").val(commRegInternalID);
                $("#sales_rec_id").val(salesRecordId);
                $("#type").val(type);
                $("#myModal").show();


            })

            $('.lost').click(function () {

                var customerInternalId = $(this).attr("data-id");
                var commRegInternalID = $(this).attr("data-commreg");
                var salesRecordId = $(this).attr("data-salesrecordid");

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });
                var time_now = format.parse({
                    value: date,
                    type: format.Type.TIMEOFDAY
                });

                var params = {
                    custid: parseInt(customerInternalId),
                    sales_record_id: parseInt(salesRecordId),
                    nosale: 'T',
                    id: 'customscript_sl_finalise_page',
                    deploy: 'customdeploy_sl_finalise_page'
                };
                params = JSON.stringify(params);


                var convertLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=744&deploy=1&custparam_params=' + params;


                window.location.href = convertLink;
            })

            $('.convert').click(function () {

                var customerInternalId = $(this).attr("data-id");
                var commRegInternalID = $(this).attr("data-commreg");
                var salesRecordId = $(this).attr("data-salesrecordid");

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });
                var time_now = format.parse({
                    value: date,
                    type: format.Type.TIMEOFDAY
                });

                var sales_record = record.load({
                    type: 'customrecord_sales',
                    id: salesRecordId
                });


                var comm_reg_record = record.load({
                    type: 'customrecord_commencement_register',
                    id: commRegInternalID
                });
                comm_reg_record.setValue({
                    fieldId: 'custrecord_salesrep',
                    value: userId
                });

                comm_reg_record.setValue({
                    fieldId: 'custrecord_commreg_sales_record',
                    value: salesRecordId
                });


                sales_record.setValue({
                    fieldId: 'custrecord_sales_day14call',
                    value: date_now
                });
                sales_record.setValue({
                    fieldId: 'custrecord_sales_commreg',
                    value: commRegInternalID
                });
                sales_record.setValue({
                    fieldId: 'custrecord_sales_lastcalldate',
                    value: date_now
                });


                comm_reg_record.save({
                    ignoreMandatoryFields: true
                });

                sales_record.save({
                    ignoreMandatoryFields: true
                });

                var params = {
                    custid: parseInt(customerInternalId),
                    salesrecordid: parseInt(salesRecordId),
                    salesrep: 'F',
                    sendemail: 'T',
                    closedwon: 'T',
                    oppwithvalue: 'F',
                    commreg: commRegInternalID,
                    customid: 'customscript_sl_send_email_module',
                    customdeploy: 'customdeploy_sl_send_email_module'
                }
                params = JSON.stringify(params);

                var convertLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=726&deploy=1&compid=1048144&custparam_params=' + params;


                window.location.href = convertLink;
            })

            $('.convertnofee').click(function () {

                var customerInternalId = $(this).attr("data-id");
                var commRegInternalID = $(this).attr("data-commreg");
                var salesRecordId = $(this).attr("data-salesrecordid");

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });
                var time_now = format.parse({
                    value: date,
                    type: format.Type.TIMEOFDAY
                });

                var sales_record = record.load({
                    type: 'customrecord_sales',
                    id: salesRecordId
                });


                var comm_reg_record = record.load({
                    type: 'customrecord_commencement_register',
                    id: commRegInternalID
                });
                comm_reg_record.setValue({
                    fieldId: 'custrecord_salesrep',
                    value: userId
                });

                comm_reg_record.setValue({
                    fieldId: 'custrecord_commreg_sales_record',
                    value: salesRecordId
                });


                sales_record.setValue({
                    fieldId: 'custrecord_sales_day14call',
                    value: date_now
                });
                sales_record.setValue({
                    fieldId: 'custrecord_sales_commreg',
                    value: commRegInternalID
                });
                sales_record.setValue({
                    fieldId: 'custrecord_sales_lastcalldate',
                    value: date_now
                });


                comm_reg_record.save({
                    ignoreMandatoryFields: true
                });

                sales_record.save({
                    ignoreMandatoryFields: true
                });

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1657&deploy=1";


                window.location.href = url;
            })

            $(".noanswer").click(function () {

                console.log('inside no answer')

                userId = $('#user_dropdown option:selected').val();
                var customerInternalId = $(this).attr("data-id");
                var salesrepid = $(this).attr("data-sales");
                var contactid = $(this).attr("data-contact");
                var contactEmail = $(this).attr("data-contactemail");
                var salesRecordId = $(this).attr("data-salesrecordid");

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });
                var time_now = format.parse({
                    value: date,
                    type: format.Type.TIMEOFDAY
                });

                var recSales = record.load({
                    type: 'customrecord_sales',
                    id: salesRecordId
                });

                var sales_campaign_name = recSales.getText({
                    fieldId: 'custrecord_sales_campaign'
                });

                var phoneCallRecord = record.create({
                    type: record.Type.PHONE_CALL
                });
                phoneCallRecord.setValue({
                    fieldId: 'assigned',
                    value: salesrepid
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_organiser',
                    value: salesrepid
                });
                phoneCallRecord.setValue({
                    fieldId: 'startdate',
                    value: date_now
                });
                phoneCallRecord.setValue({
                    fieldId: 'company',
                    value: customerInternalId
                });
                phoneCallRecord.setValue({
                    fieldId: 'status',
                    value: 'COMPLETE'
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_call_type',
                    value: 2
                });
                phoneCallRecord.setValue({
                    fieldId: 'title',
                    value: sales_campaign_name + ' - No Answer - Phone Call'
                });
                phoneCallRecord.setValue({
                    fieldId: 'message',
                    value: 'No answer'
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_call_outcome',
                    value: 6
                });

                phoneCallRecord.save({
                    ignoreMandatoryFields: true
                });




                var dateFirstNoContact = recSales.getValue({
                    fieldId: 'custrecord_sales_day0call'
                });
                var dateSecondNoContact = recSales.getValue({
                    fieldId: 'custrecord_sales_day14call'
                });
                var dateThirdNoContact = recSales.getValue({
                    fieldId: 'custrecord_sales_day25call'
                });




                if (isNullorEmpty(dateFirstNoContact)) {
                    recSales.setValue({
                        fieldId: 'custrecord_sales_day0call',
                        value: date_now
                    });
                } else if (!isNullorEmpty(dateFirstNoContact) && isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
                    recSales.setValue({
                        fieldId: 'custrecord_sales_day14call',
                        value: date_now
                    });
                } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
                    recSales.setValue({
                        fieldId: 'custrecord_sales_day25call',
                        value: date_now
                    });
                }


                recSales.setValue({
                    fieldId: 'custrecord_sales_completed',
                    value: false
                });

                recSales.setValue({
                    fieldId: 'custrecord_sales_inuse',
                    value: false
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_assigned',
                    value: salesrepid
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_outcome',
                    value: 7
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_attempt',
                    value: parseInt(recSales.getValue({
                        fieldId: 'custrecord_sales_attempt'
                    })) + 1
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_lastcalldate',
                    value: date_now
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_callbackdate',
                    value: date_now
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_callbacktime',
                    value: time_now
                });

                recSales.save({
                    ignoreMandatoryFields: true
                });

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1657&deploy=1";


                window.location.href = url;

            });

            $(".noresponse").click(function () {

                console.log('inside no response')

                userId = $('#user_dropdown option:selected').val();
                var customerInternalId = $(this).attr("data-id");
                var salesrepid = $(this).attr("data-sales");
                var contactid = $(this).attr("data-contact");
                var contactEmail = $(this).attr("data-contactemail");
                var salesRecordId = $(this).attr("data-salesrecordid");

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });
                var time_now = format.parse({
                    value: date,
                    type: format.Type.TIMEOFDAY
                });

                var recSales = record.load({
                    type: 'customrecord_sales',
                    id: salesRecordId
                });

                var sales_campaign_name = recSales.getText({
                    fieldId: 'custrecord_sales_campaign'
                });

                var phoneCallRecord = record.create({
                    type: record.Type.PHONE_CALL
                });
                phoneCallRecord.setValue({
                    fieldId: 'assigned',
                    value: salesrepid
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_organiser',
                    value: salesrepid
                });
                phoneCallRecord.setValue({
                    fieldId: 'startdate',
                    value: date_now
                });
                phoneCallRecord.setValue({
                    fieldId: 'company',
                    value: customerInternalId
                });
                phoneCallRecord.setValue({
                    fieldId: 'status',
                    value: 'COMPLETE'
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_call_type',
                    value: 2
                });
                phoneCallRecord.setValue({
                    fieldId: 'title',
                    value: sales_campaign_name + ' - No Response - Email'
                });
                phoneCallRecord.setValue({
                    fieldId: 'message',
                    value: 'No Response to email'
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_call_outcome',
                    value: 6
                });

                phoneCallRecord.save({
                    ignoreMandatoryFields: true
                });


                console.log('after phone call')

                var dateFirstNoContact = recSales.getValue({
                    fieldId: 'custrecord_sales_day0call'
                });
                var dateSecondNoContact = recSales.getValue({
                    fieldId: 'custrecord_sales_day14call'
                });
                var dateThirdNoContact = recSales.getValue({
                    fieldId: 'custrecord_sales_day25call'
                });




                if (isNullorEmpty(dateFirstNoContact)) {
                    recSales.setValue({
                        fieldId: 'custrecord_sales_day0call',
                        value: date_now
                    });
                } else if (!isNullorEmpty(dateFirstNoContact) && isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
                    recSales.setValue({
                        fieldId: 'custrecord_sales_day14call',
                        value: date_now
                    });
                } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
                    recSales.setValue({
                        fieldId: 'custrecord_sales_day25call',
                        value: date_now
                    });
                }


                recSales.setValue({
                    fieldId: 'custrecord_sales_completed',
                    value: false
                });

                recSales.setValue({
                    fieldId: 'custrecord_sales_inuse',
                    value: false
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_assigned',
                    value: salesrepid
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_outcome',
                    value: 7
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_attempt',
                    value: parseInt(recSales.getValue({
                        fieldId: 'custrecord_sales_attempt'
                    })) + 1
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_lastcalldate',
                    value: date_now
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_callbackdate',
                    value: date_now
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_callbacktime',
                    value: time_now
                });

                recSales.save({
                    ignoreMandatoryFields: true
                });

                console.log('after sales record')


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1657&deploy=1";


                window.location.href = url;

            });

            //Display the modal on click of the link on the table and prefill the fields  based on the customer record
            $("#customerOnboardingCompleted").click(function () {

                console.log('inside modal')
                var customerInternalID = $("#customer_id").val();
                var commRegInternalID = $("#comm_reg_id").val();
                var salesRecordId = $("#sales_rec_id").val();
                var type = $("#type").val();

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalID,
                    isDynamic: true
                  });
          
                  customer_record.setValue({
                    fieldId: 'custentity_mpex_custocustentity_mp_product_trackingmer',
                    value: 2
                  });
                  
                  var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                  });
          
                  var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=' +
                    zee +
                    '&start_date=&last_date=&user_id=' +
                    userId
                  window.location.href = url;


                var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1657&deploy=1';
                window.location.href = url;

            });

            //On click of close icon in the modal
            $('.close').click(function () {
                $("#myModal").hide();
            });

            //Update the customer record on click of the button in the modal
            $('#updateCustomer').click(function () {
                var customer_id = $("#customer_id").val();

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customer_id,
                    isDynamic: true
                });

                var mpex_customer = customer_record.setValue({
                    fieldId: 'custentity_mpex_customer',
                    value: $("#mpex_customer").val()
                });
                var expected_usage = customer_record.setValue({
                    fieldId: 'custentity_exp_mpex_weekly_usage',
                    value: $("#exp_usage").val()
                });

                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });

                var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=' +
                    zee +
                    '&start_date=&last_date=&user_id=' +
                    userId
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
            // duringSubmit();

            dataTable = $('#mpexusage-customers').DataTable({
                destroy: true,
                data: debtDataSet,
                pageLength: 1000,
                order: [[5, 'asc']],
                columns: [{
                    title: 'LINK'
                }, {
                    title: 'Customer Internal ID'
                }, {
                    title: 'ID'
                }, {
                    title: 'Company Name'
                }, {
                    title: 'Franchisee'
                }, {
                    title: 'Commencement Date'
                }, {
                    title: 'Email'
                }, {
                    title: 'Phone Number'
                }, {
                    title: 'Sales Rep'
                }, {
                    title: 'Services of Interest'
                }, {
                    title: 'MP Product Usage/Week'
                }, {
                    title: 'MP Express Usage'
                }, {
                    title: 'MP Standard Usage'
                }, {
                    title: 'Total MP Express & Standard Usage'
                }, {
                    title: 'Track Usage'
                }],
                columnDefs: [{
                    targets: [2, 3, 4, 5, 8, 10, 11, 12, 13],
                    className: 'bolded'
                }],
                rowCallback: function (row, data, index) {

                    var commDateArray = data[5].split('-');
                    var date7Days = new Date(commDateArray[0], commDateArray[1] - 1, commDateArray[2])
                    var dateAfter7Days = date7Days;
                    dateAfter7Days.setDate(date7Days.getDate() + 7);

                    var date10Days = new Date(commDateArray[0], commDateArray[1] - 1, commDateArray[2])

                    var dateAfter10Days = date10Days;
                    dateAfter10Days.setDate(date10Days.getDate() + 10);

                    var date14Days = new Date(commDateArray[0], commDateArray[1] - 1, commDateArray[2])

                    var dateAfter14Days = date14Days;
                    dateAfter14Days.setDate(date14Days.getDate() + 14);

                    var today = new Date();
                    if (today >= dateAfter14Days) {
                        $('td', row).css('background-color', '#F7A4A4');
                    } else if (today >= dateAfter10Days) {
                        $('td', row).css('background-color', '#FEBE8C');
                    } else if (today >= dateAfter7Days) {
                        $('td', row).css('background-color', '#FFFBC1');
                    }
                }
            });

            dataTable = $('#mpexusage-tracking').DataTable({
                destroy: true,
                data: debtDataSet2,
                pageLength: 1000,
                order: [[5, 'asc']],
                columns: [{
                    title: 'LINK'
                }, {
                    title: 'Customer Internal ID'
                }, {
                    title: 'ID'
                }, {
                    title: 'Company Name'
                }, {
                    title: 'Franchisee'
                }, {
                    title: 'Commencement Date'
                }, {
                    title: 'Email'
                }, {
                    title: 'Phone Number'
                }, {
                    title: 'Sales Rep'
                }, {
                    title: 'Services of Interest'
                }, {
                    title: 'MP Product Usage/Week'
                }, {
                    title: 'MP Express Usage'
                }, {
                    title: 'MP Standard Usage'
                }, {
                    title: 'Total MP Express & Standard Usage'
                }, {
                    title: 'Track Usage'
                }],
                columnDefs: [{
                    targets: [2, 3, 4, 5, 8, 10, 11, 12, 13],
                    className: 'bolded'
                }],
                rowCallback: function (row, data, index) {

                    // var commDateArray = data[5].split('-');
                    // var date7Days = new Date(commDateArray[0], commDateArray[1] - 1, commDateArray[2])
                    // var dateAfter7Days = date7Days;
                    // dateAfter7Days.setDate(date7Days.getDate() + 7);

                    // var date10Days = new Date(commDateArray[0], commDateArray[1] - 1, commDateArray[2])

                    // var dateAfter10Days = date10Days;
                    // dateAfter10Days.setDate(date10Days.getDate() + 10);

                    // var date14Days = new Date(commDateArray[0], commDateArray[1] - 1, commDateArray[2])

                    // var dateAfter14Days = date14Days;
                    // dateAfter14Days.setDate(date14Days.getDate() + 14);

                    // var today = new Date();
                    // if (today >= dateAfter14Days) {
                    //     $('td', row).css('background-color', '#F7A4A4');
                    // } else if (today >= dateAfter10Days) {
                    //     $('td', row).css('background-color', '#FEBE8C');
                    // } else if (today >= dateAfter7Days) {
                    //     $('td', row).css('background-color', '#FFFBC1');
                    // }
                }
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
            //New Customers - Auto Signed Up
            var custListCommenceTodayResults = search.load({
                type: 'customer',
                id: 'customsearch_new_customers_auto_signed_2'
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

            if (!isNullorEmpty(paramUserId)) {
                custListCommenceTodayResults.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: paramUserId
                }));
            } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
                custListCommenceTodayResults.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
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

                var servicesOfInterest = custListCommenceTodaySet.getText({
                    name: 'custentity_services_of_interest'
                });
                var productUsageperWeek = custListCommenceTodaySet.getText({
                    name: 'custentity_form_mpex_usage_per_week'
                });

                var commRegInternalID = custListCommenceTodaySet.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_CUSTOMER"
                });

                var salesRecordInternalId = custListCommenceTodaySet.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });

                var salesRepId = custListCommenceTodaySet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });


                var salesRepName = custListCommenceTodaySet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });


                var commDate = custListCommenceTodaySet.getValue({
                    name: 'custrecord_comm_date',
                    join: 'CUSTRECORD_CUSTOMER'
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

                // Customer Product Usage - Total MP Express & Standard
                var mpexUsageResults = search.load({
                    type: 'customrecord_customer_product_stock',
                    id: 'customsearch6846'
                });


                mpexUsageResults.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custrecord_cust_prod_stock_customer',
                    operator: search.Operator.ANYOF,
                    values: parseInt(custInternalID)
                }));


                var count = 0;
                var oldDate = null;
                var express_speed = 0;
                var standard_speed = 0;
                var total_usage = 0;
                mpexUsageResults.run().each(function (mpexUsageSet) {

                    // var dateUsed = mpexUsageSet.getValue({
                    //     name: 'custrecord_cust_date_stock_used',
                    //     summary: 'GROUP'
                    // });


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

                    // if (count == 0) {
                    //     if (deliverySpeed == 2 ||
                    //         deliverySpeedText == '- None -') {
                    //         express_speed = mpexUsage;
                    //     } else if (deliverySpeed == 1) {
                    //         standard_speed = mpexUsage;
                    //     }
                    //     total_usage = express_speed + standard_speed;

                    // } else if (oldDate != null &&
                    //     oldDate == dateUsed) {

                    //     if (deliverySpeed == 2 ||
                    //         deliverySpeedText == '- None -') {
                    //         express_speed += mpexUsage;
                    //     } else if (deliverySpeed == 1) {
                    //         standard_speed += mpexUsage;
                    //     }
                    //     total_usage += express_speed + standard_speed;

                    // } else if (oldDate != null &&
                    //     oldDate != dateUsed) {



                    // }

                    count++;
                    // oldDate = dateUsed;
                    return true;
                });

                if (count > 0) {

                }

                debt_set.push({
                    custInternalID: custInternalID,
                    custEntityID: custEntityID,
                    custName: custName,
                    zeeID: zeeID,
                    zeeName: zeeName,
                    commRegInternalID: commRegInternalID,
                    commDate: commDate,
                    email: email,
                    serviceEmail: serviceEmail,
                    phone: phone,
                    salesRepId: salesRepId,
                    salesRepName: salesRepName,
                    servicesOfInterest: servicesOfInterest,
                    productUsageperWeek: productUsageperWeek,
                    express_speed: express_speed,
                    standard_speed: standard_speed,
                    total_usage: total_usage,
                    salesRecordInternalId: salesRecordInternalId
                });

                return true;
            });
            console.log(debt_set)


            //New Customers - Auto Signed Up - Tracking Required (Sales Rep View)
            var custListTrackingSearch = search.load({
                type: 'customer',
                id: 'customsearch_new_customers_auto_signed_5'
            });

            if (!isNullorEmpty(zee_id)) {
                custListTrackingSearch.filters.push(search.createFilter({
                    name: 'partner',
                    join: null,
                    operator: search.Operator.IS,
                    values: zee_id
                }));
            }

            console.log('userId: ' + userId)

            if (!isNullorEmpty(paramUserId)) {
                custListTrackingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: paramUserId
                }));
            } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
                custListTrackingSearch.filters.push(search.createFilter({
                    name: 'custrecord_sales_assigned',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.IS,
                    values: userId
                }));
            }

            custListTrackingSearch.run().each(function (
                custListTrackingSearchResultSet) {

                var custInternalID = custListTrackingSearchResultSet.getValue({
                    name: 'internalid'
                });
                var custEntityID = custListTrackingSearchResultSet.getValue({
                    name: 'entityid'
                });
                var custName = custListTrackingSearchResultSet.getValue({
                    name: 'companyname'
                });
                var zeeID = custListTrackingSearchResultSet.getValue({
                    name: 'partner'
                });
                var zeeName = custListTrackingSearchResultSet.getText({
                    name: 'partner'
                });

                var servicesOfInterest = custListTrackingSearchResultSet.getText({
                    name: 'custentity_services_of_interest'
                });
                var productUsageperWeek = custListTrackingSearchResultSet.getText({
                    name: 'custentity_form_mpex_usage_per_week'
                });

                var commRegInternalID = custListTrackingSearchResultSet.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_CUSTOMER"
                });

                var salesRecordInternalId = custListTrackingSearchResultSet.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });

                var salesRepId = custListTrackingSearchResultSet.getValue({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });


                var salesRepName = custListTrackingSearchResultSet.getText({
                    name: 'custrecord_sales_assigned',
                    join: 'CUSTRECORD_SALES_CUSTOMER'
                });


                var commDate = custListTrackingSearchResultSet.getValue({
                    name: 'custrecord_comm_date',
                    join: 'CUSTRECORD_CUSTOMER'
                });

                var email = custListTrackingSearchResultSet.getValue({
                    name: 'email'
                });
                var serviceEmail = custListTrackingSearchResultSet.getValue({
                    name: 'custentity_email_service'
                });

                var phone = custListTrackingSearchResultSet.getValue({
                    name: 'phone'
                });

                // Customer Product Usage - Total MP Express & Standard
                var mpexUsageResults = search.load({
                    type: 'customrecord_customer_product_stock',
                    id: 'customsearch6846'
                });


                mpexUsageResults.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custrecord_cust_prod_stock_customer',
                    operator: search.Operator.ANYOF,
                    values: parseInt(custInternalID)
                }));


                var count = 0;
                var oldDate = null;
                var express_speed = 0;
                var standard_speed = 0;
                var total_usage = 0;
                mpexUsageResults.run().each(function (mpexUsageSet) {

                    // var dateUsed = mpexUsageSet.getValue({
                    //     name: 'custrecord_cust_date_stock_used',
                    //     summary: 'GROUP'
                    // });


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

                    // if (count == 0) {
                    //     if (deliverySpeed == 2 ||
                    //         deliverySpeedText == '- None -') {
                    //         express_speed = mpexUsage;
                    //     } else if (deliverySpeed == 1) {
                    //         standard_speed = mpexUsage;
                    //     }
                    //     total_usage = express_speed + standard_speed;

                    // } else if (oldDate != null &&
                    //     oldDate == dateUsed) {

                    //     if (deliverySpeed == 2 ||
                    //         deliverySpeedText == '- None -') {
                    //         express_speed += mpexUsage;
                    //     } else if (deliverySpeed == 1) {
                    //         standard_speed += mpexUsage;
                    //     }
                    //     total_usage += express_speed + standard_speed;

                    // } else if (oldDate != null &&
                    //     oldDate != dateUsed) {



                    // }

                    count++;
                    // oldDate = dateUsed;
                    return true;
                });

                if (count > 0) {

                }

                debt_set2.push({
                    custInternalID: custInternalID,
                    custEntityID: custEntityID,
                    custName: custName,
                    zeeID: zeeID,
                    zeeName: zeeName,
                    commRegInternalID: commRegInternalID,
                    commDate: commDate,
                    email: email,
                    serviceEmail: serviceEmail,
                    phone: phone,
                    salesRepId: salesRepId,
                    salesRepName: salesRepName,
                    servicesOfInterest: servicesOfInterest,
                    productUsageperWeek: productUsageperWeek,
                    express_speed: express_speed,
                    standard_speed: standard_speed,
                    total_usage: total_usage,
                    salesRecordInternalId: salesRecordInternalId
                });

                return true;
            });
            console.log(debt_set2)

            loadDatatable(debt_set, debt_set2);
            debt_set = [];

        }

        function loadDatatable(debt_rows, debt_rows2) {

            debtDataSet = [];
            csvSet = [];

            debtDataSet2 = [];
            csvSet2 = [];

            if (!isNullorEmpty(debt_rows)) {
                debt_rows.forEach(function (debt_row, index) {




                    var linkURL =
                        '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1900&deploy=1&compid=1048144&callCenter=T&customerId=' + debt_row.custInternalID + '&salesRecordId=' + debt_row.salesRecordInternalId +
                        '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;">CALL CENTER</a></button></br></br><input type="button" id="" class="form-control btn btn-xs btn-success convert" data-id="' +
                        debt_row.custInternalID +
                        '" data-salesrecordid="' + debt_row.salesRecordInternalId + '" data-sales="' +
                        debt_row.salesRepId +
                        '" data-commreg="' +
                        debt_row.commRegInternalID +
                        '"  value="CONVERT"  style="cursor: pointer !important;width: fit-content;" /> </br></br><input type="button" id="" class="form-control btn btn-xs btn-danger lost" data-id="' +
                        debt_row.custInternalID +
                        '" data-salesrecordid="' + debt_row.salesRecordInternalId + '" data-sales="' +
                        debt_row.salesRepId +
                        '" data-commreg="' +
                        debt_row.commRegInternalID +
                        '"  value="LOST"  style="cursor: pointer !important;width: fit-content;" /></br></br><input type="button" id="" class="form-control btn btn-xs btn-warning noanswer" data-id="' +
                        debt_row.custInternalID +
                        '" data-salesrecordid="' + debt_row.salesRecordInternalId + '" data-sales="' +
                        debt_row.salesRepId +
                        '" value="NO ANSWER - PHONE CALL"  style="color: black; cursor: pointer !important;width: fit-content;" />    <input type="button" id="" class="form-control btn btn-xs btn-warning noresponse" value="NO RESPONSE - EMAIL" data-id="' +
                        debt_row.custInternalID +
                        '" data-salesrecordid="' + debt_row.salesRecordInternalId + '" data-sales="' +
                        debt_row.salesRepId +
                        '" style="color: black; cursor: pointer !important;width: fit-content;" />  ';




                    var customerIDLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                        debt_row.custInternalID + '&whence=" target="_blank"><b>' +
                        debt_row.custEntityID + '</b></a>';

                    var mpExpStdUsageLink =
                        '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + debt_row.custInternalID + '" target="_blank" style="color: white !important;">TOTAL USAGE</a></button>';

                    // var commDateSplit = debt_row.commDate.split('/');

                    // var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
                    //     commDateSplit[0]);
                    // var commDateParsed = format.parse({
                    //     value: commDate,
                    //     type: format.Type.DATE
                    // });
                    // var commDateFormatted = format.format({
                    //     value: commDate,
                    //     type: format.Type.DATE
                    // });

                    var commDateSplit = debt_row.commDate.split('/');

                    if (parseInt(commDateSplit[1]) < 10) {
                        commDateSplit[1] = '0' + commDateSplit[1]
                    }

                    if (parseInt(commDateSplit[0]) < 10) {
                        commDateSplit[0] = '0' + commDateSplit[0]
                    }

                    commDateFormatted = commDateSplit[2] + '-' + commDateSplit[1] + '-' +
                        commDateSplit[0];


                    debtDataSet.push([linkURL, debt_row.custInternalID,
                        customerIDLink,
                        debt_row.custName, debt_row.zeeName,
                        commDateFormatted, debt_row.serviceEmail,
                        debt_row.phone, debt_row.salesRepName, debt_row.servicesOfInterest, debt_row.productUsageperWeek, debt_row.express_speed, debt_row.standard_speed, debt_row.total_usage, mpExpStdUsageLink
                    ]);
                });
            }

            var datatable = $('#mpexusage-customers').DataTable();
            datatable.clear();
            datatable.rows.add(debtDataSet);
            datatable.draw();


            if (!isNullorEmpty(debt_rows2)) {
                debt_rows2.forEach(function (debt_row2, index) {


                    var linkURL =
                        '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;"><a data-custid="' +
                        debt_row2.custInternalID +
                        '" data-id="' +
                        debt_row2.commRegInternalID +
                        '" data-sales_rec_id="' +
                        debt_row2.salesRecordInternalId +
                        '" data-type="completed" class="2WeekCallCompletedModalPopUP" style="cursor: pointer !important;color: white;">COMPLETED</a></button>';




                    var customerIDLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                        debt_row2.custInternalID + '&whence=" target="_blank"><b>' +
                        debt_row2.custEntityID + '</b></a>';

                    var mpExpStdUsageLink =
                        '<button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;background-color: #095C7B !important;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1676&deploy=1&custid=' + debt_row2.custInternalID + '" target="_blank" style="color: white !important;">TOTAL USAGE</a></button>';

                    // var commDateSplit = debt_row.commDate.split('/');

                    // var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
                    //     commDateSplit[0]);
                    // var commDateParsed = format.parse({
                    //     value: commDate,
                    //     type: format.Type.DATE
                    // });
                    // var commDateFormatted = format.format({
                    //     value: commDate,
                    //     type: format.Type.DATE
                    // });

                    var commDateSplit = debt_row2.commDate.split('/');

                    if (parseInt(commDateSplit[1]) < 10) {
                        commDateSplit[1] = '0' + commDateSplit[1]
                    }

                    if (parseInt(commDateSplit[0]) < 10) {
                        commDateSplit[0] = '0' + commDateSplit[0]
                    }

                    commDateFormatted = commDateSplit[2] + '-' + commDateSplit[1] + '-' +
                        commDateSplit[0];


                    debtDataSet2.push([linkURL, debt_row2.custInternalID,
                        customerIDLink,
                        debt_row2.custName, debt_row2.zeeName,
                        commDateFormatted, debt_row2.serviceEmail,
                        debt_row2.phone, debt_row2.salesRepName, debt_row2.servicesOfInterest, debt_row2.productUsageperWeek, debt_row2.express_speed, debt_row2.standard_speed, debt_row2.total_usage, mpExpStdUsageLink
                    ]);
                });
            }

            var datatable2 = $('#mpexusage-tracking').DataTable();
            datatable2.clear();
            datatable2.rows.add(debtDataSet2);
            datatable2.draw();

            return true;
        }

        function plotChartV2(series_data, series_data3_v2, categores) {
            // console.log(series_data)
            Highcharts.chart('container', {
                chart: {
                    type: 'column',
                    height: (6 / 16 * 100) + '%',
                    backgroundColor: '#CFE0CE',
                    zoomType: 'xy'
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
                        text: 'Customer Count'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        }
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
                    name: 'No Usage',
                    data: series_data,
                    color: '#d59696',
                    style: {
                        fontWeight: 'bold',
                    }
                }, {
                    name: 'Avg Weekly Usage < than 45% of Expected Weekly Usage',
                    data: series_data3_v2,
                    color: '#c9750d80',
                    style: {
                        fontWeight: 'bold',
                    }
                }
                    // {
                    //   name: 'Avg Weekly Usage >= 45% of Expected Usage & Avg Weekly Usage < Expected Weekly Usage',
                    //   data: series_data4_v2,
                    //   color: '#fff',
                    //   style: {
                    //     fontWeight: 'bold',
                    //   }
                    // }
                ]
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


        function saveRecord() { }

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
