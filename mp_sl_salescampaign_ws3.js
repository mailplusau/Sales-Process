function main(request, response) {
	if (request.getMethod() == "GET") {
		var searchResults;
		var custId;
		var salesId = request.getParameter('salesid');
		var button = request.getParameter('button');
		if (!isNullorEmpty(salesId)) {
			try {
				custId = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_customer');
				nlapiSubmitField('customrecord_sales', salesId, 'custrecord_sales_inuse', 'T');
			} catch (err) { }
		}
		if (isNullorEmpty(custId)) {
			try {
				searchResults = nlapiSearchRecord('customrecord_sales', 'customsearch_salescamp_callbacks');
			} catch (err) { }
			if (!isNullorEmpty(searchResults)) {
				var recIndex = 0;
				salesId = searchResults[recIndex].getId();
				nlapiSubmitField('customrecord_sales', salesId, 'custrecord_sales_inuse', 'T');
				custId = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_customer');

			} else {
				try {
					searchResults = nlapiSearchRecord('', 'customsearch_salescampaign');
				} catch (err) { }
				if (!isNullorEmpty(searchResults)) {
					if (searchResults.length > 50) {
						var recIndex = randomFromTo(0, 49);
					} else {
						var recIndex = randomFromTo(0, searchResults.length - 1);
					}
					salesId = searchResults[recIndex].getId();
					nlapiSubmitField('customrecord_sales', salesId, 'custrecord_sales_inuse', 'T');
					custId = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_customer');
				} else {
					try {
						searchResults = nlapiSearchRecord('customrecord_sales', 'customsearch_salescamp_noanswers');
					} catch (err) { }
					if (!isNullorEmpty(searchResults)) {
						if (searchResults.length > 50) {
							var recIndex = randomFromTo(0, 49);
						} else {
							var recIndex = randomFromTo(0, searchResults.length - 1);
						}
						salesId = searchResults[recIndex].getId();
						nlapiSubmitField('customrecord_sales', salesId, 'custrecord_sales_inuse', 'T');
						custId = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_customer');
					}
				}
			}
		}

		if (!isNullorEmpty(custId)) {
			var recCustomer = nlapiLoadRecord('customer', custId);
			var customerFranchise = nlapiLoadRecord('partner', recCustomer.getFieldValue('partner'));
			var salesCampaign = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_campaign', true);
			var salesCampaign_id = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_campaign');
			var lastOutcome = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_outcome');
			var phone_call_made = nlapiLookupField('customrecord_sales', salesId, 'custrecord_sales_call_made');
			var form = nlapiCreateForm('Telemarketing - Sales Campaign');


			if (parseInt(lastOutcome) == 5) {
				form.addField('custpage_callbackalert', 'inlinehtml').setDefaultValue('<script type="text/javascript">alert("CALLBACK")</script>');
			} else if (parseInt(lastOutcome) == 4) {
				form.addField('custpage_callbackalert', 'inlinehtml').setDefaultValue('<script type="text/javascript">alert("CALLBACK (SEND INFO)")</script>');
			}
			form.setScript('customscript_cs_salescampaign');
			form.addFieldGroup('custtab_main', 'Main').setShowBorder(false).setCollapsible(false);
			// form.addField('custpage_custId', 'text', 'Customer ID', null, 'custtab_main').setDisplayType('hidden').setDefaultValue(custId);
			form.addField('custpage_salesrecord', 'select', 'Sales Record', 'customrecord_sales').setDisplayType('hidden').setDefaultValue(salesId);
			form.addField('custpage_phone_call_made', 'text', 'Phone Call Made').setDisplayType('hidden').setDefaultValue(phone_call_made);
			form.addField('custpage_sales_campaign_id', 'text', 'Sales Campaign ID').setDisplayType('hidden').setDefaultValue(salesCampaign_id);
			form.addField('custpage_button', 'text', 'Button').setDisplayType('hidden').setDefaultValue(button);
			form.addField('custpage_customer', 'select', 'Prospect/Customer', 'customer', 'custtab_main').setDisplayType('inline').setDefaultValue(custId);
			form.addField('custpage_customerstatus', 'select', 'Status', 'customerstatus', 'custtab_main').setLayoutType('startrow').setDisplayType('inline').setDefaultValue(recCustomer.getFieldValue('entitystatus'));
			form.addField('custpage_salescampaign', 'text', 'Sales Campaign', null, 'custtab_main').setDisplayType('inline').setDefaultValue(salesCampaign);
			form.addField('custpage_leadsource', 'select', 'Lead Source', 'Campaign', 'custtab_main').setLayoutType('startrow').setDisplayType('inline').setDefaultValue(recCustomer.getFieldValue('leadsource'));
			if (!isNullorEmpty(recCustomer.getFieldValue('custentity_service_times'))) form.addField('custpage_servicetype', 'text', 'Service Type', null, 'custtab_main').setLayoutType('endrow').setDisplayType('inline').setDefaultValue(recCustomer.getFieldText('custentity_service_times'));
			form.addField('custpage_phone1', 'phone', 'Phone 1', null, 'custtab_main').setLayoutType('startrow', 'startcol').setDefaultValue(recCustomer.getFieldValue('phone'));
			form.addField('custpage_phone1_dial', 'checkbox', ' ', null, 'custtab_main').setLayoutType('endrow');
			form.addField('custpage_franchisee', 'select', 'Franchisee', 'partner', 'custtab_main').setDisplayType('inline').setDefaultValue(recCustomer.getFieldValue('partner'));
			form.addField('custpage_industry', 'select', 'Industry', 'customlist_industry_category', 'custtab_main').setDefaultValue(recCustomer.getFieldValue('custentity_industry_category'));
			form.addField('custpage_phone2', 'phone', 'Phone 2', null, 'custtab_main').setLayoutType('startrow', 'startcol').setDisplayType('inline').setDefaultValue(recCustomer.getFieldValue('altphone'));
			form.addField('custpage_phone2_dial', 'checkbox', ' ', null, 'custtab_main').setLayoutType('endrow');
			form.addField('custpage_mobile', 'phone', 'Mobile', null, 'custtab_main').setDisplayType('inline').setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('mobilephone'));
			form.addField('custpage_mobile_dial', 'checkbox', ' ', null, 'custtab_main').setLayoutType('endrow');
			form.addFieldGroup('custtab_contacts', 'Contacts').setCollapsible(false);
			form.addField('custbreak_1', 'inlinehtml', null, null, 'custtab_contacts').setPadding(1).setLayoutType('startrow', 'startcol').setDefaultValue('<input name="editcontacts" type="button" value="Add/Edit\nContacts" align="right" style="font-size:11pt; width:120px; display:block; vertical-align:middle; margin:0 auto;" onclick="popContacts()">');
			form.addField('custhead_maincontacts', 'inlinehtml', null, null, 'custtab_contacts').setLayoutType('startrow', 'startcol').setDefaultValue('<div style="font-size: 12px; color: rgb(255, 207, 102); border-bottom: 1px solid rgb(204, 204, 204); font-weight: 600; white-space: nowrap; margin: 0pt 0pt 2px;">Main Contacts</div>');
			var arrContactFields = new Array();
			arrContactFields[0] = form.addField('custpage_decisionmaker', 'text', 'Decision Maker', null, 'custtab_contacts').setDisplayType('inline').setLayoutType('startrow');
			arrContactFields[1] = form.addField('custpage_servicecontact', 'text', 'Service Contact', null, 'custtab_contacts').setDisplayType('inline').setLayoutType('startrow');
			arrContactFields[2] = form.addField('custpage_accountscontact', 'text', 'Accounts Payable', null, 'custtab_contacts').setDisplayType('inline').setLayoutType('startrow');
			form.addField('custhead_othercontacts', 'inlinehtml', null, null, 'custtab_contacts').setLayoutType('startrow', 'startcol').setDefaultValue('<div style="font-size: 12px; color: rgb(255, 207, 102); border-bottom: 1px solid rgb(204, 204, 204); font-weight: 600; white-space: nowrap; margin: 0pt 0pt 2px;">Other Contacts</div>');
			arrContactFields[3] = form.addField('custpage_othercontacts', 'longtext', ' ', null, 'custtab_contacts').setDisplayType('inline').setLayoutType('startrow');
			form.addFieldGroup('custtab_survey', 'Survey Info').setCollapsible(false);
			var arrSurveyFields = new Array();
			var fil_po = [];
			if (salesCampaign_id != 55) {
				fil_po[fil_po.length] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'is', nlapiLoadRecord('partner', recCustomer.getFieldValue('partner')).getFieldValue('location'));
			} else {
				fil_po[fil_po.length] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'is', 3);
			}
			// fil_po[fil_po.length] = new nlobjSearchFilter('custrecord_ap_lodgement_site_state', null, 'is', customerFranchise.getFieldValue('location'));


			var col_po = [];
			col_po[col_po.length] = new nlobjSearchColumn('internalid');
			col_po[col_po.length] = new nlobjSearchColumn('name').setSort();
			col_po[col_po.length] = new nlobjSearchColumn('custrecord_ap_lodgement_postcode');

			var poSearch = nlapiSearchRecord('customrecord_ap_lodgment_location', null, fil_po, col_po);

			var display_type = 'normal';

			form.addField('custhead_gensurvey', 'inlinehtml', null, null, 'custtab_survey').setLayoutType('startrow', 'startcol');


			//AP Question 1
			if (recCustomer.getFieldValue('custentity_ap_mail_parcel') == 1 || recCustomer.getFieldValue('custentity_ap_mail_parcel') == 2) {
				arrSurveyFields[0] = form.addField('custpage_question_1', 'select', 'Using AusPost for Mail & Parcel?', 'customlist_yes_no_unsure', 'custtab_survey').setDisplayType(display_type).setMandatory(true).setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_mail_parcel'));
			} else {
				arrSurveyFields[0] = form.addField('custpage_question_1', 'select', 'Using AusPost for Mail & Parcel?', 'customlist_yes_no_unsure', 'custtab_survey').setMandatory(true).setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_mail_parcel'));
			}


			//AP Question 2
			if (recCustomer.getFieldValue('custentity_ap_outlet') == 1 || recCustomer.getFieldValue('custentity_ap_outlet') == 2) {
				arrSurveyFields[1] = form.addField('custpage_question_2', 'select', 'Using AusPost Outlet?', 'customlist_yes_no_unsure', 'custtab_survey').setDisplayType(display_type).setLayoutType('startrow').setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_outlet'));
			} else {
				arrSurveyFields[1] = form.addField('custpage_question_2', 'select', 'Using AusPost Outlet?', 'customlist_yes_no_unsure', 'custtab_survey').setLayoutType('startrow').setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_outlet'));
			}


			//AP Question 3
			if (recCustomer.getFieldValue('custentity_ap_lpo_customer') == 1 || recCustomer.getFieldValue('custentity_ap_lpo_customer') == 2) {
				if ((recCustomer.getFieldValue('custentity_ap_outlet') == 1)) {
					arrSurveyFields[2] = form.addField('custpage_question_3', 'select', 'Is this Auspost outlet a LPO?', 'customlist_yes_no_unsure', 'custtab_survey').setDisplayType(display_type).setMandatory(true).setLayoutType('startrow').setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_lpo_customer'));
				} else {
					arrSurveyFields[2] = form.addField('custpage_question_3', 'select', 'Is this Auspost outlet a LPO?', 'customlist_yes_no_unsure', 'custtab_survey').setLayoutType('startrow').setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_lpo_customer'));
				}
			} else {
				arrSurveyFields[2] = form.addField('custpage_question_3', 'select', 'Is this Auspost outlet a LPO?', 'customlist_yes_no_unsure', 'custtab_survey').setLayoutType('startrow').setLayoutType('startrow').setDefaultValue(recCustomer.getFieldValue('custentity_ap_lpo_customer'));
			}


			//AP Question 4
			// if(recCustomer.getFieldValue('custrecord_ap_lodgement_postcode') != ''){
			// 	if(recCustomer.getFieldValue('custentity_ap_lpo_customer') == 1)
			// 	{
			arrSurveyFields[3] = form.addField('custpage_question_4', 'select', 'AusPost Outlet', null, 'custtab_survey').setLayoutType('startrow').setMandatory(true);
			arrSurveyFields[3].addSelectOption(recCustomer.getFieldValue('custentity_ap_location'), recCustomer.getFieldText('custentity_ap_location'));
			for (i = 0; i < poSearch.length; i++) {
				arrSurveyFields[3].addSelectOption(poSearch[i].getValue('internalid'), poSearch[i].getValue('name') + ' | ' + poSearch[i].getValue('custrecord_ap_lodgement_postcode'));
			}
			// 	} 
			// }


			// arrSurveyFields[1] = form.addField('custpage_survey_date', 'date', 'Survey Date', null, 'custtab_survey').setLayoutType('startrow').setDisplayType('inline').setLayoutType('startrow');
			// arrSurveyFields[2] = form.addField('custpage_survey_contact', 'text', 'Contact Surveyed', null, 'custtab_survey').setLayoutType('startrow').setLayoutType('midrow').setDisplayType('inline');
			// arrSurveyFields[3] = form.addField('custpage_survey_notes', 'longtext', 'Survey Notes', null, 'custtab_survey').setDisplaySize(75, 2).setLayoutType('startrow').setDisplayType('readonly');
			// form.addField('custhead_mailsurvey', 'inlinehtml', null, null, 'custtab_survey').setLayoutType('startrow', 'startcol').setDefaultValue('<div style="font-size: 12px; color: rgb(102, 153, 128); border-bottom: 1px solid rgb(204, 204, 204); font-weight: 600; white-space: nowrap; margin: 0pt 0pt 2px;">Survey Responses - Mail</div>');
			// arrSurveyFields[4] = form.addField('custpage_survey_volumein', 'select', 'Volume - In', 'customlist_ps_volume', 'custtab_survey').setLayoutType('startrow').setDisplayType('inline');
			// arrSurveyFields[5] = form.addField('custpage_survey_volumeout', 'select', 'Out', 'customlist_ps_volume', 'custtab_survey').setLayoutType('endrow').setDisplayType('inline');
			// arrSurveyFields[6] = form.addField('custpage_survey_frequencyin', 'select', 'Frequency - In', 'customlist_ps_frequency', 'custtab_survey').setLayoutType('startrow').setDisplayType('inline');
			// arrSurveyFields[7] = form.addField('custpage_survey_frequencyout', 'select', 'Out', 'customlist_ps_frequency', 'custtab_survey').setLayoutType('endrow').setDisplayType('inline');
			// arrSurveyFields[8] = form.addField('custpage_survey_providerin', 'select', 'Provider - In', 'customlist_ps_provider', 'custtab_survey').setLayoutType('startrow').setDisplayType('inline');
			// arrSurveyFields[9] = form.addField('custpage_survey_providerout', 'select', 'Out', 'customlist_ps_provider', 'custtab_survey').setLayoutType('endrow').setDisplayType('inline');
			// form.addField('custhead_parcelsurvey', 'inlinehtml', null, null, 'custtab_survey').setLayoutType('startrow', 'startcol').setDefaultValue('<div style="font-size: 12px; color: rgb(102, 153, 128); border-bottom: 1px solid rgb(204, 204, 204); font-weight: 600; white-space: nowrap; margin: 0pt 0pt 2px;">Survey Responses - Parcels/Satchels</div>');
			// arrSurveyFields[10] = form.addField('custpage_survey_parcelvol', 'select', 'Parcels - Volume', 'customlist_ps_parcels', 'custtab_survey').setLayoutType('startrow').setDisplayType('inline');
			// arrSurveyFields[11] = form.addField('custpage_survey_parcelprovider', 'select', '&nbsp;&nbsp;&nbsp;Provider', 'customlist_ps_parcelproviders', 'custtab_survey').setLayoutType('endrow').setDisplayType('inline');
			// arrSurveyFields[12] = form.addField('custpage_survey_satchelvol', 'select', 'Satchels - Volume', 'customlist_ps_parcels', 'custtab_survey').setLayoutType('startrow').setDisplayType('inline');
			// arrSurveyFields[13] = form.addField('custpage_survey_satchelprovider', 'select', '&nbsp;&nbsp;&nbsp;Provider', 'customlist_ps_parcelproviders', 'custtab_survey').setLayoutType('endrow').setDisplayType('inline');
			form.addFieldGroup('custtab_addresses', 'Addresses').setCollapsible(false);
			form.addField('custbreak_address', 'inlinehtml', null, null, 'custtab_addresses').setPadding(1).setLayoutType('startrow', 'startcol').setDefaultValue('<input name="editaddresses" type="button" value="Add/Edit\nAddresses" align="right" style="font-size:11pt; width:120px; display:block; vertical-align:middle; margin:0 auto;" onclick="onclick_Address()">');
			form.addField('custhead_addresses', 'inlinehtml', null, null, 'custtab_addresses').setLayoutType('startrow', 'startcol').setDefaultValue('<div style="font-size: 12px; color: rgb(224, 133, 133); border-bottom: 1px solid rgb(224, 133, 133); font-weight: 600; white-space: nowrap; margin: 0pt 0pt 2px;">Primary Addresses</div>');
			var fldSiteSummary = form.addField('custpage_addsummary_site', 'longtext', 'Site Address', null, 'custtab_addresses').setDisplayType('inline').setLayoutType('startrow');
			var fldBillSummary = form.addField('custpage_addsummary_billing', 'longtext', 'Billing Address', null, 'custtab_addresses').setDisplayType('inline').setLayoutType('startrow');
			form.addField('custhead_postaladdresses', 'inlinehtml', null, null, 'custtab_addresses').setLayoutType('startrow', 'startcol').setDefaultValue('<div style="font-size: 12px; color: rgb(224, 133, 133); border-bottom: 1px solid rgb(224, 133, 133); font-weight: 600; white-space: nowrap; margin: 0pt 0pt 2px;">Postal Addresses</div>');
			var fldResSummary = form.addField('custpage_addsummary_residential', 'longtext', ' ', null, 'custtab_addresses').setDisplayType('inline').setLayoutType('startrow');
			form.addFieldGroup('custtab_notes', 'Sales Notes').setCollapsible(false);
			form.addField('custlabel_newnote', 'label', 'Add Note', null, 'custtab_notes').setLayoutType('startrow', 'startcol');
			var fldNotes = form.addField('custpage_notes_summary', 'longtext', ' ', null, 'custtab_notes').setLayoutType('endrow').setDisplayType('readonly').setDisplaySize(480, 4);

			form.addField('custpage_zeememo', 'text', 'Franchisee Memo', null, 'custtab_notes').setLayoutType('startrow').setDisplayType('inline').setDefaultValue(recCustomer.getFieldValue('custentity_mp_toll_zeevisit_memo'));

			form.addFieldGroup('custtab_outcomes', 'Outcomes').setCollapsible(false);
			var html = '<div><table><tr>';
			if (salesCampaign_id == 55) {
				if (phone_call_made == 'T') {
					html += '<td width="250"><input name="noanswer" type="button" value="No Answer" style="font-size:11pt; font-weight:bold; color:red; width:150px" onclick="onclick_NoAnswer()"></td>';
				}
			} else {
				html += '<td width="250"><input name="noanswer" type="button" value="No Answer" style="font-size:11pt; font-weight:bold; color:red; width:150px" onclick="onclick_NoAnswer()"></td>';
			}
			if (salesCampaign_id != 55) {
				html += '<td width="250"><input name="disconnected" type="button" value="Disconnected" style="font-size:11pt; font-weight:bold; color:red; width:150px" onclick="onclick_Disconnected()"></td>';
				html += '<td width="250"><input name="nosale" type="button" value="No Sale" style="font-size:11pt; font-weight:bold; color:red; width:150px" onclick="onclick_NoSale()"></td></tr>';
			}
			html += '<tr><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td></tr>';
			if (salesCampaign_id == 55 && phone_call_made == 'T') {
				html += '<tr><td width="250"><input name="callback" type="button" value="Call Back" style="font-size:11pt; font-weight:bold; color:blue; width:150px" onclick="onclick_Callback()"></td>';
			}

			if (salesCampaign_id != 55) {
				html += '<tr><td width="250"><input name="callback" type="button" value="Call Back" style="font-size:11pt; font-weight:bold; color:blue; width:150px" onclick="onclick_Callback()"></td>';
			}

			if (salesCampaign_id != 55) {
				html += '<td width="250"><input name="refer" type="button" value="Refer" style="font-size:11pt; font-weight:bold; color:blue; width:150px" onclick="onclick_Refer()"></td></tr>';
			}
			html += '<tr><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td></tr>';
			if (salesCampaign_id != 55) {
				html += '<tr><td width="250"><input name="sendinfo" type="button" value="Send Info" style="font-size:11pt; font-weight:bold; color:blue; width:150px" onclick="onclick_SendInfo();"></td>';
				html += '<td width="250"><input name="sendquote" type="button" value="Send Quote" style="font-size:11pt; font-weight:bold; color:orange; width:150px" onclick="onclick_SendQuote()"></td>';
				html += '<td width="250"><input name="sendforms" type="button" value="Send Forms" style="font-size:11pt; font-weight:bold; color:orange; width:150px" onclick="onclick_SendForms()"></td></tr>';
				html += '<tr><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td><td width="250" style="font-size:6pt">&nbsp;</td></tr>';
			} else {
				if (phone_call_made == 'T') {
					html += '<tr><td width="250"><input name="complete" type="button" value="Complete" style="font-size:11pt; font-weight:bold; color:blue; width:150px" onclick="submit_Complete()"></td></tr>';
					html += '<tr><td width="250"><input name="rejected" type="button" value="Rejected" style="font-size:11pt; font-weight:bold; color:red; width:150px" onclick="onclick_Reject()"></td>';
				}
			}
			// html += '<tr><td width="250"><input name="trial" type="button" value="Free Trial" style="font-size:11pt; font-weight:bold; color:green; width:150px" onclick="onclick_FreeTrial()"></td>';
			// html += '<td width="250"><input name="signed" type="button" value="Signed" style="font-size:11pt; font-weight:bold; color:green; width:150px" onclick="onclick_Signed()"></td>';
			html += '</tr></table></div>';
			form.addField('custpage_buttons', 'inlinehtml', null, null, 'custtab_outcomes').setPadding(1).setDefaultValue(html);
			setContactFieldValues(custId, arrContactFields);
			// setSurveyFieldValues(custId, arrSurveyFields);
			setNotesFieldValue(custId, fldNotes, recCustomer);
			setAddressSummaryFields(recCustomer, fldSiteSummary, fldBillSummary, fldResSummary);
			var fldOutcome = form.addField('custpage_outcome', 'select', 'Outcome').setDisplayType('hidden');
			fldOutcome.addSelectOption('', '');
			fldOutcome.addSelectOption('noanswer', 'noanswer');
			fldOutcome.addSelectOption('disconnected', 'disconnected');
			fldOutcome.addSelectOption('donotcall', 'donotcall');
			fldOutcome.addSelectOption('nosale', 'nosale');
			fldOutcome.addSelectOption('sendinfo', 'sendinfo');
			fldOutcome.addSelectOption('sendforms', 'sendforms');
			fldOutcome.addSelectOption('callback', 'callback');
			fldOutcome.addSelectOption('refer', 'refer');
			fldOutcome.addSelectOption('trial', 'trial');
			fldOutcome.addSelectOption('signed', 'signed');
			form.addField('custpage_nosalereason', 'select', 'No Sale Reason', 'customlist_nosalereason').setDisplayType('hidden');
			form.addField('custpage_callbackdate', 'date', ' ').setDisplayType('hidden');
			form.addField('custpage_callbacktime', 'timeofday', ' ').setDisplayType('hidden');

			form.addField('custpage_rejectreason', 'select', 'customlist_sales_infoincomplete_reason').setDisplayType('hidden');
			form.addField('custpage_rejectnotes', 'longtext', 'Reject Notes').setDisplayType('hidden');

			var fldAssign = form.addField('custpage_referto', 'select', 'Refer').setDisplayType('hidden');
			fldAssign.addSelectOption('', ' ');
			fldAssign.addSelectOption(48711, 'Adam Warren');
			fldAssign.addSelectOption(571, 'Jeremy Gadd');
			fldAssign.addSelectOption(48710, 'Lindsey Fenton');
			form.addField('custpage_refernotes', 'longtext', 'Refer Notes').setDisplayType('hidden');
			form.addField('custpage_callnotes', 'longtext', 'Call Notes').setDisplayType('hidden');
			form.addField('custpage_startdate', 'date', 'Start Date').setDisplayType('hidden');
			var fldTrial = form.addField('custpage_trialperiod', 'select', 'Trial Period').setDisplayType('hidden');
			fldTrial.addSelectOption('', '');
			fldTrial.addSelectOption(0, 'No Trial');
			fldTrial.addSelectOption(1, '1 week');
			fldTrial.addSelectOption(2, '2 weeks');
			fldTrial.addSelectOption(3, '3 weeks');
			fldTrial.addSelectOption(4, '4 weeks');
			form.addSubmitButton('SUBMIT123');
			response.writePage(form);
		}
	} else {
		var custId = request.getParameter('custpage_customer');
		var salesId = request.getParameter('custpage_salesrecord');
		var btn = request.getParameter('custpage_button');
		var phone1 = request.getParameter('custpage_phone1');
		var outcome = request.getParameter('custpage_outcome');
		var nosalereason = request.getParameter('custpage_nosalereason');
		var callbackdate = request.getParameter('custpage_callbackdate');
		var callbacktime = request.getParameter('custpage_callbacktime');
		var referto = request.getParameter('custpage_referto');
		var notes = request.getParameter('custpage_refernotes');
		var callnotes = request.getParameter('custpage_callnotes');
		var startdate = request.getParameter('custpage_startdate');
		var trialperiod = request.getParameter('custpage_trialperiod');
		var commreg = request.getParameter('custpage_commreg');
		var industry = request.getParameter('custpage_industry');
		var decison_maker = request.getParameter('custpage_decisionmaker');
		var site_address = request.getParameter('custpage_addsummary_site');
		var sales_campaign = request.getParameter('custpage_sales_campaign_id');

		var reject_reason = request.getParameter('custpage_rejectreason');
		var reject_notes = request.getParameter('custpage_rejectnotes');

		nlapiLogExecution('debug', '1. Variables Loaded');

		var recCustomer = nlapiLoadRecord('customer', custId);

		var customerStatus = recCustomer.getFieldValue('entitystatus');

		var recSales = nlapiLoadRecord('customrecord_sales', salesId);
		var sales_campaign_record = nlapiLoadRecord('customrecord_salescampaign', sales_campaign);
		var sales_campaign_type = sales_campaign_record.getFieldValue('custrecord_salescampaign_recordtype');
		nlapiLogExecution('DEBUG', 'sales_campaign_type', sales_campaign_type);
		var sales_campaign_name = sales_campaign_record.getFieldValue('name');
		nlapiLogExecution('DEBUG', 'sales_campaign_name', sales_campaign_name);

		nlapiLogExecution('debug', '2. Records Loaded', 'Customer & Sales');

		recCustomer.setFieldValue('phone', phone1);
		recCustomer.setFieldValue('custentity_industry_category', industry);

		var phonecall = nlapiCreateRecord('phonecall');
		phonecall.setFieldValue('assigned', recCustomer.getFieldValue('partner'));
		phonecall.setFieldValue('custevent_organiser', nlapiGetUser());
		phonecall.setFieldValue('startdate', getDate());
		phonecall.setFieldValue('company', custId);
		phonecall.setFieldText('status', 'Completed');
		phonecall.setFieldValue('custevent_call_type', 2);

		nlapiLogExecution('debug', '3. Phone call created');

		if (outcome == 'nosale') {
			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 21);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - No Sale');
			} else {
				phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - No Sale');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 16);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_completedate', getDate());
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 10);
			recSales.setFieldValue('custrecord_sales_nosalereason', nosalereason);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
		} else if (outcome == 'noanswer') {
			if (sales_campaign == 55) {

				recCustomer.setFieldValue('entitystatus', 20);
				phonecall.setFieldValue('title', 'Prospecting Call - GPO - No Answer');

				if (!isNullorEmpty(decison_maker)) {
					recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
				}
				if (!isNullorEmpty(site_address)) {
					recSales.setFieldValue('custrecord_sales_streetaddress_collected', 'T');
				}

			} else {
				if (sales_campaign_type != 1) {
					recCustomer.setFieldValue('entitystatus', 35);
					phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - No Answer');
				} else {
					phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - No Answer');
				}

			}



			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 6);

			recSales.setFieldValue('custrecord_sales_completed', "F");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_callbackdate', nlapiDateToString(nlapiAddDays(nlapiStringToDate(getDate()), 5)));
			recSales.setFieldValue('custrecord_sales_callbacktime', '10:00 AM');
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 7);
			recSales.setFieldValue('custrecord_sales_attempt', parseInt(recSales.getFieldValue('custrecord_sales_attempt')) + 1);

			if (parseInt(recSales.getFieldValue('custrecord_sales_attempt')) > 2) {
				recSales.setFieldValue('custrecord_sales_outcome', 12);
				recSales.setFieldValue('custrecord_sales_completed', "T");
				if (sales_campaign_type != 1) {
					recCustomer.setFieldValue('entitystatus', 36);
				}
				recSales.setFieldValue('custrecord_sales_callbackdate', '');
				recSales.setFieldValue('custrecord_sales_callbacktime', '');
			}


		} else if (outcome == 'disconnected') {
			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 33);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Disconnected');
			} else {
				phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' -  Disconnected');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 3);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_completedate', getDate());
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 8);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
		} else if (outcome == 'donotcall') {
			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 9);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Do Not Call');
			} else {
				phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Do Not Call');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 4);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_completedate', getDate());
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 9);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
		} else if (outcome == 'callback') {
			if (sales_campaign == 55) {

				recCustomer.setFieldValue('entitystatus', 30);

				phonecall.setFieldValue('title', 'Prospecting Call - GPO - Callback');

				if (!isNullorEmpty(decison_maker)) {
					recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
				}
				if (!isNullorEmpty(site_address)) {
					recSales.setFieldValue('custrecord_sales_streetaddress_collected', 'T');
				}

			} else {
				if (sales_campaign_type != 1) {
					recCustomer.setFieldValue('entitystatus', 8);
					phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Callback');
				} else {
					phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Callback');
				}

			}



			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 17);

			recSales.setFieldValue('custrecord_sales_completed', "F");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
			recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 5);
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

			nlapiLogExecution('debug', '4. Callback Details entered');
		} else if (outcome == 'complete') {

			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 42);
				phonecall.setFieldValue('title', 'Prospecting - ' + sales_campaign_name + ' - Complete');
			} else {
				phonecall.setFieldValue('title', 'X Sale - ' + sales_campaign_name + ' - Complete');
			}

			if (!isNullorEmpty(decison_maker)) {
				recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
			}
			if (!isNullorEmpty(site_address)) {
				recSales.setFieldValue('custrecord_sales_streetaddress_collected', 'T');
			}

			recSales.setFieldValue('custrecord_sales_outcome', 16);



			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 17);

			recSales.setFieldValue('custrecord_sales_completed', "F");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());

			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

			nlapiLogExecution('debug', '4. Callback Details entered');
		} else if (outcome == 'reject') {

			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 9);
				phonecall.setFieldValue('title', 'Prospecting Call - GPO - Reject');
			} else {
				phonecall.setFieldValue('title', 'X Sale - ' + sales_campaign_name + ' - Reject');
			}


			phonecall.setFieldValue('message', reject_notes);
			phonecall.setFieldValue('custevent_call_outcome', 16);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_completedate', getDate());
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 17);
			recSales.setFieldValue('custrecord_sales_infoincomplete_reason', reject_reason);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

			nlapiLogExecution('debug', '4. Callback Details entered');
		} else if (outcome == 'sendinfo') {

			if (sales_campaign_type != 11) {
				recCustomer.setFieldValue('entitystatus', 19);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Info Sent');
			} else {
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Info Sent');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 17);

			recSales.setFieldValue('custrecord_sales_completed', "F");
			recSales.setFieldValue('custrecord_sales_infosent', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
			recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 4);
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

		} else if (outcome == 'sendforms') {

			if (sales_campaign_type != 11) {
				recCustomer.setFieldValue('entitystatus', 51);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Forms Sent');
			} else {
				phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Forms Sent');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 24);

			recSales.setFieldValue('custrecord_sales_completed', "F");
			recSales.setFieldValue('custrecord_sales_formsent', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
			recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 14);
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

		} else if (outcome == 'sendquote') {

			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 50);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Quote Sent');
			} else {
				phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Quote Sent');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 23);

			recSales.setFieldValue('custrecord_sales_completed', "F");
			recSales.setFieldValue('custrecord_sales_quotesent', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
			recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 15);
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

		} else if (outcome == 'refer') {

			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 29);
				phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Referred');
			} else {
				phonecall.setFieldValue('title', 'X Sales - ' + sales_campaign_name + ' - Referred');
			}


			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 17);

			var task = nlapiCreateRecord('task');
			task.setFieldValue('title', 'Existing Customer Sales Call - Refer');
			task.setFieldValue('assigned', referto);
			task.setFieldValue('company', custId);
			task.setFieldValue('sendemail', 'T');
			task.setFieldValue('message', notes);
			task.setFieldText('status', 'Not Started');
			nlapiSubmitRecord(task);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 6);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
		} else if (outcome == 'signed') {


			recCustomer.setFieldValue('entitystatus', 13);
			recCustomer.setFieldValue('salesrep', nlapiGetUser());

			phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Customer Signed');
			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 15);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 2);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
		} else if (outcome == 'trial') {


			if (sales_campaign_type != 1) {
				recCustomer.setFieldValue('entitystatus', 32);
			}
			recCustomer.setFieldValue('salesrep', nlapiGetUser());

			phonecall.setFieldValue('title', 'Sales - ' + sales_campaign_name + ' - Free Trial Accepted');
			phonecall.setFieldValue('message', callnotes);
			phonecall.setFieldValue('custevent_call_outcome', 9);

			recSales.setFieldValue('custrecord_sales_completed', "T");
			recSales.setFieldValue('custrecord_sales_inuse', "F");
			recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
			recSales.setFieldValue('custrecord_sales_outcome', 1);
			recSales.setFieldValue('custrecord_sales_callbackdate', '');
			recSales.setFieldValue('custrecord_sales_callbacktime', '');
			recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
			if (!isNullorEmpty(trialperiod) && parseInt(trialperiod) > 0) {
				recSales.setFieldValue('custrecord_sales_day0call', startdate);
				recSales.setFieldValue('custrecord_sales_followup_stage', 1);
				if (parseInt(trialperiod) == 1 || parseInt(trialperiod) == 2) {
					recSales.setFieldValue('custrecord_sales_day25call', nlapiDateToString(nlapiAddDays(nlapiStringToDate(startdate), (parseInt(trialperiod) * 7) - 3)));
				} else {
					recSales.setFieldValue('custrecord_sales_day14call', nlapiDateToString(nlapiAddDays(nlapiStringToDate(startdate), 13)));
					recSales.setFieldValue('custrecord_sales_day25call', nlapiDateToString(nlapiAddDays(nlapiStringToDate(startdate), (parseInt(trialperiod) * 7) - 3)));
				}
			}
		}

		nlapiLogExecution('debug', '5. Ready to submit records');

		nlapiSubmitRecord(recCustomer);
		nlapiLogExecution('debug', '6. Submitted Customer');
		nlapiSubmitRecord(phonecall);
		nlapiLogExecution('debug', '7. Submitted Phone call');
		nlapiSubmitRecord(recSales);
		nlapiLogExecution('debug', '8. Submitted sales record');

		if (btn == 'T') {
			response.sendRedirect('RECORD', 'customer', custId, false);
		} else {
			nlapiSetRedirectURL('SUITELET', 'customscript_sl_salescampaign', 'customdeploy_sl_salescampaign');
		}

	}
}


