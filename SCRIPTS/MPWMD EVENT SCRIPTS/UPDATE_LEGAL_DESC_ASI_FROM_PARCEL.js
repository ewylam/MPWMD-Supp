// Begin script to update the ASI Legal Description from the Transactional Parcels Legal Description
var vLegalDesc = getTransParcelLegalDescription(capId);
if (vLegalDesc != null && vLegalDesc != false) {
	editAppSpecific("Legal Description", vLegalDesc);
}
// End script to update the ASI Legal Description from the Transactional Parcels Legal Description
