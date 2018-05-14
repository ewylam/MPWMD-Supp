/*---------------- Expression fields for ASI ---------------------------------------------------------------/
| Include the expression object for the ASI fields you want to update here
| Not sure why these are needed but they will not update if not included here
| Even when commented out they are still read by the expression engine
|
| expression.getValue("ASIT::PERMIT INFORMATION::State Registered");
| expression.getValue("ASIT::PERMIT INFORMATION::Vehicle License #");
| expression.getValue("ASIT::PERMIT INFORMATION::Verification Status");
| expression.getValue("ASIT::PERMIT INFORMATION::Verification Status Date");
|
/----------------------------------------------------------------------------------------------------------*/

/*---------------- ASIT specific form variable name needed ------------------------------------------------*/
var vThisForm=expression.getValue("ASIT::PERMIT INFORMATION::FORM");

/*---------------- Required variables for using included functions and scripts ----------------------------*/
var aa = expression.getScriptRoot();
var useCustomScriptFile = true;
var servProvCode=expression.getValue("$$servProvCode$$").value;
var totalRowCount = expression.getTotalRowCount();
var startTime = new Date();
var SCRIPT_VERSION = 3.0;

var capId1=expression.getValue("$$capID1$$");
var capId2=expression.getValue("$$capID2$$");
var capId3=expression.getValue("$$capID3$$");
var capIdString = capId1.value + "-" + capId2.value + "-" + capId3.value;

var parentCapId1=expression.getValue("$$parentCapID1$$");
var parentCapId2=expression.getValue("$$parentCapID2$$");
var parentCapId3=expression.getValue("$$parentCapID3$$");
var parentCapIdString = parentCapId1.value + "-" + parentCapId2.value + "-" + parentCapId3.value;

var userId=expression.getValue("$$userID$$");


/*------------------ Set enviornmental variables ------------------------------------------------------*/
aa.env.setValue("CapId", capIdString);
aa.env.setValue("ParentCapID", parentCapIdString);
aa.env.setValue("CurrentUserID", userId.value);
aa.env.setValue("ScriptCode", "Expression Script");
aa.env.setValue("EventName", "Expression Event");

eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,useCustomScriptFile));
eval(getScriptText("INCLUDES_ACCELA_GLOBALS",null,useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM",null,useCustomScriptFile));

/*------------------------------------- Custom Script Here --------------------------------------------*/

include("SDOT_SCRIPT_99");
showDebug = false;
showMessage = false;

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
		vThisForm.message = debug;
		expression.setReturn(vThisForm);		
}
else {
	if (showMessage) {
		vThisForm.message = message;
		expression.setReturn(vThisForm);
	}
	if (showDebug) {
		vThisForm.message = debug;
		expression.setReturn(vThisForm);
	}
}

/*---------------- Functions below this point ------------- */
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