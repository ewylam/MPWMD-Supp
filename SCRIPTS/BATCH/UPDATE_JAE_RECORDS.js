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

	var vNewTotalTransfers = 0;
	for (vJAEInt in vJAEList) {
		cap = vJAEList[vJAEInt];
		capId = cap.getCapID();

		if (capId.getCustomID() != 'JAE10') {
			continue;
		}

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

						// Copy Current Balance ASI to Balance Last Month ASIT
						var vExistingCurrentBalance = getAppSpecific("Current Balance");
						if (vExistingCurrentBalance != null && vExistingCurrentBalance != "") {
							vExistingCurrentBalance = parseFloat(vExistingCurrentBalance);
						} else {
							vExistingCurrentBalance = 0;
						}
						var vNewBalanceLastMonth = parseFloat(vExistingCurrentBalance);
						editAppSpecific("Balance Last Month", toFixed(vExistingCurrentBalance, 3));

						// Update JAE Record Information from ASIT Data
						if (vASITName == "ENTITLEMENT PURCHASES") {
							var vASITQuantitySum = 0;
							var vASIT = loadASITable(vASITName, capId);
							var vRow;
							var vTransferAmountSum = 0;
							var r = 0
								if (typeof(vASIT) == "object") {
									logMessage("--Updating ASI Values from ENTITLEMENT PURCHASES");
									for (r in vASIT) {
										vRow = vASIT[r];
										if (parseFloat(vRow["Quantity"]) + "" != "NaN") {
											vASITQuantitySum += parseFloat(vRow["Quantity"]);
										}
										// Update Pebble Beach Co JAE Record if transfer amount provided.
										if (parseFloat(vRow["Quantity"]) < 0) {
											vTransferAmountSum += parseFloat(vRow["Quantity"]);
										}
									}

									if (vTransferAmountSum != 0) {
										vTransferAmountSum = parseFloat(vTransferAmountSum) * -1;
										editAppSpecific("Transfer Amount", toFixed(vTransferAmountSum, 3));

										var vExistingTotalTransfers = getAppSpecific("Total Transfers");
										if (vExistingTotalTransfers != null && vExistingTotalTransfers != "") {
											vExistingTotalTransfers = parseFloat(vExistingTotalTransfers);
										} else {
											vExistingTotalTransfers = 0;
										}
										vNewTotalTransfers = parseFloat(vExistingTotalTransfers) + parseFloat(vTransferAmountSum);
										editAppSpecific("Total Transfers", toFixed(vNewTotalTransfers, 3));
									}

									editAppSpecific("Entitlements Sold Last Update", toFixed(vASITQuantitySum, 3));

									var vExistingEntitlementSold = getAppSpecific("Entitlement Sold");
									if (vExistingEntitlementSold != null && vExistingEntitlementSold != "") {
										vExistingEntitlementSold = parseFloat(vExistingEntitlementSold);
									} else {
										vExistingEntitlementSold = 0;
									}

									var vNewEntitlementSold = parseFloat(vASITQuantitySum) + parseFloat(vExistingEntitlementSold);
									editAppSpecific("Entitlement Sold", toFixed(vNewEntitlementSold, 3));
									/*
									var vExistingBalanceLastMonth = getAppSpecific("Balance Last Month");
									if (vExistingBalanceLastMonth != null && vExistingBalanceLastMonth != "") {
									vExistingBalanceLastMonth = parseFloat(vExistingBalanceLastMonth);
									} else {
									vExistingBalanceLastMonth = 0;
									}

									var vNewCurrentBalance = parseFloat(vExistingBalanceLastMonth) - parseFloat(vNewEntitlementSold);
									editAppSpecific("Current Balance", toFixed(vNewEntitlementSold, 3));
									 */
									logMessage("--Removing " + vASITName + " ASIT");
									//removeASITable(vASITName, capId);

								}
						}
						if (vASITName == "PENDING UPDATES") {
							var vASITEntitlementsSum = 0;
							var vASITParaltaSum = 0;
							var vASITPreParaltaSum = 0;
							var vASITPublicSum = 0;
							var vASITSubsystemSum = 0;
							var vASITOtherSum = 0;
							var vASITWDSSum = 0;
							var vASIT = loadASITable(vASITName, capId);
							var vRow;
							var r = 0
								if (typeof(vASIT) == "object") {
									logMessage("--Updating ASI Values from PENDING UPDATES");
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
									editAppSpecific("Entitlements Total Last Update", toFixed(vASITEntitlementsSum, 3));
									editAppSpecific("Paralta Total Last Update", toFixed(vASITParaltaSum, 3));
									editAppSpecific("Pre-Paralta Total Last Update", toFixed(vASITPreParaltaSum, 3));
									editAppSpecific("Public Total Last Update", toFixed(vASITPublicSum, 3));
									editAppSpecific("Subsystem Total Last Update", toFixed(vASITSubsystemSum, 3));
									editAppSpecific("Other Total Last Update", toFixed(vASITOtherSum, 3));
									editAppSpecific("WDS Total Last Update", toFixed(vASITOtherSum, 3));

									// Update Entitlement
									var vExistingEntitlementPermitted = getAppSpecific("Entitlement Permitted");
									if (vExistingEntitlementPermitted != null && vExistingEntitlementPermitted != "") {
										vExistingEntitlementPermitted = parseFloat(vExistingEntitlementPermitted);
									} else {
										vExistingEntitlementPermitted = 0;
									}

									var vExistingEntitlement = getAppSpecific("Entitlement");
									if (vExistingEntitlement != null && vExistingEntitlement != "") {
										vExistingEntitlement = parseFloat(vExistingEntitlement);
									} else {
										vExistingEntitlement = 0;
									}

									var vNewEntitlementPermitted = parseFloat(vASITEntitlementsSum) + parseFloat(vExistingEntitlementPermitted);
									editAppSpecific("Entitlement Permitted", toFixed(vNewEntitlementPermitted, 3));

									var vNewEntitlementRemaing = parseFloat(vExistingEntitlement) - parseFloat(vNewEntitlementPermitted) - parseFloat(vNewTotalTransfers);
									editAppSpecific("Entitlement Remaining", toFixed(vNewEntitlementRemaing, 3));

									// Update Current Balance
									var vNewCurrentBalance = parseFloat(vExistingEntitlement) - parseFloat(vNewTotalTransfers);
									editAppSpecific("Current Balance", toFixed(vNewCurrentBalance, 3));

									// Update Paralta
									var vExistingParaltaPermitted = getAppSpecific("Paralta Permitted");
									if (vExistingParaltaPermitted != null && vExistingParaltaPermitted != "") {
										vExistingParaltaPermitted = parseFloat(vExistingParaltaPermitted);
									} else {
										vExistingParaltaPermitted = 0;
									}

									var vExistingParalta = getAppSpecific("Paralta Allocation");
									if (vExistingParalta != null && vExistingParalta != "") {
										vExistingParalta = parseFloat(vExistingParalta);
									} else {
										vExistingParalta = 0;
									}

									var vNewParaltaPermitted = parseFloat(vASITParaltaSum) + parseFloat(vExistingParaltaPermitted);
									editAppSpecific("Paralta Permitted", toFixed(vNewParaltaPermitted, 3));

									var vNewParaltaRemaing = parseFloat(vExistingParalta) - parseFloat(vNewParaltaPermitted);
									editAppSpecific("Paralta Remaining", toFixed(vNewParaltaRemaing, 3));

									// Update Pre-Paralta
									var vExistingPreParaltaPermitted = getAppSpecific("Pre-Paralta Permitted");
									if (vExistingPreParaltaPermitted != null && vExistingPreParaltaPermitted != "") {
										vExistingPreParaltaPermitted = parseFloat(vExistingPreParaltaPermitted);
									} else {
										vExistingPreParaltaPermitted = 0;
									}

									var vExistingPreParalta = getAppSpecific("Pre-Paralta Credit");
									if (vExistingPreParalta != null && vExistingPreParalta != "") {
										vExistingPreParalta = parseFloat(vExistingPreParalta);
									} else {
										vExistingPreParalta = 0;
									}

									var vNewPreParaltaPermitted = parseFloat(vASITPreParaltaSum) + parseFloat(vExistingPreParaltaPermitted);
									editAppSpecific("Pre-Paralta Permitted", toFixed(vNewPreParaltaPermitted, 3));

									var vNewPreParaltaRemaing = parseFloat(vExistingPreParalta) - parseFloat(vNewPreParaltaPermitted);
									editAppSpecific("Pre-Paralta Remaining", toFixed(vNewPreParaltaRemaing, 3));

									// Update Public
									var vExistingPublicPermitted = getAppSpecific("Public Permitted");
									if (vExistingPublicPermitted != null && vExistingPublicPermitted != "") {
										vExistingPublicPermitted = parseFloat(vExistingPublicPermitted);
									} else {
										vExistingPublicPermitted = 0;
									}

									var vExistingPublic = getAppSpecific("Public");
									if (vExistingPublic != null && vExistingPublic != "") {
										vExistingPublic = parseFloat(vExistingPublic);
									} else {
										vExistingPublic = 0;
									}

									var vNewPublicPermitted = parseFloat(vASITPublicSum) + parseFloat(vExistingPublicPermitted);
									editAppSpecific("Public Permitted", toFixed(vNewPublicPermitted, 3));

									var vNewPublicRemaing = parseFloat(vExistingPublic) - parseFloat(vNewPublicPermitted);
									editAppSpecific("Public Remaining", toFixed(vNewPublicRemaing, 3));

									// Update Subsystem
									var vExistingSubsystemPermitted = getAppSpecific("Subsystem Permitted");
									if (vExistingSubsystemPermitted != null && vExistingSubsystemPermitted != "") {
										vExistingSubsystemPermitted = parseFloat(vExistingSubsystemPermitted);
									} else {
										vExistingSubsystemPermitted = 0;
									}

									var vExistingSubsystem = getAppSpecific("Subsystem Allocation");
									if (vExistingSubsystem != null && vExistingSubsystem != "") {
										vExistingSubsystem = parseFloat(vExistingSubsystem);
									} else {
										vExistingSubsystem = 0;
									}

									var vNewSubsystemPermitted = parseFloat(vASITSubsystemSum) + parseFloat(vExistingSubsystemPermitted);
									editAppSpecific("Subsystem Permitted", toFixed(vNewSubsystemPermitted, 3));

									var vNewSubsystemRemaing = parseFloat(vExistingSubsystem) - parseFloat(vNewSubsystemPermitted);
									editAppSpecific("Subsystem Remaining", toFixed(vNewSubsystemRemaing, 3));

									// Update Other
									var vExistingOtherPermitted = getAppSpecific("Other Permitted");
									if (vExistingOtherPermitted != null && vExistingOtherPermitted != "") {
										vExistingOtherPermitted = parseFloat(vExistingOtherPermitted);
									} else {
										vExistingOtherPermitted = 0;
									}

									var vExistingOther = getAppSpecific("Other Allocation");
									if (vExistingOther != null && vExistingOther != "") {
										vExistingOther = parseFloat(vExistingOther);
									} else {
										vExistingOther = 0;
									}

									var vNewOtherPermitted = parseFloat(vASITOtherSum) + parseFloat(vExistingOtherPermitted);
									editAppSpecific("Other Permitted", toFixed(vNewOtherPermitted, 3));

									var vNewOtherRemaing = parseFloat(vExistingOther) - parseFloat(vNewOtherPermitted);
									editAppSpecific("Other Remaining", toFixed(vNewOtherRemaing, 3));

									// Update WDS
									var vExistingWDSPermitted = getAppSpecific("WDS Permitted");
									if (vExistingWDSPermitted != null && vExistingWDSPermitted != "") {
										vExistingWDSPermitted = parseFloat(vExistingWDSPermitted);
									} else {
										vExistingWDSPermitted = 0;
									}

									var vExistingWDS = getAppSpecific("WDS Allocation");
									if (vExistingWDS != null && vExistingWDS != "") {
										vExistingWDS = parseFloat(vExistingWDS);
									} else {
										vExistingWDS = 0;
									}

									var vNewWDSPermitted = parseFloat(vASITWDSSum) + parseFloat(vExistingWDSPermitted);
									editAppSpecific("WDS Permitted", toFixed(vNewWDSPermitted, 3));

									var vNewWDSRemaing = parseFloat(vExistingWDS) - parseFloat(vNewWDSPermitted);
									editAppSpecific("WDS Remaining", toFixed(vNewWDSRemaing, 3));

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
