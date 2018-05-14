function getAllParents(pAppType) {
	// returns the capId array of all parent caps
	//Dependency: appMatch function
	//

	parentArray = getRoots(capId);

	myArray = new Array();

	if (parentArray.length > 0) {
		if (parentArray.length) {
			for (x in parentArray) {
				if (pAppType != null) {
					//If parent type matches apType pattern passed in, add to return array
					if (appMatch(pAppType, parentArray[x]))
						myArray.push(parentArray[x]);
				} else
					myArray.push(parentArray[x]);
			}

			return myArray;
		} else {
			logDebug("**WARNING: GetParent found no project parent for this application");
			return null;
		}
	} else {
		logDebug("**WARNING: getting project parents:  " + getCapResult.getErrorMessage());
		return null;
	}
}
