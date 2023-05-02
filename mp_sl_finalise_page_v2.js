/**
 * Module Description
 *
 * NSVersion    Date                    Author
 * 1.00         2018-04-11 15:54:16     Ankith
 *
 * Remarks:
 *
 * @Last modified by:   ankithravindran
 * @Last modified time: 2022-06-03T09:31:49+10:00
 *
 */

//GLOBAL VARIABLES
var billing_error = 'F';
var shipping_state;
var callcenter = null;
var button = null;

var item_array = new Array();
var item_price_array = [];

var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
  baseURL = 'https://system.sandbox.netsuite.com';
}

var ctx = nlapiGetContext();

var zee = 0;
var role = ctx.getRole();
var row_count = 0;

var service_type_search = serviceTypeSearch(null, [1]);


if (role == 1000) {
  //Franchisee
  zee = ctx.getUser();
} else {
  zee = 0;
}

var ampo_price;
var ampo_time;
var pmpo_price;
var pmpo_time;

var contact_count = 0;
var address_count = 0;



function main(request, response) {
  if (request.getMethod() == "GET") {

    var params = request.getParameter('custparam_params');

    if (isNullorEmpty(params)) {
      var customer_id = parseInt(request.getParameter('recid'));
      var sales_record_id = parseInt(request.getParameter('sales_record_id'));
      callcenter = request.getParameter('callcenter');
      button = request.getParameter('button');
    } else {
      entryParamsString = params;

      params = JSON.parse(params);
      var customer_id = parseInt(params.custid);
      var sales_record_id = parseInt(params.sales_record_id);
      callcenter = params.callcenter;
    }

    //Details from Customer Record
    var customer_record = nlapiLoadRecord('customer', customer_id);
    var entityid = customer_record.getFieldValue('entityid');
    var companyName = customer_record.getFieldValue('companyname');

    var abn = customer_record.getFieldValue('vatregnumber');
    if (isNullorEmpty(abn)) {
      abn = '';
    }
    var zee = customer_record.getFieldValue('partner');
    var zeeText = customer_record.getFieldText('partner');
    var accounts_email = customer_record.getFieldValue('email');
    if (isNullorEmpty(accounts_email)) {
      accounts_email = '';
    }
    var accounts_phone = customer_record.getFieldValue('altphone');
    if (isNullorEmpty(accounts_phone)) {
      accounts_phone = '';
    }
    var daytodayemail = customer_record.getFieldValue(
      'custentity_email_service');
    if (isNullorEmpty(daytodayemail)) {
      daytodayemail = '';
    }
    var daytodayphone = customer_record.getFieldValue('phone');
    if (isNullorEmpty(daytodayphone)) {
      daytodayphone = '';
    }
    var ap_mail_parcel = customer_record.getFieldValue(
      'custentity_ap_mail_parcel');
    var ap_outlet = customer_record.getFieldValue('custentity_ap_outlet');
    var lpo_customer = customer_record.getFieldValue(
      'custentity_ap_lpo_customer');
    var customer_status = customer_record.getFieldText('entitystatus');
    var customer_status_id = customer_record.getFieldValue('entitystatus');
    var lead_source = customer_record.getFieldValue('leadsource');
    var customer_industry = customer_record.getFieldValue(
      'custentity_industry_category');
    ampo_price = customer_record.getFieldValue('custentity_ampo_service_price');
    ampo_time = customer_record.getFieldValue('custentity_ampo_service_time');
    pmpo_price = customer_record.getFieldValue('custentity_pmpo_service_price');
    pmpo_time = customer_record.getFieldValue('custentity_pmpo_service_time');

    //MPEX SECTION - Min
    var min_dl = customer_record.getFieldValue('custentity_mpex_dl_float'); //Customer Min DL Float
    var min_b4 = customer_record.getFieldValue('custentity_mpex_b4_float'); //Customer Min B4 Float
    var min_c5 = customer_record.getFieldValue('custentity_mpex_c5_float'); //Customer Min C5 Float
    var min_1kg = customer_record.getFieldValue('custentity_mpex_1kg_float'); //Customer Min 1Kg Float
    var min_3kg = customer_record.getFieldValue('custentity_mpex_3kg_float'); //Customer Min 3kg Float
    var min_5kg = customer_record.getFieldValue('custentity_mpex_5kg_float'); //Customer Min 5Kg Float
    var min_500g = customer_record.getFieldValue('custentity_mpex_5kg_float'); //Customer Min 500g Float
    var mpex_customer = customer_record.getFieldValue(
      'custentity_mpex_customer'); //MPEX Customer
    var portal_training = customer_record.getFieldValue(
      'custentity_portal_training_required'); //MPEX Customer
    var mpex_expected_usage = customer_record.getFieldValue(
      'custentity_exp_mpex_weekly_usage'); //MPEX Customer

    //If empty, set field to 0
    if (isNullorEmpty(min_dl)) {
      min_dl = 0;
    }
    if (isNullorEmpty(min_b4)) {
      min_b4 = 0;
    }
    if (isNullorEmpty(min_c5)) {
      min_c5 = 0;
    }
    if (isNullorEmpty(min_1kg)) {
      min_1kg = 0;
    }
    if (isNullorEmpty(min_3kg)) {
      min_3kg = 0;
    }
    if (isNullorEmpty(min_5kg)) {
      min_5kg = 0;
    }
    if (isNullorEmpty(min_500g)) {
      min_500g = 0;
    }

    var multisite = customer_record.getFieldValue(
      'custentity_category_multisite');
    if (multisite == 'T') {
      multisite = 1;
    } else {
      multisite = 2;
    }

    var website = customer_record.getFieldValue(
      'custentity_category_multisite_link');
    if (isNullorEmpty(website)) {
      website = '';
    }

    var service_of_interest = customer_record.getFieldValue(
      'custentity_services_of_interest');

    var saveCustomer = customer_record.getFieldValue(
      'custentity_cancel_ongoing');
    var account_manager = customer_record.getFieldValue(
      'custentity_mp_toll_salesrep');

    var salesRecord = nlapiLoadRecord('customrecord_sales', sales_record_id);
    var lastOutcome = salesRecord.getFieldValue('custrecord_sales_outcome');
    var phone_call_made = salesRecord.getFieldValue(
      'custrecord_sales_call_made');
    var salesCampaignID = salesRecord.getFieldValue('custrecord_sales_campaign');


    var searchZees = nlapiLoadSearch('partner',
      'customsearch_salesp_franchisee');

    var resultSetZees = searchZees.runSearch();

    //Search for Addresses
    var searchedAddresses = nlapiLoadSearch('customer',
      'customsearch_salesp_address');

    var newFilters = new Array();
    newFilters[newFilters.length] = new nlobjSearchFilter('internalid', null,
      'is', customer_id);

    searchedAddresses.addFilters(newFilters);

    var resultSetAddresses = searchedAddresses.runSearch();

    //Search for Contacts
    var searchedContacts = nlapiLoadSearch('contact',
      'customsearch_salesp_contacts');

    var newFilters = new Array();
    newFilters[newFilters.length] = new nlobjSearchFilter('company', null, 'is',
      customer_id);

    searchedContacts.addFilters(newFilters);

    var resultSetContacts = searchedContacts.runSearch();

    var commReg = null;

    var newFiltersCommReg = new Array();
    newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
      'custrecord_commreg_sales_record', null, 'anyof', sales_record_id);
    newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
      'custrecord_customer', null, 'anyof', customer_id);
    newFiltersCommReg[newFiltersCommReg.length] = new nlobjSearchFilter(
      'custrecord_trial_status', null, 'anyof', [9, 10]);

    var col = new Array();
    col[0] = new nlobjSearchColumn('internalId');
    col[1] = new nlobjSearchColumn('custrecord_date_entry');
    col[2] = new nlobjSearchColumn('custrecord_sale_type');
    col[3] = new nlobjSearchColumn('custrecord_franchisee');
    col[4] = new nlobjSearchColumn('custrecord_comm_date');
    col[5] = new nlobjSearchColumn('custrecord_in_out');
    col[6] = new nlobjSearchColumn('custrecord_customer');
    col[7] = new nlobjSearchColumn('custrecord_trial_status');
    col[7] = new nlobjSearchColumn('custrecord_comm_date_signup');

    var old_comm_reg;
    var customer_comm_reg;
    var comm_reg_results = nlapiSearchRecord(
      'customrecord_commencement_register', null, newFiltersCommReg, col);

    if (!isNullorEmpty(comm_reg_results)) {
      if (comm_reg_results.length == 1) {
        commReg = comm_reg_results[0].getValue('internalid');
      } else if (comm_reg_results.length > 1) {

      }
    }

    /**
     * Description - To get all the services associated with this customer
     */
    var serviceSearch = nlapiLoadSearch('customrecord_service',
      'customsearch_salesp_services');

    var newFilters_service = new Array();
    newFilters_service[newFilters_service.length] = new nlobjSearchFilter(
      'custrecord_service_customer', null, 'is', customer_id);

    serviceSearch.addFilters(newFilters_service);

    var resultSet_service = serviceSearch.runSearch();

    var serviceResult = resultSet_service.getResults(0, 1);

    var resultSet_service_change = null;
    var resultServiceChange = [];

    if (!isNullorEmpty(commReg)) {
      var searched_service_change = nlapiLoadSearch('customrecord_servicechg',
        'customsearch_salesp_service_chg');

      var newFilters = new Array();
      newFilters[newFilters.length] = new nlobjSearchFilter(
        "custrecord_service_customer", "CUSTRECORD_SERVICECHG_SERVICE", 'is',
        customer_id);
      newFilters[newFilters.length] = new nlobjSearchFilter(
        "custrecord_servicechg_comm_reg", null, 'is', commReg);
      newFilters[newFilters.length] = new nlobjSearchFilter(
        'custrecord_servicechg_status', null, 'noneof', [2, 3]);

      searched_service_change.addFilters(newFilters);

      resultSet_service_change = searched_service_change.runSearch();

      resultServiceChange = resultSet_service_change.getResults(0, 1);
    }
    if (isNullorEmpty(callcenter)) {
      var form = nlapiCreateForm('Finalise Sale: ' + entityid + ' ' +
        companyName);
    } else {
      var form = nlapiCreateForm('Call Center: ' + entityid + ' ' + companyName);
    }

    form.addField('customer', 'text', 'Customer').setDisplayType('hidden').setDefaultValue(
      customer_id);
    form.addField('entityid', 'text', 'Customer').setDisplayType('hidden').setDefaultValue(
      entityid);
    form.addField('sales_record_id', 'text', 'Customer').setDisplayType(
      'hidden').setDefaultValue(sales_record_id);
    form.addField('service_change', 'text', 'Customer').setDisplayType('hidden')
      .setDefaultValue(resultSet_service_change);
    form.addField('custpage_phone_call_made', 'text', 'Phone Call Made').setDisplayType(
      'hidden').setDefaultValue(phone_call_made);
    form.addField('custpage_sales_campaign_id', 'text', 'Sales Campaign ID').setDisplayType(
      'hidden').setDefaultValue(salesCampaignID);
    form.addField('custpage_callcenter', 'text', 'callcenter').setDisplayType(
      'hidden').setDefaultValue(callcenter);
    form.addField('custpage_button', 'text', 'Button').setDisplayType('hidden')
      .setDefaultValue(button);

    form.addField('custpage_nosalereason', 'select', 'No Sale Reason',
      'customlist_nosalereason').setDisplayType('hidden');
    form.addField('custpage_callbackdate', 'date', ' ').setDisplayType('hidden');
    form.addField('custpage_callbacktime', 'timeofday', ' ').setDisplayType(
      'hidden');

    form.addField('custpage_rejectreason', 'select',
      'customlist_sales_infoincomplete_reason').setDisplayType('hidden');
    form.addField('custpage_rejectnotes', 'longtext', 'Reject Notes').setDisplayType(
      'hidden');

    form.addField('custpage_refernotes', 'longtext', 'Refer Notes').setDisplayType(
      'hidden');
    form.addField('custpage_callnotes', 'longtext', 'Call Notes').setDisplayType(
      'hidden');
    form.addField('custpage_startdate', 'date', 'Start Date').setDisplayType(
      'hidden');
    form.addField('financial_item_array', 'text', 'Start Date').setDisplayType(
      'hidden');
    form.addField('financial_price_array', 'text', 'Start Date').setDisplayType(
      'hidden');
    form.addField('custpage_item_ids', 'text', 'Start Date').setDisplayType(
      'hidden');
    var fldTrial = form.addField('custpage_trialperiod', 'select',
      'Trial Period').setDisplayType('hidden');

    var fldOutcome = form.addField('custpage_outcome', 'select', 'Outcome').setDisplayType(
      'hidden');


    //INITIALIZATION OF JQUERY AND BOOTSTRAP
    var inlineQty =
      '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link type="text/css" rel="stylesheet" href="https://cdn.datatables.net/1.10.13/css/jquery.dataTables.min.css"><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&amp;c=1048144&amp;h=9ee6accfd476c9cae718&amp;_xt=.css"><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&amp;c=1048144&amp;h=ef2cda20731d146b5e98&amp;_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script><script src="https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js"></script><script src="https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&amp;c=1048144&amp;h=a0ef6ac4e28f91203dfe&amp;_xt=.css"><style>.mandatory{color:red;}</style>';

    inlineQty +=
      '<div class="se-pre-con"></div><div ng-app="myApp" ng-controller="myCtrl"><div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in"></div>';

    //Customer Details
    inlineQty += customerDetailsSection(companyName, abn, resultSetZees, zee,
      accounts_email, daytodayphone, daytodayemail, accounts_phone,
      customer_status, lead_source, customer_industry, callcenter, account_manager);

    //Address and Contacts Details
    inlineQty += addressContactsSection(resultSetAddresses, resultSetContacts,
      form);

    form.addField('shipping_state', 'text', 'Customer').setDisplayType('hidden')
      .setDefaultValue(shipping_state);

    form.addField('create_service_change', 'text', 'Customer').setDisplayType(
      'hidden').setDefaultValue('F');

    form.addField('comm_reg', 'text', 'Customer').setDisplayType('hidden').setDefaultValue(
      commReg);

    var fils = new Array();
    fils[fils.length] = new nlobjSearchFilter('entity', null, 'is', customer_id);
    fils[fils.length] = new nlobjSearchFilter('mainline', null, 'is', true);
    fils[fils.length] = new nlobjSearchFilter('memorized', null, 'is', false);
    fils[fils.length] = new nlobjSearchFilter('custbody_inv_type', null, 'is',
      '@NONE@');
    fils[fils.length] = new nlobjSearchFilter('voided', null, 'is', false);

    var cols = new Array();
    cols[cols.length] = new nlobjSearchColumn('internalid');
    cols[cols.length] = new nlobjSearchColumn('tranid');
    cols[cols.length] = new nlobjSearchColumn('total');
    cols[cols.length] = new nlobjSearchColumn('trandate').setSort(true);
    cols[cols.length] = new nlobjSearchColumn('status');

    var inv_results = nlapiSearchRecord('invoice', null, fils, cols);

    if (!isNullorEmpty(inv_results)) {

      inlineQty += '<div class="form-group container">';
      inlineQty += '<div class="row">';
      inlineQty +=
        '<div class="col-xs-12 "><h4><span class="label label-default col-xs-12">LAST 3 INVOICES</span></h4></div>';
      inlineQty += '</div>';
      inlineQty += '</div>';

      inlineQty += '<div class="form-group container">';
      inlineQty += '<div class="row">';
      inlineQty += '<div class="col-xs-12">';

      inlineQty +=
        '<style>table#customer_invoice {font-size:12px; text-align:center; border-color: #24385b}</style><table border="0" cellpadding="15" id="customer_invoice" class="table table-responsive table-striped customer tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"></tr><tr class="text-center">';

      /**
       * INVOICE DATE
       */
      inlineQty +=
        '<th style="vertical-align: middle;text-align: center;"><b>INVOICE DATE</b></th>';
      /**
       * INVOICE NO.
       */
      inlineQty +=
        '<th style="vertical-align: middle;text-align: center;"><b>INVOICE NO.</b></th>';
      /**
       * INVOICE TOTAL
       */
      inlineQty +=
        '<th style="vertical-align: middle;text-align: center;" ><b>INVOICE TOTAL</b></th>';

      /**
       * INVOICE STATUS
       */
      inlineQty +=
        '<th style="vertical-align: middle;text-align: center;"><b>STATUS</b></th></tr></thead><tbody>';

      for (var x = 0; x < inv_results.length && x < 3; x++) {
        inlineQty += '<tr>';
        inlineQty += '<td>' + inv_results[x].getValue('trandate') + '</td>';
        inlineQty += '<td><a href="' + baseURL +
          '/app/accounting/transactions/custinvc.nl?id=' + inv_results[x].getValue(
            'internalid') + '" target="_blank">' + inv_results[x].getValue(
              'tranid') + '</a></td>';
        inlineQty += '<td>' + inv_results[x].getValue('total') + '</td>';
        inlineQty += '<td>' + inv_results[x].getText('status') + '</td>';
        inlineQty += '</tr>';
      }

      inlineQty += '</tbody></table>';
      inlineQty += '</div>';
      inlineQty += '</div>';
      inlineQty += '</div>';
    }

    if (isNullorEmpty(callcenter)) {
      var survey_tab = '';
      var service_tab = 'active';
      var notes_tab = '';
      var mpex_tab = '';
    } else {
      var notes_tab = '';
      var service_tab = 'active';
      var survey_tab = '';
      var mpex_tab = '';
    }

    inlineQty +=
      '<div class="tabs"><ul class="nav nav-tabs nav-justified" style="padding-top: 3%;">';
    inlineQty += '<li role="presentation" class="' + service_tab +
      '"><a href="#services">CURRENT SERVICES</a></li>';
    inlineQty += '<li role="presentation" class="' + mpex_tab +
      '"><a href="#mpex">MP PRODUCTS</a></li>'; // MPEX List Tab
    inlineQty += '<li role="presentation" class="' + notes_tab +
      '"><a href="#salenotes">SALE NOTES</a></li>';
    inlineQty += '<li role="presentation" class="' + survey_tab +
      '"><a href="#survey">SURVEY INFORMATION</a></li>';


    inlineQty += '</ul>';

    var tab_content = '';

    //Survey Tab Content
    tab_content += '<div role="tabpanel" class="tab-pane ' + survey_tab +
      '" id="survey">';
    tab_content += surveyInfo(ap_mail_parcel, ap_outlet, lpo_customer,
      multisite, website, service_of_interest);
    tab_content += '</div>';

    //Service Details Tab Contenet
    tab_content += '<div role="tabpanel" class="tab-pane ' + service_tab +
      '" id="services">';
    tab_content += serviceDetailsSection(resultSet_service, resultSet_service_change, callcenter);
    tab_content += '</div>';

    //For the MPEX Tab Content
    tab_content += '<div role="tabpanel" class="tab-pane ' + mpex_tab +
      '" id="mpex">';
    tab_content += mpexTab(customer_id, min_c5, min_dl, min_b4, min_1kg,
      min_3kg, min_5kg, mpex_customer, portal_training, mpex_expected_usage);
    tab_content += '</div>';

    //Sale Notes Tab Contenet
    tab_content += '<div role="tabpanel" class="tab-pane ' + notes_tab +
      '" id="salenotes">';
    tab_content += salesNotesSection(customer_id, customer_record);
    tab_content += '</div>';

    inlineQty += '<div class="tab-content" style="padding-top: 3%;">';

    inlineQty += tab_content;

    inlineQty += '</div></div>';

    if (!isNullorEmpty(callcenter) && callcenter == 'T') {
      inlineQty += callCentreButtons(salesCampaignID, phone_call_made,
        customer_status_id, resultSetContacts, resultSetAddresses,
        lead_source, saveCustomer);
    }

    //Commencement Register Details
    if (isNullorEmpty(callcenter)) {
      inlineQty += commencementDetailsSection(commReg, resultSet_service_change,
        resultServiceChange);
    }

    if (!isNullorEmpty(resultSet_service_change) && isNullorEmpty(callcenter)) {
      if (resultServiceChange.length > 0) {
        //Service Change Details
        inlineQty += serviceChangeSection(resultSet_service_change);
      }
    }

    inlineQty += '</div></div>';


    form.addField('preview_table_extras', 'inlinehtml', '').setLayoutType(
      'startrow').setDefaultValue(inlineQty);

    if (isNullorEmpty(callcenter)) {
      form.addField('upload_file_1', 'file', 'Service Commencement Form').setLayoutType(
        'outsidebelow', 'startrow').setDisplaySize(40);
    }


    if (!isNullorEmpty(resultSet_service_change) && isNullorEmpty(callcenter)) {
      if (resultServiceChange.length > 0) {
        form.addSubmitButton('FINALISE');
      } else {
        form.addSubmitButton('');
      }
    } else {
      form.addSubmitButton('');
    }
    form.addButton('cust_back', 'Back', 'onclick_summaryPage()');
    form.addButton('back', 'Reset', 'onclick_reset()');

    form.setScript('customscript_cl_finalise_page');

    response.writePage(form);

  } else {
    var custId = parseInt(request.getParameter('customer'));
    var commRegID = request.getParameter('comm_reg');
    var sales_record_id = request.getParameter('sales_record_id');
    var callcenter = request.getParameter('custpage_callcenter');
    var entity_id = request.getParameter('entityid');
    var file = request.getFile('upload_file_1');
    var create_service_change = request.getParameter('create_service_change');

    var outcome = request.getParameter('custpage_outcome');
    nlapiLogExecution('DEBUG', 'OUTCOME', outcome)
    var nosalereason = request.getParameter('custpage_nosalereason');
    var callbackdate = request.getParameter('custpage_callbackdate');
    var callbacktime = request.getParameter('custpage_callbacktime');
    var referto = request.getParameter('custpage_referto');
    var notes = request.getParameter('custpage_refernotes');
    var callnotes = request.getParameter('custpage_callnotes');
    var startdate = request.getParameter('custpage_startdate');
    var trialperiod = request.getParameter('custpage_trialperiod');

    var reject_reason = request.getParameter('custpage_rejectreason');
    var reject_notes = request.getParameter('custpage_rejectnotes');

    var sales_campaign = request.getParameter('custpage_sales_campaign_id');

    var financial_tab_item_array = request.getParameter('financial_item_array');
    var financial_tab_price_array = request.getParameter(
      'financial_price_array');
    var item_ids = request.getParameter('custpage_item_ids');

    var connect_admin = request.getParameter('custpage_connect_admin')
    var connect_user = request.getParameter('custpage_connect_user')


    nlapiLogExecution('DEBUG', 'file', file);
    nlapiLogExecution('DEBUG', 'commRegID', commRegID);

    if (isNullorEmpty(callcenter)) {
      if (!isNullorEmpty(commRegID)) {
        if (!isNullorEmpty(file)) {
          file.setFolder(1212243);

          var type = file.getType();
          if (type == 'JPGIMAGE') {
            type = 'jpg';
            var file_name = getDate() + '_' + entity_id + '.' + type;

          } else if (type == 'PDF') {
            type == 'pdf';
            var file_name = getDate() + '_' + entity_id + '.' + type;
          } else if (type == 'PNGIMAGE') {
            type == 'png';
            var file_name = getDate() + '_' + entity_id + '.' + type;
          } else if (type == 'PJPGIMAGE') {
            type == 'png';
            var file_name = getDate() + '_' + entity_id + '.' + type;
          }

          file.setName(file_name);

          // Create file and upload it to the file cabinet.
          var id = nlapiSubmitFile(file);

          var commRegRecord = nlapiLoadRecord(
            'customrecord_commencement_register', commRegID);

          commRegRecord.setFieldValue('custrecord_scand_form', id);
          commRegRecord.setFieldValue('custrecord_trial_status', 9);
          commRegRecord.setFieldValue('custrecord_finalised_by',
            nlapiGetContext().getUser());
          commRegRecord.setFieldValue('custrecord_finalised_on', getDate());

          nlapiSubmitRecord(commRegRecord);

          var searched_service_change = nlapiLoadSearch(
            'customrecord_servicechg', 'customsearch_salesp_service_chg');

          var newFilters = new Array();
          newFilters[newFilters.length] = new nlobjSearchFilter(
            "custrecord_service_customer", "CUSTRECORD_SERVICECHG_SERVICE",
            'is', custId);
          newFilters[newFilters.length] = new nlobjSearchFilter(
            "custrecord_servicechg_comm_reg", null, 'is', commRegID);
          newFilters[newFilters.length] = new nlobjSearchFilter(
            'custrecord_servicechg_status', null, 'noneof', [2, 3]);

          searched_service_change.addFilters(newFilters);

          resultSet_service_change = searched_service_change.runSearch();
          resultSet_service_change.forEachResult(function (
            searchResult_service_change) {
            var serviceChangeId = searchResult_service_change.getValue(
              'internalid');
            var serviceId = searchResult_service_change.getValue(
              "internalid", "CUSTRECORD_SERVICECHG_SERVICE", null);

            var service_change_record = nlapiLoadRecord(
              'customrecord_servicechg', serviceChangeId);
            service_change_record.setFieldValue(
              'custrecord_servicechg_status', 1);
            nlapiSubmitRecord(service_change_record);

            return true;
          });

        }
      }

      var recCustomer = nlapiLoadRecord('customer', custId);
      var partner_id = recCustomer.getFieldValue('partner');
      var partnerRecord = nlapiLoadRecord('partner', partner_id);
      var serviceFuelSurchargeToBeApplied = partnerRecord.getFieldValue(
        'custentity_service_fuel_surcharge_apply');
      var companyName = recCustomer.getFieldValue('companyname');
      var partner_text = recCustomer.getFieldText('partner');
      var lead_source_text = recCustomer.getFieldText('leadsource');
      var lead_source_id = recCustomer.getFieldValue('leadsource');
      var customer_service_fuel_surcharge = recCustomer.getFieldValue('custentity_service_fuel_surcharge');
      var day_to_day_email = recCustomer.getFieldValue(
        'custentity_email_service');
      recCustomer.setFieldValue('entitystatus', 13);
      if (isNullorEmpty(recCustomer.getFieldValue(
        'custentity_date_prospect_opportunity'))) {
        recCustomer.setFieldValue('custentity_date_prospect_opportunity',
          getDate());
      }
      recCustomer.setFieldValue('custentity_cust_closed_won', 'T');
      if ((serviceFuelSurchargeToBeApplied == 1 ||
        serviceFuelSurchargeToBeApplied == '1') && (isNullorEmpty(customer_service_fuel_surcharge) || customer_service_fuel_surcharge == '1')) {
        recCustomer.setFieldValue('custentity_service_fuel_surcharge', 1);
        if (partner_id == 218 || partner_id == 469) {
          recCustomer.setFieldValue('custentity_service_fuel_surcharge_percen',
            '5.3');
        } else {
          recCustomer.setFieldValue('custentity_service_fuel_surcharge_percen',
            '9.5');
        }

      }
      recCustomer.setFieldValue('custentity_mpex_surcharge_rate', '31.16');
      recCustomer.setFieldValue('custentity_sendle_fuel_surcharge', '6.95');
      recCustomer.setFieldValue('custentity_mpex_surcharge', 1);
      // recCustomer.setFieldValue('custentity_cust_closed_won', 'T');
      nlapiSubmitRecord(recCustomer);

      if (create_service_change == 'T') {
        var custparam_params = {
          custid: parseInt(request.getParameter('customer')),
          salesrecordid: sales_record_id,
          salesrep: 'T',
          commreg: commRegID,
          customid: 'customscript_sl_finalise_page',
          customdeploy: 'customdeploy_sl_finalise_page'
        }
        // custparam_params = JSON.stringify(custparam_params);
        nlapiSetRedirectURL('SUITELET', 'customscript_sl_create_service_change',
          'customdeploy_sl_create_service_change', null, custparam_params);
      } else {
        /**
         * [params3 description] - Params passed to delete / edit / create the financial tab
         */
        var params3 = {
          custscriptcustomer_id: parseInt(request.getParameter('customer')),
          custscriptids: item_ids.toString(),
          custscriptlinked_service_ids: null,
          custscriptfinancial_tab_array: financial_tab_item_array.toString(),
          custscriptfinancial_tab_price_array: financial_tab_price_array.toString()
        }

        var records = new Array();
        records['entity'] = custId;



        var email_subject = '';
        var email_body = ' New Customer NS ID: ' + custId +
          '</br> New Customer: ' + entity_id + ' ' + companyName +
          '</br> New Customer Franchisee NS ID: ' + partner_id +
          '</br> New Customer Franchisee Name: ' + partner_text + '';
        if (lead_source_id == 246306) {
          email_subject = 'Shopify Customer Finalised on NetSuite';
          email_body += '</br> Email: ' + day_to_day_email;
          email_body += '</br> Lead Source: ' + lead_source_text;
        } else {
          email_subject = 'New Customer Finalised on NetSuite';
        }

        if (connect_user == 1 || connect_user == 1) {
          email_body += '</br></br> Customer Portal Access - User Details';
          email_body += '</br>First Name: ' + request.getParameter(
            'custpage_connect_fn');
          email_body += '</br>Last Name: ' + request.getParameter(
            'custpage_connect_ln');
          email_body += '</br>Email: ' + request.getParameter(
            'custpage_connect_email');
          email_body += '</br>Phone: ' + request.getParameter(
            'custpage_connect_phone');

          var recCustomer_portalaccess = nlapiLoadRecord('customer', custId);
          recCustomer_portalaccess.setFieldValue('custentity_portal_access', 1);
          recCustomer_portalaccess.setFieldValue(
            'custentity_portal_how_to_guides', 2);
          nlapiSubmitRecord(recCustomer_portalaccess);

          var userJSON = '{';
          userJSON += '"customer_ns_id" : "' + custId + '",'
          userJSON += '"first_name" : "' + request.getParameter(
            'custpage_connect_fn') + '",'
          userJSON += '"last_name" : "' + request.getParameter(
            'custpage_connect_ln') + '",'
          userJSON += '"email" : "' + request.getParameter(
            'custpage_connect_email') + '",'
          userJSON += '"phone" : "' + request.getParameter(
            'custpage_connect_phone') + '"'
          userJSON += '}';

          var headers = {};
          headers['Content-Type'] = 'application/json';
          headers['Accept'] = 'application/json';
          headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';

          nlapiRequestURL('https://mpns.protechly.com/new_staff', userJSON,
            headers);

          var task = nlapiCreateRecord('task');
          task.setFieldValue('title', 'Shipping Portal - Send Invite');
          task.setFieldValue('assigned', 1706027);
          task.setFieldValue('company', custId);
          task.setFieldValue('sendemail', 'T');
          task.setFieldValue('message', notes);
          task.setFieldText('status', 'Not Started');

          nlapiSubmitRecord(task);

          nlapiSendEmail(ctx.getUser(), ['laura.busse@mailplus.com.au'],
            'New Customer Finalised - Portal Access Required', email_body, ['popie.popie@mailplus.com.au',
            'ankith.ravindran@mailplus.com.au',
            'fiona.harrison@mailplus.com.au'
          ], records, null, true)

        }

        nlapiSendEmail(ctx.getUser(), ['popie.popie@mailplus.com.au'],
          email_subject, email_body, [
          'ankith.ravindran@mailplus.com.au',
          'fiona.harrison@mailplus.com.au'
        ], records, null, true)

        var customerJSON = '{';
        customerJSON += '"ns_id" : "' + custId + '"'
        customerJSON += '}';

        var headers = {};
        headers['Content-Type'] = 'application/json';
        headers['Accept'] = 'application/json';
        headers['x-api-key'] = 'XAZkNK8dVs463EtP7WXWhcUQ0z8Xce47XklzpcBj';

        nlapiRequestURL('https://mpns.protechly.com/new_customer', customerJSON,
          headers);

        /**
         * Description - Schedule Script to create / edit / delete the financial tab items with the new details
         */
        var status = nlapiScheduleScript(
          'customscript_sc_smc_item_pricing_update', 'customdeploy1', params3
        );
        if (status == 'QUEUED') {

          response.sendRedirect('RECORD', 'customer', parseInt(request.getParameter(
            'customer')), false);
          return false;
        }

      }
    } else {
      var recCustomer = nlapiLoadRecord('customer', custId);

      var customerStatus = recCustomer.getFieldValue('entitystatus');

      var recSales = nlapiLoadRecord('customrecord_sales', parseInt(
        sales_record_id));

      var dateFirstNoContact = recSales.getFieldValue(
        'custrecord_sales_day0call');
      var dateSecondNoContact = recSales.getFieldValue(
        'custrecord_sales_day14call');
      var dateThirdNoContact = recSales.getFieldValue(
        'custrecord_sales_day25call');


      var sales_campaign_record = nlapiLoadRecord('customrecord_salescampaign',
        sales_campaign);
      var sales_campaign_type = sales_campaign_record.getFieldValue(
        'custrecord_salescampaign_recordtype');
      var sales_campaign_name = sales_campaign_record.getFieldValue('name');


      var phonecall = nlapiCreateRecord('phonecall');
      phonecall.setFieldValue('assigned', recCustomer.getFieldValue('partner'));
      phonecall.setFieldValue('custevent_organiser', nlapiGetUser());
      phonecall.setFieldValue('startdate', getDate());
      phonecall.setFieldValue('company', custId);
      phonecall.setFieldText('status', 'Completed');
      phonecall.setFieldValue('custevent_call_type', 2);


      if (outcome == 'nosale') {
        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 21);
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - No Sale');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - No Sale');
        }


        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 16);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_completedate', getDate());
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 10);
        recSales.setFieldValue('custrecord_sales_nosalereason', nosalereason);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      } else if (outcome == 'noanswer') {
        if (sales_campaign == 55) {

          recCustomer.setFieldValue('entitystatus', 20);
          phonecall.setFieldValue('title', 'Prospecting Call - GPO - No Answer');

          if (!isNullorEmpty(decison_maker)) {
            recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
          }
          if (!isNullorEmpty(site_address)) {
            recSales.setFieldValue('custrecord_sales_streetaddress_collected',
              'T');
          }

        } else {
          if (sales_campaign_type != 65) {
            recCustomer.setFieldValue('entitystatus', 35);
            phonecall.setFieldValue('title', sales_campaign_name +
              ' - No Answer - Phone Call');
          } else {
            phonecall.setFieldValue('title', sales_campaign_name +
              ' - No Answer - Phone Call');
          }

        }

        if (isNullorEmpty(dateFirstNoContact)) {
          recSales.setFieldValue('custrecord_sales_day0call', getDate());
        } else if (!isNullorEmpty(dateFirstNoContact) && isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
          recSales.setFieldValue('custrecord_sales_day14call', getDate());
        } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
          recSales.setFieldValue('custrecord_sales_day25call', getDate());
        }

        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 6);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate',
          nlapiDateToString(nlapiAddDays(nlapiStringToDate(getDate()), 5)));
        recSales.setFieldValue('custrecord_sales_callbacktime', '10:00 AM');
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 7);
        recSales.setFieldValue('custrecord_sales_attempt', parseInt(recSales.getFieldValue(
          'custrecord_sales_attempt')) + 1);

        // if (parseInt(recSales.getFieldValue('custrecord_sales_attempt')) > 3) {
        //   recSales.setFieldValue('custrecord_sales_outcome', 12);
        //   recSales.setFieldValue('custrecord_sales_completed', "T");
        //   if (sales_campaign_type != 65) {
        //     recCustomer.setFieldValue('entitystatus', 36);
        //   }
        //   recSales.setFieldValue('custrecord_sales_callbackdate', '');
        //   recSales.setFieldValue('custrecord_sales_callbacktime', '');
        // }


      } else if (outcome == 'noresponseemail') {
        if (sales_campaign == 55) {

          recCustomer.setFieldValue('entitystatus', 20);
          phonecall.setFieldValue('title', 'Prospecting Call - GPO - No Answer');

          if (!isNullorEmpty(decison_maker)) {
            recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
          }
          if (!isNullorEmpty(site_address)) {
            recSales.setFieldValue('custrecord_sales_streetaddress_collected',
              'T');
          }

        } else {
          if (sales_campaign_type != 65) {
            recCustomer.setFieldValue('entitystatus', 35);
            phonecall.setFieldValue('title', sales_campaign_name +
              ' - No Response - Email');
          } else {
            phonecall.setFieldValue('title', sales_campaign_name +
              ' - No Response - Email');
          }

        }

        if (isNullorEmpty(dateFirstNoContact)) {
          recSales.setFieldValue('custrecord_sales_day0call', getDate());
        } else if (!isNullorEmpty(dateFirstNoContact) && isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
          recSales.setFieldValue('custrecord_sales_day14call', getDate());
        } else if (!isNullorEmpty(dateFirstNoContact) && !isNullorEmpty(dateSecondNoContact) && isNullorEmpty(dateThirdNoContact)) {
          recSales.setFieldValue('custrecord_sales_day25call', getDate());
        }

        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 6);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate',
          nlapiDateToString(nlapiAddDays(nlapiStringToDate(getDate()), 5)));
        recSales.setFieldValue('custrecord_sales_callbacktime', '10:00 AM');
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 7);
        recSales.setFieldValue('custrecord_sales_attempt', parseInt(recSales.getFieldValue(
          'custrecord_sales_attempt')) + 1);

        // if (parseInt(recSales.getFieldValue('custrecord_sales_attempt')) > 3) {
        //   recSales.setFieldValue('custrecord_sales_outcome', 12);
        //   recSales.setFieldValue('custrecord_sales_completed', "T");
        //   if (sales_campaign_type != 65) {
        //     recCustomer.setFieldValue('entitystatus', 36);
        //   }
        //   recSales.setFieldValue('custrecord_sales_callbackdate', '');
        //   recSales.setFieldValue('custrecord_sales_callbacktime', '');
        // }


      } else if (outcome == 'noansweremail') {

        recCustomer.setFieldValue('entitystatus', 59);
        recCustomer.setFieldValue('custentity13', getDate());
        recCustomer.setFieldValue('custentity_service_cancellation_reason', 41);
        phonecall.setFieldValue('title', sales_campaign_name +
          ' - No Answer Email');

        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 3);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_completedate', getDate());
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 10);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

        var url =
          'https://1048144.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=395&deploy=1&compid=1048144&h=6d4293eecb3cb3f4353e&rectype=customer&template=';
        var template_id = 154;
        var newLeadEmailTemplateRecord = nlapiLoadRecord(
          'customrecord_camp_comm_template', template_id);
        var templateSubject = newLeadEmailTemplateRecord.getFieldValue(
          'custrecord_camp_comm_subject');
        var lostNoResponseEmailAttach = new Object();
        lostNoResponseEmailAttach['entity'] = custId;

        //Search for Contacts
        var searchedContacts = nlapiLoadSearch('contact',
          'customsearch_salesp_contacts');

        var newFilters = new Array();
        newFilters[newFilters.length] = new nlobjSearchFilter('company', null, 'is',
          custId);

        searchedContacts.addFilters(newFilters);

        var resultSetContacts = searchedContacts.runSearch();
        var contact_id = null;
        resultSetContacts.forEachResult(function (searchResultContacts) {
          contact_id = searchResultContacts.getValue('internalid');
          contact_count++;
          return true;
        });


        url += template_id + '&recid=' + custId + '&salesrep=' +
          nlapiGetUser() + '&dear=' + null + '&contactid=' + contact_id + '&userid=' +
          encodeURIComponent(nlapiGetContext().getUser());;
        urlCall = nlapiRequestURL(url);
        var emailHtml = urlCall.getBody();

        nlapiLogExecution('DEBUG', 'NOANSWEREMAIL - TO', recCustomer.getFieldValue('custentity_email_service'))

        nlapiSendEmail(ctx.getUser(), recCustomer.getFieldValue('custentity_email_service'), templateSubject, emailHtml, [nlapiGetContext().getEmail()], null, lostNoResponseEmailAttach, null, true);

      } else if (outcome == 'disconnected') {

        recCustomer.setFieldValue('entitystatus', 59);
        recCustomer.setFieldValue('custentity13', getDate());
        recCustomer.setFieldValue('custentity_service_cancellation_reason', 55);
        phonecall.setFieldValue('title', sales_campaign_name +
          ' - Not Established Business');



        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 3);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_completedate', getDate());
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 10);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      } else if (outcome == 'donotcall') {
        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 9);
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Do Not Call');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Do Not Call');
        }


        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 4);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_completedate', getDate());
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 9);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      } else if (outcome == 'callback') {
        if (sales_campaign == 55) {

          recCustomer.setFieldValue('entitystatus', 30);

          phonecall.setFieldValue('title', 'Prospecting Call - GPO - Callback');

          if (!isNullorEmpty(decison_maker)) {
            recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
          }
          if (!isNullorEmpty(site_address)) {
            recSales.setFieldValue('custrecord_sales_streetaddress_collected',
              'T');
          }

        } else {
          if (sales_campaign_type != 65) {
            recCustomer.setFieldValue('entitystatus', 8);
            phonecall.setFieldValue('title', sales_campaign_name +
              ' - Callback');
          } else {
            phonecall.setFieldValue('title', sales_campaign_name +
              ' - Callback');
          }

        }



        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 17);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
        recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 5);
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

        nlapiLogExecution('debug', '4. Callback Details entered');
      } else if (outcome == 'complete') {

        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 42);
          phonecall.setFieldValue('title', sales_campaign_name + ' - Complete');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Complete');
        }

        if (!isNullorEmpty(decison_maker)) {
          recSales.setFieldValue('custrecord_sales_dm_collected', 'T')
        }
        if (!isNullorEmpty(site_address)) {
          recSales.setFieldValue('custrecord_sales_streetaddress_collected',
            'T');
        }

        recSales.setFieldValue('custrecord_sales_outcome', 16);



        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 17);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());

        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

        nlapiLogExecution('debug', '4. Callback Details entered');
      } else if (outcome == 'reject') {

        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 9);
          phonecall.setFieldValue('title', 'Prospecting Call - GPO - Reject');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Reject');
        }


        phonecall.setFieldValue('message', reject_notes);
        phonecall.setFieldValue('custevent_call_outcome', 16);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_completedate', getDate());
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 17);
        recSales.setFieldValue('custrecord_sales_infoincomplete_reason',
          reject_reason);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

        nlapiLogExecution('debug', '4. Callback Details entered');
      } else if (outcome == 'sendinfo') {

        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 19);
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Info Sent');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Info Sent');
        }


        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 17);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_infosent', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
        recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 4);
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

      } else if (outcome == 'sendforms') {

        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 51);
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Forms Sent');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Forms Sent');
        }


        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 24);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_formsent', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
        recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 14);
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

      } else if (outcome == 'sendquote') {

        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 50);
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Quote Sent');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Quote Sent');
        }


        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 23);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_quotesent', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_callbackdate', callbackdate);
        recSales.setFieldValue('custrecord_sales_callbacktime', callbacktime);
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 15);
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());

      } else if (outcome == 'refer') {

        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 29);
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Referred');
        } else {
          phonecall.setFieldValue('title', sales_campaign_name +
            ' - Referred');
        }


        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 17);

        var task = nlapiCreateRecord('task');
        task.setFieldValue('title', 'Existing Customer Sales Call - Refer');
        task.setFieldValue('assigned', referto);
        task.setFieldValue('company', custId);
        task.setFieldValue('sendemail', 'T');
        task.setFieldValue('message', notes);
        task.setFieldText('status', 'Not Started');
        nlapiSubmitRecord(task);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 6);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      } else if (outcome == 'signed') {


        recCustomer.setFieldValue('entitystatus', 13);
        recCustomer.setFieldValue('salesrep', nlapiGetUser());

        phonecall.setFieldValue('title', sales_campaign_name +
          ' - Customer Signed');
        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 15);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 2);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      } else if (outcome == 'trial') {


        if (sales_campaign_type != 65) {
          recCustomer.setFieldValue('entitystatus', 32);
        }
        recCustomer.setFieldValue('salesrep', nlapiGetUser());

        phonecall.setFieldValue('title', sales_campaign_name +
          ' - Free Trial Accepted');
        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 9);

        recSales.setFieldValue('custrecord_sales_completed', "T");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 1);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
        if (!isNullorEmpty(trialperiod) && parseInt(trialperiod) > 0) {
          recSales.setFieldValue('custrecord_sales_day0call', startdate);
          recSales.setFieldValue('custrecord_sales_followup_stage', 1);
          if (parseInt(trialperiod) == 1 || parseInt(trialperiod) == 2) {
            recSales.setFieldValue('custrecord_sales_day25call',
              nlapiDateToString(nlapiAddDays(nlapiStringToDate(startdate), (
                parseInt(trialperiod) * 7) - 3)));
          } else {
            recSales.setFieldValue('custrecord_sales_day14call',
              nlapiDateToString(nlapiAddDays(nlapiStringToDate(startdate), 13))
            );
            recSales.setFieldValue('custrecord_sales_day25call',
              nlapiDateToString(nlapiAddDays(nlapiStringToDate(startdate), (
                parseInt(trialperiod) * 7) - 3)));
          }
        }
      } else if (outcome == 'opportunity') {


        recCustomer.setFieldValue('entitystatus', 58);
        recCustomer.setFieldValue('salesrep', nlapiGetUser());

        phonecall.setFieldValue('title', sales_campaign_name +
          ' - Prospect Opportunity');
        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 25);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 21);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      } else if (outcome == 'followup') {


        recCustomer.setFieldValue('entitystatus', 18);
        recCustomer.setFieldValue('salesrep', nlapiGetUser());

        phonecall.setFieldValue('title', sales_campaign_name +
          ' - Prospect Opportunity');
        phonecall.setFieldValue('message', callnotes);
        phonecall.setFieldValue('custevent_call_outcome', 25);

        recSales.setFieldValue('custrecord_sales_completed', "F");
        recSales.setFieldValue('custrecord_sales_inuse', "F");
        recSales.setFieldValue('custrecord_sales_assigned', nlapiGetUser());
        recSales.setFieldValue('custrecord_sales_outcome', 21);
        recSales.setFieldValue('custrecord_sales_callbackdate', '');
        recSales.setFieldValue('custrecord_sales_callbacktime', '');
        recSales.setFieldValue('custrecord_sales_lastcalldate', getDate());
      }

      nlapiLogExecution('debug', '5. Ready to submit records');

      nlapiSubmitRecord(recCustomer);
      nlapiLogExecution('debug', '6. Submitted Customer');
      nlapiSubmitRecord(phonecall);
      nlapiLogExecution('debug', '7. Submitted Phone call');
      nlapiSubmitRecord(recSales);
      nlapiLogExecution('debug', '8. Submitted sales record');

      response.sendRedirect('RECORD', 'customer', parseInt(request.getParameter(
        'customer')), false);
    }

  }

}

