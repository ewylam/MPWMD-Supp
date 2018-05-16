// Begin script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
var x = 0;
var vFixture;
var vFixturePostValue;
var vTotalFixtureCount = 0;
if (typeof(RESIDENTIALFIXTURES) == "object") {
	for (x in RESIDENTIALFIXTURES) {
		vFixture = RESIDENTIALFIXTURES[x];
		vFixturePostValue = parseFloat(vFixture["Post Fixture"]);
		vTotalFixtureCount += vFixturePostValue;
	}
}
editAppSpecific("Post Fixture Unit Count", vTotalFixtureCount);
// Begin script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.