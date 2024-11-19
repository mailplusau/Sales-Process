/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript

 * Author:               Ankith Ravindran
 * Created on:           Thu Nov 14 2024
 * Modified on:          Thu Nov 14 2024 13:20:13
 * SuiteScript Version:   2.0
 * Description:           Email customer that an Onboarding session has been scheduled for tomorrow.
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
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

		// NetSuite Search: ShipMate Onboarding Required - Reminder Email
		var onboardingReminderCustomerListSearch = search.load({
			id: "customsearch_shipmate_onboarding_tasks_3",
			type: "customer",
		});

		var count = onboardingReminderCustomerListSearch.runPaged().count;

		log.debug({
			title: "count",
			details: count,
		});
		sendEmails(onboardingReminderCustomerListSearch);
	}

	function sendEmails(onboardingReminderCustomerListSearch) {
		onboardingReminderCustomerListSearch.run().each(function (searchResult) {
			var customerInternalID = searchResult.getValue("internalid");
			var customerID = searchResult.getValue("entityid");
			var customerCompanyName = searchResult.getValue("companyname");
			var taskTime = searchResult.getValue({
				name: "starttime",
				join: "task",
			});
			var taskAssignedToID = searchResult.getValue({
				name: "assigned",
				join: "task",
			});
			var contactInternalID = searchResult.getValue({
				name: "internalid",
				join: "contactPrimary",
			});
			var contactFirstName = searchResult.getValue({
				name: "firstname",
				join: "contactPrimary",
			});
			var contactEmail = searchResult.getValue({
				name: "email",
				join: "contactPrimary",
			});
			var contactPhone = searchResult.getValue({
				name: "phone",
				join: "contactPrimary",
			});

			var suiteletUrl =
				"https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&ns-at=AAEJ7tMQgAVHkxJsbXgGwQQm4xn968o7JJ9-Ym7oanOzCSkWO78&rectype=customer&template=229";
			suiteletUrl +=
				"&recid=" +
				customerInternalID +
				"&salesrep=" +
				taskAssignedToID +
				"&dear=" +
				contactFirstName +
				"&contactid=" +
				contactInternalID +
				"&userid=" +
				taskAssignedToID +
				"&tasktime=" +
				taskTime +
				"&salesRepName=" +
				searchResult.getText({ name: "assigned", join: "task" });

			var response = https.get({
				url: suiteletUrl,
			});

			var emailHtml = response.body;

			email.send({
				author: taskAssignedToID,
				body: emailHtml,
				recipients: contactEmail,
				subject: "Your ShipMate Onboarding Session is Tomorrow",
				cc: [taskAssignedToID],
				relatedRecords: { entityId: customerInternalID },
				replyTo: "liam.pike@mailplus.com.au",
			});

			log.audit({
				title: "Email Sent out to:",
				details: contactEmail + " for customer: " + customerInternalID,
			});

			if (isValidAustralianMobileNumber(contactPhone)) {
				var smsBody =
					"Get ready for your ShipMate onboarding! For a quick & smooth session tomorrow:\n\n" +
					"1. Create your ShipMate login if you have not already \n" +
					"2. Have your Shopify store open if applicable \n" +
					"3. Have at least 1 unfulfilled Shopify order ready in aplicable \n" +
					"4. Or at least 1 package ready to go \n" +
					"5. Set aside 20mins for the call, but we have more time if you need it!  \n\n" +
					"Need to reschedule? Call/SMS Liam at 0468 796 206 or email liam.pike@mailplus.com.au ";

				var apiResponse = https.post({
					url: "https://api.twilio.com/2010-04-01/Accounts/ACc4fb93dc175b8f9066ed80bf0caecdb7/Messages.json",
					body: {
						Body: smsBody,
						To: contactPhone,
						From: "+61488883115",
					},
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization:
							"Basic U0s0ZTgwNTdiNjZkOGYyMGM0M2ExNGI2Y2E4NmY0MjgwZDo0alpGVDB5aDFWbUxRNWNtVDhoNlNUYkVibGZOTTBhYg==",
					},
				});

				var parsedAPIResponseBody = JSON.parse(apiResponse.body);
				log.debug("parsedAPIResponseBody", parsedAPIResponseBody);

				log.audit({
					title: "SMS Sent out to:",
					details: contactPhone + " for customer: " + customerInternalID,
				});
			} else {
				email.send({
					author: 112209,
					body:
						"SMS not sent to: " +
						contactPhone +
						" for customer: " +
						customerID +
						" - " +
						customerCompanyName,
					recipients: ["liam.pike@mailplus.com.au"],
					subject:
						"Onboarding Reminder SMS not sent - " +
						customerID +
						" - " +
						customerCompanyName,
					cc: ["portalsupport@mailplus.com.au"],
					relatedRecords: { entityId: customerInternalID },
				});
			}

			return true;
		});

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
