/**
 * Module Description
 * 
 * NSVersion    Date                    Author         
 * 1.00         2018-04-10 14:47:39         Ankith 
 *
 * Remarks:         
 * 
 * @Last Modified by:   mailplusar
 * @Last Modified time: 2018-04-11 09:11:31
 *
 */
var ctx = nlapiGetContext();

function main(request, response) {
    if (request.getMethod() == 'GET') {

        var customerRecordId = request.getParameter('recid');
        var pdt = request.getParameter('pdt');
        var cust = request.getParameter('cust');
        var sales_record_id = request.getParameter('sales_record_id');

        var userRole = parseInt(nlapiGetRole());

        var form = nlapiCreateForm('Select Campaign Type');

        var customerRecord = nlapiLoadRecord('customer', customerRecordId);

        var customerStatus = customerRecord.getFieldValue('entitystatus');
        var source = customerRecord.getFieldValue('leadsource');
        var partner = customerRecord.getFieldValue('partner');

        var salesRepId = nlapiGetUser()
        if (!isNullorEmpty(sales_record_id)) {
            if (partner != 435) {
                var partnerRecord = nlapiLoadRecord('partner', partner);
                salesRepId = partnerRecord.getFieldValue('custentity_sales_rep_assigned');
            }
        }

        form.addField('custpage_id', 'text', 'ID').setDisplayType('hidden').setDefaultValue(customerRecordId);

        var searched_salescampaign = nlapiLoadSearch('customrecord_salescampaign', 'customsearch_sales_button_campaign');

        var filters = new Array();

        if (customerStatus == 13) {
            filters[filters.length] = new nlobjSearchFilter('custrecord_salescampaign_recordtype', null, 'is', 1);
        } else {
            filters[filters.length] = new nlobjSearchFilter('custrecord_salescampaign_recordtype', null, 'is', 2);
        }


        form.addField('subject', 'text', 'subject').setDisplayType('hidden').setDefaultValue('New Sales Record');
        form.addField('body', 'text', 'body').setDisplayType('hidden').setDefaultValue('New Sales Record');
        form.addField('sales_record_id', 'text', 'sales_record_id').setDisplayType('hidden').setDefaultValue(sales_record_id);

        form.addField('salesrep', 'text', 'salesrep').setDisplayType('hidden');

        searched_salescampaign.addFilters(filters);

        var resultSet = searched_salescampaign.runSearch();

        var salesCampaignResult = resultSet.getResults(0, 1);

        // if (userRole != 1005) {
        form.addField('sales_rep', 'select', 'Sales Rep', 'employee').setLayoutType('startrow').setMandatory(true).setDefaultValue(salesRepId);
        // }

        form.addField('franchisee', 'select', 'Franchisee', 'partner').setLayoutType('startrow').setMandatory(true);
        form.addField('industry', 'select', 'Industry', 'customlist_industry_category').setLayoutType('startrow').setMandatory(true);
        var sales_campagin_select = form.addField('campaign_type', 'select', 'Sales Campaign').setMandatory(true);

        if (source == 281559 || source == 282051 || source == 282083 || source == 282085) {
            sales_campagin_select.addSelectOption(69, 'LPO');
        } else if (source == -4) {
            sales_campagin_select.addSelectOption(70, 'Franchisee Generated');
        }
        var i;

        // if (!isNullorEmpty(sales_campaign)) {
        resultSet.forEachResult(function (searchResult) {
            sales_campagin_select.addSelectOption(searchResult.getValue('internalid'), searchResult.getValue('name'));
            return true;
        });
        // }


        form.addSubmitButton("Submit");
        form.setScript('customscript_cl_sales_campaign_popup');
        response.writePage(form);

    } else {

        var subject = request.getParameter('subject');
        var body = request.getParameter('body');
        var custId = request.getParameter('custpage_id');
        var salesrep = request.getParameter('salesrep');

        var customer_record = nlapiLoadRecord('customer', custId);
        var status = customer_record.getFieldValue('entitystatus');
        var leadSource = customer_record.getFieldText('leadsource');


        if (nlapiGetUser() == 1777309) {
            var cust_id_link = 'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + custId;

            body = 'New lead qualified by the Sales Coordinator. New sales record has been created. \n You have been assigned a lead. \n Link: ' + cust_id_link;

            nlapiSendEmail(112209, salesrep, 'Sales Coordinator Qualified HOT Lead', body, ['luke.forbes@mailplus.com.au']);
        } else if (ctx.getUser() != 396479 && status == 57) {
            var cust_id_link = 'https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' + custId;

            body = 'New sales record has been created. \n You have been assigned a lead. Please respond in an hour. \n Link: ' + cust_id_link;

            nlapiSendEmail(112209, salesrep, leadSource + ' - Sales Lead', body, ['luke.forbes@mailplus.com.au']);
        }


        response.sendRedirect('RECORD', 'customer', custId, false);

    }


}



Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}