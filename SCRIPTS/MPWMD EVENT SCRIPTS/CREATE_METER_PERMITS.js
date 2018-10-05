// Begin script to create child meter permits for each row in the meter table
if (wfTask == "Plan Review" && wfStatus == "Approved") {
	var vMeterPermitType = getAppSpecific("Meter Permit Type");
	if (vMeterPermitType == "Meter Split (Individual Meter Use)") {
		var vMetersASIT = loadASITable("METERS");
		var vMeterRow;
		var vStreetNum;
		var vStreetName;
		var vSteetDir;
		var vStreetType;
		var x = 0;
		var vChildID;
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
			var addrObj = aa.address.getAddressListForAdmin(null, null, vStreetNum, null, vSteetDir, vStreetName, vStreetType, null, null, null, null, null, null, null, null, null, null, null, null);
			if (addrObj.getSuccess()) {
				var addrArr = addrObj.getOutput();
				if (addrArr != null && addrArr.length > 0) {
					var addr = addrArr[0].getRefAddressModel();
					addr.setPrimaryFlag("Y");
					aa.address.createAddressWithRefAddressModel(vChildID, addr);
					// Add Parcel and Owners
					addParcelAndOwnerFromRefAddress(addr, vChildID);
					// Save current capId
					var vTmpCapId = capId;
					// Set capId to childId
					capId = vChildID;
					// Add GIS objects
					copyParcelGisObjects();
					// Update record name
					include("SET_APP_NAME");
					capId = vTmpCapId;
				}
			}
		}
	}
}
// End script to create child meter permits for each row in the meter table
