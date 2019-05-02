// Begin script to assess amendment permit fees
if (wfTask == "Inspections" && wfStatus == "Amendment Required") {
	var vPermitCategory = getAppSpecific("Permit Category");
	if (vPermitCategory == "Residential") {
		updateFee("PM_AMRES", "MP_PERMIT", "FINAL", 1, "N");
	} else if (vPermitCategory == "Non-Residential" || vPermitCategory == "Mixed-Use") {
		updateFee("PM_AMNONRES", "MP_PERMIT", "FINAL", 1, "N");
	}
}
// End script to assess amendment water permit fees
