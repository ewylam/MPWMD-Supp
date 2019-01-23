//base premise will store water consumption data in a table and this expression will update the amount/gallons/acre feet 
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
var meterUnits=expression.getValue("ASIT::WATER CONSUMPTION::Meter Units");
var acreFeet=expression.getValue("ASIT::WATER CONSUMPTION::Acre Feet");
var waterUnits=expression.getValue("ASIT::WATER CONSUMPTION::Water Units");
var gallonUsed=expression.getValue("ASIT::WATER CONSUMPTION::Gallons Used");


var totalRowCount = expression.getTotalRowCount();
for(var rowIndex=0; rowIndex<totalRowCount; rowIndex++){

		meterUnits=expression.getValue(rowIndex, "ASIT::WATER CONSUMPTION::Meter Units");
		waterUnits=expression.getValue(rowIndex, "ASIT::WATER CONSUMPTION::Water Units");
		gallonUsed=expression.getValue(rowIndex, "ASIT::WATER CONSUMPTION::Gallons Used");
		acreFeet=expression.getValue(rowIndex, "ASIT::WATER CONSUMPTION::Acre Feet");
	if(meterUnits.value!=null && meterUnits.value.equals(String("Acre Feet"))){

			acreFeet.value=toPrecision(waterUnits.getValue() * 1 );
		expression.setReturn(rowIndex,acreFeet);

			gallonUsed.value=toPrecision(waterUnits.getValue() * 1 *325851);
		expression.setReturn(rowIndex,gallonUsed);

			acreFeet.readOnly=true;
		expression.setReturn(rowIndex,acreFeet);

			gallonUsed.readOnly=true;
		expression.setReturn(rowIndex,gallonUsed);
	}else if(meterUnits.value!=null && meterUnits.value.equals(String("Gallons"))){

			acreFeet.value=toPrecision(waterUnits.getValue()*1 /325851 );
		expression.setReturn(rowIndex,acreFeet);

			gallonUsed.value=toPrecision(waterUnits.getValue() * 1);
		expression.setReturn(rowIndex,gallonUsed);

			acreFeet.readOnly=true;
		expression.setReturn(rowIndex,acreFeet);

			gallonUsed.readOnly=true;
		expression.setReturn(rowIndex,gallonUsed);
		}
	else if(meterUnits.value!=null && meterUnits.value.equals(String("Cubic Feet"))){

			acreFeet.value=toPrecision(waterUnits.getValue()*1 /0.0000229567 );
		expression.setReturn(rowIndex,acreFeet);

			gallonUsed.value=toPrecision(waterUnits.getValue() * 7.48052);
		expression.setReturn(rowIndex,gallonUsed);

			acreFeet.readOnly=true;
		expression.setReturn(rowIndex,acreFeet);

			gallonUsed.readOnly=true;
		expression.setReturn(rowIndex,gallonUsed);
		}
	}
