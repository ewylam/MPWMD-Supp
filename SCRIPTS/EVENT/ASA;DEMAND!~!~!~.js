// Begin script to set the record name to the Address; Parcel
include("SET_APP_NAME");
// End script to set the record name to the Address; Parcel

// Begin script to update the ASI Legal Description from the Transactional Parcels Legal Description
include("UPDATE_LEGAL_DESC_ASI_FROM_PARCEL");
// End script to update the ASI Legal Description from the Transactional Parcels Legal Description

// Begin script to populate the Jurisdiction ASI with GIS City information
include("POPULATE_JURISDICTION_FROM_GIS");
// End script to populate the Jurisdiction ASI with GIS City information