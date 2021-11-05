/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-05T10:15:25+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record', 'N/http', 'N/log',
    'N/error', 'N/url', 'N/format', 'N/currentRecord'
  ],
  function(email, runtime, search, record, http, log, error, url, format,
    currentRecord) {
    var zee = 0;
    var userId = 0;
    var role = 0;

    var baseURL = 'https://1048144.app.netsuite.com';
    if (runtime.EnvType == "SANDBOX") {
      baseURL = 'https://1048144-sb3.app.netsuite.com';
    }

    role = runtime.getCurrentUser().role;
    var userName = runtime.getCurrentUser().name;
    var userId = runtime.getCurrentUser().id;
    var currRec = currentRecord.get();

    var invoiceType = null;

    var no_of_working_days = [];
    var invoiceTypeServices = [];
    var invoiceTypeMPEX = [];
    var invoiceTypeNeoPost = [];


    var customer_count_with_no_mpex_usage = [];
    var customer_count_with_mpex_usage = [];
    var customer_count_with_orange_mpex_usage = [];
    var customer_count_with_white_mpex_usage = [];
    var customer_count = 0;
    var uniqueArray = [];

    var total_revenue_per_state = [];

    var month;
    var weekdays_current_month;

    var total_months = 14;

    var today = new Date();
    var today_day_in_month = today.getDate();
    var today_day_in_week = today.getDay();
    var today_month = today.getMonth() + 1;
    var today_year = today.getFullYear();

    if (today_day_in_month < 10) {
      today_day_in_month = '0' + today_day_in_month;
    }

    if (today_month < 10) {
      today_month = '0' + (today_month);
    }

    var todayString = today_day_in_month + '/' + today_month + '/' +
      today_year;

    var current_year_month = today_year + '-' + today_month;
    var difference_months = total_months - parseInt(today_month);


    function isWeekday(year, month, day) {
      var day = new Date(year, month, day).getDay();
      return day != 0 && day != 6;
    }

    function getWeekdaysInMonth(month, year) {
      var days = daysInMonth(month, year);
      var weekdays = 0;
      for (var i = 0; i < days; i++) {
        if (isWeekday(year, month, i + 1)) weekdays++;
      }
      return weekdays;
    }

    function daysInMonth(iMonth, iYear) {
      return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    function pageLoad() {
      $('.range_filter_section').addClass('hide');
      $('.range_filter_section_top').addClass('hide');
      $('.date_filter_section').addClass('hide');
      $('.period_dropdown_section').addClass('hide');

      $('.loading_section').removeClass('hide');
    }

    function beforeSubmit() {
      $('#customer_benchmark_preview').hide();
      $('#customer_benchmark_preview').addClass('hide');

      $('.loading_section').removeClass('hide');
    }

    function afterSubmit() {
      $('.date_filter_section').removeClass('hide');
      $('.period_dropdown_section').removeClass('hide');

      $('.loading_section').addClass('hide');


      if (!isNullorEmpty($('#result_customer_benchmark').val())) {
        $('#customer_benchmark_preview').removeClass('hide');
        $('#customer_benchmark_preview').show();
      }

      $('#result_customer_benchmark').on('change', function() {
        $('#customer_benchmark_preview').removeClass('hide');
        $('#customer_benchmark_preview').show();
      });

      $('#customer_benchmark_preview').removeClass('hide');
      $('#customer_benchmark_preview').show();
    }

    function pageInit() {

      $("#NS_MENU_ID0-item0").css("background-color", "#CFE0CE");
      $("#NS_MENU_ID0-item0 a").css("background-color", "#CFE0CE");
      $("#body").css("background-color", "#CFE0CE");

      debtDataSet = [];
      debt_set = [];

      /**
       *  Submit Button Function
       */
      $('#submit').click(function() {
        // Ajax request
        var fewSeconds = 10;
        var btn = $(this);
        btn.addClass('disabled');
        // btn.addClass('')
        setTimeout(function() {
          btn.removeClass('disabled');
        }, fewSeconds * 1000);

        debtDataSet = [];
        debt_set = [];

        beforeSubmit();
        submitSearch();

        return true;
      });


      /**
       *  Auto Load Submit Search and Load Results on Page Initialisation
       */
      pageLoad();
      submitSearch();
      var dataTable = $('#customer_benchmark_preview').DataTable();


      var today = new Date();
      var today_year = today.getFullYear();
      var today_month = today.getMonth();
      var today_day = today.getDate();

      /**
       *  Click for Instructions Section Collapse
       */
      $('.collapse').on('shown.bs.collapse', function() {
        $(".range_filter_section_top").css("padding-top", "500px");
      })
      $('.collapse').on('hide.bs.collapse', function() {
        $(".range_filter_section_top").css("padding-top", "0px");
      })

      //Display the modal on click of the link on the table and prefill the fields  based on the customer record
      $(".customerModalPopUp").click(function() {

        console.log('inside modal')
        var customer_id = $(this).attr("data-id");

        console.log(customer_id)

        var customer_record = record.load({
          type: record.Type.CUSTOMER,
          id: customer_id,
          isDynamic: true
        });

        var mpex_customer_name = customer_record.getValue({
          fieldId: 'companyname'
        });

        var mpex_customer = customer_record.getValue({
          fieldId: 'custentity_mpex_customer'
        });
        var expected_usage = customer_record.getValue({
          fieldId: 'custentity_exp_mpex_weekly_usage'
        });

        $("#customer_id").val(customer_id);
        $("#exp_usage").val(expected_usage);
        $("#mpex_customer").val(mpex_customer);
        console.log(expected_usage)
        console.log(mpex_customer)
        $("#myModal").show();

        $('#modal-title').text('Update Customer: ' + mpex_customer_name)

      });

      //On click of close icon in the modal
      $('.close').click(function() {
        $("#myModal").hide();
      });

      //Update the customer record on click of the button in the modal
      $('#updateCustomer').click(function() {
        var customer_id = $("#customer_id").val();

        var customer_record = record.load({
          type: record.Type.CUSTOMER,
          id: customer_id,
          isDynamic: true
        });

        var mpex_customer = customer_record.setValue({
          fieldId: 'custentity_mpex_customer',
          value: $("#mpex_customer").val()
        });
        var expected_usage = customer_record.setValue({
          fieldId: 'custentity_exp_mpex_weekly_usage',
          value: $("#exp_usage").val()
        });

        var customerRecordId = customer_record.save({
          ignoreMandatoryFields: true
        });

        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1378&deploy=1&zee=' +
          zee +
          '&start_date=&last_date=&user_id=' +
          userId
        window.location.href = url;
      });
    }

    function adhocNewCustomers() {
      if (isNullorEmpty(invoiceType)) {
        var url = baseURL +
          "/app/site/hosting/scriptlet.nl?script=1226&deploy=1";
      } else {
        var url = baseURL +
          "/app/site/hosting/scriptlet.nl?script=1226&deploy=1&invoicetype=" +
          invoiceType;
      }

      window.location.href = url;
    }

    //Initialise the DataTable with headers.
    function submitSearch() {
      // duringSubmit();

      dataTable = $('#customer_benchmark_preview').DataTable({
        destroy: true,
        data: debtDataSet,
        pageLength: 1000,
        order: [
          [14, 'asc'],
          [13, 'desc']
        ],
        columns: [{
          title: 'LINK'
        }, {
          title: 'Customer Internal ID'
        }, {
          title: 'ID'
        }, {
          title: 'Company Name'
        }, {
          title: 'Franchisee'
        }, {
          title: 'Sign-Up Date'
        }, {
          title: 'Commencement Date'
        }, {
          title: 'Sales Rep'
        }, {
          title: 'Expected Weekly Usage'
        }, {
          title: 'Online Expected Weekly Usage'
        }, {
          title: 'Actual Weekly Usage'
        }, {
          title: 'No. of Weeks Used'
        }, {
          title: 'Total No. of Weeks (since Commencement)'
        }, {
          title: 'Average Weekly Usage'
        }, {
          title: 'Sort'
        }, {
          title: 'MPEX Customer'
        }],
        columnDefs: [{
          targets: [0, 2, 3, 4, 7, 8, 13],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {
          var orangeGroup = parseInt(data[8]) - (0.45 * parseInt(data[8]))
          if (data[13] == 0) {
            $('td', row).css('background-color', '#d59696');
          } else if (parseFloat(data[13]) > 0 && (data[15] == 'No' ||
              isNullorEmpty(data[15]))) {
            $('td', row).css('background-color', '#1da94e80');
          } else if (!isNullorEmpty(data[8])) {
            if (parseFloat(data[13]) >= parseInt(data[8])) {
              $('td', row).css('background-color', '#1da94e80');
            } else if (parseFloat(data[13]) < orangeGroup) {
              $('td', row).css('background-color', '#c9750d80');
            }
          }
        }
      });

      userId = $('#user_dropdown option:selected').val();
      zee = $(
        '#zee_dropdown option:selected').val();
      var date_from = $('#date_from').val();
      var date_to = $('#date_to').val();

      if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
        date_from = dateISOToNetsuite(date_from);
        date_to = dateISOToNetsuite(date_to);
      }

      console.log('Load DataTable Params: ' + date_from + ' | ' + date_to +
        ' | ' + zee + ' | ' + userId);

      loadDebtRecord(date_from, date_to, zee, userId);

      console.log('Loaded Results');


      afterSubmit();
    }

    //Function to add the filters and relaod the page
    function addFilters() {


      zee = $('#zee_dropdown option:selected').val();
      userId = $('#user_dropdown option:selected').val();

      var date_from = $('#date_from').val();
      var date_to = $('#date_to').val();

      if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
        date_from = dateISOToNetsuite(date_from);
        date_to = dateISOToNetsuite(date_to);
      }
      var start_date;
      var last_date;

      console.log(date_from)
      if (!isNullorEmpty(date_from)) {
        start_date = date_from.split('/');
        start_date = start_date[2] + '-' + start_date[1] + '-' + start_date[
          0]
      }


      console.log(date_to)

      if (!isNullorEmpty(date_to)) {
        last_date = date_to.split('/');
        last_date = last_date[2] + '-' + last_date[1] + '-' + last_date[0]
      }

      var url = baseURL +
        '/app/site/hosting/scriptlet.nl?script=1378&deploy=1&zee=' + zee +
        '&start_date=' + start_date + '&last_date=' + last_date +
        '&user_id=' +
        userId
      window.location.href = url;
    }

    function loadDebtRecord(date_from, date_to, zee_id, userId) {
      //MPEX Reporting - New Customers
      var mpexUsageResults = search.load({
        type: 'customer',
        id: 'customsearch4208'
      });

      if (!isNullorEmpty(date_from) && !isNullorEmpty(date_to)) {
        mpexUsageResults.filters.push(search.createFilter({
          name: 'custrecord_comm_date',
          join: 'custrecord_customer',
          operator: search.Operator.ONORAFTER,
          values: date_from
        }));
        mpexUsageResults.filters.push(search.createFilter({
          name: 'custrecord_comm_date',
          join: 'custrecord_customer',
          operator: search.Operator.ONORBEFORE,
          values: date_to
        }));
      }

      if (!isNullorEmpty(zee_id)) {
        mpexUsageResults.filters.push(search.createFilter({
          name: 'partner',
          join: null,
          operator: search.Operator.IS,
          values: zee_id
        }));
      }

      if (!isNullorEmpty(userId)) {
        mpexUsageResults.filters.push(search.createFilter({
          name: 'custrecord_salesrep',
          join: 'custrecord_customer',
          operator: search.Operator.IS,
          values: userId
        }));
      }

      var old_month = null;

      mpexUsageResults.run().each(function(mpexUsageSet) {

        var custInternalID = mpexUsageSet.getValue({
          name: 'internalid'
        });
        var custEntityID = mpexUsageSet.getValue({
          name: 'entityid'
        });
        var custName = mpexUsageSet.getValue({
          name: 'companyname'
        });
        var zeeID = mpexUsageSet.getValue({
          name: 'partner'
        });
        var zeeName = mpexUsageSet.getText({
          name: 'partner'
        });
        var signUpDate = mpexUsageSet.getValue({
          name: 'custrecord_comm_date_signup',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var commDate = mpexUsageSet.getValue({
          name: 'custrecord_comm_date',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var salesRepID = mpexUsageSet.getValue({
          name: 'custrecord_salesrep',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var salesRepName = mpexUsageSet.getText({
          name: 'custrecord_salesrep',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var expWeeklyUsage = mpexUsageSet.getValue({
          name: 'custentity_exp_mpex_weekly_usage'
        });
        var onlineExpWeeklyUsage = mpexUsageSet.getText({
          name: 'custentity_form_mpex_usage_per_week'
        });
        var actualWeeklyUsage = mpexUsageSet.getValue({
          name: 'custentity_actual_mpex_weekly_usage'
        });
        var mpexCustomer = mpexUsageSet.getText({
          name: 'custentity_mpex_customer'
        });

        var commDateArray = commDate.split('/')
        var commDateString = commDateArray[2] + '-' + commDateArray[1];

        if (isNullorEmpty(old_month)) {
          customer_count_with_no_mpex_usage[
              customer_count_with_no_mpex_usage.length] =
            commDateString;

        } else if (old_month != commDate) {
          customer_count_with_no_mpex_usage[
              customer_count_with_no_mpex_usage.length] =
            commDateString;
        }

        debt_set.push({
          custInternalID: custInternalID,
          custEntityID: custEntityID,
          custName: custName,
          zeeID: zeeID,
          zeeName: zeeName,
          signUpDate: signUpDate,
          commDate: commDate,
          salesRepID: salesRepID,
          salesRepName: salesRepName,
          expWeeklyUsage: expWeeklyUsage,
          onlineExpWeeklyUsage: onlineExpWeeklyUsage,
          actualWeeklyUsage: actualWeeklyUsage,
          mpexCustomer: mpexCustomer
        });

        old_month = commDate;
        return true;
      });
      console.log(debt_set)
      uniqueArray = customer_count_with_no_mpex_usage.filter(function(item,
        pos) {
        return customer_count_with_no_mpex_usage.indexOf(item) == pos;
      })
      customer_count_with_no_mpex_usage = [];
      for (var x = 0; x < uniqueArray.length; x++) {
        customer_count_with_no_mpex_usage[x] = 0;
      }
      for (var x = 0; x < uniqueArray.length; x++) {
        customer_count_with_mpex_usage[x] = 0;
      }
      for (var x = 0; x < uniqueArray.length; x++) {
        customer_count_with_orange_mpex_usage[x] = 0;
      }
      for (var x = 0; x < uniqueArray.length; x++) {
        customer_count_with_white_mpex_usage[x] = 0;
      }
      loadDatatable(debt_set);
      debt_set = [];

    }

    function loadDatatable(debt_rows) {

      debtDataSet = [];
      csvSet = [];

      if (!isNullorEmpty(debt_rows)) {
        debt_rows.forEach(function(debt_row, index) {

          var no_of_weeks = 0;
          var avg_weekly_usage = 0;
          var inlineHtml = '';

          var sort_cat = '1 - White'
          if (debt_row.mpexCustomer == 'Yes' || !isNullorEmpty(debt_row
              .actualWeeklyUsage)) {
            if (!isNullorEmpty(debt_row.actualWeeklyUsage)) {
              var parsedUsage = JSON.parse(debt_row.actualWeeklyUsage);
              inlineHtml +=
                '<style>table#customer_weekly_usage {font-size:12px; font-weight:bold; border-color: #24385b;} </style><table border="0" cellpadding="0" id="customer_weekly_usage" class="tablesorter table table-striped" cellspacing="0" style=""><thead style="color: #db4343;background-color: #607799;"><tr><th style="text-align: center;">WEEK USED</th><th style="text-align: center;">USAGE COUNT</th></tr></thead><tbody>';
              var tempTotal = 0;
              for (var x = 0; x < parsedUsage['Usage'].length; x++) {
                var parts = parsedUsage['Usage'][x]['Week Used'].split(
                  '/');

                inlineHtml += '<tr class="dynatable-editable">';
                inlineHtml += '<td>' + parts[2] + '-' + ('0' + parts[1])
                  .slice(-
                    2) + '-' + ('0' + parts[0]).slice(-2) + '</td><td>' +
                  parsedUsage['Usage'][x]['Count'] + '</td>';
                inlineHtml += '</tr>';

                tempTotal += parseInt(parsedUsage['Usage'][x]['Count'])
              }

              no_of_weeks = parsedUsage['Usage'].length;
              avg_weekly_usage = parseFloat(tempTotal / no_of_weeks).toFixed(
                2)

              var commDateArray1 = debt_row.commDate.split('/')
              var commDateString1 = commDateArray1[2] + '-' +
                commDateArray1[1];

              var orangeGroup = parseInt(
                debt_row.expWeeklyUsage) - (0.45 * parseInt(
                debt_row.expWeeklyUsage))

              if ((parseFloat(avg_weekly_usage) >= parseInt(debt_row.expWeeklyUsage)) ||
                (!isNullorEmpty(debt_row.actualWeeklyUsage) && (
                  isNullorEmpty(debt_row.mpexCustomer) ||
                  debt_row.mpexCustomer == 'No'))) {
                sort_cat = '0 - Green'
                var monthIndex = uniqueArray.indexOf(commDateString1);
                customer_count_with_mpex_usage[monthIndex]++
              } else
              if (parseFloat(avg_weekly_usage) < orangeGroup) {
                sort_cat = '2 - Orange'
                var monthIndex = uniqueArray.indexOf(commDateString1);
                customer_count_with_orange_mpex_usage[monthIndex]++
              } else {
                var monthIndex = uniqueArray.indexOf(commDateString1);
                customer_count_with_white_mpex_usage[monthIndex]++
              }

            } else {
              var commDateArray1 = debt_row.commDate.split('/')
              var commDateString1 = commDateArray1[2] + '-' +
                commDateArray1[1];

              var monthIndex = uniqueArray.indexOf(commDateString1);
              customer_count_with_no_mpex_usage[monthIndex]++

                sort_cat = '3 - Red'
            }

            inlineHtml += '</tbody>';
            inlineHtml += '</table>';

            // edit_customer = https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1060&deploy=1&compid=1048144&unlayered=T&custparam_params={%22custid%22:' +
            // debt_row.custInternalID +
            // ',%22scriptid%22:%22customscript_sl_mpex_new_cust_last_4m%22,%22deployid%22:%22customdeploy1%22}

            var linkURL =
              '<a data-id="' + debt_row.custInternalID +
              '" class="customerModalPopUp" style="cursor: pointer !important;">EDIT CUSTOMER DETAILS</a> | <a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1269&deploy=1&customerid=' +
              debt_row.custInternalID +
              '&zee=&start_date=&last_date=" >MONTHLY USAGE</a> | <a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1217&deploy=1&customerid=' +
              debt_row.custInternalID +
              '&zee=' + debt_row.zeeID +
              '&start_date=&last_date=&invoice_type=8">MPEX MONTHLY REVENUE</a>';

            var commDateArray = debt_row.commDate.split('/')
            var commDateString = commDateArray[1] + '/' + commDateArray[
                0] +
              '/' + commDateArray[2];

            var date1 = new Date(commDateString);

            var date2;

            date2 = new Date();
            // use today
            var no_of_total_weeks = Math.round((date2 - date1) / (1000 *
              60 *
              60 * 24 * 7));


            if (sort_cat != '0 - Green' && sort_cat != '1 - White') {
              if (no_of_total_weeks != 0) {
                debtDataSet.push([linkURL, debt_row.custInternalID,
                  debt_row.custEntityID,
                  debt_row.custName, debt_row.zeeName, debt_row.signUpDate,
                  debt_row.commDate, debt_row.salesRepName, debt_row.expWeeklyUsage,
                  debt_row.onlineExpWeeklyUsage, inlineHtml,
                  no_of_weeks,
                  no_of_total_weeks,
                  avg_weekly_usage, sort_cat, debt_row.mpexCustomer
                ]);

                csvSet.push([debt_row.custInternalID, debt_row.custEntityID,
                  debt_row.custName, debt_row.zeeName, debt_row.signUpDate,
                  debt_row.commDate, debt_row.salesRepName, debt_row.expWeeklyUsage,
                  debt_row.onlineExpWeeklyUsage, no_of_weeks,
                  no_of_total_weeks,
                  avg_weekly_usage, sort_cat, debt_row.mpexCustomer
                ]);
              }
            }
          }

        });
      }
      console.log('debtDataSet ' + debtDataSet)
      console.log('uniqueArray ' + uniqueArray)
      console.log('customer_count_with_no_mpex_usage ' +
        customer_count_with_no_mpex_usage)
      console.log('customer_count_with_orange_mpex_usage ' +
        customer_count_with_orange_mpex_usage)

      var datatable = $('#customer_benchmark_preview').DataTable();
      datatable.clear();
      datatable.rows.add(debtDataSet);
      datatable.draw();

      saveCsv(csvSet);

      var data = datatable.rows().data();

      var month_year = []; //creating array for storing browser type in array.
      var mpex_exp_usage = []; //creating array for storing browser type in array.
      var mpex_avg_actual_usage = []; //creating array for storing browser type in array.
      var mpex_customer_count_no_usage = []
      var categories = [];

      var months = [];

      for (var i = 0; i < data.length; i++) {

        mpex_exp_usage[data[i][1]] = parseInt(data[i][8]);
        mpex_avg_actual_usage[data[i][1]] = parseFloat(data[i][13]);
        categories[data[i][1]] = data[i][3];

      }


      var series_data = []; //creating empty array for highcharts series data
      var series_data_v2 = []; //creating empty array for highcharts series data
      var series_data2 = []; //creating empty array for highcharts series data
      var series_data2_v2 = []; //creating empty array for highcharts series data
      var series_data3 = []; //creating empty array for highcharts series data
      var series_data3_v2 = []; //creating empty array for highcharts series data
      var series_data4_v2 = []; //creating empty array for highcharts series data
      var categores = []; //creating empty array for highcharts categories
      var categores_v2 = []; //creating empty array for highcharts categories
      Object.keys(mpex_exp_usage).map(function(item, key) {
        series_data.push((mpex_exp_usage[item]));
        series_data2.push((mpex_avg_actual_usage[item]));
        categores.push(categories[item])
      });

      Object.keys(uniqueArray).map(function(item, key) {
        series_data_v2.push((customer_count_with_no_mpex_usage[item]));
        // series_data2_v2.push((customer_count_with_mpex_usage[item]));
        series_data3_v2.push((customer_count_with_orange_mpex_usage[item]));
        // series_data4_v2.push((customer_count_with_white_mpex_usage[item]));
        categores_v2.push(uniqueArray[item])
      });

      console.log(series_data)
      console.log(series_data2)
      console.log(series_data_v2)
      console.log(categores)
      console.log(categores_v2)

      plotChartV2(series_data_v2, series_data3_v2, categores_v2)
      return true;
    }

    function plotChartV2(series_data, series_data3_v2, categores) {
      // console.log(series_data)
      Highcharts.chart('container', {
        chart: {
          type: 'column',
          height: (6 / 16 * 100) + '%',
          backgroundColor: '#CFE0CE',
          zoomType: 'xy'
        },
        xAxis: {
          categories: categores,
          crosshair: true,
          style: {
            fontWeight: 'bold',
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Customer Count'
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold'
            }
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true
            }
          }
        },
        series: [{
            name: 'No Usage',
            data: series_data,
            color: '#d59696',
            style: {
              fontWeight: 'bold',
            }
          }, {
            name: 'Avg Weekly Usage < than 45% of Expected Weekly Usage',
            data: series_data3_v2,
            color: '#c9750d80',
            style: {
              fontWeight: 'bold',
            }
          }
          // {
          //   name: 'Avg Weekly Usage >= 45% of Expected Usage & Avg Weekly Usage < Expected Weekly Usage',
          //   data: series_data4_v2,
          //   color: '#fff',
          //   style: {
          //     fontWeight: 'bold',
          //   }
          // }
        ]
      });
    }

    /**
     * Load the string stored in the hidden field 'custpage_table_csv'.
     * Converts it to a CSV file.
     * Creates a hidden link to download the file and triggers the click of the link.
     */
    function downloadCsv() {
      var today = new Date();
      today = formatDate(today);
      var val1 = currentRecord.get();
      var csv = val1.getValue({
        fieldId: 'custpage_table_csv',
      });
      today = replaceAll(today);
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      var content_type = 'text/csv';
      var csvFile = new Blob([csv], {
        type: content_type
      });
      var url = window.URL.createObjectURL(csvFile);
      var filename = 'MPEX New Customer List_' + today + '.csv';
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);


    }


    function saveRecord() {}

    /**
     * Create the CSV and store it in the hidden field 'custpage_table_csv' as a string.
     * @param {Array} ordersDataSet The `billsDataSet` created in `loadDatatable()`.
     */
    function saveCsv(ordersDataSet) {
      var sep = "sep=;";
      var headers = ["Customer Internal ID", "Customer Entity ID",
        "Customer Name",
        "Franchisee", "Sign Up Date", "Commencement Date", "Sales Rep",
        "Expected Weekly Usage", "Online Expected Weekly Usage",
        "No. of Weeks Used", "Total No. of Weeks (since Commencement)",
        "Avg Weekly Usage", "Sorting", "MPEX Customer"
      ]
      headers = headers.join(';'); // .join(', ')

      var csv = sep + "\n" + headers + "\n";


      ordersDataSet.forEach(function(row) {
        row = row.join(';');
        csv += row;
        csv += "\n";
      });

      var val1 = currentRecord.get();
      val1.setValue({
        fieldId: 'custpage_table_csv',
        value: csv
      });


      return true;
    }

    function formatDate(testDate) {
      console.log('testDate: ' + testDate);
      var responseDate = format.format({
        value: testDate,
        type: format.Type.DATE
      });
      console.log('responseDate: ' + responseDate);
      return responseDate;
    }

    function replaceAll(string) {
      return string.split("/").join("-");
    }

    function stateIDPublicHolidaysRecord(state) {
      switch (state) {
        case 1:
          return 1; //NSW
          break;
        case 2:
          return 6; //QLD
          break;
        case 3:
          return 5; //VIC
          break;
        case 4:
          return 3; //SA
          break;
        case 5:
          return 7; //TAS
          break;
        case 6:
          return 4; //ACT
          break;
        case 7:
          return 2; //WA
          break;
        case 8:
          return 8; //NT
          break;
        default:
          return null;
          break;
      }
    }

    function stateID(state) {
      state = state.toUpperCase();
      switch (state) {
        case 'ACT':
          return 6
          break;
        case 'NSW':
          return 1
          break;
        case 'NT':
          return 8
          break;
        case 'QLD':
          return 2
          break;
        case 'SA':
          return 4
          break;
        case 'TAS':
          return 5
          break;
        case 'VIC':
          return 3
          break;
        case 'WA':
          return 7
          break;
        default:
          return 0;
          break;
      }
    }
    /**
     * Sets the values of `date_from` and `date_to` based on the selected option in the '#period_dropdown'.
     */
    function selectDate() {
      var period_selected = $('#period_dropdown option:selected').val();
      var today = new Date();
      var today_day_in_month = today.getDate();
      var today_day_in_week = today.getDay();
      var today_month = today.getMonth();
      var today_year = today.getFullYear();

      var today_date = new Date(Date.UTC(today_year, today_month,
        today_day_in_month))

      switch (period_selected) {
        case "this_week":
          // This method changes the variable "today" and sets it on the previous monday
          if (today_day_in_week == 0) {
            var monday = new Date(Date.UTC(today_year, today_month,
              today_day_in_month - 6));
          } else {
            var monday = new Date(Date.UTC(today_year, today_month,
              today_day_in_month - today_day_in_week + 1));
          }
          var date_from = monday.toISOString().split('T')[0];
          var date_to = today_date.toISOString().split('T')[0];
          break;

        case "last_week":
          var today_day_in_month = today.getDate();
          var today_day_in_week = today.getDay();
          // This method changes the variable "today" and sets it on the previous monday
          if (today_day_in_week == 0) {
            var previous_sunday = new Date(Date.UTC(today_year, today_month,
              today_day_in_month - 7));
          } else {
            var previous_sunday = new Date(Date.UTC(today_year, today_month,
              today_day_in_month - today_day_in_week));
          }

          var previous_sunday_year = previous_sunday.getFullYear();
          var previous_sunday_month = previous_sunday.getMonth();
          var previous_sunday_day_in_month = previous_sunday.getDate();

          var monday_before_sunday = new Date(Date.UTC(previous_sunday_year,
            previous_sunday_month, previous_sunday_day_in_month - 6));

          var date_from = monday_before_sunday.toISOString().split('T')[0];
          var date_to = previous_sunday.toISOString().split('T')[0];
          break;

        case "this_month":
          var first_day_month = new Date(Date.UTC(today_year, today_month));
          var date_from = first_day_month.toISOString().split('T')[0];
          var date_to = today_date.toISOString().split('T')[0];
          break;

        case "last_month":
          var first_day_previous_month = new Date(Date.UTC(today_year,
            today_month - 1));
          var last_day_previous_month = new Date(Date.UTC(today_year,
            today_month, 0));
          var date_from = first_day_previous_month.toISOString().split('T')[
            0];
          var date_to = last_day_previous_month.toISOString().split('T')[0];
          break;

        case "full_year":
          var first_day_in_year = new Date(Date.UTC(today_year, 0));
          var date_from = first_day_in_year.toISOString().split('T')[0];
          var date_to = today_date.toISOString().split('T')[0];
          break;

        case "financial_year":
          if (today_month >= 6) {
            var first_july = new Date(Date.UTC(today_year, 6));
          } else {
            var first_july = new Date(Date.UTC(today_year - 1, 6));
          }
          var date_from = first_july.toISOString().split('T')[0];
          var date_to = today_date.toISOString().split('T')[0];
          break;

        default:
          var date_from = '';
          var date_to = '';
          break;
      }
      $('#date_from').val(date_from);
      $('#date_to').val(date_to);
    }

    function formatAMPM() {
      var date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    /**
     * @param   {Number} x
     * @returns {String} The same number, formatted in Australian dollars.
     */
    function financial(x) {
      if (typeof(x) == 'string') {
        x = parseFloat(x);
      }
      if (isNullorEmpty(x) || isNaN(x)) {
        return "$0.00";
      } else {
        return x.toLocaleString('en-AU', {
          style: 'currency',
          currency: 'AUD'
        });
      }
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
    /**
     * [getDate description] - Get the current date
     * @return {[String]} [description] - return the string date
     */
    function getDate() {
      var date = new Date();
      date = format.format({
        value: date,
        type: format.Type.DATE,
        timezone: format.Timezone.AUSTRALIA_SYDNEY
      });

      return date;
    }

    function isNullorEmpty(val) {
      if (val == '' || val == null) {
        return true;
      } else {
        return false;
      }
    }
    return {
      pageInit: pageInit,
      saveRecord: saveRecord,
      adhocNewCustomers: adhocNewCustomers,
      downloadCsv: downloadCsv,
      addFilters: addFilters
    }
  });
