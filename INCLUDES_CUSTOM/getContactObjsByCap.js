function getContactObjsByCap(itemCap) {
    // optional typeToLoad
    var typesToLoad = false;
    if (arguments.length == 2) {
		typesToLoad = arguments[1];
	}
    var capContactArray = null;
    var cArray = [];
    var yy = 0;

    var capContactResult = aa.people.getCapContactByCapID(itemCap);
    if (capContactResult.getSuccess()) {
        capContactArray = capContactResult.getOutput();
    }

    //aa.print("getContactObj returned " + capContactArray.length + " contactObj(s)");
    //aa.print("typesToLoad: " + typesToLoad);

    if (capContactArray) {
        for (yy in capContactArray) {
            //exclude inactive contacts
            if (capContactArray[yy].getPeople().getAuditStatus() == 'I') {
                continue;
            }
            if (!typesToLoad || capContactArray[yy].getPeople().contactType == typesToLoad) {
                cArray.push(new contactObj(capContactArray[yy]));
            }
        }
    }
    //logDebug("getContactObj returned " + cArray.length + " contactObj(s)");
    return cArray;
}