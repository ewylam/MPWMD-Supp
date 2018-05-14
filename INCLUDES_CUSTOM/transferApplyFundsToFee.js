function transferApplyFundsToFee(sourceCapId, targetCapId, vTargetFeeCode) {
	//
	// Step 1: transfer the funds from Source to Target
	//

	var unapplied = paymentGetNotAppliedTot_3_0(sourceCapId);

	var xferResult = aa.finance.makeFundTransfer(sourceCapId, targetCapId, currentUserID, "", "", sysDate, sysDate, "", sysDate, unapplied, "NA", "Fund Transfer", "NA", "R", null, "", "NA", "");
	if (xferResult.getSuccess())
		logDebug("Successfully did fund transfer to : " + targetCapId.getCustomID());
	else
		logDebug("**ERROR: doing fund transfer to (" + targetCapId.getCustomID() + "): " + xferResult.getErrorMessage());

	//
	// Step 2: On the target, loop through payments then invoices to auto-apply
	//

	var piresult = aa.finance.getPaymentByCapID(targetCapId, null).getOutput()

		for (ik in piresult) {
			var feeSeqArray = new Array();
			var invoiceNbrArray = new Array();
			var feeAllocationArray = new Array();

			var thisPay = piresult[ik];
			var applyAmt = 0;
			var unallocatedAmt = thisPay.getAmountNotAllocated()

				if (unallocatedAmt > 0) {

					var invArray = aa.finance.getInvoiceByCapID(targetCapId, null).getOutput()

						for (var invCount in invArray) {
							var thisInvoice = invArray[invCount];
							var balDue = thisInvoice.getInvoiceModel().getBalanceDue();
							if (balDue > 0) {
								feeT = aa.invoice.getFeeItemInvoiceByInvoiceNbr(thisInvoice.getInvNbr()).getOutput();

								for (targetFeeNum in feeT) {
									var thisTFee = feeT[targetFeeNum];

									if (thisTFee.getFeeCode() != vTargetFeeCode) {
										continue;
									}

									if (thisTFee.getFee() > unallocatedAmt)
										applyAmt = unallocatedAmt;
									else
										applyAmt = thisTFee.getFee(); // use balance here?

									unallocatedAmt = unallocatedAmt - applyAmt;

									feeSeqArray.push(thisTFee.getFeeSeqNbr());
									invoiceNbrArray.push(thisInvoice.getInvNbr());
									feeAllocationArray.push(applyAmt);
								}
							}
						}

						applyResult = aa.finance.applyPayment(targetCapId, thisPay, feeSeqArray, invoiceNbrArray, feeAllocationArray, "PAYSTAT", "INVSTAT", "123");

					if (applyResult.getSuccess())
						logDebug("Successfully applied payment to fee: " + vTargetFeeCode);
					else
						logDebug("**ERROR: applying payment to fee (" + vTargetFeeCode + "): " + applyResult.getErrorMessage());

				}
		}
}
