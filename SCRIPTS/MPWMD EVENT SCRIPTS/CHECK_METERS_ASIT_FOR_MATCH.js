// Begin script to ensure number of meter splits matches the meters table
var vNumberRequested = getAppSpecific("Number of Meters Requested");
var vMetersASIT = loadASITable("METERS");

if (vNumberRequested > vMetersASIT.length) {
	cancel = true;
	showMessage = true;
	comment("Please ensure the number of rows in the 'Meters' table matches the 'Number of Meters Requested'.");
}
// End script to ensure number of meter splits matches the meters table
