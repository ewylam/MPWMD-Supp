function setInitialWorkflowTaskStatus() {
	//use optional parameter #1 "Y" to re-execute WTUA event
	var executeWTUA = false;

	if (arguments.length == 1) {
		executeWTUA = true;
	}

	var vWF = aa.workflow.getTasks(capId);

	if (vWF.getSuccess()) {
		vWF = vWF.getOutput();
	} else {
		logDebug("Failed to get workflow tasks");
	}

	var vEnvTask = null;
	if (typeof(wfTask) !== "undefined") {
		vEnvTask = wfTask;
	}

	var vEnvStatus = null;
	if (typeof(wfStatus) !== "undefined") {
		vEnvStatus = wfStatus;
	}

	for (x in vWF) {
		var vTask = vWF[x];
		var vTaskItem = vTask.getTaskItem();
		var vTaskName = vTask.taskDescription;
		var vProcessID = vTask.getProcessID();
		var vProcessCode = vTask.getProcessCode();
		var vStepNum = vTask.getStepNumber();

		//logDebug("Here in setInitialWorkflowTaskStatus. Task Informaiton:");
		//logDebug("TaskActive: " + isTaskActive(vTaskName));
		//logDebug("TaskName: " + vTaskName);
		//logDebug("TaskDisposition: " + vTask.getDisposition());
		//logDebug("TaskDispositionDate: " + vTask.getDispositionDate());
		//logDebug("vEnvTask: " + vEnvTask);
		//logDebug("vEnvStatus: " + vEnvStatus);

		//When the task is active and it has as status (Disposition) but no status date (Disposition Date),
		//and is also not the environments task or status (when triggered by WTUA), then save the status with a date
		//by using the updateTask function.
		if (isTaskActive(vTaskName) == true && vTask.getDisposition() != null && vTask.getDisposition() != "" && vTask.getDispositionDate() == null
			 && (vEnvTask == null || vEnvTask != vTaskName) && (vEnvStatus == null || vEnvStatus != vTask.getDisposition())) {

			//logDebug("Here in setInitialWorkflowTaskStatus. Updating task with initial status");
			//logDebug("TaskActive: " + isTaskActive(vTaskName));
			//logDebug("TaskName: " + vTaskName);
			//logDebug("TaskDisposition: " + vTask.getDisposition());
			//logDebug("TaskDispositionDate: " + vTask.getDispositionDate());

			updateTask(vTaskName, vTask.getDisposition(), "Initial status updated via script", "Initial status updated via script", vProcessCode);

			//Execute Worfklow task scripts
			if (executeWTUA) {
				//logDebug("Calling WTUA in ASync for wfTask: " + vTask.taskDescription + " and wfStatus: " + vTask.getDisposition() + " for capId: " + capId);
				runWTUAForWFTaskWFStatus(vTaskName, vProcessID, vStepNum, vTask.getDisposition(), capId);
			}
		}
		//new code
		//When the task is active and it has as status (Disposition) but no status date (Disposition Date),
		//and IS the environments task or status (when triggered by WTUA), then save the status with a date
		if (isTaskActive(vTaskName) == true
			 && vTask.getDisposition() != null
			 && vTask.getDisposition() != ""
			 && vTask.getDispositionDate() == null
			 && vEnvTask == vTaskName
			 && vEnvStatus == vTask.getDisposition()) {
			//set the disposition date
			vTaskItem.setDispositionDate(new Date());
			var updateResult = aa.workflow.adjustTaskWithNoAudit(vTaskItem);
			if (updateResult.getSuccess()) {
				logDebug("Updated Workflow Task : " + vTaskName + " Disposition Date to " + aa.date.getCurrentDate());
			} else {
				logDebug("Error updating wfTask : " + updateResult.getErrorMessage());
			}
		}
		//end new code
	}
}
