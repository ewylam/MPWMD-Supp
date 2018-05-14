function getSubProcessCode(vStepNumber, vParentProcessID) {
	var relationResult = aa.workflow.getProcessRelationByPK(capId, vStepNumber, vParentProcessID, systemUserObj);
	var relObj;
	var fTask;
	var fRel;

	var subTask;
	var substepnumber;
	var subprocessCode;
	var subwftask;
	var subwfnote = " ";
	var subTaskResult;
	var subTaskObj;
	var k = 0;
	
	if (relationResult.getSuccess()) {
		relObj = relationResult.getOutput();
		return relObj.getProcessCode();
	} else {
		logMessage("**ERROR: Failed to get workflow process relation object: " + relationResult.getErrorMessage());
		return false;
	}
}