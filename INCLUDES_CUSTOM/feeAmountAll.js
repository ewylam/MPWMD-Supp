function feeAmountAll(checkCapId) {
	/*---------------------------------------------------------------------------------------------------------/
	| Function Intent:
	| This function will return the total fee amount for all the fees on the record provided. If optional
	| status are provided then it will only return the fee amounts having at status in the lists.
	|
	| Returns:
	| Outcome  Description   Return  Type
	| Success: Total fee amount  feeTotal Numeric
	| Failure: Error    False  False
	|
	| Call Example:
	| feeAmountAll(capId,"NEW");
	|
	| 05/15/2012 - Ewylam
	| Version 1 Created
	|
	| Required paramaters in order:
	| checkCapId - capId model of the record
	|
	/----------------------------------------------------------------------------------------------------------*/

	// optional statuses to check for (SR5082)
	var checkStatus = false;
	var statusArray = new Array();

	//get optional arguments
	if (arguments.length > 1) {
		checkStatus = true;
		for (var i = 1; i < arguments.length; i++)
			statusArray.push(arguments[i]);
	}

	var feeTotal = 0;
	var feeResult = aa.fee.getFeeItems(checkCapId);
	if (feeResult.getSuccess()) {
		var feeObjArr = feeResult.getOutput();
	} else {
		logDebug("**ERROR: getting fee items: " + capContResult.getErrorMessage());
		return false;
	}

	for (ff in feeObjArr) {
		if (!checkStatus || exists(feeObjArr[ff].getFeeitemStatus(), statusArray)) {
			feeTotal += feeObjArr[ff].getFee();
		}
	}
	return feeTotal;
}
