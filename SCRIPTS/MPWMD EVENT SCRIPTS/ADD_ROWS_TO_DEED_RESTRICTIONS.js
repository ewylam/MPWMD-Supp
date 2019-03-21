//Begin Script to add rows to DEED RESTRICTIONS table based on custom fields
if(wfTask == "Application Received" && wfStatus == "Accepted"){
    var asiTable = "DEED RESTRICTIONS";
    var perCat = AInfo["Permit Category"];
    var secondBath = AInfo["AF Second Bathroom Protocol"];
    var rowFieldArray = [];

    //Scenario A from specs
    if(perCat == "Non-Residential"){
        var fieldRow = aa.util.newHashMap();
        fieldRow.put("Form", "1.0.0 Limitation on Use of Water");
        rowFieldArray.push(fieldRow);
    }
    
    //Scenario B, C, D
    if(perCat == "Residential"){
        //B
        if(secondBath != "CHECKED" && checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture",
                                                       ["Toilet, Ultra High Efficiency (UHET)",
                                                        "Dishwasher, High Efficiency (with opt. sink)", "Clothes Washer, (HEW) 5.0 water factor or less",
                                                        "Instant Access Hot Water"])){
            var fieldRow = aa.util.newHashMap();
            fieldRow.put("Form", "1.1.0 Special Fixtures");
            rowFieldArray.push(fieldRow);
        }
        //C
        if(secondBath == "CHECKED" && checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture",
                                                       ["Toilet, Ultra High Efficiency (UHET)", "Dishwasher, High Efficiency (with opt. sink)"])){
            var fieldRow = aa.util.newHashMap();
            fieldRow.put("Form", "1.4.1 2nd Bath Special Fixtures");
            rowFieldArray.push(fieldRow);
        }
        //D
        if(secondBath == "CHECKED" && !checkTable4Value("RESIDENTIAL  FIXTURES", "Type of Fixture",
                                                       ["Toilet, Ultra High Efficiency (UHET)", "Dishwasher, High Efficiency (with opt. sink)"])){
            var fieldRow = aa.util.newHashMap();
            fieldRow.put("Form", "1.4.0 2nd Bathroom Addition");
            rowFieldArray.push(fieldRow);
        }
    }
    //Scenario E
    if(AInfo["Landscape Included"] == "Yes"){
        var fieldRow = aa.util.newHashMap();
        fieldRow.put("Form", "1.9.0 Landscape Limitation");
        rowFieldArray.push(fieldRow);
    }
    
    //Scenario F
    if(checkTable4Value("RESIDENTIAL FIXTURES", "Type of Fixture", ["Swimming Pool (each 100 sq-ft of pool surface)"])){
        var thisTable = loadASITable("RESIDENTIAL FIXTURES");
        for(jj in thisTable){
            var thisRow = thisTable[jj];
            if(thisRow["Type of Fixture"] == "Swimming Pool (each 100 sq-ft of pool surface)"){
                if(parseInt(thisRow["Existing Count"]) > 0 && parseInt(thisRow["Post Count"]) == 0){
                    var fieldRow = aa.util.newHashMap();
                    fieldRow.put("Form", "1.5.0 Abandonment of Use of Swimming Pool");
                    rowFieldArray.push(fieldRow);
                    break;
                }
            }
        }
    }
    
    //Scenario 2A
    if(getContactByType('Tenant', capId) && perCat == "Non-Residential"){
        var fieldRow = aa.util.newHashMap();
        fieldRow.put("Form", "2.2.1 Public Access with Tenants");
        rowFieldArray.push(fieldRow);
    }
    else{
        var fieldRow = aa.util.newHashMap();
        fieldRow.put("Form", "2.2.0 Public Access");
        rowFieldArray.push(fieldRow);
    }
    
    if(rowFieldArray.length > 0){
        logDebug("Adding Rows to table " + asiTable);
        addAppSpecificTableInfors(asiTable, capId, rowFieldArray);
    }
}

function checkTable4Value(tName, colName, arrayValue){
    var custList = loadASITable(tName);

    if(custList){
        if(custList.length > 0){
            for(eachRow in custList){
                var aRow = custList[eachRow];
                if(exists(aRow[colName], arrayValue)) return true;
            }
        }
    }
    
    return false;
}
