function getJAERecord(pGroup, pType, pSubType, pCategory, pAppName) {
	getCapResult = aa.cap.getByAppType(pGroup, pType, pSubType, pCategory);
	if (getCapResult.getSuccess()) {
		var apsArray = getCapResult.getOutput();
	} else {
		logDebug("**ERROR: getting caps by app type: " + getCapResult.getErrorMessage());
		return null
	}

	for (aps in apsArray) {
		var myCap = aa.cap.getCap(apsArray[aps].getCapID()).getOutput();
		if (myCap.getSpecialText() == pAppName) {
			return apsArray[aps].getCapID();
		}
	}
}
