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

var servProvCode = expression.getValue("$$servProvCode$$").value;
var vUseEntitlement = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use Entitlement");
var vUseJurisdiction = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use Jurisdiction");
var vUse2ndBath = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::AF Second Bathroom Protocol");
var vWDS = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Use WDS");
var vWDValue = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::WDS");
var vWaterUseCreditis = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Water Use Credits");
var vAdjWaterUseCapacity = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Adjusted Water Use Capacity");
var vPost2ndBath = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Post 2nd Bath Fixture");
var vPreParalta = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Pre-Paralta");
var vParalta = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Paralta");
var vOther = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Other");
var vEntitlements = expression.getValue("ASI::AUTHORIZATION FOR WATER PERMIT::Entitlements");
var vEndingAdjustedWaterCapacity = 0;

var totalRowCount = expression.getTotalRowCount();

if (vUseJurisdiction.value.equalsIgnoreCase('CHECKED')) {
	vEndingAdjustedWaterCapacity += toPrecision(vParalta.value) + toPrecision(vPreParalta.value) + toPrecision(vOther.value);
}

if (vUseEntitlement.value.equalsIgnoreCase('CHECKED')) {
	vEndingAdjustedWaterCapacity += toPrecision(vEntitlements.value);
}

if (vWDS.value.equalsIgnoreCase('CHECKED')) {
	vEndingAdjustedWaterCapacity += toPrecision(vWDValue.value);
}

// Get Add2ndBath
if (vWDS.value.equalsIgnoreCase('CHECKED')) {
	vEndingAdjustedWaterCapacity += (toPrecision(vPost2ndBath.value) * .1)
}

vAdjWaterUseCapacity.value = toPrecision(vEndingAdjustedWaterCapacity);
expression.setReturn(vAdjWaterUseCapacity);
