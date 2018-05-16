// Begin script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
include("UPDATE_POST_FIXTURE_UNIT_COUNT");
// End script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.

// Begin script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count (ASI) minus Current Fixture Unit Count (ASI)
include("UPDATE_PROPOSED_WATER_USAGE");
// End script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count (ASI) minus Current Fixture Unit Count (ASI)
