// Begin script to update the Post Fixture Count, Post 2nd Bath Fixture, and Current Count (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
var x = 0;
var vFixture;
var vFixtureTypeofFixture;
var vFixtureExistingValue;
var vExistingCountValue;
var vFixturePostValue;
var vTotalCurrentCount = 0;
var vTotalFixtureCount = 0;
var vTotal2ndBathFixtureCount = 0;
var vFixtureStatus;
if (typeof(RESIDENTIALFIXTURES) == "object") {
	for (x in RESIDENTIALFIXTURES) {
		vFixture = RESIDENTIALFIXTURES[x];
		vFixtureTypeofFixture = vFixture["Type of Fixture"]
		vFixtureExistingValue = parseFloat(vFixture["Existing Fixture"]);
		vFixturePostValue = parseFloat(vFixture["Post Fixture"]);
		vExistingCountValue = parseFloat(vFixture["Existing Count"]);
		vFUV = parseFloat(vFixture["FUV"]);
		vFixtureStatus = vFixture["Status"] + "";
		// Calculate Current Count
		if (vFixtureExistingValue != "NaN") {
			vTotalCurrentCount += vFixtureExistingValue;
			logDebug("Value of the Current Count:" + vTotalCurrentCount);
		}
		// Calculate Fixture Counts
		if (vFixturePostValue != "NaN" && vFixtureStatus == "Active") {
			vTotalFixtureCount += vFixturePostValue;
			logDebug("Value of Fixtures = Active:" + vTotalFixtureCount + "Value of the Post Count:" + vFixturePostValue);
		} else if (vFixturePostValue != "NaN" && vFixtureStatus == "2nd Bath Protocol") {
			if (vFixtureTypeofFixture == "Washbasin" && (vFixturePostValue - vFixtureExistingValue > 1)) {
				vTotal2ndBathFixtureCount += 2;
			} else {
				vTotal2ndBathFixtureCount += vFUV;
			}
			logDebug("Value of 2ndBath Fixtures = Active:" + vTotal2ndBathFixtureCount +  "Value of the FUV:" + vFUV);
			vAdjustedFixture = vFixturePostValue - vFUV;
			logDebug("Adjusted Valued of Fixtures:" + vAdjustedFixture);
			vTotalFixtureCount +=vAdjustedFixture;
			logDebug("Value of Fixtures = 2ndBath Post:" + vTotalFixtureCount);
		}
	}
}
if (vTotalFixtureCount != "NaN") {
	editAppSpecific("Post Fixture Unit Count", toFixed(vTotalFixtureCount, 2));
}
if (vTotal2ndBathFixtureCount != "NaN") {
	editAppSpecific("Post 2nd Bath Fixture", toFixed(vTotal2ndBathFixtureCount, 2));
}

logDebug("Current Count: " + toFixed(vTotalCurrentCount, 2));

if (vTotalCurrentCount != "NaN") {
	editAppSpecific("Current Fixture Unit Count", toFixed(vTotalCurrentCount, 2));
}
// End script to update the Post Fixture County, Post 2nd Bath Fixture, and Current Count (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
