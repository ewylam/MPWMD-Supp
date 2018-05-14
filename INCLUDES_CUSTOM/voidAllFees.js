
function voidAllFees(capId) {
	var getFeeResult = aa.fee.getFeeItems(capId,null,"INVOICED");
	if (getFeeResult.getSuccess())
		{
		var feeList = getFeeResult.getOutput();
		for (feeNum in feeList)
			{
			if (feeList[feeNum].getFeeitemStatus().equals("INVOICED"))
				{
				var feeSeq = feeList[feeNum].getFeeSeqNbr();

				var editResult = aa.finance.voidFeeItem(capId, feeSeq);
				if (editResult.getSuccess())
				{
				   logDebug("Voided existing Fee Item: " + feeList[feeNum].getFeeCod());
				}
				else
				{ logDebug( "**ERROR: Voiding fee item (" + feeList[feeNum].getFeeCod() + "): " + editResult.getErrorMessage()); 
				  break;
 			    }
				//Invoice the void creating a "Credit"
				var cfeeSeqArray = new Array();
				   var paymentPeriodArray = new Array();
      			   cfeeSeqArray.push(feeSeq);
				   paymentPeriodArray.push(feeSeq.period);
			  	   var invoiceResult_L = aa.finance.createInvoice(capId, cfeeSeqArray, paymentPeriodArray);
 				   if (!invoiceResult_L.getSuccess())
				   {
					logDebug("**ERROR: Invoicing the fee items voided " + thisFee.code + " was not successful.  Reason: " +  invoiceResult_L.getErrorMessage());
					return false;
				    }
 
					break;  // done with this payment
				}	
			
			if (feeList[feeNum].getFeeitemStatus().equals("VOIDED"))
				{
					var feeSeq = feeList[feeNum].getFeeSeqNbr();
					//Invoice the void creating a "Credit"
					var cfeeSeqArray = new Array();
					var paymentPeriodArray = new Array();
					cfeeSeqArray.push(feeSeq);
					paymentPeriodArray.push(feeSeq.period);
					var invoiceResult_L = aa.finance.createInvoice(capId, cfeeSeqArray, paymentPeriodArray);
					if (!invoiceResult_L.getSuccess())
					{
						logDebug("**ERROR: Invoicing the fee items voided " + thisFee.code + " was not successful.  Reason: " +  invoiceResult_L.getErrorMessage());
						return false;
				    }
 
					break; 
				}	

				
			if (feeList[feeNum].getFeeitemStatus().equals("CREDITED"))
				{
				logDebug("Credited fee "+feeList[feeNum].getFeeCod()+" found, not voided");
				}
			}
		}
	else
		{ logDebug( "**ERROR: getting fee items (" + feeList[feeNum].getFeeCod() + "): " + getFeeResult.getErrorMessage())}
	}
