// Begin script to update the transactional parcel's Legal Description from the Legal Description ASI
var vLegalDesc = getAppSpecific("Legal Description");
if (vLegalDesc != null && vLegalDesc != false && vLegalDesc != "") {
	setTransParcelLegalDescription(capId, vLegalDesc);
}
// End script to update the transactional parcel's Legal Description from the Legal Description ASI
