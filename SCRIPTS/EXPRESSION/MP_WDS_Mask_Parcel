var toPrecision = function (value) {
	var multiplier = 10000;
	return Math.round(value * multiplier) / multiplier;
}
function addDate(iDate, nDays) {
	if (isNaN(nDays)) {
		throw ("Day is a invalid number!");
	}
	return expression.addDate(iDate, parseInt(nDays));
}

function diffDate(iDate1, iDate2) {
	return expression.diffDate(iDate1, iDate2);
}

function parseDate(dateString) {
	return expression.parseDate(dateString);
}

function formatDate(dateString, pattern) {
	if (dateString == null || dateString == '') {
		return '';
	}
	return expression.formatDate(dateString, pattern);
}

//custom function used to format provide a parcel mask
function formatNumberWithParcelMask(val) {

	//set regex pattern for mask
	var pattern;
	pattern = /\B(?=(\d{3})+(?!\d))/g; //add commas to number

	if (val == null || val == '') {
		return '';
	}

	var strVal = new String(val.toString());
	var cleanVal = strVal.replace(/-/g, ""); //remove - before masking
	var maskedVal = cleanVal.replace(pattern, "-")

		return maskedVal;
}

var servProvCode = expression.getValue("$$servProvCode$$").value;
var variable0 = expression.getValue("ASIT::PARCELS SERVED::Parcel");
var rowIndex = expression.getTotalRowCount() - 1;
var totalRowCount = expression.getTotalRowCount();
var maskParcel;

for (var rowIndex = 0; rowIndex < totalRowCount; rowIndex++) {
	variable0 = expression.getValue(rowIndex, "ASIT::PARCELS SERVED::Parcel");
	maskParcel = formatNumberWithParcelMask(variable0.value);
	variable0.value = maskParcel;
	expression.setReturn(rowIndex, variable0);
}
