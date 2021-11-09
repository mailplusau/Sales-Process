/**
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-01T09:59:04+11:00
 * Module Description: Page that lists down all new customers in the last 4 months with No Usage or 45% less than the expectedd usage. Ability for the Sales Rep to edit the expected weekly usage of the customer and edit customer to be an MPEX customer or not.
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-09T13:40:51+11:00
 */



define(['N/ui/serverWidget', 'N/email', 'N/runtime', 'N/search', 'N/record',
    'N/http', 'N/log', 'N/redirect'
  ],
  function(ui, email, runtime, search, record, http, log, redirect) {
    var role = 0;
    var userId = 0;
    var zee = 0;

    function onRequest(context) {
      var baseURL = 'https://system.na2.netsuite.com';
      if (runtime.EnvType == "SANDBOX") {
        baseURL = 'https://system.sandbox.netsuite.com';
      }
      userId = runtime.getCurrentUser().id;

      role = runtime.getCurrentUser().role;

      if (context.request.method === 'GET') {

        var start_date = context.request.parameters.start_date;
        var last_date = context.request.parameters.last_date;
        zee = context.request.parameters.zee;
        userId = context.request.parameters.user_id;

        if (isNullorEmpty(start_date)) {
          start_date = null;
        }

        if (isNullorEmpty(last_date)) {
          last_date = null;
        }

        if (isNullorEmpty(userId)) {
          userId = null;
        }

        var form = ui.createForm({
          title: 'Customer List - Commencing Today'
        });


        var inlineHtml =
          '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://system.na2.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://system.na2.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><script src="https://cdn.datatables.net/searchpanes/1.2.1/js/dataTables.searchPanes.min.js"><script src="https://cdn.datatables.net/select/1.3.3/js/dataTables.select.min.js"></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script></script><script src="https://code.highcharts.com/highcharts.js"></script><script src="https://code.highcharts.com/modules/data.js"></script><script src="https://code.highcharts.com/modules/drilldown.js"></script><script src="https://code.highcharts.com/modules/exporting.js"></script><script src="https://code.highcharts.com/modules/export-data.js"></script><script src="https://code.highcharts.com/modules/accessibility.js"></script><style>.mandatory{color:red;} .body{background-color: #CFE0CE !important;} @-webkit-keyframes animatetop {from {top:-300px; opacity:0} to {top:0; opacity:1}}@keyframes animatetop {from {top:-300px; opacity:0}to {top:0; opacity:1}}</style>';

        form.addField({
          id: 'custpage_table_csv',
          type: ui.FieldType.TEXT,
          label: 'Table CSV'
        }).updateDisplayType({
          displayType: ui.FieldDisplayType.HIDDEN
        });


        //Search: SMC - Franchisees
        var searchZees = search.load({
          id: 'customsearch_smc_franchisee'
        });
        var resultSetZees = searchZees.run();

        //Dropdown to Select the Fracnhisee
        inlineHtml += franchiseeDropdownSection(resultSetZees, context);

        //Section to select the Sales Rep or show the default Sales Rep based on loadingSection
        inlineHtml += userDropdownSection(userId);

        //Display the modal pop-up to edit the customer details
        inlineHtml += updateCustomerModal();

        //Loading Section that gets displayed when the page is being loaded
        inlineHtml += loadingSection();
        inlineHtml += '<div id="container"></div>'
        inlineHtml += dataTable();

        //Button to reload the page when the filters have been selected
        form.addButton({
          id: 'submit_search',
          label: 'Submit Search',
          functionName: 'addFilters()'
        });

        form.addField({
          id: 'preview_table',
          label: 'inlinehtml',
          type: 'inlinehtml'
        }).updateLayoutType({
          layoutType: ui.FieldLayoutType.STARTROW
        }).defaultValue = inlineHtml;

        form.clientScriptFileId = 5297759;

        context.response.writePage(form);
      } else {

      }
    }


    /*
     * PURPOSE : HTML code to generate the Modal Pop-up
     *  PARAMS :  -
     * RETURNS : HTML
     *   NOTES :
     */
    function updateCustomerModal() {

      var yes_no_search = search.create({
        type: 'customlist107_2',
        columns: [{
          name: 'name'
        }, {
          name: 'internalId'
        }]
      });


      var resultSetYesNo = yes_no_search.run();
      var inlineHtml =
        '<div id="myModal" class="modal" style="display: none; position: fixed; z-index: 1; padding-top: 100px;left: 0;top: 0;width: 100%; height: 100%; overflow: auto; background-color: rgb(0,0,0); background-color: rgba(0,0,0,0.4); "><div class="modal-content" style="position: absolute;transform: translate(-50%, -50%);background-color: #fefefe;/* margin: auto; *//* padding: 0; */border: 1px solid #888;/* width: 80%; */left: 50%;top: 50%;/* box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19); */-webkit-animation-name: animatetop;-webkit-animation-duration: 0.4s;animation-name: animatetop;animation-duration: 0.4s;"><div class="modal-header" style="padding: 2px 16px;text-align: center;"><span class="close" style="color: black;float: right;font-size: 28px;font-weight: bold;"">&times;</span><h3 class="modal-title" id="modal-title">Update Customer</h3></div>';

      inlineHtml +=
        '<div class="modal-body" style="padding: 2px 16px;"><div class="form-group container mpex_customer_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">IS MPEX CUSTOMER</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml +=
        '<div class="form-group container mpex_customer2_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-4 mpex_customer"><input type="text" id="customer_id" value="" hidden/><div class="input-group"><span class="input-group-addon" id="mpex_customer_text">Is MPEX Customer? </span><select id="mpex_customer" class="form-control mpex_customer_dropdown" ><option></option>';

      resultSetYesNo.each(function(searchResult) {

        var listValue = searchResult.getValue('name');
        var listID = searchResult.getValue('internalId');

        inlineHtml += '<option value="' + listID + '">' + listValue +
          '</option>';

        return true;
      });

      inlineHtml += '</select></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container exp_usage_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">EXPECTED USAGE</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml += '<div class="form-group container exp_usage2_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-6 exp_usage"><div class="input-group"><span class="input-group-addon" id="exp_usage_text">MPEX EXPECTED USAGE</span><input id="exp_usage" class="form-control exp_usage"  value=""  /></div></div>';

      inlineHtml += '</div>';
      inlineHtml += '</div>';
      inlineHtml +=
        '</div><div class="modal-footer" style="padding: 2px 16px;"><input type="button" value="Update Customer" class="form-control btn-primary" id="updateCustomer" style=""/></div></div></div>';

      return inlineHtml;

    }

    /**
     * The Sales Rep dropdown field.
     * @param   {String}    date_from
     * @param   {String}    date_to
     * @return  {String}    `inlineHtml`
     */
    function userDropdownSection(userId) {

      var searchedSalesTeam = search.load({
        id: 'customsearch_active_employees_3'
      });

      var inlineHtml =
        '<div class="form-group container cust_filter_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">SALES REP</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml +=
        '<div class="form-group container cust_dropdown_section">';
      inlineHtml += '<div class="row">';
      // Period dropdown field
      inlineHtml += '<div class="col-xs-12 cust_dropdown_div">';
      inlineHtml += '<div class="input-group">';
      inlineHtml +=
        '<span class="input-group-addon" id="user_dropdown_text">Sales Rep</span>';
      inlineHtml += '<select id="user_dropdown" class="form-control">';
      inlineHtml += '<option value=""></option>'
      searchedSalesTeam.run().each(function(searchResult_sales) {
        employee_id = searchResult_sales.getValue({
          name: 'internalid'
        });
        employee_name = searchResult_sales.getValue({
          name: 'entityid'
        });

        if (userId == employee_id) {
          inlineHtml += '<option value="' + employee_id +
            '" selected="selected">' + employee_name + '</option>';
        } else {
          inlineHtml += '<option value="' + employee_id + '">' +
            employee_name +
            '</option>';
        }

        return true;
      });
      inlineHtml += '</select>';
      inlineHtml += '</div></div></div></div>';

      return inlineHtml;

    }


    /**
     * The Franchisee dropdown field.
     * @param   {String}    date_from
     * @param   {String}    date_to
     * @return  {String}    `inlineHtml`
     */
    function franchiseeDropdownSection(resultSetZees, context) {
      var inlineHtml =
        '<div class="form-group container date_filter_section">';
      inlineHtml += '<div class="row">';
      inlineHtml +=
        '<div class="col-xs-12 heading1"><h4><span class="label label-default col-xs-12" style="background-color: #103D39;">FRANCHISEE</span></h4></div>';
      inlineHtml += '</div>';
      inlineHtml += '</div>';

      inlineHtml += '<div class="form-group container zee_dropdown_section">';
      inlineHtml += '<div class="row">';
      // Period dropdown field
      inlineHtml += '<div class="col-xs-12 zee_dropdown_div">';
      inlineHtml += '<div class="input-group">';
      inlineHtml +=
        '<span class="input-group-addon" id="zee_dropdown_text">Franchisee</span>';
      inlineHtml += '<select id="zee_dropdown" class="form-control">';
      inlineHtml += '<option value=""></option>'
      resultSetZees.each(function(searchResult_zee) {
        zee_id = searchResult_zee.getValue('internalid');
        zee_name = searchResult_zee.getValue('companyname');

        if (zee == zee_id) {
          inlineHtml += '<option value="' + zee_id +
            '" selected="selected">' + zee_name + '</option>';
        } else {
          inlineHtml += '<option value="' + zee_id + '">' + zee_name +
            '</option>';
        }

        return true;
      });
      inlineHtml += '</select>';
      inlineHtml += '</div></div></div></div>';

      return inlineHtml;

    }

    /**
     * The table that will display the differents invoices linked to the franchisee and the time period.
     * @return  {String}    inlineHtml
     */
    function dataTable() {
      var inlineHtml =
        '<style>table#customer_benchmark_preview {color: #103D39 !important; font-size: 12px;text-align: center;border: none;}.dataTables_wrapper {font-size: 14px;}table#customer_benchmark_preview th{text-align: center;} .bolded{font-weight: bold;}</style>';
      inlineHtml +=
        '<table id="customer_benchmark_preview" class="table table-responsive table-striped customer tablesorter hide" style="width: 100%;">';
      inlineHtml += '<thead style="color: white;background-color: #379E8F;">';
      inlineHtml += '<tr class="text-center">';
      inlineHtml += '</tr>';
      inlineHtml += '</thead>';

      inlineHtml +=
        '<tbody id="result_customer_benchmark" class="result-customer_benchmark"></tbody>';

      inlineHtml += '</table>';
      return inlineHtml;
    }

    /**
     * The header showing that the results are loading.
     * @returns {String} `inlineQty`
     */
    function loadingSection() {
      var inlineHtml =
        '<div id="loading_section" class="form-group container loading_section " style="text-align:center">';
      inlineHtml += '<div class="row">';
      inlineHtml += '<div class="col-xs-12 loading_div">';
      inlineHtml += '<h1>Loading...</h1>';
      inlineHtml += '</div></div></div>';

      return inlineHtml;
    }


    /**
     * Used to pass the values of `date_from` and `date_to` between the scripts and to Netsuite for the records and the search.
     * @param   {String} date_iso       "2020-06-01"
     * @returns {String} date_netsuite  "1/6/2020"
     */
    function dateISOToNetsuite(date_iso) {
      var date_netsuite = '';
      if (!isNullorEmpty(date_iso)) {
        var date_utc = new Date(date_iso);
        // var date_netsuite = nlapiDateToString(date_utc);
        var date_netsuite = format.format({
          value: date_utc,
          type: format.Type.DATE
        });
      }
      return date_netsuite;
    }

    function isNullorEmpty(val) {
      if (val == '' || val == null) {
        return true;
      } else {
        return false;
      }
    }
    return {
      onRequest: onRequest
    };
  });
