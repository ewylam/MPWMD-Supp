function getRecordsWithASIContacts(firstName, lastName, apptypeString) {

	var resultArray = [];
	var array = [];

	var ats = apptypeString.split("/");
	if (!firstName || firstName == "" || !lastName || lastName == "" || ats.length != 4) {
		logDebug("getRecordsWithASIContacts improper parameters");
		return false;
	}

	sql = "SELECT P.B1_ALT_ID from B1PERMIT P" +
		" LEFT JOIN BAPPSPECTABLE_VALUE A on (P.SERV_PROV_CODE = A.SERV_PROV_CODE and P.B1_PER_ID1 = A.B1_PER_ID1 and P.b1_per_id2 = 	a.b1_per_id2 and p.b1_per_id3 = a.b1_per_id3)" +
		" LEFT JOIN BAPPSPECTABLE_VALUE B on (A.SERV_PROV_CODE = B.SERV_PROV_CODE and A.B1_PER_ID1 = B.B1_PER_ID1 and A.b1_per_id2 = b.b1_per_id2 and a.b1_per_id3 = b.b1_per_id3 and a.group_name = b.group_name and a.table_Name =  b.table_Name and a.row_index = b.row_index)" +
		" where p.serv_prov_code = '" + aa.getServiceProviderCode() + "'" +
		(ats[0] && ats[0] != "*" && ats[0] != "" ? " AND b1_per_group = '" + ats[0] + "'" : "") +
		(ats[1] && ats[1] != "*" && ats[1] != "" ? " AND b1_per_type = '" + ats[1] + "'" : "") +
		(ats[2] && ats[2] != "*" && ats[2] != "" ? " AND b1_per_sub_type = '" + ats[2] + "'" : "") +
		(ats[3] && ats[3] != "*" && ats[3] != "" ? " AND b1_per_category = '" + ats[3] + "'" : "") +
		" AND p.rec_status = 'A' and p.b1_appl_class = 'COMPLETE' and a.TABLE_NAME in ('LIST OF OWNERS', 'NON CONTROLLING INTEREST')" +
		" and a.rec_status = 'A' and a.column_name = 'First Name' and b.column_name = 'Last Name' and " +
		" UPPER(a.attribute_value) = '" + String(firstName).toUpperCase() + "' and" +
		" UPPER(b.attribute_value) = '" + String(lastName).toUpperCase() + "'";
	
	try {
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(sql);
		var rSet = sStmt.executeQuery();
		while (rSet.next()) {
			var obj = {};
			var md = rSet.getMetaData();
			var columns = md.getColumnCount();
			for (i = 1; i <= columns; i++) {
				obj[md.getColumnName(i)] = String(rSet.getString(md.getColumnName(i)));
			}
			obj.count = rSet.getRow();
			array.push(obj)
		}

		rSet.close();
		sStmt.close();
		conn.close();

		for (var i in array) {
			var itemCapString = array[i]["B1_ALT_ID"];
			resultArray.push(aa.cap.getCapID(itemCapString).getOutput());
		}
		return (resultArray);
	} catch (err) {
		aa.env.setValue("returnCode", "-1"); // error
		aa.env.setValue("returnValue", err.message);
		aa.print(err.message);
	}
}