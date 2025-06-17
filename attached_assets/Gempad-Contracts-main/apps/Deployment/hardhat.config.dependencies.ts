export const dependencyCompiler = {
  paths: [
    // DEX Contract 
    "@gempad/gempadv2/contracts/GempadV2Factory.sol",
    "@gempad/gempadv2/contracts/GempadV2Router02.sol",
    "@gempad/gempadv2/contracts/GempadInterfaceMulticall.sol",
    // ServiceReciver Contract
    '@gempad/services/contracts/ServiceReceiver.sol',
    // GemToken
    '@gempad/gemtoken/contracts/GemToken.sol',
    // AirDrop
    '@gempad/airdrop/contracts/factory/GempadAirdropBeacon.sol',
    '@gempad/airdrop/contracts/factory/GempadAirdropFactory.sol',
    '@gempad/airdrop/contracts/GempadAirdrop.sol',
    // AntiBot
    '@gempad/antibot/contracts/GemAntiBot.sol',
    //  DutchAuction
    '@gempad/dutchauction/contracts/factory/GempadDutchAuctionBeacon.sol',
    '@gempad/dutchauction/contracts/factory/GempadDutchAuctionFactory.sol',
    '@gempad/dutchauction/contracts/GempadDutchAuction.sol',
    // FairLaunch
    '@gempad/fairlaunch/contracts/factory/GempadFairLuanchBeacon.sol',
    '@gempad/fairlaunch/contracts/factory/GempadFairLuanchFactory.sol',
    '@gempad/fairlaunch/contracts/GempadFairLaunch.sol',
    // Launchpad
    '@gempad/launchpad/contracts/factory/GempadLaunchpadFactory.sol',
    '@gempad/launchpad/contracts/GempadLaunchpad.sol',
    // GempadLocker
    '@gempad/locker/contracts/GempadVestingLock.sol',
    // Gempad-Multisender
    '@gempad/multisender/contracts/GempadMultiSender.sol',
    // Gempad-PrivateSale
    '@gempad/privatsale/contracts/factory/GempadPrivateSaleBeacon.sol',
    '@gempad/privatsale/contracts/factory/GempadPrivateSaleFactory.sol',
    '@gempad/privatsale/contracts/GempadPrivateSale.sol',
    // Gempad-SubscriptionPool
    '@gempad/subscriptionpool/contracts/factory/GempadSubscriptionPoolBeacon.sol',
    '@gempad/subscriptionpool/contracts/factory/GempadSubscriptionPoolFactory.sol',
    '@gempad/subscriptionpool/contracts/GempadSubscriptionPool.sol',
    // Generate-Tokens
    '@gempad/generatetokens/contracts/AntiBotBabyToken.sol',
    '@gempad/generatetokens/contracts/AntiBotBuybackBabyToken.sol',
    '@gempad/generatetokens/contracts/AntiBotLiquidityGeneratorToken.sol',
    '@gempad/generatetokens/contracts/AntiBotStandardToken.sol',
    '@gempad/generatetokens/contracts/BabyToken.sol',
    '@gempad/generatetokens/contracts/BaseToken.sol',
    '@gempad/generatetokens/contracts/BuybackBabyToken.sol',
    '@gempad/generatetokens/contracts/GemAntiBotOld.sol', // this contract need to be confirmed
    '@gempad/generatetokens/contracts/LiquidityGeneratorToken.sol',
    '@gempad/generatetokens/contracts/StandardToken.sol',
    // Generate-Factories
    '@gempad/generatetokens/contracts/factories/AntiBotStandardTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/AntibotBabyTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/AntibotBuyBackBabyTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/AntibotLiquidityGeneratorTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/BabyTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/BuyBackBabyTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/LiquidityGeneratorTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/StandardTokenFactory.sol',
    '@gempad/generatetokens/contracts/factories/TokenFactoryBase.sol',
    '@gempad/generatetokens/contracts/factories/TokenFactoryManager.sol',
  ]
}