// Begin script to update the Current Count (ASI) with the sum of all Residential Fixture (ASIT) Existing Fixture values
var x = 0;
var vFixture;
var vFixtureCurrentValue;
var vTotalFixtureCount = 0;
var vTotal2ndBathFixtureCount = 0;
var vFixtureStatus;
if (typeof(RESIDENTIALFIXTURES) == "object") {
	for (x in RESIDENTIALFIXTURES) {
		vFixture = RESIDENTIALFIXTURES[x];
		vFixtureCurrentValue = parseFloat(vFixture["Existing Fixture"]);
		vFixtureStatus = vFixture["Status"] + "";
		if (vFixtureCurrentValue != "NaN" && vFixtureStatus == "Active") {
			vTotalFixtureCount += vFixtureCurrentValue;
			logDebug("Value of Fixtures = Active:" + vTotalFixtureCount + "Value of the Current Count:" + vFixtureCurrentValue);
		} 	}
}
if (vTotalFixtureCount != "NaN") {
	editAppSpecific("Current Count", toFixed(vTotalFixtureCount, 2));
}
// End script to update the Current Count (ASI) with the sum of all Residential Fixture (ASIT) Existing Fixture values
