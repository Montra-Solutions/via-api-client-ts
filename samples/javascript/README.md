
## Prerequisites
The sample programs are compatible with LTS versions of Node.js.

## Setup
To run the samples using the published version of the package:

1. Install the dependencies using npm:
npm install

2. Edit the file sample.env, adding the correct credentials to access the Azure service and run the samples. Then rename the file from sample.env to just .env. The sample programs will read this file automatically.

3. Run whichever samples you like (note that some samples may require additional setup, see the table above):

```javascript
node anonymousGetVersion.js
```

Alternatively, run a single sample with the correct environment variables set (setting up the .env file is not required if you do this), for example (cross-platform):

```shell
npx cross-env ACCOUNT_NAME="<account name>" ACCOUNT_KEY="<account key>" node sharedKeyAuth.js
```