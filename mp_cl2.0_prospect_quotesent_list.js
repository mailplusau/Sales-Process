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
            $('.instruction_div').removeClass('hide');
            $('.show_buttons_section').removeClass('hide');
            $('.zee_available_buttons_section').removeClass('hide');
            $('.cust_filter_section').removeClass('hide');
            $('.cust_dropdown_section').removeClass('hide');
            $('.status_dropdown_section').removeClass('hide');
            $('.cust_dropdown_section').removeClass('hide');
            $('.date_filter_section').removeClass('hide');
            $('.tabs_section').removeClass('hide');
            $('.customer').removeClass('hide');
            $('.zee_dropdown_section').removeClass('hide');
            $('.parent_lpo_section').removeClass('hide');
            $('.lead_entered_label_section').removeClass('hide');
            $('.lead_entered_div').removeClass('hide');
            $('.modified_date_div').removeClass('hide');

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

        var paramUserId = null;
        var salesCampaign = null;
        var custStatus = null;
        var source = null;
        var parentLPOInternalId = null;
        var date_from = null;
        var date_to = null;

        function showAlert(message) {
            $('#alert').html('<button type="button" class="close">&times;</button>' +
                message);
            $('#alert').removeClass('hide');
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0;
            // $(window).scrollTop($('#alert').offset().top);
        }


        function pageInit() {

            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");
            $("#dt-search-0").css("background-color", "#ffffff");
            // $('#alert').hide();

            $('.ui.dropdown').dropdown();

            $(document).ready(function () {
                $('.js-example-basic-multiple').select2();
            });


            var val1 = currentRecord.get();
            paramUserId = val1.getValue({
                fieldId: 'custpage_sales_rep_id'
            });
            salesCampaign = val1.getValue({
                fieldId: 'custpage_sales_campaign'
            });
            custStatus = val1.getValue({
                fieldId: 'custpage_cust_status'
            });
            source = val1.getValue({
                fieldId: 'custpage_cust_source'
            });
            parentLPOInternalId = val1.getValue({
                fieldId: 'custpage_cust_lpoid'
            });

            date_to = val1.getValue({
                fieldId: 'custpage_sales_date_from'
            });

            date_to = val1.getValue({
                fieldId: 'custpage_sales_date_to'
            });

            date_from = $('#date_from').val();
            date_from = dateISOToNetsuite(date_from);

            date_to = $('#date_to').val();
            date_to = dateISOToNetsuite(date_to);

            // if (isNullorEmpty(paramUserId)) {
            //     paramUserId = userId
            // }

            debtDataSet = [];
            debt_set = [];

            debtDataSet2 = [];
            debt_set2 = [];

            debtDataSet3 = [];
            debt_set3 = [];

            debtDataSet4 = [];
            debt_set4 = [];

            debtDataSetValidated = [];
            debt_set_validated = [];

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

                debtDataSet = [];
                debt_set = [];

                beforeSubmit();
                submitSearch();

                return true;
            });


            $(document).on('click', '#alert .close', function (e) {
                $('#alert').addClass('hide');
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

                userId = $('#user_dropdown option:selected').val();
                salesCampaign = $('#sales_campaign').val();
                custStatus = $('#cust_status option:selected').val();
                source = $('#lead_source option:selected').val();
                parentLPOInternalId = $('#parent_lpo').val();
                zee = $('#zee_dropdown').val();

                var date_from = $('#date_from').val();
                var date_to = $('#date_to').val();


                if (isNullorEmpty(custStatus) || custStatus == 0) {
                    showAlert('Please select a Stage');
                    return false;
                }

                if (isNullorEmpty(date_from)) {
                    showAlert('Please select a Date Lead Entered From');
                    return false;
                }

                if (isNullorEmpty(date_to)) {
                    showAlert('Please select a Date Lead Entered To');
                    return false;
                }


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1&user=" + userId + '&campaign=' + salesCampaign + '&status=' + custStatus + '&source=' + source + '&zee=' + zee + '&lpoid=' + parentLPOInternalId + "&start_date=" + date_from + "&last_date=" + date_to;


                window.location.href = url;
            });

            $(".page_number").click(function () {

                var page_number = $(this).attr("data-id");
                console.log('page_number: ' + page_number)

                userId = $('#user_dropdown option:selected').val();
                salesCampaign = $('#sales_campaign').val();
                custStatus = $('#cust_status option:selected').val();
                source = $('#lead_source option:selected').val();
                parentLPOInternalId = $('#parent_lpo').val();
                zee = $('#zee_dropdown').val();

                var date_from = $('#date_from').val();
                var date_to = $('#date_to').val();

                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1&user=" + userId + '&campaign=' + salesCampaign + '&status=' + custStatus + "&source=" + source + "&page_no=" + page_number + '&lpoid=' + parentLPOInternalId + "&start_date=" + date_from + "&last_date=" + date_to + '&zee=' + zee

                window.location.href = url;

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
                var customerInternalId = $(this).attr("data-id");
                console.log('inside modal')
                $("#customerInternalID").val(customerInternalId);

                $("#myModal").show();

                return false;

            })

            $(".noAnswer").click(function () {
                var customerInternalId = $(this).attr("data-id");

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 35
                });

                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });

                var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1659&deploy=1';
                window.location.href = url;

                return false;

            });

            $(".lost").click(function () {
                var customerInternalId = $(this).attr("data-id");


                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 59
                });

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });

                customer_record.setValue({
                    fieldId: 'custentity_date_lead_lost',
                    value: date_now
                });


                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });


                var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1659&deploy=1';
                window.location.href = url;

                return false;
            });

            $(".notalead").click(function () {
                var customerInternalId = $(this).attr("data-id");


                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 59
                });

                customer_record.setValue({
                    fieldId: 'custentity_service_cancellation_reason',
                    value: 40
                });

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });

                customer_record.setValue({
                    fieldId: 'custentity_date_lead_lost',
                    value: date_now
                });


                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });


                var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1659&deploy=1';
                window.location.href = url;

                return false;
            });

            $(".sendEmail").click(function () {
                var customerInternalId = $(this).attr("data-id");
                var salesrepid = $(this).attr("data-sales");
                var contactid = $(this).attr("data-contact");
                var contactEmail = $(this).attr("data-contactemail");
                var salesRecordId = $(this).attr("data-salesrecordid");

                var val1 = currentRecord.get();

                val1.setValue({
                    fieldId: 'custpage_customer_id',
                    value: customerInternalId
                });

                val1.setValue({
                    fieldId: 'custpage_sales_rep_id',
                    value: salesrepid
                });

                val1.setValue({
                    fieldId: 'custpage_contact_id',
                    value: contactid
                });

                val1.setValue({
                    fieldId: 'custpage_contact_email',
                    value: contactEmail
                });

                val1.setValue({
                    fieldId: 'custpage_salesrecordid',
                    value: salesRecordId
                });

                $('#submitter').trigger('click');

            });

            $(".noanswer").click(function () {

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

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 35
                });

                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";


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

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 35
                });

                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";


                window.location.href = url;

            });

            $(".noanswerrespone").click(function () {

                console.log('inside no noanswerrespone')

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
                    value: sales_campaign_name + ' - No Answer or Response'
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

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 35
                });

                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });


                var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";


                window.location.href = url;

            });

            $('.salesrepassign').click(function () {

                var customerInternalId = $(this).attr("data-id");


                var convertLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=535&deploy=1&compid=1048144&recid=' + parseInt(customerInternalId);


                window.location.href = convertLink;
            })

            $(".lostnoresponse").click(function () {

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
                    value: sales_campaign_name + ' - Lost - No Response'
                });
                phoneCallRecord.setValue({
                    fieldId: 'message',
                    value: 'No answer'
                });
                phoneCallRecord.setValue({
                    fieldId: 'custevent_call_outcome',
                    value: 3
                });

                phoneCallRecord.save({
                    ignoreMandatoryFields: true
                });



                recSales.setValue({
                    fieldId: 'custrecord_sales_completed',
                    value: true
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
                    value: 10
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_attempt',
                    value: parseInt(recSales.getValue({
                        fieldId: 'custrecord_sales_attempt'
                    })) + 1
                });
                recSales.setValue({
                    fieldId: 'custrecord_sales_completedate',
                    value: date_now
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

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 59
                });
                customer_record.setValue({
                    fieldId: 'custentity_service_cancellation_reason',
                    value: 41
                });
                customer_record.setValue({
                    fieldId: 'custentity13',
                    value: date_now
                });

                customer_record.setValue({
                    fieldId: 'custentity_date_lead_lost',
                    value: date_now
                });

                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });

                var val1 = currentRecord.get();

                val1.setValue({
                    fieldId: 'custpage_lostnoresponse',
                    value: 'true'
                });

                val1.setValue({
                    fieldId: 'custpage_customer_id',
                    value: customerInternalId
                });

                val1.setValue({
                    fieldId: 'custpage_sales_rep_id',
                    value: salesrepid
                });

                val1.setValue({
                    fieldId: 'custpage_contact_id',
                    value: contactid
                });

                val1.setValue({
                    fieldId: 'custpage_contact_email',
                    value: contactEmail
                });

                val1.setValue({
                    fieldId: 'custpage_salesrecordid',
                    value: salesRecordId
                });

                $('#submitter').trigger('click');


                // var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";


                // window.location.href = url;

            });

            // //Display the modal on click of the link on the table and prefill the fields  based on the customer record
            $("#customerOnboardingCompleted").click(function () {

                console.log('inside modal')
                var customerInternalId = $("#customerInternalID").val();
                var service_cancellation_reason = $('.service_cancellation_reason').val();

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                customer_record.setValue({
                    fieldId: 'entitystatus',
                    value: 59
                });

                var date = new Date();
                var date_now = format.parse({
                    value: date,
                    type: format.Type.DATE
                });

                customer_record.setValue({
                    fieldId: 'custentity13',
                    value: date_now
                });

                customer_record.setValue({
                    fieldId: 'custentity_date_lead_lost',
                    value: date_now
                });

                customer_record.setValue({
                    fieldId: 'custentity_service_cancellation_reason',
                    value: service_cancellation_reason
                });


                var customerRecordId = customer_record.save({
                    ignoreMandatoryFields: true
                });


                var url = baseURL +
                    '/app/site/hosting/scriptlet.nl?script=1659&deploy=1';
                window.location.href = url;

                return false

            });

            //On click of close icon in the modal
            $('.close').click(function () {
                $("#myModal").hide();
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

            dataTable = $('#mpexusage-prospects').DataTable({
                destroy: true,
                data: debtDataSet,
                scrollCollapse: true,
                // scrollY: '200px',
                pageLength: 1000,
                order: [[12, 'des']],
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
                    defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>', //0
                }, {
                    title: 'LINK' //1
                }, {
                    title: 'Customer Internal ID' //2
                }, {
                    title: 'ID' //3
                }, {
                    title: 'Company Name' //4
                }, {
                    title: 'Franchisee' //5
                }, {
                    title: 'Status' //6
                }, {
                    title: 'Source' //7
                }, {
                    title: 'Linked LPO' //8
                }, {
                    title: 'Contact Name' //9
                }, {
                    title: 'Email' //10
                }, {
                    title: 'Phone Number' //11
                }, {
                    title: 'Date Quote Sent' //12
                }, {
                    title: '48h Email Sent' //13
                }, {
                    title: 'Sales Rep Assigned' //14
                }, {
                    title: 'Date - 1st No Answer' //15
                }, {
                    title: 'Date - 2nd No Answer' //16
                }, {
                    title: 'Date - 3rd No Answer' //17
                }, {
                    title: 'Color Code' //18
                }, {
                    title: 'MP Product Usage/Week' //19
                }, {
                    title: 'Send Sign Up Email' //20
                }, {
                    title: 'Child' //21
                }],
                columnDefs: [{
                    targets: [3, 4, 5, 6, 7, 8, 12, 13, 14],
                    className: 'bolded'
                }, {
                    targets: [2, 15, 16, 17, 18, 19, 20, 21],
                    visible: false
                }, {
                    targets: [0, 1],
                    className: 'col-xs-2'
                }],
                rowCallback: function (row, data, index) {
                    // if (!isNullorEmpty(data[10])) {
                    if (isNullorEmpty(data[15])) {
                        // $('td', row).css('background-color', '#FFFBC1');
                    } else if (!isNullorEmpty(data[15]) && isNullorEmpty(data[16]) && isNullorEmpty(data[17])) {
                        $('td', row).css('background-color', '#FEBE8C');
                    } else if (!isNullorEmpty(data[15]) && !isNullorEmpty(data[16]) && isNullorEmpty(data[17])) {
                        $('td', row).css('background-color', '#F7A4A4');
                    } else if (!isNullorEmpty(data[15]) && !isNullorEmpty(data[16]) && !isNullorEmpty(data[17])) {
                        $('td', row).css('background-color', '#E64848');
                    }
                    // }

                }
            });

            // dataTable = $('#mpexusage-opportunities').DataTable({
            //     destroy: true,
            //     data: debtDataSet2,
            //     pageLength: 1000,
            //     order: [[12, 'des']],
            //     layout: {
            //         topStart: {
            //             buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
            //         }
            //     },
            //     columns: [{
            //         title: 'Expand',
            //         className: 'dt-control',
            //         orderable: false,
            //         data: null,
            //         // defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>', //0
            //     }, {
            //         title: 'LINK' //1
            //     }, {
            //         title: 'Customer Internal ID' //2
            //     }, {
            //         title: 'ID' //3
            //     }, {
            //         title: 'Company Name' //4
            //     }, {
            //         title: 'Franchisee' //5
            //     }, {
            //         title: 'Status' //6
            //     }, {
            //         title: 'Source' //7
            //     }, {
            //         title: 'Linked LPO' //8
            //     }, {
            //         title: 'Contact Name' //9
            //     }, {
            //         title: 'Email' //10
            //     }, {
            //         title: 'Phone Number' //11
            //     }, {
            //         title: 'Date Quote Sent' //12
            //     }, {
            //         title: '48h Email Sent' //13
            //     }, {
            //         title: 'Sales Rep Assigned' //14
            //     }, {
            //         title: 'Date - 1st No Answer' //15
            //     }, {
            //         title: 'Date - 2nd No Answer' //16
            //     }, {
            //         title: 'Date - 3rd No Answer' //17
            //     }, {
            //         title: 'MP Product Usage/Week' //18
            //     }, {
            //         title: 'Send Sign Up Email' //19
            //     }, {
            //         title: 'Child' //20
            //     }],
            //     columnDefs: [{
            //         targets: [3, 4, 5, 6, 7, 12, 13, 14],
            //         className: 'bolded'
            //     }, {
            //         targets: [2, 15, 16, 17, 19, 20],
            //         visible: false
            //     }, {
            //         targets: [0, 1],
            //         className: 'col-xs-2'
            //     }],
            //     rowCallback: function (row, data, index) {
            //         // if (!isNullorEmpty(data[10])) {
            //         //     if (isNullorEmpty(data[12])) {
            //         $('td', row).css('background-color', '#ADCF9F');
            //         //     } else if (!isNullorEmpty(data[12]) && isNullorEmpty(data[13]) && isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#FEBE8C');
            //         //     } else if (!isNullorEmpty(data[12]) && !isNullorEmpty(data[13]) && isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#F7A4A4');
            //         //     } else if (!isNullorEmpty(data[12]) && isNullorEmpty(data[13]) && !isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#E64848');
            //         //     }
            //         // }

            //     }
            // });

            // dataTable = $('#mpexusage-followups').DataTable({
            //     destroy: true,
            //     data: debtDataSet3,
            //     pageLength: 1000,
            //     order: [[12, 'des']],
            //     layout: {
            //         topStart: {
            //             buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
            //         }
            //     },
            //     columns: [{
            //         title: 'Expand',
            //         className: 'dt-control',
            //         orderable: false,
            //         data: null,
            //         // defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>', //0
            //     }, {
            //         title: 'LINK' //1
            //     }, {
            //         title: 'Customer Internal ID' //2
            //     }, {
            //         title: 'ID' //3
            //     }, {
            //         title: 'Company Name' //4
            //     }, {
            //         title: 'Franchisee' //5
            //     }, {
            //         title: 'Status' //6
            //     }, {
            //         title: 'Source' //7
            //     }, {
            //         title: 'Linked LPO' //8
            //     }, {
            //         title: 'Contact Name' //9
            //     }, {
            //         title: 'Email' //10
            //     }, {
            //         title: 'Phone Number' //11
            //     }, {
            //         title: 'Date Quote Sent' //12
            //     }, {
            //         title: '48h Email Sent' //13
            //     }, {
            //         title: 'Sales Rep Assigned' //14
            //     }, {
            //         title: 'Date - 1st No Answer' //15
            //     }, {
            //         title: 'Date - 2nd No Answer' //16
            //     }, {
            //         title: 'Date - 3rd No Answer' //17
            //     }, {
            //         title: 'MP Product Usage/Week' //18
            //     }, {
            //         title: 'Send Sign Up Email' //19
            //     }, {
            //         title: 'Child' //20
            //     }],
            //     columnDefs: [{
            //         targets: [3, 4, 5, 6, 7, 8, 12, 13, 14],
            //         className: 'bolded'
            //     }, {
            //         targets: [2, 15, 16, 17, 19, 20],
            //         visible: false
            //     }, {
            //         targets: [0, 1],
            //         className: 'col-xs-2'
            //     }],
            //     rowCallback: function (row, data, index) {
            //         // if (!isNullorEmpty(data[10])) {
            //         //     if (isNullorEmpty(data[12])) {
            //         // $('td', row).css('background-color', '#ADCF9F');
            //         //     } else if (!isNullorEmpty(data[12]) && isNullorEmpty(data[13]) && isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#FEBE8C');
            //         //     } else if (!isNullorEmpty(data[12]) && !isNullorEmpty(data[13]) && isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#F7A4A4');
            //         //     } else if (!isNullorEmpty(data[12]) && isNullorEmpty(data[13]) && !isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#E64848');
            //         //     }
            //         // }

            //     }
            // });

            dataTable = $('#mpexusage-suspects').DataTable({
                destroy: true,
                data: debtDataSet4,
                pageLength: 1000,
                scrollCollapse: true,
                // scrollY: '200px',
                order: [[2, 'asc']],
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
                    defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>', //0
                }, {
                    title: 'LINK' //1
                }, {
                    title: 'Date Lead Entered' //2
                }, {
                    title: 'Customer Internal ID' //3
                }, {
                    title: 'ID' //4
                }, {
                    title: 'Company Name' //5
                }, {
                    title: 'Franchisee' //6
                }, {
                    title: 'Status' //7
                }, {
                    title: 'Source' //8
                }, {
                    title: 'Linked LPO' //9
                }, {
                    title: 'Contact Name' //10
                }, {
                    title: 'Email' //11
                }, {
                    title: 'Phone Number' //12
                }, {
                    title: 'Services of Interest' //13
                }, {
                    title: 'Sales Rep Assigned' //14
                }, {
                    title: 'Date - 1st No Answer' //15
                }, {
                    title: 'Date - 2nd No Answer' //16
                }, {
                    title: 'Date - 3rd No Answer' //17
                }, {
                    title: 'MP Product Usage/Week' //18
                }, {
                    title: 'Send Sign Up Email' //19
                }, {
                    title: 'Child' //20
                }],
                columnDefs: [{
                    targets: [2, 4, 5, 6, 7, 8, 9],
                    className: 'bolded'
                }, {
                    targets: [3, 15, 16, 17, 19, 20],
                    visible: false
                }],
                rowCallback: function (row, data, index) {
                    // if (isNullorEmpty(data[15])) {
                    //     $('td', row).css('background-color', '#F7A4A4');
                    // }


                }
            });

            /**
             * debtDataSet3.push(['', linkURL, commDateLPOValidatedFormatted, debt_set_validated_row.custInternalID,
                        customerIDLink,
                        debt_set_validated_row.custName, debt_set_validated_row.zeeName, debt_set_validated_row.statusText, debt_set_validated_row.leadSource, debt_set_validated_row.linkedLPOName, debt_set_validated_row.contactName,
                        debt_set_validated_row.serviceEmail,
                        debt_set_validated_row.phone, debt_set_validated_row.email48h, debt_set_validated_row.salesRepName, debt_set_validated_row.dateFirstNoContact, debt_set_validated_row.dateSecondNoContact, debt_set_validated_row.dateThirdNoContact, debt_set_validated_row.productUsageperWeek, sendSignUpEmail, debt_set_validated_row.child
                    ]);
             */

            // dataTable = $('#mpexusage-validated').DataTable({
            //     destroy: true,
            //     data: debt_set_validated,
            //     pageLength: 1000,
            //     order: [[2, 'asc']],
            //     layout: {
            //         topStart: {
            //             buttons: ['copy', 'csv', 'excel', 'pdf', 'print']
            //         }
            //     },
            //     columns: [{
            //         title: 'Expand',
            //         className: 'dt-control',
            //         orderable: false,
            //         data: null,
            //         defaultContent: '<button type="button" class="btn btn-primary expand-button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-expand" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.646 9.146a.5.5 0 0 1 .708 0L8 12.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708zm0-2.292a.5.5 0 0 0 .708 0L8 3.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708z"><path></svg></button>', //0
            //     }, {
            //         title: 'LINK' //1
            //     }, {
            //         title: 'Date LPO Validated' //2
            //     }, {
            //         title: 'Customer Internal ID' //3
            //     }, {
            //         title: 'ID' //4
            //     }, {
            //         title: 'Company Name' //5
            //     }, {
            //         title: 'Franchisee' //6
            //     }, {
            //         title: 'Status' //7
            //     }, {
            //         title: 'Source' //8
            //     }, {
            //         title: 'Linked LPO' //9
            //     }, {
            //         title: 'Contact Name' //10
            //     }, {
            //         title: 'Email' //11
            //     }, {
            //         title: 'Phone Number' //12
            //     }, {
            //         title: 'Services of Interest'//13
            //     }, {
            //         title: 'Sales Rep Assigned' //14
            //     }, {
            //         title: 'Date - 1st No Answer' //15
            //     }, {
            //         title: 'Date - 2nd No Answer' //16
            //     }, {
            //         title: 'Date - 3rd No Answer' //17
            //     }, {
            //         title: 'MP Product Usage/Week' //18
            //     }, {
            //         title: 'Send Sign Up Email' //19
            //     }, {
            //         title: 'Child' //20
            //     }],
            //     columnDefs: [{
            //         targets: [2, 3, 4, 5, 6, 7, 8, 9, 14],
            //         className: 'bolded'
            //     }, {
            //         targets: [3, 15, 16, 17, 18, 19, 20],
            //         visible: false
            //     }],
            //     rowCallback: function (row, data, index) {
            //         // if (!isNullorEmpty(data[10])) {
            //         //     if (isNullorEmpty(data[12])) {
            //         // $('td', row).css('background-color', '#ADCF9F');
            //         //     } else if (!isNullorEmpty(data[12]) && isNullorEmpty(data[13]) && isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#FEBE8C');
            //         //     } else if (!isNullorEmpty(data[12]) && !isNullorEmpty(data[13]) && isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#F7A4A4');
            //         //     } else if (!isNullorEmpty(data[12]) && isNullorEmpty(data[13]) && !isNullorEmpty(data[14])) {
            //         //         $('td', row).css('background-color', '#E64848');
            //         //     }
            //         // }

            //     }
            // });

            // userId = $('#user_dropdown option:selected').val();
            zee = $(
                '#zee_dropdown').val();

            loadDebtRecord(zee, userId);

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

        function loadDebtRecord(zee_id, userId) {

            console.log('custStatus:' + custStatus)

            console.log('date_from: ' + date_from);
            console.log('date_to ' + date_to);
            console.log('custStatus ' + custStatus);
            console.log('paramUserId ' + paramUserId);
            console.log('salesCampaign ' + salesCampaign);
            console.log('userId: ' + userId)

            if (custStatus == '1') {
                console.log('INSIDE SUSPECTS STAGE')
                //Website Leads - Suspects
                var suspectsSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_web_leads_suspects'
                });

                if (!isNullorEmpty(zee_id)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zee_id
                    }));
                }



                if (!isNullorEmpty(paramUserId)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_assigned',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: paramUserId
                    }));
                } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_assigned',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: userId
                    }));
                }

                if (!isNullorEmpty(salesCampaign)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: salesCampaign
                    }));
                }

                // if (!isNullorEmpty(custStatus)) {
                //     suspectsSearch.filters.push(search.createFilter({
                //         name: 'entitystatus',
                //         join: null,
                //         operator: search.Operator.IS,
                //         values: custStatus
                //     }));
                // }

                if (!isNullorEmpty(source)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: source
                    }));
                }

                if (!isNullorEmpty(parentLPOInternalId)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.IS,
                        values: parentLPOInternalId
                    }));
                }

                if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_from
                    }));

                    suspectsSearch.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_to
                    }));
                }

                var suspectsSearchCount = suspectsSearch.runPaged().count;

                console.log('suspects count: ' + suspectsSearchCount);

                if (suspectsSearchCount > 25) {
                    var val1 = currentRecord.get();
                    var page_no = val1.getValue({
                        fieldId: 'custpage_page_no',
                    });

                    var totalPageCount = parseInt(suspectsSearchCount / 25) + 1;
                    var rangeStart = (parseInt(page_no) - 1) * 26;
                    var rangeEnd = rangeStart + 25;

                    val1.setValue({
                        fieldId: 'custpage_total_page_no',
                        value: totalPageCount
                    });


                    console.log('start: ' + rangeStart);
                    console.log('end: ' + rangeEnd)


                    var suspectsSearchResultSet = suspectsSearch.run().getRange({
                        start: rangeStart,
                        end: rangeEnd
                    });

                    for (var i = 0; i < suspectsSearchResultSet.length; i++) {
                        var custInternalID = suspectsSearchResultSet[i].getValue({
                            name: 'internalid'
                        });
                        var custEntityID = suspectsSearchResultSet[i].getValue({
                            name: 'entityid'
                        });
                        var custName = suspectsSearchResultSet[i].getValue({
                            name: 'companyname'
                        });
                        var zeeID = suspectsSearchResultSet[i].getValue({
                            name: 'partner'
                        });
                        var zeeName = suspectsSearchResultSet[i].getText({
                            name: 'partner'
                        });

                        var dateLeadEntered = suspectsSearchResultSet[i].getValue({
                            name: "custentity_date_lead_entered"
                        });

                        var email = suspectsSearchResultSet[i].getValue({
                            name: 'email'
                        });
                        var serviceEmail = suspectsSearchResultSet[i].getValue({
                            name: 'custentity_email_service'
                        });

                        var phone = suspectsSearchResultSet[i].getValue({
                            name: 'phone'
                        });

                        var statusText = suspectsSearchResultSet[i].getText({
                            name: 'entitystatus'
                        });

                        var salesRepId = suspectsSearchResultSet[i].getValue({
                            name: 'custrecord_sales_assigned',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var salesRepName = suspectsSearchResultSet[i].getText({
                            name: 'custrecord_sales_assigned',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var dateFirstNoContact = suspectsSearchResultSet[i].getValue({
                            name: 'custrecord_sales_day0call',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var dateSecondNoContact = suspectsSearchResultSet[i].getValue({
                            name: 'custrecord_sales_day14call',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var dateThirdNoContact = suspectsSearchResultSet[i].getValue({
                            name: 'custrecord_sales_day25call',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var contactid = suspectsSearchResultSet[i].getValue({
                            name: 'internalid',
                            join: 'contact'
                        });

                        var contactName = suspectsSearchResultSet[i].getValue({
                            name: 'entityid',
                            join: 'contact'
                        });


                        var contactEmail = suspectsSearchResultSet[i].getValue({
                            name: 'email',
                            join: 'contact'
                        });

                        var email48h = suspectsSearchResultSet[i].getText({
                            name: 'custentity_48h_email_sent'
                        });

                        var servicesOfInterest = suspectsSearchResultSet[i].getText({
                            name: 'custentity_services_of_interest'
                        });

                        var salesRecordId = suspectsSearchResultSet[i].getText({
                            name: "internalid",
                            join: "CUSTRECORD_SALES_CUSTOMER"
                        });

                        var productUsageperWeek = suspectsSearchResultSet[i].getText({
                            name: 'custentity_form_mpex_usage_per_week'
                        });

                        var leadSource = suspectsSearchResultSet[i].getText({
                            name: 'leadsource'
                        });

                        var linkedLPOName = suspectsSearchResultSet[i].getText({
                            name: 'custentity_lpo_parent_account'
                        });



                        //Website Leads - Suspects - Activity List
                        var suspectActivityListSearch = search.load({
                            type: 'customer',
                            id: 'customsearch_web_leads_prosp_quote_sen_9'
                        });

                        suspectActivityListSearch.filters.push(search.createFilter({
                            name: 'internalid',
                            join: null,
                            operator: search.Operator.ANYOF,
                            values: custInternalID
                        }));

                        var suspectChildDataSet = [];

                        suspectActivityListSearch.run().each(function (
                            suspectActivityListSearchResultSet) {
                            var activityInternalID = suspectActivityListSearchResultSet.getValue({
                                name: "internalid",
                                join: "activity"
                            })
                            var activityStartDate = suspectActivityListSearchResultSet.getValue({
                                name: "startdate",
                                join: "activity"
                            })
                            var activityTitle = suspectActivityListSearchResultSet.getValue({
                                name: "title",
                                join: "activity"
                            })
                            if (isNullorEmpty(suspectActivityListSearchResultSet.getText({
                                name: "custevent_organiser",
                                join: "activity"
                            }))) {
                                var activityOrganiser = suspectActivityListSearchResultSet.getText({
                                    name: "assigned",
                                    join: "activity"
                                })
                            } else {
                                var activityOrganiser = suspectActivityListSearchResultSet.getText({
                                    name: "custevent_organiser",
                                    join: "activity"
                                })
                            }

                            var activityMessage = suspectActivityListSearchResultSet.getValue({
                                name: "message",
                                join: "activity"
                            })

                            if (!isNullorEmpty(activityTitle)) {
                                suspectChildDataSet.push({
                                    activityInternalID: activityInternalID,
                                    activityStartDate: activityStartDate,
                                    activityTitle: activityTitle,
                                    activityOrganiser: activityOrganiser,
                                    activityMessage: activityMessage
                                });
                            }

                            return true;
                        });

                        console.log('suspectChildDataSet: ' + JSON.stringify(suspectChildDataSet))



                        debt_set4.push({
                            custInternalID: custInternalID,
                            custEntityID: custEntityID,
                            custName: custName,
                            zeeID: zeeID,
                            zeeName: zeeName,
                            dateLeadEntered: dateLeadEntered,
                            contactName: contactName,
                            email: email,
                            serviceEmail: serviceEmail,
                            phone: phone,
                            statusText: statusText,
                            leadSource: leadSource,
                            linkedLPOName: linkedLPOName,
                            salesRepId: salesRepId,
                            salesRepName: salesRepName,
                            dateFirstNoContact: dateFirstNoContact,
                            dateSecondNoContact: dateSecondNoContact,
                            dateThirdNoContact: dateThirdNoContact,
                            contactid: contactid,
                            contactEmail: contactEmail,
                            servicesOfInterest: servicesOfInterest,
                            salesRecordId: salesRecordId,
                            productUsageperWeek: productUsageperWeek,
                            child: suspectChildDataSet
                        });

                    }

                } else {
                    suspectsSearch.run().each(function (
                        suspectsSearchResultSet) {

                        var custInternalID = suspectsSearchResultSet.getValue({
                            name: 'internalid'
                        });
                        var custEntityID = suspectsSearchResultSet.getValue({
                            name: 'entityid'
                        });
                        var custName = suspectsSearchResultSet.getValue({
                            name: 'companyname'
                        });
                        var zeeID = suspectsSearchResultSet.getValue({
                            name: 'partner'
                        });
                        var zeeName = suspectsSearchResultSet.getText({
                            name: 'partner'
                        });

                        var dateLeadEntered = suspectsSearchResultSet.getValue({
                            name: "custentity_date_lead_entered"
                        });

                        var email = suspectsSearchResultSet.getValue({
                            name: 'email'
                        });
                        var serviceEmail = suspectsSearchResultSet.getValue({
                            name: 'custentity_email_service'
                        });

                        var phone = suspectsSearchResultSet.getValue({
                            name: 'phone'
                        });

                        var statusText = suspectsSearchResultSet.getText({
                            name: 'entitystatus'
                        });

                        var salesRepId = suspectsSearchResultSet.getValue({
                            name: 'custrecord_sales_assigned',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var salesRepName = suspectsSearchResultSet.getText({
                            name: 'custrecord_sales_assigned',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var dateFirstNoContact = suspectsSearchResultSet.getValue({
                            name: 'custrecord_sales_day0call',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var dateSecondNoContact = suspectsSearchResultSet.getValue({
                            name: 'custrecord_sales_day14call',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var dateThirdNoContact = suspectsSearchResultSet.getValue({
                            name: 'custrecord_sales_day25call',
                            join: 'CUSTRECORD_SALES_CUSTOMER'
                        });

                        var contactid = suspectsSearchResultSet.getValue({
                            name: 'internalid',
                            join: 'contact'
                        });

                        var contactName = suspectsSearchResultSet.getValue({
                            name: 'entityid',
                            join: 'contact'
                        });


                        var contactEmail = suspectsSearchResultSet.getValue({
                            name: 'email',
                            join: 'contact'
                        });

                        var email48h = suspectsSearchResultSet.getText({
                            name: 'custentity_48h_email_sent'
                        });

                        var servicesOfInterest = suspectsSearchResultSet.getText({
                            name: 'custentity_services_of_interest'
                        });

                        var salesRecordId = suspectsSearchResultSet.getText({
                            name: "internalid",
                            join: "CUSTRECORD_SALES_CUSTOMER"
                        });

                        var productUsageperWeek = suspectsSearchResultSet.getText({
                            name: 'custentity_form_mpex_usage_per_week'
                        });

                        var leadSource = suspectsSearchResultSet.getText({
                            name: 'leadsource'
                        });

                        var linkedLPOName = suspectsSearchResultSet.getText({
                            name: 'custentity_lpo_parent_account'
                        });


                        //Website Leads - Suspects - Activity List
                        var suspectActivityListSearch = search.load({
                            type: 'customer',
                            id: 'customsearch_web_leads_prosp_quote_sen_9'
                        });

                        suspectActivityListSearch.filters.push(search.createFilter({
                            name: 'internalid',
                            join: null,
                            operator: search.Operator.ANYOF,
                            values: custInternalID
                        }));

                        var suspectChildDataSet = [];

                        suspectActivityListSearch.run().each(function (
                            suspectActivityListSearchResultSet) {
                            var activityInternalID = suspectActivityListSearchResultSet.getValue({
                                name: "internalid",
                                join: "activity"
                            })
                            var activityStartDate = suspectActivityListSearchResultSet.getValue({
                                name: "startdate",
                                join: "activity"
                            })
                            var activityTitle = suspectActivityListSearchResultSet.getValue({
                                name: "title",
                                join: "activity"
                            })
                            if (isNullorEmpty(suspectActivityListSearchResultSet.getText({
                                name: "custevent_organiser",
                                join: "activity"
                            }))) {
                                var activityOrganiser = suspectActivityListSearchResultSet.getText({
                                    name: "assigned",
                                    join: "activity"
                                })
                            } else {
                                var activityOrganiser = suspectActivityListSearchResultSet.getText({
                                    name: "custevent_organiser",
                                    join: "activity"
                                })
                            }

                            var activityMessage = suspectActivityListSearchResultSet.getValue({
                                name: "message",
                                join: "activity"
                            })

                            if (!isNullorEmpty(activityTitle)) {
                                suspectChildDataSet.push({
                                    activityInternalID: activityInternalID,
                                    activityStartDate: activityStartDate,
                                    activityTitle: activityTitle,
                                    activityOrganiser: activityOrganiser,
                                    activityMessage: activityMessage
                                });
                            }

                            return true;
                        });

                        console.log('suspectChildDataSet: ' + JSON.stringify(suspectChildDataSet))

                        debt_set4.push({
                            custInternalID: custInternalID,
                            custEntityID: custEntityID,
                            custName: custName,
                            zeeID: zeeID,
                            zeeName: zeeName,
                            dateLeadEntered: dateLeadEntered,
                            contactName: contactName,
                            email: email,
                            serviceEmail: serviceEmail,
                            phone: phone,
                            statusText: statusText,
                            leadSource: leadSource,
                            linkedLPOName: linkedLPOName,
                            salesRepId: salesRepId,
                            salesRepName: salesRepName,
                            dateFirstNoContact: dateFirstNoContact,
                            dateSecondNoContact: dateSecondNoContact,
                            dateThirdNoContact: dateThirdNoContact,
                            contactid: contactid,
                            contactEmail: contactEmail,
                            servicesOfInterest: servicesOfInterest,
                            salesRecordId: salesRecordId,
                            productUsageperWeek: productUsageperWeek,
                            child: suspectChildDataSet
                        });

                        return true;
                    });
                    console.log(debt_set4)
                }

            } else if (custStatus == '2') {
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

                if (!isNullorEmpty(salesCampaign)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: salesCampaign
                    }));
                }

                // if (!isNullorEmpty(custStatus)) {
                //     custListCommenceTodayResults.filters.push(search.createFilter({
                //         name: 'entitystatus',
                //         join: null,
                //         operator: search.Operator.IS,
                //         values: custStatus
                //     }));
                // }

                if (!isNullorEmpty(source)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: source
                    }));
                }

                if (!isNullorEmpty(parentLPOInternalId)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.IS,
                        values: parentLPOInternalId
                    }));
                }

                if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORAFTER,
                        values: date_from
                    }));

                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'custentity_date_lead_entered',
                        join: null,
                        operator: search.Operator.ONORBEFORE,
                        values: date_to
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

                    var statusText = custListCommenceTodaySet.getText({
                        name: 'entitystatus'
                    });

                    var salesRepId = custListCommenceTodaySet.getValue({
                        name: 'custrecord_sales_assigned',
                        join: 'CUSTRECORD_SALES_CUSTOMER'
                    });

                    var salesRepName = custListCommenceTodaySet.getText({
                        name: 'custrecord_sales_assigned',
                        join: 'CUSTRECORD_SALES_CUSTOMER'
                    });

                    var dateFirstNoContact = custListCommenceTodaySet.getValue({
                        name: 'custrecord_sales_day0call',
                        join: 'CUSTRECORD_SALES_CUSTOMER'
                    });

                    var dateSecondNoContact = custListCommenceTodaySet.getValue({
                        name: 'custrecord_sales_day14call',
                        join: 'CUSTRECORD_SALES_CUSTOMER'
                    });

                    var dateThirdNoContact = custListCommenceTodaySet.getValue({
                        name: 'custrecord_sales_day25call',
                        join: 'CUSTRECORD_SALES_CUSTOMER'
                    });

                    var contactid = custListCommenceTodaySet.getValue({
                        name: 'internalid',
                        join: 'contact'
                    });

                    var contactName = custListCommenceTodaySet.getValue({
                        name: 'entityid',
                        join: 'contact'
                    });


                    var contactEmail = custListCommenceTodaySet.getValue({
                        name: 'email',
                        join: 'contact'
                    });

                    var email48h = custListCommenceTodaySet.getText({
                        name: 'custentity_48h_email_sent'
                    });

                    var salesRecordId = custListCommenceTodaySet.getText({
                        name: "internalid",
                        join: "CUSTRECORD_SALES_CUSTOMER"
                    });

                    var productUsageperWeek = custListCommenceTodaySet.getText({
                        name: 'custentity_form_mpex_usage_per_week'
                    });

                    var leadSource = custListCommenceTodaySet.getText({
                        name: 'leadsource'
                    });

                    var linkedLPOName = custListCommenceTodaySet.getText({
                        name: 'custentity_lpo_parent_account'
                    });

                    var rowColorSort = null;

                    // if (!isNullorEmpty(email48h)) {
                    if (isNullorEmpty(dateFirstNoContact)) {
                        rowColorSort = 1
                    } else if (!isNullorEmpty(dateFirstNoContact) && isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
                        rowColorSort = 2
                    } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
                        rowColorSort = 3
                    } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && !isNullorEmpty(dateThirdNoContact)) {
                        rowColorSort = 4;
                    }
                    // }

                    //Website Leads - Prospect Quote Sent - Activity List
                    var prospectQuoteSentActivityListSearch = search.load({
                        type: 'customer',
                        id: 'customsearch_web_leads_prosp_quote_sen_8'
                    });

                    prospectQuoteSentActivityListSearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: null,
                        operator: search.Operator.ANYOF,
                        values: custInternalID
                    }));

                    var prospectQuoteChildDataSet = [];

                    prospectQuoteSentActivityListSearch.run().each(function (
                        prospectQuoteSentActivityListSearchResultSet) {
                        var activityInternalID = prospectQuoteSentActivityListSearchResultSet.getValue({
                            name: "internalid",
                            join: "activity"
                        })
                        var activityStartDate = prospectQuoteSentActivityListSearchResultSet.getValue({
                            name: "startdate",
                            join: "activity"
                        })
                        var activityTitle = prospectQuoteSentActivityListSearchResultSet.getValue({
                            name: "title",
                            join: "activity"
                        })
                        if (isNullorEmpty(prospectQuoteSentActivityListSearchResultSet.getText({
                            name: "custevent_organiser",
                            join: "activity"
                        }))) {
                            var activityOrganiser = prospectQuoteSentActivityListSearchResultSet.getText({
                                name: "assigned",
                                join: "activity"
                            })
                        } else {
                            var activityOrganiser = prospectQuoteSentActivityListSearchResultSet.getText({
                                name: "custevent_organiser",
                                join: "activity"
                            })
                        }

                        var activityMessage = prospectQuoteSentActivityListSearchResultSet.getValue({
                            name: "message",
                            join: "activity"
                        })

                        console.log('activityInternalID: ' + activityInternalID);
                        console.log('activityTitle: ' + activityTitle);
                        console.log('activityMessage: ' + activityMessage);

                        if (!isNullorEmpty(activityTitle)) {
                            prospectQuoteChildDataSet.push({
                                activityInternalID: activityInternalID,
                                activityStartDate: activityStartDate,
                                activityTitle: activityTitle,
                                activityOrganiser: activityOrganiser,
                                activityMessage: activityMessage
                            });
                        }

                        console.log('prospectQuoteChildDataSet: ' + JSON.stringify(prospectQuoteChildDataSet))

                        return true;
                    });

                    console.log('prospectQuoteChildDataSet: ' + JSON.stringify(prospectQuoteChildDataSet))


                    debt_set.push({
                        custInternalID: custInternalID,
                        custEntityID: custEntityID,
                        custName: custName,
                        zeeID: zeeID,
                        zeeName: zeeName,
                        quoteSentDate: quoteSentDate,
                        contactName: contactName,
                        email: email,
                        serviceEmail: serviceEmail,
                        phone: phone,
                        statusText: statusText,
                        leadSource: leadSource,
                        linkedLPOName: linkedLPOName,
                        salesRepId: salesRepId,
                        salesRepName: salesRepName,
                        dateFirstNoContact: dateFirstNoContact,
                        dateSecondNoContact: dateSecondNoContact,
                        dateThirdNoContact: dateThirdNoContact,
                        rowColorSort: rowColorSort,
                        contactid: contactid,
                        contactEmail: contactEmail,
                        email48h: email48h,
                        salesRecordId: salesRecordId,
                        productUsageperWeek: productUsageperWeek,
                        child: prospectQuoteChildDataSet
                    });

                    return true;
                });
                console.log(debt_set)
            }

            // //STATUSES - PROSPECT - QUOTE SENT / PROSPECT - NO ANSWER / PROSPECT - IN CONTACT
            // if (custStatus == '50' || custStatus == '35' || custStatus == '8') {
            //     //Website Leads - Prospect Quote Sent
            //     var custListCommenceTodayResults = search.load({
            //         type: 'customer',
            //         id: 'customsearch_web_leads_prosp_quote_sent'
            //     });

            //     if (!isNullorEmpty(zee_id)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'partner',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: zee_id
            //         }));
            //     }

            //     console.log('userId: ' + userId)

            //     if (!isNullorEmpty(paramUserId)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: paramUserId
            //         }));
            //     } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: userId
            //         }));
            //     }

            //     if (!isNullorEmpty(salesCampaign)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'custrecord_sales_campaign',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: salesCampaign
            //         }));
            //     }

            //     if (!isNullorEmpty(custStatus)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'entitystatus',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: custStatus
            //         }));
            //     }

            //     if (!isNullorEmpty(source)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'leadsource',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: source
            //         }));
            //     }

            //     if (!isNullorEmpty(parentLPOInternalId)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'internalid',
            //             join: 'custentity_lpo_parent_account',
            //             operator: search.Operator.IS,
            //             values: parentLPOInternalId
            //         }));
            //     }

            //     if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORAFTER,
            //             values: date_from
            //         }));

            //         custListCommenceTodayResults.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORBEFORE,
            //             values: date_to
            //         }));
            //     }

            //     custListCommenceTodayResults.run().each(function (
            //         custListCommenceTodaySet) {

            //         var custInternalID = custListCommenceTodaySet.getValue({
            //             name: 'internalid'
            //         });
            //         var custEntityID = custListCommenceTodaySet.getValue({
            //             name: 'entityid'
            //         });
            //         var custName = custListCommenceTodaySet.getValue({
            //             name: 'companyname'
            //         });
            //         var zeeID = custListCommenceTodaySet.getValue({
            //             name: 'partner'
            //         });
            //         var zeeName = custListCommenceTodaySet.getText({
            //             name: 'partner'
            //         });

            //         var quoteSentDate = custListCommenceTodaySet.getValue({
            //             name: "custentity_date_lead_quote_sent"
            //         });

            //         var email = custListCommenceTodaySet.getValue({
            //             name: 'email'
            //         });
            //         var serviceEmail = custListCommenceTodaySet.getValue({
            //             name: 'custentity_email_service'
            //         });

            //         var phone = custListCommenceTodaySet.getValue({
            //             name: 'phone'
            //         });

            //         var statusText = custListCommenceTodaySet.getText({
            //             name: 'entitystatus'
            //         });

            //         var salesRepId = custListCommenceTodaySet.getValue({
            //             name: 'custrecord_sales_assigned',
            //             join: 'CUSTRECORD_SALES_CUSTOMER'
            //         });

            //         var salesRepName = custListCommenceTodaySet.getText({
            //             name: 'custrecord_sales_assigned',
            //             join: 'CUSTRECORD_SALES_CUSTOMER'
            //         });

            //         var dateFirstNoContact = custListCommenceTodaySet.getValue({
            //             name: 'custrecord_sales_day0call',
            //             join: 'CUSTRECORD_SALES_CUSTOMER'
            //         });

            //         var dateSecondNoContact = custListCommenceTodaySet.getValue({
            //             name: 'custrecord_sales_day14call',
            //             join: 'CUSTRECORD_SALES_CUSTOMER'
            //         });

            //         var dateThirdNoContact = custListCommenceTodaySet.getValue({
            //             name: 'custrecord_sales_day25call',
            //             join: 'CUSTRECORD_SALES_CUSTOMER'
            //         });

            //         var contactid = custListCommenceTodaySet.getValue({
            //             name: 'internalid',
            //             join: 'contact'
            //         });

            //         var contactName = custListCommenceTodaySet.getValue({
            //             name: 'entityid',
            //             join: 'contact'
            //         });


            //         var contactEmail = custListCommenceTodaySet.getValue({
            //             name: 'email',
            //             join: 'contact'
            //         });

            //         var email48h = custListCommenceTodaySet.getText({
            //             name: 'custentity_48h_email_sent'
            //         });

            //         var salesRecordId = custListCommenceTodaySet.getText({
            //             name: "internalid",
            //             join: "CUSTRECORD_SALES_CUSTOMER"
            //         });

            //         var productUsageperWeek = custListCommenceTodaySet.getText({
            //             name: 'custentity_form_mpex_usage_per_week'
            //         });

            //         var leadSource = custListCommenceTodaySet.getText({
            //             name: 'leadsource'
            //         });

            //         var linkedLPOName = custListCommenceTodaySet.getText({
            //             name: 'custentity_lpo_parent_account'
            //         });

            //         var rowColorSort = null;

            //         // if (!isNullorEmpty(email48h)) {
            //         if (isNullorEmpty(dateFirstNoContact)) {
            //             rowColorSort = 1
            //         } else if (!isNullorEmpty(dateFirstNoContact) && isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
            //             rowColorSort = 2
            //         } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
            //             rowColorSort = 3
            //         } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && !isNullorEmpty(dateThirdNoContact)) {
            //             rowColorSort = 4;
            //         }
            //         // }

            //         //Website Leads - Prospect Quote Sent - Activity List
            //         var prospectQuoteSentActivityListSearch = search.load({
            //             type: 'customer',
            //             id: 'customsearch_web_leads_prosp_quote_sen_8'
            //         });

            //         prospectQuoteSentActivityListSearch.filters.push(search.createFilter({
            //             name: 'internalid',
            //             join: null,
            //             operator: search.Operator.ANYOF,
            //             values: custInternalID
            //         }));

            //         var prospectQuoteChildDataSet = [];

            //         prospectQuoteSentActivityListSearch.run().each(function (
            //             prospectQuoteSentActivityListSearchResultSet) {
            //             var activityInternalID = prospectQuoteSentActivityListSearchResultSet.getValue({
            //                 name: "internalid",
            //                 join: "activity"
            //             })
            //             var activityStartDate = prospectQuoteSentActivityListSearchResultSet.getValue({
            //                 name: "startdate",
            //                 join: "activity"
            //             })
            //             var activityTitle = prospectQuoteSentActivityListSearchResultSet.getValue({
            //                 name: "title",
            //                 join: "activity"
            //             })
            //             if (isNullorEmpty(prospectQuoteSentActivityListSearchResultSet.getText({
            //                 name: "custevent_organiser",
            //                 join: "activity"
            //             }))) {
            //                 var activityOrganiser = prospectQuoteSentActivityListSearchResultSet.getText({
            //                     name: "assigned",
            //                     join: "activity"
            //                 })
            //             } else {
            //                 var activityOrganiser = prospectQuoteSentActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 })
            //             }

            //             var activityMessage = prospectQuoteSentActivityListSearchResultSet.getValue({
            //                 name: "message",
            //                 join: "activity"
            //             })

            //             console.log('activityInternalID: ' + activityInternalID);
            //             console.log('activityTitle: ' + activityTitle);
            //             console.log('activityMessage: ' + activityMessage);

            //             if (!isNullorEmpty(activityTitle)) {
            //                 prospectQuoteChildDataSet.push({
            //                     activityInternalID: activityInternalID,
            //                     activityStartDate: activityStartDate,
            //                     activityTitle: activityTitle,
            //                     activityOrganiser: activityOrganiser,
            //                     activityMessage: activityMessage
            //                 });
            //             }

            //             console.log('prospectQuoteChildDataSet: ' + JSON.stringify(prospectQuoteChildDataSet))

            //             return true;
            //         });

            //         console.log('prospectQuoteChildDataSet: ' + JSON.stringify(prospectQuoteChildDataSet))


            //         debt_set.push({
            //             custInternalID: custInternalID,
            //             custEntityID: custEntityID,
            //             custName: custName,
            //             zeeID: zeeID,
            //             zeeName: zeeName,
            //             quoteSentDate: quoteSentDate,
            //             contactName: contactName,
            //             email: email,
            //             serviceEmail: serviceEmail,
            //             phone: phone,
            //             statusText: statusText,
            //             leadSource: leadSource,
            //             linkedLPOName: linkedLPOName,
            //             salesRepId: salesRepId,
            //             salesRepName: salesRepName,
            //             dateFirstNoContact: dateFirstNoContact,
            //             dateSecondNoContact: dateSecondNoContact,
            //             dateThirdNoContact: dateThirdNoContact,
            //             rowColorSort: rowColorSort,
            //             contactid: contactid,
            //             contactEmail: contactEmail,
            //             email48h: email48h,
            //             salesRecordId: salesRecordId,
            //             productUsageperWeek: productUsageperWeek,
            //             child: prospectQuoteChildDataSet
            //         });

            //         return true;
            //     });
            //     console.log(debt_set)
            // }

            // //STATUSES - PROSPECT - OPPORTUNITY
            // if (custStatus == '58') {
            //     //Website Leads - Prospect Opportunity
            //     var prospectOpportunititesSearch = search.load({
            //         type: 'customer',
            //         id: 'customsearch_web_leads_prosp_quote_sen_5'
            //     });

            //     if (!isNullorEmpty(zee_id)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'partner',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: zee_id
            //         }));
            //     }

            //     console.log('userId: ' + userId)

            //     if (!isNullorEmpty(paramUserId)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: paramUserId
            //         }));
            //     } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: userId
            //         }));
            //     }

            //     if (!isNullorEmpty(salesCampaign)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_campaign',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: salesCampaign
            //         }));
            //     }

            //     if (!isNullorEmpty(custStatus)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'entitystatus',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: custStatus
            //         }));
            //     }

            //     if (!isNullorEmpty(source)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'leadsource',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: source
            //         }));
            //     }

            //     if (!isNullorEmpty(parentLPOInternalId)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'internalid',
            //             join: 'custentity_lpo_parent_account',
            //             operator: search.Operator.IS,
            //             values: parentLPOInternalId
            //         }));
            //     }

            //     if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORAFTER,
            //             values: date_from
            //         }));

            //         prospectOpportunititesSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORBEFORE,
            //             values: date_to
            //         }));
            //     }

            //     var prospectOpportunititesSearchCount = prospectOpportunititesSearch.runPaged().count;

            //     if (prospectOpportunititesSearchCount > 25) {
            //         var val1 = currentRecord.get();
            //         var page_no = val1.getValue({
            //             fieldId: 'custpage_page_no',
            //         });

            //         var totalPageCount = parseInt(prospectOpportunititesSearchCount / 25) + 1;
            //         var rangeStart = (parseInt(page_no) - 1) * 26;
            //         var rangeEnd = rangeStart + 25;

            //         val1.setValue({
            //             fieldId: 'custpage_total_page_no',
            //             value: totalPageCount
            //         });


            //         console.log('start: ' + rangeStart);
            //         console.log('end: ' + rangeEnd)


            //         var prospectOpportunititesResultSet = prospectOpportunititesSearch.run().getRange({
            //             start: rangeStart,
            //             end: rangeEnd
            //         });

            //         for (var i = 0; i < prospectOpportunititesResultSet.length; i++) {
            //             var custInternalID = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = prospectOpportunititesResultSet[i].getText({
            //                 name: 'partner'
            //             });

            //             var quoteSentDate = prospectOpportunititesResultSet[i].getValue({
            //                 name: "custentity_date_lead_quote_sent"
            //             });

            //             var email = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = prospectOpportunititesResultSet[i].getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = prospectOpportunititesResultSet[i].getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = prospectOpportunititesResultSet[i].getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = prospectOpportunititesResultSet[i].getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var salesRecordId = prospectOpportunititesResultSet[i].getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = prospectOpportunititesResultSet[i].getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = prospectOpportunititesResultSet[i].getText({
            //                 name: 'leadsource'
            //             });

            //             var linkedLPOName = prospectOpportunititesResultSet[i].getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });

            //             console.log('custInternalID: ' + custInternalID)
            //             console.log('custName: ' + custName)

            //             //Website Leads - Prospect Opportunity - Activity List
            //             var prospectOpportunititesActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_prosp_quote_sen_6'
            //             });

            //             prospectOpportunititesActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var prospectOpportunityChildDataSet = [];

            //             prospectOpportunititesActivityListSearch.run().each(function (
            //                 prospectOpportunititesActivityListResultSet) {
            //                 var activityInternalID = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(prospectOpportunititesActivityListResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = prospectOpportunititesActivityListResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = prospectOpportunititesActivityListResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 console.log('activityInternalID: ' + activityInternalID);
            //                 console.log('activityTitle: ' + activityTitle);
            //                 console.log('activityMessage: ' + activityMessage);

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     prospectOpportunityChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 console.log('prospectOpportunityChildDataSet: ' + JSON.stringify(prospectOpportunityChildDataSet))

            //                 return true;
            //             });

            //             console.log('prospectOpportunityChildDataSet: ' + JSON.stringify(prospectOpportunityChildDataSet))

            //             debt_set2.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 quoteSentDate: quoteSentDate,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 email48h: email48h,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 child: prospectOpportunityChildDataSet
            //             });
            //         }
            //     } else {
            //         prospectOpportunititesSearch.run().each(function (
            //             prospectOpportunititesResultSet) {

            //             var custInternalID = prospectOpportunititesResultSet.getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = prospectOpportunititesResultSet.getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = prospectOpportunititesResultSet.getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = prospectOpportunititesResultSet.getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = prospectOpportunititesResultSet.getText({
            //                 name: 'partner'
            //             });

            //             var quoteSentDate = prospectOpportunititesResultSet.getValue({
            //                 name: "custentity_date_lead_quote_sent"
            //             });

            //             var email = prospectOpportunititesResultSet.getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = prospectOpportunititesResultSet.getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = prospectOpportunititesResultSet.getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = prospectOpportunititesResultSet.getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = prospectOpportunititesResultSet.getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = prospectOpportunititesResultSet.getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = prospectOpportunititesResultSet.getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = prospectOpportunititesResultSet.getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = prospectOpportunititesResultSet.getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = prospectOpportunititesResultSet.getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = prospectOpportunititesResultSet.getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = prospectOpportunititesResultSet.getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = prospectOpportunititesResultSet.getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var salesRecordId = prospectOpportunititesResultSet.getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = prospectOpportunititesResultSet.getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = prospectOpportunititesResultSet.getText({
            //                 name: 'leadsource'
            //             });

            //             var linkedLPOName = prospectOpportunititesResultSet.getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });

            //             console.log('custInternalID: ' + custInternalID)
            //             console.log('custName: ' + custName)

            //             //Website Leads - Prospect Opportunity - Activity List
            //             var prospectOpportunititesActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_prosp_quote_sen_6'
            //             });

            //             prospectOpportunititesActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var prospectOpportunityChildDataSet = [];

            //             prospectOpportunititesActivityListSearch.run().each(function (
            //                 prospectOpportunititesActivityListResultSet) {
            //                 var activityInternalID = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(prospectOpportunititesActivityListResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = prospectOpportunititesActivityListResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = prospectOpportunititesActivityListResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = prospectOpportunititesActivityListResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 console.log('activityInternalID: ' + activityInternalID);
            //                 console.log('activityTitle: ' + activityTitle);
            //                 console.log('activityMessage: ' + activityMessage);

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     prospectOpportunityChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 console.log('prospectOpportunityChildDataSet: ' + JSON.stringify(prospectOpportunityChildDataSet))

            //                 return true;
            //             });

            //             console.log('prospectOpportunityChildDataSet: ' + JSON.stringify(prospectOpportunityChildDataSet))

            //             debt_set2.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 quoteSentDate: quoteSentDate,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 email48h: email48h,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 child: prospectOpportunityChildDataSet
            //             });

            //             return true;
            //         });
            //     }

            //     console.log(debt_set2)
            // }

            // if (custStatus == '67' || custStatus == '18') {
            //     //Website Leads - Suspect Followup
            //     var suspectFollowUpsSearch = search.load({
            //         type: 'customer',
            //         id: 'customsearch_web_leads_suspect_followup'
            //     });

            //     if (!isNullorEmpty(zee_id)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'partner',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: zee_id
            //         }));
            //     }

            //     console.log('userId: ' + userId)

            //     if (!isNullorEmpty(paramUserId)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: paramUserId
            //         }));
            //     } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: userId
            //         }));
            //     }

            //     if (!isNullorEmpty(salesCampaign)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_campaign',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: salesCampaign
            //         }));
            //     }

            //     if (!isNullorEmpty(custStatus)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'entitystatus',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: custStatus
            //         }));
            //     }

            //     if (!isNullorEmpty(source)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'leadsource',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: source
            //         }));
            //     }

            //     if (!isNullorEmpty(parentLPOInternalId)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'internalid',
            //             join: 'custentity_lpo_parent_account',
            //             operator: search.Operator.IS,
            //             values: parentLPOInternalId
            //         }));
            //     }

            //     if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORAFTER,
            //             values: date_from
            //         }));

            //         suspectFollowUpsSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORBEFORE,
            //             values: date_to
            //         }));
            //     }


            //     var suspectFollowUpsSearchCount = suspectFollowUpsSearch.runPaged().count;

            //     if (suspectFollowUpsSearchCount > 25) {
            //         var val1 = currentRecord.get();
            //         var page_no = val1.getValue({
            //             fieldId: 'custpage_page_no',
            //         });

            //         var totalPageCount = parseInt(suspectFollowUpsSearchCount / 25) + 1;
            //         var rangeStart = (parseInt(page_no) - 1) * 26;
            //         var rangeEnd = rangeStart + 25;

            //         val1.setValue({
            //             fieldId: 'custpage_total_page_no',
            //             value: totalPageCount
            //         });


            //         console.log('start: ' + rangeStart);
            //         console.log('end: ' + rangeEnd)


            //         var suspectFollowUpsSearchResultSet = suspectFollowUpsSearch.run().getRange({
            //             start: rangeStart,
            //             end: rangeEnd
            //         });

            //         for (var i = 0; i < suspectFollowUpsSearchResultSet.length; i++) {
            //             var custInternalID = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'partner'
            //             });

            //             var quoteSentDate = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: "custentity_date_lead_quote_sent"
            //             });

            //             var email = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = suspectFollowUpsSearchResultSet[i].getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var salesRecordId = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'leadsource'
            //             });

            //             var linkedLPOName = suspectFollowUpsSearchResultSet[i].getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });


            //             //Website Leads - Suspect Followup - Activity List
            //             var suspectFollowupActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_prosp_quote_sen_7'
            //             });

            //             suspectFollowupActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var suspectFollowUpChildDataSet = [];

            //             suspectFollowupActivityListSearch.run().each(function (
            //                 suspectFollowupActivityListSearchResultSet) {
            //                 var activityInternalID = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(suspectFollowupActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = suspectFollowupActivityListSearchResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = suspectFollowupActivityListSearchResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     suspectFollowUpChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 return true;
            //             });

            //             console.log('suspectFollowUpChildDataSet: ' + JSON.stringify(suspectFollowUpChildDataSet))



            //             debt_set3.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 quoteSentDate: quoteSentDate,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 email48h: email48h,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 child: suspectFollowUpChildDataSet
            //             });

            //         }
            //     } else {
            //         suspectFollowUpsSearch.run().each(function (
            //             suspectFollowUpsSearchResultSet) {

            //             var custInternalID = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'partner'
            //             });

            //             var quoteSentDate = suspectFollowUpsSearchResultSet.getValue({
            //                 name: "custentity_date_lead_quote_sent"
            //             });

            //             var email = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = suspectFollowUpsSearchResultSet.getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var salesRecordId = suspectFollowUpsSearchResultSet.getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'leadsource'
            //             });

            //             var linkedLPOName = suspectFollowUpsSearchResultSet.getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });


            //             //Website Leads - Suspect Followup - Activity List
            //             var suspectFollowupActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_prosp_quote_sen_7'
            //             });

            //             suspectFollowupActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var suspectFollowUpChildDataSet = [];

            //             suspectFollowupActivityListSearch.run().each(function (
            //                 suspectFollowupActivityListSearchResultSet) {
            //                 var activityInternalID = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(suspectFollowupActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = suspectFollowupActivityListSearchResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = suspectFollowupActivityListSearchResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = suspectFollowupActivityListSearchResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     suspectFollowUpChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 return true;
            //             });

            //             console.log('suspectFollowUpChildDataSet: ' + JSON.stringify(suspectFollowUpChildDataSet))



            //             debt_set3.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 quoteSentDate: quoteSentDate,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 email48h: email48h,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 child: suspectFollowUpChildDataSet
            //             });

            //             return true;
            //         });
            //     }


            //     console.log(debt_set3)
            // }

            // if (custStatus == '68') {
            //     //Website Leads - Suspect Validated
            //     var suspectValidatedSearch = search.load({
            //         type: 'customer',
            //         id: 'customsearch_web_leads_suspect_validated'
            //     });

            //     if (!isNullorEmpty(zee_id)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'partner',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: zee_id
            //         }));
            //     }

            //     console.log('userId: ' + userId)

            //     if (!isNullorEmpty(paramUserId)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: paramUserId
            //         }));
            //     } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: userId
            //         }));
            //     }

            //     if (!isNullorEmpty(salesCampaign)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_campaign',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: salesCampaign
            //         }));
            //     }

            //     if (!isNullorEmpty(custStatus)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'entitystatus',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: custStatus
            //         }));
            //     }

            //     if (!isNullorEmpty(source)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'leadsource',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: source
            //         }));
            //     }

            //     if (!isNullorEmpty(parentLPOInternalId)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'internalid',
            //             join: 'custentity_lpo_parent_account',
            //             operator: search.Operator.IS,
            //             values: parentLPOInternalId
            //         }));
            //     }

            //     if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORAFTER,
            //             values: date_from
            //         }));

            //         suspectValidatedSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORBEFORE,
            //             values: date_to
            //         }));
            //     }



            //     var suspectValidatedSearchCount = suspectValidatedSearch.runPaged().count;

            //     if (suspectValidatedSearchCount > 25) {
            //         var val1 = currentRecord.get();
            //         var page_no = val1.getValue({
            //             fieldId: 'custpage_page_no',
            //         });

            //         var totalPageCount = parseInt(suspectValidatedSearchCount / 25) + 1;
            //         var rangeStart = (parseInt(page_no) - 1) * 26;
            //         var rangeEnd = rangeStart + 25;

            //         val1.setValue({
            //             fieldId: 'custpage_total_page_no',
            //             value: totalPageCount
            //         });


            //         console.log('start: ' + rangeStart);
            //         console.log('end: ' + rangeEnd)


            //         var suspectValidatedSearchResultSet = suspectValidatedSearch.run().getRange({
            //             start: rangeStart,
            //             end: rangeEnd
            //         });

            //         for (var i = 0; i < suspectValidatedSearchResultSet.length; i++) {
            //             var custInternalID = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'partner'
            //             });

            //             var quoteSentDate = suspectValidatedSearchResultSet[i].getValue({
            //                 name: "custentity_date_lead_quote_sent"
            //             });

            //             var email = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = suspectValidatedSearchResultSet[i].getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var salesRecordId = suspectValidatedSearchResultSet[i].getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'leadsource'
            //             });

            //             var dateLPOValidated = suspectValidatedSearchResultSet[i].getValue({
            //                 name: "custentity_date_lpo_validated"
            //             });

            //             var linkedLPOName = suspectValidatedSearchResultSet[i].getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });


            //             //Website Leads - Suspect Validated - Activity List
            //             var suspectValidatedActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_sus_valid_act_lis'
            //             });

            //             suspectValidatedActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var suspectValidatedChildDataSet = [];

            //             suspectValidatedActivityListSearch.run().each(function (
            //                 suspectValidatedActivityListSearchResultSet) {
            //                 var activityInternalID = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(suspectValidatedActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = suspectValidatedActivityListSearchResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = suspectValidatedActivityListSearchResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     suspectValidatedChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 return true;
            //             });

            //             console.log('suspectValidatedChildDataSet: ' + JSON.stringify(suspectValidatedChildDataSet))



            //             debt_set_validated.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 quoteSentDate: quoteSentDate,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 email48h: email48h,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 dateLPOValidated: dateLPOValidated,
            //                 child: suspectValidatedChildDataSet
            //             });

            //         }

            //     } else {
            //         suspectValidatedSearch.run().each(function (
            //             suspectValidatedSearchResultSet) {

            //             var custInternalID = suspectValidatedSearchResultSet.getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = suspectValidatedSearchResultSet.getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = suspectValidatedSearchResultSet.getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = suspectValidatedSearchResultSet.getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = suspectValidatedSearchResultSet.getText({
            //                 name: 'partner'
            //             });

            //             var quoteSentDate = suspectValidatedSearchResultSet.getValue({
            //                 name: "custentity_date_lead_quote_sent"
            //             });

            //             var email = suspectValidatedSearchResultSet.getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = suspectValidatedSearchResultSet.getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = suspectValidatedSearchResultSet.getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = suspectValidatedSearchResultSet.getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = suspectValidatedSearchResultSet.getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = suspectValidatedSearchResultSet.getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = suspectValidatedSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = suspectValidatedSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = suspectValidatedSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = suspectValidatedSearchResultSet.getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = suspectValidatedSearchResultSet.getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = suspectValidatedSearchResultSet.getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = suspectValidatedSearchResultSet.getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var salesRecordId = suspectValidatedSearchResultSet.getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = suspectValidatedSearchResultSet.getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = suspectValidatedSearchResultSet.getText({
            //                 name: 'leadsource'
            //             });

            //             var dateLPOValidated = suspectValidatedSearchResultSet.getValue({
            //                 name: "custentity_date_lpo_validated"
            //             });


            //             var linkedLPOName = suspectValidatedSearchResultSet.getText({
            //                 name: "custentity_lpo_parent_account"
            //             });




            //             var suspectFollowUpChildDataSet = [];

            //             //Website Leads - Suspect Validated - Activity List
            //             var suspectValidatedActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_sus_valid_act_lis'
            //             });

            //             suspectValidatedActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var suspectValidatedChildDataSet = [];

            //             suspectValidatedActivityListSearch.run().each(function (
            //                 suspectValidatedActivityListSearchResultSet) {
            //                 var activityInternalID = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(suspectValidatedActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = suspectValidatedActivityListSearchResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = suspectValidatedActivityListSearchResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = suspectValidatedActivityListSearchResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     suspectValidatedChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 return true;
            //             });

            //             debt_set_validated.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 quoteSentDate: quoteSentDate,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 email48h: email48h,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 dateLPOValidated: dateLPOValidated,
            //                 child: suspectValidatedChildDataSet
            //             });




            //             return true;
            //         });
            //     }



            //     console.log(debt_set_validated)
            // }

            // //STATUSES - SUSPECT - HOT / SUSPECT QUALIFIED / SUSPECT - NEW /  SUSPECT - RE REASSIGN / SUSPECT - REJECTED / SUSPECT - NO ANSWER / SUSPECT - IN CONTACT /SUSPECT - PARKING LOT
            // if (custStatus == '57' || custStatus == '42' || custStatus == '6' || custStatus == '60' || custStatus == '7' || custStatus == '20' || custStatus == '69' || custStatus == '62') {
            //     //Website Leads - Suspects
            //     var suspectsSearch = search.load({
            //         type: 'customer',
            //         id: 'customsearch_web_leads_suspects'
            //     });

            //     if (!isNullorEmpty(zee_id)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'partner',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: zee_id
            //         }));
            //     }

            //     console.log('userId: ' + userId)

            //     if (!isNullorEmpty(paramUserId)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: paramUserId
            //         }));
            //     } else if (role != 3 && isNullorEmpty(paramUserId) && userId != 653718) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_assigned',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: userId
            //         }));
            //     }

            //     if (!isNullorEmpty(salesCampaign)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'custrecord_sales_campaign',
            //             join: 'custrecord_sales_customer',
            //             operator: search.Operator.IS,
            //             values: salesCampaign
            //         }));
            //     }

            //     if (!isNullorEmpty(custStatus)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'entitystatus',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: custStatus
            //         }));
            //     }

            //     if (!isNullorEmpty(source)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'leadsource',
            //             join: null,
            //             operator: search.Operator.IS,
            //             values: source
            //         }));
            //     }

            //     if (!isNullorEmpty(parentLPOInternalId)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'internalid',
            //             join: 'custentity_lpo_parent_account',
            //             operator: search.Operator.IS,
            //             values: parentLPOInternalId
            //         }));
            //     }

            //     if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORAFTER,
            //             values: date_from
            //         }));

            //         suspectsSearch.filters.push(search.createFilter({
            //             name: 'custentity_date_lead_entered',
            //             join: null,
            //             operator: search.Operator.ONORBEFORE,
            //             values: date_to
            //         }));
            //     }

            //     var suspectsSearchCount = suspectsSearch.runPaged().count;

            //     console.log('suspects count: ' + suspectsSearchCount);

            //     if (suspectsSearchCount > 25) {
            //         var val1 = currentRecord.get();
            //         var page_no = val1.getValue({
            //             fieldId: 'custpage_page_no',
            //         });

            //         var totalPageCount = parseInt(suspectsSearchCount / 25) + 1;
            //         var rangeStart = (parseInt(page_no) - 1) * 26;
            //         var rangeEnd = rangeStart + 25;

            //         val1.setValue({
            //             fieldId: 'custpage_total_page_no',
            //             value: totalPageCount
            //         });


            //         console.log('start: ' + rangeStart);
            //         console.log('end: ' + rangeEnd)


            //         var suspectsSearchResultSet = suspectsSearch.run().getRange({
            //             start: rangeStart,
            //             end: rangeEnd
            //         });

            //         for (var i = 0; i < suspectsSearchResultSet.length; i++) {
            //             var custInternalID = suspectsSearchResultSet[i].getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = suspectsSearchResultSet[i].getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = suspectsSearchResultSet[i].getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = suspectsSearchResultSet[i].getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = suspectsSearchResultSet[i].getText({
            //                 name: 'partner'
            //             });

            //             var dateLeadEntered = suspectsSearchResultSet[i].getValue({
            //                 name: "custentity_date_lead_entered"
            //             });

            //             var email = suspectsSearchResultSet[i].getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = suspectsSearchResultSet[i].getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = suspectsSearchResultSet[i].getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = suspectsSearchResultSet[i].getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = suspectsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = suspectsSearchResultSet[i].getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = suspectsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = suspectsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = suspectsSearchResultSet[i].getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = suspectsSearchResultSet[i].getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = suspectsSearchResultSet[i].getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = suspectsSearchResultSet[i].getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = suspectsSearchResultSet[i].getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var servicesOfInterest = suspectsSearchResultSet[i].getText({
            //                 name: 'custentity_services_of_interest'
            //             });

            //             var salesRecordId = suspectsSearchResultSet[i].getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = suspectsSearchResultSet[i].getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = suspectsSearchResultSet[i].getText({
            //                 name: 'leadsource'
            //             });

            //             var linkedLPOName = suspectsSearchResultSet[i].getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });



            //             //Website Leads - Suspects - Activity List
            //             var suspectActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_prosp_quote_sen_9'
            //             });

            //             suspectActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var suspectChildDataSet = [];

            //             suspectActivityListSearch.run().each(function (
            //                 suspectActivityListSearchResultSet) {
            //                 var activityInternalID = suspectActivityListSearchResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = suspectActivityListSearchResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = suspectActivityListSearchResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(suspectActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = suspectActivityListSearchResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = suspectActivityListSearchResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = suspectActivityListSearchResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     suspectChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 return true;
            //             });

            //             console.log('suspectChildDataSet: ' + JSON.stringify(suspectChildDataSet))



            //             debt_set4.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 dateLeadEntered: dateLeadEntered,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 servicesOfInterest: servicesOfInterest,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 child: suspectChildDataSet
            //             });

            //         }

            //     } else {
            //         suspectsSearch.run().each(function (
            //             suspectsSearchResultSet) {

            //             var custInternalID = suspectsSearchResultSet.getValue({
            //                 name: 'internalid'
            //             });
            //             var custEntityID = suspectsSearchResultSet.getValue({
            //                 name: 'entityid'
            //             });
            //             var custName = suspectsSearchResultSet.getValue({
            //                 name: 'companyname'
            //             });
            //             var zeeID = suspectsSearchResultSet.getValue({
            //                 name: 'partner'
            //             });
            //             var zeeName = suspectsSearchResultSet.getText({
            //                 name: 'partner'
            //             });

            //             var dateLeadEntered = suspectsSearchResultSet.getValue({
            //                 name: "custentity_date_lead_entered"
            //             });

            //             var email = suspectsSearchResultSet.getValue({
            //                 name: 'email'
            //             });
            //             var serviceEmail = suspectsSearchResultSet.getValue({
            //                 name: 'custentity_email_service'
            //             });

            //             var phone = suspectsSearchResultSet.getValue({
            //                 name: 'phone'
            //             });

            //             var statusText = suspectsSearchResultSet.getText({
            //                 name: 'entitystatus'
            //             });

            //             var salesRepId = suspectsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var salesRepName = suspectsSearchResultSet.getText({
            //                 name: 'custrecord_sales_assigned',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateFirstNoContact = suspectsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day0call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateSecondNoContact = suspectsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day14call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var dateThirdNoContact = suspectsSearchResultSet.getValue({
            //                 name: 'custrecord_sales_day25call',
            //                 join: 'CUSTRECORD_SALES_CUSTOMER'
            //             });

            //             var contactid = suspectsSearchResultSet.getValue({
            //                 name: 'internalid',
            //                 join: 'contact'
            //             });

            //             var contactName = suspectsSearchResultSet.getValue({
            //                 name: 'entityid',
            //                 join: 'contact'
            //             });


            //             var contactEmail = suspectsSearchResultSet.getValue({
            //                 name: 'email',
            //                 join: 'contact'
            //             });

            //             var email48h = suspectsSearchResultSet.getText({
            //                 name: 'custentity_48h_email_sent'
            //             });

            //             var servicesOfInterest = suspectsSearchResultSet.getText({
            //                 name: 'custentity_services_of_interest'
            //             });

            //             var salesRecordId = suspectsSearchResultSet.getText({
            //                 name: "internalid",
            //                 join: "CUSTRECORD_SALES_CUSTOMER"
            //             });

            //             var productUsageperWeek = suspectsSearchResultSet.getText({
            //                 name: 'custentity_form_mpex_usage_per_week'
            //             });

            //             var leadSource = suspectsSearchResultSet.getText({
            //                 name: 'leadsource'
            //             });

            //             var linkedLPOName = suspectsSearchResultSet.getText({
            //                 name: 'custentity_lpo_parent_account'
            //             });


            //             //Website Leads - Suspects - Activity List
            //             var suspectActivityListSearch = search.load({
            //                 type: 'customer',
            //                 id: 'customsearch_web_leads_prosp_quote_sen_9'
            //             });

            //             suspectActivityListSearch.filters.push(search.createFilter({
            //                 name: 'internalid',
            //                 join: null,
            //                 operator: search.Operator.ANYOF,
            //                 values: custInternalID
            //             }));

            //             var suspectChildDataSet = [];

            //             suspectActivityListSearch.run().each(function (
            //                 suspectActivityListSearchResultSet) {
            //                 var activityInternalID = suspectActivityListSearchResultSet.getValue({
            //                     name: "internalid",
            //                     join: "activity"
            //                 })
            //                 var activityStartDate = suspectActivityListSearchResultSet.getValue({
            //                     name: "startdate",
            //                     join: "activity"
            //                 })
            //                 var activityTitle = suspectActivityListSearchResultSet.getValue({
            //                     name: "title",
            //                     join: "activity"
            //                 })
            //                 if (isNullorEmpty(suspectActivityListSearchResultSet.getText({
            //                     name: "custevent_organiser",
            //                     join: "activity"
            //                 }))) {
            //                     var activityOrganiser = suspectActivityListSearchResultSet.getText({
            //                         name: "assigned",
            //                         join: "activity"
            //                     })
            //                 } else {
            //                     var activityOrganiser = suspectActivityListSearchResultSet.getText({
            //                         name: "custevent_organiser",
            //                         join: "activity"
            //                     })
            //                 }

            //                 var activityMessage = suspectActivityListSearchResultSet.getValue({
            //                     name: "message",
            //                     join: "activity"
            //                 })

            //                 if (!isNullorEmpty(activityTitle)) {
            //                     suspectChildDataSet.push({
            //                         activityInternalID: activityInternalID,
            //                         activityStartDate: activityStartDate,
            //                         activityTitle: activityTitle,
            //                         activityOrganiser: activityOrganiser,
            //                         activityMessage: activityMessage
            //                     });
            //                 }

            //                 return true;
            //             });

            //             console.log('suspectChildDataSet: ' + JSON.stringify(suspectChildDataSet))

            //             debt_set4.push({
            //                 custInternalID: custInternalID,
            //                 custEntityID: custEntityID,
            //                 custName: custName,
            //                 zeeID: zeeID,
            //                 zeeName: zeeName,
            //                 dateLeadEntered: dateLeadEntered,
            //                 contactName: contactName,
            //                 email: email,
            //                 serviceEmail: serviceEmail,
            //                 phone: phone,
            //                 statusText: statusText,
            //                 leadSource: leadSource,
            //                 linkedLPOName: linkedLPOName,
            //                 salesRepId: salesRepId,
            //                 salesRepName: salesRepName,
            //                 dateFirstNoContact: dateFirstNoContact,
            //                 dateSecondNoContact: dateSecondNoContact,
            //                 dateThirdNoContact: dateThirdNoContact,
            //                 contactid: contactid,
            //                 contactEmail: contactEmail,
            //                 servicesOfInterest: servicesOfInterest,
            //                 salesRecordId: salesRecordId,
            //                 productUsageperWeek: productUsageperWeek,
            //                 child: suspectChildDataSet
            //             });

            //             return true;
            //         });
            //         console.log(debt_set4)
            //     }




            // }

            loadDatatable(debt_set, debt_set4);
            debt_set = [];

        }

        function loadDatatable(debt_rows, debt_rows4) {

            debtDataSet = [];
            csvSet = [];

            debtDataSet2 = [];
            csvSet2 = [];

            if (!isNullorEmpty(debt_rows)) {
                debt_rows.forEach(function (debt_row, index) {

                    if (!isNullorEmpty(debt_row.salesRecordId)) {
                        var linkURL =
                            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_row.custInternalID + '&sales_record_id=' + debt_row.salesRecordId +
                            '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
                    } else {
                        var linkURL = '<input type="button" id="" data-id="' +
                            debt_row.custInternalID +
                            '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
                    }



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
                        '" data-salesrecordid="' +
                        debt_row.salesRecordId +
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


                    debtDataSet.push(['', linkURL, debt_row.custInternalID,
                        customerIDLink,
                        debt_row.custName, debt_row.zeeName, debt_row.statusText, debt_row.leadSource, debt_row.linkedLPOName, debt_row.contactName,
                        debt_row.serviceEmail,
                        debt_row.phone, commDateFormatted, debt_row.email48h, debt_row.salesRepName, debt_row.dateFirstNoContact, debt_row.dateSecondNoContact, debt_row.dateThirdNoContact, debt_row.rowColorSort, debt_row.productUsageperWeek, sendSignUpEmail, debt_row.child
                    ]);
                });
            }

            var datatable = $('#mpexusage-prospects').DataTable();
            datatable.clear();
            datatable.rows.add(debtDataSet);
            datatable.draw();

            datatable.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-prospects tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = datatable.row(tr);

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


            // if (!isNullorEmpty(debt_rows2)) {
            //     debt_rows2.forEach(function (debt_row2, index) {

            //         if (!isNullorEmpty(debt_row2.salesRecordId)) {
            //             var linkURL =
            //                 '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_row2.custInternalID + '&sales_record_id=' + debt_row2.salesRecordId +
            //                 '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
            //         } else {
            //             var linkURL = '<input type="button" id="" data-id="' +
            //                 debt_row2.custInternalID +
            //                 '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
            //         }



            //         var customerIDLink =
            //             '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
            //             debt_row2.custInternalID + '&whence=" target="_blank"><b>' +
            //             debt_row2.custEntityID + '</b></a>';

            //         var sendSignUpEmail =
            //             '<a data-id="' +
            //             debt_row2.custInternalID +
            //             '" data-sales="' +
            //             debt_row2.salesRepId +
            //             '" data-contact="' +
            //             debt_row2.contactid +
            //             '" data-contactemail="' +
            //             debt_row2.contactEmail +
            //             '" data-salesrecordid="' +
            //             debt_row2.salesRecordId +
            //             '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

            //         var commDateSplit = debt_row2.quoteSentDate.split('/');

            //         var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
            //             commDateSplit[0]);
            //         var commDateParsed = format.parse({
            //             value: commDate,
            //             type: format.Type.DATE
            //         });
            //         var commDateFormatted = format.format({
            //             value: commDate,
            //             type: format.Type.DATE
            //         });


            //         debtDataSet2.push(['', linkURL, debt_row2.custInternalID,
            //             customerIDLink,
            //             debt_row2.custName, debt_row2.zeeName, debt_row2.statusText, debt_row2.leadSource, debt_row2.linkedLPOName, debt_row2.contactName,
            //             debt_row2.serviceEmail,
            //             debt_row2.phone, commDateFormatted, debt_row2.email48h, debt_row2.salesRepName, debt_row2.dateFirstNoContact, debt_row2.dateSecondNoContact, debt_row2.dateThirdNoContact, debt_row2.productUsageperWeek, sendSignUpEmail, debt_row2.child
            //         ]);
            //     });
            // }

            // var datatable2 = $('#mpexusage-opportunities').DataTable();
            // datatable2.clear();
            // datatable2.rows.add(debtDataSet2);
            // datatable2.draw();

            // datatable2.rows().every(function () {
            //     // this.child(format(this.data())).show();
            //     this.child(createChild3(this)) // Add Child Tables
            //     this.child.hide(); // Hide Child Tables on Open
            // });

            // $('#mpexusage-opportunities tbody').on('click', 'td.dt-control', function () {

            //     var tr = $(this).closest('tr');
            //     var row = datatable2.row(tr);

            //     if (row.child.isShown()) {
            //         // This row is already open - close it
            //         destroyChild(row);
            //         tr.removeClass('shown');
            //         tr.removeClass('parent');

            //         $('.expand-button').addClass('btn-primary');
            //         $('.expand-button').removeClass('btn-light')
            //     } else {
            //         // Open this row
            //         row.child.show();
            //         tr.addClass('shown');
            //         tr.addClass('parent');

            //         $('.expand-button').removeClass('btn-primary');
            //         $('.expand-button').addClass('btn-light')
            //     }
            // });


            // if (!isNullorEmpty(debt_rows3)) {
            //     debt_rows3.forEach(function (debt_row3, index) {

            //         if (!isNullorEmpty(debt_row3.salesRecordId)) {
            //             var linkURL =
            //                 '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_row3.custInternalID + '&sales_record_id=' + debt_row3.salesRecordId +
            //                 '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
            //         } else {
            //             var linkURL = '<input type="button" id="" data-id="' +
            //                 debt_row3.custInternalID +
            //                 '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
            //         }



            //         var customerIDLink =
            //             '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
            //             debt_row3.custInternalID + '&whence=" target="_blank"><b>' +
            //             debt_row3.custEntityID + '</b></a>';

            //         var sendSignUpEmail =
            //             '<a data-id="' +
            //             debt_row3.custInternalID +
            //             '" data-sales="' +
            //             debt_row3.salesRepId +
            //             '" data-contact="' +
            //             debt_row3.contactid +
            //             '" data-contactemail="' +
            //             debt_row3.contactEmail +
            //             '" data-salesrecordid="' +
            //             debt_row3.salesRecordId +
            //             '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

            //         if (!isNullorEmpty(debt_row3.quoteSentDate)) {
            //             var commDateSplit = debt_row3.quoteSentDate.split('/');

            //             var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
            //                 commDateSplit[0]);
            //             var commDateParsed = format.parse({
            //                 value: commDate,
            //                 type: format.Type.DATE
            //             });
            //             var commDateFormatted = format.format({
            //                 value: commDate,
            //                 type: format.Type.DATE
            //             });
            //         } else {
            //             var commDateFormatted = ''
            //         }



            //         debtDataSet3.push(['', linkURL, debt_row3.custInternalID,
            //             customerIDLink,
            //             debt_row3.custName, debt_row3.zeeName, debt_row3.statusText, debt_row3.leadSource, debt_row3.linkedLPOName, debt_row3.contactName,
            //             debt_row3.serviceEmail,
            //             debt_row3.phone, commDateFormatted, debt_row3.email48h, debt_row3.salesRepName, debt_row3.dateFirstNoContact, debt_row3.dateSecondNoContact, debt_row3.dateThirdNoContact, debt_row3.productUsageperWeek, sendSignUpEmail, debt_row3.child
            //         ]);
            //     });
            // }

            // var datatable3 = $('#mpexusage-followups').DataTable();
            // datatable3.clear();
            // datatable3.rows.add(debtDataSet3);
            // datatable3.draw();

            // datatable3.rows().every(function () {
            //     // this.child(format(this.data())).show();
            //     this.child(createChild3(this)) // Add Child Tables
            //     this.child.hide(); // Hide Child Tables on Open
            // });

            // $('#mpexusage-followups tbody').on('click', 'td.dt-control', function () {

            //     var tr = $(this).closest('tr');
            //     var row = datatable3.row(tr);

            //     if (row.child.isShown()) {
            //         // This row is already open - close it
            //         destroyChild(row);
            //         tr.removeClass('shown');
            //         tr.removeClass('parent');

            //         $('.expand-button').addClass('btn-primary');
            //         $('.expand-button').removeClass('btn-light')
            //     } else {
            //         // Open this row
            //         row.child.show();
            //         tr.addClass('shown');
            //         tr.addClass('parent');

            //         $('.expand-button').removeClass('btn-primary');
            //         $('.expand-button').addClass('btn-light')
            //     }
            // });

            // if (!isNullorEmpty(debt_set_validated_rows)) {
            //     debt_set_validated_rows.forEach(function (debt_set_validated_row, index) {

            //         if (!isNullorEmpty(debt_set_validated_row.salesRecordId)) {
            //             var linkURL =
            //                 '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_set_validated_row.custInternalID + '&sales_record_id=' + debt_set_validated_row.salesRecordId +
            //                 '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
            //         } else {
            //             var linkURL = '<input type="button" id="" data-id="' +
            //                 debt_set_validated_row.custInternalID +
            //                 '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
            //         }



            //         var customerIDLink =
            //             '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
            //             debt_set_validated_row.custInternalID + '&whence=" target="_blank"><b>' +
            //             debt_set_validated_row.custEntityID + '</b></a>';

            //         var sendSignUpEmail =
            //             '<a data-id="' +
            //             debt_set_validated_row.custInternalID +
            //             '" data-sales="' +
            //             debt_set_validated_row.salesRepId +
            //             '" data-contact="' +
            //             debt_set_validated_row.contactid +
            //             '" data-contactemail="' +
            //             debt_set_validated_row.contactEmail +
            //             '" data-salesrecordid="' +
            //             debt_set_validated_row.salesRecordId +
            //             '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

            //         if (!isNullorEmpty(debt_set_validated_row.quoteSentDate)) {
            //             var commDateSplit = debt_set_validated_row.quoteSentDate.split('/');

            //             var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
            //                 commDateSplit[0]);
            //             var commDateParsed = format.parse({
            //                 value: commDate,
            //                 type: format.Type.DATE
            //             });
            //             var commDateFormatted = format.format({
            //                 value: commDate,
            //                 type: format.Type.DATE
            //             });
            //         } else {
            //             var commDateFormatted = ''
            //         }


            //         if (!isNullorEmpty(debt_set_validated_row.dateLPOValidated)) {
            //             var commDateLPOValidatedSplit = debt_set_validated_row.dateLPOValidated.split('/');

            //             var commDateLPOValidated = new Date(commDateLPOValidatedSplit[2], commDateLPOValidatedSplit[1] - 1,
            //                 commDateLPOValidatedSplit[0]);
            //             var commDateLPOValidatedParsed = format.parse({
            //                 value: commDateLPOValidated,
            //                 type: format.Type.DATE
            //             });
            //             var commDateLPOValidatedFormatted = format.format({
            //                 value: commDateLPOValidated,
            //                 type: format.Type.DATE
            //             });
            //         } else {
            //             var commDateLPOValidatedFormatted = ''
            //         }



            //         debtDataSet3.push(['', linkURL, commDateLPOValidatedFormatted, debt_set_validated_row.custInternalID,
            //             customerIDLink,
            //             debt_set_validated_row.custName, debt_set_validated_row.zeeName, debt_set_validated_row.statusText, debt_set_validated_row.leadSource, debt_set_validated_row.linkedLPOName, debt_set_validated_row.contactName,
            //             debt_set_validated_row.serviceEmail,
            //             debt_set_validated_row.phone, debt_set_validated_row.email48h, debt_set_validated_row.salesRepName, debt_set_validated_row.dateFirstNoContact, debt_set_validated_row.dateSecondNoContact, debt_set_validated_row.dateThirdNoContact, debt_set_validated_row.productUsageperWeek, sendSignUpEmail, debt_set_validated_row.child
            //         ]);
            //     });
            // }

            // var datatableValidated = $('#mpexusage-validated').DataTable();
            // datatableValidated.clear();
            // datatableValidated.rows.add(debtDataSet3);
            // datatableValidated.draw();

            // datatableValidated.rows().every(function () {
            //     // this.child(format(this.data())).show();
            //     this.child(createChild3(this)) // Add Child Tables
            //     this.child.hide(); // Hide Child Tables on Open
            // });

            // $('#mpexusage-validated tbody').on('click', 'td.dt-control', function () {

            //     var tr = $(this).closest('tr');
            //     var row = datatableValidated.row(tr);

            //     if (row.child.isShown()) {
            //         // This row is already open - close it
            //         destroyChild(row);
            //         tr.removeClass('shown');
            //         tr.removeClass('parent');

            //         $('.expand-button').addClass('btn-primary');
            //         $('.expand-button').removeClass('btn-light')
            //     } else {
            //         // Open this row
            //         row.child.show();
            //         tr.addClass('shown');
            //         tr.addClass('parent');

            //         $('.expand-button').removeClass('btn-primary');
            //         $('.expand-button').addClass('btn-light')
            //     }
            // });


            if (!isNullorEmpty(debt_rows4)) {
                debt_rows4.forEach(function (debt_row4, index) {

                    if (!isNullorEmpty(debt_row4.salesRecordId)) {
                        var linkURL =
                            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_row4.custInternalID + '&sales_record_id=' + debt_row4.salesRecordId +
                            '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
                    } else {
                        var linkURL = '<input type="button" id="" data-id="' +
                            debt_row4.custInternalID +
                            '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
                    }



                    var customerIDLink =
                        '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                        debt_row4.custInternalID + '&whence=" target="_blank"><b>' +
                        debt_row4.custEntityID + '</b></a>';

                    if (debt_row4.zeeName == 'Mailplus Pty Ltd') {
                        var sendSignUpEmail = 'Not Assigned to Franchisee'
                    } else {

                        //NS Search: Product Pricing - Letters - Quotes
                        var prodPricingLetterstobeSentSearch = nlapiLoadSearch('customrecord_product_pricing', 'customsearch_prod_pricing_letters_quotes');

                        var newFilters = new Array();
                        newFilters[newFilters.length] = new nlobjSearchFilter(
                            'internalid', 'custrecord_prod_pricing_customer', 'anyof', debt_row4.custInternalID);

                        prodPricingLetterstobeSentSearch.addFilters(newFilters);

                        var resultSetProdPricingLetters = prodPricingLetterstobeSentSearch.runSearch();

                        var countProdPricing = 0;
                        resultSetProdPricingLetters.forEachResult(function (searchResult) {
                            countProdPricing++;
                            return true;
                        });

                        if (countProdPricing == 2) {
                            var sendSignUpEmail =
                                '<a data-id="' +
                                debt_row4.custInternalID +
                                '" data-sales="' +
                                debt_row4.salesRepId +
                                '" data-contact="' +
                                debt_row4.contactid +
                                '" data-contactemail="' +
                                debt_row4.contactEmail +
                                '" data-salesrecordid="' +
                                debt_row4.salesRecordId +
                                '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail"><b>SEND EMAIL</b></a>';
                        } else {
                            var sendSignUpEmail =
                                '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1590&deploy=1&compid=1048144&customerid=' +
                                debt_row4.custInternalID + '&whence=" target="_blank"><b>Create Product Pricing</b></a>';
                        }


                    }


                    var commDateSplit = debt_row4.dateLeadEntered.split('/');

                    if (commDateSplit[1] < 10) {
                        commDateSplit[1] = '0' + commDateSplit[1]
                    }

                    if (commDateSplit[0] < 10) {
                        commDateSplit[0] = '0' + commDateSplit[0]
                    }

                    var newDate = commDateSplit[2] + '-' + commDateSplit[1] + '-' + commDateSplit[0]

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


                    debtDataSet4.push(['', linkURL, newDate, debt_row4.custInternalID,
                        customerIDLink,
                        debt_row4.custName, debt_row4.zeeName, debt_row4.statusText, debt_row4.leadSource, debt_row4.linkedLPOName, debt_row4.contactName,
                        debt_row4.serviceEmail,
                        debt_row4.phone, debt_row4.servicesOfInterest, debt_row4.salesRepName, debt_row4.dateFirstNoContact, debt_row4.dateSecondNoContact, debt_row4.dateThirdNoContact, debt_row4.productUsageperWeek, sendSignUpEmail, debt_row4.child
                    ]);
                });
            }

            var datatable4 = $('#mpexusage-suspects').DataTable();
            datatable4.clear();
            datatable4.rows.add(debtDataSet4);
            datatable4.draw();

            datatable4.rows().every(function () {
                // this.child(format(this.data())).show();
                this.child(createChild3(this)) // Add Child Tables
                this.child.hide(); // Hide Child Tables on Open
            });

            $('#mpexusage-suspects tbody').on('click', 'td.dt-control', function () {

                var tr = $(this).closest('tr');
                var row = datatable4.row(tr);

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

            return true;
        }

        function createChild(row) {
            // This is the table we'll convert into a DataTable
            var table = $('<table class="display" width="50%"/>');
            var childSet = [];
            row.data()[21].forEach(function (el) {

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
            row.data()[20].forEach(function (el) {

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
            // onclick_NoResponse: onclick_NoResponse
        }
    });
