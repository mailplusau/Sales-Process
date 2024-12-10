/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript

 * Author:               Ankith Ravindran
 * Created on:           Mon Dec 02 2024
 * Modified on:          Mon Dec 02 2024 13:33:15
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */

define([
	"SuiteScripts/jQuery Plugins/Moment JS/moment.min",
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/https",
	"N/log",
	"N/error",
	"N/url",
	"N/format",
	"N/currentRecord",
], function (
	moment,
	email,
	runtime,
	search,
	record,
	https,
	log,
	error,
	url,
	format,
	currentRecord
) {
	var zee_id = 0;
	var userId = 0;
	var role = 0;

	var baseURL = "https://1048144.app.netsuite.com";
	if (runtime.EnvType == "SANDBOX") {
		baseURL = "https://1048144-sb3.app.netsuite.com";
	}

	role = runtime.getCurrentUser().role;
	var userName = runtime.getCurrentUser().name;
	var userId = runtime.getCurrentUser().id;
	var currRecord = currentRecord.get();

	var date_from = null;
	var date_to = null;

	var tableFinancialYearColumns = [];

	var total_months = 14;

	var today = new Date();
	var today_day_in_month = today.getDate();
	var today_day_in_week = today.getDay();
	var today_month = today.getMonth() + 1;
	var today_year = today.getFullYear();

	var total_leads = 0;

	if (today_day_in_month < 10) {
		today_day_in_month = "0" + today_day_in_month;
	}

	if (today_month < 10) {
		today_month = "0" + today_month;
	}

	var todayString = today_day_in_month + "/" + today_month + "/" + today_year;

	var current_year_month = today_year + "-" + today_month;
	var difference_months = total_months - parseInt(today_month);

	function isWeekday(year, month, day) {
		var day = new Date(year, month, day).getDay();
		return day != 0 && day != 6;
	}

	function getWeekdaysInMonth(month, year) {
		var days = daysInMonth(month, year);
		var weekdays = 0;
		for (var i = 0; i < days; i++) {
			if (isWeekday(year, month, i + 1)) weekdays++;
		}
		return weekdays;
	}

	function daysInMonth(iMonth, iYear) {
		return 32 - new Date(iYear, iMonth, 32).getDate();
	}

	function afterSubmit() {
		$(".zee_label_section").removeClass("hide");
		$(".show_buttons_section").removeClass("hide");
		$(".zee_dropdown_section").removeClass("hide");

		$(".lead_entered_label_section").removeClass("hide");
		$(".lead_entered_div").removeClass("hide");
		$(".modified_date_div").removeClass("hide");
		if (role != 1000) {
			$(".quote_sent_label_section").removeClass("hide");
			$(".quote_sent_div").removeClass("hide");
			$(".usage_label_section").removeClass("hide");
			$(".calcprodusage_div").removeClass("hide");
			// $('.salesactivitynotes_div').removeClass('hide');
			$(".usage_date_div").removeClass("hide");
			$(".invoice_label_section").removeClass("hide");
			$(".invoice_date_type_div").removeClass("hide");
		}

		$(".source_salesrep_label_section").removeClass("hide");
		$(".source_salesrep_section").removeClass("hide");

		$(".signed_up_label_section").removeClass("hide");
		$(".signed_up_div").removeClass("hide");

		$(".filter_buttons_section").removeClass("hide");
		$(".tabs_section").removeClass("hide");
		$(".table_section").removeClass("hide");
		$(".instruction_div").removeClass("hide");
		// if (userId == 409635) {
		//     $('.development_message').removeClass('hide');
		// }
		$(".scorecard_percentage").removeClass("hide");
		$(".status_dropdown_section").removeClass("hide");

		$(".loading_section").addClass("hide");
	}

	function pageInit() {
		$("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
		$("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
		$("#body").css("background-color", "#CFE0CE");
		// pageLoad();
		$(".ui.dropdown").dropdown();

		$(document).ready(function () {
			$(".js-example-basic-multiple").select2();

			$(".scheduleTask").click(function () {
				var customerInternalID = $(this).attr("data-id");
				var salesRecordInternalID = $(this).attr("data-salesrecord");
				console.log("inside modal");
				console.log("customerInternalID " + customerInternalID);
				console.log("salesRecordInternalID " + salesRecordInternalID);

				var salesRepAssigned = "";
				var salesRepAssignedID = "";
				var salesCampaign = "";

				if (!isNullorEmpty(salesRecordInternalID)) {
					var salesRecord = record.load({
						type: "customrecord_sales",
						id: salesRecordInternalID,
					});

					salesRepAssigned = salesRecord.getText({
						fieldId: "custrecord_sales_assigned",
					});
					salesRepAssignedID = salesRecord.getValue({
						fieldId: "custrecord_sales_assigned",
					});
					salesCampaign = salesRecord.getText({
						fieldId: "custrecord_sales_campaign",
					});
				}

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
						values: customerInternalID,
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

				var tncLink =
					"https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=1959&deploy=1&compid=1048144&ns-at=AAEJ7tMQCuxUJvJ4RvyaI99vrX6kaBIKkbBebvVixmguZdaobdA&custinternalid=" +
					customerInternalID;

				var smsMessage =
					"Hey there! It's MailPlus here. We're excited to get your services started. Please click the link to accept our T&Cs: " +
					tncLink +
					". Thank you for trusting us with your business' parcels and mail. Have a great day ahead!";

				if (!isNullorEmpty(contactPhone)) {
					contactPhone = contactPhone.replace(/\s+/g, "");
					if (isValidAustralianMobileNumber(contactPhone)) {
						var apiResponse = https.post({
							url: "https://api.twilio.com/2010-04-01/Accounts/ACc4fb93dc175b8f9066ed80bf0caecdb7/Messages.json",
							body: {
								Body: smsMessage,
								To: contactPhone,
								From: "+61488883115",
							},
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
								Authorization:
									"Basic U0s0ZTgwNTdiNjZkOGYyMGM0M2ExNGI2Y2E4NmY0MjgwZDo0alpGVDB5aDFWbUxRNWNtVDhoNlNUYkVibGZOTTBhYg==",
							},
						});
						console.log("SMS Sent");
					}
				}

				if (!isNullorEmpty(contactEmail)) {
					var emailSubject = "Friendly reminder: Accept MailPlus T&Cs";
					var emailBody =
						"Hi " +
						contactFirstName +
						",</br></br> We're excited to get your services started. Friendly reminder: Please click the link to accept our T&Cs:<a href= " +
						tncLink +
						">Click Here</a></br></br> Thank you for trusting us with your business' parcels and mail.</br></br>Have a great day ahead!,</br> " +
						salesRepAssigned +
						"\n MailPlus Team";

					email.send({
						author: salesRepAssignedID,
						body: emailBody,
						recipients: contactEmail,
						subject: emailSubject,
						relatedRecords: { entityId: customerInternalID },
					});
					console.log("Email Sent");
				}

				var customerRecord = record.load({
					type: record.Type.CUSTOMER,
					id: customerInternalID,
				});

				var companyName = customerRecord.getValue({
					fieldId: "companyname",
				});

				var task_record = record.create({
					type: "task",
				});
				var date = new Date();
				var startDate = new Date();
				var endDate = new Date();

				format.format({
					value: startDate,
					type: format.Type.DATE,
					timezone: format.Timezone.AUSTRALIA_SYDNEY,
				});


				format.format({
					value: endDate,
					type: format.Type.DATE,
					timezone: format.Timezone.AUSTRALIA_SYDNEY,
				});

				var currentTime = getCurrentTime();
				console.log("Date: " + date);
				console.log("startDate: " + startDate);
				console.log("endDate: " + endDate);
				

				var currentTimeSplit = currentTime.split(":");

				// startDate.setHours(currentTimeSplit[0], currentTimeSplit[1], 0, 0);
				endDate.setHours(
					startDate.getHours(),
					startDate.getMinutes() + 15,
					0,
					0
				);
				format.format({
					value: date,
					type: format.Type.DATE,
					timezone: format.Timezone.AUSTRALIA_SYDNEY,
				});

				console.log("startDate: " + startDate);
				console.log("endDate: " + endDate);

				// return false;
				task_record.setValue({
					fieldId: "duedate",
					value: date,
				});

				task_record.setValue({
					fieldId: "timedevent",
					value: true,
				});

				task_record.setValue({
					fieldId: "starttime",
					value: startDate,
				});
				task_record.setValue({
					fieldId: "endtime",
					value: endDate,
				});

				task_record.setValue({
					fieldId: "company",
					value: customerInternalID,
				});

				task_record.setValue({
					fieldId: "title",
					value: "T&C's Not Accepted - " + companyName,
				});

				task_record.setValue({
					fieldId: "custevent_organiser",
					value: runtime.getCurrentUser().id,
				});
				task_record.setValue({
					fieldId: "assigned",
					value: salesRepAssignedID,
				});

				task_record.save({
					ignoreMandatoryFields: true,
				});
				console.log("Task Created");
				var url =
					baseURL + "/app/site/hosting/scriptlet.nl?script=1956&deploy=1";
				window.location.href = url;
			});

			$(".taskCompleted").click(function () {
				var taskInternalId = $(this).attr("data-id");
				console.log(taskInternalId);

				var task_record = record.load({
					type: "task",
					id: taskInternalId,
				});

				task_record.setValue({
					fieldId: "status",
					value: "COMPLETE",
				});
				task_record.setValue({
					fieldId: "message",
					value: getCurrentDateTime() + " - Completed \n",
				});

				task_record.save({
					ignoreMandatoryFields: true,
				});
				var url =
					baseURL + "/app/site/hosting/scriptlet.nl?script=1956&deploy=1";
				window.location.href = url;
			});
		});

		debtDataSet = [];
		debt_set = [];

		submitSearch();
		afterSubmit();
	}

	function submitSearch() {
		//Data table for all the unqualified leads
		var datatableCustomerList = $("#mpexusage-customer_list").DataTable({
			// data: customerDataSet,
			fixedHeader: true,
			responsive: true,
			scrollCollapse: true,
			pageLength: 250,
			order: [
				[10, "asc"],
				[7, "asc"],
			],
			layout: {
				topStart: {
					buttons: [
						{
							extend: "copy",
							text: "Copy",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "csv",
							text: "CSV",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "excel",
							text: "Excel",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "pdf",
							text: "PDF",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "print",
							text: "Print",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
					],
				},
			},
			columns: [
				{
					title: "Actions", //0
				},
				{
					title: "Customer Internal ID", //1
				},
				{
					title: "ID", //2
				},
				{
					title: "Company Name", //3
				},
				{
					title: "Franchisee", //4
				},
				{
					title: "Lead Source", //5
				},
				{
					title: "Status", //6
				},
				{
					title: "Sales Rep Assigned", //7
				},
				{
					title: "Campaign", //8
				},
				{
					title: "Sale Type", //9
				},
				{
					title: "Commencement Date", //10
				},
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [2, 3, 4, 6, 7],
					className: "bolded",
				},
				{
					targets: [1],
					className: "col-xs-1",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[10] == getTodayDate()) {
					$("td", row).css("background-color", "#FEBE8C");
				} else if (data[10] < getTodayDate()) {
					$("td", row).css("background-color", "#e97677");
				}
			},
			footerCallback: function (row, data, start, end, display) {},
		});

		var datatableCustomerListWithTasks = $(
			"#mpexusage-customer_list_schedule"
		).DataTable({
			// data: customerDataSet,
			fixedHeader: true,
			responsive: true,
			scrollCollapse: true,
			pageLength: 250,
			order: [[10, "asc"]],
			layout: {
				topStart: {
					buttons: [
						{
							extend: "copy",
							text: "Copy",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "csv",
							text: "CSV",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "excel",
							text: "Excel",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "pdf",
							text: "PDF",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
						{
							extend: "print",
							text: "Print",
							className: "btn btn-default exportButtons",
							exportOptions: {
								columns: ":not(.notexport)",
							},
						},
					],
				},
			},
			columns: [
				{
					title: "Actions", //0
				},
				{
					title: "Customer Internal ID", //1
				},
				{
					title: "ID", //2
				},
				{
					title: "Company Name", //3
				},
				{
					title: "Franchisee", //4
				},
				{
					title: "Lead Source", //5
				},
				{
					title: "Status", //6
				},
				{
					title: "Sales Rep Assigned", //7
				},
				{
					title: "Campaign", //8
				},
				{
					title: "Sale Type", //9
				},
				{
					title: "Commencement Date", //10
				},
				{
					title: "Task Date Created", //11
				},
				{
					title: "Task Date", //12
				},
				{
					title: "Assigned To", //13
				},
				{
					title: "Task Status", //14
				},
				{
					title: "Days Task Open", //15
				},
			],
			autoWidth: false,
			columnDefs: [
				{
					targets: [2, 3, 4, 6, 7],
					className: "bolded",
				},
				{
					targets: [1],
					className: "col-xs-1",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[10] == getTodayDate()) {
					$("td", row).css("background-color", "#FEBE8C");
				} else if (data[10] < getTodayDate()) {
					$("td", row).css("background-color", "#e97677");
				}
			},
			footerCallback: function (row, data, start, end, display) {},
		});
	}

	function saveRecord() {
		// return true;
	}

	function replaceAll(string) {
		return string.split("/").join("-");
	}

	/**
	 * @description Calculates the number of days between two dates.
	 * @param {String} startDate - The start date in "YYYY-MM-DD" format.
	 * @param {String} endDate - The end date in "YYYY-MM-DD" format.
	 * @returns {Number} The number of days between the two dates.
	 */
	function calculateDaysBetweenDates(startDate, endDate) {
		var start = new Date(startDate);
		var end = new Date(endDate);

		// Calculate the difference in time
		var timeDifference = end - start;

		// Convert the time difference from milliseconds to days
		var daysDifference = timeDifference / (1000 * 60 * 60 * 24);

		return daysDifference;
	}

	/**
	 * @description check the start and end dates, ensuring they are within the same financial year.
	 * @param {String} startDate - The start date in "YYYY-MM-DD" format.
	 * @param {String} endDate - The end date in "YYYY-MM-DD" format.
	 * @throws {Error} If the dates span across two financial years.
	 */
	function checkInputWithinSameFinancialYear(startDate, endDate) {
		var start = new Date(startDate);
		var end = new Date(endDate);

		// Determine the financial year for the start date
		var startYear = start.getFullYear();
		var startMonth = start.getMonth() + 1; // Months are zero-based
		var startFinancialYear = startMonth >= 7 ? startYear : startYear - 1;

		// Determine the financial year for the end date
		var endYear = end.getFullYear();
		var endMonth = end.getMonth() + 1; // Months are zero-based
		var endFinancialYear = endMonth >= 7 ? endYear : endYear - 1;

		// Check if the start and end dates are within the same financial year
		if (startFinancialYear !== endFinancialYear) {
			return false;
		}
	}

	/**
	 * @description Generates an array of months in "YYYY-MM" format between the start and end dates, extending to the end of the financial year.
	 * @param {String} startDate - The start date in "YYYY-MM-DD" format.
	 * @param {String} endDate - The end date in "YYYY-MM-DD" format.
	 * @returns {Array} An array of months in "YYYY-MM" format.
	 */
	function generateMonthArrayToEndOfFinancialYear(startDate, endDate) {
		var start = new Date(startDate);
		var end = new Date(endDate);

		// Extend the end date to the end of the financial year (June 30th)
		var endYear = end.getFullYear();
		var endMonth = end.getMonth() + 1; // Months are zero-based
		if (endMonth > 6) {
			end = new Date(endYear + 1, 5, 30); // June 30th of the next year
		} else {
			end = new Date(endYear, 5, 30); // June 30th of the current year
		}

		var monthArray = [];

		// Iterate through each month between the start and end dates
		while (start <= end) {
			var year = start.getFullYear();
			var month = customPadStart(start.getMonth() + 1, 2, "0");
			monthArray.push(year + "-" + month);

			tableFinancialYearColumns.push({
				title: year + "-" + month,
			});

			// Move to the next month
			start.setMonth(start.getMonth() + 1);
		}

		return monthArray;
	}

	/**
	 * @description Generates an array of months in "YYYY-MM" format starting from the given start date and adding 12 months.
	 * @param {String} startDate - The start date in "YYYY-MM-DD" format.
	 * @returns {Array} An array of months in "YYYY-MM" format.
	 */
	function generateMonthArrayForNext12Months(startDate) {
		var start = new Date(startDate);

		var monthArray = [];

		// Iterate through each month between the start and end dates
		for (var i = 0; i < 12; i++) {
			var year = start.getFullYear();
			var month = customPadStart(start.getMonth() + 1, 2, "0");
			monthArray.push(year + "-" + month);

			tableFinancialYearColumns.push({
				title: year + "-" + month,
			});

			// Move to the next month
			start.setMonth(start.getMonth() + 1);
		}

		return monthArray;
	}

	/**
	 * @description Gets the current year and month in "YYYY-MM" format.
	 * @returns {String} The current year and month in "YYYY-MM" format.
	 */
	function getCurrentYearAndMonth() {
		var now = new Date();
		var year = now.getFullYear();
		var month = customPadStart(now.getMonth() + 1, 2, "0"); // Months are zero-based

		return year + "-" + month;
	}

	/**
	 * @description Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length. The padding is applied from the start (left) of the current string.
	 * @param {string} str - The original string to pad.
	 * @param {number} targetLength - The length of the resulting string once the current string has been padded.
	 * @param {string} padString - The string to pad the current string with. Defaults to a space if not provided.
	 * @returns {string} The padded string.
	 */
	function customPadStart(str, targetLength, padString) {
		// Convert the input to a string
		str = String(str);

		// If the target length is less than or equal to the string's length, return the original string
		if (str.length >= targetLength) {
			return str;
		}

		// Calculate the length of the padding needed
		var paddingLength = targetLength - str.length;

		// Repeat the padString enough times to cover the padding length
		var repeatedPadString = customRepeat(
			padString,
			Math.ceil(paddingLength / padString.length)
		);

		// Slice the repeated padString to the exact padding length needed and concatenate with the original string
		return repeatedPadString.slice(0, paddingLength) + str;
	}

	/**
	 * @description Repeats the given string a specified number of times.
	 * @param {string} str - The string to repeat.
	 * @param {number} count - The number of times to repeat the string.
	 * @returns {string} The repeated string.
	 */
	function customRepeat(str, count) {
		// Convert the input to a string
		str = String(str);

		// If the count is 0 or less, return an empty string
		if (count <= 0) {
			return "";
		}

		// Initialize the result string
		var result = "";

		// Repeat the string by concatenating it to the result
		for (var i = 0; i < count; i++) {
			result += str;
		}

		return result;
	}

	function replaceAll(string) {
		return string.split("/").join("-");
	}

	/**
	 * @param   {Number} x
	 * @returns {String} The same number, formatted in Australian dollars.
	 */
	function financial(x) {
		if (typeof x == "string") {
			x = parseFloat(x);
		}
		if (isNullorEmpty(x) || isNaN(x)) {
			return "$0.00";
		} else {
			return x.toLocaleString("en-AU", {
				style: "currency",
				currency: "AUD",
			});
		}
	}
	/**
	 * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
	 * @param   {String} date_iso       "2020-06-01"
	 * @returns {String} date_netsuite  "1/6/2020"
	 */
	function dateISOToNetsuite(date_iso) {
		var date_netsuite = "";
		if (!isNullorEmpty(date_iso)) {
			var date_utc = new Date(date_iso);
			// var date_netsuite = nlapiDateToString(date_utc);
			var date_netsuite = format.format({
				value: date_utc,
				type: format.Type.DATE,
			});
		}
		return date_netsuite;
	}

	function isNullorEmpty(val) {
		if (
			val == "" ||
			val == null ||
			val == "- None -" ||
			val == 0 ||
			val == "0"
		) {
			return true;
		} else {
			return false;
		}
	}

	// Function to check if the first 5 characters of a string match a specific value
	function startsWithFirstFiveChars(str, value) {
		return str.substring(0, 5) === value;
	}

	function getDateStoreNS() {
		var date = new Date();
		// if (date.getHours() > 6) {
		//     date.setDate(date.getDate() + 1);
		// }

		format.format({
			value: date,
			type: format.Type.DATE,
			timezone: format.Timezone.AUSTRALIA_SYDNEY,
		});

		return date;
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

	function getCurrentTime() {
		var now = new Date();
		// now.setHours(now.getUTCHours() + 11);
		// var day = customPadStart(now.getDate().toString(), 2, "0");
		// var month = customPadStart((now.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
		// var year = now.getFullYear();
		var hours = customPadStart(now.getUTCHours().toString(), 2, "0");
		var minutes = customPadStart(now.getUTCMinutes().toString(), 2, "0");
		return hours + ":" + minutes;
	}

	// Function to get current date and time in "dd/mm/yyyy HH:MM" format
	function getCurrentDateTime() {
		var now = new Date();
		now.setHours(now.getUTCHours() + 11);
		var day = customPadStart(now.getDate().toString(), 2, "0");
		var month = customPadStart((now.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
		var year = now.getFullYear();
		var hours = customPadStart(now.getUTCHours().toString(), 2, "0");
		var minutes = customPadStart(now.getUTCMinutes().toString(), 2, "0");
		return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
	}

	function getTodayDate() {
		var today = new Date();
		var year = today.getFullYear();
		var month = customPadStart((today.getMonth() + 1).toString(), 2, "0");
		var day = customPadStart(today.getDate().toString(), 2, "0");

		return year + "-" + month + "-" + day;
	}

	/**
	 * @description Pads the current string with another string (multiple times, if needed) until the resulting string reaches the given length. The padding is applied from the start (left) of the current string.
	 * @param {string} str - The original string to pad.
	 * @param {number} targetLength - The length of the resulting string once the current string has been padded.
	 * @param {string} padString - The string to pad the current string with. Defaults to a space if not provided.
	 * @returns {string} The padded string.
	 */
	function customPadStart(str, targetLength, padString) {
		// Convert the input to a string
		str = String(str);

		// If the target length is less than or equal to the string's length, return the original string
		if (str.length >= targetLength) {
			return str;
		}

		// Calculate the length of the padding needed
		var paddingLength = targetLength - str.length;

		// Repeat the padString enough times to cover the padding length
		var repeatedPadString = customRepeat(
			padString,
			Math.ceil(paddingLength / padString.length)
		);

		// Slice the repeated padString to the exact padding length needed and concatenate with the original string
		return repeatedPadString.slice(0, paddingLength) + str;
	}
	/**
	 * @description Repeats the given string a specified number of times.
	 * @param {string} str - The string to repeat.
	 * @param {number} count - The number of times to repeat the string.
	 * @returns {string} The repeated string.
	 */
	function customRepeat(str, count) {
		// Convert the input to a string
		str = String(str);

		// If the count is 0 or less, return an empty string
		if (count <= 0) {
			return "";
		}

		// Initialize the result string
		var result = "";

		// Repeat the string by concatenating it to the result
		for (var i = 0; i < count; i++) {
			result += str;
		}

		return result;
	}

	function convertTo24Hour(time) {
		// nlapiLogExecution('DEBUG', 'time', time);
		var hours = parseInt(time.substr(0, 2));
		if (time.indexOf("AM") != -1 && hours == 12) {
			time = time.replace("12", "0");
		}
		if (time.indexOf("AM") != -1 && hours < 10) {
			time = time.replace(hours, "0" + hours);
		}
		if (time.indexOf("PM") != -1 && hours < 12) {
			time = time.replace(hours, hours + 12);
		}
		return time.replace(/( AM| PM)/, "");
	}

	return {
		pageInit: pageInit,
		saveRecord: saveRecord,
	};
});
