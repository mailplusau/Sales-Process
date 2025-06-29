/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript

 * Author:               Ankith Ravindran
 * Created on:           Fri May 23 2025
 * Modified on:          2025-05-25 08:30:16
 * SuiteScript Version:  2.0 
 * Description:          Email to be sent out to the lead when a lead creates a shipmment and there is a lodgemebnt/pickup scan during the demo call
 *
 * Copyright (c) 2025 MailPlus Pty. Ltd.
 */



define([
    "N/runtime",
    "N/search",
    "N/record",
    "N/log",
    "N/task",
    "N/currentRecord",
    "N/format",
    "N/https",
    "N/email",
    "N/url",
], function (
    runtime,
    search,
    record,
    log,
    task,
    currentRecord,
    format,
    https,
    email,
    url
) {
    var zee = 0;
    var role = runtime.getCurrentUser().role;

    var baseURL = "https://1048144.app.netsuite.com";
    if (runtime.envType == "SANDBOX") {
        baseURL = "https://system.sandbox.netsuite.com";
    }

    function main() {
        var today = new Date();
        today.setHours(today.getHours() + 17);

        // NetSuite Search: First Lodgement Scan - Customer ShipMate Pending
        var demoShipMateLead1stLodgementSearch = search.load({
            id: "customsearch_1st_lodge_shipmate_pending",
            type: "customrecord_customer_product_stock",
        });

        var count = demoShipMateLead1stLodgementSearch.runPaged().count;

        log.debug({
            title: "count",
            details: count,
        });
        sendEmails(demoShipMateLead1stLodgementSearch);
    }

    function sendEmails(demoShipMateLead1stLodgementSearch) {

        var oldCustomerInternalID = null;
        var oldCustomerEmail = null;
        var oldCustomerAccountManager = null;
        var barcodeCount = 0;

        demoShipMateLead1stLodgementSearch.run().each(function (searchResult) {
            var customerInternalID = searchResult.getValue({
                name: "internalid",
                join: "CUSTRECORD_CUST_PROD_STOCK_CUSTOMER",
            });
            var customerEmail = searchResult.getValue({
                name: "email",
                join: "CUSTRECORD_CUST_PROD_STOCK_CUSTOMER",
            });
            var customerAccountManager = searchResult.getValue({
                name: "custentity_mp_toll_salesrep",
                join: "CUSTRECORD_CUST_PROD_STOCK_CUSTOMER",
            });
            var operatorName = searchResult.getText("custrecord_cust_prod_stock_operator");

            if (oldCustomerInternalID != null && oldCustomerInternalID != customerInternalID) {
                // NetSuite Search: SALESP - Contacts
                var searched_contacts = search.load({
                    id: "customsearch_salesp_contacts",
                    type: "contact",
                });

                searched_contacts.filters.push(
                    search.createFilter({
                        name: "internalid",
                        join: "CUSTOMER",
                        operator: search.Operator.ANYOF,
                        values: oldCustomerInternalID,
                    })
                );

                searched_contacts.filters.push(
                    search.createFilter({
                        name: "isinactive",
                        operator: search.Operator.IS,
                        values: false,
                    })
                );

                resultSetContacts = searched_contacts.run();

                var serviceContactResult = resultSetContacts.getRange({
                    start: 0,
                    end: 1,
                });

                var contactInternalID = serviceContactResult[0].getValue({
                    name: "internalid",
                });
                var contactFirstName = serviceContactResult[0].getValue({
                    name: "firstname",
                });
                var contactLastName = serviceContactResult[0].getValue({
                    name: "lastname",
                });
                var contactEmail = serviceContactResult[0].getValue({
                    name: "email",
                });
                var contactPhone = serviceContactResult[0].getValue({
                    name: "phone",
                });

                //Campaign Communication Template: 202505 - Illicium T3 - Confirming FU Appointment
                var suiteletUrl =
                    "https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&ns-at=AAEJ7tMQgAVHkxJsbXgGwQQm4xn968o7JJ9-Ym7oanOzCSkWO78&rectype=customer&template=253";
                suiteletUrl +=
                    "&recid=" +
                    oldCustomerInternalID +
                    "&salesrep=" +
                    oldCustomerAccountManager +
                    "&dear=" +
                    contactFirstName +
                    "&contactid=" +
                    contactInternalID +
                    "&userid=" +
                    oldCustomerAccountManager;

                var response = https.get({
                    url: suiteletUrl,
                });

                var emailHtml = response.body;

                var newLeadEmailTemplateRecord = record.load({
                    type: "customrecord_camp_comm_template",
                    id: 253, //Camp Communication TemplateID: 202505 - Illicium T3 - Confirming FU Appointment
                });
                var templateSubject = newLeadEmailTemplateRecord.getValue({
                    fieldId: "custrecord_camp_comm_subject",
                });


                email.send({
                    author: oldCustomerAccountManager,
                    body: emailHtml,
                    recipients: contactEmail,
                    subject: templateSubject,
                    cc: [oldCustomerAccountManager, 'customerservice@mailplus.com.au'],
                    relatedRecords: { entityId: oldCustomerInternalID },
                });

                log.audit({
                    title: "Email Sent out to:",
                    details: contactEmail + " for customer: " + oldCustomerInternalID,
                });
            }



            oldCustomerInternalID = customerInternalID;
            oldCustomerEmail = customerEmail
            oldCustomerAccountManager = customerAccountManager;
            barcodeCount++;
            return true;
        });

        if (barcodeCount > 0) {
            // NetSuite Search: SALESP - Contacts
            var searched_contacts = search.load({
                id: "customsearch_salesp_contacts",
                type: "contact",
            });

            searched_contacts.filters.push(
                search.createFilter({
                    name: "internalid",
                    join: "CUSTOMER",
                    operator: search.Operator.ANYOF,
                    values: oldCustomerInternalID,
                })
            );

            searched_contacts.filters.push(
                search.createFilter({
                    name: "isinactive",
                    operator: search.Operator.IS,
                    values: false,
                })
            );

            resultSetContacts = searched_contacts.run();

            var serviceContactResult = resultSetContacts.getRange({
                start: 0,
                end: 1,
            });

            var contactInternalID = serviceContactResult[0].getValue({
                name: "internalid",
            });
            var contactFirstName = serviceContactResult[0].getValue({
                name: "firstname",
            });
            var contactLastName = serviceContactResult[0].getValue({
                name: "lastname",
            });
            var contactEmail = serviceContactResult[0].getValue({
                name: "email",
            });
            var contactPhone = serviceContactResult[0].getValue({
                name: "phone",
            });

            //Campaign Communication Template: 202505 - Illicium T3 - Confirming FU Appointment
            var suiteletUrl =
                "https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&ns-at=AAEJ7tMQgAVHkxJsbXgGwQQm4xn968o7JJ9-Ym7oanOzCSkWO78&rectype=customer&template=253";
            suiteletUrl +=
                "&recid=" +
                oldCustomerInternalID +
                "&salesrep=" +
                oldCustomerAccountManager +
                "&dear=" +
                contactFirstName +
                "&contactid=" +
                contactInternalID +
                "&userid=" +
                oldCustomerAccountManager;

            var response = https.get({
                url: suiteletUrl,
            });

            var emailHtml = response.body;

            var newLeadEmailTemplateRecord = record.load({
                type: "customrecord_camp_comm_template",
                id: 253, //Camp Communication TemplateID: 202505 - Illicium T3 - Confirming FU Appointment
            });
            var templateSubject = newLeadEmailTemplateRecord.getValue({
                fieldId: "custrecord_camp_comm_subject",
            });


            email.send({
                author: oldCustomerAccountManager,
                body: emailHtml,
                recipients: contactEmail,
                subject: templateSubject,
                cc: [oldCustomerAccountManager, 'customerservice@mailplus.com.au'],
                relatedRecords: { entityId: oldCustomerInternalID },
            });

            log.audit({
                title: "Email Sent out to:",
                details: contactEmail + " for customer: " + oldCustomerInternalID,
            });
        }

        log.debug({
            title: "All Emails Sent Out",
        });
    }

    /**
     * @description Checks if the input field contains an Australian mobile number.
     * @param {string} phoneNumber - The phone number to validate.
     * @returns {boolean} True if the phone number is a valid Australian mobile number, otherwise false.
     */
    function isValidAustralianMobileNumber(phoneNumber) {
        // Regular expression to match Australian mobile numbers
        var australianMobileNumberPattern = /^04\d{8}$/;
        return australianMobileNumberPattern.test(phoneNumber);
    }

    function isNullorEmpty(strVal) {
        return (
            strVal == null ||
            strVal == "" ||
            strVal == "null" ||
            strVal == undefined ||
            strVal == "undefined" ||
            strVal == "- None -"
        );
    }

    return {
        execute: main,
    };
});
