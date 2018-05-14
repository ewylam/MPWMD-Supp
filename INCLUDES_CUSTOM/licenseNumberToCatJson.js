/*------------------------------------------------------------------------------------------------------/
| Program : licenseNumberToCatJson.js
| Event   : N/A
|
| Usage   : Converts a license number into a CAT JSON object.
| By: John Towell
|
| Notes   : This file should contain all BCC specific code for gathering CAT data.
/------------------------------------------------------------------------------------------------------*/
function licenseNumberToCatJson(licenseNumber) {
    useAppSpecificGroupName = false;
    licenseNumber = '' + licenseNumber;
    capId = aa.cap.getCapID(licenseNumber).getOutput();
    var capScriptObj = aa.cap.getCap(capId);
    var capModel = (capScriptObj.getOutput()).getCapModel();
    var capSubType = '' + capModel.getCapType().getSubType();

    var legalBusinessName = stringValue(getAppName(capId), 100);
    var licenseType = getLicenseType(licenseNumber, capSubType);
    var licenseStatus = getLicenseStatus('' + capModel.getCapStatus());
    var licenseValidityStart = dateFormat(stringValue(taskStatusDate('Active')));
    var vLicenseObj = new licenseObject(null, capId);
    var licenseExpiration = dateFormat(stringValue(vLicenseObj.b1ExpDate));

    var vPrimary = getContactObj(capId, 'Primary Contact Person');
    var phone1 = null;
    var email = null;
    var firstName = null;
    var lastName = null;
    if(vPrimary) { //in case 'Primary Contact Person' doesn't exist. Shouldn't happen in production
        if(vPrimary.people.phone1) {
            phone1 = stringValue(vPrimary.people.phone1, 20);
        }
        if(vPrimary.people.email) {
            email = stringValue(vPrimary.people.email, 255);
        }
        if(vPrimary.people.firstName) {
            firstName = stringValue(vPrimary.people.firstName, 100);
        }
        if(vPrimary.people.lastName) {
            lastName = stringValue(vPrimary.people.lastName, 100);
        }
    }

    var vBusinesses = getContactObj(capId, 'Business');
    var phone2 = null;
    if(vBusinesses) { //in case 'Business' doesn't exist. Shouldn't happen in production
        if(vBusinesses.people.phone1) {
            phone2 = stringValue(vBusinesses.people.phone1, 20);
        }
    }

    var addressModel = getAddressModel(capId);
    var premiseAddress = stringValue(addressModel.addressLine1, 100);
    var premiseCity = stringValue(addressModel.city, 40);
    var premiseState = stringValue(addressModel.state, 40);
    var premiseZip = stringValue(addressModel.zip, 20);
    // Start ETW Update 12/27/17
	//var sellersPermitNumber = stringValue(getAppSpecific("Seller's Permit Number"), 50);
	var sellerPermitNumber = stringValue(getAppSpecific("Seller's Permit Number"), 50);
	// End ETW Update 12/27/17
	
    ////////////FORMAT DATA TO JSON////////////////////////////////////////////////////
    var jsonResult = {
        "LicenseNumber": licenseNumber,
        "LicenseName": legalBusinessName,
        "LicenseType": licenseType,
        "LicenseSubtype": "",
        "LicenseStatus": licenseStatus,
        "LicenseValidityStart": licenseValidityStart,
        "LicenseExpiration": licenseExpiration,
        "MobilePhoneNumber": phone1,
        "MainPhoneNumber": phone2,
        "MainEmail": email,
        "PhysicalAddress": {
            "Street1": premiseAddress,
            "Street2": "",
            "Street3": "",
            "Street4": "",
            "City": premiseCity,
            "County": "",
            "State": premiseState,
            "PostalCode": premiseZip
        },
        "ManagerFirstName": firstName,
        "ManagerMiddleName": "",
        "ManagerLastName": lastName,
        "AssessorParcelNumber" : "",    
		// Start ETW Update 12/27/17
		//"SellersPermitNumber" : sellersPermitNumber
		"SellerPermitNumber" : sellerPermitNumber
		// End ETW Update 12/27/17
    };

    return jsonResult;

    /**
     * ======================= PRIVATE FUNCTIONS ===========================
     *
     * Nested functions to reduce global namespace pollution
     */


    /**
     * Returns the string value or empty string ("") for nulls, can also optionally truncate
     */
    function stringValue(value, length) {
        var result = '' + value;
        if("null" == result) {
            return "";
        } else if ("undefined" == result) {
            return "";
        } else {
            if(length) {
                return truncate(result, length);
            } else {
                return result;
            }
        }
    }

    /**
     * Truncates the value if it is longer then length
     */
    function truncate(value, length) {
        if(value.length > length) {
            return value.substring(0, length);
        } else {
            return value;
        }
    }

    /**
     * Formats the date to CAT format YYYY-MM-DD
     */
    function dateFormat(value) {
        if(value == "") {
            return value;
        } else {
            var dateSplit = value.split("/");
            return dateSplit[2] + "-" + dateZeroPad(dateSplit[0]) + "-" + dateZeroPad(dateSplit[1]);
        }
    }

    /**
     * Left pads the string digit with zero for single digits.
     */
    function dateZeroPad(value) {
        if(value.length === 1) {
            return "0"+value;
        } else {
            return value;
        }
    }

    /**
     * Returns the CAT license status based on this license status
     */
    function getLicenseStatus(licenseStatus) {
        if(licenseStatus == 'Active') { //using "evil twins" because === doesn't work in this environment, sorry Douglas
            return 'Active';
        } else  {
            return 'Inactive';
        }
    }

    /**
     * Returns the CAT license type based on license number and license Type
     */
    function getLicenseType(licenseNumber, subType) {
        var licenseType = licenseNumber.substring(0, licenseNumber.indexOf("-"));
        var firstChar = licenseNumber.substring(0, 1);
        var licenseDigits = licenseType.substring(1, licenseType.length);
        if (firstChar === 'C') {
            return 'Type '+licenseDigits + ' ' + subType;
        } else {
            return firstChar + '-Type ' + licenseDigits + ' ' + subType;
        }
    }

    /**
     * Returns the 'Business' contact 'Premise' address model. It assumes there is only one.
     */
    function getAddressModel(capId) {
        var vBusinesses = getContactObjsByCap_BCC(capId, 'Business');

        if (vBusinesses) {
            // Assume only one business contact
            vBusiness = vBusinesses[0];
            vAddresses = vBusiness.addresses;
            if (vAddresses) {
                x = 0;
                for (x in vAddresses) {
                    vAddress = vAddresses[x];
                    // Use only the Premise address type - assumes only one
                    if (vAddress.getAddressType() == "Premise") { //using "evil twins" because === doesn't work in this environment, sorry Douglas
                        return vAddress;
                    }
                }
            }
        }
    }
}