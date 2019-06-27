// Begin script to update JAE record ASIT with water permit info
if (wfTask == "Permit Issuance" && matches(wfStatus, "Issued", "Issued in Zone")) {
	var vJAECapIdArray;
	var vJAECapId;
	var vJAERecordName;
	var vPendingUpdatesTableName;
	var vPengingUpdatesASIT;
	var vASITRow;
	var vUseJurisdiction;
	var vJurisdiction;
	var vUseEntitlement;
	var vEntitlementName;
	var vSubsystemName;
	var vUseWDS;
	var vWDSName;
	var vIssuedDate;
	var vParaltaValue;
	var vPreParaltaValue;
	var vPublicValue;
	var vSubsystemValue;
	var vOtherValue;
	var vEntitlementsValue;
	var vWDSValue;
	var x;

	vJAECapIdArray = [];

	// Find JAE record(s) to update
	// Add Jurisdiction if used
	vUseJurisdiction = getAppSpecific("Use Jurisdiction");
	if (vUseJurisdiction == "CHECKED") {
		vJurisdiction = getAppSpecific("Jurisdiction");
		if (vJurisdiction != null && vJurisdiction != "") {
			vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vJurisdiction);
			if (vJAECapId != null && vJAECapId != "") {
				if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
					vJAECapIdArray.push(vJAECapId);
				}
			}
		}
	}

	// Add Entitlement if used
	vUseEntitlement = getAppSpecific("Use Entitlement");
	if (vUseEntitlement == "CHECKED") {
		vEntitlementName = getAppSpecific("Entitlement Name");
		if (vEntitlementName != null && vEntitlementName != "") {
			vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vEntitlementName);
			if (vJAECapId != null && vJAECapId != "") {
				if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
					vJAECapIdArray.push(vJAECapId);
				}
			}
		}
	}

	// Add Subsystem if used
	vSubsystemValue = getAppSpecific("Subsystem");
	vSubsystemName = getAppSpecific("Subsystem Name");
	if (vSubsystemValue != null && vSubsystemValue != "" && vSubsystemName != null && vSubsystemName != "") {
		vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vSubsystemName);
		if (vJAECapId != null && vJAECapId != "") {
			if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
				vJAECapIdArray.push(vJAECapId);
			}
		}
	}

	// Add WDS if used
	vUseWDS = getAppSpecific("Use WDS");
	if (vUseWDS == "CHECKED") {
		vWDSName = getAppSpecific("Allocation Name");
		if (vWDSName != null && vWDSName != "") {
			vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vWDSName);
			if (vJAECapId != null && vJAECapId != "") {
				if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
					vJAECapIdArray.push(vJAECapId);
				}
			}
		}
	}

	x = 0;
	for (x in vJAECapIdArray) {
		vJAECapId = vJAECapIdArray[x];
		if (vJAECapId != null && vJAECapId != "") {
			// Get JAE records name
			vJAERecordName = getAppName(vJAECapId);

			logDebug("Updating JAE Record: " + vJAECapId.getCustomID() + " " + vJAERecordName);

			// Get Water Permit Values
			vPendingUpdatesTableName = "PENDING UPDATES";
			vIssuedDate = "";
			vParaltaValue = "";
			vPreParaltaValue = "";
			vPublicValue = "";
			vSubsystemValue = "";
			vOtherValue = "";
			vEntitlementsValue = "";
			vWDSValue = "";

			vIssuedDate = getAppSpecific("Issued Date");
			if (vIssuedDate == null) {
				vIssuedDate = "";
			} else {
				vIssuedDate = vIssuedDate + "";
			}

			if (vJAERecordName == vJurisdiction) {
				vParaltaValue = getAppSpecific("Paralta");
				if (vParaltaValue == null) {
					vParaltaValue = "";
				} else {
					vParaltaValue = vParaltaValue + "";
				}
				vPreParaltaValue = getAppSpecific("Pre-Paralta");
				if (vPreParaltaValue == null) {
					vPreParaltaValue = "";
				} else {
					vPreParaltaValue = vPreParaltaValue + "";
				}
				vPublicValue = getAppSpecific("Public");
				if (vPublicValue == null) {
					vPublicValue = "";
				} else {
					vPublicValue = vPublicValue + "";
				}
				vOtherValue = getAppSpecific("Other");
				if (vOtherValue == null) {
					vOtherValue = "";
				} else {
					vOtherValue = vOtherValue + "";
				}
			}

			if (vJAERecordName == vEntitlementName) {
				vEntitlementsValue = getAppSpecific("Entitlements");
				if (vEntitlementsValue == null) {
					vEntitlementsValue = "";
				} else {
					vEntitlementsValue = vEntitlementsValue + "";
				}
			}

			if (vJAERecordName == vSubsystemName) {
				vSubsystemValue = getAppSpecific("Subsystem");
				if (vSubsystemValue == null) {
					vSubsystemValue = "";
				} else {
					vSubsystemValue = vSubsystemValue + "";
				}
			}

			if (vJAERecordName == vWDSName) {
				vWDSValue = getAppSpecific("WDS");
				if (vWDSValue == null) {
					vWDSValue = "";
				} else {
					vWDSValue = vWDSValue + "";
				}
			}

			// Update JAE records 'Pending Updates' ASIT
			// Create ASIT Row info
			vASITRow = [];
			vASITRow["Permit Number"] = new asiTableValObj("Permit Number", capIDString, "Y");
			vASITRow["Issued"] = new asiTableValObj("Issued", vIssuedDate, "Y");
			vASITRow["Paralta"] = new asiTableValObj("Paralta", vParaltaValue, "Y");
			vASITRow["Pre-Paralta"] = new asiTableValObj("Pre - Paralta", vPreParaltaValue, "Y");
			vASITRow["Public"] = new asiTableValObj("Public", vPublicValue, "Y");
			vASITRow["Subsystem"] = new asiTableValObj("Subsystem", vSubsystemValue, "Y");
			vASITRow["Other"] = new asiTableValObj("Other", "" + vOtherValue, "Y");
			vASITRow["Entitlements"] = new asiTableValObj("Entitlements", vEntitlementsValue, "Y");
			vASITRow["WDS"] = new asiTableValObj("WDS", vWDSValue, "Y");

			vPengingUpdatesASIT = loadASITable(vPendingUpdatesTableName, vJAECapId);
			if (typeof(vPengingUpdatesASIT) == "object") {
				// Add new row to ASIT
				vPengingUpdatesASIT.push(vASITRow);
				// Remove and re-add updated table
				removeASITable(vPendingUpdatesTableName, vJAECapId);
				addASITable(vPendingUpdatesTableName, vPengingUpdatesASIT, vJAECapId);
			} else {
				vPengingUpdatesASIT = [];
				// Add new row to ASIT
				vPengingUpdatesASIT.push(vASITRow);
				// Add updated table
				addASITable(vPendingUpdatesTableName, vPengingUpdatesASIT, vJAECapId);
			}
		}
	}
}
// End script to update JAE record ASIT with water permit info
