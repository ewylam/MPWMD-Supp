//Start Script to add recording fees foe deeds and capacity fee if it exists
if(wfTask == "Review" && wfStatus == "Deed Restriction Required"){
    var feeSched = "MP_RECORDINGFEES";
    var feePeriod = "FINAL";
    var invFee = "Y";
	var capacity = AInfo["Adjusted Water Use Capacity"]
    
    var deedRestTable = loadASITable("DEED RESTRICTIONS");
    
    updateFee("REC_DEED REV", feeSched, feePeriod, 1, invFee);
    updateFee("REC_IMAGING", feeSched, feePeriod, 1, invFee);
    
    if(deedRestTable){
        if(deedRestTable.length > 0)
            updateFee("REC_DEEDPROC", feeSched, feePeriod, deedRestTable.length, invFee);
    }
    
    if(AInfo["Calculate Capacity"] == "CHECKED" && AInfo["Adjusted Water Use Capacity"] != null){
        addFeeWithExtraData("PM_CAPACITY", "MP_PERMIT", feePeriod, 1, invFee, capId, capacity, "", "");
    }
}
//End Script to add fees
