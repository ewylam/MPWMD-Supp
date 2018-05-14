function businessOwnersMatchASIT(vCapId) {
	var numberOfOwnersASIT;
	var numberOfOwnerContacts;
	var ownerASIT;

	numberOfOwnersASIT = 0;
	ownerASIT = loadASITable("LIST OF OWNERS",vCapId);
	if (ownerASIT && ownerASIT != null) {
		numberOfOwnersASIT = ownerASIT.length;
	}
	
	//numberOfOwnersASIT = numberOfOwnersASIT + 1; //Owner Applicant
	
	numberOfOwnerContacts = 0;
	conArray = getContactObjsByCap_BCC(vCapId);
	for (var cIndex in conArray) {
		thisContact = conArray[cIndex];
		if (thisContact.type == "Business Owner") {
			numberOfOwnerContacts++;
		}
	}
	
	logDebug("numberOfOwnersASIT: "  + numberOfOwnersASIT);
	logDebug("numberOfOwnerContacts: " + numberOfOwnerContacts);
	
	if (numberOfOwnersASIT == numberOfOwnerContacts) {
		return true;
	}
	return false;
}