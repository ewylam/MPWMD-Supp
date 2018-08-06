// Begin script to set the record name to the Address; Parcel
var vAddress = getAddressInALine_MPWMD();
var vParcel = getPrimaryParcel();
var vRecName = "";
if (vAddress != null && vAddress != false && vAddress != "") {
	vRecName = vAddress + ";";
}
if (vParcel != null && vParcel != false && vParcel != "") {
	vRecName += " " + vParcel;
}
editAppName(vRecName);
// End script to set the record name to the Address; Parcel
