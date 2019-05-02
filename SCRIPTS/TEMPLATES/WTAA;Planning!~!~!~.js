try {
    var workflowResult = aa.workflow.getTasks(capId);
    if (workflowResult.getSuccess()) {
        var wfObj = workflowResult.getOutput();
        for (ii = wfObj.length - 1; ii >= 0; ii--) {
            fTask = wfObj[ii];
            //comment("i: " + ii);
            wftask = fTask.getTaskDescription();
            if (wftask == "VS Review Legal Description After Expiration" || wftask == "VS Recordation Processing After Expiration") {
                updateAppStatus("Recordation Processing", "Set by Script")
                break;
            }
        }
    }
}
catch (err) {
    logDebug("A JavaScript Error occurred: WTAA;Planning!~!~!~: " + err.message);
}
