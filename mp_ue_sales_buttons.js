/**
 * "
 * @param  {[type]} type
 * @param  {[type]} form
 * @return {[type]}
 */

var baseURL = 'https://system.na2.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

function beforeUserLoad(type, form) {

    if (type == 'view') {

        // set sales process management variables

        var debugging = true;

        var daysToReprocess = 0; // to be addressed to a process management record = 5
        var daysToNonExclusive = 0; // to be addressed to a procees manamement record = 20
        var signStatus = ['22', '31', '48', '13']; // to be addressed to a process management record 
        //22 - Customer - Lost, 
        //31 - Free Trial - Lost, 
        //48 - Free Trial - Lost 0, 
        //32 - Free Trial, 
        //13 - Signed
        var nonActiveSalesRep = [380229, 365634]; // to be addressed to a process management record


        var financeRoles = [1001, 1022, 1015, 1031];
        //1001 - Finance Role
        //1022 - Finance Manager
        //1015 - CFO
        //1031 - MAAP Manager
        var salesRoles = [ /*1003*/ , /*1004*/ , 1005, 1007, 1032, 1003];
        //1003 - S&M Administrator
        //1004 - S&M Director
        //1005 - BDM
        //1007 - Operations
        var salesAdmin = [1003, 1004];

        var systemAdmin = [3, 1032];

        var today = new Date();
        //var script = 'window.location="https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=265&deploy=1&salresrec=';

        if (debugging) {
            //3 - Administrator
            //Add Administrator to all Roles
            financeRoles.push(3);
            salesRoles.push(3);
            salesAdmin.push(3);
        }


        // set customer record data
        var customerRecordId = nlapiGetRecordId();
        var customerRecord = nlapiLoadRecord(nlapiGetRecordType(), customerRecordId);
        var status = nlapiGetFieldValue('entitystatus');
        var maapnumber = nlapiGetFieldValue('custentity_maap_bankacctno');
        var startDate = nlapiGetFieldValue('startdate');
        var userRole = parseInt(nlapiGetRole());
        var cancellation_reason = nlapiGetFieldValue('custentity_service_cancellation_reason');
        var new_customer_id = nlapiGetFieldValue('custentity_new_customer');
        var salesRecordID = null;

        nlapiLogExecution('AUDIT', 'status', status);

        // validation for button visibility

        // customer status is signStatus
        if (isInArray(status, signStatus)) {

            form.addButton('custpage_send_email', 'Send Email', getButtonScript('customer_send_email', 'null', customerRecordId));

            //any SalesRole can obtain a referral
            if (isInArray(userRole, salesRoles)) {
                var link = '/app/common/entity/custjob.nl?pf=CUSTENTITY_REF_REFERRER&pr=-2&stage=lead&pi=' + nlapiGetFieldValue('id');
                var scrpt = "window.open('" + link + "')";
                // form.addButton('custpage_new_referral', 'New Referral', scrpt);

                //load Sales Record search ExCustomer Campaigns
                var fil_sr = [];
                fil_sr[fil_sr.length] = new nlobjSearchFilter('custrecord_sales_completed', null, 'is', 'F'); // not completed 
                fil_sr[fil_sr.length] = new nlobjSearchFilter('custrecord_salescampaign_recordtype', 'custrecord_sales_campaign', 'is', 1); //campaignrecordtype is 'Existing Customer' 
                fil_sr[fil_sr.length] = new nlobjSearchFilter('custrecord_sales_inuse', null, 'isnot', 'T'); // not in use
                fil_sr[fil_sr.length] = new nlobjSearchFilter('custrecord_sales_customer', null, 'is', customerRecordId); // belongs to current customer
                fil_sr[fil_sr.length] = new nlobjSearchFilter('custrecord_sales_deactivated', null, 'is', 'F'); // is not deactivated sales records

                var fil_sr2 = [];
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_campaign', null, 'is', 50); // AusPost - Product - Price Increase
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_customer', null, 'is', customerRecordId); // belongs to current customer
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_completed', null, 'is', 'T'); // completed 
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_deactivated', null, 'is', 'F'); // is not deactivated sales records

                var fil_sr2 = [];
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_campaign', null, 'is', 50); // AusPost - Product - Price Increase
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_customer', null, 'is', customerRecordId); // belongs to current customer
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_completed', null, 'is', 'T'); // completed 
                fil_sr2[fil_sr2.length] = new nlobjSearchFilter('custrecord_sales_deactivated', null, 'is', 'F'); // is not deactivated sales records

                var col_sr = [];
                col_sr[col_sr.length] = new nlobjSearchColumn('internalId'); //internalid
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_assigned'); //lastassigned
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_outcome'); // lastoutcome
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_campaign'); // campaign
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_callbackdate'); // callbackdate
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_completed'); //completed
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_quotesent'); //quotesent
                // to be changed to last called
                col_sr[col_sr.length] = new nlobjSearchColumn('lastmodified'); // lastmodified
                col_sr[col_sr.length] = new nlobjSearchColumn('custrecord_sales_formsent'); // form sent

                var col_sr2 = [];
                col_sr2[col_sr2.length] = new nlobjSearchColumn('internalId'); //internalid

                var res_sr = nlapiSearchRecord('customrecord_sales', null, fil_sr, col_sr);
                var res_sr2 = nlapiSearchRecord('customrecord_sales', null, fil_sr2, col_sr2);

                var linkedMultisiteSearch = nlapiLoadSearch('customer', 'customsearch_linked_multisite_records');

                var addFilterExpression = new nlobjSearchFilter('internalId', null, 'anyof', customerRecordId);
                linkedMultisiteSearch.addFilter(addFilterExpression);

                var resultSetCustomer = linkedMultisiteSearch.runSearch();
                var result = resultSetCustomer.getResults(0, 1);

                if (result.length != 0) {
                    form.addButton('custpage_multisite_link', 'Retrieve Multisites Info', getButtonScript('retrieve_multisite', salesrecordid, customerRecordId));
                }

                if (status == 13) {
                    // form.addButton('custpage_changestatus', 'Change Status', getButtonScript('changestatus', null, customerRecordId)); // getButtonScript('changestatus', null, customerRecordId)
                }

                // form.addButton('custpage_multisite_link', 'Link Multisites', getButtonScript('multisite_link', salesrecordid, customerRecordId));

                // if no completed "AusPost - Product - Price Increase" sales record
                if (res_sr2 == null) {

                    var lpo_customer = customerRecord.getFieldValue('custentity_ap_lpo_customer');

                    // form.addButton('custpage_onboarding', 'Customer On Boarding', getButtonScript('customer_on_boarding', null, customerRecordId));

                    if (lpo_customer != 1) {
                        form.addButton('custpage_orderproducts', 'Order Products', getButtonScript('order_product', null, customerRecordId));
                    }

                    // if no active Sales record on ExCustomer Campaign
                    if (res_sr == null) {
                        // if (lpo_customer != 1) {
                        //     form.addButton('custpage_createsalesrecord', 'Create Product Sales Record', getButtonScript('cr8pdtsalesrec', null, customerRecordId));
                        // }

                        // if (status == 13) {
                            form.addButton('custpage_customer_create_sales_record', 'Create Sales Record', getButtonScript('cr8custsalesrec', null, customerRecordId));
                        // }

                    } else if (res_sr.length > 1) {

                        /*throw nlapiCreateError('S0001','Multiple Active Sales Record','suppressNotification');*/
                        throw (nlapiCreateError('Multiple active Sales Records', 'Record has two or more active sales record. \nPlease notify your system administrator to allow you to interact with this record.'));

                    } else {

                        var form_sent = 'F';
                        for (var i = 0; res_sr != null && i < res_sr.length; i++) {

                            var res = res_sr[i];
                            var salesrecordid = res.getId();
                            var rectype = res.getRecordType();
                            var internalid = res.getValue('internalId');
                            var lastassigned = res.getValue('custrecord_sales_assigned');
                            var lastoutcome = res.getValue('custrecord_sales_outcome');
                            var campaign = res.getText('custrecord_sales_campaign');
                            var campaignID = res.getValue('custrecord_sales_campaign');
                            var callbackdate = res.getValue('custrecord_sales_callbackdate');
                            var completed = res.getValue('custrecord_sales_completed');
                            var quotesent = res.getValue('custrecord_sales_quotesent');
                            // to be changed to last called
                            var lastmodified = res.getValue('lastmodified');
                            form_sent = res.getValue('custrecord_sales_formsent');

                        }

                        salesRecordID = salesrecordid;

                        nlapiLogExecution('DEBUG', 'salesrecordid', salesrecordid);
                        nlapiLogExecution('DEBUG', 'form_sent', form_sent);
                        nlapiLogExecution('DEBUG', 'quotesent', quotesent);
                        nlapiLogExecution('DEBUG', 'completed', completed);

                        //if sales record belongs to SR or -empty- or SR no longer active
                        if ((lastassigned == nlapiGetUser()) || isEmpty(lastassigned) || (isInArray(lastassigned, nonActiveSalesRep)) || (debugging && userRole == 3)) {
                            //show "Product Sale" button

                            if (lpo_customer != 1) {
                                form.addButton('custpage_productsale', 'Product Sale', getButtonScript('product', salesrecordid, customerRecordId));
                            }

                            var campaignRecord = nlapiLoadRecord('customrecord_salescampaign', campaignID);

                            var campaignType = campaignRecord.getFieldValue('custrecord_salescampaign_recordtype');

                            if (campaignType == 1) {
                                form.addButton('custpage_callcentre', 'Call Centre', getButtonScript('xcallcentre', salesrecordid, customerRecordId));
                                if (form_sent == 'T') {
                                    form.addButton('custpage_finalisexsale', 'Finalise X Sale', getButtonScript('finalisexsale', salesrecordid, customerRecordId));
                                }
                            }
                        }
                    }

                    // //if status is Free Trial and User = -mine-, empty or no longer active
                    // if (status == 32 && (lastassigned == nlapiGetUser()) || isEmpty(lastassigned) || (isInArray(lastassigned, nonActiveSalesRep))) {
                    //     form.addButton('custpage_sign', 'Finalise Sale', getButtonScript('commencement', salesrecordid, customerRecordId));
                    // }



                    //if started within daysToReprocess
                    if (startDate + daysToReprocess >= today) {
                        // needs to change to custentity_commencement_register.custrecord_comm_date
                        //form.addButton('custpage_reprocess', 'Call Centre (Reprocess)', script_reprocess);

                    }

                    //form.addButton('custpage_cancel', 'Process Cancellation', script_cancel);
                    //form.addButton('custpage_refer', 'Referral', script_refer);
                    //form.addButton('custpage_trf', 'Change Address, script_trf')
                }

                // if (res_sr3 != null) {
                //     form.addButton('custpage_multisite_link', 'Retrieve Multisites Info', getButtonScript('retrieve_multisite', salesrecordid, customerRecordId));
                // }
            }

            if (isInArray(userRole, salesAdmin)) {
                form.addButton('custpage_onboarding', 'Customer On Boarding', getButtonScript('customer_on_boarding', null, customerRecordId));
            }

            if (status == 13 || status == 32) {
                form.addButton('custpage_cancellation', 'Cancel Customer', getButtonScript('customer_cancellation', null, customerRecordId));
                // form.addButton('custpage_send_email', 'Send Email', getButtonScript('customer_send_email', 'null', customerRecordId));

                // form.addButton('custpage_change', 'Service Change notification', getButtonScript('customer_change', null, customerRecordId));
                form.addButton('custpage_prod_pricing', 'Product Pricing', getButtonScript('customer_prod_pricing', null, customerRecordId));
                // if (userRole == 1003 || userRole == 1004 || userRole == 3)
                // form.addButton('custpage_coe', 'Change of Entity', getButtonScript('customer_coe', null, customerRecordId));
            }

            
            if (maapnumber != null) {

                //form.addButton('custpage_welcomepack', 'Generate Welcome Pack', script_welcomepack);

            } else {

                if (isInArray(userRole, financeRoles)) {

                    form.addButton('custpage_generatemaap', 'Generate MAAP #', getButtonScript('maapgen', null, customerRecordId));

                    if (status == 13 || status == 32) {
                        // form.addButton('custpage_cancellation', 'Cancel Customer', getButtonScript('customer_cancellation', null, customerRecordId));
                    }

                }
            }
            //move digitalisation only if cancellation reason if COE
            if (cancellation_reason == 28 && !isNullorEmpty(new_customer_id)) { //Change of Entity
                form.addButton('custpage_movedigitalisation', 'Move Digitalisation', getButtonScript('move_digitalisation', null, customerRecordId));
            }
            //if not SignStatus
        } else {
            if (isInArray(userRole, systemAdmin)) {
                form.addButton('custpage_send_email', 'Send Email', getButtonScript('customer_send_email', 'null', customerRecordId));
            }
            // if user is a BDM or Sales Admin
            if (isInArray(userRole, salesRoles) || isInArray(userRole, salesAdmin)) {
                // alert(23);

                //load Sales Record search results
                var filters = [];
                filters[0] = new nlobjSearchFilter('custrecord_sales_completed', null, 'is', 'F'); // not completed 
                filters[1] = new nlobjSearchFilter('custrecord_salescampaign_recordtype', 'custrecord_sales_campaign', 'is', 2); //campaignrecordtype is 'Prospects' 
                filters[2] = new nlobjSearchFilter('custrecord_sales_inuse', null, 'isnot', 'T'); // not in use
                filters[3] = new nlobjSearchFilter('custrecord_sales_customer', null, 'is', customerRecordId); // belongs to current customer
                filters[4] = new nlobjSearchFilter('custrecord_sales_deactivated', null, 'is', 'F'); // is not deactivated sales records

                var col = [];
                col[0] = new nlobjSearchColumn('internalId'); //internalid
                col[1] = new nlobjSearchColumn('custrecord_sales_assigned'); //lastassigned
                col[2] = new nlobjSearchColumn('custrecord_sales_outcome'); // lastoutcome
                col[3] = new nlobjSearchColumn('custrecord_sales_customer'); // customer
                col[4] = new nlobjSearchColumn('custrecord_sales_campaign'); // campaign
                col[5] = new nlobjSearchColumn('custrecord_salescampaign_recordtype', 'custrecord_sales_campaign'); //campaignrecordtype
                col[6] = new nlobjSearchColumn('custrecord_sales_callbackdate'); // callbackdate
                col[7] = new nlobjSearchColumn('custrecord_sales_completed'); //completed
                col[8] = new nlobjSearchColumn('custrecord_sales_quotesent'); //quotesent
                // to be changed to last called
                col[9] = new nlobjSearchColumn('lastmodified'); // lastmodified
                col[10] = new nlobjSearchColumn('custrecord_sales_formsent'); // formsent

                var results = nlapiSearchRecord('customrecord_sales', null, filters, col);

                // var fil_sr3 = [];
                // fil_sr3[fil_sr3.length] = new nlobjSearchFilter('internalId', "custentity_multisite_branches", "noneof", "@NONE@");

                var col_sr2 = [];
                col_sr2[col_sr2.length] = new nlobjSearchColumn('internalId'); //internalid

                // var res_sr3 = nlapiSearchRecord('customrecord_sales', null, fil_sr3, col_sr2);

                var linkedMultisiteSearch = nlapiLoadSearch('customer', 'customsearch_linked_multisite_records');

                var addFilterExpression = new nlobjSearchFilter('internalId', null, 'anyof', customerRecordId);
                linkedMultisiteSearch.addFilter(addFilterExpression);

                var resultSetCustomer = linkedMultisiteSearch.runSearch();
                var result = resultSetCustomer.getResults(0, 1);

                if (result.length != 0) {
                    form.addButton('custpage_multisite_link', 'Retrieve Multisites Info', getButtonScript('retrieve_multisite', salesrecordid, customerRecordId));
                }

                // form.addButton('custpage_multisite_link', 'Link Multisites', getButtonScript('multisite_link', salesrecordid, customerRecordId));

                if (results == null) {

                    form.addButton('custpage_createsalesrecord', 'Create Sales Record', getButtonScript('cr8salesrec', null, customerRecordId));

                } else if (results.length > 1) {

                    /*throw nlapiCreateError('S0001','Multiple Active Sales Record','suppressNotification');*/
                    throw (nlapiCreateError('Multiple active Sales Records', 'Record has two or more active sales record. \nPlease notify your system administrator to allow you to interact with this record.'));

                } else {

                    for (var i = 0; results != null && i < results.length; i++) {

                        var res = results[i];
                        var salesrecordid = res.getId();
                        var rectype = res.getRecordType();
                        var internalid = res.getValue('internalId');
                        var lastassigned = res.getValue('custrecord_sales_assigned');
                        var lastoutcome = res.getValue('custrecord_sales_outcome');
                        var customer = res.getValue('custrecord_sales_customer');
                        var campaign = res.getValue('custrecord_sales_campaign');
                        var campaignrecordtype = res.getText('custrecord_salescampaign_recordtype', 'custrecord_sales_campaign');
                        var callbackdate = res.getValue('custrecord_sales_callbackdate');
                        var completed = res.getValue('custrecord_sales_completed');
                        var quotesent = res.getValue('custrecord_sales_quotesent');
                        // to be changed to last called
                        var lastmodified = res.getValue('lastmodified');
                        var formsent = res.getValue('custrecord_sales_formsent')


                    }
                    form.addButton('custpage_callcentre', 'Call Centre', getButtonScript('xcallcentre', salesrecordid, customerRecordId));
                    // form.addButton('custpage_unity4', 'Start Unity4 Trial', getButtonScript('unity4', salesrecordid, customerRecordId));

                    // if lastassigned = current user, empty, not active Call Centre button will be accessible
                    if ((lastassigned == nlapiGetUser()) || isEmpty(lastassigned) || (isInArray(lastassigned, nonActiveSalesRep))) {

                        // if quote/form is previously sent Finalise Sale button will also be available
                        // if campaign is Inbound - No Pitch - Commencement Form Receipts
                        if (quotesent == 'T' | formsent == 'T' | status == 32 | campaign == 54 | campaign == 57 | campaign == 35 | campaign == 60 | campaign == 62) {
                            if (isInArray(userRole, systemAdmin)) {
                                // form.addButton('custpage_sign', 'Finalise Sale', getButtonScript('commencement', salesrecordid, customerRecordId));
                                form.addButton('custpage_finalisexsale', 'Finalise Sale', getButtonScript('finalisexsale', salesrecordid, customerRecordId));
                            }
                        }

                        if (campaign == 56) {

                            form.addButton('custpage_unity4', 'Start Unity4 Trial', getButtonScript('unity4', salesrecordid, customerRecordId));
                        }

                        // if last assigned is not current user and exclusive period has lapsed
                    } else {
                        // if sales admin role
                        if (isInArray(userRole, systemAdmin)) {
                            // form.addButton('custpage_sign', 'Finalise Sale', getButtonScript('commencement', salesrecordid, customerRecordId));
                            form.addButton('custpage_finalisexsale', 'Finalise Sale', getButtonScript('finalisexsale', salesrecordid, customerRecordId));

                        }

                        // last outcome = 'No Answer', anyone can access Call Centre.
                        if (lastoutcome == 7) {

                            form.addButton('custpage_callcentre', 'Call Centre', getButtonScript('xcallcentre', salesrecordid, customerRecordId));
                        }



                        if ((today - nlapiAddDays(nlapiStringToDate(lastmodified), daysToNonExclusive)) >= 0) {

                            // anyone can access
                            //form.addButton('custpage_callcentre', 'Call Centre', 'popSalesRecord(' + salesrecordid + ')');
                            //form.addButton('custpage_callcentre', 'Call Centre', script_callcentre);
                        } else {
                            // call centre for non-sales reps
                            //form.addButton('custpage_callcentreNSR', 'Call Centre NSR', script_callcentreNSR);

                        }
                    }
                }

                // if(res_sr3 != null){
                //     form.addButton('custpage_multisite_link', 'Retrieve Multisites Info', getButtonScript('retrieve_multisite', salesrecordid, customerRecordId));
                // }
            }
        }
    }
}

