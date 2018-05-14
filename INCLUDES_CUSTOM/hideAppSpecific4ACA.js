function hideAppSpecific4ACA(vASIField) {
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
						field.setAttributeValueReqFlag('N');
						field.setVchDispFlag('H');
						logDebug("Updated ASI: " + field.getCheckboxDesc() + " to be ACA not displayable.");
					}
				}
			}
		}
	}
}