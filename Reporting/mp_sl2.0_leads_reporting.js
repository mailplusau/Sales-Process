/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-01T09:59:04+11:00
 * Module Description: Page that lists customres that are commencing today or have not been onboarded.
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-24T10:22:39+11:00
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect', 'N/url'],
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
                var showTotal = context.request.parameters.showTotal;

                var date = new Date(), y = date.getFullYear(), m = date.getMonth();
                var firstDay = new Date(y, m, 1);
                var lastDay = new Date(y, m + 1, 0);

                firstDay.setHours(0, 0, 0, 0);
                lastDay.setHours(0, 0, 0, 0);

                firstDay = GetFormattedDate(firstDay);
                lastDay = GetFormattedDate(lastDay);

                log.debug({
                    title: 'firstDay',
                    details: firstDay
                });

                log.debug({
                    title: 'lastDay',
                    details: lastDay
                });


                if (isNullorEmpty(start_date)) {
                    if (showTotal == 'T') {
                        start_date = null;
                    } else {
                        start_date = firstDay;
                    }

                }

                if (isNullorEmpty(last_date)) {
                    if (showTotal == 'T') {
                        last_date = null;
                    } else {
                        last_date = lastDay;
                    }

                }

                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                var form = ui.createForm({
                    title: 'Website Lead - Reporting'
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
                inlineHtml += dateFilterSection(start_date, last_date);
                inlineHtml += tabsSection();
                // inlineHtml += '<div id="container"></div>'
                inlineHtml += dataTable();

                //Button to reload the page when the filters have been selected
                // form.addButton({
                //   id: 'submit_search',
                //   label: 'Submit Search',
                //   functionName: 'addFilters()'
                // });

                // form.addSubmitButton({ label: '' });

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;

                form.clientScriptFileId = 6080422;

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

                if (!isNullorEmpty(contact_email)) {
                    email.send({
                        author: 112209,
                        body: emailHtml,
                        recipients: contact_email,
                        subject: 'Your MailPlus enquiry: Prices',
                        relatedRecords: { entityId: customer_id },
                    });
                }

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
        * The date input fields to filter the invoices.
        * Even if the parameters `date_from` and `date_to` are defined, they can't be initiated in the HTML code.
        * They are initiated with jQuery in the `pageInit()` function.
        * @return  {String} `inlineHtml`
        */
        function dateFilterSection(start_date, last_date) {
            var inlineHtml = '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">DATE FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            // inlineHtml += periodDropdownSection(start_date, last_date);

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_from_text">DATE LEAD ENTERED - FROM</span>';
            if (isNullorEmpty(start_date)) {
                inlineHtml += '<input id="date_from" class="form-control date_from" type="date" />';
            } else {
                inlineHtml += '<input id="date_from" class="form-control date_from" type="date" value="' + start_date + '"/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-6 date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_to_text">DATE LEAD ENTERED - TO</span>';
            if (isNullorEmpty(last_date)) {
                inlineHtml += '<input id="date_to" class="form-control date_to" type="date">';
            } else {
                inlineHtml += '<input id="date_to" class="form-control date_to" type="date" value="' + last_date + '">';
            }

            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container zee_available_buttons_section">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-4"></div>'
            inlineHtml +=
                '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" /></div>'
            inlineHtml +=
                '<div class="col-xs-4"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container zee_available_buttons_section">';
            inlineHtml += '<div class="row">';

            inlineHtml +=
                '<div class="col-xs-3"></div>'
            inlineHtml +=
                '<div class="col-xs-6"><input type="button" value="SHOW TOTAL LEAD COUNT" class="form-control btn btn-success" id="showTotal" style="font-weight: bold;"/><p style="font-size: inherit; color: red; text-align: center"><u><b>Please Note:</b></u> This will not calculate the product usage for a customer.</br> Please click <u><b>\"TOTAL USAGE\"</b></u> button to get the usage count for a customer. </p></div>'
            inlineHtml +=
                '<div class="col-xs-3"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            return inlineHtml;
        }

        function tabsSection() {
            var inlineHtml = '<div >';

            // Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';

            inlineHtml +=
                '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

            inlineHtml +=
                '<li role="presentation" class="active"><a data-toggle="tab" href="#overview"><b>OVERVIEW</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#customer"><b>CUSTOMERS</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#prospects"><b>PROSPECTS</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#suspects"><b>SUSPECTS</b></a></li>';


            inlineHtml += '</ul></div>';

            // Tabs content
            inlineHtml += '<div class="tab-content">';
            inlineHtml += '<div role="tabpanel" class="tab-pane active" id="overview">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_preview"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('preview');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="customer">';

            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_customer"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('customer');
            inlineHtml += '</div>';


            inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects">';

            // inlineHtml += '<figure class="highcharts-figure">';
            // inlineHtml += '<div id="container_prospects"></div>';
            // inlineHtml += '</figure><br></br>';

            // Prospects Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';

            inlineHtml +=
                '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#prospects_quoteSent_incontact_noanswer"><b>PROSPECTS - QUOTE SENT/IN CONTACT/NO ANSWER</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class="active"><a data-toggle="tab" href="#prospects_opportunites"><b>PROSPECTS - OPPORTUNITIES</b></a></li>';


            inlineHtml += '</ul></div>';

            inlineHtml += '<div class="tab-content">';
            inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects_quoteSent_incontact_noanswer">';

            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_quoteSent_incontact_noanswer"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('prospects_quoteSent_incontact_noanswer');
            inlineHtml += '</div>';


            inlineHtml += '<div role="tabpanel" class="tab-pane active" id="prospects_opportunites">';

            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_prospects_opportunites"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('prospects_opportunites');
            inlineHtml += '</div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects">';

            // Suspects Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';

            inlineHtml +=
                '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

            inlineHtml +=
                '<li role="presentation" class="active"><a data-toggle="tab" href="#suspects_leads"><b>SUSPECTS - HOT/NEW LEAD</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#suspects_off_peak_pipeline"><b>SUSPECTS - OFF PEAK PIEPLINE</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#suspects_lost"><b>SUSPECTS - LOST</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#suspects_oot"><b>SUSPECTS - OUT OF TERRITORY</b></a></li>';


            inlineHtml += '</ul></div>';

            inlineHtml += '<div class="tab-content">';

            inlineHtml += '<div role="tabpanel" class="tab-pane active" id="suspects_leads">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_suspects"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('suspects');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_off_peak_pipeline">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_suspects_off_peak_pipeline"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('suspects_off_peak_pipeline');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_lost">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_suspects_lost"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('suspects_lost');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_oot">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_suspects_oot"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('suspects_oot');
            inlineHtml += '</div>';

            inlineHtml += '</div></div>';

            return inlineHtml;
        }


        /**
         * The table that will display the differents invoices linked to the
         * franchisee and the time period.
         *
         * @return {String} inlineHtml
         */
        function dataTable(name) {
            var inlineHtml = '<style>table#mpexusage-' +
                name +
                ' {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#mpexusage-' +
                name +
                ' th{text-align: center;} .bolded{font-weight: bold;}</style>';
            inlineHtml += '<table id="mpexusage-' +
                name +
                '" class="table table-responsive table-striped customer tablesorter" style="width: 100%;">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
            inlineHtml += '<tr class="text-center">';

            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

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

        function GetFormattedDate(todayDate) {

            var month = pad(todayDate.getMonth() + 1);
            var day = pad(todayDate.getDate());
            var year = (todayDate.getFullYear());
            return year + "-" + month + "-" + day;
        }

        function pad(s) {
            return (s < 10) ? '0' + s : s;
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
