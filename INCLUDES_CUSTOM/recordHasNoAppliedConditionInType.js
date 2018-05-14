function recordHasNoAppliedConditionInType(pConditionType) {
	var appliedStatuses = ["Incomplete","Applied"];
	var condResult = aa.capCondition.getCapConditions(capId);

	//Convert to Uppercase for compare
	pConditionType = pConditionType.toUpperCase();

	if (condResult.getSuccess())
		var capConds = condResult.getOutput();
	else {
		logMessage("**ERROR: getting record conditions: " + condResult.getErrorMessage());
		logDebug("**ERROR: getting record conditions: " + condResult.getErrorMessage());
		return false;
	}

	for (cc in capConds) {
		var thisCond = capConds[cc];

		var conditionStatusType = "" + thisCond.getConditionStatus(); //"Applied" or "Not Applied"
		var ConditionType = thisCond.getConditionType().toUpperCase(); //Condition Group to compare the parameter to

		logDebug(ConditionType)
		logDebug(conditionStatusType);
		
		if (pConditionType == ConditionType && exists(conditionStatusType,appliedStatuses)) {
			logDebug("A Condition with Type " + pConditionType + " was found in the Status type of " + conditionStatusType + ". Return False.");
			return false;
		}
	}

	//Default, return true if no Applied conditions found for group
	logDebug("A Condition with Type " + pConditionType + " was NOT found in the Status type of " + conditionStatusType + ". Return True.");
	return true;
}