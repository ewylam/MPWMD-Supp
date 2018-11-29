// Get Expression Objects
var servProvCode=expression.getValue("$$servProvCode$$").value;
var vCalcMethod = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Calculation Method");
var vProposedWaterUsage = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Proposed Water Usage");
var vPurchasedWaterRemaining = expression.getValue("ASI::BASE PREMISE::Purchased Water Remaining");
var vWDSRemaining = expression.getValue("ASI::BASE PREMISE::WDS Remaining");
var vWUCRemaining = expression.getValue("ASI::BASE PREMISE::Credits Remaining");
var vEntitlements = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Entitlements");
var vWDS = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::WDS");
var vWUCUsing = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Water Use Credit Using");
var vForm = expression.getValue("ASI::FORM");
var vRemainingAmount = 0;

// Get numberic values
var vProposedWaterUsageValue = Number(vProposedWaterUsage.value);
var vPurchasedWaterRemainingValue = Number(vPurchasedWaterRemaining.value);
var vWDSRemainingValue = Number(vWDSRemaining.value);
var vWUCRemainingValue = Number(vWUCRemaining.value);

if (vCalcMethod.value == "Best Practice Methodology" && vProposedWaterUsageValue != null && vProposedWaterUsageValue > 0) {
	if (vPurchasedWaterRemainingValue != null) {
		if (vPurchasedWaterRemainingValue < vProposedWaterUsageValue) {
			vEntitlements.value = vPurchasedWaterRemainingValue;
			expression.setReturn(vEntitlements);
			vRemainingAmount = vProposedWaterUsageValue - vPurchasedWaterRemainingValue;
		} 
		else {
			vEntitlements.value = vProposedWaterUsageValue;
			expression.setReturn(vEntitlements);
			vRemainingAmount = 0;		
		}
	}
	if (vRemainingAmount > 0 && vWDSRemainingValue != null && vWDSRemainingValue > 0) {
		if (vWDSRemainingValue < vRemainingAmount) {
			vWDS.value = vWDSRemainingValue;
			expression.setReturn(vWDS);
			vRemainingAmount = vRemainingAmount - vWDSRemainingValue;
		}
		else {
			vWDS.value = vRemainingAmount;
			expression.setReturn(vWDS);
			vRemainingAmount = 0;				
		}
	}
	if (vRemainingAmount > 0 && vWUCRemainingValue != null && vWUCRemainingValue > 0) {
		if (vWUCRemainingValue < vRemainingAmount) {
			vWUCUsing.value = vWUCRemainingValue;
			expression.setReturn(vWUCUsing);
			vRemainingAmount = vRemainingAmount - vWUCRemainingValue;			
		}	
		else {
			vWUCUsing.value = vRemainingAmount;
			expression.setReturn(vWUCUsing);
			vRemainingAmount = 0;			
		}
	}
}
if (vRemainingAmount > 0) {
	vForm.message = "Please enter approprate jurisditction bucket for the remaining " + toPrecision(vRemainingAmount) + " amount";
	expression.setReturn(vForm);
	vProposedWaterUsage.message = "Please enter approprate jurisditction bucket for the remaining " + toPrecision(vRemainingAmount) + " amount";
	expression.setReturn(vProposedWaterUsage);
}

function toPrecision(value) {
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}