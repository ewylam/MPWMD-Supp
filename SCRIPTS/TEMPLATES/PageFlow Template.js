var showMessage = false;						// Set to true to see results in popup window
var showDebug = false;
var useAppSpecificGroupName = false;	
var message = " ";							// Message String
var debug = "";								// Debug String
var br = "<BR>";
var useProductScripts = true;
var cancel = false;


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


eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS",null,true));
eval(getScriptText("INCLUDES_CUSTOM",null,true)); 


var cap = aa.env.getValue("CapModel");
var capId = cap.getCapID();
var capIDString = capId.getCustomID();			
var appTypeResult = cap.getCapType();	
var appTypeString = appTypeResult.toString();
var appTypeArray = appTypeString.split("/");
var AInfo = new Array();						// Create array for tokenized variables
loadAppSpecific4ACA(AInfo); 						// Add AppSpecific Info

parentCapIdString = "" + cap.getParentCapID();
if (parentCapIdString) {
	pca = parentCapIdString .split("-");
	parentCapId = aa.cap.getCapID(pca[0],pca[1],pca[2]).getOutput();
}


try {



}
catch (error)
{
	logDebug(error.message);
	showDebug=true;
	cancel=true;
	showMessage=true;
}
/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

if (debug.indexOf("**ERROR") > 0) {
    aa.env.setValue("ErrorCode", "1");
    aa.env.setValue("ErrorMessage", debug);
}
else {
    if (cancel) {
        aa.env.setValue("ErrorCode", "-2");
        if (showMessage) aa.env.setValue("ErrorMessage", message);
        if (showDebug) aa.env.setValue("ErrorMessage", debug);
    }
    else {
    	aa.env.setValue("ScriptReturnCode", "0");
    	message += "<img src='/citizenaccess/Admin/images/empty.gif' onload=\"$('.ACA_Message_Error').addClass('ACA_Message_Notice').removeClass('ACA_Message_Error');\">";
    	if (showMessage) aa.env.setValue("ErrorMessage", message);

    }
}

/*------------------------------------------------------------------------------------------------------/
| <===========External Functions (used by Action entries)
/------------------------------------------------------------------------------------------------------*/
