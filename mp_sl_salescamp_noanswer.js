function main (request, response)
{
	if (request.getMethod() == "GET")
	{
		var form = nlapiCreateForm('No Answer', true);
		
		form.addField('callnotes', 'longtext', 'Call Notes').setLayoutType('startrow');
		form.addButton('savenoanswer', 'Save', 'submit_NoAnswer()');
		form.setScript('customscript_cs_salescamp_noanswer');
		
		response.writePage(form);
	}
}