function customerDetailsSection(companyName, abn, resultSetZees, zee,
  accounts_email, daytodayphone, daytodayemail, accounts_phone, customer_status,
  lead_source, customer_industry, callcenter, account_manager) {
  var inlineQty = '<div class="form-group container company_name_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">CUSTOMER DETAILS</span></h4></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container company_name_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 company_name"><div class="input-group"><span class="input-group-addon" id="company_name_text">NAME <span class="mandatory">*</span></span><input id="company_name" class="form-control company_name" required value="' +
    companyName + '" data-oldvalue="' + companyName + '" /></div></div>';
  inlineQty +=
    '<div class="col-xs-6 industry"><div class="input-group"><span class="input-group-addon" id="industry_text">INDUSTRY <span class="mandatory">*</span></span><select id="industry" class="form-control industry" required><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist_industry_category', null, null,
    col);
  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(customer_industry)) {
      if (customer_industry == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      }
    }
    inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  }
  inlineQty += '</select></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container abn_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 abn"><div class="input-group"><span class="input-group-addon" id="abn_text">ABN ';
  nlapiLogExecution('DEBUG', 'callcenter', callcenter);
  if (isNullorEmpty(callcenter)) {
    inlineQty += '<span class="mandatory">*</span>';
    inlineQty += '</span><input id="abn" class="form-control abn" value="' +
      abn + '" data-oldvalue="' + abn + '" required/></div></div>';
  } else {
    inlineQty += '</span><input id="abn" class="form-control abn" value="' +
      abn + '" data-oldvalue="' + abn + '" /></div></div>';
  }

  inlineQty +=
    '<div class="col-xs-6 status"><div class="input-group"><span class="input-group-addon" id="status_text">STATUS </span><input id="status" class="form-control status" readonly value="' +
    customer_status + '" data-oldvalue="' + customer_status +
    '" /></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container zee_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 zee"><div class="input-group"><span class="input-group-addon" id="zee_text">FRANCHISEE <span class="mandatory">*</span></span><select id="zee" class="form-control zee" ><option value=0></option>';
  resultSetZees.forEachResult(function (searchResultZees) {

    zeeId = searchResultZees.getValue('internalid');
    zeeName = searchResultZees.getValue('companyname');

    if (zeeId == zee) {
      inlineQty += '<option value="' + zeeId + '" selected>' + zeeName +
        '</option>';
    } else {
      inlineQty += '<option value="' + zeeId + '">' + zeeName + '</option>';
    }

    return true;
  });
  inlineQty += '</select></div></div>';
  inlineQty +=
    '<div class="col-xs-6 leadsource_div"><div class="input-group"><span class="input-group-addon" id="leadsource_text">LEAD SOURCE <span class="mandatory">*</span></span>';

  //NetSuite Search: LEAD SOURCE
  var searched_lead_source = nlapiLoadSearch('campaign',
    'customsearch_lead_source');
  resultSetLeadSource = searched_lead_source.runSearch();
  inlineQty +=
    '<select id="leadsource" class="form-control leadsource" ><option></option>';

  resultSetLeadSource.forEachResult(function (searchResultLeadSource) {

    var leadsourceid = searchResultLeadSource.getValue('internalid');
    var leadsourcename = searchResultLeadSource.getValue('title');

    if (leadsourceid == lead_source) {
      inlineQty += '<option value="' + leadsourceid + '" selected>' +
        leadsourcename + '</option>';
    } else {
      inlineQty += '<option value="' + leadsourceid + '" >' +
        leadsourcename + '</option>';
    }

    return true;
  });
  inlineQty += '</select></div></div>';
  // inlineQty += '<div class="col-xs-6 leadsource_div"><div class="input-group"><span class="input-group-addon" id="leadsource_text">LEAD SOURCE </span><input id="leadsource" class="form-control leadsource" readonly value="' + lead_source + '" data-oldvalue="' + lead_source + '" required/></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container email_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 account_email_div"><div class="input-group"><span class="input-group-addon" id="account_email_text">ACCOUNTS (MAIN) EMAIL</span><input id="account_email" class="form-control account_email" data-oldvalue="' +
    accounts_email + '" value="' + accounts_email + '" /></div></div>';
  inlineQty +=
    '<div class="col-xs-6 daytodayemail_div"><div class="input-group"><span class="input-group-addon" id="daytodayemail_text">DAY-TO-DAY EMAIL</span><input id="daytodayemail" class="form-control daytodayemail" data-oldvalue="' +
    daytodayemail + '" value="' + daytodayemail + '" /></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';


  inlineQty += '<div class="form-group container phone_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 account_phone_div"><div class="input-group"><span class="input-group-addon" id="account_phone_text">ACCOUNTS (MAIN) PHONE</span><input id="account_phone" class="form-control account_phone" data-oldvalue="' +
    accounts_phone + '" value="' + accounts_phone +
    '" /> <div class="input-group-btn"><button type="button" class="btn btn-success" id="call_accounts_phone"><span class="glyphicon glyphicon-earphone"></span></button></div></div></div>';
  inlineQty +=
    '<div class="col-xs-6 daytodayphone_div"><div class="input-group"><span class="input-group-addon" id="daytodayphone_text">DAY-TO-DAY PHONE <span class="mandatory">*</span></span><input id="daytodayphone" class="form-control daytodayphone" data-oldvalue="' +
    daytodayphone + '" value="' + daytodayphone +
    '" /><div class="input-group-btn"><button type="button" class="btn btn-success" id="call_daytoday_phone"><span class="glyphicon glyphicon-earphone"></span></button></div></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container account_manager">';
      inlineQty += '<div class="row">';
      inlineQty +=
        '<div class="col-xs-6 account_manager_div"><div class="input-group"><span class="input-group-addon" id="account_manager_span">ACCOUNT MANAGER <span class="mandatory">*</span></span><select id="account_manager" class="form-control account_manager" ><option></option>';
      if (account_manager == '668711') {
        inlineQty += '<option value="668711" selected>Lee Russell</option>';
        inlineQty += '<option value="696160">Kerina Helliwell</option>';
        inlineQty += '<option value="690145">David Gdanski</option>';
        inlineQty += '<option value="668712">Belinda Urbani</option>';
      } else if (account_manager == '696160') {
        inlineQty += '<option value="668711">Lee Russell</option>';
        inlineQty += '<option value="696160" selected>Kerina Helliwell</option>';
        inlineQty += '<option value="690145">David Gdanski</option>';
        inlineQty += '<option value="668712">Belinda Urbani</option>';
      } else if (account_manager == '690145') {
        inlineQty += '<option value="668711">Lee Russell</option>';
        inlineQty += '<option value="696160">Kerina Helliwell</option>';
        inlineQty += '<option value="690145" selected>David Gdanski</option>';
        inlineQty += '<option value="668712">Belinda Urbani</option>';
      } else if (account_manager == '668712') {
        inlineQty += '<option value="668711">Lee Russell</option>';
        inlineQty += '<option value="696160">Kerina Helliwell</option>';
        inlineQty += '<option value="690145">David Gdanski</option>';
        inlineQty += '<option value="668712" selected>Belinda Urbani</option>';
      } else {
        inlineQty += '<option value="668711">Lee Russell</option>';
        inlineQty += '<option value="696160">Kerina Helliwell</option>';
        inlineQty += '<option value="690145">David Gdanski</option>';
        inlineQty += '<option value="668712">Belinda Urbani</option>';
      }
      inlineQty += '</select>';
      inlineQty += '</div></div></div>';
      inlineQty += '</div>';


  return inlineQty;

}

