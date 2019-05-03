// Begin script to update the Post Non-Residential with the sum of all Commercial (ASIT) Post Capacity values.
var x = 0;
var vFixture;
var vFixtureValue;
var vTotalFixtureCount = 0;
if (typeof(COMMERCIAL) == "object") {
	for (x in COMMERCIAL) {
		vFixture = COMMERCIAL[x];
		vFixtureValue = parseFloat(vFixture["Post Capacity"]);
		if (vFixtureValue != "NaN") {
			vTotalFixtureCount += vFixtureValue;
		}
	}
}
if (vTotalFixtureCount != "NaN") {
	editAppSpecific("Post Non-Residential", toFixed(vTotalFixtureCount, 3));
}
// End script to update the Post Non-Residential with the sum of all Commercial (ASIT) Post Capacity values.
