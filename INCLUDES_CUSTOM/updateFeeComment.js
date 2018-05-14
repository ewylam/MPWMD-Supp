function updateFeeComment(vFeeSeq, vComment) {
	var feeSeq = null;
	var itemCap = capId;
	if (arguments.length > 2) {
		itemCap = arguments[2];
	}
	var getFeeResult = aa.fee.editFeeNotes(itemCap, vComment, vFeeSeq);

	if (getFeeResult.getSuccess()) {
		return true;
	} else {
		return false;
	}
}
