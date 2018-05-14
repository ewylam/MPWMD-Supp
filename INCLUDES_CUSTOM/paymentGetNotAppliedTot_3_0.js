function paymentGetNotAppliedTot_3_0() {
	//gets total Amount Not Applied on current CAP
	var itemCap = capId;
	if (arguments.length > 0)
		itemCap = arguments[0];

	var amtResult = aa.cashier.getSumNotAllocated(itemCap);
	if (amtResult.getSuccess()) {
		var appliedTot = amtResult.getOutput();
		//logDebug("Total Amount Not Applied = $"+appliedTot.toString());
		return parseFloat(appliedTot);
	} else {
		logDebug("**ERROR: Getting total not applied: " + amtResult.getErrorMessage());
		return false;
	}
	return false;
}
