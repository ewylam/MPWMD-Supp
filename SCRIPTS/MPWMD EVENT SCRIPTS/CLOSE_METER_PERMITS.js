// Begin script to close workflow and related records workflow.
if (matches(wfTask, "Permit Issuance") && matches(wfStatus, "Issued")) {
	closeTask("Close", "Closed-Completed", "Auto Close Workflow");
	var vChildren = getChildren("Demand/Application/Waiver/NA");
	var vTmpId;
	var x = 0;
	for (x in vChildren) {
		vTmpId = capId;
		capId = vChildren[x];
		deactivateTask("Application Received");
		closeTask("Close", "Closed-Completed", "Auto Close Workflow");
		capId = vTmpId;
	}
}
// End script to close workflow and related records workflow.