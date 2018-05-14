function getContactObj(itemCap,typeToLoad)
{
    // returning the first match on contact type
    var capContactArray = null;
    var cArray = new Array();

    if (itemCap.getClass() == "class com.accela.aa.aamain.cap.CapModel")   { // page flow script 
        var capContactGroup = itemCap.getContactsGroup();
        if (capContactGroup) {
			capContactArray = capContactGroup.toArray();
			}
        }
    else {
        var capContactResult = aa.people.getCapContactByCapID(itemCap);
        if (capContactResult.getSuccess()) {
            var capContactArray = capContactResult.getOutput();
            }
        }
    
    if (capContactArray) {
        for (var yy in capContactArray) {
            if (capContactArray[yy].getPeople().contactType.toUpperCase().equals(typeToLoad.toUpperCase())) {
                logDebug("getContactObj returned the first contact of type " + typeToLoad);
                return new contactObj(capContactArray[yy]);
            }
        }
    }
    
    logDebug("getContactObj could not find a contact of type " + typeToLoad);
    return false;
            
}