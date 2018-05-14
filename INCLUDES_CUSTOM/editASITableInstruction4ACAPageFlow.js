function editASITDisplay4ACAPageFlow(destinationTableGroupModel, tableName, vDisp) // optional capId
{
	var itemCap = capId
		if (arguments.length > 3)
			itemCap = arguments[3]; // use cap ID specified in args

	var ta = destinationTableGroupModel.getTablesMap().values();
	var tai = ta.iterator();

	var found = false;
	while (tai.hasNext()) {
		var tsm = tai.next(); // com.accela.aa.aamain.appspectable.AppSpecificTableModel
		if (tsm.getTableName().equals(tableName)) {
			found = true;
			break;
		}
	}

	if (!found) {
		logDebug("cannot update asit for ACA, no matching table name");
		return false;
	}

	tsm.setVchDispFlag(vDisp);
	
	tssm = tsm;
	return destinationTableGroupModel;
}