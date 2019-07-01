// Begin script to update the Current Fixture County and Current 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Fixture values.
include("UPDATE_CURRENT_FIXTURE_UNIT_COUNT");
// End script to update the Current Fixture County and Current 2nd Bath Fixture (ASI) with the sum of all Residential Fixture (ASIT) Fixture values.

// Begin script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values. Also updates the current count.
include("UPDATE_POST_FIXTURE_UNIT_COUNT");
// End script to update the Post Fixture County (ASI) with the sum of all Residential Fixture (ASIT) Post Fixture values.

// Begin script to update the Non-Residential Current Fixture Count with the sum of all Commercial (ASIT) Fixture values.
include("UPDATE_CURRENT_FIXTURE_UNIT_COUNT_COMMERCIAL");
// End script to update the Non-Residential Current Fixture Count with the sum of all Commercial (ASIT) Fixture values.

// Begin script to update the Post Non-Residential with the sum of all Commercial (ASIT) Post Capacity values.
include("UPDATE_POST_CAPACITY_COUNT_COMMERCIAL");
// End script to update the Post Non-Residential with the sum of all Commercial (ASIT) Post Capacity values.

// Begin script to convert old fixture names to new ones and add the sort order
include("UPDATE_FIXTURE_TYPE_AND_SORT_ORDER");
// End script to convert old fixture names to new ones and add the sort order

// Begin script to copy the Transfer of Title Date field to the B1PERMIT.REC_DATE field for reporting
include("UPDATE_REC_DATE_WITH_TOT");
// End script to copy the Transfer of Title Date field to the B1PERMIT.REC_DATE field for reporting