function setContactFieldValues(custId, arrContactFields) {
	var other = '';

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('company', null, 'is', custId);
	filters[1] = new nlobjSearchFilter('isinactive', null, 'is', "F");

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('entityid');
	columns[1] = new nlobjSearchColumn('salutation');
	columns[2] = new nlobjSearchColumn('firstname');
	columns[3] = new nlobjSearchColumn('lastname');
	columns[4] = new nlobjSearchColumn('title');
	columns[5] = new nlobjSearchColumn('contactrole');

	var contactSearch = nlapiSearchRecord('contact', null, filters, columns);

	var decisionmaker = false;
	var servicecontact = false;
	var accountspayable = false;
	var othercontacts = false;

	for (i = 0; !isNullorEmpty(contactSearch) && i < contactSearch.length; i++) {
		if (parseInt(contactSearch[i].getValue(columns[5])) == -30 && !decisionmaker) {
			arrContactFields[0].setDefaultValue(contactSearch[i].getValue(columns[1]) + ' ' + contactSearch[i].getValue(columns[2]) + ' ' + contactSearch[i].getValue(columns[3]));
			decisionmaker = true;
		} else if (parseInt(contactSearch[i].getValue(columns[5])) == -10 && !servicecontact) {
			arrContactFields[1].setDefaultValue(contactSearch[i].getValue(columns[1]) + ' ' + contactSearch[i].getValue(columns[2]) + ' ' + contactSearch[i].getValue(columns[3]));
			servicecontact = true;
		} else if (parseInt(contactSearch[i].getValue(columns[5])) == 1 && !accountspayable) {
			arrContactFields[2].setDefaultValue(contactSearch[i].getValue(columns[1]) + ' ' + contactSearch[i].getValue(columns[2]) + ' ' + contactSearch[i].getValue(columns[3]));
			accountspayable = true;
		} else {
			other += contactSearch[i].getValue(columns[1]) + ' ' + contactSearch[i].getValue(columns[2]) + ' ' + contactSearch[i].getValue(columns[3]) + '\n';
			othercontacts = true;
		}
	}
	if (othercontacts == true) {
		arrContactFields[3].setDefaultValue(other);
	}
}

