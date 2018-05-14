function editContactASI(cContact, asiName, asiValue) {
	peopleModel = cContact.getPeople();
	peopleTemplate = peopleModel.getTemplate();
	if (peopleTemplate == null) return;
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
					field.setDefaultValue(asiValue);
					fields.set(fieldIndex, field);  //set the field in the ArrayList of fields
					subGroup.setFields(fields);	
					subGroups.set(subGroupIndex, subGroup);
					thisGroup.setSubgroups(subGroups);
					templateGroups.set(0, thisGroup);
					peopleTemplate.setTemplateForms(templateGroups);
					peopleModel.setTemplate(peopleTemplate);
					cContact.setPeople(peopleModel);
					editResult = aa.people.editCapContact(cContact.getCapContactModel());
					if (editResult.getSuccess()) 
						logDebug("Successfully edited the contact ASI");
				}
			}
		}
	}
}