function addressContactsSection(resultSetAddresses, resultSetContacts, form) {
  var inlineQty = '<div class="form-group container company_name_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">ADDRESS DETAILS</span></h4></div>';
  inlineQty +=
    '<div class="col-xs-6 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">CONTACT DETAILS</span></h4></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container contacts_section">';
  inlineQty += '<div class="row">';
  inlineQty += '<div class="col-xs-6 address_div">';
  inlineQty +=
    '<table border="0" cellpadding="15" id="address" class="table table-responsive table-striped address tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #103d3987;"><tr><th style="vertical-align: middle;text-align: center;"><b>DETAILS</b></th><th style="vertical-align: middle;text-align: center;"><b>GEOCODED</b></th></tr></thead><tbody>';

  resultSetAddresses.forEachResult(function (searchResultAddresses) {
    var id = searchResultAddresses.getValue('addressinternalid', 'Address',
      null);
    var addr1 = searchResultAddresses.getValue('address1', 'Address', null);
    var addr2 = searchResultAddresses.getValue('address2', 'Address', null);
    var city = searchResultAddresses.getValue('city', 'Address', null);
    var state = searchResultAddresses.getValue('state', 'Address', null);
    var zip = searchResultAddresses.getValue('zipcode', 'Address', null);
    var lat = searchResultAddresses.getValue('custrecord_address_lat',
      'Address', null);
    var lon = searchResultAddresses.getValue('custrecord_address_lon',
      'Address', null);
    var default_shipping = searchResultAddresses.getValue(
      'isdefaultshipping', 'Address', null);
    var default_billing = searchResultAddresses.getValue('isdefaultbilling',
      'Address', null);
    var default_residential = searchResultAddresses.getValue(
      'isresidential', 'Address', null);

    if (isNullorEmpty(addr1) && isNullorEmpty(addr2)) {
      var full_address = city + ', ' + state + ' - ' + zip;
    } else if (isNullorEmpty(addr1) && !isNullorEmpty(addr2)) {
      var full_address = addr2 + ', ' + city + ', ' + state + ' - ' + zip;
    } else if (!isNullorEmpty(addr1) && isNullorEmpty(addr2)) {
      var full_address = addr1 + ', ' + city + ', ' + state + ' - ' + zip;
    } else {
      var full_address = addr1 + ', ' + addr2 + ', ' + city + ', ' + state +
        ' - ' + zip;
    }

    if (default_billing == 'T' || default_shipping == 'T') {
      if (isNullorEmpty(lon) || isNullorEmpty(lat)) {
        billing_error = 'F';
      } else {
        billing_error = 'T';
      }
    }

    if (default_shipping == 'T') {
      shipping_state = state
    }

    if (billing_error == 'F') {
      inlineQty += '<tr><td>' + full_address + '</td><td> NO </td></tr>';
    } else {
      inlineQty += '<tr><td>' + full_address + '</td><td> YES </td></tr>';
    }

    address_count++;
    return true;
  });

  inlineQty += '</tbody></table>';
  inlineQty += '</div>';
  inlineQty += '<div class="col-xs-6 contacts_div">';
  inlineQty +=
    '<table border="0" cellpadding="15" id="contacts" class="table table-responsive table-striped contacts tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #103d3987;"><tr><th style="vertical-align: middle;text-align: center;"><b>DETAILS</b></th><th style="vertical-align: middle;text-align: center;"><b>ROLE</b></th></tr></thead><tbody>';
  resultSetContacts.forEachResult(function (searchResultContacts) {
    var contact_id = searchResultContacts.getValue('internalid');
    var contact_fn = searchResultContacts.getValue('firstname');
    var contact_ln = searchResultContacts.getValue('lastname');
    var contact_phone = searchResultContacts.getValue('phone');
    var contact_email = searchResultContacts.getValue('email');
    var contact_text = searchResultContacts.getValue('formulatext');
    var contact_role = searchResultContacts.getValue('contactrole');
    var contact_role_text = searchResultContacts.getText('contactrole');
    var contact_connect_admin = searchResultContacts.getValue(
      'custentity_connect_admin');
    var contact_connect_user = searchResultContacts.getValue(
      'custentity_connect_user');

    if (contact_connect_admin == 1 || contact_connect_user == 1) {
      form.addField('custpage_connect_admin', 'text', 'Connect Admin').setDisplayType(
        'hidden').setDefaultValue(contact_connect_admin);
      form.addField('custpage_connect_user', 'text', 'Connect User').setDisplayType(
        'hidden').setDefaultValue(contact_connect_user);
      form.addField('custpage_connect_id', 'text', 'Connect User').setDisplayType(
        'hidden').setDefaultValue(contact_id);
      form.addField('custpage_connect_fn', 'text', 'Connect User').setDisplayType(
        'hidden').setDefaultValue(contact_fn);
      form.addField('custpage_connect_ln', 'text', 'Connect User').setDisplayType(
        'hidden').setDefaultValue(contact_ln);
      form.addField('custpage_connect_email', 'text', 'Connect User').setDisplayType(
        'hidden').setDefaultValue(contact_email);
      form.addField('custpage_connect_phone', 'text', 'Connect User').setDisplayType(
        'hidden').setDefaultValue(contact_phone);
    }
    inlineQty += '<tr class="text-center"><td>' + contact_text +
      '</td><td>' + contact_role_text + '</td></tr>';

    contact_count++;
    return true;
  });
  inlineQty += '</tbody></table>';
  inlineQty += '</div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container reviewaddress_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-3 reviewaddress"><input type="button" value="ADD/EDIT ADDRESSES" class="form-control btn btn-primary" style="background-color: #095c7b;" id="reviewaddress" /></div>';
  inlineQty += '<div class="col-xs-3 "></div>';
  inlineQty +=
    '<div class="col-xs-3 reviewcontacts"><input type="button" value="ADD/EDIT CONTACTS" class="form-control btn btn-primary" style="background-color: #095c7b;" id="reviewcontacts" /></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';


  return inlineQty;
}

