/** 
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * 
 * Author:               Ankith Ravindran
 * Created on:           Mon Oct 09 2023
 * Modified on:          Mon Oct 09 2023 09:36:51
 * SuiteScript Version:  2.0 
 * Description:           
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect'
],
    function (ui, email, runtime, search, record, http, log, redirect) {
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
                var customerInternalId = context.request.parameters.customerId;
                var salesRecordInternalId = context.request.parameters.salesRecordId;
                var cust = context.request.parameters.cust;

                if (isNullorEmpty(userId)) {
                    userId = null;
                }

                var customerRecord = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId,
                    isDynamic: true
                });

                var customerStatus = customerRecord.getValue({
                    fieldId: 'entitystatus'
                });
                var dayToDayPhone = customerRecord.getValue({
                    fieldId: 'phone'
                });
                var websiteURL = customerRecord.getValue({
                    fieldId: 'custentity_website_page_url'
                });
                var customerABN = customerRecord.getValue({
                    fieldId: 'vatregnumber'
                });
                var currentCarrier = customerRecord.getValue({
                    fieldId: 'custentity_previous_carrier'
                });
                var customerZee = customerRecord.getValue({
                    fieldId: 'partner'
                });

                var partnerRecord = record.load({
                    type: record.Type.PARTNER,
                    id: customerZee
                });

                var salesRep = partnerRecord.getValue({
                    fieldId: 'custentity_sales_rep_assigned'
                })

                var form = ui.createForm({
                    title: 'Reassign Sales Record - '
                });


                var inlineHtml =
                    '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/highcharts-more.js"></script><script src="https://code.highcharts.com/modules/solid-gauge.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}</style > ';

                inlineHtml += loadingSection();
                inlineHtml +=
                    '<div class="container" style=""><div id="alert" class="alert alert-danger fade in"></div>';

                form.addField({
                    id: 'custpage_customer_internal_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = customerInternalId;

                form.addField({
                    id: 'custpage_sales_record_internal_id',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                }).defaultValue = salesRecordInternalId;

                form.addField({
                    id: 'custpage_button_clicked',
                    type: ui.FieldType.TEXT,
                    label: 'Table CSV'
                }).updateDisplayType({
                    displayType: ui.FieldDisplayType.HIDDEN
                })




                //Search: SMC - Franchisees
                var searchZees = search.load({
                    id: 'customsearch_smc_franchisee'
                });
                var resultSetZees = searchZees.run();

                inlineHtml += '<div class="form-group container additional_lead_header_section hide">';
                inlineHtml += '<div class="row">';
                inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">Sales Record Information</span></h4></div>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                inlineHtml += '<div class="form-group container salesrep_section hide">';
                inlineHtml += '<div class="row">';

                // Period dropdown field
                inlineHtml += '<div class="col-xs-3 zee_dropdown_div">';
                inlineHtml += '<div class="input-group">';
                inlineHtml +=
                    '<span class="input-group-addon" id="zee_dropdown_text">Franchisee</span>';
                inlineHtml += '<select id="zee_dropdown" class="form-control">';
                inlineHtml += '<option value=""></option>'
                resultSetZees.each(function (searchResult_zee) {
                    zee_id = searchResult_zee.getValue('internalid');
                    zee_name = searchResult_zee.getValue('companyname');

                    if (customerZee == zee_id) {
                        inlineHtml += '<option value="' + zee_id +
                            '" selected="selected">' + zee_name + '</option>';
                    } else {
                        inlineHtml += '<option value="' + zee_id + '">' + zee_name +
                            '</option>';
                    }

                    return true;
                });
                
                inlineHtml += '</select>';
                inlineHtml += '</div></div>';


                inlineHtml += '<div class="col-xs-3 sales_rep_div">';
                inlineHtml += '<div class="input-group">';
                inlineHtml +=
                    '<span class="input-group-addon" id="sales_rep_text">SALES REP</span>';
                inlineHtml += '<select id="sales_rep" class="form-control">';
                inlineHtml += '<option></option>';

                // if (salesRep == '668711') {
                //     inlineHtml += '<option value="668711" selected>Lee Russell</option>';
                //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                //     inlineHtml += '<option value="690145">David Gdanski</option>';
                //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
                // } else if (salesRep == '696160') {
                //     inlineHtml += '<option value="668711">Lee Russell</option>';
                //     inlineHtml += '<option value="696160" selected>Kerina Helliwell</option>';
                //     inlineHtml += '<option value="690145">David Gdanski</option>';
                //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
                // } else if (salesRep == '690145') {
                //     inlineHtml += '<option value="668711">Lee Russell</option>';
                //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                //     inlineHtml += '<option value="690145" selected>David Gdanski</option>';
                //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
                // } else if (salesRep == '668712') {
                //     inlineHtml += '<option value="668711">Lee Russell</option>';
                //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                //     inlineHtml += '<option value="690145">David Gdanski</option>';
                //     inlineHtml += '<option value="668712" selected>Belinda Urbani</option>';
                // } else {
                //     inlineHtml += '<option value="668711">Lee Russell</option>';
                //     inlineHtml += '<option value="696160">Kerina Helliwell</option>';
                //     inlineHtml += '<option value="690145">David Gdanski</option>';
                //     inlineHtml += '<option value="668712">Belinda Urbani</option>';
                // }

                var searchedSalesTeam = search.load({
                    id: "customsearch_active_employees_3",
                });

                searchedSalesTeam.run().each(function (searchResult_sales) {
                    employee_id = searchResult_sales.getValue({
                        name: "internalid",
                    });
                    employee_name = searchResult_sales.getValue({
                        name: "entityid",
                    });
                    inlineHtml +=
                        '<option value="' + employee_id + '">' + employee_name + "</option>";
                    return true;
                });
                inlineHtml += '<option value="653718">Luke Forbes</option>';
                inlineHtml += '</select>';
                inlineHtml += '</div></div>';

                inlineHtml += '<div class="col-xs-6 sales_campaign_div">';
                inlineHtml += '<div class="input-group">';
                inlineHtml +=
                    '<span class="input-group-addon" id="sales_campaign_text">SALES CAMPAIGN</span>';
                inlineHtml += '<select id="sales_campaign" class="form-control">';
                inlineHtml += '<option></option>';

                var salesCampaignSearch = search.load({
                    type: 'customrecord_salescampaign',
                    id: 'customsearch_sales_button_campaign'
                });

                if (customerStatus == 13) {
                    salesCampaignSearch.filters.push(search.createFilter({
                        name: 'custrecord_salescampaign_recordtype',
                        join: null,
                        operator: search.Operator.IS,
                        values: 1
                    }));
                } else {
                    salesCampaignSearch.filters.push(search.createFilter({
                        name: 'custrecord_salescampaign_recordtype',
                        join: null,
                        operator: search.Operator.IS,
                        values: 2
                    }));
                }

                salesCampaignSearch.run().each(function (
                    salesCampaignSearchResultSet) {

                    var salesCampaignInternalId = salesCampaignSearchResultSet.getValue('internalid');
                    var salesCampaignName = salesCampaignSearchResultSet.getValue('name');

                    if (salesCampaignInternalId == 67 || salesCampaignInternalId == 62 || salesCampaignInternalId == 70 || salesCampaignInternalId == 82) {
                        inlineHtml += '<option value="' + salesCampaignInternalId + '" >' + salesCampaignName + '</option>';
                    }


                    return true;
                });

                inlineHtml += '</select>';
                inlineHtml += '</div></div></div></div>';


                // inlineHtml += '<div class="form-group container additional_lead_header_section hide">';
                // inlineHtml += '<div class="row">';
                // inlineHtml += '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">Additional Lead Information</span></h4></div>';
                // inlineHtml += '</div>';
                // inlineHtml += '</div>';

                // inlineHtml += '<div class="form-group container additional_lead_section hide">';
                // inlineHtml += '<div class="row">';
                // inlineHtml +=
                //     '<div class="col-xs-3 bau_div">';
                // inlineHtml += '<div class="input-group">';
                // inlineHtml += '<span class="input-group-addon" id="date_signed_up_from_text">ABN</span>';
                // inlineHtml += '<input type="text" id="abn" class="form-control " value="' + customerABN + '" /></div></div>';

                // inlineHtml +=
                //     '<div class="col-xs-3 lpo_div">';
                // inlineHtml += '<div class="input-group">';
                // inlineHtml += '<span class="input-group-addon" id="date_signed_up_from_text">WEBSITE</span>';
                // inlineHtml += '<input type="url" id="website" class="form-control "  value="' + websiteURL + '"/></div></div>';

                // inlineHtml +=
                //     '<div class="col-xs-3 decline_div">';
                // inlineHtml += '<div class="input-group">';
                // inlineHtml += '<span class="input-group-addon" id="date_signed_up_from_text">PHONE</span>';
                // inlineHtml += '<input type="phone" id="phone" class="form-control "  value="' + dayToDayPhone + '"/></div></div>';

                // inlineHtml += '<div class="col-xs-3 carrier_div">';
                // inlineHtml += '<div class="input-group">';
                // inlineHtml +=
                //     '<span class="input-group-addon" id="carrier_text">CARRIER</span>';
                // inlineHtml += '<select id="carrier" class="form-control">';
                // inlineHtml += '<option></option>';
                // var carrierList = search.create({
                //     type: 'customlist_carrier',
                //     columns: [
                //         { name: 'internalId' },
                //         { name: 'name' }
                //     ]
                // });

                // carrierList.run().each(function (
                //     carrierListResultSet) {

                //     var carrierInternalId = carrierListResultSet.getValue('internalId');
                //     var carrierName = carrierListResultSet.getValue('name');

                //     inlineHtml += '<option value="' + carrierInternalId + '" >' + carrierName + '</option>';

                //     return true;
                // });
                // inlineHtml += '</select>';
                // inlineHtml += '</div></div></div></div></br></br>';


                inlineHtml += '<div class="form-group container qualification_buttons hide">';
                inlineHtml += '<div class="row">';
                inlineHtml +=
                    '<div class="col-xs-4 lpo_div" style="text-align: center;"></div>';
                inlineHtml +=
                    '<div class="col-xs-4 bau_div" style="text-align: center;"><input type="button" id="updateSalesRecord" class="form-control callback btn btn-success" value="UPDATE SALES RECORD" /></div>';

                inlineHtml +=
                    '<div class="col-xs-4 decline_div" style="text-align: center;"></div>';
                inlineHtml += '</div>';
                inlineHtml += '</div>';

                form.addSubmitButton({
                    label: 'Save',
                });


                form.addField({
                    id: 'preview_table',
                    label: 'inlinehtml',
                    type: 'inlinehtml'
                }).updateLayoutType({
                    layoutType: ui.FieldLayoutType.STARTROW
                }).defaultValue = inlineHtml;

                form.clientScriptFileId = 6650352
                context.response.writePage(form);
            } else {
                var customer_id = context.request.parameters.custpage_customer_internal_id;
                var sales_record_id = context.request.parameters.custpage_sales_record_internal_id;
                var button_clicked = context.request.parameters.custpage_button_clicked;

                var params = {
                    customerId: parseInt(customer_id),
                    callCenter: "T",
                    salesRecordId: sales_record_id,
                };

                redirect.toSuitelet({
                    scriptId: "customscript_sl_update_customer_tn_vue3",
                    deploymentId: "customdeploy_sl_update_customer_tn_vue3",
                    parameters: params
                });

            }
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


        /**
         * @description
         * @author Ankith Ravindran (AR)
         * @date 09/10/2023
         * @param {*} todayDate
         * @returns {*} 
         */
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