//Edit document name locally
function editDocumentName(vOrgDocumentName, vNewDocumentName) {
	var vDocumentList;
	var y;
	var vDocumentModel;
	var vDocumentName;
	var vDocumentNameString = "";
	var vNewDocumentNameComplete = vNewDocumentName;
	var vExtStart;
	var vFileExtension = "";
	var vSaveResult;
	
	vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
	if (vDocumentList != null) {
		vDocumentList = vDocumentList.getOutput();
	}
	else {
		return false;
	}

	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentName = vDocumentModel.getFileName();
			vDocumentNameString = vDocumentName + "";
			logDebug("vDocumentNameString: " + vDocumentNameString);
			if (vDocumentNameString == vOrgDocumentName) {
				vExtStart = vDocumentNameString.indexOf(".");
				logDebug("vExtStart: " + vExtStart);
				logDebug("vDocumentNameString.length: " + vDocumentNameString.length);
				if (vExtStart != -1) {
					vFileExtension = vDocumentNameString.substr(vExtStart,vDocumentNameString.length);
					vNewDocumentNameComplete = vNewDocumentName + vFileExtension;
					logDebug("vFileExtension: " + vFileExtension);
					logDebug("vNewDocumentNameComplete: " + vNewDocumentNameComplete);
				}
				//edit document name in accela
				vDocumentModel.setFileName(vNewDocumentNameComplete);
				vSaveResult = aa.document.updateDocument(vDocumentModel);
				if (vSaveResult.getSuccess()) {
					logDebug("Renamed document " + vDocumentName + " to " + vNewDocumentNameComplete);					
					return true;
				} else {
					logDebug("Failed to update report name");
					logDebug("Error: " + vSaveResult.getErrorMessage());
					return false;
				}
			}
		}
	}
	return false;
}