// Begin script to convert old fixture names to new ones and add the sort order
var x = 0;
var vTableName = "RESIDENTIAL  FIXTURES";
var vFixtureTable = loadASITable(vTableName);
var vFixture;
var vFixtureType;
var vExistingCount;
var vPostCount;
var vExistingCountInt;
var vPostCountInt;
var vSortOrder;
var vSortLookup;
var vNewFixtureType;
var vASITChanges = false;

for (x in vFixtureTable) {
	vFixture = vFixtureTable[x];
	vFixtureType = vFixture["Type of Fixture"];
	vSortOrder = vFixture["Sort"];
	vNewFixtureType = lookup('MPWMD_Fixture_Type_Conversion', vFixtureType.fieldValue);
	if (vNewFixtureType != "" && vNewFixtureType != null) {
		logDebug("Updating " + vFixtureType + " to " + vNewFixtureType + ".");
		vFixtureType.fieldValue = vNewFixtureType + "";
		vASITChanges = true;
	}
	if (vSortOrder == "" || vSortOrder == null) {
		vFixtureType = vFixture["Type of Fixture"];
		vSortLookup = getSDDLSortOrder('MP_Type of Fixture', vFixtureType.fieldValue);
		if (vSortLookup != "" && vSortLookup != null) {
			logDebug("Updating sort order for " + vFixtureType + " to " + vSortLookup + ".");
			vSortOrder.fieldValue = vSortLookup + "";
			vASITChanges = true;
		}
	}
	//Remove "0" decimals
	vExistingCount = vFixture["Existing Count"];
	vPostCount = vFixture["Post Count"];
	vExistingCountInt = parseInt(vExistingCount.fieldValue);
	vPostCountInt = parseInt(vPostCount.fieldValue);
	vExistingCount.fieldValue = vExistingCountInt + "";
	vPostCount.fieldValue = vPostCountInt + "";
	vASITChanges = true;
}
// Save updated ASIT back to the record
if (vASITChanges) {
	removeASITable(vTableName, capId);
	addASITable(vTableName, vFixtureTable, capId);
}
// End script to convert old fixture names to new ones and add the sort order