import { ethers, run } from 'hardhat';

async function main() {
  const lock = await ethers.deployContract('GemToken', []);

  console.log('Gem token deployed:', lock.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
