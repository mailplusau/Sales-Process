/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @Author: Ankith Ravindran <ankithravindran>
 * @Date:   2021-11-05T10:16:06+11:00
 * @Last modified by:   ankithravindran
 * @Last modified time: 2021-11-10T11:58:07+11:00
 */


define(['N/email', 'N/runtime', 'N/search', 'N/record'],
  function(email, runtime, search, record) {
    function execute(context) {

      //MPEX Customers - Commencing Today or Not Onboarded
      var custListCommenceTodayResults = search.load({
        type: 'customer',
        id: 'customsearch_cust_list_commence_today'
      });

      var count = 0;

      custListCommenceTodayResults.run().each(function(
        custListCommenceTodaySet) {

        count++;
        return true;
      });

      if (count > 0) {
        var reportLink =
          '<a href="https://1048144.app.netsuite.com/app/site/hosting/scriptlet.nl?script=1381&deploy=1">MPEX Customers - Day 1 Onboarding Customer Service Call</a>';

        //Email subject
        var subject =
          'Day 1 - MPEX Customers Onboarding Call';

        //Email Body
        var emailBody =
          'Dear Account Manager,</br></br>Please review customers MPEX usage. Place a customer service call, offer referral program and update the expected usage of the customer.</br>';
        emailBody += '<b><u>CUSTOMER COUNT</u></b>: ' +
          count + '</br>';

        emailBody += '<b><u>LINK</u></b>: ' + reportLink;

        emailBody +=
          '</br></br><b><u>Note</u></b>: If above link not clickable, please copy and paste in browser.'

        //Send email to the Sales Rep
        email.send({
          author: 112209,
          recipients: ['belinda.urbani@mailplus.com.au'],
          subject: subject,
          body: emailBody,
          cc: ['luke.forbes@mailplus.com.au', 'ankith.ravindran@mailplus.com.au']
        });
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
