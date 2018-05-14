function getRequiredDocuments(isPageFlow) {

	logDebug("start getRequiredDocuments(" + [].slice.call(arguments) + ")");

	//TODO: put in checks to validate record types and reference conditions.
	var capToUse = capId;
	if (isPageFlow) {
		capToUse = cap;
	}
	var requirementArray = [];

	/*------------------------------------------------------------------------------------------------------/
	| Load up Record Types : NEEDS REVIEW, map variables to record types
	/------------------------------------------------------------------------------------------------------*/
	var isMedical = appMatch("Licenses/Medical Cannabis/*/*");
	var isAdultUse = appMatch("Licenses/Adult Use Cannabis/*/*");
	var isCannabis = appMatch("Licenses/Cannabis/*/*"); // combined

	var isApplication = appMatch("Licenses/*/*/Application");
	var isAttestationAmendment = appMatch("Licenses/*/*/Incomplete Attestation");
	var isRenewal = appMatch("Licenses/*/*/Renewal");
	var isOwner = appMatch("Licenses/*/*/Owner Submittal");
	var isOwnerAttestation = appMatch("Licenses/Cannabis/Application Amendment/Incomplete Attestation");
	var isCEOAttestation = appMatch("Licenses/Cannabis/Event Organzier/Incomplete Attestation");
	var isTemporaryEventAttestation = appMatch("Licenses/Cannabis/Temporary Event/Incomplete Attestation");

	var isDispensary = appMatch("Licenses/*/Dispensary/*"); // No longer exists
	var isProducingDispensary = appMatch("Licenses/*/Producing Dispensary/*"); // No longer exists
	var isDistributor = appMatch("Licenses/*/Distributor/*"); // Type A11, M11
	var isTesting = appMatch("Licenses/*/Testing/*"); // Type 8
	var isTransporter = appMatch("Licenses/*/Transporter/*"); // No longer exists
	var isRetailer = appMatch("Licenses/*/Retailer/*"); // Type A10, M10
	var isRetailerNonStore = appMatch("Licenses/*/Retailer Nonstorefront/*"); // Type A9, M9
	var isMicroBusiness = appMatch("Licenses/*/Microbusiness/*"); // Type A12, M12
	var isDistribTransportOnly = appMatch("Licenses/*/Distributor-Transport Only/*"); // Type A13, M13
	var isDeficiency = appMatch("Licenses/*/*/Attestation Deficiency");
	var isEventOrganizer = appMatch("Licenses/*/Event Organizer/*");
	var isTemporaryEvent = appMatch("Licenses/*/Temporary Event/*");


	/*------------------------------------------------------------------------------------------------------/
	| Load up Workflow Requirements :
	/------------------------------------------------------------------------------------------------------*/
	var wfStopAll = [{
			task: "Initial Review",
			status: "Recommend Approval - Temporary"
		}, {
			task: "Initial Review",
			status: "Recommend Approval"
		}, {
			task: "Supervisory Review",
			status: "Approved"
		}, {
			task: "Supervisory Review",
			status: "Provisionally Approved"
		}, {
			task: "Supervisory Review",
			status: "Temporarily Approved"
		}
	];
	var wfStopPermanentOnly = [{
			task: "Initial Review",
			status: "Recommend Approval"
		}, {
			task: "Supervisory Review",
			status: "Approved"
		}, {
			task: "Supervisory Review",
			status: "Provisionally Approved"
		}, {
			task: "Review",
			status: "Review Completed"
		}
	];
	/*------------------------------------------------------------------------------------------------------/
	| Load up Standard Conditions :
	/------------------------------------------------------------------------------------------------------*/
	var businessFormationDocuments = {
		condition: "Business Formation Documents",
		document: "Business Formation Documents",
		workflow: wfStopPermanentOnly
	}; // 5006(b)(15)
	var financialInformation = {
		condition: "Financial Information",
		document: "Financial Information",
		workflow: wfStopPermanentOnly
	}; // 5006(b)(18)
	var documentationOfLocalCompliance = {
		condition: "Documentation of Local Authorization",
		document: "Documentation of Local Authorization",
		workflow: wfStopAll
	}; // 5006(b)(23)
	var laborPeaceAgreement = {
		condition: "Labor Peace Agreement",
		document: "Labor Peace Agreement",
		workflow: wfStopPermanentOnly
	}; // 5006(b)(26)
	var documentForLaborPeace = {
		condition: "Document for Labor Peace Requirement",
		document: "Document for Labor Peace Requirement",
		workflow: wfStopPermanentOnly

	}; // user story 2213
	var waiverOfSovereignImmunity = {
		condition: "Waiver of Sovereign Immunity",
		document: "Waiver of Sovereign Immunity",
		workflow: wfStopPermanentOnly
	}; // 5006(b)(33)
	var evidenceOfLegalRightToOccupy = {
		condition: "Evidence of Legal Right to Occupy the Proposed Location",
		document:  "Evidence of Legal Right to Occupy the Proposed Location",
		workflow: wfStopAll
	}; // 5006(b)(24)
	var proofOfSuretyBond = {
		condition: "Proof of Surety Bond",
		document: "Proof of Surety Bond",
		workflow: wfStopPermanentOnly
	}; // 5006(b)(28)
	var diagramOfPremises = {
		condition: "Premises Diagram",
		document: "Premises Diagram",
		workflow: wfStopAll
	}; // 5006(b)(28)
	/* no longer used see story 2062
	var operatingProceduresDistrib = {
	condition: "Operating Procedures - Distribution",
	document: "Operating Procedures"
	}; // 5006(b)(30)
	var operatingProceduresTransport = {
	condition: "Operating Procedures - Transport",
	document: "Operating Procedures"
	}; // 5006(b)(31)
	var operatingProceduresDispense = {
	condition: "Operating Procedures - Dispensary",
	document: "Operating Procedures"
	}; // 5006(b)(32)
	var operatingProceduresMicro = {
	condition: "Operating Procedures - MicroBusiness",
	document: "Operating Procedures"
	}; // AUMA regs
	var operatingProceduresTesting = {
	condition: "Operating Procedures - Testing",
	document: "Operating Procedures"
	}; // 5292 (a)
	 */
	var labEmployeeQualifications = {
		condition: "Laboratory Employee Qualifications",
		document: "Laboratory Employee Qualifications",
		workflow: wfStopPermanentOnly
	}; // 5238(b)
	var proofOfIsoAccreditationStatus = {
		condition: "Proof of ISO Accreditation Status",
		document: "Proof of ISO Accreditation Status",
		workflow: wfStopPermanentOnly
	}; // 5238(b)
	var submittedFingerPrintImages = {
		condition: "Submitted Application for Fingerprint Images",
		document: "Submitted Application for Fingerprint Images",
		workflow: wfStopPermanentOnly
	}; // 5238(b)
	var governmentIssuedIdentification = {
		condition: "Government-Issued Identification",
		document: "Government-Issued Identification",
		workflow: wfStopPermanentOnly
	}; // 5238(b)
	var descriptionOfConvictions = {
		condition: "Description of Convictions",
		document: "Description of Convictions",
		workflow: wfStopPermanentOnly
	}; // 5238(b)
	var proofOfMilitaryStatus = {
		condition: "Proof of Military Status",
		document: "Proof of Military Status",
		workflow: wfStopPermanentOnly
	}; // 5006(b)(4)
	var priorityProcessingRequest = {
		condition: "Priority Processing Request",
		document: "Priority Processing Request",
		workflow: wfStopPermanentOnly
	};
	var proofOfInsurance = {
		condition: "Proof of Commercial General Liability Insurance",
		document: "Proof of Commercial General Liability Insurance",
		workflow: wfStopPermanentOnly
	};
	var evidencePremiseLessThan600ft = {
		condition: "Evidence of Premise Less Than 600ft Compliance",
		document: "Evidence of Premise Less Than 600ft Compliance",
		workflow: wfStopPermanentOnly
	};

	var transportationProcess = {
		condition: "Transportation Procedures",
		document: "Transportation Procedures",
		workflow: wfStopPermanentOnly
	};
	var inventoryProcedures = {
		condition: "Inventory Procedures",
		document: "Inventory Procedures",
		workflow: wfStopPermanentOnly
	};
	var qualityControlProcedures = {
		condition: "Non-Laboratory Quality Control Procedures",
		document: "Non-Laboratory Quality Control Procedures",
		workflow: wfStopPermanentOnly
	};
	var securityProtocols = {
		condition: "Security Procedures",
		document: "Security Procedures",
		workflow: wfStopPermanentOnly
	};
	var standardOperatingProcedures = {
		condition: "Standard Operating Procedures",
		document: "Standard Operating Procedures",
		workflow: wfStopPermanentOnly
	};
	var powerSourceInformation = {
		condition: "Power Source Information",
		document: "Power Source Information",
		workflow: wfStopPermanentOnly
	};
	var cultivationPlan = {
		condition: "Cultivation Plan",
		document: "Cultivation Plan",
		workflow: wfStopPermanentOnly
	};
	var sourceOfWaterSupply = {
		condition: "Source of Water Supply",
		document: "Source of Water Supply",
		workflow: wfStopPermanentOnly
	};
	var evidenceofWaterQualityProtectionProgramExemption = {
		condition: "Evidence of Water Quality Protection Program/Exemption",
		document: "Evidence of Water Quality Protection Program/Exemption",
		workflow: wfStopPermanentOnly
	};
	var californiaDepartmentofFishandWildlifePermitExemption = {
		condition: "California Department of Fish and Wildlife Permit/Exemption",
		document: "California Department of Fish and Wildlife Permit/Exemption",
		workflow: wfStopPermanentOnly
	};
	var compliancewithWaterCode= {
		condition: "Compliance with Water Code",
		document: "Compliance with Water Code",
		workflow: wfStopPermanentOnly
	};
	var evidenceOfHazardousMaterialEnviroStorSearch = {
		condition: "Evidence of Hazardous Material EnviroStor Search",
		document: "Evidence of Hazardous Material EnviroStor Search",
		workflow: wfStopPermanentOnly
	};
	var otherExtractionMethod = {
		condition: "Other Extraction Method",
		document: "Other Extraction Method",
		workflow: wfStopPermanentOnly
	};
	//var foodProductSafetyViolationCircumstancesEvidenceRehabilitation = {
	//	condition: "Food Product Safety Violation Circumstances/Evidence/Rehabilitation",
	//	document: "Food Product Safety Violation Circumstances/Evidence/Rehabilitation",
	//	workflow: wfStopPermanentOnly
//	};
	var copyOfClosedLoopSystemCertification = {
		condition: "Copy of Closed-Loop System Certification",
		document: "Copy of Closed-Loop System Certification",
		workflow: wfStopPermanentOnly
	};
	var listOfCannabisProductsManufactured = {
		condition: "List of Cannabis Products Manufactured",
		document: "List of Cannabis Products Manufactured",
		workflow: wfStopPermanentOnly
	};
	var wasteManagementProcedures = {
		condition: "Waste Management Procedures",
		document: "Waste Management Procedures",
		workflow: wfStopPermanentOnly
	};
	var listOfInfusedProductsManufactured = {
		condition: "List of Infused Products Manufactured",
		document: "List of Infused Products Manufactured",
		workflow: wfStopPermanentOnly
	};
	var writtenApprovalFromLocalJurisdiction = {
		condition: "Written Approval From Local Jurisdiction",
		document: "Written Approval From Local Jurisdiction",
		workflow: wfStopPermanentOnly
	};
 var diagramOfEventLayout = {
	 condition: "Diagram of Event Layout",
	 document: "Diagram of Event Layout",
	 workflow: wfStopPermanentOnly
 };
	/*
	// removed user story 2229
	var chainOfCustodyProtocol = { condition: "Chain of Custody Protocol",document: "Chain of Custody Protocol"	};
	var labAnalysesStandard = {condition: "Laboratory Analyses Standard",document: "Laboratory Analyses Standard"	};
	var testingMethods = { condition: "Testing Methods",document: "Testing Methods"	};
	 */

	/*------------------------------------------------------------------------------------------------------/
	| Load up Conditionals from Record
	/------------------------------------------------------------------------------------------------------*/
	var isLargeEmployer = isASITrue(AInfo["20 or more employees?"]); // see user story 5135
	var isWaivingSovereignImmunity = isASITrue(AInfo["Are they Sovereign Entity"]); // see user story 5135, 1890
	var isPriorityRequest = isASITrue(AInfo["Are you requesting priority processing?"]); // see user story 340
	var isTemporaryRequest = isASITrue(AInfo["Are you requesting a temporary license?"]); // see user story 340
	var isLessThan600ft = isASITrue(AInfo["Attest no prohibited location Within specified requirement"]); //se user story 2203
	var needsLaborPeaceAgreement = isASITrue(AInfo["Attest they will abide to the Labor Peace Agreement"]); //see story 2213
	var hasDistributorTransportOnlyActivity = isASITrue(AInfo["Distributor-Transport Only"]); // see user story 2079
	var hasDistributorActivity = isASITrue(AInfo["Distributor"]); // see user story 2079
	var hasIsoLicense = isASITrue(AInfo["Accreditation/Provisional Testing Laboratory License"]); // see user story
	var isBusiActCult = isASITrue(AInfo["Cultivator (less than 10K sq ft)"]);//use story 2375
	var isBusiActMfct = isASITrue(AInfo["Level 1 Manufacturer"]);
	var isCultLicType = AInfo["Cultivation License Types"]
	var isExtOther = isASITrue(AInfo["Other Method"]);
	var isCanExtract = isASITrue(AInfo["Cannabis Extraction?"]);
	var isInfusionOper = isASITrue(AInfo["Infusion Operations?"]);
	//var isFoodProdSafe = isASITrue(AInfo["Food Product Safety Violation"])

	//set isTemporaryRequest = true if ASI field is null or ""
	if (AInfo["Are you requesting a temporary license?"] == null || AInfo["Are you requesting a temporary license?"] == "") {
		isTemporaryRequest = true;
	}

	logDebug("isTemporaryRequest: " + isTemporaryRequest);

	//check to see if a temporary license has already been issued
	var vWFTaskHistory = aa.workflow.getWorkflowHistory(capId, 'Issuance', null).getOutput();
	var vTaskModel;
	var vTaskStatus;
	var x = 0;
	for (x in vWFTaskHistory) {
		vTaskModel = vWFTaskHistory[x];
		vTaskStatus = vTaskModel.getDisposition();
		if (vTaskStatus == 'Temporarily Issued') {
			isTemporaryRequest = false;
			break;
		}
	}

	if (isAttestationAmendment) {
		isTemporaryRequest = false;
		}

	var isCriminal = false;
	var isSoleOwner = false;
	isMilitary = isASITrue(AInfo["Military Service"]);

	/* etw
	var ownerApplicant = getContactObj(capToUse, "Owner Applicant");
	if (ownerApplicant && ownerApplicant.asi) {
	isCriminal = isASITrue(ownerApplicant.asi["Criminal Convictions"]);
	}
	 */

	/* etw
	var businessOwner = getContactObj(capToUse, "Business Owner");
	if (businessOwner && businessOwner.asi) {
	isCriminal = isASITrue(businessOwner.asi["Criminal Convictions"]);

	}
	 */

	var business = getContactObj(capToUse, "Business");
	if (business && business.asi) {
		isSoleOwner = business.asi["What is your business's organizational structure?"] == "Sole Proprietorship";
	}

	/*------------------------------------------------------------------------------------------------------/
	| Business Rules : NEEDS REVIEW, map variables to standard condition
	/------------------------------------------------------------------------------------------------------*/
	//Set Temporary Event requirements user story 2619
	if (isTemporaryEvent || isTemporaryEventAttestation) {
		requirementArray.push(writtenApprovalFromLocalJurisdiction);
		requirementArray.push(diagramOfEventLayout);
	}

	// Set Renewal requirements user story 53
	if (isRenewal) {
		if (isWaivingSovereignImmunity) {
				requirementArray.push(waiverOfSovereignImmunity);
			}
	}
	
	// Set Event Organizer requirements user story 2250 + story 2643 for temp
	if((isEventOrganizer || isCEOAttestation) && !isTemporaryRequest) {
    // only these reqs
		//requirementArray.push(evidenceOfLegalRightToOccupy);
		//requirementArray.push(diagramOfPremises);
		//requirementArray.push(proofOfSuretyBond); //not needed for temp
		requirementArray.push(financialInformation); //not needed for temp
		requirementArray.push(businessFormationDocuments);
		//requirementArray.push(transportationProcess);
		//requirementArray.push(inventoryProcedures);
		//requirementArray.push(securityProtocols);
		//requirementArray.push(proofOfInsurance);



		//dynamic requirements
		if (isLargeEmployer) {
			if (needsLaborPeaceAgreement) {
				requirementArray.push(laborPeaceAgreement);
			} else {
				requirementArray.push(documentForLaborPeace);
			}
		}
		if (isWaivingSovereignImmunity) {
			requirementArray.push(waiverOfSovereignImmunity);
		}
	
	}

	if (isOwner || isOwnerAttestation) {
		// removed requirement 5/24 after sprint story acceptance per Connie
		//requirementArray.push(submittedFingerPrintImages);
		requirementArray.push(governmentIssuedIdentification);

		/* etw
		// Removed doc requirement per Connie 5/24 sprint acceptance meeting
		if (isCriminal) {
		requirementArray.push(descriptionOfConvictions);
		}
		 */

		// etw
		if (isMilitary) {
			requirementArray.push(proofOfMilitaryStatus);
		}
	}

	/*
	if (isOwner) {
	if (isMilitary) {
	requirementArray.push(proofOfMilitaryStatus);
	}
	}
	 */

	if ((isApplication || isAttestationAmendment) && !isOwnerAttestation && !isEventOrganizer && !isCEOAttestation && !isTemporaryEvent && !isTemporaryEventAttestation) {
		// if full app, add all requirements
		if (!isTemporaryRequest) {
			requirementArray.push(evidenceOfLegalRightToOccupy);
			requirementArray.push(diagramOfPremises);
			requirementArray.push(proofOfSuretyBond); //not needed for temp
			requirementArray.push(financialInformation); //not needed for temp
			requirementArray.push(businessFormationDocuments);

			//dynamic requirements
			if (isPriorityRequest) {
				requirementArray.push(priorityProcessingRequest);
			}

			if (isLargeEmployer) {
				if (needsLaborPeaceAgreement) {
					requirementArray.push(laborPeaceAgreement);
				} else {
					requirementArray.push(documentForLaborPeace);
				}
			}
			if (isWaivingSovereignImmunity) {
				requirementArray.push(waiverOfSovereignImmunity);
			}

			if (isLessThan600ft) {
				requirementArray.push(evidencePremiseLessThan600ft);
			}

			if (hasIsoLicense) {
				requirementArray.push(proofOfIsoAccreditationStatus)
			}

			if (isDistributor || isRetailer || isRetailerNonStore || isMicroBusiness || isDistribTransportOnly) {
				// user story 2062
				requirementArray.push(transportationProcess);
				requirementArray.push(inventoryProcedures);
				requirementArray.push(securityProtocols);
			}

			if (isDistributor || isRetailer || isRetailerNonStore || isMicroBusiness) {
				// user story 2310
				requirementArray.push(qualityControlProcedures);
			}

			if (isTesting) {
				// user story 2062
				requirementArray.push(standardOperatingProcedures);
			}

			if (isDistributor || isDistribTransportOnly || (isMicroBusiness && (hasDistributorActivity || hasDistributorTransportOnlyActivity))) {
				//use story 2079
				requirementArray.push(proofOfInsurance);
			}

			if (isBusiActCult){
				requirementArray.push(cultivationPlan);
				requirementArray.push(sourceOfWaterSupply);
				requirementArray.push(evidenceofWaterQualityProtectionProgramExemption);
				requirementArray.push(californiaDepartmentofFishandWildlifePermitExemption);
				requirementArray.push(compliancewithWaterCode);
				requirementArray.push(evidenceOfHazardousMaterialEnviroStorSearch);
			}

	if (isBusiActCult && matches(isCultLicType,"Small Indoor", "Small Mixed-Light Tier 1", "Small Mixed-Light Tier 2", "Specialty Cottage Indoor", "Specialty Cottage Mixed-Light Tier 1", "Specialty Cottage Mixed-Light Tier 2", "Specialty Indoor", "Specialty Mixed-Light Tier 1",
"Specialty Mixed-Light Tier 2"  )) {
	                requirementArray.push(powerSourceInformation);
	            }

			if (isBusiActMfct && isCanExtract && isExtOther) {
				requirementArray.push(otherExtractionMethod);
			}

			if (isBusiActMfct) {
				requirementArray.push(listOfCannabisProductsManufactured);
			}

			if (isBusiActMfct && isCanExtract) {
				requirementArray.push(copyOfClosedLoopSystemCertification);
			}

			if (isBusiActMfct && isInfusionOper){
				requirementArray.push(listOfInfusedProductsManufactured);
			}

//taken out of story 2375
		//	if (isFoodProdSafe) {
		//		requirementArray.push(foodProductSafetyViolationCircumstancesEvidenceRehabilitation);
		//	}

				if (isBusiActMfct && (isCanExtract || isInfusionOper)) {
					requirementArray.push(standardOperatingProcedures);
					requirementArray.push(listOfCannabisProductsManufactured);
					requirementArray.push(wasteManagementProcedures);
				}
		} else {
			// only add temp requirements
			requirementArray.push(documentationOfLocalCompliance);
			requirementArray.push(evidenceOfLegalRightToOccupy);
			requirementArray.push(diagramOfPremises);
		}
      // user story 2375


/*
		////////////////////////////////////////////////////////////////////////////////////////////
		// exclude items not needed for temp applications as submitted in ACA
		if (isPageFlow && isTemporaryRequest) {
			requirementArray.push(documentationOfLocalCompliance);
			requirementArray.push(evidenceOfLegalRightToOccupy);
			requirementArray.push(diagramOfPremises);
		} else {
			//requirementArray.push(documentationOfLocalCompliance); only required for temp
			requirementArray.push(evidenceOfLegalRightToOccupy);
			requirementArray.push(diagramOfPremises);
			requirementArray.push(proofOfSuretyBond); //not needed for temp
			requirementArray.push(financialInformation); //not needed for temp
		}

		if (isPriorityRequest) {
			requirementArray.push(priorityProcessingRequest);
		}

		//if (isTemporaryRequest) {
		//	requirementArray.push(temporaryLicenseRequest);
		//}

		if (!isTemporaryRequest) {
			requirementArray.push(businessFormationDocuments);

			if (isLargeEmployer) {
				if (needsLaborPeaceAgreement) {
					requirementArray.push(laborPeaceAgreement);
				} else {
					requirementArray.push(documentForLaborPeace);
				}
			}
		}

		if (isWaivingSovereignImmunity) {
			requirementArray.push(waiverOfSovereignImmunity);
		}

		if (isLessThan600ft) {
			requirementArray.push(evidencePremiseLessThan600ft);
		}

		if (hasIsoLicense) {
			requirementArray.push(proofOfIsoAccreditationStatus)
		}

		if (isDistributor || isRetailer || isRetailerNonStore || isMicroBusiness || isDistribTransportOnly) {
			// exclude items not needed for temp applications as submitted in ACA
			if (isPageFlow && isTemporaryRequest) {
				//nothing to do here
			} else {
				// user story 2062
				requirementArray.push(transportationProcess);
				requirementArray.push(inventoryProcedures);
				requirementArray.push(qualityControlProcedures);
				requirementArray.push(securityProtocols);
			}
		}

		if (isTesting) {
			// exclude items not needed for temp applications as submitted in ACA
			if (isTemporaryRequest) {
				//nothing to do here
			} else {
				//requirementArray.push(operatingProceduresTesting);
				//removed in user story 1604
				//requirementArray.push(labEmployeeQualifications);
				// user story 2062

				requirementArray.push(standardOperatingProcedures);


				// removed in user story 2229
				//requirementArray.push(labAnalysesStandard);
				//requirementArray.push(chainOfCustodyProtocol);
				//requirementArray.push(testingMethods);
				//requirementArray.push(proofOfIsoAccreditationStatus);

			}
		}

		if (isDistributor || isDistribTransportOnly || (isMicroBusiness && (hasDistributorActivity || hasDistributorTransportOnlyActivity))) {
			// exclude items not needed for temp applications as submitted in ACA
			if (isPageFlow && isTemporaryRequest) {
				//nothing to do here
			} else {
				//use story 2079
				requirementArray.push(proofOfInsurance);
			}
		}
*/

	}
	
		
	logDebug("Num of Req Docs:" + requirementArray.length + " docs.");
	logDebug("All req docs: " + requirementArray);

	return requirementArray;
}
