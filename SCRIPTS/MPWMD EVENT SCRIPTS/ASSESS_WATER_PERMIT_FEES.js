// Begin script to assess water permit fees
var vPermitCategory = getAppSpecific("Permit Category");
var vPermitType = getAppSpecific("Permit Type");
if (vPermitType != "Landscape") {
	if (vPermitCategory == "Residential") {
		updateFee("PM_APPRES", "MP_PERMIT", "FINAL", 1, "Y");
	} else if (vPermitCategory == "Non-Residential" || vPermitCategory == "Mixed-Use") {
		updateFee("PM_APPNONRES", "MP_PERMIT", "FINAL", 1, "Y");
	}
} else if (vPermitType == "Landscape") {
	updateFee("PM_LANDS_REV","MP_PERMIT","FINAL", 1, "Y");
}
// End script to assess water permit fees
