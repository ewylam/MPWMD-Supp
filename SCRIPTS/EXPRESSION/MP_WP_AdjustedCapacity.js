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
var variable0=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use Entitlement");
var variable1=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use Jurisdiction");
var variable2=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::WDS");
var variable3=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Water Use Credits");
var variable4=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Adjusted Water Use Capacity");
var variable5=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Post 2nd Bath Fixture");
var variable6=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Pre-Paralta");
var variable7=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Paralta");
var variable8=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Other");
var variable9=expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Entitlements");


var totalRowCount = expression.getTotalRowCount();

		if((variable0.value!=null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y') || variable0.value.equalsIgnoreCase('CHECKED') || variable0.value.equalsIgnoreCase('SELECTED') || variable0.value.equalsIgnoreCase('TRUE') || variable0.value.equalsIgnoreCase('ON'))) || (variable1.value!=null && (variable1.value.equalsIgnoreCase('YES') || variable1.value.equalsIgnoreCase('Y') || variable1.value.equalsIgnoreCase('CHECKED') || variable1.value.equalsIgnoreCase('SELECTED') || variable1.value.equalsIgnoreCase('TRUE') || variable1.value.equalsIgnoreCase('ON'))) || variable2.value!=null && variable2.value*1==toPrecision("checked") || (variable3.value!=null && (variable3.value.equalsIgnoreCase('YES') || variable3.value.equalsIgnoreCase('Y') || variable3.value.equalsIgnoreCase('CHECKED') || variable3.value.equalsIgnoreCase('SELECTED') || variable3.value.equalsIgnoreCase('TRUE') || variable3.value.equalsIgnoreCase('ON')))){

			variable4.value=toPrecision((variable5.getValue() * 1 *.001)+variable6.getValue() * 1 +variable7.getValue() * 1 +variable8.getValue() * 1 +variable9.getValue() * 1 );
		expression.setReturn(variable4);
	}