function isInArray(val, array) {
    return array.indexOf(val) >= 0;
}

function isNotInArray(val, array) {
    return array.indexOf(val) < 0;
}

/**
 * [validatePhoneRegEx description]
 * @param  {[type]} phoneNo [description]
 * @return {[type]}         [description]
 */
function validatePhoneRegEx(phoneNo) {
    var val = phoneNo;
    var digits = val.replace(/[^0-9]/g, '');
    var australiaPhoneFormat = /^(\+\d{2}[ \-]{0,1}){0,1}(((\({0,1}[ \-]{0,1})0{0,1}\){0,1}[2|3|7|8]{1}\){0,1}[ \-]*(\d{4}[ \-]{0,1}\d{4}))|(1[ \-]{0,1}(300|800|900|902)[ \-]{0,1}((\d{6})|(\d{3}[ \-]{0,1}\d{3})))|(13[ \-]{0,1}([\d \-]{5})|((\({0,1}[ \-]{0,1})0{0,1}\){0,1}4{1}[\d \-]{8,10})))$/;
    var phoneFirst6 = digits.substring(0, 6);
    var failed = false;

    //Check if all phone characters are numerals
    if (val != digits) {
        failed = true;
    }

    //Check if phone is not blank and contains 10 digits
    else if (val.length != 0 && digits.length != 10) {
        failed = true;
    }

    //Check if first 6 digits of phone number is 000013, by pass austrliaPhoneFormat test
    else if (phoneFirst6 != "000013") {
        //Check if valid Australian phone numbers have been entered
        if (!australiaPhoneFormat.test(digits)) {
            failed = true;
        }
    } else if (digits.length == 10) {
        //Check if all 10 digits are the same numbers using checkDuplicate function
        if (checkDuplicate(digits)) {
            failed = true;
        }
    }
    return failed;
}


