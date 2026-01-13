/**
 * @NApiVersion 2.0
 * @NScriptType Portlet

 * Author:               Ankith Ravindran
 * Created on:           Tue Apr 18 2023
 * Modified on:          Tue Apr 18 2023 11:23:49
 * SuiteScript Version:  2.0 
 * Description:          Reporting page that shows reporting based on the leads that come into the system and the customers that have been signed up based on the leads.  
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
 */

define([
	"N/ui/serverWidget",
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/https",
	"N/log",
	"N/redirect",
	"N/url",
], function (ui, email, runtime, search, record, https, log, redirect, url) {
	var role = 0;
	var userId = 0;
	var zee = 0;

	var employee_list = [];
	var employee_list_color = [];

	var campaign_list = [];
	var campaign_list_color = [];

	var source_list = [];
	var source_list_color = [];

	function render(params) {
		userId = runtime.getCurrentUser().id;
		role = runtime.getCurrentUser().role;

		var portlet = params.portlet;

		portlet.title = "Lead Dashboard";

		var baseURL = "https://system.na2.netsuite.com";
		if (runtime.EnvType == "SANDBOX") {
			baseURL = "https://system.sandbox.netsuite.com";
		}

		var start_date = null;
		var last_date = null;

		var modified_start_date = null;
		var modified_last_date = null;

		var commencement_start_date = null;
		var commencement_last_date = null;

		var cancelled_start_date = null;
		var cancelled_last_date = null;

		var usage_date_from = null;
		var usage_date_to = null;

		var date_signed_up_from = null;
		var date_signed_up_to = null;

		var date_quote_sent_to = null;
		var date_quote_sent_from = null;

		var invoice_date_from = null;
		var invoice_date_to = null;
		var invoice_type = null;

		var source = ["296333", "295896", "254557", "-4"];
		var parentLPO = null;
		var salesrep = null;
		var lead_entered_by = null;

		var showTotal = null;
		var calcprodusage = 2;
		var sales_activity_notes = 2;
		var leadStatus = null;
		var campaign = null;
		var customer_type = 2;

		//If role is Franchisee
		if (role == 1000) {
			zee = runtime.getCurrentUser().id;
			if (zee == 626428) {
				zee = 1645493;
			}
		} else {
			// System Support
			// zee = 1645493; //test-AR
		}

		var date = new Date();
		var y = date.getFullYear();
		var m = date.getMonth();

		//Last 3 months rolling
		var i = 0;
		var lastDay = new Date(y, m + 1, 0);
		do {
			if (m == 1) {
				m = 12;
				y--;
			} else {
				m--;
			}
			i++;
		} while (i < 5);

		var firstDay = new Date(y, m, 1);
		firstDay.setHours(0, 0, 0, 0);
		lastDay.setHours(0, 0, 0, 0);

		start_date = GetFormattedDate(firstDay);
		last_date = GetFormattedDate(lastDay);

		log.debug({
			title: "start_date",
			details: start_date,
		});
		log.debug({
			title: "last_date",
			details: last_date,
		});

		if (isNullorEmpty(usage_date_from)) {
			usage_date_from = firstDay;
		}

		if (isNullorEmpty(usage_date_to)) {
			usage_date_to = lastDay;
		}

		var inlineHtml =
			'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/2.0.7/css/dataTables.dataTables.css"><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/3.0.2/css/buttons.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/2.0.7/js/dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/dataTables.buttons.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.dataTables.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.html5.min.js"></script><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/3.0.2/js/buttons.print.min.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA92XGDo8rx11izPYT7z2L-YPMMJ6Ih1s0&callback=initMap&libraries=places"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script>';
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
			"<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;} .completeddot{height:25px;width:25px;background-color:#5cb3b0;border-radius:50%;display:inline-block}</style>";
		inlineHtml += loadingSection();
		inlineHtml +=
			'<div class="form-group container show_buttons_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml += '<div class="col-xs-3"></div>';

		inlineHtml +=
			'<div class="col-xs-6"><input type="button" value="SHOW DESCRIPTION" class="form-control btn btn-primary" data-toggle="collapse" data-target="#collapseExample" id="show_filter" aria-expanded="false" aria-controls="collapseExample" style="background-color: #EAF044; color: #103d39; border-radius: 30px" /></div>';
		inlineHtml += '<div class="col-xs-3"></div>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'<div class="collapse" id="collapseExample"><div class="card card-body">';
		inlineHtml += "<div>";

		inlineHtml +=
			'<div class="container instruction_div " style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p>This dashboard helps you track new customer leads and their progress over the last three months. It shows how many potential customers have been contacted, their status, and which ones have signed up based on when they were entered in netsuite.</br></br><b><u>What You Can Do Here:</u></b></br><ul><li><b>See Your Leads</b>: View all new customer leads by month for last 3-months.</li><li><b>Track Lead Progress</b>: Find out if a lead is in contact (suspect), in qualification (prospect), or has signed up (customer).</li><li><b>Identify Opportunities</b>: Spot potential customers who need follow-ups.</li><li><b>Check Lost Leads</b>: Understand why some leads didn’t convert.</li></ul>Click the "<b>Full Report</b>" button for a detailed breakdown of your leads and opportunities.</p></br>';

		inlineHtml += "</div></div></div></div></br>";

		inlineHtml +=
			'<div class="form-group container filter_buttons_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml += '<div class="col-xs-4"></div>';
		inlineHtml +=
			'<div class="col-xs-4"><input type="button" value="FULL REPORT" class="form-control btn btn-primary button-shadow" id="fullReport" style="background-color: #095C7B;border-radius: 30px;" /></div>';
		inlineHtml += '<div class="col-xs-4"></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="data-range_note  hide" style="color: red;text-align: center;font-weight: bolder;font-size: 14px;"><i>Please note, the data shown below is moving over a 6-month period.</i></div></br><div class="tab-content">';

		// inlineHtml +=
		// 	'<div class="form-group container show_buttons_section hide">';
		// inlineHtml += '<div class="row">';
		// inlineHtml += '<div class="col-xs-5"></div>';

		// inlineHtml +=
		// 	'<div class="col-xs-2"><input type="button" value="SHOW FILTERS" class="form-control btn btn-primary" data-toggle="collapse" data-target="#collapseExample" id="show_filter" aria-expanded="false" aria-controls="collapseExample" style="background-color: #EAF044; color: #103d39; border-radius: 30px" /></div>';
		// inlineHtml += '<div class="col-xs-5"></div>';

		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		inlineHtml +=
			'<div class="collapse" id="collapseExample"><div class="card card-body">';
		inlineHtml += "<div>";
		//Dropdown to Select the Fracnhisee
		//Search: SMC - Franchisees
		var searchZees = search.load({
			id: "customsearch_smc_franchisee",
		});
		var resultSetZees = searchZees.run();

		inlineHtml += franchiseeDropdownSection(resultSetZees);
		inlineHtml += leadSourceFilterSection(
			source,
			salesrep,
			campaign,
			"",
			"",
			customer_type
		);
		inlineHtml += dateFilterSection(
			start_date,
			last_date,
			usage_date_from,
			usage_date_to,
			date_signed_up_from,
			date_signed_up_to,
			invoice_date_from,
			invoice_date_to,
			invoice_type,
			date_quote_sent_to,
			date_quote_sent_from,
			calcprodusage,
			modified_start_date,
			modified_last_date,
			sales_activity_notes,
			commencement_start_date,
			commencement_last_date,
			cancelled_start_date,
			cancelled_last_date
		);
		inlineHtml += "</div></div></div>";

		inlineHtml += tabsSection(campaign);
		// inlineHtml += dataTable();

		portlet
			.addField({
				id: "preview_table",
				label: "inlinehtml",
				type: "inlinehtml",
			})
			.updateLayoutType({
				layoutType: ui.FieldLayoutType.STARTROW,
			}).defaultValue = inlineHtml;
		portlet.clientScriptFileId = 7486621;
	}

	/**
	 * The Franchisee dropdown field.
	 * @param   {zeeSearchResult}    resultSetZees
	 * @return  {String}    `inlineHtml`
	 */
	function franchiseeDropdownSection(resultSetZees) {
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
		inlineHtml += '<select id="zee_dropdown" class="form-control">';
		inlineHtml += '<option value=""></option>';
		resultSetZees.each(function (searchResult_zee) {
			zee_id = searchResult_zee.getValue("internalid");
			zee_name = searchResult_zee.getValue("companyname");

			if (zee == zee_id) {
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

			return true;
		});
		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";

		return inlineHtml;
	}


	function leadSourceFilterSection(
		source,
		salesrep,
		campaign,
		parentLPO,
		lead_entered_by,
		customer_type
	) {
		var inlineHtml =
			'<div class="form-group container source_salesrep_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">LEAD SOURCE & SALES REP - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'<div class="form-group container source_salesrep_section hide">';
		inlineHtml += '<div class="row">';

		inlineHtml += '<div class="col-xs-6 campaign_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="source_text">CAMPAIGN</span>';
		inlineHtml +=
			'<select id="sales_campaign" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
		inlineHtml += "<option></option>";

		var salesCampaignSearch = search.load({
			type: "customrecord_salescampaign",
			id: "customsearch_sales_button_campaign",
		});

		salesCampaignSearch.run().each(function (salesCampaignSearchResultSet) {
			var salesCampaignInternalId =
				salesCampaignSearchResultSet.getValue("internalid");
			var salesCampaignName = salesCampaignSearchResultSet.getValue("name");
			var campaignColorCode = salesCampaignSearchResultSet.getValue(
				"custrecord_campaign_color_code"
			);

			if (isNullorEmpty(campaignColorCode)) {
				campaignColorCode = "#F5F7F8";
			}

			campaign_list.push(salesCampaignInternalId);
			campaign_list_color.push(campaignColorCode);

			if (isNullorEmpty(campaign)) {
				inlineHtml +=
					'<option value="' +
					salesCampaignInternalId +
					'" >' +
					salesCampaignName +
					"</option>";
			} else {
				if (campaign.indexOf(",") != -1) {
					var campaignArray = campaign.split(",");
				} else {
					var campaignArray = [];
					campaignArray.push(campaign);
				}

				if (campaignArray.indexOf(salesCampaignInternalId) != -1) {
					inlineHtml +=
						'<option value="' +
						salesCampaignInternalId +
						'" selected>' +
						salesCampaignName +
						"</option>";
				} else {
					inlineHtml +=
						'<option value="' +
						salesCampaignInternalId +
						'" >' +
						salesCampaignName +
						"</option>";
				}
			}

			return true;
		});

		inlineHtml += "</select>";
		inlineHtml += "</div></div>";

		inlineHtml += '<div class="col-xs-6 source_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="source_text">SOURCE</span>';
		inlineHtml +=
			'<select id="lead_source" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
		inlineHtml += "<option></option>";
		//NetSuite Search: LEAD SOURCE
		var leadSourceSearch = search.load({
			type: "campaign",
			id: "customsearch_lead_source",
		});

		leadSourceSearch.run().each(function (leadSourceResultSet) {
			var leadsourceid = leadSourceResultSet.getValue({
				name: "internalid",
			});
			var leadsourcename = leadSourceResultSet.getValue({
				name: "title",
			});
			var sourceColorCode = leadSourceResultSet.getValue({
				name: "custevent_source_color_code",
			});

			if (!isNullorEmpty(sourceColorCode)) {
				source_list.push(leadsourceid);
				source_list_color.push(sourceColorCode);
			}

			if (isNullorEmpty(source)) {
				inlineHtml +=
					'<option value="' +
					leadsourceid +
					'" >' +
					leadsourcename +
					"</option>";
			} else {
				if (source.indexOf(",") != -1) {
					var sourceArray = source.split(",");
				} else {
					var sourceArray = [];
					sourceArray.push(source);
				}

				if (sourceArray.indexOf(leadsourceid) != -1) {
					inlineHtml +=
						'<option value="' +
						leadsourceid +
						'" selected>' +
						leadsourcename +
						"</option>";
				} else {
					inlineHtml +=
						'<option value="' +
						leadsourceid +
						'" >' +
						leadsourcename +
						"</option>";
				}
			}

			return true;
		});

		inlineHtml += "</select>";
		inlineHtml += "</div></div>";
		inlineHtml += "</div></div>";

		inlineHtml +=
			'<div class="form-group container source_salesrep_section hide">';
		inlineHtml += '<div class="row">';

		inlineHtml += '<div class="col-xs-6 sales_rep_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="source_text">SALES REP</span>';
		inlineHtml +=
			'<select id="sales_rep" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
		inlineHtml += "<option></option>";

		//Search: Sales Record - Last Assigned List
		var salesRecordLastAssignedListListSearch = search.load({
			id: "customsearch8649",
			type: "customrecord_sales",
		});
		var salesRecordLastAssignedListListSearchResultSet =
			salesRecordLastAssignedListListSearch.run();

		salesRecordLastAssignedListListSearchResultSet.each(function (
			salesRecordLastAssignedListListResultSet
		) {
			var employeeId = salesRecordLastAssignedListListResultSet.getValue({
				name: "custrecord_sales_assigned",
				summary: "GROUP",
			});
			var employeeText = salesRecordLastAssignedListListResultSet.getText({
				name: "custrecord_sales_assigned",
				summary: "GROUP",
			});

			if (isNullorEmpty(salesrep)) {
				inlineHtml +=
					'<option value="' + employeeId + '">' + employeeText + "</option>";
			} else {
				if (salesrep.indexOf(",") != -1) {
					var salesrepArray = salesrep.split(",");
				} else {
					var salesrepArray = [];
					salesrepArray.push(salesrep);
				}

				if (salesrepArray.indexOf(employeeId) != -1) {
					inlineHtml +=
						'<option value="' +
						employeeId +
						'" selected="selected">' +
						employeeText +
						"</option>";
				} else {
					inlineHtml +=
						'<option value="' + employeeId + '">' + employeeText + "</option>";
				}
			}

			return true;
		});

		inlineHtml += "</select>";
		inlineHtml += "</div></div>";

		inlineHtml += '<div class="col-xs-6 sales_rep_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="source_text">LEAD ENTERED BY</span>';
		inlineHtml +=
			'<select id="lead_entered_by" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
		inlineHtml += "<option></option>";

		//Search: Leads Entered By List
		var leadEnteredByListSearch = search.load({
			id: "customsearch_lead_entered_by_list",
			type: "customer",
		});
		var leadEnteredByListSearchResultSet = leadEnteredByListSearch.run();

		leadEnteredByListSearchResultSet.each(function (
			leadEnteredByListResultSet
		) {
			var employeeId = leadEnteredByListResultSet.getValue({
				name: "custentity_lead_entered_by",
				summary: "GROUP",
			});
			var employeeText = leadEnteredByListResultSet.getText({
				name: "custentity_lead_entered_by",
				summary: "GROUP",
			});

			if (isNullorEmpty(lead_entered_by)) {
				inlineHtml +=
					'<option value="' + employeeId + '">' + employeeText + "</option>";
			} else {
				if (lead_entered_by.indexOf(",") != -1) {
					var lead_entered_byArray = lead_entered_by.split(",");
				} else {
					var lead_entered_byArray = [];
					lead_entered_byArray.push(lead_entered_by);
				}

				if (lead_entered_byArray.indexOf(employeeId) != -1) {
					inlineHtml +=
						'<option value="' +
						employeeId +
						'" selected="selected">' +
						employeeText +
						"</option>";
				} else {
					inlineHtml +=
						'<option value="' + employeeId + '">' + employeeText + "</option>";
				}
			}

			// if (lead_entered_by == employeeId) {
			// 	inlineHtml +=
			// 		'<option value="' +
			// 		employeeId +
			// 		'" selected="selected">' +
			// 		employeeText +
			// 		"</option>";
			// } else {
			// 	inlineHtml +=
			// 		'<option value="' + employeeId + '">' + employeeText + "</option>";
			// }

			return true;
		});

		inlineHtml += "</select>";
		inlineHtml += "</div ></div > ";
		inlineHtml += "</div ></div > ";

		inlineHtml += '<div class="form-group container parent_lpo_label_section">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">SECURE CASH CUSTOMER - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'<div class="form-group container invoice_date_type_div hide">';
		inlineHtml += '<div class="row">';
		inlineHtml += '<div class="col-xs-12 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="zee_dropdown_text">CUSTOMER TYPE</span>';
		inlineHtml += '<select id="customer_type" class="form-control">';
		if (customer_type == "1") {
			inlineHtml += '<option value="1" selected>All Customers</option>';
			inlineHtml +=
				'<option value="2">All Customers (exc SC, Shippit, Sendle, Parent Customers)</option>';
		} else if (customer_type == "2") {
			inlineHtml += '<option value="1" >All Customers</option>';
			inlineHtml +=
				'<option value="2" selected>All Customers (exc SC, Shippit, Sendle, Parent Customers)</option>';
		} else {
			inlineHtml += '<option value="1">All Customers</option>';
			inlineHtml +=
				'<option value="2" selected>All Customers (exc SC, Shippit, Sendle, Parent Customers)</option>';
		}

		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";

		// if (campaign == 69) {
		inlineHtml += '<div class="form-group container parent_lpo_label_section">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">PARENT LPO - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container parent_lpo_section">';
		inlineHtml += '<div class="row">';

		inlineHtml += '<div class="col-xs-12 parent_lpo_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="parent_lpo_text">PARENT LPO</span>';
		inlineHtml +=
			'<select id="parent_lpo" class="js-example-basic-multiple form-control" style="width: 100%" multiple="multiple">';
		inlineHtml += "<option></option>";

		var parentLPOSearch = search.load({
			type: "customer",
			id: "customsearch_parent_lpo_customers",
		});

		parentLPOSearch.run().each(function (parentLPOSearchResultSet) {
			var parentLPOInternalId = parentLPOSearchResultSet.getValue({
				name: "internalid",
				summary: "GROUP",
			});
			var parentLPOName = parentLPOSearchResultSet.getValue({
				name: "companyname",
				summary: "GROUP",
			});

			if (isNullorEmpty(parentLPO)) {
				inlineHtml +=
					'<option value="' +
					parentLPOInternalId +
					'" >' +
					parentLPOName +
					"</option>";
			} else {
				if (parentLPO.indexOf(",") != -1) {
					var parentLPOArray = parentLPO.split(",");
				} else {
					var parentLPOArray = [];
					parentLPOArray.push(parentLPO);
				}
				// var parentLPOArray = parentLPO.split(',');
				if (parentLPOArray.indexOf(parentLPOInternalId) != -1) {
					inlineHtml +=
						'<option value="' +
						parentLPOInternalId +
						'" selected>' +
						parentLPOName +
						"</option>";
				} else {
					inlineHtml +=
						'<option value="' +
						parentLPOInternalId +
						'" >' +
						parentLPOName +
						"</option>";
				}
			}

			return true;
		});

		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";
		// }

		return inlineHtml;
	}

	/**
	 * The date input fields to filter the invoices.
	 * Even if the parameters `date_from` and `date_to` are defined, they can't be initiated in the HTML code.
	 * They are initiated with jQuery in the `pageInit()` function.
	 * @return  {String} `inlineHtml`
	 */
	function dateFilterSection(
		start_date,
		last_date,
		usage_date_from,
		usage_date_to,
		date_signed_up_from,
		date_signed_up_to,
		invoice_date_from,
		invoice_date_to,
		invoice_type,
		date_quote_sent_to,
		date_quote_sent_from,
		calcprodusage,
		modified_start_date,
		modified_last_date,
		sales_activity_notes,
		commencement_start_date,
		commencement_last_date,
		cancelled_start_date,
		cancelled_last_date
	) {
		var inlineHtml =
			'<div class="form-group container lead_entered_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE LEAD ENTERED - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container lead_entered_div hide">';
		inlineHtml += '<div class="row">';
		// Date from field
		inlineHtml += '<div class="col-xs-6 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_from_text">DATE LEAD ENTERED - FROM</span>';
		if (isNullorEmpty(start_date)) {
			inlineHtml +=
				'<input id="date_from" class="form-control date_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="date_from" class="form-control date_from" type="date" value="' +
				start_date +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Date to field
		inlineHtml += '<div class="col-xs-6 date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_to_text">DATE LEAD ENTERED - TO</span>';
		if (isNullorEmpty(last_date)) {
			inlineHtml +=
				'<input id="date_to" class="form-control date_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="date_to" class="form-control date_to" type="date" value="' +
				last_date +
				'">';
		}

		inlineHtml += "</div></div></div></div>";

		inlineHtml +=
			'<div class="form-group container quote_sent_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE QUOTE SENT - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container quote_sent_div hide">';
		inlineHtml += '<div class="row">';
		// Date from field
		inlineHtml += '<div class="col-xs-6 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_quote_sent_from_text">DATE QUOTE SENT - FROM</span>';
		if (isNullorEmpty(date_quote_sent_from)) {
			inlineHtml +=
				'<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="date_quote_sent_from" class="form-control date_quote_sent_from" type="date" value="' +
				date_quote_sent_from +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Date to field
		inlineHtml += '<div class="col-xs-6 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_quote_sent_to_text">DATE QUOTE SENT - TO</span>';
		if (isNullorEmpty(date_quote_sent_to)) {
			inlineHtml +=
				'<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="date_quote_sent_to" class="form-control date_quote_sent_to" type="date" value="' +
				date_quote_sent_to +
				'">';
		}

		inlineHtml += "</div></div></div></div>";

		inlineHtml +=
			'<div class="form-group container signed_up_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">DATE SIGNED UP - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container signed_up_div hide">';
		inlineHtml += '<div class="row">';
		// Date from field
		inlineHtml += '<div class="col-xs-6 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_signed_up_from_text">DATE SIGNED UP - FROM</span>';
		if (isNullorEmpty(date_signed_up_from)) {
			inlineHtml +=
				'<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="date_signed_up_from" class="form-control date_signed_up_from" type="date" value="' +
				date_signed_up_from +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Date to field
		inlineHtml += '<div class="col-xs-6 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_signed_up_to_text">DATE SIGNED UP - TO</span>';
		if (isNullorEmpty(date_signed_up_to)) {
			inlineHtml +=
				'<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="date_signed_up_to" class="form-control date_signed_up_to" type="date" value="' +
				date_signed_up_to +
				'">';
		}

		inlineHtml += "</div></div></div></div>";

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

		inlineHtml +=
			'<div class="form-group container signed_up_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">CANCELLATION DATE - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container signed_up_div hide">';
		inlineHtml += '<div class="row">';
		// Date from field
		inlineHtml += '<div class="col-xs-6 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_signed_up_from_text">CANCELLATION DATE - FROM</span>';
		if (isNullorEmpty(cancelled_start_date)) {
			inlineHtml +=
				'<input id="cancellation_date_from" class="form-control cancellation_date_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="cancellation_date_from" class="form-control cancellation_date_from" type="date" value="' +
				cancelled_start_date +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Date to field
		inlineHtml += '<div class="col-xs-6 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_signed_up_to_text">CANCELLATION DATE - TO</span>';
		if (isNullorEmpty(cancelled_last_date)) {
			inlineHtml +=
				'<input id="cancellation_date_to" class="form-control cancellation_date_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="cancellation_date_to" class="form-control cancellation_date_to" type="date" value="' +
				cancelled_last_date +
				'">';
		}

		inlineHtml += "</div></div></div></div>";

		inlineHtml += '<div class="form-group container usage_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">MP PRODUCT USAGE DATE - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container calcprodusage_div hide">';
		inlineHtml += '<div class="row">';

		inlineHtml += '<div class="col-xs-12 calcprodusage">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="calcprodusage_text">CALCULATE MP PRODUCT USAGE?</span>';
		inlineHtml += '<select id="calc_prod_usage" class="form-control">';
		inlineHtml += "<option></option>";

		if (calcprodusage == "1") {
			inlineHtml += '<option value="1" selected>Yes</option>';
			inlineHtml += '<option value="2">No</option>';
		} else if (calcprodusage == "2") {
			inlineHtml += '<option value="1" >Yes</option>';
			inlineHtml += '<option value="2" selected>No</option>';
		} else {
			inlineHtml += '<option value="1">Yes</option>';
			inlineHtml += '<option value="2" selected>No</option>';
		}
		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";

		inlineHtml += '<div class="form-group container usage_date_div hide">';
		inlineHtml += '<div class="row">';
		// Date from field
		inlineHtml += '<div class="col-xs-6 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="usage_date_from_text">USAGE DATE - FROM</span>';
		if (isNullorEmpty(usage_date_from)) {
			inlineHtml +=
				'<input id="usage_date_from" class="form-control usage_date_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="usage_date_from" class="form-control usage_date_from" type="date" value="' +
				usage_date_from +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Date to field
		inlineHtml += '<div class="col-xs-6 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="usage_date_to_text">USAGE DATE - TO</span>';
		if (isNullorEmpty(usage_date_to)) {
			inlineHtml +=
				'<input id="usage_date_to" class="form-control usage_date_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="usage_date_to" class="form-control usage_date_to" type="date" value="' +
				usage_date_to +
				'">';
		}

		inlineHtml += "</div></div></div></div>";

		inlineHtml +=
			'<div class="form-group container invoice_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">INVOICE FILTERS</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'<div class="form-group container invoice_date_type_div hide">';
		inlineHtml += '<div class="row">';
		// Date from field
		inlineHtml += '<div class="col-xs-4 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="invoice_date_from_text">INVOICE DATE - FROM</span>';
		if (isNullorEmpty(invoice_date_from)) {
			inlineHtml +=
				'<input id="invoice_date_from" class="form-control invoice_date_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="invoice_date_from" class="form-control invoice_date_from" type="date" value="' +
				invoice_date_from +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Date to field
		inlineHtml += '<div class="col-xs-4 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="invoice_date_to_text">INVOICE DATE - TO</span>';
		if (isNullorEmpty(invoice_date_to)) {
			inlineHtml +=
				'<input id="invoice_date_to" class="form-control invoice_date_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="invoice_date_to" class="form-control invoice_date_to" type="date" value="' +
				invoice_date_to +
				'">';
		}

		inlineHtml += "</div></div>";

		inlineHtml += '<div class="col-xs-4 usage_date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="zee_dropdown_text">INVOICE TYPE</span>';
		inlineHtml += '<select id="invoice_type" class="form-control">';
		if (invoice_type == "1") {
			inlineHtml += '<option value=""></option>';
			inlineHtml += '<option value="1" selected>Service</option>';
			inlineHtml += '<option value="2">MP Products</option>';
		} else if (invoice_type == "2") {
			inlineHtml += '<option value=""></option>';
			inlineHtml += '<option value="1">Service</option>';
			inlineHtml += '<option value="2" selected>MP Products</option>';
		} else {
			inlineHtml += '<option value=""></option>';
			inlineHtml += '<option value="1">Service</option>';
			inlineHtml += '<option value="2">MP Products</option>';
		}

		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";

		// inlineHtml +=
		// 	'<div class="form-group container filter_buttons_section hide">';
		// inlineHtml += '<div class="row">';
		// inlineHtml += '<div class="col-xs-2"></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-4"><input type="button" value="APPLY FILTER" class="form-control btn btn-primary" id="applyFilter" style="background-color: #095C7B; border-radius: 30px" /></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-4"><input type="button" value="CLEAR FILTER" class="form-control btn btn-primary" id="clearFilter" style="background-color: #F0AECB; color: #103d39;border-radius: 30px" /></div>';
		// inlineHtml += '<div class="col-xs-2"></div>';

		// inlineHtml += "</div>";
		// inlineHtml += "</div>";

		return inlineHtml;
	}

	function tabsSection(campaign) {
		// var inlineHtml = '<div class="tabs_section hide">';

		// Tabs headers
		// inlineHtml +=
		// 	"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		// inlineHtml +=
		// 	".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		// inlineHtml += "</style>";

		// inlineHtml +=
		// 	'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		// inlineHtml +=
		// 	'<li role="presentation" class="active"><a data-toggle="tab" href="#overview" style="border-radius: 30px"><b>OVERVIEW</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#callforcetasks" style="border-radius: 30px"><b>CALL FORCE</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#customer" style="border-radius: 30px"><b>CUSTOMERS</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#prospects" style="border-radius: 30px"><b>PROSPECTS</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects" style="border-radius: 30px"><b>SUSPECTS</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#cancellation" style="border-radius: 30px"><b>CANCELLATIONS</b></a></li>';

		// inlineHtml += "</ul></div>";

		// Tabs content
		// inlineHtml += '<div class="tab-content">';

		log.debug({
			title: "Inside Tabs Section Function",
			details: campaign,
		});

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="callforcetasks">';
		// inlineHtml += '<h2 style="text-align:center;">Call Force Report</h2>';
		// inlineHtml +=
		// 	'<div class="container instruction_div hide" style="background-color: #F6F8F9FF;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><ol><li><b><u>UNQUALIFIED LEADS - SENT TO CALL FORCE</u></b>:</br>Leads that have been sent to Call Force for cold calling.<li><b><u>QUALIFIED LEADS - NO APPOINTMENT</u></b>:</br>Leads that have been qualified by Call Force but no Appointment has been scheduled.</br></li><li><b><u>QUALIFIED LEADS - SCHEDULED APPOINTMENT</u></b>:</br>Leads that have been qualified by Call Force and an Appointment has been scheduled</br></li><li><b class=""><u>QUALIFIED LEADS - COMPLETED APPOINTMENT</u></b>:</br>Leads that have been qualified by Call Force and an Appointment has been scheduled which has now been completed by the Sales Rep.</br></li></ol></div>';
		// inlineHtml += "</br></br>";
		// inlineHtml +=
		// 	'<div id="container-callforce_progress" style="height: 25vh;"></div>';

		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane active" id="overview">';

		// Overview Tabs headers
		// inlineHtml +=
		// 	"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		// inlineHtml +=
		// 	".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		// inlineHtml += "</style>";

		// inlineHtml +=
		// 	'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		// inlineHtml +=
		// 	'<li role="presentation" class="active"><a data-toggle="tab" href="#complete_overview" style="border-radius: 30px"><b>COMPLETE OVERVIEW</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#datacapture_overview" style="border-radius: 30px"><b>DATA CAPTURE OVERVIEW</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#lpo_overview" style="border-radius: 30px"><b>LPO & LPO-BAU OVERVIEW</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#salesrep_overview" style="border-radius: 30px"><b>SALES REP OVERVIEW</b></a></li>';
		// if (role != 1000) {
		// 	inlineHtml +=
		// 		'<li role="presentation" class=""><a data-toggle="tab" href="#zee_overview" style="border-radius: 30px"><b>FRANCHISEE OVERVIEW</b></a></li>';
		// }

		// inlineHtml += "</ul></div>";

		// inlineHtml += '<div class="tab-content">';
		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane active" id="complete_overview">';

		var inlineHtml = '<figure class="highcharts-figure">';
		inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12" style="background-color: #d0e0cf;"><div id="container_preview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row" style="background-color: #d0e0cf;">';
		// inlineHtml += '<h2 style="text-align:center;">Call Force Report</h2>';
		// inlineHtml +=
		// 	'<div id="container-callforce_progress" style="height: 50vh;"></div>';
		// // inlineHtml +=
		// // 	'<div class="col-xs-6"><div id="container_source_preview"></div></div>';
		// // inlineHtml +=
		// // 	'<div class="col-xs-6"><div id="container_campaign_preview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";

		inlineHtml += "</figure><br></br>";
		// inlineHtml += dataTable("preview");
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane " id="zee_overview">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id=""></div>';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_zee_overview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_zee_overview_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("zee_overview");
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane " id="lpo_overview">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_lpo_overview"></div>';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_lpo_overview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_lpo_source_datacapture_preview"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_lpo_campaign_datacapture_preview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("lpo_overview");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane " id="salesrep_overview">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_salesrep_overview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_entered_sales_rep_preview"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_campaign_sales_rep_preview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("salesrep_overview");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane " id="datacapture_overview">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_datacapture_overview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_source_datacapture_preview"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_campaign_datacapture_preview"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("datacapture_overview");
		// inlineHtml += "</div>";

		// inlineHtml += "</div>";
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="customer">';

		// // Customers Tabs headers
		// inlineHtml +=
		// 	"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		// inlineHtml +=
		// 	".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		// inlineHtml += "</style>";

		// inlineHtml +=
		// 	'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		// inlineHtml +=
		// 	'<li role="presentation" class="active"><a data-toggle="tab" href="#new_customers" style="border-radius: 30px"><b>NEW CUSTOMERS</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#trial_customers" style="border-radius: 30px"><b>FREE TRIALS</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#trial_pending_customers" style="border-radius: 30px"><b>FREE TRIALS PENDING</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#existing_customers" style="border-radius: 30px"><b>EXISTING CUSTOMERS</b></a></li>';

		// inlineHtml += "</ul></div>";

		// inlineHtml += '<div class="tab-content">';
		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane active" id="new_customers">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_customer"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_signed_source"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_signed_campaign"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("customer");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane " id="trial_customers">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id=""></div>';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_trial_customers"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_trial_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_trial_source"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_trial_campaign"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("trial_customers");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane " id="trial_pending_customers">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id=""></div>';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_trial_pending_customers"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_trial_pending_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_trial_pending_source"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_trial_pending_campaign"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("trial_pending_customers");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane " id="existing_customers">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_existing_customers"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("existing_customers");
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects">';

		// // Prospects Tabs headers
		// inlineHtml +=
		// 	"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		// inlineHtml +=
		// 	".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		// inlineHtml += "</style>";

		// inlineHtml +=
		// 	'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';
		// inlineHtml +=
		// 	'<li role="presentation" class="active"><a data-toggle="tab" href="#prospects_opportunites" style="border-radius: 30px"><b>PROSPECTS - QUOTE SENT</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#prospects_box" style="border-radius: 30px"><b>PROSPECTS - BOX SENT</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#prospects_quoteSent_incontact_noanswer" style="border-radius: 30px"><b>PROSPECTS - IN CONTACT/OPPORTUNITY</b></a></li>';

		// inlineHtml += "</ul></div>";

		// inlineHtml += '<div class="tab-content">';
		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="prospects_quoteSent_incontact_noanswer">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_quoteSent_incontact_noanswer"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_prospect_opportunity_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_prospect_opportunity_source"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_prospect_opportunity_campaign"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("prospects_quoteSent_incontact_noanswer");
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects_box">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_prospects_box"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_prospect_box_sent_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_prospect_box_sent_source"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_prospect_box_sent_campaign"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("prospects_box_sent");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane active" id="prospects_opportunites">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div class="" style="background-color: #d0e0cf;">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_prospects_opportunites"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12"><div id="container_prospect_quote_sent_last_assigned"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += '<div class="">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_prospect_quote_sent_source"></div></div>';
		// inlineHtml +=
		// 	'<div class="col-xs-6"><div id="container_prospect_quote_sent_campaign"></div></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("prospects_opportunites");
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects">';

		// // Suspects Tabs headers
		// inlineHtml +=
		// 	"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		// inlineHtml +=
		// 	".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		// inlineHtml += "</style>";

		// inlineHtml +=
		// 	'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		// inlineHtml +=
		// 	'<li role="presentation" class="active"><a data-toggle="tab" href="#suspects_leads" style="border-radius: 30px"><b>SUSPECTS - HOT/NEW LEAD/REASSIGN</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_validated" style="border-radius: 30px"><b>SUSPECTS - VALIDATED</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_unqualified" style="border-radius: 30px"><b>SUSPECTS - UNQUALIFIED</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_qualified" style="border-radius: 30px"><b>SUSPECTS - QUALIFIED</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_no_answer" style="border-radius: 30px"><b>SUSPECTS - NO ANSWER</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_in_contact" style="border-radius: 30px"><b>SUSPECTS - IN CONTACT</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_followup" style="border-radius: 30px"><b>SUSPECTS - FOLLOW UP</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_off_peak_pipeline" style="border-radius: 30px"><b>SUSPECTS - PARKING LOT</b></a></li>';
		// inlineHtml +=
		// 	'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_lost" style="border-radius: 30px"><b>SUSPECTS - LOST</b></a></li>';
		// if (role != 1000) {
		// 	inlineHtml +=
		// 		'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_oot" style="border-radius: 30px"><b>SUSPECTS - OUT OF TERRITORY</b></a></li>';
		// }

		// inlineHtml += "</ul></div>";

		// inlineHtml += '<div class="tab-content">';

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane active" id="suspects_leads">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_no_answer">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_no_answer"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_no_answer");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_in_contact">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_in_contact"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_in_contact");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_qualified">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_qualified"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_qualified");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_unqualified">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_unqualified"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_unqualified");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_validated">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_validated"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_validated");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_followup">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_followup"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_followup");
		// inlineHtml += "</div>";

		// inlineHtml +=
		// 	'<div role="tabpanel" class="tab-pane" id="suspects_off_peak_pipeline">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_off_peak_pipeline"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_off_peak_pipeline");
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_lost">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_lost"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_lost");
		// inlineHtml += "</div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_oot">';
		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_suspects_oot"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("suspects_oot");
		// inlineHtml += "</div>";
		// inlineHtml += "</div></div>";

		// inlineHtml += '<div role="tabpanel" class="tab-pane" id="cancellation">';

		// inlineHtml += '<figure class="highcharts-figure">';
		// inlineHtml += '<div id="container_cancellation"></div>';
		// inlineHtml += "</figure><br></br>";
		// // inlineHtml += dataTable("cancellation");
		// inlineHtml += "</div>";

		return inlineHtml;
	}

	/**
	 * The table that will display the differents invoices linked to the
	 * franchisee and the time period.
	 *
	 * @return {String} inlineHtml
	 */
	function dataTable(name) {
		var inlineHtml =
			"<style>table#mpexusage-" +
			name +
			" {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#mpexusage-" +
			name +
			" th{text-align: center;} .bolded{font-weight: bold;}</style>";
		inlineHtml +=
			'<div class="table_section hide"><table id="mpexusage-' +
			name +
			'" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
		inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
		inlineHtml += '<tr class="text-center">';

		inlineHtml += "</tr>";
		inlineHtml += "</thead>";

		inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

		if (name == "preview") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}

		if (name == "customer" || name == "existing_customers") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="7"></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th style="text-align:right"></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (name == "suspects" || name == "suspects_followup") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="16" style="text-align:right">Total Monthly Service Revenue:</th><th></th><th></th></tr></tfoot>';
		}
		if (name == "suspects_lost") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="16" style="text-align:right">Total:</th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (
			name == "prospects_quoteSent_incontact_noanswer" ||
			name == "prospects_opportunites"
		) {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="13" style="text-align:right">Total Monthly Service Revenue:</th><th></th><th></th></tr></tfoot>';
		}
		if (name == "cancellation") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="8" style="text-align:right">Total:</th><th></th><th></th><th></th></tr></tfoot>';
		}

		inlineHtml += "</table></div>";
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

	function GetFormattedDate(todayDate) {
		var month = pad(todayDate.getMonth() + 1);
		var day = pad(todayDate.getDate());
		var year = todayDate.getFullYear();
		return year + "-" + month + "-" + day;
	}

	function pad(s) {
		return s < 10 ? "0" + s : s;
	}

	function isNullorEmpty(val) {
		if (val == "" || val == null) {
			return true;
		} else {
			return false;
		}
	}
	return {
		render: render,
	};
});
