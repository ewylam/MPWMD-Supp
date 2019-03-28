// Begin script to update workflow for "Fail" or "Fail - Reinspection Required" results
include("UPDATE_WORKFLOW_FROM_FAILED_INSPECTION");
// End script to update workflow for "Fail" or "Fail - Reinspection Required" results

// Begin Script to send inspection emails to Applicant
include("SEND_INSPECTION_RESULT_EMAIL");
// End Script to send inspection emails to Applicant