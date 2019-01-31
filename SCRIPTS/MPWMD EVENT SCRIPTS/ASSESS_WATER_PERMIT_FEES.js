// Begin script to assess water permit fees
var vPermitCategory = getAppSpecific("Permit Category");
if (vPermitCategory == "Residential") {
	updateFee("PM_APPRES","MP_PERMIT","Final", 1, "Y");
}
else if (vPermitCategory == "Non-Residential" || vPermitCategory == "Mixed=Use") {
	updateFee("PM_APPNONRES","MP_PERMIT","Final", 1, "Y");
}
// End script to assess water permit fees
