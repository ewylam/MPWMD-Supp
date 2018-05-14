function copyDocuments(pFromCapId, pToCapId) {

	//Copies all attachments (documents) from pFromCapId to pToCapId
	var vFromCapId = pFromCapId;
	var vToCapId = pToCapId;
	var categoryArray = new Array();
	
	// third optional parameter is comma delimited list of categories to copy.
	if (arguments.length > 2) {
		categoryList = arguments[2];
		categoryArray = categoryList.split(",");
	}

	var capDocResult = aa.document.getDocumentListByEntity(capId,"CAP");
	if(capDocResult.getSuccess()) {
		if(capDocResult.getOutput().size() > 0) {
	    	for(docInx = 0; docInx < capDocResult.getOutput().size(); docInx++) {
	    		var documentObject = capDocResult.getOutput().get(docInx);
	    		currDocCat = "" + documentObject.getDocCategory();
	    		if (categoryArray.length == 0 || exists(currDocCat, categoryArray)) {
	    			// download the document content
					var useDefaultUserPassword = true;
					//If useDefaultUserPassword = true, there is no need to set user name & password, but if useDefaultUserPassword = false, we need define EDMS user name & password.
					var EMDSUsername = null;
					var EMDSPassword = null;
					var downloadResult = aa.document.downloadFile2Disk(documentObject, documentObject.getModuleName(), EMDSUsername, EMDSPassword, useDefaultUserPassword);
					if(downloadResult.getSuccess()) {
						var path = downloadResult.getOutput();
						logDebug("path=" + path);
					}
					var tmpEntId = vToCapId.getID1() + "-" + vToCapId.getID2() + "-" + vToCapId.getID3();
					documentObject.setDocumentNo(null);
					documentObject.setCapID(vToCapId)
					documentObject.setEntityID(tmpEntId);
	
					// Open and process file
					try {
						// put together the document content - use java.io.FileInputStream
						var newContentModel = aa.document.newDocumentContentModel().getOutput();
						inputstream = new java.io.FileInputStream(path);
						newContentModel.setDocInputStream(inputstream);
						documentObject.setDocumentContent(newContentModel);
						var newDocResult = aa.document.createDocument(documentObject);
						if (newDocResult.getSuccess()) {
							newDocResult.getOutput();
							logDebug("Successfully copied document: " + documentObject.getFileName());
						}
						else {
							logDebug("Failed to copy document: " + documentObject.getFileName());
							logDebug(newDocResult.getErrorMessage());
						}
					}
					catch (err) {
						logDebug("Error copying document: " + err.message);
						return false;
					}
				}
	    	} // end for loop
		}
    }
}