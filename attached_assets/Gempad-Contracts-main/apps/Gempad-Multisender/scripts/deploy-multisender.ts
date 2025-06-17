import { ethers } from 'hardhat';

async function main() {
  const GempadAirdrop = await ethers.getContractFactory('Multisender');
  const airdrop = await GempadAirdrop.deploy();

  console.log('Multisender deployed at:', airdrop.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
