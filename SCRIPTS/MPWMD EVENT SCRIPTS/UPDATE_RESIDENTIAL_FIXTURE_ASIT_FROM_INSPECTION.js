//Begin script to get the most recent inspection and update the fixture ASIT from the guidesheet data
if (wfTask == "Conservation" && wfStatus == "Update from Checklist") {
	var vInspectionId;
	var vInspectionGuideSheetObjects;
	var vGuideSheetObject;
	var vGuideSheetObjectASITs;
	var vASIT;
	var vASITRow;
	var vFixtureType;
	var vFixtureCount;
	var vCompleteFixtureArray = [];
	var vHasInspectionFixtures = false;
	var x = 0;
	var y = 0;
	var z = 0;
	var vTableName = "RESIDENTIAL  FIXTURES";
	var vFixtureTable = loadASITable(vTableName);
	var vFixtureExists = false;
	var vPostCount;
	var vExistingCount;
	var vFUV;
	var vPostFixture;
	var vExistingFixture;
	var vStatus;
	var vField;
	var vASITChanges = false;
	var vActualFixtureName;

	// Get the last inspections's ID
	vInspectionId = getLastInspectionId(capId);
	if (vInspectionId != null) {
		// Get inspection's guidesheet objects
		vInspectionGuideSheetObjects = getGuideSheetObjects(vInspectionId);
		x = 0;
		for (x in vInspectionGuideSheetObjects) {
			// Get individual guidesheet item
			vGuideSheetObject = vInspectionGuideSheetObjects[x];
			// Load guidesheet item ASITs
			vGuideSheetObject.loadInfoTables();
			//logDebug("Guidesheet: " + vGuideSheetObject.gsType);
			//logDebug("Guidesheet Item: " + vGuideSheetObject.text);
			if (vGuideSheetObject.validTables == true) {
				vGuideSheetObjectASITs = vGuideSheetObject.infoTables;
				y = 0;
				for (y in vGuideSheetObjectASITs) {
					// Get individual ASIT info
					vASIT = vGuideSheetObjectASITs[y];
					if (vASIT.length > 0) {
						//logDebug("ASIT: " + y);
						//logDebug("ASIT Length: " + vASIT.length);
						z = 0;
						for (z in vASIT) {
							// Get ASIT row
							vASITRow = vASIT[z];
							vFixtureType = vASITRow["Type of Fixture"];
							vFixtureCount = vASITRow["Count"];
							// Add fixture info to master table to be copied back to the records ASIT
							if (vFixtureType != null && vFixtureType != "" && vFixtureCount != null && vFixtureCount != "") {
								vCompleteFixtureArray[vFixtureType] = ((vCompleteFixtureArray[vFixtureType] == 'undefined' || vCompleteFixtureArray[vFixtureType] == null) ? 0 : parseFloat(vCompleteFixtureArray[vFixtureType])) + parseFloat(vFixtureCount);
								vHasInspectionFixtures = true;
							}
						}
					}
				}
			}
		}
	}

	if (vHasInspectionFixtures == true) {
		// Check to see if the Residential Fixture has the fixture from the inspection. If so, then update the post fixture count with the inspection's counts. If not, create it with the inspection's fixture information.
		// Check to see if the ASIT has any exiting values. If not, create empty array to populate the table.
		if (vFixtureTable == "undefined") {
			logDebug(vTableName + " does not exists or is empty.");
			vFixtureTable = [];
			vASITRow = [];
		}

		// Loop through inspection fixtures to see if they exist in the records ASIT
		x = 0;
		for (x in vCompleteFixtureArray) {
			vFixtureExists = false;
			vActualFixtureName = lookup("MP_FixAll", x);
			y = 0;
			for (y in vFixtureTable) {
				vASITRow = vFixtureTable[y];
				vFixtureType = vASITRow["Type of Fixture"];
				// If fixture exists then update the post count with the inspections count.
				if (vFixtureType.fieldValue == vActualFixtureName) {
					logDebug("Updating Post Count for " + vActualFixtureName + " to " + vCompleteFixtureArray[x]);
					vPostCount = vASITRow["Post Count"];
					vPostCount.fieldValue = vCompleteFixtureArray[x] + "";
					vASITChanges = true;
					vFixtureExists = true;
					break;
				}
			}
			// Fixture doesn't already exists in the records ASIT so then add it.
			if (vFixtureExists == false) {
				// Create the ASIT row
				vASITRow = [];
				vFUV = lookup("MP_Type of Fixture", vActualFixtureName) + "";
				vASITRow["Type of Fixture"] = new asiTableValObj("Type of Fixture", vActualFixtureName + "", "N");
				//vASITRow["Existing Count"] = new asiTableValObj("Exiting Count", "", "N");
				vASITRow["Post Count"] = new asiTableValObj("Post Count", vCompleteFixtureArray[x] + "", "N");
				vASITRow["FUV"] = new asiTableValObj("FUV", vFUV, "N");
				//vASITRow["Existing Fixture"] = new asiTableValObj("Exiting Fixture", "", "N");
				//vASITRow["Post Fixture"] = new asiTableValObj("Post Fixture", "", "N");
				vASITRow["Status"] = new asiTableValObj("Status", "Active", "N");
				vFixtureTable.push(vASITRow);
				vASITChanges = true;
			}
		}

		// Loop through the records ASIT and update fixtures not found in the inspection
		x = 0;
		vFixtureExists = false;
		for (x in vFixtureTable) {
			vASITRow = vFixtureTable[x];
			vFixtureType = vASITRow["Type of Fixture"];
			y = 0;
			for (y in vCompleteFixtureArray) {
				if (vFixtureType == y) {
					vFixtureExists = true;
					break;
				}
			}
			// Fixture exists on the record but not the ASIT so update post count to 0 and status = removed.;
			if (vFixtureExists == false) {
				vPostCount = vASITRow["Post Count"];
				vPostCount.fieldValue = "0";
				vStatus = vASITRow["Status"];
				vStatus.fieldValue = "Removed";
				vASITChanges = true;
			}
		}

		// Save updated/new ASIT back to the record
		if (vASITChanges) {
			removeASITable(vTableName, capId);
			addASITable_local(vTableName, vFixtureTable, capId);
		}
	} else {
		logDebug("No fixture infomation on the last inspection.");
	}
}
//End script to get the most recent inspection and update the fixture ASIT from the guidesheet data
