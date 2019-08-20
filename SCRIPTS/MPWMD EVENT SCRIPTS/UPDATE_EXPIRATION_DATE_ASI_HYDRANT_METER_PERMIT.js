// Begin script to update the expiration date for Hydrant Meter Permits 60 days with 2 60 day extentions
if (matches(wfTask,"Permit Issuance", "Inspection") && matches(wfStatus,"Issued", "Issued in Zone")) {
	var vToday;
	var vToday_mm;
	var vToday_dd;
	var vToday_yyyy;
	var vExpDateString;
	var vIssuedDateString;
	
	//get today as a string "MM/DD/YYYY"
	vToday = new Date(wfDateMMDDYYYY);
	vToday_mm = vToday.getMonth() + 1;
	vToday_mm = (vToday_mm < 10) ? '0' + vToday_mm : vToday_mm;
	vToday_dd = vToday.getDate();
	vToday_dd = (vToday_dd < 10) ? '0' + vToday_dd : vToday_dd;
	vToday_yyyy = vToday.getFullYear();
	vExpDateString = vToday_mm + "/" + vToday_dd + "/" + (vToday_yyyy);
	vIssuedDateString = wfDateMMDDYYYY;
	
	//Save to ASI Expiration Date
	if (vExpDateString != null && vExpDateString!= "") {
		editAppSpecific("Expiration Date",dateAdd(vExpDateString, 60));
	}
	if (vIssuedDateString != null && vIssuedDateString!= "") {
		editAppSpecific("Issued Date", vIssuedDateString);
	}
}
if (matches(wfTask,"Close") && matches(wfStatus,"First Extension", "Final Extension")) {
	var vExistingDate = getAppSpecific("Expiration Date");
	editAppSpecific("Expiration Date", dateAdd(vExistingDate, 60));
}
// End script to update the expiration date for hydrant meter
