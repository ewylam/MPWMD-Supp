function loadFees_etw()  // option CapId
{
    //  load the fees into an array of objects.  Does not
    var itemCap = capId
    if (arguments.length > 0) {
        ltcapidstr = arguments[0]; // use cap ID specified in args
        if (typeof (ltcapidstr) == "string") {
            var ltresult = aa.cap.getCapID(ltcapidstr);
            if (ltresult.getSuccess())
                itemCap = ltresult.getOutput();
            else
            { logMessage("**ERROR: Failed to get cap ID: " + ltcapidstr + " error: " + ltresult.getErrorMessage()); return false; }
        }
        else
            itemCap = ltcapidstr;
    }

    var feeArr = new Array();

    var feeResult = aa.fee.getFeeItems(itemCap);
    if (feeResult.getSuccess())
    { var feeObjArr = feeResult.getOutput(); }
    else
    { logDebug("**ERROR: getting fee items: " + feeResult.getErrorMessage()); return false }

    for (ff in feeObjArr) {
        fFee = feeObjArr[ff];
        var myFee = new Fee();
        var amtPaid = 0;

        var pfResult = aa.finance.getPaymentFeeItems(itemCap, null);
        if (pfResult.getSuccess()) {
            var pfObj = pfResult.getOutput();
            for (ij in pfObj)
                if (fFee.getFeeSeqNbr() == pfObj[ij].getFeeSeqNbr())
                    amtPaid += pfObj[ij].getFeeAllocation()
        }

        myFee.sequence = fFee.getFeeSeqNbr();
        myFee.code = fFee.getFeeCod();
        myFee.description = fFee.getFeeDescription();
        myFee.unit = fFee.getFeeUnit();
        myFee.amount = fFee.getFee();
        myFee.amountPaid = amtPaid;
        if (fFee.getApplyDate()) myFee.applyDate = convertDate(fFee.getApplyDate());
        if (fFee.getEffectDate()) myFee.effectDate = convertDate(fFee.getEffectDate());
        if (fFee.getExpireDate()) myFee.expireDate = convertDate(fFee.getExpireDate());
        myFee.status = fFee.getFeeitemStatus();
        myFee.period = fFee.getPaymentPeriod();
        myFee.display = fFee.getDisplay();
        myFee.accCodeL1 = fFee.getAccCodeL1();
        myFee.accCodeL2 = fFee.getAccCodeL2();
        myFee.accCodeL3 = fFee.getAccCodeL3();
        myFee.formula = fFee.getFormula();
        myFee.udes = fFee.getUdes();
        myFee.UDF1 = fFee.getUdf1();
        myFee.UDF2 = fFee.getUdf2();
        myFee.UDF3 = fFee.getUdf3();
        myFee.UDF4 = fFee.getUdf4();
        myFee.subGroup = fFee.getSubGroup();
        myFee.calcFlag = fFee.getCalcFlag();;
        myFee.calcProc = fFee.getFeeCalcProc();

        var F4Model = fFee.getF4FeeItemModel();
        myFee.sched = F4Model.getFeeSchudle();

        feeArr.push(myFee)
    }

    return feeArr;
}
