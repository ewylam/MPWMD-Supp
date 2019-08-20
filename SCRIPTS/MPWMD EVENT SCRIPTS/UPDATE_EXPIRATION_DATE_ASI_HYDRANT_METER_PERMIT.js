// Begin script to update the expiration date
if (matches(wfTask,"Permit Issuance","Close") && matches(wfStatus,"Permit Issued", "Issued in Zone","First Extension","Final Extension")) {
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
	vExpDateString = vToday_mm + "/" + vToday_dd + "/" + (vToday_yyyy + 1);
	vIssuedDateString = wfDateMMDDYYYY;
	
	//Save to ASI Expiration Date
	if (vExpDateString != null && vExpDateString!= "") {
		editAppSpecific("Expiration Date", vExpDateString);
	}
	if (vIssuedDateString != null && vIssuedDateString!= "") {
		editAppSpecific("Issued Date", vIssuedDateString);
	}
}
// End script to update the expiration date

