var baseURL = 'https://1048144.app.netsuite.com';
if (nlapiGetContext().getEnvironment() == "SANDBOX") {
    baseURL = 'https://system.sandbox.netsuite.com';
}

var ctx = nlapiGetContext();

function moveDigitalisation(request, response) {
    if (request.getMethod() == "GET") {
        var cust_id = request.getParameter('cust_id');
        var form = nlapiCreateForm('Move Digitalisation');

        var cust_record = nlapiLoadRecord('customer', cust_id);
        var entity_id = cust_record.getFieldValue('entityid');
        var cust_name = cust_record.getFieldValue('companyname');
        var new_cust_id = cust_record.getFieldValue('custentity_new_customer');
        var new_cust_name = cust_record.getFieldText('custentity_new_customer');

        var inlineQty = '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script><script src="//code.jquery.com/jquery-1.11.0.min.js"></script><link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.16/css/jquery.dataTables.css"><script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.js"></script><link href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" rel="stylesheet"><script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script><link rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2060796&c=1048144&h=9ee6accfd476c9cae718&_xt=.css"/><script src="https://1048144.app.netsuite.com/core/media/media.nl?id=2060797&c=1048144&h=ef2cda20731d146b5e98&_xt=.js"></script><link type="text/css" rel="stylesheet" href="https://1048144.app.netsuite.com/core/media/media.nl?id=2090583&c=1048144&h=a0ef6ac4e28f91203dfe&_xt=.css"><style>.mandatory{color:red;}</style>';
        inlineQty += '<div class="container" style="padding-top: 3%;"><div id="alert" class="alert alert-danger fade in hidden"></div>';

        inlineQty += '<div class="form-group container">'
        inlineQty += '<div class="row">';
        inlineQty += '<div class="col-sm-6"><div class="input-group"><span class="input-group-addon" style="font-weight:bold;">MOVE DIGITALISATION FROM</span>';
        inlineQty += '<input class="form-control" type="text" value="' + entity_id + ' ' + cust_name + '" readonly/></div></div>';
        inlineQty += '<div class="col-sm-6"><div class="input-group"><span class="input-group-addon" style="font-weight:bold;">TO</span><input class="form-control" type="text" value="' + new_cust_name + '" readonly/></div></div>';
        inlineQty += '</div></div>';

        inlineQty += '</div>'

        form.addField('preview_table', 'inlinehtml', '').setLayoutType('startrow').setDefaultValue(inlineQty);
        form.addField('custpage_customer_id', 'text', 'Customer ID').setDisplayType('hidden').setDefaultValue(cust_id);

        form.addSubmitButton('Move Digitalisation');
        form.addButton('back', 'Back', 'onclick_back()');
        form.setScript('customscript_cl_move_digitalisation');
        response.writePage(form);
    } else {
        var cust_id = request.getParameter('custpage_customer_id');
        var customer_record = nlapiLoadRecord('customer', cust_id);
        var new_customer_id = customer_record.getFieldValue('custentity_new_customer');
        var run_scheduled = customer_record.getFieldValue('custentity_run_scheduled');

        //LEGS & FREQUENCIES
        var legsSearch = nlapiLoadSearch('customrecord_service_leg', 'customsearch_move_digit_legs');
        var filterExpression = [
            ["custrecord_service_leg_customer", "is", cust_id],
        ];
        legsSearch.setFilterExpression(filterExpression);
        var legsResult = legsSearch.runSearch();


        var old_service_id;
        var old_leg_id;

        var leg_id_array = [];
        var freq_id_array = [];
        var count = 0;
        legsResult.forEachResult(function(legResult) {
            var service_id = legResult.getValue("internalid", "CUSTRECORD_SERVICE_LEG_SERVICE", null);
            var leg_id = legResult.getValue("internalid");
            var freq_id = legResult.getValue("internalid", "CUSTRECORD_SERVICE_FREQ_STOP", null);

            if (count > 0) {
                if (old_leg_id != leg_id) {
                    leg_id_array[leg_id_array.length] = old_leg_id;
                }
                if (old_service_id != service_id) {
                    nlapiLogExecution('DEBUG', 'old_service_id', old_service_id);
                    nlapiLogExecution('DEBUG', 'leg_id_array', leg_id_array);
                    nlapiLogExecution('DEBUG', 'freq_id_array', freq_id_array);
                    for (i = 0; i < leg_id_array.length; i++) {
                        var leg_record = nlapiLoadRecord('customrecord_service_leg', leg_id_array[i]);
                        var leg_zee = leg_record.getFieldValue('custrecord_service_leg_franchisee');
                        leg_record.setFieldValue('custrecord_service_leg_customer', new_customer_id);
                        leg_record.setFieldValue('custrecord_service_leg_service', old_service_id);
                        leg_record.setFieldValue('custrecord_service_leg_franchisee', leg_zee); //for transfers, zee can be diff from cust zee
                        nlapiSubmitRecord(leg_record);
                    }
                    for (i = 0; i < freq_id_array.length; i++) {
                        var freq_record = nlapiLoadRecord('customrecord_service_freq', freq_id_array[i]);
                        var freq_zee = freq_record.getFieldValue('custrecord_service_leg_franchisee');
                        freq_record.setFieldValue('custrecord_service_freq_customer', new_customer_id);
                        freq_record.setFieldValue('custrecord_service_leg_franchisee', freq_zee); //for transfers
                        nlapiSubmitRecord(freq_record);
                    }

                    leg_id_array = [];
                    freq_id_array = [];
                }
            }
            freq_id_array[freq_id_array.length] = freq_id;

            old_service_id = service_id;
            old_leg_id = leg_id;
            count++;
            return true
        })
        if (count > 0) {
            leg_id_array[leg_id_array.length] = old_leg_id;

            nlapiLogExecution('DEBUG', 'old_service_id', old_service_id);

            nlapiLogExecution('DEBUG', 'leg_id_array', leg_id_array);
            nlapiLogExecution('DEBUG', 'freq_id_array', freq_id_array);

            for (i = 0; i < leg_id_array.length; i++) {
                nlapiLogExecution('DEBUG', 'leg_id_array[i]', leg_id_array[i]);
                var leg_record = nlapiLoadRecord('customrecord_service_leg', leg_id_array[i]);
                var leg_zee = leg_record.getFieldValue('custrecord_service_leg_franchisee');
                leg_record.setFieldValue('custrecord_service_leg_customer', new_customer_id);
                leg_record.setFieldValue('custrecord_service_leg_service', old_service_id);
                leg_record.setFieldValue('custrecord_service_leg_franchisee', leg_zee); //for transfers, zee can be diff from cust zee
                nlapiSubmitRecord(leg_record);
            }
            for (i = 0; i < freq_id_array.length; i++) {
                nlapiLogExecution('DEBUG', 'freq_id_array[i]', freq_id_array[i]);
                var freq_record = nlapiLoadRecord('customrecord_service_freq', freq_id_array[i]);
                var freq_zee = freq_record.getFieldValue('custrecord_service_leg_franchisee');
                freq_record.setFieldValue('custrecord_service_freq_customer', new_customer_id);
                freq_record.setFieldValue('custrecord_service_leg_franchisee', freq_zee); //for transfers
                nlapiSubmitRecord(freq_record);
            }
        }

        if (!isNullorEmpty(new_customer_id)) {
            var new_customer_record = nlapiLoadRecord('customer', new_customer_id);
            new_customer_record.setFieldValue('custentity_run_scheduled', run_scheduled);
            nlapiSubmitRecord(new_customer_record);
        }

        nlapiSetRedirectURL('RECORD', 'customer', cust_id);
    }
}