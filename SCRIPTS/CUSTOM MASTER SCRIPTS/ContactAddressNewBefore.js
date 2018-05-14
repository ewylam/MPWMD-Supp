/*------------------------------------------------------------------------------------------------------/
| Program : ContactAddressNewBefore.js
| Event   : ContactAddressNewBefore
|
| Usage   : Designed to work with the ContactAddressNewBefore event.
|
| Client  : N/A
| Action# : N/A
|
| Notes   :
|
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
| START Configurable Parameters
|	The following script code will attempt to read the assocaite event and invoker the proper standard choices
|    
/------------------------------------------------------------------------------------------------------*/
var triggerEvent = aa.env.getValue("EventName");
var controlString = null;
var documentOnly = false;						// Document Only -- displays hierarchy of std choice steps


var preExecute = "PreExecuteForAfterEvents";  		//Assume after event unless before decected
var eventType = "After";				//Assume after event
if (triggerEvent != ""){
	controlString = triggerEvent;			// Standard choice for control
	if(triggerEvent.indexOf("Before") > 0){
		preExecute = "PreExecuteForBeforeEvents";
		eventType = "Before";
	}
}

/*------------------------------------------------------------------------------------------------------/
| END User Configurable Parameters
/------------------------------------------------------------------------------------------------------*/
var SCRIPT_VERSION = 9.0;
var useCustomScriptFile = true;  // if true, use Events->Custom Script and Master Scripts, else use Events->Scripts->INCLUDES_*
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

var controlFlagStdChoice = "EMSE_EXECUTE_OPTIONS";
var doStdChoices = true; // compatibility default
var doScripts = false;
var bzr = aa.bizDomain.getBizDomain(controlFlagStdChoice).getOutput().size() > 0;
if (bzr) {
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "STD_CHOICE");
	doStdChoices = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr1 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "SCRIPT");
	doScripts = bvr1.getSuccess() && bvr1.getOutput().getAuditStatus() != "I";
	var bvr3 = aa.bizDomain.getBizDomainByValue(controlFlagStdChoice, "USE_MASTER_INCLUDES");
	if (bvr3.getSuccess()) {if(bvr3.getOutput().getDescription() == "No") useCustomScriptFile = false}; 
}

if (SA) {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", SA,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", SA,useCustomScriptFile));
	eval(getScriptText(SAScript, SA));
} else {
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
}

eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));  
 
 //Add Standard Solution Includes 
 solutionInc = aa.bizDomain.getBizDomain("STANDARD_SOLUTIONS").getOutput().toArray(); 
 for (sol in solutionInc) { 
       if (solutionInc[sol].getAuditStatus() != "I") eval(getScriptText(solutionInc[sol].getBizdomainValue(),null)); 
 }  
 
 //Add Configurable RuleSets 
 configRules = aa.bizDomain.getBizDomain("CONFIGURABLE_RULESETS").getOutput().toArray(); 
 for (rule in configRules) { 
       if (configRules[rule].getAuditStatus() != "I") eval(getScriptText(configRules[rule].getBizdomainValue(),null)); 
 }

if (documentOnly) {
	doStandardChoiceActions(controlString, false, 0);
	aa.env.setValue("ScriptReturnCode", "0");
	aa.env.setValue("ScriptReturnMessage", "Documentation Successful.  No actions executed.");
	aa.abortScript();
}

var prefix = lookup("EMSE_VARIABLE_BRANCH_PREFIX", vEventName);

function getScriptText(vScriptName, servProvCode, useProductScripts) {
	if (!servProvCode)  servProvCode = aa.getServiceProviderCode();
	vScriptName = vScriptName.toUpperCase();
	var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
	try {
		if (useProductScripts) {
			var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
		} else {
			var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
		}
		return emseScript.getScriptText() + "";
	} catch (err) {
		return "";
	}
}

/*------------------------------------------------------------------------------------------------------/
| BEGIN Event Specific Variables
/------------------------------------------------------------------------------------------------------*/
//Log All Environmental Variables as  globals
var params = aa.env.getParamValues();
var keys =  params.keys();
var key = null;
while(keys.hasMoreElements())
{
 key = keys.nextElement();
 eval("var " + key + " = aa.env.getValue(\"" + key + "\");");
 logDebug("Loaded Env Variable: " + key + " = " + aa.env.getValue(key));
}

/*------------------------------------------------------------------------------------------------------/
| END Event Specific Variables
/------------------------------------------------------------------------------------------------------*/

if (preExecute.length) doStandardChoiceActions(preExecute,true,0); 	// run Pre-execution code

logGlobals(AInfo);

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/
//
//  Get the Standard choices entry we'll use for this App type
//  Then, get the action/criteria pairs for this app
//

if (doStdChoices) doStandardChoiceActions(controlString,true,0);


//
//  Next, execute and scripts that are associated to the record type
//

if (doScripts) doScriptActions();


//
//  Do event specific logic
//

cancel = true;
showDebug = true;
showMessage = true;

aa.sendMail("noreply@accela.com", "ewylam@etechconsultingllc.com", "", "ContactAddressNewBefore", "ContactAddressNewBefore");



//
// Check for invoicing of fees
//
if (feeSeqList.length)
	{
	invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
	if (invoiceResult.getSuccess())
		logMessage("Invoicing assessed fee items is successful.");
	else
		logMessage("**ERROR: Invoicing the fee items assessed to app # " + capIDString + " was not successful.  Reason: " +  invoiceResult.getErrorMessage());
	}

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/
if(eventType == "After"){
	if (debug.indexOf("**ERROR") > 0)
		{
		aa.env.setValue("ScriptReturnCode", "1");
		aa.env.setValue("ScriptReturnMessage", debug);
		}
	else
		{
		aa.env.setValue("ScriptReturnCode", "0");
		if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
		if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
		}
}
else{ //Process Before Event with cancel check
	if (debug.indexOf("**ERROR") > 0)
		{
		aa.env.setValue("ScriptReturnCode", "1");
		aa.env.setValue("ScriptReturnMessage", debug);
		}
	else
		{
		if (cancel)
			{
			aa.env.setValue("ScriptReturnCode", "1");
			if (showMessage) aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + message);
			if (showDebug) 	aa.env.setValue("ScriptReturnMessage", "<font color=red><b>Action Cancelled</b></font><br><br>" + debug);
			}
		else
			{
			aa.env.setValue("ScriptReturnCode", "0");
			if (showMessage) aa.env.setValue("ScriptReturnMessage", message);
			if (showDebug) 	aa.env.setValue("ScriptReturnMessage", debug);
			}
		}
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
