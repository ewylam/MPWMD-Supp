function autoInvoiceVoidedFees() {
	var feeSeqListString = aa.env.getValue("FeeItemsSeqNbrArray");	// invoicing fee item list in string type
	var feeSeqList = [];					// fee item list in number type
	var xx;
	for(xx in feeSeqListString) {
		feeSeqList.push(Number(feeSeqListString[xx])); 	// convert the string type array to number type array
	}

	var paymentPeriodList = [];	// payment periods, system need not this parameter for daily side

	// The fee item should not belong to a POS before set the fee item status to "CREDITED".
	if (feeSeqList.length && !(capStatus == '#POS' && capType == '_PER_GROUP/_PER_TYPE/_PER_SUB_TYPE/_PER_CATEGORY')) {
		// the following method will set the fee item status from 'VOIDED' to 'CREDITED' after void the fee item;
		invoiceResult = aa.finance.createInvoice(capId, feeSeqList, paymentPeriodList);
		if (invoiceResult.getSuccess()) {
			logMessage("Invoicing assessed fee items is successful.");
		}
		else {
			logDebug("ERROR: Invoicing the fee items assessed to app # " + capId + " was not successful.  Reason: " +  invoiceResult.getErrorMessage());
		}
	}
}