function commencementDetailsSection(commReg, resultSet_service_change,
  resultServiceChange) {

  var commRegRecord;
  var dateofentry;
  var date_signup;
  var sale_type;
  var date_comm;
  var in_out;

  if (!isNullorEmpty(commReg)) {
    commRegRecord = nlapiLoadRecord('customrecord_commencement_register',
      commReg);
    dateofentry = commRegRecord.getFieldValue('custrecord_date_entry');
    date_signup = commRegRecord.getFieldValue('custrecord_comm_date_signup');
    date_signup = GetFormattedDate(date_signup);
    sale_type = commRegRecord.getFieldValue('custrecord_sale_type');
    date_comm = commRegRecord.getFieldValue('custrecord_comm_date');
    date_comm = GetFormattedDate(date_comm);
    in_out = commRegRecord.getFieldValue('custrecord_in_out');
  }

  var inlineQty = '<div class="form-group container commencement_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-12 heading4"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">COMMENCEMENT DETAILS</span></h4></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container dateofentry_section">';
  inlineQty += '<div class="row">';
  if (isNullorEmpty(dateofentry)) {
    inlineQty +=
      '<div class="col-xs-6 dateofentry"><div class="input-group"><span class="input-group-addon" id="dateofentry_text">DATE OF ENTRY</span><input type="text" id="dateofentry" class="form-control dateofentry" value="' +
      getDate() + '" readonly/></div></div>';
  } else {
    inlineQty +=
      '<div class="col-xs-6 dateofentry"><div class="input-group"><span class="input-group-addon" id="dateofentry_text">DATE OF ENTRY</span><input type="text" id="dateofentry" class="form-control dateofentry" value="' +
      dateofentry + '" readonly/></div></div>';
  }
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container dates_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 commencementdate"><div class="input-group"><span class="input-group-addon" id="commencementdate_text">DATE - COMMENCEMENT <span class="mandatory">*</span></span><input type="date" id="commencementdate" class="form-control commencementdate" data-oldvalue="' +
    date_comm + '" value="' + date_comm + '" data-commregid="' + commReg +
    '" required/></div></div>';
  inlineQty +=
    '<div class="col-xs-6 signupdate"><div class="input-group"><span class="input-group-addon" id="signupdate_text">DATE - SIGNUP <span class="mandatory">*</span></span><input type="date" id="signupdate" class="form-control signupdate" data-oldvalue="' +
    date_signup + '" value="' + date_signup + '" required/></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container details_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 commencementtype"><div class="input-group"><span class="input-group-addon" id="commencementtype_text">COMMENCEMENT TYPE <span class="mandatory">*</span></span><select id="commencementtype" class="form-control commencementtype" required><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist_sale_type', null, null, col);
  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(sale_type)) {
      if (sale_type == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      }
    }
    inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  }
  inlineQty += '</select></div></div>';
  inlineQty +=
    '<div class="col-xs-6 inoutbound"><div class="input-group"><span class="input-group-addon" id="inoutbound_text">INBOUND/OUTBOUND <span class="mandatory">*</span></span><select id="inoutbound" class="form-control inoutbound" required><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist_in_outbound', null, null, col);
  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(in_out)) {
      if (in_out == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      }
    }
    inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  }
  inlineQty += '</select></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container details_section">';
  inlineQty += '<div class="row"><div class="col-xs-6 upload">';
  if (!isNullorEmpty(commReg)) {
    var commRegRecord = nlapiLoadRecord('customrecord_commencement_register',
      commReg);
    var file_id = commRegRecord.getFieldValue('custrecord_scand_form');

    if (!isNullorEmpty(file_id)) {
      var fileRecord = nlapiLoadFile(file_id);
      inlineQty +=
        '<iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" src="' +
        fileRecord.getURL() + '"></iframe>';
    } else {
      inlineQty +=
        '<iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" style="display: none;"></iframe>';
    }
  } else {

    // inlineQty += '<div class="input-group"><span class="input-group-addon" id="scf_text">UPLOAD SCF <span class="mandatory">*</span></span><input type="file" class="form-control fileToUpload" name="fileToUpload" id="fileToUpload"></div></br>';
    inlineQty +=
      '<iframe id="viewer" frameborder="0" scrolling="no" width="400" height="600" style="display: none;"></iframe>';
  }
  inlineQty += '</div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  if (isNullorEmpty(resultSet_service_change) || resultServiceChange.length ==
    0) {
    inlineQty += '<div class="form-group container createservicechg_section">';
    inlineQty += '<div class="row">';
    inlineQty +=
      '<div class="col-xs-3 createservicechg"><input type="button" value="CREATE SERVICE CHANGE" class="form-control btn btn-success" id="createservicechg" /></div>';
    inlineQty += '</div>';
    inlineQty += '</div>';
  }

  return inlineQty;
}

