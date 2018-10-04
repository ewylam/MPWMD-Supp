// Begin script to close workflow
if (wfTask == 'Permit Issuance' && wfStatus == 'Issued') {
	closeTask("Close", "Closed-Completed", "Updated by CLOSE_WORKFLOW script", "Updated by CLOSE_WORKFLOW script");
}
// End script to close workflow