function getLastInspectionId(vCapId) {
	if (vCapId == null || vCapId == "") {
		vCapId = capId;
	}
	var vInspectionResults = aa.inspection.getInspections(vCapId);
	var vInspectionStatusDate;
	var vLastInspectionStatusDate;
	var vLastInspectionId;
	var vLastInspectionType;
	var vInspection;
	var x = 0;
	if (vInspectionResults.getSuccess()) {
		vInspectionResults = vInspectionResults.getOutput();
		for (x in vInspectionResults) {
			vInspection = vInspectionResults[x];
			vInspectionStatusDate = new Date(vInspection.getInspectionStatusDate().getMonth() + "/" + vInspection.getInspectionStatusDate().getDayOfMonth() + "/" + vInspection.getInspectionStatusDate().getYear());
			if (vLastInspectionStatusDate == null) {
				vLastInspectionStatusDate = vInspectionStatusDate;
				vLastInspectionType = vInspection.getInspectionType();
				vLastInspectionId = vInspection.getIdNumber();
			} else if (vInspectionStatusDate > vLastInspectionStatusDate) {
				vLastInspectionStatusDate = vInspectionStatusDate;
				vLastInspectionType = vInspection.getInspectionType();
				vLastInspectionId = vInspection.getIdNumber();
			}
		}
	}
	logDebug(vLastInspectionType + " : " + vLastInspectionStatusDate + " : " + vLastInspectionId);
	return vLastInspectionId;
}
