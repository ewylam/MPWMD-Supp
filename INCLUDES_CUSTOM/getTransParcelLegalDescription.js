function getTransParcelLegalDescription(vCapId) {
	var fcapParcelObj = null;
	var capParcelResult = aa.parcel.getParcelandAttribute(vCapId, null);
	var parcel;
	var legalDescription;
	if (capParcelResult.getSuccess()) {
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	} else {
		aa.print("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage());
	}

	for (i in fcapParcelObj) {
		parcel = fcapParcelObj[i];
		legalDescription = parcel.getLegalDesc();
		// return only the first
		break;
	}
	return legalDescription;
}
