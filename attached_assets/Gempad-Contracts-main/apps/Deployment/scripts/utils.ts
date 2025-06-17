// // import GempadAirdropFactory from '../../Gempad-Airdrop/artifacts/contracts/factory/GempadAirdropFactory.sol/GempadAirdropFactory.json';
// // import GemToken from '../../GemToken/artifacts/contracts/GemToken.sol/GemToken.json';
// // import GempadAntiBot from '../../Gempad-Antibot/artifacts/contracts/GemAntiBot.sol/GemAntiBot.json';
// // import DutchAuctionFactory from '../../Gempad-DutchAuction/artifacts/contracts/factory/GempadDutchAuctionFactory.sol/GempadDutchAuctionFactory.json';
// // // import FairLaunchFactory from '../../Gempad-FairLaunch/artifacts/contracts/factory/GempadLaunchpadFactory.sol/GempadFairLuanchFactory.json';
// // import LaunchpadFactory from '../../Gempad-Launchpad/artifacts/contracts/factory/GempadLaunchpadFactory.sol/GempadLaunchpadFactory.json';
// // import Launchpad from '../../Gempad-Launchpad/artifacts/contracts/GempadLaunchpad.sol/GempadLaunchpad.json';
// // import Locker from '../../Gempad-Locker/artifacts/contracts/GempadVestingLock.sol/GempadVestingLock.json';
// // import Multisender from '../../Gempad-Multisender/artifacts/contracts/GempadMultiSender.sol/GempadMultiSender.json';
// // import PrivateSaleFactory from '../../Gempad-PrivateSale/artifacts/contracts/factory/GempadPrivateSaleFactory.sol/GempadPrivateSaleFactory.json';
// // import AntiBotStandardTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/AntiBotStandardTokenFactory.sol/AntiBotStandardTokenFactory.json';
// // import AntibotBabyTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/AntibotBabyTokenFactory.sol/AntibotBabyTokenFactory.json';
// // import AntibotBuyBackBabyTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/AntibotBuyBackBabyTokenFactory.sol/AntibotBuyBackBabyTokenFactory.json';
// // import AntibotLiquidityGeneratorTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/AntibotLiquidityGeneratorTokenFactory.sol/AntibotLiquidityGeneratorTokenFactory.json';
// // import BabyTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/BabyTokenFactory.sol/BabyTokenFactory.json';
// // import BuyBackBabyTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/BuyBackBabyTokenFactory.sol/BuyBackBabyTokenFactory.json';
// // import LiquidityGeneratorTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/LiquidityGeneratorTokenFactory.sol/LiquidityGeneratorTokenFactory.json';
// // import StandardTokenFactory from '../../Generate-Tokens/artifacts/contracts/factories/StandardTokenFactory.sol/StandardTokenFactory.json';
// // import TokenFactoryBase from '../../Generate-Tokens/artifacts/contracts/factories/TokenFactoryBase.sol/TokenFactoryBase.json';
// // import TokenFactoryManager from '../../Generate-Tokens/artifacts/contracts/factories/TokenFactoryManager.sol/TokenFactoryManager.json';

// // const GempadAirdropFactory = require('../../Gempad-Airdrop/artifacts/contracts/factory/GempadAirdropFactory.sol/GempadAirdropFactory.json');
// // const GemToken = require('../../GemToken/artifacts/contracts/GemToken.sol/GemToken.json');
// // const GempadAntiBot = require('../../Gempad-Antibot/artifacts/contracts/GemAntiBot.sol/GemAntiBot.json');
// // const DutchAuctionFactory = require('../../Gempad-DutchAuction/artifacts/contracts/factory/GempadDutchAuctionFactory.sol/GempadDutchAuctionFactory.json');
// // const FairLaunchFactory = require('../../Gempad-FairLaunch/artifacts/contracts/factory/GempadLaunchpadFactory.sol/GempadFairLuanchFactory.json');
// // const LaunchpadFactory = require('../../Gempad-Launchpad/artifacts/contracts/factory/GempadLaunchpadFactory.sol/GempadLaunchpadFactory.json');
// // const Locker = require('../../Gempad-Locker/artifacts/contracts/GempadVestingLock.sol/GempadVestingLock.json');
// // const Multisender = require('../../Gempad-Multisender/artifacts/contracts/GempadMultiSender.sol/GempadMultiSender.json');
// // const PrivateSaleFactory = require('../../Gempad-PrivateSale/artifacts/contracts/factory/GempadPrivateSaleFactory.sol/GempadPrivateSaleFactory.json');
// // const AntiBotStandardTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/AntiBotStandardTokenFactory.sol/AntiBotStandardTokenFactory.json');
// // const AntibotBabyTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/AntibotBabyTokenFactory.sol/AntibotBabyTokenFactory.json');
// // const AntibotBuyBackBabyTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/AntibotBuyBackBabyTokenFactory.sol/AntibotBuyBackBabyTokenFactory.json');
// // const AntibotLiquidityGeneratorTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/AntibotLiquidityGeneratorTokenFactory.sol/AntibotLiquidityGeneratorTokenFactory.json');
// // const BabyTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/BabyTokenFactory.sol/BabyTokenFactory.json');
// // const BuyBackBabyTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/BuyBackBabyTokenFactory.sol/BuyBackBabyTokenFactory.json');
// // const LiquidityGeneratorTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/LiquidityGeneratorTokenFactory.sol/LiquidityGeneratorTokenFactory.json');
// // const StandardTokenFactory = require('../../Generate-Tokens/artifacts/contracts/factories/StandardTokenFactory.sol/StandardTokenFactory.json');
// // const TokenFactoryBase = require('../../Generate-Tokens/artifacts/contracts/factories/TokenFactoryBase.sol/TokenFactoryBase.json');
// // const TokenFactoryManager = require('../../Generate-Tokens/artifacts/contracts/factories/TokenFactoryManager.sol/TokenFactoryManager.json');

// const contracts = [
//   GempadAirdropFactory,
//   GemToken,
//   GempadAntiBot,
//   DutchAuctionFactory,
//   // FairLaunchFactory,
//   LaunchpadFactory,
//   Launchpad,
//   Locker,
//   Multisender,
//   PrivateSaleFactory,
//   AntiBotStandardTokenFactory,
//   AntibotBabyTokenFactory,
//   AntibotBuyBackBabyTokenFactory,
//   AntibotLiquidityGeneratorTokenFactory,
//   BabyTokenFactory,
//   BuyBackBabyTokenFactory,
//   LiquidityGeneratorTokenFactory,
//   StandardTokenFactory,
//   TokenFactoryBase,
//   TokenFactoryManager
// ];

// function extractAbiAndBytecode(contracts: any[]): any {
//   const abiAndBytecodeArray: { abi: any, bytecode: any, contractName: string }[] = [];

//   contracts.forEach((contract) => {
//     const { abi, bytecode, contractName } = contract;

//     if (abi && bytecode) {
//       abiAndBytecodeArray.push({ abi, bytecode, contractName });
//     }
//   });

//   return abiAndBytecodeArray;
// }

// export const allContracts = extractAbiAndBytecode(contracts);


// export function getContractByName(contractName: string): { abi: any, bytecode: any, contractName: string } | undefined {
//   const contract = allContracts.find((c: any) => c.contractName === contractName);
//   return contract;
// }