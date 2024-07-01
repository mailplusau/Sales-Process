/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Fri Jun 28 2024
 * Modified on:          Fri Jun 28 2024 14:42:48
 * SuiteScript Version:  2.0 
 * Description:          Change status of lost customer to Hot Lead and send email out to the account manager. 
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */




define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record', 'N/https', 'N/log', 'N/redirect', 'N/url', 'N/format', 'N/task'],
    function (ui, email, runtime, search, record, https, log, redirect, url, format, task) {
        var role = 0;
        var userId = 0;
        var zee = 0;

        function onRequest(context) {
            var baseURL = 'https://system.na2.netsuite.com';
            if (runtime.EnvType == "SANDBOX") {
                baseURL = 'https://system.sandbox.netsuite.com';
            }

            if (context.request.method === 'GET') {

                log.debug({
                    title: 'context.request.parameters',
                    details: context.request.parameters
                })

                var custinternalid = context.request.parameters.custinternalid;

                var form = ui.createForm({
                    title: 'Thank you! We\'ll be in touch ASAP to discuss Premium delivery and serving your business again'
                });

                var customerRecord = record.load({
                    type: record.Type.CUSTOMER,
                    id: parseInt(custinternalid),
                    isDynamic: true
                });

                var accountManagerID = customerRecord.getValue({
                    fieldId: 'custentity_mp_toll_salesrep'
                });
                var entity_id = customerRecord.getValue({
                    fieldId: 'entityid'
                });
                var customer_name = customerRecord.getValue({
                    fieldId: 'companyname'
                });

                customerRecord.setValue({
                    fieldId: 'entitystatus',
                    value: 57
                });

                customerRecord.save();

                //Get Active Sales Record
                //Search Name: All Sales Records
                var allSalesRecordSearch = search.load({
                    type: 'customrecord_sales',
                    id: 'customsearch_all_sales_records_2'
                });
                allSalesRecordSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'custrecord_sales_customer',
                    operator: search.Operator.ANYOF,
                    values: custinternalid
                }));

                var allSalesRecordSearchResultSet = allSalesRecordSearch.run().getRange({
                    start: 0,
                    end: 1
                });
                var salesRecordInternalId = null;
                log.debug({
                    title: 'allSalesRecordSearchResultSet.length',
                    details: allSalesRecordSearchResultSet.length
                })
                if (allSalesRecordSearchResultSet.length == 1) {
                    salesRecordInternalId = allSalesRecordSearchResultSet[0].getValue({
                        name: "internalid",
                    });
                }
                log.debug({
                    title: 'salesRecordInternalId',
                    details: salesRecordInternalId
                })
                if (!isNullorEmpty(salesRecordInternalId)) {
                    var salesRecord = record.load({
                        type: 'customrecord_sales',
                        id: salesRecordInternalId,
                    });
                    salesRecord.setValue({ fieldId: 'custrecord_sales_completed', value: true });
                    salesRecord.setValue({ fieldId: 'custrecord_sales_deactivated', value: true });
                    salesRecord.setValue({ fieldId: 'custrecord_sales_completedate', value: getDateStoreNS() });

                    salesRecord.save({ ignoreMandatoryFields: true });
                }

                var newSalesRecord = record.create({
                    type: 'customrecord_sales',
                });
                newSalesRecord.setValue({ fieldId: 'custrecord_sales_customer', value: custinternalid });
                newSalesRecord.setValue({ fieldId: 'custrecord_sales_campaign', value: 71 });
                newSalesRecord.setValue({ fieldId: 'custrecord_sales_assigned', value: accountManagerID });
                newSalesRecord.setValue({ fieldId: 'custrecord_sales_outcome', value: 20 });
                newSalesRecord.setValue({ fieldId: 'custrecord_sales_callbackdate', value: getDateStoreNS() });
                var salesRecordId = newSalesRecord.save();

                var emailAttach = new Object();
                emailAttach['entity'] = custinternalid;
                var from = 112209; //MailPlus team
                var subject = 'Sales MP - Premium HOT Lead (Lost Customer to Hot Lead) - ' + entity_id + ' ' + customer_name + '';
                var to = accountManagerID;
                var cc = ['luke.forbes@mailplus.com.au', 'lee.russell@mailplus.com.au',
                    'ankith.ravindran@mailplus.com.au'];
                var cust_id_link =
                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                    custinternalid;
                var body =
                    'New sales record has been created. \n A Lost Customer has requested to reactivate their account. \n Customer Name: ' +
                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link;

                email.send({
                    author: 112209,
                    body: body,
                    recipients: to,
                    subject: subject,
                    cc: cc,
                    relatedRecords: { entityId: custinternalid }
                });

                context.response.writePage(form);
            } else {

            }
        }


        function isNullorEmpty(val) {
            if (val == '' || val == null) {
                return true;
            } else {
                return false;
            }
        }

        function getDateStoreNS() {
            var date = new Date();
            if (date.getHours() > 6) {
                date.setDate(date.getDate() + 1);
            }

            format.format({
                value: date,
                type: format.Type.DATE,
                timezone: format.Timezone.AUSTRALIA_SYDNEY
            })

            return date;
        }

        return {
            onRequest: onRequest
        };
    });
