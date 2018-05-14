try {
aa.print("1) Here in sendEmailToContactsASync: " + aa.env.getValue("eventType"));

//Get environmental variables pass into the script
var sendEmailToContactTypes = aa.env.getValue("sendEmailToContactTypes");
var emailTemplate = aa.env.getValue("emailTemplate");
var vEParams = aa.env.getValue("vEParams");
var reportTemplate = aa.env.getValue("reportTemplate");
var vRParams = aa.env.getValue("vRParams");
var vChangeReportName = aa.env.getValue("vChangeReportName");
var capId = aa.env.getValue("CapId");
var vAddAdHocTask = aa.env.getValue("vAddAdHocTask");

aa.print("2) sendEmailToContactTypes: " + sendEmailToContactTypes);
aa.print("3) emailTemplate: " + emailTemplate);
aa.print("4) reportTemplate: " + reportTemplate);

//Set variables used in the script
var tmpl;
var conTypeArray = [];
var conType;
var validConTypes;
var conObjEmailArray = [];
var conObjNonEmailArray = [];
var conObjEmailCompareArray = [];
var conObjNonEmailCompareArray = [];
var v = 0;
var w = 0;
var x = 0;
var y = 0;
var z = 0;
var conEmail;
var peopTemp;
var vConObjArry;
var vConObj;
var vConRefSeqNbr;
var vPrimaryContactOnly = false;
var mailFrom;
var capId4Email;
var vReportName;
var vDocumentList;
var vDocumentModel;
var vDocumentName;
var vDocumentNumber;
var vACAUrl;
var vDocumentACAUrl;
var vAdHocProcess = "ADHOC_WORKFLOW";
var vAdHocTask = "Manual Notification";
var vAdHocNote;
var vAdHocAssignDept;
var vEParamsToSend;

//Start modification to support batch script, if not batch then grab globals, if batch do not.
if (aa.env.getValue("eventType") != "Batch Process") {
	/* Begin Code needed to call master script functions ---------------------------------------------------*/
	function getScriptText(vScriptName, servProvCode, useProductScripts) {
		if (!servProvCode)
			servProvCode = aa.getServiceProviderCode();
		vScriptName = vScriptName.toUpperCase();
		var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
		try {
			if (useProductScripts) {
				var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
			} else {
				var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
			}
			return emseScript.getScriptText() + "";
		} catch (err) {
			return "";
		}
	}
	var SCRIPT_VERSION = 3.0;
	aa.env.setValue("CurrentUserID", "ADMIN");
	eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, true));
	eval(getScriptText("INCLUDES_ACCELA_GLOBALS", null, true));
	eval(getScriptText("INCLUDES_CUSTOM", null, true));
} else {
	var balanceDue;
	var capDetailObjResult = aa.cap.getCapDetail(capId);
	if (capDetailObjResult.getSuccess()) {
		capDetail = capDetailObjResult.getOutput();
		balanceDue = capDetail.getBalance();
	}
}
/* End Code needed to call master script functions -----------------------------------------------------*/

logDebug("1) Here in SEND_EMAIL_TO_CONTACTS_ASYNC: " + aa.env.getValue("eventType"));
logDebug("2) sendEmailToContactTypes: " + sendEmailToContactTypes);
logDebug("3) emailTemplate: " + emailTemplate);
logDebug("4) reportTemplate: " + reportTemplate);

/* Begin SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */

