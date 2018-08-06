// Begin script to associate base premise to water permit
if (!publicUser) {
	if (AInfo["Base Premise Number"] && AInfo["Base Premise Number"] != "") {
		var parentIdResult = aa.cap.getCapID(AInfo["Base Premise Number"]);
		if (parentIdResult.getSuccess()) {
			var parentId = parentIdResult.getOutput();
			if (parentId) {
				addParent(parentId);
			}
		}
	}
}
// End script to associate base premise to water permit
