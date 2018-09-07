// Begin script to associate base premise to water permit
include("LINK_BASE_PREMISE_TO_RECORD");
// End script to associate base premise to water permit

// Begin script that copies data from Base Premise record to Water Use Permit record.
include("COPY_BASE_PREMISE_INFO_TO_WATER_PERMIT");
// End script that copies data from Base Premise record to Water Use Permit record.

// Begin script to find Base Premise records by parcel and relate as parent
include("FIND_RELATE_BASE_PREMISE");
// End script to find Base Premise records by parcel