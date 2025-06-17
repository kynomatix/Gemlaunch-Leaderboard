import hre, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants } from 'ethers';

async function main() {
  const [owner] = await ethers.getSigners();

  const GempadSubscriptionPool = await ethers.getContractFactory('GempadSubscriptionPool');
  const pool = await GempadSubscriptionPool.deploy();

  await pool.deployed();

  console.log('GempadSubscriptionPool deployed:', pool.address);

  ///deploy factory
  const GempadSubscriptionPoolFactory = await ethers.getContractFactory('GempadSubscriptionPoolFactory');
  const factory = await GempadSubscriptionPoolFactory.deploy(pool.address);

  await factory.deployed();
  console.log('GempadSubscriptionPoolFactory deployed:', factory.address);

  await hre.run('verify:verify', {
    address: pool.address,
    constructorArgumrnts: []
  });
  await hre.run('verify:verify', {
    address: factory.address,
    constructorArgumrnts: [pool.address]
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
