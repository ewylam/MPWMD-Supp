// Begin script to add checklists based on ASI selections
var vApartment = getAppSpecific("Apartment");
var vADU = getAppSpecific("ADU");
var vBarn = getAppSpecific("Barn");
var vSFD = getAppSpecific("SFD");
var vCondo = getAppSpecific("Condo");
var vCaretaker = getAppSpecific("Caretaker");
var vGuesthouse = getAppSpecific("Guest house");
var vStudio = getAppSpecific("Studio");

if (vApartment == 'CHECKED') {
	addGuideSheet(capId,inspectionId,"Apartment");
}	
if (vADU == 'CHECKED') {
	addGuideSheet(capId,inspId,"ADU");
}
if (vBarn == 'CHECKED') {
	addGuideSheet(capId,inspId,"Barn");
}
if (vSFD == 'CHECKED') {
	addGuideSheet(capId,inspId,"SFD");
}
if (vCondo == 'CHECKED') {
	addGuideSheet(capId,inspId,"Condo");
}
if (vCaretaker == 'CHECKED') {
	addGuideSheet(capId,inspId,"Caretaker");
}
if (vGuesthouse == 'CHECKED') {
	addGuideSheet(capId,inspId,"Guest house");
}
if (vStudio == 'CHECKED') {
	addGuideSheet(capId,inspId,"Studio");
}
// End script to add checklists based on ASI selections
