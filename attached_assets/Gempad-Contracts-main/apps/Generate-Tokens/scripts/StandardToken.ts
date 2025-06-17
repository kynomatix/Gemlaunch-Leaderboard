import hre, { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const [owner] = await ethers.getSigners();
  const StandardToken = await ethers.getContractFactory('StandardToken');
  const token = await StandardToken.deploy();


  console.log('StandardToken deployed: ', token.address);

  // /verify smart contract
  await hre.run("verify:verify", {
    address: token.address,
  });

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
