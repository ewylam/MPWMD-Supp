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

var servProvCode=expression.getValue("$$servProvCode$$").value;
var variable0=expression.getValue("ASI::WAIVERS::Number of Meters Requested");
var variable1=expression.getValue("ASIT::METERS::Dir");
var variable2=expression.getValue("ASIT::METERS::FORM");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		variable1=expression.getValue(rowIndex, "ASIT::METERS::Dir");
		variable2=expression.getValue(rowIndex, "ASIT::METERS::FORM");
		if(variable0.value!=totalRowCount){

			variable2.blockSubmit=true;
		expression.setReturn(rowIndex,variable2);

			variable2.message="Please ensure the number of rows in the 'Meters' table matches the 'Number of Meters Requested'.";
		expression.setReturn(rowIndex,variable2);
	}}