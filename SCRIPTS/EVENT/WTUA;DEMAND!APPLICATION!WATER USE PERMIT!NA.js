// Begin script to update the parent Base Premise record with info from Water Use Permit
include("UPDATE_BASE_PREMISE_FROM_WATER_USE_PERMIT");
// End script to update the parent Base Premise record with info from Water Use Permit

// Begin script to update JAE record ASIT with water use permit info
include("UPDATE_JAE_RECORD_FROM_WATER_USE_PERMIT");
// End script to update JAE record ASIT with water use permit info

// Begin script to close workflow
include("CLOSE_WORKFLOW");
// End script to close workflow