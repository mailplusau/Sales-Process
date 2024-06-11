/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript

 * Author:               Ankith Ravindran
 * Created on:           Tue May 21 2024
 * Modified on:          Tue May 21 2024 13:43:41
 * SuiteScript Version:  2.0 
 * Description:          Email to be sent out to the frasnchisee, notifying them that Free Trial is starting tomorrow.  
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

            //NetSuite Search: Free Trial Pending List - Trial Starting Tomorrow - Email Franchisee
            var freeTrialPendingEmailZeeSearch = search.load({
                id: 'customsearch_trial_pending_email_zee',
                type: 'customer',
            });

            var count = freeTrialPendingEmailZeeSearch.runPaged().count;

            log.debug({
                title: 'count',
                details: count
            });
            sendEmails(freeTrialPendingEmailZeeSearch);

        }

        function sendEmails(freeTrialPendingEmailZeeSearch) {

            freeTrialPendingEmailZeeSearch.run().each(function (searchResult) {

                var customer_id = searchResult.getValue('internalid');
                var commReg = searchResult.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_CUSTOMER",
                });
                var contact_id = searchResult.getValue({
                    name: "internalid",
                    join: "contact"
                });

                var commDate = searchResult.getValue({
                    name: "custrecord_comm_date",
                    join: "CUSTRECORD_CUSTOMER",
                });

                var salesRep_id = searchResult.getValue({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });
                var trialExpiryDate = searchResult.getValue({
                    name: "custrecord_trial_expiry",
                    join: "CUSTRECORD_CUSTOMER",
                });
                var zeeId = searchResult.getValue({
                    name: "partner",
                });

                var suiteletUrl = url.resolveScript({
                    scriptId: 'customscript_merge_email',
                    deploymentId: 'customdeploy_merge_email',
                    returnExternalUrl: true
                });

                var billingStartdate;
                var formattedBillingStartToday;

                trial_end_date_split = trialExpiryDate.split('/');
                billingStartdate = new Date(trial_end_date_split[2], trial_end_date_split[1], trial_end_date_split[0]);
                billingStartdate.setDate(billingStartdate.getDate() + 1)

                var yyyy = billingStartdate.getFullYear();
                var mm = billingStartdate.getMonth() + 1; // Months start at 0!
                var dd = billingStartdate.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                formattedBillingStartToday = dd + '/' + mm + '/' + yyyy;

                suiteletUrl += '&rectype=customer&template=199';
                suiteletUrl += '&recid=' + customer_id + '&salesrep=' + salesRep_id + '&dear=' + '' + '&contactid=' + contact_id + '&userid=' + salesRep_id + '&commdate=' + commDate + '&trialenddate=' + trialExpiryDate + '&commreg=' + commReg + '&billingstartdate=' + formattedBillingStartToday;

                log.debug({
                    title: 'suiteletUrl',
                    details: suiteletUrl
                });

                var response = https.get({
                    url: suiteletUrl
                });

                var emailHtml = response.body;
                var subject = 'Action required: You have a new customer starting tomorrow!'

                if (!isNullorEmpty(customer_id)) {
                    email.send({
                        author: 112209,
                        body: emailHtml,
                        recipients: zeeId,
                        subject: subject,
                        cc: ['ankith.ravindran@mailplus.com.au'],
                        relatedRecords: { entityId: customer_id }
                    });

                    // var customer_record = record.load({
                    //     type: record.Type.CUSTOMER,
                    //     id: customer_id,
                    //     isDynamic: true
                    // });

                    // customer_record.setValue({
                    //     fieldId: 'custentity_48h_email_sent',
                    //     value: 1
                    // });

                    // var customerRecordId = customer_record.save({
                    //     ignoreMandatoryFields: true
                    // });

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