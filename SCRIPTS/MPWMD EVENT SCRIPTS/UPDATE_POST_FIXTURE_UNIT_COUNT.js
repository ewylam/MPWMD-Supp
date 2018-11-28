// Begin script to update the Post Fixture County and Post 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
var x = 0;
var vFixture;
var vFixturePostValue;
var vTotalFixtureCount = 0;
var vTotal2ndBathFixtureCount = 0;
var vFixtureStatus;
if (typeof(RESIDENTIALFIXTURES) == "object") {
	for (x in RESIDENTIALFIXTURES) {
		vFixture = RESIDENTIALFIXTURES[x];
		vFixturePostValue = parseFloat(vFixture["Post Fixture"]);
		vFixtureStatus = vFixture["Status"] + "";
		if (vFixturePostValue != "NaN" && vFixtureStatus == "Active") {
			vTotalFixtureCount += vFixturePostValue;
		} else if (vFixturePostValue != "NaN" && vFixtureStatus == "Removed") {
			vTotalFixtureCount += vFixturePostValue; // Value should be negative already
		} else if (vFixturePostValue != "NaN" && vFixtureStatus == "2nd Bath Protocol") {
			vTotal2ndBathFixtureCount += vFixturePostValue;
		}
	}
}
if (vTotalFixtureCount != "NaN") {
	editAppSpecific("Post Fixture Unit Count", toFixed(vTotalFixtureCount, 2));
}
if (vTotal2ndBathFixtureCount != "NaN") {
	editAppSpecific("Post 2nd Bath Fixture", toFixed(vTotal2ndBathFixtureCount, 2));
}
// End script to update the Post Fixture County and Post 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
