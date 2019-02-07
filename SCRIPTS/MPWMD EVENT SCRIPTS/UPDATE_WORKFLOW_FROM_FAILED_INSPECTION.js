// Begin script to update workflow for "Fail" or "Fail - Reinspection Required" results
if (inspResult == "Fail" || inspResult == "Fail - Reinspection Required") {
	resultWorkflowTask("Inspection", "Failed", "Updated by UPDATE_WORKFLOW_FROM_FAILED_INSPECTION.js", "Updated by UPDATE_WORKFLOW_FROM_FAILED_INSPECTION.js");
}
// End script to update workflow for "Fail" or "Fail - Reinspection Required" results
