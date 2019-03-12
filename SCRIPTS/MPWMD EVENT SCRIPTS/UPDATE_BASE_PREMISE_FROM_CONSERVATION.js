// Begin script to update the parent Base Premise record with info from Conservation
if (wfTask == "Conservation" && wfStatus == "Push to Base Premise") {
	var vParentCapId = getParent("Demand/Master/Base Premise/NA");
	if (vParentCapId == 'undefined' || vParentCapId == null || vParentCapId == "" || vParentCapId == false) {
		vParentCapId = createParent("Demand","Master","Base Premise","NA",getAppName());
	}

	// Process Permit Water Allocation and update Base Premise info
	if (vParentCapId != null && vParentCapId != "") {
		// Copy Fixture ASIT from Conservation. Update Existing Count with values from Post Count
		var vFixtureTableName = "RESIDENTIAL  FIXTURES";
		var vFixtureASIT;
		var vFixture;
		var vFixtureStatus;
		var vFixtureASIT = loadASITable(vFixtureTableName, capId);
		var vUpdatedFixtureASIT = [];
		var vCurrentFixtureUnitCount = 0;
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
				// Sum Current Fixture Unit Counts
				vCurrentFixtureUnitCount += vFixture["Post Fixture"];
				// Replace Existing Count with Post Count
				vFixture["Existing Count"] = new asiTableValObj("Existing Count", vFixture["Post Count"].fieldValue, "N");
				// Replace Existing Fixture with Post Fixture
				vFixture["Existing Fixture"] = new asiTableValObj("Existing Fixture", vFixture["Post Fixture"].fieldValue, "N");
			}
			// Copy updated fixture table to Base Premise
			removeASITable(vFixtureTableName, vParentCapId);
			addASITable(vFixtureTableName, vUpdatedFixtureASIT, vParentCapId);
			
			// Update Current Fixture Unit Count
			editAppSpecific("Current Fixture Unit Count", vCurrentFixtureUnitCount, vParentCapId);
		}
		
		//copy ASI Info from license to renewal
		copyASIInfo(capId, vParentCapId);
	}
}
// End script to update the parent Base Premise record with info from Conservation
