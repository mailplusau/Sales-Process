/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Sun Jun 21 2024
 * Modified on:          Sun Jun 21 2024 08:24:34
 * SuiteScript Version:  2.0 
 * Description:          A page that displays the snapshot of the sttus transition of the leads/prospects & customers. 
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */


define(['SuiteScripts/jQuery Plugins/Moment JS/moment.min', 'N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect', 'N/url'],
    function (moment, ui, email, runtime, search, record, https, log, redirect, url) {
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

                var modified_start_date = context.request.parameters.modified_date_from;
                var modified_last_date = context.request.parameters.modified_date_to;

                var source = context.request.parameters.source;
                var campaign = context.request.parameters.campaign;
                var parentLPO = context.request.parameters.lpo;
                var salesrep = context.request.parameters.sales_rep;
                var lead_entered_by = context.request.parameters.lead_entered_by;

                zee = context.request.parameters.zee;
                userId = context.request.parameters.user_id;
                var calcprodusage = context.request.parameters.calcprodusage;
                var sales_activity_notes = context.request.parameters.salesactivitynotes;
                var leadStatus = context.request.parameters.status;

                //If role is Franchisee
                if (role == 1000) {
                    zee = runtime.getCurrentUser().id;
                    calcprodusage = 2;
                    sales_activity_notes = 2;
                }

                var date = new Date();
                y = date.getFullYear();
                m = date.getMonth();
                var day = date.getDay();

                var firstDayOfPreviousMonth = new Date(y, m - 1, 1);

                // Adjust to the previous Monday
                var offset = day === 0 ? 6 : day - 1;
                date.setDate(date.getDate() - offset);

                // Start of week
                var startOfWeek = new Date(date);

                // End of week (Sunday)
                var endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);


                var firstDay = new Date(y, m, 1);
                var lastDay = new Date(y, m + 1, 0);

                firstDay.setHours(0, 0, 0, 0);
                lastDay.setHours(0, 0, 0, 0);
                firstDayOfPreviousMonth.setHours(0, 0, 0, 0);

                firstDay = GetFormattedDate(firstDay);
                lastDay = GetFormattedDate(lastDay);
                firstDayOfPreviousMonth = GetFormattedDate(firstDayOfPreviousMonth);

                startOfWeek = GetFormattedDate(startOfWeek);
                endOfWeek = GetFormattedDate(endOfWeek);


                if (role != 1000) {
                    if (isNullorEmpty(modified_start_date)) {
                        if (!isNullorEmpty(campaign)) {

                            if (campaign.indexOf(",") != -1) {
                                var campaignArray = campaign.split(',');
                            } else {
                                var campaignArray = [];
                                campaignArray.push(campaign)
                            }

                            if (campaignArray.indexOf('71') != -1 || campaignArray.indexOf('72') != -1 || campaignArray.indexOf('69') != -1) {
                                modified_start_date = null;
                            } else {
                                modified_start_date = firstDay;
                            }
                        } else {
                            modified_start_date = firstDay;
                            // date_signed_up_from = firstDay;
                        }

                    }

                    if (isNullorEmpty(modified_last_date)) {
                        if (!isNullorEmpty(campaign)) {
                            if (campaign.indexOf(",") != -1) {
                                var campaignArray = campaign.split(',');
                            } else {
                                var campaignArray = [];
                                campaignArray.push(campaign)
                            }

                            if (campaignArray.indexOf('71') != -1 || campaignArray.indexOf('72') != -1 || campaignArray.indexOf('69') != -1) {
                                modified_last_date = null;
                            } else {
                                modified_last_date = lastDay;
                            }
                        } else {
                            modified_last_date = lastDay;
                            // date_signed_up_to = lastDay;
                        }

                    }
                } else {
                    if (modified_start_date == null && modified_last_date == null) {
                        var date = new Date();
                        var y = date.getFullYear();
                        var m = date.getMonth();
                        var day = date.getDay();

                        // Adjust to the previous Monday
                        var offset = day === 0 ? 6 : day - 1;
                        date.setDate(date.getDate() - offset);

                        // Start of week
                        var startOfWeek = new Date(date);

                        // End of week (Sunday)
                        var endOfWeek = new Date(startOfWeek);
                        endOfWeek.setDate(endOfWeek.getDate() + 6);
                        endOfWeek = GetFormattedDate(endOfWeek);
                        startOfWeek = GetFormattedDate(startOfWeek);

                        var lastDay = new Date(y, m + 1, 0);
                        lastDay.setHours(0, 0, 0, 0);

                        // modified_start_date = startOfWeek
                        // modified_last_date = endOfWeek

                        //If begining of the year, show the current financial year, else show the current 
                        if (m < 5) {
                            //Calculate the Current inancial Year

                            var firstDay = new Date(y, m, 1);


                            firstDay.setHours(0, 0, 0, 0);


                            if (m >= 6) {
                                var first_july = new Date(y, 6, 1);
                            } else {
                                var first_july = new Date(y - 1, 6, 1);
                            }
                            date_from = first_july;
                            date_to = lastDay;

                            start_date = GetFormattedDate(date_from);
                            last_date = GetFormattedDate(date_to);
                        } else {
                            //Calculate the Current Calendar Year
                            var today_day_in_month = date.getDate();
                            var today_date = new Date(Date.UTC(y, m, today_day_in_month))
                            var first_day_in_year = new Date(Date.UTC(y, 0));
                            var date_from = first_day_in_year.toISOString().split('T')[0];
                            var date_to = today_date.toISOString().split('T')[0];

                            start_date = date_from;
                            last_date = GetFormattedDate(lastDay);
                        }
                    }
                }


                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                var form = ui.createForm({
                    title: 'Sales Status Snapshot Overview - Dashboard'
                });


                var inlineHtml =
                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.0.7/css/dataTables.dataTables.css"><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.0.2/css/buttons.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/2.0.7/js/dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/dataTables.buttons.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.html5.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.print.min.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script>';
                inlineHtml +=
                    '<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>';
                inlineHtml +=
                    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">';
                inlineHtml +=
                    '<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>';
                // Semantic Select
                inlineHtml +=
                    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">';
                inlineHtml +=
                    '<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>';

                inlineHtml += '<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;}</style>'

                form.addField({
                    id: 'custpage_overview_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_existing_customer_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_prospect_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_suspect_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_suspect_lost_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_suspect_offpeak_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_suspect_followup_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_suspect_oot_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
                form.addField({
                    id: 'custpage_prospect_opportunity_table_csv',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })
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

                //Loading Section that gets displayed when the page is being loaded
                inlineHtml += loadingSection();

                inlineHtml += '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br><ol><li>To search for lead results within a specific time frame, use the "Status Change Date - Filter" and select the desired date range (Range can be only between the the 1st of the previous month month to the end of the current month). After that, click on "Apply Filter". </br><b>Note:</b> This refers to the date when the status of the lead changed.</li></ol><b><u>Overview:</u></b></br>Represents the overview of the number of leads that have transitions from an old status to the new status. The old status is displayed in the 1st column of the table and the current status(new status) is the 1st column of the table.</br></br></div></br>';

                inlineHtml +=
                    '<div class="form-group container show_buttons_section hide">';
                inlineHtml += '<div class="row">';
                inlineHtml +=
                    '<div class="col-xs-5"></div>'

                inlineHtml +=
                    '<div class="col-xs-2"><input type="button" value="SHOW FILTERS" class="form-control btn btn-primary" data-toggle="collapse" data-target="#collapseExample" id="show_filter" aria-expanded="false" aria-controls="collapseExample" style="background-color: #EAF044; color: #103d39; border-radius: 30px" /></div>'
                inlineHtml +=
                    '<div class="col-xs-5"></div>'

                inlineHtml += '</div>';
                inlineHtml += '</div>';
                inlineHtml += '<div class="collapse" id="collapseExample"><div class="card card-body">'
                inlineHtml += '<div>';
                //Dropdown to Select the Fracnhisee
                //Search: SMC - Franchisees
                var searchZees = search.load({
                    id: 'customsearch_smc_franchisee'
                });
                var resultSetZees = searchZees.run();
                
                inlineHtml += franchiseeDropdownSection(resultSetZees, context);
                inlineHtml += leadStatusDropdown(leadStatus)
                inlineHtml += leadSourceFilterSection(source, salesrep, campaign, parentLPO, lead_entered_by);
                inlineHtml += dateFilterSection(modified_start_date, modified_last_date, firstDayOfPreviousMonth, lastDay);
                inlineHtml += '</div></div></div></br></br>';

                inlineHtml += tabsSection();
                inlineHtml += dataTable();

                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;

                form.clientScriptFileId = 7017893;

                context.response.writePage(form);
            } else {

            }
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
            inlineHtml += '<select id="zee_dropdown" class="js-example-basic-multiple js-states form-control" style="width: 100%" multiple="multiple">';
            inlineHtml += '<option value=""></option>'
            resultSetZees.each(function (searchResult_zee) {
                zee_id = searchResult_zee.getValue('internalid');
                zee_name = searchResult_zee.getValue('companyname');

                if (role == 1000) {
                    if (zee == zee_id) {
                        inlineHtml += '<option value="' + zee_id +
                            '" selected="selected">' + zee_name + '</option>';
                    }
                } else {
                    if (isNullorEmpty(zee)) {
                        inlineHtml += '<option value="' + zee_id + '">' + zee_name +
                            '</option>';
                    } else {
                        if (zee.indexOf(",") != -1) {
                            var zeeArray = zee.split(',');
                        } else {
                            var zeeArray = [];
                            zeeArray.push(zee)
                        }

                        if (zeeArray.indexOf(zee_id) != -1) {
                            inlineHtml += '<option value="' + zee_id +
                                '" selected="selected">' + zee_name + '</option>';
                        } else {
                            inlineHtml += '<option value="' + zee_id + '">' + zee_name +
                                '</option>';
                        }
                    }
                    // if (zee == zee_id) {
                    //     inlineHtml += '<option value="' + zee_id +
                    //         '" selected="selected">' + zee_name + '</option>';
                    // } else {
                    //     inlineHtml += '<option value="' + zee_id + '">' + zee_name +
                    //         '</option>';
                    // }
                }


                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;

        }

        function leadStatusDropdown(custStatus) {
            var inlineHtml =
                '<div class="form-group container status_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container status_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 cust_status_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="cust_status_text">STATUS</span>';
            inlineHtml += '<select id="cust_status" class="form-control">';
            inlineHtml += '<option value="0"></option>';

            if (custStatus == '13') {
                inlineHtml += '<option value="13" selected>CUSTOMER - SIGNED</option>';
            } else {
                inlineHtml += '<option value="13">CUSTOMER - SIGNED</option>';
            }

            if (custStatus == '66') {
                inlineHtml += '<option value="66" selected>CUSTOMER - To Be Finalised</option>';
            } else {
                inlineHtml += '<option value="66">CUSTOMER - To Be Finalised</option>';
            }

            if (custStatus == '32') {
                inlineHtml += '<option value="32" selected>CUSTOMER - Free Trail</option>';
            } else {
                inlineHtml += '<option value="32">CUSTOMER - Free Trial</option>';
            }

            if (custStatus == '71') {
                inlineHtml += '<option value="32" selected>CUSTOMER - Free Trail Pending</option>';
            } else {
                inlineHtml += '<option value="32">CUSTOMER - Free Trial Pending</option>';
            }

            if (custStatus == '57') {
                inlineHtml += '<option value="57" selected>SUSPECT - HOT LEAD</option>';
            } else {
                inlineHtml += '<option value="57">SUSPECT - HOT LEAD</option>';
            }

            if (custStatus == '42') {
                inlineHtml += '<option value="42" selected>SUSPECT - QUALIFIED</option>';
            } else {
                inlineHtml += '<option value="42">SUSPECT - QUALIFIED</option>';
            }

            if (custStatus == '6') {
                inlineHtml += '<option value="6" selected>SUSPECT - NEW</option>';
            } else {
                inlineHtml += '<option value="6">SUSPECT - NEW</option>';
            }

            if (custStatus == '20') {
                inlineHtml += '<option value="20" selected>SUSPECT - NO ANSWER</option>';
            } else {
                inlineHtml += '<option value="20">SUSPECT - NO ANSWER</option>';
            }

            if (custStatus == '69') {
                inlineHtml += '<option value="69" selected>SUSPECT - IN CONTACT</option>';
            } else {
                inlineHtml += '<option value="69">SUSPECT - IN CONTACT</option>';
            }

            if (custStatus == '18') {
                inlineHtml += '<option value="18" selected>SUSPECT - FOLLOW UP</option>';
            } else {
                inlineHtml += '<option value="18">SUSPECT - FOLLOW UP</option>';
            }

            if (custStatus == '67') {
                inlineHtml += '<option value="67" selected>SUSPECT - LPO FOLLOW UP</option>';
            } else {
                inlineHtml += '<option value="67">SUSPECT - LPO FOLLOW UP</option>';
            }

            if (custStatus == '62') {
                inlineHtml += '<option value="62" selected>SUSPECT - PARKING LOT</option>';
            } else {
                inlineHtml += '<option value="62">SUSPECT - PARKING LOT</option>';
            }

            if (custStatus == '68') {
                inlineHtml += '<option value="68" selected>SUSPECT - VALIDATED</option>';
            } else {
                inlineHtml += '<option value="68">SUSPECT - VALIDATED</option>';
            }

            if (custStatus == '60') {
                inlineHtml += '<option value="60" selected>SUSPECT - REP REASSIGN</option>';
            } else {
                inlineHtml += '<option value="60">SUSPECT - REP REASSIGN</option>';
            }

            if (custStatus == '7') {
                inlineHtml += '<option value="7" selected>SUSPECT - REJECTED</option>';
            } else {
                inlineHtml += '<option value="7">SUSPECT - REJECTED</option>';
            }

            if (custStatus == '70') {
                inlineHtml += '<option value="70" selected>PROSPECT - QUALIFIED</option>';
            } else {
                inlineHtml += '<option value="70">PROSPECT - QUALIFIED</option>';
            }

            if (custStatus == '50') {
                inlineHtml += '<option value="50" selected>PROSPECT - QUOTE SENT</option>';
            } else {
                inlineHtml += '<option value="50">PROSPECT - QUOTE SENT</option>';
            }

            if (custStatus == '58') {
                inlineHtml += '<option value="58" selected>PROSPECT - OPPORTUNITY</option>';
            } else {
                inlineHtml += '<option value="58">PROSPECT - OPPORTUNITY</option>';
            }

            if (custStatus == '8') {
                inlineHtml += '<option value="8" selected>PROSPECT - IN CONTACT</option>';
            } else {
                inlineHtml += '<option value="8">PROSPECT - IN CONTACT</option>';
            }

            if (custStatus == '35') {
                inlineHtml += '<option value="35" selected>PROSPECT - NO ANSWER</option>';
            } else {
                inlineHtml += '<option value="35">PROSPECT - NO ANSWER</option>';
            }

            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;
        }

        function leadSourceFilterSection(source, salesrep, campaign, parentLPO, lead_entered_by) {
            var inlineHtml = '<div class="form-group container source_salesrep_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">LEAD SOURCE & SALES REP - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container source_salesrep_section hide">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-6 campaign_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="source_text">CAMPAIGN</span>';
            inlineHtml += '<select id="sales_campaign" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
            inlineHtml += '<option></option>';

            var salesCampaignSearch = search.load({
                type: 'customrecord_salescampaign',
                id: 'customsearch_sales_button_campaign'
            });

            salesCampaignSearch.run().each(function (
                salesCampaignSearchResultSet) {

                var salesCampaignInternalId = salesCampaignSearchResultSet.getValue('internalid');
                var salesCampaignName = salesCampaignSearchResultSet.getValue('name');

                if (isNullorEmpty(campaign)) {
                    inlineHtml += '<option value="' + salesCampaignInternalId + '" >' +
                        salesCampaignName + '</option>';
                } else {
                    if (campaign.indexOf(",") != -1) {
                        var campaignArray = campaign.split(',');
                    } else {
                        var campaignArray = [];
                        campaignArray.push(campaign)
                    }


                    if (campaignArray.indexOf(salesCampaignInternalId) != -1) {
                        inlineHtml += '<option value="' + salesCampaignInternalId + '" selected>' +
                            salesCampaignName + '</option>';
                    } else {
                        inlineHtml += '<option value="' + salesCampaignInternalId + '" >' +
                            salesCampaignName + '</option>';
                    }
                }

                // if (salesCampaignInternalId == campaign) {
                //     inlineHtml += '<option value="' + salesCampaignInternalId + '" selected>' +
                //         salesCampaignName + '</option>';
                // } else {
                //     inlineHtml += '<option value="' + salesCampaignInternalId + '" >' +
                //         salesCampaignName + '</option>';
                // }

                return true;
            });

            inlineHtml += '</select>';
            inlineHtml += '</div></div>';

            inlineHtml += '<div class="col-xs-6 source_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="source_text">SOURCE</span>';
            inlineHtml += '<select id="lead_source" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
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

                if (isNullorEmpty(source)) {
                    inlineHtml += '<option value="' + leadsourceid + '" >' +
                        leadsourcename + '</option>';
                } else {
                    if (source.indexOf(",") != -1) {
                        var sourceArray = source.split(',');
                    } else {
                        var sourceArray = [];
                        sourceArray.push(source)
                    }

                    if (sourceArray.indexOf(leadsourceid) != -1) {
                        inlineHtml += '<option value="' + leadsourceid + '" selected>' +
                            leadsourcename + '</option>';
                    } else {
                        inlineHtml += '<option value="' + leadsourceid + '" >' +
                            leadsourcename + '</option>';
                    }
                }

                // if (leadsourceid == source) {
                //     inlineHtml += '<option value="' + leadsourceid + '" selected>' +
                //         leadsourcename + '</option>';
                // } else {
                //     inlineHtml += '<option value="' + leadsourceid + '" >' +
                //         leadsourcename + '</option>';
                // }

                return true;
            });

            inlineHtml += '</select>';
            inlineHtml += '</div></div>';
            inlineHtml += '</div></div>';

            inlineHtml += '<div class="form-group container source_salesrep_section hide">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-6 sales_rep_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="source_text">SALES REP</span>';
            inlineHtml += '<select id="sales_rep" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
            inlineHtml += '<option></option>';

            //Search: Sales Record - Last Assigned List
            var salesRecordLastAssignedListListSearch = search.load({
                id: 'customsearch8649',
                type: 'customrecord_sales'
            });
            var salesRecordLastAssignedListListSearchResultSet = salesRecordLastAssignedListListSearch.run();

            salesRecordLastAssignedListListSearchResultSet.each(function (salesRecordLastAssignedListListResultSet) {
                var employeeId = salesRecordLastAssignedListListResultSet.getValue({
                    name: "custrecord_sales_assigned",
                    summary: "GROUP"
                });
                var employeeText = salesRecordLastAssignedListListResultSet.getText({
                    name: "custrecord_sales_assigned",
                    summary: "GROUP"
                });

                if (isNullorEmpty(salesrep)) {
                    inlineHtml += '<option value="' + employeeId + '">' + employeeText +
                        '</option>';
                } else {
                    if (salesrep.indexOf(",") != -1) {
                        var salesrepArray = salesrep.split(',');
                    } else {
                        var salesrepArray = [];
                        salesrepArray.push(salesrep)
                    }

                    if (salesrepArray.indexOf(employeeId) != -1) {
                        inlineHtml += '<option value="' + employeeId +
                            '" selected="selected">' + employeeText + '</option>';
                    } else {
                        inlineHtml += '<option value="' + employeeId + '">' + employeeText +
                            '</option>';
                    }
                }

                // if (salesrep == employeeId) {
                //     inlineHtml += '<option value="' + employeeId +
                //         '" selected="selected">' + employeeText + '</option>';
                // } else {
                //     inlineHtml += '<option value="' + employeeId + '">' + employeeText +
                //         '</option>';
                // }

                return true;
            });

            // if (salesrep == '668711') {
            //     inlineHtml += '<option value="668711" selected>Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382">Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // } else if (salesrep == '696160') {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160" selected>Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382">Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // } else if (salesrep == '690145') {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145" selected>David Gdanski</option>';
            //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382">Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // } else if (salesrep == '668712') {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712" selected>Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382">Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // } else if (salesrep == '1809334') {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334" selected>David Daoud</option>';
            //     inlineHtml += '<option value="1809382">Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // } else if (salesrep == '1809382') {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712" >Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382" selected>Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // } else if (salesrep == '1797389') {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712" >Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382" selected>Liam Pike</option>';
            //     inlineHtml += '<option value="1797389" selected>Bobbi G Yengbie</option>';
            // } else {
            //     inlineHtml += '<option value="668711">Lee Russell</option>';
            //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
            //     inlineHtml += '<option value="690145">David Gdanski</option>';
            //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
            //     inlineHtml += '<option value="1809334">David Daoud</option>';
            //     inlineHtml += '<option value="1809382">Liam Pike</option>';
            //     inlineHtml += '<option value="1797389">Bobbi G Yengbie</option>';
            // }



            inlineHtml += '</select>';
            inlineHtml += '</div></div>'

            inlineHtml += '<div class="col-xs-6 sales_rep_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="source_text">LEAD ENTERED BY</span>';
            inlineHtml += '<select id="lead_entered_by" class="form-control" style="width: 100%" >';
            inlineHtml += '<option></option>';

            //Search: Leads Entered By List
            var leadEnteredByListSearch = search.load({
                id: 'customsearch_lead_entered_by_list',
                type: 'customer'
            });
            var leadEnteredByListSearchResultSet = leadEnteredByListSearch.run();

            leadEnteredByListSearchResultSet.each(function (leadEnteredByListResultSet) {
                var employeeId = leadEnteredByListResultSet.getValue({
                    name: "custentity_lead_entered_by",
                    summary: "GROUP"
                });
                var employeeText = leadEnteredByListResultSet.getText({
                    name: "custentity_lead_entered_by",
                    summary: "GROUP"
                });

                // if (isNullorEmpty(lead_entered_by)) {
                //     inlineHtml += '<option value="' + employeeId + '">' + employeeText +
                //             '</option>';
                // } else {
                //     var lead_entered_byArray = lead_entered_by.split(',');
                //     if (lead_entered_byArray.indexOf(employeeId) != -1) {
                //         inlineHtml += '<option value="' + employeeId +
                //             '" selected="selected">' + employeeText + '</option>';
                //     } else {
                //         inlineHtml += '<option value="' + employeeId + '">' + employeeText +
                //             '</option>';
                //     }
                // }

                if (lead_entered_by == employeeId) {
                    inlineHtml += '<option value="' + employeeId +
                        '" selected="selected">' + employeeText + '</option>';
                } else {
                    inlineHtml += '<option value="' + employeeId + '">' + employeeText +
                        '</option>';
                }

                return true;
            });

            inlineHtml += '</select>';
            inlineHtml += '</div ></div > ';
            inlineHtml += '</div ></div > ';

            // if (campaign == 69) {
            inlineHtml += '<div class="form-group container parent_lpo_label_section">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">PARENT LPO - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container parent_lpo_section">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-12 parent_lpo_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="parent_lpo_text">PARENT LPO</span>';
            inlineHtml += '<select id="parent_lpo" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
            inlineHtml += '<option></option>';

            var parentLPOSearch = search.load({
                type: 'customer',
                id: 'customsearch_parent_lpo_customers'
            });

            parentLPOSearch.run().each(function (
                parentLPOSearchResultSet) {

                var parentLPOInternalId = parentLPOSearchResultSet.getValue({
                    name: 'internalid',
                    summary: 'GROUP'
                });
                var parentLPOName = parentLPOSearchResultSet.getValue({
                    name: 'companyname',
                    summary: 'GROUP'
                });

                if (isNullorEmpty(parentLPO)) {
                    inlineHtml += '<option value="' + parentLPOInternalId + '" >' +
                        parentLPOName + '</option>';
                } else {
                    if (parentLPO.indexOf(",") != -1) {
                        var parentLPOArray = parentLPO.split(',');
                    } else {
                        var parentLPOArray = [];
                        parentLPOArray.push(parentLPO)
                    }
                    // var parentLPOArray = parentLPO.split(',');
                    if (parentLPOArray.indexOf(parentLPOInternalId) != -1) {
                        inlineHtml += '<option value="' + parentLPOInternalId + '" selected>' +
                            parentLPOName + '</option>';
                    } else {
                        inlineHtml += '<option value="' + parentLPOInternalId + '" >' +
                            parentLPOName + '</option>';
                    }
                }

                // if (parentLPOInternalId == parentLPO) {
                //     inlineHtml += '<option value="' + parentLPOInternalId + '" selected>' +
                //         parentLPOName + '</option>';
                // } else {
                //     inlineHtml += '<option value="' + parentLPOInternalId + '" >' +
                //         parentLPOName + '</option>';
                // }

                return true;
            });

            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';
            // }


            return inlineHtml;
        }

        /**
        * The date input fields to filter the invoices.
        * Even if the parameters `date_from` and `date_to` are defined, they can't be initiated in the HTML code.
        * They are initiated with jQuery in the `pageInit()` function.
        * @return  {String} `inlineHtml`
        */
        function dateFilterSection(modified_start_date, modified_last_date, firstDayOfPreviousMonth, lastDay) {
            var inlineHtml = '<div class="form-group container lead_entered_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS CHANGE DATE - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container modified_date_div hide">';
            inlineHtml += '<div class="row">';

            // Last Modified Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="modified_date_from_text">STATUS CHANGE DATE - FROM</span>';
            if (isNullorEmpty(modified_start_date)) {
                inlineHtml += '<input id="modified_date_from" class="form-control modified_date_from" type="date"  min="' + firstDayOfPreviousMonth + '" max="' + lastDay + '"/>';
            } else {
                inlineHtml += '<input id="modified_date_from" class="form-control modified_date_from" type="date" value="' + modified_start_date + '" min="' + firstDayOfPreviousMonth + '" max="' + lastDay + '"/>';
            }

            inlineHtml += '</div></div>';
            // Last Modified Date to field
            inlineHtml += '<div class="col-xs-6 date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_to_text">STATUS CHANGE DATE - TO</span>';
            if (isNullorEmpty(modified_last_date)) {
                inlineHtml += '<input id="modified_date_to" class="form-control modified_date_to" type="date" min="' + firstDayOfPreviousMonth + '" max="' + lastDay + '">';
            } else {
                inlineHtml += '<input id="modified_date_to" class="form-control modified_date_to" type="date" value="' + modified_last_date + '" min="' + firstDayOfPreviousMonth + '" max="' + lastDay + '">';
            }

            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container filter_buttons_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-2"></div>'
            inlineHtml +=
                '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="background-color: #095C7B; border-radius: 30px" /></div>'
            inlineHtml +=
                '<div class="col-xs-4"><input type="button" value="CLEAR FILTER" class="form-control btn btn-primary" id="clearFilter" style="background-color: #F0AECB; color: #103d39;border-radius: 30px" /></div>'
            inlineHtml +=
                '<div class="col-xs-2"></div>'

            inlineHtml += '</div>';
            inlineHtml += '</div>';


            return inlineHtml;
        }

        /**
         * @description section that displays all the atbs present on the page
         * @author Ankith Ravindran (AR)
         * @date 23/06/2024
         * @returns {*} 
         */
        function tabsSection() {
            var inlineHtml = '<div class="tabs_section hide">';

            // Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';

            inlineHtml +=
                '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

            inlineHtml +=
                '<li role="presentation" class="active"><a data-toggle="tab" href="#overview" style="border-radius: 30px"><b>OVERVIEW</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#salesreplist" style="border-radius: 30px"><b>BY SALES REP - OVERVIEW</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#statuscustlist" style="border-radius: 30px"><b>BY STATUS - CUSTOMER/LEADS LIST</b></a></li>';
            inlineHtml +=
                '<li role="presentation" class=""><a data-toggle="tab" href="#custlist" style="border-radius: 30px"><b>CUSTOMER/LEADS LIST</b></a></li>';

            inlineHtml += '</ul></div>';

            // Tabs content
            inlineHtml += '<div class="tab-content">';
            inlineHtml += '<div role="tabpanel" class="tab-pane active" id="overview">';



            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_preview"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('preview');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane " id="salesreplist">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_salesreplist"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('sales_rep_list');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane " id="custlist">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_custlist"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('cust_list');
            inlineHtml += '</div>';

            inlineHtml += '<div role="tabpanel" class="tab-pane " id="statuscustlist">';
            inlineHtml += '<figure class="highcharts-figure">';
            inlineHtml += '<div id="container_statuscustlist"></div>';
            inlineHtml += '</figure><br></br>';
            inlineHtml += dataTable('status_cust_list');
            inlineHtml += '</div>';


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
                ' th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;} th.table-bg-color{background-color: #045d7b; color: #ffffff;}</style>';
            inlineHtml += '<div class="table_section hide"><table id="mpexusage-' +
                name +
                '" class="table table-responsive customer tablesorter row-border cell-border compact" style="width: 100%;border: 2px solid #103d39">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
            inlineHtml += '<tr class="text-center">';
            if (name == 'preview') {
                inlineHtml += '<th>Transition From & To</th><th>Suspect - New</th><th>Suspect - Hot Lead</th><th>Suspect - Qualified</th><th>Suspect - Validated</th><th>Suspect - Reassign</th><th>Suspect - Follow Up</th><th>Suspect - LPO Follow Up</th><th>Suspect - No Answer</th><th>Suspect - In Contact</th><th>Prospect - No Answer</th><th>Prospect - In Contact</th><th>Suspect - Parking Lot</th><th>Suspect - Lost</th><th>Suspect - Out of Territory</th><th>Suspect - Customer - Lost</th><th>Prospect - Opportunity</th><th>Prospect - Qualified</th><th>Prospect - Quote Sent</th><th>Customer - Free Trial Pending</th><th>Customer - Free Trial</th><th>Customer - Signed</th><th>Total Leads</th>'
            }
            inlineHtml += '</tr>';
            inlineHtml += '</thead>';

            inlineHtml += '<tbody id="result_usage_' + name + '" class="text-center"></tbody>';

            if (name == 'preview') {
                inlineHtml += '<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>'
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

        function getDateRange(period) {
            // 
            // Calculates the date range for a given period in AEST using Moment.js.

            //     Args:
            //         period: A string specifying the period (e.g., "lastWeek", "thisMonth", etc.).

            //             Returns:
            //     An object with two properties: "startDate" and "endDate" representing the date range in AEST.
            //
            var returnDate = [];
            var today = moment();

            var dateFormat = 'YYYY-MM-DD';
            var testDateUtc = moment.utc(today);
            today = testDateUtc.local();

            log.debug({
                title: 'period',
                details: period
            })
            log.debug({
                title: 'today',
                details: today
            })


            if (period == "lastWeek") {
                returnDate.push({
                    startDate: today.clone().startOf('isoweek').subtract(1, 'weeks').format(dateFormat), // Monday of last week
                    endDate: today.clone().endOf('isoweek').subtract(1, 'days').format(dateFormat) // Sunday of last week
                });
            } else if (period == "thisWeek") {
                returnDate.push({
                    startDate: today.clone().startOf('isoweek').format(dateFormat), // Monday of this week
                    endDate: today.clone().endOf('isoweek').format(dateFormat) // Sunday of this week
                });
            } else if (period == "lastMonth") {
                returnDate.push({
                    startDate: today.clone().startOf('month').subtract(1, 'months').format(dateFormat),
                    endDate: today.clone().endOf('month').subtract(1, 'months').format(dateFormat)
                });
            } else if (period == "thisMonth") {
                returnDate.push({
                    startDate: today.clone().startOf('month').format(dateFormat),
                    endDate: today.clone().endOf('month').format(dateFormat)
                });
            } else if (period == "lastYear") {
                returnDate.push({
                    startDate: today.clone().startOf('year').subtract(1, 'years').format(dateFormat),
                    endDate: today.clone().endOf('year').subtract(1, 'years').format(dateFormat)
                });
            } else if (period == "thisYear") {
                returnDate.push({
                    startDate: today.clone().startOf('year').format(dateFormat),
                    endDate: today.clone().endOf('year').format(dateFormat)
                });
            } else if (period == "thisFinancialYear") {
                const financialYearStart = moment().month(6).startOf('month'); // April 1st
                today.isBefore(financialYearStart) ? returnDate.push({
                    startDate: financialYearStart.subtract(1, 'years').format(dateFormat), // Previous financial year
                    endDate: today.clone().endOf('month').format(dateFormat) // Last day of current month
                }) : returnDate.push({
                    startDate: financialYearStart,
                    endDate: financialYearStart.add(1, 'years').subtract(1, 'days').format(dateFormat) // Last day of March next year
                });
            } else if (period == "lastFinancialYear") {
                const lastFinancialYearStart = moment().month(6).subtract(1, 'years').startOf('month'); returnDate.push({
                    startDate: lastFinancialYearStart.format(dateFormat),
                    endDate: lastFinancialYearStart.add(1, 'years').subtract(1, 'days').format(dateFormat) // Last day of March in previous year
                });
            }

            log.debug({
                title: 'returnDate',
                details: returnDate
            })

            // return returnDate;
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
