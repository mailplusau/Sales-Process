/**
 * Module Description
 * 
 * NSVersion    Date            			Author         
 * 1.00       	2020-08-26 12:02:57   		Ankith
 *
 * Description: Send Email to Sales Rep notifying 6 Weeks have been completed for the customer since commencement date         
 * 
 * @Last Modified by:   Ankith
 * @Last Modified time: 2020-08-26 15:16:09
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

        


        return true;
    });

}