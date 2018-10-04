// Begin script to ensure number of meter splits matches the meters table
var vNumberRequested = getAppSpecific("Number of Meters Requested");
logDebug(vNumberRequested);
var vMetersASIT = loadAppSpecTableBefore("METERS");
logDebug(vMetersASIT);

cancel = true;
showDebug = true;
// End script to ensure number of meter splits matches the meters table
