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
var GLOBAL_VERSION = 3.0

	var cancel = false;

var vScriptName = aa.env.getValue("ScriptCode");
var vEventName = aa.env.getValue("EventName");

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

if (SA) {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS", SA));
	eval(getMasterScriptText(SAScript, SA));
} else {
	eval(getMasterScriptText("INCLUDES_ACCELA_FUNCTIONS"));
}

eval(getScriptText("INCLUDES_BATCH"));
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

var vSetName = "ISSUED";
var vSetMembers = [];

var memberResult = aa.set.getCAPSetMembersByPK(vSetName);

if (!memberResult.getSuccess()) {
	aa.print("**WARNING** error retrieving set members " + memberResult.getErrorMessage());
} else {
	vSetMembers = memberResult.getOutput().toArray();
}

aa.print("here: " + vSetMembers.length);

var x = 0;
for (x in vSetMembers) {
	capId = aa.cap.getCapID(vSetMembers[x].getID1(),vSetMembers[x].getID2(),vSetMembers[x].getID3()).getOutput();
	aa.print(capId.getCustomID());
	mainProcess();
	capId = null;
}

/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	var vJAECapIdArray;
	var vJAECapId;
	var vJAERecordName;
	var vPendingUpdatesTableName;
	var vPengingUpdatesASIT;
	var vASITRow;
	var vUseJurisdiction;
	var vJurisdiction;
	var vUseEntitlement;
	var vEntitlementName;
	var vSubsystemName;
	var vUseWDS;
	var vWDSName;
	var vIssuedDate;
	var vParaltaValue;
	var vPreParaltaValue;
	var vPublicValue;
	var vSubsystemValue;
	var vOtherValue;
	var vEntitlementsValue;
	var vWDSValue;
	var x;

	vJAECapIdArray = [];

	// Find JAE record(s) to update
	// Add Jurisdiction if used
	vUseJurisdiction = getAppSpecific("Use Jurisdiction");
	if (vUseJurisdiction == "CHECKED") {
		vJurisdiction = getAppSpecific("Jurisdiction");
		if (vJurisdiction != null && vJurisdiction != "") {
			vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vJurisdiction);
			if (vJAECapId != null && vJAECapId != "") {
				if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
					vJAECapIdArray.push(vJAECapId);
				}
			}
		}
	}

	// Add Entitlement if used
	vUseEntitlement = getAppSpecific("Use Entitlement");
	if (vUseEntitlement == "CHECKED") {
		vEntitlementName = getAppSpecific("Entitlement Name");
		if (vEntitlementName != null && vEntitlementName != "") {
			vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vEntitlementName);
			if (vJAECapId != null && vJAECapId != "") {
				if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
					vJAECapIdArray.push(vJAECapId);
				}
			}
		}
	}

	// Add Subsystem if used
	vSubsystemValue = getAppSpecific("Subsystem");
	vSubsystemName = getAppSpecific("Subsystem Name");
	if (vSubsystemValue != null && vSubsystemValue != "" && vSubsystemName != null && vSubsystemName != "") {
		vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vSubsystemName);
		if (vJAECapId != null && vJAECapId != "") {
			if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
				vJAECapIdArray.push(vJAECapId);
			}
		}
	}

	// Add WDS if used
	vUseWDS = getAppSpecific("Use WDS");
	if (vUseWDS == "CHECKED") {
		vWDSName = getAppSpecific("Allocation Name");
		if (vWDSName != null && vWDSName != "") {
			vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vWDSName);
			if (vJAECapId != null && vJAECapId != "") {
				if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
					vJAECapIdArray.push(vJAECapId);
				}
			}
		}
	}

	x = 0;
	for (x in vJAECapIdArray) {
		vJAECapId = vJAECapIdArray[x];
		if (vJAECapId != null && vJAECapId != "") {
			// Get JAE records name
			vJAERecordName = getAppName(vJAECapId);

			aa.print("Updating JAE Record: " + vJAECapId.getCustomID() + " " + vJAERecordName);

			// Get Water Permit Values
			vPendingUpdatesTableName = "PENDING UPDATES";
			vIssuedDate = "";
			vParaltaValue = "";
			vPreParaltaValue = "";
			vPublicValue = "";
			vSubsystemValue = "";
			vOtherValue = "";
			vEntitlementsValue = "";
			vWDSValue = "";

			vIssuedDate = getAppSpecific("Issued Date");
			if (vIssuedDate == null) {
				vIssuedDate = "";
			} else {
				vIssuedDate = vIssuedDate + "";
			}

			if (vJAERecordName == vJurisdiction) {
				vParaltaValue = getAppSpecific("Paralta");
				if (vParaltaValue == null) {
					vParaltaValue = "";
				} else {
					vParaltaValue = vParaltaValue + "";
				}
				vPreParaltaValue = getAppSpecific("Pre-Paralta");
				if (vPreParaltaValue == null) {
					vPreParaltaValue = "";
				} else {
					vPreParaltaValue = vPreParaltaValue + "";
				}
				vPublicValue = getAppSpecific("Public");
				if (vPublicValue == null) {
					vPublicValue = "";
				} else {
					vPublicValue = vPublicValue + "";
				}
				vOtherValue = getAppSpecific("Other");
				if (vOtherValue == null) {
					vOtherValue = "";
				} else {
					vOtherValue = vOtherValue + "";
				}
			}

			if (vJAERecordName == vEntitlementName) {
				vEntitlementsValue = getAppSpecific("Entitlements");
				if (vEntitlementsValue == null) {
					vEntitlementsValue = "";
				} else {
					vEntitlementsValue = vEntitlementsValue + "";
				}
			}

			if (vJAERecordName == vSubsystemName) {
				vSubsystemValue = getAppSpecific("Subsystem");
				if (vSubsystemValue == null) {
					vSubsystemValue = "";
				} else {
					vSubsystemValue = vSubsystemValue + "";
				}
			}

			if (vJAERecordName == vWDSName) {
				vWDSValue = getAppSpecific("WDS");
				if (vWDSValue == null) {
					vWDSValue = "";
				} else {
					vWDSValue = vWDSValue + "";
				}
			}

			// Update JAE records 'Pending Updates' ASIT
			// Create ASIT Row info
			vASITRow = [];
			vASITRow["Permit Number"] = new asiTableValObj("Permit Number", capId.getCustomID(), "Y");
			vASITRow["Issued"] = new asiTableValObj("Issued", vIssuedDate, "Y");
			vASITRow["Paralta"] = new asiTableValObj("Paralta", vParaltaValue, "Y");
			vASITRow["Pre-Paralta"] = new asiTableValObj("Pre - Paralta", vPreParaltaValue, "Y");
			vASITRow["Public"] = new asiTableValObj("Public", vPublicValue, "Y");
			vASITRow["Subsystem"] = new asiTableValObj("Subsystem", vSubsystemValue, "Y");
			vASITRow["Other"] = new asiTableValObj("Other", "" + vOtherValue, "Y");
			vASITRow["Entitlements"] = new asiTableValObj("Entitlements", vEntitlementsValue, "Y");
			vASITRow["WDS"] = new asiTableValObj("WDS", vWDSValue, "Y");

			vPengingUpdatesASIT = loadASITable(vPendingUpdatesTableName, vJAECapId);
			if (typeof(vPengingUpdatesASIT) == "object") {
				// Add new row to ASIT
				vPengingUpdatesASIT.push(vASITRow);
				// Remove and re-add updated table
				removeASITable(vPendingUpdatesTableName, vJAECapId);
				addASITable(vPendingUpdatesTableName, vPengingUpdatesASIT, vJAECapId);
			} else {
				vPengingUpdatesASIT = [];
				// Add new row to ASIT
				vPengingUpdatesASIT.push(vASITRow);
				// Add updated table
				addASITable(vPendingUpdatesTableName, vPengingUpdatesASIT, vJAECapId);
			}
		}
	}
}