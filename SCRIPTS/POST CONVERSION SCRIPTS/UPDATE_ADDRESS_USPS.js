/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = false; // Set to true to see results in popup window
var disableTokens = false;
var showDebug = true; // Set to true to see debug messages in email confirmation
var maxSeconds = 4 * 60; // number of seconds allowed for batch processing, usually < 5*60
var autoInvoiceFees = "Y"; // whether or not to invoice the fees added
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = true; // Use Group name when populating Task Specific Info Values
var currentUserID = "ADMIN";
var publicUser = null;
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var GLOBAL_VERSION = 2.0
	var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");
var controlString = "Batch";
var startDate = new Date();
var startTime = startDate.getTime();
var message = ""; // Message String
var debug = ""; // Debug String
var br = "<BR>"; // Break Tag
var feeSeqList = new Array(); // invoicing fee list
var paymentPeriodList = new Array(); // invoicing pay periods
var bSetCreated = false; //Don't create a set until we find our first app
var setId = "";
var timeExpired = false;
var emailText = "";
var capId = null;
var cap = null;
var capIDString = "";
var appTypeResult = null;
var appTypeString = "";
var appTypeArray = new Array();
var capName = null;
var capStatus = null;
var fileDateObj = null;
var fileDate = null;
var fileDateYYYYMMDD = null;
var parcelArea = 0;
var estValue = 0;
var houseCount = 0;
var feesInvoicedTotal = 0;
var balanceDue = 0;
var houseCount = 0;
var feesInvoicedTotal = 0;
var capDetail = "";
var AInfo = new Array();
var partialCap = false;
var SCRIPT_VERSION = 2.0
	var useSA = false;
var SA = null;
var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_FOR_EMSE");
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") {
	useSA = true;
	SA = bzr.getOutput().getDescription();
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS", "SUPER_AGENCY_INCLUDE_SCRIPT");
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription();
	}
}

var startTime = startDate.getTime(); // Start timer

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

//eval(getScriptText("INCLUDES_BATCH"));
eval(getMasterScriptText("INCLUDES_CUSTOM"));

function getMasterScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

