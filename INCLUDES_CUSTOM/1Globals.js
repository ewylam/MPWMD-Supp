var ENVIRON = "DEV";
var EMAILREPLIES = "noreply@dca.ca.gov";
var SENDEMAILS = true;
var ACAURL = "https://aca.supp.accela.com/BCC";


//set Debug
var vDebugUsers = ['EWYLAM','ADMIN','JSCHILLO','EVONTRAPP'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}