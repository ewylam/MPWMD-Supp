// Begin script to assess amendment permit fees and populate Deed Restriction table
if (wfTask == "Inspection" && wfStatus == "Amendment Required") {
	// Asses fees
	var vPermitCategory = getAppSpecific("Permit Category");
	if (vPermitCategory == "Residential") {
		updateFee("PM_AMRES", "MP_PERMIT", "FINAL", 1, "N");
	} else if (vPermitCategory == "Non-Residential" || vPermitCategory == "Mixed-Use") {
		updateFee("PM_AMNONRES", "MP_PERMIT", "FINAL", 1, "N");
	}
	
	// Add Deed Restriction info
	var asiTable = "DEED RESTRICTIONS";
	var rowFieldArray = [];
	if (!checkTable4Value("DEED RESTRICTIONS", "Form", ["1.1.1 Amend Special Fixtures"])) {
		var fieldRow = aa.util.newHashMap();
		fieldRow.put("Form", "1.1.1 Amend Special Fixtures");
		fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.1.1 Amend Special Fixtures"));
		rowFieldArray.push(fieldRow);
	}

	if (rowFieldArray.length > 0) {
		logDebug("Adding Rows to table " + asiTable);
		addAppSpecificTableInfors(asiTable, capId, rowFieldArray);
	}
}
// End script to assess amendment water permit fees and populate Deed Restriction table
