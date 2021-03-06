// Begin script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
include("UPDATE_POST_FIXTURE_UNIT_COUNT");
// End script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.

// Begin script to update the Non-Residential Current Fixture Count with the sum of all Commercial (ASIT) Fixture values.
include("UPDATE_CURRENT_FIXTURE_UNIT_COUNT_COMMERCIAL");
// End script to update the Non-Residential Current Fixture Count with the sum of all Commercial (ASIT) Fixture values.

// Begin script to update the Post Non-Residential with the sum of all Commercial (ASIT) Post Capacity values.
include("UPDATE_POST_CAPACITY_COUNT_COMMERCIAL");
// End script to update the Post Non-Residential with the sum of all Commercial (ASIT) Post Capacity values.

// Begin script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.
include("UPDATE_CREDIT_AMOUNT_GRANTED");
// End script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.

// Begin script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count (ASI) minus Current Fixture Unit Count (ASI)
include("UPDATE_PROPOSED_WATER_USAGE_CREDIT");
// End script to update the Proposed Water Usage (ASI) with the result of the Post Fixture Unit Count (ASI) minus Current Fixture Unit Count (ASI)