// Begin script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count and Post 2nd Bath Fixture (ASI) minus Current Fixture Unit Count (ASI);
var vPostFixtureUnitCount;
var vCurrentFixtureUnitCount;
var vPostNonResidential;
var vNonResidentialAFTotal;
var vCreditAmountGranted;
var vPostResult;
var vPreResult;

vNonResidentialAFTotal = getAppSpecific("Non-Residential AF Total");
if (vNonResidentialAFTotal != null && vNonResidentialAFTotal != "") {
	vNonResidentialAFTotal = parseFloat(vNonResidentialAFTotal);
} else {
	vNonResidentialAFTotal = 0;
}

vCurrentFixtureUnitCount = getAppSpecific("Current Fixture Unit Count");
if (vCurrentFixtureUnitCount != null && vCurrentFixtureUnitCount != "") {
	vCurrentFixtureUnitCount = parseFloat(vCurrentFixtureUnitCount) * .01;
} else {
	vCurrentFixtureUnitCount = 0;
}

logDebug("vNonResidentialAFTotal: " + vNonResidentialAFTotal);
logDebug("vCurrentFixtureUnitCount: " + vCurrentFixtureUnitCount);
logDebug("vPreResult: " + (vNonResidentialAFTotal + vCurrentFixtureUnitCount));

vPreResult = vNonResidentialAFTotal + vCurrentFixtureUnitCount;

vPostNonResidential = getAppSpecific("Post Non-Residential");
if (vPostNonResidential != null && vPostNonResidential != "") {
	vPostNonResidential = parseFloat(vPostNonResidential);
} else {
	vPostNonResidential = 0;
}

vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
if (vPostFixtureUnitCount != null && vPostFixtureUnitCount != "") {
	vPostFixtureUnitCount = parseFloat(vPostFixtureUnitCount) * .01;
} else {
	vPostFixtureUnitCount = 0;
}

logDebug("vPostNonResidential: " + vPostNonResidential);
logDebug("vPostFixtureUnitCount: " + vPostFixtureUnitCount);
logDebug("vPostResult: " + (vPostNonResidential + vPostFixtureUnitCount));

vPostResult = vPostNonResidential + vPostFixtureUnitCount;

vCreditAmountGranted = vPreResult - vPostResult;
editAppSpecific("Credit Amount Granted", toFixed(vCreditAmountGranted, 3));
// End script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count and Post 2nd Bath Fixture (ASI) minus Current Fixture Unit Count (ASI)
