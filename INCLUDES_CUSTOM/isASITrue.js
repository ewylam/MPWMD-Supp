function isASITrue(val) {
	var sVal = String(val).toUpperCase();
    return (sVal.substr(0,1).equals("Y") || sVal.equals("CHECKED"));
}