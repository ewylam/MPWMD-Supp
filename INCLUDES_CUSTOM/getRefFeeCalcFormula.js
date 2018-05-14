function getRefFeeCalcFormula(feeCode,fsched) {
	var arrFeesResult = aa.finance.getFeeItemList(null,fsched,null);
	var arrFees;
	var fCode;
	var vFeeFormula;
	var xx;
	if (arrFeesResult.getSuccess()) {
		arrFees = arrFeesResult.getOutput();
		for (xx in arrFees) {
			fCode = arrFees[xx].getFeeCod();
			if (fCode.equals(feeCode)) {
				vFeeFormula = arrFees[xx].getFormula();
				return vFeeFormula;
			}
		}
	}
	else { 
		logDebug("Error getting fee schedule " + arrFeesResult.getErrorMessage());
		return null;
	}
}