function setSurveyFieldValues(custId, arrSurveyFields) {
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_ps_customer', null, 'anyof', custId);

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('custrecord_ps_classification');
	columns[1] = new nlobjSearchColumn('custrecord_ps_date');
	columns[2] = new nlobjSearchColumn('custrecord_ps_contact');
	columns[3] = new nlobjSearchColumn('custrecord_ps_notes');
	columns[4] = new nlobjSearchColumn('custrecord_ps_volumein');
	columns[5] = new nlobjSearchColumn('custrecord_ps_volumeout');
	columns[6] = new nlobjSearchColumn('custrecord_ps_freqin');
	columns[7] = new nlobjSearchColumn('custrecord_ps_freqout');
	columns[8] = new nlobjSearchColumn('custrecord_ps_provin');
	columns[9] = new nlobjSearchColumn('custrecord_ps_provout');
	columns[10] = new nlobjSearchColumn('custrecord_ps_parcels');
	columns[11] = new nlobjSearchColumn('custrecord_ps_parcel_provider');
	columns[12] = new nlobjSearchColumn('custrecord_ps_satchels');
	columns[13] = new nlobjSearchColumn('custrecord_ps_satchel_provider');

	var surveySearch = nlapiSearchRecord('customrecord_prospecting_survey', null, filters, columns);

	if (!isNullorEmpty(surveySearch)) {
		var lIndex = surveySearch.length - 1;
		arrSurveyFields[0].setDefaultValue(surveySearch[lIndex].getValue(columns[0]));
		arrSurveyFields[1].setDefaultValue(surveySearch[lIndex].getValue(columns[1]));
		arrSurveyFields[2].setDefaultValue(surveySearch[lIndex].getValue(columns[2]));
		arrSurveyFields[3].setDefaultValue(surveySearch[lIndex].getValue(columns[3]));
		arrSurveyFields[4].setDefaultValue(surveySearch[lIndex].getValue(columns[4]));
		arrSurveyFields[5].setDefaultValue(surveySearch[lIndex].getValue(columns[5]));
		arrSurveyFields[6].setDefaultValue(surveySearch[lIndex].getValue(columns[6]));
		arrSurveyFields[7].setDefaultValue(surveySearch[lIndex].getValue(columns[7]));
		arrSurveyFields[8].setDefaultValue(surveySearch[lIndex].getValue(columns[8]));
		arrSurveyFields[9].setDefaultValue(surveySearch[lIndex].getValue(columns[9]));
		arrSurveyFields[10].setDefaultValue(surveySearch[lIndex].getValue(columns[10]));
		arrSurveyFields[11].setDefaultValue(surveySearch[lIndex].getValue(columns[11]));
		arrSurveyFields[12].setDefaultValue(surveySearch[lIndex].getValue(columns[12]));
		arrSurveyFields[13].setDefaultValue(surveySearch[lIndex].getValue(columns[13]));
	}

}

