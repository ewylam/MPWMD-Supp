// Begin script to create child meter permits for each row in the meter table
if (wfTask == "Review" && wfStatus == "Approved") {
	var vMeterPermitType = getAppSpecific("Meter Permit Type");
	if (vMeterPermitType == "Meter Split (Individual Meter Use)") {
		var vMetersASIT = loadASITable("METERS");
		var vMeterRow;
		var vStreetNum;
		var vStreetName;
		var vSteetDir;
		var vStreetType;
		var vMeterNumber;
		var x = 0;
		var vChildID;
		var vTmpCapId;
		var addrObj;
		var addrArr;
		var addr;
		for (x in vMetersASIT) {
			vMeterRow = vMetersASIT[x];
			// Create child Meter Permit record for each row in the table
			vChildID = createChild("Demand", "Application", "Waiver", "NA", "");
			// Copy Contacts from child to license
			copyContacts3_0(capId, vChildID);
			// Add address to record
			vStreetNum = vMeterRow["Street Num"].fieldValue;
			vStreetName = vMeterRow["Street Name"].fieldValue;
			vSteetDir = vMeterRow["Dir"].fieldValue;
			vStreetType = vMeterRow["Type"].fieldValue;
			if (vSteetDir == "") {
				vSteetDir = null;
			}
			
			addrObj = aa.address.getAddressListForAdmin(null, null, vStreetNum, null, vSteetDir, vStreetName, vStreetType, null, null, null, null, null, null, null, null, null, null, null, null);
			if (addrObj.getSuccess()) {
				addrArr = addrObj.getOutput();
				if (addrArr != null && addrArr.length > 0) {
					addr = addrArr[0].getRefAddressModel();
					addr.setPrimaryFlag("Y");
					aa.address.createAddressWithRefAddressModel(vChildID, addr);
					// Add Parcel and Owners
					addParcelAndOwnerFromRefAddress(addr, vChildID);
				}
				// Save current capId
				vTmpCapId = capId;
				// Set capId to childId
				capId = vChildID;
				// Add GIS objects
				copyParcelGisObjects();
				capId = vTmpCapId;
			} else {
				logDebug("Failed to get an address based on " + vStreetNum + " " + vSteetDir + " " + vStreetName + " " + vStreetType + ".");
				logDebug(addrObj.getErrorMessage());
			}
			// Save current capId
			var vTmpCapId = capId;
			// Set capId to childId
			capId = vChildID;
			// Update record name
			include("SET_APP_NAME");
			capId = vTmpCapId;
			// Update Meter Number ASI
			vMeterNumber = vMeterRow["Meter Number"].fieldValue;
			editAppSpecific("Meter Number", vMeterNumber, vChildID);
		}
	}
}
// End script to create child meter permits for each row in the meter table
