import hre, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants } from 'ethers';

async function main() {
  const [owner, feeReceiver] = await ethers.getSigners();

  const GempadLaunchpad = await ethers.getContractFactory('GempadLaunchpad');
  const gempadLaunchpad = await GempadLaunchpad.deploy();

  await gempadLaunchpad.deployed();

  console.log('GempadLaunchpad deployed:', gempadLaunchpad.address);

  const GempadFactory = await ethers.getContractFactory('GempadLaunchpadFactory');
  const factory = await GempadFactory.deploy(gempadLaunchpad.address);

  await factory.deployed();
  console.log('GempadFactory deployed:', factory.address);

  await hre.run('verify:verify', {
    address: gempadLaunchpad.address,
    constructorArguments: []
  });
  await hre.run('verify:verify', {
    address: factory.address,
    constructorArguments: [gempadLaunchpad.address]
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
