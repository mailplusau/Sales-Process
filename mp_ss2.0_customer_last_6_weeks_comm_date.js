/**
 *@NApiVersion 2.x
 *@NScriptType ScheduledScript
 */

define(['N/email', 'N/runtime', 'N/search', 'N/record'],
    function(email, runtime, search, record) {
        function execute(context) {
            log.audit({
                title: 'InvocationType',
                details: context.InvocationType
            });
            log.audit({
                title: 'context.type',
                details: context.type
            });

            var customerLast6WeeksSearch = search.load({
                id: 'customsearch_customer_last_6_weeks'
            });

            customerLast6WeeksSearch.run().each(function(result) {
                var customerInternalId = result.getValue({
                    name: 'internalid'
                });

                var customerId = result.getValue({
                    name: 'entityid'
                });

                var customerName = result.getValue({
                    name: 'companyname'
                });

                var customerZee = result.getValue({
                    name: 'partner'
                });

                var customerState = result.getValue({
                    name: 'internalid',
                    join: 'partner'
                });

                var commDate = result.getValue({
                    name: 'internalid',
                    join: 'CUSTRECORD_CUSTOMER'
                });

                var signUpDate = result.getValue({
                    name: 'internalid',
                    join: 'CUSTRECORD_CUSTOMER'
                });

                var salesRep = result.getValue({
                    name: 'custrecord_salesrep',
                    join: 'CUSTRECORD_CUSTOMER'
                });


                var customerLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=858&deploy=1&compid=1048144&unlayered=T&custparam_params={%22custid%22%3A' + customerInternalId + '%2C%22scriptid%22%3A%22customscript_sl_customer_list%22%2C%22deployid%22%3A%22customdeploy_sl_customer_list%22}&sorts[weekused]=-1';

                var subject = 'MailPlus Service Call & Referral Program'
                var emailBody = 'Dear Account Manager,\n\nPlease review customers 6 weeks MPEX usage. Place a customer service call, offer referral program and obtain a review if possible.\n';

                emailBody += 'LINK: ' + customerLink;

                emailBody += 'Note: If above link not clickable, please copy and paste in browser.'

                log.audit({
                    title: 'Subject',
                    details: subject
                });
                log.audit({
                    title: 'Email Body',
                    details: emailBody
                });
                log.audit({
                    title: 'Customer Internal ID',
                    details: customerInternalId
                });
                log.audit({
                    title: 'Sales Rep',
                    details: salesRep
                });

                email.send({
                    author: 112209,
                    recipients: salesRep,
                    subject: subject,
                    body: emailBody
                });

                var customerRecord = record.load({
                    type: record.Type.CUSTOMER,
                    id: customerInternalId
                });

                customerRecord.setValue({
                    fieldId: 'custentity_referral_program',
                    value: 1
                });

                customerRecord.save();

                return true;
            });
        }
        return {
            execute: execute
        };
    }
);