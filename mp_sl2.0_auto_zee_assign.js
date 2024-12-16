/** 
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * 
 * Author:               Ankith Ravindran
 * Created on:           Thu Oct 12 2023
 * Modified on:          2024-08-07T22:17:58.880Z
 * SuiteScript Version:  2.0 
 * Description:          Auto assigning the franchisee to a lead depending on the suburb/state/postcode and then creating a sales record assigning to a campaign depending on the source of the lead. 
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

            var lpoLeadBDMAssigned = null;

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
                //Campaign ID
                var campaignid = context.request.parameters.campaignid;
                //Sales Rep to be Assigned
                var salesrepid = context.request.parameters.salesrepid;
                role = context.request.parameters.role;

                //* Get the Lead Internal ID passed through to this Suitelet
                log.debug({
                    title: 'customerInternalId',
                    details: customerInternalId
                })

                log.debug({
                    title: 'salesrepid',
                    details: salesrepid
                })

                var zee_id;
                var zeeCount = 0;
                var salesRep;
                var siteAddressZipCode = null;
                var siteAddressSuburb = null;
                var siteAddressState = null;
                var salesRepEmail = null;
                var salesRepName = null;

                //*Find the postcode for the customer
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

                //?DEBUG DATA
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

                var parentLPO = null;
                var parentLPOCount = 0;

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



                if (role != 1032) {
                    if (!isNullorEmpty(siteAddressZipCode) && !isNullorEmpty(siteAddressSuburb) && !isNullorEmpty(siteAddressState)) {
                        if (leadSource != -4) {
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
                            //If lead source is LPO - Head Office Generated, use the Australia Post Suburb Mapping JSON to check the suburb is services by the franchisee or not.
                            if (leadSource == 282051) {
                                zeeNetworkMatrixSearch.filters.push(search.createFilter({
                                    name: 'custentity_ap_suburbs_json',
                                    join: null,
                                    operator: search.Operator.CONTAINS,
                                    values: siteAddressSuburb
                                }));
                                zeeNetworkMatrixSearch.filters.push(search.createFilter({
                                    name: 'custentity_ap_suburbs_json',
                                    join: null,
                                    operator: search.Operator.CONTAINS,
                                    values: siteAddressState
                                }));
                                zeeNetworkMatrixSearch.filters.push(search.createFilter({
                                    name: 'custentity_ap_suburbs_json',
                                    join: null,
                                    operator: search.Operator.CONTAINS,
                                    values: siteAddressZipCode
                                }));
                            } else {
                                //Else check the Franchisee Territory JSON field to check if the suburb is being serviced by the franchisee or not. 
                                zeeNetworkMatrixSearch.filters.push(search.createFilter({
                                    name: 'custentity_zee_territory_json',
                                    join: null,
                                    operator: search.Operator.CONTAINS,
                                    values: siteAddressSuburb
                                }));
                                zeeNetworkMatrixSearch.filters.push(search.createFilter({
                                    name: 'custentity_zee_territory_json',
                                    join: null,
                                    operator: search.Operator.CONTAINS,
                                    values: siteAddressState
                                }));
                                zeeNetworkMatrixSearch.filters.push(search.createFilter({
                                    name: 'custentity_zee_territory_json',
                                    join: null,
                                    operator: search.Operator.CONTAINS,
                                    values: siteAddressZipCode
                                }));
                            }

                            log.debug({
                                title: 'zeeNetworkMatrixSearch.filters',
                                details: zeeNetworkMatrixSearch.filters
                            })

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

                            log.debug({
                                title: 'zeeCount',
                                details: zeeCount
                            })

                            log.debug({
                                title: 'zee_name',
                                details: zee_name
                            })

                            if (isNullorEmpty(zee_id) || zeeCount > 1) {
                                if (leadSource != -4) {
                                    customerRecord.setValue({
                                        fieldId: 'partner',
                                        value: 435, //MailPlus Pty Ltd
                                    });

                                    zee_id = 435;
                                }
                                if (isNullorEmpty(salesrepid)) {
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
                                } else {
                                    salesRep = salesrepid
                                }

                            } else if (!isNullorEmpty(zee_id) && zeeCount == 1) {
                                var partnerRecord = record.load({
                                    type: record.Type.PARTNER,
                                    id: zee_id
                                });

                                var lpoSuburbMappingJSON = partnerRecord.getValue({
                                    fieldId: 'custentity_ap_suburbs_json'
                                });

                                if (role != 1032) {
                                    if (leadSource == 282051 || campaignid == 69 || campaignid == 76) {
                                        //Lead Source: LPO - Head Office Generated

                                        //Search: Active Parent LPO Customer List
                                        var parentLPOListSearch = search.load({
                                            type: 'customer',
                                            id: 'customsearch_parent_lpo_customers'
                                        });

                                        parentLPOListSearch.filters.push(search.createFilter({
                                            name: 'custentity_lpo_linked_franchisees',
                                            join: null,
                                            operator: search.Operator.ANYOF,
                                            values: zee_id
                                        }));

                                        parentLPOListSearch.run().each(function (
                                            parentLPOListSearchResultSet) {

                                            parentLPO = parentLPOListSearchResultSet.getValue({
                                                name: "internalid",
                                                summary: "GROUP"
                                            });

                                            lpoLeadBDMAssigned = parentLPOListSearchResultSet.getValue({
                                                name: "custrecord_lpo_sales_rep",
                                                join: "CUSTRECORD_LPO_LEAD_CUSTOMER",
                                                summary: "GROUP",
                                            });

                                            // if (isNullorEmpty(lpoLeadBDMAssigned)) {
                                            //     lpoLeadBDMAssigned = 653718
                                            // }

                                            parentLPOCount++;
                                            return true;
                                        });

                                        log.debug({
                                            title: 'LPO - Head Office Generated - lpoLeadBDMAssigned',
                                            details: lpoLeadBDMAssigned
                                        })

                                        log.debug({
                                            title: 'LPO - Head Office Generated - parentLPOCount',
                                            details: parentLPOCount
                                        })
                                        log.debug({
                                            title: 'LPO - Head Office Generated - parentLPO',
                                            details: parentLPO
                                        })

                                        if (parentLPOCount == 1) {
                                            customerRecord.setValue({
                                                fieldId: 'custentity_lpo_parent_account',
                                                value: parentLPO,
                                            });

                                            if (isNullorEmpty(lpoLeadBDMAssigned)) {
                                                salesRep = salesrepid
                                            } else {
                                                salesRep = lpoLeadBDMAssigned
                                            }


                                            // customerRecord.setValue({
                                            //     fieldId: 'entitystatus',
                                            //     value: 42,
                                            // });
                                        } else {
                                            salesRep = salesrepid
                                            log.debug({
                                                title: 'LPO - Head Office Generated - lpoSuburbMappingJSON',
                                                details: lpoSuburbMappingJSON
                                            })
                                            if (!isNullorEmpty(lpoSuburbMappingJSON)) {
                                                lpoSuburbMappingJSON = JSON.parse(lpoSuburbMappingJSON);
                                                log.debug({
                                                    title: 'LPO - Head Office Generated - lpoSuburbMappingJSON.hasOwnProperty(parent_lpo_id)',
                                                    details: lpoSuburbMappingJSON.hasOwnProperty('parent_lpo_id')
                                                })

                                                lpoSuburbMappingJSON.forEach(function (suburb) {
                                                    if (!isNullorEmpty(suburb.parent_lpo_id)) {
                                                        if (siteAddressSuburb.toLowerCase() == suburb.suburbs.toLowerCase() && siteAddressZipCode == suburb.post_code) {
                                                            customerRecord.setValue({
                                                                fieldId: 'custentity_lpo_parent_account',
                                                                value: parseInt(suburb.parent_lpo_id),
                                                            });
                                                            // customerRecord.setValue({
                                                            //     fieldId: 'entitystatus',
                                                            //     value: 42,
                                                            // });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    } else {
                                        if (isNullorEmpty(salesrepid)) {
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
                                        } else {
                                            salesRep = salesrepid
                                        }
                                        if (leadSource == -4) {
                                            customerRecord.setValue({
                                                fieldId: 'entitystatus',
                                                value: 38,
                                            });
                                        }
                                    }
                                }

                                customerRecord.setValue({
                                    fieldId: 'partner',
                                    value: zee_id,
                                });
                                // var salesRep = partnerRecord.getValue({
                                //     fieldId: 'custentity_sales_rep_assigned'
                                // });
                            }
                        }


                        //?DEBUG DATA
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

                        var newCustomerRecordId = customerRecord.save({
                            ignoreMandatoryFields: true
                        });

                        var newCustomerRecord = record.load({
                            type: record.Type.CUSTOMER,
                            id: newCustomerRecordId,
                            isDynamic: true
                        });
                        var zee_text = newCustomerRecord.getText({
                            fieldId: 'partner'
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
                            //Update 2024-08-01T01:58:55.342Z - LPO - Head Office Generated no longer a lead source.
                            // if (leadSource == 282051) {
                            //     //Lead Source: LPO - Head Office Generated

                            //     /*
                            //     Create Sales Record
                            //     Assign to BDM select via the LPO Profiler Page depending on the franchisee
                            //     Assign to LPO
                            //      */
                            //     var salesRecord = record.create({
                            //         type: 'customrecord_sales'
                            //     });

                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_customer',
                            //         value: customerInternalId,
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_campaign',
                            //         value: 69, //LPO
                            //     })

                            //     if (!isNullorEmpty(lpoLeadBDMAssigned)) {
                            //         salesRecord.setValue({
                            //             fieldId: 'custrecord_sales_assigned',
                            //             value: lpoLeadBDMAssigned,
                            //         })
                            //     } else {
                            //         salesRecord.setValue({
                            //             fieldId: 'custrecord_sales_assigned',
                            //             value: userId,
                            //         })
                            //     }

                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_outcome',
                            //         value: 20,
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_callbackdate',
                            //         value: date_now,
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_callbacktime',
                            //         value: time_now,
                            //     })

                            //     salesRecord.save({
                            //         ignoreMandatoryFields: true
                            //     });
                            // } 
                            //Update 2024-08-01T01:59:27.724Z - Lead Source: Sales Coordinator Generated no longer a lead source.
                            // if (leadSource == 282094) {
                            //     //Lead Source: Sales Coordinator Generated

                            //     /*
                            //     Create Sales Record
                            //     Assign to Sales Rep depending on the franchisee
                            //     Assign to Field Sales
                            //      */
                            //     var salesRecord = record.create({
                            //         type: 'customrecord_sales'
                            //     });

                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_customer',
                            //         value: customerInternalId,
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_campaign',
                            //         value: 62, //Field Sales
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_assigned',
                            //         value: salesRep, // Assign to Sales Rep
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_outcome',
                            //         value: 20,
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_callbackdate',
                            //         value: date_now,
                            //     })
                            //     salesRecord.setValue({
                            //         fieldId: 'custrecord_sales_callbacktime',
                            //         value: time_now,
                            //     })

                            //     salesRecord.save({
                            //         ignoreMandatoryFields: true
                            //     });

                            //     var subject = 'Sales Coordinator Head Office Generated - ' + entity_id + ' ' + customer_name;
                            //     var cust_id_link =
                            //         'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                            //         customerInternalId;
                            //     var body =
                            //         'New lead entered into the system by Sales Coordinator. \n Customer Name: ' +
                            //         entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link + '\nFranchisee: ' + zee_text;

                            //     email.send({
                            //         author: 112209,
                            //         body: body,
                            //         recipients: salesRepEmail, // Email to Sales Rep
                            //         subject: subject,
                            //         cc: ['luke.forbes@mailplus.com.au', 'belinda.urbani@mailplus.com.au'],
                            //         relatedRecords: { entityId: customerInternalId }
                            //     });
                            // } 

                            if (leadSource == 97943 || leadSource == 295896) {

                                //Lead Source: Head Office Generated

                                //Update 2024-08-01T01:54:36.751Z - Lead Entered by HO, the user will need to select the Campaign & Sales Rep from the Prospect Capture Form itself

                                /* 
                                Create Sales Record
                                Assign to Sales Rep selected in the Prospect Capture Form
                                Assign to Campaign selected in the Prospect Capture Form
                                 */
                                var salesRecord = record.create({
                                    type: 'customrecord_sales'
                                });

                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_customer',
                                    value: customerInternalId,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_campaign',
                                    value: campaignid, //Allocate to the campaign the user has selected from the Prospect Capture Form
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_assigned',
                                    value: salesRep, //Assign to the Sales Rep selected from the Prospect Capture Form
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
                                    recipients: salesRep,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'lee.russell@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            } else if (leadSource == -4) {
                                //Lead Source: Franchisee Generated 

                                /* 
                                Create Sales Record
                                Assign to Liam depending on the franchisee
                                Assign to Franchisee Generated
                                 */
                                var salesRecord = record.create({
                                    type: 'customrecord_sales'
                                });

                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_customer',
                                    value: customerInternalId,
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_campaign',
                                    value: 70, // Franchisee Generated
                                })
                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_assigned',
                                    value: 1623053, //Assign to Aleyna
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

                                var subject = 'Sales HOT Lead - ' + zee_text + ' Franchisee Generated - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system by Franchisee. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link + '\nFranchisee: ' + zee_text;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: 1809382,
                                    subject: subject,
                                    cc: ['aleyna.harnett@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            } else if (leadSource == 285297) {

                                //Lead Source: Inbound - Head Office Generated

                                /* 
                                Create Sales Record
                                Assign to Sales Rep depending on the franchisee
                                Assign to Field Sales
                                 */
                                var salesRecord = record.create({
                                    type: 'customrecord_sales'
                                });

                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_customer',
                                    value: customerInternalId,
                                })
                                if (isNullorEmpty(campaignid)) {
                                    salesRecord.setValue({
                                        fieldId: 'custrecord_sales_campaign',
                                        value: 62, //Field Sales
                                    })
                                } else {
                                    salesRecord.setValue({
                                        fieldId: 'custrecord_sales_campaign',
                                        value: campaignid, //Assign to the campaign selected from the Prospect Capture Page
                                    })
                                }

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

                                var subject = 'Sales Head Office Generated - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system by Head Office. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link + '\nFranchisee: ' + zee_text;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: salesRep,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'lee.russell@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            } else {

                                /* 
                                Create Sales Record
                                Assign to Sales Rep depending on the franchisee
                                Assign to Digital Lead Campaign 
                                 */
                                var salesRecord = record.create({
                                    type: 'customrecord_sales'
                                });

                                salesRecord.setValue({
                                    fieldId: 'custrecord_sales_customer',
                                    value: customerInternalId,
                                })
                                if (isNullorEmpty(campaignid)) {
                                    salesRecord.setValue({
                                        fieldId: 'custrecord_sales_campaign',
                                        value: 67, //Digital Lead Campaign
                                    })
                                } else {
                                    salesRecord.setValue({
                                        fieldId: 'custrecord_sales_campaign',
                                        value: campaignid, //Assign to campaign selected from the Prospect Capture Paage
                                    })
                                }

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

                                var subject = 'Sales HOT Lead - ' + entity_id + ' ' + customer_name;
                                var cust_id_link =
                                    'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
                                    customerInternalId;
                                var body =
                                    'New lead entered into the system. \n Customer Name: ' +
                                    entity_id + ' ' + customer_name + '\nLink: ' + cust_id_link + '\nFranchisee: ' + zee_text;

                                email.send({
                                    author: 112209,
                                    body: body,
                                    recipients: salesRep,
                                    subject: subject,
                                    cc: ['luke.forbes@mailplus.com.au', 'lee.russell@mailplus.com.au'],
                                    relatedRecords: { entityId: customerInternalId }
                                });
                            }
                        }
                    }
                }
            }
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