function getScriptText(vScriptName) {
	var servProvCode = aa.getServiceProviderCode();
	if (arguments.length > 1)
		servProvCode = arguments[1]; // use different serv prov code
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		var emseScript = emseBiz.getScriptByPK(servProvCode, vScriptName, "ADMIN");
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}
/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//Needed HERE to log parameters below in eventLog
var sysDate = aa.date.getCurrentDate();
var batchJobID = aa.batchJob.getJobID().getOutput();
var batchJobName = "" + aa.env.getValue("batchJobName");
/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//
// Your variables go here
// Ex. var appGroup = getParam("Group");
//
/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|-----------------------------------------------------------------------------------------------------+/
/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
// Your script goes here
// Ex. var appGroup = getParam("Group");
//
try {
	var capList = aa.cap.getByAppType("Demand", null, null, null).getOutput();
	var cap;
	var capId;
	var x = 0;

	// Get USPS connection information
	var URL = lookup("Address Verification Interface Settings", "USPS Endpoint");
	var USPSUser = lookup("Address Verification Interface Settings", "USPS UserID");
	var Parms = "API=Verify&XML=<AddressValidateRequest%20USERID=%22" + USPSUser + "%22><Address ID=%220%22><Address1></Address1><Address2></Address2><City></City><State></State><Zip5></Zip5><Zip4></Zip4></Address></AddressValidateRequest>";

	// Setup Address variables
	var vAddressResult;
	var vAddressArray;
	var vAddressModel;
	var y = 0;
	var vStreetNbr;
	var vPrefix;
	var vStreetName;
	var vStreetType;
	var vDirection;
	var vUnitNbr;
	var vUnitType;
	var vCity;
	var vState;
	var vZip;
	var vAddrLine1;
	var vAddrLine2;
	var addPart;
	var addressInALine;

	//showDebug = true;
	showMessage = true;

	logMessage("Processing " + capList.length + " records.");

	for (x in capList) {
		// Get USPS connection information
		Parms = "API=Verify&XML=<AddressValidateRequest%20USERID=%22" + USPSUser + "%22><Address ID=%220%22><Address1></Address1><Address2></Address2><City></City><State></State><Zip5></Zip5><Zip4></Zip4></Address></AddressValidateRequest>";

		if (x > 1) {
			break;
		}

		// Set record variables
		cap = capList[x];
		capId = cap.getCapID();
		cap = cap.getCapModel();

		logDebug("Processing: " + capId.getCustomID());

		// Get records address
		vAddressResult = aa.address.getAddressByCapId(capId);
		if (vAddressResult.getSuccess() == true) {
			vAddressArray = vAddressResult.getOutput();
			if (vAddressArray != null && vAddressArray.length > 0) {
				for (y in vAddressArray) {
					vAddressModel = vAddressArray[y];
					// Get address values
					vStreetNbr = vAddressModel.getHouseNumberAlphaStart();
					vPrefix = vAddressModel.getStreetPrefix();
					vStreetName = vAddressModel.getStreetName();
					vStreetType = vAddressModel.getStreetSuffix();
					vDirection = vAddressModel.getStreetDirection();
					vUnitNbr = vAddressModel.getUnitStart();
					vUnitType = vAddressModel.getUnitType();
					vCity = vAddressModel.getCity();
					vState = vAddressModel.getState();
					vZip = vAddressModel.getZip();
					vAddrLine1 = vAddressModel.getAddressLine1();
					vAddrLine2 = vAddressModel.getAddressLine2();

					if (vZip != null) {
						vZip = vZip.substring(0, 5);
					}

					// Build single address line
					addressInALine = vStreetNbr;
					addPart = vDirection;
					if (addPart && addPart != "" && addPart != null) {
						addressInALine += " " + addPart;
					}
					addPart = vStreetName;
					if (addPart && addPart != "" && addPart != null) {
						addressInALine += " " + addPart.trim();
					}
					addPart = vStreetType;
					if (addPart && addPart != "" && addPart != null) {
						addressInALine += " " + addPart;
					}

					logDebug("addressInALine: " + addressInALine);
					logDebug("vUnitNbr: " + vUnitNbr);
					logDebug("vCity: " + vCity);
					logDebug("vState: " + vState);
					logDebug("vZip: " + vZip);

					if ((vUnitNbr != null && vUnitNbr != "")) {
						Parms = replaceNode(Parms, "Address1", vUnitNbr);
					}
					Parms = replaceNode(Parms, "Address2", addressInALine);
					Parms = replaceNode(Parms, "City", vCity);
					Parms = replaceNode(Parms, "State", vState);
					Parms = replaceNode(Parms, "Zip5", vZip);

					// Submit address info to USPS for verification
					var rootNode = aa.util.httpPost(URL, Parms).getOutput();

					// Error trap a failed web service call
					ans = getNode(rootNode, "Error");
					if (ans.length > 0) {
						logDebug("The address you entered is not valid according to the US Postal Service. </BR>" + getNode(ans, "Description") + " </BR>Please contact the Bureau at 833-768-5880 if you believe you are receiving this message in error.");
					}
					// No WS call error. Begin processing response
					else {
						logDebug("Got something");
						logDebug(getNode(rootNode, "StreetName"));

						/*
						// Save address fields from USPS
						if (vStreetType == "" || vStreetType == null) {
						var vWSStreetType = parseStreetType(getNode(rootNode, "Address2"));
						if (vWSStreetType != null && vWSStreetType != "") {
						addressInALine += " " + vWSStreetType;
						// Save street type back to address model
						vAddressModel.setStreetSuffix(vWSStreetType);
						}
						}

						var addressLine1 = "" + getNode(rootNode, "Address2");
						var state = "" + getNode(rootNode, "State");
						// Check is address is a match
						if (addressLine1 == addressInALine && state == ("" + vState.value)) {
						newZip = "" + getNode(rootNode, "Zip5");
						newZip = newZip.trim();
						zip4 = "" + getNode(rootNode, "Zip4");
						zip4 = zip4.trim();
						if (publicUser) {
						if (zip4 && zip4 != "") {
						newZip = newZip + "-" + zip4;
						}
						} else {
						newZip = newZip + zip4;
						}
						// Update expression address fields City and Zip
						vZip.value = newZip;
						expression.setReturn(vZip);
						vCity.value = getNode(rootNode, "City");
						expression.setReturn(vCity);

						// Update expression address line 1 and 2 for display purposes.
						vAddrLine1.value = addressInALine; ;
						expression.setReturn(vAddrLine1);
						vAddrLine2.value = vUnitNbr.value + ((vUnitType.value != "" && vUnitType.value != null) ? " " + vUnitType.value : "");
						expression.setReturn(vAddrLine2);

						// Update address validated flag - not working, doesn't ever save back to address
						//
						//vAddrValidated.value = "Y";
						//expression.setReturn(vAddrValidated);
						//
						 */
					}
				}
			} else {
				logDebug("No addresses found on record: " + capId.getCustomID());
			}
		} else {
			logDebug("Failed to get address results for record: " + capId.getCustomID());
			logDebug("Error: " + vAddressResult.getErrorMessage());
		}
	}

} catch (e) {
	logDebug("Error: " + e);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
} else {
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage)
		aa.env.setValue("ScriptReturnMessage", message);
	if (showDebug)
		aa.env.setValue("ScriptReturnMessage", debug);
}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/
function unescape(s) {
	s = String(s);
	var n = s.length;
	var result = "";

	for (var k = 0; k < n; k++) {
		var c = s[k];
		if (c == '%') {
			if (k <= (n - 6)) {
				if (s[k + 1] == 'u') {
					if (("0123456789abcdef").indexOf(s[k + 2]) > -1 &&
						("0123456789abcdef").indexOf(s[k + 3]) > -1 &&
						("0123456789abcdef").indexOf(s[k + 4]) > -1 &&
						("0123456789abcdef").indexOf(s[k + 5]) > -1) {
						c = String.fromCharCode(parseInt(s.substring(k + 2, k + 7), 16));
						k = k + 5;
					} else {
						if (k <= (n - 3) &&
							("0123456789abcdef").indexOf(s[k + 1]) > -1 &&
							("0123456789abcdef").indexOf(s[k + 2]) > -1) {
							c = String.fromCharCode(parseInt(("00" + s.substring(k + 1, k + 3)), 16));
							k = k + 2;
						}
					}
				} else {
					if (k <= (n - 3) &&
						("0123456789abcdef").indexOf(s[k + 1]) > -1 &&
						("0123456789abcdef").indexOf(s[k + 2]) > -1) {
						c = String.fromCharCode(parseInt(("00" + s.substring(k + 1, k + 3)), 16));
						k = k + 2;
					}
				}
			} else if (("0123456789abcdef").indexOf(s[k + 1]) > -1 &&
				("0123456789abcdef").indexOf(s[k + 2]) > -1) {
				c = String.fromCharCode(parseInt(("00" + s.substring(k + 1, k + 3)), 16));
				k = k + 2;
			}
		}
		result = result + c;
	}
	return result;
}

