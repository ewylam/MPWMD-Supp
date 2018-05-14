//Edit document name locally
function editDocumentName(vOrgDocumentName, vNewDocumentName) {
	var vDocumentList;
	var y;
	var vDocumentModel;
	var vDocumentName;
	
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
				//edit document name in accela
				vDocumentModel.setFileName(vNewDocumentName);
				logDebug("Here: " + aa.document.updateDocument(vDocumentModel).getSuccess());
				return true;
			}
		}
	}
	return false;
}