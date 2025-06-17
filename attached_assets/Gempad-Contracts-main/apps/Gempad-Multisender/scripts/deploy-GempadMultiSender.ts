import { parseEther } from 'ethers/lib/utils';
import { ethers, run } from 'hardhat';

async function main() {
  const [owner, user1, user2] = await ethers.getSigners();

  const GempadSender = await ethers.getContractFactory('GempadMultiSender');
  const multisender = await GempadSender.deploy();

  console.log('GempadMultiSender deployed at:', multisender.address);

  await run('verify:verify', {
    address: multisender.address,
    constructorArgumrnts: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
