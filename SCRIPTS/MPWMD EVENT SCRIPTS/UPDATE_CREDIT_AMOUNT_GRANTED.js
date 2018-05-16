// Begin script to update the Credit Amount Granted (ASI) with the result of the Post Fixture Unit Count (ASI) minus Current Fixture Unit Count (ASI)
var vPostFixtureUnitCount;
var vCurrentFixtureUnitCount;
var vProposedWaterUsage;
vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
vCurrentFixtureUnitCount = getAppSpecific("Current Fixture Unit Count");
if (vPostFixtureUnitCount != null && vPostFixtureUnitCount != "") {
	vPostFixtureUnitCount = parseFloat(vPostFixtureUnitCount);
} else {
	vPostFixtureUnitCount = 0;
}
if (vCurrentFixtureUnitCount != null && vCurrentFixtureUnitCount != "") {
	vCurrentFixtureUnitCount = parseFloat(vCurrentFixtureUnitCount);
} else {
	vCurrentFixtureUnitCount = 0;
}
vProposedWaterUsage = (vPostFixtureUnitCount - vCurrentFixtureUnitCount) * .01; // Convert to AF
if (parseFloat(vProposedWaterUsage) != "NaN") {
	editAppSpecific("Credit Amount Granted", vProposedWaterUsage);
}
// End script to update the Credit Amount Granted (ASI) with the result of the Post Fixture Unit Count (ASI) minus Current Fixture Unit Count (ASI)
