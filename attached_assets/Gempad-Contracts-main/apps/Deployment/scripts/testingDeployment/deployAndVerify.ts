import hre, { ethers, run } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants, ContractFactory } from 'ethers';

// import { cyan } from './colors';


// import { allContracts, getContractByName } from './utils'
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { deployAndLog } from '../../src/deployAndLog';
import { cyan, dim, green, yellow } from '../../src/colors';
import TokenGeneratorDeployment from '../tokengenerator';




const ROUTER_ADDRESS_NEWTOWRK = {
  ["hardhat"]: "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3",
  ["sepolia"]: '0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008',
  ["bsc"]: '0xDb6F5FB9311aE8885620Ee893887C3D85C8293d6',
  ["bscTestnet"]: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
  ['goerli']: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  ['mainnet']: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  ['fantom']: '0x89eEDCbC0a44dE3293f2b8Dd3620277b729E1dAD' // gampadv2router
}




async function estimateContractGas(deployedContract, args, contractName) {

  const deploymentData = await deployedContract.interface.encodeDeploy(args)
  const estimatedGas = await ethers.provider.estimateGas({ data: deploymentData });

  console.log({ contractName, deploymentData, estimatedGas: estimatedGas.toString() })
  return { contractName, deploymentData, estimatedGas: estimatedGas.toString() }

}





