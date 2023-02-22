function main(request, response) {
    var customerRecordId = request.getParameter('recid');
    var pdt = request.getParameter('pdt');
    var recordtoCreate = nlapiCreateRecord('customrecord_sales');
    var date2 = new Date();
    var subject = '';
    var body = '';

    if (pdt == 'T') {
        recordtoCreate.setFieldValue('custrecord_sales_campaign', 50);
        subject = 'New Product Sales Record';
        body = 'New Product Sales Record Created';
    } else {
        recordtoCreate.setFieldValue('custrecord_sales_campaign', 48);
        subject = 'New Sales Record';
        body = 'New Sales Record Created';
    }

    // Set customer, campaign, user, last outcome, callback date
    recordtoCreate.setFieldValue('custrecord_sales_customer', customerRecordId);
    recordtoCreate.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
    recordtoCreate.setFieldValue('custrecord_sales_outcome', 5);
    recordtoCreate.setFieldValue('custrecord_sales_callbackdate', getDate());
    recordtoCreate.setFieldValue('custrecord_sales_callbacktime', nlapiDateToString(date2.addHours(19), 'timeofday'));

    nlapiSubmitRecord(recordtoCreate);
    // nlapiSendEmail(112209, nlapiGetUser(), 'New Sales Record', 'New Sales Record Created', null);
    response.sendRedirect('RECORD', 'customer', customerRecordId, false);

}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);

    return date;
}

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}