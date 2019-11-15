var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
	baseURL = 'https://system.sandbox.netsuite.com';
}

var event = null;


function pageInit()
{	
	addEvent(window, 'unload', OnPageUnloading, false);
	
	restyleElementByClass("fgroup_title", "Contacts", "color", "rgb(255, 176, 0)");
	restyleElementByClass("fgroup_title", "Contacts", "borderBottom", "2px solid rgb(255, 176, 0)");
	restyleElementByClass("fgroup_title", "Contacts", "fontSize", "18px");
	
	restyleElementByClass("fgroup_title", "Survey Info", "color", "rgb(71, 107, 90)");
	restyleElementByClass("fgroup_title", "Survey Info", "borderBottom", "2px solid rgb(71, 107, 90)");
	restyleElementByClass("fgroup_title", "Survey Info", "fontSize", "18px");
	
	restyleElementByClass("fgroup_title", "Addresses", "color", "rgb(209, 71, 71)");
	restyleElementByClass("fgroup_title", "Addresses", "borderBottom", "2px solid rgb(209, 71, 71)");
	restyleElementByClass("fgroup_title", "Addresses", "fontSize", "18px");
	
	restyleElementByClass("fgroup_title", "Sales Notes", "color", "rgb(90, 111, 143)");
	restyleElementByClass("fgroup_title", "Sales Notes", "borderBottom", "2px solid rgb(90, 111, 143)");
	restyleElementByClass("fgroup_title", "Sales Notes", "fontSize", "18px");
	
	restyleElementByClass("fgroup_title", "Outcomes", "display", "none");
	
	var addNote = document.getElementById("custlabel_newnote_fs_lbl");
	addNote.innerHTML = '&nbsp;&nbsp;<input type="button" name="custpage_button_addnote" value="Add Note" onclick="popNewNote()">&nbsp;&nbsp;';
	
	var dial1 = '<div><img src="https://system.na2.netsuite.com/core/media/media.nl?id=46718&c=1048144&h=5136dcd5bedf602826e5" onclick="NLDial(nlapiGetFieldValue(' + "'custpage_phone1'))" + '" value="Dial"></div>';
	var dial2 = '<div><img src="https://system.na2.netsuite.com/core/media/media.nl?id=46718&c=1048144&h=5136dcd5bedf602826e5" onclick="NLDial(nlapiGetFieldValue(' + "'custpage_phone2'))" + '" value="Dial"></div>';
	var dial3 = '<div><img src="https://system.na2.netsuite.com/core/media/media.nl?id=46718&c=1048144&h=5136dcd5bedf602826e5" onclick="NLDial(nlapiGetFieldValue(' + "'custpage_mobile'))" + '" value="Dial"></div>';
	
	var dialCheck = document.getElementById("custpage_phone1_dial_fs");
	dialCheck.innerHTML = dial1;
	
	if (!isNullorEmpty(nlapiGetFieldValue('custpage_phone2')))
	{
		dialCheck = document.getElementById("custpage_phone2_dial_fs");
		dialCheck.innerHTML = dial2;
	}
	else
	{
		dialCheck = document.getElementById("custpage_phone2_dial_fs");
		dialCheck.innerHTML = '';
	}
	
	if (!isNullorEmpty(nlapiGetFieldValue('custpage_mobile'))) 
	{
		dialCheck = document.getElementById("custpage_mobile_dial_fs");
		dialCheck.innerHTML = dial3;
	}
	else
	{
		dialCheck = document.getElementById("custpage_mobile_dial_fs");
		dialCheck.innerHTML = '';
	}

	if(nlapiGetFieldValue('custpage_question_1') == 2){
		nlapiSetFieldDisplay('custpage_question_2', false);
		nlapiSetFieldDisplay('custpage_question_3', false);
		nlapiSetFieldDisplay('custpage_question_4', false);

		nlapiSetFieldValue('custpage_question_2', 2);
		nlapiSetFieldValue('custpage_question_3', 2);
		//nlapiSetFieldValue('custpage_question_4', null);
	}

	if(nlapiGetFieldValue('custpage_question_2') == 2){
		nlapiSetFieldDisplay('custpage_question_3', false);
		nlapiSetFieldDisplay('custpage_question_4', false);

		nlapiSetFieldValue('custpage_question_3', 2);
		//nlapiSetFieldValue('custpage_question_4', null);
	}
	
	document.getElementById('tr_submitter').style.display="none";
	document.getElementById('tr_secondarysubmitter').style.display="none";
}

