function getTaskStepNumber(vProcess, vTask, vCapId) {
	var workflowResult = aa.workflow.getTaskItems(vCapId, vTask, vProcess, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logDebug("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	var i = 0;
	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(vTask.toUpperCase()) && fTask.getProcessCode().equals(vProcess)) {
			return fTask.getStepNumber();
		}
	}
}