function serviceDetailsSection(resultSet_service, resultServiceChange, callcenter) {

  var inlineQty = '';
  // inlineQty += '<div class="form-group container ampo_section">';
  // inlineQty += '<div class="row">';
  // inlineQty +=
  //   '<div class="col-xs-12 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">FRANCHISEE ENTERED SERVICE DETAILS</span></h4></div>';
  // inlineQty += '</div>';
  // inlineQty += '</div>';

  // inlineQty += '<div class="form-group container ampo_section">';
  // inlineQty += '<div class="row">';
  // inlineQty +=
  //   '<div class="col-xs-6 ampo_price_div"><div class="input-group"><span class="input-group-addon" id="ampo_price_text">AMPO PRICE';
  // if (role == 1000) {
  //   inlineQty += ' <span class="mandatory">*</span>';
  // }
  // inlineQty += '</span><input id="ampo_price" class="form-control ampo_price" ';
  // if (role == 1000) {
  //   inlineQty += 'required';
  // }
  // inlineQty += ' value="' + ampo_price + '" data-oldvalue="' + ampo_price +
  //   '" /></div></div>';
  // inlineQty +=
  //   '<div class="col-xs-6 ampo_time_div"><div class="input-group"><span class="input-group-addon" id="ampo_time_text">AMPO TIME ';
  // if (role == 1000) {
  //   inlineQty += ' <span class="mandatory">*</span>';
  // }
  // inlineQty +=
  //   '</span><select id="ampo_time" class="form-control ampo_time"><option></option>';
  // var columns = new Array();
  // columns[0] = new nlobjSearchColumn('name');
  // columns[1] = new nlobjSearchColumn('internalId');

  // var industry_search = nlapiCreateSearch('customlist_service_time_range', null,
  //   columns)
  // var resultSetIndustry = industry_search.runSearch();
  // resultSetIndustry.forEachResult(function (searchResult) {

  //   var listValue = searchResult.getValue('name');
  //   var listID = searchResult.getValue('internalId');
  //   if (!isNullorEmpty(ampo_time)) {
  //     if (ampo_time == listID) {
  //       inlineQty += '<option value="' + listID + '" selected>' + listValue +
  //         '</option>';
  //     }
  //   }
  //   inlineQty += '<option value="' + listID + '">' + listValue +
  //     '</option>';

  //   return true;
  // });
  // inlineQty += '</select></div></div>';
  // inlineQty += '</div>';
  // inlineQty += '</div>';

  // inlineQty += '<div class="form-group container ampo_section">';
  // inlineQty += '<div class="row">';
  // inlineQty +=
  //   '<div class="col-xs-6 pmpo_price_div"><div class="input-group"><span class="input-group-addon" id="pmpo_price_text">PMPO PRICE ';
  // if (role == 1000) {
  //   inlineQty += '<span class="mandatory">*</span>';
  // }
  // inlineQty += '</span><input id="pmpo_price" class="form-control pmpo_price"';
  // if (role == 1000) {
  //   inlineQty += ' required ';
  // }
  // 0
  // inlineQty += 'value="' + ampo_price + '" data-oldvalue="' + ampo_price +
  //   '" /></div></div>';
  // inlineQty +=
  //   '<div class="col-xs-6 pmpo_time_div"><div class="input-group"><span class="input-group-addon" id="pmpo_time_text">PMPO TIME ';
  // if (role == 1000) {
  //   inlineQty += '<span class="mandatory">*</span>';
  // }
  // inlineQty +=
  //   '</span><select id="pmpo_time" class="form-control pmpo_time"><option></option>';
  // var columns = new Array();
  // columns[0] = new nlobjSearchColumn('name');
  // columns[1] = new nlobjSearchColumn('internalId');

  // var industry_search = nlapiCreateSearch('customlist_service_time_range', null,
  //   columns)
  // var resultSetIndustry = industry_search.runSearch();
  // resultSetIndustry.forEachResult(function (searchResult) {

  //   var listValue = searchResult.getValue('name');
  //   var listID = searchResult.getValue('internalId');
  //   if (!isNullorEmpty(pmpo_time)) {
  //     if (pmpo_time == listID) {
  //       inlineQty += '<option value="' + listID + '" selected>' + listValue +
  //         '</option>';
  //     }
  //   }
  //   inlineQty += '<option value="' + listID + '">' + listValue +
  //     '</option>';

  //   return true;
  // });
  // inlineQty += '</select></div></div>';
  // inlineQty += '</div>';
  // inlineQty += '</div>';

  inlineQty += '<div class="form-group container service_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-12 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">CURRENT SERVICES PERFORMED</span></h4></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';
  inlineQty += '<div class="form-group container service_section">';
  inlineQty += '<div class="row">';
  inlineQty += '<div class="col-xs-12 service_div">';
  inlineQty +=
    '<table border="0" cellpadding="15" id="service" class="table table-responsive table-striped service tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #103d3987;"><tr><th style="vertical-align: middle;text-align: center;"><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>SERVICE DESCRIPTION</b></th><th style="vertical-align: middle;text-align: center;"><b>SERVICE PRICE</b></th><th style="vertical-align: middle;text-align: center;"><b>MON</b></th><th style="vertical-align: middle;text-align: center;"><b>TUE</b></th><th style="vertical-align: middle;text-align: center;"><b>WED</b></th><th style="vertical-align: middle;text-align: center;"><b>THU</b></th><th style="vertical-align: middle;text-align: center;"><b>FRI</b></th><th style="vertical-align: middle;text-align: center;"><b>ADHOC</b></th></tr></thead><tbody>';
  resultSet_service.forEachResult(function (searchResult_service) {
    var serviceId = searchResult_service.getValue('internalid');
    var serviceTypeId = searchResult_service.getText("internalid",
      "CUSTRECORD_SERVICE", null);
    var serviceText = searchResult_service.getText('custrecord_service');
    var serviceDescp = searchResult_service.getValue(
      'custrecord_service_description');
    var servicePrice = searchResult_service.getValue(
      'custrecord_service_price');

    inlineQty += '<tr>';

    inlineQty +=
      '<td><div class="service_name_div"><input id="service_name" class="form-control service_name_current" data-serviceid="' +
      serviceId + '" data-servicetypeid="' + serviceTypeId +
      '" readonly value="' + serviceText + '" /></div></td>';

    inlineQty +=
      '<td><div class="service_descp_div"><input class="form-control service_descp_class_current" disabled value="' +
      serviceDescp + '"  type="text" /></div></td>';

    inlineQty +=
      '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control old_service_price_class" disabled value="' +
      servicePrice + '"  type="number" step=".01" /></div></td>';

    if (searchResult_service.getValue('custrecord_service_day_mon') == 'T') {
      inlineQty +=
        '<td><div class="daily"><input class="monday_class"   type="checkbox" disabled checked/></div></td>';
    } else {
      inlineQty +=
        '<td><div class="daily"><input class="monday_class"   type="checkbox" disabled /></div></td>';
    }

    if (searchResult_service.getValue('custrecord_service_day_tue') == 'T') {
      inlineQty +=
        '<td><div class="daily"><input class="tuesday_class"   type="checkbox" disabled checked/></div></td>';
    } else {
      inlineQty +=
        '<td><div class="daily"><input class="tuesday_class"   type="checkbox" disabled/></div></td>';
    }

    if (searchResult_service.getValue('custrecord_service_day_wed') == 'T') {
      inlineQty +=
        '<td><div class="daily"><input class="wednesday_class"   type="checkbox" disabled checked/></div></td>';
    } else {
      inlineQty +=
        '<td><div class="daily"><input class="wednesday_class"   type="checkbox" disabled /></div></td>';
    }

    if (searchResult_service.getValue('custrecord_service_day_thu') == 'T') {
      inlineQty +=
        '<td><div class="daily"><input class="thursday_class"   type="checkbox" disabled checked/></div></td>';
    } else {
      inlineQty +=
        '<td><div class="daily"><input class="thursday_class"   type="checkbox" disabled /></div></td>';
    }

    if (searchResult_service.getValue('custrecord_service_day_fri') == 'T') {
      inlineQty +=
        '<td><div class="daily"><input class="friday_class"   type="checkbox" disabled checked/></div></td>';
    } else {
      inlineQty +=
        '<td><div class="daily"><input class="friday_class"   type="checkbox" disabled /></div></td>';
    }

    if (searchResult_service.getValue('custrecord_service_day_adhoc') ==
      'T') {
      inlineQty +=
        '<td><div class="daily"><input class="adhoc_class"   type="checkbox" disabled checked /></div></td>';
    } else {
      inlineQty +=
        '<td><div class="daily"><input class="adhoc_class"   type="checkbox" disabled /></div></td>';
    }

    inlineQty += '</tr>';
    return true;
  });
  inlineQty += '</tbody></table>';
  inlineQty += '</div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  // var searched_service_change = nlapiLoadSearch('customrecord_servicechg',
  //   'customsearch_salesp_service_chg');

  // var newFilters = new Array();
  // newFilters[newFilters.length] = new nlobjSearchFilter(
  //   "custrecord_service_customer", "CUSTRECORD_SERVICECHG_SERVICE", 'is',
  //   custId);
  // newFilters[newFilters.length] = new nlobjSearchFilter(
  //   "custrecord_servicechg_comm_reg", null, 'is', commReg);
  // newFilters[newFilters.length] = new nlobjSearchFilter(
  //   'custrecord_servicechg_status', null, 'anyof', [1, 2, 4]);

  // searched_service_change.addFilters(newFilters);

  // resultSet_service_change = searched_service_change.runSearch();

  if (!isNullorEmpty(callcenter)) {
    inlineQty += serviceChangeSectionV2(resultServiceChange);
  }

  return inlineQty;
}

