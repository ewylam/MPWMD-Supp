//Edit document name locally
function editDocumentName(vOrgDocumentName, vNewDocumentName) {
	var vDocumentList;
	var y;
	var vDocumentModel;
	var vDocumentName;
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
			if (vDocumentName == vOrgDocumentName) {
				vExtStart = vDocumentName.indexOf(".");
				if (vExtStart != -1) {
					vFileExtension = vDocumentName.substr(vExtStart,vDocumentName.length);
					vNewDocumentName = vNewDocumentName + vFileExtension;
				}
				//edit document name in accela
				vDocumentModel.setFileName(vNewDocumentName);
				vSaveResult = aa.document.updateDocument(vDocumentModel);
				if (vSaveResult.getSuccess()) {			
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