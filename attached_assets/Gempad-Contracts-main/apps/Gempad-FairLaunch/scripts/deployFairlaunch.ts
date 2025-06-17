import hre, { ethers } from 'hardhat';
import { parseEther, formatEther, commify } from 'ethers/lib/utils';
import { constants } from 'ethers';
import { contracts } from '../typechain-types';

async function main() {
  const [owner, feeReceiver] = await ethers.getSigners();

  const GempadFairLaunch = await ethers.getContractFactory('GempadFairLaunch');
  const fairLaunch = await GempadFairLaunch.deploy();

  await fairLaunch.deployed();

  console.log('Gempad Fairlaunch deployed:', fairLaunch.address);

  const GempadFactory = await ethers.getContractFactory('GempadFairLuanchFactory');

  const factory = await GempadFactory.deploy(fairLaunch.address);

  await factory.deployed();
  console.log('Fairlaunch factory deployed:', factory.address);

  await hre.run('verify:verify', {
    address: fairLaunch.address,
    constructorArguments: []
  });
  await hre.run('verify:verify', {
    address: factory.address,
    constructorArguments: [fairLaunch.address]
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