/* function createsalesrecordfn(type, customerRecordId) {
        var recordtoCreate = nlapiCreateRecord('customrecord_sales');
        // Set Title, Assigned to, Message and Company
        recordtoCreate.setFieldValue('custrecord_sales_customer', customerRecordId);
        recordtoCreate.setFieldValue('custrecord_sales_campaign', 48);
        recordtoCreate.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recordtoCreate.setFieldValue('custrecord_sales_outcome', 5);
        recordtoCreate.setFieldValue('custrecord_sales_callbackdate', getDate());
        
        //nlapiSubmitRecord(recordtoCreate, true);
        nlapiSendEmail(112209 , nlapiGetUser(), 'New Sales Record', 'New Sales Record Created' ,null);
}*/

// scripts for buttons
/*var script_reprocess = "alert('Reprocess: Prompt ([Inbound], [Outbound], [Field]) \n Then Warning - will change record. \n on [Proceed] Brings up sales campaign suitelet')";
var script_welcomepack = "alert('Generate Welcome Pack: displays .pdf of Welcome Pack to print/save')";
var script_productorder = "alert('Product Order Page')";
var script_cancel = "alert('Cancellation Page with Document Upload')";
var script_createsalesrecord = "alert('Page with Campaign Selector (Inbound or Referral).\n on [Submit], create sales record.')"; //"createsalesrecordfn('"; // + customerRecordId + "');\""); 
var script_callcentre = "alert('Prompt ([Inbound], [Outbound], [Field]) \n Then loads sales campaign Suitelet')";
var script_trial = "alert('Trial: Brings up Information Confirmation Page with Regex validations and Document Upload')";
var script_sign = "alert('Sign: Brings up Information Confirmation Page with Regex validations and Document Upload')";
var script_callcentreNSR = "alert('Prompt ([Inbound], [Outbound], [Field]) \n Then loads Sales Campaign Suitelet, Send notification to SR and will not update last assigned: with red banner <You may proceed in logging this sales activity. The sales representative looking after this record has been notified.')";
var script_maap = "alert('In Development.\nGenerate Maap Number from current Maap Number, trim left 8 + 1, Generate Maap #, validate and update MAAP Implementation Date {custentity_maap_implementdate} = today. If MAAP Parent {custentity_maap_bankacctno_parent} != null, MAAP # = {custentity_maap_bankacctno_parent} and {custentity_maap_implementdate} = today.')";
*/