async function main() {
  const { getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  const network = hre.network.name;
  const [owner] = await ethers.getSigners();
  const routerAddress = ROUTER_ADDRESS_NEWTOWRK[network]


  cyan(`\nDeploying Start ...`);



  // // ServiceReceiver

  yellow(`\n ServiceReceiver Contract Deploying...`);

  const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
  const service = await ServiceReceiver.deploy();
  await service.deployed()


  const serviceReceiverGasDetail = estimateContractGas(ServiceReceiver, [], 'ServiceReceiver')

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

  yellow('fee added....!!', service.address);


  green(`\n ServiceReceiver Contract Deployed at ${service.address} `);




  // GempadAirdrop

  yellow(`\n GempadAirdrop Contract Deploying...`);

  const Airdrop = await ethers.getContractFactory('GempadAirdrop');
  const airdrop = await Airdrop.deploy();

  await airdrop.deployed();

  const airdropGasDetail = estimateContractGas(Airdrop, [], 'GempadAirdrop')


  green(`\n GempadAirdrop Contract Deployed at ${airdrop.address} `);


  const GempadAirdropFactory = await ethers.getContractFactory('GempadAirdropFactory');
  const airdropFactory = await GempadAirdropFactory.deploy(airdrop.address);
  await airdropFactory.deployed();

  const airdropFactoryGasDetail = estimateContractGas(GempadAirdropFactory, [airdrop.address], 'GempadAirdropFactory')

  green(`\n GempadAirdropFactory Contract Deployed at ${airdropFactory.address} `);



  yellow(`\n GemAntiBot Contract Deploying...`);

  const Antibot = await ethers.getContractFactory('GemAntiBot');
  const bot = await Antibot.deploy();
  await bot.deployed();
  const botGasDetail = estimateContractGas(Antibot, [], 'GemAntiBot')

  green(`\n GemAntiBot Contract Deployed at ${bot.address} `);



  // GempadDutchAuction
  yellow(`\n GempadDutchAuction Contract Deploying...`);

  const GempadDutchAuction = await ethers.getContractFactory('GempadDutchAuction');
  const auction = await GempadDutchAuction.deploy();

  await auction.deployed();
  const auctionGasDetail = estimateContractGas(GempadDutchAuction, [], 'GempadDutchAuction')

  green(`\n GempadDutchAuction Contract Deployed at ${auction.address} `);

  return

  const GempadDutchAuctionFactory = await ethers.getContractFactory('GempadDutchAuctionFactory');
  const dutchAuctionFactory = await GempadDutchAuctionFactory.deploy(auction.address);

  await dutchAuctionFactory.deployed();
  green(`\n GempadDutchAuctionFactory Contract Deployed at ${dutchAuctionFactory.address} `);


  // GempadFairLaunch

  yellow(`\n GempadFairLaunch Contract Deploying...`);

  const GempadFairLaunch = await ethers.getContractFactory('GempadFairLaunch');
  const fairLaunch = await GempadFairLaunch.deploy();

  await fairLaunch.deployed();

  green(`\n GempadFairLaunch Contract Deployed at ${fairLaunch.address} `);


  const GempadFairLuanchFactory = await ethers.getContractFactory('GempadFairLuanchFactory');

  const FairLuanchFactory = await GempadFairLuanchFactory.deploy(fairLaunch.address);

  await FairLuanchFactory.deployed();
  green(`\n GempadFairLaunch Contract Deployed at ${FairLuanchFactory.address} `);




  // GempadLaunchpad

  yellow(`\n GempadLaunchpad Contract Deploying...`);

  const GempadLaunchpad = await ethers.getContractFactory('GempadLaunchpad');
  const gempadLaunchpad = await GempadLaunchpad.deploy();

  await gempadLaunchpad.deployed();

  green(`\n GempadLaunchpad Contract Deployed at ${gempadLaunchpad.address} `);


  const GempadFactory = await ethers.getContractFactory('GempadLaunchpadFactory');
  const gempadLaunchpadFactory = await GempadFactory.deploy(gempadLaunchpad.address);
  await gempadLaunchpadFactory.deployed();

  green(`\n GempadLaunchpadFactory Contract Deployed at ${gempadLaunchpadFactory.address} `);




  yellow(`\n GempadVestingLock Contract Deploying...`);

  const VestingLock = await ethers.getContractFactory('GempadVestingLock');
  const locker = await VestingLock.deploy();

  await locker.deployed() // added by me

  green(`\n GempadVestingLock Contract Deployed at ${locker.address} `);




  yellow(`\n GempadMultiSender Contract Deploying...`);

  const GempadSender = await ethers.getContractFactory('GempadMultiSender');
  const multisender = await GempadSender.deploy();

  await multisender.deployed(); // added by me

  green(`\n GempadMultiSender Contract Deployed at ${multisender.address} `);




  yellow(`\n GempadPrivateSale Contract Deploying...`);


  const GempadPrivatesale = await ethers.getContractFactory('GempadPrivateSale');
  const sale = await GempadPrivatesale.deploy();
  await sale.deployed();

  green(`\n GempadPrivateSale Contract Deployed at ${sale.address} `);

  const GempadPrivateSaleFactory = await ethers.getContractFactory('GempadPrivateSaleFactory');
  const factory = await GempadPrivateSaleFactory.deploy(sale.address);
  await factory.deployed();

  green(`\n GempadPrivateSaleFactory Contract Deployed at ${factory.address} `);



  yellow(`\n GempadSubscriptionPool Contract Deploying...`);

  const GempadSubscriptionPool = await ethers.getContractFactory('GempadSubscriptionPool');
  const pool = await GempadSubscriptionPool.deploy();
  await pool.deployed();

  green(`\n GempadSubscriptionPool Contract Deployed at ${pool.address} `);


  ///deploy factory

  const GempadSubscriptionPoolFactory = await ethers.getContractFactory('GempadSubscriptionPoolFactory');
  const SubscriptionPoolFactory = await GempadSubscriptionPoolFactory.deploy(pool.address);
  await SubscriptionPoolFactory.deployed();

  green(`\n GempadSubscriptionPoolFactory Contract Deployed at ${SubscriptionPoolFactory.address} `);




  yellow(`\n GemToken Contract Deploying...`);
  const token = await ethers.getContractFactory('GemToken');
  const gemToken = await token.deploy()

  await gemToken.deployed()
  green(`\n GemToken Contract Deployed at ${gemToken.address} `);






  const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  const manager = await TokenFactoryManager.deploy();


  green(`\n TokenFactoryManager Contract Deployed at ${manager.address} `);



  const StandardToken = await ethers.getContractFactory('StandardToken');
  const standardToken = await StandardToken.deploy();


  green(`\n StandardToken Contract Deployed at ${standardToken.address} `);


  ///deploy LiquidityGeneratorToken
  const StandardTokenFactory = await ethers.getContractFactory('StandardTokenFactory');
  const standardFactory = await StandardTokenFactory.deploy(manager.address, standardToken.address);


  green(`\n StandardTokenFactory Contract Deployed at ${standardFactory.address} `);


  const LiquidityGeneratorToken = await ethers.getContractFactory('LiquidityGeneratorToken');
  const liquiditytoken = await LiquidityGeneratorToken.deploy();

  green(`\n LiquidityGeneratorToken Contract Deployed at ${liquiditytoken.address} `);


  ///deploy LiquidityGeneratorTokenFactory
  const LiquidityGeneratorTokenFactory = await ethers.getContractFactory('LiquidityGeneratorTokenFactory');
  const liquidityGeneratorTokenFactory = await LiquidityGeneratorTokenFactory.deploy(manager.address, liquiditytoken.address);

  green(`\n LiquidityGeneratorTokenFactory Contract Deployed at ${liquidityGeneratorTokenFactory.address} `);


  const BuybackBabyToken = await ethers.getContractFactory('BuybackBabyToken');



  const bbtoken = await BuybackBabyToken.deploy(
    owner.address,
    'BuybackBabyToken',
    'BBT',
    parseEther('100000'),
    standardToken.address, // rewardToken -> StandardToken Address
    routerAddress, // UniswapV2Router02 Address
    [200, 300, 800, 100, 10000], // [liquidityFee ,buybackFee ,reflectionFee ,marketingFee , feeDenominator]
    {
      value: parseEther('0.01'),
      // gasLimit: 3000000
    }


  );
  green(`\n BuybackBabyToken Contract Deployed at ${bbtoken.address} `);

  // console.log('BuybackBabyToken deployed: ', bbtoken.address);

  const BuyBackBabyTokenFactory = await ethers.getContractFactory('BuyBackBabyTokenFactory');
  const bbfactory = await BuyBackBabyTokenFactory.deploy(manager.address, bbtoken.address);


  green(`\n BuyBackBabyTokenFactory Contract Deployed at ${bbfactory.address} `);


  // baby Token

  const IterableMapping = await ethers.getContractFactory('IterableMapping');
  const iterableMapping = await IterableMapping.deploy();


  green(`\n IterableMapping Contract Deployed at ${iterableMapping.address} `);

  // Continue
  const BabyTokenDividendTracker = await ethers.getContractFactory('BabyTokenDividendTracker', {
    libraries: {
      IterableMapping: iterableMapping.address
    }
  });
  const dividendTracker = await BabyTokenDividendTracker.deploy();

  green(`\n BabyTokenDividendTracker Contract Deployed at ${dividendTracker.address} `);


  const BabyToken = await ethers.getContractFactory('BabyToken');
  const btoken = await BabyToken.deploy();

  green(`\n BabyToken Contract Deployed at ${btoken.address} `);



  // /deploy StandardTokenFactory
  const BabyTokenFactory = await ethers.getContractFactory('BabyTokenFactory');
  const bfactory = await BabyTokenFactory.deploy(manager.address, btoken.address);
  green(`\n BabyTokenFactory Contract Deployed at ${bfactory.address} `);




  // yellow(`\n  Contract Verification Deploying...`);


  // cyan(`\nVerifying Start ...`);
  // await hre.run('verify:verify', {
  //   address: service.address,
  //   args: []

  // });

  // cyan(`\n GempadAirdrop Contract Verifying...  `);
  // await hre.run('verify:verify', {
  //   address: airdrop.address,
  //   constructorArguments: []
  // });

  // cyan(`\n GempadAirdropFactory Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: airdropFactory.address,
  //   constructorArguments: [airdrop.address]
  // });




  // cyan(`\n GemAntiBot Contract Verifying...  `);

  // await run('verify:verify', {
  //   address: bot.address,
  //   constructorArguments: []
  // });




  // cyan(`\n GempadDutchAuction Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: auction.address,
  //   constructorArguments: []
  // });

  // cyan(`\n GempadDutchAuctionFactory Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: dutchAuctionFactory.address,
  //   constructorArguments: [auction.address]
  // });




  // cyan(`\n GempadFairLaunch Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: fairLaunch.address,
  //   constructorArguments: []
  // });

  // cyan(`\n GempadFairLuanchFactory Contract Verifying...  `);
  // await hre.run('verify:verify', {
  //   address: factory.address,
  //   constructorArguments: [fairLaunch.address]
  // });



  // cyan(`\n GempadLaunchpad Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: gempadLaunchpad.address,
  //   constructorArguments: []
  // });

  // cyan(`\n GempadLaunchpadFactory Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: gempadLaunchpadFactory.address,
  //   constructorArguments: [gempadLaunchpad.address]
  // });




  // cyan(`\n GempadVestingLock Contract Verifying...  `);
  // await run('verify:verify', {
  //   address: locker.address,
  //   constructorArguments: []
  // });





  // cyan(`\n GempadMultiSender Contract Verifying...  `);
  // await run('verify:verify', {
  //   address: multisender.address,
  //   constructorArgumrnts: []
  // });



  // cyan(`\n GempadPrivateSale Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: sale.address,
  //   constructorArguments: []
  // });

  // cyan(`\n GempadPrivateSaleFactory Contract Verifying...  `);

  // await hre.run('verify:verify', {
  //   address: factory.address,
  //   constructorArguments: [sale.address]
  // });




  // cyan(`\n GempadSubscriptionPool Contract Verifying...  `);
  // await hre.run('verify:verify', {
  //   address: pool.address,
  //   constructorArguments: []
  // });

  // cyan(`\n GempadSubscriptionPoolFactory Contract Verifying...  `);
  // await hre.run('verify:verify', {
  //   address: factory.address,
  //   constructorArguments: [pool.address]
  // });




  // cyan(`\n GempadSubscriptionPoolFactory Contract Verifying...  `);
  // await hre.run('verify:verify', {
  //   address: gemToken.address,
  //   constructorArguments: []
  // });





  // green(`\n GenerateToken Contract Verification Process Start...`);
  // // Contract Verification Process

  // await run('verify:verify', {
  //   address: manager.address,
  //   constructorArguments: []
  // });

  // cyan(`\n Manager Contract Verified  `);

  // await run('verify:verify', {
  //   address: standardToken.address,
  //   constructorArguments: []
  // });

  // cyan(`\n StandardToken Contract Verified  `);


  // await run('verify:verify', {
  //   address: standardFactory.address,
  //   constructorArguments: [manager.address, standardToken.address]
  // });

  // cyan(`\n StandardTokenFactory Contract Verified  `);

  // await run('verify:verify', {
  //   address: liquiditytoken.address,
  //   constructorArguments: []
  // });

  // cyan(`\n LiquidityToken Contract Verified  `);

  // await run('verify:verify', {
  //   address: factory.address,
  //   constructorArguments: [manager.address, liquiditytoken.address]
  // });

  // cyan(`\n LiquidityGenerator Token Verified`)


  // // TODO:Causing Issue : non-contract account function call

  // await run('verify:verify', {
  //   address: bbtoken.address,
  //   constructorArguments: [
  //     owner.address,
  //     'BuybackBabyToken',
  //     'BBT',
  //     parseEther('100000'),
  //     standardToken.address,
  //     '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
  //     [200, 300, 800, 100, 10000]
  //   ]
  // });

  // console.log('buyback token verified...');

  // await run('verify:verify', {
  //   address: bbfactory.address,
  //   constructorArguments: [manager.address, bbtoken.address]
  // });

  // console.log('buyback factory verified...');

  // // TODO:Causing Issue : non-contract account function call


  // await run('verify:verify', {
  //   address: iterableMapping.address,
  //   constructorArguments: []
  // });

  // cyan(`\n IterableMapping Token Verified`)


  // await run('verify:verify', {
  //   address: dividendTracker.address,
  //   constructorArguments: []
  // });

  // cyan(`\n DividendTracker Token Verified`)


  // await run('verify:verify', {
  //   address: btoken.address,
  //   constructorArguments: []
  // });


  // cyan(`\n BabyToken Verified`)


  // await run('verify:verify', {
  //   address: bfactory.address,
  //   constructorArguments: [manager.address, btoken.address]
  // });

  // cyan(`\n BabyTokenFactory Verified`)


  // green(`\n All contract deployed Successfully  `);


}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





