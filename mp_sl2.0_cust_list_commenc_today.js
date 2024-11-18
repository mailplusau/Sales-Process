/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Thu Nov 14 2024
 * Modified on:          Thu Nov 14 2024 13:20:42
 * SuiteScript Version:  2.0 
 * Description:          List of customers that require ShipMate Onboarding and scheduling of the onboarding task. 
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */

define([
	"N/ui/serverWidget",
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/http",
	"N/log",
	"N/redirect",
], function (ui, email, runtime, search, record, http, log, redirect) {
	var role = 0;
	var userId = 0;
	var zee = 0;

	function onRequest(context) {
		var baseURL = "https://system.na2.netsuite.com";
		if (runtime.EnvType == "SANDBOX") {
			baseURL = "https://system.sandbox.netsuite.com";
		}
		userId = runtime.getCurrentUser().id;

		role = runtime.getCurrentUser().role;

		if (context.request.method === "GET") {
			zee = context.request.parameters.zee;
			userId = context.request.parameters.user_id;

			var commencement_start_date =
				context.request.parameters.commence_date_from;
			var commencement_last_date = context.request.parameters.commence_date_to;

			var cancelled_start_date = context.request.parameters.cancel_date_from;
			var cancelled_last_date = context.request.parameters.cancel_date_to;

			if (isNullorEmpty(userId)) {
				userId = null;
			}

			var todayDateYYYYMMDD = getTodaysDate();
			var todayDateDDMMYYYY = convertToNetSuiteDate(todayDateYYYYMMDD);

			if (
				isNullorEmpty(commencement_start_date) &&
				isNullorEmpty(commencement_last_date) &&
				isNullorEmpty(cancelled_start_date) &&
				isNullorEmpty(cancelled_last_date)
			) {
				commencement_start_date = todayDateYYYYMMDD;
				commencement_last_date = todayDateYYYYMMDD;
				cancelled_start_date = todayDateYYYYMMDD;
				cancelled_last_date = todayDateYYYYMMDD;

				var form = ui.createForm({
					title:
						"Trials Commencing & Service Commencing on " +
						todayDateDDMMYYYY +
						" - Customer List",
				});
			} else {
				var form = ui.createForm({
					title: "Trials Commencing & Service Commencing - Customer List",
				});
			}

			var inlineHtml =
				'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.0.7/css/dataTables.dataTables.css"><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.0.2/css/buttons.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/2.0.7/js/dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/dataTables.buttons.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.html5.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.print.min.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://blacklabel.github.io/grouped_categories/grouped-categories.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script>';
			inlineHtml +=
				'<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" /><script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>';
			inlineHtml +=
				'<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/css/bootstrap-select.min.css">';
			inlineHtml +=
				'<script src="https://cdn.jsdelivr.net/npm/bootstrap-select@1.13.14/dist/js/bootstrap-select.min.js"></script>';
			// Semantic Select
			inlineHtml +=
				'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.css">';
			inlineHtml +=
				'<script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.13/semantic.min.js"></script>';

			inlineHtml +=
				"<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;}</style>";

			inlineHtml +=
				'<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br>This page shows you customers who are starting their MailPlus journey. This includes those beginning a free trial or starting their paid service.</br></br><b><u>To ensure a smooth start for these customers, schedule a welcome call with them.:</u></b><ul><li><b>SCHEDULE TASK</b>: Click this to schedule your call. This task will be added to your NetSuite Calender and reminder emails will be sent out.</li><li><b>EDIT TASK</b>: Click this once you\'ve finished the call.</li><li><b>COMPLETED</b>: Button to be clicked once the Onboarding session has been completed with the customer.</li></ul></div></br>';

			form
				.addField({
					id: "custpage_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});

			//Display the modal pop-up to edit the customer details
			inlineHtml += updateCustomerModal();

			//Loading Section that gets displayed when the page is being loaded
			inlineHtml += loadingSection();
			// inlineHtml += franchiseeDropdownSection(context);

			inlineHtml +=
				'<div class="form-group container signed_up_label_section hide">';
			inlineHtml += '<div class="row">';
			inlineHtml +=
				'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">COMMENCEMENT DATE - FILTER</span></h4></div>';
			inlineHtml += "</div>";
			inlineHtml += "</div>";

			inlineHtml += '<div class="form-group container signed_up_div hide">';
			inlineHtml += '<div class="row">';
			// Date from field
			inlineHtml += '<div class="col-xs-6 date_from">';
			inlineHtml += '<div class="input-group">';
			inlineHtml +=
				'<span class="input-group-addon" id="date_signed_up_from_text">COMMENCEMENT DATE - FROM</span>';
			if (isNullorEmpty(commencement_start_date)) {
				inlineHtml +=
					'<input id="commencement_date_from" class="form-control commencement_date_from" type="date" />';
			} else {
				inlineHtml +=
					'<input id="commencement_date_from" class="form-control commencement_date_from" type="date" value="' +
					commencement_start_date +
					'"/>';
			}

			inlineHtml += "</div></div>";
			// Date to field
			inlineHtml += '<div class="col-xs-6 usage_date_to">';
			inlineHtml += '<div class="input-group">';
			inlineHtml +=
				'<span class="input-group-addon" id="date_signed_up_to_text">COMMENCEMENT DATE - TO</span>';
			if (isNullorEmpty(commencement_last_date)) {
				inlineHtml +=
					'<input id="commencement_date_to" class="form-control commencement_date_to" type="date">';
			} else {
				inlineHtml +=
					'<input id="commencement_date_to" class="form-control commencement_date_to" type="date" value="' +
					commencement_last_date +
					'">';
			}

			inlineHtml += "</div></div></div></div>";

			// inlineHtml +=
			// 	'<div class="form-group container signed_up_label_section hide">';
			// inlineHtml += '<div class="row">';
			// inlineHtml +=
			// 	'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">CANCELLATION DATE - FILTER</span></h4></div>';
			// inlineHtml += "</div>";
			// inlineHtml += "</div>";

			// inlineHtml += '<div class="form-group container signed_up_div hide">';
			// inlineHtml += '<div class="row">';
			// // Date from field
			// inlineHtml += '<div class="col-xs-6 date_from">';
			// inlineHtml += '<div class="input-group">';
			// inlineHtml +=
			// 	'<span class="input-group-addon" id="date_signed_up_from_text">CANCELLATION DATE - FROM</span>';
			// if (isNullorEmpty(cancelled_start_date)) {
			// 	inlineHtml +=
			// 		'<input id="cancellation_date_from" class="form-control cancellation_date_from" type="date" />';
			// } else {
			// 	inlineHtml +=
			// 		'<input id="cancellation_date_from" class="form-control cancellation_date_from" type="date" value="' +
			// 		cancelled_start_date +
			// 		'"/>';
			// }

			// inlineHtml += "</div></div>";
			// // Date to field
			// inlineHtml += '<div class="col-xs-6 usage_date_to">';
			// inlineHtml += '<div class="input-group">';
			// inlineHtml +=
			// 	'<span class="input-group-addon" id="date_signed_up_to_text">CANCELLATION DATE - TO</span>';
			// if (isNullorEmpty(cancelled_last_date)) {
			// 	inlineHtml +=
			// 		'<input id="cancellation_date_to" class="form-control cancellation_date_to" type="date">';
			// } else {
			// 	inlineHtml +=
			// 		'<input id="cancellation_date_to" class="form-control cancellation_date_to" type="date" value="' +
			// 		cancelled_last_date +
			// 		'">';
			// }

			// inlineHtml += "</div></div></div></div>";

			inlineHtml +=
				'<div class="form-group container filter_buttons_section hide">';
			inlineHtml += '<div class="row">';
			inlineHtml += '<div class="col-xs-2"></div>';
			inlineHtml +=
				'<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="background-color: #095C7B; border-radius: 30px" /></div>';
			inlineHtml +=
				'<div class="col-xs-4"><input type="button" value="CLEAR FILTER" class="form-control btn btn-primary" id="clearFilter" style="background-color: #F0AECB; color: #103d39;border-radius: 30px" /></div>';
			inlineHtml += '<div class="col-xs-2"></div>';

			inlineHtml += "</div>";
			inlineHtml += "</div>";

			inlineHtml += '<div id="container"></div>';
			inlineHtml += spacing();
			inlineHtml += tabsSection();

			//Button to reload the page when the filters have been selected
			// form.addButton({
			//   id: 'submit_search',
			//   label: 'Submit Search',
			//   functionName: 'addFilters()'
			// });

			form
				.addField({
					id: "preview_table",
					label: "inlinehtml",
					type: "inlinehtml",
				})
				.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW,
				}).defaultValue = inlineHtml;

			form.clientScriptFileId = 7314196;

			context.response.writePage(form);
		} else {
		}
	}

	function tabsSection() {
		var inlineHtml = '<div class="tabs_section hide">';

		// Tabs headers
		inlineHtml +=
			"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		inlineHtml +=
			".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		inlineHtml += "</style>";

		inlineHtml +=
			'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		inlineHtml +=
			'<li role="presentation" class="active"><a data-toggle="tab" href="#customer" style="border-radius: 30px"><b>CUSTOMERS</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class="hide"><a data-toggle="tab" href="#cancellation" style="border-radius: 30px"><b>CANCELLATIONS</b></a></li>';

		inlineHtml += "</ul></div>";

		inlineHtml += '<div class="tab-content">';
		inlineHtml += '<div role="tabpanel" class="tab-pane active" id="customer">';
		inlineHtml += dataTable("customer");
		inlineHtml += "</div>";
		inlineHtml += '<div role="tabpanel" class="tab-pane" id="cancellation">';
		inlineHtml += dataTable("cancellation");
		inlineHtml += "</div>";
		inlineHtml += "</div></div>";

		return inlineHtml;
	}

	/*
	 * PURPOSE : HTML code to generate the Modal Pop-up
	 *  PARAMS :  -
	 * RETURNS : HTML
	 *   NOTES :
	 */
	function updateCustomerModal() {
		var inlineHtml =
			'<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">ShipMate Onboarding Task</h3></div>';

		inlineHtml += '<div class="modal-body" style="padding: 2px 16px;">';

		inlineHtml += spacing();

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<input type="text" id="task_id" value="" hidden/><input type="text" id="customer_id" value="" hidden/><div class="col-xs-6 date_section"><div class="input-group"><span class="input-group-addon">SET ONBOARDING DATE <span class="mandatory">*</span></span><input type="date" id="date" class="form-control" /></div></div>';
		inlineHtml +=
			'<div class="col-xs-6 time_section"><div class="input-group"><span class="input-group-addon">SET ONBOARDING TIME <span class="mandatory">*</span></span><input type="time" id="time" class="form-control" /></div></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container row_call_back">';
		inlineHtml += '<div class="row">';

		inlineHtml +=
			'<div class="col-xs-12 task_notes"><div class="input-group"><span class="input-group-addon">NOTES </span><textarea class="form-control note" rows="4" cols="50"></textarea></div></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="Schedule ShipMate Onboarding" class="form-control btn-primary" id="scheduleOnboarding" style="background-color: #095C7B; border-radius: 30px;"/></div></div></div>';

		return inlineHtml;
	}

	/**
	 * The table that will display the differents invoices linked to the franchisee and the time period.
	 * @return  {String}    inlineHtml
	 */
	function dataTable(tableName) {
		var inlineHtml =
			"<style>table#table-" +
			tableName +
			" {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#table-" +
			tableName +
			" th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
		inlineHtml +=
			'<table id="table-' +
			tableName +
			'" class="table table-responsive table-striped tablesorter" style="width: 100%;border: 2px solid #103d39;background-color: #ffffff"">';
		inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
		inlineHtml += '<tr class="text-center">';
		inlineHtml += "</tr>";
		inlineHtml += "</thead>";

		inlineHtml +=
			'<tbody id="result_' +
			tableName +
			'" class="result-' +
			tableName +
			'"></tbody>';

		inlineHtml += "</table>";
		return inlineHtml;
	}

	/**
	 * The header showing that the results are loading.
	 * @returns {String} `inlineQty`
	 */
	function loadingSection() {
		var inlineHtml =
			'<div class="wrapper loading_section" style="height: 10em !important;left: 50px !important">';
		inlineHtml += '<div class="row">';
		inlineHtml += '<div class="col-xs-12 ">';
		inlineHtml += '<h1 style="color: #095C7B;">Loading</h1>';
		inlineHtml += "</div></div></div></br></br>";
		inlineHtml += '<div class="wrapper loading_section">';
		inlineHtml += '<div class="blue ball"></div>';
		inlineHtml += '<div class="red ball"></div>';
		inlineHtml += '<div class="yellow ball"></div>';
		inlineHtml += '<div class="green ball"></div>';

		inlineHtml += "</div>";

		return inlineHtml;
	}

	/**
	 * The Franchisee dropdown field.
	 * @param   {zeeSearchResult}    resultSetZees
	 * @return  {String}    `inlineHtml`
	 */
	function franchiseeDropdownSection(context) {
		//Dropdown to Select the Fracnhisee
		//Search: SMC - Franchisees
		var searchZees = search.load({
			id: "customsearch_smc_franchisee",
		});
		var resultSetZees = searchZees.run();
		var inlineHtml =
			'<div class="form-group container zee_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">FRANCHISEE</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'<div class="form-group container zee_dropdown_section hide">';
		inlineHtml += '<div class="row">';
		// Period dropdown field
		inlineHtml += '<div class="col-xs-12 zee_dropdown_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="zee_dropdown_text">Franchisee</span>';
		inlineHtml +=
			'<select id="zee_dropdown" class="js-example-basic-multiple js-states form-control" style="width: 100%">';
		inlineHtml += '<option value=""></option>';
		resultSetZees.each(function (searchResult_zee) {
			zee_id = searchResult_zee.getValue("internalid");
			zee_name = searchResult_zee.getValue("companyname");

			if (role == 1000) {
				if (zee == zee_id) {
					inlineHtml +=
						'<option value="' +
						zee_id +
						'" selected="selected">' +
						zee_name +
						"</option>";
				}
			} else {
				if (isNullorEmpty(zee)) {
					inlineHtml +=
						'<option value="' + zee_id + '">' + zee_name + "</option>";
				} else {
					if (zee.indexOf(",") != -1) {
						var zeeArray = zee.split(",");
					} else {
						var zeeArray = [];
						zeeArray.push(zee);
					}

					if (zeeArray.indexOf(zee_id) != -1) {
						inlineHtml +=
							'<option value="' +
							zee_id +
							'" selected="selected">' +
							zee_name +
							"</option>";
					} else {
						inlineHtml +=
							'<option value="' + zee_id + '">' + zee_name + "</option>";
					}
				}
				// if (zee == zee_id) {
				//     inlineHtml += '<option value="' + zee_id +
				//         '" selected="selected">' + zee_name + '</option>';
				// } else {
				//     inlineHtml += '<option value="' + zee_id + '">' + zee_name +
				//         '</option>';
				// }
			}

			return true;
		});
		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";

		return inlineHtml;
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

	function spacing() {
		var inlineHtml =
			'<div class="form-group spacing_section" style="height: 25px;">';
		inlineHtml += '<div class="row">';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		return inlineHtml;
	}

	/**
	 * @description Gets yesterday's date in "YYYY-MM-DD" format.
	 * @returns {String} Yesterday's date in "YYYY-MM-DD" format.
	 */
	function getTodaysDate() {
		var today = new Date();
		today.setHours(today.getHours() + 17);

		var year = today.getFullYear();
		var month = customPadStart((today.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
		var day = customPadStart(today.getDate().toString(), 2, "0");

		return year + "-" + month + "-" + day;
	}

	/**
	 * @description Converts a date from "M/D/YYYY" format to "YYYY-DD-MM" format.
	 * @param {String} date_mdyyyy - The date string in "D/M/YYYY" format.
	 * @returns {String} The date string in "YYYY-DD-MM" format.
	 */
	function convertToDateInputFormat(date_mdyyyy) {
		// Split the input date string into components
		const [day, month, year] = date_mdyyyy.split("/");

		// Format the date to "YYYY-MM-DD"
		const formattedDate =
			year +
			"-" +
			customPadStart(month, 2, "0") +
			"-" +
			customPadStart(day, 2, "0");

		return formattedDate;
	}

	/**
	 * @description Converts a date from "YYYY-DD-MM" format to NetSuite date format "M/D/YYYY".
	 * @param {String} date_yyyymmdd - The date string in "YYYY-MM-DD" format.
	 * @returns {String} The date string in NetSuite date format "DD/MM/YYYY".
	 */
	function convertToNetSuiteDate(date_yyyymmdd) {
		// Split the input date string into components
		var [year, month, day] = date_yyyymmdd.split("-");

		// Create a new Date object using the parsed components
		var date = new Date(year, month - 1, day); // month is zero-based

		// Format the date to "DD/MM/YYYY"
		var formattedDate =
			customPadStart(date.getDate().toString(), 2, "0") +
			"/" +
			customPadStart((date.getMonth() + 1).toString(), 2, "0") +
			"/" +
			date.getFullYear();

		return formattedDate;
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
		onRequest: onRequest,
	};
});
