/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-05T10:16:06+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-08T10:05:26+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record'],
  function(email, runtime, search, record) {
    function execute(context) {

      // 	Search: MPEX Reporting - New Customers - Email Sales Rep
      var mpexUsageResults = search.load({
        type: 'customer',
        id: 'customsearch4213'
      });

      var old_sales_rep = null;
      var count = 0;

      var no_of_weeks = 0;
      var avg_weekly_usage = 0;
      var inlineHtml = '';

      //Count of customers with NO USAGE
      var customer_count_with_no_mpex_usage = 0;

      //Count of customers with  Actual usage 45% less than the expected usage
      var customer_count_with_orange_mpex_usage = 0;

      //Running the search
      mpexUsageResults.run().each(function(mpexUsageSet) {

        //Customer Inbternal ID
        var custInternalID = mpexUsageSet.getValue({
          name: 'internalid'
        });

        //Customer Entity ID
        var custEntityID = mpexUsageSet.getValue({
          name: 'entityid'
        });

        //Customer Company Name
        var custName = mpexUsageSet.getValue({
          name: 'companyname'
        });

        //Customer Franchisee Internal ID
        var zeeID = mpexUsageSet.getValue({
          name: 'partner'
        });

        //Customer Franchisee Name
        var zeeName = mpexUsageSet.getText({
          name: 'partner'
        });

        //Customer Sign Up Date
        var signUpDate = mpexUsageSet.getValue({
          name: 'custrecord_comm_date_signup',
          join: 'CUSTRECORD_CUSTOMER'
        });

        //Customer Commencement Date
        var commDate = mpexUsageSet.getValue({
          name: 'custrecord_comm_date',
          join: 'CUSTRECORD_CUSTOMER'
        });

        //Customer Sales Rep Internal ID
        var salesRepID = mpexUsageSet.getValue({
          name: 'custrecord_salesrep',
          join: 'CUSTRECORD_CUSTOMER'
        });

        //Customer Sales Rep Name
        var salesRepName = mpexUsageSet.getText({
          name: 'custrecord_salesrep',
          join: 'CUSTRECORD_CUSTOMER'
        });

        //Customer Expected Weekly Usage
        var expWeeklyUsage = mpexUsageSet.getValue({
          name: 'custentity_exp_mpex_weekly_usage'
        });

        //Customer Actual Weekly Usage
        var actualWeeklyUsage = mpexUsageSet.getValue({
          name: 'custentity_actual_mpex_weekly_usage'
        });

        //Is MPEX Customer or not?
        var mpexCustomer = mpexUsageSet.getText({
          name: 'custentity_mpex_customer'
        });

        var sort_cat = '1 - White'

        if (isNullorEmpty(old_sales_rep)) {
          //If MPEX Customer is YES or Actual Weekly Usage is not Empty or NULL
          if (mpexCustomer == 'Yes' || !isNullorEmpty(actualWeeklyUsage)) {
            //If Actual Weekly Usage is not empty or NULL
            if (!isNullorEmpty(actualWeeklyUsage)) {
              var parsedUsage = JSON.parse(actualWeeklyUsage);
              var tempTotal = 0;
              for (var x = 0; x < parsedUsage['Usage'].length; x++) {
                tempTotal += parseInt(parsedUsage['Usage'][x]['Count'])
              }

              //No. of weeks MPEX used
              no_of_weeks = parsedUsage['Usage'].length;

              //Av. Weekly usage based on the no. of weeks used and total usage amongst those weeks.
              avg_weekly_usage = parseFloat(tempTotal / no_of_weeks).toFixed(
                2)

              //45% of the Expected Usage.
              var orangeGroup = parseInt(
                expWeeklyUsage) - (0.45 * parseInt(
                expWeeklyUsage))

              //If Avg. weekly usage greater than or equal to the expected weekly usage
              if ((parseFloat(avg_weekly_usage) >= parseInt(
                  expWeeklyUsage)) ||
                (!isNullorEmpty(actualWeeklyUsage) && (
                  isNullorEmpty(mpexCustomer) ||
                  mpexCustomer == 'No'))) {
                sort_cat = '0 - Green'

              } else if (parseFloat(avg_weekly_usage) < orangeGroup) { //If avg. weekly usage is less than 45% of the expected usage
                sort_cat = '2 - Orange'
                customer_count_with_orange_mpex_usage++
              } else {}
            } else {
              //If Actual Weekly Usage is Empty
              customer_count_with_no_mpex_usage++
              sort_cat = '3 - Red'
            }
          }
        } else if (old_sales_rep == salesRepID) {
          //If MPEX Customer is YES or Actual Weekly Usage is not Empty or NULL
          if (mpexCustomer == 'Yes' || !isNullorEmpty(actualWeeklyUsage)) {
            //If Actual Weekly Usage is not empty or NULL
            if (!isNullorEmpty(actualWeeklyUsage)) {
              var parsedUsage = JSON.parse(actualWeeklyUsage);
              var tempTotal = 0;
              for (var x = 0; x < parsedUsage['Usage'].length; x++) {
                tempTotal += parseInt(parsedUsage['Usage'][x]['Count'])
              }

              //No. of weeks MPEX used
              no_of_weeks = parsedUsage['Usage'].length;

              //Av. Weekly usage based on the no. of weeks used and total usage amongst those weeks.
              avg_weekly_usage = parseFloat(tempTotal / no_of_weeks).toFixed(
                2)

              //45% of the Expected Usage.
              var orangeGroup = parseInt(
                expWeeklyUsage) - (0.45 * parseInt(
                expWeeklyUsage))

              //If Avg. weekly usage greater than or equal to the expected weekly usage
              if ((parseFloat(avg_weekly_usage) >= parseInt(
                  expWeeklyUsage)) ||
                (!isNullorEmpty(actualWeeklyUsage) && (
                  isNullorEmpty(mpexCustomer) ||
                  mpexCustomer == 'No'))) {
                sort_cat = '0 - Green'

              } else if (parseFloat(avg_weekly_usage) < orangeGroup) { //If avg. weekly usage is less than 45% of the expected usage
                sort_cat = '2 - Orange'
                customer_count_with_orange_mpex_usage++
              } else {}
            } else {
              //If Actual Weekly Usage is Empty
              customer_count_with_no_mpex_usage++
              sort_cat = '3 - Red'
            }
          }
        } else if (old_sales_rep != salesRepID) {
          //Link to the Report in NetSuite
          var mpexUsageReportLink =
            '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1376&deploy=1">MPEX Customer List - Last 4 Months - No Usage or Below 45% Expected Usage</a>';

          //Email subject
          var subject =
            'MPEX Customer Count - No Usage or Below 45% Expected Usage';

          //Email Body
          var emailBody =
            'Dear Account Manager,</br></br>Please review customers MPEX usage. Place a customer service call and update the expected usage of the customer.</br>';
          emailBody += '<b><u>CUSTOMER COUNT - NO USAGE</u></b>: ' +
            customer_count_with_no_mpex_usage + '</br>';
          emailBody +=
            '<b><u>CUSTOMER COUNT - AVG WEEKLY USAGE < THAN 45% OF EXPECTED WEEKLY USAGE</u></b>: ' +
            customer_count_with_orange_mpex_usage + '</br>';

          emailBody += '<b><u>LINK</u></b>: ' + mpexUsageReportLink;

          emailBody +=
            '</br></br><b><u>Note</u></b>: If above link not clickable, please copy and paste in browser.'

          //Send email to the Sales Rep
          // email.send({
          //   author: 112209,
          //   recipients: old_sales_rep,
          //   subject: subject,
          //   body: emailBody,
          //   cc: ['luke.forbes@mailplus.com.au']
          // });


          no_of_weeks = 0;
          avg_weekly_usage = 0;
          inlineHtml = '';

          //Count of customers with NO USAGE
          customer_count_with_no_mpex_usage = 0;

          //Count of customers with  Actual usage 45% less than the expected usage
          customer_count_with_orange_mpex_usage = 0;

          sort_cat = '1 - White'

          //If MPEX Customer is YES or Actual Weekly Usage is not Empty or NULL
          if (mpexCustomer == 'Yes' || !isNullorEmpty(actualWeeklyUsage)) {
            //If Actual Weekly Usage is not empty or NULL
            if (!isNullorEmpty(actualWeeklyUsage)) {
              var parsedUsage = JSON.parse(actualWeeklyUsage);
              var tempTotal = 0;
              for (var x = 0; x < parsedUsage['Usage'].length; x++) {
                tempTotal += parseInt(parsedUsage['Usage'][x]['Count'])
              }

              //No. of weeks MPEX used
              no_of_weeks = parsedUsage['Usage'].length;

              //Av. Weekly usage based on the no. of weeks used and total usage amongst those weeks.
              avg_weekly_usage = parseFloat(tempTotal / no_of_weeks).toFixed(
                2)

              //45% of the Expected Usage.
              var orangeGroup = parseInt(
                expWeeklyUsage) - (0.45 * parseInt(
                expWeeklyUsage))

              //If Avg. weekly usage greater than or equal to the expected weekly usage
              if ((parseFloat(avg_weekly_usage) >= parseInt(
                  expWeeklyUsage)) ||
                (!isNullorEmpty(actualWeeklyUsage) && (
                  isNullorEmpty(mpexCustomer) ||
                  mpexCustomer == 'No'))) {
                sort_cat = '0 - Green'

              } else if (parseFloat(avg_weekly_usage) < orangeGroup) { //If avg. weekly usage is less than 45% of the expected usage
                sort_cat = '2 - Orange'
                customer_count_with_orange_mpex_usage++
              } else {}
            } else {
              //If Actual Weekly Usage is Empty
              customer_count_with_no_mpex_usage++
              sort_cat = '3 - Red'
            }
          }
        }

        old_sales_rep = salesRepID;
        count++;
        return true;
      });

      if (count > 0) {
        var mpexUsageReportLink =
          '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1376&deploy=1">MPEX Customer List - Last 4 Months - No Usage or Below 45% Expected Usage</a>';

        //Email subject
        var subject =
          'MPEX Customer Count - No Usage or Below 45% Expected Usage';

        //Email Body
        var emailBody =
          'Dear Account Manager,</br></br>Please review customers MPEX usage. Place a customer service call, offer referral program and update the expected usage of the customer.</br>';
        emailBody += '<b><u>CUSTOMER COUNT - NO USAGE</u></b>: ' +
          customer_count_with_no_mpex_usage + '</br>';
        emailBody +=
          '<b><u>CUSTOMER COUNT - AVG WEEKLY USAGE < THAN 45% OF EXPECTED WEEKLY USAGE</u></b>: ' +
          customer_count_with_orange_mpex_usage + '</br>';

        emailBody += '<b><u>LINK</u></b>: ' + mpexUsageReportLink;

        emailBody +=
          '</br></br><b><u>Note</u></b>: If above link not clickable, please copy and paste in browser.'

        //Send email to the Sales Rep
        // email.send({
        //   author: 112209,
        //   recipients: old_sales_rep,
        //   subject: subject,
        //   body: emailBody,
        //   cc: ['luke.forbes@mailplus.com.au']
        // });
      }
    }

    function isNullorEmpty(val) {
      if (val == '' || val == null) {
        return true;
      } else {
        return false;
      }
    }

    return {
      execute: execute
    };
  });
