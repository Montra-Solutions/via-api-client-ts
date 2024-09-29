The sample programs are compatible with LTS versions of Node.js.

Before running the samples in Node, they must be compiled to JavaScript using the TypeScript compiler. For more information on TypeScript, see the TypeScript documentation. Install the TypeScript compiler using:

```shell
npm install -g typescript
```

## Setup
To run the samples using the published version of the package:

1. Install the dependencies using npm:

```shell
npm install
```

2. Compile the samples:

```shell
npm run build
```

3. Edit the file sample.env, adding the correct credentials to access the Azure service and run the samples. Then rename the file from sample.env to just .env. The sample programs will read this file automatically.

4. Run whichever samples you like (note that some samples may require additional setup, see the table above):

```shell 
node dist/listrma.js
```

Alternatively, run a single sample with the correct environment variables set (setting up the .env file is not required if you do this), for example (cross-platform):

npx cross-env ACCOUNT_NAME="<account name>" ACCOUNT_KEY="<account key>" node dist/sharedKeyAuth.js