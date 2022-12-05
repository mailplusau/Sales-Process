/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-01T09:59:04+11:00
 * Module Description: Page that lists customres that are commencing today or have not been onboarded.
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-24T10:22:39+11:00
 */



define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect','N/url'],
    function (ui, email, runtime, search, record, https, log, redirect, url) {
        var role = 0;
        var userId = 0;
        var zee = 0;

        function onRequest(context) {
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }
            userId = runtime.getCurrentUser().id;

            role = runtime.getCurrentUser().role;

            if (context.request.method === 'GET') {

                var start_date = context.request.parameters.start_date;
                var last_date = context.request.parameters.last_date;
                zee = context.request.parameters.zee;
                userId = context.request.parameters.user_id;

                if (isNullorEmpty(start_date)) {
                    start_date = null;
                }

                if (isNullorEmpty(last_date)) {
                    last_date = null;
                }

                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                var form = ui.createForm({
                    title: 'Prospect Quote Sent - List'
                });


                var inlineHtml =
                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;} @-webkit-keyframes animatetop {from {top:-300px; opacity:0} to {top:0; opacity:1}}@keyframes animatetop {from {top:-300px; opacity:0}to {top:0; opacity:1}}</style>';

                form.addField({
                    id: 'custpage_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_customer_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_sales_rep_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_contact_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_contact_email',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })





                //Display the modal pop-up to edit the customer details
                inlineHtml += updateCustomerModal();

                //Loading Section that gets displayed when the page is being loaded
                inlineHtml += loadingSection();
                inlineHtml += '<div id="container"></div>'
                inlineHtml += dataTable();

                //Button to reload the page when the filters have been selected
                // form.addButton({
                //   id: 'submit_search',
                //   label: 'Submit Search',
                //   functionName: 'addFilters()'
                // });

                form.addSubmitButton({ label: '' });

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;

                form.clientScriptFileId = 6063171;

                context.response.writePage(form);
            } else {
                var customer_id = context.request.parameters.custpage_customer_id;
                var sales_rep_id = context.request.parameters.custpage_sales_rep_id;
                var contact_id = context.request.parameters.custpage_contact_id;
                var contact_email = context.request.parameters.custpage_contact_email;

                log.debug({
                    title: 'customer_id id ISS',
                    details: customer_id
                });

                log.debug({
                    title: 'sales_rep_id id ISS',
                    details: sales_rep_id
                });

                log.debug({
                    title: 'contact_id id ISS',
                    details: contact_id
                });

                log.debug({
                    title: 'contact_email id ISS',
                    details: contact_email
                });


                var userid = encodeURIComponent(runtime.getCurrentUser().id);

                var suiteletUrl = 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=148';
                suiteletUrl += '&recid=' + customer_id + '&salesrep=' + sales_rep_id + '&dear=' + '' + '&contactid=' + contact_id + '&userid=' + userid;

                var response = https.get({
                    url: suiteletUrl
                });

                log.debug({
                    title: 'response id ISS',
                    details: response
                });


                var emailHtml = response.body;

                log.debug({
                    title: 'emailHtml',
                    details: emailHtml
                });

                email.send({
                    author: 112209,
                    body: emailHtml,
                    recipients: contact_email,
                    subject: 'Your MailPlus enquiry: Prices',
                    relatedRecords: { entityId: customer_id },
                });


                redirect.toSuitelet({
                    scriptId: 'customscript_sl2_prospect_quote_sent',
                    deploymentId: 'customdeploy1',
                    parameters: null
                });
            }
        }


        /*
         * PURPOSE : HTML code to generate the Modal Pop-up
         *  PARAMS :  -
         * RETURNS : HTML
         *   NOTES :
         */
        function updateCustomerModal() {

            var yes_no_search = search.create({
                type: 'customlist107_2',
                columns: [{
                    name: 'name'
                }, {
                    name: 'internalId'
                }]
            });


            var resultSetYesNo = yes_no_search.run();
            var inlineHtml =
                '<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">Lost Reasons</h3></div>';

            inlineHtml +=
                '<div class="modal-body" style="padding: 2px 16px;">';
            inlineHtml +=
                '<div class="form-group container mpex_customer2_section">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-4 mpex_customer"><input type="text" id="customerInternalID" value="" hidden/>'
            inlineHtml +=
                '<select class="form-control service_cancellation_reason text-center">';

            inlineHtml +=
                ' <option value="0"></option><option value="46">Lost - Off Peak</option><option value="48">Lost - Over 5Kg</option><option value="47">Lost - Box Solution</option><option value="45">Lost – Integration / IT</option><option value="39">Unserviceable Territory</option><option value="29">Unserviceable Banking</option><option value="37">Duplicate Customer</option><option value="41">No Response</option><option value="40">Not a Lead</option><option value="17">Not Interested</option><option value="18">Price</option>'

            inlineHtml += '</select>';


            inlineHtml += '</div > ';

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="Save" class="form-control btn-primary" id="customerOnboardingCompleted" style=""/></div></div></div>';

            return inlineHtml;

        }


        /**
         * The table that will display the differents invoices linked to the franchisee and the time period.
         * @return  {String}    inlineHtml
         */
        function dataTable() {
            var inlineHtml =
                '<style>table#customer_benchmark_preview {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#customer_benchmark_preview th{text-align: center;} .bolded{font-weight: bold;}</style>';
            inlineHtml +=
                '<table id="customer_benchmark_preview" class="table table-responsive table-striped customer tablesorter hide" style="width: 100%;">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
            inlineHtml += '<tr class="text-center">';
            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml +=
                '<tbody id="result_customer_benchmark" class="result-customer_benchmark"></tbody>';

            inlineHtml += '</table>';
            return inlineHtml;
        }

        /**
         * The header showing that the results are loading.
         * @returns {String} `inlineQty`
         */
        function loadingSection() {
            var inlineHtml =
                '<div id="loading_section" class="form-group container loading_section " style="text-align:center">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 loading_div">';
            inlineHtml += '<h1>Loading...</h1>';
            inlineHtml += '</div></div></div>';

            return inlineHtml;
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
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }
        return {
            onRequest: onRequest
        };
    });
