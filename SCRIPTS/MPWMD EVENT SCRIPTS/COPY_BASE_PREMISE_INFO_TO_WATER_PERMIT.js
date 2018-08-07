// Begin script that copies data from Base Premise record to Water Use Permit record.
var parentCapId = getParent();
if (parentCapId != null) {
	//Copy Parcels from license to renewal
	copyParcels(parentCapId, capId);

	//Copy addresses from license to renewal
	copyAddress(parentCapId, capId);

	//copy ASI Info from license to renewal
	copyASIInfo_Local(parentCapId, capId);

	//Copy ASIT from license to renewal
	copyASITables(parentCapId, capId);

	//Copy Contacts from license to renewal
	copyContacts3_0(parentCapId, capId);

	//Copy Work Description from license to renewal
	aa.cap.copyCapWorkDesInfo(parentCapId, capId);

	//Copy application name from license to renewal
	editAppName(getAppName(parentCapId), capId);

	// Update Post Count values with Existing Count
	var vFixtureTableName = "RESIDENTIAL  FIXTURES";
	var vFixtureASIT;
	var vFixture;
	var vFixtureASIT = loadASITable(vFixtureTableName, capId);
	var x;
	if (typeof(vFixtureASIT) == "object") {
		x = 0;
		for (x in vFixtureASIT) {
			vFixture = vFixtureASIT[x];
			// Replace Post Count with Existing Count
			vFixture["Post Count"] = new asiTableValObj("Post Count", vFixture["Existing Count"].fieldValue, "N");
			// Replace Post Fixture with Existing Fixture
			vFixture["Post Fixture"] = new asiTableValObj("Post Fixture", vFixture["Existing Fixture"].fieldValue, "N");
		}
		// Copy updated fixture table to Base Premise
		removeASITable(vFixtureTableName, capId);
		addASITable(vFixtureTableName, vFixtureASIT, capId);
	}
}
// End script that copies data from Base Premise record to Water Use Permit record.
function copyASIInfo_Local(srcCapId, targetCapId)
{
	//copy ASI infomation
	var AppSpecInfo = new Array();
	loadAppSpecific(AppSpecInfo,srcCapId);
	var recordType = "";
	
	var targetCapResult = aa.cap.getCap(targetCapId);

	if (!targetCapResult.getSuccess()) {
			logDebug("Could not get target cap object: " + targetCapId);
		}
	else	{
		var targetCap = targetCapResult.getOutput();
			targetAppType = targetCap.getCapType();		//create CapTypeModel object
			targetAppTypeString = targetAppType.toString();
			logDebug(targetAppTypeString);
		}

	var ignore = lookup("EMSE:ASI Copy Exceptions",targetAppTypeString); 
	var ignoreArr = new Array(); 
	if(ignore != null) 
	{
		ignoreArr = ignore.split("|");
		copyAppSpecificRenewal_Local(AppSpecInfo,targetCapId, ignoreArr);
	}
	else
	{
		aa.print("something");
		copyAppSpecificRenewal_Local(AppSpecInfo,targetCapId);

	}
}
function copyAppSpecificRenewal_Local(AInfo,newCap) // copy all App Specific info into new Cap, 1 optional parameter for ignoreArr
{
	var ignoreArr = new Array();
	var limitCopy = false;
	if (arguments.length > 2) 
	{
		ignoreArr = arguments[2];
		limitCopy = true;
	}
	
	for (asi in AInfo){
		//Check list
		if(limitCopy){
			var ignore=false;
		  	for(var i = 0; i < ignoreArr.length; i++)
		  		if(ignoreArr[i] == asi){
		  			ignore=true;
					logDebug("Skipping ASI Field: " + ignoreArr[i]);
		  			break;
		  		}
		  	if(ignore)
		  		continue;
		}
		logDebug("Copying ASI Field: " + asi);
		editAppSpecific(asi,AInfo[asi],newCap);
	}
}