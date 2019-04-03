// Begin script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count and Post 2nd Bath Fixture (ASI) minus Current Fixture Unit Count (ASI)
var vPermitCategory;
var vPostFixtureUnitCount;
var v2ndBathFixtureCount;
var vCurrentFixtureUnitCount;
var vProposedWaterUsage;
var vCurrentPermitOnsiteCredit;
var vPostNonResidential;
var vNonResidentialAFTotal;
vPermitCategory = getAppSpecific("Permit Category");
if (vPermitCategory == "Residential") {
	vPostFixtureUnitCount = getAppSpecific("Post Fixture Unit Count");
	v2ndBathFixtureCount = getAppSpecific("Post 2nd Bath Fixture");
	vCurrentFixtureUnitCount = getAppSpecific("Current Fixture Unit Count");
	if (v2ndBathFixtureCount != null && v2ndBathFixtureCount != "" && v2ndBathFixtureCount != 0) {
		v2ndBathFixtureCount = parseFloat(v2ndBathFixtureCount) * .01;
		editAppSpecific("Proposed Water Usage", toFixed(v2ndBathFixtureCount, 4));

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

		vCurrentPermitOnsiteCredit = vCurrentFixtureUnitCount - vPostFixtureUnitCount;
		if (vCurrentPermitOnsiteCredit > 0) {
			editAppSpecific("Current Permit Onsite Credit", toFixed((vCurrentPermitOnsiteCredit * .01), 4));
		}
	} else {
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
			//if less water demand (Proposed water usage <0)put the absolute value of the proposed water usage into the Current Permit Onsite Credit
			if (parseFloat(vProposedWaterUsage) < 0) {
				vCurrentPermitOnsiteCredit = Math.abs(toFixed(vProposedWaterUsage, 4));
				editAppSpecific("Current Permit Onsite Credit", toFixed(vCurrentPermitOnsiteCredit, 4));
			} else {
				editAppSpecific("Proposed Water Usage", toFixed(vProposedWaterUsage, 4));
			}
		}
	}
} else if (vPermitCategory == "Non-Residential") {
	vPostNonResidential = getAppSpecific("Post Non-Residential");
	if (vPostNonResidential != null && vPostNonResidential != "") {
		vPostNonResidential = parseFloat(vPostNonResidential);
	} else {
		vPostNonResidential = 0;
	}
	vNonResidentialAFTotal = getAppSpecific("Non-Residential AF Total");
	if (vNonResidentialAFTotal != null && vNonResidentialAFTotal != "") {
		vNonResidentialAFTotal = parseFloat(vNonResidentialAFTotal);
	} else {
		vNonResidentialAFTotal = 0;
	}
	vProposedWaterUsage = vPostNonResidential - vNonResidentialAFTotal;
	if (parseFloat(vProposedWaterUsage) != "NaN") {
		//if less water demand (Proposed water usage <0)put the absolute value of the proposed water usage into the Current Permit Onsite Credit
		if (parseFloat(vProposedWaterUsage) < 0) {
			vCurrentPermitOnsiteCredit = Math.abs(toFixed(vProposedWaterUsage, 4));
			editAppSpecific("Current Permit Onsite Credit", toFixed(vCurrentPermitOnsiteCredit, 4));
		} else {
			editAppSpecific("Proposed Water Usage", toFixed(vProposedWaterUsage, 4));
		}
	}
} else if (vPermitCategory == "Mixed-Use") {
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
	vPostNonResidential = getAppSpecific("Post Non-Residential");
	if (vPostNonResidential != null && vPostNonResidential != "") {
		vPostNonResidential = parseFloat(vPostNonResidential);
	} else {
		vPostNonResidential = 0;
	}
	vNonResidentialAFTotal = getAppSpecific("Non-Residential AF Total");
	if (vNonResidentialAFTotal != null && vNonResidentialAFTotal != "") {
		vNonResidentialAFTotal = parseFloat(vNonResidentialAFTotal);
	} else {
		vNonResidentialAFTotal = 0;
	}
	vProposedWaterUsage = ((vPostFixtureUnitCount - vCurrentFixtureUnitCount) * .01) + (vPostNonResidential - vNonResidentialAFTotal);
	if (parseFloat(vProposedWaterUsage) != "NaN") {
		//if less water demand (Proposed water usage <0)put the absolute value of the proposed water usage into the Current Permit Onsite Credit
		if (parseFloat(vProposedWaterUsage) < 0) {
			vCurrentPermitOnsiteCredit = Math.abs(toFixed(vProposedWaterUsage, 4));
			editAppSpecific("Current Permit Onsite Credit", toFixed(vCurrentPermitOnsiteCredit, 4));
		} else {
			editAppSpecific("Proposed Water Usage", toFixed(vProposedWaterUsage, 4));
		}
	}
}
// End script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count and Post 2nd Bath Fixture (ASI) minus Current Fixture Unit Count (ASI)
