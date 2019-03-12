// Begin script to populate the Jurisdiction ASI with GIS City information
var vJurisdiction;
vJurisdiction = getGISInfo("MPWMD","City Limit","City");
if (vJurisdiction != null && vJurisdiction != "") {
	editAppSpecific("Jurisdiction",vJurisdiction);
}
// End script to populate the Jurisdiction ASI with GIS City information