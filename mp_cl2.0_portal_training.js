/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-02T08:24:43+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-19T11:55:13+11:00
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

      $(".taskModalPopUP").click(function() {
          var taskInternalID = $(this).attr("data-id");
          var customerInternalID = $(this).attr("data-custid");
        console.log('inside modal')
        $("#task_id").val(taskInternalID);
        $("#customer_id").val(customerInternalID);
        $("#myModal").show();


      })

      //Display the modal on click of the link on the table and prefill the fields  based on the customer record
      $("#customerOnboardingCompleted").click(function() {

        console.log('on submit')
          var taskInternalID = $("#task_id").val();
          var customerInternalID = $("#customer_id").val();
          var date_now = $("#date").val();
          var time_now = $("#time").val();


        console.log(taskInternalID)
        console.log(date_now)
        console.log(time_now)
        var task_record = record.create({
          type: 'calendarevent'
        });

        var splitDate = date_now.split('-');
        var callback_date = splitDate[2] + '/' + splitDate[1] + '/' + splitDate[0];


        // var time_now = format.parse({
        //   value: date,
        //   type: format.Type.TIMEOFDAY
        // });
        //
        console.log(callback_date)

        // task_record.setValue({
        //   fieldId: 'duedate',
        //   value: callback_date
        // });
        task_record.setValue({
          fieldId: 'startdate',
          value: callback_date
        });
        task_record.setValue({
          fieldId: 'starttime',
          value: time_now
        });
        task_record.setValue({
          fieldId: 'remindertype',
          value: 'Email'
        });
        task_record.setValue({
          fieldId: 'reminderminutes',
          value: '1 hour'
        });
        task_record.setValue({
          fieldId: 'timedevent',
          value: 'T'
        });
        task_record.setValue({
          fieldId: 'company',
          value: customerInternalID
        });
        task_record.setValue({
          fieldId: 'status',
          value: 'Not Started'
        });
        task_record.setValue({
          fieldId: 'title',
          value: 'Portal Training'
        });
        task_record.setValue({
          fieldId: 'organizer',
          value: runtime.getCurrentUser().id
        });


        task_record.save({
          ignoreMandatoryFields: true
        });


        var url = baseURL +
          '/app/site/hosting/scriptlet.nl?script=1392&deploy=1';
        window.location.href = url;

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
          '/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=' +
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
        order: [],
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
          title: 'Source'
        }, {
          title: 'Sign-Up Date'
        }, {
          title: 'Commencement Date'
        }, {
          title: 'Email'
        }, {
          title: 'Phone Number'
        }, {
          title: 'Sales Rep'
        }, {
          title: 'Sales Type'
        }, {
          title: 'Portal Access?'
        }, {
          title: 'Portal Manuals Sent?'
        }],
        columnDefs: [{
          targets: [],
          className: 'bolded'
        }],
        rowCallback: function(row, data, index) {}
      });

      userId = $('#user_dropdown option:selected').val();
      zee = $(
        '#zee_dropdown option:selected').val();

      loadDebtRecord(zee, userId);

      console.log('Loaded Results');
      afterSubmit();
    }

    //Function to add the filters and relaod the page
    function addFilters() {

      zee = $('#zee_dropdown option:selected').val();
      userId = $('#user_dropdown option:selected').val();

      var url = baseURL +
        '/app/site/hosting/scriptlet.nl?script=1376&deploy=1&zee=' + zee +
        '&user_id=' +
        userId
      window.location.href = url;
    }

    function loadDebtRecord(zee_id, userId) {
      //MPEX Customers - Commencing Today or Not Onboarded
      var custListCommenceTodayResults = search.load({
        type: 'customer',
        id: 'customsearch_cust_list_commence_today__3'
      });

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

      custListCommenceTodayResults.run().each(function(
        custListCommenceTodaySet) {

        var custInternalID = custListCommenceTodaySet.getValue({
          name: 'internalid'
        });
        var custEntityID = custListCommenceTodaySet.getValue({
          name: 'entityid'
        });
        var custName = custListCommenceTodaySet.getValue({
          name: 'companyname'
        });
        var zeeID = custListCommenceTodaySet.getValue({
          name: 'partner'
        });
        var zeeName = custListCommenceTodaySet.getText({
          name: 'partner'
        });
        var commRegInternalID = custListCommenceTodaySet.getValue({
          name: "internalid",
          join: "CUSTRECORD_CUSTOMER"
        });
        var signUpDate = custListCommenceTodaySet.getValue({
          name: 'custrecord_comm_date_signup',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var commDate = custListCommenceTodaySet.getValue({
          name: 'custrecord_comm_date',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var salesRepID = custListCommenceTodaySet.getValue({
          name: 'custrecord_salesrep',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var saleType = custListCommenceTodaySet.getText({
          name: 'custrecord_sale_type',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var salesRepName = custListCommenceTodaySet.getText({
          name: 'custrecord_salesrep',
          join: 'CUSTRECORD_CUSTOMER'
        });
        var email = custListCommenceTodaySet.getValue({
          name: 'email'
        });
        var serviceEmail = custListCommenceTodaySet.getValue({
          name: 'custentity_email_service'
        });
        var leadSource = custListCommenceTodaySet.getText({
          name: 'leadsource'
        });

        var mpex500gPricePoint = custListCommenceTodaySet.getText({
          name: 'custentity_mpex_500g_price_point'
        });

        var portalAccess = custListCommenceTodaySet.getText({
          name: 'custentity_portal_access'
        });

        var portalManuals = custListCommenceTodaySet.getText({
          name: 'custentity_portal_how_to_guides'
        });
        var phone = custListCommenceTodaySet.getValue({
          name: 'phone'
        });
        var taskInternalID = custListCommenceTodaySet.getValue({
          name: 'internalid',
          join: 'task'
        });

        debt_set.push({
          custInternalID: custInternalID,
          custEntityID: custEntityID,
          custName: custName,
          zeeID: zeeID,
          zeeName: zeeName,
          commRegInternalID: commRegInternalID,
          signUpDate: signUpDate,
          commDate: commDate,
          salesRepID: salesRepID,
          salesRepName: salesRepName,
          email: email,
          serviceEmail: serviceEmail,
          leadSource: leadSource,
          saleType: saleType,
          mpex500gPricePoint: mpex500gPricePoint,
          portalAccess: portalAccess,
          portalManuals: portalManuals,
          phone: phone,
          taskInternalID: taskInternalID
        });

        return true;
      });
      console.log(debt_set)

      loadDatatable(debt_set);
      debt_set = [];

    }

    function loadDatatable(debt_rows) {

      debtDataSet = [];
      csvSet = [];

      if (!isNullorEmpty(debt_rows)) {
        debt_rows.forEach(function(debt_row, index) {

          var linkURL =
            '<button class="form-control btn btn-xs btn-primary" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            debt_row.taskInternalID +
            '" href="https://1048144.app.netsuite.com/app/crm/calendar/task.nl?id='+debt_row.taskInternalID+'&e=T&l=T" target="_blank" class="" style="cursor: pointer !important;color: white;">SCHEDULE DATE/TIME</a></button>  <button class="form-control btn btn-xs btn-success" style="cursor: not-allowed !important;width: fit-content;"><a data-id="' +
            debt_row.taskInternalID +
            '" href="https://1048144.app.netsuite.com/app/crm/calendar/task.nl?id='+debt_row.taskInternalID+'&e=T&l=T" target="_blank" class="" style="cursor: pointer !important;color: white;">TRAINING COMPLETE</a></button> </br> <button class="form-control btn btn-xs" style="background-color: #0f3d39;cursor: not-allowed !important;width: fit-content;"><a style="color:white;" href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=744&deploy=1&compid=1048144&custid=' +
            debt_row.custInternalID +
            '" target="_blank">SEND EMAIL</a></button>';

          var customerIDLink =
            '<a href="https://1048144.app.netsuite.com/app/common/entity/custjob.nl?id=' +
            debt_row.custInternalID + '&whence=" target="_blank"><b>' +
            debt_row.custEntityID + '</b></a>';

          var commDateSplit = debt_row.commDate.split('/');
          var signUpDateSplit = debt_row.signUpDate.split('/');
          var commDate = new Date(commDateSplit[2], commDateSplit[1] - 1,
            commDateSplit[0]);
          var commDateParsed = format.parse({
            value: commDate,
            type: format.Type.DATE
          });
          var commDateFormatted = format.format({
            value: commDate,
            type: format.Type.DATE
          });

          var signUpDate = new Date(signUpDateSplit[2], signUpDateSplit[1] -
            1, signUpDateSplit[0]);
          var signUpDateParsed = format.parse({
            value: signUpDate,
            type: format.Type.DATE
          });
          var signUpDateFormatted = format.format({
            value: signUpDate,
            type: format.Type.DATE
          });

          debtDataSet.push([linkURL, debt_row.custInternalID,
            customerIDLink,
            debt_row.custName, debt_row.zeeName, debt_row.leadSource,
            debt_row.signUpDate,
            commDateFormatted, debt_row.serviceEmail,
            debt_row.phone, debt_row.salesRepName,
            debt_row.saleType, debt_row.portalAccess,
            debt_row.portalManuals
          ]);
        });
      }

      var datatable = $('#customer_benchmark_preview').DataTable();
      datatable.clear();
      datatable.rows.add(debtDataSet);
      datatable.draw();

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
