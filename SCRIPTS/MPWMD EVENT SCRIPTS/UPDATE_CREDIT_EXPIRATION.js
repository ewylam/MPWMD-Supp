// Begin script to update the Credit Expiration (Water Use Credit ASI)
if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	var vToday;
	var vToday_mm;
	var vToday_dd;
	var vToday_yyyy;
	var vExpirationDate;
		//get today as a string "MM/DD/YYYY"
		vToday = new Date();
		vToday_mm = vToday.getMonth() + 1;
		vToday_mm = (vToday_mm < 10) ? '0' + vToday_mm : vToday_mm;
		vToday_dd = vToday.getDate();
		vToday_dd = (vToday_dd < 10) ? '0' + vToday_dd : vToday_dd;
		vToday_yyyy = vToday.getFullYear();
		vExpirationDate = vToday_mm + "/" + vToday_dd + "/" + (vToday_yyyy + 5);
		editAppSpecific("Credit Expiration", vExpirationDate);
}
// End script to update the Credit Expiration (Water Use Credit ASI)