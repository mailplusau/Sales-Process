/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet

 * Author:               Ankith Ravindran
 * Created on:           Tue Apr 18 2023
 * Modified on:          2024-07-10T05:12:43.406Z
 * SuiteScript Version:  2.0 
 * Description:          Reporting page that shows reporting based on the leads that come into the system and the customers that have been signed up based on the leads.  
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
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

	function onRequest(context) {
		var baseURL = "https://system.na2.netsuite.com";
		if (runtime.EnvType == "SANDBOX") {
			baseURL = "https://system.sandbox.netsuite.com";
		}
		userId = runtime.getCurrentUser().id;
		pageUserId = runtime.getCurrentUser().id;

		role = runtime.getCurrentUser().role;
		// moment().tz.setDefault('Australia/Sydney'); // Set default timezone to AEST

		if (context.request.method === "GET") {
			var start_date = context.request.parameters.start_date;
			var last_date = context.request.parameters.last_date;

			var modified_start_date = context.request.parameters.modified_date_from;
			var modified_last_date = context.request.parameters.modified_date_to;

			var commencement_start_date =
				context.request.parameters.commence_date_from;
			var commencement_last_date = context.request.parameters.commence_date_to;

			var cancelled_start_date = context.request.parameters.cancel_date_from;
			var cancelled_last_date = context.request.parameters.cancel_date_to;

			var usage_date_from = context.request.parameters.usage_date_from;
			var usage_date_to = context.request.parameters.usage_date_to;

			var date_signed_up_from = context.request.parameters.date_signed_up_from;
			var date_signed_up_to = context.request.parameters.date_signed_up_to;

			var date_quote_sent_to = context.request.parameters.date_quote_sent_to;
			var date_quote_sent_from =
				context.request.parameters.date_quote_sent_from;

			var invoice_date_from = context.request.parameters.invoice_date_from;
			var invoice_date_to = context.request.parameters.invoice_date_to;
			var invoice_type = context.request.parameters.invoice_type;

			var source = context.request.parameters.source;
			var campaign = context.request.parameters.campaign;
			var parentLPO = context.request.parameters.lpo;
			var salesrep = context.request.parameters.sales_rep;
			var lead_entered_by = context.request.parameters.lead_entered_by;

			zee = context.request.parameters.zee;
			userId = context.request.parameters.user_id;
			var showTotal = context.request.parameters.showTotal;
			var calcprodusage = context.request.parameters.calcprodusage;
			var sales_activity_notes = context.request.parameters.salesactivitynotes;
			var leadStatus = context.request.parameters.status;

			//If role is Franchisee
			if (role == 1000) {
				zee = runtime.getCurrentUser().id;
				calcprodusage = 2;
				sales_activity_notes = 2;
			}

			var date = new Date();
			y = date.getFullYear();
			m = date.getMonth();
			var day = date.getDay();

			// Adjust to the previous Monday
			var offset = day === 0 ? 6 : day - 1;
			date.setDate(date.getDate() - offset);

			// Start of week
			var startOfWeek = new Date(date);

			// End of week (Sunday)
			var endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(endOfWeek.getDate() + 6);

			var firstDay = new Date(y, m, 1);
			var lastDay = new Date(y, m + 1, 0);

			firstDay.setHours(0, 0, 0, 0);
			lastDay.setHours(0, 0, 0, 0);

			firstDay = GetFormattedDate(firstDay);
			lastDay = GetFormattedDate(lastDay);

			startOfWeek = GetFormattedDate(startOfWeek);
			endOfWeek = GetFormattedDate(endOfWeek);

			if (isNullorEmpty(usage_date_from)) {
				usage_date_from = firstDay;
			}

			if (isNullorEmpty(usage_date_to)) {
				usage_date_to = lastDay;
			}

			log.debug({
				title: "firstDay",
				details: firstDay,
			});

			log.debug({
				title: "lastDay",
				details: lastDay,
			});

			log.debug({
				title: "startOfWeek",
				details: startOfWeek,
			});

			log.debug({
				title: "endOfWeek",
				details: endOfWeek,
			});
			log.debug({
				title: "campaign",
				details: campaign,
			});

			if (role != 1000) {
				if (
					isNullorEmpty(start_date) &&
					isNullorEmpty(date_signed_up_from) &&
					isNullorEmpty(date_quote_sent_from) &&
					isNullorEmpty(modified_start_date) &&
					isNullorEmpty(cancelled_start_date) &&
					isNullorEmpty(commencement_start_date)
				) {
					if (showTotal == "T") {
						start_date = null;
						date_signed_up_from = null;
					} else if (!isNullorEmpty(campaign)) {
						log.debug({
							title: "inside campaign",
							details: campaign,
						});

						if (!isNullorEmpty(campaign)) {
							if (campaign.indexOf(",") != -1) {
								var campaignArray = campaign.split(",");
							} else {
								var campaignArray = [];
								campaignArray.push(campaign);
							}
						}

						if (!isNullorEmpty(salesrep)) {
							if (salesrep.indexOf(",") != -1) {
								var salesRepArray = campaign.split(",");
							} else {
								var salesRepArray = [];
								salesRepArray.push(salesrep);
							}
						}

						if (
							campaignArray.indexOf("71") != -1 ||
							campaignArray.indexOf("72") != -1 ||
							campaignArray.indexOf("69") != -1 ||
							campaignArray.indexOf("77") != -1 ||
							campaignArray.indexOf("76") != -1 ||
							!isNullorEmpty(salesRepArray)
						) {
							start_date = null;
							date_signed_up_from = null;
						} else {
							start_date = firstDay;
						}
					} else {
						start_date = firstDay;
						// date_signed_up_from = firstDay;
					}
				}

				if (
					isNullorEmpty(last_date) &&
					isNullorEmpty(date_signed_up_to) &&
					isNullorEmpty(date_quote_sent_to) &&
					isNullorEmpty(modified_last_date) &&
					isNullorEmpty(cancelled_last_date) &&
					isNullorEmpty(commencement_last_date)
				) {
					if (showTotal == "T") {
						last_date = null;
						date_signed_up_to = null;
					} else if (!isNullorEmpty(campaign)) {
						if (!isNullorEmpty(campaign)) {
							if (campaign.indexOf(",") != -1) {
								var campaignArray = campaign.split(",");
							} else {
								var campaignArray = [];
								campaignArray.push(campaign);
							}
						}

						if (!isNullorEmpty(salesrep)) {
							if (salesrep.indexOf(",") != -1) {
								var salesRepArray = campaign.split(",");
							} else {
								var salesRepArray = [];
								salesRepArray.push(salesrep);
							}
						}

						if (
							campaignArray.indexOf("71") != -1 ||
							campaignArray.indexOf("72") != -1 ||
							campaignArray.indexOf("69") != -1 ||
							(campaignArray.indexOf("77") != -1) |
								(campaignArray.indexOf("76") != -1) ||
							!isNullorEmpty(salesRepArray)
						) {
							last_date = null;
							date_signed_up_to = null;
						} else {
							last_date = lastDay;
						}
					} else {
						last_date = lastDay;
						// date_signed_up_to = lastDay;
					}
				}
			} else {
				if (modified_start_date == null && modified_last_date == null) {
					var date = new Date();
					var y = date.getFullYear();
					var m = date.getMonth();
					var day = date.getDay();

					// Adjust to the previous Monday
					var offset = day === 0 ? 6 : day - 1;
					date.setDate(date.getDate() - offset);

					// Start of week
					var startOfWeek = new Date(date);

					// End of week (Sunday)
					var endOfWeek = new Date(startOfWeek);
					endOfWeek.setDate(endOfWeek.getDate() + 6);
					endOfWeek = GetFormattedDate(endOfWeek);
					startOfWeek = GetFormattedDate(startOfWeek);

					var lastDay = new Date(y, m + 1, 0);
					lastDay.setHours(0, 0, 0, 0);

					// modified_start_date = startOfWeek
					// modified_last_date = endOfWeek

					//If begining of the year, show the current financial year, else show the current
					if (m < 5) {
						//Calculate the Current inancial Year

						var firstDay = new Date(y, m, 1);

						firstDay.setHours(0, 0, 0, 0);

						if (m >= 6) {
							var first_july = new Date(y, 6, 1);
						} else {
							var first_july = new Date(y - 1, 6, 1);
						}
						date_from = first_july;
						date_to = lastDay;

						start_date = GetFormattedDate(date_from);
						last_date = GetFormattedDate(date_to);
					} else {
						//Calculate the Current Calendar Year
						var today_day_in_month = date.getDate();
						var today_date = new Date(Date.UTC(y, m, today_day_in_month));
						var first_day_in_year = new Date(Date.UTC(y, 0));
						var date_from = first_day_in_year.toISOString().split("T")[0];
						var date_to = today_date.toISOString().split("T")[0];

						start_date = date_from;
						last_date = GetFormattedDate(lastDay);
					}
				}
			}

			if (isNullorEmpty(userId)) {
				userId = null;
			}

			var form = ui.createForm({
				title: "Sales Dashboard",
			});

			//Assign Color Codes to employees
			//Search Name: Active Employees - Sales Team
			var salesTeamSearch = search.load({
				type: "employee",
				id: "customsearch_active_employees_3",
			});

			var letters = "0123456789ABCDEF";
			var color = "#";

			salesTeamSearch.run().each(function (salesTeamSearchResultSet) {
				var employee_id = salesTeamSearchResultSet.getValue("internalid");
				var first_name = salesTeamSearchResultSet.getValue("firstname");
				var last_name = salesTeamSearchResultSet.getValue("lastname");
				var employeeColorCode = salesTeamSearchResultSet.getValue(
					"custentity_employee_color_code"
				);
				var full_name = first_name + " " + last_name;

				if (isNullorEmpty(employeeColorCode)) {
					color = randomHexColorCode();
				} else {
					color = employeeColorCode;
				}

				employee_list.push(employee_id);
				employee_list_color.push(color);

				return true;
			});

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
				"<style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;}.wrapper{position:fixed;height:2em;width:2em;overflow:show;margin:auto;top:0;left:0;bottom:0;right:0;justify-content: center; align-items: center; display: -webkit-inline-box;} .ball{width: 22px; height: 22px; border-radius: 11px; margin: 0 10px; animation: 2s bounce ease infinite;} .blue{background-color: #0f3d39; }.red{background-color: #095C7B; animation-delay: .25s;}.yellow{background-color: #387081; animation-delay: .5s}.green{background-color: #d0e0cf; animation-delay: .75s}@keyframes bounce{50%{transform: translateY(25px);}}.select2-selection__choice{ background-color: #095C7B !important; color: white !important}.select2-selection__choice__remove{color: red !important;}</style>";

			form
				.addField({
					id: "custpage_overview_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_existing_customer_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_prospect_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_suspect_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_suspect_lost_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_suspect_offpeak_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_suspect_followup_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_suspect_oot_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_prospect_opportunity_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});
			form
				.addField({
					id: "custpage_table_csv",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});

			form
				.addField({
					id: "custpage_customer_id",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});

			form
				.addField({
					id: "custpage_sales_rep_id",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});

			form
				.addField({
					id: "custpage_contact_id",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});

			form
				.addField({
					id: "custpage_contact_email",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				});

			form
				.addField({
					id: "custpage_employee_list",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				}).defaultValue = employee_list.toString();

			form
				.addField({
					id: "custpage_employee_list_color",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				}).defaultValue = employee_list_color.toString();

			//Loading Section that gets displayed when the page is being loaded
			inlineHtml += loadingSection();
			inlineHtml += modalLeadStatusTimeline();
			inlineHtml += modalLeadSalesRepTimeline();

			// getDateRange('lastWeek');
			// getDateRange('lastMonth');
			// getDateRange('thisMonth');
			// getDateRange('lastFinancialYear');
			// getDateRange('thisFinancialYear');
			// getDateRange('lastYear');
			// getDateRange('thisYear');

			inlineHtml += stepByStepGuideModal();

			inlineHtml +=
				'<div class="container instruction_div hide" style="background-color: lightblue;font-size: 14px;padding: 15px;border-radius: 10px;border: 1px solid;box-shadow: 0px 1px 26px -10px white;"><p><b><u>Instructions</u></b></br><ol><li>To search for lead results within a specific time frame, use the "Date Lead Entered - Filter" and select the desired date range. After that, click on "Apply Filter". </br><b>Note:</b> This refers to the date when a lead was entered into Netsuite, either by yourself, your Sales Rep, or generated from the website/social media campaigns.</li><li>To search for new customer results, use the "Date Signed Up - Filter" and select the desired date range. Then click on "Apply Filter".</li></ol><b><u>Overview:</u></b></br>The far-left “Overview” button above the graph represents a filter that provides an overview of three lead statuses: Customer, Prospect and Suspect.</br></br><b><u>Additional filters:</u></b></br>The buttons following "Overview" on the graph allow you to further refine your search based on each lead status.</br></br><b><u>Customers:</u></b></br>This filter enables you to filter new customers and existing customers who have added a new service.</br></br><b><u>Prospects:</u></b></br>This filter allows you to delve deeper and determine if a lead is unresponsive to calls/emails or has become a genuine opportunity after an initial discussion.</br></br><b><u>Suspects:</u></b></br>This filter provides insights into different categories of suspect leads. Click on the specific status to view data on it: <ol><li>"Hot Lead" - a lead that has yet to be determined as a prospecting opportunity.</li><li>"Follow up" - a lead that we are currently unable to serve but may be able to in the future.</li><li>"Off Peak Pipeline" - a lead that has shown interest in Standard shipping, but a consolidated hub has not been opened yet.</li><li>"Lost" - leads that have been contacted but ultimately lost, for example, because the product is not suitable for their business.</li></ol></br><b><u>Cancellations:</u></b></br>This filter displays all customers who have cancelled within the selected period.</p><div class="form-group container"><div class="row"><div class="col-xs-4"></div><div class="col-xs-4"><input type="button" value="CLICK FOR USER GUIDE" class="form-control btn btn-primary" id="showGuide" style="background-color: #095C7B; border-radius: 30px;border-radius: 30px" /></div><div class="col-xs-4"></div></div></div></div></br>';

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
			inlineHtml += leadStatusDropdown(leadStatus);
			inlineHtml += leadSourceFilterSection(
				source,
				salesrep,
				campaign,
				parentLPO,
				lead_entered_by
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
			inlineHtml += "</div></div></div></br></br>";
			inlineHtml +=
				'<div class="form-group container scorecard_percentage hide" style="">';
			inlineHtml += '<div class="row">';
			inlineHtml += '<div class="col-xs-12">';
			inlineHtml += '<article class="card">';
			inlineHtml +=
				'<h2 style="text-align:center;">Franchisee Generated Leads - By Stage</h2>';
			inlineHtml +=
				'<small style="text-align:center;font-size: 12px;"></small>';
			inlineHtml += '<div id="container-progress" style="height: 300px"></div>';
			inlineHtml += "</article>";
			inlineHtml += "</div>";
			inlineHtml += "</div>";
			inlineHtml += "</div>";
			inlineHtml += tabsSection();
			inlineHtml += dataTable();

			form
				.addField({
					id: "custpage_campaign_list",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				}).defaultValue = campaign_list.toString();

			form
				.addField({
					id: "custpage_campaign_list_color",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				}).defaultValue = campaign_list_color.toString();

			form
				.addField({
					id: "custpage_source_list",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				}).defaultValue = source_list.toString();

			form
				.addField({
					id: "custpage_source_list_color",
					type: ui.FieldType.TEXT,
					label: "Table CSV",
				})
				.updateDisplayType({
					displayType: ui.FieldDisplayType.HIDDEN,
				}).defaultValue = source_list_color.toString();

			form
				.addField({
					id: "preview_table",
					label: "inlinehtml",
					type: "inlinehtml",
				})
				.updateLayoutType({
					layoutType: ui.FieldLayoutType.STARTROW,
				}).defaultValue = inlineHtml;

			form.clientScriptFileId = 6826994;

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

	function leadStatusDropdown(custStatus) {
		var inlineHtml =
			'<div class="form-group container status_dropdown_section hide">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS</span></h4></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml +=
			'<div class="form-group container status_dropdown_section hide">';
		inlineHtml += '<div class="row">';
		// Period dropdown field
		inlineHtml += '<div class="col-xs-12 cust_status_div">';
		inlineHtml += '<div class="input-group">';
		inlineHtml +=
			'<span class="input-group-addon" id="cust_status_text">STATUS</span>';
		inlineHtml += '<select id="cust_status" class="form-control">';
		inlineHtml += '<option value="0"></option>';

		if (custStatus == "13") {
			inlineHtml += '<option value="13" selected>CUSTOMER - SIGNED</option>';
		} else {
			inlineHtml += '<option value="13">CUSTOMER - SIGNED</option>';
		}

		if (custStatus == "66") {
			inlineHtml +=
				'<option value="66" selected>CUSTOMER - To Be Finalised</option>';
		} else {
			inlineHtml += '<option value="66">CUSTOMER - To Be Finalised</option>';
		}

		if (custStatus == "32") {
			inlineHtml +=
				'<option value="32" selected>CUSTOMER - Free Trail</option>';
		} else {
			inlineHtml += '<option value="32">CUSTOMER - Free Trial</option>';
		}

		if (custStatus == "71") {
			inlineHtml +=
				'<option value="32" selected>CUSTOMER - Free Trail Pending</option>';
		} else {
			inlineHtml += '<option value="32">CUSTOMER - Free Trial Pending</option>';
		}

		if (custStatus == "57") {
			inlineHtml += '<option value="57" selected>SUSPECT - HOT LEAD</option>';
		} else {
			inlineHtml += '<option value="57">SUSPECT - HOT LEAD</option>';
		}

		if (custStatus == "38") {
			inlineHtml +=
				'<option value="38" selected>SUSPECT - UNQUALIFIED</option>';
		} else {
			inlineHtml += '<option value="38">SUSPECT - UNQUALIFIED</option>';
		}

		if (custStatus == "42") {
			inlineHtml += '<option value="42" selected>SUSPECT - QUALIFIED</option>';
		} else {
			inlineHtml += '<option value="42">SUSPECT - QUALIFIED</option>';
		}

		if (custStatus == "6") {
			inlineHtml += '<option value="6" selected>SUSPECT - NEW</option>';
		} else {
			inlineHtml += '<option value="6">SUSPECT - NEW</option>';
		}

		if (custStatus == "20") {
			inlineHtml += '<option value="20" selected>SUSPECT - NO ANSWER</option>';
		} else {
			inlineHtml += '<option value="20">SUSPECT - NO ANSWER</option>';
		}

		if (custStatus == "69") {
			inlineHtml += '<option value="69" selected>SUSPECT - IN CONTACT</option>';
		} else {
			inlineHtml += '<option value="69">SUSPECT - IN CONTACT</option>';
		}

		if (custStatus == "18") {
			inlineHtml += '<option value="18" selected>SUSPECT - FOLLOW UP</option>';
		} else {
			inlineHtml += '<option value="18">SUSPECT - FOLLOW UP</option>';
		}

		if (custStatus == "67") {
			inlineHtml +=
				'<option value="67" selected>SUSPECT - LPO FOLLOW UP</option>';
		} else {
			inlineHtml += '<option value="67">SUSPECT - LPO FOLLOW UP</option>';
		}

		if (custStatus == "62") {
			inlineHtml +=
				'<option value="62" selected>SUSPECT - PARKING LOT</option>';
		} else {
			inlineHtml += '<option value="62">SUSPECT - PARKING LOT</option>';
		}

		if (custStatus == "68") {
			inlineHtml += '<option value="68" selected>SUSPECT - VALIDATED</option>';
		} else {
			inlineHtml += '<option value="68">SUSPECT - VALIDATED</option>';
		}

		if (custStatus == "60") {
			inlineHtml +=
				'<option value="60" selected>SUSPECT - REP REASSIGN</option>';
		} else {
			inlineHtml += '<option value="60">SUSPECT - REP REASSIGN</option>';
		}

		if (custStatus == "7") {
			inlineHtml += '<option value="7" selected>SUSPECT - REJECTED</option>';
		} else {
			inlineHtml += '<option value="7">SUSPECT - REJECTED</option>';
		}

		if (custStatus == "70") {
			inlineHtml += '<option value="70" selected>PROSPECT - QUALIFIED</option>';
		} else {
			inlineHtml += '<option value="70">PROSPECT - QUALIFIED</option>';
		}

		if (custStatus == "50") {
			inlineHtml +=
				'<option value="50" selected>PROSPECT - QUOTE SENT</option>';
		} else {
			inlineHtml += '<option value="50">PROSPECT - QUOTE SENT</option>';
		}

		if (custStatus == "58") {
			inlineHtml +=
				'<option value="58" selected>PROSPECT - OPPORTUNITY</option>';
		} else {
			inlineHtml += '<option value="58">PROSPECT - OPPORTUNITY</option>';
		}

		if (custStatus == "8") {
			inlineHtml += '<option value="8" selected>PROSPECT - IN CONTACT</option>';
		} else {
			inlineHtml += '<option value="8">PROSPECT - IN CONTACT</option>';
		}

		if (custStatus == "35") {
			inlineHtml += '<option value="35" selected>PROSPECT - NO ANSWER</option>';
		} else {
			inlineHtml += '<option value="35">PROSPECT - NO ANSWER</option>';
		}

		inlineHtml += "</select>";
		inlineHtml += "</div></div></div></div>";

		return inlineHtml;
	}

	/*
	 * PURPOSE : HTML code to generate the Modal Pop-up
	 *  PARAMS :  -
	 * RETURNS : HTML
	 *   NOTES :
	 */
	function stepByStepGuideModal() {
		var inlineHtml =
			'<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="overflow:auto !important;max-height: calc(100vh - 125px) !important;position: absolute;transform: translate(-50%, -50%);background-color: #CFE0CE; margin: auto; padding: 0; border: 1px solid #888;width: fit-content; left: 50%;top: 50%; box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); -webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h1 class="modal-title" id="modal-title">STEP BY STEP GUIDE</h1></div>';

		inlineHtml += '<div class="modal-body" style="padding: 2px 16px;">';
		inlineHtml += '<div class="form-group container mpex_customer2_section">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<iframe src="https://scribehow.com/embed/Sales_Full_Report__Rx3wYVX_TZWc9h9CdpS1Lw?as=scrollable&skipIntro=true&removeLogo=true" width="100%" height="640" allowfullscreen frameborder="0"></iframe>';

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += "</div></div></div>";

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
		// var inlineHtml =
		// 	'<div class="form-group container lead_entered_label_section hide">';
		// inlineHtml += '<div class="row">';
		// inlineHtml +=
		// 	'<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095C7B;">STATUS CHANGE ACTIVITY - FILTER</span></h4></div>';
		// inlineHtml += "</div>";
		// inlineHtml += "</div>";

		// inlineHtml += '<div class="form-group container modified_date_div hide">';
		// inlineHtml += '<div class="row">';

		// // Last Modified Date from field
		// inlineHtml += '<div class="col-xs-6 date_from">';
		// inlineHtml += '<div class="input-group">';
		// inlineHtml +=
		// 	'<span class="input-group-addon" id="modified_date_from_text">STATUS CHANGE ACTIVITY - FROM</span>';
		// if (isNullorEmpty(modified_start_date)) {
		// 	inlineHtml +=
		// 		'<input id="modified_date_from" class="form-control modified_date_from" type="date" />';
		// } else {
		// 	inlineHtml +=
		// 		'<input id="modified_date_from" class="form-control modified_date_from" type="date" value="' +
		// 		modified_start_date +
		// 		'"/>';
		// }

		// inlineHtml += "</div></div>";
		// // Last Modified Date to field
		// inlineHtml += '<div class="col-xs-6 date_to">';
		// inlineHtml += '<div class="input-group">';
		// inlineHtml +=
		// 	'<span class="input-group-addon" id="date_to_text">STATUS CHANGE ACTIVITY - TO</span>';
		// if (isNullorEmpty(modified_last_date)) {
		// 	inlineHtml +=
		// 		'<input id="modified_date_to" class="form-control modified_date_to" type="date">';
		// } else {
		// 	inlineHtml +=
		// 		'<input id="modified_date_to" class="form-control modified_date_to" type="date" value="' +
		// 		modified_last_date +
		// 		'">';
		// }

		// inlineHtml += "</div></div></div></div>";

		// inlineHtml +=
		// 	'<div class="form-group container salesactivitynotes_div hide">';
		// inlineHtml += '<div class="row">';

		// inlineHtml += '<div class="col-xs-12 salesactivitynotes">';
		// inlineHtml += '<div class="input-group">';
		// inlineHtml +=
		// 	'<span class="input-group-addon" id="salesactivitynotes_text">DISPLAY USER/ACTIVITY NOTES?</span>';
		// inlineHtml += '<select id="sales_activity_notes" class="form-control">';
		// inlineHtml += "<option></option>";

		// if (sales_activity_notes == "1") {
		// 	inlineHtml += '<option value="1" selected>Yes</option>';
		// 	inlineHtml += '<option value="2">No</option>';
		// } else if (sales_activity_notes == "2") {
		// 	inlineHtml += '<option value="1" >Yes</option>';
		// 	inlineHtml += '<option value="2" selected>No</option>';
		// } else {
		// 	inlineHtml += '<option value="1">Yes</option>';
		// 	inlineHtml += '<option value="2" selected>No</option>';
		// }
		// inlineHtml += "</select>";
		// inlineHtml += "</div></div></div></div>";

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
			'<li role="presentation" class="active"><a data-toggle="tab" href="#overview" style="border-radius: 30px"><b>OVERVIEW</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#customer" style="border-radius: 30px"><b>CUSTOMERS</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#prospects" style="border-radius: 30px"><b>PROSPECTS</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects" style="border-radius: 30px"><b>SUSPECTS</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#cancellation" style="border-radius: 30px"><b>CANCELLATIONS</b></a></li>';

		inlineHtml += "</ul></div>";

		// Tabs content
		inlineHtml += '<div class="tab-content">';
		inlineHtml += '<div role="tabpanel" class="tab-pane active" id="overview">';

		// Overview Tabs headers
		inlineHtml +=
			"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		inlineHtml +=
			".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		inlineHtml += "</style>";

		inlineHtml +=
			'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		inlineHtml +=
			'<li role="presentation" class="active"><a data-toggle="tab" href="#complete_overview" style="border-radius: 30px"><b>COMPLETE OVERVIEW</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#datacapture_overview" style="border-radius: 30px"><b>DATA CAPTURE OVERVIEW</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#lpo_overview" style="border-radius: 30px"><b>LPO & LPO-BAU OVERVIEW</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#salesrep_overview" style="border-radius: 30px"><b>SALES REP OVERVIEW</b></a></li>';
		if (role != 1000) {
			inlineHtml +=
				'<li role="presentation" class=""><a data-toggle="tab" href="#zee_overview" style="border-radius: 30px"><b>FRANCHISEE OVERVIEW</b></a></li>';
		}

		inlineHtml += "</ul></div>";

		inlineHtml += '<div class="tab-content">';
		inlineHtml +=
			'<div role="tabpanel" class="tab-pane active" id="complete_overview">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_preview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_source_preview"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_campaign_preview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("preview");
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane " id="zee_overview">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id=""></div>';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_zee_overview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_zee_overview_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("zee_overview");
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane " id="lpo_overview">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_lpo_overview"></div>';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_lpo_overview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_lpo_source_datacapture_preview"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_lpo_campaign_datacapture_preview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("lpo_overview");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane " id="salesrep_overview">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_salesrep_overview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_entered_sales_rep_preview"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_campaign_sales_rep_preview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("salesrep_overview");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane " id="datacapture_overview">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_datacapture_overview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_source_datacapture_preview"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_campaign_datacapture_preview"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("datacapture_overview");
		inlineHtml += "</div>";

		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="customer">';

		// Customers Tabs headers
		inlineHtml +=
			"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		inlineHtml +=
			".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		inlineHtml += "</style>";

		inlineHtml +=
			'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		inlineHtml +=
			'<li role="presentation" class="active"><a data-toggle="tab" href="#new_customers" style="border-radius: 30px"><b>NEW CUSTOMERS</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#trial_customers" style="border-radius: 30px"><b>FREE TRIALS</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#trial_pending_customers" style="border-radius: 30px"><b>FREE TRIALS PENDING</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#existing_customers" style="border-radius: 30px"><b>EXISTING CUSTOMERS</b></a></li>';

		inlineHtml += "</ul></div>";

		inlineHtml += '<div class="tab-content">';
		inlineHtml +=
			'<div role="tabpanel" class="tab-pane active" id="new_customers">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_customer"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_signed_source"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_signed_campaign"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("customer");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane " id="trial_customers">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id=""></div>';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_trial_customers"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_trial_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_trial_source"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_trial_campaign"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("trial_customers");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane " id="trial_pending_customers">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id=""></div>';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_trial_pending_customers"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_trial_pending_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_trial_pending_source"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_trial_pending_campaign"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("trial_pending_customers");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane " id="existing_customers">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_existing_customers"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("existing_customers");
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects">';

		// Prospects Tabs headers
		inlineHtml +=
			"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		inlineHtml +=
			".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		inlineHtml += "</style>";

		inlineHtml +=
			'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';
		inlineHtml +=
			'<li role="presentation" class="active"><a data-toggle="tab" href="#prospects_opportunites" style="border-radius: 30px"><b>PROSPECTS - QUOTE SENT</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#prospects_box" style="border-radius: 30px"><b>PROSPECTS - BOX SENT</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#prospects_quoteSent_incontact_noanswer" style="border-radius: 30px"><b>PROSPECTS - IN CONTACT/OPPORTUNITY</b></a></li>';

		inlineHtml += "</ul></div>";

		inlineHtml += '<div class="tab-content">';
		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="prospects_quoteSent_incontact_noanswer">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_quoteSent_incontact_noanswer"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_prospect_opportunity_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_prospect_opportunity_source"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_prospect_opportunity_campaign"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("prospects_quoteSent_incontact_noanswer");
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="prospects_box">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_prospects_box"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_prospect_box_sent_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_prospect_box_sent_source"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_prospect_box_sent_campaign"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("prospects_box_sent");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane active" id="prospects_opportunites">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_prospects_opportunites"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-12"><div id="container_prospect_quote_sent_last_assigned"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += '<div class="">';
		inlineHtml += '<div class="row">';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_prospect_quote_sent_source"></div></div>';
		inlineHtml +=
			'<div class="col-xs-6"><div id="container_prospect_quote_sent_campaign"></div></div>';
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("prospects_opportunites");
		inlineHtml += "</div>";
		inlineHtml += "</div>";
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects">';

		// Suspects Tabs headers
		inlineHtml +=
			"<style>.nav > li.active > a, .nav > li.active > a:focus, .nav > li.active > a:hover { background-color: #095C7B; color: #fff }";
		inlineHtml +=
			".nav > li > a, .nav > li > a:focus, .nav > li > a:hover { margin-left: 5px; margin-right: 5px; border: 2px solid #095C7B; color: #095C7B; }";
		inlineHtml += "</style>";

		inlineHtml +=
			'<div style="width: 95%; margin:auto; margin-bottom: 30px"><ul class="nav nav-pills nav-justified main-tabs-sections " style="margin:0%; ">';

		inlineHtml +=
			'<li role="presentation" class="active"><a data-toggle="tab" href="#suspects_leads" style="border-radius: 30px"><b>SUSPECTS - HOT/NEW LEAD/REASSIGN</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_no_answer" style="border-radius: 30px"><b>SUSPECTS - NO ANSWER</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_in_contact" style="border-radius: 30px"><b>SUSPECTS - IN CONTACT</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_unqualified" style="border-radius: 30px"><b>SUSPECTS - UNQUALIFIED</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_qualified" style="border-radius: 30px"><b>SUSPECTS - QUALIFIED</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_validated" style="border-radius: 30px"><b>SUSPECTS - LPO VALIDATED</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_followup" style="border-radius: 30px"><b>SUSPECTS - FOLLOW UP</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_off_peak_pipeline" style="border-radius: 30px"><b>SUSPECTS - PARKING LOT</b></a></li>';
		inlineHtml +=
			'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_lost" style="border-radius: 30px"><b>SUSPECTS - LOST</b></a></li>';
		if (role != 1000) {
			inlineHtml +=
				'<li role="presentation" class=""><a data-toggle="tab" href="#suspects_oot" style="border-radius: 30px"><b>SUSPECTS - OUT OF TERRITORY</b></a></li>';
		}

		inlineHtml += "</ul></div>";

		inlineHtml += '<div class="tab-content">';

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane active" id="suspects_leads">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_no_answer">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_no_answer"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_no_answer");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_in_contact">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_in_contact"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_in_contact");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_qualified">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_qualified"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_qualified");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_unqualified">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_unqualified"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_unqualified");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_validated">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_validated"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_validated");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_followup">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_followup"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_followup");
		inlineHtml += "</div>";

		inlineHtml +=
			'<div role="tabpanel" class="tab-pane" id="suspects_off_peak_pipeline">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_off_peak_pipeline"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_off_peak_pipeline");
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_lost">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_lost"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_lost");
		inlineHtml += "</div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="suspects_oot">';
		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_suspects_oot"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("suspects_oot");
		inlineHtml += "</div>";
		inlineHtml += "</div></div>";

		inlineHtml += '<div role="tabpanel" class="tab-pane" id="cancellation">';

		inlineHtml += '<figure class="highcharts-figure">';
		inlineHtml += '<div id="container_cancellation"></div>';
		inlineHtml += "</figure><br></br>";
		inlineHtml += dataTable("cancellation");
		inlineHtml += "</div>";

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
			" th{text-align: center;vertical-align: middle;} .bolded{font-weight: bold;} .exportButtons{background-color: #045d7b !important;color: white !important;border-radius: 25px !important;}</style>";
		inlineHtml +=
			'<div class="table_section hide"><table id="mpexusage-' +
			name +
			'" class="table table-responsive table-striped customer tablesorter row-border cell-border compact" style="width: 100%;border: 2px solid #103d39">';
		inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
		inlineHtml += '<tr class="text-center">';

		inlineHtml += "</tr>";
		inlineHtml += "</thead>";

		inlineHtml += '<tbody id="result_usage_' + name + '" ></tbody>';

		if (name == "preview") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (name == "zee_overview") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (name == "lpo_overview") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}

		if (name == "salesrep_overview") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (name == "datacapture_overview") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th>TOTAL: </th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}

		if (name == "customer" || name == "existing_customers") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th colspan="7"></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th style="text-align:right"></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (name == "trial_customers" || name == "trial_pending_customers") {
			inlineHtml +=
				'<tfoot style="font-size: larger;"><tr style="background-color: #085c7b2e;border: 2px solid;"><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th></tr></tfoot>';
		}
		if (name == "suspects_followup") {
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

	function modalLeadStatusTimeline() {
		var inlineHtml =
			'<div id="leadStatusModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="closeModal" style="cursor: pointer;color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">STATUS TIMELINE</h3></div>';

		inlineHtml +=
			'<div class="modal-body" style="padding: 2px 16px;font-size: 14px;">';
		inlineHtml +=
			'</div><div class="modal-footer" style="padding: 2px 16px;"><button type="button" class="btn btn-default closeModal" data-dismiss="modal">Close</button></div></div></div>';

		return inlineHtml;
	}

	function modalLeadSalesRepTimeline() {
		var inlineHtml =
			'<div id="leadSalesRepModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="overflow:auto !important;max-height: calc(100vh - 125px) !important;position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888; width: 80%; left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="closeSalesRepModal" style="cursor: pointer;color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h1 class="modal-title" id="modal-title">STATUS TIMELINE</h1></div>';

		inlineHtml +=
			'<div class="modal-body" style="padding: 2px 16px;font-size: 14px;">';
		inlineHtml +=
			"<style>table#salesrep_timeline_table {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#salesrep_timeline_table th{text-align: center;} .bolded{font-weight: bold;}</style>";
		inlineHtml +=
			'<div class="table_section "><table id="salesrep_timeline_table" class="table table-responsive table-striped customer tablesorter cell-border compact" style="width: 100%;">';
		inlineHtml += '<thead style="color: white;background-color: #095C7B;">';
		inlineHtml += '<tr class="text-center">';

		inlineHtml += "</tr>";
		inlineHtml += "</thead>";

		inlineHtml += '<tbody id="" ></tbody>';
		inlineHtml += "</table></div>";
		inlineHtml +=
			'</div><div class="modal-footer" style="padding: 2px 16px;"><button type="button" class="btn btn-default closeSalesRepModal" data-dismiss="modal">Close</button></div></div></div>';

		return inlineHtml;
	}

	function getDateRange(period) {
		//
		// Calculates the date range for a given period in AEST using Moment.js.

		//     Args:
		//         period: A string specifying the period (e.g., "lastWeek", "thisMonth", etc.).

		//             Returns:
		//     An object with two properties: "startDate" and "endDate" representing the date range in AEST.
		//
		var returnDate = [];
		var today = moment();

		var dateFormat = "YYYY-MM-DD";
		var testDateUtc = moment.utc(today);
		today = testDateUtc.local();

		log.debug({
			title: "period",
			details: period,
		});
		log.debug({
			title: "today",
			details: today,
		});

		if (period == "lastWeek") {
			returnDate.push({
				startDate: today
					.clone()
					.startOf("isoweek")
					.subtract(1, "weeks")
					.format(dateFormat), // Monday of last week
				endDate: today
					.clone()
					.endOf("isoweek")
					.subtract(1, "days")
					.format(dateFormat), // Sunday of last week
			});
		} else if (period == "thisWeek") {
			returnDate.push({
				startDate: today.clone().startOf("isoweek").format(dateFormat), // Monday of this week
				endDate: today.clone().endOf("isoweek").format(dateFormat), // Sunday of this week
			});
		} else if (period == "lastMonth") {
			returnDate.push({
				startDate: today
					.clone()
					.startOf("month")
					.subtract(1, "months")
					.format(dateFormat),
				endDate: today
					.clone()
					.endOf("month")
					.subtract(1, "months")
					.format(dateFormat),
			});
		} else if (period == "thisMonth") {
			returnDate.push({
				startDate: today.clone().startOf("month").format(dateFormat),
				endDate: today.clone().endOf("month").format(dateFormat),
			});
		} else if (period == "lastYear") {
			returnDate.push({
				startDate: today
					.clone()
					.startOf("year")
					.subtract(1, "years")
					.format(dateFormat),
				endDate: today
					.clone()
					.endOf("year")
					.subtract(1, "years")
					.format(dateFormat),
			});
		} else if (period == "thisYear") {
			returnDate.push({
				startDate: today.clone().startOf("year").format(dateFormat),
				endDate: today.clone().endOf("year").format(dateFormat),
			});
		} else if (period == "thisFinancialYear") {
			const financialYearStart = moment().month(6).startOf("month"); // April 1st
			today.isBefore(financialYearStart)
				? returnDate.push({
						startDate: financialYearStart
							.subtract(1, "years")
							.format(dateFormat), // Previous financial year
						endDate: today.clone().endOf("month").format(dateFormat), // Last day of current month
				  })
				: returnDate.push({
						startDate: financialYearStart,
						endDate: financialYearStart
							.add(1, "years")
							.subtract(1, "days")
							.format(dateFormat), // Last day of March next year
				  });
		} else if (period == "lastFinancialYear") {
			const lastFinancialYearStart = moment()
				.month(6)
				.subtract(1, "years")
				.startOf("month");
			returnDate.push({
				startDate: lastFinancialYearStart.format(dateFormat),
				endDate: lastFinancialYearStart
					.add(1, "years")
					.subtract(1, "days")
					.format(dateFormat), // Last day of March in previous year
			});
		}

		log.debug({
			title: "returnDate",
			details: returnDate,
		});

		// return returnDate;
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

	function randomHexColorCode() {
		var n = (Math.random() * 0xfffff * 1000000).toString(16);
		return "#" + n.slice(0, 6);
	}

	return {
		onRequest: onRequest,
	};
});
