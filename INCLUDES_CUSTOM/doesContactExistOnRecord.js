function doesContactExistOnRecord(cSeqNum, itemCap) {
	var contactArr = getContactObjsByCap_BCC(itemCap);
	for (var cIndex in contactArr) {
		var thisContact = contactArr[cIndex];
		if (thisContact.type == "Business Owner") {
			var refContactSeqNum = thisContact.refSeqNumber;
			if (refContactSeqNum == cSeqNum) {
				return true;
			}
		}
	}
	return false;	
}