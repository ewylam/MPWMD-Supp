function editAppSpecificACALabel(itemName,itemValue)  // optional: itemCap
{
	var appSpecInfoResult;
	var vAppSpecInfoArry;
	var vAppSpecScriptModel;
	var vAppSaveResult;
	var x;
	var itemCap = capId;
	var itemGroup = null;

	if (arguments.length == 3) {
		itemCap = arguments[2]; // use cap ID specified in args	
	}
   	
	appSpecInfoResult = aa.appSpecificInfo.getAppSpecificInfos(itemCap, itemName);

	if (appSpecInfoResult.getSuccess()) {
		vAppSpecInfoArry = appSpecInfoResult.getOutput();
		for (x in vAppSpecInfoArry) {
			vAppSpecScriptModel = vAppSpecInfoArry[x];
			vAppSpecScriptModel.setAlternativeLabel(itemValue);
		}
		vAppSaveResult = aa.appSpecificInfo.editAppSpecificInfo(vAppSpecInfoArry);
		if (vAppSaveResult.getSuccess()) {
			aa.print('ACA label changed to: ' + itemValue);
		}
		else {
			aa.print('Failed to update the ACA label for ASI field: ' + itemName);
		}
	} 	
	else {
		aa.print( "WARNING: " + itemName + " was not updated."); 
	}
}