/** 
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * 
 * Author:               Ankith Ravindran
 * Created on:           Mon Oct 09 2023
 * Modified on:          Mon Oct 09 2023 09:36:51
 * SuiteScript Version:  2.0 
 * Description:           
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

        var buttonClicked = '';

        var baseURL = 'https://1048144.app.netsuite.com';
        if (runtime.EnvType == "SANDBOX") {
            baseURL = 'https://1048144-sb3.app.netsuite.com';
        }

        role = runtime.getCurrentUser().role;
        var userName = runtime.getCurrentUser().name;
        var userId = runtime.getCurrentUser().id;
        var currRec = currentRecord.get();


        function pageInit() {

            $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
            $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
            $("#body").css("background-color", "#CFE0CE");
            $('#alert').hide();
            $("#tbl_submitter").css("display", "none");

            pageLoad();

            $(document).on('click', '#alert .close', function (e) {
                $(this).parent().hide();
            });

            $(document).on('click', '#updateSalesRecord', function (e) {
                buttonClicked = 'update';
                $('#submitter').trigger('click');
            });

            // $(document).on('click', '#lpo', function (e) {
            //     buttonClicked = 'lpo';
            //     $('#submitter').trigger('click');
            // });

            // $(document).on('click', '#decline', function (e) {
            //     buttonClicked = 'decline';
            //     var val1 = currentRecord.get();
            //     var customerInternalId = val1.getValue({
            //         fieldId: 'custpage_customer_internal_id'
            //     });
            //     var convertLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1722&deploy=1&compid=1048144&custid=' + parseInt(customerInternalId);
            //     window.location.href = convertLink;
            // });

        }

        function pageLoad() {

            $('.additional_lead_header_section').removeClass('hide');
            $('.additional_lead_section').removeClass('hide');
            $('.qualification_buttons').removeClass('hide');
            $('.salesrep_section').removeClass('hide');
            $('.loading_section').addClass('hide');
        }

        function showAlert(message) {
            $('#alert').html('<button type="button" class="close">&times;</button>' +
                message);
            $('#alert').show();
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0;
            // $(window).scrollTop($('#alert').offset().top);
        }

        function saveRecord() {

            var abn = $('#abn').val();
            var website = $('#website').val();
            var phone = $('#phone').val();
            var carrier = $('#carrier').val();
            var campaign = $('#sales_campaign').val();
            var salesRep = $('#sales_rep').val();

            var val1 = currentRecord.get();
            var customerInternalId = val1.getValue({
                fieldId: 'custpage_customer_internal_id'
            });
            var salesRecordInternalId = val1.getValue({
                fieldId: 'custpage_sales_record_internal_id'
            });

            if (isNullorEmpty(salesRep)) {
                showAlert(
                    'Please Select Sales Rep'
                );
                return false;
            }
            if (isNullorEmpty(campaign)) {
                showAlert(
                    'Please Select Campaign'
                );
                return false;
            }

            // verify_abn(abn);
            // validatePhone(phone);

            // if (isNullorEmpty(website)) {
            //     showAlert(
            //         'Please enter the Website URL'
            //     );
            //     return false;
            // }

            // if (isNullorEmpty(carrier)) {
            //     showAlert(
            //         'Please Select the current Carrier'
            //     );
            //     return false;
            // }


            if (buttonClicked == 'update') {
                val1.setValue({
                    fieldId: 'custpage_button_clicked',
                    value: 'update'
                });
            }
            // } else if (buttonClicked == 'decline') {
            //     val1.setValue({
            //         fieldId: 'custpage_button_clicked',
            //         value: 'decline'
            //     });
            // } else if (buttonClicked == 'lpo') {
            //     val1.setValue({
            //         fieldId: 'custpage_button_clicked',
            //         value: 'lpo'
            //     });
            //     campaign = 69;
            // }

            var date = new Date();
            var date_now = format.parse({
                value: date,
                type: format.Type.DATE
            });
            var time_now = format.parse({
                value: date,
                type: format.Type.TIMEOFDAY
            });

            var salesRecord = record.load({
                type: 'customrecord_sales',
                id: salesRecordInternalId,
            });

            salesRecord.setValue({
                fieldId: 'custrecord_sales_campaign',
                value: campaign,
            })
            salesRecord.setValue({
                fieldId: 'custrecord_sales_assigned',
                value: salesRep,
            })

            salesRecord.save({
                ignoreMandatoryFields: true
            });


            return true;
        }

        /**
         * @description
         * @author Ankith Ravindran (AR)
         * @date 09/10/2023
         * @param {*} val
         * @returns {*} 
         */
        function validatePhone(val) {

            var digits = val.replace(/[^0-9]/g, '');
            var australiaPhoneFormat =
                /^(\+\d{2}[ \-]{0,1}){0,1}(((\({0,1}[ \-]{0,1})0{0,1}\){0,1}[2|3|7|8]{1}\){0,1}[ \-]*(\d{4}[ \-]{0,1}\d{4}))|(1[ \-]{0,1}(300|800|900|902)[ \-]{0,1}((\d{6})|(\d{3}[ \-]{0,1}\d{3})))|(13[ \-]{0,1}([\d \-]{5})|((\({0,1}[ \-]{0,1})0{0,1}\){0,1}4{1}[\d \-]{8,10})))$/;
            var phoneFirst6 = digits.substring(0, 6);
            //Check if all phone characters are numerals
            if (val != digits) {
                showAlert(
                    'Phone numbers should contain numbers only.\n\nPlease re-enter the phone number without spaces or special characters.'
                );
                return false;
            } else if (digits.length != 10) {
                //Check if phone is not blank, need to contains 10 digits
                showAlert('Please enter a 10 digit phone number with area code.');
                return false;
            } else if (!(australiaPhoneFormat.test(digits))) {
                //Check if valid Australian phone numbers have been entered
                showAlert(
                    'Please enter a valid Australian phone number.\n\nNote: 13 or 12 numbers are not accepted'
                );
                return false;
            } else if (digits.length == 10) {
                //Check if all 10 digits are the same numbers using checkDuplicate function
                if (checkDuplicate(digits)) {
                    showAlert('Please enter a valid 10 digit phone number.');
                    return false;
                }
            }
        }

        function checkDuplicate(digits) {
            var digit01 = digits.substring(0, 1);
            var digit02 = digits.substring(1, 2);
            var digit03 = digits.substring(2, 3);
            var digit04 = digits.substring(3, 4);
            var digit05 = digits.substring(4, 5);
            var digit06 = digits.substring(5, 6);
            var digit07 = digits.substring(6, 7);
            var digit08 = digits.substring(7, 8);
            var digit09 = digits.substring(8, 9);
            var digit10 = digits.substring(9, 10);

            if (digit01 == digit02 && digit02 == digit03 && digit03 == digit04 && digit04 ==
                digit05 && digit05 == digit06 && digit06 == digit07 && digit07 == digit08 &&
                digit08 == digit09 && digit09 == digit10) {
                return true;
            } else {
                return false;
            }
        }

        /**
         * @description
         * @author Ankith Ravindran (AR)
         * @date 09/10/2023
         * @param {*} str
         * @returns {*} 
         */
        function verify_abn(str) {

            if (!str || str.length !== 11) {
                alert('Invalid ABN');
                return false;
            }
            var weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
                checksum = str.split('').map(Number).reduce(
                    function (total, digit, index) {
                        if (!index) {
                            digit--;
                        }
                        return total + (digit * weights[index]);
                    },
                    0
                );

            if (!checksum || checksum % 89 !== 0) {
                showAlert('Invalid ABN');
                return false;
            }

            return true;
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

        function isNullorEmpty(strVal) {
            return (strVal == null || strVal == '' || strVal == 'null' || strVal == undefined || strVal == 'undefined' || strVal == '- None -');
        }

        return {
            pageInit: pageInit,
            saveRecord: saveRecord,
        }

    });