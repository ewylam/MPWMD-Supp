// Get Expression Objects
var servProvCode=expression.getValue("$$servProvCode$$").value;
var vCalcMethod = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Calculation Method");

var vProposedWaterUsage = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Proposed Water Usage");

var vPurchasedWaterRemaining = expression.getValue("ASI::BASE PREMISE::Purchased Water Remaining");
var vWDSRemaining = expression.getValue("ASI::BASE PREMISE::WDS Remaining");
var vWUCRemaining = expression.getValue("ASI::BASE PREMISE::Credits Remaining");

var vAuthEntitlements = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Entitlements");
var vAuthWDS = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::WDS");
var vAuthWUCUsing = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Water Use Credit Using");

var vForm = expression.getValue("ASI::FORM");
var vProposedAmountRemaining = 0;

var decPlaces = 4;

// Get numeric values
var vProposedWaterUsageValue = Number(vProposedWaterUsage.value);

var vPurchasedWaterRemainingValue = Number(vPurchasedWaterRemaining.value);
var vWDSRemainingValue = Number(vWDSRemaining.value);
var vWUCRemainingValue = Number(vWUCRemaining.value);

var vAuthEntitlementsValue = 0.0000;
var vAuthWDSValue = 0.0000;
var vAuthWUCUsingValue = 0.0000;

// if there is a remaining proposed amount not covered, and we have credits available to cover part or all
// if we don't have enough credits to cover the entire bill, just some; use all those credits, otherwise if we have enough credits to cover, use just enough to cover
// the remaining proposed amount is 0 if our credits covered it all; otherwise, the proposed amount remaining is just less all the wuc credits used
	
if (vCalcMethod.value == "Best Practice Methodology" && vProposedWaterUsageValue != null) {
	vProposedAmountRemaining = vProposedWaterUsageValue;
	
	if (Number(vProposedAmountRemaining.toFixed(decPlaces)) > 0 && vWUCRemainingValue != null && vWUCRemainingValue > 0) {
		vAuthWUCUsingValue = (vProposedAmountRemaining > vWUCRemainingValue) ? vWUCRemainingValue : vProposedAmountRemaining;
		
		vProposedAmountRemaining -= vAuthWUCUsingValue;
	}
	
	if (Number(vProposedAmountRemaining.toFixed(decPlaces)) > 0 && vPurchasedWaterRemainingValue != null && vPurchasedWaterRemainingValue > 0) {
		vAuthEntitlementsValue = (vProposedAmountRemaining > vPurchasedWaterRemainingValue) ? vPurchasedWaterRemainingValue : vProposedAmountRemaining;
		
		vProposedAmountRemaining -= vAuthEntitlementsValue;
	}
	
	if (Number(vProposedAmountRemaining.toFixed(decPlaces)) > 0 && vWDSRemainingValue != null && vWDSRemainingValue > 0) {
		vAuthWDSValue = (vProposedAmountRemaining > vWDSRemainingValue) ? vWDSRemainingValue : vProposedAmountRemaining;
		
		vProposedAmountRemaining -= vAuthWDSValue;
	}

	vAuthWUCUsing.value = vAuthWUCUsingValue.toFixed(decPlaces);
	vAuthEntitlements.value = vAuthEntitlementsValue.toFixed(decPlaces);
	vAuthWDS.value = vAuthWDSValue.toFixed(decPlaces);

	expression.setReturn(vAuthWUCUsing);	
	expression.setReturn(vAuthEntitlements);
	expression.setReturn(vAuthWDS);
}

if (vProposedAmountRemaining > 0) {
	vForm.message = "Please enter appropriate jurisdiction bucket for the remaining " + vProposedAmountRemaining.toFixed(4) + " amount";
	expression.setReturn(vForm);
	vProposedWaterUsage.message = "Please enter appropriate jurisdiction bucket for the remaining " + vProposedAmountRemaining.toFixed(4) + " amount";
	expression.setReturn(vProposedWaterUsage);
}
