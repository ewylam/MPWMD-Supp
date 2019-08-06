//Begin Script to add rows to DEED RESTRICTIONS table based on custom fields
var vCalculationMethod = getAppSpecific("Calculation Method");
var vPermitType = getAppSpecific("Permit Type");
var vAmendment = getAppSpecific("Amendment");
var asiTable = "DEED RESTRICTIONS";
var rowFieldArray = [];
var fieldRow = aa.util.newHashMap(); ;
var perCat = AInfo["Permit Category"];
var secondBath = AInfo["AF Second Bathroom Protocol"];
if (vAmendment != "Yes") {
if (vPermitType != "Landscape" && vCalculationMethod != null && vCalculationMethod != "") {
	//Scenario A from specs
	if (perCat == "Non-Residential" && !checkTable4Value("DEED RESTRICTIONS", "Form", ["1.0.0 Limitation on Use of Water"])) {
		fieldRow = aa.util.newHashMap();
		fieldRow.put("Form", "1.0.0 Limitation on Use of Water");
		fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.0.0 Limitation on Use of Water"));
		rowFieldArray.push(fieldRow);
	}

	//Scenario B, C, D
	if (perCat == "Residential") {
		//B
		if (secondBath != "CHECKED" && checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture", ["Toilet, UHET", "Dishwasher, HE (opt. sink)", "Clothes Washer, (HEW) 5.0", "Instant Access Hot Water"]) && !checkTable4Value("DEED RESTRICTIONS", "Form", ["1.1.0 Special Fixtures"])) {
			fieldRow = aa.util.newHashMap();
			fieldRow.put("Form", "1.1.0 Special Fixtures");
			fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.1.0 Special Fixtures"));
			rowFieldArray.push(fieldRow);
		}
		//C
		if (secondBath == "CHECKED" && checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture", ["Toilet, UHET", "Dishwasher, HE (opt. sink)"]) && !checkTable4Value("DEED RESTRICTIONS", "Form", ["1.4.1 2nd Bath Special Fixtures"])) {
			fieldRow = aa.util.newHashMap();
			fieldRow.put("Form", "1.4.1 2nd Bath Special Fixtures");
			fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.4.1 2nd Bath Special Fixtures"));
			rowFieldArray.push(fieldRow);
		}
		//D
		if (secondBath == "CHECKED" && !checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture", ["Toilet, UHET", "Dishwasher, HE (opt. sink)"]) && !checkTable4Value("DEED RESTRICTIONS", "Form", ["1.4.0 2nd Bathroom Addition"])) {
			fieldRow = aa.util.newHashMap();
			fieldRow.put("Form", "1.4.0 2nd Bathroom Addition");
			fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.4.0 2nd Bathroom Addition"));
			rowFieldArray.push(fieldRow);
		}
	}

	//Scenario F
	if (checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture", ["Swim Pool (each 100 sq-ft)"]) && !checkTable4Value("DEED RESTRICTIONS", "Form", ["1.5.0 Abandonment of Use of Swimming Pool"])) {
		var thisTable = loadASITable("RESIDENTIAL  FIXTURES");
		for (jj in thisTable) {
			var thisRow = thisTable[jj];
			if (thisRow["Type of Fixture"] == "Swim Pool (each 100 sq-ft)") {
				if (parseInt(thisRow["Existing Count"]) > 0 && parseInt(thisRow["Post Count"]) == 0) {
					fieldRow = aa.util.newHashMap();
					fieldRow.put("Form", "1.5.0 Abandonment of Use of Swimming Pool");
					fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.5.0 Abandonment of Use of Swimming Pool"));
					rowFieldArray.push(fieldRow);
					break;
				}
			}
		}
	}

	//Scenario 2A
	if (getContactByType('Tenant', capId) && perCat == "Non-Residential" && !checkTable4Value("DEED RESTRICTIONS", "Form", ["2.2.1 Public Access with Tenants"])) {
		fieldRow = aa.util.newHashMap();
		fieldRow.put("Form", "2.2.1 Public Access with Tenants");
		fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "2.2.1 Public Access with Tenants"));
		rowFieldArray.push(fieldRow);
	} else if (!checkTable4Value("DEED RESTRICTIONS", "Form", ["2.2.0 Public Access"])) {
		logDebug("Adding 2.2.0 Public Access" + !checkTable4Value("DEED RESTRICTIONS", "Form", ["2.2.0 Public Access"]));
		fieldRow = aa.util.newHashMap();
		fieldRow.put("Form", "2.2.0 Public Access");
		fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "2.2.0 Public Access"));
		rowFieldArray.push(fieldRow);
	}
} else if (vPermitType == "Landscape") {
	//Scenario E
	if (AInfo["Landscape Included"] == "Yes" && !checkTable4Value("DEED RESTRICTIONS", "Form", ["1.9.0 Landscape Limitation"])) {
		fieldRow = aa.util.newHashMap();
		fieldRow.put("Form", "1.9.0 Landscape Limitation");
		fieldRow.put("Pages", lookup("MP_Deed Restriction Name", "1.9.0 Landscape Limitation"));
		rowFieldArray.push(fieldRow);
	}
}
if (rowFieldArray.length > 0) {
	logDebug("Adding Rows to table " + asiTable);
	addAppSpecificTableInfors(asiTable, capId, rowFieldArray);
}
}
