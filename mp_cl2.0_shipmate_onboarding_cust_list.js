/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript

 * Author:               Ankith Ravindran
 * Created on:           Thu Nov 14 2024
 * Modified on:          Thu Nov 14 2024 13:20:32
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
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

	var debtDataSetRequested = [];
	var debt_set_requested = [];
	var debtDataSetScheduled = [];
	var debt_set_scheduled = [];
	var debtDataSetCompleted = [];
	var debt_set_completed = [];

	function pageLoad() {
		$(".range_filter_section").addClass("hide");
		$(".range_filter_section_top").addClass("hide");
		$(".date_filter_section").addClass("hide");
		$(".period_dropdown_section").addClass("hide");
		$(".zee_label_section").removeClass("hide");
		$(".instruction_div").removeClass("hide");
		$(".zee_dropdown_section").removeClass("hide");
		$(".filter_buttons_section").removeClass("hide");
		$("#customer_benchmark_preview").removeClass("hide");
		$(".tabs_section").removeClass("hide");
		$(".signed_up_label_section").removeClass("hide");
		$(".signed_up_div").removeClass("hide");
		$(".scorecard_percentage").removeClass("hide");
		$("#customer_benchmark_preview").show();

		$(".loading_section").addClass("hide");
	}

	function beforeSubmit() {
		$("#customer_benchmark_preview").hide();
		$("#customer_benchmark_preview").addClass("hide");

		$(".loading_section").removeClass("hide");
	}

	function afterSubmit() {
		$(".date_filter_section").removeClass("hide");
		$(".period_dropdown_section").removeClass("hide");

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

	function pageInit() {
		$("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
		$("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
		$("#body").css("background-color", "#CFE0CE");

		/**
		 *  Auto Load Submit Search and Load Results on Page Initialisation
		 */

		submitSearch();
		pageLoad();

		$("#applyFilter").click(function () {
			zee = $("#zee_dropdown").val();
			var commencement_start_date = $("#commencement_date_from").val();
			var commencement_last_date = $("#commencement_date_to").val();

			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1948&deploy=1&zee=" +
				zee +
				"&commence_date_from=" +
				commencement_start_date +
				"&commence_date_to=" +
				commencement_last_date;

			window.location.href = url;
		});

		/**
		 *  Click for Instructions Section Collapse
		 */
		$(".collapse").on("shown.bs.collapse", function () {
			$(".range_filter_section_top").css("padding-top", "500px");
		});
		$(".collapse").on("hide.bs.collapse", function () {
			$(".range_filter_section_top").css("padding-top", "0px");
		});

		$(".taskModalPopUP").click(function () {
			var customerInternalID = $(this).attr("data-id");
			console.log("inside modal");
			console.log("customerInternalID " + customerInternalID);
			$("#customer_id").val(customerInternalID);
			console.log("customerInternalID " + $("#customer_id").val());
			$("#myModal").show();
		});

		$(".createUserNote").click(function () {
			var customerInternalID = $(this).attr("data-id");
			console.log("inside modal");
			console.log("customerInternalID " + customerInternalID);
			$("#customer_id").val(customerInternalID);
			console.log("customerInternalID " + $("#customer_id").val());
			$("#myModalUserNote").show();
		});

		$(".editTaskModalPopUP").click(function () {
			var taskInternalId = $(this).attr("data-id");
			var customerInternalID = $(this).attr("date-customerid");
			console.log("inside modal");
			console.log("customerInternalID " + customerInternalID);
			$("#customer_id").val(customerInternalID);
			$("#task_id").val(taskInternalId);
			console.log("customerInternalID " + $("#customer_id").val());
			console.log("taskInternalId " + $("#task_id").val());

			var task_record = record.load({
				type: "task",
				id: taskInternalId,
			});

			var taskDate = task_record.getValue({
				fieldId: "duedate",
			});
			var taskTime = task_record.getValue({
				fieldId: "starttime",
			});
			var taskMessage = task_record.getValue({
				fieldId: "message",
			});

			console.log("taskDate " + formatDateToYYYYMMDD(taskDate));
			console.log("taskTime " + convertTo24HourFormat(taskTime));

			$("#date").val(formatDateToYYYYMMDD(taskDate));
			$("#time").val(convertTo24HourFormat(taskTime));
			$(".note").val(taskMessage);

			$("#myModal").show();
		});

		//Display the modal on click of the link on the table and prefill the fields  based on the customer record
		$("#scheduleOnboarding").click(function () {
			console.log("inside modal");
			var customerInternalID = $("#customer_id").val();
			var taskInternalId = $("#task_id").val();
			var date_now = $("#date").val();
			var time_now = $("#time").val();

			console.log(customerInternalID);

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalID,
			});

			var companyName = customer_record.getValue({
				fieldId: "companyname",
			});

			console.log(date_now);
			console.log(time_now);

			var netsuiteDate = dateISOToNetsuite(date_now);

			console.log("netsuiteDate: " + netsuiteDate);

			if (isNullorEmpty(date_now) || isNullorEmpty(time_now)) {
				alert("Please Schedule Onboarding Date & Time");
				return false;
			}

			var splitDate = date_now.split("-");
			var callback_date =
				splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
			console.log(callback_date);

			var date = new Date(callback_date);
			format.format({
				value: date,
				type: format.Type.DATE,
				timezone: format.Timezone.AUSTRALIA_SYDNEY,
			});

			console.log(date);

			var start_arr = time_now.split(":");
			var startTimeVar = new Date(callback_date);
			console.log("startTimeVar before setting hours", startTimeVar);
			startTimeVar.setHours(start_arr[0], start_arr[1], 0, 0);
			console.log("startTimeVar after setting hours", startTimeVar);
			var endTimeVar = new Date(callback_date);
			console.log("endTimeVar before setting hours", endTimeVar);
			endTimeVar.setHours(
				startTimeVar.getHours() + 1,
				startTimeVar.getMinutes(),
				0,
				0
			);
			console.log("endTimeVar after setting hours", endTimeVar);
			// var startTimeVarFormat = format.format({
			// 	value: startTimeVar,
			// 	type: format.Type.TIMEOFDAY,
			// });
			// console.log("Start Time! After Format", startTimeVarFormat);

			var existingNote = "";

			if (isNullorEmpty(taskInternalId)) {
				var task_record = record.create({
					type: "task",
				});
			} else {
				var task_record = record.load({
					type: "task",
					id: taskInternalId,
				});
				existingNote = task_record.getValue({
					fieldId: "message",
				});
			}
			// var task_record = record.create({
			// 	type: "calendarevent",
			// });

			task_record.setValue({
				fieldId: "duedate",
				value: date,
			});
			task_record.setValue({
				fieldId: "sendemail",
				value: true,
			});
			task_record.setValue({
				fieldId: "timedevent",
				value: true,
			});
			task_record.setValue({
				fieldId: "starttime",
				value: startTimeVar,
			});
			task_record.setValue({
				fieldId: "endtime",
				value: endTimeVar,
			});
			task_record.setValue({
				fieldId: "remindertype",
				value: "EMAIL",
			});
			task_record.setValue({
				fieldId: "reminderminutes",
				value: "60",
			});

			task_record.setValue({
				fieldId: "company",
				value: customerInternalID,
			});
			// task_record.setValue({
			// 	fieldId: "status",
			// 	value: "NOTSTART",
			// });
			task_record.setValue({
				fieldId: "title",
				value: "ShipMate Onboarding - " + companyName,
			});
			if (isNullorEmpty(existingNote)) {
				task_record.setValue({
					fieldId: "message",
					value: getCurrentDateTime() + " - " + $(".note").val() + "\n",
				});
			} else {
				task_record.setValue({
					fieldId: "message",
					value:
						existingNote +
						"\n" +
						getCurrentDateTime() +
						" - " +
						$(".note").val() +
						"\n",
				});
			}
			task_record.setValue({
				fieldId: "custevent_organiser",
				value: runtime.getCurrentUser().id,
			});
			task_record.setValue({
				fieldId: "assigned",
				value: runtime.getCurrentUser().id,
			});

			task_record.save({
				ignoreMandatoryFields: true,
			});
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1948&deploy=1";
			window.location.href = url;
		});

		$("#createNote").click(function () {
			console.log("inside create note modal");
			var customerInternalID = $("#customer_id").val();

			console.log(customerInternalID);

			var userNoteRecord = record.create({
				type: record.Type.NOTE,
				isDynamic: true,
			});

			userNoteRecord.setValue({
				fieldId: "entity",
				value: parseInt(customerInternalID),
			});

			userNoteRecord.setValue({
				fieldId: "title",
				value: "ShipMate Onboarding - Notes",
			});

			userNoteRecord.setValue({
				fieldId: "direction",
				value: 1,
			});

			userNoteRecord.setValue({
				fieldId: "notetype",
				value: 7,
			});

			userNoteRecord.setValue({
				fieldId: "author",
				value: runtime.getCurrentUser().id,
			});

			userNoteRecord.setValue({
				fieldId: "notedate",
				value: getDateStoreNS(),
			});

			userNoteRecord.setValue({
				fieldId: "note",
				value: getCurrentDateTime() + " - " + $(".userNote").val() + "\n",
			});

			var userNoteRecordId = userNoteRecord.save();

			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1948&deploy=1";
			window.location.href = url;
		});

		$(".onboardingCompleted").click(function () {
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
			var url = baseURL + "/app/site/hosting/scriptlet.nl?script=1948&deploy=1";
			window.location.href = url;
		});

		//On click of close icon in the modal
		$(".close").click(function () {
			$("#myModal").hide();
			$("#myModalUserNote").hide();
		});

		//Update the customer record on click of the button in the modal
		$("#updateCustomer").click(function () {
			var customer_id = $("#customer_id").val();

			var customer_record = record.load({
				type: record.Type.CUSTOMER,
				id: customer_id,
				isDynamic: true,
			});

			var mpex_customer = customer_record.setValue({
				fieldId: "custentity_mpex_customer",
				value: $("#mpex_customer").val(),
			});
			var expected_usage = customer_record.setValue({
				fieldId: "custentity_exp_mpex_weekly_usage",
				value: $("#exp_usage").val(),
			});

			var customerRecordId = customer_record.save({
				ignoreMandatoryFields: true,
			});

			var url =
				baseURL +
				"/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=" +
				zee +
				"&start_date=&last_date=&user_id=" +
				userId;
			window.location.href = url;
		});
	}

	//Initialise the DataTable with headers.
	function submitSearch() {
		// duringSubmit();

		dataTableRequested = $("#table-requested").DataTable({
			destroy: true,
			data: debtDataSetRequested,
			pageLength: 1000,
			order: [
				[11, "asc"],
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
					title: "User Notes",
					className: "dt-control tableContentAlignCenter",
					orderable: false,
					data: null,
					defaultContent: "",
				}, //0
				{
					title: "LINK", //1
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
					title: "Email", //5
				},
				{
					title: "Phone Number", //6
				},
				{
					title: "Account Manager", //7
				},
				{
					title: "Commencement Date", //8
				},
				{
					title: "Task Date", //9
				},
				{
					title: "Task Time", //10
				},
				{
					title: "Assigned To", //11
				},
				{
					title: "Task Status", //12
				},
				{
					title: "Task Notes", //13
				},
				{
					title: "Child Table", //14
				},
			],
			columnDefs: [
				{
					targets: [14],
					visible: false,
				},
				{
					targets: [2, 3, 7, 8, 10],
					className: "bolded",
				},
				{
					targets: [3],
					className: "col-xs-3",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[12] == "Not Started") {
					$("td", row).css("background-color", "#FFD07F");
				} else if (data[12] == "Completed") {
					$("td", row).css("background-color", "#ADCF9F");
				}
			},
		});

		dataTableSceduled = $("#table-scheduled").DataTable({
			destroy: true,
			data: debtDataSetRequested,
			pageLength: 1000,
			order: [
				[11, "asc"],
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
					title: "User Notes",
					className: "dt-control tableContentAlignCenter",
					orderable: false,
					data: null,
					defaultContent: "",
				}, //0
				{
					title: "LINK", //1
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
					title: "Email", //5
				},
				{
					title: "Phone Number", //6
				},
				{
					title: "Account Manager", //7
				},
				{
					title: "Commencement Date", //8
				},
				{
					title: "Task Date", //9
				},
				{
					title: "Task Time", //10
				},
				{
					title: "Assigned To", //11
				},
				{
					title: "Task Status", //12
				},
				{
					title: "Task Notes", //13
				},
				{
					title: "Child Table", //14
				},
			],
			columnDefs: [
				{
					targets: [14],
					visible: false,
				},
				{
					targets: [2, 3, 7, 8, 10],
					className: "bolded",
				},
				{
					targets: [3],
					className: "col-xs-3",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[12] == "Not Started") {
					$("td", row).css("background-color", "#FFD07F");
				} else if (data[12] == "Completed") {
					$("td", row).css("background-color", "#ADCF9F");
				}
			},
		});

		dataTableCompleted = $("#table-completed").DataTable({
			destroy: true,
			data: debtDataSetRequested,
			pageLength: 1000,
			order: [
				[11, "asc"],
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
					title: "User Notes",
					className: "dt-control tableContentAlignCenter",
					orderable: false,
					data: null,
					defaultContent: "",
				}, //0
				{
					title: "LINK", //1
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
					title: "Email", //5
				},
				{
					title: "Phone Number", //6
				},
				{
					title: "Account Manager", //7
				},
				{
					title: "Commencement Date", //8
				},
				{
					title: "Task Date", //9
				},
				{
					title: "Task Time", //10
				},
				{
					title: "Assigned To", //11
				},
				{
					title: "Task Status", //12
				},
				{
					title: "Task Notes", //13
				},
				{
					title: "Child Table", //14
				},
			],
			columnDefs: [
				{
					targets: [14],
					visible: false,
				},
				{
					targets: [2, 3, 7, 8, 10],
					className: "bolded",
				},
				{
					targets: [3],
					className: "col-xs-3",
				},
			],
			rowCallback: function (row, data, index) {
				if (data[12] == "Not Started") {
					$("td", row).css("background-color", "#FFD07F");
				} else if (data[12] == "Completed") {
					$("td", row).css("background-color", "#ADCF9F");
				}
			},
		});

		userId = $("#user_dropdown option:selected").val();
		zee = $("#zee_dropdown option:selected").val();

		commencement_start_date = $("#commencement_date_from").val();
		commencement_start_date = dateISOToNetsuite(commencement_start_date);
		commencement_last_date = $("#commencement_date_to").val();
		commencement_last_date = dateISOToNetsuite(commencement_last_date);

		loadOnboardingRequiredCustomerList(
			zee,
			userId,
			commencement_start_date,
			commencement_last_date
		);

		console.log("Loaded Results");
	}

	function loadOnboardingRequiredCustomerList(
		zee_id,
		userId,
		commencement_start_date,
		commencement_last_date
	) {
		//Search Name: ShipMate Onboarding Required - Customer List
		var shipMateOnboardingRequiredSearch = search.load({
			type: "customer",
			id: "customsearch_shipmate_onboarding_tasks",
		});

		if (!isNullorEmpty(zee_id)) {
			shipMateOnboardingRequiredSearch.filters.push(
				search.createFilter({
					name: "partner",
					join: null,
					operator: search.Operator.IS,
					values: zee_id,
				})
			);
		}

		if (!isNullorEmpty(userId) && role != 3) {
			shipMateOnboardingRequiredSearch.filters.push(
				search.createFilter({
					name: "custrecord_salesrep",
					join: "custrecord_customer",
					operator: search.Operator.IS,
					values: userId,
				})
			);
		}

		if (
			!isNullorEmpty(commencement_start_date) &&
			!isNullorEmpty(commencement_last_date)
		) {
			shipMateOnboardingRequiredSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "custrecord_customer",
					operator: search.Operator.ONORAFTER,
					values: commencement_start_date,
				})
			);

			shipMateOnboardingRequiredSearch.filters.push(
				search.createFilter({
					name: "custrecord_comm_date",
					join: "custrecord_customer",
					operator: search.Operator.ONORBEFORE,
					values: commencement_last_date,
				})
			);
		}

		shipMateOnboardingRequiredSearch
			.run()
			.each(function (salesCallUpsellTasksResultSet) {
				var custInternalID = salesCallUpsellTasksResultSet.getValue({
					name: "internalid",
					summary: "GROUP",
				});
				var custEntityID = salesCallUpsellTasksResultSet.getValue({
					name: "entityid",
					summary: "GROUP",
				});
				var custName = salesCallUpsellTasksResultSet.getValue({
					name: "companyname",
					summary: "GROUP",
				});
				var zeeID = salesCallUpsellTasksResultSet.getValue({
					name: "partner",
					summary: "GROUP",
				});
				var zeeName = salesCallUpsellTasksResultSet.getText({
					name: "partner",
					summary: "GROUP",
				});

				var email = salesCallUpsellTasksResultSet.getValue({
					name: "email",
					summary: "GROUP",
				});
				var serviceEmail = salesCallUpsellTasksResultSet.getValue({
					name: "custentity_email_service",
					summary: "GROUP",
				});

				var phone = salesCallUpsellTasksResultSet.getValue({
					name: "phone",
					summary: "GROUP",
				});

				var salesRecordInternalID = salesCallUpsellTasksResultSet.getValue({
					name: "internalid",
					join: "CUSTRECORD_SALES_CUSTOMER",
					summary: "MAX",
				});

				var salesRecord = record.load({
					type: "customrecord_sales",
					id: salesRecordInternalID,
				});
				var lastAssigned = salesRecord.getText({
					fieldId: "custrecord_sales_assigned",
				});

				var commRegInternalID = salesCallUpsellTasksResultSet.getValue({
					name: "internalid",
					join: "CUSTRECORD_CUSTOMER",
					summary: "MAX",
				});

				var commRegRecord = record.load({
					type: "customrecord_commencement_register",
					id: commRegInternalID,
				});
				var dateEffective = commRegRecord.getValue({
					fieldId: "custrecord_comm_date",
				});

				console.log("dateEffective", Date(dateEffective));

				var today = new Date(dateEffective);
				today.setHours(today.getHours() + 11);

				var year = today.getFullYear();
				var month = customPadStart((today.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
				var day = customPadStart(today.getDate().toString(), 2, "0");

				dateEffective = year + "-" + month + "-" + day;

				// console.log("dateEffective", Date(c));
				// dateEffective = convertDateToYYYYMMDD(dateEffective);

				//Search Name: ShipMate Onboarding Required - Task List
				var shipMateOnboardingRequiredTaskCreatedSearch = search.load({
					type: "customer",
					id: "customsearch_shipmate_onboarding_tasks_2",
				});
				shipMateOnboardingRequiredTaskCreatedSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: null,
						operator: search.Operator.IS,
						values: custInternalID,
					})
				);

				var taskInternalId = "";
				var taskTitle = "";
				var taskDueDate = "";
				var taskTime = "";
				var salesRepAssigned = "";
				var salesRepAssignedText = "";
				var taskStatus = "";
				var taskCount = 0;
				var taskNotes = "";

				shipMateOnboardingRequiredTaskCreatedSearch
					.run()
					.each(function (
						shipMateOnboardingRequiredTaskCreatedSearchResultSet
					) {
						taskInternalId =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getValue({
								name: "internalid",
								join: "task",
							});

						taskTitle =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getValue({
								name: "title",
								join: "task",
							});
						taskDueDate =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getValue({
								name: "duedate",
								join: "task",
							});
						console.log("taskDueDate", taskDueDate);
						taskDueDate = convertDateToYYYYMMDD(taskDueDate);

						taskTime =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getValue({
								name: "starttime",
								join: "task",
							});
						salesRepAssigned =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getValue({
								name: "assigned",
								join: "task",
							});

						salesRepAssignedText =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getText({
								name: "assigned",
								join: "task",
							});
						taskStatus =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getText({
								name: "status",
								join: "task",
							});
						taskNotes =
							shipMateOnboardingRequiredTaskCreatedSearchResultSet.getValue({
								name: "message",
								join: "task",
							});

						taskCount++;
						return true;
					});

				if (taskStatus == "") {
					debt_set_requested.push({
						custInternalID: custInternalID,
						custEntityID: custEntityID,
						custName: custName,
						zeeID: zeeID,
						zeeName: zeeName,
						serviceEmail: serviceEmail,
						phone: phone,
						lastAssigned: lastAssigned,
						dateEffective: dateEffective,
						taskInternalId: taskInternalId,
						taskTitle: taskTitle,
						taskDueDate: taskDueDate,
						taskTime: taskTime,
						salesRepAssigned: salesRepAssigned,
						salesRepAssignedText: salesRepAssignedText,
						taskStatus: taskStatus,
						taskNotes: taskNotes,
					});
				} else if (taskStatus == "Not Started") {
					debt_set_scheduled.push({
						custInternalID: custInternalID,
						custEntityID: custEntityID,
						custName: custName,
						zeeID: zeeID,
						zeeName: zeeName,
						serviceEmail: serviceEmail,
						phone: phone,
						lastAssigned: lastAssigned,
						dateEffective: dateEffective,
						taskInternalId: taskInternalId,
						taskTitle: taskTitle,
						taskDueDate: taskDueDate,
						taskTime: taskTime,
						salesRepAssigned: salesRepAssigned,
						salesRepAssignedText: salesRepAssignedText,
						taskStatus: taskStatus,
						taskNotes: taskNotes,
					});
				} else if (taskStatus == "Completed") {
					debt_set_completed.push({
						custInternalID: custInternalID,
						custEntityID: custEntityID,
						custName: custName,
						zeeID: zeeID,
						zeeName: zeeName,
						serviceEmail: serviceEmail,
						phone: phone,
						lastAssigned: lastAssigned,
						dateEffective: dateEffective,
						taskInternalId: taskInternalId,
						taskTitle: taskTitle,
						taskDueDate: taskDueDate,
						taskTime: taskTime,
						salesRepAssigned: salesRepAssigned,
						salesRepAssignedText: salesRepAssignedText,
						taskStatus: taskStatus,
						taskNotes: taskNotes,
					});
				}

				return true;
			});
		console.log("debt_set_requested:" + debt_set_requested);
		console.log("debt_set_scheduled:" + debt_set_scheduled);
		console.log("debt_set_completed:" + debt_set_completed);

		loadDatatable(debt_set_requested, debt_set_scheduled, debt_set_completed);
	}

	function loadDatatable(
		debt_set_requested,
		debt_set_scheduled,
		debt_set_completed
	) {
		debtDataSetRequested = [];
		debtDataSetScheduled = [];
		debtDataSetCompleted = [];

		var scheduleTaskIcon =
			"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Schedule Task</title><g id='calendar_add_fill' fill='none'><path d='M24 0v24H0V0zM12.594 23.258l-.012.002-.071.035-.02.004-.014-.004-.071-.036c-.01-.003-.019 0-.024.006l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113-.014.002-.184.093-.01.01-.003.011.018.43.005.012.008.008.201.092c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.003-.011.018-.43-.003-.012-.01-.01z'/><path fill='#F6F8F9FF' d='M7 4a1 1 0 0 1 2 0v1h6V4a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v3H3V7a2 2 0 0 1 2-2h2zm11 10a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 0 1 1-1m0-2a3.001 3.001 0 0 0-2.836 2.018 1.9 1.9 0 0 1-1.146 1.146 3.001 3.001 0 0 0-.174 5.605l.174.067c.12.041.236.097.346.164H5a2 2 0 0 1-2-2v-7z'/></g></svg>";
		var editTaskIcon =
			"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Edit Task</title><g id='schedule_fill' fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F6F8F9FF' d='M16 3a1 1 0 0 1 1 1v1h2a2 2 0 0 1 1.995 1.85L21 7v12a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V7a2 2 0 0 1 1.85-1.995L5 5h2V4a1 1 0 0 1 2 0v1h6V4a1 1 0 0 1 1-1m-1.176 6.379-4.242 4.242-1.415-1.414a1 1 0 0 0-1.414 1.414l2.114 2.115a1.01 1.01 0 0 0 1.429 0l4.942-4.943a1 1 0 1 0-1.414-1.414'/></g></svg>";
		var completeTaskIcon =
			"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Complete Task</title><g id='check_fill' fill='none' fill-rule='evenodd'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F6F8F9FF' d='M21.546 5.111a1.5 1.5 0 0 1 0 2.121L10.303 18.475a1.6 1.6 0 0 1-2.263 0L2.454 12.89a1.5 1.5 0 1 1 2.121-2.121l4.596 4.596L19.424 5.111a1.5 1.5 0 0 1 2.122 0'/></g></svg>";
		var notesTask =
			"<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='vertical-align: middle;'><title>Create User Note</title><g id='notebook_fill' fill='none'><path d='M24 0v24H0V0zM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01z'/><path fill='#F6F8F9FF' d='M8 2v19H6c-1.054 0-2-.95-2-2V4c0-1.054.95-2 2-2zm9 0c1.598 0 3 1.3 3 3v13c0 1.7-1.4 3-3 3h-7V2z'/></g></svg>";

		var childCustomerUserNotes = [];

		if (!isNullorEmpty(debt_set_requested)) {
			debt_set_requested.forEach(function (debt_row, index) {
				if (debt_row.taskStatus == "") {
					var linkURL =
						'<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.custInternalID +
						'" class="taskModalPopUP" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						scheduleTaskIcon +
						'</a></button> <button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.custInternalID +
						'" data-type="completed" class="createUserNote" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						notesTask +
						"</a></button>";
				} else if (debt_row.taskStatus == "Completed") {
					var linkURL = "";
				} else {
					var linkURL =
						'<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.custInternalID +
						'" data-type="completed" class="createUserNote" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						notesTask +
						'</a></button> <button class="form-control btn btn-xs btn-warning" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.taskInternalId +
						'" date-customerid="' +
						debt_row.custInternalID +
						'" class="editTaskModalPopUP" style="cursor: pointer !important;color: black;border-radius: 30px;">' +
						editTaskIcon +
						'</a></button> <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.taskInternalId +
						'" data-type="completed" class="onboardingCompleted" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						completeTaskIcon +
						"</a></button>";
				}

				var customerIDLink =
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					debt_row.custInternalID +
					'&whence=" target="_blank"><b>' +
					debt_row.custEntityID +
					"</b></a>";

				//Search Name: User Notes - Signed Customers
				var customerSignedUserNotesSearch = search.load({
					type: "customer",
					id: "customsearch_user_notes_signed_customers",
				});
				customerSignedUserNotesSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: null,
						operator: search.Operator.IS,
						values: debt_row.custInternalID,
					})
				);
				customerSignedUserNotesSearch
					.run()
					.each(function (customerSignedUserNotesSearchResultSet) {
						var userNotesDate = customerSignedUserNotesSearchResultSet.getValue(
							{
								name: "notedate",
								join: "userNotes",
							}
						);
						var userNotesAuthor =
							customerSignedUserNotesSearchResultSet.getText({
								name: "author",
								join: "userNotes",
							});
						var userNotesTitle =
							customerSignedUserNotesSearchResultSet.getValue({
								name: "title",
								join: "userNotes",
							});
						var userNotesNote = customerSignedUserNotesSearchResultSet.getValue(
							{
								name: "note",
								join: "userNotes",
							}
						);

						childCustomerUserNotes.push({
							userNotesDate: userNotesDate,
							userNotesAuthor: userNotesAuthor,
							userNotesTitle: userNotesTitle,
							userNotesNote: userNotesNote,
						});
						return true;
					});

				debtDataSetRequested.push([
					"",
					linkURL,
					customerIDLink,
					debt_row.custName,
					debt_row.zeeName,
					debt_row.serviceEmail,
					debt_row.phone,
					debt_row.lastAssigned,
					debt_row.dateEffective,
					debt_row.taskDueDate,
					debt_row.taskTime,
					debt_row.salesRepAssignedText,
					debt_row.taskStatus,
					debt_row.taskNotes,
					childCustomerUserNotes,
				]);
			});
		}

		var datatableRequested = $("#table-requested").DataTable();
		datatableRequested.clear();
		datatableRequested.rows.add(debtDataSetRequested);
		datatableRequested.draw();

		console.log("datatableRequested", datatableRequested);
		console.log("childCustomerUserNotes", childCustomerUserNotes);

		datatableRequested.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildUserNotes(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#table-requested tbody").on("click", "td.dt-control", function () {
			var tr = $(this).closest("tr");
			var row = datatableRequested.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				destroyChild(row);
				tr.removeClass("shown");
				tr.removeClass("parent");

				$(".expand-button").addClass("btn-primary");
				$(".expand-button").removeClass("btn-light");
			} else {
				// Open this row
				row.child.show();
				tr.addClass("shown");
				tr.addClass("parent");

				$(".expand-button").removeClass("btn-primary");
				$(".expand-button").addClass("btn-light");
			}
		});

		var childCustomerUserNotes = [];

		if (!isNullorEmpty(debt_set_scheduled)) {
			debt_set_scheduled.forEach(function (debt_row, index) {
				if (debt_row.taskStatus == "") {
					var linkURL =
						'<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.custInternalID +
						'" class="taskModalPopUP" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						scheduleTaskIcon +
						"</a></button>";
				} else if (debt_row.taskStatus == "Completed") {
					var linkURL = "";
				} else {
					var linkURL =
						'<button class="form-control btn btn-xs btn-warning" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.taskInternalId +
						'" date-customerid="' +
						debt_row.custInternalID +
						'" class="editTaskModalPopUP" style="cursor: pointer !important;color: black;border-radius: 30px;">' +
						editTaskIcon +
						'</a></button> <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.taskInternalId +
						'" data-type="completed" class="onboardingCompleted" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						completeTaskIcon +
						"</a></button>";
				}

				var customerIDLink =
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					debt_row.custInternalID +
					'&whence=" target="_blank"><b>' +
					debt_row.custEntityID +
					"</b></a>";

				//Search Name: User Notes - Signed Customers
				var customerSignedUserNotesSearch = search.load({
					type: "customer",
					id: "customsearch_user_notes_signed_customers",
				});
				customerSignedUserNotesSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: null,
						operator: search.Operator.IS,
						values: debt_row.custInternalID,
					})
				);
				customerSignedUserNotesSearch
					.run()
					.each(function (customerSignedUserNotesSearchResultSet) {
						var userNotesDate = customerSignedUserNotesSearchResultSet.getValue(
							{
								name: "notedate",
								join: "userNotes",
							}
						);
						var userNotesAuthor =
							customerSignedUserNotesSearchResultSet.getText({
								name: "author",
								join: "userNotes",
							});
						var userNotesTitle =
							customerSignedUserNotesSearchResultSet.getValue({
								name: "title",
								join: "userNotes",
							});
						var userNotesNote = customerSignedUserNotesSearchResultSet.getValue(
							{
								name: "note",
								join: "userNotes",
							}
						);

						childCustomerUserNotes.push({
							userNotesDate: userNotesDate,
							userNotesAuthor: userNotesAuthor,
							userNotesTitle: userNotesTitle,
							userNotesNote: userNotesNote,
						});
						return true;
					});

				debtDataSetScheduled.push([
					"",
					linkURL,
					customerIDLink,
					debt_row.custName,
					debt_row.zeeName,
					debt_row.serviceEmail,
					debt_row.phone,
					debt_row.lastAssigned,
					debt_row.dateEffective,
					debt_row.taskDueDate,
					debt_row.taskTime,
					debt_row.salesRepAssignedText,
					debt_row.taskStatus,
					debt_row.taskNotes,
					childCustomerUserNotes,
				]);
			});
		}

		var dataTableSceduled = $("#table-scheduled").DataTable();
		dataTableSceduled.clear();
		dataTableSceduled.rows.add(debtDataSetScheduled);
		dataTableSceduled.draw();

		console.log("dataTableSceduled", dataTableSceduled);
		console.log("childCustomerUserNotes", childCustomerUserNotes);

		dataTableSceduled.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildUserNotes(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#table-scheduled tbody").on("click", "td.dt-control", function () {
			var tr = $(this).closest("tr");
			var row = dataTableSceduled.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				destroyChild(row);
				tr.removeClass("shown");
				tr.removeClass("parent");

				$(".expand-button").addClass("btn-primary");
				$(".expand-button").removeClass("btn-light");
			} else {
				// Open this row
				row.child.show();
				tr.addClass("shown");
				tr.addClass("parent");

				$(".expand-button").removeClass("btn-primary");
				$(".expand-button").addClass("btn-light");
			}
		});

		var childCustomerUserNotes = [];

		if (!isNullorEmpty(debt_set_completed)) {
			debt_set_completed.forEach(function (debt_row, index) {
				if (debt_row.taskStatus == "") {
					var linkURL =
						'<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.custInternalID +
						'" class="taskModalPopUP" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						scheduleTaskIcon +
						"</a></button>";
				} else if (debt_row.taskStatus == "Completed") {
					var linkURL = "";
				} else {
					var linkURL =
						'<button class="form-control btn btn-xs btn-warning" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.taskInternalId +
						'" date-customerid="' +
						debt_row.custInternalID +
						'" class="editTaskModalPopUP" style="cursor: pointer !important;color: black;border-radius: 30px;">' +
						editTaskIcon +
						'</a></button> <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;border-radius: 30px;"><a data-id="' +
						debt_row.taskInternalId +
						'" data-type="completed" class="onboardingCompleted" style="cursor: pointer !important;color: white;border-radius: 30px;">' +
						completeTaskIcon +
						"</a></button>";
				}

				var customerIDLink =
					'<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
					debt_row.custInternalID +
					'&whence=" target="_blank"><b>' +
					debt_row.custEntityID +
					"</b></a>";

				//Search Name: User Notes - Signed Customers
				var customerSignedUserNotesSearch = search.load({
					type: "customer",
					id: "customsearch_user_notes_signed_customers",
				});
				customerSignedUserNotesSearch.filters.push(
					search.createFilter({
						name: "internalid",
						join: null,
						operator: search.Operator.IS,
						values: debt_row.custInternalID,
					})
				);
				customerSignedUserNotesSearch
					.run()
					.each(function (customerSignedUserNotesSearchResultSet) {
						var userNotesDate = customerSignedUserNotesSearchResultSet.getValue(
							{
								name: "notedate",
								join: "userNotes",
							}
						);
						var userNotesAuthor =
							customerSignedUserNotesSearchResultSet.getText({
								name: "author",
								join: "userNotes",
							});
						var userNotesTitle =
							customerSignedUserNotesSearchResultSet.getValue({
								name: "title",
								join: "userNotes",
							});
						var userNotesNote = customerSignedUserNotesSearchResultSet.getValue(
							{
								name: "note",
								join: "userNotes",
							}
						);

						childCustomerUserNotes.push({
							userNotesDate: userNotesDate,
							userNotesAuthor: userNotesAuthor,
							userNotesTitle: userNotesTitle,
							userNotesNote: userNotesNote,
						});
						return true;
					});

				debtDataSetCompleted.push([
					"",
					linkURL,
					customerIDLink,
					debt_row.custName,
					debt_row.zeeName,
					debt_row.serviceEmail,
					debt_row.phone,
					debt_row.lastAssigned,
					debt_row.dateEffective,
					debt_row.taskDueDate,
					debt_row.taskTime,
					debt_row.salesRepAssignedText,
					debt_row.taskStatus,
					debt_row.taskNotes,
					childCustomerUserNotes,
				]);
			});
		}

		var dataTableCompleted = $("#table-completed").DataTable();
		dataTableCompleted.clear();
		dataTableCompleted.rows.add(debtDataSetCompleted);
		dataTableCompleted.draw();

		console.log("dataTableCompleted", dataTableCompleted);
		console.log("childCustomerUserNotes", childCustomerUserNotes);

		dataTableCompleted.rows().every(function () {
			// this.child(format(this.data())).show();
			this.child(createChildUserNotes(this)); // Add Child Tables
			this.child.hide(); // Hide Child Tables on Open
		});

		$("#table-completed tbody").on("click", "td.dt-control", function () {
			var tr = $(this).closest("tr");
			var row = dataTableCompleted.row(tr);

			if (row.child.isShown()) {
				// This row is already open - close it
				destroyChild(row);
				tr.removeClass("shown");
				tr.removeClass("parent");

				$(".expand-button").addClass("btn-primary");
				$(".expand-button").removeClass("btn-light");
			} else {
				// Open this row
				row.child.show();
				tr.addClass("shown");
				tr.addClass("parent");

				$(".expand-button").removeClass("btn-primary");
				$(".expand-button").addClass("btn-light");
			}
		});

		// Create the chart
		Highcharts.chart("container-progress", {
			chart: {
				type: "pie",
				backgroundColor: "#CFE0CE",
			},
			title: {
				text: "",
			},
			accessibility: {
				announceNewData: {
					enabled: true,
				},
				point: {
					valueSuffix: "",
				},
			},

			plotOptions: {
				series: {
					allowPointSelect: true,
					cursor: "pointer",
					dataLabels: [
						{
							enabled: true,
							distance: 20,
							style: {
								fontSize: "1em",
								textOutline: "none",
								opacity: 0.7,
							},
						},
						{
							enabled: true,
							distance: -40,
							format: "{point.y:.0f}",
							style: {
								fontSize: "1em",
								textOutline: "none",
								opacity: 0.7,
							},
						},
					],
				},
			},

			tooltip: {
				valueSuffix: "",
				style: {
					fontSize: "1em",
				},
			},

			series: [
				{
					name: "Leads",
					colorByPoint: true,
					data: [
						{
							name: "Completed",
							y: debt_set_completed.length,
							sliced: true,
							selected: true,
							color: "#5cb3b0",
						},
						{
							name: "Scheduled",
							y: debt_set_scheduled.length,
							sliced: false,
							color: "#FEBE8C",
						},
						{
							name: "Requested",
							y: debt_set_requested.length,
							sliced: false,
							color: "#F5F0F0FF",
						},
					],
				},
			],
		});

		return true;
	}

	function createChildUserNotes(row) {
		// This is the table we'll convert into a DataTable
		var table = $('<table class="display" width="50%"/>');
		var childSet = [];

		row.data()[14].forEach(function (el) {
			if (!isNullorEmpty(el)) {
				childSet.push([
					el.userNotesDate,
					el.userNotesAuthor,
					el.userNotesTitle,
					el.userNotesNote,
				]);
			}
		});
		// Display it the child row
		row.child(table).show();

		// Initialise as a DataTable
		var usersTable = table.DataTable({
			bPaginate: true,
			bLengthChange: false,
			bFilter: true,
			bInfo: false,
			bAutoWidth: false,
			data: childSet,
			pageLength: 5,
			order: [0, "desc"],
			columns: [
				{ title: "DATE" }, //0
				{ title: "AUTHOR" }, //1
				{ title: "TITLE" }, //2
				{ title: "NOTE" }, //3
			],
			columnDefs: [
				{
					targets: [3],
					className: "col-xs-3",
				},
			],
			rowCallback: function (row, data) {},
		});
	}
	function destroyChild(row) {
		// And then hide the row
		row.child.hide();
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

	function formatDateToYYYYMMDD(dateStr) {
		var date = new Date(dateStr);
		var year = date.getFullYear();
		var month = customPadStart((date.getMonth() + 1).toString(), 2, "0");
		var day = customPadStart(date.getDate().toString(), 2, "0");
		return year + "-" + month + "-" + day;
	}

	// Function to convert time to 24-hour format
	function convertTo24HourFormat(dateStr) {
		var date = new Date(dateStr);
		var hours = customPadStart((date.getUTCHours() + 11).toString(), 2, "0");
		var minutes = customPadStart(date.getUTCMinutes().toString(), 2, "0"); // Create a Date object with the given time
		return hours + ":" + minutes;
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

	function saveRecord() {}

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
	 * @description Converts a date from "dd/mm/yyyy" format to "yyyy-mm-dd" format.
	 * @param {string} dateStr - The date string in "dd/mm/yyyy" format.
	 * @returns {string} The date string in "yyyy-mm-dd" format.
	 */
	function convertDateToYYYYMMDD(dateStr) {
		var parts = dateStr.split("/");
		var day = parts[0];
		var month = parts[1];
		var year = parts[2];
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
	};
});