document.getElementById("custpage_phone1_dial_fs").onclick = function() {

	window.close();

	var sales_record = nlapiLoadRecord('customrecord_sales', nlapiGetFieldValue('custpage_salesrecord'));

	sales_record.setFieldValue('custrecord_sales_call_made', 'T');

	nlapiSubmitRecord(sales_record);

	var upload_url = baseURL + nlapiResolveURL('SUITELET', 'customscript_sl_salescampaign', 'customdeploy_sl_salescampaign') + '&salesid=' + nlapiGetFieldValue('custpage_salesrecord') + '&button=T';
    window.open(upload_url);

};

function clientFieldChanged(type, name, linenum){

	 if (name == 'custpage_question_1') {
	 	if (!isNullorEmpty(nlapiGetFieldValue(name))) {
	 		if(nlapiGetFieldValue(name) == 3){
	 			nlapiSetFieldDisplay('custpage_question_2', true);
	 			nlapiSetFieldDisplay('custpage_question_3', true);
	 			nlapiSetFieldDisplay('custpage_question_4', true);
	 			alert('USING AUSPOST FOR MAIL & PARCEL? Cannot be set to unsure. Please Select Yes / No');
	 			return false;
	 		} else if(nlapiGetFieldValue(name) == 2){
	 			nlapiSetFieldDisplay('custpage_question_2', false);
	 			nlapiSetFieldDisplay('custpage_question_3', false);
	 			nlapiSetFieldDisplay('custpage_question_4', false);

	 			nlapiSetFieldValue('custpage_question_2', 2);
	 			nlapiSetFieldValue('custpage_question_3', 2);
	 			//nlapiSetFieldValue('custpage_question_4', undefined);
	 		} else {
	 			nlapiSetFieldDisplay('custpage_question_2', true);
	 			if(nlapiGetFieldValue('custpage_question_2') == 2){
					nlapiSetFieldDisplay('custpage_question_3', false);
					nlapiSetFieldDisplay('custpage_question_4', false);

					nlapiSetFieldValue('custpage_question_3', 2);
					//nlapiSetFieldValue('custpage_question_4', undefined);
				}
				else if(nlapiGetFieldValue('custpage_question_2') == 1){
					nlapiSetFieldDisplay('custpage_question_3', true);
					nlapiSetFieldDisplay('custpage_question_4', true);

					nlapiSetFieldValue('custpage_question_3', 2);
					//nlapiSetFieldValue('custpage_question_4', undefined);
				} else {
		 			nlapiSetFieldDisplay('custpage_question_3', true);
		 			nlapiSetFieldDisplay('custpage_question_4', true);
	 			}
	 		}
	 	}

	 }
	 if (name == 'custpage_question_2') {
	 	if (!isNullorEmpty(nlapiGetFieldValue(name))) {
	 		if(nlapiGetFieldValue(name) == 3){
	 			nlapiSetFieldDisplay('custpage_question_3', true);
	 			nlapiSetFieldDisplay('custpage_question_4', true);
	 			alert('USING AUSPOST OUTLET?? Cannot be set to unsure. Please Select Yes / No');
	 			return false;
	 		} else if(nlapiGetFieldValue(name) == 2){
	 			nlapiSetFieldDisplay('custpage_question_3', false);
	 			nlapiSetFieldDisplay('custpage_question_4', false);

	 			nlapiSetFieldValue('custpage_question_3', 2);
	 			//nlapiSetFieldValue('custpage_question_4', null);
	 		} else {
	 			nlapiSetFieldDisplay('custpage_question_3', true);
	 			nlapiSetFieldDisplay('custpage_question_4', true);
	 		}
	 	}

	 }
	 if (name == 'custpage_question_3') {
	 	if (!isNullorEmpty(nlapiGetFieldValue(name))) {
	 		if(nlapiGetFieldValue(name) == 3){
	 			alert('AUSPOST LPO OUTLET? Cannot be set to unsure. Please Select Yes / No');
	 			return false;
	 		}
	 	}

	 }
}