function serviceChangeSectionV2(resultSet_service_change, closed_won, opp_with_value) {
  var inlinehTML = '';

  inlinehTML += '<div class="form-group container service_section">';
  inlinehTML += '<div class="row">';
  inlinehTML +=
    '<div class="col-xs-12 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">SERVICE CHANGE SCHEDULED</span></h4></div>';
  inlinehTML += '</div>';
  inlinehTML += '</div>';

  inlinehTML += '<div class="form-group container service_chg_section">';
  inlinehTML += '<div class="row">';
  inlinehTML += '<div class="col-xs-12 service_chg_div">';
  inlinehTML +=
    '<table border="0" cellpadding="15" id="service_chg" class="table table-responsive table-striped service_chg tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #103d3987;"><tr><th style="vertical-align: middle;text-align: center;"><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>CHANGE TYPE</b></th><th style="vertical-align: middle;text-align: center;"><b>DATE EFFECTIVE</b></th><th style="vertical-align: middle;text-align: center;"><b>OLD PRICE</b></th><th style="vertical-align: middle;text-align: center;"><b>NEW PRICE</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th></tr></thead><tbody>';
  if (!isNullorEmpty(resultSet_service_change)) {
    resultSet_service_change.forEachResult(function (searchResult_service_change) {
      var serviceChangeId = searchResult_service_change.getValue(
        'internalid');
      var serviceId = searchResult_service_change.getValue(
        'custrecord_servicechg_service');
      var serviceText = searchResult_service_change.getText(
        'custrecord_servicechg_service');
      var serviceDescp = searchResult_service_change.getValue(
        "custrecord_service_description", "CUSTRECORD_SERVICECHG_SERVICE",
        null);
      var oldServicePrice = searchResult_service_change.getValue(
        "custrecord_service_price", "CUSTRECORD_SERVICECHG_SERVICE", null
      );
      var newServiceChangePrice = searchResult_service_change.getValue(
        'custrecord_servicechg_new_price');
      var dateEffective = searchResult_service_change.getValue(
        'custrecord_servicechg_date_effective');
      var commRegId = searchResult_service_change.getValue(
        'custrecord_servicechg_comm_reg');
      var serviceChangeTypeText = searchResult_service_change.getValue(
        'custrecord_servicechg_type');
      var serviceChangeFreqText = searchResult_service_change.getText(
        'custrecord_servicechg_new_freq');

      inlinehTML += '<tr>';

      inlinehTML +=
        '<td><input id="" class="form-control " data-serviceid="' +
        serviceId + '" data-servicetypeid="" readonly value="' +
        serviceText + '" /></td>';
      inlinehTML +=
        '<td><input id="" class="form-control " readonly value="' +
        serviceChangeTypeText + '" /></td>';
      inlinehTML +=
        '<td><input id="" class="form-control " readonly value="' +
        dateEffective + '" /></td>';
      inlinehTML +=
        '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control " disabled value="' +
        oldServicePrice + '"  type="number" step=".01" /></div></td>';
      inlinehTML +=
        '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control " disabled value="' +
        newServiceChangePrice + '"  type="number" step=".01" /></div></td>';

      inlinehTML +=
        '<td style="font-size: xx-small;"><input class="form-control new_service_freq" disabled value="' +
        serviceChangeFreqText + '"/></td>';
      var fileID = searchResult_service_change.getValue(
        "custrecord_scand_form", "CUSTRECORD_SERVICECHG_COMM_REG", null);

      // if (!isNullorEmpty(fileID)) {
      //  var fileRecord = nlapiLoadFile(fileID);
      //  inlinehTML += '<td><a href="' + fileRecord.getURL() + '" target="_blank">' + searchResult_service_change.getText("custrecord_scand_form", "CUSTRECORD_SERVICECHG_COMM_REG", null) + '</a></td>';
      // } else {
      //  inlinehTML += '<td></td>';
      // }


      inlinehTML += '</tr>';
      return true;
    });
  }
  inlinehTML += '</tbody></table>';
  inlinehTML += '</div>';
  inlinehTML += '</div>';
  inlinehTML += '</div>';

  return inlinehTML;
}

