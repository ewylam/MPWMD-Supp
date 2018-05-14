function refundFee(vFeeSeqNbr) {
	//
	// Step 1: Unapply payments from the Source
	//

	var itemCap = capId;
	if (arguments.length > 1)
		itemCap = arguments[1];

	var piresult = aa.finance.getPaymentByCapID(itemCap, null).getOutput()

		var feeSeqArray = new Array();
	var invoiceNbrArray = new Array();
	var feeAllocationArray = new Array();

	for (ik in piresult) {
		var thisPay = piresult[ik];
		var pfResult = aa.finance.getPaymentFeeItems(itemCap, null);
		if (pfResult.getSuccess()) {
			var pfObj = pfResult.getOutput();
			for (ij in pfObj)
				if (pfObj[ij].getPaymentSeqNbr() == thisPay.getPaymentSeqNbr() && pfObj[ij].getFeeSeqNbr() == vFeeSeqNbr) {
					feeSeqArray.push(pfObj[ij].getFeeSeqNbr());
					invoiceNbrArray.push(pfObj[ij].getInvoiceNbr());
					feeAllocationArray.push(pfObj[ij].getFeeAllocation());
				}
		}

		if (feeSeqArray.length > 0) {
			z = aa.finance.applyRefund(itemCap, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "FeeStat", "InvStat", "123");
			if (z.getSuccess()) {
				logDebug("Refund applied");
			} else {
				logDebug("Error applying refund " + z.getErrorMessage());
			}
		}
	}
}
