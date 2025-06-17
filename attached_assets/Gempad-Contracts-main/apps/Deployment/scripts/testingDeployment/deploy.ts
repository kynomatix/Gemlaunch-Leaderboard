import hre, { ethers, run } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants } from 'ethers';

// import { cyan } from './colors';


// import { allContracts, getContractByName } from './utils'
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { cyan, green, yellow } from '../../src/colors';
import { deployAndLog } from '../../src/deployAndLog';
// import { cyan, green, yellow } from '../src/colors';
// import { deployAndLog } from '../src/deployAndLog';
// import { cyan, dim, green, yellow } from '../src/colors';
// import TokenGeneratorDeployment from './tokengenerator';

// import { DeployOptions } from 'hardhat-deploy/dist/types';


const ROUTER_ADDRESS_NEWTOWRK = {
  ["hardhat"]: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
  ["sepolia"]: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
  ["mainnet"]: '0x10ED43C718714eb63d5aA57B78B54704E256024E', // bsc mainnnet
  ["bscTestnet"]: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
  ['goerli']: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  // ['mainnet']: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  ['fantom']: '0x89eEDCbC0a44dE3293f2b8Dd3620277b729E1dAD' // gampadv2router
}




async function main() {
  const { getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  const signer = ethers.getSigner(deployer)
  cyan(`\nDeploying Start ...`);

  const [owner, user] = await hre.ethers.getSigners();



  const network = hre.network.name;

  const routerAddress = ROUTER_ADDRESS_NEWTOWRK[network]
  const marketingWalletAddress = '0x9aE1eB0f2C0D741F6d76bDB8ea0c089aDc86836f'  // TODO: Need to Add Marketing Wallet Address

  console.log({

    etherparsing: parseEther('100000'),
    Deployer: deployer, router: routerAddress, network,
    owner: owner.address,
    // userAddress: user.address

  })




  // ServiceReceiver
  const ServiceReceiver = await deployAndLog("ServiceReceiver", {
    from: deployer,
    skipIfAlreadyDeployed: true,
  })


  const service = await ethers.getContractAt('ServiceReceiver', ServiceReceiver.address)

  const isNewlyDeployed = ServiceReceiver.newlyDeployed


  // need to set service fee for contracts
  if (!isNewlyDeployed) {

    //private Sale
    green(`Setting Fee to GempadPrivateSale`);
    await service.setPrice('GempadPrivateSale', parseEther('0.001'));
    await service.setFee('GempadPrivateSale', 5000);


    //Launchpad
    green(`Setting Fee to GempadLaunchpad`);
    await service.setPrice('GempadLaunchpad', parseEther('0.001'));
    await service.setFee('GempadLaunchpad', 5000);

    //Airdrop
    green(`Setting Fee to GempadAirdrop`);

    await service.setPrice('GempadAirdrop', parseEther('0.001'));
    await service.setFee('GempadAirdrop', 5000);

    //DutchAuction
    green(`Setting Fee to GempadDutchAuction`);
    await service.setPrice('GempadDutchAuction', parseEther('0.001'));
    await service.setFee('GempadDutchAuction', 5000);

    //DutchAuction
    green(`Setting Fee to GempadFairLaunch`);
    await service.setPrice('GempadFairLaunch', parseEther('0.001'));
    await service.setFee('GempadFairLaunch', 5000);

    //SubscriptionPool
    green(`Setting Fee to GempadSubscriptionPool`);
    await service.setPrice('GempadSubscriptionPool', parseEther('0.001'));
    await service.setFee('GempadSubscriptionPool', 5000);

    yellow('fee added....!! ');

  }


  // GempadAirdrop
  const GempadAirdrop = await deployAndLog("GempadAirdrop", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  const GempadAirdropFactory = await deployAndLog("GempadAirdropFactory", {
    from: deployer,
    args: [GempadAirdrop.address],
    skipIfAlreadyDeployed: true
  })


  // GemAntiBot
  const GemAntiBot = await deployAndLog("GemAntiBot", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  // GempadDutchAuction
  const GempadDutchAuction = await deployAndLog("GempadDutchAuction", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  const GempadDutchAuctionFactory = await deployAndLog("GempadDutchAuctionFactory", {
    from: deployer,
    args: [GempadDutchAuction.address],
    skipIfAlreadyDeployed: true
  })

  // GempadFairLaunch
  const GempadFairLaunch = await deployAndLog("GempadFairLaunch", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  const GempadFairLuanchFactory = await deployAndLog("GempadFairLuanchFactory", {
    from: deployer,
    args: [GempadFairLaunch.address],
    skipIfAlreadyDeployed: true,
  })


  // LaunchpadDeployment
  const GempadLaunchpad = await deployAndLog("GempadLaunchpad", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  const GempadLaunchpadFactory = await deployAndLog("GempadLaunchpadFactory", {
    from: deployer,
    args: [GempadLaunchpad.address],
    skipIfAlreadyDeployed: true
  })


  // GempadVestingLock
  const GempadVestingLock = await deployAndLog("GempadVestingLock", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  // GempadMultiSender
  const GempadMultiSender = await deployAndLog("GempadMultiSender", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  // GempadPrivateSale
  const GempadPrivateSale = await deployAndLog("GempadPrivateSale", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  const GempadPrivateSaleFactory = await deployAndLog("GempadPrivateSaleFactory", {
    from: deployer,
    args: [GempadPrivateSale.address],
    skipIfAlreadyDeployed: true
  })

  // GempadSubscriptionPool
  const GempadSubscriptionPool = await deployAndLog("GempadSubscriptionPool", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  const GempadSubscriptionPoolFactory = await deployAndLog("GempadSubscriptionPoolFactory", {
    from: deployer,
    args: [GempadSubscriptionPool.address],
    skipIfAlreadyDeployed: true
  })

  // GemToken
  const GemToken = await deployAndLog("GemToken", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  // TokenFactoryManager
  const TokenFactoryManager = await deployAndLog("TokenFactoryManager", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })



  // cyan(`\n TokenFactoryManager Contract Verifying...  `);
  // await run('verify:verify', {
  //   address: TokenFactoryManager.address,
  //   constructorArguments: []
  // });



  // StandardToken
  const StandardToken = await deployAndLog("StandardToken", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  // StandardTokenFactory
  const StandardTokenFactory = await deployAndLog("StandardTokenFactory", {
    from: deployer,
    args: [TokenFactoryManager.address, StandardToken.address],
    skipIfAlreadyDeployed: true
  })


  // LiquidityGeneratorToken
  const LiquidityGeneratorToken = await deployAndLog("LiquidityGeneratorToken", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })


  // LiquidityGeneratorTokenFactory
  const LiquidityGeneratorTokenFactory = await deployAndLog("LiquidityGeneratorTokenFactory", {
    from: deployer,
    args: [TokenFactoryManager.address, LiquidityGeneratorToken.address],
    skipIfAlreadyDeployed: true
  })

  // BuybackBabyToken
  const BuybackBabyToken = await deployAndLog("BuybackBabyToken", {
    from: owner.address,
    args: [
      deployer,
      'BuybackBabyToken',
      'BBT',
      parseEther('100000'),
      StandardToken.address,
      routerAddress,
      [200, 300, 800, 100, 10000],
    ],
    value: parseEther('0.01'),
    // gasLimit: 3000000, // Set a manual gas limit
    skipIfAlreadyDeployed: true
  })


  // BuyBackBabyTokenFactory
  const BuyBackBabyTokenFactory = await deployAndLog("BuyBackBabyTokenFactory", {
    from: deployer,
    args: [
      TokenFactoryManager.address,
      BuybackBabyToken.address
    ],
    skipIfAlreadyDeployed: true
  })
  // BuybackBabyToken


  // IterableMapping
  const IterableMapping = await deployAndLog("IterableMapping", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  const BabyTokenDividendTracker = await deployAndLog('BabyTokenDividendTracker', {
    from: deployer,
    libraries: {
      IterableMapping: IterableMapping.address
    },
    skipIfAlreadyDeployed: true
  });

  //  BabyToken
  const BabyToken = await deployAndLog("BabyToken", {
    from: deployer,
    skipIfAlreadyDeployed: true
  })

  const BabyTokenFactory = await deployAndLog("BabyTokenFactory", {
    from: deployer,
    args: [TokenFactoryManager.address, BabyToken.address],
    skipIfAlreadyDeployed: true
  })





  //  Remaining Contracts to Deploy.

  const AntiBotBabyToken = await deployAndLog("AntiBotBabyToken", {
    from: deployer,
    args: [
      deployer,
      "AntiBotbabyToken",
      "ABBT",
      parseEther('100000'),
      [
        StandardToken.address, // reward token Address
        routerAddress, // PancakeV2Router02
        marketingWalletAddress, // marketing wallet
        BabyTokenDividendTracker.address, // dividendTracker
        GemAntiBot.address //antibot
      ],
      [5, 5, 5], //  [rewards, liquidity, marketing]
      parseEther('1000'), // minimumTokenBalanceForDividends
      // { value: parseEther('0.01') }
    ],
    skipIfAlreadyDeployed: true

  })


  cyan(`\n AntiBotBabyToken Contract Verifying...  `);
  await run('verify:verify', {
    address: AntiBotBabyToken.address,
    constructorArguments: [
      deployer,
      "AntiBotbabyToken",
      "ABBT",
      parseEther('100000'),
      [
        StandardToken.address, // reward token Address
        routerAddress, // PancakeV2Router02
        marketingWalletAddress, // marketing wallet
        BabyTokenDividendTracker.address, // dividendTracker
        GemAntiBot.address //antibot
      ],
      [5, 5, 5], //  [rewards, liquidity, marketing]
      parseEther('1000'), // minimumTokenBalanceForDividends
      // { value: parseEther('0.01') }
    ]
  });


  const AntibotBabyTokenFactory = await deployAndLog("AntibotBabyTokenFactory", {
    from: deployer,
    args: [TokenFactoryManager.address, AntiBotBabyToken.address],
    skipIfAlreadyDeployed: true
  })


  cyan(`\n AntibotBabyTokenFactory Contract Verifying...  `);
  await run('verify:verify', {
    address: AntibotBabyTokenFactory.address,
    constructorArguments: [
      TokenFactoryManager.address, AntiBotBabyToken.address
    ],
  });



  const AntiBotBuybackBabyToken = await deployAndLog("AntiBotBuybackBabyToken", {
    from: deployer,
    args: [
      deployer,
      "BuybackBabyToken",
      "BBT",
      parseEther('100000'),
      StandardToken.address, //rewardToken
      routerAddress, // PancakeV2Router02,
      GemAntiBot.address, // GemAntiBot Token
      [200, 300, 800, 100, 10000],
      // { value: parseEther('0.01') }

    ],
    skipIfAlreadyDeployed: true
  })

  cyan(`\n AntiBotBuybackBabyToken Contract Verifying...  `);
  await run('verify:verify', {
    address: AntiBotBuybackBabyToken.address,
    constructorArguments: [
      deployer,
      "BuybackBabyToken",
      "BBT",
      parseEther('100000'),
      StandardToken.address, //rewardToken
      routerAddress, // PancakeV2Router02,
      GemAntiBot.address, // GemAntiBot Token
      [200, 300, 800, 100, 10000],
      // { value: parseEther('0.01') }
    ],
  });




  ///deploy StandardTokenFactory
  const AntibotBuyBackBabyTokenFactory = await deployAndLog('AntibotBuyBackBabyTokenFactory', {
    from: deployer,
    args: [TokenFactoryManager.address, AntiBotBuybackBabyToken.address],
    skipIfAlreadyDeployed: true
  });


  cyan(`\n AntiBotBuybackBabyToken Contract Verifying...  `);
  await run('verify:verify', {
    address: AntibotBuyBackBabyTokenFactory.address,
    constructorArguments: [
      TokenFactoryManager.address, AntiBotBuybackBabyToken.address
    ],
  });




  const AntiBotLiquidityGeneratorToken = await deployAndLog('AntiBotLiquidityGeneratorToken', {
    from: deployer,
    args: [
      deployer,
      "AntiBotLiquidityGeneratorToken",
      "LGT",
      parseEther('100000'),
      routerAddress, //   PancakeV2Router02
      marketingWalletAddress,  // charityAddress
      300, // taxFeeBps
      800, // liquidityFeeBps
      200, // charityFeeBps 
      GemAntiBot.address // AntiBotToken
    ],
    // value: parseEther("0.01"),
    skipIfAlreadyDeployed: true
  });


  cyan(`\n AntiBotLiquidityGeneratorToken Contract Verifying...  `);
  await run('verify:verify', {
    address: AntiBotLiquidityGeneratorToken.address,
    constructorArguments: [
      deployer,
      "AntiBotLiquidityGeneratorToken",
      "LGT",
      parseEther('100000'),
      routerAddress, //   PancakeV2Router02
      marketingWalletAddress,  // charityAddress
      300, // taxFeeBps
      800, // liquidityFeeBps
      200, // charityFeeBps 
      GemAntiBot.address // AntiBotToken
    ],
  });



  const AntibotLiquidityGeneratorTokenFactory = await deployAndLog("AntibotLiquidityGeneratorTokenFactory", {
    from: deployer,
    args: [TokenFactoryManager.address, AntiBotLiquidityGeneratorToken.address],
    skipIfAlreadyDeployed: true
  })

  cyan(`\n AntibotLiquidityGeneratorTokenFactory Contract Verifying...  `);
  await run('verify:verify', {
    address: AntibotLiquidityGeneratorTokenFactory.address,
    constructorArguments: [
      TokenFactoryManager.address, AntiBotLiquidityGeneratorToken.address
    ],
  });






  const AntiBotStandardToken = await deployAndLog('AntiBotStandardToken', {
    from: deployer,
    args: [],
    skipIfAlreadyDeployed: true
  });

  cyan(`\n AntiBotStandardToken Contract Verifying...  `);
  await run('verify:verify', {
    address: AntiBotStandardToken.address,
    constructorArguments: [],
  });



  const AntiBotStandardTokenFactory = await deployAndLog('AntiBotStandardTokenFactory', {
    from: deployer,
    args: [TokenFactoryManager.address, AntiBotStandardToken.address],
    skipIfAlreadyDeployed: true
  })


  cyan(`\n AntiBotStandardTokenFactory Contract Verifying...  `);
  await run('verify:verify', {
    address: AntiBotStandardTokenFactory.address,
    constructorArguments: [TokenFactoryManager.address, AntiBotStandardToken.address],
  });






  green(`\n All contract deployed Successfully   `);

  green(`\n OverAll gasUsed ${hre.deployments.getGasUsed()}`);


  // const allContracts = [service, airdrop, antibot, dutchAuction, fairLaunch, launchpad, locker, multisender, privateSale, subscription,
  //   gemToken,
  //   tokenGenerator]

  // green(`\n ${allContracts}`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





