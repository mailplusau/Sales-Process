/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Wed Jan 21 2026
 * Modified on:          Wed Jan 21 2026 14:06:05
 * SuiteScript Version:  2.0 
 * Description:          Franchisee Sales/Leads Reporting page - Detailed List of Leads & Customers - Table View 
 *
 * Copyright (c) 2026 MailPlus Pty. Ltd.
 */


define([
    "SuiteScripts/jQuery Plugins/Moment JS/moment.min",
    "N/ui/serverWidget",
    "N/email",
    "N/runtime",
    "N/search",
    "N/record",
    "N/https",
    "N/log",
    "N/redirect",
    "N/url",
    "N/format"
], function (
    moment,
    ui,
    email,
    runtime,
    search,
    record,
    https,
    log,
    redirect,
    url,
    format
) {
    var role = 0;
    var userId = 0;
    var zee = 0;

    var employee_list = [];
    var employee_list_color = [];

    var campaign_list = [];
    var campaign_list_color = [];

    var source_list = [];
    var source_list_color = [];

    var mainLeadStatusArray = [
        "13",
        "73",
        "66",
        "32",
        "71",
        "22",
        "59",
        "57",
        "38",
        "42",
        "6",
        "20",
        "69",
        "18",
        "67",
        "62",
        "68",
        "60",
        "7",
        "70",
        "50",
        "58",
        "8",
        "35",
    ];
    var mainLeadStatusNameArray = [
        "CUSTOMER - SIGNED",
        "CUSTOMER - SHIPMATE PENDING",
        "CUSTOMER - To Be Finalised",
        "CUSTOMER - Free Trail",
        "CUSTOMER - Free Trail Pending",
        "SUSPECT - Customer - Lost",
        "SUSPECT - LOST",
        "SUSPECT - HOT LEAD",
        "SUSPECT - UNQUALIFIED",
        "SUSPECT - QUALIFIED",
        "SUSPECT - NEW",
        "SUSPECT - NO ANSWER",
        "SUSPECT - IN CONTACT",
        "SUSPECT - FOLLOW UP",
        "SUSPECT - LPO FOLLOW UP",
        "SUSPECT - PARKING LOT",
        "SUSPECT - VALIDATED",
        "SUSPECT - REP REASSIGN",
        "SUSPECT - REJECTED",
        "PROSPECT - QUALIFIED",
        "PROSPECT - QUOTE SENT",
        "PROSPECT - OPPORTUNITY",
        "PROSPECT - IN CONTACT",
        "PROSPECT - NO ANSWER",
    ];

    function onRequest(context) {
        var baseURL = "https://system.na2.netsuite.com";
        if (runtime.EnvType == "SANDBOX") {
            baseURL = "https://system.sandbox.netsuite.com";
        }
        userId = runtime.getCurrentUser().id;
        pageUserId = runtime.getCurrentUser().id;

        role = runtime.getCurrentUser().role;
        // moment().tz.setDefault('Australia/Sydney'); // Set default timezone to AEST

        if (role == 1000) { //Franchisee Role
            zee = userId;
        }

        if (context.request.method === "GET") {
            var start_date = context.request.parameters.start_date;
            var last_date = context.request.parameters.last_date;

            var modified_start_date = context.request.parameters.modified_date_from;
            var modified_last_date = context.request.parameters.modified_date_to;

            var commencement_start_date =
                context.request.parameters.commence_date_from;
            var commencement_last_date = context.request.parameters.commence_date_to;

            var cancelled_start_date = context.request.parameters.cancel_date_from;
            var cancelled_last_date = context.request.parameters.cancel_date_to;

            var usage_date_from = context.request.parameters.usage_date_from;
            var usage_date_to = context.request.parameters.usage_date_to;

            var date_signed_up_from = context.request.parameters.date_signed_up_from;
            var date_signed_up_to = context.request.parameters.date_signed_up_to;

            var date_quote_sent_to = context.request.parameters.date_quote_sent_to;
            var date_quote_sent_from =
                context.request.parameters.date_quote_sent_from;

            var invoice_date_from = context.request.parameters.invoice_date_from;
            var invoice_date_to = context.request.parameters.invoice_date_to;
            var invoice_type = context.request.parameters.invoice_type;

            var source = context.request.parameters.source;
            var campaign = context.request.parameters.campaign;
            var parentLPO = context.request.parameters.lpo;
            var salesrep = context.request.parameters.sales_rep;
            var lead_entered_by = context.request.parameters.lead_entered_by;

            zee = context.request.parameters.zee;
            // zee = "1818654" //Alexandria Testing Franchisee ID
            // zee = "1631957" //Brisbane Testing Franchisee ID
            userId = context.request.parameters.user_id;
            var showTotal = context.request.parameters.showTotal;
            var calcprodusage = context.request.parameters.calcprodusage;
            var sales_activity_notes = context.request.parameters.salesactivitynotes;
            var customer_type = context.request.parameters.customertype;
            var leadStatus = context.request.parameters.status;
            var syncWithProspectPlus = context.request.parameters.syncWithPP;
            var start_synced_date = context.request.parameters.start_synced_date;
            var last_synced_date = context.request.parameters.last_synced_date;

            //https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=2411&deploy=1&start_date=2025-07-01&last_date=2026-01-31&usage_date_from=&usage_date_to=&date_signed_up_from=&date_signed_up_to=&commence_date_from=&commence_date_to=&cancel_date_from=&cancel_date_to=&source=null&date_quote_sent_from=&date_quote_sent_to=&sales_rep=null&zee=1631957&calcprodusage=2&invoice_date_from=&invoice_date_to=&campaign=null&lpo=null&lead_entered_by=null&modified_date_from=undefined&modified_date_to=undefined&status=null&salesactivitynotes=undefined&customertype=2&syncWithPP=0&start_synced_date=&last_synced_date=

            var page_no = context.request.parameters.page_no;
            if (isNullorEmpty(page_no)) {
                page_no = "1";
            }

            if (!isNullorEmpty(leadStatus)) {
                if (leadStatus.indexOf(",") != -1) {
                    var leadStatusArray = leadStatus.split(",");
                } else {
                    var leadStatusArray = [];
                    leadStatusArray.push(leadStatus);
                }
            } else {
                var leadStatusArray = [];
            }

            log.debug({
                title: "leadStatusArray",
                details: leadStatusArray,
            });

            log.debug({
                title: "zee",
                details: zee
            })

            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth();

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
            } while (i < 5);

            var firstDay = new Date(y, m, 1);
            firstDay.setHours(0, 0, 0, 0);
            lastDay.setHours(0, 0, 0, 0);

            start_date = GetFormattedDate(firstDay);
            last_date = GetFormattedDate(lastDay);

            log.debug({
                title: "start_date",
                details: start_date,
            });
            log.debug({
                title: "last_date",
                details: last_date,
            });

            var form = ui.createForm({
                title: "Sales Dashboard - Detailed List of Leads",
            });


            if (!isNullorEmpty(salesrep)) {
                if (salesrep.indexOf(",") != -1) {
                    var salesRepArray = campaign.split(",");
                } else {
                    var salesRepArray = [];
                    salesRepArray.push(salesrep);
                }
            }

            //Assign Color Codes to employees
            //Search Name: Active Employees - Sales Team
            // var salesTeamSearch = search.load({
            //     type: "employee",
            //     id: "customsearch_active_employees_3",
            // });

            // var letters = "0123456789ABCDEF";
            // var color = "#";

            // salesTeamSearch.run().each(function (salesTeamSearchResultSet) {
            //     var employee_id = salesTeamSearchResultSet.getValue("internalid");
            //     var first_name = salesTeamSearchResultSet.getValue("firstname");
            //     var last_name = salesTeamSearchResultSet.getValue("lastname");
            //     var employeeColorCode = salesTeamSearchResultSet.getValue(
            //         "custentity_employee_color_code"
            //     );
            //     var full_name = first_name + " " + last_name;

            //     if (isNullorEmpty(employeeColorCode)) {
            //         color = randomHexColorCode();
            //     } else {
            //         color = employeeColorCode;
            //     }

            //     employee_list.push(employee_id);
            //     employee_list_color.push(color);

            //     return true;
            // });

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

            inlineHtml +=
                "<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;}</style>";

            form
                .addField({
                    id: "custpage_overview_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_existing_customer_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_prospect_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_suspect_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_suspect_lost_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_suspect_offpeak_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_suspect_followup_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_suspect_oot_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_prospect_opportunity_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });
            form
                .addField({
                    id: "custpage_table_csv",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });

            form
                .addField({
                    id: "custpage_customer_id",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });

            form
                .addField({
                    id: "custpage_sales_rep_id",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });

            form
                .addField({
                    id: "custpage_contact_id",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });

            form
                .addField({
                    id: "custpage_contact_email",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });

            form
                .addField({
                    id: "custpage_employee_list",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = employee_list.toString();

            form
                .addField({
                    id: "custpage_employee_list_color",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = employee_list_color.toString();

            //Loading Section that gets displayed when the page is being loaded
            inlineHtml += loadingSection();
            // getDateRange('lastWeek');
            // getDateRange('lastMonth');
            // getDateRange('thisMonth');
            // getDateRange('lastFinancialYear');
            // getDateRange('thisFinancialYear');
            // getDateRange('lastYear');
            // getDateRange('thisYear');

            inlineHtml += stepByStepGuideModal();

            inlineHtml +=
                '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"></div></br>';

            inlineHtml +=
                '<div class="form-group container show_buttons_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-5"></div>';

            inlineHtml +=
                '<div class="col-xs-2"><input type="button" value="SHOW FILTERS" class="form-control btn btn-primary" data-toggle="collapse" data-target="#collapseExample" id="show_filter" aria-expanded="false" aria-controls="collapseExample" style="background-color: #EAF044; color: #103d39; border-radius: 30px" /></div>';
            inlineHtml += '<div class="col-xs-5"></div>';

            inlineHtml += "</div>";
            inlineHtml += "</div>";
            inlineHtml +=
                '<div class="collapse" id="collapseExample"><div class="card card-body">';
            inlineHtml += "<div>";
            //Dropdown to Select the Fracnhisee
            //Search: SMC - Franchisees
            var searchZees = search.load({
                id: "customsearch_smc_franchisee",
            });
            var resultSetZees = searchZees.run();

            inlineHtml += franchiseeDropdownSection(resultSetZees, context);
            inlineHtml += syncedWithProspectPlusDropdown(syncWithProspectPlus, start_synced_date, last_synced_date)
            inlineHtml += leadStatusDropdown(leadStatusArray);
            inlineHtml += leadSourceFilterSection(
                source,
                salesrep,
                campaign,
                parentLPO,
                lead_entered_by,
                customer_type
            );
            inlineHtml += dateFilterSection(
                start_date,
                last_date,
                usage_date_from,
                usage_date_to,
                date_signed_up_from,
                date_signed_up_to,
                invoice_date_from,
                invoice_date_to,
                invoice_type,
                date_quote_sent_to,
                date_quote_sent_from,
                calcprodusage,
                modified_start_date,
                modified_last_date,
                sales_activity_notes,
                commencement_start_date,
                commencement_last_date,
                cancelled_start_date,
                cancelled_last_date
            );
            inlineHtml += "</div></div></div></br></br>";


            if (!isNullorEmpty(zee)) {

                inlineHtml += tabsSection(page_no, campaign, source,
                    salesrep,
                    lead_entered_by,
                    customer_type,
                    start_date,
                    last_date,
                    date_signed_up_from,
                    date_signed_up_to,
                    date_quote_sent_to,
                    date_quote_sent_from,
                    commencement_start_date,
                    commencement_last_date, leadStatusArray, start_synced_date, last_synced_date);
            } else {
                inlineHtml +=
                    '<div class="container instruction_div" style="background-color: lightpink;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p>Please select a Franchisee.</p></div></br>';
            }
            form
                .addField({
                    id: "custpage_page_no",
                    type: ui.FieldType.TEXT,
                    label: "Page Number",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = page_no;

            form
                .addField({
                    id: "custpage_total_page_no",
                    type: ui.FieldType.TEXT,
                    label: "Total Page Number",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                });

            form
                .addField({
                    id: "custpage_campaign_list",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = campaign_list.toString();

            form
                .addField({
                    id: "custpage_campaign_list_color",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = campaign_list_color.toString();

            form
                .addField({
                    id: "custpage_source_list",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = source_list.toString();

            form
                .addField({
                    id: "custpage_source_list_color",
                    type: ui.FieldType.TEXT,
                    label: "Table CSV",
                })
                .updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN,
                }).defaultValue = source_list_color.toString();

            form
                .addField({
                    id: "preview_table",
                    label: "inlinehtml",
                    type: "inlinehtml",
                })
                .updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW,
                }).defaultValue = inlineHtml;

            form.clientScriptFileId = 7981941;

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
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml +=
            '<div class="form-group container zee_dropdown_section hide">';
        inlineHtml += '<div class="row">';
        // Period dropdown field
        inlineHtml += '<div class="col-xs-12 zee_dropdown_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="zee_dropdown_text">Franchisee</span>';
        inlineHtml +=
            '<select id="zee_dropdown" class="js-example-basic-multiple js-states form-control" style="width: 100%" multiple="multiple">';
        inlineHtml += '<option value=""></option>';
        resultSetZees.each(function (searchResult_zee) {
            zee_id = searchResult_zee.getValue("internalid");
            zee_name = searchResult_zee.getValue("companyname");

            if (role == 1000) {
                if (zee == zee_id) {
                    inlineHtml +=
                        '<option value="' +
                        zee_id +
                        '" selected="selected">' +
                        zee_name +
                        "</option>";
                }
            } else {
                if (isNullorEmpty(zee)) {
                    inlineHtml +=
                        '<option value="' + zee_id + '">' + zee_name + "</option>";
                } else {
                    if (zee.indexOf(",") != -1) {
                        var zeeArray = zee.split(",");
                    } else {
                        var zeeArray = [];
                        zeeArray.push(zee);
                    }

                    if (zeeArray.indexOf(zee_id) != -1) {
                        inlineHtml +=
                            '<option value="' +
                            zee_id +
                            '" selected="selected">' +
                            zee_name +
                            "</option>";
                    } else {
                        inlineHtml +=
                            '<option value="' + zee_id + '">' + zee_name + "</option>";
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
        inlineHtml += "</select>";
        inlineHtml += "</div></div></div></div>";

        return inlineHtml;
    }

    function syncedWithProspectPlusDropdown(syncWithProspectPlus, start_synced_date, last_synced_date) {
        var inlineHtml =
            '<div class="form-group container status_dropdown_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">PROSPECTPLUS SYNC</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml +=
            '<div class="form-group container status_dropdown_section hide">';
        inlineHtml += '<div class="row">';
        // Period dropdown field
        inlineHtml += '<div class="col-xs-12 pp_sync_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="pp_sync_text">PROSPECTPLUS SYNC</span>';
        inlineHtml +=
            '<select id="pp_sync" class="form-control" style="width: 100%">';
        inlineHtml += '<option value="0"></option>';
        if (syncWithProspectPlus == "1" || syncWithProspectPlus == 1) {
            inlineHtml +=
                '<option value="1" selected>YES</option>';
        } else if (syncWithProspectPlus == "2" || syncWithProspectPlus == 2) {
            inlineHtml += '<option value="2">NO</option>';
        } else {
            inlineHtml += '<option value="1">YES</option>';
            inlineHtml += '<option value="2">NO</option>';
        }
        inlineHtml += "</select>";
        inlineHtml += "</div></div></div></div>";

        inlineHtml += '<div class="form-group container lead_entered_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-6 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_from_text">DATE LEAD SYNCED - FROM</span>';
        if (isNullorEmpty(start_synced_date)) {
            inlineHtml +=
                '<input id="date_synced_from" class="form-control date_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="date_synced_from" class="form-control date_from" type="date" value="' +
                start_synced_date +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-6 date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_to_text">DATE LEAD SYNCED - TO</span>';
        if (isNullorEmpty(last_synced_date)) {
            inlineHtml +=
                '<input id="date_synced_to" class="form-control date_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="date_synced_to" class="form-control date_to" type="date" value="' +
                last_synced_date +
                '">';
        }

        inlineHtml += "</div></div></div></div>";

        return inlineHtml;
    }

    function leadStatusDropdown(leadStatusArray) {
        var inlineHtml =
            '<div class="form-group container status_dropdown_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml +=
            '<div class="form-group container status_dropdown_section hide">';
        inlineHtml += '<div class="row">';
        // Period dropdown field
        inlineHtml += '<div class="col-xs-12 cust_status_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="cust_status_text">STATUS</span>';
        inlineHtml +=
            '<select id="cust_status" class="js-example-basic-multiple form-control" multiple="multiple" style="width: 100%">';
        inlineHtml += '<option value="0"></option>';

        for (var a = 0; a < mainLeadStatusArray.length; a++) {
            if (isNullorEmpty(leadStatusArray)) {
                inlineHtml +=
                    '<option value="' +
                    mainLeadStatusArray[a] +
                    '" >' +
                    mainLeadStatusNameArray[a] +
                    "</option>";
            } else {
                if (leadStatusArray.indexOf(mainLeadStatusArray[a]) != -1) {
                    inlineHtml +=
                        '<option value="' +
                        mainLeadStatusArray[a] +
                        '" selected>' +
                        mainLeadStatusNameArray[a] +
                        "</option>";
                } else {
                    inlineHtml +=
                        '<option value="' +
                        mainLeadStatusArray[a] +
                        '" >' +
                        mainLeadStatusNameArray[a] +
                        "</option>";
                }
            }
        }

        // if (custStatus == "13") {
        // 	inlineHtml += '<option value="13" selected>CUSTOMER - SIGNED</option>';
        // } else {
        // 	inlineHtml += '<option value="13">CUSTOMER - SIGNED</option>';
        // }

        // if (custStatus == "66") {
        // 	inlineHtml +=
        // 		'<option value="66" selected>CUSTOMER - To Be Finalised</option>';
        // } else {
        // 	inlineHtml += '<option value="66">CUSTOMER - To Be Finalised</option>';
        // }

        // if (custStatus == "32") {
        // 	inlineHtml +=
        // 		'<option value="32" selected>CUSTOMER - Free Trail</option>';
        // } else {
        // 	inlineHtml += '<option value="32">CUSTOMER - Free Trial</option>';
        // }

        // if (custStatus == "71") {
        // 	inlineHtml +=
        // 		'<option value="32" selected>CUSTOMER - Free Trail Pending</option>';
        // } else {
        // 	inlineHtml += '<option value="32">CUSTOMER - Free Trial Pending</option>';
        // }

        // if (custStatus == "57") {
        // 	inlineHtml += '<option value="57" selected>SUSPECT - HOT LEAD</option>';
        // } else {
        // 	inlineHtml += '<option value="57">SUSPECT - HOT LEAD</option>';
        // }

        // if (custStatus == "38") {
        // 	inlineHtml +=
        // 		'<option value="38" selected>SUSPECT - UNQUALIFIED</option>';
        // } else {
        // 	inlineHtml += '<option value="38">SUSPECT - UNQUALIFIED</option>';
        // }

        // if (custStatus == "42") {
        // 	inlineHtml += '<option value="42" selected>SUSPECT - QUALIFIED</option>';
        // } else {
        // 	inlineHtml += '<option value="42">SUSPECT - QUALIFIED</option>';
        // }

        // if (custStatus == "6") {
        // 	inlineHtml += '<option value="6" selected>SUSPECT - NEW</option>';
        // } else {
        // 	inlineHtml += '<option value="6">SUSPECT - NEW</option>';
        // }

        // if (custStatus == "20") {
        // 	inlineHtml += '<option value="20" selected>SUSPECT - NO ANSWER</option>';
        // } else {
        // 	inlineHtml += '<option value="20">SUSPECT - NO ANSWER</option>';
        // }

        // if (custStatus == "69") {
        // 	inlineHtml += '<option value="69" selected>SUSPECT - IN CONTACT</option>';
        // } else {
        // 	inlineHtml += '<option value="69">SUSPECT - IN CONTACT</option>';
        // }

        // if (custStatus == "18") {
        // 	inlineHtml += '<option value="18" selected>SUSPECT - FOLLOW UP</option>';
        // } else {
        // 	inlineHtml += '<option value="18">SUSPECT - FOLLOW UP</option>';
        // }

        // if (custStatus == "67") {
        // 	inlineHtml +=
        // 		'<option value="67" selected>SUSPECT - LPO FOLLOW UP</option>';
        // } else {
        // 	inlineHtml += '<option value="67">SUSPECT - LPO FOLLOW UP</option>';
        // }

        // if (custStatus == "62") {
        // 	inlineHtml +=
        // 		'<option value="62" selected>SUSPECT - PARKING LOT</option>';
        // } else {
        // 	inlineHtml += '<option value="62">SUSPECT - PARKING LOT</option>';
        // }

        // if (custStatus == "68") {
        // 	inlineHtml += '<option value="68" selected>SUSPECT - VALIDATED</option>';
        // } else {
        // 	inlineHtml += '<option value="68">SUSPECT - VALIDATED</option>';
        // }

        // if (custStatus == "60") {
        // 	inlineHtml +=
        // 		'<option value="60" selected>SUSPECT - REP REASSIGN</option>';
        // } else {
        // 	inlineHtml += '<option value="60">SUSPECT - REP REASSIGN</option>';
        // }

        // if (custStatus == "7") {
        // 	inlineHtml += '<option value="7" selected>SUSPECT - REJECTED</option>';
        // } else {
        // 	inlineHtml += '<option value="7">SUSPECT - REJECTED</option>';
        // }

        // if (custStatus == "70") {
        // 	inlineHtml += '<option value="70" selected>PROSPECT - QUALIFIED</option>';
        // } else {
        // 	inlineHtml += '<option value="70">PROSPECT - QUALIFIED</option>';
        // }

        // if (custStatus == "50") {
        // 	inlineHtml +=
        // 		'<option value="50" selected>PROSPECT - QUOTE SENT</option>';
        // } else {
        // 	inlineHtml += '<option value="50">PROSPECT - QUOTE SENT</option>';
        // }

        // if (custStatus == "58") {
        // 	inlineHtml +=
        // 		'<option value="58" selected>PROSPECT - OPPORTUNITY</option>';
        // } else {
        // 	inlineHtml += '<option value="58">PROSPECT - OPPORTUNITY</option>';
        // }

        // if (custStatus == "8") {
        // 	inlineHtml += '<option value="8" selected>PROSPECT - IN CONTACT</option>';
        // } else {
        // 	inlineHtml += '<option value="8">PROSPECT - IN CONTACT</option>';
        // }

        // if (custStatus == "35") {
        // 	inlineHtml += '<option value="35" selected>PROSPECT - NO ANSWER</option>';
        // } else {
        // 	inlineHtml += '<option value="35">PROSPECT - NO ANSWER</option>';
        // }

        inlineHtml += "</select>";
        inlineHtml += "</div></div></div></div>";

        return inlineHtml;
    }

    /*
     * PURPOSE : HTML code to generate the Modal Pop-up
     *  PARAMS :  -
     * RETURNS : HTML
     *   NOTES :
     */
    function stepByStepGuideModal() {
        var inlineHtml =
            '<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="overflow:auto !important;max-height: calc(100vh - 125px) !important;position: absolute;transform: translate(-50%, -50%);background-color: #CFE0CE; margin: auto; padding: 0; border: 1px solid #888;width: fit-content; left: 50%;top: 50%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); -webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h1 class="modal-title" id="modal-title">STEP BY STEP GUIDE</h1></div>';

        inlineHtml += '<div class="modal-body" style="padding: 2px 16px;">';
        inlineHtml += '<div class="form-group container mpex_customer2_section">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<iframe src="https://scribehow.com/embed/Sales_Full_Report__Rx3wYVX_TZWc9h9CdpS1Lw?as=scrollable&skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>';

        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml += "</div></div></div>";

        return inlineHtml;
    }

    function leadSourceFilterSection(
        source,
        salesrep,
        campaign,
        parentLPO,
        lead_entered_by,
        customer_type
    ) {
        var inlineHtml =
            '<div class="form-group container source_salesrep_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">LEAD SOURCE & SALES REP - FILTER</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml +=
            '<div class="form-group container source_salesrep_section hide">';
        inlineHtml += '<div class="row">';

        inlineHtml += '<div class="col-xs-6 campaign_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="source_text">CAMPAIGN</span>';
        inlineHtml +=
            '<select id="sales_campaign" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
        inlineHtml += "<option></option>";

        var salesCampaignSearch = search.load({
            type: "customrecord_salescampaign",
            id: "customsearch_sales_button_campaign",
        });

        salesCampaignSearch.run().each(function (salesCampaignSearchResultSet) {
            var salesCampaignInternalId =
                salesCampaignSearchResultSet.getValue("internalid");
            var salesCampaignName = salesCampaignSearchResultSet.getValue("name");
            var campaignColorCode = salesCampaignSearchResultSet.getValue(
                "custrecord_campaign_color_code"
            );

            if (isNullorEmpty(campaignColorCode)) {
                campaignColorCode = "#F5F7F8";
            }

            campaign_list.push(salesCampaignInternalId);
            campaign_list_color.push(campaignColorCode);

            if (isNullorEmpty(campaign)) {
                inlineHtml +=
                    '<option value="' +
                    salesCampaignInternalId +
                    '" >' +
                    salesCampaignName +
                    "</option>";
            } else {
                if (campaign.indexOf(",") != -1) {
                    var campaignArray = campaign.split(",");
                } else {
                    var campaignArray = [];
                    campaignArray.push(campaign);
                }

                if (campaignArray.indexOf(salesCampaignInternalId) != -1) {
                    inlineHtml +=
                        '<option value="' +
                        salesCampaignInternalId +
                        '" selected>' +
                        salesCampaignName +
                        "</option>";
                } else {
                    inlineHtml +=
                        '<option value="' +
                        salesCampaignInternalId +
                        '" >' +
                        salesCampaignName +
                        "</option>";
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

        inlineHtml += "</select>";
        inlineHtml += "</div></div>";

        inlineHtml += '<div class="col-xs-6 source_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="source_text">SOURCE</span>';
        inlineHtml +=
            '<select id="lead_source" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
        inlineHtml += "<option></option>";
        //NetSuite Search: LEAD SOURCE
        var leadSourceSearch = search.load({
            type: "campaign",
            id: "customsearch_lead_source",
        });

        leadSourceSearch.run().each(function (leadSourceResultSet) {
            var leadsourceid = leadSourceResultSet.getValue({
                name: "internalid",
            });
            var leadsourcename = leadSourceResultSet.getValue({
                name: "title",
            });
            var sourceColorCode = leadSourceResultSet.getValue({
                name: "custevent_source_color_code",
            });

            if (!isNullorEmpty(sourceColorCode)) {
                source_list.push(leadsourceid);
                source_list_color.push(sourceColorCode);
            }

            if (isNullorEmpty(source)) {
                inlineHtml +=
                    '<option value="' +
                    leadsourceid +
                    '" >' +
                    leadsourcename +
                    "</option>";
            } else {
                if (source.indexOf(",") != -1) {
                    var sourceArray = source.split(",");
                } else {
                    var sourceArray = [];
                    sourceArray.push(source);
                }

                if (sourceArray.indexOf(leadsourceid) != -1) {
                    inlineHtml +=
                        '<option value="' +
                        leadsourceid +
                        '" selected>' +
                        leadsourcename +
                        "</option>";
                } else {
                    inlineHtml +=
                        '<option value="' +
                        leadsourceid +
                        '" >' +
                        leadsourcename +
                        "</option>";
                }
            }

            return true;
        });

        inlineHtml += "</select>";
        inlineHtml += "</div></div>";
        inlineHtml += "</div></div>";

        inlineHtml +=
            '<div class="form-group container source_salesrep_section hide">';
        inlineHtml += '<div class="row">';

        inlineHtml += '<div class="col-xs-6 sales_rep_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="source_text">SALES REP</span>';
        inlineHtml +=
            '<select id="sales_rep" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
        inlineHtml += "<option></option>";

        if(role != 1)
        //Search: Sales Record - Last Assigned List
        var salesRecordLastAssignedListListSearch = search.load({
            id: "customsearch8649",
            type: "customrecord_sales",
        });
        var salesRecordLastAssignedListListSearchResultSet =
            salesRecordLastAssignedListListSearch.run();

        salesRecordLastAssignedListListSearchResultSet.each(function (
            salesRecordLastAssignedListListResultSet
        ) {
            var employeeId = salesRecordLastAssignedListListResultSet.getValue({
                name: "custrecord_sales_assigned",
                summary: "GROUP",
            });
            var employeeText = salesRecordLastAssignedListListResultSet.getText({
                name: "custrecord_sales_assigned",
                summary: "GROUP",
            });

            if (isNullorEmpty(salesrep)) {
                inlineHtml +=
                    '<option value="' + employeeId + '">' + employeeText + "</option>";
            } else {
                if (salesrep.indexOf(",") != -1) {
                    var salesrepArray = salesrep.split(",");
                } else {
                    var salesrepArray = [];
                    salesrepArray.push(salesrep);
                }

                if (salesrepArray.indexOf(employeeId) != -1) {
                    inlineHtml +=
                        '<option value="' +
                        employeeId +
                        '" selected="selected">' +
                        employeeText +
                        "</option>";
                } else {
                    inlineHtml +=
                        '<option value="' + employeeId + '">' + employeeText + "</option>";
                }
            }

            return true;
        });

        inlineHtml += "</select>";
        inlineHtml += "</div></div>";

        inlineHtml += '<div class="col-xs-6 sales_rep_div">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="source_text">LEAD ENTERED BY</span>';
        inlineHtml +=
            '<select id="lead_entered_by" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
        inlineHtml += "<option></option>";

        //Search: Leads Entered By List
        var leadEnteredByListSearch = search.load({
            id: "customsearch_lead_entered_by_list",
            type: "customer",
        });
        var leadEnteredByListSearchResultSet = leadEnteredByListSearch.run();

        leadEnteredByListSearchResultSet.each(function (
            leadEnteredByListResultSet
        ) {
            var employeeId = leadEnteredByListResultSet.getValue({
                name: "custentity_lead_entered_by",
                summary: "GROUP",
            });
            var employeeText = leadEnteredByListResultSet.getText({
                name: "custentity_lead_entered_by",
                summary: "GROUP",
            });

            if (isNullorEmpty(lead_entered_by)) {
                inlineHtml +=
                    '<option value="' + employeeId + '">' + employeeText + "</option>";
            } else {
                if (lead_entered_by.indexOf(",") != -1) {
                    var lead_entered_byArray = lead_entered_by.split(",");
                } else {
                    var lead_entered_byArray = [];
                    lead_entered_byArray.push(lead_entered_by);
                }

                if (lead_entered_byArray.indexOf(employeeId) != -1) {
                    inlineHtml +=
                        '<option value="' +
                        employeeId +
                        '" selected="selected">' +
                        employeeText +
                        "</option>";
                } else {
                    inlineHtml +=
                        '<option value="' + employeeId + '">' + employeeText + "</option>";
                }
            }

            // if (lead_entered_by == employeeId) {
            // 	inlineHtml +=
            // 		'<option value="' +
            // 		employeeId +
            // 		'" selected="selected">' +
            // 		employeeText +
            // 		"</option>";
            // } else {
            // 	inlineHtml +=
            // 		'<option value="' + employeeId + '">' + employeeText + "</option>";
            // }

            return true;
        });

        inlineHtml += "</select>";
        inlineHtml += "</div ></div > ";
        inlineHtml += "</div ></div > ";

        // inlineHtml += '<div class="form-group container parent_lpo_label_section">';
        // inlineHtml += '<div class="row">';
        // inlineHtml +=
        //     '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">SECURE CASH CUSTOMER - FILTER</span></h4></div>';
        // inlineHtml += "</div>";
        // inlineHtml += "</div>";

        // inlineHtml +=
        //     '<div class="form-group container invoice_date_type_div hide">';
        // inlineHtml += '<div class="row">';
        // inlineHtml += '<div class="col-xs-12 usage_date_to">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        //     '<span class="input-group-addon" id="zee_dropdown_text">CUSTOMER TYPE</span>';
        // inlineHtml += '<select id="customer_type" class="form-control">';
        // if (customer_type == "1") {
        //     inlineHtml += '<option value="1" selected>All Customers</option>';
        //     inlineHtml +=
        //         '<option value="2">All Customers (exc SC, Shippit, Sendle, Parent Customers)</option>';
        // } else if (customer_type == "2") {
        //     inlineHtml += '<option value="1" >All Customers</option>';
        //     inlineHtml +=
        //         '<option value="2" selected>All Customers (exc SC, Shippit, Sendle, Parent Customers)</option>';
        // } else {
        //     inlineHtml += '<option value="1">All Customers</option>';
        //     inlineHtml +=
        //         '<option value="2" selected>All Customers (exc SC, Shippit, Sendle, Parent Customers)</option>';
        // }

        // inlineHtml += "</select>";
        // inlineHtml += "</div></div></div></div>";

        // if (campaign == 69) {
        // inlineHtml += '<div class="form-group container parent_lpo_label_section">';
        // inlineHtml += '<div class="row">';
        // inlineHtml +=
        //     '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">PARENT LPO - FILTER</span></h4></div>';
        // inlineHtml += "</div>";
        // inlineHtml += "</div>";

        // inlineHtml += '<div class="form-group container parent_lpo_section">';
        // inlineHtml += '<div class="row">';

        // inlineHtml += '<div class="col-xs-12 parent_lpo_div">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        //     '<span class="input-group-addon" id="parent_lpo_text">PARENT LPO</span>';
        // inlineHtml +=
        //     '<select id="parent_lpo" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
        // inlineHtml += "<option></option>";

        // var parentLPOSearch = search.load({
        //     type: "customer",
        //     id: "customsearch_parent_lpo_customers",
        // });

        // parentLPOSearch.run().each(function (parentLPOSearchResultSet) {
        //     var parentLPOInternalId = parentLPOSearchResultSet.getValue({
        //         name: "internalid",
        //         summary: "GROUP",
        //     });
        //     var parentLPOName = parentLPOSearchResultSet.getValue({
        //         name: "companyname",
        //         summary: "GROUP",
        //     });

        //     if (isNullorEmpty(parentLPO)) {
        //         inlineHtml +=
        //             '<option value="' +
        //             parentLPOInternalId +
        //             '" >' +
        //             parentLPOName +
        //             "</option>";
        //     } else {
        //         if (parentLPO.indexOf(",") != -1) {
        //             var parentLPOArray = parentLPO.split(",");
        //         } else {
        //             var parentLPOArray = [];
        //             parentLPOArray.push(parentLPO);
        //         }
        //         // var parentLPOArray = parentLPO.split(',');
        //         if (parentLPOArray.indexOf(parentLPOInternalId) != -1) {
        //             inlineHtml +=
        //                 '<option value="' +
        //                 parentLPOInternalId +
        //                 '" selected>' +
        //                 parentLPOName +
        //                 "</option>";
        //         } else {
        //             inlineHtml +=
        //                 '<option value="' +
        //                 parentLPOInternalId +
        //                 '" >' +
        //                 parentLPOName +
        //                 "</option>";
        //         }
        //     }

        //     return true;
        // });

        // inlineHtml += "</select>";
        // inlineHtml += "</div></div></div></div>";
        // }

        return inlineHtml;
    }

    /**
     * The date input fields to filter the invoices.
     * Even if the parameters `date_from` and `date_to` are defined, they can't be initiated in the HTML code.
     * They are initiated with jQuery in the `pageInit()` function.
     * @return  {String} `inlineHtml`
     */
    function dateFilterSection(
        start_date,
        last_date,
        usage_date_from,
        usage_date_to,
        date_signed_up_from,
        date_signed_up_to,
        invoice_date_from,
        invoice_date_to,
        invoice_type,
        date_quote_sent_to,
        date_quote_sent_from,
        calcprodusage,
        modified_start_date,
        modified_last_date,
        sales_activity_notes,
        commencement_start_date,
        commencement_last_date,
        cancelled_start_date,
        cancelled_last_date
    ) {
        // var inlineHtml =
        // 	'<div class="form-group container lead_entered_label_section hide">';
        // inlineHtml += '<div class="row">';
        // inlineHtml +=
        // 	'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS CHANGE ACTIVITY - FILTER</span></h4></div>';
        // inlineHtml += "</div>";
        // inlineHtml += "</div>";

        // inlineHtml += '<div class="form-group container modified_date_div hide">';
        // inlineHtml += '<div class="row">';

        // // Last Modified Date from field
        // inlineHtml += '<div class="col-xs-6 date_from">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        // 	'<span class="input-group-addon" id="modified_date_from_text">STATUS CHANGE ACTIVITY - FROM</span>';
        // if (isNullorEmpty(modified_start_date)) {
        // 	inlineHtml +=
        // 		'<input id="modified_date_from" class="form-control modified_date_from" type="date" />';
        // } else {
        // 	inlineHtml +=
        // 		'<input id="modified_date_from" class="form-control modified_date_from" type="date" value="' +
        // 		modified_start_date +
        // 		'"/>';
        // }

        // inlineHtml += "</div></div>";
        // // Last Modified Date to field
        // inlineHtml += '<div class="col-xs-6 date_to">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        // 	'<span class="input-group-addon" id="date_to_text">STATUS CHANGE ACTIVITY - TO</span>';
        // if (isNullorEmpty(modified_last_date)) {
        // 	inlineHtml +=
        // 		'<input id="modified_date_to" class="form-control modified_date_to" type="date">';
        // } else {
        // 	inlineHtml +=
        // 		'<input id="modified_date_to" class="form-control modified_date_to" type="date" value="' +
        // 		modified_last_date +
        // 		'">';
        // }

        // inlineHtml += "</div></div></div></div>";

        // inlineHtml +=
        // 	'<div class="form-group container salesactivitynotes_div hide">';
        // inlineHtml += '<div class="row">';

        // inlineHtml += '<div class="col-xs-12 salesactivitynotes">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        // 	'<span class="input-group-addon" id="salesactivitynotes_text">DISPLAY USER/ACTIVITY NOTES?</span>';
        // inlineHtml += '<select id="sales_activity_notes" class="form-control">';
        // inlineHtml += "<option></option>";

        // if (sales_activity_notes == "1") {
        // 	inlineHtml += '<option value="1" selected>Yes</option>';
        // 	inlineHtml += '<option value="2">No</option>';
        // } else if (sales_activity_notes == "2") {
        // 	inlineHtml += '<option value="1" >Yes</option>';
        // 	inlineHtml += '<option value="2" selected>No</option>';
        // } else {
        // 	inlineHtml += '<option value="1">Yes</option>';
        // 	inlineHtml += '<option value="2" selected>No</option>';
        // }
        // inlineHtml += "</select>";
        // inlineHtml += "</div></div></div></div>";

        var inlineHtml =
            '<div class="form-group container lead_entered_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE LEAD ENTERED - FILTER</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml += '<div class="form-group container lead_entered_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-6 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_from_text">DATE LEAD ENTERED - FROM</span>';
        if (isNullorEmpty(start_date)) {
            inlineHtml +=
                '<input id="date_from" class="form-control date_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="date_from" class="form-control date_from" type="date" value="' +
                start_date +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-6 date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_to_text">DATE LEAD ENTERED - TO</span>';
        if (isNullorEmpty(last_date)) {
            inlineHtml +=
                '<input id="date_to" class="form-control date_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="date_to" class="form-control date_to" type="date" value="' +
                last_date +
                '">';
        }

        inlineHtml += "</div></div></div></div>";

        inlineHtml +=
            '<div class="form-group container quote_sent_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE QUOTE SENT - FILTER</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml += '<div class="form-group container quote_sent_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-6 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_quote_sent_from_text">DATE QUOTE SENT - FROM</span>';
        if (isNullorEmpty(date_quote_sent_from)) {
            inlineHtml +=
                '<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" value="' +
                date_quote_sent_from +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-6 usage_date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_quote_sent_to_text">DATE QUOTE SENT - TO</span>';
        if (isNullorEmpty(date_quote_sent_to)) {
            inlineHtml +=
                '<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date" value="' +
                date_quote_sent_to +
                '">';
        }

        inlineHtml += "</div></div></div></div>";

        inlineHtml +=
            '<div class="form-group container signed_up_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE SIGNED UP - FILTER</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml += '<div class="form-group container signed_up_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-6 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_signed_up_from_text">DATE SIGNED UP - FROM</span>';
        if (isNullorEmpty(date_signed_up_from)) {
            inlineHtml +=
                '<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" value="' +
                date_signed_up_from +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-6 usage_date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_signed_up_to_text">DATE SIGNED UP - TO</span>';
        if (isNullorEmpty(date_signed_up_to)) {
            inlineHtml +=
                '<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date" value="' +
                date_signed_up_to +
                '">';
        }

        inlineHtml += "</div></div></div></div>";

        inlineHtml +=
            '<div class="form-group container signed_up_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">COMMENCEMENT DATE - FILTER</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml += '<div class="form-group container signed_up_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-6 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_signed_up_from_text">COMMENCEMENT DATE - FROM</span>';
        if (isNullorEmpty(commencement_start_date)) {
            inlineHtml +=
                '<input id="commencement_date_from" class="form-control commencement_date_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="commencement_date_from" class="form-control commencement_date_from" type="date" value="' +
                commencement_start_date +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-6 usage_date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_signed_up_to_text">COMMENCEMENT DATE - TO</span>';
        if (isNullorEmpty(commencement_last_date)) {
            inlineHtml +=
                '<input id="commencement_date_to" class="form-control commencement_date_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="commencement_date_to" class="form-control commencement_date_to" type="date" value="' +
                commencement_last_date +
                '">';
        }

        inlineHtml += "</div></div></div></div>";

        inlineHtml +=
            '<div class="form-group container signed_up_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">CANCELLATION DATE - FILTER</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml += '<div class="form-group container signed_up_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-6 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_signed_up_from_text">CANCELLATION DATE - FROM</span>';
        if (isNullorEmpty(cancelled_start_date)) {
            inlineHtml +=
                '<input id="cancellation_date_from" class="form-control cancellation_date_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="cancellation_date_from" class="form-control cancellation_date_from" type="date" value="' +
                cancelled_start_date +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-6 usage_date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="date_signed_up_to_text">CANCELLATION DATE - TO</span>';
        if (isNullorEmpty(cancelled_last_date)) {
            inlineHtml +=
                '<input id="cancellation_date_to" class="form-control cancellation_date_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="cancellation_date_to" class="form-control cancellation_date_to" type="date" value="' +
                cancelled_last_date +
                '">';
        }

        inlineHtml += "</div></div></div></div>";

        // inlineHtml += '<div class="form-group container usage_label_section hide">';
        // inlineHtml += '<div class="row">';
        // inlineHtml +=
        //     '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">MP PRODUCT USAGE DATE - FILTER</span></h4></div>';
        // inlineHtml += "</div>";
        // inlineHtml += "</div>";

        // inlineHtml += '<div class="form-group container calcprodusage_div hide">';
        // inlineHtml += '<div class="row">';

        // inlineHtml += '<div class="col-xs-12 calcprodusage">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        //     '<span class="input-group-addon" id="calcprodusage_text">CALCULATE MP PRODUCT USAGE?</span>';
        // inlineHtml += '<select id="calc_prod_usage" class="form-control">';
        // inlineHtml += "<option></option>";

        // if (calcprodusage == "1") {
        //     inlineHtml += '<option value="1" selected>Yes</option>';
        //     inlineHtml += '<option value="2">No</option>';
        // } else if (calcprodusage == "2") {
        //     inlineHtml += '<option value="1" >Yes</option>';
        //     inlineHtml += '<option value="2" selected>No</option>';
        // } else {
        //     inlineHtml += '<option value="1">Yes</option>';
        //     inlineHtml += '<option value="2" selected>No</option>';
        // }
        // inlineHtml += "</select>";
        // inlineHtml += "</div></div></div></div>";

        // inlineHtml += '<div class="form-group container usage_date_div hide">';
        // inlineHtml += '<div class="row">';
        // // Date from field
        // inlineHtml += '<div class="col-xs-6 date_from">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        //     '<span class="input-group-addon" id="usage_date_from_text">USAGE DATE - FROM</span>';
        // if (isNullorEmpty(usage_date_from)) {
        //     inlineHtml +=
        //         '<input id="usage_date_from" class="form-control usage_date_from" type="date" />';
        // } else {
        //     inlineHtml +=
        //         '<input id="usage_date_from" class="form-control usage_date_from" type="date" value="' +
        //         usage_date_from +
        //         '"/>';
        // }

        // inlineHtml += "</div></div>";
        // // Date to field
        // inlineHtml += '<div class="col-xs-6 usage_date_to">';
        // inlineHtml += '<div class="input-group">';
        // inlineHtml +=
        //     '<span class="input-group-addon" id="usage_date_to_text">USAGE DATE - TO</span>';
        // if (isNullorEmpty(usage_date_to)) {
        //     inlineHtml +=
        //         '<input id="usage_date_to" class="form-control usage_date_to" type="date">';
        // } else {
        //     inlineHtml +=
        //         '<input id="usage_date_to" class="form-control usage_date_to" type="date" value="' +
        //         usage_date_to +
        //         '">';
        // }

        // inlineHtml += "</div></div></div></div>";

        inlineHtml +=
            '<div class="form-group container invoice_label_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml +=
            '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">INVOICE FILTERS</span></h4></div>';
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        inlineHtml +=
            '<div class="form-group container invoice_date_type_div hide">';
        inlineHtml += '<div class="row">';
        // Date from field
        inlineHtml += '<div class="col-xs-4 date_from">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="invoice_date_from_text">INVOICE DATE - FROM</span>';
        if (isNullorEmpty(invoice_date_from)) {
            inlineHtml +=
                '<input id="invoice_date_from" class="form-control invoice_date_from" type="date" />';
        } else {
            inlineHtml +=
                '<input id="invoice_date_from" class="form-control invoice_date_from" type="date" value="' +
                invoice_date_from +
                '"/>';
        }

        inlineHtml += "</div></div>";
        // Date to field
        inlineHtml += '<div class="col-xs-4 usage_date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="invoice_date_to_text">INVOICE DATE - TO</span>';
        if (isNullorEmpty(invoice_date_to)) {
            inlineHtml +=
                '<input id="invoice_date_to" class="form-control invoice_date_to" type="date">';
        } else {
            inlineHtml +=
                '<input id="invoice_date_to" class="form-control invoice_date_to" type="date" value="' +
                invoice_date_to +
                '">';
        }

        inlineHtml += "</div></div>";

        inlineHtml += '<div class="col-xs-4 usage_date_to">';
        inlineHtml += '<div class="input-group">';
        inlineHtml +=
            '<span class="input-group-addon" id="zee_dropdown_text">INVOICE TYPE</span>';
        inlineHtml += '<select id="invoice_type" class="form-control">';
        if (invoice_type == "1") {
            inlineHtml += '<option value=""></option>';
            inlineHtml += '<option value="1" selected>Service</option>';
            inlineHtml += '<option value="2">MP Products</option>';
        } else if (invoice_type == "2") {
            inlineHtml += '<option value=""></option>';
            inlineHtml += '<option value="1">Service</option>';
            inlineHtml += '<option value="2" selected>MP Products</option>';
        } else {
            inlineHtml += '<option value=""></option>';
            inlineHtml += '<option value="1">Service</option>';
            inlineHtml += '<option value="2">MP Products</option>';
        }

        inlineHtml += "</select>";
        inlineHtml += "</div></div></div></div>";

        inlineHtml +=
            '<div class="form-group container filter_buttons_section hide">';
        inlineHtml += '<div class="row">';
        inlineHtml += '<div class="col-xs-2"></div>';
        inlineHtml +=
            '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="background-color: #095C7B; border-radius: 30px" /></div>';
        inlineHtml +=
            '<div class="col-xs-4"><input type="button" value="CLEAR FILTER" class="form-control btn btn-primary" id="clearFilter" style="background-color: #F0AECB; color: #103d39;border-radius: 30px" /></div>';
        inlineHtml += '<div class="col-xs-2"></div>';

        inlineHtml += "</div>";
        inlineHtml += "</div>";

        return inlineHtml;
    }

    function tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent) {
        // Create a table row string with the provided parameters

        var leadURL = 'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + leadInternalID;

        var tableRowString = '<tr>' +
            '<td>' + (startDate !== undefined ? startDate : '') + '</td>' +
            // '<td>' + (leadInternalID !== undefined ? leadInternalID : '') + '</td>' +
            '<td>' + (leadID !== undefined ? '<a href="' + leadURL + '" target="_blank">' + leadID + '</a>' : '') + '</td>' +
            '<td>' + (leadCompanyName !== undefined ? leadCompanyName : '') + '</td>' +
            '<td>' + (leadZeeText !== undefined ? leadZeeText : '') + '</td>' +
            '<td>' + (leadStatusText !== undefined ? leadStatusText : '') + '</td>' +
            '<td>' + (leadSourceText !== undefined ? leadSourceText : '') + '</td>' +
            '<td>' + (salesCampaignText !== undefined ? salesCampaignText : '') + '</td>' +
            '<td>' + (salesRepAssignedText !== undefined ? salesRepAssignedText : '') + '</td>' +
            '<td>' + (dateSyncedWithPP !== undefined ? dateSyncedWithPP : '') + '</td>' +
            '<td>' + (ppSalesAgent !== undefined ? ppSalesAgent : '') + '</td>'

        if (leadStatusID == 59 || leadStatusID == 64 || leadStatusID == 22 || leadStatusID == 62) {
            tableRowString += '<td>' + (leadServiceCancellationDate !== undefined ? leadServiceCancellationDate : '') + '</td>' +
                '<td>' + (leadServiceCancellationTheme !== undefined ? leadServiceCancellationTheme : '') + '</td>' +
                '<td>' + (leadServiceCancellationCategory !== undefined ? leadServiceCancellationCategory : '') + '</td>'
        }

        tableRowString += '<td>' + (leadIndustryCategory !== undefined ? leadIndustryCategory : '') + '</td>' +
            '<td>' + (leadIndustrySubCategory !== undefined ? leadIndustrySubCategory : '') + '</td>'
        tableRowString += '</tr>';

        return tableRowString;
    }

    function tabsSection(page_no, campaign, source,
        sales_rep,
        lead_entered_by,
        customer_type,
        date_from,
        date_to,
        date_signed_up_from,
        date_signed_up_to,
        date_quote_sent_to,
        date_quote_sent_from,
        commencement_start_date,
        commencement_last_date, leadStatusArray, start_synced_date, last_synced_date) {
        var inlineHtml = '<div class="tabs_section hide">';

        log.debug({
            title: "Tabs Section",
            details: {
                page_no: page_no,
                campaign: campaign,
                source: source,
                sales_rep: sales_rep,
                lead_entered_by: lead_entered_by,
                customer_type: customer_type,
                date_from: date_from,
                date_to: date_to,
                date_signed_up_from: date_signed_up_from,
                date_signed_up_to: date_signed_up_to,
                date_quote_sent_to: date_quote_sent_to,
                date_quote_sent_from: date_quote_sent_from,
                commencement_start_date: commencement_start_date,
                commencement_last_date: commencement_last_date,
                leadStatusArray: leadStatusArray,
                start_synced_date: start_synced_date,
                last_synced_date: last_synced_date
            }
        });

        //{"page_no":"1","campaign":"null","source":"null","sales_rep":"null","lead_entered_by":"null","customer_type":"2","date_from":"2025-08-01","date_to":"2026-01-31","date_signed_up_from":"","date_signed_up_to":"","date_quote_sent_to":"","date_quote_sent_from":"","commencement_start_date":"","commencement_last_date":"","leadStatusArray":["null"],"start_synced_date":"","last_synced_date":""}

        date_from = dateISOToNetsuite(date_from);
        date_to = dateISOToNetsuite(date_to);
        // date_signed_up_from = dateISOToNetsuite(date_signed_up_from);
        // date_signed_up_to = dateISOToNetsuite(date_signed_up_to);
        // date_quote_sent_from = dateISOToNetsuite(date_quote_sent_from);
        // date_quote_sent_to = dateISOToNetsuite(date_quote_sent_to);
        // commencement_start_date = dateISOToNetsuite(commencement_start_date);
        // commencement_last_date = dateISOToNetsuite(commencement_last_date);
        // start_synced_date = dateISOToNetsuite(start_synced_date);
        // last_synced_date = dateISOToNetsuite(last_synced_date);


        var leadsListBySalesRepWeeklySearch = search.load({
            type: "customer",
            id: "customsearch_all_lead_zee_reporting_page", //Sales Dashboard - Website Leads - Suspects with Tasks - Reporting V6
        });

        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "custrecord_salesrep",
                join: "CUSTRECORD_CUSTOMER",
                operator: search.Operator.NONEOF,
                values: [109783],
            })
        );
        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "companyname",
                join: null,
                operator: search.Operator.DOESNOTSTARTWITH,
                values: "TEST",
            })
        );
        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "companyname",
                join: null,
                operator: search.Operator.DOESNOTCONTAIN,
                values: "- Parent",
            })
        );
        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "companyname",
                join: null,
                operator: search.Operator.DOESNOTSTARTWITH,
                values: "Shippit Pty Ltd ",
            })
        );
        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "companyname",
                join: null,
                operator: search.Operator.DOESNOTSTARTWITH,
                values: "Sendle",
            })
        );
        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "companyname",
                join: null,
                operator: search.Operator.DOESNOTSTARTWITH,
                values: "SC -",
            })
        );
        leadsListBySalesRepWeeklySearch.filters.push(
            search.createFilter({
                name: "custentity_np_np_customer",
                join: null,
                operator: search.Operator.ANYOF,
                values: "@NONE@",
            })
        );

        //Date Signed Up Filter
        if (
            !isNullorEmpty(date_signed_up_from) &&
            !isNullorEmpty(date_signed_up_to)
        ) {
            date_signed_up_from = dateISOToNetsuite(date_signed_up_from);
            date_signed_up_to = dateISOToNetsuite(date_signed_up_to);

            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "custrecord_comm_date_signup",
                    join: "CUSTRECORD_CUSTOMER",
                    operator: search.Operator.ONORAFTER,
                    values: date_signed_up_from,
                })
            );

            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "custrecord_comm_date_signup",
                    join: "CUSTRECORD_CUSTOMER",
                    operator: search.Operator.ONORBEFORE,
                    values: date_signed_up_to,
                })
            );
        }

        //Status Filter
        if (!isNullorEmpty(leadStatusArray)) {
            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "entitystatus",
                    join: null,
                    operator: search.Operator.IS,
                    values: leadStatusArray,
                })
            );
        }

        //Sales Campaign Filter
        if (!isNullorEmpty(campaign)) {
            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "custrecord_sales_campaign",
                    join: "custrecord_sales_customer",
                    operator: search.Operator.ANYOF,
                    values: campaign,
                })
            );
        }

        //Account Manager Filter
        if (!isNullorEmpty(sales_rep)) {
            leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                name: 'custrecord_sales_assigned',
                join: 'custrecord_sales_customer',
                operator: search.Operator.IS,
                values: sales_rep
            }));
        }

        //Filter Suspect Source
        if (!isNullorEmpty(source)) {
            leadsListBySalesRepWeeklySearch.filters.push(search.createFilter({
                name: 'leadsource',
                join: null,
                operator: search.Operator.ANYOF,
                values: source
            }));
        }

        //Franchisee Filter
        if (!isNullorEmpty(zee)) {
            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "partner",
                    join: null,
                    operator: search.Operator.IS,
                    values: zee,
                })
            );
        }

        if (
            !isNullorEmpty(commencement_start_date) &&
            !isNullorEmpty(commencement_last_date)
        ) {

            commencement_start_date = dateISOToNetsuite(commencement_start_date);
            commencement_last_date = dateISOToNetsuite(commencement_last_date);

            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "custrecord_comm_date",
                    join: "CUSTRECORD_CUSTOMER",
                    operator: search.Operator.ONORAFTER,
                    values: commencement_start_date,
                })
            );

            leadsListBySalesRepWeeklySearch.filters.push(
                search.createFilter({
                    name: "custrecord_comm_date",
                    join: "CUSTRECORD_CUSTOMER",
                    operator: search.Operator.ONORBEFORE,
                    values: commencement_last_date,
                })
            );
        }

        if (
            !isNullorEmpty(date_from) &&
            !isNullorEmpty(date_to)
        ) {
            var defaultSearchFilters =
                leadsListBySalesRepWeeklySearch.filterExpression;

            var customAdditionalFilters = [
                [["custentity_date_lead_entered", "within", [date_from, date_to]], "OR", [["custrecord_sales_customer.custrecord_cf_date_sent", "within", [date_from, date_to]], "AND", ["custrecord_sales_customer.custrecord_sales_campaign", "anyof", "96", "94", "90", "70", "92"]]]
            ];

            defaultSearchFilters.push("AND");
            defaultSearchFilters.push(customAdditionalFilters);


            leadsListBySalesRepWeeklySearch.filterExpression = defaultSearchFilters;
        }

        var leadsListBySalesRepWeeklySearchCount =
            leadsListBySalesRepWeeklySearch.runPaged().count;

        var totalPageCount = parseInt(leadsListBySalesRepWeeklySearchCount / 1000) + 1;

        var divBreak = Math.ceil(12 / totalPageCount);

        var leadReviewRow = '';
        var priorityInboundRow = '';
        var syncRow = '';
        var activeOutreachRow = '';
        var qualifiedRow = '';
        var convertedRow = '';
        var closedRow = '';

        leadsListBySalesRepWeeklySearch
            .run()
            .each(function (prospectListBySalesRepWeeklyResultSet) {

                var dateLeadEntered = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "custentity_date_lead_entered",
                    summary: "GROUP",
                });

                var leadInternalID = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "internalid",
                    summary: "GROUP",
                });
                var leadID = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "entityid",
                    summary: "GROUP",
                });

                var leadCompanyName = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "companyname",
                    summary: "GROUP",
                });
                var leadZeeID = parseInt(prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "partner",
                    summary: "GROUP",
                }));
                var leadZeeText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "partner",
                    summary: "GROUP",
                });
                var leadSourceText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "leadsource",
                    summary: "GROUP",
                });
                var leadStatusID = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "entitystatus",
                    summary: "GROUP",
                });
                var leadStatusText = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "entitystatus",
                    summary: "GROUP",
                });
                var leadServiceCancellationDate = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "custentity13",
                    summary: "GROUP",
                });
                var leadServiceCancellationTheme = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "custentity_service_cancellation_theme",
                    summary: "GROUP",
                });
                var leadServiceCancellationCategory = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "custentity_service_cancellation_what",
                    summary: "GROUP",
                });
                var leadIndustryCategory = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "custentity_industry_category",
                    summary: "GROUP",
                });
                var leadIndustrySubCategory = prospectListBySalesRepWeeklyResultSet.getText({
                    name: "custentity_industry_sub_category",
                    summary: "GROUP",
                });

                var leadSalesRecordIntenalID = prospectListBySalesRepWeeklyResultSet.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_SALES_CUSTOMER",
                    summary: "MAX",
                });

                //Load Sales Record
                var salesRecord = record.load({
                    type: "customrecord_sales",
                    id: leadSalesRecordIntenalID,
                });
                var salesCampaignText = salesRecord.getText({
                    fieldId: "custrecord_sales_campaign",
                });
                var salesRepAssignedText = salesRecord.getText({
                    fieldId: "custrecord_sales_assigned",
                });
                var dateSyncedWithPP = salesRecord.getValue({
                    fieldId: "custrecord_cf_date_sent",
                });
                var ppSalesAgent = salesRecord.getText({
                    fieldId: "custrecord_cf_agent_name",
                });

                if (!isNullorEmpty(dateSyncedWithPP)) {
                    dateSyncedWithPP = formatDateString(dateSyncedWithPP);
                } else {
                    dateSyncedWithPP = "NOT SYNCED WITH PP"
                }

                if (!isNullorEmpty(dateLeadEntered)) {
                    var splitMonthV2 = dateLeadEntered.split("/");

                    var formattedDate = dateISOToNetsuite(
                        splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
                    );

                    var firstDay = new Date(
                        splitMonthV2[0],
                        splitMonthV2[1],
                        1
                    ).getDate();
                    var lastDay = new Date(
                        splitMonthV2[0],
                        splitMonthV2[1],
                        0
                    ).getDate();

                    if (firstDay < 10) {
                        firstDay = "0" + firstDay;
                    }

                    // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                    var startDate =
                        splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
                    var monthsStartDate =
                        splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
                    // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                    var lastDate =
                        splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
                } else {
                    var startDate = "NO DATE";
                }

                if (leadStatusID == 6 || leadStatusID == 39) {
                    // Lead Review & Processing - New & Franchisee Review
                    leadReviewRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                if (leadStatusID == 57) {
                    // Priority Inbound (Immediate Sales Action) - Hot Lead
                    priorityInboundRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                if (leadStatusID == 68 || leadStatusID == 38) {
                    // Field & Phone Inventory (Ready for Outreach) - Validated & Unqualified
                    syncRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                if (leadStatusID == 34 || leadStatusID == 30 || leadStatusID == 60 || leadStatusID == 18 || leadStatusID == 67 || leadStatusID == 20 || leadStatusID == 69 || leadStatusID == 8) {
                    // Active Outreach (Engaged) - Pre-Qualification, In-Qualification, Re-assign, Follow-up, LPO Follow-up, No Answer, In Contact
                    activeOutreachRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                if (leadStatusID == 58 || leadStatusID == 70 || leadStatusID == 72 || leadStatusID == 50 || leadStatusID == 32 || leadStatusID == 71 || leadStatusID == 42) {
                    // Qualified Pipeline - Opportunity, Qualified, Box Sent, Quote Sent, Free Trial Pending, Free Trial
                    qualifiedRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                if (leadStatusID == 13 || leadStatusID == 66) {
                    // Converted Customers - Signed & Customer To Be Finalised
                    convertedRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                if (leadStatusID == 59 || leadStatusID == 64 || leadStatusID == 22 || leadStatusID == 62) {
                    // Closed/Lost - Lost, OOT, Customer Lost, Off Peak Pipeline

                    if (!isNullorEmpty(leadServiceCancellationDate)) {
                        var splitMonthV2 = leadServiceCancellationDate.split("/");

                        var formattedDate = dateISOToNetsuite(
                            splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0]
                        );

                        var firstDay = new Date(
                            splitMonthV2[0],
                            splitMonthV2[1],
                            1
                        ).getDate();
                        var lastDay = new Date(
                            splitMonthV2[0],
                            splitMonthV2[1],
                            0
                        ).getDate();

                        if (firstDay < 10) {
                            firstDay = "0" + firstDay;
                        }

                        // var startDate = firstDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        leadServiceCancellationDate =
                            splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + splitMonthV2[0];
                        var monthsStartDate =
                            splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + firstDay;
                        // var lastDate = lastDay + '/' + splitMonth[1] + '/' + splitMonth[0]
                        var lastDate =
                            splitMonthV2[2] + "-" + splitMonthV2[1] + "-" + lastDay;
                    } else {
                        leadServiceCancellationDate = "NO DATE";
                    }



                    closedRow += tableRow(page_no, leadInternalID, leadID, leadCompanyName, leadZeeID, leadZeeText, leadSourceText, leadStatusID, leadStatusText, startDate, leadSalesRecordIntenalID, leadServiceCancellationDate, leadServiceCancellationTheme, leadServiceCancellationCategory, leadIndustryCategory, leadIndustrySubCategory, salesCampaignText, salesRepAssignedText, dateSyncedWithPP, ppSalesAgent);
                }

                return true;
            });

        // Tabs headers
        inlineHtml +=
            "<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
        inlineHtml +=
            ".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
        inlineHtml += "</style>";

        inlineHtml +=
            '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

        inlineHtml +=
            '<li role="presentation" class="active"><a data-toggle="tab" href="#leadReviewProcessing" style="border-radius: 30px"><b>Lead Review & Processing</b></a></li>';
        inlineHtml +=
            '<li role="presentation" class=""><a data-toggle="tab" href="#priorityInbound" style="border-radius: 30px"><b>Priority Inbound</b></a></li>';
        inlineHtml +=
            '<li role="presentation" class=""><a data-toggle="tab" href="#fieldPhoneInventory" style="border-radius: 30px"><b>Field & Phone Inventory</b></a></li>';
        inlineHtml +=
            '<li role="presentation" class=""><a data-toggle="tab" href="#activeOutreach" style="border-radius: 30px"><b>Active Outreach</b></a></li>';
        inlineHtml +=
            '<li role="presentation" class=""><a data-toggle="tab" href="#qualifiedPipeline" style="border-radius: 30px"><b>Qualified Pipeline</b></a></li>';
        inlineHtml +=
            '<li role="presentation" class=""><a data-toggle="tab" href="#convertedCustomers" style="border-radius: 30px"><b>Converted Customers</b></a></li>';
        inlineHtml +=
            '<li role="presentation" class=""><a data-toggle="tab" href="#closedLost" style="border-radius: 30px"><b>Closed/Lost</b></a></li>';


        inlineHtml += "</ul></div>";

        // Tabs content
        inlineHtml += '<div class="tab-content">';

        log.debug({
            title: "Inside Tabs Section Function",
            details: campaign,
        });



        inlineHtml += '<div role="tabpanel" class="tab-pane active" id="leadReviewProcessing">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_leadReviewProcessing"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("leadReviewProcessing", leadReviewRow);
        inlineHtml += "</div>";

        inlineHtml += '<div role="tabpanel" class="tab-pane" id="priorityInbound">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_priorityInbound"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("priorityInbound", priorityInboundRow);
        inlineHtml += "</div>";

        inlineHtml += '<div role="tabpanel" class="tab-pane" id="fieldPhoneInventory">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_fieldPhoneInventory"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("fieldPhoneInventory", syncRow);
        inlineHtml += "</div>";

        inlineHtml += '<div role="tabpanel" class="tab-pane" id="activeOutreach">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_activeOutreach"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("activeOutreach", activeOutreachRow);
        inlineHtml += "</div>";

        inlineHtml += '<div role="tabpanel" class="tab-pane" id="qualifiedPipeline">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_qualifiedPipeline"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("qualifiedPipeline", qualifiedRow);
        inlineHtml += "</div>";

        inlineHtml += '<div role="tabpanel" class="tab-pane" id="convertedCustomers">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_convertedCustomers"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("convertedCustomers", convertedRow);
        inlineHtml += "</div>";

        inlineHtml += '<div role="tabpanel" class="tab-pane" id="closedLost">';
        inlineHtml += '<figure class="highcharts-figure">';
        inlineHtml += '<div id="container_closedLost"></div>';
        inlineHtml += "</figure><br></br>";
        inlineHtml += dataTable("closedLost", closedRow);
        inlineHtml += "</div>";
        inlineHtml += "</div>";

        return inlineHtml;
    }

    /**
     * The table that will display the differents invoices linked to the
     * franchisee and the time period.
     *
     * @return {String} inlineHtml
     */
    function dataTable(name, rows) {
        var inlineHtml =
            "<style>table#reporting-" +
            name +
            " {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#reporting-" +
            name +
            " th{text-align: center;vertical-align: middle;} table#reporting-" +
            " td{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
        inlineHtml +=
            '<div class="table_section hide"><table id="reporting-' +
            name +
            '" class="table table-responsive table-striped customer tablesorter row-border cell-border compact" style="width: 100%;border: 2px solid #103d39">';
        inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
        inlineHtml += '<tr class="text-center">';

        inlineHtml += "</tr>";
        inlineHtml += "</thead>";

        inlineHtml += '<tbody id="result_usage_' + name + '" >' + rows + '</tbody>';

        inlineHtml += "</table></div>";
        return inlineHtml;
    }

    /**
     * The header showing that the results are loading.
     * @returns {String} `inlineQty`
     */
    function loadingSection() {
        var inlineHtml =
            '<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
        inlineHtml += '<div class="row">';
        inlineHtml += '<div class="col-xs-12 ">';
        inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
        inlineHtml += "</div></div></div></br></br>";
        inlineHtml += '<div class="wrapper loading_section">';
        inlineHtml += '<div class="blue ball"></div>';
        inlineHtml += '<div class="red ball"></div>';
        inlineHtml += '<div class="yellow ball"></div>';
        inlineHtml += '<div class="green ball"></div>';

        inlineHtml += "</div>";

        return inlineHtml;
    }


    function GetFormattedDate(todayDate) {
        var month = pad(todayDate.getMonth() + 1);
        var day = pad(todayDate.getDate());
        var year = todayDate.getFullYear();
        return year + "-" + month + "-" + day;
    }

    function formatDateString(dateString) {
        var date = new Date(dateString);
        if (isNaN(date)) return "";
        var day = customPadStart(String(date.getDate()), 2, "0");
        var month = customPadStart(String(date.getMonth() + 1), 2, "0");
        var year = date.getFullYear();
        return day + '/' + month + '/' + year;
    }

    /**
* @description Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length. The padding is applied from the start (left) of the current string.
* @param {string} str - The original string to pad.
* @param {number} targetLength - The length of the resulting string once the current string has been padded.
* @param {string} padString - The string to pad the current string with. Defaults to a space if not provided.
* @returns {string} The padded string.
*/
    function customPadStart(str, targetLength, padString) {
        // Convert the input to a string
        str = String(str);

        // If the target length is less than or equal to the string's length, return the original string
        if (str.length >= targetLength) {
            return str;
        }

        // Calculate the length of the padding needed
        var paddingLength = targetLength - str.length;

        // Repeat the padString enough times to cover the padding length
        var repeatedPadString = customRepeat(
            padString,
            Math.ceil(paddingLength / padString.length)
        );

        // Slice the repeated padString to the exact padding length needed and concatenate with the original string
        return repeatedPadString.slice(0, paddingLength) + str;
    }

    /**
     * @description Repeats the given string a specified number of times.
     * @param {string} str - The string to repeat.
     * @param {number} count - The number of times to repeat the string.
     * @returns {string} The repeated string.
     */
    function customRepeat(str, count) {
        // Convert the input to a string
        str = String(str);

        // If the count is 0 or less, return an empty string
        if (count <= 0) {
            return "";
        }

        // Initialize the result string
        var result = "";

        // Repeat the string by concatenating it to the result
        for (var i = 0; i < count; i++) {
            result += str;
        }

        return result;
    }


    function pad(s) {
        return s < 10 ? "0" + s : s;
    }

    function isNullorEmpty(strVal) {
        return (strVal == null || strVal == '' || strVal == 'null' || strVal ==
            undefined || strVal == 'undefined' || strVal == '- None -');
    }

    /**
    * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
    * @param   {String} date_iso       "2020-06-01"
    * @returns {String} date_netsuite  "1/6/2020"
    */
    function dateISOToNetsuite(date_iso) {
        var date_netsuite = "";
        var split_date = date_iso.split('-');
        if (!isNullorEmpty(date_iso)) {
            var date_utc = new Date(split_date[0], split_date[1] - 1, split_date[2]);
            // var date_netsuite = nlapiDateToString(date_utc);
            var date_netsuite = format.format({
                value: date_utc,
                type: format.Type.DATE,
            });
        }
        return date_netsuite;
    }

    function randomHexColorCode() {
        var n = (Math.random() * 0xfffff * 1000000).toString(16);
        return "#" + n.slice(0, 6);
    }

    return {
        onRequest: onRequest,
    };
});
