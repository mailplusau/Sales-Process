/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * 
 * Module Description
 * 
 * @Last Modified by:   Sruti Desai
 * 
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


            var prospectQuoteSent48hEmailSearch = search.load({
                id: 'customsearch_web_leads_prosp_quote_sen_2',
                type: 'prospect',
            });

            var count = prospectQuoteSent48hEmailSearch.runPaged().count;

            log.debug({
                title: 'count',
                details: count
            });
            sendEmails(prospectQuoteSent48hEmailSearch);

        }

        function sendEmails(prospectQuoteSent48hEmailSearch) {

            prospectQuoteSent48hEmailSearch.run().each(function (searchResult) {

                var customer_id = searchResult.getValue('internalid');
                var salesrecord_id = searchResult.getValue({
                    name: "internalid",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });
                var contact_id = searchResult.getValue({
                    name: "internalid",
                    join: "contact"
                });

                var contact_email = searchResult.getValue({
                    name: "email",
                    join: "contact"
                });

                var salesRep_id = searchResult.getValue({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });
                var salesRep_Text = searchResult.getText({
                    name: "custrecord_sales_assigned",
                    join: "CUSTRECORD_SALES_CUSTOMER"
                });

                var suiteletUrl = url.resolveScript({
                    scriptId: 'customscript_merge_email',
                    deploymentId: 'customdeploy_merge_email',
                    returnExternalUrl: true
                });

                suiteletUrl += '&rectype=customer&template=152';
                suiteletUrl += '&recid=' + customer_id + '&salesrep=' + salesRep_id + '&dear=' + '' + '&contactid=' + contact_id + '&userid=' + salesRep_id;

                log.debug({
                    title: 'suiteletUrl',
                    details: suiteletUrl
                });

                var response = https.get({
                    url: suiteletUrl
                });

                var emailHtml = response.body;
                var subject = 'Create your free MailPlus account now!'

                if (!isNullorEmpty(customer_id)) {
                    email.send({
                        author: 112209,
                        body: emailHtml,
                        recipients: contact_email,
                        subject: subject,
                        relatedRecords: { entityId: customer_id }
                    });

                    var customer_record = record.load({
                        type: record.Type.CUSTOMER,
                        id: customer_id,
                        isDynamic: true
                    });

                    customer_record.setValue({
                        fieldId: 'custentity_48h_email_sent',
                        value: 1
                    });

                    var customerRecordId = customer_record.save({
                        ignoreMandatoryFields: true
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