function getTaskAssignedStaff(wfstr) // optional process name.
{
	var useProcess = false;
	var processName = "";
	if (arguments.length == 2) {
		processName = arguments[1]; // subprocess
		useProcess = true;
	}

	var taskDesc = wfstr;
	if (wfstr == "*") {
		taskDesc = "";
	}
	var workflowResult = aa.workflow.getTaskItems(capId, taskDesc, processName, null, null, null);
	if (workflowResult.getSuccess())
		wfObj = workflowResult.getOutput();
	else {
		logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage());
		return false;
	}

	for (i in wfObj) {
		var fTask = wfObj[i];
		if ((fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase()) || wfstr == "*") && (!useProcess || fTask.getProcessCode().equals(processName))) {
			var vStaffUser = aa.cap.getStaffByUser(fTask.getAssignedStaff().getFirstName(),fTask.getAssignedStaff().getMiddleName(),fTask.getAssignedStaff().getLastName(),fTask.getAssignedStaff().toString()).getOutput(); 
			if (vStaffUser != null) {			
				return vStaffUser.getUserID();
			}
		}
	}
	return false;
}