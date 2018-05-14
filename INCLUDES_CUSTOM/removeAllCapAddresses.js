function removeAllCapAddresses(vCapId) {
	var vAddresses;
	var x = 0;
	var vAddress;
	var vRemove;
	
	// Get Records Addresses
	vAddresses = aa.address.getAddressByCapId(vCapId);
	if (vAddresses.getSuccess()) {
		vAddresses = vAddresses.getOutput();
		for (x in vAddresses) {
			vAddress = vAddresses[x];
			// Remove Address
			vRemove = aa.address.removeAddress(vCapId, vAddress.getAddressId());
			if (vRemove.getSuccess()) {
				logDebug("Removed address " + vAddress.getAddressId() + " from record " + vCapId.getCustomID());
			}
			else {
				logDebug("Failed to remove address " + vAddress.getAddressId() + " from record " + vCapId.getCustomID());
				logDebug("Error: " + vRemove.getErrorMessage());
			}
		}		
	}
}