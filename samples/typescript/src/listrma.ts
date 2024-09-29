
import {ViaClient, AuthError, APIRequestError}  from '@trash-bandits/via-api-client-ts';

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();


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
    const info = await viaClient.get("version")
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
    const rmas = await viaClient.get("/core/bms/rma/tickets/rmas/V3")
    .catch(error => {
        if (error instanceof AuthError) {
            console.error("Authentication Error:", error);
        } else if (error instanceof APIRequestError) {
            console.error("API Request Error:", error);
        } else {
            console.error("Error:", error);
        }
    });
    console.log("RMAs:", rmas);

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
  });