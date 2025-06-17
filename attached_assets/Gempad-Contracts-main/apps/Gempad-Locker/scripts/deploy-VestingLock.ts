import { ethers, run } from 'hardhat';
import hre from 'hardhat';

async function main() {
  const VestingLock = await ethers.getContractFactory('GempadVestingLock');
  const locker = await VestingLock.deploy();

  console.log('VestingLock deployed at :', locker.address);

  await run('verify:verify', {
    address: locker.address,
    constructorArguments: []
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