function replaceNode(fString, fName, fContents) {

	var fValue = "";
	var startTag = "<" + fName + ">";
	var endTag = "</" + fName + ">";

	startPos = fString.indexOf(startTag) + startTag.length;
	endPos = fString.indexOf(endTag);
	// make sure startPos and endPos are valid before using them
	if (startPos > 0 && startPos <= endPos) {
		fValue = fString.substring(0, startPos) + fContents + fString.substring(endPos);
		return unescape(fValue);
	}
}

function getNode(fString, fName) {
	var fValue = "";
	var startTag = "<" + fName + ">";
	var endTag = "</" + fName + ">";

	startPos = fString.indexOf(startTag) + startTag.length;
	endPos = fString.indexOf(endTag);
	// make sure startPos and endPos are valid before using them
	if (startPos > 0 && startPos < endPos)
		fValue = fString.substring(startPos, endPos);

	return unescape(fValue);
}

function parseStreetType(vAddressLine) {
	var stdChoice = "STREET SUFFIXES";
	var bizDomScriptResult;
	var bizDomScriptObj;
	var bizDomScriptObjArry;
	var bizDomScriptModel;
	var bizDomValue;
	var x = 0;
	var vReturn = "";

	bizDomScriptResult = aa.bizDomain.getBizDomain(stdChoice);
	if (bizDomScriptResult.getSuccess()) {
		bizDomScriptObj = bizDomScriptResult.getOutput();
		bizDomScriptObjArry = bizDomScriptObj.toArray();
		for (x in bizDomScriptObjArry) {
			bizDomScriptModel = bizDomScriptObjArry[x];
			bizDomValue = bizDomScriptModel.getBizdomainValue();
			// Check to see if bizDomValue exists in vAddressLine
			if (vAddressLine.indexOf(" " + bizDomValue) != -1) {
				vReturn = bizDomValue;
			}
		}
	}
	return vReturn;
}
