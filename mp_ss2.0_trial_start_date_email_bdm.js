/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript

 * Author:               Ankith Ravindran
 * Created on:           Tue May 21 2024
 * Modified on:          Tue May 21 2024 13:43:41
 * SuiteScript Version:  2.0 
 * Description:         Email to BDM, 1 week after the free trial has begun. 
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

            // NetSuite Search: Free Trail List - On Day of Free Trial - Email to BDM
            var freeTrialStartDateEmailBDMSearch = search.load({
                id: 'customsearch_trial_start_date_email_bdm',
                type: 'customer',
            });

            var count = freeTrialStartDateEmailBDMSearch.runPaged().count;

            log.debug({
                title: 'count',
                details: count
            });
            sendEmails(freeTrialStartDateEmailBDMSearch);

        }

        function sendEmails(freeTrialStartDateEmailBDMSearch) {

            freeTrialStartDateEmailBDMSearch.run().each(function (searchResult) {

                var customer_id = searchResult.getValue('internalid');
                var entityId = searchResult.getValue({
                    name: "entityid",
                });
                var companyName = searchResult.getValue({
                    name: "companyname",
                });

                // var commDate = searchResult.getValue({
                //     name: "custrecord_comm_date",
                //     join: "CUSTRECORD_CUSTOMER",
                // });

                var salesRecordInternalId = searchResult.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });
                var salesRep_id = searchResult.getValue({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });
                var zeeId = searchResult.getValue({
                    name: "partner",
                });
                var zeeName = searchResult.getText({
                    name: "partner",
                });
                // var tncAgreed = searchResult.getValue({
                //     name: "custentity_terms_conditions_agree_date",
                // });
                // var zeeVisited = searchResult.getValue({
                //     name: "custentity_mp_toll_zeevisit_memo",
                // });
                // var lpoCommsToCustomer = searchResult.getValue({
                //     name: "custentity_lpo_comms_to_customer",
                // });


                var subject = zeeName + ' Franchisee not visited Customer - ' + entityId + ' ' + companyName;
                var emailBody = 'The below Franchisee has not made contact or visited the customer. Please contact the franchisee and restart the Free Trial.\n';
                emailBody += 'Franchisee: ' + zeeName + '\n'
                emailBody += 'Customer Name: ' + entityId + ' ' + companyName + '\n';
                emailBody += 'Call Center: <a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + customer_id + '&sales_record_id=' + salesRecordInternalId + '">Link to Call Center Page</a>'

                if (!isNullorEmpty(customer_id)) {
                    email.send({
                        author: 112209,
                        body: emailHtml,
                        recipients: salesRep_id,
                        subject: subject,
                        cc: ['ankith.ravindran@mailplus.com.au', 'luke.forbes@mailplus.com.au'],
                        relatedRecords: { entityId: customer_id }
                    });
                }

                return true;
            });


            log.debug({
                title: 'Emails Sent Out',
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