function surveyInfo(ap_mail_parcel, ap_outlet, lpo_customer, multisite, website, service_of_interest) {
  var inlineQty = '<div class="form-group container survey_section">';
  inlineQty += '<div class="row">';
  // inlineQty += '<div class="col-xs-4 survey1"><div class="input-group"><span class="input-group-addon" id="survey1_text">Using AusPost for Mail & Parcel? <span class="mandatory">*</span></span><select id="survey1" class="form-control survey1" required><option></option>';
  // var col = new Array();
  // col[0] = new nlobjSearchColumn('name');
  // col[1] = new nlobjSearchColumn('internalId');
  // var results = nlapiSearchRecord('customlist_yes_no_unsure', null, null, col);
  // for (var i = 0; results != null && i < results.length; i++) {
  //  var res = results[i];
  //  var listValue = res.getValue('name');
  //  var listID = res.getValue('internalId');
  //  if (!isNullorEmpty(ap_mail_parcel)) {
  //      if (ap_mail_parcel == listID) {
  //          inlineQty += '<option value="' + listID + '" selected>' + listValue + '</option>';
  //      } else {
  //          inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  //      }
  //  } else {
  //      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  //  }

  // }
  // inlineQty += '</select></div></div>';
  // inlineQty += '<div class="col-xs-3 survey2"><div class="input-group"><span class="input-group-addon" id="survey2_text">Using AusPost Outlet? <span class="mandatory">*</span></span><select id="survey2" class="form-control survey2" required><option></option>';
  // for (var i = 0; results != null && i < results.length; i++) {
  //  var res = results[i];
  //  var listValue = res.getValue('name');
  //  var listID = res.getValue('internalId');
  //  if (!isNullorEmpty(ap_outlet)) {
  //      if (ap_outlet == listID) {
  //          inlineQty += '<option value="' + listID + '" selected>' + listValue + '</option>';
  //      } else {
  //          inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  //      }
  //  } else {
  //      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  //  }
  // }
  // inlineQty += '</select></div></div>';
  // inlineQty += '<div class="col-xs-4 survey3"><div class="input-group"><span class="input-group-addon" id="survey3_text">Is this Auspost outlet a LPO? <span class="mandatory">*</span></span><select id="survey3" class="form-control survey3" required><option></option>';
  // for (var i = 0; results != null && i < results.length; i++) {
  //  var res = results[i];
  //  var listValue = res.getValue('name');
  //  var listID = res.getValue('internalId');
  //  if (!isNullorEmpty(lpo_customer)) {
  //      if (lpo_customer == listID) {
  //          inlineQty += '<option value="' + listID + '" selected>' + listValue + '</option>';
  //      } else {
  //          inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  //      }
  //  } else {
  //      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
  //  }
  // }
  // inlineQty += '</select></div></div>';
  inlineQty +=
    '<div class="col-xs-6 services_of_interest_div"><div class="input-group"><span class="input-group-addon" id="multisite_text">Servicews of Interest </span><select id="services_of_interest" class="form-control services_of_interest_div" ><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist1081', null, null, col);

  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(service_of_interest)) {
      if (service_of_interest == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      } else {
        inlineQty += '<option value="' + listID + '">' + listValue +
          '</option>';
      }
    } else {
      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
    }
  }

  inlineQty += '</select></div></div>';
  inlineQty +=
    '<div class="col-xs-6 multisite"><div class="input-group"><span class="input-group-addon" id="multisite_text">Multisite? </span><select id="multisite" class="form-control multisite" ><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist_yes_no_unsure', null, null, col);

  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(multisite)) {
      if (multisite == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      } else {
        inlineQty += '<option value="' + listID + '">' + listValue +
          '</option>';
      }
    } else {
      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
    }
  }

  inlineQty += '</select></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container multisite_section">';
  inlineQty += '<div class="row">';

  inlineQty +=
    '<div class="col-xs-6 website"><div class="input-group"><span class="input-group-addon" id="survey2_text">MULTISITE WEB LINK </span><input id="website" type="text" class="form-control website" value="' +
    website + '" /></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  return inlineQty;

}

function callCentreButtons(salesCampaign_id, phone_call_made, customer_status,
  resultSetContacts, resultSetAddresses, lead_source, saveCustomer) {

  var inlineQty = '<div class="container" style="padding-top: 5%;">';


  inlineQty += '<div class="form-group container callback_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-2 callback"><input type="button" id="callback" class="form-control callback btn btn-info" value="UPDATE" onclick="onclick_Update()"/></div>';
  inlineQty +=
    '<div class="col-xs-3 noanswer"><input type="button" id="offpeakpipeline" class="form-control offpeakpipeline btn btn-warning" value="NO ANSWER - PHONE CALL" onclick="onclick_NoAnswer()"/></div>';
  if (customer_status != '13') {
    inlineQty +=
      '<div class="col-xs-2 sendinfo"><input type="button" id="signed" class="form-control sendinfo btn btn-success" value="SIGNED" onclick="onclick_SendEmailSigned();" data-id="signed" /></div>';
  } else if (saveCustomer == 1 && customer_status == '13') {
    inlineQty +=
      '<div class="col-xs-2 sendinfo"><input type="button" id="signed" class="form-control sendinfo btn btn-success" value="NOTIFY IT TEAM" onclick="onclick_notifyitteam();" data-id="signed" /></div>';
  } else {
    inlineQty +=
      '<div class="col-xs-2 sendinfo"><input type="button" id="sendemail" class="form-control sendinfo btn btn-success" value="SEND EMAIL" onclick="onclick_SendEmailQuote();" data-id="sendemail" /></div>';
  }

  inlineQty +=
    '<div class="col-xs-2 noansweremail"><input type="button" id="offpeakpipeline" class="form-control noansweremail btn btn-danger" value="LOST - NO RESPONSE" onclick="onclick_NoAnswerEmail()"/></div>';




  inlineQty += '</div>';
  inlineQty += '</div>';

  // inlineQty += '<div class="form-group container callback_section">';
  // inlineQty += '<div class="row">';

  // inlineQty += '</div>';
  // inlineQty += '</div>';

  // inlineQty += '<div class="form-group container callback_section">';
  // inlineQty += '<div class="row">';

  // inlineQty += '</div>';
  // inlineQty += '</div>';

  inlineQty += '<div class="form-group container noanswer_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-2 setAppointment"><input type="button" id="setAppointment" class="form-control setAppointment btn btn-primary" value="SET APPOINTMENT" onclick="onclick_Callback()"/></div>';

  inlineQty +=
    '<div class="col-xs-3 noanswer"><input type="button" id="noresponseemail" class="form-control offpeakpipeline btn btn-warning" value="NO RESPONSE - EMAIL" onclick="onclick_NoResponseEmail()"/></div>';
  if (customer_status != '13') {
    inlineQty +=
      '<div class="col-xs-2 sendinfo"><input type="button" id="quote" class="form-control sendinfo btn btn-success" value="QUOTE" onclick="onclick_SendEmailQuote();" data-id="quote"/></div>';
  } else if (saveCustomer == 1 && customer_status == '13') {
    inlineQty +=
      '<div class="col-xs-2 sendinfo"><input type="button" id="signed" class="form-control sendinfo btn btn-success" value="QUOTE (WIN-BACK)" onclick="onclick_SendEmailQuoteSaveCustomer();" data-id="signed" /></div>';
  } else {
    inlineQty +=
      '<div class="col-xs-3 nosale"><input type="button" id="nocontact" class="form-control nosale btn btn-danger" required value="NO SALE / NO CONTACT" onclick="onclick_NoSale()"/></div>';
  }
  inlineQty +=
    '<div class="col-xs-2 notestablished"><input type="button" id="disconnected" class="form-control notestablished btn btn-danger" value="NOT ESTABLISHED" onclick="onclick_NotEstablished()"/></div>';





  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container noanswer_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-2 reassign"><input type="button" id="reassign" class="form-control reassign btn btn-warning" value="ASSIGN TO REP" onclick="onclick_reassign()"/></div>';
  inlineQty +=
    '<div class="col-xs-3 offpeakpipeline"><input type="button" id="offpeakpipeline" class="form-control offpeakpipeline btn btn-warning" value="PARKING LOT" onclick="onclick_OffPeak()"/></div>';
  inlineQty +=
    '<div class="col-xs-2 sendinfo"><input type="button" id="followup" class="form-control sendinfo btn btn-success" value="FOLLOW-UP" onclick="onclick_Followup();" /></div>';
  // inlineQty +=
  //   '<div class="col-xs-2 sendinfo"></div>';
  inlineQty +=
    '<div class="col-xs-2 nosale"><input type="button" id="nosale" class="form-control nosale btn btn-danger" required value="LOST" onclick="onclick_NoSale()"/></div>';


  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container noanswer_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-2"></div>';
  inlineQty +=
    '<div class="col-xs-2"></div>';
  inlineQty +=
    '<div class="col-xs-2"></div>';


  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '</div>';
  return inlineQty;
}

function serviceChangeSection(resultSet_service_change) {
  var inlineQty =
    '<div class="form-group container service_chg_details_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-12 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">SERVICE CHANGE DETAILS</span></h4></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';


  inlineQty += '<div class="form-group container service_chg_section">';
  inlineQty += '<div class="row">';
  inlineQty += '<div class="col-xs-12 service_chg_div">';
  inlineQty +=
    '<table border="0" cellpadding="15" id="service_chg" class="table table-responsive table-striped service_chg tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #103d3987;"><tr style="font-size: xx-small;"><th style="vertical-align: middle;text-align: center;"><b>ACTION</b></th><th style="vertical-align: middle;text-align: center;"><b>SERVICE NAME</b></th><th style="vertical-align: middle;text-align: center;"><b>DESCRIPTION</b></th><th style="vertical-align: middle;text-align: center;"><b>DATE EFFECTIVE</b></th><th class="col-xs-2" style="vertical-align: middle;text-align: center;"><b>OLD PRICE</b></th><th class="col-xs-2" style="vertical-align: middle;text-align: center;"><b>NEW PRICE</b></th><th style="vertical-align: middle;text-align: center;"><b>FREQUENCY</b></th></tr></thead><tbody>';

  resultSet_service_change.forEachResult(function (searchResult_service_change) {
    var serviceChangeId = searchResult_service_change.getValue('internalid');
    var serviceId = searchResult_service_change.getValue(
      'custrecord_servicechg_service');
    var serviceText = searchResult_service_change.getText(
      'custrecord_servicechg_service');
    var serviceDescp = searchResult_service_change.getValue(
      "custrecord_service_description", "CUSTRECORD_SERVICECHG_SERVICE",
      null);
    var serviceTypeID = searchResult_service_change.getValue(
      "custrecord_service", "CUSTRECORD_SERVICECHG_SERVICE", null);
    var oldServicePrice = searchResult_service_change.getValue(
      "custrecord_service_price", "CUSTRECORD_SERVICECHG_SERVICE", null);
    var nsItem = searchResult_service_change.getValue(
      "custrecord_service_ns_item", "CUSTRECORD_SERVICECHG_SERVICE", null
    );
    var newServiceChangePrice = searchResult_service_change.getValue(
      'custrecord_servicechg_new_price');
    var dateEffective = searchResult_service_change.getValue(
      'custrecord_servicechg_date_effective');
    var commRegId = searchResult_service_change.getValue(
      'custrecord_servicechg_comm_reg');
    var serviceChangeTypeText = searchResult_service_change.getText(
      'custrecord_servicechg_type');
    var serviceChangeFreqText = searchResult_service_change.getText(
      'custrecord_servicechg_new_freq');

    inlineQty += '<tr>';

    inlineQty +=
      '<td><button class="btn btn-warning btn-xs edit_class glyphicon glyphicon-pencil" data-dateeffective="' +
      dateEffective + '" data-commreg="' + commRegId +
      '" type="button" data-toggle="tooltip" data-placement="right" title="Edit"></button></td>';


    inlineQty +=
      '<td><input id="service_name" class="form-control service_name" data-serviceid="' +
      serviceId + '" data-servicetypeid="' + serviceTypeID + '" data-ns="' +
      nsItem + '" readonly value="' + serviceText + '" /></td>';
    inlineQty +=
      '<td><input id="service_chg_descp" class="form-control service_descp" readonly value="' +
      serviceDescp + '" /></td>';
    inlineQty +=
      '<td><input id="date_effective" class="form-control date_effective" readonly value="' +
      dateEffective + '" /></td>';
    inlineQty +=
      '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control old_service_price_class" disabled value="' +
      oldServicePrice + '"  type="number" step=".01" /></div></td>';
    inlineQty +=
      '<td><div class="service_price_div input-group"><span class="input-group-addon">$</span><input class="form-control new_service_price_class" disabled value="' +
      parseFloat(newServiceChangePrice).toFixed(2) +
      '"  type="number" step=".01" /></div></td>';

    inlineQty +=
      '<td style="font-size: xx-small;"><input class="form-control new_service_freq" disabled value="' +
      serviceChangeFreqText + '"/></td>';
    var fileID = searchResult_service_change.getValue(
      "custrecord_scand_form", "CUSTRECORD_SERVICECHG_COMM_REG", null);

    inlineQty += '</tr>';
    return true;
  });
  inlineQty += '</tbody></table>';
  inlineQty += '</div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  return inlineQty;
}

