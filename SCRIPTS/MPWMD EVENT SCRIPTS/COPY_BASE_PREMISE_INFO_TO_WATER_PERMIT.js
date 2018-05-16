// Begin script that copies data from Base Premise record to Water Use Permit record.
if (parentCapId == "undefined" || parentCapId == null) {
	parentCapId = aa.env.getValue("ParentCapID");
}

if (parentCapId != null) {	
	//Copy Parcels from license to renewal
	copyParcels(parentCapId,capId);
	
	//Copy addresses from license to renewal
	copyAddress(parentCapId,capId);
	
	//copy ASI Info from license to renewal
	copyASIInfo(parentCapId,capId);

	//Copy ASIT from license to renewal
	copyASITables(parentCapId,capId);

	//Copy Contacts from license to renewal
	copyContacts3_0(parentCapId,capId);
	
	//Copy Work Description from license to renewal
	aa.cap.copyCapWorkDesInfo(parentCapId,capId);

	//Copy application name from license to renewal
	editAppName(getAppName(parentCapId),capId);
}
// End script that copies data from Base Premise record to Water Use Permit record.
