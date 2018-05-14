function isAmendment() {
	var result = aa.cap.getProjectByChildCapID(capId, "Amendment", null);
	if (result.getSuccess()) {
		projectScriptModels = result.getOutput();
		if (projectScriptModels != null && projectScriptModels.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	return false;
}