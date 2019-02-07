// Begin script to update the Total Amount Approved (ASI) with the sum of all Residential Rebate (ASIT) Approved Amount values
var x = 0;
var vRebateFixture;
var vRebateFixtureApprovedAmount;
var vTotalAmount = 0;
var vRebateFixtureStatus;
if (typeof(RESIDENTIALREBATES) == "object") {
	for (x in RESIDENTIALREBATES) {
		vRebateFixture = RESIDENTIALREBATES[x];
		vRebateFixtureApprovedAmount = parseFloat(vRebateFixture["Approved Amount"]);
		vRebateFixtureStatus = vRebateFixture["Status"] + "";
		if (vRebateFixtureApprovedAmount != "NaN" && vRebateFixtureStatus == "Approved") {
			vTotalAmount += vRebateFixtureApprovedAmount;
			logDebug("Value of Rebate Fixtures = Approved: " + vTotalAmount + "Value of the Approved Amount: " + vRebateFixtureApprovedAmount);
		}
	}
}
if (vTotalAmount != "NaN") {
	editAppSpecific("Total Amount Approved", toFixed(vTotalAmount, 2));
}
// End script to update the Total Amount Approved (ASI) with the sum of all Residential Rebate (ASIT) Approved Amount values