function restyleElementByClass(theClass, innerHTML, styleElement, styleValue)
{
	var allHTMLTags = new Array();
	//Create Array of All HTML Tags
	var allHTMLTags=document.getElementsByTagName("*");
	
	//Loop through all tags using a for loop
	for (i=0; i<allHTMLTags.length; i++) 
	{
		//Get all tags with the specified class name.
		if (allHTMLTags[i].className==theClass) 
		{
			if (allHTMLTags[i].innerHTML == innerHTML || innerHTML == null)
			{
				if (styleElement == "color")
				{
					allHTMLTags[i].style.color=styleValue;
				}
				else if (styleElement == "borderBottom")
				{
					allHTMLTags[i].style.borderBottom=styleValue;
				}
				else if (styleElement == "fontSize")
				{
					allHTMLTags[i].style.fontSize=styleValue;
				}
				else if (styleElement == "display")
				{
					allHTMLTags[i].style.display=styleValue;
				}
			}
		}
	}
}

function fieldChanged(type, name, linenum)
{
	return true;
}

function popContacts()
{
	if (checkindustry()) {	
		var custid = nlapiGetFieldValue('custpage_customer');
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_editcontacts', 'customdeploy_sl_salescamp_editcontacts') + '&custid=' + custid;
		//var url = "https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=122&deploy=1&custid=" + custid;
		window.open(url, "Window", "height=400,width=800,modal=yes,alwaysRaised=yes");
	}
}

function popNewNote()
{
	if (checkindustry()) {
		var custid = nlapiGetFieldValue('custpage_customer');
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_newnote', 'customdeploy_sl_salescamp_newnote') + '&custid=' + custid;
		//var url = "https://system.na2.netsuite.com/app/site/hosting/scriptlet.nl?script=127&deploy=1&custid=" + custid;
		window.open(url, "Window", "height=230,width=250,modal=yes,alwaysRaised=yes,location=0,toolbar=0");
	}
}

function contactsEdit(dm, dmid, sc, scid, ap, apid, other)
{	
	if (checkindustry()) {
		nlapiSetFieldValue('custpage_decisionmaker', dm);
		nlapiSetFieldValue('custpage_servicecontact', sc);
		nlapiSetFieldValue('custpage_accountscontact', ap);
		nlapiSetFieldValue('custpage_othercontacts', other);
	}
}

function updateNotes(title, note)
{
	if (checkindustry()) {
		var oldNotes = nlapiGetFieldValue('custpage_notes_summary');
		var newNotes = getDate() + " - " + getDate() + " - " + title + " - " + note + "\n" + oldNotes;
		nlapiSetFieldValue('custpage_notes_summary', newNotes);
	}
}

function getDate()
{
	var date = new Date();
	if (date.getHours() > 6)
	{
		date = nlapiAddDays(date, 1);
	}
	date = nlapiDateToString(date);
	
	return date;
}

function checkindustry() {
	if (isNullorEmpty(nlapiGetFieldValue('custpage_industry'))) {
		alert ('Please select an industry');
		return false;
	} else if (nlapiGetFieldValue('custpage_industry') == 'OTHER SERVICES' || nlapiGetFieldValue('custpage_industry') == 19){
		alert ('Please select a meaningful industry');
		return false;
	}
	else return true;
}

function checkphone() {
	if (isNullorEmpty(nlapiGetFieldValue('custpage_phone1'))) {
		alert ('Please Enter Phone Number');
		return false;
	} 
	else return true;
}

function onclick_NoAnswer()
{
	if (checkindustry() && checkphone()) {


		event = 'noanswer'

		var result = updateCustomerRecord(event);
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_noanswer', 'customdeploy_sl_salescamp_noanswer');
		window.open(url,"Window", "height=300,width=300,modal=yes,alwaysRaised=yes,location=0,toolbar=0");
		
		/*if (confirm('Outcome: No Answer\nPress OK to continue.'))
		{
			nlapiSetFieldValue('custpage_outcome', 'noanswer');
			document.getElementById('submitter').click();
		}*/
	}
}

function submit_NoAnswer(callnotes)
{
	nlapiSetFieldValue('custpage_outcome', 'noanswer');
	nlapiSetFieldValue('custpage_callnotes', callnotes);
	document.getElementById('submitter').click();
}

function onclick_Disconnected()
{
	if (checkindustry() && checkphone()){
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		if (confirm('Outcome: Disconnected\nPress OK to continue.'))
		{
			nlapiSetFieldValue('custpage_outcome', 'disconnected');
			document.getElementById('submitter').click();
		}
	}
}

function onclick_DoNotCall()
{
	if (checkindustry() && checkphone()) {	
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var notes = prompt('Outcome: Do Not Call\n\nEnter call notes and press OK to continue.');
		
		if (notes != null)
		{
			nlapiSetFieldValue('custpage_outcome', 'donotcall');
			nlapiSetFieldValue('custpage_callnotes', notes);
			document.getElementById('submitter').click();
		}
	}
}

