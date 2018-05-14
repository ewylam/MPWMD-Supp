var capId = aa.env.getValue("CapId");

try {
	
	// Begin Code needed to call master script functions ---------------------------------------------------
	function getScriptText(vScriptName, servProvCode, useProductScripts) {
		if (!servProvCode)
			servProvCode = aa.getServiceProviderCode();
		vScriptName = vScriptName.toUpperCase();
		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
		try {
			if (useProductScripts) {
				var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
			} else {
				var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
			}
			return emseScript.getScriptText() + "";
		} catch (err) {
			return "";
		}
	}
	var SCRIPT_VERSION = 3.0;
	aa.env.setValue("CurrentUserID", "ADMIN");
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
	eval(getScriptText("INCLUDES_CUSTOM", null, true));
	
	var geoCodeURL = lookup("Address Verification Interface Settings", "ArcGIS Endpoint");
	var findAddressCandidateResource = "/arcgis/rest/services/Location/comp_parcels_streets_poi/GeocodeServer/findAddressCandidates";
	var queryResource = "/arcgis/rest/services/Boundaries/County_NAD83/MapServer/0/query"
	var queryParams = "geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&returnGeometry=false&outFields=County&f=json&geometry=%%XCOORD%%,%%YCOORD%%";
	var Parms = "outFields=city&state=CA&Street=%%STREET%%&f=json&maxLocations=1&City=%%CITY%%&outFields=city&Zip=%%ZIP%%";

	conArray = getContactObjsByCap_BCC(capId, "Business");      
	if (conArray && conArray.length > 0) {
		for (var cIndex in conArray) {
			thisBusinessContactObj = conArray[cIndex];
			contactAddressList = thisBusinessContactObj.addresses;
			for (var aIndex in contactAddressList) {
				casm = contactAddressList[aIndex];  // contactAddressScriptModel
				if (casm.getAddressType() == "Premise") {
					addr1 = "" + casm.getHouseNumberStart(); 
					if (casm.getStreetDirection()) addr1 += " " + casm.getStreetDirection();
					if (casm.getStreetName()) addr1 += " " + casm.getStreetName();
					if (casm.getStreetSuffix()) addr1 += " " + casm.getStreetSuffix();
					if (casm.getStreetPrefix()) addr1 += " " + casm.getStreetPrefix();

					Parms = Parms.replace("%%STREET%%",  addr1);
					Parms = Parms.replace("%%CITY%%", "" + casm.getCity());
					Parms = Parms.replace("%%ZIP%%", "" + casm.getZip());

					postResult = aa.util.httpPost(geoCodeURL+findAddressCandidateResource,Parms);
					if (postResult.getSuccess()) {
						jsonOutput = postResult.getOutput();
						jsonObject = JSON.parse(jsonOutput);
						jsonCandidates = jsonObject.candidates;
						if (jsonCandidates.length > 0) {
							firstAddress = jsonCandidates[0];
							Xcoord = firstAddress.location.x;
							Ycoord = firstAddress.location.y;
							cityName = "" + firstAddress.attributes["City"];
							casm.setCity(cityName.toUpperCase());
							queryParams = queryParams.replace("%%XCOORD%%", "" + Xcoord);
							queryParams = queryParams.replace("%%YCOORD%%", "" + Ycoord);
							QPostResult = aa.util.httpPost(geoCodeURL+queryResource,queryParams);
							if (QPostResult.getSuccess()) {
								QJsonOutput = QPostResult.getOutput();
								QJsonObject = JSON.parse(QJsonOutput);
								features = QJsonObject.features;
								firstFeature = features[0];
								countyName = "" + firstFeature.attributes["County"];
								countyNameStr = (String(countyName)).toUpperCase();
								casm.setAddressLine3(countyNameStr);
								editResult = aa.address.editCapContactAddress(capId, casm.getContactAddressModel());
								if (editResult.getSuccess()){
									logDebug("Successfully edited address on contact ");
								} else {
									logDebug("Error editing contact address " + editResult.getErrorMessage());
								}
							}
							else {
								logDebug("Error calling query resource " + QPostResult.getErrorMessage())
							}

						}
						else {
							logDebug("No address candidates found");
						}
					}
					else {
						logDebug("Error calling findAddressCandidates resource " + postResult.getErrorMessage())
					}
				}
			}
		}
	}
} catch (err) {
	aa.sendMail("noreply@accela.com", "deanna@grayquarter.com", "", "Script Error from CLEaR: " + err.message, err.lineNumber + " : " + err.stack + "\r\n" + debug);
}