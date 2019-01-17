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
var showDebug = false; // Set to true to see debug messages in email confirmation
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
	showDebug = false;
	showMessage = true;
try {
	com.accela.aa.util.WebThreadLocal.setServiceProviderCode("MPWMD");

	logMessage("Start Time: " + elapsed() + " Seconds");
	//var capList = aa.cap.getByAppType("Demand", "Application", "Water Permit", "New").getOutput();
	var capList = getRecordsBySQL();
	var cap;
	var capId;
	var vCapId;
	var vCap;
	var x = 0;
	var vUpdated = 0;
	var vNotUpdated = 0;
	var vResFixtures;
	var vBasePremiseCreated = 0;
	var vBasePremiseLinked = 0;
	//var vGoodStatuses = ["Active","About to Expire"];

	logMessage("Processing " + capList.length + " records.");

	for (x in capList) {

		if (x > 30) {
			break;
		}

		if (x % 500 === 0) {
			aa.sendMail("noReply@accela.com", "ewylam@etechconsultingllc.com", "", batchJobName + " Progress Results : " + x, message);
		}

		vCapId = capList[x];
		vCap = aa.cap.getCap(vCapId).getOutput();

		if (vCapId != null && vCap != null) {
			// Define global variables
			capId = vCapId;
			cap = vCap;
			vCapModel = vCap.getCapModel();

			// Do stuff here
		} else {
			continue;
		}

		//logMessage(capId.getCustomID());

		//cap = capList[x];
		//capId = cap.getCapID();
		//cap = cap.getCapModel();

		//if (capId.getCustomID() != "WP-36930") {
		//	continue;
		//}

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
				//
				// aa.print(vASITRow["Type of Fixture"].fieldValue);
				// aa.print("Post Count " + vPostCount.fieldValue);
				// aa.print("Existing Count " + vExistingCount.fieldValue);
				// aa.print("FUV " + vFUV.fieldValue);
				// aa.print("Post Fixture " + vPostFixture.fieldValue);
				// aa.print("Existing Fixture " + vExistingFixture.fieldValue);
				// aa.print("Status " + vStatus.fieldValue);
				//
				//Set Post Fixture value
				if (vPostFixture.fieldValue == null || vPostFixture.fieldValue == "") {
					vPostFixture.fieldValue = toFixed((vPostCount.fieldValue * vFUV.fieldValue), 3) + "";
					vASITChanges = true;
				}

				//Set Existing Fixture value
				if (vExistingFixture.fieldValue == null || vExistingFixture.fieldValue == "") {
					vExistingFixture.fieldValue = toFixed((vExistingCount.fieldValue * vFUV.fieldValue), 3) + "";
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

		// Begin script to link to/create Base Premise record.
		var vRelatedBasePremises = getRelatedCapsByParcel("Demand/Master/Base Premise/NA");
		var l = 0;
		var vBasePremiseRecId;

		// Base premise record exists.
		if (vRelatedBasePremises != null) {
			if (vRelatedBasePremises.length > 1) {
				showMessage = true;
				comment("More than one Base Premise record exists for the linked parcel(s)");
			}
			// Link to base premise
			for (l in vRelatedBasePremises) {
				vBasePremiseRecId = vRelatedBasePremises[l].getCapID();
				if (getRecordStatus(vBasePremiseRecId) == "Active") {
					// Relate Base Premise record
					addParent(vBasePremiseRecId);
					vBasePremiseLinked++;
					break;
				}
			}
		} else {
			// Create Base Premise
			vBasePremiseRecId = createParent("Demand", "Master", "Base Premise", "NA", getAppName(capId));
			vBasePremiseCreated++;

			//Copy Parcels
			//copyParcels(capId, vBasePremiseRecId);

			//Copy Addresses
			//copyAddress(capId, vBasePremiseRecId);

			//Copy Owners
			//copyOwner(capId,vBasePremiseRecId);
			copyOwnersByParcel(capId, vBasePremiseRecId) // Adds reference owners

			//Copy application name from license to renewal
			//editAppName(getAppName(capId), vBasePremiseRecId);
		}

		// Check to see if WP is the newest one linked to the Base Premise
		var vIsNewer = true;
		if (vBasePremiseRecId != null) {
			var vRelatedRecords = getChildren("Demand/Application/Water Permit/New", vBasePremiseRecId);
			var m = 0;
			var vRelatedRecordId;
			var vRelatedCap;
			var vCurrentRecordFileDateObj = cap.getFileDate();
			var vCurrentRecordFileDate = vCurrentRecordFileDateObj.getMonth() + "/" + vCurrentRecordFileDateObj.getDayOfMonth() + "/" + vCurrentRecordFileDateObj.getYear();
			var vCurrentRecordFileDateJS = new Date(vCurrentRecordFileDate);
			var vRelatedFileDateObj;
			var vRelatedFileDate;
			var vRelatedFileDateJS;

			if (vRelatedRecords != null) {
				vRelatedRecordId = vRelatedRecords[m];
				vRelatedCap = aa.cap.getCap(vRelatedRecordId).getOutput();
				vRelatedFileDateObj = vRelatedCap.getFileDate();
				vRelatedFileDate = vRelatedFileDateObj.getMonth() + "/" + vRelatedFileDateObj.getDayOfMonth() + "/" + vRelatedFileDateObj.getYear();
				vRelatedFileDateJS = new Date(vRelatedFileDate);

				if (vCurrentRecordFileDateJS < vRelatedFileDateJS) {
					vIsNewer = false;
				}
			}

			if (vIsNewer == true) {
				wfTask = "Permit Issuance";
				wfStatus = "Issued";
				logMessage("Updating Base Premise Record: " + vBasePremiseRecId.getCustomID() + " from Water Permit: " + capId.getCustomID());
				include("UPDATE_BASE_PREMISE_FROM_WATER_PERMIT");

				// Update BP Use and Jurisdiction ASI Fields
				editAppSpecific("Use", getAppSpecific("Permit Category", capId), vBasePremiseRecId);

				var vJurisdiction = "";
				vJurisdiction = getAddressCity(capId);
				if (vJurisdiction != "" && vJurisdiction != null & vJurisdiction != false) {
					switch (vJurisdiction) {
					case 'PG 74':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'PG OTHER':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'CARME VALLEY':
						vJurisdiction = 'Monterey County';
						break;
					case ' Carmel':
						vJurisdiction = 'Carmel-by-the-Sea';
						break;
					case 'Salinas':
						vJurisdiction = 'Monterey County';
						break;
					case 'CARMEL HIGHLANDS':
						vJurisdiction = 'Monterey County';
						break;
					case 'PACFIC GROVE':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'PEBBLE BEAACH':
						vJurisdiction = 'Monterey County';
						break;
					case 'SEASIDE':
						vJurisdiction = 'Seaside';
						break;
					case 'PACIFIC GROVE':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'pa':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'MONTEREY 74':
						vJurisdiction = 'Monterey';
						break;
					case 'QUAIL':
						vJurisdiction = 'Monterey County';
						break;
					case 'MONTEREY PUBLIC':
						vJurisdiction = 'Monterey';
						break;
					case 'MONTEREY OTHER':
						vJurisdiction = 'Monterey';
						break;
					case 'COUNTY PUBLIC':
						vJurisdiction = 'Monterey County';
						break;
					case 'DRO OTHER':
						vJurisdiction = 'Del Rey Oaks';
						break;
					case 'MONTEREY':
						vJurisdiction = 'Monterey';
						break;
					case 'Pebble':
						vJurisdiction = 'Monterey County';
						break;
					case 'Carmel Meadows':
						vJurisdiction = 'Monterey County';
						break;
					case 'ENTITLEMENT':
						vJurisdiction = 'Monterey County';
						break;
					case 'CARMELVALLEY':
						vJurisdiction = 'Monterey County';
						break;
					case 'CAMREL':
						vJurisdiction = 'Carmel-by-the-Sea';
						break;
					case 'COUNTY 74':
						vJurisdiction = 'Monterey County';
						break;
					case 'AIRPORT DIST':
						vJurisdiction = 'Airport District';
						break;
					case 'Pebble Beach':
						vJurisdiction = 'Monterey County';
						break;
					case 'MONTEREY COUNTY':
						vJurisdiction = 'Monterey County';
						break;
					case 'SC PUBLIC':
						vJurisdiction = 'Sand City';
						break;
					case 'PEBBLE BEACH CO':
						vJurisdiction = 'Monterey County';
						break;
					case 'PACIFC GROVE':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'SAND CITY':
						vJurisdiction = 'Sand City';
						break;
					case ' PEBBLE BEACH':
						vJurisdiction = 'Monterey County';
						break;
					case 'mo':
						vJurisdiction = 'Monterey';
						break;
					case 'MONTERY COUNTY':
						vJurisdiction = 'Monterey County';
						break;
					case 'PEBBEL BEACH':
						vJurisdiction = 'Monterey County';
						break;
					case 'PG PUBLIC':
						vJurisdiction = 'Pacific Grove';
						break;
					case 'COUNTY':
						vJurisdiction = 'Monterey County';
						break;
					case 'Pebble Bech':
						vJurisdiction = 'Monterey County';
						break;
					case 'Big Sur':
						vJurisdiction = 'Monterey County';
						break;
					case 'SEASIDE PUBLIC':
						vJurisdiction = 'Seaside';
						break;
					case 'ca':
						vJurisdiction = 'Monterey County';
						break;
					case 'DEL REY OAKS':
						vJurisdiction = 'Del Rey Oaks';
						break;
					case 'MONTERY':
						vJurisdiction = 'Monterey';
						break;
					case 'WATER WEST':
						vJurisdiction = 'Monterey County';
						break;
					case 'Various Cities':
						vJurisdiction = 'Monterey County';
						break;
					case 'COUNTY OTHER':
						vJurisdiction = 'Monterey County';
						break;
					case 'GRIFFIN TRUST':
						vJurisdiction = 'Monterey County';
						break;
					case 'Carmel Valley':
						vJurisdiction = 'Monterey County';
						break;
					case 'Carmel':
						vJurisdiction = 'Carmel-by-the-Sea';
						break;
					case 'MACOMBER':
						vJurisdiction = 'Monterey County';
						break;
					case 'QUAIL MEADOWS':
						vJurisdiction = 'Monterey County';
						break;
					case 'Pebble Beah':
						vJurisdiction = 'Monterey County';
						break;
					case 'pe':
						vJurisdiction = 'Monterey County';
						break;
					case 'CARNEL VALLEY':
						vJurisdiction = 'Monterey County';
						break;
					}
				}
				editAppSpecific("Jurisdiction", vJurisdiction, vBasePremiseRecId);
			}
		}
	}

	logMessage("Water Permits Updated: " + vUpdated);
	logMessage("Water Permits Not Updated: " + vNotUpdated);
	logMessage("Base Premise Records Created: " + vBasePremiseCreated);
	logMessage("Base Premise Records Linked: " + vBasePremiseLinked);
	logMessage("End Time: " + elapsed() + " Seconds");
	aa.sendMail("noReply@accela.com", "ewylam@etechconsultingllc.com", "", batchJobName + " Complete : " + x, message);
} catch (e) {
	showDebug = true;
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
function elapsed() {
	var thisDate = new Date();
	var thisTime = thisDate.getTime();
	return ((thisTime - startTime) / 1000)
}

function getRecordsBySQL() {
	// Setup variables
	var initialContext;
	var ds;
	var conn;
	var selectString;
	var sStmt;
	var rSet;
	var retVal;
	var retValArray;
	var capIdArray;
	var retArr;

	// Setup SQL Query to return CapIds
	initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	ds = initialContext.lookup("java:/AA");
	conn = ds.getConnection();
/*
	// Get Records for Testing
	selectString = "SELECT B.B1_PER_ID1 || '-' || B.B1_PER_ID2 || '-' || B.B1_PER_ID3 AS CapId \
		FROM B1PERMIT B \
		INNER JOIN B3PARCEL P ON 1=1 \
		AND B.SERV_PROV_CODE = P.SERV_PROV_CODE \
		AND B.B1_PER_ID1 = P.B1_PER_ID1 \
		AND B.B1_PER_ID2 = P.B1_PER_ID2 \
		AND B.B1_PER_ID3 = P.B1_PER_ID3 \
		AND P.B1_PARCEL_NBR IN ('011241000000', \
		'012341010000', \
		'012282012000', \
		'009293006000', \
		'007041016000', \
		'007031005000', \
		'010053020000', \
		'241201022000', \
		'187631008000', \
		'157041007000', \
		'011022009000', \
		'007482003000', \
		'011526011000', \
		'015271003000', \
		'012601034000', \
		'197011019000', \
		'009441015000', \
		'008441009000')	\
		WHERE 1=1 \
		AND B.SERV_PROV_CODE = 'MPWMD' \
		AND B.B1_PER_GROUP = 'Demand' \
		AND B.B1_PER_TYPE = 'Application' \
		AND B.B1_PER_SUB_TYPE = 'Water Permit' \
		AND B.B1_PER_CATEGORY = 'New' \
		AND B.REC_STATUS = 'A' \
		ORDER BY B.B1_FILE_DD ASC";
*/
	// Get Records
	selectString = "SELECT B.B1_PER_ID1 || '-' || B.B1_PER_ID2 || '-' || B.B1_PER_ID3 AS CapId \
	FROM B1PERMIT B \
	WHERE 1=1 \
	AND B.SERV_PROV_CODE = 'MPWMD' \
	AND B.B1_PER_GROUP = 'Demand' \
	AND B.B1_PER_TYPE = 'Application' \
	AND B.B1_PER_SUB_TYPE = 'Water Permit' \
	AND B.B1_PER_CATEGORY = 'New' \
	AND B.REC_STATUS = 'A' \
	ORDER BY B.B1_FILE_DD ASC";
	//logDebug(selectString);
	
	 
	// Execute the SQL query to return CapIds as a CapIdModel
	sStmt = conn.prepareStatement(selectString);
	rSet = sStmt.executeQuery();
	retVal = "";
	retValArray = [];
	capIdArray = [];
	while (rSet.next()) {
		retVal = rSet.getString("CapId");
		// Separate CapId into three parts, ID1, ID2, ID3
		retValArray = retVal.split("-");
		// Save actual CapId object to array for processing
		capIdArray.push(aa.cap.getCapID(retValArray[0], retValArray[1], retValArray[2]).getOutput());
	}
	sStmt.close();
	conn.close();

	return capIdArray;
}

function getAddressCity(pCapId) {
	var vAddressArray = aa.address.getAddressByCapId(pCapId);
		if (!vAddressArray.getSuccess()) {
			return false;
		}
		vAddressArray = vAddressArray.getOutput();
	var vCity = "";
	var k = 0;
	for (k in vAddressArray) {
		vCity = vAddressArray[k].getCity();
		break; // assume only one for now
	}
	return vCity;
}

function editAppSpecific_Local(itemName,itemValue)  // optional: itemCap
{
	var itemCap = capId;
	var itemGroup = null;
	if (arguments.length == 3) itemCap = arguments[2]; // use cap ID specified in args
   	
  	if (useAppSpecificGroupName)
	{
		if (itemName.indexOf(".") < 0)
			{ logDebug("**WARNING: editAppSpecific requires group name prefix when useAppSpecificGroupName is true") ; return false }
		
		
		itemGroup = itemName.substr(0,itemName.indexOf("."));
		itemName = itemName.substr(itemName.indexOf(".")+1);
	}
   	// change 2/2/2018 - update using: aa.appSpecificInfo.editAppSpecInfoValue(asiField)
	// to avoid issue when updating a blank custom form via script. It was wiping out the field alias 
	// and replacing with the field name
	
	var asiFieldResult = aa.appSpecificInfo.getByList(itemCap, itemName);
	if(asiFieldResult.getSuccess()){
		var asiFieldArray = asiFieldResult.getOutput();
		if(asiFieldArray.length > 0){
			var asiField = asiFieldArray[0];
			var origAsiValue = asiField.getChecklistComment();
			asiField.setChecklistComment(itemValue);

			var updateFieldResult = aa.appSpecificInfo.editAppSpecInfoValue(asiField);
			if(updateFieldResult.getSuccess()){
				logMessage("Successfully updated custom field: " + itemName + " with value: " + itemValue + " : " + itemCap.getCustomID());
				if(arguments.length < 3) //If no capId passed update the ASI Array
				AInfo[itemName] = itemValue; 
			}
			else
			{ logDebug( "WARNING: " + itemName + " was not updated."); }
		}
	}
	else {
		logDebug("ERROR: " + asiFieldResult.getErrorMessage());
	}
} 
