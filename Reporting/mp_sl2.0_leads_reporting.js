/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Tue Apr 18 2023
 * Modified on:          Tue Apr 18 2023 11:23:49
 * SuiteScript Version:  2.0 
 * Description:          Reporting page that shows reporting based on the leads that come into the system and the customers that have been signed up based on the leads.  
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
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

                var usage_date_from = context.request.parameters.usage_date_from;
                var usage_date_to = context.request.parameters.usage_date_to;

                var date_signed_up_from = context.request.parameters.date_signed_up_from;
                var date_signed_up_to = context.request.parameters.date_signed_up_to;

                var date_quote_sent_to = context.request.parameters.date_quote_sent_to;
                var date_quote_sent_from = context.request.parameters.date_quote_sent_from;

                var invoice_date_from = context.request.parameters.invoice_date_from;
                var invoice_date_to = context.request.parameters.invoice_date_to;
                var invoice_type = context.request.parameters.invoice_type;

                var source = context.request.parameters.source;
                var salesrep = context.request.parameters.sales_rep;

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

                if (isNullorEmpty(usage_date_from)) {
                    usage_date_from = firstDay;
                }

                if (isNullorEmpty(usage_date_to)) {
                    usage_date_to = lastDay
                }


                log.debug({
                    title: 'firstDay',
                    details: firstDay
                });

                log.debug({
                    title: 'lastDay',
                    details: lastDay
                });


                if (isNullorEmpty(start_date) && isNullorEmpty(date_signed_up_from) && isNullorEmpty(date_quote_sent_from)) {
                    if (showTotal == 'T') {
                        start_date = null;
                        date_signed_up_from = null;

                    } else {
                        start_date = firstDay;
                        // date_signed_up_from = firstDay;
                    }

                }

                if (isNullorEmpty(last_date) && isNullorEmpty(date_signed_up_to) && isNullorEmpty(date_quote_sent_to)) {
                    if (showTotal == 'T') {
                        last_date = null;
                        date_signed_up_to = null;
                    } else {
                        last_date = lastDay;
                        // date_signed_up_to = lastDay;
                    }

                }

                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                var form = ui.createForm({
                    title: 'Lead - Reporting'
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
                inlineHtml += '<div>';
                inlineHtml += leadSourceFilterSection(source, salesrep);
                inlineHtml += dateFilterSection(start_date, last_date, usage_date_from, usage_date_to, date_signed_up_from, date_signed_up_to, invoice_date_from, invoice_date_to, invoice_type, date_quote_sent_to, date_quote_sent_from);
                inlineHtml += '</div></br></br>'
                inlineHtml += tabsSection();
                // inlineHtml += '<div id="container"></div>'
                inlineHtml += dataTable();

                //Button to reload the page when the filters have been selected
                // form.addButton({
                //   id: 'submit_search',
                //   label: 'Submit Search',
                //   functionName: 'addFilters()'
                // });

                form.addButton({
                    id: 'download_csv',
                    label: 'Export Signed Customer List',
                    functionName: 'downloadCustomerCsv()'
                });

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

        function leadSourceFilterSection(source, salesrep) {
            var inlineHtml = '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">LEAD SOURCE & SALES REP - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container source_section">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-6 source">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="source_text">SOURCE</span>';
            inlineHtml += '<select id="lead_source" class="form-control">';
            inlineHtml += '<option></option>';
            //NetSuite Search: LEAD SOURCE
            var leadSourceSearch = search.load({
                type: 'campaign',
                id: 'customsearch_lead_source'
            });

            leadSourceSearch.run().each(function (leadSourceResultSet) {

                var leadsourceid = leadSourceResultSet.getValue({
                    name: 'internalid'
                });
                var leadsourcename = leadSourceResultSet.getValue({
                    name: 'title'
                });

                if (leadsourceid == source) {
                    inlineHtml += '<option value="' + leadsourceid + '" selected>' +
                        leadsourcename + '</option>';
                } else {
                    inlineHtml += '<option value="' + leadsourceid + '" >' +
                        leadsourcename + '</option>';
                }

                return true;
            });

            inlineHtml += '</select>';
            inlineHtml += '</div></div>';

            inlineHtml += '<div class="col-xs-6 source">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="source_text">SALES REP</span>';
            inlineHtml += '<select id="sales_rep" class="form-control">';
            inlineHtml += '<option></option>';

            if (salesrep == '668711') {
                inlineHtml += '<option value="668711" selected>Lee Russell</option>';
                inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                inlineHtml += '<option value="690145">David Gdanski</option>';
                inlineHtml += '<option value="668712">Belinda Urbani</option>';
            } else if (salesrep == '696160') {
                inlineHtml += '<option value="668711">Lee Russell</option>';
                inlineHtml += '<option value="696160" selected>Kerina Helliwell</option>';
                inlineHtml += '<option value="690145">David Gdanski</option>';
                inlineHtml += '<option value="668712">Belinda Urbani</option>';
            } else if (salesrep == '690145') {
                inlineHtml += '<option value="668711">Lee Russell</option>';
                inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                inlineHtml += '<option value="690145" selected>David Gdanski</option>';
                inlineHtml += '<option value="668712">Belinda Urbani</option>';
            } else if (salesrep == '668712') {
                inlineHtml += '<option value="668711">Lee Russell</option>';
                inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                inlineHtml += '<option value="690145">David Gdanski</option>';
                inlineHtml += '<option value="668712" selected>Belinda Urbani</option>';
            } else {
                inlineHtml += '<option value="668711">Lee Russell</option>';
                inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                inlineHtml += '<option value="690145">David Gdanski</option>';
                inlineHtml += '<option value="668712">Belinda Urbani</option>';
            }



            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;
        }

        /**
        * The date input fields to filter the invoices.
        * Even if the parameters `date_from` and `date_to` are defined, they can't be initiated in the HTML code.
        * They are initiated with jQuery in the `pageInit()` function.
        * @return  {String} `inlineHtml`
        */
        function dateFilterSection(start_date, last_date, usage_date_from, usage_date_to, date_signed_up_from, date_signed_up_to, invoice_date_from, invoice_date_to, invoice_type, date_quote_sent_to, date_quote_sent_from) {
            var inlineHtml = '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE LEAD ENTERED - FILTER</span></h4></div>';
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

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE QUOTE SENT - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            // inlineHtml += periodDropdownSection(start_date, last_date);

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_quote_sent_from_text">DATE QUOTE SENT - FROM</span>';
            if (isNullorEmpty(date_quote_sent_from)) {
                inlineHtml += '<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" />';
            } else {
                inlineHtml += '<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" value="' + date_quote_sent_from + '"/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-6 usage_date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_quote_sent_to_text">DATE QUOTE SENT - TO</span>';
            if (isNullorEmpty(date_quote_sent_to)) {
                inlineHtml += '<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date">';
            } else {
                inlineHtml += '<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date" value="' + date_quote_sent_to + '">';
            }

            inlineHtml += '</div></div></div></div>';

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE SIGNED UP - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            // inlineHtml += periodDropdownSection(start_date, last_date);

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_signed_up_from_text">DATE SIGNED UP - FROM</span>';
            if (isNullorEmpty(date_signed_up_from)) {
                inlineHtml += '<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" />';
            } else {
                inlineHtml += '<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" value="' + date_signed_up_from + '"/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-6 usage_date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_signed_up_to_text">DATE SIGNED UP - TO</span>';
            if (isNullorEmpty(date_signed_up_to)) {
                inlineHtml += '<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date">';
            } else {
                inlineHtml += '<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date" value="' + date_signed_up_to + '">';
            }

            inlineHtml += '</div></div></div></div>';



            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">MP PRODUCT USAGE DATE - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            // inlineHtml += periodDropdownSection(start_date, last_date);

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="usage_date_from_text">USAGE DATE - FROM</span>';
            if (isNullorEmpty(usage_date_from)) {
                inlineHtml += '<input id="usage_date_from" class="form-control usage_date_from" type="date" />';
            } else {
                inlineHtml += '<input id="usage_date_from" class="form-control usage_date_from" type="date" value="' + usage_date_from + '"/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-6 usage_date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="usage_date_to_text">USAGE DATE - TO</span>';
            if (isNullorEmpty(usage_date_to)) {
                inlineHtml += '<input id="usage_date_to" class="form-control usage_date_to" type="date">';
            } else {
                inlineHtml += '<input id="usage_date_to" class="form-control usage_date_to" type="date" value="' + usage_date_to + '">';
            }

            inlineHtml += '</div></div></div></div>';

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">INVOICE FILTERS</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            // inlineHtml += periodDropdownSection(start_date, last_date);

            inlineHtml += '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-4 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="invoice_date_from_text">INVOICE DATE - FROM</span>';
            if (isNullorEmpty(invoice_date_from)) {
                inlineHtml += '<input id="invoice_date_from" class="form-control invoice_date_from" type="date" />';
            } else {
                inlineHtml += '<input id="invoice_date_from" class="form-control invoice_date_from" type="date" value="' + invoice_date_from + '"/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-4 usage_date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="invoice_date_to_text">INVOICE DATE - TO</span>';
            if (isNullorEmpty(invoice_date_to)) {
                inlineHtml += '<input id="invoice_date_to" class="form-control invoice_date_to" type="date">';
            } else {
                inlineHtml += '<input id="invoice_date_to" class="form-control invoice_date_to" type="date" value="' + invoice_date_to + '">';
            }

            inlineHtml += '</div></div>';

            inlineHtml += '<div class="col-xs-4 usage_date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="zee_dropdown_text">INVOICE TYPE</span>';
            inlineHtml += '<select id="invoice_type" class="form-control">';
            if (invoice_type == '1') {
                inlineHtml += '<option value=""></option>';
                inlineHtml += '<option value="1" selected>Service</option>';
                inlineHtml += '<option value="2">MP Products</option>';
            } else if (invoice_type == '2') {
                inlineHtml += '<option value=""></option>';
                inlineHtml += '<option value="1">Service</option>';
                inlineHtml += '<option value="2" selected>MP Products</option>';
            } else {
                inlineHtml += '<option value=""></option>';
                inlineHtml += '<option value="1">Service</option>';
                inlineHtml += '<option value="2">MP Products</option>';

            }

            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container zee_available_buttons_section">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-4"></div>'
            inlineHtml +=
                '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="background-color: #095C7B;" /></div>'
            inlineHtml +=
                '<div class="col-xs-4"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            // inlineHtml +=
            //     '<div class="form-group container zee_available_buttons_section">';
            // inlineHtml += '<div class="row">';

            // inlineHtml +=
            //     '<div class="col-xs-3"></div>'
            // inlineHtml +=
            //     '<div class="col-xs-6"><input type="button" value="SHOW TOTAL LEAD COUNT" class="form-control btn btn-success" id="showTotal" style="font-weight: bold;"/><p style="font-size: inherit; color: red; text-align: center"><u><b>Please Note:</b></u> This will not calculate the product usage for a customer.</br> Please click <u><b>\"TOTAL USAGE\"</b></u> button to get the usage count for a customer. </p></div>'
            // inlineHtml +=
            //     '<div class="col-xs-3"></div>'

            // inlineHtml += '</div>';
            // inlineHtml += '</div>';

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
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#cancellation"><b>CANCELLATIONS</b></a></li>';


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
                '<li role="presentation" class=""><a data-toggle="tab" href="#suspects_followup"><b>SUSPECTS - FOLLOW UP</b></a></li>';
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

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_followup">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_suspects_followup"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('suspects_followup');
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

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="cancellation">';

            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_cancellation"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('cancellation');
            inlineHtml += '</div>';

 

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
                '" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
            inlineHtml += '<tr class="text-center">';

            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

            if (name == 'preview') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>'
            }

            if (name == 'customer') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="7"></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th style="text-align:right"></th><th></th><th></th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'suspects' || name == 'suspects_lost' || name == 'suspects_followup') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="16" style="text-align:right">Total Monthly Service Revenue:</th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'prospects_quoteSent_incontact_noanswer' || name == 'prospects_opportunites') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="13" style="text-align:right">Total Monthly Service Revenue:</th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'cancellation') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="8" style="text-align:right">Total Saved Monthly Service Revenue:</th><th></th></tr></tfoot>'
            }


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
