// Set connection information
var vURL = "https://data.energystar.gov/resource/v32c-ywkg.json"; // ENERGY STAR Certified Residential Dishwashers
var vParms = null; //= "API=Verify&XML=<AddressValidateRequest%20USERID=%22" + USPSUser + "%22><Address ID=%220%22><Address1></Address1><Address2></Address2><City></City><State></State><Zip5></Zip5><Zip4></Zip4></Address></AddressValidateRequest>";
var x = 0;

// Submit address info to USPS for verification
var rootNode = aa.util.httpPost(vURL, vParms);
var vRootJSONObject;
var vEquipmentObject;
var vParentID;
var vChildID;
var vDDName = "Residential Rebates";

if (rootNode.getSuccess() == true) {
	vRootJSONObject = JSON.parse(rootNode.getOutput());
	x = 0;
	//aa.print(rootNode.getOutput());
	for (x in vRootJSONObject) {
		vEquipmentObject = vRootJSONObject[x];
		// Populate Shared Drop Down List
		vParentID = addLookup("RESIDENTIAL_REBATES_MAKE", vEquipmentObject.brand_name, vEquipmentObject.brand_name);
		// Populate Model Shared Drop Down List
		vChildID = addLookup("RESIDENTIAL_REBATES_MODEL", vEquipmentObject.model_number, vEquipmentObject.model_number);
		// Create Drill Down Value Map
		createASITableDrillDValMap(vDDName, vParentID, vChildID)
	}
} else {
	aa.print(rootNode.getErrorMessage());
}

// Kenmore - 105556269
// Child = 105556270, 105556271

// Functions Below //
function addLookup(stdChoice, stdValue, stdDesc) {
	//check if stdChoice and stdValue already exist; if they do, don't add
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice, stdValue);
	var vBizID;
	if (bizDomScriptResult.getSuccess()) {
		aa.print("Standard Choices Item " + stdChoice + " and Value " + stdValue + " already exist.  Lookup is not added or updated.");
		vBizID = bizDomScriptResult.getOutput().getDispositionID();
		return vBizID;
	}

	//Proceed to add
	var strControl;

	if (stdChoice != null && stdChoice.length && stdValue != null && stdValue.length && stdDesc != null && stdDesc.length) {
		var bizDomScriptResult = aa.bizDomain.createBizDomain(stdChoice, stdValue, "A", stdDesc)

			if (bizDomScriptResult.getSuccess()) {
				//check if new Std Choice actually created
				aa.print("Successfully created Std Choice(" + stdChoice + "," + stdValue + ") = " + stdDesc);
				vBizID = bizDomScriptResult.getOutput().getDispositionID();
				return vBizID;
			}
			else {
				aa.print("**ERROR creating Std Choice " + bizDomScriptResult.getErrorMessage());
			}
	} else
		aa.print("Could not create std choice, one or more null values");
}

function createASITableDrillDValMap(pDDName, pParentID, pChildID) {

	var vDDModel = aa.asiDrillDown.getASITableDrillDownModel().getOutput();
	vDDModel.setServProvCode('MPWMD');
	vDDModel.setDrillName(pDDName);

	vDDModel = aa.asiDrillDown.getASIDrillDown(vDDModel).getOutput().toArray();
	vDDModel = vDDModel[0];

	vDDModelID = vDDModel.getDrillId();

	var vDDSeriesModel = aa.asiDrillDown.getASIDrillDownSeries(vDDModelID).getOutput().toArray()
		vDDSeriesModel = vDDSeriesModel[0];

	vDDSeriesModelID = vDDSeriesModel.getDrillDSeriesId();

	var vValMap = aa.asiDrillDown.getASITableDrillDValMapModel().getOutput();
	vValMap.setServProvCode('MPWMD');
	vValMap.setRecDate(new Date());
	vValMap.setRecFulNam('ADMIN');
	vValMap.setDrillDId(vDDModelID);
	vValMap.setDrillDSeriesId(vDDSeriesModelID);
	vValMap.setParentValueId(pParentID);
	vValMap.setChildValueId(pChildID);
	vValMap.setRecStatus('A');

	var vResult = aa.asiDrillDown.createASITableDrillDValMap([vValMap]);
	aa.print(vResult.getSuccess());
	aa.print(vResult.getErrorMessage());
	return vResult.getSuccess();
}
