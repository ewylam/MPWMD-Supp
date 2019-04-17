// MP_WP_CalculationMethod

// Functions
var toPrecision = function (value) {
	var multiplier = 10000;
	return Math.round(value * multiplier) / multiplier;
}

// Get Expression Objects
var servProvCode = expression.getValue("$$servProvCode$$").value;
var vCalcMethod = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Calculation Method");
var vProposedWaterUsage = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Proposed Water Usage");
var vPurchasedWaterRemaining = expression.getValue("ASI::BASE PREMISE::Purchased Water Remaining");
var vWDSRemaining = expression.getValue("ASI::BASE PREMISE::WDS Remaining");
var vWUCRemaining = expression.getValue("ASI::BASE PREMISE::Credits Remaining");
var vEntitlements = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Entitlements");
var vAuthWDS = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::WDS");
var vAuthWUCUsing = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Water Use Credit Using");
var vForm = expression.getValue("ASI::FORM");
var vProposedAmountRemaining = 0;
var decPlaces = 3;

var vWaterUseCredits = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Water Use Credits");
var vUseEntitlement = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use Entitlement");
var vWDS = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use WDS");
var vUse2ndBath = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::AF Second Bathroom Protocol");
var vPost2ndBath = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Post 2nd Bath Fixture");
var vAdjWaterUseCapacity = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Adjusted Water Use Capacity");

// Get numeric values
var vProposedWaterUsageValue = Number(vProposedWaterUsage.value);
var vPurchasedWaterRemainingValue = Number(vPurchasedWaterRemaining.value);
var vWDSRemainingValue = Number(vWDSRemaining.value);
var vWUCRemainingValue = Number(vWUCRemaining.value);
var vEntitlementsValue = 0.000;
var vAuthWDSValue = 0.000;
var vAuthWUCUsingValue = 0.000;
var vEndingAdjustedWaterCapacity = 0;
var vMSG = "";

// if there is a remaining proposed amount not covered, and we have credits available to cover part or all
// if we don't have enough credits to cover the entire bill, just some; use all those credits, otherwise if we have enough credits to cover, use just enough to cover
// the remaining proposed amount is 0 if our credits covered it all; otherwise, the proposed amount remaining is just less all the wuc credits used
try {
	if (vCalcMethod.value == "Best Practice Methodology" && vProposedWaterUsageValue != null) {
		vProposedAmountRemaining = vProposedWaterUsageValue;

		if (Number(vProposedAmountRemaining.toFixed(decPlaces)) > 0 && vWUCRemainingValue != null && vWUCRemainingValue > 0) {
			vAuthWUCUsingValue = (vProposedAmountRemaining > vWUCRemainingValue) ? vWUCRemainingValue : vProposedAmountRemaining;
			vProposedAmountRemaining -= vAuthWUCUsingValue;
			vWaterUseCredits.value = "CHECKED";
		}

		if (Number(vProposedAmountRemaining.toFixed(decPlaces)) > 0 && vPurchasedWaterRemainingValue != null && vPurchasedWaterRemainingValue > 0) {
			vEntitlementsValue = (vProposedAmountRemaining > vPurchasedWaterRemainingValue) ? vPurchasedWaterRemainingValue : vProposedAmountRemaining;
			vProposedAmountRemaining -= vEntitlementsValue;
			vUseEntitlement.value = "CHECKED";
			vEndingAdjustedWaterCapacity += toPrecision(vEntitlementsValue);
			
			vMSG += " + " + toPrecision(vEndingAdjustedWaterCapacity);
		}

		if (Number(vProposedAmountRemaining.toFixed(decPlaces)) > 0 && vWDSRemainingValue != null && vWDSRemainingValue > 0) {
			vAuthWDSValue = (vProposedAmountRemaining > vWDSRemainingValue) ? vWDSRemainingValue : vProposedAmountRemaining;
			vProposedAmountRemaining -= vAuthWDSValue;
			vWDS.value = "CHECKED";
			vEndingAdjustedWaterCapacity += toPrecision(vAuthWDSValue);
			
			vMSG += " + " + toPrecision(vEndingAdjustedWaterCapacity);
		}

		// Get Add2ndBath
		if (vUse2ndBath.value.equalsIgnoreCase('CHECKED')) {
			vEndingAdjustedWaterCapacity += (toPrecision(vPost2ndBath.value) * .01);
			
			vMSG += " + " + toPrecision(vEndingAdjustedWaterCapacity);
		}

		vAuthWUCUsing.value = vAuthWUCUsingValue.toFixed(decPlaces);
		vEntitlements.value = vEntitlementsValue.toFixed(decPlaces);
		vAuthWDS.value = vAuthWDSValue.toFixed(decPlaces);

		vAdjWaterUseCapacity.value = toPrecision(vEndingAdjustedWaterCapacity);
		expression.setReturn(vAdjWaterUseCapacity);
		
		//vForm.message = "Yo its this -> " + vMSG + " = " + toPrecision(vEndingAdjustedWaterCapacity) + " amount";
		//expression.setReturn(vForm);

		expression.setReturn(vWDS);
		expression.setReturn(vUseEntitlement);
		expression.setReturn(vWaterUseCredits);
		expression.setReturn(vAuthWUCUsing);
		expression.setReturn(vEntitlements);
		expression.setReturn(vAuthWDS);
	}

	if (vProposedAmountRemaining > 0) {
		vForm.message = "Please enter appropriate jurisdiction bucket for the remaining " + vProposedAmountRemaining.toFixed(4) + " amount";
		expression.setReturn(vForm);
		vProposedWaterUsage.message = "Please enter appropriate jurisdiction bucket for the remaining " + vProposedAmountRemaining.toFixed(4) + " amount";
		expression.setReturn(vProposedWaterUsage);
	}
} catch (err) {
	vForm.message = "Error: " + err;
	expression.setReturn(vForm);
}