function salesNotesSection(custId, recCustomer) {

  var notesVal = '';
  var pricingNotes = '';

  if (!isNullorEmpty(recCustomer.getFieldValue(
    'custentity_customer_pricing_notes'))) {
    pricingNotes += recCustomer.getFieldValue(
      'custentity_customer_pricing_notes') + '\n'
  }

  var filters = new Array();
  filters[0] = new nlobjSearchFilter('company', null, 'anyof', custId);

  var columns = new Array();
  columns[0] = new nlobjSearchColumn('createddate');
  columns[1] = new nlobjSearchColumn('completeddate');
  columns[2] = new nlobjSearchColumn('type');
  columns[3] = new nlobjSearchColumn('assigned');
  columns[4] = new nlobjSearchColumn('title');
  columns[5] = new nlobjSearchColumn('message');
  columns[6] = new nlobjSearchColumn('custevent_organiser');

  var notesSearch = nlapiSearchRecord('activity',
    'customsearch_salescamp_activity', filters, columns);

  var inlineQty = '';
  inlineQty += '<div class="form-group container contacts_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-6 sale_notes"><div class="input-group"><span class="input-group-addon" id="sale_notes_text">NOTES </span><textarea id="sale_notes" class="form-control sale_notes" rows="4" cols="50" >' +
    notesVal + '</textarea></div></div>';
  inlineQty +=
    '<div class="col-xs-6 pricing_notes"><div class="input-group"><span class="input-group-addon" id="gsale_notes_text">PRICING NOTES </span><textarea id="pricing_notes" class="form-control pricing_notes" rows="4" cols="50" >' +
    pricingNotes + '</textarea></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';
  if (!isNullorEmpty(notesSearch)) {

    inlineQty += '<div class="form-group container contacts_section">';
    inlineQty += '<div class="row">';
    inlineQty += '<div class="col-xs-12 address_div">';
    inlineQty +=
      '<table border="0" cellpadding="15" id="address" class="table table-responsive table-striped address tablesorter" cellspacing="0" style="width: 100%;"><thead style="color: white;background-color: #607799;"><tr><th style="vertical-align: middle;text-align: center;"><b>CREATED DATE</b></th><th style="vertical-align: middle;text-align: center;"><b>COMPLETED DATE</b></th><th style="vertical-align: middle;text-align: center;"><b>ORGANISER</b></th><th style="vertical-align: middle;text-align: center;"><b>TITLE</b></th><th style="vertical-align: middle;text-align: center;"><b>MESSAGE</b></th></tr></thead><tbody>';
    for (x = 0; x < notesSearch.length; x++) {

      inlineQty += '<tr class="text-center"><td>' + notesSearch[x].getValue(
        columns[0]) + '</td><td>' + notesSearch[x].getValue(columns[1]) +
        '</td><td>' + notesSearch[x].getText(columns[6]) + '</td><td>' +
        notesSearch[x].getValue(columns[4]) + '</td><td>' + notesSearch[x].getValue(
          columns[5]).replace(/(\r\n|\n|\r)/gm, ", ") + '</td></tr>';
    }
  }

  inlineQty += '</tbody></table>';
  inlineQty += '</div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  return inlineQty;
}


function mpexTab(customer_id, min_c5, min_dl, min_b4, min_1kg, min_3kg, min_5kg,
  mpex_customer, portal_training, mpex_expected_usage) {
  // Defining Variables
  var record = nlapiLoadRecord('customer', customer_id);
  var invoice_cycle = record.getFieldValue('custentity_mpex_invoicing_cycle');
  var mpex_expected_usage = record.getFieldValue('custentity_form_mpex_usage_per_week');

  // Search Function
  var columns = new Array();
  columns[0] = new nlobjSearchColumn('name');
  columns[1] = new nlobjSearchColumn('internalId');

  // Expected Weekly Usage
  var inlineQty = '<div class="form-group container company_name_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">MP PRODUCTS - PORTAL REQUIRED | INVOICE CYCLE</span></div>'; // <h4><span class="label label-default col-xs-3">MPEX - INVOICE CYCLE</span></h4></h4>
  // inlineQty += '<div class="col-xs-12 heading1"></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container entityid_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-3 mpex_customer"><div class="input-group"><span class="input-group-addon" id="mpex_customer_text">Is MP Products Customer?<span class="mandatory">*</span></span><select id="mpex_customer" class="form-control mpex_customer" ><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist_yes_no_unsure', null, null, col);

  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(mpex_customer)) {
      if (mpex_customer == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      } else {
        inlineQty += '<option value="' + listID + '">' + listValue +
          '</option>';
      }
    } else {
      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
    }
  }

  inlineQty += '</select></div></div>';
  inlineQty +=
    '<div class="col-xs-3 portal_training"><div class="input-group"><span class="input-group-addon" id="portal_training_text">Shipping Portal Required?<span class="mandatory">*</span></span><select id="portal_training" class="form-control portal_training" ><option></option>';
  var col = new Array();
  col[0] = new nlobjSearchColumn('name');
  col[1] = new nlobjSearchColumn('internalId');
  var results = nlapiSearchRecord('customlist_yes_no_unsure', null, null, col);

  for (var i = 0; results != null && i < results.length; i++) {
    var res = results[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(portal_training)) {
      if (portal_training == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      } else {
        inlineQty += '<option value="' + listID + '">' + listValue +
          '</option>';
      }
    } else {
      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
    }
  }

  inlineQty += '</select></div></div>';
  var colWeeklyUsage = new Array();
  colWeeklyUsage[0] = new nlobjSearchColumn('name');
  colWeeklyUsage[1] = new nlobjSearchColumn('internalId');
  var resultsWeeklyUsage = nlapiSearchRecord('customlist_form_mpex_usage_per_week', null, null, colWeeklyUsage);
  inlineQty +=
    '<div class="col-xs-3 weekly_usage"><div class="input-group"><span class="input-group-addon" id="weekly_usage_text">Weekly Usage</span><select id="weekly_usage" class="form-control weekly_usage" ><option></option>';
  for (var i = 0; resultsWeeklyUsage != null && i < resultsWeeklyUsage.length; i++) {
    var res = resultsWeeklyUsage[i];
    var listValue = res.getValue('name');
    var listID = res.getValue('internalId');
    if (!isNullorEmpty(mpex_expected_usage)) {
      if (mpex_expected_usage == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
      } else {
        inlineQty += '<option value="' + listID + '">' + listValue +
          '</option>';
      }
    } else {
      inlineQty += '<option value="' + listID + '">' + listValue + '</option>';
    }
  }

  inlineQty += '</select></div></div>';

  // Invoice Cycle
  inlineQty +=
    '<div class="col-xs-3 invoice_cycle"><div class="input-group"><span class="input-group-addon" id="invoice_cycle_text">Invoice Cycle</span><select id="invoice_cycle" class="form-control invoice_cycle"><option></option>';

  var invoice_cycle_search = nlapiCreateSearch('customlist_invoicing_cyle',
    null, columns);
  resultInvoiceCycle = invoice_cycle_search.runSearch();

  resultInvoiceCycle.forEachResult(function (searchResult) {
    var listValue = searchResult.getValue('name');
    var listID = searchResult.getValue('internalId');

    if (!isNullorEmpty(invoice_cycle)) {
      if (invoice_cycle == listID) {
        inlineQty += '<option value="' + listID + '" selected>' + listValue +
          '</option>';
        invoice_cycle = record.setFieldValue(
          'custentity_mpex_invoicing_cycle', listID);
      } else {
        inlineQty += '<option value="' + listID + '">' + listValue +
          '</option>';
      }
    } else {
      inlineQty += '<option value="' + listID + '">' + listValue +
        '</option>';
    }
    return true;
  });
  inlineQty += '</select></div></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';


  inlineQty += '<div class="form-group container service_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-12 heading6"><h4><span class="label label-default col-xs-12" style="background-color: #095c7b;">PRICING STRUCTURE</span></h4></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container service_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<div class="col-xs-3 "></div>';
  inlineQty +=
    '<div class="col-xs-6 "><input type="button" id="prodPricingUpdate" class="form-control callback btn btn-info" value="ADD/EDIT PRODUCT PRICING" onclick="onclick_ProductPricing()"/></div>';
  inlineQty +=
    '<div class="col-xs-3 "></div>';
  inlineQty += '</div>';
  inlineQty += '</div>';

  inlineQty += '<div class="form-group container mpex_pricing_section">';
  inlineQty += '<div class="row">';
  inlineQty +=
    '<br><br><style>table#mpex_pricing {font-size:12px; border-color: #24385b;} </style><table border="0" cellpadding="15" id="mpex_pricing" class="tablesorter table table-striped" cellspacing="0" style="">';
  inlineQty += '<thead style="color: white;background-color: #103d3987;">';
  inlineQty += '<tr>';
  inlineQty += '<th>DELIVERY SPEEDS</th><th>PRICING PLAN</th><th>B4</th><th>250G</th><th>500G</th><th>1KG</th><th>3KG</th><th>5KG</th><th>10KG</th><th>20KG</th><th>25KG</th>'
  inlineQty += '</tr>';
  inlineQty += '</thead>';

  var productPricingSearch = nlapiLoadSearch('customrecord_product_pricing',
    'customsearch_prod_pricing_customer_level');

  var newFilters = new Array();
  newFilters[newFilters.length] = new nlobjSearchFilter('custrecord_prod_pricing_customer', null,
    'is', customer_id);

  productPricingSearch.addFilters(newFilters);


  productPricingSearchResultSet = productPricingSearch.runSearch();
  productPricingSearchResultSet.forEachResult(function (result) {


    var deliverySpeeds = result.getText("custrecord_prod_pricing_delivery_speeds");
    var pricingPlans = result.getText("custrecord_prod_pricing_pricing_plan");
    var pricingB4 = result.getText("custrecord_prod_pricing_b4");
    var pricing250g = result.getText("custrecord_prod_pricing_250g");
    var pricing500g = result.getText("custrecord_prod_pricing_500g");
    var pricing1kg = result.getText("custrecord_prod_pricing_1kg");
    var pricing3kg = result.getText("custrecord_prod_pricing_3kg");
    var pricing5kg = result.getText("custrecord_prod_pricing_5kg");
    var pricing10kg = result.getText("custrecord_prod_pricing_10kg");
    var pricing20kg = result.getText("custrecord_prod_pricing_20kg");
    var pricing25kg = result.getText("custrecord_prod_pricing_25kg");

    inlineQty += '<tr class="dynatable-editable">';
    inlineQty += '<td>' + deliverySpeeds + '</td>';
    inlineQty += '<td>' + pricingPlans + '</td>';
    inlineQty += '<td>' + pricingB4 + '</td>';
    inlineQty += '<td>' + pricing250g + '</td>';
    inlineQty += '<td>' + pricing500g + '</td>';
    inlineQty += '<td>' + pricing1kg + '</td>';
    inlineQty += '<td>' + pricing3kg + '</td>';
    inlineQty += '<td>' + pricing5kg + '</td>';
    inlineQty += '<td>' + pricing10kg + '</td>';
    inlineQty += '<td>' + pricing20kg + '</td>';
    inlineQty += '<td>' + pricing25kg + '</td>';
    inlineQty += '</tr>';

    return true;
  });

  inlineQty += '</tbody>';
  inlineQty += '</table><br/>';
  inlineQty += '</div>';
  inlineQty += '</div>';


  nlapiSubmitRecord(record);

  return inlineQty;
}

function freqCal(freq) {

  var multiselect = '';

  if (freq.indexOf(1) != -1) {
    multiselect +=
      '<td><div class="daily"><input class="monday_class"   type="checkbox" disabled checked/></div></td>';
  } else {
    multiselect +=
      '<td><div class="daily"><input class="monday_class"   type="checkbox" disabled /></div></td>';
  }

  if (freq.indexOf(2) != -1) {
    multiselect +=
      '<td><div class="daily"><input class="tuesday_class"   type="checkbox" disabled checked/></div></td>';
  } else {
    multiselect +=
      '<td><div class="daily"><input class="tuesday_class"   type="checkbox" disabled/></div></td>';
  }

  if (freq.indexOf(3) != -1) {
    multiselect +=
      '<td><div class="daily"><input class="wednesday_class"   type="checkbox" disabled checked/></div></td>';
  } else {
    multiselect +=
      '<td><div class="daily"><input class="wednesday_class"   type="checkbox" disabled /></div></td>';
  }

  if (freq.indexOf(4) != -1) {
    multiselect +=
      '<td><div class="daily"><input class="thursday_class"   type="checkbox" disabled checked/></div></td>';
  } else {
    multiselect +=
      '<td><div class="daily"><input class="thursday_class"   type="checkbox" disabled /></div></td>';
  }

  if (freq.indexOf(5) != -1) {
    multiselect +=
      '<td><div class="daily"><input class="friday_class"   type="checkbox" disabled checked/></div></td>';
  } else {
    multiselect +=
      '<td><div class="daily"><input class="friday_class"   type="checkbox" disabled /></div></td>';
  }

  if (freq.indexOf(6) != -1) {
    multiselect +=
      '<td><div class="daily"><input class="adhoc_class"   type="checkbox" disabled checked /></div></td>';
  } else {
    multiselect +=
      '<td><div class="daily"><input class="adhoc_class"   type="checkbox" disabled /></div></td>';
  }



  return multiselect;
}

function pad(s) {
  return (s < 10) ? '0' + s : s;
}

function GetFormattedDate(stringDate) {

  var todayDate = nlapiStringToDate(stringDate);
  var month = pad(todayDate.getMonth() + 1);
  var day = pad(todayDate.getDate());
  var year = (todayDate.getFullYear());
  return year + "-" + month + "-" + day;
}
