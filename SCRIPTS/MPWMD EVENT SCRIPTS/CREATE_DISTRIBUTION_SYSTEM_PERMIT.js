// Begin script to create Distribution System Permit record. Also updates shared drop down list for all WDS records.
if (wfTask == "Permit Issuance" && wfStatus == "Issued") {
	var vPermitCapId;
	var vExists;
	var vLookupName = "MP_WaterDistributionSystems";
	var vWDSName;
	
	vWDSName = getAppName(capId);

	vPermitCapId = createParent("Demand", "Master", "Distribution System", "Permit", vWDSName);
	// Copy Parcels from child to license
	copyParcels(capId, vPermitCapId);

	// Copy addresses from child to license
	copyAddress(capId, vPermitCapId);

	// Copy ASI from child to license
	copyASIInfo(capId, vPermitCapId);

	// Copy ASIT from child to license
	copyASITables(capId, vPermitCapId);

	// Copy Contacts from child to license
	copyContacts3_0(capId, vPermitCapId);

	// Copy Work Description from child to license
	aa.cap.copyCapWorkDesInfo(capId, vPermitCapId);

	// Copy application name from child to license
	editAppName(vWDSName, vPermitCapId);

	// Check to see if value exist in shared drop down, if not add it.
	vExists = lookup(vLookupName, vWDSName);
	if (typeof vExists == "undefined") {
		// Adding value, including GEOID as description
		addLookup(vLookupName, vWDSName, vPermitCapId.getCustomID());
	}
}
// End script to create Distribution System Permit record. Also updates shared drop down list for all WDS records.
