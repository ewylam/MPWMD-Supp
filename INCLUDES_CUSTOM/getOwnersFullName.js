function getOwnersFullName() {
	var vOwners = aa.owner.getOwnerByCapId(capId);
	var x = 0;
	if (vOwners.getSuccess()) {
		vOwners = vOwners.getOutput();
		// assume only one
		return vOwners[0].getOwnerFullName();
	}
	return null
}
