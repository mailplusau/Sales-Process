/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-01T09:59:04+11:00
 * Module Description: Page that lists customres that are commencing today or have not been onboarded.
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-24T10:22:39+11:00
 */



define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect', 'N/url', 'N/format'],
    function (ui, email, runtime, search, record, https, log, redirect, url, format) {
        var role = 0;
        var userId = 0;
        var zee = 0;
        var parentLPOInternalId = 0;
        var custStatus = 0;
        var salesCampaign = 0;
        var source = 0;
        var paramUserId = 0;

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
                paramUserId = context.request.parameters.user;
                salesCampaign = context.request.parameters.campaign;
                custStage = context.request.parameters.stage;
                custStatus = context.request.parameters.status;
                source = context.request.parameters.source;
                parentLPOInternalId = context.request.parameters.lpoid;

                var modified_start_date = context.request.parameters.modified_date_from;
                var modified_last_date = context.request.parameters.modified_date_to;



                var page_no = context.request.parameters.page_no;

                if (isNullorEmpty(page_no)) {
                    page_no = '1';
                }

                log.debug({
                    title: 'userId',
                    details: userId
                });


                if (isNullorEmpty(start_date)) {
                    start_date = null;
                }

                if (isNullorEmpty(last_date)) {
                    last_date = null;
                }

                if (isNullorEmpty(salesCampaign)) {
                    salesCampaign = null;
                }
                if (isNullorEmpty(custStatus)) {
                    custStatus = '57';
                }

                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                if (isNullorEmpty(paramUserId)) {
                    paramUserId = null;
                } else {
                    userId = paramUserId;
                }

                var form = ui.createForm({
                    title: 'Suspects & Prospects - List'
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
                }).defaultValue = paramUserId;

                form.addField({
                    id: 'custpage_sales_campaign',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = salesCampaign;

                form.addField({
                    id: 'custpage_cust_status',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = custStatus;

                form.addField({
                    id: 'custpage_cust_stage',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = custStage;

                form.addField({
                    id: 'custpage_cust_source',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = source;

                form.addField({
                    id: 'custpage_cust_lpoid',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = parentLPOInternalId;

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

                form.addField({
                    id: 'custpage_salesrecordid',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_lostnoresponse',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                form.addField({
                    id: 'custpage_page_no',
                    type: ui.FieldType.TEXT,
                    label: 'Page Number'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = page_no;

                form.addField({
                    id: 'custpage_total_page_no',
                    type: ui.FieldType.TEXT,
                    label: 'Total Page Number'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })

                var date = new Date();
                var y = date.getFullYear();
                var m = date.getMonth();
                var day = date.getDay();

                if (start_date == null && last_date == null) {
                    if (isNullorEmpty(salesCampaign) && isNullorEmpty(zee)) {
                        var lastDay = new Date(y, m + 1, 0);
                        lastDay.setHours(0, 0, 0, 0);

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


                log.debug({
                    title: 'start_date',
                    details: start_date
                })

                log.debug({
                    title: 'last_date',
                    details: last_date
                })

                form.addField({
                    id: 'custpage_sales_date_from',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = start_date;


                form.addField({
                    id: 'custpage_sales_date_to',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = last_date;

                //Display the modal pop-up to edit the customer details
                inlineHtml += updateCustomerModal();

                //Loading Section that gets displayed when the page is being loaded
                inlineHtml += loadingSection();


                //Instructions Sections
                inlineHtml += '<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br>This page assists you in finding the most relevant leads based on the filters used. </br> <ul><li><b>FRANCHISEE</b>: Leads based on the Franchisee they have been assigned to. You can also multiselect mutiple franchisees.</li><li><b>SALES REP</b>: Filter the page based on the selected Sales Rep the Sales Record of the lead has been assigned to. </li><li><b>STAGE</b>: Leads at different stages in the sales process. By default the status is "SUSPECT  - HOT LEAD"</li><li><b>SOURCE</b>: Filter by how the lead was generated. </li><li><b>SALES CAMPAIGN</b>: Leads based on the different campaigns. You can multiselect multiple campaigns.</li><li><b>DATE LEAD ENTERED</b>: By default the page is filtered on all the leads entered from 01/01/2024 onwards.</li><li><b>PARENT LPO</b>: Filter the page based on the leads assigned to the selected Parent LPO. You can multiselect multiple Parent LPO\'s at the same time_now.  </li></ul>Using the Filters: <ol><li><b>Select one or more filters</b>: Choose the criteria that best match your need.</li><li><b>Combine filters</b>: Use multiple filters together for even more precise targeting.</li><li>Click <b>"Apply Filter"</b>: Update the lead list based on your chosen filters.</li></ol>Navigating the Lead List: <ul><li>Displays key information like company name, contact details, and lead status.</li><li>Click <b>"Call Center"</b>: Access more detailed information and notes on the specific lead.</li></ul></p></br></div></br>';

                inlineHtml +=
                    '<div class="container" style=""><div id="alert" class="alert alert-danger fade in hide"></div></div>';

                //Search: SMC - Franchisees
                var searchZees = search.load({
                    id: 'customsearch_smc_franchisee'
                });
                var resultSetZees = searchZees.run();


                //Search: Parent LPO Customer List
                var activeParentLPOSearch = search.load({
                    id: 'customsearch_parent_lpo_customers_2'
                });
                var activeParentLPOSearchResultSet = activeParentLPOSearch.run();


                //Dropdown to Select the Fracnhisee
                inlineHtml += franchiseeDropdownSection(resultSetZees, context);

                //Section to select the Sales Rep or show the default Sales Rep based on loadingSection
                inlineHtml += userDropdownSection(userId, salesCampaign, custStage, source, custStatus);

                inlineHtml += dateFilterSection(start_date, last_date, modified_start_date, modified_last_date);

                //Dropdown to select Parent LPO
                inlineHtml += parentLPODropdownSection(activeParentLPOSearchResultSet, context);

                inlineHtml +=
                    '<div class="form-group container zee_available_buttons_section hide">';
                inlineHtml += '<div class="row">';
                inlineHtml +=
                    '<div class="col-xs-4"></div>'
                inlineHtml +=
                    '<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="border-radius: 25px"/></div>'
                inlineHtml +=
                    '<div class="col-xs-4"></div>'
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                //STATUSES - PROSPECT - QUOTE SENT / PROSPECT - NO ANSWER / PROSPECT - IN CONTACT
                // if (custStatus == '50' || custStatus == '35' || custStatus == '8') {
                //     inlineHtml += '<div class="container" style="background-color: lightblue;font-size: 14px;"><p><b><u>Color Codes for Prospects Tab</u></b><ol><li><b style="color: #f7e700;">Yellow</b>: 1st Attempt</li><li><b style="color: #f76f05;">Orange</b>: 2nd Attempt</li><li><b style="color: #ff2626;">Red</b>: 3rd Attempt</li></ol></p></div></br>'
                // }
                inlineHtml += tabsSection(custStage, paramUserId, salesCampaign, source, zee, parentLPOInternalId, start_date, last_date, page_no, custStatus);



                inlineHtml += '<div id="container"></div>'

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

                form.clientScriptFileId = 6063171;

                context.response.writePage(form);
            } else {
                var customer_id = context.request.parameters.custpage_customer_id;
                var sales_rep_id = context.request.parameters.custpage_sales_rep_id;
                var contact_id = context.request.parameters.custpage_contact_id;
                var contact_email = context.request.parameters.custpage_contact_email;
                var custpage_salesrecordid = context.request.parameters.custpage_salesrecordid;
                var lostnoresponse = context.request.parameters.custpage_lostnoresponse;

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

                var customer_record = record.load({
                    type: record.Type.CUSTOMER,
                    id: customer_id,
                    isDynamic: true
                });

                var custEntityID = customer_record.getValue({
                    fieldId: 'entityid'
                });
                var custName = customer_record.getValue({
                    fieldId: 'companyname'
                });


                if (lostnoresponse == 'true') {


                    var userid = encodeURIComponent(runtime.getCurrentUser().id);

                    var suiteletUrl = 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=154';
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
                            author: sales_rep_id,
                            body: emailHtml,
                            recipients: contact_email,
                            subject: custEntityID + ' ' + custName + ' - Do you want us to close your enquiry?',
                            cc: [sales_rep_id],
                            relatedRecords: { entityId: customer_id },
                        });
                    }
                } else {
                    var recSales = record.load({
                        type: 'customrecord_sales',
                        id: custpage_salesrecordid
                    });

                    var date = new Date();
                    var date_now = format.parse({
                        value: date,
                        type: format.Type.DATE
                    });
                    var time_now = format.parse({
                        value: date,
                        type: format.Type.TIMEOFDAY
                    });

                    var sales_campaign_name = recSales.getText({
                        fieldId: 'custrecord_sales_campaign'
                    });

                    // recSales.setValue({
                    //     fieldId: 'custrecord_sales_completed',
                    //     value: true
                    // });
                    recSales.setValue({
                        fieldId: 'custrecord_sales_quotesent',
                        value: true
                    });
                    recSales.setValue({
                        fieldId: 'custrecord_sales_inuse',
                        value: false
                    });
                    var lastAssigned = recSales.getValue({
                        fieldId: 'custrecord_sales_assigned'
                    });
                    if (isNullorEmpty(lastAssigned)) {
                        recSales.setValue({
                            fieldId: 'custrecord_sales_assigned',
                            value: userId
                        });
                    }

                    recSales.setValue({
                        fieldId: 'custrecord_sales_outcome',
                        value: 15
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
                        id: customer_id,
                        isDynamic: true
                    });

                    customer_record.setValue({
                        fieldId: 'entitystatus',
                        value: 50
                    });

                    var customerRecordId = customer_record.save({
                        ignoreMandatoryFields: true
                    });

                    var phoneCallRecord = record.create({
                        type: record.Type.PHONE_CALL
                    });
                    phoneCallRecord.setValue({
                        fieldId: 'assigned',
                        value: sales_rep_id
                    });
                    phoneCallRecord.setValue({
                        fieldId: 'custevent_organiser',
                        value: sales_rep_id
                    });
                    phoneCallRecord.setValue({
                        fieldId: 'startdate',
                        value: date_now
                    });
                    phoneCallRecord.setValue({
                        fieldId: 'company',
                        value: customer_id
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
                        value: sales_campaign_name + '  - Quote Sent'
                    });
                    phoneCallRecord.setValue({
                        fieldId: 'message',
                        value: 'No answer'
                    });
                    phoneCallRecord.setValue({
                        fieldId: 'custevent_call_outcome',
                        value: 23
                    });

                    phoneCallRecord.save({
                        ignoreMandatoryFields: true
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
                            author: sales_rep_id,
                            body: emailHtml,
                            recipients: contact_email,
                            subject: custEntityID + ' ' + custName + ' - Your MailPlus enquiry: Prices',
                            cc: [sales_rep_id],
                            relatedRecords: { entityId: customer_id },
                        });
                    }
                }

                redirect.toSuitelet({
                    scriptId: 'customscript_sl2_prospect_quote_sent',
                    deploymentId: 'customdeploy1',
                    parameters: null
                });
            }
        }

        function dateFilterSection(start_date, last_date, modified_start_date, modified_last_date) {

            var inlineHtml = '<div class="form-group container lead_entered_label_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;font-size: 12px;border-radius: 30px;">DATE LEAD ENTERED - FILTER</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container lead_entered_div hide">';
            inlineHtml += '<div class="row">';
            // Date from field
            inlineHtml += '<div class="col-xs-6 date_from">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_from_text">DATE LEAD ENTERED - FROM <span class="mandatory" style="font-size: 16px">*</span></span>';
            if (isNullorEmpty(start_date)) {
                inlineHtml += '<input id="date_from" class="form-control date_from" type="date" />';
            } else {
                inlineHtml += '<input id="date_from" class="form-control date_from" type="date" value="' + start_date + '"/>';
            }

            inlineHtml += '</div></div>';
            // Date to field
            inlineHtml += '<div class="col-xs-6 date_to">';
            inlineHtml += '<div class="input-group">';
            inlineHtml += '<span class="input-group-addon" id="date_to_text">DATE LEAD ENTERED - TO <span class="mandatory" style="font-size: 16px">*</span></span>';
            if (isNullorEmpty(last_date)) {
                inlineHtml += '<input id="date_to" class="form-control date_to" type="date">';
            } else {
                inlineHtml += '<input id="date_to" class="form-control date_to" type="date" value="' + last_date + '">';
            }

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

        /**
 * The Sales Rep dropdown field.
 * @param   {String}    date_from
 * @param   {String}    date_to
 * @return  {String}    `inlineHtml`
 */
        function userDropdownSection(userId, salesCampaign, custStage, source, custStatus) {

            log.debug({
                title: 'salesCampaign',
                details: salesCampaign
            })

            var searchedSalesTeam = search.load({
                id: 'customsearch_active_employees_3'
            });

            var inlineHtml =
                '<div class="form-group container cust_filter_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;font-size: 12px;border-radius: 30px;">SALES REP</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container cust_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 cust_dropdown_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="user_dropdown_text">SALES REP</span>';
            inlineHtml += '<select id="user_dropdown" class="form-control">';
            inlineHtml += '<option value=""></option>'
            searchedSalesTeam.run().each(function (searchResult_sales) {
                employee_id = searchResult_sales.getValue({
                    name: 'internalid'
                });
                employee_name = searchResult_sales.getValue({
                    name: 'entityid'
                });

                if (userId == employee_id && userId != 653718) {
                    inlineHtml += '<option value="' + employee_id +
                        '" selected="selected">' + employee_name + '</option>';
                } else {
                    inlineHtml += '<option value="' + employee_id + '">' +
                        employee_name +
                        '</option>';
                }

                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container cust_filter_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;font-size: 12px;border-radius: 30px;">LEAD DETAILS - STAGE/SOURCE/CAMPAIGN</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';


            inlineHtml +=
                '<div class="form-group container status_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 cust_status_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="cust_status_text">STAGE <span class="mandatory" style="font-size: 16px">*</span></span>';
            inlineHtml += '<select id="cust_stage" class="form-control">';

            if (custStage == 1) {
                inlineHtml += '<option value="1" selected>SUSPECTS</option>';
                inlineHtml += '<option value="2">PROSPECTS</option>';
            } else if (custStage == 2) {
                inlineHtml += '<option value="1">SUSPECTS</option>';
                inlineHtml += '<option value="2" selected>PROSPECTS</option>';
            } else {
                inlineHtml += '<option value="0"></option>';
                inlineHtml += '<option value="1">SUSPECTS</option>';
                inlineHtml += '<option value="2">PROSPECTS</option>';
            }

            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container status_dropdown_section hide">';
            inlineHtml += '<div class="row">';

            inlineHtml += '<div class="col-xs-12 cust_status_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="cust_status_text">STATUS </span>';
            inlineHtml += '<select id="cust_status" class="form-control">';
            inlineHtml += '<option value="0"></option>';

            if (custStage == '1') {
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
            } else if (custStage == '2') {
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
            }




            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container cust_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 sales_campaign_div">';
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
            inlineHtml += '</div></div></div></div>';

            inlineHtml +=
                '<div class="form-group container cust_dropdown_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 sales_campaign_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="sales_campaign_text">SALES CAMPAIGN</span>';
            inlineHtml += '<select id="sales_campaign" class="js-example-basic-multiple js-states form-control" style="width: 100%" multiple="multiple">';
            inlineHtml += '<option></option>';

            var salesCampaignSearch = search.load({
                type: 'customrecord_salescampaign',
                id: 'customsearch_sales_button_campaign'
            });


            salesCampaignSearch.filters.push(search.createFilter({
                name: 'custrecord_salescampaign_recordtype',
                join: null,
                operator: search.Operator.IS,
                values: 2
            }));

            log.debug({
                title: 'salesCampaignSearch.runPaged().count',
                details: salesCampaignSearch.runPaged().count
            })


            salesCampaignSearch.run().each(function (
                salesCampaignSearchResultSet) {

                var salesCampaignInternalId = salesCampaignSearchResultSet.getValue('internalid');
                var salesCampaignName = salesCampaignSearchResultSet.getValue('name');

                log.debug({
                    title: 'salesCampaignInternalId',
                    details: salesCampaignInternalId
                })

                if (salesCampaignInternalId >= 69 || salesCampaignInternalId == 67 || salesCampaignInternalId == 62 || salesCampaignInternalId == 70 || salesCampaignInternalId == 77) {


                    if (isNullorEmpty(salesCampaign)) {
                        inlineHtml += '<option value="' + salesCampaignInternalId + '" >' + salesCampaignName + '</option>';
                    } else {
                        if (salesCampaign.indexOf(",") != -1) {
                            var salesCampaignArray = salesCampaign.split(',');
                        } else {
                            var salesCampaignArray = [];
                            salesCampaignArray.push(salesCampaign)
                        }

                        if (salesCampaignArray.indexOf(salesCampaignInternalId) != -1) {
                            inlineHtml += '<option value="' + salesCampaignInternalId + '" selected="selected">' + salesCampaignName + '</option>';
                        } else {
                            inlineHtml += '<option value="' + salesCampaignInternalId + '" >' + salesCampaignName + '</option>';
                        }
                    }

                }


                return true;
            });

            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';


            return inlineHtml;

        }


        /**
         * The Franchisee dropdown field.
         * @param   {String}    date_from
         * @param   {String}    date_to
         * @return  {String}    `inlineHtml`
         */
        function franchiseeDropdownSection(resultSetZees, context) {
            var inlineHtml =
                '<div class="form-group container date_filter_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;font-size: 12px;border-radius: 30px;">FRANCHISEE</span></h4></div>';
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

                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;

        }

        function parentLPODropdownSection(activeParentLPOSearchResultSet, context) {
            var inlineHtml =
                '<div class="form-group container date_filter_section hide">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;font-size: 12px;border-radius: 30px;">PARENT LPO</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container parent_lpo_section hide">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 parent_lpo_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="parent_lpo_text">PARENT LPO</span>';
            inlineHtml += '<select id="parent_lpo" class="js-example-basic-multiple js-states form-control" style="width: 100%" multiple="multiple">';
            inlineHtml += '<option value=""></option>'
            activeParentLPOSearchResultSet.each(function (activeParentLPOResultSet) {
                parentLPOid = activeParentLPOResultSet.getValue('internalid');
                parentLPOName = activeParentLPOResultSet.getValue('companyname');



                if (isNullorEmpty(parentLPOInternalId)) {
                    inlineHtml += '<option value="' + parentLPOid + '">' + parentLPOName +
                        '</option>';
                } else {
                    if (parentLPOInternalId.indexOf(",") != -1) {
                        var parentLPOInternalIdArray = parentLPOInternalId.split(',');
                    } else {
                        var parentLPOInternalIdArray = [];
                        parentLPOInternalIdArray.push(parentLPOInternalId)
                    }

                    if (parentLPOInternalIdArray.indexOf(parentLPOid) != -1) {
                        inlineHtml += '<option value="' + parentLPOid + '" selected="selected">' + parentLPOName +
                            '</option>';
                    } else {
                        inlineHtml += '<option value="' + parentLPOid + '">' + parentLPOName +
                            '</option>';
                    }
                }

                // if (parentLPOInternalId == parentLPOid) {
                //     inlineHtml += '<option value="' + parentLPOid +
                //         '" selected="selected">' + parentLPOName + '</option>';
                // } else {
                //     inlineHtml += '<option value="' + parentLPOid + '">' + parentLPOName +
                //         '</option>';
                // }

                return true;
            });
            inlineHtml += '</select>';
            inlineHtml += '</div></div></div></div>';

            return inlineHtml;

        }

        function tabsSection(custStage, paramUserId, salesCampaign, source, zee, parentLPOInternalId, from_date, to_date, page_no, custStatus) {

            var zeeArray = [];
            if (!isNullorEmpty(zee)) {
                if (zee.indexOf(",") != -1) {
                    zeeArray = zee.split(',');
                } else {
                    zeeArray.push(zee)
                }

            }

            var parentLPOInternalIdArray = [];
            if (!isNullorEmpty(parentLPOInternalId)) {
                if (parentLPOInternalId.indexOf(",") != -1) {
                    parentLPOInternalIdArray = parentLPOInternalId.split(',');
                } else {
                    parentLPOInternalIdArray.push(parentLPOInternalId)
                }
            }
            var salesCampaignArray = [];
            if (!isNullorEmpty(salesCampaign)) {
                if (salesCampaign.indexOf(",") != -1) {
                    var salesCampaignArray = salesCampaign.split(',');
                } else {
                    salesCampaignArray.push(salesCampaign)
                }
            }


            log.debug({
                title: 'to_date',
                details: to_date
            })

            log.debug({
                title: 'from_date',
                details: from_date
            })

            var date_from;
            var date_to;
            if (!isNullorEmpty(from_date) && !isNullorEmpty(to_date)) {
                date_from = dateISOToNetsuite(from_date);
                date_to = dateISOToNetsuite(to_date);
            }


            log.debug({
                title: 'inside tabsSection function',
            })

            log.debug({
                title: 'date_from',
                details: date_from
            })

            log.debug({
                title: 'date_to',
                details: date_to
            })


            var inlineHtml = '<div class="tabs_section hide">';

            // Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';


            if (custStage == 1) {
                //STAGE: SUSPECTS

                //Website Leads - Suspects
                var suspectsSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_web_leads_suspects'
                });

                if (!isNullorEmpty(zeeArray)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zeeArray
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

                if (!isNullorEmpty(salesCampaignArray)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: salesCampaignArray
                    }));
                }

                if (!isNullorEmpty(custStatus) && custStatus != '0') {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: custStatus
                    }));
                }

                if (!isNullorEmpty(source)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: source
                    }));
                }

                if (!isNullorEmpty(parentLPOInternalIdArray)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.ANYOF,
                        values: parentLPOInternalIdArray
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

                log.debug({
                    title: 'suspectsSearchCount',
                    details: suspectsSearchCount
                })

                var totalPageCount = parseInt(suspectsSearchCount / 25) + 1;

                var divBreak = Math.ceil(12 / totalPageCount);

                inlineHtml +=
                    '<div class="form-group container zee_available_buttons_section">';
                inlineHtml += '<div class="row">';

                inlineHtml +=
                    '<div class="col-xs-12" style="text-align: center;font-size: 14px"><b>Total Lead Count: ' + (suspectsSearchCount) + '</b> </br> Pages: </br></div>';

                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml +=
                    '<div class="form-group container zee_available_buttons_section">';
                inlineHtml += '<div class="row">';

                var rangeStart = 0;
                var rangeEnd = 0;

                for (var i = 0; i < totalPageCount; i++) {
                    if (i == (totalPageCount - 1) || suspectsSearchCount < 25) {
                        if (suspectsSearchCount < 25) {
                        } else {
                            rangeStart = rangeEnd;
                        }
                        rangeEnd = suspectsSearchCount
                    } else {
                        rangeStart = ((parseInt((i + 1)) - 1) * 25);
                        if (rangeStart != 25) {
                            rangeEnd = rangeStart + 25;
                        } else {
                            rangeEnd = (suspectsSearchCount - rangeStart) - 1;
                            if (rangeEnd > 25) {
                                rangeEnd = parseInt((i + 1)) * 25
                            }
                        }
                    }

                    if (page_no == (i + 1)) {
                        inlineHtml +=
                            '<div class="col-xs-' + divBreak + '" style="text-align: center;"><input type="button" value="' + (i + 1) + '" class="form-control btn btn-info page_number" data-id="' + (i + 1) + '" style="background-color: #eaf143; color: #103D39;"/></br></div>'
                    } else {
                        inlineHtml +=
                            '<div class="col-xs-' + divBreak + '" style="text-align: center;"><input type="button" value="' + (i + 1) + '" class="form-control btn btn-info page_number" data-id="' + (i + 1) + '" /></br></div>'
                    }

                }
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml += dataTable('suspects');
                // inlineHtml += '</div>';
            } else if (custStage == 2) {
                // inlineHtml += '<div role="tabpanel" class="tab-pane active" id="prospects">';
                // inlineHtml += '<figure class="highcharts-figure">';
                // inlineHtml += '</figure><br></br>';

                //Website Leads - Prospect Quote Sent
                var custListCommenceTodayResults = search.load({
                    type: 'customer',
                    id: 'customsearch_web_leads_prosp_quote_sent'
                });

                if (!isNullorEmpty(zee)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'partner',
                        join: null,
                        operator: search.Operator.IS,
                        values: zeeArray
                    }));
                }


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

                if (!isNullorEmpty(salesCampaignArray)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'custrecord_sales_campaign',
                        join: 'custrecord_sales_customer',
                        operator: search.Operator.IS,
                        values: salesCampaignArray
                    }));
                }

                if (!isNullorEmpty(custStatus) && custStatus != '0') {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: custStatus
                    }));
                }

                if (!isNullorEmpty(source)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'leadsource',
                        join: null,
                        operator: search.Operator.IS,
                        values: source
                    }));
                }

                if (!isNullorEmpty(parentLPOInternalIdArray)) {
                    custListCommenceTodayResults.filters.push(search.createFilter({
                        name: 'internalid',
                        join: 'custentity_lpo_parent_account',
                        operator: search.Operator.IS,
                        values: parentLPOInternalIdArray
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

                var custListCommenceTodayResultsCount = custListCommenceTodayResults.runPaged().count;

                log.debug({
                    title: 'custListCommenceTodayResultsCount',
                    details: custListCommenceTodayResultsCount
                })

                var totalPageCount = parseInt(custListCommenceTodayResultsCount / 25) + 1;

                var divBreak = Math.ceil(12 / totalPageCount);

                inlineHtml +=
                    '<div class="form-group container zee_available_buttons_section">';
                inlineHtml += '<div class="row">';

                inlineHtml +=
                    '<div class="col-xs-12" style="text-align: center;font-size: 14px"><b>Total Lead Count: ' + (custListCommenceTodayResultsCount) + '</b></br> Pages: </div>';

                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml +=
                    '<div class="form-group container zee_available_buttons_section">';
                inlineHtml += '<div class="row">';

                var rangeStart = 0;
                var rangeEnd = 0;

                for (var i = 0; i < totalPageCount; i++) {
                    if (i == (totalPageCount - 1) || custListCommenceTodayResultsCount < 25) {
                        if (custListCommenceTodayResultsCount < 25) {
                        } else {
                            rangeStart = rangeEnd;
                        }
                        rangeEnd = custListCommenceTodayResultsCount
                    } else {
                        rangeStart = ((parseInt((i + 1)) - 1) * 25);
                        if (rangeStart != 25) {
                            rangeEnd = rangeStart + 25;
                        } else {
                            rangeEnd = (custListCommenceTodayResultsCount - rangeStart) - 1;
                            if (rangeEnd > 25) {
                                rangeEnd = parseInt((i + 1)) * 25
                            }
                        }
                    }


                    if (page_no == (i + 1)) {
                        inlineHtml +=
                            '<div class="col-xs-' + divBreak + '" style="text-align: center;"><input type="button" value="' + (i + 1) + '" class="form-control btn btn-info page_number" data-id="' + (i + 1) + '" style="background-color: #eaf143; color: #103D39;"/></br></div>'
                    } else {
                        inlineHtml +=
                            '<div class="col-xs-' + divBreak + '" style="text-align: center;"><input type="button" value="' + (i + 1) + '" class="form-control btn btn-info page_number" data-id="' + (i + 1) + '" /></br></div>'
                    }
                }
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml += dataTable('prospects');
                // inlineHtml += '</div>';
            }

            
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
                ' th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;}.table-striped > tbody > tr:nth-child(2n) > td, .table-striped > tbody > tr:nth-child(2n) > th {background-color: white;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>';
            inlineHtml += '<table id="mpexusage-' +
                name +
                '" class="table table-responsive table-striped customer tablesorter row-border cell-border" style="width: 100%;border: 2px solid #103d39">';
            inlineHtml += '<thead style="color: white;background-color: #095C7B;" hide>';
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

        /**
         * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
         * @param   {String} date_iso       "2020-06-01"
         * @returns {String} date_netsuite  "1/6/2020"
         */
        function dateISOToNetsuite(date_iso) {
            var date_netsuite = '';
            var date_iso_split = date_iso.split('-');

            log.debug({
                title: 'date_iso_split[0]',
                details: date_iso_split[0]
            })
            log.debug({
                title: 'date_iso_split[1]',
                details: date_iso_split[1]
            })
            log.debug({
                title: 'date_iso_split[2]',
                details: date_iso_split[2]
            })
            if (!isNullorEmpty(date_iso)) {
                var date_utc = new Date(date_iso_split[0], date_iso_split[1] - 1, date_iso_split[2]);
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
