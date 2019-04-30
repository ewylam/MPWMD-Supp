// Begin script to update the parent Base Premise record with info from Water Use Permit
if (wfTask == "Permit Issuance" && matches(wfStatus,"Issued","Issued in Zone")) {
	var vParentCapId = getParent("Demand/Master/Base Premise/NA");
	var vPostFixtureUnitCount;
	if (vParentCapId != null && vParentCapId != "") {
		// Update Purchased Water (Base Premise ASI) with current value plus Amount of Water Purchased (Water Use Permit ASI)
		var vAmountOfWaterPurchased;
		var vPurchasedWater;
		var vNewPurchasedWater;
		vPurchasedWater = getAppSpecific("Purchased Water", vParentCapId);
		vAmountOfWaterPurchased = getAppSpecific("Amount of Water Purchased");
		if (vPurchasedWater != null && vPurchasedWater != "") {
			vPurchasedWater = parseFloat(vPurchasedWater);
		} else {
			vPurchasedWater = 0;
		}
		if (vAmountOfWaterPurchased != null && vAmountOfWaterPurchased != "") {
			vAmountOfWaterPurchased = parseFloat(vAmountOfWaterPurchased);
		} else {
			vAmountOfWaterPurchased = 0;
		}
		vNewPurchasedWater = vPurchasedWater + vAmountOfWaterPurchased;
		if (parseFloat(vNewPurchasedWater) != "NaN") {
			editAppSpecific("Purchased Water", toFixed(vNewPurchasedWater, 4), vParentCapId);
		}
		// Update Purchased Water Remaining (Base Premise ASI) with Purchased Water minus Purchased Water Used (Base Premise ASI)
		var vPurchasedWater;
		var vPurchasedWaterUsed;
		var vPurchasedWaterRemaining;
		vPurchasedWater = getAppSpecific("Purchased Water", vParentCapId);
		vPurchasedWaterUsed = getAppSpecific("Purchased Water Used", vParentCapId);
		if (vPurchasedWater != null && vPurchasedWater != "") {
			vPurchasedWater = parseFloat(vPurchasedWater);
		} else {
			vPurchasedWater = 0;
		}
		if (vPurchasedWaterUsed != null && vPurchasedWaterUsed != "") {
			vPurchasedWaterUsed = parseFloat(vPurchasedWaterUsed);
		} else {
			vPurchasedWaterUsed = 0;
		}
		vPurchasedWaterRemaining = vPurchasedWater - vPurchasedWaterUsed;
		if (parseFloat(vPurchasedWaterRemaining) != "NaN") {
			editAppSpecific("Purchased Water Remaining", toFixed(vPurchasedWaterRemaining, 4), vParentCapId);
		}

		// Update Credits Remaining (Base Premise ASI) with Credits Received minus Credits Used (Base Premise ASI)
		var vCreditsRecieved;
		var vCreditsUsed;
		var vCreditsRemaining;
		vCreditsRecieved = getAppSpecific("Credits Received", vParentCapId);
		vCreditsUsed = getAppSpecific("Credits Used", vParentCapId);
		if (vCreditsRecieved != null && vCreditsRecieved != "") {
			vCreditsRecieved = parseFloat(vCreditsRecieved);
		} else {
			vCreditsRecieved = 0;
		}
		if (vCreditsUsed != null && vCreditsUsed != "") {
			vCreditsUsed = parseFloat(vCreditsUsed);
		} else {
			vCreditsUsed = 0;
		}
		vCreditsRemaining = vCreditsRecieved - vCreditsUsed;
		if (parseFloat(vCreditsRemaining) != "NaN") {
			editAppSpecific("Credits Remaining", toFixed(vCreditsRemaining, 4), vParentCapId);
		}
		
		// Update Entitlement Name ASI
		var vEntitlementName;
		vEntitlementName = getAppSpecific("Entitlement Name");
		if (vEntitlementName != null && vEntitlementName != "") {
			editAppSpecific("Entitlement Name", vEntitlementName, vParentCapId);
		}
	}
}
// End script to update the parent Base Premise record with info from Water Use Permit
