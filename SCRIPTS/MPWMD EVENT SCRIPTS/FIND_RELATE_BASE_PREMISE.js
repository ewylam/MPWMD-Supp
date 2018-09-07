// Begin script to find Base Premise records by parcel and relate as parent
var vRelatedRecords = getRelatedCapsByParcel("Demand/Master/Base Premise/NA");
var x = 0;
var vRelatedRecId;

if (vRelatedRecords != null) {
	if (vRelatedRecords.length > 1) {
		showMessage = true;
		comment("More than one Base Premise record exists for the linked parcel(s)");
	}
	for (x in vRelatedRecords) {
		vRelatedRecId = vRelatedRecords[x];
		if (getRecordStatus(vRelatedRecId) == "Active") { 
			// Relate Base Premise record
			addParent(vRelatedRecId);
			break;
		}
	}
}
// End script to find Base Premise records by parcel
