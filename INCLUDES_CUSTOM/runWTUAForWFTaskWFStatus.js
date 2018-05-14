/*--------------------------------------------------------------------------------------------------------------------/
| Start ETW 06/13/14 Custom functions for runWTUA
/--------------------------------------------------------------------------------------------------------------------*/
function runWTUAForWFTaskWFStatus(vTaskName, vProcessID, vStepNum, vStatus, vCapId) {
	/*---------------------------------------------------------------------------------------------------------/
	| Function Intent:
	|              This function is designed to run the WorkflowTaskUpdateAfter (WTUA) script actions.
	|              for the CapId provided.
	| Call Example:
	|              runWTUAForWFTaskWFStatus('PRMT_TRADE','Application Acceptance','Accepted',capId)
	|
	| 11/13/2013 - Ewylam
	|              Version 1 Created
	|
	| Required parameters in order:
	|              vTaskName = Name of task to run the event for. string
	|			   vProcessID = Workflow process that contains the task. string
	|			   vStepNum = Step number of the task to run the event for. number
	|              vStatus = Status to rqun the event for. string
	|              vCapId = CapId object
	|
	| Optional paramaters:
	|              None
	/----------------------------------------------------------------------------------------------------------*/

	//Set Variables
	//Save the existing system variables so that they can be reset after the function
	var pvScriptName = vScriptName;
	var pvEventName = vEventName;
	var pprefix = ((typeof prefix === 'undefined') ? null : prefix);
	var pcapId = capId;
	var pcap = cap;
	var pcapIDString = capIDString;
	var pappTypeResult = appTypeResult;
	var pappTypeString = appTypeString;
	var pappTypeArray = appTypeArray;
	var pcapName = capName;
	var pcapStatus = capStatus;
	var pfileDateObj = fileDateObj;
	var pfileDate = fileDate;
	var pfileDateYYYYMMDD = fileDateYYYYMMDD;
	var pparcelArea = parcelArea;
	var pestValue = estValue;
	var pbalanceDue = balanceDue;
	var phouseCount = houseCount;
	var pfeesInvoicedTotal = feesInvoicedTotal;
	var pcapDetail = capDetail;
	var pAInfo = AInfo;
	var ppartialCap;
	if (typeof(partialCap) !== "undefined") {
		ppartialCap = partialCap;
	} else {
		ppartialCap = null;
	}
	var pparentCapId;
	if (typeof(parentCapId) !== "undefined") {
		pparentCapId = parentCapId;
	} else {
		pparentCapId = null;
	}
	var pCreatedByACA;
	if (typeof(CreatedByACA) !== "undefined") {
		pCreatedByACA = CreatedByACA;
	} else {
		CreatedByACA = 'N';
	}

	//WTUA Specific variables.
	var pwfTask = ((typeof wfTask === 'undefined') ? null : wfTask);
	var pwfTaskObj = ((typeof wfTaskObj === 'undefined') ? null : wfTaskObj);
	var pwfStatus = ((typeof wfStatus === 'undefined') ? null : wfStatus);
	var pwfDate = ((typeof wfDate === 'undefined') ? null : wfDate);
	var pwfDateMMDDYYYY = ((typeof wfDateMMDDYYYY === 'undefined') ? null : wfDateMMDDYYYY);
	var pwfProcessID = ((typeof wfProcessID === 'undefined') ? null : wfProcessID);
	var pwfStep = ((typeof wfStep === 'undefined') ? null : wfStep);
	var pwfComment = ((typeof wfComment === 'undefined') ? null : wfComment);
	var pwfNote = ((typeof wfNote === 'undefined') ? null : wfNote);
	var pwfDue = ((typeof wfDue === 'undefined') ? null : wfDue);
	var pwfHours = ((typeof wfHours === 'undefined') ? null : wfHours);
	var pwfProcess = ((typeof wfProcess === 'undefined') ? null : wfProcess);
	var pwfObj = ((typeof wfObj === 'undefined') ? null : wfObj);
	var pwfStaffUserID = ((typeof wfStaffUserID === 'undefined') ? null : wfStaffUserID);
	var ptimeAccountingArray = ((typeof timeAccountingArray === 'undefined') ? null : timeAccountingArray);
	var pwfTimeBillable = ((typeof wfTimeBillable === 'undefined') ? null : wfTimeBillable);
	var pwfTimeOT = ((typeof wfTimeOT === 'undefined') ? null : wfTimeOT);
	var ptimeLogModel = ((typeof timeLogModel === 'undefined') ? null : timeLogModel);
	var ptimeLogSeq = ((typeof timeLogSeq === 'undefined') ? null : timeLogSeq);
	var pdateLogged = ((typeof dateLogged === 'undefined') ? null : dateLogged);
	var pstartTime = ((typeof startTime === 'undefined') ? null : startTime);
	var pendTime = ((typeof endTime === 'undefined') ? null : endTime);
	var ptimeElapsedHours = ((typeof timeElapsedHours === 'undefined') ? null : timeElapsedHours);
	var ptimeElapsedMin = ((typeof timeElapsedMin === 'undefined') ? null : timeElapsedMin);

	//Run simulate the WTUA event for the child record
	logDebug("***Begin WTUA Sim");
	
	vScriptName = "function: runWTUAForWFTaskWFStatus";
	vEventName = "WorkflowTaskUpdateAfter";

	prefix = 'WTUA';

	//Clear global variables so that they can be set with the supplied
	capId = null;
	cap = null;
	capIDString = "";
	appTypeResult = null;
	appTypeString = "";
	appTypeArray = new Array();
	capName = null;
	capStatus = null;
	fileDateObj = null;
	fileDate = null;
	fileDateYYYYMMDD = null;
	parcelArea = 0;
	estValue = 0;
	balanceDue = 0;
	houseCount = 0;
	feesInvoicedTotal = 0;
	capDetail = "";
	AInfo = new Array();
	partialCap = false;
	parentCapId = null;
	CreatedByACA = 'N';

	//Clear event specific variables;
	//wfTask = null;
	wfTaskObj = null;
	wfStatus = null;
	wfDate = null;
	wfDateMMDDYYYY = null;
	wfProcessID = null;
	wfStep = null;
	wfComment = null;
	wfNote = null;
	wfDue = null;
	wfHours = null;
	wfProcess = null;
	wfObj = null;
	wfStaffUserID = null;
	timeAccountingArray = null;
	wfTimeBillable = null;
	wfTimeOT = null;
	timeLogModel = null;
	timeLogSeq = null;
	dateLogged = null;
	startTime = null;
	endTime = null;
	timeElapsedHours = null;
	timeElapsedMin = null;

	//Set capId to the vCapId variable provided
	capId = vCapId;
	//Update global variables based on child capId
	if (capId !== null) {
		parentCapId = pcapId;
		servProvCode = capId.getServiceProviderCode();
		capIDString = capId.getCustomID();
		cap = aa.cap.getCap(capId).getOutput();
		appTypeResult = cap.getCapType();
		appTypeString = appTypeResult.toString();
		appTypeArray = appTypeString.split("/");
		if (appTypeArray[0].substr(0, 1) != "_") {
			var currentUserGroupObj = aa.userright.getUserRight(appTypeArray[0], currentUserID).getOutput();
			if (currentUserGroupObj)
				currentUserGroup = currentUserGroupObj.getGroupName();
		}
		capName = cap.getSpecialText();
		capStatus = cap.getCapStatus();
		partialCap = !cap.isCompleteCap();
		fileDateObj = cap.getFileDate();
		fileDate = "" + fileDateObj.getMonth() + "/" + fileDateObj.getDayOfMonth() + "/" + fileDateObj.getYear();
		fileDateYYYYMMDD = dateFormatted(fileDateObj.getMonth(), fileDateObj.getDayOfMonth(), fileDateObj.getYear(), "YYYY-MM-DD");
		var valobj = aa.finance.getContractorSuppliedValuation(capId, null).getOutput();
		if (valobj.length) {
			estValue = valobj[0].getEstimatedValue();
			calcValue = valobj[0].getCalculatedValue();
			feeFactor = valobj[0].getbValuatn().getFeeFactorFlag();
		}

		var capDetailObjResult = aa.cap.getCapDetail(capId);
		if (capDetailObjResult.getSuccess()) {
			capDetail = capDetailObjResult.getOutput();
			houseCount = capDetail.getHouseCount();
			feesInvoicedTotal = capDetail.getTotalFee();
			balanceDue = capDetail.getBalance();
		}
		loadAppSpecific(AInfo);
		loadTaskSpecific(AInfo);
		loadParcelAttributes(AInfo);
		loadASITables();

		CreatedByACA = 'N';

		logDebug("<B>EMSE Script Results for " + capIDString + "</B>");
		logDebug("capId = " + capId.getClass());
		logDebug("cap = " + cap.getClass());
		logDebug("currentUserID = " + currentUserID);
		logDebug("currentUserGroup = " + currentUserGroup);
		logDebug("systemUserObj = " + systemUserObj.getClass());
		logDebug("appTypeString = " + appTypeString);
		logDebug("capName = " + capName);
		logDebug("capStatus = " + capStatus);
		logDebug("fileDate = " + fileDate);
		logDebug("fileDateYYYYMMDD = " + fileDateYYYYMMDD);
		logDebug("sysDate = " + sysDate.getClass());
		logDebug("parcelArea = " + parcelArea);
		logDebug("estValue = " + estValue);
		logDebug("calcValue = " + calcValue);
		logDebug("feeFactor = " + feeFactor);

		logDebug("houseCount = " + houseCount);
		logDebug("feesInvoicedTotal = " + feesInvoicedTotal);
		logDebug("balanceDue = " + balanceDue);
	}

	//set WTUA specific variables
	wfTask = vTaskName; // Workflow Task Triggered event
	wfStatus = vStatus; // Status of workflow that triggered event
	wfDate = sysDate.getYear() + '-' + sysDate.getMonth() + '-' + sysDate.getDayOfMonth(); // date of status of workflow that triggered event
	wfDateMMDDYYYY = wfDate.substr(5, 2) + "/" + wfDate.substr(8, 2) + "/" + wfDate.substr(0, 4); // date of status of workflow that triggered event in format MM/DD/YYYY
	// Go get other task details
	wfObj = aa.workflow.getTasks(capId).getOutput();
	for (i in wfObj) {
		fTask = wfObj[i];
		if (fTask.getTaskDescription() == wfTask && fTask.getProcessID() == vProcessID && fTask.getStepNumber() == vStepNum) {
			wfStep = fTask.getStepNumber();
			wfProcess = fTask.getProcessCode();
			wfProcessID = fTask.getProcessID();
			wfComment = fTask.getDispositionComment();
			wfNote = fTask.getDispositionNote();
			wfDue = fTask.getDueDate();
			wfHours = fTask.getHoursSpent();
			wfTaskObj = fTask
		}
	}
	logDebug("wfTask = " + wfTask);
	logDebug("wfTaskObj = " + wfTaskObj.getClass());
	logDebug("wfStatus = " + wfStatus);
	logDebug("wfDate = " + wfDate);
	logDebug("wfDateMMDDYYYY = " + wfDateMMDDYYYY);
	logDebug("wfStep = " + wfStep);
	logDebug("wfComment = " + wfComment);
	logDebug("wfProcess = " + wfProcess);
	logDebug("wfProcessID = " + wfProcessID);
	logDebug("wfNote = " + wfNote);

	/* Added for version 1.7 */
	wfStaffUserID = aa.env.getValue("StaffUserID");
	timeAccountingArray = new Array()
		if (aa.env.getValue("TimeAccountingArray") != "") {
			timeAccountingArray = aa.env.getValue("TimeAccountingArray");
		}
		wfTimeBillable = aa.env.getValue("Billable");
	wfTimeOT = aa.env.getValue("Overtime");

	logDebug("wfStaffUserID = " + wfStaffUserID);
	logDebug("wfTimeBillable = " + wfTimeBillable);
	logDebug("wfTimeOT = " + wfTimeOT);
	logDebug("wfHours = " + wfHours);

	if (timeAccountingArray != null || timeAccountingArray != '') {
		for (var i = 0; i < timeAccountingArray.length; i++) {
			timeLogModel = timeAccountingArray[i];
			timeLogSeq = timeLogModel.getTimeLogSeq();
			dateLogged = timeLogModel.getDateLogged();
			startTime = timeLogModel.getStartTime();
			endTime = timeLogModel.getEndTime();
			timeElapsedHours = timeLogModel.getTimeElapsed().getHours();
			timeElapsedMin = timeLogModel.getTimeElapsed().getMinutes();

			logDebug("TAtimeLogSeq = " + timeLogSeq);
			logDebug("TAdateLogged = " + dateLogged);
			logDebug("TAstartTime = " + startTime);
			logDebug("TAendTime = " + endTime);
			logDebug("TAtimeElapsedHours = " + timeElapsedHours);
			logDebug("TAtimeElapsedMin = " + timeElapsedMin);
		}
	}
	//

	//Run WTUA scripts for the variables provided
	doScriptActions();

	//Reset global variables to the original records
	vScriptName = pvScriptName;
	vEventName = pvEventName;
	prefix = pprefix;
	capId = pcapId;
	cap = pcap;
	capIDString = pcapIDString;
	appTypeResult = pappTypeResult;
	appTypeString = pappTypeString;
	appTypeArray = pappTypeArray;
	capName = pcapName;
	capStatus = pcapStatus;
	fileDateObj = pfileDateObj;
	fileDate = pfileDate;
	fileDateYYYYMMDD = pfileDateYYYYMMDD;
	parcelArea = pparcelArea;
	estValue = pestValue;
	feesInvoicedTotal = pfeesInvoicedTotal;
	balanceDue = pbalanceDue;
	houseCount = phouseCount;
	feesInvoicedTotal = pfeesInvoicedTotal;
	capDetail = pcapDetail;
	AInfo = pAInfo;
	partialCap = ppartialCap;
	parentCapId = pparentCapId;
	CreatedByACA = pCreatedByACA;

	//Reset WTUA Specific variables.
	wfTask = pwfTask;
	wfTaskObj = pwfTaskObj;
	wfStatus = pwfStatus;
	wfDate = pwfDate;
	wfDateMMDDYYYY = pwfDateMMDDYYYY;
	wfProcessID = pwfProcessID;
	wfStep = pwfStep;
	wfComment = pwfComment;
	wfNote = pwfNote;
	wfDue = pwfDue;
	wfHours = pwfHours;
	wfProcess = pwfProcess;
	wfObj = pwfObj;
	wfStaffUserID = pwfStaffUserID;
	timeAccountingArray = ptimeAccountingArray;
	wfTimeBillable = pwfTimeBillable;
	wfTimeOT = pwfTimeOT;
	timeLogModel = ptimeLogModel;
	timeLogSeq = ptimeLogSeq;
	dateLogged = pdateLogged;
	startTime = pstartTime;
	endTime = pendTime;
	timeElapsedHours = ptimeElapsedHours;
	timeElapsedMin = ptimeElapsedMin;

	logDebug("***End WTUA Sim");

}
/*--------------------------------------------------------------------------------------------------------------------/
| End ETW 06/13/14 Custom functions for runWTUA
/--------------------------------------------------------------------------------------------------------------------*/
