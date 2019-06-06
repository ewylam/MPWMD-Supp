// Begin script to assess water permit fees
var vPermitCategory = getAppSpecific("Permit Category");
var vPermitType = getAppSpecific("Permit Type");
var vAmendment = getAppSpecific("Amendment");
logDebug("Amendment :" + vAmendment);
if (vPermitType != "Landscape" && vAmendment != "Yes") {
	if (vPermitCategory == "Residential") {
		updateFee("PM_APPRES", "MP_PERMIT", "FINAL", 1, "Y");
	} else if (vPermitCategory == "Non-Residential" || vPermitCategory == "Mixed-Use") {
		updateFee("PM_APPNONRES", "MP_PERMIT", "FINAL", 1, "Y");
	}
} else if (vPermitType == "Landscape") {
	updateFee("PM_LANDS_REV","MP_PERMIT","FINAL", 1, "Y");
}
if(vAmendment == "Yes" && vPermitType != "Landscape"){
	if (vPermitCategory == "Residential") {
		updateFee("PM_AMRES", "MP_PERMIT", "FINAL", 1, "N");
	} else if (vPermitCategory == "Non-Residential" || vPermitCategory == "Mixed-Use") {
		updateFee("PM_AMNONRES", "MP_PERMIT", "FINAL", 1, "N");
	}
}
// End script to assess water permit fees
