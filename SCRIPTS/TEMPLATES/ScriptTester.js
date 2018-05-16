var myCapId = "";
var myUserId = "ADMIN";
eventName = "";

/* ASA  */  //var eventName = "ApplicationSubmitAfter";
/* WTUA */  //var eventName = "WorkflowTaskUpdateAfter";  wfTask = "Issuance";	  wfStatus = "Paid";  wfDateMMDDYYYY = "01/27/2015";
/* WTUB */  //var eventName = "WorkflowTaskUpdateBefore";  wfProcess = "PRMT_AMEND"; wfTask = "Wrap Up";	  wfStatus = "Completed";  wfDateMMDDYYYY = "01/27/2015";
/* IRSA */  //var eventName = "InspectionResultSubmitAfter" ; inspResult = "Failed"; inspResultComment = "Comment";  inspType = "Roofing"
/* ISA  */  //var eventName = "InspectionScheduleAfter" ; inspType = "Roofing"
/* PRA  */  //var eventName = "PaymentReceiveAfter";  

var useProductScript = true;  // set to true to use the "productized" master scripts (events->master scripts), false to use scripts from (events->scripts)
var runEvent = true; // set to true to simulate the event and run all std choices/scripts for the record type.  

/* master script code don't touch */ 
aa.env.setValue("EventName",eventName); 
var vEventName = eventName;  
var controlString = eventName;  
var tmpID = aa.cap.getCapID(myCapId).getOutput(); 
if(tmpID != null){
	aa.env.setValue("PermitId1",tmpID.getID1()); 	
	aa.env.setValue("PermitId2",tmpID.getID2()); 	
	aa.env.setValue("PermitId3",tmpID.getID3());
} 
aa.env.setValue("CurrentUserID",myUserId); 
var preExecute = "PreExecuteForAfterEvents";
var documentOnly = false;
var SCRIPT_VERSION = 3.0;
var useSA = false;
var SA = null;var SAScript = null;
var bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_FOR_EMSE"); 
if (bzr.getSuccess() && bzr.getOutput().getAuditStatus() != "I") { 	
	useSA = true; 		
	SA = bzr.getOutput().getDescription();	
	bzr = aa.bizDomain.getBizDomainByValue("MULTI_SERVICE_SETTINGS","SUPER_AGENCY_INCLUDE_SCRIPT"); 	
	if (bzr.getSuccess()) {
		SAScript = bzr.getOutput().getDescription(); 
	}
}
if (SA) {	
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",SA,useProductScript));	
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",SA,useProductScript));	/* force for script test*/ 
	showDebug = true; 
	eval(getScriptText(SAScript,SA,useProductScript));	
}else {	
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useProductScript));	
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useProductScript));	
}	

eval(getScriptText("INCLUDES_CUSTOM",null,true));

if (documentOnly) {	
	doStandardChoiceActions2(controlString,false,0);	
	aa.env.setValue("ScriptReturnCode", "0");	
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");	
	aa.abortScript();	
}
var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX",vEventName);
var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true;  
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice ).getOutput().size() > 0;
if (bzr) {	
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"STD_CHOICE");	
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice ,"SCRIPT");	
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";	
}	

function getScriptText(vScriptName, servProvCode, useProductScripts) {	
	if (!servProvCode)  {
		servProvCode = aa.getServiceProviderCode();	
	}
	vScriptName = vScriptName.toUpperCase();	
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();	
	try {		
		if (useProductScripts) {			
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);		
		}
		else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	}
	catch (err) { 
		return "";	
	}
}

logGlobals(AInfo); 
if (runEvent && typeof(doStandardChoiceActions) == "function" && doStdChoices) 
	try {doStandardChoiceActions(controlString,true,0); } 
catch (err) { logDebug(err.message) } 

if (runEvent && typeof(doScriptActions) == "function" && doScripts) doScriptActions(); 
var z = debug.replace(/<BR>/g,"\r");  
aa.print(z); 



try {



}
catch (err) {
	logDebug("A JavaScript Error occurred: " + err.message);
	}

aa.env.setValue("ScriptReturnCode", "0"); //Anything but 1 or debug won't show 	
aa.env.setValue("ScriptReturnMessage", debug)

//
// Custom functions below this point
//
