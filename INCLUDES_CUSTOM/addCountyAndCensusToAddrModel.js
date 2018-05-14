function addCountyAndCensusToAddrModel(vCapId) {
	var x = 0;
	var y = 0;
	var geoCodeURL = lookup("Address Verification Interface Settings", "ArcGIS Endpoint");
	var findAddressCandidateResource = "/arcgis/rest/services/Location/comp_parcels_streets_poi/GeocodeServer/findAddressCandidates";
	var queryResource = "/arcgis/rest/services/Government/BCC/MapServer/4/query";
	var queryParams = "geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects&inSR=4326&returnGeometry=false&outFields=*&f=json&geometry=%%XCOORD%%,%%YCOORD%%";
	var Parms = "outFields=city&state=CA&Street=%%STREET%%&f=json&maxLocations=1&City=%%CITY%%&outFields=city&Zip=%%ZIP%%";
	var vAddressInALine;
	var vAddressModel;
	var vAddrModelArry;
	var geoID;

	vAddrModelArry = aa.address.getAddressWithAttributeByCapId(vCapId);
	if (vAddrModelArry.getSuccess()) {
		vAddrModelArry = vAddrModelArry.getOutput();
		x = 0;
		for (x in vAddrModelArry) {
			vAddressModel = vAddrModelArry[x];

			logDebug("Address: " + vAddressModel);

			vAddressInALine = "" + vAddressModel.getHouseNumberStart();
			if (vAddressModel.getStreetSuffixdirection()) {
				vAddressInALine += " " + vAddressModel.getStreetSuffixdirection();
			}
			if (vAddressModel.getStreetName()) {
				vAddressInALine += " " + vAddressModel.getStreetName();
			}
			if (vAddressModel.getStreetSuffix()) {
				vAddressInALine += " " + vAddressModel.getStreetSuffix();
			}
			if (vAddressModel.getStreetPrefix()) {
				vAddressInALine += " " + vAddressModel.getStreetPrefix();
			}

			logDebug("vAddressInALine: " + vAddressInALine);

			Parms = Parms.replace("%%STREET%%", vAddressInALine);
			Parms = Parms.replace("%%CITY%%", "" + vAddressModel.getCity());
			Parms = Parms.replace("%%ZIP%%", "" + vAddressModel.getZip());

			// Get X and Y coordinates
			postResult = aa.util.httpPost(geoCodeURL + findAddressCandidateResource, Parms);
			if (postResult.getSuccess()) {
				//logDebug("Post 1 Successful");
				jsonOutput = postResult.getOutput();
				jsonObject = JSON.parse(jsonOutput);
				jsonCandidates = jsonObject.candidates;
				if (jsonCandidates.length > 0) {
					//logDebug("We have candidates");
					firstAddress = jsonCandidates[0];
					Xcoord = firstAddress.location.x;
					Ycoord = firstAddress.location.y;
					// Use X and Y to return County and Census Tract Info
					queryParams = queryParams.replace("%%XCOORD%%", "" + Xcoord);
					queryParams = queryParams.replace("%%YCOORD%%", "" + Ycoord);
					QPostResult = aa.util.httpPost(geoCodeURL + queryResource, queryParams);
					if (QPostResult.getSuccess()) {
						//logDebug("Post 2 Successful");
						QJsonOutput = QPostResult.getOutput();
						QJsonObject = JSON.parse(QJsonOutput);
						features = QJsonObject.features;
						firstFeature = features[0];
						// Save X and Y coordinates
						vAddressModel.setXCoordinator(Xcoord);
						vAddressModel.setYCoordinator(Ycoord);
						// Save County
						countyName = "" + firstFeature.attributes["COUNTY"];
						countyNameStr = (String(countyName)).toUpperCase();
						vAddressModel.setCounty(countyNameStr); // Set County
						logDebug("Setting address County to " + countyNameStr);
						// Save Country
						vAddressModel.setCountry("United States"); // Set Country
						vAddressModel.setCountryCode("US");
						// Save Census Tract
						addressAttrObjArry = vAddressModel.getAttributes();
						if (addressAttrObjArry != null) {
							addressAttrObjArry = addressAttrObjArry.toArray();
							for (y in addressAttrObjArry) {
								addressAttrObj = addressAttrObjArry[y];
								geoID = "" + firstFeature.attributes["GEOID"];
								if (addressAttrObj.getName() == "GEOID") {
									// Save GEOID US 145
									//geoID = "" + firstFeature.attributes["GEOID"]; moving statement to test resolution of error
									//geoIDStr = (String(geoID)).toUpperCase(); removing field to test resolution of error
									// Check to see if value exist in shared drop down, if not add it.
									vExists = lookup("GEOIDs", geoID);
									if (typeof vExists == "undefined") {
										// Adding value
										addLookup("GEOIDs", geoID, geoID);
									}
									addressAttrObj.setB1AttributeValue(geoID);
									logDebug("Setting address attribute " + "GEOID" + " to " + geoID);
								} else if (addressAttrObj.getName() == "CENSUS TRACT") {
									censusName = "" + firstFeature.attributes["Census_Tract"];
									censusNameStr = (String(censusName)).toUpperCase();
									//Pre-append County Name to Census Tract US 145
									censusNameStr = countyNameStr + " - " + censusNameStr;
									// Check to see if value exist in shared drop down, if not add it.
									vExists = lookup("CA_Census_Tracts", censusNameStr);
									if (typeof vExists == "undefined") {
										// Adding value, including GEOID as description
										addLookup("CA_Census_Tracts", censusNameStr, geoID);
									}
									addressAttrObj.setB1AttributeValue(censusNameStr);
									logDebug("Setting address attribute " + "CENSUS TRACT" + " to " + censusNameStr);
								}
							}
						} else {
							logDebug("No address attributes found");
						}
						vSaveResult = aa.address.editAddressWithAPOAttribute(vCapId, vAddressModel);
						logDebug("Address save result: " + vSaveResult.getSuccess());
					} else {
						logDebug("Error calling query resource " + QPostResult.getErrorMessage())
					}

				} else {
					logDebug("No address candidates found");
				}
			} else {
				logDebug("Error calling findAddressCandidates resource " + postResult.getErrorMessage())
			}
			return vAddressModel;
		}
	}
}
