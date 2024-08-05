/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript

 * Author:               Ankith Ravindran
 * Created on:           Tue May 21 2024
 * Modified on:          Tue May 21 2024 13:43:41
 * SuiteScript Version:  2.0 
 * Description:          Task to move the Free Trial Pending to Signed, if the lead needs access to the customer portal.
 * 
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */


define(['N/runtime', 'N/search', 'N/record', 'N/log', 'N/task', 'N/currentRecord', 'N/format', 'N/https', 'N/email', 'N/url'],
    function (runtime, search, record, log, task, currentRecord, format, https, email, url) {
        var zee = 0;
        var role = runtime.getCurrentUser().role;

        var baseURL = 'https://1048144.app.netsuite.com';
        if (runtime.envType == "SANDBOX") {
            baseURL = 'https://system.sandbox.netsuite.com';
        }

        function main() {

            var today = new Date();
            today.setHours(today.getHours() + 17);

            // 	Search: Lead list - Free Trial Pending to Signed
            var custListTrialPendingToSignedSearch = search.load({
                type: 'customer',
                id: 'customsearch_cust_list_pending_signed'
            });

            custListTrialPendingToSignedSearch.run().each(function (searchResultSet) {

                //Customer Inbternal ID
                var custInternalID = searchResultSet.getValue({
                    name: 'internalid'
                });

                //Customer Entity ID
                var custEntityID = searchResultSet.getValue({
                    name: 'entityid'
                });

                //Customer Company Name
                var custName = searchResultSet.getValue({
                    name: 'companyname'
                });

                //Customer Franchisee Internal ID
                var zeeID = searchResultSet.getValue({
                    name: 'partner'
                });

                var customerRecord = record.load({
                    type: 'customer',
                    id: parseInt(custInternalID)
                });

                customerRecord.setValue({
                    fieldId: 'entitystatus',
                    value: 13
                });

                customerRecord.save();

                var customerJSON = '{';
                customerJSON += '"ns_id" : "' + custInternalID + '"';
                customerJSON += '}';

                var apiHeaders = {};
                headers['Content-Type'] = 'application/json';
                headers['Accept'] = 'application/json';
                headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';

                https.post({
                    url: 'https://mpns.protechly.com/new_customer',
                    body: customerJSON,
                    headers: apiHeaders
                });

                // Search: SALESP - Portal Contacts
                var contactSearch = search.load({
                    id: 'customsearch_salesp_contacts_2',
                    type: 'contact'
                });

                contactSearch.filters.push(search.createFilter({
                    name: 'internalid',
                    join: 'CUSTOMER',
                    operator: search.Operator.ANYOF,
                    values: customerId
                }));

                contactSearch.filters.push(search.createFilter({
                    name: 'isinactive',
                    operator: search.Operator.IS,
                    values: false
                }));

                var contactCount = 0;

                contactSearch.run().each(function (contactSearchResultSet) {

                    var contactFirstName = contactSearchResultSet.getValue({
                        name: 'firstname'
                    });
                    var contactLastName = contactSearchResultSet.getValue({
                        name: 'lastname'
                    });
                    var contactEmail = contactSearchResultSet.getValue({
                        name: 'email'
                    });
                    var contactPhone = contactSearchResultSet.getValue({
                        name: 'phone'
                    });

                    var userJSON = '{';
                    userJSON += '"customer_ns_id" : "' + custInternalID + '",';
                    userJSON += '"first_name" : "' + contactFirstName + '",';
                    userJSON += '"last_name" : "' + contactLastName + '",';
                    userJSON += '"email" : "' + contactEmail + '",';
                    userJSON += '"phone" : "' + contactPhone + '"';
                    userJSON += '}';

                    https.post({
                        url: 'https://mpns.protechly.com/new_staff',
                        body: userJSON,
                        headers: apiHeaders
                    });

                    contactCount++;
                    return true;
                });

                return true;
            });


        }

        function isNullorEmpty(strVal) {
            return (strVal == null || strVal == '' || strVal == 'null' || strVal == undefined || strVal == 'undefined' || strVal == '- None -');
        }

        return {
            execute: main
        }
    }
);