/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-08-26 12:02:57   		Ankith
 *
 * Description: Send Email to Sales Rep notifying 6 Weeks have been completed for the customer since commencement date         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-08-27 17:37:45
 *
 */


function customerLast6Weeks() {

    /**
     * Search: All Customer Records - Last 6 Weeks Commencement Date
     */
    var customerLast6WeeksSearch = nlapiLoadSearch('customer', 'customsearch_customer_last_6_weeks');

    var resultCustomerLast6Weeks = customerLast6WeeksSearch.runSearch();


    resultCustomerLast6Weeks.forEachResult(function(searchResult) {

        var customerInternalId = searchResult.getValue("internalid");
        var customerId = searchResult.getValue("entityid");
        var customerName = searchResult.getValue("companyname");
        var customerZee = searchResult.getValue("partner");
        var customerState = searchResult.getValue("location", "partner", null);
        var commDate = searchResult.getValue("custrecord_comm_date", "CUSTRECORD_CUSTOMER", null);
        var signUpDate = searchResult.getValue("custrecord_comm_date_signup", "CUSTRECORD_CUSTOMER", null);
        var salesRep = searchResult.getValue("custrecord_salesrep", "CUSTRECORD_CUSTOMER", null);

        var customerLink = 'https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=858&deploy=1&compid=1048144&unlayered=T&custparam_params={%22custid%22%3A' + customerInternalId + '%2C%22scriptid%22%3A%22customscript_sl_customer_list%22%2C%22deployid%22%3A%22customdeploy_sl_customer_list%22}&sorts[weekused]=-1';

        var subject = 'MailPlus Service Call & Referral Program'
        var emailBody = 'Dear Account Manager,\n\nPlease review customers 6 weeks MPEX usage. Place a customer service call, offer referral program and obtain a review if possible.\n';

        emailBody += customerLink;

        nlapiSendEmail(112209, salesRep, subject, emailBody, null);

        return true;
    });

}