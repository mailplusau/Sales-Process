/** 
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * 
 * Author:               Ankith Ravindran
 * Created on:           Thu Oct 12 2023
 * Modified on:          Thu Oct 12 2023 13:33:37
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */


define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect', 'N/format'
],
    function (ui, email, runtime, search, record, http, log, redirect, format) {
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

            var date = new Date();
            var date_now = format.parse({
                value: date,
                type: format.Type.DATE
            });
            var time_now = format.parse({
                value: date,
                type: format.Type.TIMEOFDAY
            });

            if (context.request.method === 'GET') {
                var customerInternalId = context.request.parameters.custid;
                role = context.request.parameters.role;

                log.debug({
                    title: 'customerInternalId',
                    details: customerInternalId
                })

                var zee_id;
                var zeeCount = 0;
                var salesRep;
                var siteAddressZipCode = null;
                var siteAddressSuburb = null;
                var siteAddressState = null;
                var salesRepEmail = null;
                var salesRepName = null;

                //Find the postcode for the customer
                //Search: Lead List - Site Addresses
                var siteAddressesSearch = search.load({
                    type: 'customer',
                    id: 'customsearch_cust_list_site_addresses_2'
                });

                siteAddressesSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: null,
                    operator: search.Operator.ANYOF,
                    values: customerInternalId
                }));

                siteAddressesSearch.run().each(function (
                    siteAddressesSearchResultSet) {

                    siteAddressZipCode = siteAddressesSearchResultSet.getValue({
                        name: "zipcode",
                        join: "Address"
                    });
                    siteAddressSuburb = siteAddressesSearchResultSet.getValue({
                        name: "city",
                        join: "Address"
                    });
                    siteAddressState = siteAddressesSearchResultSet.getValue({
                        name: "state",
                        join: "Address"
                    });
                    return true;
                });

                log.debug({
                    title: 'siteAddressZipCode',
                    details: siteAddressZipCode
                })
                log.debug({
                    title: 'siteAddressSuburb',
                    details: siteAddressSuburb
                })
                log.debug({
                    title: 'siteAddressState',
                    details: siteAddressState
                })
                if (role != 1032) {
                    if (!isNullorEmpty(siteAddressZipCode) && !isNullorEmpty(siteAddressSuburb) && !isNullorEmpty(siteAddressState)) {
                        //Network Matrix - Franchisee - Auto Allocate
                        var zeeNetworkMatrixSearch = search.load({
                            type: 'partner',
                            id: 'customsearch_networkmtrx_zee_suburb_2'
                        });

                        zeeNetworkMatrixSearch.filters.push(search.createFilter({
                            name: 'entityid',
                            join: null,
                            operator: search.Operator.DOESNOTSTARTWITH,
                            values: "old"
                        }));
                        zeeNetworkMatrixSearch.filters.push(search.createFilter({
                            name: 'entityid',
                            join: null,
                            operator: search.Operator.DOESNOTSTARTWITH,
                            values: "test"
                        }));
                        zeeNetworkMatrixSearch.filters.push(search.createFilter({
                            name: 'custentity_network_matrix_json',
                            join: null,
                            operator: search.Operator.CONTAINS,
                            values: siteAddressSuburb
                        }));
                        zeeNetworkMatrixSearch.filters.push(search.createFilter({
                            name: 'custentity_network_matrix_json',
                            join: null,
                            operator: search.Operator.CONTAINS,
                            values: siteAddressState
                        }));
                        zeeNetworkMatrixSearch.filters.push(search.createFilter({
                            name: 'custentity_network_matrix_json',
                            join: null,
                            operator: search.Operator.CONTAINS,
                            values: siteAddressZipCode
                        }));

                        var zee_name = '';

                        zeeNetworkMatrixSearch.run().each(function (
                            zeeNetworkMatrixSearchResultSet) {

                            zee_id = zeeNetworkMatrixSearchResultSet.getValue({
                                name: 'internalid'
                            });
                            if (zeeCount == 0) {
                                zee_name += zeeNetworkMatrixSearchResultSet.getValue({
                                    name: 'companyname'
                                });
                            } else {
                                zee_name += ', ' + zeeNetworkMatrixSearchResultSet.getValue({
                                    name: 'companyname'
                                });
                            }

                            zeeCount++;
                            return true;
                        });

                        var customerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: customerInternalId,
                            isDynamic: true
                        });

                        var leadSource = customerRecord.getValue({
                            fieldId: 'leadsource'
                        });

                        var entity_id = customerRecord.getValue({
                            fieldId: 'entityid'
                        });

                        var customer_name = customerRecord.getValue({
                            fieldId: 'companyname'
                        });

                        if (isNullorEmpty(zee_id) || zeeCount > 1) {
                            if (leadSource != -4) {
                                customerRecord.setValue({
                                    fieldId: 'partner',
                                    value: 435, //MailPlus Pty Ltd
                                });
                            }
                            if (siteAddressZipCode >= 2000 && siteAddressZipCode <= 2999) {
                                if (siteAddressZipCode == 2481 || siteAddressZipCode == 2482 || siteAddressZipCode == 2485 ||
                                    siteAddressZipCode == 2486 || siteAddressZipCode == 2487 || siteAddressZipCode == 2488 || siteAddressZipCode ==
                                    2479) {
                                    //Lee 
                                    salesRep = 668711;
                                } else if (siteAddressZipCode == 2481) { //Albury
                                    //Belinda
                                    salesRep = 668712;
                                } else {
                                    //Kerina
                                    salesRep = 696160;
                                }
                            } else {
                                if ((siteAddressZipCode >= 3000 && siteAddressZipCode <= 3999) || (siteAddressZipCode >= 7000 && siteAddressZipCode <= 7999)) { //VIC & SA & TAS siteAddressZipCodes
                                    salesRep = 668712; //Belinda Urbani
                                } else if ((siteAddressZipCode >= 5000 &&
                                    siteAddressZipCode <= 5999)) {
                                    salesRep = 668712; //Belinda Urbani
                                } else if ((siteAddressZipCode >= 4000 && siteAddressZipCode <= 4999) || (siteAddressZipCode >= 800 &&
                                    siteAddressZipCode <= 999) || (siteAddressZipCode >= 6000 && siteAddressZipCode <= 6999)) { //QLD & NT & WA siteAddressZipCodes
                                    salesRep = 668711; //Lee Russell
                                } else { //Everything else
                                    salesRep = 668712; //Belinda Urbani
                                }
                            }
                        } else if (!isNullorEmpty(zee_id) && zeeCount == 1) {
                            customerRecord.setValue({
                                fieldId: 'partner',
                                value: zee_id,
                            });

                            var partnerRecord = record.load({
                                type: record.Type.PARTNER,
                                id: zee_id
                            });

                            var salesRep = partnerRecord.getValue({
                                fieldId: 'custentity_sales_rep_assigned'
                            });

                        }
                        log.debug({
                            title: 'salesRep',
                            details: salesRep
                        })

                        log.debug({
                            title: 'leadSource',
                            details: leadSource
                        })

                        log.debug({
                            title: 'role',
                            details: role
                        })

                        customerRecord.setValue({
                            fieldId: 'custentity_mp_toll_salesrep',
                            value: salesRep, //MailPlus Pty Ltd
                        });

                        customerRecord.save({
                            ignoreMandatoryFields: true
                        });

                        if (salesRep == 668712) {
                            salesRepEmail = 'belinda.urbani@mailplus.com.au';
                            salesRepName = 'Belinda Urbani';
                        } else if (salesRep == 696160) {
                            salesRepEmail = 'kerina.helliwell@mailplus.com.au'
                            salesRepName = 'Kerina Helliwell';
                        } else if (salesRep == 668711) {
                            salesRepEmail = 'lee.russell@mailplus.com.au';
                            salesRepName = 'Lee Russell';
                        }

                        if (role != 1032) {
                            if (leadSource == 282051) {
                                var salesRecord = record.create({
                                    type: 'customrecord_sales'
                                });

                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_customer',
                                    value: customerInternalId,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_campaign',
                                    value: 69,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_assigned',
                                    value: salesRep,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_outcome',
                                    value: 20,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_callbackdate',
                                    value: date_now,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_callbacktime',
                                    value: time_now,
                                })

                                salesRecord.save({
                                    ignoreMandatoryFields: true
                                });

                                var subject = 'Sales LPO - Head Office Generated - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New sales record has been created. \n A LPO Lead has been entered into the System. Please respond in an hour. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: salesRepEmail,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'ankith.ravindran@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });

                            } else if (leadSource == 282094) {

                                var subject = 'Sales Coordinator Head Office Generated - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system by Sales Coordinator. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: salesRepEmail,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'belinda.urbani@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            } else if(leadSource == 282051){
                                var subject = 'Sales Head Office Generated - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system by Head Office. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: ['matthew.rajabi@mailplus.com.au'],
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', salesRepEmail],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            } else if(leadSource == -4){
                                var subject = 'Sales HOT Lead - Franchisee Generated - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system by Franchisee. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: salesRepEmail,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'belinda.urbani@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            } else {
                                var subject = 'Sales HOT Lead - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: salesRepEmail,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'belinda.urbani@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            }
                        }
                    }
                }
            }
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