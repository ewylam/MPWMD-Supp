
function getRefContactForPublicUser(userSeqNum) {
	contractorPeopleBiz = aa.proxyInvoker.newInstance("com.accela.pa.people.ContractorPeopleBusiness").getOutput();
	userList = aa.util.newArrayList();
	userList.add(userSeqNum);
	peopleList = contractorPeopleBiz.getContractorPeopleListByUserSeqNBR(aa.getServiceProviderCode(), userList); 
	if (peopleList != null) {
		peopleArray = peopleList.toArray();
		if (peopleArray.length > 0)
			return peopleArray[0];
	}
	return null;
}
