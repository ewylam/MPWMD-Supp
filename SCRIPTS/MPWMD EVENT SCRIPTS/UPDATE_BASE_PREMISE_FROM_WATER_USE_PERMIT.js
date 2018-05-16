// Begin script to update the parent Base Premise record with info from Water Use Permit
if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
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
	}
}
// End script to update the parent Base Premise record with info from Water Use Permit
