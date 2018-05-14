function convertJSONStringToHashmap(s) {
	var p = aa.util.newHashtable();
	try {
		var j = JSON.parse(s);
	} catch (err) {
		logDebug("Could not parse string to JSON: " + s);
		return p; // empty hashtable
	}

	for (var i in j) {
		//logDebug("adding param " + String(i) + " = " + String(j[i]));
		addParameter(p, String(i), String(j[i]));
	}
	return p;
}
