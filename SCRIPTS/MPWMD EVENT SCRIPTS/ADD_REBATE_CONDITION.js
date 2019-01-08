//Begin script to add a "Rebate" condition to the Base Permise record
if (wfTask == "Review" && wfStatus == "Approved") {
	var vParent = getParent("Demand/Master/Base Premise/NA");
	var vConditionType = "Rebates";
	var vConditionStatus = "Applied";
	var vConditionDesc = "Rebate Issued";
	var vConditionImpact = null;
	var vConditionComment = "";
	var vConditionExists;
	var vTmpCapId;

	if (vParent != false) {
		logDebug("Parent: " + vParent.getCustomID());
		// Check to see if parent record has condition already, if so then get the condition comments
		vTmpCapId = capId;
		capId = vParent;
		vConditionExists = appHasCondition(vConditionType, vConditionStatus, vConditionDesc, vConditionImpact);
		capId = vTmpCapId;

		if (vConditionExists) {
			vConditionComment = getCapConditionComment(vConditionType, vConditionStatus, vConditionDesc, vConditionImpact, vParent);
			logDebug("Existing Condition Comment: " + vConditionComment);
			// Check to see if record ID is already in condition comment, if not then add it.
			if (vConditionComment.indexOf(capId.getCustomID()) == -1) {
				logDebug("Updating Condition Comment");
				vConditionComment = vConditionComment + String.fromCharCode(13) + capId.getCustomID();
				// Update existing condition comment
				editCapConditionComment(vConditionType, vConditionDesc, vConditionStatus, vConditionComment, vParent);
			}
		} else {
			logDebug("Adding Condition");
			vConditionComment = capId.getCustomID();
			// Condition doesn't exist so add it
			addStdConditionWithComment(vConditionType, vConditionDesc, vConditionComment, vParent);
		}
	}

}
//End script to add a "Rebate" condition to the Base Permise record

