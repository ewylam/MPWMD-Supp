/*------------------------------------------------------------------------------------------------------/
| Program : getCurrentEnvironment.js
| Event   : N/A
|
| Usage   : Returns the current environment (dev, test, stage) based on the ACA_SITE url
| By: John Towell
|
| Notes   : This function is being used by interfaces and is mapping Accela terms (supp, preprod) to standard terms (dev, stage)
/------------------------------------------------------------------------------------------------------*/
function getCurrentEnvironment() {
    var acaSite = lookup("ACA_CONFIGS", "ACA_SITE");
    var firstPart = acaSite.substr(0, acaSite.indexOf(".accela.com"));
    var dotArray = firstPart.split(".");
    var env = dotArray[dotArray.length-1];
    var httpArray = env.split("//");

    env = httpArray[httpArray.length-1];

    if(env == "supp") {
        return "dev";
    } else if (env == "acapre") {
        return "stage";
    } else if (env == "aca5") {
        return "prod";
    } else {
        return env;
    }
}