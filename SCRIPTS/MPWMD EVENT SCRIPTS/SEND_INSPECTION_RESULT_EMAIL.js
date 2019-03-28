// Begin Script to send inspection emails to Applicant
var vTemplateName;
var vEParams;
var vStaffFirstName;
var vStaffMiddleName;
var vStaffLastName;
var vStaffFullName;

if (inspResult.indexOf("Fail") != -1) {
	vTemplateName = "MP_INSPECTION_FAIL";
}
if (inspResult == "Pass") {
	vTemplateName = "MP_INSPECTION_PASS";
}
if (vTemplateName != null && vTemplateName != '') {
	// create staff full name value
	vStaffFirstName = aa.env.GetValue("StaffFirstName");
	vStaffMiddleName = aa.env.GetValue("StaffMiddleName");
	vStaffLastName = aa.env.GetValue("StaffLastName");
	if (vStaffFirstName != null && vStaffFirstName != "") {
		vStaffFullName = vStaffFirstName;
	}
	if (vStaffMiddleName != null && vStaffMiddleName != "") {
		if (vStaffFirstName != null && vStaffFirstName != "") {
			vStaffFullName = vStaffFullName + " " + vStaffMiddleName;
		} else {
			vStaffFullName = vStaffMiddleName;
		}
	}
	if (vStaffLastName != null && vStaffLastName != "") {
		if ((vStaffFirstName != null && vStaffFirstName != "") || (vStaffMiddleName != null && vStaffMiddleName != "")) {
			vStaffFullName = vStaffFullName + " " + vStaffLastName;
		} else {
			vStaffFullName = vStaffLastName;
		}
	}
	// populate email parameters
	vEParams = aa.util.newHashtable();
	addParameter(vEParams, "$$CAPPARCEL$$", getPrimaryParcel());
	addParameter(vEParams, "$$InspectionDate$$", inspResultDate);
	addParameter(vEParams, "$$InspectorFullName$$", vStaffFullName);
	addParameter(vEParams, "$$InspectionType$$", inspResultDate);
	addParameter(vEParams, "$$Comments$$", inspComment);

	// send email
	emailContactsWithReportLinkASync('Applicant', vTemplateName, vEParams);
}
// End Script to send inspection emails to Applicant
