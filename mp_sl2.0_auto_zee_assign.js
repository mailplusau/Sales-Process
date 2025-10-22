/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 *
 * Author:               Ankith Ravindran
 * Created on:           Thu Oct 12 2023
 * Modified on:          2024-08-07T22:17:58.880Z
 * SuiteScript Version:  2.0
 * Description:          Auto assigning the franchisee to a lead depending on the suburb/state/postcode and then creating a sales record assigning to a campaign depending on the source of the lead.
 *
 * Copyright (c) 2023 MailPlus Pty. Ltd.
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
	"N/format", "N/https",
], function (ui, email, runtime, search, record, http, log, redirect, format, https) {
	var role = 0;
	var userId = 0;
	var zee = 0;

	var salesRepsEmployeeIDs = [668712, 696160, 668711]
	var salesRepsNames = ["Belinda Urbani", "Kerina Helliwell", "Lee Russell"];

	function onRequest(context) {
		var baseURL = "https://system.na2.netsuite.com";
		if (runtime.EnvType == "SANDBOX") {
			baseURL = "https://system.sandbox.netsuite.com";
		}
		userId = runtime.getCurrentUser().id;
		role = runtime.getCurrentUser().role;

		var lpoLeadBDMAssigned = null;

		var date = new Date();
		var date_now = format.parse({
			value: date,
			type: format.Type.DATE,
		});
		var time_now = format.parse({
			value: date,
			type: format.Type.TIMEOFDAY,
		});

		if (context.request.method === "GET") {
			log.debug({
				title: "context.request.parameters",
				details: context.request.parameters,
			});
			var customerInternalId = context.request.parameters.custid;
			//Campaign ID
			var campaignid = context.request.parameters.campaignid;
			//Sales Rep to be Assigned
			var salesrepid = context.request.parameters.salesrepid;
			role = context.request.parameters.role;

			//* Get the Lead Internal ID passed through to this Suitelet
			log.debug({
				title: "customerInternalId",
				details: customerInternalId,
			});

			log.debug({
				title: "salesrepid",
				details: salesrepid,
			});

			var zee_id;
			var zeeCount = 0;
			var salesRep;
			var siteAddressZipCode = null;
			var siteAddressSuburb = null;
			var siteAddressState = null;
			var salesRepEmail = null;
			var salesRepName = null;

			//*Find the postcode for the customer
			//Search: Lead List - Site Addresses
			var siteAddressesSearch = search.load({
				type: "customer",
				id: "customsearch_cust_list_site_addresses_2",
			});

			siteAddressesSearch.filters.push(
				search.createFilter({
					name: "internalid",
					join: null,
					operator: search.Operator.ANYOF,
					values: customerInternalId,
				})
			);

			siteAddressesSearch.run().each(function (siteAddressesSearchResultSet) {
				siteAddressZipCode = siteAddressesSearchResultSet.getValue({
					name: "zipcode",
					join: "Address",
				});
				siteAddressSuburb = siteAddressesSearchResultSet.getValue({
					name: "city",
					join: "Address",
				});
				siteAddressState = siteAddressesSearchResultSet.getValue({
					name: "state",
					join: "Address",
				});
				return true;
			});

			//?DEBUG DATA
			log.debug({
				title: "siteAddressZipCode",
				details: siteAddressZipCode,
			});
			log.debug({
				title: "siteAddressSuburb",
				details: siteAddressSuburb,
			});
			log.debug({
				title: "siteAddressState",
				details: siteAddressState,
			});

			var parentLPO = null;
			var parentLPOCount = 0;

			//UPDATE LEAD RECORD
			var customerRecord = record.load({
				type: record.Type.CUSTOMER,
				id: customerInternalId,
				isDynamic: true,
			});

			var leadSource = customerRecord.getValue({
				fieldId: "leadsource",
			});

			var entity_id = customerRecord.getValue({
				fieldId: "entityid",
			});

			var customer_name = customerRecord.getValue({
				fieldId: "companyname",
			});
			var lead_entered_by = customerRecord.getValue({
				fieldId: "custentity_lead_entered_by",
			});
			var lead_customer_type = customerRecord.getValue({
				fieldId: "custentity_customer_type",
			});

			//Franchisee Visited Customer
			var zee_visisted_customer = customerRecord.getValue({
				fieldId: "custentity_mp_toll_zeevisit_memo",
			});
			//Brochure Handed Over
			var brochure_handed_over = customerRecord.getValue({
				fieldId: "custentity_brochure_handed_over",
			});

			if (leadSource == -4) {
				zee_id = customerRecord.getValue({
					fieldId: "partner",
				});
			}

			log.debug({
				title: "lead_customer_type",
				details: lead_customer_type,
			});

			var zee_text = "";

			if (role != 1032) {
				//IF THE SITE ADDRESS IS NOT EMPTY
				if (
					!isNullorEmpty(siteAddressZipCode) &&
					!isNullorEmpty(siteAddressSuburb) &&
					!isNullorEmpty(siteAddressState)
				) {

					//LEAD SORUCE IS NOT FRANCHISEE GENERATED
					if (leadSource != -4) {
						//Search Name: Network Matrix - Franchisee - Auto Allocate
						var zeeNetworkMatrixSearch = search.load({
							type: "partner",
							id: "customsearch_networkmtrx_zee_suburb_2",
						});

						zeeNetworkMatrixSearch.filters.push(
							search.createFilter({
								name: "entityid",
								join: null,
								operator: search.Operator.DOESNOTSTARTWITH,
								values: "old",
							})
						);
						zeeNetworkMatrixSearch.filters.push(
							search.createFilter({
								name: "entityid",
								join: null,
								operator: search.Operator.DOESNOTSTARTWITH,
								values: "test",
							})
						);
						//If lead source is LPO - Head Office Generated, use the Australia Post Suburb Mapping JSON to check the suburb is services by the franchisee or not.
						if (leadSource == 282051) {
							zeeNetworkMatrixSearch.filters.push(
								search.createFilter({
									name: "custentity_ap_suburbs_json",
									join: null,
									operator: search.Operator.CONTAINS,
									values: siteAddressSuburb,
								})
							);
							zeeNetworkMatrixSearch.filters.push(
								search.createFilter({
									name: "custentity_ap_suburbs_json",
									join: null,
									operator: search.Operator.CONTAINS,
									values: siteAddressState,
								})
							);
							zeeNetworkMatrixSearch.filters.push(
								search.createFilter({
									name: "custentity_ap_suburbs_json",
									join: null,
									operator: search.Operator.CONTAINS,
									values: siteAddressZipCode,
								})
							);
						} else {
							//Else check the Franchisee Territory JSON field to check if the suburb is being serviced by the franchisee or not.
							zeeNetworkMatrixSearch.filters.push(
								search.createFilter({
									name: "custentity_zee_territory_json",
									join: null,
									operator: search.Operator.CONTAINS,
									values: siteAddressSuburb,
								})
							);
							zeeNetworkMatrixSearch.filters.push(
								search.createFilter({
									name: "custentity_zee_territory_json",
									join: null,
									operator: search.Operator.CONTAINS,
									values: siteAddressState,
								})
							);
							zeeNetworkMatrixSearch.filters.push(
								search.createFilter({
									name: "custentity_zee_territory_json",
									join: null,
									operator: search.Operator.CONTAINS,
									values: siteAddressZipCode,
								})
							);
						}

						log.debug({
							title: "zeeNetworkMatrixSearch.filters",
							details: zeeNetworkMatrixSearch.filters,
						});

						var zee_name = "";

						zeeNetworkMatrixSearch
							.run()
							.each(function (zeeNetworkMatrixSearchResultSet) {
								zee_id = zeeNetworkMatrixSearchResultSet.getValue({
									name: "internalid",
								});
								if (zeeCount == 0) {
									zee_name += zeeNetworkMatrixSearchResultSet.getValue({
										name: "companyname",
									});
								} else {
									zee_name +=
										", " +
										zeeNetworkMatrixSearchResultSet.getValue({
											name: "companyname",
										});
								}

								zeeCount++;
								return true;
							});

						log.debug({
							title: "zeeCount",
							details: zeeCount,
						});

						log.debug({
							title: "zee_name",
							details: zee_name,
						});

						//IF THERE ARE NO FRANCHISEES OR MORE THAN 1 FRANCHISEES THAT CAN SERVICE THE SITE ADDRESS
						if (isNullorEmpty(zee_id) || zeeCount > 1) {

							//ASSIGN THE LEAD TO MAILPLUS PTY LTD FRANCHISEE
							customerRecord.setValue({
								fieldId: "partner",
								value: 435, //MailPlus Pty Ltd
							});
							zee_id = 435;//MailPlus Pty Ltd

							//ASSIGN SALES REP (salesRep) ID VARIABLE
							//IF NO SALES REP ID(salesrepid) IS PASSED TO THIS SUITELET
							if (isNullorEmpty(salesrepid)) {
								//ASSIGN SALES REP BASED ON THE SITE ADDRESS STATE
								if (siteAddressState == "TAS" || siteAddressState == "VIC") {
									salesRep = 668712; //Belinda Urbani
								} else if (
									siteAddressState == "ACT" ||
									siteAddressState == "SA"
								) {
									salesRep = 696160; //Kerina Helliwell
								} else if (siteAddressState == "NSW") {
									salesRep = 696160; //Kerina Helliwell
								} else if (
									siteAddressState == "QLD" ||
									siteAddressState == "WA" ||
									siteAddressState == "NT"
								) {
									salesRep = 668711; //Lee Russell
								}
							} else {
								//SALES REP ID(salesrepid) IS PASSED TO THIS SUITELET
								salesRep = salesrepid;
							}

							//Multiple Franchisees found for the suburb
							//Customer Type has been selected either Service or Product
							//Lead Source: Outsourced - Head Office Generated
							//Lead Source: Outsourced - Head Office Validated
							if (
								zeeCount > 1 &&
								!isNullorEmpty(lead_customer_type) &&
								(leadSource == 295896 || leadSource == 296333)
							) {

								customerRecord.setValue({
									fieldId: "entitystatus",
									value: 68, //Status to SUSPECT - VALIDATED
								});
							}
						} else if (!isNullorEmpty(zee_id) && zeeCount == 1) {
							//IF THERE IS ONLY 1 FRANCHISEE THAT CAN SERVICE THE SITE ADDRESS
							var partnerRecord = record.load({
								type: record.Type.PARTNER,
								id: zee_id,
							});

							zee_text = partnerRecord.getValue({
								fieldId: "companyname",
							});
							var lpoSuburbMappingJSON = partnerRecord.getValue({
								fieldId: "custentity_ap_suburbs_json",
							});
							var zeeSalesRepAssigned = partnerRecord.getValue({
								fieldId: "custentity_sales_rep_assigned",
							});

							//ASSIGN TO SALES REP ID(salesrepid) BASED ON THE SALES REP ASSIGNED AT THE FRANCHISEE LEVEL
							if (isNullorEmpty(salesrepid)) {
								salesrepid = zeeSalesRepAssigned;
							}

							//Lead Source: LPO - Head Office Generated
							//Campaign: 69 - LPO OR 76 - LPO - BAU
							if (
								leadSource == 282051 ||
								campaignid == 69 ||
								campaignid == 76
							) {

								//CHECK IF FRANCHISEE HAS ANY PARENT LPO ASSIGNED TO THEM
								//Search: Active Parent LPO Customer List
								var parentLPOListSearch = search.load({
									type: "customer",
									id: "customsearch_parent_lpo_customers",
								});

								parentLPOListSearch.filters.push(
									search.createFilter({
										name: "custentity_lpo_linked_franchisees",
										join: null,
										operator: search.Operator.ANYOF,
										values: zee_id,
									})
								);

								parentLPOListSearch
									.run()
									.each(function (parentLPOListSearchResultSet) {
										parentLPO = parentLPOListSearchResultSet.getValue({
											name: "internalid",
											summary: "GROUP",
										});

										lpoLeadBDMAssigned =
											parentLPOListSearchResultSet.getValue({
												name: "custrecord_lpo_sales_rep",
												join: "CUSTRECORD_LPO_LEAD_CUSTOMER",
												summary: "GROUP",
											});

										// if (isNullorEmpty(lpoLeadBDMAssigned)) {
										//     lpoLeadBDMAssigned = 653718
										// }

										parentLPOCount++;
										return true;
									});

								log.debug({
									title: "LPO - Head Office Generated - lpoLeadBDMAssigned",
									details: lpoLeadBDMAssigned,
								});

								log.debug({
									title: "LPO - Head Office Generated - parentLPOCount",
									details: parentLPOCount,
								});
								log.debug({
									title: "LPO - Head Office Generated - parentLPO",
									details: parentLPO,
								});

								//IF ONLY 1 LPO LINKED TO FRANCHISEE
								if (parentLPOCount == 1) {
									//ASSIGN PARENT LPO TO THE LEAD
									customerRecord.setValue({
										fieldId: "custentity_lpo_parent_account",
										value: parentLPO,
									});

									//ASSIGN SALES REP BASED ON THE LPO PROFILER RECORD
									if (isNullorEmpty(lpoLeadBDMAssigned)) {
										salesRep = salesrepid;
									} else {
										salesRep = lpoLeadBDMAssigned;
									}

									// customerRecord.setValue({
									//     fieldId: 'entitystatus',
									//     value: 42,
									// });

								} else {
									//IF MORE THAN 1 LPO LINKED TO FRANCHISEE

									//ASSIGN SALES REP BASED ON THE FRANCHISEE
									salesRep = salesrepid;
									log.debug({
										title:
											"LPO - Head Office Generated - lpoSuburbMappingJSON",
										details: lpoSuburbMappingJSON,
									});

									//ASSIGN LEAD TO PARENT LPO BASED ON THE AP SUBURB MAPPING AT THE FRANCHISEE LEVEL
									if (!isNullorEmpty(lpoSuburbMappingJSON)) {
										lpoSuburbMappingJSON = JSON.parse(lpoSuburbMappingJSON);
										log.debug({
											title:
												"LPO - Head Office Generated - lpoSuburbMappingJSON.hasOwnProperty(parent_lpo_id)",
											details:
												lpoSuburbMappingJSON.hasOwnProperty("parent_lpo_id"),
										});

										lpoSuburbMappingJSON.forEach(function (suburb) {
											if (!isNullorEmpty(suburb.parent_lpo_id)) {
												if (
													siteAddressSuburb.toLowerCase() ==
													suburb.suburbs.toLowerCase() &&
													siteAddressZipCode == suburb.post_code
												) {
													customerRecord.setValue({
														fieldId: "custentity_lpo_parent_account",
														value: parseInt(suburb.parent_lpo_id),
													});
													// customerRecord.setValue({
													//     fieldId: 'entitystatus',
													//     value: 42,
													// });
												}
											}
										});
									}
								}
							} else {
								if (isNullorEmpty(salesrepid)) {
									if (
										siteAddressState == "TAS" ||
										siteAddressState == "VIC"
									) {
										salesRep = 668712; //Belinda Urbani
									} else if (
										siteAddressState == "ACT" ||
										siteAddressState == "SA"
									) {
										salesRep = 696160; //Kerina Helliwell
									} else if (siteAddressState == "NSW") {
										salesRep = 696160; //Kerina Helliwell
									} else if (
										siteAddressState == "QLD" ||
										siteAddressState == "WA" ||
										siteAddressState == "NT"
									) {
										salesRep = 668711; //Lee Russell
									}

								} else {
									salesRep = salesrepid;
								}
								if (leadSource == -4) {
									if (!isNullorEmpty(zee_visisted_customer) || brochure_handed_over == 1) {
										customerRecord.setValue({
											fieldId: "entitystatus",
											value: 57, // SUSPECT - HOT LEAD
										});
									} else {
										customerRecord.setValue({
											fieldId: "entitystatus",
											value: 68, // SUSPECT - VALIDATED
										});

										//2025-05-29 08:22:56 [UPDATE] - Changing the status instead of SUSPECT - VALIDATED to SUSPECT - FRANCHISEE REVIEW
										// customerRecord.setValue({
										// 	fieldId: "entitystatus",
										// 	value: 39, // SUSPECT - FRANCHISEE REVIEW
										// });
									}

								} else if (
									!isNullorEmpty(lead_customer_type) &&
									(leadSource == 295896 || leadSource == 296333)
								) {
									//Customer Type has been selected either Service or Product
									//Lead Source: Outsourced - Head Office Generated
									//Lead Source: Outsourced - Head Office Validated
									// customerRecord.setValue({
									// 	fieldId: "entitystatus",
									// 	value: 68, // SUSPECT - VALIDATED
									// });

									//2025-05-29 08:22:56 [UPDATE] - Changing the status instead of SUSPECT - VALIDATED to SUSPECT - FRANCHISEE REVIEW
									customerRecord.setValue({
										fieldId: "entitystatus",
										value: 39, // SUSPECT - FRANCHISEE REVIEW
									});
								}
							}

							customerRecord.setValue({
								fieldId: "partner",
								value: zee_id,
							});
							// var salesRep = partnerRecord.getValue({
							//     fieldId: 'custentity_sales_rep_assigned'
							// });
						}
					} else if (leadSource == -4) { //LEAD SOURCE IS FRANCHISEE GENERATED
						var partnerRecord = record.load({
							type: record.Type.PARTNER,
							id: zee_id,
						});
						zee_text = partnerRecord.getValue({
							fieldId: "companyname",
						});
						var zeeSalesRepAssigned = partnerRecord.getValue({
							fieldId: "custentity_sales_rep_assigned",
						});

						var lpoSuburbMappingJSON = partnerRecord.getValue({
							fieldId: "custentity_ap_suburbs_json",
						});

						log.debug({
							title:
								"LPO - Head Office Generated - lpoSuburbMappingJSON",
							details: lpoSuburbMappingJSON,
						});

						//ASSIGN LEAD TO PARENT LPO BASED ON THE AP SUBURB MAPPING AT THE FRANCHISEE LEVEL
						if (!isNullorEmpty(lpoSuburbMappingJSON)) {
							lpoSuburbMappingJSON = JSON.parse(lpoSuburbMappingJSON);
							log.debug({
								title:
									"LPO - Head Office Generated - lpoSuburbMappingJSON.hasOwnProperty(parent_lpo_id)",
								details:
									lpoSuburbMappingJSON.hasOwnProperty("parent_lpo_id"),
							});

							lpoSuburbMappingJSON.forEach(function (suburb) {
								if (!isNullorEmpty(suburb.parent_lpo_id)) {
									if (
										siteAddressSuburb.toLowerCase() ==
										suburb.suburbs.toLowerCase() &&
										siteAddressZipCode == suburb.post_code
									) {
										customerRecord.setValue({
											fieldId: "custentity_lpo_parent_account",
											value: parseInt(suburb.parent_lpo_id),
										});
									}
								}
							});
						}

						if (isNullorEmpty(salesrepid)) {
							salesrepid = zeeSalesRepAssigned;
							salesRep = zeeSalesRepAssigned;
						}

						if (!isNullorEmpty(zee_visisted_customer) || brochure_handed_over == 1) {
							customerRecord.setValue({
								fieldId: "entitystatus",
								value: 57, // SUSPECT - HOT LEAD
							});
						} else {
							customerRecord.setValue({
								fieldId: "entitystatus",
								value: 68, // SUSPECT - VALIDATED
							});
						}
					}

					//?DEBUG DATA
					log.debug({
						title: "salesRep",
						details: salesRep,
					});
					log.debug({
						title: "leadSource",
						details: leadSource,
					});
					log.debug({
						title: "role",
						details: role,
					});

					//ASSIGN SALES REP NAME AND EMAIL TO THE VARIABLES FOR EMAILS
					if (salesRep == 668712) {
						salesRepEmail = "belinda.urbani@mailplus.com.au";
						salesRepName = "Belinda Urbani";
					} else if (salesRep == 696160) {
						salesRepEmail = "kerina.helliwell@mailplus.com.au";
						salesRepName = "Kerina Helliwell";
					} else if (salesRep == 668711) {
						salesRepEmail = "lee.russell@mailplus.com.au";
						salesRepName = "Lee Russell";
					} else if (salesRep == 1862659) {
						salesRepEmail = "leonie.feata@mailplus.com.au";
						salesRepName = "Leonie Feata";
					} else if (salesRep == 653718) {
						salesRepEmail = "luke.forbes@mailplus.com.au";
						salesRepName = "Luke Forbes";
					}

					var subject = "";
					var body = "";
					var salesRecordInternalID = null;
					var salesRecord = record.create({
						type: "customrecord_sales",
					});

					salesRecord.setValue({
						fieldId: "custrecord_sales_customer",
						value: customerInternalId,
					});
					salesRecord.setValue({
						fieldId: "custrecord_sales_outcome",
						value: 20,
					});
					salesRecord.setValue({
						fieldId: "custrecord_sales_callbackdate",
						value: date_now,
					});
					salesRecord.setValue({
						fieldId: "custrecord_sales_callbacktime",
						value: time_now,
					});
					if (!isNullorEmpty(campaignid) && (
						leadSource == 97943 ||
						leadSource == 295896 ||
						leadSource == 296333
					)) {
						//Lead Source: Head Office Generated
						//Lead Source: Outsourced - Head Office Generated
						//Lead Source: Outsourced - Head Office Validated

						//Update 2024-08-01T01:54:36.751Z - Lead Entered by HO, the user will need to select the Campaign & Sales Rep from the Prospect Capture Form itself

						salesRecord.setValue({
							fieldId: "custrecord_sales_campaign",
							value: campaignid, //Allocate to the campaign the user has selected from the Prospect Capture Form
						});
						if (leadSource == 97943) {
							var cust_id_link =
								"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
								customerInternalId;
							body =
								"New lead entered into the system. \n Customer Name: " +
								entity_id +
								" " +
								customer_name +
								"\nLink: " +
								cust_id_link;
							subject =
								"Sales Head Office Generated Lead - " +
								entity_id +
								" " +
								customer_name;
						}

					} else if (leadSource == -4) {
						if (!isNullorEmpty(zee_visisted_customer) || brochure_handed_over == 1) {
							salesRecord.setValue({
								fieldId: "custrecord_sales_campaign",
								value: 70, // Franchisee Generated
							});

							subject =
								"Sales HOT Lead - " +
								zee_text +
								" Franchisee Generated - " +
								entity_id +
								" " +
								customer_name;
							var cust_id_link =
								"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
								customerInternalId;
							body =
								"New lead entered into the system by Franchisee. \n Customer Name: " +
								entity_id +
								" " +
								customer_name +
								"\nLink: " +
								cust_id_link +
								"\nFranchisee: " +
								zee_text;

						} else {
							salesRecord.setValue({
								fieldId: "custrecord_sales_campaign",
								value: 90, // Illicium - 202507
							});
						}
					} else if (leadSource == 285297) {
						//Lead Source: Inbound - Head Office Generated

						/*
							Create Sales Record
							Assign to Sales Rep depending on the franchisee
							Assign to Field Sales
							 */

						if (isNullorEmpty(campaignid)) {
							salesRecord.setValue({
								fieldId: "custrecord_sales_campaign",
								value: 62, //Field Sales
							});
						} else {
							salesRecord.setValue({
								fieldId: "custrecord_sales_campaign",
								value: campaignid, //Assign to the campaign selected from the Prospect Capture Page
							});
						}

						subject =
							"Sales Head Office Generated - " +
							entity_id +
							" " +
							customer_name;
						var cust_id_link =
							"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
							customerInternalId;
						body =
							"New lead entered into the system by Head Office. \n Customer Name: " +
							entity_id +
							" " +
							customer_name +
							"\nLink: " +
							cust_id_link +
							"\nFranchisee: " +
							zee_text;
					} else {
						if (isNullorEmpty(campaignid)) {
							salesRecord.setValue({
								fieldId: "custrecord_sales_campaign",
								value: 67, //Digital Lead Campaign
							});
						} else {
							salesRecord.setValue({
								fieldId: "custrecord_sales_campaign",
								value: campaignid, //Assign to campaign selected from the Prospect Capture Paage
							});
						}

						subject =
							"Sales HOT Lead - " + entity_id + " " + customer_name;
						var cust_id_link =
							"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
							customerInternalId;
						body =
							"New lead entered into the system. \n Customer Name: " +
							entity_id +
							" " +
							customer_name +
							"\nLink: " +
							cust_id_link +
							"\nFranchisee: " +
							zee_text;

					}

					salesRecordInternalID = salesRecord.save({
						ignoreMandatoryFields: true,
					});


					var newCustomerRecordId = customerRecord.save({
						ignoreMandatoryFields: true,
					});

					// if (
					// 	leadSource == 97943 ||
					// 	leadSource == 295896 ||
					// 	leadSource == 296333
					// ) {
					// 	//Lead Source: Head Office Generated
					// 	//Lead Source: Outsourced - Head Office Generated
					// 	//Lead Source: Outsourced - Head Office Validated

					// 	//Update 2024-08-01T01:54:36.751Z - Lead Entered by HO, the user will need to select the Campaign & Sales Rep from the Prospect Capture Form itself

					// 	if (!isNullorEmpty(campaignid)) {
					// 		/* 
					// 			Create Sales Record
					// 			Assign to Sales Rep selected in the Prospect Capture Form
					// 			Assign to Campaign selected in the Prospect Capture Form
					// 			 */
					// 		var salesRecord = record.create({
					// 			type: "customrecord_sales",
					// 		});

					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_customer",
					// 			value: customerInternalId,
					// 		});
					// 		// if (leadSource == 295896 || leadSource == 296333) {
					// 		// 	if (isNullorEmpty(lead_customer_type)) {
					// 		// 		salesRecord.setValue({
					// 		// 			fieldId: "custrecord_sales_campaign",
					// 		// 			value: campaignid, //Allocate to the campaign the user has selected from the Prospect Capture Form
					// 		// 		});
					// 		// 	} else if (lead_customer_type == 5) {
					// 		// 		// Service Customer
					// 		// 		salesRecord.setValue({
					// 		// 			fieldId: "custrecord_sales_campaign",
					// 		// 			value: 87, //Allocate to the Call Force - 202501 campaign
					// 		// 		});
					// 		// 	} else if (lead_customer_type == 6) {
					// 		// 		//Product Customer
					// 		// 		salesRecord.setValue({
					// 		// 			fieldId: "custrecord_sales_campaign",
					// 		// 			value: 87, //Allocate to the Call Force - 202501 campaign
					// 		// 		});
					// 		// 	}
					// 		// } else {
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_campaign",
					// 			value: campaignid, //Allocate to the campaign the user has selected from the Prospect Capture Form
					// 		});
					// 		// }

					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_assigned",
					// 			value: salesRep, //Assign to the Sales Rep selected from the Prospect Capture Form
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_outcome",
					// 			value: 20,
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_callbackdate",
					// 			value: date_now,
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_callbacktime",
					// 			value: time_now,
					// 		});

					// 		salesRecordInternalID = salesRecord.save({
					// 			ignoreMandatoryFields: true,
					// 		});

					// 		var cust_id_link =
					// 			"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
					// 			customerInternalId;
					// 		var body =
					// 			"New lead entered into the system. \n Customer Name: " +
					// 			entity_id +
					// 			" " +
					// 			customer_name +
					// 			"\nLink: " +
					// 			cust_id_link;

					// 		//HEAD OFFICE GENERATED
					// 		if (leadSource == 97943) {
					// 			var subject =
					// 				"Sales Head Office Generated Lead - " +
					// 				entity_id +
					// 				" " +
					// 				customer_name;
					// 			email.send({
					// 				author: 112209,
					// 				body: body,
					// 				recipients: salesRep,
					// 				subject: subject,
					// 				cc: [
					// 					"luke.forbes@mailplus.com.au",
					// 					"lee.russell@mailplus.com.au",
					// 				],
					// 				relatedRecords: { entityId: customerInternalId },
					// 			});
					// 		} else if (
					// 			leadSource == 295896 &&
					// 			lead_customer_type == 5 &&
					// 			salesRep != 1874329
					// 		) {
					// 			var subject =
					// 				"Sales Outsourced - Head Office Generated Lead - " +
					// 				entity_id +
					// 				" " +
					// 				customer_name;
					// 			email.send({
					// 				author: 112209,
					// 				body: body,
					// 				recipients: salesRep,
					// 				subject: subject,
					// 				cc: [
					// 					"luke.forbes@mailplus.com.au",
					// 					"lee.russell@mailplus.com.au",
					// 				],
					// 				relatedRecords: { entityId: customerInternalId },
					// 			});
					// 		} else if (
					// 			leadSource == 296333 &&
					// 			lead_customer_type == 5 &&
					// 			salesRep != 1874329
					// 		) {
					// 			var subject =
					// 				"Sales Outsourced - Head Office Validated Lead - " +
					// 				entity_id +
					// 				" " +
					// 				customer_name;
					// 			email.send({
					// 				author: 112209,
					// 				body: body,
					// 				recipients: salesRep,
					// 				subject: subject,
					// 				cc: [
					// 					"luke.forbes@mailplus.com.au",
					// 					"lee.russell@mailplus.com.au",
					// 				],
					// 				relatedRecords: { entityId: customerInternalId },
					// 			});
					// 		}
					// 	}
					// } else if (leadSource == -4) {
					// 	//Lead Source: Franchisee Generated

					// 	/* 
					// 		Create Sales Record
					// 		Assign to Liam depending on the franchisee
					// 		Assign to Franchisee Generated
					// 		 */
					// 	var salesRecord = record.create({
					// 		type: "customrecord_sales",
					// 	});

					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_customer",
					// 		value: customerInternalId,
					// 	});

					// 	if (!isNullorEmpty(zee_visisted_customer) || brochure_handed_over == 1) {
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_assigned",
					// 			value: salesRep, //Assign to Sales Rep Assigned to Franchisee
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_campaign",
					// 			value: 70, // Franchisee Generated
					// 		});
					// 	} else {


					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_campaign",
					// 			value: 90, // Illicium - 202507
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_assigned",
					// 			value: 1917237, //Assign to Illicium X MailPlus
					// 		});
					// 	}

					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_outcome",
					// 		value: 20,
					// 	});
					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_callbackdate",
					// 		value: date_now,
					// 	});
					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_callbacktime",
					// 		value: time_now,
					// 	});

					// 	salesRecordInternalID = salesRecord.save({
					// 		ignoreMandatoryFields: true,
					// 	});

					// 	if (!isNullorEmpty(zee_visisted_customer) || brochure_handed_over == 1) {
					// 		var subject =
					// 			"Sales HOT Lead - " +
					// 			zee_text +
					// 			" Franchisee Generated - " +
					// 			entity_id +
					// 			" " +
					// 			customer_name;
					// 		var cust_id_link =
					// 			"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
					// 			customerInternalId;
					// 		var body =
					// 			"New lead entered into the system by Franchisee. \n Customer Name: " +
					// 			entity_id +
					// 			" " +
					// 			customer_name +
					// 			"\nLink: " +
					// 			cust_id_link +
					// 			"\nFranchisee: " +
					// 			zee_text;

					// 		email.send({
					// 			author: 112209,
					// 			body: body,
					// 			recipients: 1809382,
					// 			subject: subject,
					// 			cc: ["aleyna.harnett@mailplus.com.au"],
					// 			relatedRecords: { entityId: customerInternalId },
					// 		});
					// 	}
					// } else if (leadSource == 285297) {
					// 	//Lead Source: Inbound - Head Office Generated

					// 	/* 
					// 		Create Sales Record
					// 		Assign to Sales Rep depending on the franchisee
					// 		Assign to Field Sales
					// 		 */
					// 	var salesRecord = record.create({
					// 		type: "customrecord_sales",
					// 	});

					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_customer",
					// 		value: customerInternalId,
					// 	});
					// 	if (isNullorEmpty(campaignid)) {
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_campaign",
					// 			value: 62, //Field Sales
					// 		});
					// 	} else {
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_campaign",
					// 			value: campaignid, //Assign to the campaign selected from the Prospect Capture Page
					// 		});
					// 	}

					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_assigned",
					// 		value: salesRep,
					// 	});
					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_outcome",
					// 		value: 20,
					// 	});
					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_callbackdate",
					// 		value: date_now,
					// 	});
					// 	salesRecord.setValue({
					// 		fieldId: "custrecord_sales_callbacktime",
					// 		value: time_now,
					// 	});

					// 	salesRecordInternalID = salesRecord.save({
					// 		ignoreMandatoryFields: true,
					// 	});

					// 	var subject =
					// 		"Sales Head Office Generated - " +
					// 		entity_id +
					// 		" " +
					// 		customer_name;
					// 	var cust_id_link =
					// 		"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
					// 		customerInternalId;
					// 	var body =
					// 		"New lead entered into the system by Head Office. \n Customer Name: " +
					// 		entity_id +
					// 		" " +
					// 		customer_name +
					// 		"\nLink: " +
					// 		cust_id_link +
					// 		"\nFranchisee: " +
					// 		zee_text;

					// 	email.send({
					// 		author: 112209,
					// 		body: body,
					// 		recipients: salesRep,
					// 		subject: subject,
					// 		cc: [
					// 			"luke.forbes@mailplus.com.au",
					// 			"lee.russell@mailplus.com.au",
					// 		],
					// 		relatedRecords: { entityId: customerInternalId },
					// 	});
					// } else {
					// 	if (!isNullorEmpty(campaignid)) {
					// 		/* 
					// 			Create Sales Record
					// 			Assign to Sales Rep depending on the franchisee
					// 			Assign to Digital Lead Campaign 
					// 			 */
					// 		var salesRecord = record.create({
					// 			type: "customrecord_sales",
					// 		});

					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_customer",
					// 			value: customerInternalId,
					// 		});
					// 		if (isNullorEmpty(campaignid)) {
					// 			salesRecord.setValue({
					// 				fieldId: "custrecord_sales_campaign",
					// 				value: 67, //Digital Lead Campaign
					// 			});
					// 		} else {
					// 			salesRecord.setValue({
					// 				fieldId: "custrecord_sales_campaign",
					// 				value: campaignid, //Assign to campaign selected from the Prospect Capture Paage
					// 			});
					// 		}

					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_assigned",
					// 			value: salesRep,
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_outcome",
					// 			value: 20,
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_callbackdate",
					// 			value: date_now,
					// 		});
					// 		salesRecord.setValue({
					// 			fieldId: "custrecord_sales_callbacktime",
					// 			value: time_now,
					// 		});

					// 		salesRecordInternalID = salesRecord.save({
					// 			ignoreMandatoryFields: true,
					// 		});

					// 		var subject =
					// 			"Sales HOT Lead - " + entity_id + " " + customer_name;
					// 		var cust_id_link =
					// 			"https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=" +
					// 			customerInternalId;
					// 		var body =
					// 			"New lead entered into the system. \n Customer Name: " +
					// 			entity_id +
					// 			" " +
					// 			customer_name +
					// 			"\nLink: " +
					// 			cust_id_link +
					// 			"\nFranchisee: " +
					// 			zee_text;

					// 		email.send({
					// 			author: 112209,
					// 			body: body,
					// 			recipients: salesRep,
					// 			subject: subject,
					// 			cc: [
					// 				"luke.forbes@mailplus.com.au",
					// 				"lee.russell@mailplus.com.au",
					// 			],
					// 			relatedRecords: { entityId: customerInternalId },
					// 		});
					// 	}
					// }

					log.audit({
						title: 'customerInternalId',
						details: customerInternalId
					})

					log.audit({
						title: 'salesRecordInternalID',
						details: salesRecordInternalID
					})


					if (role != 1062 && role != 3 && role != 1032) { //If the user creating the lead is not a Sales Rep or System Admin or Administrator
						var leadSalesReppToAssignJSON = {
							"customerId": parseInt(customerInternalId),
							"salesRecordId": parseInt(salesRecordInternalID)
						}

						//!Call Tim's script to assign the lead to a sales rep randomly. 
						var leadSalesRepAssignedJSON = https.get({
							url: 'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=2160&deploy=2&compid=1048144&ns-at=AAEJ7tMQ3VfSfXZtokK6wuyERCw4vIJ8YBmkKwc8nxv2kzikwgg&operation=assignCustomerToSalesRepsWithLeastLeads&requestParams=' + JSON.stringify(leadSalesReppToAssignJSON),
							headers: {
								'Content-Type': 'application/json',
								'Accept': 'application/json',
							}
						});

						log.audit({
							title: 'leadSalesRepAssignedJSON',
							details: leadSalesRepAssignedJSON
						})

						leadSalesRepAssignedJSON = JSON.parse(leadSalesRepAssignedJSON.body);

						log.audit({
							title: 'New Lead Sales Rep Assigned JSON',
							details: leadSalesRepAssignedJSON
						})

						salesRep = leadSalesRepAssignedJSON.internalid;
						var leadSalesRepAssignedName = leadSalesRepAssignedJSON.entityid;
						var leadSalesRepAssignedEmail = leadSalesRepAssignedJSON.email;
					}

					log.audit({
						title: 'salesRep Assigned',
						details: salesRep
					})

					//Update the Sales Record with the assigned sales rep
					var updateSalesRecord = record.load({
						type: 'customrecord_sales',
						id: salesRecordInternalID
					});
					updateSalesRecord.setValue({
						fieldId: 'custrecord_sales_assigned',
						value: parseInt(salesRep)
					});
					lpoMainSubCustomerSalesRecordInternalId = updateSalesRecord.save();


					var newCustomerRecord = record.load({
						type: record.Type.LEAD,
						id: newCustomerRecordId,
						isDynamic: true,
					});
					newCustomerRecord.setValue({
						fieldId: "custentity_mp_toll_salesrep",
						value: salesRep,
					});
					newCustomerRecord.save({ ignoreMandatoryFields: true });


					if (!isNullorEmpty(salesRep) && !isNullorEmpty(body) && !isNullorEmpty(subject)) {
						email.send({
							author: 112209,
							body: body,
							recipients: salesRep,
							subject: subject,
							cc: [
								"luke.forbes@mailplus.com.au",
								"lee.russell@mailplus.com.au",
							],
							relatedRecords: { entityId: customerInternalId },
						});
					}

				}
			}
		}
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
		onRequest: onRequest,
	};
});
