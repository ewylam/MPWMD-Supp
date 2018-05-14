function editFileDate(newdate) {
	var itemCap = capId;
	var capResult;
	var vCap;
	var vCapModel;
	var setDateResult;
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
	vCapModel.setFileDate(newdate);
	setDateResult = aa.cap.editCapByPK(vCapModel);

	if (!setDateResult.getSuccess()) {
		aa.print("**WARNING: error setting cap name : " + setNameResult.getErrorMessage());
		return false
	}
	aa.print("Updated File Date");
	return true;
}