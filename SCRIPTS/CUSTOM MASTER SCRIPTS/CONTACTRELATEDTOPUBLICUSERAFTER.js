try {

	var publicUserModel = aa.env.getValue("PublicUserModel");

	if (publicUserModel != null) {
		var peopleList = publicUserModel.getPeoples();
		var peopleModel = null;

		if (peopleList != null && peopleList.size() > 0) {
			var it = peopleList.iterator();
			while (it.hasNext()) {
				peopleModel = it.next();
				//break;
				var contactType = peopleModel.getContactType();

				if (contactType) {
					var lowerCaseContactType = contactType.toLowerCase();

					if (peopleModel.getContactTypeFlag() == null || (peopleModel.getContactTypeFlag() != null && lowerCaseContactType != peopleModel.getContactTypeFlag())) {
						peopleModel.setContactTypeFlag(lowerCaseContactType);
						var updateReferenceContactResult = aa.people.editPeople(peopleModel);
					}
				}

			}
		}

	}

} catch (err) {
	aa.debug("ContactRelatedToPublicUser Error", err)
}
