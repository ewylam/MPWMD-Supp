function replaceASITable4ACAPageFlow(destinationTableGroupModel, tableName, tableValueArray) // optional capId
{
	//  tableName is the name of the ASI table
	//  tableValueArray is an array of associative array values.  All elements MUST be either a string or asiTableVal object
	//

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

	var i = -1; // row index counter
	if (tsm.getTableFields() != null) {
		i = 0 - tsm.getTableFields().size()
	}

	for (thisrow in tableValueArray) {
		var fld = aa.util.newArrayList(); // had to do this since it was coming up null.
		var fld_readonly = aa.util.newArrayList(); // had to do this since it was coming up null.
		var col = tsm.getColumns()
			var coli = col.iterator();
		while (coli.hasNext()) {
			var colname = coli.next();

			if (!tableValueArray[thisrow][colname.getColumnName()]) {
				logDebug("addToASITable: null or undefined value supplied for column " + colname.getColumnName() + ", setting to empty string");
				tableValueArray[thisrow][colname.getColumnName()] = "";
			}

			if (typeof(tableValueArray[thisrow][colname.getColumnName()].fieldValue) != "undefined") // we are passed an asiTablVal Obj
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()].fieldValue ? tableValueArray[thisrow][colname.getColumnName()].fieldValue : "", colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(tableValueArray[thisrow][colname.getColumnName()].readOnly.equals("Y"));
				fld.add(fldToAdd);
				fld_readonly.add(tableValueArray[thisrow][colname.getColumnName()].readOnly);

			} else // we are passed a string
			{
				var args = new Array(tableValueArray[thisrow][colname.getColumnName()] ? tableValueArray[thisrow][colname.getColumnName()] : "", colname);
				var fldToAdd = aa.proxyInvoker.newInstance("com.accela.aa.aamain.appspectable.AppSpecificTableField", args).getOutput();
				fldToAdd.setRowIndex(i);
				fldToAdd.setFieldLabel(colname.getColumnName());
				fldToAdd.setFieldGroup(tableName.replace(/ /g, "\+"));
				fldToAdd.setReadOnly(false);
				fld.add(fldToAdd);
				fld_readonly.add("N");

			}
		}

		i--;

		if (tsm.getTableFields() == null) {
			tsm.setTableFields(fld);
		} else {
			if (thisrow == 0)
				tsm.setTableFields(fld);
			else
				tsm.getTableFields().addAll(fld);
		}

		if (tsm.getReadonlyField() == null) {
			tsm.setReadonlyField(fld_readonly); // set readonly field
		} else {
			if (thisrow == 0)
				tsm.setReadonlyField(fld_readonly);
			else
				tsm.getReadonlyField().addAll(fld_readonly);
		}
	} // end for loop

	tssm = tsm;
	return destinationTableGroupModel;
}
