function doAllContactsHaveEmail(itemCap) {
	vConObjArry = getContactObjsByCap_SEA(itemCap);
	for (x in vConObjArry) {
		vConObj = vConObjArry[x];
		if (vConObj) {
			conEmail = vConObj.people.getEmail();
		}
		if (conEmail && conEmail != ""  ) {
			continue;
		}
		return false;
	}
	return true;
}