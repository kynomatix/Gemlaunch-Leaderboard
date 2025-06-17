import hre, { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

// import { cyan } from './colors';


// import { allContracts, getContractByName } from './utils'
import { cyan, green } from '../../src/colors';
import TokenGeneratorDeploymentHardhat from '../tokengeneratorHardhat';

// import { DeployOptions } from 'hardhat-deploy/dist/types';



async function AirDropDeployment(): Promise<{
  AirdropContract: string;
  AirdropFactory: string;
}> {
  /////////////  GempadAirdrop /////////////////////

  const Airdrop = await ethers.getContractFactory('GempadAirdrop');
  const airdrop = await Airdrop.deploy();

  await airdrop.deployed();

  green(`\n GempadAirdrop Contract Deployed at ${airdrop.address} `);


  const GempadAirdropFactory = await ethers.getContractFactory('GempadAirdropFactory');
  const airdropFactory = await GempadAirdropFactory.deploy(airdrop.address);

  await airdropFactory.deployed();
  green(`\n GempadAirdropFactory Contract Deployed at ${airdropFactory.address} `);


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


  return {
    AirdropContract: airdrop.address,
    AirdropFactory: airdropFactory.address
  }

  /////////////  GempadAirdrop /////////////////////
}

async function AntiBotDeployment() {

  const Antibot = await ethers.getContractFactory('GemAntiBot');
  const bot = await Antibot.deploy();
  await bot.deployed();

  green(`\n GemAntiBot Contract Deployed at ${bot.address} `);

  // cyan(`\n GemAntiBot Contract Verifying...  `);

  // await run('verify:verify', {
  //   address: bot.address,
  //   constructorArguments: []
  // });


  return {
    AntiBotContract: bot.address,
  }

}

async function ServiceReceiverDeployment() {

  ///////////  ServiceReciver /////////////////////

  const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
  const service = await ServiceReceiver.deploy();
  await service.deployed()



  green(`\nContract Deployed at ${service.address} `);

  // cyan(`\nVerifying Start ...`);
  // await hre.run('verify:verify', {
  //   address: service.address,
  //   args: []
  // });



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

  console.log('fee added....!! Verifying ServiceReceiver:', service.address);



  ///////////  ServiceReciver /////////////////////

  return {
    ServiceReceiver: service.address
  }
}

async function DutchAuctionDeployment() {
  const GempadDutchAuction = await ethers.getContractFactory('GempadDutchAuction');
  const auction = await GempadDutchAuction.deploy();

  await auction.deployed();

  green(`\n GempadDutchAuction Contract Deployed at ${auction.address} `);


  ///deploy factory
  const GempadDutchAuctionFactory = await ethers.getContractFactory('GempadDutchAuctionFactory');
  const dutchAuctionFactory = await GempadDutchAuctionFactory.deploy(auction.address);

  await dutchAuctionFactory.deployed();
  green(`\n GempadDutchAuctionFactory Contract Deployed at ${dutchAuctionFactory.address} `);


  // cyan(`\n GempadDutchAuction Contract Verifying...  `);

  // // await hre.run('verify:verify', {
  // //   address: auction.address,
  // //   constructorArguments: []
  // // });

  // // cyan(`\n GempadDutchAuctionFactory Contract Verifying...  `);

  // // await hre.run('verify:verify', {
  // //   address: dutchAuctionFactory.address,
  // //   constructorArguments: [auction.address]
  // // });

  return {
    DutchAuctionContract: auction.address,
    DutchAuctionFactory: dutchAuctionFactory.address
  }
}


async function FairLaunchDeployment() {

  const GempadFairLaunch = await ethers.getContractFactory('GempadFairLaunch');
  const fairLaunch = await GempadFairLaunch.deploy();

  await fairLaunch.deployed();

  green(`\n GempadLaunchpad Contract Deployed at ${fairLaunch.address} `);


  const GempadFactory = await ethers.getContractFactory('GempadFairLuanchFactory');

  const factory = await GempadFactory.deploy(fairLaunch.address);

  await factory.deployed();
  green(`\n GempadLaunchpad Contract Deployed at ${factory.address} `);



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



  return {
    FairLaunchContract: fairLaunch.address,
    FairLaunchFactory: factory.address
  }
}

async function LaunchpadDeployment() {

  // GempadLaunchpad

  const GempadLaunchpad = await ethers.getContractFactory('GempadLaunchpad');
  const gempadLaunchpad = await GempadLaunchpad.deploy();

  await gempadLaunchpad.deployed();

  green(`\n GempadLaunchpad Contract Deployed at ${gempadLaunchpad.address} `);


  const GempadFactory = await ethers.getContractFactory('GempadLaunchpadFactory');
  const gempadLaunchpadFactory = await GempadFactory.deploy(gempadLaunchpad.address);
  await gempadLaunchpadFactory.deployed();

  green(`\n GempadLaunchpadFactory Contract Deployed at ${gempadLaunchpadFactory.address} `);



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

  // GempadLaunchpad

  return {
    LaunchpadContract: gempadLaunchpad.address,
    LaunchpadFactory: gempadLaunchpadFactory.address
  }
}
async function LockerDeployment() {


  const VestingLock = await ethers.getContractFactory('GempadVestingLock');
  const locker = await VestingLock.deploy();

  await locker.deployed() // added by me

  // green(`\n GempadVestingLock Contract Deployed at ${locker.address} `);


  // cyan(`\n GempadVestingLock Contract Verifying...  `);
  // await run('verify:verify', {
  //   address: locker.address,
  //   constructorArguments: []
  // });


  return {
    LockerContract: locker.address
  }

}
async function MultiSenderDeployment() {



  const GempadSender = await ethers.getContractFactory('GempadMultiSender');
  const multisender = await GempadSender.deploy();

  await multisender.deployed(); // added by me

  green(`\n GempadMultiSender Contract Deployed at ${multisender.address} `);

  // cyan(`\n GempadMultiSender Contract Verifying...  `);
  // await run('verify:verify', {
  //   address: multisender.address,
  //   constructorArgumrnts: []
  // });

  return {
    MultiSenderContract: multisender.address
  }
}

async function PrivateSaleDeployment() {


  const GempadPrivatesale = await ethers.getContractFactory('GempadPrivateSale');
  const sale = await GempadPrivatesale.deploy();
  await sale.deployed();

  green(`\n GempadPrivateSale Contract Deployed at ${sale.address} `);

  const GempadPrivateSaleFactory = await ethers.getContractFactory('GempadPrivateSaleFactory');
  const factory = await GempadPrivateSaleFactory.deploy(sale.address);
  await factory.deployed();

  green(`\n GempadPrivateSaleFactory Contract Deployed at ${factory.address} `);


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


  return {
    PrivateSaleContract: sale.address,
    PrivateSaleFactory: factory.address,
  }


}


async function SubscriptionPoolDeployment() {
  const GempadSubscriptionPool = await ethers.getContractFactory('GempadSubscriptionPool');
  const pool = await GempadSubscriptionPool.deploy();
  await pool.deployed();

  green(`\n GempadSubscriptionPool Contract Deployed at ${pool.address} `);


  ///deploy factory
  const GempadSubscriptionPoolFactory = await ethers.getContractFactory('GempadSubscriptionPoolFactory');
  const factory = await GempadSubscriptionPoolFactory.deploy(pool.address);
  await factory.deployed();

  green(`\n GempadSubscriptionPoolFactory Contract Deployed at ${factory.address} `);

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

  return {
    SubscriptionPoolContract: pool.address,
    SubscriptionPoolFactory: factory.address
  }
}

async function GemTokenDeployment() {
  const token = await ethers.getContractFactory('GemToken');
  const gemToken = await token.deploy()

  await gemToken.deployed()
  green(`\n GemToken Contract Deployed at ${gemToken.address} `);


  // cyan(`\n GempadSubscriptionPoolFactory Contract Verifying...  `);
  // await hre.run('verify:verify', {
  //   address: gemToken.address,
  //   constructorArguments: []
  // });


  return {
    GemTokenContract: gemToken.address
  }
}
async function main() {
  const { getNamedAccounts } = hre
  const { deployer } = await getNamedAccounts()
  cyan(`\nDeploying Start ...`);

  const service = await ServiceReceiverDeployment()
  const airdrop = await AirDropDeployment()
  const antibot = await AntiBotDeployment()
  const dutchAuction = await DutchAuctionDeployment()
  const fairLaunch = await FairLaunchDeployment()
  const launchpad = await LaunchpadDeployment()
  const locker = await LockerDeployment()
  const multisender = await MultiSenderDeployment()
  const privateSale = await PrivateSaleDeployment()
  const subscription = await SubscriptionPoolDeployment()
  const gemToken = await GemTokenDeployment()
  // const tokenGenerator = await TokenGeneratorDeploymentHardhat()

  green(`\n All contract deployed Successfully  `);

  // const allContracts = [service, airdrop, antibot, dutchAuction, fairLaunch, launchpad, locker, multisender, privateSale, subscription,
  //   gemToken,
  //   tokenGenerator]

  // green(`\n ${allContracts}`)
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





