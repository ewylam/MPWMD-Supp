function invoiceFeeAllNew(itemCap) {
	//invoices all assessed fees with a status of NEW
	var vFeeSeqList = [];
	var vPaymentPeriodList = [];
	var vFeeList;	
	var vGetFeeResult = new Array();
	var vFeeNum;
	var vFeeSeq;
	var vFperiod
	vGetFeeResult = aa.fee.getFeeItems(itemCap);
	if (vGetFeeResult.getSuccess()) {
		vFeeList = vGetFeeResult.getOutput();
		for (vFeeNum in vFeeList)
			if (vFeeList[vFeeNum].getFeeitemStatus().equals("NEW")) {
				vFeeSeq = vFeeList[vFeeNum].getFeeSeqNbr();
				vFperiod = vFeeList[vFeeNum].getPaymentPeriod();
				vFeeSeqList.push(vFeeSeq);
				vPaymentPeriodList.push(vFperiod);
			}
		vInvoiceResult = aa.finance.createInvoice(itemCap, vFeeSeqList, vPaymentPeriodList);
		if (vInvoiceResult.getSuccess())
			logDebug("Invoicing assessed fee items is successful.");
		else
			logDebug("**ERROR: Invoicing the fee items assessed to app # " + itemCap.getCustomID() + " was not successful.  Reason: " + vInvoiceResult.getErrorMessage());
	}
}