function moveUnPaidFees(sourceCapId, targetCapId) {
    var vFeesMoved = false;
    var feeSeqArray = new Array();
    var invoiceNbrArray = new Array();
    var feeAllocationArray = new Array();
	var vNewFeeSeq;
    var feeA = loadFees_etw(sourceCapId)

    for (x in feeA) {
        thisFee = feeA[x];
		vNewFeeSeq = null;
        if (thisFee.status == "INVOICED" && thisFee.amountPaid == '0') {
            vNewFeeSeq = addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "N", targetCapId);
			if (vNewFeeSeq != null) {
				updateFeeComment(vNewFeeSeq,"Moved from " + sourceCapId.getCustomID(),targetCapId);
			}
            logDebug("Unpaid invoiced fee: " + thisFee.code + " found on record: " + sourceCapId.getCustomID() + ". New fee created on record: " + targetCapId.getCustomID());
			updateFeeComment(thisFee.sequence,"Moved to " + targetCapId.getCustomID(),sourceCapId);
            //remove fee from source record
            voidRemoveFees(thisFee.code, sourceCapId);
            vFeesMoved = true;
        }
        else if (thisFee.status == "NEW") {
            vNewFeeSeq = addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "N", targetCapId);
			if (vNewFeeSeq != null) {
				updateFeeComment(vNewFeeSeq,"Moved from " + sourceCapId.getCustomID(),targetCapId);
			}
            logDebug("Unpaid new fee: " + thisFee.code + " found on record: " + sourceCapId.getCustomID() + ". New fee created on record: " + targetCapId.getCustomID());
            updateFeeComment(thisFee.sequence,"Moved to " + targetCapId.getCustomID(),sourceCapId);
			//remove fee from source record
            voidRemoveFees(thisFee.code, sourceCapId);
            vFeesMoved = true;
        }
    }
    return vFeesMoved;
}