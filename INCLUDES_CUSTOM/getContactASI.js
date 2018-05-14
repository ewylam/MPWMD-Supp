function getContactASI(cContact, asiName) {
	try {
		peopleModel = cContact.getPeople();
		peopleTemplate = peopleModel.getTemplate();
		if (peopleTemplate == null) return null;
		var templateGroups = peopleTemplate.getTemplateForms(); //ArrayList
		var gArray = new Array(); 
		if (!(templateGroups == null || templateGroups.size() == 0)) {
			thisGroup = templateGroups.get(0);
			var subGroups = templateGroups.get(0).getSubgroups();
			for (var subGroupIndex = 0; subGroupIndex < subGroups.size(); subGroupIndex++) {
				var subGroup = subGroups.get(subGroupIndex);
				var fArray = new Array();
				var fields = subGroup.getFields();
				for (var fieldIndex = 0; fieldIndex < fields.size(); fieldIndex++) {
					var field = fields.get(fieldIndex);
					fArray[field.getDisplayFieldName()] = field.getDefaultValue();
					if(field.getDisplayFieldName().toString().toUpperCase()==asiName.toString().toUpperCase()) {
						return field.getChecklistComment();
					}
				}
			}
		}
	}
	catch (err) { logDebug(err);}
	return null;
}
