import hre, { ethers } from 'hardhat';

async function main() {
  const TestToken = await ethers.getContractFactory('TestToken');
  const token = await TestToken.deploy();

  await token.deployed();

  // /verify smart contract
  await hre.run('verify:verify', {
    address: token.address,
    constructorArguments: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
