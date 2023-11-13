var customerRecordId;

function pageInit() {

    customerRecordId = nlapiGetFieldValue('custpage_id');

    var cust_rec = nlapiLoadRecord('customer', customerRecordId);

    nlapiSetFieldValue('industry', cust_rec.getFieldValue('custentity_industry_category'));
    nlapiSetFieldValue('franchisee', cust_rec.getFieldValue('partner'));

}

function saveRecord() {

    if (isNullorEmpty(nlapiGetFieldValue('campaign_type'))) {
        alert('Please Enter Value for Campaign');
        return false;
    }

    var old_sales_record_id = nlapiGetFieldValue('sales_record_id');

    var customer_rec = nlapiLoadRecord('customer', customerRecordId);

    customer_status = customer_rec.getFieldValue('entitystatus');
    var partner = customer_rec.getFieldValue('partner');
    if (partner != 435) {
    }

    if (!isNullorEmpty(old_sales_record_id)) {
        var old_sales_record = nlapiLoadRecord('customrecord_sales', old_sales_record_id);
        old_sales_record.setFieldValue('custrecord_sales_deactivated', 'T');
        old_sales_record.setFieldValue('custrecord_sales_completed', 'T');

        nlapiSubmitRecord(old_sales_record);

        if (customer_status != 13) {
            customer_rec.setFieldValue('entitystatus', 60);
            customer_rec.setFieldValue('custentity_date_suspect_reassign', getDate());
        }

    } else {
        if (customer_status == 22) {
            customer_rec.setFieldValue('entitystatus', 6);
        }
    }


    customer_rec.setFieldValue('custentity_industry_category', nlapiGetFieldValue('industry'));
    customer_rec.setFieldValue('partner', nlapiGetFieldValue('franchisee'));

    nlapiSubmitRecord(customer_rec);


    var recordtoCreate = nlapiCreateRecord('customrecord_sales');
    var date2 = new Date();
    var subject = '';
    var body = '';

    var userRole = parseInt(nlapiGetContext().getRole());

    // Set customer, campaign, user, last outcome, callback date
    recordtoCreate.setFieldValue('custrecord_sales_customer', customerRecordId);
    recordtoCreate.setFieldValue('custrecord_sales_campaign', nlapiGetFieldValue('campaign_type'));
    // if(userRole == 1005){
    //     // alert(123);
    //     recordtoCreate.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
    //     nlapiSetFieldValue('salesrep', nlapiGetUser());
    // } else {
    // alert(333);
    recordtoCreate.setFieldValue('custrecord_sales_assigned', nlapiGetFieldValue('sales_rep'));
    nlapiSetFieldValue('salesrep', nlapiGetFieldValue('sales_rep'));
    // }
    // alert(nlapiGetUser());
    recordtoCreate.setFieldValue('custrecord_sales_outcome', 20);
    recordtoCreate.setFieldValue('custrecord_sales_callbackdate', getDate());
    recordtoCreate.setFieldValue('custrecord_sales_callbacktime', nlapiDateToString(date2.addHours(0), 'timeofday'));
    if (nlapiGetFieldValue('campaign_type') == 56) {
        recordtoCreate.setFieldValue('custrecord_sales_followup_stage', 5);
    }

    nlapiSubmitRecord(recordtoCreate);

    return true;
}

function getDate() {
    var date = new Date();
    // if (date.getHours() > 6) {
    //     date = nlapiAddDays(date, 1);
    // }
    date = nlapiDateToString(date);

    return date;
}


Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}