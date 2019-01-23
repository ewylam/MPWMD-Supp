// Begin script to update the expiration date ASI
if (matches(wfTask, "Permit Issuance", "Close") && matches(wfStatus, "Issued", "First Extension", "Final Extension")) {
	var vExistingDate = getAppSpecific("Expiration Date");
	editAppSpecific("Expiration Date", dateAdd(vExistingDate, 60));
}
// End scrip to update the expiration date ASI
