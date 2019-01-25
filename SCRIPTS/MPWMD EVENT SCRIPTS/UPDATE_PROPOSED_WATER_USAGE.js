// Begin script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count and Post 2nd Bath Fixture (ASI) minus Current Fixture Unit Count (ASI)
var vPostFixtureUnitCount;
var v2ndBathFixtureCount;
var vCurrentFixtureUnitCount;
var vProposedWaterUsage;
var vCurrentPermitOnsiteCredit;
vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
v2ndBathFixtureCount = getAppSpecific("Post 2nd Bath Fixture");
vCurrentFixtureUnitCount = getAppSpecific("Current Fixture Unit Count");
if (vPostFixtureUnitCount != null && vPostFixtureUnitCount != "") {
	vPostFixtureUnitCount = parseFloat(vPostFixtureUnitCount);
} else {
	vPostFixtureUnitCount = 0;
}
if (v2ndBathFixtureCount != null && v2ndBathFixtureCount != "") {
	vPostFixtureUnitCount += parseFloat(v2ndBathFixtureCount);
}
if (vCurrentFixtureUnitCount != null && vCurrentFixtureUnitCount != "") {
	vCurrentFixtureUnitCount = parseFloat(vCurrentFixtureUnitCount);
} else {
	vCurrentFixtureUnitCount = 0;
}
vProposedWaterUsage = (vPostFixtureUnitCount - vCurrentFixtureUnitCount) * .01; // Convert to AF
if (parseFloat(vProposedWaterUsage) != "NaN") {
	editAppSpecific("Proposed Water Usage", toFixed(vProposedWaterUsage, 4));
}
//if less water demand (Proposed water usage <0)put the absolute value of the proposed water usage into the Current Permit Onsite Credit
if (parseFloat(vProposedWaterUsage) < 0) {
vCurrentPermitOnsiteCredit = Math.abs(toFixed(vCurrentPermitOnsiteCredit, 4));
                editAppSpecific("Current Permit Onsite Credit", toFixed(vCurrentPermitOnsiteCredit, 4));
}
// End script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count and Post 2nd Bath Fixture (ASI) minus Current Fixture Unit Count (ASI)
