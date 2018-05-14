function getPartialCapID(vCapId) {
	if (vCapId == null || aa.util.instanceOfString(vCapId))
	{
		return null;
	}
	//1. Get original partial CAPID  from related CAP table.
	var result = aa.cap.getProjectByChildCapID(vCapId, "EST", null);
	if(result.getSuccess())
	{
		projectScriptModels = result.getOutput();
		if (projectScriptModels == null || projectScriptModels.length == 0)
		{
			logDebug("ERROR: Failed to get partial CAP with CAPID(" + vCapId + ")");
			return null;
		}
		//2. Get original partial CAP ID from project Model
		projectScriptModel = projectScriptModels[0];
		return projectScriptModel.getProjectID();
	}  
	else 
	{
		logDebug("ERROR: Failed to get partial CAP by child CAP(" + vCapId + "): " + result.getErrorMessage());
		return null;
	}
}
