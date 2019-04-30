// Begin script to update the parent Base Premise record with info from Water Use Credit
if (wfTask == "Permit Issuance" && matches(wfStatus,"Issued","Issued in Zone")) {
	var vParentCapId = getParent("Demand/Master/Base Premise/NA");
	var vPostFixtureUnitCount;
	if (vParentCapId != null && vParentCapId != "") {
		// Update Current Fixture Unit Count (Base Premise ASI) from Post Fixture Unit Count (Water Permit ASI)
		vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
		editAppSpecific("Current Fixture Unit Count", vPostFixtureUnitCount, vParentCapId);

		// Copy Fixture ASIT from Water Permit. Update Existing Count with values from Post Count
		var vFixtureTableName = "RESIDENTIAL  FIXTURES";
		var vFixtureASIT;
		var vFixture;
		var vFixtureASIT = loadASITable(vFixtureTableName, capId);
		if (typeof(vFixtureASIT) == "object") {
			x = 0;
			for (x in vFixtureASIT) {
				vFixture = vFixtureASIT[x];
				// Replace Existing Count with Post Count
				vFixture["Existing Count"] = new asiTableValObj("Existing Count", vFixture["Post Count"].fieldValue, "N");
				// Replace Existing Fixture with Post Fixture
				vFixture["Existing Fixture"] = new asiTableValObj("Existing Fixture", vFixture["Post Fixture"].fieldValue, "N");
			}
			// Copy updated fixture table to Base Premise
			removeASITable(vFixtureTableName, vParentCapId);
			addASITable(vFixtureTableName, vFixtureASIT, vParentCapId);
		}

		// Update Credits Received (Base Premise ASI) with current value plus Credit Amount Granted (Water Use Permit ASI)
		var vCreditAmountGranted;
		var vCreditsRecieved;
		var vNewCreditsRecieved;
		vCreditAmountGranted = getAppSpecific("Credit Amount Granted");
		if (vCreditAmountGranted != null && vCreditAmountGranted != "") {
			vCreditAmountGranted = parseFloat(vCreditAmountGranted);
		} else {
			vCreditAmountGranted = 0;
		}
		vCreditsRecieved = getAppSpecific("Credits Received", vParentCapId);
		if (vCreditsRecieved != null && vCreditsRecieved != "") {
			vCreditsRecieved = parseFloat(vCreditsRecieved);
		} else {
			vCreditsRecieved = 0;
		}		
		vNewCreditsRecieved = vCreditsRecieved + vCreditAmountGranted;
		if (parseFloat(vNewCreditsRecieved) != "NaN") {
			editAppSpecific("Credits Received", toFixed(vNewCreditsRecieved,3), vParentCapId);
		}
		
		// Update Credits Remaining (Base Premise ASI) with Credits Received minus Credits Used (Base Premise ASI)
		var vCreditsRecieved;
		var vCreditsUsed;
		var vCreditsRemaining;
		vCreditsRecieved = getAppSpecific("Credits Received", vParentCapId);
		vCreditsUsed = getAppSpecific("Credits Used", vParentCapId);
		if (vCreditsRecieved != null && vCreditsRecieved != "") {
			vCreditsRecieved = parseFloat(vCreditsRecieved);
		} else {
			vCreditsRecieved = 0;
		}
		if (vCreditsUsed != null && vCreditsUsed != "") {
			vCreditsUsed = parseFloat(vCreditsUsed);
		} else {
			vCreditsUsed = 0;
		}
		vCreditsRemaining = vCreditsRecieved - vCreditsUsed;
		if (parseFloat(vCreditsRemaining) != "NaN") {
			editAppSpecific("Credits Remaining", toFixed(vCreditsRemaining, 3), vParentCapId);
		}			
	}
}
// End script to update the parent Base Premise record with info from Water Use Credit
