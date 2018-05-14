function areRequiredDocumentConditionsMet(stageName) {
	retValue = "";
	itemCap = capId;
	if (arguments.length > 1)
		itemCap = arguments[1];
	
	if (stageName == "OnSubmit" && publicUser) { // pageflow
		cap = aa.env.getValue("CapModel");
		tmpTable = loadASITable4ACA("REQUIRED DOCUMENTS", cap);
	}
	else {
		tmpTable = loadASITable("REQUIRED DOCUMENTS");
	}
	if (!tmpTable || tmpTable.length == 0) return "";
	
	for (rowIndex in tmpTable) {
		thisRow = tmpTable[rowIndex];
		thisDocType = thisRow["Document Type"].fieldValue;
		thisStage = thisRow["Record Stage"].fieldValue;
		
		if (thisStage == stageName) {
			// recording check
			mustBeRecorded = thisRow["Must be recorded?"].fieldValue;
			if (mustBeRecorded == "Yes" || mustBeRecorded == "Y")
				mustBeRecorded = true;
			else mustBeRecorded = false;
			
			if (mustBeRecorded) {
				recNumber = thisRow["Recording Number"].fieldValue;
				dateRec = thisRow["Date Received for Recording"].fieldValue;
				if ( (recNumber == null || recNumber =="") && (dateRec == null || dateRec == "") )
					retValue += " " +  thisDocType + " document must be recorded before proceeding." + br;
			}
			else { // attached doc check
				numReq = thisRow["Number Required"].fieldValue;
				if (numReq == null || numReq == "") numReq = 0
				else numReq = parseInt(numReq);
				if (numReq > 0) {
					docListArray = null;
					if (stageName == "OnSubmit" && publicUser) { // pageflow
						docListArray = aa.document.getDocumentListByEntity(capIDString,"TMP_CAP").getOutput().toArray();
					}
					else {
						docListResult = aa.document.getCapDocumentList(itemCap,currentUserID);
						if (docListResult.getSuccess()) {		
							docListArray = docListResult.getOutput();
						}
						else { logDebug("Exception getting document list " + docListResult.getErrorMessage()); }
					}
					if (docListArray == null || docListArray.length == 0) {
						retValue +=  " You must attach " + numReq + " " + thisDocType + " document(s) before proceeding." + br;
					}
					else {
						docsFound = 0;
						for (dIndex in docListArray) {
							thisDoc = docListArray[dIndex];
							if (thisDoc.getDocCategory() == thisDocType) 
								docsFound++;
						}
						if (docsFound < numReq) {
							retValue +=  " You must attach " + numReq + " " + thisDocType + " document(s) before proceeding." + br;
						}
					}
				} // end numReq = 0
			}
		}
	}
	return retValue; // passed
}
