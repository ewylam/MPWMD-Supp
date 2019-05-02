// Begin script to update the parent Base Premise record with info from Water Permit
if ((wfTask == "Permit Issuance" && matches(wfStatus, "Issued", "Issued in Zone")) || (wfTask == "Inspection" && wfStatus == "Push to Base Premise")) {
	// Begin script to update the parent Base Premise record with info from Water Permit
	var vParentCapId = getParent("Demand/Master/Base Premise/NA");
	if (vParentCapId == 'undefined' || vParentCapId == null || vParentCapId == "" || vParentCapId == false) {
		vParentCapId = createParent("Demand", "Master", "Base Premise", "NA", getAppName());
	}
	var vPostFixtureUnitCount;
	var v2ndBathFixtureCount;
	var vUseJurisdiction = getAppSpecific("Use Jurisdiction");
	var vUseWUC = getAppSpecific("Water Use Credits");
	var vUseEntitlement = getAppSpecific("Use Entitlement");
	var vUseWDS = getAppSpecific("Use WDS");
	var vJurisdictionAmount;
	var vParalta = getAppSpecific("Paralta");
	var vPreParalta = getAppSpecific("Pre-Paralta");
	var vPublic = getAppSpecific("Public");
	var vOther = getAppSpecific("Other");
	var vWUC = getAppSpecific("Water Use Credit Using");
	var vEntitlement = getAppSpecific("Entitlements");
	var vWDS = getAppSpecific("WDS");

	// Process Permit Water Allocation and update Base Premise info
	if (vParentCapId != null && vParentCapId != "") {
		// Update Current Fixture Unit Count (Base Premise ASI) from Post Fixture Unit Count (Water Permit ASI)
		vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
		if (vPostFixtureUnitCount != null && vPostFixtureUnitCount != "") {
			editAppSpecific("Current Fixture Unit Count", vPostFixtureUnitCount, vParentCapId);
		}

		// Update 2nd Bath (Base Premise ASI) from Post 2nd Bath Fixture (Water Permit ASI)
		v2ndBathFixtureCount = getAppSpecific("Post 2nd Bath Fixture");
		if (v2ndBathFixtureCount != null && v2ndBathFixtureCount != "") {
			editAppSpecific("2nd Bath Fixture Unit Count", v2ndBathFixtureCount, vParentCapId);
		}
		//if (vPermitType != "New Construction") {
		//editAppSpecific("Additional JAE Amount Granted", vWaterAllocationAmountJAE, vParentCapId);
		if (vUseWUC == "CHECKED") {
			editAppSpecific("Credits Used", vWUC, vParentCapId);
		}
		if (vUseEntitlement == "CHECKED") {
			editAppSpecific("Purchased Water Used", vEntitlement, vParentCapId);
		}
		if (vUseWDS == "CHECKED") {
			editAppSpecific("WDS Used", vWDS, vParentCapId);
		}
		if (vUseJurisdiction == "CHECKED") {
			if (vParalta != null && vParalta != "") {
				vParalta = parseFloat(vParalta);
			} else {
				vParalta = 0;
			}
			if (vPreParalta != null && vPreParalta != "") {
				vPreParalta = parseFloat(vPreParalta);
			} else {
				vPreParalta = 0;
			}
			if (vPublic != null && vPublic != "") {
				vPublic = parseFloat(vPublic);
			} else {
				vPublic = 0;
			}
			if (vOther != null && vOther != "") {
				vOther = parseFloat(vOther);
			} else {
				vOther = 0;
			}
			vJurisdictionAmount = vParalta + vPreParalta + vPublic + vOther;
			logDebug("Paralta =" + vParalta + " Pre-Paralta + " + vPreParalta + "  Jurisdiciton amount = " + vJurisdictionAmount);
			//+ vPreParalta.value + vPublic.value + vOther.value;
			editAppSpecific("Water Authorized by Jurisdiction", vJurisdictionAmount, vParentCapId);
		}

		// Copy Fixture ASIT from Water Permit. Update Existing Count with values from Post Count
		var vFixtureTableName = "RESIDENTIAL  FIXTURES";
		var vFixtureASIT;
		var vFixture;
		var vFixtureStatus;
		var vFixtureASIT = loadASITable(vFixtureTableName, capId);
		var vUpdatedFixtureASIT = [];
		if (typeof(vFixtureASIT) == "object") {
			x = 0;
			// Removed any 'Removed' table values
			for (x in vFixtureASIT) {
				vFixture = vFixtureASIT[x];
				vFixtureStatus = vFixture["Status"].fieldValue + "";
				if (vFixtureStatus != "Removed") {
					//Remove ASIT row from table to be copied to Base Premise Records
					vUpdatedFixtureASIT.push(vFixture);
				}
			}
			x = 0;
			for (x in vUpdatedFixtureASIT) {
				vFixture = vUpdatedFixtureASIT[x];
				// Replace Existing Count with Post Count
				vFixture["Existing Count"] = new asiTableValObj("Existing Count", vFixture["Post Count"].fieldValue, "N");
				// Replace Existing Fixture with Post Fixture
				vFixture["Existing Fixture"] = new asiTableValObj("Existing Fixture", vFixture["Post Fixture"].fieldValue, "N");
			}
			// Copy updated fixture table to Base Premise
			removeASITable(vFixtureTableName, vParentCapId);
			addASITable(vFixtureTableName, vUpdatedFixtureASIT, vParentCapId);
		}

		// Update Purchased Water Remaining (Base Premise ASI) with Purchased Water minus Purchased Water Used (Base Premise ASI)
		var vPurchasedWater;
		var vPurchasedWaterRemaining;
		vPurchasedWater = getAppSpecific("Purchased Water", vParentCapId);
		vPurchasedWaterUsed = getAppSpecific("Purchased Water Used", vParentCapId);
		if (vEntitlement != null && vEntitlement != "") {
			vEntitlement = parseFloat(vEntitlement);
		} else {
			vEntitlement = 0;
		}
		if (vPurchasedWater != null && vPurchasedWater != "") {
			vPurchasedWater = parseFloat(vPurchasedWater);
		} else {
			vPurchasedWater = 0;
		}
		if (vPurchasedWaterUsed != null && vPurchasedWaterUsed != "") {
			vPurchasedWaterUsed = parseFloat(vPurchasedWaterUsed);
		} else {
			vPurchasedWaterUsed = 0;
		}
		vPurchasedWaterRemaining = vPurchasedWater - (vPurchasedWaterUsed + vEntitlement);
		if (parseFloat(vPurchasedWaterRemaining) != "NaN") {
			editAppSpecific("Purchased Water Remaining", toFixed(vPurchasedWaterRemaining, 3), vParentCapId);
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

		// Copy Proposed (ASI)
		var vProposed = getAppSpecific("Proposed");
		editAppSpecific("Total Square Footage", vProposed, vParentCapId);

		// Check Permit Type and update Year Built, Baseline
		vPermitType = getAppSpecific("Permit Type");
		var vProposedWaterUsage = getAppSpecific("Proposed Water Usage");
		var vYear = new Date();
		if (vPermitType == "New Construction") {
			editAppSpecific("Year Built", vYear.getFullYear(), vParentCapId);
			if (vProposedWaterUsage != null && vProposedWaterUsage != "") {
				editAppSpecific("Baseline", vProposedWaterUsage, vParentCapId);
			}
		}

		// Copy Use, Jurisdiction, Legal Description
		var vUse;
		var vJurisdiction;
		var vLegalDescrition;
		vUse = getAppSpecific("Use");
		if (vUse != null && vUse != "") {
			editAppSpecific("Use", vUse, vParentCapId);
		}
		vJurisdiction = getAppSpecific("Jurisdiction");
		if (vJurisdiction != null && vJurisdiction != "") {
			editAppSpecific("Jurisdiction", vJurisdiction, vParentCapId);
		}
		vLegalDescription = getAppSpecific("Legal Description");
		if (vLegalDescription != null && vLegalDescription != "") {
			editAppSpecific("Legal Description", vLegalDescription, vParentCapId);
		}
	}
	// End script to update the parent Base Premise record with info from Water Permit
}
// End script to update the parent Base Premise record with info from Water Permit
