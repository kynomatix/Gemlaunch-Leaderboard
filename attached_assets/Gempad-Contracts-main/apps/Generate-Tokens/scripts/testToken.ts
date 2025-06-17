import { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const [owner] = await ethers.getSigners();
  const TestToken = await ethers.getContractFactory('TestToken');
  const token = await TestToken.deploy();

  console.log('TestToken deployed: ', token.address);

  //0x0ae91CA2F067495a08FEa32a8800347adB3B1953
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
