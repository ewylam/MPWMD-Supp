function getDenialAge(c) {
	
	var r = aa.workflow.getHistory(c);
	if (r.getSuccess()) {
		var wh = r.getOutput();
		for (var i in wh) {

		fTask = wh[i];
			var t = fTask.getTaskDescription();
			var s = fTask.getDisposition();
			var d = fTask.getStatusDate();
			if ((t.equals("Initial Review") || t.equals("Supervisory Review")) && s.equals("Denied")) {
				logDebug("Found a denial " + d);
				logDebug(new Date(d.getTime()));
				var today = new Date();
				today.setHours(0); today.setMinutes(0); today.setSeconds(0); today.setMilliseconds(0);
				return (new Date(today)-new Date(d.getTime()))/(1000*60*60*24);
				}
			}
	}
}
