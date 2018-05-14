function getProcessCode(vTaskName, vCapId) { // optional process name
	var useProcess = false;

	var processName = "";
	if (arguments.length == 5) {
		processName = arguments[4]; // process name
		useProcess = true;
	}

	var workflowResult = aa.workflow.getTaskItems(vCapId, vTaskName, processName, null, null, null);
	if (workflowResult.getSuccess())
		var wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if (fTask.getTaskDescription().toUpperCase().equals(vTaskName.toUpperCase()) && (!useProcess || fTask.getProcessCode().equals(processName))) {
			return fTask.getProcessCode();
		}
	}
}
