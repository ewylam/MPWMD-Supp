function updateRecDate(pDateString, pCapId) {
	try {
		var vUpdateSQL = "update B1PERMIT set rec_date = to_date( '" + pDateString + "', 'MM/DD/YYYY') where serv_prov_code = 'MPWMD' and B1_ALT_ID = '" + pCapId.getCustomID() + "'";
		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
		var ds = initialContext.lookup("java:/AA");
		var conn = ds.getConnection();
		var sStmt = conn.prepareStatement(vUpdateSQL);

		logDebug("executing update: " + vUpdateSQL);
		var rOut = sStmt.executeUpdate();
		logDebug(rOut + " rows updated");

		sStmt.close();
		conn.close();
	} catch (err) {
		logDebug(err.message);
	}
}