if (reportTemplate == "Payment Reminder" && balanceDue == '0') {
	logDebug("Cancelling sendEmailToContactsASync. Report is a Payment Reminder and balanceDue is 0.")
} else {
	logDebug("5) balanceDue: " + balanceDue);
	logDebug("6) vAddAdHocTask: " + vAddAdHocTask);
	/* End SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */
	//Get valid array of contact types
	validConTypes = getContactTypes_BCC();

	//Add standard email variables from record information
	vEParams = addStdVarsToEmail(vEParams, capId);

	//Set Ad-Hoc Task Information
	if (vAddAdHocTask) {
		vAdHocAssignDept = "LICENSE/LICENSE/PROCESS/NA/NA/NA";
	}

	//Check to see if provided contact type(s) is/are valid
	if (sendEmailToContactTypes != "All" && sendEmailToContactTypes != null && sendEmailToContactTypes != '') {
		conTypeArray = sendEmailToContactTypes.split(",");
	}
	for (x in conTypeArray) {
		//check all that are not "Primary"
		vConType = conTypeArray[x];
		if (vConType != "Primary" && !exists(vConType, validConTypes)) {
			logDebug(vConType + " is not a valid contact type. No actions will be taken for this type.");
			//Drop bad contact type from array;
			conTypeArray.splice(x, (x + 1));
		}
	}

	//If supplied value is "All" or null check and send to all contact types
	if (sendEmailToContactTypes == "All" || sendEmailToContactTypes == null || sendEmailToContactTypes == '') {
		conTypeArray = validConTypes;
	}

	//get From email from template configuration
	if (emailTemplate && emailTemplate != '') {
		tmpl = aa.communication.getNotificationTemplate(emailTemplate).getOutput();
		mailFrom = tmpl.getEmailTemplateModel().getFrom();
	}

	//Get Contacts based on type for each type provided
	for (z in conTypeArray) {
		conType = conTypeArray[z];
		conEmail = null;
		peopTemp = null;
		logDebug("          Searching for " + conTypeArray[z]);
		if (conType == "Primary") {
			vConObjArry = getContactObjsByCap_BCC(capId);
		} else {
			vConObjArry = getContactObjsByCap_BCC(capId, conTypeArray[z]);
		}
		for (x in vConObjArry) {
			vConObj = vConObjArry[x];
			vConRefSeqNbr = vConObj.refSeqNumber;
			//Get contact email
			if (vConObj) {
				conEmail = vConObj.people.getEmail();
				if (conEmail && conEmail != null && conEmail != "") {
					conEmail = conEmail.toUpperCase();
				} else {
					logDebug("No Email for this one");
				}
			}

			logDebug("vAddAdHocTask: " + (vAddAdHocTask ? "YES" : "NO"));
			logDebug("conEmail == null || conEmail == '': " + ((conEmail == null || conEmail == "") ? "YES" : "NO"));
			logDebug("conType != Primary: " + ((conType != "Primary") ? "YES" : "NO"));
			logDebug("!exists(vConRefSeqNbr, conObjNonEmailCompareArray): " + ((!exists(vConRefSeqNbr, conObjNonEmailCompareArray)) ? "YES" : "NO"));

			//Save contact email to array (primary)
			if (conEmail && conEmail != "" && conType == "Primary" && vConObj.capContact.getPrimaryFlag() == 'Y' && !exists(conEmail, conObjEmailCompareArray)) {
				logDebug("          Adding (Primary) " + conEmail + " to email array");
				conObjEmailArray.push(vConObj);
				conObjEmailCompareArray.push(conEmail); //Needed to make sure contact is only send one email if they have more than one role
			}
			//Save contact email to array (All or specified)
			else if (conEmail && conEmail != "" && conType != "Primary" && !exists(conEmail, conObjEmailCompareArray)) {
				logDebug("          Adding " + conEmail + " to email array");
				conObjEmailArray.push(vConObj);
				conObjEmailCompareArray.push(conEmail); //Needed to make sure contact is only sent one email if they have more than one role
			}
			//Add contact to non-email arrary to be used for the Ad-Hoc Task if no email is provided (Primary)
			else if (vAddAdHocTask && (conEmail == null || conEmail == "") && conType == "Primary" && vConObj.capContact.getPrimaryFlag() == 'Y' && !exists(vConRefSeqNbr, conObjNonEmailCompareArray)) {
				logDebug("          Adding " + conType + " to non-email array");
				conObjNonEmailArray.push(vConObj);
				conObjNonEmailCompareArray.push(vConRefSeqNbr); //Needed to make sure contact is only send one email if they have more than one role
			}
			//Add contact to non-email arrary to be used for the Ad-Hoc Task if no email is provided (All or specified)
			else if (vAddAdHocTask && (conEmail == null || conEmail == "") && conType != "Primary" && !exists(vConRefSeqNbr, conObjNonEmailCompareArray)) {
				conObjNonEmailArray.push(vConObj);
				logDebug("          Adding " + conType + " to non-email array");
				conObjNonEmailCompareArray.push(vConRefSeqNbr); //Needed to make sure contact is only send one email if they have more than one role
			}
		}
	}

	//Get the capId type needed for the email function
	capId4Email = null;
	capId4Email = aa.cap.createCapIDScriptModel(capId.getID1(), capId.getID2(), capId.getID3());

	//Get ACA Url
	vACAUrl = lookup("ACA_CONFIGS", "ACA_SITE");
	vACAUrl = vACAUrl.substr(0, vACAUrl.toUpperCase().indexOf("/ADMIN"));

	//Generate report and get report name
	vReportName = false;
	if (reportTemplate != '' && reportTemplate != null) {
		//generate and get report file
		vReportName = generateReportForEmail_BCC(capId, reportTemplate, aa.getServiceProviderCode(), vRParams);

		//update the report name if one was provided. this will be used to update the saved report's name
		if (vReportName != false && vChangeReportName != null && vChangeReportName != "") {
			logDebug("Renaming generated report document name from " + vReportName + " to " + vChangeReportName);
			if (editDocumentName(vReportName, vChangeReportName) == true) {
				vReportName = vChangeReportName;
			}
		}
	}

	//Get document deep link URL
	if (vReportName != null && vReportName != false) {
		vDocumentList = aa.document.getDocumentListByEntity(capId, "CAP");
		if (vDocumentList != null) {
			vDocumentList = vDocumentList.getOutput();
		}
	}

	if (vDocumentList != null) {
		for (y = 0; y < vDocumentList.size(); y++) {
			vDocumentModel = vDocumentList.get(y);
			vDocumentName = vDocumentModel.getFileName();
			if (vDocumentName == vReportName) {
				//Add the document url to the email paramaters using the name: $$acaDocDownloadUrl$$
				getACADocDownloadParam4Notification(vEParams, vACAUrl, vDocumentModel);
				logDebug("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
				aa.print("including document url: " + vEParams.get('$$acaDocDownloadUrl$$'));
				break;
			}
		}
	}

	//Loop through the contact objects with email and send to each
	for (w in conObjEmailArray) {
		vConObj = conObjEmailArray[w];
		//Get contact email
		if (vConObj) {
			conEmail = vConObj.people.getEmail();
		}
		//get clean email paramaters
		vEParamsToSend = vEParams;
		//Set contact specific email paramaters
		vEParamsToSend = vConObj.getEmailTemplateParams(vEParams);
		//Set contact Name paramaters
		addParameter(vEParamsToSend, "$$FullNameBusName$$", getContactName_BCC(vConObj));
		//Add Contact Trade Name
		if (vConObj.people.getTradeName() != null) {
			addParameter(vEParamsToSend, "$$TradeName$$", vConObj.people.getTradeName())
		}
		//Send email
		logDebug("Email Sent: " + aa.document.sendEmailAndSaveAsDocument(mailFrom, conEmail, "", emailTemplate, vEParamsToSend, capId4Email, null).getSuccess());
		logDebug("SEND_EMAIL_TO_CONTACTS_ASYNC: " + capId.getCustomID() + ": Sending " + emailTemplate + " from " + mailFrom + " to " + conEmail);
	}

	//Loop through the contact objects without email and update the Ad-Hoc Note
	for (v in conObjNonEmailArray) {
		vConObj = conObjNonEmailArray[v];
		if (v == 0) {
			vAdHocNote = vConObj.type + " - " + getContactName_BCC(vConObj);
		} else {
			vAdHocNote = vAdHocNote + ", " + vConObj.type + " - " + getContactName_BCC(vConObj);
		}
	}
	//Add Email Template to Note
	vAdHocNote = emailTemplate + ", " + vAdHocNote;

	logDebug("Create AddHocTask: " + vAddAdHocTask);

	//Add Ad-Hoc if needed
	if (vAddAdHocTask && conObjNonEmailArray.length > 0) {
		logDebug("Adding adHoc Task for " + vAdHocNote);
		addAdHocTaskAssignDept_BCC(vAdHocProcess, vAdHocTask, vAdHocNote, vAdHocAssignDept);
	}
	/* Begin SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */
}
/* End SDOT work-around to prevent payment notices on auto-approved (paid) ACA submissions */
} catch (err) { logDebug("Error in SEND_EMAIL_TO_CONTACTS_ASYNC : " + err.message); }
