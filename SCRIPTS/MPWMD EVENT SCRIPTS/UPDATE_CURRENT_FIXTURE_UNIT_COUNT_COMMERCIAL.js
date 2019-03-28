// Begin script to update the Non-Residential Current Fixture Count with the sum of all Commercial (ASIT) Fixture values.
var x = 0;
var vFixture;
var vFixtureValue;
var vTotalFixtureCount = 0;
if (typeof(COMMERCIAL) == "object") {
	for (x in COMMERCIAL) {
		vFixture = COMMERCIAL[x];
		vFixtureValue = parseFloat(vFixture["Water Use Capacity"]);
		if (vFixtureValue != "NaN") {
			vTotalFixtureCount += vFixtureValue;
		}
	}
}
if (vTotalFixtureCount != "NaN") {
	editAppSpecific("Non-Residential AF Total", toFixed(vTotalFixtureCount, 2));
}
// End script to update the Non-Residential Current Fixture Count with the sum of all Commercial (ASIT) Fixture values.
