// Begin script to copy the Transfer of Title Date field to the B1PERMIT.REC_DATE field for reporting
var vTotDate = getAppSpecific("Transfer of Title Date");
if (vTotDate != null) {
	//vReportedDate = new Date(vTotDate);
	//		editReportedDate(vReportedDate);
	vTotDate = vTotDate + "";
	updateRecDate(vTotDate, capId);
}
// End script to copy the Transfer of Title Date field to the B1PERMIT.REC_DATE field for reporting