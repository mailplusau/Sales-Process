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

			if (isNullorEmpty(userId)) {
				userId = null;
			}

			var form = ui.createForm({
				title: "ShipMate Onboarding Required - Customer List",
			});

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
				'<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br>This page displays a list of customers who need to be onboarded to ShipMate.</br></br><b><u>For each customer, you can:</u></b><ul><li><b>SCHEDULE TASK</b>: Click this button to schedule an onboarding call with the customer. This will add a task to your NetSuite Calendar and reminder emails will be sent to you.</li><li><b>EDIT TASK</b>: Click this button to reschedule an existing onboarding call to a different date or time.</li><li><b>COMPLETED</b>: Click this button once you have finished the onboarding session with the customer.</li></ul></div></br>';

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
			inlineHtml += franchiseeDropdownSection(context);

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
			inlineHtml += dataTable();

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

			form.clientScriptFileId = 7308797;

			context.response.writePage(form);
		} else {
		}
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
	function dataTable() {
		var inlineHtml =
			"<style>table#customer_benchmark_preview {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#customer_benchmark_preview th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
		inlineHtml +=
			'<table id="customer_benchmark_preview" class="table table-responsive table-striped customer tablesorter hide" style="width: 100%;border: 2px solid #103d39;background-color: #ffffff"">';
		inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
		inlineHtml += '<tr class="text-center">';
		inlineHtml += "</tr>";
		inlineHtml += "</thead>";

		inlineHtml +=
			'<tbody id="result_customer_benchmark" class="result-customer_benchmark"></tbody>';

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
