function movePartialPaidFees(sourceCapId, targetCapId) {
	var vFeesMoved = false;
	var feeSeqArray = new Array();
	var invoiceNbrArray = new Array();
	var feeAllocationArray = new Array();
	var vNewFeeSeq;

	var feeA = loadFees_etw(sourceCapId)

		for (x in feeA) {
			thisFee = feeA[x];
			if (thisFee.status == "INVOICED" && thisFee.amountPaid != '0' && thisFee.amount != thisFee.amountPaid) {
				vNewFeeSeq = addFee(thisFee.code, thisFee.sched, thisFee.period, thisFee.unit, "Y", targetCapId);
				if (vNewFeeSeq != null) {
					updateFeeComment(vNewFeeSeq, "Moved from " + sourceCapId.getCustomID(), targetCapId);
				}
				logDebug("Partially paid fee: " + thisFee.code + " found on record: " + sourceCapId.getCustomID() + ". New fee created on record: " + targetCapId.getCustomID());
				//Refund Payment for fee
				refundFee(thisFee.sequence, sourceCapId);
				updateFeeComment(thisFee.sequence, "Moved to " + targetCapId.getCustomID(), sourceCapId);
				//remove fee from source record
				voidRemoveFees(thisFee.code, sourceCapId);
				//Move funds and apply payments
				transferApplyFundsToFee(sourceCapId, targetCapId, thisFee.code);
				vFeesMoved = true;
			}
		}
		return vFeesMoved;
}
