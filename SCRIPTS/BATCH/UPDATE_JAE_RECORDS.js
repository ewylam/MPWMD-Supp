/*------------------------------------------------------------------------------------------------------/
| Program: Batch Template v3.js  Trigger: Batch
| Client: NA
| Version 1.0 - Base Version.
|
/------------------------------------------------------------------------------------------------------*/
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
var vEmailFrom = "";
var vEmailTo = "";
var vEmailCC = "";

if (aa.env.getValue("FromEmail") != null && aa.env.getValue("FromEmail") != "") {
	vEmailFrom = aa.env.getValue("FromEmail");
}
if (aa.env.getValue("ToEmail") != null && aa.env.getValue("ToEmail") != "") {
	vEmailTo = aa.env.getValue("ToEmail");
}
if (aa.env.getValue("CCEmail") != null && aa.env.getValue("CCEmail") != "") {
	vEmailCC = aa.env.getValue("CCEmail");
}

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

showMessage = true;
showDebug = false;

logMessage("Start of Job");
mainProcess();
logMessage("End of Job: Elapsed Time : " + elapsed() + " Seconds");

/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
if (debug.indexOf("**ERROR") > 0) {
	aa.print(1);
	aa.env.setValue("ScriptReturnCode", "1");
	aa.env.setValue("ScriptReturnMessage", debug);
	aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, "", debug);
} else {
	aa.print(2);
	aa.env.setValue("ScriptReturnCode", "0");
	if (showMessage) {
		aa.print(3);
		aa.env.setValue("ScriptReturnMessage", message);
		aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, "Batch Results", message);
	}
	if (showDebug) {
		aa.print(4);
		aa.env.setValue("ScriptReturnDebug", debug);
		aa.sendMail(vEmailFrom, vEmailTo, vEmailCC, "Batch Results - Debug", debug);
	}
}
/*------------------------------------------------------------------------------------------------------/
| <=========== Errors and Reporting
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| <===========Internal Functions and Classes (Used by this script)
/------------------------------------------------------------------------------------------------------*/
function mainProcess() {
	var vASITNameArray = [];
	vASITNameArray.push("WDS SUMMARY");
	vASITNameArray.push("ENTITLEMENT PURCHASES");
	vASITNameArray.push("PENDING UPDATES");

	var vASITName = "";

	var vJAEList = aa.cap.getByAppType("Demand", "Master", "JAE", "NA").getOutput();
	var vJAEInt = 0;
	for (vJAEInt in vJAEList) {
		cap = vJAEList[vJAEInt];
		capId = cap.getCapID();
	
		logMessage("-Processing " + capId.getCustomID());
		
		var vInt = 0;
		for (vInt in vASITNameArray) {
			vASITName = vASITNameArray[vInt];

			logMessage("--Processing " + vASITName + " ASIT");
			// Create Backup
			var fileName = capId.getCustomID() + "_" + vASITName + "_" + new Date().getTime() + ".txt";
			try {
				var resultSet = getASITRecords(vASITName, capId);
				if (resultSet.length != 0) {
					logMessage("---Processing " + resultSet.length + " row(s)");
				}
			} catch (e) {
				logMessage("An error occurred while getting ASIT: " + e);
				logDebug("**Error: An error occurred while getting ASIT: " + e);
				return;
			}

			// create the file
			var aoiDataFile = null;
			try {
				aoiDataFile = new java.io.File(fileName);
			} catch (e) {
				logMessage("An error occurred while creating file: " + e);
				logDebug("**Error: An error occurred while creating file: " + e);
				return;
			}
			finally {
				if (aoiDataFile == null) {
					logMessage("File was not created successfully.");
					return;
				}
			}

			// write results to the file
			var writer = null;
			var vSeperator = "|";
			try {
				writer = new java.io.BufferedWriter(new java.io.FileWriter(aoiDataFile));
				var vResultCnt = 0;
				var vObjCount = 0;
				if (resultSet.length == 0) {
					writer.write("No ASIT Data Existed");
				}
				for (i in resultSet) {
					var vResultObj = resultSet[i];
					// Get object size (length)
					var vObjLength = 0;
					for (var k in vResultObj) {
						if (vResultObj.hasOwnProperty(k)) {
							vObjLength++;
						}
					}
					// Add column headers from first result object
					if (vResultCnt == 0) {
						var vHeader = "";
						var z = 0;
						vObjCount = 0;
						for (z in vResultObj) {
							vHeader = vHeader + z;
							vObjCount++;
							if (vObjCount != vObjLength) {
								// Add Seperator
								vHeader = vHeader + vSeperator;
							}
						}
						//logDebug("Header: " + vHeader);
						writer.write(vHeader);
					}
					// Add line data
					writer.newLine();
					var vLineData = "";
					var z = 0;
					vObjCount = 0;
					for (z in vResultObj) {
						vLineData = vLineData + vResultObj[z];
						vObjCount++;
						if (vObjCount != vObjLength) {
							// Add Seperator
							vLineData = vLineData + vSeperator;
						}
					}
					//logDebug("vLineData: " + vLineData);
					writer.write(vLineData);
					vResultCnt++;
				}
			} catch (e) {
				logMessage("An error occurred while writing to file: " + e);
				logDebug("**Error: An error occurred while writing to file: " + e);
				return;
			}
			finally {
				try {
					if (writer != null)
						writer.close();
				} catch (writerCloseEx) {
					logMessage("An error occurred while closing file writer: " + writerCloseEx);
					logDebug("**Error: An error occurred while closing file writer: " + writerCloseEx)
					return;
				}
			}

			// Save file to EDMS, update ASI, remove ASIT
			try {
				if (aoiDataFile != null) {
					// Get newDocumentModel
					var documentModel = aa.document.newDocumentModel().getOutput();
					// Populate the documentModel
					var tmpEntId = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();
					//documentModel.setDocumentNo(null);
					documentModel.setFileName(fileName);
					documentModel.setEntityType("CAP");
					documentModel.setSocComment("Accela Document Service");
					documentModel.setRecStatus("A");
					documentModel.setRecFulNam("ADMIN");
					documentModel.setDocType("text/plain");
					documentModel.setRecDate(new Date());
					documentModel.setSourceName("ADS");
					documentModel.setDocGroup("MP_JAE_BACKUP");
					documentModel.setDocCategory("Backup");
					documentModel.setServiceProviderCode("MPWMD");
					documentModel.setCapID(capId)
					documentModel.setEntityID(tmpEntId);
					// put together the document content - use java.io.FileInputStream
					var newContentModel = aa.document.newDocumentContentModel().getOutput();
					inputstream = new java.io.FileInputStream(aoiDataFile);
					newContentModel.setDocInputStream(inputstream);
					documentModel.setDocumentContent(newContentModel);
					var newDocResult = aa.document.createDocument(documentModel);
					if (newDocResult.getSuccess()) {
						newDocResult.getOutput();
						logMessage("---Successfully created ASIT backup document: " + documentModel.getFileName());
						logDebug("Successfully created ASIT backup document: " + documentModel.getFileName());

						// Update JAE Record Information from ASIT Data
						if (vASITName == "PENDING UPDATES") {
							logMessage("--Updating ASI Values");
							var vASITEntitlementsSum = 0;
							var vASITParaltaSum = 0;
							var vASITPreParaltaSum = 0;
							var vASITPublicSum = 0;
							var vASITSubsystemSum = 0;
							var vASITOtherSum = 0;
							var vASITWDSSum = 0;
							var vASIT = loadASITable(vASITName, capId);
							var r = 0
								if (typeof(vASIT) == "object") {
									for (r in vASIT) {
										vRow = vASIT[r];
										if (parseFloat(vRow["Entitlements"]) + "" != "NaN") {
											vASITEntitlementsSum += parseFloat(vRow["Entitlements"]);
										}
										if (parseFloat(vRow["Paralta"]) + "" != "NaN") {
											vASITParaltaSum += parseFloat(vRow["Paralta"]);
										}
										if (parseFloat(vRow["Pre-Paralta"]) + "" != "NaN") {
											vASITPreParaltaSum += parseFloat(vRow["Pre-Paralta"]);
										}
										if (parseFloat(vRow["Public"]) + "" != "NaN") {
											vASITPublicSum += parseFloat(vRow["Public"]);
										}
										if (parseFloat(vRow["Subsystem"]) + "" != "NaN") {
											vASITSubsystemSum += parseFloat(vRow["Subsystem"]);
										}
										if (parseFloat(vRow["Other"]) + "" != "NaN") {
											vASITOtherSum += parseFloat(vRow["Other"]);
										}
										if (parseFloat(vRow["WDS"]) + "" != "NaN") {
											vASITWDSSum += parseFloat(vRow["WDS"]);
										}
									}
									editAppSpecific("Entitlements Total Last Update", toFixed(vASITEntitlementsSum, 4));
									editAppSpecific("Paralta Total Last Update", toFixed(vASITParaltaSum, 4));
									editAppSpecific("Pre-Paralta Total Last Update", toFixed(vASITPreParaltaSum, 4));
									editAppSpecific("Public Total Last Update", toFixed(vASITPublicSum, 4));
									editAppSpecific("Subsystem Total Last Update", toFixed(vASITSubsystemSum, 4));
									editAppSpecific("Other Total Last Update", toFixed(vASITOtherSum, 4));
									editAppSpecific("Other Total Last Update", toFixed(vASITOtherSum, 4));

									//get today as a string "MM/DD/YYYY"
									var vToday = new Date();
									var vToday_mm = vToday.getMonth() + 1;
									vToday_mm = (vToday_mm < 10) ? '0' + vToday_mm : vToday_mm;
									var vToday_dd = vToday.getDate();
									vToday_dd = (vToday_dd < 10) ? '0' + vToday_dd : vToday_dd;
									var vToday_yyyy = vToday.getFullYear();
									var vTodayString = vToday_mm + "/" + vToday_dd + "/" + vToday_yyyy;
									editAppSpecific("Last Update", vTodayString);

									logMessage("--Removing " + vASITName + " ASIT");
									//removeASITable(vASITName, capId);
								}
						}

					} else {
						logDebug("Failed to create ASIT backup document: " + documentModel.getFileName());
						logDebug(newDocResult.getErrorMessage());
					}
				} else {
					logDebug("Missing or bad datafile. Could not save ASIT backup");
				}
			} catch (err) {
				logDebug("Error processing: " + err.message);
				return false;
			}
		}
	}
}

function getASITRecords(pTableName, pCapId) {
	var vASIT = loadASITable(pTableName, pCapId);
	if (typeof(vASIT) == "object") {
		return vASIT;
	}
	var vDefault = [];
	return vDefault;
}

function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}