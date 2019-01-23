var aa = expression.getScriptRoot();
var toPrecision=function(value){
  var multiplier=10000;
  return Math.round(value*multiplier)/multiplier;
}
function addDate(iDate, nDays){ 
               if(isNaN(nDays)){
                              throw("Day is a invalid number!");
               }
               return expression.addDate(iDate,parseInt(nDays));
}

function diffDate(iDate1,iDate2){
               return expression.diffDate(iDate1,iDate2);
}

function parseDate(dateString){
               return expression.parseDate(dateString);
}

function formatDate(dateString,pattern){ 
               if(dateString==null||dateString==''){
                              return '';
               }
               return expression.formatDate(dateString,pattern);
}

function lookupCustom(stdChoice, stdValue) {
    var strControl;
    var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);

    if (bizDomScriptResult.getSuccess()) {
        var bizDomScriptObj = bizDomScriptResult.getOutput();
        var strControl = "" + bizDomScriptObj.getDescription(); 
        //logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
    }
    else {
        //logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
    }
    return strControl;
}

var servProvCode=expression.getValue("$$servProvCode$$").value;
var device=expression.getValue("ASIT::RESIDENTIAL REBATES::Type of Device");
var rebAmount=expression.getValue("ASIT::RESIDENTIAL REBATES::Amount");
var qty=expression.getValue("ASIT::RESIDENTIAL REBATES::Quantity");
var maxAllowed=expression.getValue("ASIT::RESIDENTIAL REBATES::Max Allowed");

var totalRowCount = expression.getTotalRowCount();
try{
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		rebAmount=expression.getValue(rowIndex, "ASIT::RESIDENTIAL REBATES::Amount");
		device=expression.getValue(rowIndex, "ASIT::RESIDENTIAL REBATES::Type of Device");
		var lookupAmountByDevice = lookupCustom ("MP_RES_REBATES", device.value.toString());
		rebAmount.value =(lookupAmountByDevice);
		expression.setReturn(rowIndex,rebAmount);
		
		maxAllowed.value=toPrecision(qty.getValue() * 1 *rebAmount.getValue() * 1 );
		expression.setReturn(rowIndex,maxAllowed);
		
	}
  
  }
catch(err){
  fixType.message="An error occurred in the expression. Please contact the administrator with this error: "+ err.message;
  expression.setReturn(fixType);
}
