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
			});

			log.audit({
				title: "Email Sent out to:",
				details: contactEmail + " for customer: " + customerInternalID,
			});

			return true;
		});

		log.debug({
			title: "All Emails Sent Out",
		});
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
