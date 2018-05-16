// Begin script to update the parent Base Premise record with info from Water Permit
if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	var vParentCapId = getParent("Demand/Master/Base Premise/NA");
	var vPostFixtureUnitCount;
	if (vParentCapId != null && vParentCapId != "") {
		// Update Current Fixture Unit Count (Base Premise ASI) from Post Fixture Unit Count (Water Permit ASI)
		vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
		editAppSpecific("Current Fixture Unit Count", vPostFixtureUnitCount, vParentCapId);

		// Process Permit Water Allocation ASIT and update Base Premise info
		var x = 0;
		var vAllocation;
		var vAllocationType;
		var vAllocationAmount;
		var vJAEArray = ["Allotment", "Paralta", "Pre-Paralta", "Public"];
		var vEntitlementArray = ["Entitlement"];
		var vCreditArray = ["Credit"];
		var vWaterAllocationAmountJAE = 0;
		var vWaterAllocationAmountEntitlements = 0;
		var vWaterAllocationAmountCredits = 0;
		if (typeof(PERMITWATERALLOCATION) == "object") {
			for (x in PERMITWATERALLOCATION) {
				vAllocation = PERMITWATERALLOCATION[x];
				vAllocationType = vAllocation["Source Type"] = "";
				vAllocationAmount = parseFloat(vAllocation["Amount"]);
				// Update Additional JAE Amount Granted (Base Premise ASI) from Permit Water Allocation (Water Permit ASIT) Allotment, Paralta, Preparalta, Public amounts
				if (exists(vAllocationType, vJAEArray)) {
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
		editAppSpecific("Additional JAE Amount Granted", vWaterAllocationAmountJAE, vParentCapId);
		editAppSpecific("Purchased Water Used", vWaterAllocationAmountEntitlements, vParentCapId);
		editAppSpecific("Credits Used", vWaterAllocationAmountCredits, vParentCapId);

		// Copy Fixture ASIT from Water Permit. Update Existing Count with values from Post Count
		var vFixtureTablName = "RESIDENTIAL FIXTURES";
		var vFixtureASIT;
		var vFixture;
		var vFixtureASIT = loadASITable(vFixtureTablName, capId);
		if (typeof(vFixtureASIT) == "object") {
			x = 0;
			for (x in vFixtureASIT) {
				vFixture = vFixtureASIT[x];
				// Replace Existing Count with Post Count
				vFixture["Existing Count"] = new asiTableValObj("Existing Count", parseFloat(vFixture["Post Count"].fieldValue), "N");
				// Replace Existing Fixture with Post Fixture
				vFixture["Existing Fixture"] = new asiTableValObj("Existing Fixture", parseFloat(vFixture["Post Fixture"].fieldValue), "N");
			}
			// Copy updated fixture table to Base Premise
			removeASITable(vFixtureTablName, vParentCapId);
			addASITable(vFixtureTablName, vFixtureASIT, vParentCapId);
		}

	}
}
// End script to update the parent Base Premise record with info from Water Permit
