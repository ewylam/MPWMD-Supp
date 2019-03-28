//Virtual Merchant (AKA Elavon example)
var servProvCode = aa.getServiceProviderCode();
var query = "";
var adapter_name = "Elavon_Prod"

//update username and passwd here
var merch_conf = 'ssl_merchant_id=974245;ssl_user_id=MPWMDWEB;ssl_pin=3LLPZPW9S8FRVWK7UC1QGLLDWOI01YITR8CPRTN42EA6YQ8VSA58VJTZ93P0NE2J';
var seq = 0;

//initialize DB connection
var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
var ds = initialContext.lookup("java:/AA");
var conn = ds.getConnection();

//get seq. number
query = "SELECT T.LAST_NUMBER FROM AA_SYS_SEQ T WHERE T.SEQUENCE_NAME = 'XPOLICY_SEQ'";
var sStmt = conn.prepareStatement(query);
var rSet = sStmt.executeQuery();
while (rSet.next()) {
	seq = rSet.getInt("LAST_NUMBER");
}
sStmt.close();

//insert to policy table
var query = "INSERT INTO XPOLICY (SERV_PROV_CODE, POLICY_SEQ, POLICY_NAME, LEVEL_TYPE, LEVEL_DATA, DATA1, RIGHT_GRANTED, STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS, MENUITEM_CODE, DATA2, DATA3, DATA4, MENU_LEVEL,DATA5, RES_ID)";
query = query + "VALUES (?, ?, 'PaymentAdapterSec', 'Adapter', ?, 'Adapter=EPayments3;AdapterURL=${av.biz.url}/av-epayments3-adapters/VirtualMerchant?wsdl', 'F','A', SYSDATE, 'ADMIN', 'A', '', 'VIRTUALMERCHANT_URL=https://www.myvirtualmerchant.com/VirtualMerchant/process.do;SSL_TEST_MODE=FALSE', ?, 'CountryCode=US','', '', '')";

var iStmt = conn.prepareStatement(query);
iStmt.setString(1, servProvCode);
iStmt.setString(2, seq);
iStmt.setString(3, adapter_name);
iStmt.setString(4, merch_conf);

var rSet = iStmt.executeQuery();
iStmt.close();

query = "UPDATE AA_SYS_SEQ SET LAST_NUMBER = ? WHERE SEQUENCE_NAME = 'XPOLICY_SEQ'";
var uStmt = conn.prepareStatement(query);

uStmt.setString(1, seq * 1 + 1);
var rSet = uStmt.executeQuery();
uStmt.close();
