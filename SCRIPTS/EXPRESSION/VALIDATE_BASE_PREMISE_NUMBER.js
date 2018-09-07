var msg = "";
var aa = expression.getScriptRoot();

var vBaseCap = null;

var vBaseNumberObj = expression.getValue("ASI::WATER PERMIT INFORMATION::Base Premise Number");
var thisForm = expression.getValue("ASI::FORM");
var vBaseNumber = trim(vBaseNumberObj.value);

// only blocked if there is data.   associated forms will not have data - removed defect 1596
// if (vBaseNumber && vBaseNumber != "") {
vBaseCap = aa.cap.getCapID(vBaseNumber).getOutput();

try {
	if (!vBaseCap) {
		msg = "Invalid Base Premise Number, please try again";
		thisForm.blockSubmit = true;
	} else {
		if (!appMatch("Demand/Master/Base Premise/NA", vBaseCap)) {
			msg = "Invalid Base Premise Number, please try again";
			thisForm.blockSubmit = true;
		} else {
			if (vBaseNumber.substr(2, 3).equals("TMP") || vBaseNumber.substr(2, 3).equals("EST")) {
				msg = "The Base Premise record has not yet been submitted";
				thisForm.blockSubmit = true;
			} else {
				msg = "Base Premise Number Verified, Type: " + aa.cap.getCap(vBaseCap).getOutput().getCapType().getAlias();
				thisForm.blockSubmit = false;
			}

		}
	}
} catch (err) {
	thisForm.message = err.message;
}

vBaseNumberObj.message = msg;
expression.setReturn(vBaseNumberObj);
expression.setReturn(thisForm);

function appMatch(ats, matchCapId) // optional capId or CapID string
{
	if (!matchCapId) {
		return false;
	}

	matchCap = aa.cap.getCap(matchCapId).getOutput();

	if (!matchCap) {
		return false;
	}

	matchArray = matchCap.getCapType().toString().split("/");

	var isMatch = true;
	var ata = ats.split("/");
	for (xx in ata)
		if (!ata[xx].equals(matchArray[xx]) && !ata[xx].equals("*"))
			isMatch = false;

	return isMatch;
}

function trim(strText) {
	return (String(strText).replace(/^\s+|\s+$/g, ''));
}
