function setTransParcelLegalDescription(vCapId, vLegalDescription) {
	var fcapParcelObj = null;
	var capParcelResult = aa.parcel.getParcelandAttribute(vCapId, null);
	var parcel;
	var vResult = false;
	if (capParcelResult.getSuccess()) {
		var fcapParcelObj = capParcelResult.getOutput().toArray();
	} else {
		aa.print("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" + capParcelResult.getErrorMessage());
	}

	for (i in fcapParcelObj) {
		parcel = fcapParcelObj[i];
		legalDescription = parcel.setLegalDesc(vLegalDescription);
		var capPrclObj = aa.parcel.warpCapIdParcelModel2CapParcelModel(vCapId, parcel);
		if (capPrclObj.getSuccess()) {
			capPrclObj = capPrclObj.getOutput();
			vResult = aa.parcel.updateDailyParcelWithAPOAttribute(capPrclObj);
			if (vResult.getSuccess()) {
				return vResult;
			} else {
				aa.print("**ERROR: Failed to update the transactional Parcel object: " + vResult.getErrorType() + ":" + vResult.getErrorMessage());
				return vResult;
			}
		} else {
			aa.print("**ERROR: Failed to get the cap parcel object: " + capPrclObj.getErrorType() + ":" + capPrclObj.getErrorMessage());
			return vResult;
		}
		break;
	}
	return vResult;
}