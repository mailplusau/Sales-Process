var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://1048144-sb3.app.netsuite.com';
}

function pageInit(){
}

function saveRecord(){
	//check if the services have been moved
	return true;
}

function onclick_back(){
	var cust_id = nlapiGetFieldValue('custpage_customer_id');
	var url = baseURL + "/app/common/entity/custjob.nl?id=" + cust_id;
    window.location.href = url;
}