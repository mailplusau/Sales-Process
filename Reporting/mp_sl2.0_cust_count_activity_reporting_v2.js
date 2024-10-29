/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Fri Oct 25 2024
 * Modified on:          Fri Oct 25 2024 11:23:29
 * SuiteScript Version:   
 * Description:           
 *
 * Copyright (c) 2024 MailPlus Pty. Ltd.
 */

define([
	"SuiteScripts/jQuery Plugins/Moment JS/moment.min",
	"N/ui/serverWidget",
	"N/email",
	"N/runtime",
	"N/search",
	"N/record",
	"N/https",
	"N/log",
	"N/redirect",
	"N/url",
], function (
	moment,
	ui,
	email,
	runtime,
	search,
	record,
	https,
	log,
	redirect,
	url
) {
	var role = 0;
	var userId = 0;
	var zee = 0;

	var employee_list = [];
	var employee_list_color = [];

	var campaign_list = [];
	var campaign_list_color = [];

	var source_list = [];
	var source_list_color = [];

	var startDate = null;
	var endDate = null;

	var totalInboundJSON = [];
	var totalFranchiseeJSON = [];
	var totalBAUJSON = [];
	var totalBAUStatusChangeJSON = [];
	var totalSignUpJSON = [];
	var totalCommencedJSON = [];
	var totalCancelledJSON = [];

	var tableColumnsNames = [];

	var totalInboundTableHTML = "";
	var totalFranchiseeTableHTML = "";
	var totalBAUTableHTML = "";
	var totalBAUStatusChangeTableHTML = "";
	var totalSignUpTableHTML = "";
	var totalCommencedTableHTML = "";
	var totalCancelledTableHTML = "";

	function onRequest(context) {
		var baseURL = "https://system.na2.netsuite.com";
		if (runtime.EnvType == "SANDBOX") {
			baseURL = "https://system.sandbox.netsuite.com";
		}
		userId = runtime.getCurrentUser().id;
		pageUserId = runtime.getCurrentUser().id;
		var scriptObj = runtime.getCurrentScript();

		role = runtime.getCurrentUser().role;
		// moment().tz.setDefault('Australia/Sydney'); // Set default timezone to AEST

		if (context.request.method === "GET") {
			var start_date = context.request.parameters.start_date;
			var last_date = context.request.parameters.last_date;
			var source = context.request.parameters.source;
			var campaign = context.request.parameters.campaign;
			var parentLPO = context.request.parameters.lpo;
			var salesrep = context.request.parameters.sales_rep;
			var lead_entered_by = context.request.parameters.lead_entered_by;

			zee = context.request.parameters.zee;
			userId = context.request.parameters.user_id;

			if (isNullorEmpty(start_date) && isNullorEmpty(last_date)) {
				var monthToDateYYYYMMDD = getMonthToDate();

				start_date = convertToNetSuiteDate(monthToDateYYYYMMDD.startDate); //Converts a date from "YYYY-DD-MM" format to NetSuite date format "M/D/YYYY".
				last_date = convertToNetSuiteDate(monthToDateYYYYMMDD.endDate); //Converts
			}

			log.audit({
				title: "start_date: ",
				details: start_date,
			});
			log.audit({
				title: "last_date: ",
				details: last_date,
			});

			log.audit({
				title: "Remaining usage units: ",
				details: scriptObj.getRemainingUsage(),
			});

			var form = ui.createForm({
				title: "Sales Reporting - Status Change Activity",
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
				"<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;} td.details-control{background:url('https://www.datatables.net/examples/resources/details_open.png') center center no-repeat;cursor:pointer} tr.shown td.details-control{background:url('https://www.datatables.net/examples/resources/details_close.png') center center no-repeat}</style>";

			//Loading Section that gets displayed when the page is being loaded
			inlineHtml += loadingSection();

			inlineHtml +=
				'<div class="form-group container show_buttons_section hide">';
			inlineHtml += '<div class="row">';
			inlineHtml += '<div class="col-xs-5"></div>';

			inlineHtml +=
				'<div class="col-xs-2"><input type="button" value="SHOW FILTERS" class="form-control btn btn-primary" data-toggle="collapse" data-target="#collapseExample" id="show_filter" aria-expanded="false" aria-controls="collapseExample" style="background-color: #EAF044; color: #103d39; border-radius: 30px" /></div>';
			inlineHtml += '<div class="col-xs-5"></div>';

			inlineHtml += "</div>";
			inlineHtml += "</div>";
			inlineHtml +=
				'<div class="collapse" id="collapseExample"><div class="card card-body">';
			inlineHtml += "<div>";
			//Dropdown to Select the Fracnhisee
			//Search: SMC - Franchisees
			var searchZees = search.load({
				id: "customsearch_smc_franchisee",
			});
			var resultSetZees = searchZees.run();

			inlineHtml += franchiseeDropdownSection(resultSetZees, context);
			inlineHtml += leadSourceFilterSection(
				source,
				salesrep,
				campaign,
				parentLPO,
				lead_entered_by
			);
			if (isNullorEmpty(start_date) && isNullorEmpty(last_date)) {
				inlineHtml += dateFilterSection(
					monthToDateYYYYMMDD.startDate,
					monthToDateYYYYMMDD.endDate
				);
			} else {
				inlineHtml += dateFilterSection(start_date, last_date);
			}
			
			inlineHtml += "</div></div></div></br></br>";

			var tableWebsiteLeads = "";

			tableWebsiteLeads +=
				"<h2 class='header_one hide' style='text-align:center;'>Status Change Activity from " +
				start_date +
				" to " +
				last_date +
				"</br></h2><style>table#websiteLeads {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#websiteLeads th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
			tableWebsiteLeads +=
				'<div class="table_section_1 hide"><table id="websiteLeads" class="table table-responsive display customer tablesorter row-border cell-border compact" style="width: 100%;border: 2px solid #103d39;background-color: #ffffff">';
			tableWebsiteLeads +=
				'<thead style="color: white;background-color: #095C7B;">';
			tableWebsiteLeads += '<tr class="text-center">';
			tableWebsiteLeads +=
				'<td class="bolded">Status Change Activity for all BAU Campaigns</br><small>(Excluding Inbound - New Website & Franchisee Generated Leads)</small> </td>';
			tableWebsiteLeads += '<td class="bolded"></td>';
			tableWebsiteLeads += "</tr>";
			tableWebsiteLeads += "</thead>";

			tableWebsiteLeads += '<tbody id="" >';

			tableWebsiteLeads +=
				'</tbody><tfoot><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTALS</th><th></th><th></th><th></th><th></th><th></th>v<th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot></table>';

			inlineHtml += tableWebsiteLeads;

			var tableWebsiteLeads = "";

			tableWebsiteLeads +=
				"<h2 class='header_one hide' style='text-align:center;'>Status Change Activity - By Sales Rep - from " +
				start_date +
				" to " +
				last_date +
				"</br></h2><style>table#salesRepLeads {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#salesRepLeads th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
			tableWebsiteLeads +=
				'<div class="table_section_1 hide"><table id="salesRepLeads" class="table table-responsive display customer tablesorter row-border cell-border compact" style="width: 100%;border: 2px solid #103d39;background-color: #ffffff">';
			tableWebsiteLeads +=
				'<thead style="color: white;background-color: #095C7B;">';
			tableWebsiteLeads += '<tr class="text-center">';

			tableWebsiteLeads += "</tr>";
			tableWebsiteLeads += "</thead>";
			tableWebsiteLeads += '<tbody id="" >';

			tableWebsiteLeads +=
				'</tbody><tfoot><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan=2>TOTALS</th><th></th><th></th><th></th><th></th>v<th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot></table>';

			inlineHtml += tableWebsiteLeads;

			form
				.addField({
					id: "preview_table",
					label: "inlinehtml",
					type: "inlinehtml",
				})
				.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW,
				}).defaultValue = inlineHtml;

			form.clientScriptFileId = 7261596;

			context.response.writePage(form);
		} else {
		}
	}

	/**
	 * The Franchisee dropdown field.
	 * @param   {zeeSearchResult}    resultSetZees
	 * @return  {String}    `inlineHtml`
	 */
	function franchiseeDropdownSection(resultSetZees, context) {
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
			'<select id="zee_dropdown" class="js-example-basic-multiple js-states form-control" style="width: 100%" multiple="multiple">';
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

	function leadSourceFilterSection(
		source,
		salesrep,
		campaign,
		parentLPO,
		lead_entered_by
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

			// if (salesCampaignInternalId == campaign) {
			//     inlineHtml += '<option value="' + salesCampaignInternalId + '" selected>' +
			//         salesCampaignName + '</option>';
			// } else {
			//     inlineHtml += '<option value="' + salesCampaignInternalId + '" >' +
			//         salesCampaignName + '</option>';
			// }

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
			'<select id="lead_entered_by" class="form-control" style="width: 100%" >';
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

			if (lead_entered_by == employeeId) {
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

			return true;
		});

		inlineHtml += "</select>";
		inlineHtml += "</div ></div > ";
		inlineHtml += "</div ></div > ";

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
	function dateFilterSection(start_date, last_date) {
		var inlineHtml =
			'<div class="form-group container lead_entered_label_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS CHANGE ACTIVITY - FILTER</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div class="form-group container modified_date_div hide">';
		inlineHtml += '<div class="row">';

		// Last Modified Date from field
		inlineHtml += '<div class="col-xs-6 date_from">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="modified_date_from_text">STATUS CHANGE ACTIVITY</span>';
		if (isNullorEmpty(start_date)) {
			inlineHtml +=
				'<input id="modified_date_from" class="form-control modified_date_from" type="date" />';
		} else {
			inlineHtml +=
				'<input id="modified_date_from" class="form-control modified_date_from" type="date" value="' +
				start_date +
				'"/>';
		}

		inlineHtml += "</div></div>";
		// Last Modified Date to field
		inlineHtml += '<div class="col-xs-6 date_to">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="date_to_text">STATUS CHANGE ACTIVITY - TO</span>';
		if (isNullorEmpty(last_date)) {
			inlineHtml +=
				'<input id="modified_date_to" class="form-control modified_date_to" type="date">';
		} else {
			inlineHtml +=
				'<input id="modified_date_to" class="form-control modified_date_to" type="date" value="' +
				last_date +
				'">';
		}

		inlineHtml += "</div></div></div></div>";

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

	/**
	 * @description Gets the date of last week's Friday.
	 * @returns {String} The date of last week's Friday in "YYYY-MM-DD" format.
	 */
	function getLastWeeksFriday() {
		var today = new Date();

		today.setHours(today.getHours() + 12);
		var dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

		var daysSinceFriday = (dayOfWeek + 2) % 7; // Days since last Friday

		// Calculate last week's Friday date
		var lastWeekFriday = new Date(today);
		lastWeekFriday.setDate(today.getDate() - daysSinceFriday);

		return formatDate(lastWeekFriday);
	}

	/**
	 * @description Gets the financial year to date in "YYYY-MM-DD" format.
	 * @returns {Object} An object containing the start date of the financial year and today's date in "YYYY-MM-DD" format.
	 */
	function getFinancialYearToDate() {
		var today = new Date();
		var year = today.getFullYear(); // Months are zero-based
		var month = today.getMonth() + 1;

		var startYear;
		if (month >= 7) {
			// If the current month is July or later, the financial year started this year
			startYear = year;
		} else {
			// If the current month is before July, the financial year started last year
			startYear = year - 1;
		}

		var month = customPadStart((today.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
		var day = customPadStart(today.getDate().toString(), 2, "0");

		var startDate = startYear + "-07-01"; // Start date of the financial year
		var endDate = year + "-" + month + "-" + day; // Today's date

		return {
			startDate: startDate,
			endDate: endDate,
		};
	}

	/**
	 * @description Gets the month-to-date value in "YYYY-MM-DD" format.
	 * @returns {Object} An object containing the start date of the current month and today's date in "YYYY-MM-DD" format.
	 */
	function getMonthToDate() {
		var today = new Date();
		var year = today.getFullYear();
		var month = customPadStart((today.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
		var day = customPadStart(today.getDate().toString(), 2, "0");

		var startDate = year + "-" + month + "-" + "01"; // Start date of the current month
		var endDate = year + "-" + month + "-" + day; // Today's date

		return {
			startDate: startDate,
			endDate: endDate,
		};
	}

	/**
	 * @description Gets the start date (Monday) and end date (Sunday) of the previous week.
	 * @returns {Object} An object containing the start and end dates of the previous week in "YYYY-MM-DD" format.
	 */
	function getLastWeekStartAndEndDates() {
		var today = new Date();
		today.setHours(today.getHours() + 17);
		var dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
		var daysSinceLastMonday = ((dayOfWeek + 6) % 7) + 1; // Days since last Monday

		// Calculate last Monday's date
		var lastMonday = new Date(today);
		lastMonday.setDate(today.getDate() - daysSinceLastMonday - 6);

		// Calculate last Sunday's date
		var lastSunday = new Date(lastMonday);
		lastSunday.setDate(lastMonday.getDate() + 6);

		return {
			startDate: formatDate(lastMonday),
			endDate: formatDate(lastSunday),
		};
	}

	function formatDate(date) {
		var year = date.getFullYear();
		var month = customPadStart((date.getMonth() + 1).toString(), 2, "0"); // Months are zero-based
		var day = customPadStart(date.getDate().toString(), 2, "0");
		return year + "-" + month + "-" + day;
	}

	/**
	 * @description Gets yesterday's date in "YYYY-MM-DD" format.
	 * @returns {String} Yesterday's date in "YYYY-MM-DD" format.
	 */
	function getYesterdaysDate() {
		var today = new Date();
		today.setHours(today.getHours() + 17);
		today.setDate(today.getDate() - 1);

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

	/*
	 * PURPOSE : ADDS HORIZONTAL LINE TO DIVIDE SECTIONS
	 *  PARAMS :
	 * RETURNS : INLINEHTML
	 *   NOTES :
	 */
	function line() {
		var inlineHtml =
			'<hr style="height:5px; width:100%; border-width:0; color:red; background-color:#fff" class="seperation_line">';

		return inlineHtml;
	}

	return {
		onRequest: onRequest,
	};
});