function submit_NoSale(reason, callnotes)
{
	nlapiSetFieldValue('custpage_outcome', 'nosale');
	nlapiSetFieldValue('custpage_nosalereason', reason);
	nlapiSetFieldValue('custpage_callnotes', callnotes);
	document.getElementById('submitter').click();
}

function onclick_NoSale()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		if (checkindustry()) {
			var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_nosale', 'customdeploy_sl_salescamp_nosale');
			window.open(url,"Window", "height=300,width=420,modal=yes,alwaysRaised=yes,location=0,toolbar=0");
		}
	}
}

function submit_Callback(date, time, callnotes)
{
	if (isNullorEmpty(time))
	{
		time = "10:00 AM";
	}
	
	nlapiSetFieldValue('custpage_outcome', 'callback');
	nlapiSetFieldValue('custpage_callbackdate', date);
	nlapiSetFieldValue('custpage_callbacktime', time);
	nlapiSetFieldValue('custpage_callnotes', callnotes);
	document.getElementById('submitter').click();
}

function submit_Reject(reason, callnotes)
{

	nlapiSetFieldValue('custpage_outcome', 'reject');
	nlapiSetFieldValue('custpage_rejectreason', reason);
	nlapiSetFieldValue('custpage_rejectnotes', callnotes);
	document.getElementById('submitter').click();
}

function onclick_Callback()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_callback', 'customdeploy_sl_salescamp_callback');
		window.open(url,"Window", "height=240,width=320,modal=yes,alwaysRaised=yes,location=0,toolbar=0");
	}
}

function onclick_Reject()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_sales_campaign_reject', 'customdeploy_sl_sales_campaign_reject');
		window.open(url,"Window", "height=240,width=320,modal=yes,alwaysRaised=yes,location=0,toolbar=0");
	}
}


function onclick_Refer()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_refer', 'customdeploy_sl_salescamp_refer');
		window.open(url,"Window", "height=210,width=230,modal=yes,alwaysRaised=yes,location=0,toolbar=0");
	}
}


function submit_Refer(assign, notes)
{
	nlapiSetFieldValue('custpage_outcome', 'refer');
	nlapiSetFieldValue('custpage_referto', assign);
	nlapiSetFieldValue('custpage_refernotes', notes);
	nlapiSetFieldValue('custpage_callnotes', notes);
	document.getElementById('submitter').click();
}

function submit_Complete()
{
	nlapiSetFieldValue('custpage_outcome', 'complete');
	
	document.getElementById('submitter').click();
}


function submit_Sale (commreg, outcome, startdate, trialperiod)
{
	nlapiSetFieldValue('custpage_startdate', startdate);
	nlapiSetFieldValue('custpage_trialperiod', trialperiod);
	nlapiSetFieldValue('custpage_commreg', commreg);
	nlapiSetFieldValue('custpage_outcome', outcome);
	document.getElementById('submitter').click();
}

function onclick_Signed()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_sale', 'customdeploy_sl_salescamp_sale') + '&custid=' + nlapiGetFieldValue('custpage_customer');
		window.open(url, "Window", "height=750,width=650,modal=yes,alwaysRaised=yes");
	}
}

function onclick_FreeTrial()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_sale', 'customdeploy_sl_salescamp_sale') + '&custid=' + nlapiGetFieldValue('custpage_customer') + '&trial=yes';
		window.open(url, "Window", "height=750,width=650,modal=yes,alwaysRaised=yes");
	}
}

function onclick_Address()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_editaddress', 'customdeploy_sl_salescamp_editaddress') + '&custid=' + nlapiGetFieldValue('custpage_customer');
		window.open(url, "Window", "height=550,width=800,modal=yes,alwaysRaised=yes");
	}
}

function submit_Address(siteAddress, billAddress, postalAddress)
{
	nlapiSetFieldValue('custpage_addsummary_site', siteAddress);
	nlapiSetFieldValue('custpage_addsummary_billing', billAddress);
	nlapiSetFieldValue('custpage_addsummary_residential', postalAddress);
}

function onclick_SendInfo()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_sendinfo', 'customdeploy_sl_salescamp_sendinfo') + '&custid=' + nlapiGetFieldValue('custpage_customer');
		window.open(url, "Window", "height=910,width=850,modal=yes,alwaysRaised=yes");
	}
}

