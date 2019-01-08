function editCapConditionComment(pType, pDesc, pStatus, pComment, pCapId) {
	// updates a condition with the pType and pDesc
	if (pType == null) {
		var condResult = aa.capCondition.getCapConditions(pCapId);
	} else {
		var condResult = aa.capCondition.getCapConditions(pCapId, pType);
	}

	if (condResult.getSuccess()) {
		var capConds = condResult.getOutput();
	} else {
		logMessage("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
		logDebug("**ERROR: getting cap conditions: " + condResult.getErrorMessage());
		return false;
	}

	for (cc in capConds) {
		var thisCond = capConds[cc];
		var cStatus = thisCond.getConditionStatus() + "";
		var cDesc = thisCond.getConditionDescription();
		var cImpact = thisCond.getImpactCode();
		if (cDesc.toUpperCase() == pDesc.toUpperCase()) {
			if (!pStatus.toUpperCase() == cStatus.toUpperCase()) {
				thisCond.setConditionComment(pComment);
				thisCond.setLongDescripton(pComment);
				thisCond.setImpactCode(cImpact);
				aa.capCondition.editCapCondition(thisCond);
				logDebug("Successfully updated the comments on condition " + pDesc + " for record " + pCapId.getCustomID());
				return true; // condition has been found and updated
			} else {
				logDebug("ERROR: condition found but not in the status of " + pStatus);
				return false; 
			}
		}
		logDebug("ERROR: no matching condition found");
		return false; //no matching condition found
	}
}