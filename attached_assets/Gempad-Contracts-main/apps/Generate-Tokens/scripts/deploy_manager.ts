import { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const [owner] = await ethers.getSigners();
  const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  const manager = await TokenFactoryManager.deploy();

  // /verify smart contract
  // await hre.run("verify:verify", {
  //   address: token.address,
  //   constructorArguments: [
  //     "StandardToken",
  //     "ST",
  //     18,
  //     parseEther("100000"),
  //     owner.address,
  //     1000,
  //   ],
  // });

  console.log('TokenFactoryManager deployed: ', manager.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
