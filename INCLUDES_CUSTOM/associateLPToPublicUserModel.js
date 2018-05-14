
function associateLPToPublicUserModel(licenseNum, pu) {
	var licResult = aa.licenseScript.getRefLicensesProfByLicNbr(aa.getServiceProviderCode(), licenseNum);
	if (licResult.getSuccess()) {
		var licObj = licResult.getOutput();
		if (licObj != null) {
			licObj = licObj[0];
			if (pu != null) {
				assocResult = aa.licenseScript.associateLpWithPublicUser(pu, licObj);
				if (assocResult.getSuccess()) 
					logDebug("Successfully linked ref lp " + licenseNum + " to public user account");
				else
					logDebug("Link failed for " + licenseNum + " : " + assocResult.getErrorMessage());
			}
			else { logDebug("Public user object is null"); }
		}
		else { logDebug("lp object is null"); }
	}
	else { logDebug("Error associating lp to pu " + licResult.getErrorMessage()); }
}
