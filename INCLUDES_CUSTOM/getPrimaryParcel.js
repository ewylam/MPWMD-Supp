function getPrimaryParcel() {
	try {
		//get parcel(s) by capid
		var parcels = aa.parcel.getParcelDailyByCapID(capId, null);

		if (parcels.getSuccess()) {
			parcels = parcels.getOutput();
			if (parcels == null || parcels.length == 0) {
				aa.print("No parcels available for this record");
			} else {
				for (cnt in parcels) {
					if (parcels[cnt].getPrimaryParcelFlag() == "Y") {
						return parcels[cnt].getParcelNumber();
					}
				}
				// no primary parcel, return first parcel
				return parcels[0].getParcelNumber();
			}
		}
		return null;
	} catch (err) {
		logDebug("A JavaScript Error occurred in custom function getPrimaryParcel(): " + err.message);
		//aa.print("A JavaScript Error occurred in custom function getPrimaryParcel(): " + err.message);
	}
}