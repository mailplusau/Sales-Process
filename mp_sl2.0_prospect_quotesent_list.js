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
                var paramUserId = context.request.parameters.user;
                var salesCampaign = context.request.parameters.campaign;
                var custStatus = context.request.parameters.status;

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
                    title: 'Prospect Quote Sent & Opportunities - List'
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




                //Display the modal pop-up to edit the customer details
                inlineHtml += updateCustomerModal();

                //Loading Section that gets displayed when the page is being loaded
                inlineHtml += loadingSection();
                //Search: SMC - Franchisees
                var searchZees = search.load({
                    id: 'customsearch_smc_franchisee'
                });
                var resultSetZees = searchZees.run();

                //Dropdown to Select the Fracnhisee
                // inlineHtml += franchiseeDropdownSection(resultSetZees, context);

                //Section to select the Sales Rep or show the default Sales Rep based on loadingSection
                inlineHtml += userDropdownSection(userId, salesCampaign, custStatus);
                if (custStatus == '50' || custStatus == '35' || custStatus == '8') {
                    inlineHtml += '<div class="container" style="background-color: lightblue;font-size: 14px;"><p><b><u>Color Codes for Prospects Tab</u></b><ol><li><b style="color: #f7e700;">Yellow</b>: 1st Attempt</li><li><b style="color: #f76f05;">Orange</b>: 2nd Attempt</li><li><b style="color: #ff2626;">Red</b>: 3rd Attempt</li></ol></p></div></br>'
                }
                inlineHtml += tabsSection(custStatus, paramUserId, salesCampaign);

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
        function userDropdownSection(userId, salesCampaign, custStatus) {

            var searchedSalesTeam = search.load({
                id: 'customsearch_active_employees_3'
            });

            var inlineHtml =
                '<div class="form-group container cust_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">SALES REP</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml +=
                '<div class="form-group container cust_dropdown_section">';
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

                if (userId == employee_id) {
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
                '<div class="form-group container status_dropdown_section">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 cust_status_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="cust_status_text">STATUS</span>';
            inlineHtml += '<select id="cust_status" class="form-control">';
            inlineHtml += '<option value="0"></option>';
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

            inlineHtml +=
                '<div class="form-group container cust_dropdown_section">';
            inlineHtml += '<div class="row">';
            // Period dropdown field
            inlineHtml += '<div class="col-xs-12 sales_campaign_div">';
            inlineHtml += '<div class="input-group">';
            inlineHtml +=
                '<span class="input-group-addon" id="sales_campaign_text">SALES CAMPAIGN</span>';
            inlineHtml += '<select id="sales_campaign" class="form-control">';
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


            salesCampaignSearch.run().each(function (
                salesCampaignSearchResultSet) {

                var salesCampaignInternalId = salesCampaignSearchResultSet.getValue('internalid');
                var salesCampaignName = salesCampaignSearchResultSet.getValue('name');

                if (salesCampaignInternalId == 69 || salesCampaignInternalId == 67 || salesCampaignInternalId == 62) {
                    if (salesCampaignInternalId == salesCampaign) {
                        inlineHtml += '<option value="' + salesCampaignInternalId + '" selected="selected">' + salesCampaignName + '</option>';
                    } else {
                        inlineHtml += '<option value="' + salesCampaignInternalId + '" >' + salesCampaignName + '</option>';
                    }

                }


                return true;
            });

            inlineHtml += '</select>';
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
                '<div class="form-group container date_filter_section">';
            inlineHtml += '<div class="row">';
            inlineHtml +=
                '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">FRANCHISEE</span></h4></div>';
            inlineHtml += '</div>';
            inlineHtml += '</div>';

            inlineHtml += '<div class="form-group container zee_dropdown_section">';
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

        function tabsSection(custStatus, paramUserId, salesCampaign) {
            var inlineHtml = '<div >';

            // Tabs headers
            inlineHtml +=
                '<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }';
            inlineHtml +=
                '.nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }';
            inlineHtml += '</style>';

            inlineHtml +=
                '<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

            if (custStatus == '57' || custStatus == '42' || custStatus == '6' || custStatus == '60' || custStatus == '7') {
                inlineHtml +=
                    '<li role="presentation" class="active"><a data-toggle="tab" href="#suspects"><b>SUSPECTS</b></a></li>';
            } else {
                inlineHtml +=
                    '<li role="presentation" class="hide"><a data-toggle="tab" href="#suspects"><b>SUSPECTS</b></a></li>';
            }
            if (custStatus == '67' || custStatus == '18') {
                inlineHtml +=
                    '<li role="presentation" class="active"><a data-toggle="tab" href="#followup"><b>FOLLOW-UP</b></a></li>';
            } else {
                inlineHtml +=
                    '<li role="presentation" class="hide"><a data-toggle="tab" href="#followup"><b>FOLLOW-UP</b></a></li>';
            }

            if (custStatus == '68') {
                inlineHtml +=
                    '<li role="presentation" class="active"><a data-toggle="tab" href="#validated"><b>VALIDATED</b></a></li>';
            } else {
                inlineHtml +=
                    '<li role="presentation" class="hide"><a data-toggle="tab" href="#validated"><b>VALIDATED</b></a></li>';
            }
            if (custStatus == '50' || custStatus == '35' || custStatus == '8') {
                inlineHtml +=
                    '<li role="presentation" class="active"><a data-toggle="tab" href="#prospects"><b>PROSPECTS</b></a></li>';
            } else {
                inlineHtml +=
                    '<li role="presentation" class="hide"><a data-toggle="tab" href="#prospects"><b>PROSPECTS</b></a></li>';
            }
            if (custStatus == '58') {
                inlineHtml +=
                    '<li role="presentation" class="active"><a data-toggle="tab" href="#opportunities"><b>OPPORTUNITIES</b></a></li>';
            } else {
                inlineHtml +=
                    '<li role="presentation" class="hide"><a data-toggle="tab" href="#opportunities"><b>OPPORTUNITIES</b></a></li>';
            }



            inlineHtml += '</ul></div>';

            // Tabs content
            inlineHtml += '<div class="tab-content">';

            if (custStatus == '57' || custStatus == '42' || custStatus == '6' || custStatus == '60' || custStatus == '7') {
                inlineHtml += '<div role="tabpanel" class="tab-pane active" id="suspects">';

                inlineHtml += '<figure class="highcharts-figure">';
                inlineHtml += '<div id="container_suspects"></div>';
                inlineHtml += '</figure><br>';


                //Website Leads - Suspects
                var suspectsSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_web_leads_suspects'
                });

                // if (!isNullorEmpty(zee_id)) {
                //     suspectsSearch.filters.push(search.createFilter({
                //         name: 'partner',
                //         join: null,
                //         operator: search.Operator.IS,
                //         values: zee_id
                //     }));
                // }

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

                if (!isNullorEmpty(custStatus)) {
                    suspectsSearch.filters.push(search.createFilter({
                        name: 'entitystatus',
                        join: null,
                        operator: search.Operator.IS,
                        values: custStatus
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
                    '<div class="col-xs-12" style="text-align: center;font-size: 14px"><b>Total Lead Count ' + (suspectsSearchCount) + '</b></div>';

                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml +=
                    '<div class="form-group container zee_available_buttons_section">';
                inlineHtml += '<div class="row">';

                for (var i = 0; i < totalPageCount; i++) {
                    if (i == (totalPageCount - 1) || suspectsSearchCount < 25) {
                        var rangeEnd = suspectsSearchCount
                    } else {
                        var rangeStart = ((parseInt((i + 1)) - 1) * 25);
                        if (rangeStart != 25) {
                            var rangeEnd = rangeStart + 25;
                        } else {
                            var rangeEnd = (suspectsSearchCount - rangeStart) - 1;
                            if (rangeEnd > 25) {
                                rangeEnd = parseInt((i + 1)) * 25
                            }
                        }
                    }


                    inlineHtml +=
                        '<div class="col-xs-' + divBreak + '" style="text-align: center;"><input type="button" value="Page: ' + (i + 1) + '&#13;&#10;(' + rangeStart + ' - ' + rangeEnd + ' Leads)" class="form-control btn btn-info page_number" data-id="' + (i + 1) + '" /></br></div>'
                }
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml += dataTable('suspects');
                inlineHtml += '</div>';
            }

            if (custStatus == '50' || custStatus == '35' || custStatus == '8') {
                inlineHtml += '<div role="tabpanel" class="tab-pane active" id="prospects">';
                inlineHtml += '<figure class="highcharts-figure">';
                inlineHtml += '</figure><br></br>';
                inlineHtml += dataTable('prospects');
                inlineHtml += '</div>';
            }

            if (custStatus == '67' || custStatus == '18') {
                inlineHtml += '<div role="tabpanel" class="tab-pane active" id="followup">';

                inlineHtml += '<figure class="highcharts-figure">';
                inlineHtml += '<div id="container_followup"></div>';
                inlineHtml += '</figure><br></br>';
                inlineHtml += dataTable('followups');
                inlineHtml += '</div>';
            }

            if (custStatus == '68'){
                inlineHtml += '<div role="tabpanel" class="tab-pane active" id="validated">';

                inlineHtml += '<figure class="highcharts-figure">';
                inlineHtml += '<div id="container_validated"></div>';
                inlineHtml += '</figure><br></br>';
                inlineHtml += dataTable('validated');
                inlineHtml += '</div>';
            }

            if (custStatus == '58') {
                inlineHtml += '<div role="tabpanel" class="tab-pane active" id="opportunities">';

                inlineHtml += '<figure class="highcharts-figure">';
                inlineHtml += '<div id="container_customer"></div>';
                inlineHtml += '</figure><br></br>';
                inlineHtml += dataTable('opportunities');
                inlineHtml += '</div>';
            }


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
