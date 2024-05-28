/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript

 * Author:               Ankith Ravindran
 * Created on:           Tue May 21 2024
 * Modified on:          Tue May 21 2024 13:43:41
 * SuiteScript Version:  2.0 
 * Description:          EEmail to the BDM, 48 hours after the Free Trial has been signed up. 
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

            // NetSuite Search: Free Trial Pending List - 48 Hour - Email BDM
            var freeTrialPendingEmailBDMSearch = search.load({
                id: 'customsearch_trial_pending_email_bdm',
                type: 'customer',
            });

            var count = freeTrialPendingEmailBDMSearch.runPaged().count;

            log.debug({
                title: 'count',
                details: count
            });
            sendEmails(freeTrialPendingEmailBDMSearch);

        }

        function sendEmails(freeTrialPendingEmailBDMSearch) {

            freeTrialPendingEmailBDMSearch.run().each(function (searchResult) {

                var customer_id = searchResult.getValue('internalid');
                var entityId = searchResult.getValue({
                    name: "entityid",
                });
                var companyName = searchResult.getValue({
                    name: "companyname",
                });

                var commDate = searchResult.getValue({
                    name: "custrecord_comm_date",
                    join: "CUSTRECORD_CUSTOMER",
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
                var tncAgreed = searchResult.getValue({
                    name: "custentity_terms_conditions_agree_date",
                });
                var zeeVisited = searchResult.getValue({
                    name: "custentity_mp_toll_zeevisit_memo",
                });
                var lpoCommsToCustomer = searchResult.getValue({
                    name: "custentity_lpo_comms_to_customer",
                });

                var subject = '48 Hour after Trial Sign Up - ' + entityId + ' ' + companyName;
                var emailBody = 'The below customer was signed up for Free Trial, 2 days back.</br></br>';
                emailBody += 'Customer Name: ' + entityId + ' ' + companyName + '</br>'
                emailBody += 'Franchisee: ' + zeeName + '</br>'
                emailBody += 'Trial Start Date: ' + commDate + '</br>'
                emailBody += 'Below are the details that are completed/not completed before the Trial can start</br>'
                if (isNullorEmpty(lpoCommsToCustomer) || lpoCommsToCustomer == 2) {
                    emailBody += 'LPO Comms to Customer: NO</br>'
                } else {
                    emailBody += 'LPO Comms to Customer: YES</br>'
                }

                if (isNullorEmpty(tncAgreed) || tncAgreed == 2) {
                    emailBody += 'T&C\'s Agreed by Customer: NO</br>'
                } else {
                    emailBody += 'T&C\'s Agreed by Customer: YES</br>'
                }

                if (isNullorEmpty(zeeVisited) || zeeVisited == 2) {
                    emailBody += 'Franchisee Visited: NO</br>'
                } else {
                    emailBody += 'Franchisee Visited: YES</br>'
                }

                emailBody += '</br>Please note, once the above 3 conditions have been met, the lead will automatically moved to status "CUSTOMER - FREE TRIAL".</br>If the above 3 conditions have been met after the trial date that had been setup, please go back into the Call Center page and restart the trial with new dates.'

                if (!isNullorEmpty(customer_id)) {
                    email.send({
                        author: 112209,
                        body: emailBody,
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