# Turborepo Dapp Starter

## Using this example

Run the following command in Root dir:
Install all the dependencies of the application included in Workspaces.

```sh
pnpm install
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `web`: [Next.js](https://nextjs.org/) app contain the Interface of the Application.
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next`,`eslint-config-prettier` and `react-library` )
- `tsconfig`: `tsconfig.json`s used throughout the monorepo.
- `UIKit`: `packages/uikit` used throughout the monorepo for Interface Development.
- `SDK`: `Software Development Kit` Currency, Token, Contract addresses.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools set for Developer:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [ConventialCommit](https://www.conventionalcommits.org/en/v1.0.0/) for bug free code in production
- [viem](https://www.conventionalcommits.org/en/v1.0.0/) lightweight, composable, and type-safe module that interfaces with Ethereum.
- [Multicall](https://docs.uniswap.org/contracts/v3/reference/periphery/base/Multicall) Enables calling multiple methods in a single call to the contract..

### Build

To build all apps and packages, run the following command:

```
cd dapp-starter-v2
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd dapp-starter-v2
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd dapp-starter-v2
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

### contract changes

calculateCurrentPrice -> public
tokenFee -> public
fairLaunch -> ( totalReferralInvest , tokenFee )-> public

<!-- some of the state variable to public -->

fairlaunch: {
totalReferralInvest -> public
tokenToReceive -> public
totalReward -> public
tokenFee -> public
getCurrentSatus -> getCurrentStatus
}

GempadDutchAuction:{
getCurrentSatus -> getCurrentStatus,
calculateCurrentPrice -> public
functionAdded : getAllInvestors(),
}

SubscriptionPool: {
canCalculate -> public,
}

gemLaunchLaunchpad:{
events updated
}

CONTUNUE -> DetailCardIntegration -> REFUNDTYPE
