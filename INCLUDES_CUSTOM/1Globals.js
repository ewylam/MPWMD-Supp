var ENVIRON = "SUPP";
var EMAILREPLIES = "noreply@accela.com";
var SENDEMAILS = true;
var ACAURL = "https://aca.supp.accela.com/MPWMD";


//set Debug
var vDebugUsers = ['EWYLAM','ADMIN','JSCHILLO','EVONTRAPP','LCHARRON'];
if (exists(currentUserID,vDebugUsers)) {
	showDebug = 3;
	showMessage = true;
}