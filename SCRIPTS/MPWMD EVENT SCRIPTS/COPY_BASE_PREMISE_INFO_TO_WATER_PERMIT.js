// Begin script that copies data from Base Premise record to Water Use Permit record.
var parentCapId = getParent();
if (parentCapId != null && parentCapId != false) {
	//Copy Parcels from license to renewal
	copyParcels(parentCapId, capId);

	//Copy addresses from license to renewal
	copyAddress(parentCapId, capId);

	//copy ASI Info from license to renewal
	copyASIInfo(parentCapId, capId);

	//Copy ASIT from license to renewal
	copyASITables(parentCapId, capId);

	//Copy Contacts from license to renewal
	copyContacts3_0(parentCapId, capId);

	//Copy Work Description from license to renewal
	aa.cap.copyCapWorkDesInfo(parentCapId, capId);

	//Copy application name from license to renewal
	editAppName(getAppName(parentCapId), capId);

	// Update Post Count values with Existing Count
	var vFixtureTableName = "RESIDENTIAL  FIXTURES";
	var vFixtureASIT;
	var vFixture;
	var vFixtureASIT = loadASITable(vFixtureTableName, capId);
	var x;
	if (typeof(vFixtureASIT) == "object") {
		x = 0;
		for (x in vFixtureASIT) {
			vFixture = vFixtureASIT[x];
			// Replace Post Count with Existing Count
			vFixture["Post Count"] = new asiTableValObj("Post Count", vFixture["Existing Count"].fieldValue, "N");
			// Replace Post Fixture with Existing Fixture
			vFixture["Post Fixture"] = new asiTableValObj("Post Fixture", vFixture["Existing Fixture"].fieldValue, "N");
		}
		// Copy updated fixture table to Base Premise
		removeASITable(vFixtureTableName, capId);
		addASITable(vFixtureTableName, vFixtureASIT, capId);
	}
}
// End script that copies data from Base Premise record to Water Use Permit record.