function setAddressSummaryFields(recCustomer, fldSiteSummary, fldBillSummary, fldResSummary) {
	var siteText = '';
	var billText = '';
	var resText = '';

	for (x = 1; x <= recCustomer.getLineItemCount('addressbook'); x++) {
		if (recCustomer.getLineItemValue('addressbook', 'defaultshipping', x) == "T") {
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', x))) siteText = recCustomer.getLineItemValue('addressbook', 'addr1', x) + '<br>';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', x))) siteText += recCustomer.getLineItemValue('addressbook', 'addr2', x) + '<br>';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', x))) siteText += recCustomer.getLineItemValue('addressbook', 'city', x) + ' ';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', x))) siteText += recCustomer.getLineItemValue('addressbook', 'state', x) + ' ';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', x))) siteText += recCustomer.getLineItemValue('addressbook', 'zip', x);
		}
		if (recCustomer.getLineItemValue('addressbook', 'defaultbilling', x) == "T") {
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', x))) billText = recCustomer.getLineItemValue('addressbook', 'addr1', x) + '<br>';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', x))) billText += recCustomer.getLineItemValue('addressbook', 'addr2', x) + '<br>';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', x))) billText += recCustomer.getLineItemValue('addressbook', 'city', x) + ' ';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', x))) billText += recCustomer.getLineItemValue('addressbook', 'state', x) + ' ';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', x))) billText += recCustomer.getLineItemValue('addressbook', 'zip', x);
		}
		if (recCustomer.getLineItemValue('addressbook', 'isresidential', x) == "T") {
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr1', x))) resText += recCustomer.getLineItemValue('addressbook', 'addr1', x) + '<br>';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'addr2', x))) resText += recCustomer.getLineItemValue('addressbook', 'addr2', x) + '<br>';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'city', x))) resText += recCustomer.getLineItemValue('addressbook', 'city', x) + ' ';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'state', x))) resText += recCustomer.getLineItemValue('addressbook', 'state', x) + ' ';
			if (!isNullorEmpty(recCustomer.getLineItemValue('addressbook', 'zip', x))) resText += recCustomer.getLineItemValue('addressbook', 'zip', x) + '<br><br>';
		}
	}
	fldSiteSummary.setDefaultValue(siteText);
	fldBillSummary.setDefaultValue(billText);
	fldResSummary.setDefaultValue(resText);
}


