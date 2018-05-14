function editFileDate(vStatus) {
	var itemCap = capId;
	var capResult;
	var vCap;
	var vCapModel;
	var setStatusResult;
	if (arguments.length == 2) {
		itemCap = arguments[1]; // use cap ID specified in args
	}

	capResult = aa.cap.getCap(itemCap);

	if (!capResult.getSuccess()) {
		aa.print("**WARNING: error getting cap : " + capResult.getErrorMessage());
		return false
	}
	
	vCap = capResult.getOutput();
	
	vCapModel = capResult.getOutput().getCapModel();
	vCapModel.setAuditStatus(vStatus);
	setStatusResult = aa.cap.editCapByPK(vCapModel);

	if (!setStatusResult.getSuccess()) {
		aa.print("**WARNING: error setting cap name : " + setNameResult.getErrorMessage());
		return false
	}
	aa.print("Updated Audit Status");
	return true;
}


