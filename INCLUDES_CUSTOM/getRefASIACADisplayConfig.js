function getRefASIACADisplayConfig(vASIGroup, vASISubgroup, vASIField) {
	var vASIList = aa.appSpecificInfo.getRefAppSpecInfoWithFieldList(vASIGroup,vASISubgroup,vASIField);
	var x = 0;
	var vASI;
	if (vASIList.getSuccess()) {
		vASIList = vASIList.getOutput().getFieldList().toArray();
		for (x in vASIList) {
			vASI = vASIList[x];
			if (vASI.getDispFieldLabel() == vASIField) {
				return vASI.getVchDispFlag();
			}
		}
	}
	return null;
}