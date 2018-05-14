function handleError(err,context) {
	var rollBack = false;
	var showError = true;

	if (showError) showDebug = true;
	//logDebug((rollBack ? "**ERROR** " : "ERROR: ") + err.message + " In " + context + " Line " + err.lineNumber);
    logDebug("ERROR: " + err.message + " In " + context + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
	
	// Log to Slack Channel in ETechConsultingLLC.slack.com BCC_EMSE_Debug
	
	var headers=aa.util.newHashMap();

    headers.put("Content-Type","application/json");
	
    var body = {};
	body.text = aa.getServiceProviderCode() + ":" + ENVIRON + ":" + err.message + " In " + context + " Line " + err.lineNumber + "Stack: " + err.stack;
	body.attachments = [{"fallback": "Full Debug Output"}];
	body.attachments[0].text = debug;
	
	// default to support.
	var apiURL = "https://hooks.slack.com/services/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";
	
	if (ENVIRON.equals("TEST")) {
		var apiURL = "https://hooks.slack.com/services/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";
		}

	if (ENVIRON.equals("PROD")) {
		var apiURL = "https://hooks.slack.com/services/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";
		}
				
    var result = aa.httpClient.post(apiURL, headers, JSON.stringify(body));
    if (!result.getSuccess()) {
        logDebug("Slack get anonymous token error: " + result.getErrorMessage());
	} else {	
		aa.print("Slack Results: " + result.getOutput());
        }
  	}
	