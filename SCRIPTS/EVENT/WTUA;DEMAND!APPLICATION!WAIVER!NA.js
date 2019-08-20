// Begin script to create child meter permits for each row in the meter table
//include("CREATE_METER_PERMITS");
// End script to create child meter permits for each row in the meter table
// Begin script to update Meter Permit Expiration date to 60 days
include("UPDATE_EXPIRATION_METER_PERMITS");
// End script to update Meter Permit Expiration date to 60 days
// Begin script to close workflow and related records workflow.
include("CLOSE_METER_PERMITS");
// End script to close workflow and related records workflow.
