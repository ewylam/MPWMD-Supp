function slackDebug(msg) {
	
	var headers=aa.util.newHashMap();

    headers.put("Content-Type","application/json");
	
    var body = {};
	body.text = aa.getServiceProviderCode() + ":" + ENVIRON + ": " + msg;
	
	//body.attachments = [{"fallback": "Full Debug Output"}];
	//body.attachments[0].text = debug;
	
    var apiURL = "https://hooks.slack.com/services/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";
	
	
    var result = aa.httpClient.post(apiURL, headers, JSON.stringify(body));
    if (!result.getSuccess()) {
        logDebug("Slack get anonymous token error: " + result.getErrorMessage());
	} else {	
		aa.print("Slack Results: " + result.getOutput());
        }
  	}
	