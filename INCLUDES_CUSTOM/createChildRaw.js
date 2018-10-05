function createChildRaw(grp, typ, stype, cat) {
	//
	// creates the new application and returns the capID object
	//
	var itemCap = capId
		if (arguments.length > 4)
			itemCap = arguments[4]; // use cap ID specified in args

		var appCreateResult = aa.cap.createApp(grp, typ, stype, cat, "");
	logDebug("creating cap " + grp + "/" + typ + "/" + stype + "/" + cat);
	if (appCreateResult.getSuccess()) {
		var newId = appCreateResult.getOutput();
		logDebug("cap " + grp + "/" + typ + "/" + stype + "/" + cat + " created successfully ");

		// create Detail Record
		capModel = aa.cap.newCapScriptModel().getOutput();
		capDetailModel = capModel.getCapModel().getCapDetailModel();
		capDetailModel.setCapID(newId);
		aa.cap.createCapDetail(capDetailModel);

		var newObj = aa.cap.getCap(newId).getOutput(); //Cap object
		var result = aa.cap.createAppHierarchy(itemCap, newId);
		if (result.getSuccess()) {
			logDebug("Child application successfully linked");
		} else {
			logDebug("Could not link applications");
		}
		return newId;
	} else {
		logDebug("**ERROR: adding child App: " + appCreateResult.getErrorMessage());
	}
}