function onclick_SendForms()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_sendforms', 'customdeploy_sl_salescamp_sendforms') + '&custid=' + nlapiGetFieldValue('custpage_customer');
		window.open(url, "Window", "height=680,width=640,modal=yes,alwaysRaised=yes");
	}
	
}

function onclick_SendQuote() {
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_sendquote', 'customdeploy_sl_salescamp_sendquote') + '&custid=' + nlapiGetFieldValue('custpage_customer');
		window.open(url, "Window", "height=680,width=640,modal=yes,alwaysRaised=yes");
	}
	
}

function onclick_ProductSale()
{
	if (checkindustry() && checkphone()) {
		var result = updateCustomerRecord();
		if(result == false){
			return false;
		}
		var url = baseURL + nlapiResolveURL('suitelet', 'customscript_sl_salescamp_satchelorder', 'customdeploy_sl_salescamp_satchelorder') + '&custid=' + nlapiGetFieldValue('custpage_customer');
		window.open(url, "Window", "height=250,width=250,modal=yes,alwaysRaised=yes");
	}
}

function submit_ProductSale(callnotes)
{
	nlapiSetFieldValue('custpage_outcome', 'satchelonly');
	nlapiSetFieldValue('custpage_callnotes', callnotes);
	document.getElementById('submitter').click();
}

function submit_SendInfo(date, time, callnotes)
{
	nlapiSetFieldValue('custpage_outcome', 'sendinfo');
	nlapiSetFieldValue('custpage_callbackdate', date);
	nlapiSetFieldValue('custpage_callbacktime', time);
	nlapiSetFieldValue('custpage_callnotes', callnotes);
	document.getElementById('submitter').click();
}

function submit_SendForms(outcome, date, time, callnotes)
{
	nlapiSetFieldValue('custpage_outcome', outcome);
	nlapiSetFieldValue('custpage_callbackdate', date);
	nlapiSetFieldValue('custpage_callbacktime', time);
	nlapiSetFieldValue('custpage_callnotes', callnotes);
	document.getElementById('submitter').click();
}

function addEvent(elm, evType, fn, useCapture)
{
    var ret = 0;
    
    if (elm.addEventListener)
        ret = elm.addEventListener(evType, fn, useCapture);
    else if (elm.attachEvent)
        ret = elm.attachEvent('on' + evType, fn);
    else
        elm['on' + evType] = fn;
    
    return ret;
}

function OnPageUnloading()
{
    nlapiSubmitField('customrecord_sales', nlapiGetFieldValue('custpage_salesrecord'), 'custrecord_sales_inuse', 'F');
} 

function updateCustomerRecord(call_center_event)
{
	var recCustomer = nlapiLoadRecord('customer', nlapiGetFieldValue('custpage_customer'));
	recCustomer.setFieldValue('custentity_industry_category', nlapiGetFieldValue('custpage_industry'));
	recCustomer.setFieldValue('phone', nlapiGetFieldValue('custpage_phone1'));


	if(call_center_event == 'noanswer'){
		if(isNullorEmpty(nlapiGetFieldValue('custpage_question_1'))){
		alert('Please select value for USING AUSPOST FOR MAIL & PARCEL? ');
	 	return false;
		}
		recCustomer.setFieldValue('custentity_ap_mail_parcel', nlapiGetFieldValue('custpage_question_1'));
		if(isNullorEmpty(nlapiGetFieldValue('custpage_question_2'))){
			alert('Please select value for USING AUSPOST OUTLET? ');
		 	return false;
		}
	    recCustomer.setFieldValue('custentity_ap_outlet', nlapiGetFieldValue('custpage_question_2'));
	    if(nlapiGetFieldValue('custpage_question_2') == 1){
		    if(isNullorEmpty(nlapiGetFieldValue('custpage_question_3'))){
				alert('Please select value for AUSPOST LPO OUTLET? ');
			 	return false;
			}
		    recCustomer.setFieldValue('custentity_ap_lpo_customer', nlapiGetFieldValue('custpage_question_3'));
		    if(nlapiGetFieldValue('custpage_question_4') === "undefined"){
				alert('Please select value for AUSPOST OUTLET');
			 	return false;
			}
		    recCustomer.setFieldValue('custentity_ap_location', nlapiGetFieldValue('custpage_question_4'));
		}
	}
	
        
	nlapiSubmitRecord(recCustomer);
} 