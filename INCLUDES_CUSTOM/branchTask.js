
function branchTask(wfstr,wfstat,wfcomment,wfnote) { // optional process name, cap id
                
                var useProcess = false;
                var processName = "";
                if (arguments.length > 4) 
                                {
                                if (arguments[4] != "")
                                                {
                                                processName = arguments[4]; // subprocess
                                                useProcess = true;
                                                }
                                }
                var itemCap = capId;
                if (arguments.length == 6) {
					itemCap = arguments[5]; // use cap ID specified in args
				}
                
                var workflowResult = aa.workflow.getTasks(itemCap);
               if (workflowResult.getSuccess()) {
                                var wfObj = workflowResult.getOutput();
			   }
                else
                                { logMessage("**ERROR: Failed to get workflow object: " + s_capResult.getErrorMessage()); return false; }
                
                if (!wfstat) {
					wfstat = "NA";
				}
                
				var i;
                for (i in wfObj)
                                {
                                var fTask = wfObj[i];
                               if (fTask.getTaskDescription().toUpperCase().equals(wfstr.toUpperCase())  && (!useProcess || fTask.getProcessCode().equals(processName)))
                                                {
                                                var dispositionDate = aa.date.getCurrentDate();
                                                var stepnumber = fTask.getStepNumber();
                                                var processID = fTask.getProcessID();

                                                if (useProcess) {
                                                    aa.workflow.handleDisposition(itemCap,stepnumber,processID,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"B");
												}
                                                else {
                                                    aa.workflow.handleDisposition(itemCap,stepnumber,wfstat,dispositionDate, wfnote,wfcomment,systemUserObj ,"B");
                                                }
                                                logMessage("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching...");
                                                logDebug("Closing Workflow Task: " + wfstr + " with status " + wfstat + ", Branching...");
                                                }                                              
                                }
                }
