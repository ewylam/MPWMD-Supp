// POST_CONVERSION_WP_UPDATES.js
// Calcualte missing fields
// Check for parent Base Premise(parcel)
	// If not exist create it as parent
	// If it does exist check to see if current WP records open date is more recent then existing base premise WPs opend date
		// if so, Update base premise by coping required fields and link as parent (see UPDATE_BASE_PREMISE_FROM_WATER_PERMIT)
		// if not, do not update it and link as parent


/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showMessage = true; // Set to true to see results in popup window
var disableTokens = false;
var showDebug = true; // Set to true to see debug messages in email confirmation
var maxSeconds = 4 * 60; // number of seconds allowed for batch processing, usually < 5*60
var autoInvoiceFees = "Y"; // whether or not to invoice the fees added
var useAppSpecificGroupName = false; // Use Group name when populating App Specific Info Values
var useTaskSpecificGroupName = true; // Use Group name when populating Task Specific Info Values
var currentUserID = "ADMIN";
var publicUser = null;
var systemUserObj = aa.person.getUser("ADMIN").getOutput();
var GLOBAL_VERSION = 2.0;
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
	eval(getScriptText(SAScript, SA));
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
	com.accela.aa.util.WebThreadLocal.setServiceProviderCode("MPWMD");

	logMessage("Start Time: " + elapsed() + " Seconds");
	var capList = aa.cap.getByAppType("Demand", "Application", "Water Permit", "New").getOutput();
	var cap;
	var capId;
	var x = 0;
	var vUpdated = 0;
	var vNotUpdated = 0;
	var VResFixtures
	//var vGoodStatuses = ["Active","About to Expire"];

	//showDebug = true;
	showMessage = true;

	logMessage("Processing " + capList.length + " records.");

	for (x in capList) {

		//if (x > 20) {
		//	break;
		//}

		if (x % 500 === 0) {
			aa.sendMail("noReply@accela.com", "ewylam@etechconsultingllc.com", "", batchJobName + " Progress Results : " + x, message);
		}

		cap = capList[x];
		capId = cap.getCapID();
		cap = cap.getCapModel();

		if (capId.getCustomID() != "WP-36930") {
			continue;
		}

		// For all converted WP and Conservation
		// Check the Residential Fixtures table and update the following fields
		// Post Fixture = Post Count x FUV
		// Existing Fixture = Existing Count x FUV
		// If Post Fixture <> 0 set Status field to "Active"
		// If Post Fixture == 0 then set Status = "Removed"
		// If FUV == 0 and Post Count > 0 the set Status to "2nd Bath Protocol"

		var vTableName = "RESIDENTIAL  FIXTURES";
		
		var vFixtureTable = loadASITable(vTableName);
		
		var vASITRow;
		var y = 0;
		var z = 0;
		var vPostCount;
		var vExistingCount;
		var vFUV;
		var vPostFixture;
		var vExistingFixture;
		var vStatus;
		var vField;
		var vASITChanges = false;
		var vChanges = false;

		if (vFixtureTable && vFixtureTable != null && vFixtureTable.length > 0) {
			for (y in vFixtureTable) {
				vASITRow = vFixtureTable[y];
				vPostCount = vASITRow["Post Count"];
				vExistingCount = vASITRow["Existing Count"];
				vFUV = vASITRow["FUV"];
				vPostFixture = vASITRow["Post Fixture"];
				vExistingFixture = vASITRow["Existing Fixture"];
				vStatus = vASITRow["Status"];
		/*
				aa.print(vASITRow["Type of Fixture"].fieldValue);
				aa.print("Post Count " + vPostCount.fieldValue);
				aa.print("Existing Count " + vExistingCount.fieldValue);
				aa.print("FUV " + vFUV.fieldValue);
				aa.print("Post Fixture " + vPostFixture.fieldValue);
				aa.print("Existing Fixture " + vExistingFixture.fieldValue);
				aa.print("Status " + vStatus.fieldValue);
		*/				
				//Set Post Fixture value
				if (vPostFixture.fieldValue == null || vPostFixture.fieldValue == "") {
					vPostFixture.fieldValue = toFixed((vPostCount.fieldValue * vFUV.fieldValue),3) + "";
					vASITChanges = true;
				}		
				
				//Set Existing Fixture value
				if (vExistingFixture.fieldValue == null || vExistingFixture.fieldValue == "") {
					vExistingFixture.fieldValue = toFixed((vExistingCount.fieldValue * vFUV.fieldValue),3) + "";
					vASITChanges = true;
				}

				//Set Statuses
				if (vStatus.fieldValue == null || vStatus == "") {
					if (vPostFixture.fieldValue != 0) {
						vStatus.fieldValue = "Active";
						vASITChanges = true;
					} else if (vPostFixture.fieldValue == 0) {
						vStatus.fieldValue = "Removed";
						vASITChanges = true;
					}

					if (vPostCount.fieldValue > 0 && vFUV.fieldValue == 0) {
						vStatus.fieldValue = "2nd Bath Protocol";
						vASITChanges = true;
					}
				}
			}
		}
		if (vASITChanges) {
			removeASITable(vTableName, capId);
			addASITable(vTableName, vFixtureTable, capId);
			vChanges = true;
		}

		// Begin script to update the Post Fixture County and Post 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
		var w = 0;
		var vFixture;
		var vFixturePostValue;
		var vTotalFixtureCount = 0;
		var vTotal2ndBathFixtureCount = 0;
		var vFixtureStatus;
		if (vFixtureTable && vFixtureTable != null && vFixtureTable.length > 0) {
			for (w in vFixtureTable) {
				vFixture = vFixtureTable[w];
				vFixturePostValue = parseFloat(vFixture["Post Fixture"].fieldValue);
				vFixtureStatus = vFixture["Status"].fieldValue + "";
				if (vFixturePostValue != "NaN" && vFixtureStatus == "Active") {
					vTotalFixtureCount += vFixturePostValue;
				} else if (vFixturePostValue != "NaN" && vFixtureStatus == "Removed") {
					vTotalFixtureCount += vFixturePostValue; // Value should be negative already
				} else if (vFixturePostValue != "NaN" && vFixtureStatus == "2nd Bath Protocol") {
					vTotal2ndBathFixtureCount += vFixturePostValue;
				}
			}
		}
		if (vTotalFixtureCount != "NaN") {
			editAppSpecific("Post Fixture Unit Count", toFixed(vTotalFixtureCount, 2));
			vChanges = true;
		}
		if (vTotal2ndBathFixtureCount != "NaN") {
			editAppSpecific("Post 2nd Bath Fixture", toFixed(vTotal2ndBathFixtureCount, 2));
			vChanges = true;
		}
		// End script to update the Post Fixture County and Post 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.

		if (vChanges) {
			vUpdated++;
		} else {
			vNotUpdated++;
		}
	}

	logMessage("Updated: " + vUpdated);
	logMessage("Not Updated: " + vNotUpdated);
	logMessage("End Time: " + elapsed() + " Seconds");
	aa.sendMail("noReply@accela.com", "ewylam@etechconsultingllc.com", "", batchJobName + " Complete : " + x, message);
} catch (e) {
	logDebug("Error: " + e);
}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
showMessage = true;
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
function generateReportForEmail(itemCap, reportName, module, parameters) {
	//logMessage(" Report Time Check 1 : " + elapsed() + " Seconds");
	//returns the report file which can be attached to an email.
	var vAltId;
	var user = currentUserID; // Setting the User Name
	var report = aa.reportManager.getReportInfoModelByName(reportName);
	//logMessage(" Report Time Check 2 : " + elapsed() + " Seconds");
	var permit;
	var reportResult;
	var reportOutput;
	var vReportName;
	report = report.getOutput();
	report.setModule(module);
	report.setCapId(itemCap);
	report.setReportParameters(parameters);

	vAltId = itemCap.getCustomID();
	report.getEDMSEntityIdModel().setAltId(vAltId);
	//logMessage(" Report Time Check 3 : " + elapsed() + " Seconds");
	permit = aa.reportManager.hasPermission(reportName, user);
	//logMessage(" Report Time Check 4 : " + elapsed() + " Seconds");
	if (permit.getOutput().booleanValue()) {
		reportResult = aa.reportManager.getReportResult(report);
		//logMessage(" Report Time Check 5 : " + elapsed() + " Seconds");
		if (!reportResult.getSuccess()) {
			logDebug("System failed get report: " + reportResult.getErrorType() + ":" + reportResult.getErrorMessage());
			return false;
		} else {
			reportOutput = reportResult.getOutput();
			vReportName = reportOutput.getName();
			logMessage("Report " + vReportName + " generated for record " + itemCap.getCustomID() + ". " + parameters);
			//logMessage(" Report Time Check 6 : " + elapsed() + " Seconds");
			return vReportName;
		}
	} else {
		logDebug("Permissions are not set for report " + reportName + ".");
		return false;
	}
}

function getContactObjs_Batch(itemCap) // optional typeToLoad, optional return only one instead of Array?
{
	var typesToLoad = false;
	if (arguments.length == 2)
		typesToLoad = arguments[1];
	var capContactArray = new Array();
	var cArray = new Array();
	typesToLoad = typesToLoad.split(",");

	//logDebug("1) " + typesToLoad);

	var capContactResult = aa.people.getCapContactByCapID(itemCap);
	//logDebug("2) " + capContactResult.getSuccess());
	if (capContactResult.getSuccess()) {
		var capContactArray = capContactResult.getOutput();
	}

	if (capContactArray) {
		//logDebug("3) " + capContactArray.length);
		for (var yy in capContactArray) {
			//logDebug("4) " + capContactArray[yy].getPeople().contactType);
			//logDebug("5) " + typesToLoad);
			//logDebug("6) " + exists(capContactArray[yy].getPeople().contactType, typesToLoad));

			if (!typesToLoad || exists(capContactArray[yy].getPeople().contactType, typesToLoad)) {
				//logDebug("7)");
				cArray.push(new contactObj(capContactArray[yy]));
			}
		}
	}
	//    logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
	return cArray;

}

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}
