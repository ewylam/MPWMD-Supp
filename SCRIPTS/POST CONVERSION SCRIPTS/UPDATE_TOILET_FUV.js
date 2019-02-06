var vSQL = "update BAPPSPECTABLE_VALUE a\
	set attribute_value = '1.80000' \
	where 1=1 \
		and a.serv_prov_code = 'MPWMD' \
		and a.table_name = 'RESIDENTIAL  FIXTURES' \
		and a.column_name = 'FUV' \
		and a.attribute_value = '1.70000' \
		and exists (select 1 from BAPPSPECTABLE_VALUE b \
			where 1=1 \
				and a.serv_prov_code = b.serv_prov_code \
				and a.b1_per_id1 = b.b1_per_id1 \
				and a.b1_per_id2 = b.b1_per_id2 \
				and a.b1_per_id3 = b.b1_per_id3 \
				and a.table_name = b.table_name \
				and a.row_index = b.row_index \
				and b.column_name = 'Type of Fixture' \
				and b.attribute_value in ('Toilet, NON ULF - more than 1.6 gallons','Toilet, ultra low-flow (1.6 gallons-per-flush)','Toilet, Ultra Low Flush (1.6 gallons-per-flush)')) \
";

doSQL(vSQL);

function doSQL(sql) {
	try {
		var array = [];
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(sql);

		if (sql.toUpperCase().indexOf("SELECT") == 0) {
			aa.print("executing " + sql);
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
			aa.print("...returned " + array.length + " rows");
			aa.print(JSON.stringify(array));
			return array
		} else if (sql.toUpperCase().indexOf("UPDATE") == 0) {
			aa.print("executing update: " + sql);
			var rOut = sStmt.executeUpdate();
			aa.print(rOut + " rows updated");
			return array
		} else {
			aa.print("executing : " + sql);
			var rOut = sStmt.execute();
			aa.print(rOut);
			return array
		}
		sStmt.close();
		conn.close();
		return array
	} catch (err) {
		aa.print(err.message);
		return array
	}
}
