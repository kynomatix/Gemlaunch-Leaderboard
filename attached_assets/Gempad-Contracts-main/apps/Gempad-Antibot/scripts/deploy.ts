import { ethers, run } from 'hardhat';

async function main() {
  const Antibot = await ethers.getContractFactory('GemAntiBot');
  const bot = await Antibot.deploy();
  await bot.deployed();

  console.log('anti bot depoyed:', bot.address);

  await run('verify:verify', {
    address: bot.address,
    constructorArguments: []
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
