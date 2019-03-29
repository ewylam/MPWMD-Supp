//Start Script to add recording fees foe deeds and capacity fee if it exists
if (wfTask == "Review" && wfStatus == "Deed Restriction Required") {
	var feeSched = "MP_RECORDINGFEES";
	var feePeriod = "FINAL";
	var invFee = "Y";
	var capacity = AInfo["Adjusted Water Use Capacity"];

	var x = 0;
	var vFixture;
	var vFormValue;
	var vTotalQty = 0;
	if (typeof(DEEDRESTRICTIONS) == "object") {
		for (x in DEEDRESTRICTIONS) {
			vFixture = DEEDRESTRICTIONS[x];
			vFormValue = vFixture["Form"] + "";
			logDebug("vFormValue:  " + vFormValue);
			if (vFormValue != "2.2.0 Public Access") {
				vTotalQty++;
			}
		}
		if (vTotalQty > 0) {
			updateFee("REC_DEEDPROC", feeSched, feePeriod, vTotalQty, invFee);
		}
	}

	updateFee("REC_DEED REV", feeSched, feePeriod, 1, invFee);
	updateFee("REC_IMAGING", feeSched, feePeriod, 1, invFee);

	if (AInfo["Capacity Status"] == "Calculate Capacity" && AInfo["Adjusted Water Use Capacity"] != null) {
		addFeeWithExtraData("PM_CAPACITY", "MP_PERMIT", feePeriod, 1, invFee, capId, capacity, "", "");
	}
}
//End Script to add fees
