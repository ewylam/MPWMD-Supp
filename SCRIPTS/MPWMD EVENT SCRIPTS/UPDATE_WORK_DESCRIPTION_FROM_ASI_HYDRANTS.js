// Begin scipt to update work descrition
var vDescription = "";
var vPurpose = getAppSpecific("Purpose of Hydrant Connection");
var vSiteDesc = getAppSpecific("Site Location Description");
if (vPurpose != null && vPurpose != "") {
	vDescription = vPurpose;
}
if (vSiteDesc != null && vSiteDesc != "") {
	vDescription = vDescription + '\n' + vSiteDesc;
}
if (vDescription != null && vDescription != "") {
	updateWorkDesc(vDescription);
}
// End scipt to update work descrition


