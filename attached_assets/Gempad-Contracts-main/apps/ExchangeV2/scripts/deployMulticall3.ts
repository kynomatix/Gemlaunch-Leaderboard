import { ethers } from 'hardhat';

async function main() {
  const [owner, user, user2, newAdmin] = await ethers.getSigners();

  const Multicall3 = await ethers.getContractFactory('Multicall3');
  const multicall = await Multicall3.deploy();

  console.log('Multicall3 deployed:', multicall.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
