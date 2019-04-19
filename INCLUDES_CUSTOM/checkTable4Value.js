function checkTable4Value(tName, colName, arrayValue) {
	var custList = loadASITable(tName);
	if (custList) {
		if (custList.length > 0) {
			for (eachRow in custList) {
				var aRow = custList[eachRow];
				if (exists(aRow[colName], arrayValue))
					return true;
			}
		}
	}
	return false;
}
