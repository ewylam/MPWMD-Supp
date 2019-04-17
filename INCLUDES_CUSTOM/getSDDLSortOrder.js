function getSDDLSortOrder(stdChoice, stdValue) {
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

	if (bizDomScriptResult.getSuccess()) {
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = bizDomScriptObj.getSortOrder();
		logDebug("getSDDLSortOrder(" + stdChoice + "," + stdValue + ") = " + strControl);
	} else {
		logDebug("getSDDLSortOrder(" + stdChoice + "," + stdValue + ") does not exist");
	}
	return strControl;
}