function setNotesFieldValue(custId, fldNotes, recCustomer) {
	var notesVal = '';

	if (!isNullorEmpty(recCustomer.getFieldValue('custentity_customer_pricing_notes'))) {
		notesVal += '<<< CUSTOMER PRICING NOTES >>> ' + recCustomer.getFieldValue('custentity_customer_pricing_notes') + '\n'
	}

	var filters = new Array();
	filters[0] = new nlobjSearchFilter('company', null, 'anyof', custId);

	var columns = new Array();
	columns[0] = new nlobjSearchColumn('createddate');
	columns[1] = new nlobjSearchColumn('completeddate');
	columns[2] = new nlobjSearchColumn('type');
	columns[3] = new nlobjSearchColumn('assigned');
	columns[4] = new nlobjSearchColumn('title');
	columns[5] = new nlobjSearchColumn('message');
	columns[6] = new nlobjSearchColumn('custevent_organiser');

	var notesSearch = nlapiSearchRecord('activity', 'customsearch_salescamp_activity', filters, columns);

	if (!isNullorEmpty(notesSearch)) {
		for (x = 0; x < notesSearch.length; x++) {
			notesVal += notesSearch[x].getValue(columns[0]) + ' - ';
			notesVal += notesSearch[x].getValue(columns[1]) + ' - ';
			//notesVal += notesSearch[x].getText(columns[3]) + ' - ';
			notesVal += notesSearch[x].getText(columns[6]) + ' - ';
			notesVal += notesSearch[x].getValue(columns[4]) + ' - ';
			notesVal += notesSearch[x].getValue(columns[5]).replace(/(\r\n|\n|\r)/gm, ", ") + '\n';
		}
		fldNotes.setDefaultValue(notesVal);
	}
}

function getDate() {
	var date = new Date();

	// NetSUite updated the date to Australian Standard Time so not required to Add one
	if (date.getHours() > 6) {
		date = nlapiAddDays(date, 1);
	}
	date = nlapiDateToString(date);

	return date;
}

function randomFromTo(from, to) {
	return Math.floor(Math.random() * (to - from + 1) + from);
}