/**
 * @NApiVersion 2.0
 * @NScriptType Portlet

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

        function render(params) {
            userId = runtime.getCurrentUser().id;
            role = runtime.getCurrentUser().role;

            var portlet = params.portlet;



            portlet.title = 'Franchisee Lead Dashboard';


            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }

            var start_date = null;
            var last_date = null;

            var usage_date_from = null;
            var usage_date_to = null;

            var date_signed_up_from = null;
            var date_signed_up_to = null;

            var date_quote_sent_to = null;
            var date_quote_sent_from = null;

            var invoice_date_from = null;
            var invoice_date_to = null;
            var invoice_type = null;

            var source = null;
            var salesrep = null;
            var showTotal = null;
            var calcprodusage = null;

            //If role is Franchisee
            if (role == 1000) {
                zee = runtime.getCurrentUser().id;
                if (zee == 626428) {
                    zee = 1645493;
                }
            } else { // System Support
                // zee = 1645493; //test-AR
            }

            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();
            //If begining of the year, show the current financial year, else show the current 
            // if (m < 5) {
            //     //Calculate the Current inancial Year

            //     var firstDay = new Date(y, m, 1);
            //     var lastDay = new Date(y, m + 1, 0);

            //     firstDay.setHours(0, 0, 0, 0);
            //     lastDay.setHours(0, 0, 0, 0);

            //     if (m >= 6) {
            //         var first_july = new Date(y, 6, 1);
            //     } else {
            //         var first_july = new Date(y - 1, 6, 1);
            //     }
            //     date_from = first_july;
            //     date_to = lastDay;

            //     var start_date = GetFormattedDate(date_from);
            //     var last_date = GetFormattedDate(date_to);
            // } else {
            //Calculate the Current Calendar Year
            // var today_day_in_month = date.getDate();
            // var today_date = new Date(Date.UTC(y, m, today_day_in_month))
            // var first_day_in_year = new Date(Date.UTC(y, 0));
            // var date_from = first_day_in_year.toISOString().split('T')[0];
            // var date_to = today_date.toISOString().split('T')[0];

            // var start_date = date_from;
            // var last_date = last_date;
            //Last 3 months rolling
            var i = 0;
            var lastDay = new Date(y, m + 1, 0);
            do {
                if (m == 1) {
                    m = 12;
                    y--;
                } else {
                    m--;
                }
                i++;
            } while (i < 4);

            var firstDay = new Date(y, m, 1);
            firstDay.setHours(0, 0, 0, 0);
            lastDay.setHours(0, 0, 0, 0);

            start_date = GetFormattedDate(firstDay);
            last_date = GetFormattedDate(lastDay);


            // var janLastYear = new Date(date.getFullYear() - 1, 0, 1);

            // log.debug({
            //     title: 'date_from',
            //     details: date_from
            // })
            // log.debug({
            //     title: 'date_to',
            //     details: date_to
            // })

            // firstDay = GetFormattedDate(date_from);
            // lastDay = GetFormattedDate(date_to);
            // janLastYear = GetFormattedDate(janLastYear)

            log.debug({
                title: 'start_date',
                details: start_date
            })
            log.debug({
                title: 'last_date',
                details: last_date
            })

            if (isNullorEmpty(usage_date_from)) {
                usage_date_from = firstDay;
            }

            if (isNullorEmpty(usage_date_to)) {
                usage_date_to = lastDay
            }

            // if (isNullorEmpty(start_date) && isNullorEmpty(date_signed_up_from) && isNullorEmpty(date_quote_sent_from)) {
            //     date_signed_up_from = firstDay;
            // }

            // if (isNullorEmpty(last_date) && isNullorEmpty(date_signed_up_to) && isNullorEmpty(date_quote_sent_to)) {

            //     date_signed_up_to = lastDay;
            // }

            var inlineHtml =
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/highcharts-more.js"></script><script src="https://code.highcharts.com/modules/solid-gauge.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.button-shadow{box-shadow:2.8px 2.8px 2.2px rgba(0,0,0,.02),6.7px 6.7px 5.3px rgba(0,0,0,.028),12.5px 12.5px 10px rgba(0,0,0,.035),22.3px 22.3px 17.9px rgba(0,0,0,.042),41.8px 41.8px 33.4px rgba(0,0,0,.05),100px 100px 80px rgba(0,0,0,.07)}</style > ';

            inlineHtml += loadingSection();
            //Search: SMC - Franchisees
            var searchZees = search.load({
                id: 'customsearch_smc_franchisee'
            });
            var resultSetZees = searchZees.run();
            // if (role != 1000) {
            inlineHtml += franchiseeDropdownSection(resultSetZees, null);
            // }
            inlineHtml += leadSourceFilterSection(null, null);
            inlineHtml +=
                '<div class="form-group container filter_buttons_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-2"></div>'
            inlineHtml +=
                '<div class="col-xs-8"><input type="button" value="FULL SALES REPORT" class="form-control btn btn-primary" id="fullReport" style="background-color: #095C7B;border-radius: 30px;" /></div>'
            inlineHtml +=
                '<div class="col-xs-2"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            // if (userId == 1645493) {
            inlineHtml +=
                '<div class="form-group container scorecard_percentage hide" style="">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12">'
            inlineHtml += '<article class="card">';
            // if (userId != 626428) {
            //     inlineHtml += '<h2 style="text-align:center;">Qualified Lead Count</h2>';
            // }

            inlineHtml += '<small style="text-align:center;font-size: 12px;"></small>';
            inlineHtml += '<div id="container-progress"></div>';
            inlineHtml += '</article>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container filter_buttons_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-2"></div>'
            inlineHtml +=
                '<div class="col-xs-8"><input type="button" value="ENTER NEW LEADS" class="form-control btn btn-primary" id="enter_leads" style="background-color: #095C7B;border-radius: 30px;" /></div>'
            inlineHtml +=
                '<div class="col-xs-2"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';

            //  // if (userId == 1645493) {
            //     inlineHtml +=
            //     '<div class="form-group container scorecard_percentage hide" style="">';
            // inlineHtml += '<div class="row">';
            // inlineHtml += '<div class="col-xs-12">'
            // inlineHtml += '<article class="card">';
            // // if (userId != 626428) {
            //     // inlineHtml += '<h2 style="text-align:center;">Lost Lead Count</h2>';
            // // }

            // inlineHtml += '<small style="text-align:center;font-size: 12px;"></small>';
            // inlineHtml += '<div id="container-progress-lost"></div>';
            // inlineHtml += '</article>';
            // inlineHtml += '</div>';
            // inlineHtml += '</div>';
            // inlineHtml += '</div>';

            // }

            inlineHtml += dateFilterSection(start_date, last_date, usage_date_from, usage_date_to, date_signed_up_from, date_signed_up_to, invoice_date_from, invoice_date_to, invoice_type, date_quote_sent_to, date_quote_sent_from, calcprodusage);
            inlineHtml += '</br>'
            inlineHtml += tabsSection();
            // inlineHtml += dataTable();

            portlet.addField({
                id: 'preview_table',
                label: 'inlinehtml',
                type: 'inlinehtml'
            }).updateLayoutType({
                layoutType: ui.FieldLayoutType.STARTROW
            }).defaultValue = inlineHtml;
            portlet.clientScriptFileId = 6384611;

        }


        /**
         * The Franchisee dropdown field.
         * @param   {zeeSearchResult}    resultSetZees
         * @return  {String}    `inlineHtml`
         */
        function franchiseeDropdownSection(resultSetZees, context) {
            var inlineHtml =
                '<div class="form-group container zee_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">FRANCHISEE</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container zee_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 zee_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="zee_dropdown_text">Franchisee</span>';
            inlineHtml += '<select id="zee_dropdown" class="form-control">';
            inlineHtml += '<option value=""></option>'
            resultSetZees.each(function (searchResult_zee) {
                zee_id = searchResult_zee.getValue('internalid');
                zee_name = searchResult_zee.getValue('companyname');

                if (zee == zee_id) {
                    inlineHtml += '<option value="' + zee_id +
                        '" selected="selected">' + zee_name + '</option>';
                } else {
                    inlineHtml += '<option value="' + zee_id + '">' + zee_name +
                        '</option>';
                }

                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;

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
            var inlineHtml = '<div class="form-group container source_salesrep_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">LEAD SOURCE & SALES REP - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container source_salesrep_section hide">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-6 source_div">';
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

            inlineHtml += '<div class="col-xs-6 sales_rep_div">';
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
        function dateFilterSection(start_date, last_date, usage_date_from, usage_date_to, date_signed_up_from, date_signed_up_to, invoice_date_from, invoice_date_to, invoice_type, date_quote_sent_to, date_quote_sent_from, calcprodusage) {
            var inlineHtml = '<div class="form-group container lead_entered_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE LEAD ENTERED - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container lead_entered_div hide">';
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

            // inlineHtml += '<div class="form-group container quote_sent_label_section hide">';
            // inlineHtml += '<div class="row">';
            // inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE QUOTE SENT - FILTER</span></h4></div>';
            // inlineHtml += '</div>';
            // inlineHtml += '</div>';

            // inlineHtml += '<div class="form-group container quote_sent_div hide">';
            // inlineHtml += '<div class="row">';
            // // Date from field
            // inlineHtml += '<div class="col-xs-6 date_from">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml += '<span class="input-group-addon" id="date_quote_sent_from_text">DATE QUOTE SENT - FROM</span>';
            // if (isNullorEmpty(date_quote_sent_from)) {
            //     inlineHtml += '<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" />';
            // } else {
            //     inlineHtml += '<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" value="' + date_quote_sent_from + '"/>';
            // }

            // inlineHtml += '</div></div>';
            // // Date to field
            // inlineHtml += '<div class="col-xs-6 usage_date_to">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml += '<span class="input-group-addon" id="date_quote_sent_to_text">DATE QUOTE SENT - TO</span>';
            // if (isNullorEmpty(date_quote_sent_to)) {
            //     inlineHtml += '<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date">';
            // } else {
            //     inlineHtml += '<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date" value="' + date_quote_sent_to + '">';
            // }

            // inlineHtml += '</div></div></div></div>';

            inlineHtml += '<div class="form-group container signed_up_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE SIGNED UP - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container signed_up_div hide">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_signed_up_from_text">DATE SIGNED UP - FROM</span>';
            if (isNullorEmpty(date_signed_up_from)) {
                inlineHtml += '<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" />';
            } else {
                inlineHtml += '<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" value="' + date_signed_up_from + '" readonly/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-6 usage_date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_signed_up_to_text">DATE SIGNED UP - TO</span>';
            if (isNullorEmpty(date_signed_up_to)) {
                inlineHtml += '<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date">';
            } else {
                inlineHtml += '<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date" value="' + date_signed_up_to + '" readonly>';
            }

            inlineHtml += '</div></div></div></div>';



            inlineHtml += '<div class="form-group container usage_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">MP PRODUCT USAGE DATE - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container calcprodusage_div hide">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-12 calcprodusage">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="calcprodusage_text">CALCULATE MP PRODUCT USAGE?</span>';
            inlineHtml += '<select id="calc_prod_usage" class="form-control">';
            inlineHtml += '<option></option>';
            inlineHtml += '<option value="1" >Yes</option>';
            inlineHtml += '<option value="2 selected>No</option>';

            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';



            inlineHtml += '<div class="form-group container usage_date_div hide">';
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

            // inlineHtml += '<div class="form-group container invoice_label_section hide">';
            // inlineHtml += '<div class="row">';
            // inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">INVOICE FILTERS</span></h4></div>';
            // inlineHtml += '</div>';
            // inlineHtml += '</div>';

            // inlineHtml += '<div class="form-group container invoice_date_type_div hide">';
            // inlineHtml += '<div class="row">';
            // // Date from field
            // inlineHtml += '<div class="col-xs-4 date_from">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml += '<span class="input-group-addon" id="invoice_date_from_text">INVOICE DATE - FROM</span>';
            // if (isNullorEmpty(invoice_date_from)) {
            //     inlineHtml += '<input id="invoice_date_from" class="form-control invoice_date_from" type="date" />';
            // } else {
            //     inlineHtml += '<input id="invoice_date_from" class="form-control invoice_date_from" type="date" value="' + invoice_date_from + '"/>';
            // }

            // inlineHtml += '</div></div>';
            // // Date to field
            // inlineHtml += '<div class="col-xs-4 usage_date_to">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml += '<span class="input-group-addon" id="invoice_date_to_text">INVOICE DATE - TO</span>';
            // if (isNullorEmpty(invoice_date_to)) {
            //     inlineHtml += '<input id="invoice_date_to" class="form-control invoice_date_to" type="date">';
            // } else {
            //     inlineHtml += '<input id="invoice_date_to" class="form-control invoice_date_to" type="date" value="' + invoice_date_to + '">';
            // }

            // inlineHtml += '</div></div>';

            // inlineHtml += '<div class="col-xs-4 usage_date_to">';
            // inlineHtml += '<div class="input-group">';
            // inlineHtml +=
            //     '<span class="input-group-addon" id="zee_dropdown_text">INVOICE TYPE</span>';
            // inlineHtml += '<select id="invoice_type" class="form-control">';
            // if (invoice_type == '1') {
            //     inlineHtml += '<option value=""></option>';
            //     inlineHtml += '<option value="1" selected>Service</option>';
            //     inlineHtml += '<option value="2">MP Products</option>';
            // } else if (invoice_type == '2') {
            //     inlineHtml += '<option value=""></option>';
            //     inlineHtml += '<option value="1">Service</option>';
            //     inlineHtml += '<option value="2" selected>MP Products</option>';
            // } else {
            //     inlineHtml += '<option value=""></option>';
            //     inlineHtml += '<option value="1">Service</option>';
            //     inlineHtml += '<option value="2">MP Products</option>';

            // }

            // inlineHtml += '</select>';
            // inlineHtml += '</div></div></div></div>';

            // inlineHtml +=
            //     '<div class="form-group container filter_buttons_section hide">';
            // inlineHtml += '<div class="row">';
            // inlineHtml +=
            //     '<div class="col-xs-2"></div>'
            // inlineHtml +=
            //     '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="background-color: #095C7B;" /></div>'
            // inlineHtml +=
            //     '<div class="col-xs-4"><input type="button" value="CLEAR FILTER" class="form-control btn btn-primary" id="clearFilter" style="background-color: #F0AECB; color: #103d39;" /></div>'
            // inlineHtml +=
            //     '<div class="col-xs-2"></div>'

            // inlineHtml += '</div>';
            // inlineHtml += '</div>';
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
            var inlineHtml = '';

            // Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095c7b; color: #fff }.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095c7b; color: #095c7b; border-radius: 30px;}';

            inlineHtml += '</style>';

            inlineHtml +=
                '<div class="tabs_section hide" style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

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
            inlineHtml += '<div class="data-range_note  hide" style="color: red;text-align: center;font-weight: bolder;font-size: 14px;"><i>Please note, the data shown below is moving over a 3-month period.</i></div></br><div class="tab-content">';
            inlineHtml += '<div role="tabpanel" class="tab-pane active" id="overview">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_preview"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('preview');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="customer">';

            // Customers Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';

            inlineHtml +=
                '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

            inlineHtml +=
                '<li role="presentation" class="active"><a data-toggle="tab" href="#new_customers"><b>NEW CUSTOMERS</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#existing_customers"><b>EXISTING CUSTOMERS</b></a></li>';

            inlineHtml += '</ul></div>';

            inlineHtml += '<div class="tab-content">';
            inlineHtml += '<div role="tabpanel" class="tab-pane active" id="new_customers">';

            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_customer"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('customer');
            inlineHtml += '</div>';


            inlineHtml += '<div role="tabpanel" class="tab-pane " id="existing_customers">';

            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_existing_customers"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('existing_customers');
            inlineHtml += '</div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects">';

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
                '<li role="presentation" class=""><a data-toggle="tab" href="#suspects_qualified"><b>SUSPECTS - QUALIFIED</b></a></li>';
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


            inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_qualified">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_suspects_qualified"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('suspects_qualified');
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
            inlineHtml += '<div class="table_section hide"><table id="mpexusage-' +
                name +
                '" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
            inlineHtml += '<tr class="text-center">';

            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

            if (name == 'preview') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>'
            }

            if (name == 'customer' || name == 'existing_customers') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="7"></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th style="text-align:right"></th><th></th><th></th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'suspects' || name == 'suspects_followup') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="16" style="text-align:right">Total Monthly Service Revenue:</th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'suspects_lost') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="16" style="text-align:right">Total:</th><th></th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'prospects_quoteSent_incontact_noanswer' || name == 'prospects_opportunites') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="13" style="text-align:right">Total Monthly Service Revenue:</th><th></th><th></th></tr></tfoot>'
            }
            if (name == 'cancellation') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="8" style="text-align:right">Total:</th><th></th><th></th><th></th></tr></tfoot>'
            }


            inlineHtml += '</table></div>';
            return inlineHtml;
        }
        /**
         * The header showing that the results are loading.
         * @returns {String} `inlineQty`
         */
        function loadingSection() {


            var inlineHtml = '<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 ">';
            inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
            inlineHtml += '</div></div></div></br></br>';
            inlineHtml += '<div class="wrapper loading_section">';
            inlineHtml += '<div class="blue ball"></div>'
            inlineHtml += '<div class="red ball"></div>'
            inlineHtml += '<div class="yellow ball"></div>'
            inlineHtml += '<div class="green ball"></div>'

            inlineHtml += '</div>'

            return inlineHtml;
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
            render: render
        };
    });
