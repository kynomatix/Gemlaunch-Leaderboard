import { ethers } from 'hardhat';

async function main() {
  const [owner, user, user2, newAdmin] = await ethers.getSigners();

  const GempadInterfaceMulticall = await ethers.getContractFactory('GempadInterfaceMulticall');
  const multicall = await GempadInterfaceMulticall.deploy();

  console.log('GempadInterfaceMulticall deployed:', multicall.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
