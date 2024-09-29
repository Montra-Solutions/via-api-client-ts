# via-api-client-js
API Wrapper for Montra Via SaaS Application

The ViaClient is an API client for interacting with the Montra API. It allows you to easily make authenticated API requests using Axios under the hood. This package supports GET, POST, and PUT requests with both query parameters and JSON data in the request body.

## Installation
You can install the package using npm:

npm install @trash-bandits/via-api-client-ts


## Usage Example
Here’s a sample usage of the via-api-client package in your project:

```typescript
import ViaClient, { AuthError, APIRequestError } from 'via-api-client-ts'; // Adjust the import path as needed

async function run() {
  try {
    const baseURL = process.env.BASE_URL || 'https://api.example.com';
    const tokenHash = process.env.TOKEN_HASH || 'your-token-hash';
    const email = process.env.EMAIL || 'your-email@example.com';

    const viaClient = new ViaClient({ baseURL, tokenHash, email });

    // Example GET request with typed response
    interface GetDataResponse {
      id: number;
      name: string;
      // ... other properties
    }

    const data = await viaClient.get<GetDataResponse>('/endpoint', { param: 'value' });

    console.log('Data:', data);

    // Handle the data as needed
  } catch (error) {
    if (error instanceof AuthError) {
      console.error('Authentication Error:', error.message);
    } else if (error instanceof APIRequestError) {
      console.error('API Request Error:', error.message, 'Status Code:', error.statusCode);
    } else {
      console.error('Unexpected Error:', error);
    }
  }
}

run();
```