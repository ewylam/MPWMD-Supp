// Begin script to update the expiration date
include("UPDATE_EXPIRATION_DATE_ASI_WATER_PERMIT");
// End script to update the expiration date

// Begin script to update the parent Base Premise record with info from Water Permit
include("UPDATE_BASE_PREMISE_FROM_WATER_PERMIT");
// End script to update the parent Base Premise record with info from Water Permit

// Being script to add recording and capacity fees
include("ADD_RECORDING_AND_CAPACITY_FEES");
// End script to add recording and capacity fees

//Begin script to get the most recent inspection and update the fixture ASIT from the guidesheet data
include("UPDATE_RESIDENTIAL_FIXTURE_ASIT_FROM_INSPECTION");
//End script to get the most recent inspection and update the fixture ASIT from the guidesheet data

// Begin script to assess amendment permit fees at Inspections Amendment Required
//include("ASSESS_AMENDMENT_PERMIT_FEES");
// End script to assess amendment water permit fees
