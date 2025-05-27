/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-24T10:22:37+11:00
 */

define([
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/http",
	"N/log",
	"N/error",
	"N/url",
	"N/format",
	"N/currentRecord",
], function (
	email,
	runtime,
	search,
	record,
	http,
	log,
	error,
	url,
	format,
	currentRecord
) {
	var zee = 0;
	var userId = 0;
	var role = 0;

	var baseURL = "https://1048144.app.netsuite.com";
	if (runtime.EnvType == "SANDBOX") {
		baseURL = "https://1048144-sb3.app.netsuite.com";
	}

	role = runtime.getCurrentUser().role;
	var userName = runtime.getCurrentUser().name;
	var userId = runtime.getCurrentUser().id;
	var currRec = currentRecord.get();

	var invoiceType = null;

	var no_of_working_days = [];
	var invoiceTypeServices = [];
	var invoiceTypeMPEX = [];
	var invoiceTypeNeoPost = [];

	var customer_count_with_no_mpex_usage = [];
	var customer_count_with_mpex_usage = [];
	var customer_count_with_orange_mpex_usage = [];
	var customer_count_with_white_mpex_usage = [];
	var customer_count = 0;
	var uniqueArray = [];

	var total_revenue_per_state = [];

	var month;
	var weekdays_current_month;

	var total_months = 14;

	var today = new Date();
	var today_day_in_month = today.getDate();
	var today_day_in_week = today.getDay();
	var today_month = today.getMonth() + 1;
	var today_year = today.getFullYear();

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

	function pageLoad() {
		$(".range_filter_section").addClass("hide");
		$(".range_filter_section_top").addClass("hide");
		$(".date_filter_section").addClass("hide");
		$(".period_dropdown_section").addClass("hide");

		$(".loading_section").removeClass("hide");
	}

	function beforeSubmit() {
		$("#customer_benchmark_preview").hide();
		$("#customer_benchmark_preview").addClass("hide");

		$(".loading_section").removeClass("hide");
	}

	function afterSubmit() {
		$(".instruction_div").removeClass("hide");
		$(".show_buttons_section").removeClass("hide");
		$(".zee_available_buttons_section").removeClass("hide");
		$(".cust_filter_section").removeClass("hide");
		$(".cust_dropdown_section").removeClass("hide");
		$(".status_dropdown_section").removeClass("hide");
		$(".cust_dropdown_section").removeClass("hide");
		$(".date_filter_section").removeClass("hide");
		$(".tabs_section").removeClass("hide");
		$(".customer").removeClass("hide");
		$(".zee_dropdown_section").removeClass("hide");
		$(".parent_lpo_section").removeClass("hide");
		$(".lead_entered_label_section").removeClass("hide");
		$(".lead_entered_div").removeClass("hide");
		$(".modified_date_div").removeClass("hide");
		// $(".salesactivitynotes_div").removeClass("hide");

		$(".loading_section").addClass("hide");

		if (!isNullorEmpty($("#result_customer_benchmark").val())) {
			$("#customer_benchmark_preview").removeClass("hide");
			$("#customer_benchmark_preview").show();
		}

		$("#result_customer_benchmark").on("change", function () {
			$("#customer_benchmark_preview").removeClass("hide");
			$("#customer_benchmark_preview").show();
		});

		$("#customer_benchmark_preview").removeClass("hide");
		$("#customer_benchmark_preview").show();
	}

	var paramUserId = null;
	var salesCampaign = null;
	var custStatus = null;
	var custStage = null;
	var source = null;
	var parentLPOInternalId = null;
	var date_from = null;
	var date_to = null;

	function showAlert(message) {
		$("#alert").html(
			'<button type="button" class="close">&times;</button>' + message
		);
		$("#alert").removeClass("hide");
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0;
		// $(window).scrollTop($('#alert').offset().top);
	}

	function pageInit() {
		$("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
		$("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
		$("#body").css("background-color", "#CFE0CE");
		$("#dt-search-0").css("background-color", "#ffffff");
		// $('#alert').hide();

		$(".ui.dropdown").dropdown();

		$(document).ready(function () {
			$(".js-example-basic-multiple").select2();
		});

		var val1 = currentRecord.get();
		paramUserId = val1.getValue({
			fieldId: "custpage_sales_rep_id",
		});
		salesCampaign = val1.getValue({
			fieldId: "custpage_sales_campaign",
		});
		custStatus = val1.getValue({
			fieldId: "custpage_cust_status",
		});
		custStage = val1.getValue({
			fieldId: "custpage_cust_stage",
		});
		source = val1.getValue({
			fieldId: "custpage_cust_source",
		});
		parentLPOInternalId = val1.getValue({
			fieldId: "custpage_cust_lpoid",
		});

		date_to = val1.getValue({
			fieldId: "custpage_sales_date_from",
		});

		date_to = val1.getValue({
			fieldId: "custpage_sales_date_to",
		});
		sales_activity_notes = val1.getValue({
			fieldId: "custpage_sales_activity_notes",
		});

		date_from = $("#date_from").val();
		date_from = dateISOToNetsuite(date_from);

		date_to = $("#date_to").val();
		date_to = dateISOToNetsuite(date_to);

		// if (isNullorEmpty(paramUserId)) {
		//     paramUserId = userId
		// }

		debtDataSet = [];
		debt_set = [];

		debtDataSet2 = [];
		debt_set2 = [];

		debtDataSet3 = [];
		debt_set3 = [];

		debtDataSet4 = [];
		debt_set4 = [];

		debtDataSetValidated = [];
		debt_set_validated = [];

		/**
		 *  Submit Button Function
		 */
		$("#submit").click(function () {
			// Ajax request
			var fewSeconds = 10;
			var btn = $(this);
			btn.addClass("disabled");
			// btn.addClass('')
			setTimeout(function () {
				btn.removeClass("disabled");
			}, fewSeconds * 1000);

			debtDataSet = [];
			debt_set = [];

			beforeSubmit();
			submitSearch();

			return true;
		});

		$(document).on("click", "#alert .close", function (e) {
			$("#alert").addClass("hide");
		});

		$("#show_filter").click(function () {
			if ($("#show_filter").val() == "SHOW FILTERS") {
				$("#show_filter").val("HIDE FILTERS");
				$("#show_filter").css("background-color", "#F0AECB");
				$("#show_filter").css("color", "#103d39");
			} else {
				$("#show_filter").val("SHOW FILTERS");
				$("#show_filter").css("background-color", "#EAF044 !important");
				$("#show_filter").css("color", "#103d39");
			}
		});

		$("#applyFilter").click(function () {
			userId = $("#user_dropdown option:selected").val();
			salesCampaign = $("#sales_campaign").val();
			custStage = $("#cust_stage option:selected").val();
			custStatus = $("#cust_status option:selected").val();
			custStage = $("#cust_stage option:selected").val();
			source = $("#lead_source option:selected").val();
			parentLPOInternalId = $("#parent_lpo").val();
			zee = $("#zee_dropdown").val();
			sales_activity_notes = $("#sales_activity_notes").val();

			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();

			console.log("salesCampaign " + salesCampaign);

			if (isNullorEmpty(custStage) || custStage == 0) {
				showAlert("Please select a Stage");
				return false;
			}

			if (isNullorEmpty(salesCampaign) && isNullorEmpty(zee)) {
				if (isNullorEmpty(date_from)) {
					showAlert("Please select a Date Lead Entered From");
					return false;
				}
				if (isNullorEmpty(date_to)) {
					showAlert("Please select a Date Lead Entered To");
					return false;
				}
			}

			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1659&deploy=1&user=" +
				userId +
				"&campaign=" +
				salesCampaign +
				"&stage=" +
				custStage +
				"&source=" +
				source +
				"&zee=" +
				zee +
				"&lpoid=" +
				parentLPOInternalId +
				"&start_date=" +
				date_from +
				"&last_date=" +
				date_to +
				"&status=" +
				custStatus +
				"&sales_activity_notes=" +
				sales_activity_notes;

			window.location.href = url;
		});

		$(".page_number").click(function () {
			var page_number = $(this).attr("data-id");
			console.log("page_number: " + page_number);

			userId = $("#user_dropdown option:selected").val();
			salesCampaign = $("#sales_campaign").val();
			custStage = $("#cust_stage option:selected").val();
			custStatus = $("#cust_status option:selected").val();
			source = $("#lead_source option:selected").val();
			parentLPOInternalId = $("#parent_lpo").val();
			zee = $("#zee_dropdown").val();
			sales_activity_notes = $("#sales_activity_notes").val();

			var date_from = $("#date_from").val();
			var date_to = $("#date_to").val();

			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1659&deploy=1&user=" +
				userId +
				"&campaign=" +
				salesCampaign +
				"&stage=" +
				custStage +
				"&source=" +
				source +
				"&page_no=" +
				page_number +
				"&lpoid=" +
				parentLPOInternalId +
				"&start_date=" +
				date_from +
				"&last_date=" +
				date_to +
				"&zee=" +
				zee +
				"&status=" +
				custStatus +
				"&sales_activity_notes=" +
				sales_activity_notes;

			window.location.href = url;
		});

		/**
		 *  Auto Load Submit Search and Load Results on Page Initialisation
		 */
		pageLoad();
		submitSearch();
		var dataTable = $("#customer_benchmark_preview").DataTable();

		var today = new Date();
		var today_year = today.getFullYear();
		var today_month = today.getMonth();
		var today_day = today.getDate();

		/**
		 *  Click for Instructions Section Collapse
		 */
		$(".collapse").on("shown.bs.collapse", function () {
			$(".range_filter_section_top").css("padding-top", "500px");
		});
		$(".collapse").on("hide.bs.collapse", function () {
			$(".range_filter_section_top").css("padding-top", "0px");
		});

		$(".2WeekCallCompletedModalPopUP").click(function () {
			var customerInternalId = $(this).attr("data-id");
			console.log("inside modal");
			$("#customerInternalID").val(customerInternalId);

			$("#myModal").show();

			return false;
		});

		$(".noAnswer").click(function () {
			var customerInternalId = $(this).attr("data-id");

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 35,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";
			window.location.href = url;

			return false;
		});

		$(".lost").click(function () {
			var customerInternalId = $(this).attr("data-id");

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 59,
			});

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});

			customer_record.setValue({
				fieldId: "custentity_date_lead_lost",
				value: date_now,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";
			window.location.href = url;

			return false;
		});

		$(".notalead").click(function () {
			var customerInternalId = $(this).attr("data-id");

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 59,
			});

			customer_record.setValue({
				fieldId: "custentity_service_cancellation_reason",
				value: 40,
			});

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});

			customer_record.setValue({
				fieldId: "custentity_date_lead_lost",
				value: date_now,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";
			window.location.href = url;

			return false;
		});

		$(".sendEmail").click(function () {
			var customerInternalId = $(this).attr("data-id");
			var salesrepid = $(this).attr("data-sales");
			var contactid = $(this).attr("data-contact");
			var contactEmail = $(this).attr("data-contactemail");
			var salesRecordId = $(this).attr("data-salesrecordid");

			var val1 = currentRecord.get();

			val1.setValue({
				fieldId: "custpage_customer_id",
				value: customerInternalId,
			});

			val1.setValue({
				fieldId: "custpage_sales_rep_id",
				value: salesrepid,
			});

			val1.setValue({
				fieldId: "custpage_contact_id",
				value: contactid,
			});

			val1.setValue({
				fieldId: "custpage_contact_email",
				value: contactEmail,
			});

			val1.setValue({
				fieldId: "custpage_salesrecordid",
				value: salesRecordId,
			});

			$("#submitter").trigger("click");
		});

		$(".noanswer").click(function () {
			userId = $("#user_dropdown option:selected").val();
			var customerInternalId = $(this).attr("data-id");
			var salesrepid = $(this).attr("data-sales");
			var contactid = $(this).attr("data-contact");
			var contactEmail = $(this).attr("data-contactemail");
			var salesRecordId = $(this).attr("data-salesrecordid");

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});
			var time_now = format.parse({
				value: date,
				type: format.Type.TIMEOFDAY,
			});

			var recSales = record.load({
				type: "customrecord_sales",
				id: salesRecordId,
			});

			var sales_campaign_name = recSales.getText({
				fieldId: "custrecord_sales_campaign",
			});

			var phoneCallRecord = record.create({
				type: record.Type.PHONE_CALL,
			});
			phoneCallRecord.setValue({
				fieldId: "assigned",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_organiser",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "startdate",
				value: date_now,
			});
			phoneCallRecord.setValue({
				fieldId: "company",
				value: customerInternalId,
			});
			phoneCallRecord.setValue({
				fieldId: "status",
				value: "COMPLETE",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_type",
				value: 2,
			});
			phoneCallRecord.setValue({
				fieldId: "title",
				value: sales_campaign_name + " - No Answer - Phone Call",
			});
			phoneCallRecord.setValue({
				fieldId: "message",
				value: "No answer",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_outcome",
				value: 6,
			});

			phoneCallRecord.save({
				ignoreMandatoryFields: true,
			});

			var dateFirstNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day0call",
			});
			var dateSecondNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day14call",
			});
			var dateThirdNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day25call",
			});

			if (isNullorEmpty(dateFirstNoContact)) {
				recSales.setValue({
					fieldId: "custrecord_sales_day0call",
					value: date_now,
				});
			} else if (
				!isNullorEmpty(dateFirstNoContact) &&
				isNullorEmpty(dateSecondNoContact) &&
				isNullorEmpty(dateThirdNoContact)
			) {
				recSales.setValue({
					fieldId: "custrecord_sales_day14call",
					value: date_now,
				});
			} else if (
				!isNullorEmpty(dateFirstNoContact) &&
				!isNullorEmpty(dateSecondNoContact) &&
				isNullorEmpty(dateThirdNoContact)
			) {
				recSales.setValue({
					fieldId: "custrecord_sales_day25call",
					value: date_now,
				});
			}

			recSales.setValue({
				fieldId: "custrecord_sales_completed",
				value: false,
			});

			recSales.setValue({
				fieldId: "custrecord_sales_inuse",
				value: false,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_assigned",
				value: salesrepid,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_outcome",
				value: 7,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_attempt",
				value:
					parseInt(
						recSales.getValue({
							fieldId: "custrecord_sales_attempt",
						})
					) + 1,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_lastcalldate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbackdate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbacktime",
				value: time_now,
			});

			recSales.save({
				ignoreMandatoryFields: true,
			});

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 35,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";

			window.location.href = url;
		});

		$(".noresponse").click(function () {
			console.log("inside no response");

			userId = $("#user_dropdown option:selected").val();
			var customerInternalId = $(this).attr("data-id");
			var salesrepid = $(this).attr("data-sales");
			var contactid = $(this).attr("data-contact");
			var contactEmail = $(this).attr("data-contactemail");
			var salesRecordId = $(this).attr("data-salesrecordid");

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});
			var time_now = format.parse({
				value: date,
				type: format.Type.TIMEOFDAY,
			});

			var recSales = record.load({
				type: "customrecord_sales",
				id: salesRecordId,
			});

			var sales_campaign_name = recSales.getText({
				fieldId: "custrecord_sales_campaign",
			});

			var phoneCallRecord = record.create({
				type: record.Type.PHONE_CALL,
			});
			phoneCallRecord.setValue({
				fieldId: "assigned",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_organiser",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "startdate",
				value: date_now,
			});
			phoneCallRecord.setValue({
				fieldId: "company",
				value: customerInternalId,
			});
			phoneCallRecord.setValue({
				fieldId: "status",
				value: "COMPLETE",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_type",
				value: 2,
			});
			phoneCallRecord.setValue({
				fieldId: "title",
				value: sales_campaign_name + " - No Response - Email",
			});
			phoneCallRecord.setValue({
				fieldId: "message",
				value: "No Response to email",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_outcome",
				value: 6,
			});

			phoneCallRecord.save({
				ignoreMandatoryFields: true,
			});

			console.log("after phone call");

			var dateFirstNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day0call",
			});
			var dateSecondNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day14call",
			});
			var dateThirdNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day25call",
			});

			if (isNullorEmpty(dateFirstNoContact)) {
				recSales.setValue({
					fieldId: "custrecord_sales_day0call",
					value: date_now,
				});
			} else if (
				!isNullorEmpty(dateFirstNoContact) &&
				isNullorEmpty(dateSecondNoContact) &&
				isNullorEmpty(dateThirdNoContact)
			) {
				recSales.setValue({
					fieldId: "custrecord_sales_day14call",
					value: date_now,
				});
			} else if (
				!isNullorEmpty(dateFirstNoContact) &&
				!isNullorEmpty(dateSecondNoContact) &&
				isNullorEmpty(dateThirdNoContact)
			) {
				recSales.setValue({
					fieldId: "custrecord_sales_day25call",
					value: date_now,
				});
			}

			recSales.setValue({
				fieldId: "custrecord_sales_completed",
				value: false,
			});

			recSales.setValue({
				fieldId: "custrecord_sales_inuse",
				value: false,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_assigned",
				value: salesrepid,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_outcome",
				value: 7,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_attempt",
				value:
					parseInt(
						recSales.getValue({
							fieldId: "custrecord_sales_attempt",
						})
					) + 1,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_lastcalldate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbackdate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbacktime",
				value: time_now,
			});

			recSales.save({
				ignoreMandatoryFields: true,
			});

			console.log("after sales record");

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 35,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";

			window.location.href = url;
		});

		$(".noanswerrespone").click(function () {
			console.log("inside no noanswerrespone");

			userId = $("#user_dropdown option:selected").val();
			var customerInternalId = $(this).attr("data-id");
			var salesrepid = $(this).attr("data-sales");
			var contactid = $(this).attr("data-contact");
			var contactEmail = $(this).attr("data-contactemail");
			var salesRecordId = $(this).attr("data-salesrecordid");

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});
			var time_now = format.parse({
				value: date,
				type: format.Type.TIMEOFDAY,
			});

			var recSales = record.load({
				type: "customrecord_sales",
				id: salesRecordId,
			});

			var sales_campaign_name = recSales.getText({
				fieldId: "custrecord_sales_campaign",
			});

			var phoneCallRecord = record.create({
				type: record.Type.PHONE_CALL,
			});
			phoneCallRecord.setValue({
				fieldId: "assigned",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_organiser",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "startdate",
				value: date_now,
			});
			phoneCallRecord.setValue({
				fieldId: "company",
				value: customerInternalId,
			});
			phoneCallRecord.setValue({
				fieldId: "status",
				value: "COMPLETE",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_type",
				value: 2,
			});
			phoneCallRecord.setValue({
				fieldId: "title",
				value: sales_campaign_name + " - No Answer or Response",
			});
			phoneCallRecord.setValue({
				fieldId: "message",
				value: "No Response to email",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_outcome",
				value: 6,
			});

			phoneCallRecord.save({
				ignoreMandatoryFields: true,
			});

			console.log("after phone call");

			var dateFirstNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day0call",
			});
			var dateSecondNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day14call",
			});
			var dateThirdNoContact = recSales.getValue({
				fieldId: "custrecord_sales_day25call",
			});

			if (isNullorEmpty(dateFirstNoContact)) {
				recSales.setValue({
					fieldId: "custrecord_sales_day0call",
					value: date_now,
				});
			} else if (
				!isNullorEmpty(dateFirstNoContact) &&
				isNullorEmpty(dateSecondNoContact) &&
				isNullorEmpty(dateThirdNoContact)
			) {
				recSales.setValue({
					fieldId: "custrecord_sales_day14call",
					value: date_now,
				});
			} else if (
				!isNullorEmpty(dateFirstNoContact) &&
				!isNullorEmpty(dateSecondNoContact) &&
				isNullorEmpty(dateThirdNoContact)
			) {
				recSales.setValue({
					fieldId: "custrecord_sales_day25call",
					value: date_now,
				});
			}

			recSales.setValue({
				fieldId: "custrecord_sales_completed",
				value: false,
			});

			recSales.setValue({
				fieldId: "custrecord_sales_inuse",
				value: false,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_assigned",
				value: salesrepid,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_outcome",
				value: 7,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_attempt",
				value:
					parseInt(
						recSales.getValue({
							fieldId: "custrecord_sales_attempt",
						})
					) + 1,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_lastcalldate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbackdate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbacktime",
				value: time_now,
			});

			recSales.save({
				ignoreMandatoryFields: true,
			});

			console.log("after sales record");

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 35,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";

			window.location.href = url;
		});

		$(".salesrepassign").click(function () {
			var customerInternalId = $(this).attr("data-id");

			var convertLink =
				"https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=535&deploy=1&compid=1048144&recid=" +
				parseInt(customerInternalId);

			window.location.href = convertLink;
		});

		$(".lostnoresponse").click(function () {
			userId = $("#user_dropdown option:selected").val();
			var customerInternalId = $(this).attr("data-id");
			var salesrepid = $(this).attr("data-sales");
			var contactid = $(this).attr("data-contact");
			var contactEmail = $(this).attr("data-contactemail");
			var salesRecordId = $(this).attr("data-salesrecordid");

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});
			var time_now = format.parse({
				value: date,
				type: format.Type.TIMEOFDAY,
			});

			var recSales = record.load({
				type: "customrecord_sales",
				id: salesRecordId,
			});

			var sales_campaign_name = recSales.getText({
				fieldId: "custrecord_sales_campaign",
			});

			var phoneCallRecord = record.create({
				type: record.Type.PHONE_CALL,
			});
			phoneCallRecord.setValue({
				fieldId: "assigned",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_organiser",
				value: salesrepid,
			});
			phoneCallRecord.setValue({
				fieldId: "startdate",
				value: date_now,
			});
			phoneCallRecord.setValue({
				fieldId: "company",
				value: customerInternalId,
			});
			phoneCallRecord.setValue({
				fieldId: "status",
				value: "COMPLETE",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_type",
				value: 2,
			});
			phoneCallRecord.setValue({
				fieldId: "title",
				value: sales_campaign_name + " - Lost - No Response",
			});
			phoneCallRecord.setValue({
				fieldId: "message",
				value: "No answer",
			});
			phoneCallRecord.setValue({
				fieldId: "custevent_call_outcome",
				value: 3,
			});

			phoneCallRecord.save({
				ignoreMandatoryFields: true,
			});

			recSales.setValue({
				fieldId: "custrecord_sales_completed",
				value: true,
			});

			recSales.setValue({
				fieldId: "custrecord_sales_inuse",
				value: false,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_assigned",
				value: salesrepid,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_outcome",
				value: 10,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_attempt",
				value:
					parseInt(
						recSales.getValue({
							fieldId: "custrecord_sales_attempt",
						})
					) + 1,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_completedate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_lastcalldate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbackdate",
				value: date_now,
			});
			recSales.setValue({
				fieldId: "custrecord_sales_callbacktime",
				value: time_now,
			});

			recSales.save({
				ignoreMandatoryFields: true,
			});

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 59,
			});
			customer_record.setValue({
				fieldId: "custentity_service_cancellation_reason",
				value: 41,
			});
			customer_record.setValue({
				fieldId: "custentity13",
				value: date_now,
			});

			customer_record.setValue({
				fieldId: "custentity_date_lead_lost",
				value: date_now,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var val1 = currentRecord.get();

			val1.setValue({
				fieldId: "custpage_lostnoresponse",
				value: "true",
			});

			val1.setValue({
				fieldId: "custpage_customer_id",
				value: customerInternalId,
			});

			val1.setValue({
				fieldId: "custpage_sales_rep_id",
				value: salesrepid,
			});

			val1.setValue({
				fieldId: "custpage_contact_id",
				value: contactid,
			});

			val1.setValue({
				fieldId: "custpage_contact_email",
				value: contactEmail,
			});

			val1.setValue({
				fieldId: "custpage_salesrecordid",
				value: salesRecordId,
			});

			$("#submitter").trigger("click");

			// var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";

			// window.location.href = url;
		});

		// //Display the modal on click of the link on the table and prefill the fields  based on the customer record
		$("#customerOnboardingCompleted").click(function () {
			console.log("inside modal");
			var customerInternalId = $("#customerInternalID").val();
			var service_cancellation_reason = $(".service_cancellation_reason").val();

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			customer_record.setValue({
				fieldId: "entitystatus",
				value: 59,
			});

			var date = new Date();
			var date_now = format.parse({
				value: date,
				type: format.Type.DATE,
			});

			customer_record.setValue({
				fieldId: "custentity13",
				value: date_now,
			});

			customer_record.setValue({
				fieldId: "custentity_date_lead_lost",
				value: date_now,
			});

			customer_record.setValue({
				fieldId: "custentity_service_cancellation_reason",
				value: service_cancellation_reason,
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1659&deploy=1";
			window.location.href = url;

			return false;
		});

		//On click of close icon in the modal
		$(".close").click(function () {
			$("#myModal").hide();
		});
	}

	function adhocNewCustomers() {
		if (isNullorEmpty(invoiceType)) {
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1226&deploy=1";
		} else {
			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1226&deploy=1&invoicetype=" +
				invoiceType;
		}

		window.location.href = url;
	}

	//Initialise the DataTable with headers.
	function submitSearch() {
		// duringSubmit();

		dataTable = $("#mpexusage-prospects").DataTable({
			destroy: true,
			data: debtDataSet,
			scrollCollapse: true,
			// scrollY: '200px',
			pageLength: 1000,
			order: [[11, "des"]],
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
				// {
				// 	title: "Expand",
				// 	className: "dt-control",
				// 	orderable: false,
				// 	data: null,
				// 	defaultContent: "", //0
				// },
				{
					title: "LINK", //1
				},
				{
					title: "Customer Internal ID", //2
				},
				{
					title: "ID", //3
				},
				{
					title: "Company Name", //4
				},
				{
					title: "Franchisee", //5
				},
				{
					title: "Status", //6
				},
				{
					title: "Source", //7
				},
				{
					title: "Linked LPO", //8
				},
				{
					title: "Contact Name", //9
				},
				{
					title: "Email", //10
				},
				{
					title: "Phone Number", //11
				},
				{
					title: "Date Quote Sent", //12
				},
				{
					title: "48h Email Sent", //13
				},
				{
					title: "Sales Rep Assigned", //14
				},
				{
					title: "Date - 1st No Answer", //15
				},
				{
					title: "Date - 2nd No Answer", //16
				},
				{
					title: "Date - 3rd No Answer", //17
				},
				{
					title: "Color Code", //18
				},
				{
					title: "MP Product Usage/Week", //19
				},
				{
					title: "Send Sign Up Email", //20
				},
				{
					title: "Express Activated", //21
				},
				{
					title: "Standard Activated", //22
				},
				{
					title: "Premium Activated", //23
				},
				// {
				// 	title: "Child", //24
				// },
			],
			columnDefs: [
				{
					targets: [2, 3, 4, 5, 6, 7, 11, 12, 13, 20, 21, 22],
					className: "bolded",
				},
				{
					targets: [1, 14, 15, 16, 17, 18, 19],
					visible: false,
				},

			],
			rowCallback: function (row, data, index) {
				// if (!isNullorEmpty(data[10])) {
				if (isNullorEmpty(data[15])) {
					// $('td', row).css('background-color', '#FFFBC1');
				} else if (
					!isNullorEmpty(data[15]) &&
					isNullorEmpty(data[16]) &&
					isNullorEmpty(data[17])
				) {
					$("td", row).css("background-color", "#FEBE8C");
				} else if (
					!isNullorEmpty(data[15]) &&
					!isNullorEmpty(data[16]) &&
					isNullorEmpty(data[17])
				) {
					$("td", row).css("background-color", "#F7A4A4");
				} else if (
					!isNullorEmpty(data[15]) &&
					!isNullorEmpty(data[16]) &&
					!isNullorEmpty(data[17])
				) {
					$("td", row).css("background-color", "#E64848");
				}
				// }
			},
		});

		dataTable = $("#mpexusage-suspects").DataTable({
			destroy: true,
			data: debtDataSet4,
			pageLength: 1000,
			scrollCollapse: true,
			// scrollY: '200px',
			order: [[1, "asc"]],
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
				// {
				// 	title: "Expand",
				// 	className: "dt-control",
				// 	orderable: false,
				// 	data: null,
				// 	defaultContent: "", //0
				// },
				{
					title: "LINK", //1
				},
				{
					title: "Date Lead Entered", //2
				},
				{
					title: "Customer Internal ID", //3
				},
				{
					title: "ID", //4
				},
				{
					title: "Company Name", //5
				},
				{
					title: "Franchisee", //6
				},
				{
					title: "Status", //7
				},
				{
					title: "Source", //8
				},
				{
					title: "Linked LPO", //9
				},
				{
					title: "Contact Name", //10
				},
				{
					title: "Email", //11
				},
				{
					title: "Phone Number", //12
				},
				{
					title: "Services of Interest", //13
				},
				{
					title: "Sales Rep Assigned", //14
				},
				{
					title: "Date - 1st No Answer", //15
				},
				{
					title: "Date - 2nd No Answer", //16
				},
				{
					title: "Date - 3rd No Answer", //17
				},
				{
					title: "MP Product Usage/Week", //18
				},
				{
					title: "Send Sign Up Email", //19
				},
				{
					title: "Express Activated", //20
				},
				{
					title: "Standard Activated", //21
				},
				{
					title: "Premium Activated", //22
				},
				// {
				// 	title: "Child", //23
				// },
			],
			columnDefs: [
				{
					targets: [1, 3, 4, 5, 6, 7, 8, 19, 20, 21],
					className: "bolded",
				},
				{
					targets: [2, 12, 17, 14, 15, 16, 18],
					visible: false,
				},
			],
			rowCallback: function (row, data, index) {
				// if (isNullorEmpty(data[15])) {
				//     $('td', row).css('background-color', '#F7A4A4');
				// }

				console.log(data[20]);

				if (data[20] == "Yes") {
					$("td", row).eq(20).css("background-color", "#54bf9d");
				}
				if (data[21] == "Yes") {
					$("td", row).eq(21).css("background-color", "#54bf9d");
				}
				if (data[22] == "Yes") {
					$("td", row).eq(22).css("background-color", "#54bf9d");
				}
			},
		});

		zee = $("#zee_dropdown").val();

		loadDebtRecord(zee, userId);

		console.log("Loaded Results");
		afterSubmit();
	}

	//Function to add the filters and relaod the page
	function addFilters() {
		zee = $("#zee_dropdown").val();
		// userId = $('#user_dropdown option:selected').val();

		var url =
			baseURL +
			"/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=" +
			zee +
			"&user_id=" +
			userId;
		window.location.href = url;
	}

	function loadDebtRecord(zee_id, userId) {
		console.log("custStatus:" + custStatus);

		console.log("date_from: " + date_from);
		console.log("date_to " + date_to);
		console.log("custStatus " + custStatus);
		console.log("custStage " + custStage);
		console.log("paramUserId " + paramUserId);
		console.log("salesCampaign " + salesCampaign);
		console.log("userId: " + userId);
		console.log("parentLPOInternalId: " + parentLPOInternalId);

		salesCampaign = JSON.parse("[" + salesCampaign + "]");
		parentLPOInternalId = JSON.parse("[" + parentLPOInternalId + "]");
		zee_id = JSON.parse("[" + zee_id + "]");

		if (custStage == "1") {
			console.log("INSIDE SUSPECTS STAGE");
			//Website Leads - Suspects
			var suspectsSearch = search.load({
				type: "customer",
				id: "customsearch_web_leads_suspects",
			});

			if (!isNullorEmpty(zee_id)) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			if (!isNullorEmpty(paramUserId)) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: paramUserId,
					})
				);
			} else if (
				role != 3 &&
				isNullorEmpty(paramUserId) &&
				userId != 653718 &&
				userId != 668711
			) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: userId,
					})
				);
			}

			if (!isNullorEmpty(salesCampaign)) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: salesCampaign,
					})
				);
			}

			if (!isNullorEmpty(custStatus) && custStatus != "0") {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: custStatus,
					})
				);
			}

			if (!isNullorEmpty(source)) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.IS,
						values: source,
					})
				);
			}

			if (!isNullorEmpty(parentLPOInternalId)) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parentLPOInternalId,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				suspectsSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				suspectsSearch.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			var suspectsSearchCount = suspectsSearch.runPaged().count;

			console.log("suspects count: " + suspectsSearchCount);

			if (suspectsSearchCount > 25) {
				var val1 = currentRecord.get();
				var page_no = val1.getValue({
					fieldId: "custpage_page_no",
				});

				var totalPageCount = parseInt(suspectsSearchCount / 25) + 1;
				var rangeStart = (parseInt(page_no) - 1) * 26;
				var rangeEnd = rangeStart + 25;

				val1.setValue({
					fieldId: "custpage_total_page_no",
					value: totalPageCount,
				});

				console.log("start: " + rangeStart);
				console.log("end: " + rangeEnd);

				var suspectsSearchResultSet = suspectsSearch.run().getRange({
					start: rangeStart,
					end: rangeEnd,
				});

				for (var i = 0; i < suspectsSearchResultSet.length; i++) {
					var custInternalID = suspectsSearchResultSet[i].getValue({
						name: "internalid",
					});
					var custEntityID = suspectsSearchResultSet[i].getValue({
						name: "entityid",
					});
					var custName = suspectsSearchResultSet[i].getValue({
						name: "companyname",
					});
					var zeeID = suspectsSearchResultSet[i].getValue({
						name: "partner",
					});
					var zeeName = suspectsSearchResultSet[i].getText({
						name: "partner",
					});

					var dateLeadEntered = suspectsSearchResultSet[i].getValue({
						name: "custentity_date_lead_entered",
					});

					var email = suspectsSearchResultSet[i].getValue({
						name: "email",
					});
					var serviceEmail = suspectsSearchResultSet[i].getValue({
						name: "custentity_email_service",
					});

					var phone = suspectsSearchResultSet[i].getValue({
						name: "phone",
					});

					var statusText = suspectsSearchResultSet[i].getText({
						name: "entitystatus",
					});

					var salesRepId = suspectsSearchResultSet[i].getValue({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var salesRepName = suspectsSearchResultSet[i].getText({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateFirstNoContact = suspectsSearchResultSet[i].getValue({
						name: "custrecord_sales_day0call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateSecondNoContact = suspectsSearchResultSet[i].getValue({
						name: "custrecord_sales_day14call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateThirdNoContact = suspectsSearchResultSet[i].getValue({
						name: "custrecord_sales_day25call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var contactid = suspectsSearchResultSet[i].getValue({
						name: "internalid",
						join: "contactPrimary",
					});

					var contactName = suspectsSearchResultSet[i].getValue({
						name: "entityid",
						join: "contactPrimary",
					});

					var contactEmail = suspectsSearchResultSet[i].getValue({
						name: "email",
						join: "contactPrimary",
					});

					var email48h = suspectsSearchResultSet[i].getText({
						name: "custentity_48h_email_sent",
					});

					var servicesOfInterest = suspectsSearchResultSet[i].getText({
						name: "custentity_services_of_interest",
					});

					var salesRecordId = suspectsSearchResultSet[i].getText({
						name: "internalid",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var productUsageperWeek = suspectsSearchResultSet[i].getText({
						name: "custentity_form_mpex_usage_per_week",
					});

					var leadSource = suspectsSearchResultSet[i].getText({
						name: "leadsource",
					});

					var linkedLPOName = suspectsSearchResultSet[i].getText({
						name: "custentity_lpo_parent_account",
					});

					var zeeMpExpActivated = suspectsSearchResultSet[i].getText({
						name: "custentity_zee_mp_exp_activated",
						join: "partner",
					});
					if (isNullorEmpty(zeeMpExpActivated)) {
						zeeMpExpActivated = "Yes";
					}
					var zeeMPStdActivated = suspectsSearchResultSet[i].getText({
						name: "custentity_zee_mp_std_activated",
						join: "partner",
					});
					var zeeMPPrmActivated = suspectsSearchResultSet[i].getText({
						name: "custentity_zee_mp_str_activated",
						join: "partner",
					});

					// if (sales_activity_notes == 1) {
					// 	//Website Leads - Suspects - Activity List
					// 	var suspectActivityListSearch = search.load({
					// 		type: "customer",
					// 		id: "customsearch_web_leads_prosp_quote_sen_9",
					// 	});

					// 	suspectActivityListSearch.filters.push(
					// 		search.createFilter({
					// 			name: "internalid",
					// 			join: null,
					// 			operator: search.Operator.ANYOF,
					// 			values: custInternalID,
					// 		})
					// 	);

					// 	var suspectChildDataSet = [];

					// 	suspectActivityListSearch
					// 		.run()
					// 		.each(function (suspectActivityListSearchResultSet) {
					// 			var activityInternalID =
					// 				suspectActivityListSearchResultSet.getValue({
					// 					name: "internalid",
					// 					join: "activity",
					// 				});
					// 			var activityStartDate =
					// 				suspectActivityListSearchResultSet.getValue({
					// 					name: "startdate",
					// 					join: "activity",
					// 				});
					// 			var activityTitle = suspectActivityListSearchResultSet.getValue(
					// 				{
					// 					name: "title",
					// 					join: "activity",
					// 				}
					// 			);
					// 			if (
					// 				isNullorEmpty(
					// 					suspectActivityListSearchResultSet.getText({
					// 						name: "custevent_organiser",
					// 						join: "activity",
					// 					})
					// 				)
					// 			) {
					// 				var activityOrganiser =
					// 					suspectActivityListSearchResultSet.getText({
					// 						name: "assigned",
					// 						join: "activity",
					// 					});
					// 			} else {
					// 				var activityOrganiser =
					// 					suspectActivityListSearchResultSet.getText({
					// 						name: "custevent_organiser",
					// 						join: "activity",
					// 					});
					// 			}

					// 			var activityMessage =
					// 				suspectActivityListSearchResultSet.getValue({
					// 					name: "message",
					// 					join: "activity",
					// 				});

					// 			if (!isNullorEmpty(activityTitle)) {
					// 				suspectChildDataSet.push({
					// 					activityInternalID: activityInternalID,
					// 					activityStartDate: activityStartDate,
					// 					activityTitle: activityTitle,
					// 					activityOrganiser: activityOrganiser,
					// 					activityMessage: activityMessage,
					// 				});
					// 			}

					// 			return true;
					// 		});
					// } else {
					// 	var suspectChildDataSet = [];
					// }

					// console.log(
					// 	"suspectChildDataSet: " + JSON.stringify(suspectChildDataSet)
					// );

					debt_set4.push({
						custInternalID: custInternalID,
						custEntityID: custEntityID,
						custName: custName,
						zeeID: zeeID,
						zeeName: zeeName,
						dateLeadEntered: dateLeadEntered,
						contactName: contactName,
						email: email,
						serviceEmail: serviceEmail,
						phone: phone,
						statusText: statusText,
						leadSource: leadSource,
						linkedLPOName: linkedLPOName,
						salesRepId: salesRepId,
						salesRepName: salesRepName,
						dateFirstNoContact: dateFirstNoContact,
						dateSecondNoContact: dateSecondNoContact,
						dateThirdNoContact: dateThirdNoContact,
						contactid: contactid,
						contactEmail: contactEmail,
						servicesOfInterest: servicesOfInterest,
						salesRecordId: salesRecordId,
						productUsageperWeek: productUsageperWeek,
						zeeMpExpActivated: zeeMpExpActivated,
						zeeMPStdActivated: zeeMPStdActivated,
						zeeMPPrmActivated: zeeMPPrmActivated,
						// child: suspectChildDataSet,
					});
				}
			} else {
				suspectsSearch.run().each(function (suspectsSearchResultSet) {
					var custInternalID = suspectsSearchResultSet.getValue({
						name: "internalid",
					});
					var custEntityID = suspectsSearchResultSet.getValue({
						name: "entityid",
					});
					var custName = suspectsSearchResultSet.getValue({
						name: "companyname",
					});
					var zeeID = suspectsSearchResultSet.getValue({
						name: "partner",
					});
					var zeeName = suspectsSearchResultSet.getText({
						name: "partner",
					});

					var dateLeadEntered = suspectsSearchResultSet.getValue({
						name: "custentity_date_lead_entered",
					});

					var email = suspectsSearchResultSet.getValue({
						name: "email",
					});
					var serviceEmail = suspectsSearchResultSet.getValue({
						name: "custentity_email_service",
					});

					var phone = suspectsSearchResultSet.getValue({
						name: "phone",
					});

					var statusText = suspectsSearchResultSet.getText({
						name: "entitystatus",
					});

					var salesRepId = suspectsSearchResultSet.getValue({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var salesRepName = suspectsSearchResultSet.getText({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateFirstNoContact = suspectsSearchResultSet.getValue({
						name: "custrecord_sales_day0call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateSecondNoContact = suspectsSearchResultSet.getValue({
						name: "custrecord_sales_day14call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateThirdNoContact = suspectsSearchResultSet.getValue({
						name: "custrecord_sales_day25call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var contactid = suspectsSearchResultSet.getValue({
						name: "internalid",
						join: "contactPrimary",
					});

					var contactName = suspectsSearchResultSet.getValue({
						name: "entityid",
						join: "contactPrimary",
					});

					var contactEmail = suspectsSearchResultSet.getValue({
						name: "email",
						join: "contactPrimary",
					});

					var email48h = suspectsSearchResultSet.getText({
						name: "custentity_48h_email_sent",
					});

					var servicesOfInterest = suspectsSearchResultSet.getText({
						name: "custentity_services_of_interest",
					});

					var salesRecordId = suspectsSearchResultSet.getText({
						name: "internalid",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var productUsageperWeek = suspectsSearchResultSet.getText({
						name: "custentity_form_mpex_usage_per_week",
					});

					var leadSource = suspectsSearchResultSet.getText({
						name: "leadsource",
					});

					var linkedLPOName = suspectsSearchResultSet.getText({
						name: "custentity_lpo_parent_account",
					});

					var zeeMpExpActivated = suspectsSearchResultSet.getText({
						name: "custentity_zee_mp_exp_activated",
						join: "partner",
					});
					if (isNullorEmpty(zeeMpExpActivated)) {
						zeeMpExpActivated = "Yes";
					}
					var zeeMPStdActivated = suspectsSearchResultSet.getText({
						name: "custentity_zee_mp_std_activated",
						join: "partner",
					});
					var zeeMPPrmActivated = suspectsSearchResultSet.getText({
						name: "custentity_zee_mp_str_activated",
						join: "partner",
					});

					// if (sales_activity_notes == 1) {
					// 	//Website Leads - Suspects - Activity List
					// 	var suspectActivityListSearch = search.load({
					// 		type: "customer",
					// 		id: "customsearch_web_leads_prosp_quote_sen_9",
					// 	});

					// 	suspectActivityListSearch.filters.push(
					// 		search.createFilter({
					// 			name: "internalid",
					// 			join: null,
					// 			operator: search.Operator.ANYOF,
					// 			values: custInternalID,
					// 		})
					// 	);

					// 	var suspectChildDataSet = [];

					// 	suspectActivityListSearch
					// 		.run()
					// 		.each(function (suspectActivityListSearchResultSet) {
					// 			var activityInternalID =
					// 				suspectActivityListSearchResultSet.getValue({
					// 					name: "internalid",
					// 					join: "activity",
					// 				});
					// 			var activityStartDate =
					// 				suspectActivityListSearchResultSet.getValue({
					// 					name: "startdate",
					// 					join: "activity",
					// 				});
					// 			var activityTitle = suspectActivityListSearchResultSet.getValue(
					// 				{
					// 					name: "title",
					// 					join: "activity",
					// 				}
					// 			);
					// 			if (
					// 				isNullorEmpty(
					// 					suspectActivityListSearchResultSet.getText({
					// 						name: "custevent_organiser",
					// 						join: "activity",
					// 					})
					// 				)
					// 			) {
					// 				var activityOrganiser =
					// 					suspectActivityListSearchResultSet.getText({
					// 						name: "assigned",
					// 						join: "activity",
					// 					});
					// 			} else {
					// 				var activityOrganiser =
					// 					suspectActivityListSearchResultSet.getText({
					// 						name: "custevent_organiser",
					// 						join: "activity",
					// 					});
					// 			}

					// 			var activityMessage =
					// 				suspectActivityListSearchResultSet.getValue({
					// 					name: "message",
					// 					join: "activity",
					// 				});

					// 			if (!isNullorEmpty(activityTitle)) {
					// 				suspectChildDataSet.push({
					// 					activityInternalID: activityInternalID,
					// 					activityStartDate: activityStartDate,
					// 					activityTitle: activityTitle,
					// 					activityOrganiser: activityOrganiser,
					// 					activityMessage: activityMessage,
					// 				});
					// 			}

					// 			return true;
					// 		});
					// } else {
					// 	var suspectChildDataSet = [];
					// }

					// console.log(
					// 	"suspectChildDataSet: " + JSON.stringify(suspectChildDataSet)
					// );

					debt_set4.push({
						custInternalID: custInternalID,
						custEntityID: custEntityID,
						custName: custName,
						zeeID: zeeID,
						zeeName: zeeName,
						dateLeadEntered: dateLeadEntered,
						contactName: contactName,
						email: email,
						serviceEmail: serviceEmail,
						phone: phone,
						statusText: statusText,
						leadSource: leadSource,
						linkedLPOName: linkedLPOName,
						salesRepId: salesRepId,
						salesRepName: salesRepName,
						dateFirstNoContact: dateFirstNoContact,
						dateSecondNoContact: dateSecondNoContact,
						dateThirdNoContact: dateThirdNoContact,
						contactid: contactid,
						contactEmail: contactEmail,
						servicesOfInterest: servicesOfInterest,
						salesRecordId: salesRecordId,
						productUsageperWeek: productUsageperWeek,
						zeeMpExpActivated: zeeMpExpActivated,
						zeeMPStdActivated: zeeMPStdActivated,
						zeeMPPrmActivated: zeeMPPrmActivated,
						// child: suspectChildDataSet,
					});

					return true;
				});
				console.log(debt_set4);
			}
		} else if (custStage == "2") {
			//Website Leads - Prospect Quote Sent
			var custListCommenceTodayResults = search.load({
				type: "customer",
				id: "customsearch_web_leads_prosp_quote_sent",
			});

			if (!isNullorEmpty(zee_id)) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "partner",
						join: null,
						operator: search.Operator.IS,
						values: zee_id,
					})
				);
			}

			console.log("userId: " + userId);

			if (!isNullorEmpty(paramUserId)) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: paramUserId,
					})
				);
			} else if (
				role != 3 &&
				isNullorEmpty(paramUserId) &&
				userId != 653718 &&
				userId != 668711
			) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "custrecord_sales_assigned",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: userId,
					})
				);
			}

			if (!isNullorEmpty(salesCampaign)) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "custrecord_sales_campaign",
						join: "custrecord_sales_customer",
						operator: search.Operator.IS,
						values: salesCampaign,
					})
				);
			}

			if (!isNullorEmpty(custStatus) && custStatus != "0") {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "entitystatus",
						join: null,
						operator: search.Operator.IS,
						values: custStatus,
					})
				);
			}

			if (!isNullorEmpty(source)) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "leadsource",
						join: null,
						operator: search.Operator.IS,
						values: source,
					})
				);
			}

			if (!isNullorEmpty(parentLPOInternalId)) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "internalid",
						join: "custentity_lpo_parent_account",
						operator: search.Operator.ANYOF,
						values: parentLPOInternalId,
					})
				);
			}

			if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORAFTER,
						values: date_from,
					})
				);

				custListCommenceTodayResults.filters.push(
					search.createFilter({
						name: "custentity_date_lead_entered",
						join: null,
						operator: search.Operator.ONORBEFORE,
						values: date_to,
					})
				);
			}

			var prospectsSearchCount = custListCommenceTodayResults.runPaged().count;

			console.log("prospects count: " + prospectsSearchCount);

			if (prospectsSearchCount > 25) {
				var val1 = currentRecord.get();
				var page_no = val1.getValue({
					fieldId: "custpage_page_no",
				});

				var totalPageCount = parseInt(prospectsSearchCount / 25) + 1;
				var rangeStart = (parseInt(page_no) - 1) * 26;
				var rangeEnd = rangeStart + 25;

				val1.setValue({
					fieldId: "custpage_total_page_no",
					value: totalPageCount,
				});

				console.log("start: " + rangeStart);
				console.log("end: " + rangeEnd);

				var custListCommenceTodayResults = custListCommenceTodayResults
					.run()
					.getRange({
						start: rangeStart,
						end: rangeEnd,
					});

				for (var i = 0; i < custListCommenceTodayResults.length; i++) {
					var custInternalID = custListCommenceTodayResults[i].getValue({
						name: "internalid",
					});
					var custEntityID = custListCommenceTodayResults[i].getValue({
						name: "entityid",
					});
					var custName = custListCommenceTodayResults[i].getValue({
						name: "companyname",
					});
					var zeeID = custListCommenceTodayResults[i].getValue({
						name: "partner",
					});
					var zeeName = custListCommenceTodayResults[i].getText({
						name: "partner",
					});

					var quoteSentDate = custListCommenceTodayResults[i].getValue({
						name: "custentity_date_lead_quote_sent",
					});

					var email = custListCommenceTodayResults[i].getValue({
						name: "email",
					});
					var serviceEmail = custListCommenceTodayResults[i].getValue({
						name: "custentity_email_service",
					});

					var phone = custListCommenceTodayResults[i].getValue({
						name: "phone",
					});

					var statusText = custListCommenceTodayResults[i].getText({
						name: "entitystatus",
					});

					var salesRepId = custListCommenceTodayResults[i].getValue({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var salesRepName = custListCommenceTodayResults[i].getText({
						name: "custrecord_sales_assigned",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateFirstNoContact = custListCommenceTodayResults[i].getValue({
						name: "custrecord_sales_day0call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateSecondNoContact = custListCommenceTodayResults[i].getValue({
						name: "custrecord_sales_day14call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var dateThirdNoContact = custListCommenceTodayResults[i].getValue({
						name: "custrecord_sales_day25call",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var contactid = custListCommenceTodayResults[i].getValue({
						name: "internalid",
						join: "contact",
					});

					var contactName = custListCommenceTodayResults[i].getValue({
						name: "entityid",
						join: "contact",
					});

					var contactEmail = custListCommenceTodayResults[i].getValue({
						name: "email",
						join: "contact",
					});

					var email48h = custListCommenceTodayResults[i].getText({
						name: "custentity_48h_email_sent",
					});

					var salesRecordId = custListCommenceTodayResults[i].getText({
						name: "internalid",
						join: "CUSTRECORD_SALES_CUSTOMER",
					});

					var productUsageperWeek = custListCommenceTodayResults[i].getText({
						name: "custentity_form_mpex_usage_per_week",
					});

					var leadSource = custListCommenceTodayResults[i].getText({
						name: "leadsource",
					});

					var linkedLPOName = custListCommenceTodayResults[i].getText({
						name: "custentity_lpo_parent_account",
					});

					var zeeMpExpActivated = custListCommenceTodayResults[i].getText({
						name: "custentity_zee_mp_exp_activated",
						join: "partner",
					});
					if (isNullorEmpty(zeeMpExpActivated)) {
						zeeMpExpActivated = "Yes";
					}
					var zeeMPStdActivated = custListCommenceTodayResults[i].getText({
						name: "custentity_zee_mp_std_activated",
						join: "partner",
					});
					var zeeMPPrmActivated = custListCommenceTodayResults[i].getText({
						name: "custentity_zee_mp_str_activated",
						join: "partner",
					});

					var rowColorSort = null;

					// if (!isNullorEmpty(email48h)) {
					if (isNullorEmpty(dateFirstNoContact)) {
						rowColorSort = 1;
					} else if (
						!isNullorEmpty(dateFirstNoContact) &&
						isNullorEmpty(dateSecondNoContact) &&
						isNullorEmpty(dateThirdNoContact)
					) {
						rowColorSort = 2;
					} else if (
						!isNullorEmpty(dateFirstNoContact) &&
						!isNullorEmpty(dateSecondNoContact) &&
						isNullorEmpty(dateThirdNoContact)
					) {
						rowColorSort = 3;
					} else if (
						!isNullorEmpty(dateFirstNoContact) &&
						!isNullorEmpty(dateSecondNoContact) &&
						!isNullorEmpty(dateThirdNoContact)
					) {
						rowColorSort = 4;
					}
					// }

					// if (sales_activity_notes == 1) {
					// 	//Website Leads - Prospect Quote Sent - Activity List
					// 	var prospectQuoteSentActivityListSearch = search.load({
					// 		type: "customer",
					// 		id: "customsearch_web_leads_prosp_quote_sen_8",
					// 	});

					// 	prospectQuoteSentActivityListSearch.filters.push(
					// 		search.createFilter({
					// 			name: "internalid",
					// 			join: null,
					// 			operator: search.Operator.ANYOF,
					// 			values: custInternalID,
					// 		})
					// 	);

					// 	var prospectQuoteChildDataSet = [];

					// 	prospectQuoteSentActivityListSearch
					// 		.run()
					// 		.each(function (prospectQuoteSentActivityListSearchResultSet) {
					// 			var activityInternalID =
					// 				prospectQuoteSentActivityListSearchResultSet.getValue({
					// 					name: "internalid",
					// 					join: "activity",
					// 				});
					// 			var activityStartDate =
					// 				prospectQuoteSentActivityListSearchResultSet.getValue({
					// 					name: "startdate",
					// 					join: "activity",
					// 				});
					// 			var activityTitle =
					// 				prospectQuoteSentActivityListSearchResultSet.getValue({
					// 					name: "title",
					// 					join: "activity",
					// 				});
					// 			if (
					// 				isNullorEmpty(
					// 					prospectQuoteSentActivityListSearchResultSet.getText({
					// 						name: "custevent_organiser",
					// 						join: "activity",
					// 					})
					// 				)
					// 			) {
					// 				var activityOrganiser =
					// 					prospectQuoteSentActivityListSearchResultSet.getText({
					// 						name: "assigned",
					// 						join: "activity",
					// 					});
					// 			} else {
					// 				var activityOrganiser =
					// 					prospectQuoteSentActivityListSearchResultSet.getText({
					// 						name: "custevent_organiser",
					// 						join: "activity",
					// 					});
					// 			}

					// 			var activityMessage =
					// 				prospectQuoteSentActivityListSearchResultSet.getValue({
					// 					name: "message",
					// 					join: "activity",
					// 				});

					// 			console.log("activityInternalID: " + activityInternalID);
					// 			console.log("activityTitle: " + activityTitle);
					// 			console.log("activityMessage: " + activityMessage);

					// 			if (!isNullorEmpty(activityTitle)) {
					// 				prospectQuoteChildDataSet.push({
					// 					activityInternalID: activityInternalID,
					// 					activityStartDate: activityStartDate,
					// 					activityTitle: activityTitle,
					// 					activityOrganiser: activityOrganiser,
					// 					activityMessage: activityMessage,
					// 				});
					// 			}

					// 			console.log(
					// 				"prospectQuoteChildDataSet: " +
					// 					JSON.stringify(prospectQuoteChildDataSet)
					// 			);

					// 			return true;
					// 		});
					// } else {
					// 	var prospectQuoteChildDataSet = [];
					// }

					// console.log(
					// 	"prospectQuoteChildDataSet: " +
					// 		JSON.stringify(prospectQuoteChildDataSet)
					// );

					debt_set.push({
						custInternalID: custInternalID,
						custEntityID: custEntityID,
						custName: custName,
						zeeID: zeeID,
						zeeName: zeeName,
						quoteSentDate: quoteSentDate,
						contactName: contactName,
						email: email,
						serviceEmail: serviceEmail,
						phone: phone,
						statusText: statusText,
						leadSource: leadSource,
						linkedLPOName: linkedLPOName,
						salesRepId: salesRepId,
						salesRepName: salesRepName,
						dateFirstNoContact: dateFirstNoContact,
						dateSecondNoContact: dateSecondNoContact,
						dateThirdNoContact: dateThirdNoContact,
						rowColorSort: rowColorSort,
						contactid: contactid,
						contactEmail: contactEmail,
						email48h: email48h,
						salesRecordId: salesRecordId,
						productUsageperWeek: productUsageperWeek,
						zeeMpExpActivated: zeeMpExpActivated,
						zeeMPStdActivated: zeeMPStdActivated,
						zeeMPPrmActivated: zeeMPPrmActivated,
						// child: prospectQuoteChildDataSet,
					});
				}
			} else {
				custListCommenceTodayResults
					.run()
					.each(function (custListCommenceTodaySet) {
						var custInternalID = custListCommenceTodaySet.getValue({
							name: "internalid",
						});
						var custEntityID = custListCommenceTodaySet.getValue({
							name: "entityid",
						});
						var custName = custListCommenceTodaySet.getValue({
							name: "companyname",
						});
						var zeeID = custListCommenceTodaySet.getValue({
							name: "partner",
						});
						var zeeName = custListCommenceTodaySet.getText({
							name: "partner",
						});

						var quoteSentDate = custListCommenceTodaySet.getValue({
							name: "custentity_date_lead_quote_sent",
						});

						var email = custListCommenceTodaySet.getValue({
							name: "email",
						});
						var serviceEmail = custListCommenceTodaySet.getValue({
							name: "custentity_email_service",
						});

						var phone = custListCommenceTodaySet.getValue({
							name: "phone",
						});

						var statusText = custListCommenceTodaySet.getText({
							name: "entitystatus",
						});

						var salesRepId = custListCommenceTodaySet.getValue({
							name: "custrecord_sales_assigned",
							join: "CUSTRECORD_SALES_CUSTOMER",
						});

						var salesRepName = custListCommenceTodaySet.getText({
							name: "custrecord_sales_assigned",
							join: "CUSTRECORD_SALES_CUSTOMER",
						});

						var dateFirstNoContact = custListCommenceTodaySet.getValue({
							name: "custrecord_sales_day0call",
							join: "CUSTRECORD_SALES_CUSTOMER",
						});

						var dateSecondNoContact = custListCommenceTodaySet.getValue({
							name: "custrecord_sales_day14call",
							join: "CUSTRECORD_SALES_CUSTOMER",
						});

						var dateThirdNoContact = custListCommenceTodaySet.getValue({
							name: "custrecord_sales_day25call",
							join: "CUSTRECORD_SALES_CUSTOMER",
						});

						var contactid = custListCommenceTodaySet.getValue({
							name: "internalid",
							join: "contact",
						});

						var contactName = custListCommenceTodaySet.getValue({
							name: "entityid",
							join: "contact",
						});

						var contactEmail = custListCommenceTodaySet.getValue({
							name: "email",
							join: "contact",
						});

						var email48h = custListCommenceTodaySet.getText({
							name: "custentity_48h_email_sent",
						});

						var salesRecordId = custListCommenceTodaySet.getText({
							name: "internalid",
							join: "CUSTRECORD_SALES_CUSTOMER",
						});

						var productUsageperWeek = custListCommenceTodaySet.getText({
							name: "custentity_form_mpex_usage_per_week",
						});

						var leadSource = custListCommenceTodaySet.getText({
							name: "leadsource",
						});

						var linkedLPOName = custListCommenceTodaySet.getText({
							name: "custentity_lpo_parent_account",
						});

						var zeeMpExpActivated = custListCommenceTodaySet.getText({
							name: "custentity_zee_mp_exp_activated",
							join: "partner",
						});
						if (isNullorEmpty(zeeMpExpActivated)) {
							zeeMpExpActivated = "Yes";
						}
						var zeeMPStdActivated = custListCommenceTodaySet.getText({
							name: "custentity_zee_mp_std_activated",
							join: "partner",
						});
						var zeeMPPrmActivated = custListCommenceTodaySet.getText({
							name: "custentity_zee_mp_str_activated",
							join: "partner",
						});

						var rowColorSort = null;

						// if (!isNullorEmpty(email48h)) {
						if (isNullorEmpty(dateFirstNoContact)) {
							rowColorSort = 1;
						} else if (
							!isNullorEmpty(dateFirstNoContact) &&
							isNullorEmpty(dateSecondNoContact) &&
							isNullorEmpty(dateThirdNoContact)
						) {
							rowColorSort = 2;
						} else if (
							!isNullorEmpty(dateFirstNoContact) &&
							!isNullorEmpty(dateSecondNoContact) &&
							isNullorEmpty(dateThirdNoContact)
						) {
							rowColorSort = 3;
						} else if (
							!isNullorEmpty(dateFirstNoContact) &&
							!isNullorEmpty(dateSecondNoContact) &&
							!isNullorEmpty(dateThirdNoContact)
						) {
							rowColorSort = 4;
						}
						// }

						// if (sales_activity_notes == 1) {
						// 	//Website Leads - Prospect Quote Sent - Activity List
						// 	var prospectQuoteSentActivityListSearch = search.load({
						// 		type: "customer",
						// 		id: "customsearch_web_leads_prosp_quote_sen_8",
						// 	});

						// 	prospectQuoteSentActivityListSearch.filters.push(
						// 		search.createFilter({
						// 			name: "internalid",
						// 			join: null,
						// 			operator: search.Operator.ANYOF,
						// 			values: custInternalID,
						// 		})
						// 	);

						// 	var prospectQuoteChildDataSet = [];

						// 	prospectQuoteSentActivityListSearch
						// 		.run()
						// 		.each(function (prospectQuoteSentActivityListSearchResultSet) {
						// 			var activityInternalID =
						// 				prospectQuoteSentActivityListSearchResultSet.getValue({
						// 					name: "internalid",
						// 					join: "activity",
						// 				});
						// 			var activityStartDate =
						// 				prospectQuoteSentActivityListSearchResultSet.getValue({
						// 					name: "startdate",
						// 					join: "activity",
						// 				});
						// 			var activityTitle =
						// 				prospectQuoteSentActivityListSearchResultSet.getValue({
						// 					name: "title",
						// 					join: "activity",
						// 				});
						// 			if (
						// 				isNullorEmpty(
						// 					prospectQuoteSentActivityListSearchResultSet.getText({
						// 						name: "custevent_organiser",
						// 						join: "activity",
						// 					})
						// 				)
						// 			) {
						// 				var activityOrganiser =
						// 					prospectQuoteSentActivityListSearchResultSet.getText({
						// 						name: "assigned",
						// 						join: "activity",
						// 					});
						// 			} else {
						// 				var activityOrganiser =
						// 					prospectQuoteSentActivityListSearchResultSet.getText({
						// 						name: "custevent_organiser",
						// 						join: "activity",
						// 					});
						// 			}

						// 			var activityMessage =
						// 				prospectQuoteSentActivityListSearchResultSet.getValue({
						// 					name: "message",
						// 					join: "activity",
						// 				});

						// 			console.log("activityInternalID: " + activityInternalID);
						// 			console.log("activityTitle: " + activityTitle);
						// 			console.log("activityMessage: " + activityMessage);

						// 			if (!isNullorEmpty(activityTitle)) {
						// 				prospectQuoteChildDataSet.push({
						// 					activityInternalID: activityInternalID,
						// 					activityStartDate: activityStartDate,
						// 					activityTitle: activityTitle,
						// 					activityOrganiser: activityOrganiser,
						// 					activityMessage: activityMessage,
						// 				});
						// 			}

						// 			console.log(
						// 				"prospectQuoteChildDataSet: " +
						// 					JSON.stringify(prospectQuoteChildDataSet)
						// 			);

						// 			return true;
						// 		});
						// } else {
						// 	var prospectQuoteChildDataSet = [];
						// }

						// console.log(
						// 	"prospectQuoteChildDataSet: " +
						// 		JSON.stringify(prospectQuoteChildDataSet)
						// );

						debt_set.push({
							custInternalID: custInternalID,
							custEntityID: custEntityID,
							custName: custName,
							zeeID: zeeID,
							zeeName: zeeName,
							quoteSentDate: quoteSentDate,
							contactName: contactName,
							email: email,
							serviceEmail: serviceEmail,
							phone: phone,
							statusText: statusText,
							leadSource: leadSource,
							linkedLPOName: linkedLPOName,
							salesRepId: salesRepId,
							salesRepName: salesRepName,
							dateFirstNoContact: dateFirstNoContact,
							dateSecondNoContact: dateSecondNoContact,
							dateThirdNoContact: dateThirdNoContact,
							rowColorSort: rowColorSort,
							contactid: contactid,
							contactEmail: contactEmail,
							email48h: email48h,
							salesRecordId: salesRecordId,
							productUsageperWeek: productUsageperWeek,
							zeeMpExpActivated: zeeMpExpActivated,
							zeeMPStdActivated: zeeMPStdActivated,
							zeeMPPrmActivated: zeeMPPrmActivated,
							// child: prospectQuoteChildDataSet,
						});

						return true;
					});
			}

			console.log(debt_set);
		}

		loadDatatable(debt_set, debt_set4);
		debt_set = [];
	}

	function loadDatatable(debt_rows, debt_rows4) {
		debtDataSet = [];
		csvSet = [];

		debtDataSet2 = [];
		csvSet2 = [];

		var callCenterPage =
			"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Call Center</title><g id='phone_call_fill' fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#09244BFF' d='M6.857 2.445C8 3.278 8.89 4.415 9.65 5.503l.442.644.417.615a1.504 1.504 0 0 1-.256 1.986l-1.951 1.449a.48.48 0 0 0-.142.616c.442.803 1.228 1.999 2.128 2.899.901.9 2.153 1.738 3.012 2.23a.483.483 0 0 0 .644-.162l1.27-1.933a1.503 1.503 0 0 1 2.056-.332l.663.459c1.239.86 2.57 1.837 3.588 3.14a1.47 1.47 0 0 1 .189 1.484c-.837 1.953-2.955 3.616-5.158 3.535l-.3-.017-.233-.02-.258-.03-.281-.038-.305-.05a11.66 11.66 0 0 1-.16-.03l-.336-.072a12.399 12.399 0 0 1-.176-.04l-.366-.094-.385-.11-.402-.13c-1.846-.626-4.189-1.856-6.593-4.26-2.403-2.403-3.633-4.746-4.259-6.592l-.13-.402-.11-.385-.094-.366-.078-.346a11.79 11.79 0 0 1-.063-.326l-.05-.305-.04-.281-.029-.258-.02-.233-.016-.3c-.081-2.196 1.6-4.329 3.544-5.162a1.47 1.47 0 0 1 1.445.159m8.135 3.595.116.013a3.5 3.5 0 0 1 2.858 2.96 1 1 0 0 1-1.958.393l-.023-.115a1.5 1.5 0 0 0-1.07-1.233l-.155-.035a1 1 0 0 1 .232-1.983M15 3a6 6 0 0 1 6 6 1 1 0 0 1-1.993.117L19 9a3.998 3.998 0 0 0-3.738-3.991L15 5a1 1 0 1 1 0-2'/></g></svg>";

		if (!isNullorEmpty(debt_rows)) {
			debt_rows.forEach(function (debt_row, index) {
				if (!isNullorEmpty(debt_row.salesRecordId)) {
					var linkURL =
						'<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1900&deploy=1&compid=1048144&callCenter=T&customerId=' +
						debt_row.custInternalID +
						"&salesRecordId=" +
						debt_row.salesRecordId +
						'&refresh=tasks" target="_blank" class="form-control btn btn-xs btn-primary" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						callCenterPage +
						"</a>";
				} else {
					var linkURL =
						'<input type="button" id="" data-id="' +
						debt_row.custInternalID +
						'" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />';
				}

				var customerIDLink =
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					debt_row.custInternalID +
					'&whence=" target="_blank"><b>' +
					debt_row.custEntityID +
					"</b></a>";

				var sendSignUpEmail =
					'<a data-id="' +
					debt_row.custInternalID +
					'" data-sales="' +
					debt_row.salesRepId +
					'" data-contact="' +
					debt_row.contactid +
					'" data-contactemail="' +
					debt_row.contactEmail +
					'" data-salesrecordid="' +
					debt_row.salesRecordId +
					'" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

				var commDateSplit = debt_row.quoteSentDate.split("/");

				var commDate = new Date(
					commDateSplit[2],
					commDateSplit[1] - 1,
					commDateSplit[0]
				);
				var commDateParsed = format.parse({
					value: commDate,
					type: format.Type.DATE,
				});
				var commDateFormatted = format.format({
					value: commDate,
					type: format.Type.DATE,
				});

				var clickToDialNumber = '<a href="javascript:NLDial(' + debt_row.phone + ')">' + debt_row.phone + '</a>'

				debtDataSet.push([
					// "",
					linkURL,
					debt_row.custInternalID,
					customerIDLink,
					debt_row.custName,
					debt_row.zeeName,
					debt_row.statusText,
					debt_row.leadSource,
					debt_row.linkedLPOName,
					debt_row.contactName,
					debt_row.serviceEmail,
					clickToDialNumber,
					commDateFormatted,
					debt_row.email48h,
					debt_row.salesRepName,
					debt_row.dateFirstNoContact,
					debt_row.dateSecondNoContact,
					debt_row.dateThirdNoContact,
					debt_row.rowColorSort,
					debt_row.productUsageperWeek,
					sendSignUpEmail,
					debt_row.zeeMpExpActivated,
					debt_row.zeeMPStdActivated,
					debt_row.zeeMPPrmActivated,
					// debt_row.child,
				]);
			});
		}

		var datatable = $("#mpexusage-prospects").DataTable();
		datatable.clear();
		datatable.rows.add(debtDataSet);
		datatable.draw();

		// datatable.rows().every(function () {
		// 	// this.child(format(this.data())).show();
		// 	this.child(createChild(this)); // Add Child Tables
		// 	this.child.hide(); // Hide Child Tables on Open
		// });

		// $("#mpexusage-prospects tbody").on("click", "td.dt-control", function () {
		// 	var tr = $(this).closest("tr");
		// 	var row = datatable.row(tr);

		// 	if (row.child.isShown()) {
		// 		// This row is already open - close it
		// 		destroyChild(row);
		// 		tr.removeClass("shown");
		// 		tr.removeClass("parent");

		// 		$(".expand-button").addClass("btn-primary");
		// 		$(".expand-button").removeClass("btn-light");
		// 	} else {
		// 		// Open this row
		// 		row.child.show();
		// 		tr.addClass("shown");
		// 		tr.addClass("parent");

		// 		$(".expand-button").removeClass("btn-primary");
		// 		$(".expand-button").addClass("btn-light");
		// 	}
		// });

		// if (!isNullorEmpty(debt_rows2)) {
		//     debt_rows2.forEach(function (debt_row2, index) {

		//         if (!isNullorEmpty(debt_row2.salesRecordId)) {
		//             var linkURL =
		//                 '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_row2.custInternalID + '&sales_record_id=' + debt_row2.salesRecordId +
		//                 '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
		//         } else {
		//             var linkURL = '<input type="button" id="" data-id="' +
		//                 debt_row2.custInternalID +
		//                 '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
		//         }

		//         var customerIDLink =
		//             '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
		//             debt_row2.custInternalID + '&whence=" target="_blank"><b>' +
		//             debt_row2.custEntityID + '</b></a>';

		//         var sendSignUpEmail =
		//             '<a data-id="' +
		//             debt_row2.custInternalID +
		//             '" data-sales="' +
		//             debt_row2.salesRepId +
		//             '" data-contact="' +
		//             debt_row2.contactid +
		//             '" data-contactemail="' +
		//             debt_row2.contactEmail +
		//             '" data-salesrecordid="' +
		//             debt_row2.salesRecordId +
		//             '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

		//         var commDateSplit = debt_row2.quoteSentDate.split('/');

		//         var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
		//             commDateSplit[0]);
		//         var commDateParsed = format.parse({
		//             value: commDate,
		//             type: format.Type.DATE
		//         });
		//         var commDateFormatted = format.format({
		//             value: commDate,
		//             type: format.Type.DATE
		//         });

		//         debtDataSet2.push(['', linkURL, debt_row2.custInternalID,
		//             customerIDLink,
		//             debt_row2.custName, debt_row2.zeeName, debt_row2.statusText, debt_row2.leadSource, debt_row2.linkedLPOName, debt_row2.contactName,
		//             debt_row2.serviceEmail,
		//             debt_row2.phone, commDateFormatted, debt_row2.email48h, debt_row2.salesRepName, debt_row2.dateFirstNoContact, debt_row2.dateSecondNoContact, debt_row2.dateThirdNoContact, debt_row2.productUsageperWeek, sendSignUpEmail, debt_row2.child
		//         ]);
		//     });
		// }

		// var datatable2 = $('#mpexusage-opportunities').DataTable();
		// datatable2.clear();
		// datatable2.rows.add(debtDataSet2);
		// datatable2.draw();

		// datatable2.rows().every(function () {
		//     // this.child(format(this.data())).show();
		//     this.child(createChild3(this)) // Add Child Tables
		//     this.child.hide(); // Hide Child Tables on Open
		// });

		// $('#mpexusage-opportunities tbody').on('click', 'td.dt-control', function () {

		//     var tr = $(this).closest('tr');
		//     var row = datatable2.row(tr);

		//     if (row.child.isShown()) {
		//         // This row is already open - close it
		//         destroyChild(row);
		//         tr.removeClass('shown');
		//         tr.removeClass('parent');

		//         $('.expand-button').addClass('btn-primary');
		//         $('.expand-button').removeClass('btn-light')
		//     } else {
		//         // Open this row
		//         row.child.show();
		//         tr.addClass('shown');
		//         tr.addClass('parent');

		//         $('.expand-button').removeClass('btn-primary');
		//         $('.expand-button').addClass('btn-light')
		//     }
		// });

		// if (!isNullorEmpty(debt_rows3)) {
		//     debt_rows3.forEach(function (debt_row3, index) {

		//         if (!isNullorEmpty(debt_row3.salesRecordId)) {
		//             var linkURL =
		//                 '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_row3.custInternalID + '&sales_record_id=' + debt_row3.salesRecordId +
		//                 '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
		//         } else {
		//             var linkURL = '<input type="button" id="" data-id="' +
		//                 debt_row3.custInternalID +
		//                 '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
		//         }

		//         var customerIDLink =
		//             '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
		//             debt_row3.custInternalID + '&whence=" target="_blank"><b>' +
		//             debt_row3.custEntityID + '</b></a>';

		//         var sendSignUpEmail =
		//             '<a data-id="' +
		//             debt_row3.custInternalID +
		//             '" data-sales="' +
		//             debt_row3.salesRepId +
		//             '" data-contact="' +
		//             debt_row3.contactid +
		//             '" data-contactemail="' +
		//             debt_row3.contactEmail +
		//             '" data-salesrecordid="' +
		//             debt_row3.salesRecordId +
		//             '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

		//         if (!isNullorEmpty(debt_row3.quoteSentDate)) {
		//             var commDateSplit = debt_row3.quoteSentDate.split('/');

		//             var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
		//                 commDateSplit[0]);
		//             var commDateParsed = format.parse({
		//                 value: commDate,
		//                 type: format.Type.DATE
		//             });
		//             var commDateFormatted = format.format({
		//                 value: commDate,
		//                 type: format.Type.DATE
		//             });
		//         } else {
		//             var commDateFormatted = ''
		//         }

		//         debtDataSet3.push(['', linkURL, debt_row3.custInternalID,
		//             customerIDLink,
		//             debt_row3.custName, debt_row3.zeeName, debt_row3.statusText, debt_row3.leadSource, debt_row3.linkedLPOName, debt_row3.contactName,
		//             debt_row3.serviceEmail,
		//             debt_row3.phone, commDateFormatted, debt_row3.email48h, debt_row3.salesRepName, debt_row3.dateFirstNoContact, debt_row3.dateSecondNoContact, debt_row3.dateThirdNoContact, debt_row3.productUsageperWeek, sendSignUpEmail, debt_row3.child
		//         ]);
		//     });
		// }

		// var datatable3 = $('#mpexusage-followups').DataTable();
		// datatable3.clear();
		// datatable3.rows.add(debtDataSet3);
		// datatable3.draw();

		// datatable3.rows().every(function () {
		//     // this.child(format(this.data())).show();
		//     this.child(createChild3(this)) // Add Child Tables
		//     this.child.hide(); // Hide Child Tables on Open
		// });

		// $('#mpexusage-followups tbody').on('click', 'td.dt-control', function () {

		//     var tr = $(this).closest('tr');
		//     var row = datatable3.row(tr);

		//     if (row.child.isShown()) {
		//         // This row is already open - close it
		//         destroyChild(row);
		//         tr.removeClass('shown');
		//         tr.removeClass('parent');

		//         $('.expand-button').addClass('btn-primary');
		//         $('.expand-button').removeClass('btn-light')
		//     } else {
		//         // Open this row
		//         row.child.show();
		//         tr.addClass('shown');
		//         tr.addClass('parent');

		//         $('.expand-button').removeClass('btn-primary');
		//         $('.expand-button').addClass('btn-light')
		//     }
		// });

		// if (!isNullorEmpty(debt_set_validated_rows)) {
		//     debt_set_validated_rows.forEach(function (debt_set_validated_row, index) {

		//         if (!isNullorEmpty(debt_set_validated_row.salesRecordId)) {
		//             var linkURL =
		//                 '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1721&deploy=1&compid=1048144&callcenter=T&recid=' + debt_set_validated_row.custInternalID + '&sales_record_id=' + debt_set_validated_row.salesRecordId +
		//                 '&refresh=tasks" target="_blank" class="" style="cursor: pointer !important;color: white;border-radius: 25px">CALL CENTER</a></button>';
		//         } else {
		//             var linkURL = '<input type="button" id="" data-id="' +
		//                 debt_set_validated_row.custInternalID +
		//                 '" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />'
		//         }

		//         var customerIDLink =
		//             '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
		//             debt_set_validated_row.custInternalID + '&whence=" target="_blank"><b>' +
		//             debt_set_validated_row.custEntityID + '</b></a>';

		//         var sendSignUpEmail =
		//             '<a data-id="' +
		//             debt_set_validated_row.custInternalID +
		//             '" data-sales="' +
		//             debt_set_validated_row.salesRepId +
		//             '" data-contact="' +
		//             debt_set_validated_row.contactid +
		//             '" data-contactemail="' +
		//             debt_set_validated_row.contactEmail +
		//             '" data-salesrecordid="' +
		//             debt_set_validated_row.salesRecordId +
		//             '" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail">SEND EMAIL</a>';

		//         if (!isNullorEmpty(debt_set_validated_row.quoteSentDate)) {
		//             var commDateSplit = debt_set_validated_row.quoteSentDate.split('/');

		//             var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
		//                 commDateSplit[0]);
		//             var commDateParsed = format.parse({
		//                 value: commDate,
		//                 type: format.Type.DATE
		//             });
		//             var commDateFormatted = format.format({
		//                 value: commDate,
		//                 type: format.Type.DATE
		//             });
		//         } else {
		//             var commDateFormatted = ''
		//         }

		//         if (!isNullorEmpty(debt_set_validated_row.dateLPOValidated)) {
		//             var commDateLPOValidatedSplit = debt_set_validated_row.dateLPOValidated.split('/');

		//             var commDateLPOValidated = new Date(commDateLPOValidatedSplit[2], commDateLPOValidatedSplit[1] - 1,
		//                 commDateLPOValidatedSplit[0]);
		//             var commDateLPOValidatedParsed = format.parse({
		//                 value: commDateLPOValidated,
		//                 type: format.Type.DATE
		//             });
		//             var commDateLPOValidatedFormatted = format.format({
		//                 value: commDateLPOValidated,
		//                 type: format.Type.DATE
		//             });
		//         } else {
		//             var commDateLPOValidatedFormatted = ''
		//         }

		//         debtDataSet3.push(['', linkURL, commDateLPOValidatedFormatted, debt_set_validated_row.custInternalID,
		//             customerIDLink,
		//             debt_set_validated_row.custName, debt_set_validated_row.zeeName, debt_set_validated_row.statusText, debt_set_validated_row.leadSource, debt_set_validated_row.linkedLPOName, debt_set_validated_row.contactName,
		//             debt_set_validated_row.serviceEmail,
		//             debt_set_validated_row.phone, debt_set_validated_row.email48h, debt_set_validated_row.salesRepName, debt_set_validated_row.dateFirstNoContact, debt_set_validated_row.dateSecondNoContact, debt_set_validated_row.dateThirdNoContact, debt_set_validated_row.productUsageperWeek, sendSignUpEmail, debt_set_validated_row.child
		//         ]);
		//     });
		// }

		// var datatableValidated = $('#mpexusage-validated').DataTable();
		// datatableValidated.clear();
		// datatableValidated.rows.add(debtDataSet3);
		// datatableValidated.draw();

		// datatableValidated.rows().every(function () {
		//     // this.child(format(this.data())).show();
		//     this.child(createChild3(this)) // Add Child Tables
		//     this.child.hide(); // Hide Child Tables on Open
		// });

		// $('#mpexusage-validated tbody').on('click', 'td.dt-control', function () {

		//     var tr = $(this).closest('tr');
		//     var row = datatableValidated.row(tr);

		//     if (row.child.isShown()) {
		//         // This row is already open - close it
		//         destroyChild(row);
		//         tr.removeClass('shown');
		//         tr.removeClass('parent');

		//         $('.expand-button').addClass('btn-primary');
		//         $('.expand-button').removeClass('btn-light')
		//     } else {
		//         // Open this row
		//         row.child.show();
		//         tr.addClass('shown');
		//         tr.addClass('parent');

		//         $('.expand-button').removeClass('btn-primary');
		//         $('.expand-button').addClass('btn-light')
		//     }
		// });

		if (!isNullorEmpty(debt_rows4)) {
			debt_rows4.forEach(function (debt_row4, index) {
				if (!isNullorEmpty(debt_row4.salesRecordId)) {
					var linkURL =
						'<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1900&deploy=1&compid=1048144&callCenter=T&customerId=' +
						debt_row4.custInternalID +
						"&salesRecordId=" +
						debt_row4.salesRecordId +
						'&refresh=tasks" target="_blank" class="form-control btn btn-xs btn-primary" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						callCenterPage +
						"</a>";
				} else {
					var linkURL =
						'<input type="button" id="" data-id="' +
						debt_row4.custInternalID +
						'" value="ASSIGN TO REP" class="form-control btn btn-xs btn-warning salesrepassign" style="color: black; cursor: pointer !important;width: fit-content;" />';
				}

				var customerIDLink =
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					debt_row4.custInternalID +
					'&whence=" target="_blank"><b>' +
					debt_row4.custEntityID +
					"</b></a>";

				if (debt_row4.zeeName == "Mailplus Pty Ltd") {
					var sendSignUpEmail = "Not Assigned to Franchisee";
				} else {
					//NS Search: Product Pricing - Letters - Quotes
					var prodPricingLetterstobeSentSearch = nlapiLoadSearch(
						"customrecord_product_pricing",
						"customsearch_prod_pricing_letters_quotes"
					);

					var newFilters = new Array();
					newFilters[newFilters.length] = new nlobjSearchFilter(
						"internalid",
						"custrecord_prod_pricing_customer",
						"anyof",
						debt_row4.custInternalID
					);

					prodPricingLetterstobeSentSearch.addFilters(newFilters);

					var resultSetProdPricingLetters =
						prodPricingLetterstobeSentSearch.runSearch();

					var countProdPricing = 0;
					resultSetProdPricingLetters.forEachResult(function (searchResult) {
						countProdPricing++;
						return true;
					});

					if (countProdPricing == 2) {
						var sendSignUpEmail =
							'<a data-id="' +
							debt_row4.custInternalID +
							'" data-sales="' +
							debt_row4.salesRepId +
							'" data-contact="' +
							debt_row4.contactid +
							'" data-contactemail="' +
							debt_row4.contactEmail +
							'" data-salesrecordid="' +
							debt_row4.salesRecordId +
							'" style="cursor: pointer !important;color: #095C7B !important;" class="sendEmail"><b>SEND EMAIL</b></a>';
					} else {
						var sendSignUpEmail =
							'<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1590&deploy=1&compid=1048144&customerid=' +
							debt_row4.custInternalID +
							'&whence=" target="_blank"><b>Create Product Pricing</b></a>';
					}
				}

				var commDateSplit = debt_row4.dateLeadEntered.split("/");

				if (commDateSplit[1] < 10) {
					commDateSplit[1] = "0" + commDateSplit[1];
				}

				if (commDateSplit[0] < 10) {
					commDateSplit[0] = "0" + commDateSplit[0];
				}

				var newDate =
					commDateSplit[2] + "-" + commDateSplit[1] + "-" + commDateSplit[0];

				var commDate = new Date(
					commDateSplit[2],
					commDateSplit[1] - 1,
					commDateSplit[0]
				);
				var commDateParsed = format.parse({
					value: commDate,
					type: format.Type.DATE,
				});
				var commDateFormatted = format.format({
					value: commDate,
					type: format.Type.DATE,
				});

				var clickToDialNumber = '<a href="javascript:NLDial(' + debt_row4.phone + ')">' + debt_row4.phone + '</a>'

				debtDataSet4.push([
					// "",
					linkURL,
					newDate,
					debt_row4.custInternalID,
					customerIDLink,
					debt_row4.custName,
					debt_row4.zeeName,
					debt_row4.statusText,
					debt_row4.leadSource,
					debt_row4.linkedLPOName,
					debt_row4.contactName,
					debt_row4.serviceEmail,
					clickToDialNumber,
					debt_row4.servicesOfInterest,
					debt_row4.salesRepName,
					debt_row4.dateFirstNoContact,
					debt_row4.dateSecondNoContact,
					debt_row4.dateThirdNoContact,
					debt_row4.productUsageperWeek,
					sendSignUpEmail,
					debt_row4.zeeMpExpActivated,
					debt_row4.zeeMPStdActivated,
					debt_row4.zeeMPPrmActivated,
					// debt_row4.child,
				]);
			});
		}

		var datatable4 = $("#mpexusage-suspects").DataTable();
		datatable4.clear();
		datatable4.rows.add(debtDataSet4);
		datatable4.draw();

		// datatable4.rows().every(function () {
		// 	// this.child(format(this.data())).show();
		// 	this.child(createChild3(this)); // Add Child Tables
		// 	this.child.hide(); // Hide Child Tables on Open
		// });

		// $("#mpexusage-suspects tbody").on("click", "td.dt-control", function () {
		// 	var tr = $(this).closest("tr");
		// 	var row = datatable4.row(tr);

		// 	if (row.child.isShown()) {
		// 		// This row is already open - close it
		// 		destroyChild(row);
		// 		tr.removeClass("shown");
		// 		tr.removeClass("parent");

		// 		$(".expand-button").addClass("btn-primary");
		// 		$(".expand-button").removeClass("btn-light");
		// 	} else {
		// 		// Open this row
		// 		row.child.show();
		// 		tr.addClass("shown");
		// 		tr.addClass("parent");

		// 		$(".expand-button").removeClass("btn-primary");
		// 		$(".expand-button").addClass("btn-light");
		// 	}
		// });

		return true;
	}

	function createChild(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[24].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.activityInternalID,
					el.activityStartDate,
					el.activityTitle,
					el.activityOrganiser,
					el.activityMessage,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Organiser" },
				{ title: "Message" },
			],
			columnDefs: [],
			rowCallback: function (row, data) {
				// console.log('data[2]: ' + data[2])
				// console.log('data[11]: ' + data[11])
				// var dateUsedArray = data[1].split('/');
				// var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
				// var dateAfter2Days = new Date();
				// dateAfter2Days.setDate(date.getDate() + 2);
				// var today = new Date();
				// console.log('date: ' + date)
				// console.log('today: ' + today)
				// console.log('dateAfter2Days: ' + dateAfter2Days)
				// console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
				// if (isNullorEmpty(data[11]) && today >= dateAfter2Days) {
				//     $('td', row).css('background-color', '#FF8787');
				// } else if (data[11] == 'delivered') {
				//     $('td', row).css('background-color', '#C7F2A4');
				// }
			},
		});
	}

	function createChild3(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];
		row.data()[23].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.activityInternalID,
					el.activityStartDate,
					el.activityTitle,
					el.activityOrganiser,
					el.activityMessage,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: false,
			bLengthChange: false,
			bFilter: false,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			order: [1, "desc"],
			columns: [
				{ title: "Internal Id " },
				{ title: "Date" },
				{ title: "Title" },
				{ title: "Organiser" },
				{ title: "Message" },
			],
			columnDefs: [],
			rowCallback: function (row, data) {
				// console.log('data[2]: ' + data[2])
				// console.log('data[11]: ' + data[11])
				// var dateUsedArray = data[1].split('/');
				// var date = new Date(dateUsedArray[2], dateUsedArray[1] - 1, dateUsedArray[0])
				// var dateAfter2Days = new Date();
				// dateAfter2Days.setDate(date.getDate() + 2);
				// var today = new Date();
				// console.log('date: ' + date)
				// console.log('today: ' + today)
				// console.log('dateAfter2Days: ' + dateAfter2Days)
				// console.log('today >= dateAfter2Days: ' + today >= dateAfter2Days)
				// if (isNullorEmpty(data[11]) && today >= dateAfter2Days) {
				//     $('td', row).css('background-color', '#FF8787');
				// } else if (data[11] == 'delivered') {
				//     $('td', row).css('background-color', '#C7F2A4');
				// }
			},
		});
	}

	function destroyChild(row) {
		// And then hide the row
		row.child.hide();
	}

	function plotChartV2(series_data, series_data3_v2, categores) {
		// console.log(series_data)
		Highcharts.chart("container", {
			chart: {
				type: "column",
				height: (6 / 16) * 100 + "%",
				backgroundColor: "#CFE0CE",
				zoomType: "xy",
			},
			xAxis: {
				categories: categores,
				crosshair: true,
				style: {
					fontWeight: "bold",
				},
			},
			yAxis: {
				min: 0,
				title: {
					text: "Customer Count",
				},
				stackLabels: {
					enabled: true,
					style: {
						fontWeight: "bold",
					},
				},
			},
			plotOptions: {
				column: {
					stacking: "normal",
					dataLabels: {
						enabled: true,
					},
				},
			},
			series: [
				{
					name: "No Usage",
					data: series_data,
					color: "#d59696",
					style: {
						fontWeight: "bold",
					},
				},
				{
					name: "Avg Weekly Usage < than 45% of Expected Weekly Usage",
					data: series_data3_v2,
					color: "#c9750d80",
					style: {
						fontWeight: "bold",
					},
				},
				// {
				//   name: 'Avg Weekly Usage >= 45% of Expected Usage & Avg Weekly Usage < Expected Weekly Usage',
				//   data: series_data4_v2,
				//   color: '#fff',
				//   style: {
				//     fontWeight: 'bold',
				//   }
				// }
			],
		});
	}

	/**
	 * Load the string stored in the hidden field 'custpage_table_csv'.
	 * Converts it to a CSV file.
	 * Creates a hidden link to download the file and triggers the click of the link.
	 */
	function downloadCsv() {
		var today = new Date();
		today = formatDate(today);
		var val1 = currentRecord.get();
		var csv = val1.getValue({
			fieldId: "custpage_table_csv",
		});
		today = replaceAll(today);
		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		var content_type = "text/csv";
		var csvFile = new Blob([csv], {
			type: content_type,
		});
		var url = window.URL.createObjectURL(csvFile);
		var filename = "MPEX New Customer List_" + today + ".csv";
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	function saveRecord() {
		return true;
	}

	/**
	 * Create the CSV and store it in the hidden field 'custpage_table_csv' as a string.
	 * @param {Array} ordersDataSet The `billsDataSet` created in `loadDatatable()`.
	 */
	function saveCsv(ordersDataSet) {
		var sep = "sep=;";
		var headers = [
			"Customer Internal ID",
			"Customer Entity ID",
			"Customer Name",
			"Franchisee",
			"Sign Up Date",
			"Commencement Date",
			"Sales Rep",
			"Expected Weekly Usage",
			"Online Expected Weekly Usage",
			"No. of Weeks Used",
			"Total No. of Weeks (since Commencement)",
			"Avg Weekly Usage",
			"Sorting",
			"MPEX Customer",
		];
		headers = headers.join(";"); // .join(', ')

		var csv = sep + "\n" + headers + "\n";

		ordersDataSet.forEach(function (row) {
			row = row.join(";");
			csv += row;
			csv += "\n";
		});

		var val1 = currentRecord.get();
		val1.setValue({
			fieldId: "custpage_table_csv",
			value: csv,
		});

		return true;
	}

	function formatDate(testDate) {
		console.log("testDate: " + testDate);
		var responseDate = format.format({
			value: testDate,
			type: format.Type.DATE,
		});
		console.log("responseDate: " + responseDate);
		return responseDate;
	}

	function replaceAll(string) {
		return string.split("/").join("-");
	}

	function stateIDPublicHolidaysRecord(state) {
		switch (state) {
			case 1:
				return 1; //NSW
				break;
			case 2:
				return 6; //QLD
				break;
			case 3:
				return 5; //VIC
				break;
			case 4:
				return 3; //SA
				break;
			case 5:
				return 7; //TAS
				break;
			case 6:
				return 4; //ACT
				break;
			case 7:
				return 2; //WA
				break;
			case 8:
				return 8; //NT
				break;
			default:
				return null;
				break;
		}
	}

	function stateID(state) {
		state = state.toUpperCase();
		switch (state) {
			case "ACT":
				return 6;
				break;
			case "NSW":
				return 1;
				break;
			case "NT":
				return 8;
				break;
			case "QLD":
				return 2;
				break;
			case "SA":
				return 4;
				break;
			case "TAS":
				return 5;
				break;
			case "VIC":
				return 3;
				break;
			case "WA":
				return 7;
				break;
			default:
				return 0;
				break;
		}
	}
	/**
	 * Sets the values of `date_from` and `date_to` based on the selected option in the '#period_dropdown'.
	 */
	function selectDate() {
		var period_selected = $("#period_dropdown option:selected").val();
		var today = new Date();
		var today_day_in_month = today.getDate();
		var today_day_in_week = today.getDay();
		var today_month = today.getMonth();
		var today_year = today.getFullYear();

		var today_date = new Date(
			Date.UTC(today_year, today_month, today_day_in_month)
		);

		switch (period_selected) {
			case "this_week":
				// This method changes the variable "today" and sets it on the previous monday
				if (today_day_in_week == 0) {
					var monday = new Date(
						Date.UTC(today_year, today_month, today_day_in_month - 6)
					);
				} else {
					var monday = new Date(
						Date.UTC(
							today_year,
							today_month,
							today_day_in_month - today_day_in_week + 1
						)
					);
				}
				var date_from = monday.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			case "last_week":
				var today_day_in_month = today.getDate();
				var today_day_in_week = today.getDay();
				// This method changes the variable "today" and sets it on the previous monday
				if (today_day_in_week == 0) {
					var previous_sunday = new Date(
						Date.UTC(today_year, today_month, today_day_in_month - 7)
					);
				} else {
					var previous_sunday = new Date(
						Date.UTC(
							today_year,
							today_month,
							today_day_in_month - today_day_in_week
						)
					);
				}

				var previous_sunday_year = previous_sunday.getFullYear();
				var previous_sunday_month = previous_sunday.getMonth();
				var previous_sunday_day_in_month = previous_sunday.getDate();

				var monday_before_sunday = new Date(
					Date.UTC(
						previous_sunday_year,
						previous_sunday_month,
						previous_sunday_day_in_month - 6
					)
				);

				var date_from = monday_before_sunday.toISOString().split("T")[0];
				var date_to = previous_sunday.toISOString().split("T")[0];
				break;

			case "this_month":
				var first_day_month = new Date(Date.UTC(today_year, today_month));
				var date_from = first_day_month.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			case "last_month":
				var first_day_previous_month = new Date(
					Date.UTC(today_year, today_month - 1)
				);
				var last_day_previous_month = new Date(
					Date.UTC(today_year, today_month, 0)
				);
				var date_from = first_day_previous_month.toISOString().split("T")[0];
				var date_to = last_day_previous_month.toISOString().split("T")[0];
				break;

			case "full_year":
				var first_day_in_year = new Date(Date.UTC(today_year, 0));
				var date_from = first_day_in_year.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			case "financial_year":
				if (today_month >= 6) {
					var first_july = new Date(Date.UTC(today_year, 6));
				} else {
					var first_july = new Date(Date.UTC(today_year - 1, 6));
				}
				var date_from = first_july.toISOString().split("T")[0];
				var date_to = today_date.toISOString().split("T")[0];
				break;

			default:
				var date_from = "";
				var date_to = "";
				break;
		}
		$("#date_from").val(date_from);
		$("#date_to").val(date_to);
	}

	function formatAMPM() {
		var date = new Date();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? "pm" : "am";
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? "0" + minutes : minutes;
		var strTime = hours + ":" + minutes + " " + ampm;
		return strTime;
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
	/**
	 * [getDate description] - Get the current date
	 * @return {[String]} [description] - return the string date
	 */
	function getDate() {
		var date = new Date();
		date = format.format({
			value: date,
			type: format.Type.DATE,
			timezone: format.Timezone.AUSTRALIA_SYDNEY,
		});

		return date;
	}

	function isNullorEmpty(val) {
		if (val == "" || val == null) {
			return true;
		} else {
			return false;
		}
	}
	return {
		pageInit: pageInit,
		saveRecord: saveRecord,
		adhocNewCustomers: adhocNewCustomers,
		downloadCsv: downloadCsv,
		addFilters: addFilters,
		// onclick_NoResponse: onclick_NoResponse
	};
});
