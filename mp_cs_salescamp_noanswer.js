function pageInit()
{
	window.onbeforeunload = '';
}

function submit_NoAnswer()
{
	window.opener.submit_NoAnswer(nlapiGetFieldValue('callnotes'));
	window.close();
}
