var vSelectSQL = "select distinct B1_CHECKLIST_COMMENT from BCHCKBOX where serv_prov_code = 'MPWMD' and b1_checkbox_desc = 'Jurisdiction' order by B1_CHECKLIST_COMMENT";

/*
// Existing:
// [{"B1_CHECKLIST_COMMENT":"0","count":1},{"B1_CHECKLIST_COMMENT":"2SE OF 2ND","count":2},{"B1_CHECKLIST_COMMENT":"4 SW OF 2ND","count":3},{"B1_CHECKLIST_COMMENT":"Airport District","count":4},{"B1_CHECKLIST_COMMENT":"CARME","count":5},{"B1_CHECKLIST_COMMENT":"CARMEL","count":6},{"B1_CHECKLIST_COMMENT":"CARMEL HIGH","count":7},{"B1_CHECKLIST_COMMENT":"CARMEL HIGHLAND","count":8},{"B1_CHECKLIST_COMMENT":"CARMEL VALLE","count":9},{"B1_CHECKLIST_COMMENT":"CARMEL VALLEY","count":10},{"B1_CHECKLIST_COMMENT":"CV","count":11},{"B1_CHECKLIST_COMMENT":"Carmel Highlands","count":12},{"B1_CHECKLIST_COMMENT":"Carmel VAlley","count":13},{"B1_CHECKLIST_COMMENT":"Carmel valley","count":14},{"B1_CHECKLIST_COMMENT":"Carmel-by-the-Sea","count":15},{"B1_CHECKLIST_COMMENT":"County","count":16},{"B1_CHECKLIST_COMMENT":"Del Rey Oaks","count":17},{"B1_CHECKLIST_COMMENT":"Monterey","count":18},{"B1_CHECKLIST_COMMENT":"Monterey County","count":19},{"B1_CHECKLIST_COMMENT":"PACIFIC GROV","count":20},{"B1_CHECKLIST_COMMENT":"PACIFIC GROVOE","count":21},{"B1_CHECKLIST_COMMENT":"PEBBLE BEACH","count":22},{"B1_CHECKLIST_COMMENT":"PEbble Beach","count":23},{"B1_CHECKLIST_COMMENT":"Pacific Grove","count":24},{"B1_CHECKLIST_COMMENT":"Pebble beach","count":25},{"B1_CHECKLIST_COMMENT":"SALINAS","count":26},{"B1_CHECKLIST_COMMENT":"SEASIDE+","count":27},{"B1_CHECKLIST_COMMENT":"Sand City","count":28},{"B1_CHECKLIST_COMMENT":"Seaside","count":29},{"B1_CHECKLIST_COMMENT":"cARMEL vALLEY","count":30},{"B1_CHECKLIST_COMMENT":"carmel","count":31},{"B1_CHECKLIST_COMMENT":"carmel valley","count":32},{"B1_CHECKLIST_COMMENT":"monterey","count":33},{"B1_CHECKLIST_COMMENT":"null","count":34},{"B1_CHECKLIST_COMMENT":"pacific grove","count":35},{"B1_CHECKLIST_COMMENT":"pebble beach","count":36},{"B1_CHECKLIST_COMMENT":"sSAND CITY","count":37},{"B1_CHECKLIST_COMMENT":"sand City","count":38},{"B1_CHECKLIST_COMMENT":"null","count":39}]

*/

var vUpdateSQL = "update BCHCKBOX set B1_CHECKLIST_COMMENT = \
	CASE \
		WHEN B1_CHECKLIST_COMMENT = 'PG 74' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'PG OTHER' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'PACIFIC GROV' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'PACIFIC GROVOE' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'CARME' then 'Carmel-by-the-Sea' \
		WHEN B1_CHECKLIST_COMMENT = 'CARME VALLEY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMEL VALLE' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMEL VALLEY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'carmel valley' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Carmel valley' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Carmel VAlley' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'cARMEL vALLEY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'County' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Cv' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMEL HIGHLAND' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Carmel Highlands' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMEL HIGH' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = ' Carmel' then 'Carmel-by-the-Sea' \
		WHEN B1_CHECKLIST_COMMENT = 'carmel' then 'Carmel-by-the-Sea' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMEL' then 'Carmel-by-the-Sea' \
		WHEN B1_CHECKLIST_COMMENT = 'Salinas' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'SALINAS' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMEL HIGHLANDS' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'PACFIC GROVE' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'PEBBLE BEAACH' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'PEBBLE BEACH' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'pebble beach' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'PEbble Beach' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Pebble beach' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'SEASIDE' then 'Seaside' \
		WHEN B1_CHECKLIST_COMMENT = 'SEASIDE+' then 'Seaside' \
		WHEN B1_CHECKLIST_COMMENT = 'PACIFIC GROVE' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'pacific grove' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'pa' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTEREY 74' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'QUAIL' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTEREY PUBLIC' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTEREY OTHER' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'COUNTY PUBLIC' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'DRO OTHER' then 'Del Rey Oaks' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTEREY' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'monterey' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'Pebble' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Carmel Meadows' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'ENTITLEMENT' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARMELVALLEY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CAMREL' then 'Carmel-by-the-Sea' \
		WHEN B1_CHECKLIST_COMMENT = 'COUNTY 74' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'AIRPORT DIST' then 'Airport District' \
		WHEN B1_CHECKLIST_COMMENT = 'Pebble Beach' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTEREY COUNTY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'SC PUBLIC' then 'Sand City' \
		WHEN B1_CHECKLIST_COMMENT = 'sSAND CITY' then 'Sand City' \
		WHEN B1_CHECKLIST_COMMENT = 'sand City' then 'Sand City' \
		WHEN B1_CHECKLIST_COMMENT = 'PEBBLE BEACH CO' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'PACIFC GROVE' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'SAND CITY' then 'Sand City' \
		WHEN B1_CHECKLIST_COMMENT = ' PEBBLE BEACH' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'mo' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTERY COUNTY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'PEBBEL BEACH' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'PG PUBLIC' then 'Pacific Grove' \
		WHEN B1_CHECKLIST_COMMENT = 'COUNTY' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Pebble Bech' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Big Sur' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'SEASIDE PUBLIC' then 'Seaside' \
		WHEN B1_CHECKLIST_COMMENT = 'ca' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'DEL REY OAKS' then 'Del Rey Oaks' \
		WHEN B1_CHECKLIST_COMMENT = 'MONTERY' then 'Monterey' \
		WHEN B1_CHECKLIST_COMMENT = 'WATER WEST' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Various Cities' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'COUNTY OTHER' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'GRIFFIN TRUST' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Carmel Valley' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Carmel' then 'Carmel-by-the-Sea' \
		WHEN B1_CHECKLIST_COMMENT = 'MACOMBER' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'QUAIL MEADOWS' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'Pebble Beah' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'pe' then 'Monterey County' \
		WHEN B1_CHECKLIST_COMMENT = 'CARNEL VALLEY' then 'Monterey County' \
		ELSE B1_CHECKLIST_COMMENT \
	END \
	where serv_prov_code = 'MPWMD' and b1_checkbox_desc = 'Jurisdiction' "

doSQL(vSelectSQL);
doSQL(vUpdateSQL);
doSQL(vSelectSQL);

//Functions
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
		} else {
			aa.print("executing : " + sql);
			var rOut = sStmt.execute();
			aa.print(rOut);
		}
		sStmt.close();
		conn.close();
	} catch (err) {
		aa.print(err.message);
	}
}
