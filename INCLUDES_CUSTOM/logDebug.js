function logDebug(dstr) {

	// custom for BCC.
	if (dstr.indexOf("**ERROR") >= 0) {
		dstr = dstr.replace("**ERROR","**WARNING");
		var err = {};
		err.message = dstr;
		err.lineNumber = "";
		err.stack = "";
		handleError(err,"");
	}
	vLevel = 1
	if (arguments.length > 1)
		vLevel = arguments[1];
	if ((showDebug & vLevel) == vLevel || vLevel == 1)
		debug += dstr + br;
	if ((showDebug & vLevel) == vLevel)
		aa.debug(aa.getServiceProviderCode() + " : " + aa.env.getValue("CurrentUserID"), dstr);
}
