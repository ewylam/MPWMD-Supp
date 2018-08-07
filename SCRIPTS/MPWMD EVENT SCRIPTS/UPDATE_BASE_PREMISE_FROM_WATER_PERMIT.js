// Begin script to update the parent Base Premise record with info from Water Permit
if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	var vParentCapId = getParent("Demand/Master/Base Premise/NA");
	var vPostFixtureUnitCount;
	var v2ndBathFixtureCount;
	if (vParentCapId != null && vParentCapId != "") {
		// Update Current Fixture Unit Count (Base Premise ASI) from Post Fixture Unit Count (Water Permit ASI)
		vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
		editAppSpecific("Current Fixture Unit Count", vPostFixtureUnitCount, vParentCapId);

		// Update 2nd Bath (Base Premise ASI) from Post 2nd Bath Fixture (Water Permit ASI)
		v2ndBathFixtureCount = getAppSpecific("Post 2nd Bath Fixture");
		editAppSpecific("2nd Bath", v2ndBathFixtureCount, vParentCapId);		
		
		// Process Permit Water Allocation ASIT and update Base Premise info
		var x = 0;
		var vAllocation;
		var vAllocationType;
		var vAllocationAmount;
		var vJAEArray = ["Allotment", "Paralta", "Pre-Paralta", "Public"];
		var vEntitlementArray = ["Entitlement"];
		var vCreditArray = ["Water Use Credits"];
		var vWaterAllocationAmountJAE = 0;
		var vWaterAllocationAmountEntitlements = 0;
		var vWaterAllocationAmountCredits = 0;
		var vPermitType;
		if (typeof(PERMITWATERALLOCATION) == "object") {
			for (x in PERMITWATERALLOCATION) {
				vAllocation = PERMITWATERALLOCATION[x];
				vAllocationType = vAllocation["Source Type"] + "";
				vAllocationAmount = parseFloat(vAllocation["Amount"]);
				// Update Additional JAE Amount Granted (Base Premise ASI) from Permit Water Allocation (Water Permit ASIT) Allotment, Paralta, Preparalta, Public amounts
				vPermitType = getAppSpecific("Permit Type");
				// Only update JAE Amount Granted only if permit type is NOT 'New Construction'
				if (exists(vAllocationType, vJAEArray) && vPermitType != "New Construction") {
					vWaterAllocationAmountJAE += vAllocationAmount;
				}
				// Update Purchased Water Used (Base Premise ASI) from Permit Water Allocation (Water Permit ASIT) Entitlement amounts
				if (exists(vAllocationType, vEntitlementArray)) {
					vWaterAllocationAmountEntitlements += vAllocationAmount;
				}
				// Update Credits Used (Base Permit ASI) from Permit Water Allocation (Water Permit ASIT) Water Use Credits amounts
				if (exists(vAllocationType, vEntitlementArray)) {
					vWaterAllocationAmountCredits += vAllocationAmount;
				}
			}
		}
		// Only update JAE Amount Granted only if permit type is NOT 'New Construction'
		if (vPermitType != "New Construction") {
			editAppSpecific("Additional JAE Amount Granted", vWaterAllocationAmountJAE, vParentCapId);
		}
		editAppSpecific("Purchased Water Used", vWaterAllocationAmountEntitlements, vParentCapId);
		editAppSpecific("Credits Used", vWaterAllocationAmountCredits, vParentCapId);

		// Copy Fixture ASIT from Water Permit. Update Existing Count with values from Post Count
		var vFixtureTableName = "RESIDENTIAL  FIXTURES";
		var vFixtureASIT;
		var vFixture;
		var vFixtureStatus;
		var vFixtureASIT = loadASITable(vFixtureTableName, capId);
		if (typeof(vFixtureASIT) == "object") {
			x = 0;
			for (x in vFixtureASIT) {
				vFixture = vFixtureASIT[x];
				// Removed any 'Removed' table values
				vFixtureStatus = vFixture["Status"] + "";
				if (vFixtureStatus == "Removed") {
					//Remove ASIT row from table to be copied to Base Premise Records
					vFixtureASIT = vFixtureASIT.splice(x, 1);
					continue;
				}				
				// Replace Existing Count with Post Count
				vFixture["Existing Count"] = new asiTableValObj("Existing Count", vFixture["Post Count"].fieldValue, "N");
				// Replace Existing Fixture with Post Fixture
				vFixture["Existing Fixture"] = new asiTableValObj("Existing Fixture", vFixture["Post Fixture"].fieldValue, "N");
			}
			// Copy updated fixture table to Base Premise
			removeASITable(vFixtureTableName, vParentCapId);
			addASITable(vFixtureTableName, vFixtureASIT, vParentCapId);
		}

		// Update Purchased Water Remaining (Base Premise ASI) with Purchased Water minus Purchased Water Used (Base Premise ASI)
		var vPurchasedWater;
		var vPurchasedWaterUsed;
		var vPurchasedWaterRemaining;
		vPurchasedWater = getAppSpecific("Purchased Water", vParentCapId);
		vPurchasedWaterUsed = getAppSpecific("Purchased Water Used", vParentCapId);
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
		vPurchasedWaterRemaining = vPurchasedWater - vPurchasedWaterUsed;
		if (parseFloat(vPurchasedWaterRemaining) != "NaN") {
			editAppSpecific("Purchased Water Remaining", toFixed(vPurchasedWaterRemaining, 4), vParentCapId);
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
			editAppSpecific("Credits Remaining", toFixed(vCreditsRemaining, 4), vParentCapId);
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
			editAppSpecific("Baseline", vProposedWaterUsage, vParentCapId);	
		}
		
	}
}
// End script to update the parent Base Premise record with info from Water Permit
