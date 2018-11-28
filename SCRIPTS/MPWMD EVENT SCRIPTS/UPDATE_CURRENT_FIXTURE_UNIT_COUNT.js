// Begin script to update the Current Fixture County and Current 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Fixture values.
var x = 0;
var vFixture;
var vFixtureValue;
var vTotalFixtureCount = 0;
var vTotal2ndBathFixtureCount = 0;
var vFixtureStatus;
if (typeof(RESIDENTIALFIXTURES) == "object") {
	for (x in RESIDENTIALFIXTURES) {
		vFixture = RESIDENTIALFIXTURES[x];
		vFixtureValue = parseFloat(vFixture["Existing Fixture"]);
		vFixtureStatus = vFixture["Status"] + "";
		if (vFixtureValue != "NaN" && vFixtureStatus == "Active") {
			vTotalFixtureCount += vFixtureValue;
		} else if (vFixtureValue != "NaN" && vFixtureStatus == "Removed") {
			vTotalFixtureCount += vFixtureValue; // Value should be negative already
		} else if (vFixtureValue != "NaN" && vFixtureStatus == "2nd Bath Protocol") {
			vTotal2ndBathFixtureCount += vFixtureValue;
		}
	}
}
if (vTotalFixtureCount != "NaN") {
	editAppSpecific("Current Fixture Unit Count", toFixed(vTotalFixtureCount, 2));
}
if (vTotal2ndBathFixtureCount != "NaN") {
	editAppSpecific("2nd Bath Fixture Unit Count", toFixed(vTotal2ndBathFixtureCount, 2));
}
// End script to update the Current Fixture County and Current 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Fixture values.
