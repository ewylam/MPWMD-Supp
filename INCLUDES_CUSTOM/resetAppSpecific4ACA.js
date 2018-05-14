function resetAppSpecific4ACA(vASIField) {
	// uses capModel in this event
	var capASI = cap.getAppSpecificInfoGroups();
	if (!capASI) {
		logDebug("No ASI for the CapModel");
	} else {
		var i = cap.getAppSpecificInfoGroups().iterator();
		while (i.hasNext()) {
			var group = i.next();
			var fields = group.getFields();
			if (fields != null) {
				var iteFields = fields.iterator();
				while (iteFields.hasNext()) {
					var field = iteFields.next();
					if (field.getCheckboxDesc() == vASIField) {
						//get reference ASI configuration
						var vDisp = getRefASIACADisplayConfig(field.getGroupCode(), field.getCheckboxType(), field.getCheckboxDesc());
						if (vDisp != null) {
							field.setVchDispFlag(vDisp);
						}
						var vReq = getRefASIReqFlag(field.getGroupCode(), field.getCheckboxType(), field.getCheckboxDesc());
						if (vReq != null) {
							field.setAttributeValueReqFlag(vReq);
						}
						logDebug("Reset ASI: " + field.getCheckboxDesc() + " to reference configuration for ACA display and required.");
					}
				}
			}
		}
	}
}