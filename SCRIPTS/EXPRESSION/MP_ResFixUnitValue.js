//lookup value of fixture units based on fixture type from shared dropdown list/standard choice
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
var fixType=expression.getValue("ASIT::RESIDENTIAL  FIXTURES::Type of Fixture");
var fuv=expression.getValue("ASIT::RESIDENTIAL  FIXTURES::FUV");

var totalRowCount = expression.getTotalRowCount();
try{
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){
		fixType=expression.getValue(rowIndex, "ASIT::RESIDENTIAL  FIXTURES::FUV");
		fuv=expression.getValue(rowIndex, "ASIT::RESIDENTIAL  FIXTURES::Type of Fixture");
  
    var lookupAmountByFixType = lookupCustom("MP_Type of Fixture", fuv.value.toString());
         
      fixType.value = (lookupAmountByFixType); 
      expression.setReturn(fixType);
      //feeTypeTotal.value = lookupAmountByFixType;
      //expression.setReturn(feeTypeTotal);
     
    }    
  }
catch(err){
  fixType.message="An error occurred in the expression. Please contact the administrator with this error: "+ err.message;
  expression.setReturn(fixType);
}