function getButtonScript(type, salesrecordid, customerrecordid) {
    var rtnScript = 'return void';
    //script callcentre - loads record on call centre
    if (type == 'callcentre') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_salescampaign', 'customdeploy_sl_salescampaign');
        url += '&salesid=' + salesrecordid + '&button=T';
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'xcallcentre') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_finalise_page', 'customdeploy_sl_finalise_page');
        url += '&callcenter=T&recid=' + customerrecordid + '&sales_record_id=' + salesrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    //script cr8salesrec - creates sales record for sales activities
    if (type == 'cr8salesrec') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_sales_campaign_popup', 'customdeploy_sl_sales_campaign_popup');
        url += '&recid=' + customerrecordid + '&button=T';
        rtnScript = "window.location='" + url + "'";
    }

    if (type == 'cr8custsalesrec') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_sales_campaign_popup', 'customdeploy_sl_sales_campaign_popup');
        url += '&recid=' + customerrecordid + '&button=T&cust=T';
        rtnScript = "window.location='" + url + "'";
    }

    //script maap - updates record with latest unique bank account # for MAAP EFT auto allocation
    if (type == 'maapgen') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_salesbtns_maapgen', 'customdeploy_sl_salesbtns_maapgen');
        url += '&recid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }

    //script commencement - loads record on finalise sales workflow for "Send Quote" and "Trial" outcomes
    if (type == 'commencement') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_salesbtns_upload_file', 'customdeploy_sl_salesbtns_upload_file');
        url += '&recid=' + customerrecordid + '&sales_record_id=' + salesrecordid + '&upload_file=F&upload_file_id=' + null + '&file_type=T';
        rtnScript = "window.location='" + url + "'";
    }

    if (type == 'finalisexsale') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_finalise_page', 'customdeploy_sl_finalise_page');
        url += '&recid=' + customerrecordid + '&sales_record_id=' + salesrecordid;
        rtnScript = "window.location='" + url + "'";
    }

    //script cr8pdtsalesrec - creates sales record for sales activities
    if (type == 'cr8pdtsalesrec') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_sales_campaign_popup', 'customdeploy_sl_sales_campaign_popup');
        url += '&recid=' + customerrecordid + '&button=T' + '&pdt=T';
        rtnScript = "window.location='" + url + "'";
    }

    //script product - loads record on product sales workflow
    if (type == 'product') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_salesbtns_product', 'customdeploy_sl_salesbtns_product');
        url += '&recid=' + customerrecordid + '&sales_record_id=' + salesrecordid;
        rtnScript = "window.location='" + url + "'";
    }

    if (type == 'unity4') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_unity4_comm_page', 'customdeploy_sl_unity4_comm_page');
        url += '&recid=' + customerrecordid + '&sales_record_id=' + salesrecordid;
        rtnScript = "window.location='" + url + "'";
    }

    if (type == 'customer_on_boarding') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_customer_on_boarding', 'customdeploy_sl_customer_on_boarding');
        url += '&custId=' + customerrecordid + '&sales_record_id=' + salesrecordid;
        rtnScript = "window.location='" + url + "'";
    }

    if (type == 'customer_cancellation') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_customer_cancellation', 'customdeploy_sl_customer_cancellation');
        url += '&custid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'customer_send_email') {
        // var params = {
        //     custid: customerrecordid,
        //     sales_record_id: salesrecordid,
        //     id: 'customscript_sl_lead_capture2',
        //     deploy: 'customdeploy_sl_lead_capture2'
        // };
        // params = JSON.stringify(params);
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_send_email_module', 'customdeploy_sl_send_email_module');
        url += '&custid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'customer_coe') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_copy_customer', 'customdeploy_sl_copy_customer');
        url += '&custid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'customer_change') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_customer_ue_service_chan', 'customdeploy_sl_customer_ue_service_chan');
        url += '&custid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'customer_prod_pricing') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl2_prod_pricing_page', 'customdeploy1');
        url += '&customerid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'multisite_link') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_link_multisite', 'customdeploy_sl_link_multisite');
        url += '&custid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'retrieve_multisite') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_linked_multisite_info', 'customdeploy_sl_linked_multisite_info');
        url += '&custid=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }
    if (type == 'order_product') {

        var customer_record = nlapiLoadRecord('customer', customerrecordid);

        var lpo_question = customer_record.getFieldValue('custentity_ap_lpo_customer');

        if (lpo_question == 2) {
            var url = nlapiResolveURL('SUITELET', 'customscript_sl_auspost_create_order', 'customdeploy_sl_auspost_create_order');
            url += '&trial_page=F&customer_id=' + customerrecordid;
            rtnScript = "window.location='" + url + "'";

        } else {
            var url = nlapiResolveURL('SUITELET', 'customscript_sl_lpo_verification', 'customdeploy_sl_lpo_verification');
            url += '&trial_page=F&customer_id=' + customerrecordid;
            rtnScript = "window.location='" + url + "'";
        }


    }
    if (type == 'move_digitalisation') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_move_digitalisation', 'customdeploy_sl_move_digitalisation');
        url += '&cust_id=' + customerrecordid;
        rtnScript = "window.location='" + url + "'";
    }

    if (type == 'changestatus') {
        var url = nlapiResolveURL('SUITELET', 'customscript_sl_sales_campaign_status', 'customdeploy_sl_sales_campaign_status');
        url += '&recid=' + customerrecordid + '&button=T&cust=T';
        rtnScript = "window.location='" + url + "'";
    }

    return rtnScript;
}

function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function getDate() {
    var date = new Date();
    if (date.getHours() > 6) {
        date = nlapiAddDays(date, 1);
    }
    date = nlapiDateToString(date);
    return date;
}