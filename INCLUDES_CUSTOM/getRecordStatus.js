
function getRecordStatus(pCapId) {
	var recordStatusResult = aa.cap.getCap(pCapId);
	
	if (!recordStatusResult.getSuccess())
		{
		logDebug("**ERROR: Failed to get record status: " + recordStatusResult.getErrorMessage()); 
		return false;
		}
		
	var recordStatusObj = recordStatusResult.getOutput();

	if (!recordStatusObj)
		{ logDebug("**ERROR: No cap script object") ; return false; }

	var cd = recordStatusObj.getCapModel();

	var recordStatus = cd.getCapStatus();

	if(recordStatus != null)
		return recordStatus;
	else
		return "";
	}
