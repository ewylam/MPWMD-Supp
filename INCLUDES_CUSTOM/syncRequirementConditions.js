function syncRequirementConditions() {
	
	capIdString = capId.getID1() + "-" + capId.getID2() + "-" + capId.getID3();

	conditionType = "License Required Documents";
	addConditions = true;
	
	// get documents already uploaded
	submittedDocList = aa.document.getDocumentListByEntity(capIdString,"CAP").getOutput().toArray();
	var uploadedDocs = new Array();
	for (var i in submittedDocList ) uploadedDocs[submittedDocList[i].getDocCategory()] = true;

 
	// remove all conditions without a doc
	
	var capCondResult = aa.capCondition.getCapConditions(capId,conditionType);

	if (capCondResult.getSuccess()) {	
		var ccs = capCondResult.getOutput();
		for (var pc1 in ccs) {
			if(uploadedDocs["" + ccs[pc1].getConditionDescription()] == undefined && ccs[pc1].getConditionStatus() != "Complete") {
				var rmCapCondResult = aa.capCondition.deleteCapCondition(capId,ccs[pc1].getConditionNumber()); 
			}
		}
	}
	
	// get required conditions
				
	r = getRequiredDocuments(false);

	// add conditions to record
	
	if (r.length > 0) {
		for (x in r) {
			dr = r[x].condition;
			if (dr && addConditions && !appHasCondition(conditionType, null, dr, null)) {
				addStdCondition(conditionType, dr);
			}
		}
	}
}