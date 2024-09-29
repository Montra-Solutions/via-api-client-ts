
// Load environment variables
require("dotenv").config();

// Load ViaClient Module for REST API access
const {ViaClient,AuthError, APIRequestError} = require('@trash-bandits/via-api-client-ts');
// const ViaClient = require('@trash-bandits/via-api-client-ts').ViaClient; // alternate syntax

/** Validate being able to load client  (debug)
 * Expect: '{ ViaClient: [Getter] }'
 * */
console.log(require('@trash-bandits/via-api-client-ts'));

/** Test Function - get version and list RMA's **/
async function main() {

    // Capture account details - this can come from environment variables or keyvault etc.
    const account = process.env.ACCOUNT_NAME || "<account name>";
    const VIA_URL = process.env.VIA_URL || "";
    const VIA_TOKEN = process.env.VIA_TOKEN || "";
    const VIA_ACCOUNT_EMAIL = process.env.VIA_ACCOUNT_EMAIL || "";

    // Echo account details for debug
    console.log(`VIA_URL: ${VIA_URL}`);
    console.log(`VIA_TOKEN: ${VIA_TOKEN}`);
    console.log(`VIA_ACCOUNT_EMAIL: ${VIA_ACCOUNT_EMAIL}`);

    // Instantiate ViaClient with baseURL, tokenHash, email
    const viaClient = new ViaClient({baseURL:VIA_URL, tokenHash:VIA_TOKEN, email:VIA_ACCOUNT_EMAIL});

    // Get version info from API server
    info = await viaClient.get("version")
    .catch(error => {
        if (error instanceof AuthError) {
            console.error("Authentication Error:", error);
        } else if (error instanceof APIRequestError) {
            console.error("API Request Error:", error);
        } else {
            console.error("Error:", error);
        }
    });
    console.log("Version info:", info);

    // Get RMA list
    let rmas = await viaClient.get("/core/bms/rma/tickets/rmas/V3")
    .catch(error => {
        if (error instanceof AuthError) {
            console.error("Authentication Error:", error);
        } else if (error instanceof APIRequestError) {
            console.error("API Request Error:", error);
        } else {
            console.error("Error:", error);
        }
    });
   // console.log("RMAs:", rmas);
  
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});