// Begin script to update JAE record ASIT with water use permit info
if (wfTask == "Permit Issuance" && matches(wfStatus, "Issued", "Issued in Zone")) {
	var vJAECapIdArray;
	var vJAECapId;
	var vJAERecordName;
	var vPendingUpdatesTableName;
	var vPengingUpdatesASIT;
	var vASITRow;
	var vJurisdiction;
	var vPendingUpdatesTableName;
	var vParcel;
	var vPurchaser;
	var vQuantity;
	var vAssignmentDate;
	var vWUPIssuedDate;
	var vWUP;
	var x;

	vJAECapIdArray = [];

	// Find JAE record(s) to update
	// Add Jurisdiction if used
	vJurisdiction = getAppSpecific("Entitlement Name");
	if (vJurisdiction != null && vJurisdiction != "") {
		vJAECapId = getJAERecord("Demand", "Master", "JAE", "NA", vJurisdiction);
		if (vJAECapId != null && vJAECapId != "") {
			if (appMatch("Demand/Master/JAE/NA", vJAECapId)) {
				vJAECapIdArray.push(vJAECapId);
			}
		}
	}

	// Update ASIT Entitlement Purchases
	//Update Parcel, Owner, Quantity with (Amount of Water Purchased), Assignment Date with (Assignment Date)

	x = 0;
	for (x in vJAECapIdArray) {
		vJAECapId = vJAECapIdArray[x];
		if (vJAECapId != null && vJAECapId != "") {
			// Get JAE records name
			vJAERecordName = getAppName(vJAECapId);

			logDebug("Updating JAE Record: " + vJAECapId.getCustomID() + " " + vJAERecordName);

			// Get Water Use Permit Values
			vPendingUpdatesTableName = "ENTITLEMENT PURCHASES";
			vParcel = getPrimaryParcel();
			vPurchaser = getOwnersFullName();
			vQuantity = getAppSpecific("Amount of Water Purchased"); ;
			vAssignmentDate = getAppSpecific("Assignment Date"); ;
			vWUPIssuedDate = wfDateMMDDYYYY;
			vWUP = capIDString;

			if (vParcel == null) {
				vParcel = "";
			} else {
				vParcel = vParcel + "";
			}

			if (vPurchaser == null) {
				vPurchaser = "";
			} else {
				vPurchaser = vPurchaser + "";
			}

			if (vQuantity == null) {
				vQuantity = "";
			} else {
				vQuantity = vQuantity + "";
			}

			if (vAssignmentDate == null) {
				vAssignmentDate = "";
			} else {
				vAssignmentDate = vAssignmentDate + "";
			}

			if (vWUPIssuedDate == null) {
				vWUPIssuedDate = "";
			} else {
				vWUPIssuedDate = vWUPIssuedDate + "";
			}

			// Update JAE records 'Entitlements Purchased' ASIT
			// Create ASIT Row info
			vASITRow = [];
			vASITRow["Purchaser Name"] = new asiTableValObj("Purchaser Name", vPurchaser, "Y");
			vASITRow["Quantity"] = new asiTableValObj("Quantity", vQuantity, "Y");
			vASITRow["Assignment Date"] = new asiTableValObj("Assignment Date", vAssignmentDate, "Y");
			vASITRow["WUP Issued"] = new asiTableValObj("WUP Issued", vIssuedDate, "Y");
			vASITRow["WUP"] = new asiTableValObj("WUP", vWUP, "Y");

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
// End script to update JAE record ASIT with water use permit info
