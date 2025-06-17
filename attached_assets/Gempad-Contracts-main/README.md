# [Gempad Contract Deployment]

This repository contains various packages and apps to Deploy Protocol Contracts.

## Getting Started

Instructions on how to get started with your repository.

### Packages:

Contains various packages that provide utility functions and other required code to run the app code.

### Subdirectories:

1.  **config**:

    - Description: Contains project configuration files.

2.  **hardhat-deploy-markdown-export**:

    - Description: Contains Markdown for deployed contract.

3.  **lib**:

    - Description: Utils, Formatting , constants, abi , types.

4.  **tsconfig**:
    - Description: Contains TypeScript configuration files.

###

## Running the Projects

To run the projects, follow these steps:

1. Make to install packages using Yarn instead of Npm
2. Add private key into .env

3. **For Contract Deployment 1**:

   ```bash
   yarn install
   yarn compile
   // nevigate to ..
   cd apps/Deployment
   // Run this command into termimal
   cp .env.example .env

   // add Private key to your .env or other env etc..
   // to deploy to bsc mainnet
    yarn deploy:mainnet
   ```

##

## Check app/Deployment/packages.json file it contains all the command related to deployment

### Note: "If the contracts are already deployed, please delete the 'deployments' directory located at 'apps/Deployment/deployments'". and redeploy using command in the apps/Deployment directory 'yarn deploy:sepolia'.

### Note: if there any error "replacement fee too low" please redeploy.

## Running the Projects

Contract deployment successfully on to the following network

1. Sepolia
2. Fantom Testnet

## License
