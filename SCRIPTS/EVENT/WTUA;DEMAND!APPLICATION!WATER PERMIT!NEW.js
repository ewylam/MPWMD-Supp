// Begin script to update the parent Base Premise record with info from Water Permit
include("UPDATE_BASE_PREMISE_FROM_WATER_PERMIT");
// End script to update the parent Base Premise record with info from Water Permit

// Begin script to add rows to custom list (Data Table) DEED RESTRICTIONS 
include("ADD_ROWS_TO_DEED_RESTRICTIONS");
// End script to add rows to custom list DEED RESTRICTIONS

// Being script to add recording and capacity fees
include("ADD_RECORDING_AND_CAPACITY_FEES");
// End script to add recording and capacity fees

//Begin script to get the most recent inspection and update the fixture ASIT from the guidesheet data
include("UPDATE_RESIDENTIAL_FIXTURE_ASIT_FROM_INSPECTION");
//End script to get the most recent inspection and update the fixture ASIT from the guidesheet data
