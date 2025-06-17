import hre, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';

async function main() {
  const [owner, user, vip, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

  // const TestToken = await ethers.getContractFactory('TestToken');
  // const token = await TestToken.deploy();

  const Airdrop = await ethers.getContractFactory('GempadAirdrop');
  const airdrop = await Airdrop.deploy();

  await airdrop.deployed();

  console.log('Airdrop deployed: ', airdrop.address);

  const airAddress = '0x4991aE5fd30A1a367A889c422189E627865733dE'; //goerli
  // const airAddress = '0x1bFB8D383536f28B3D6d268eadD9ce0CF77D277b'; //bsc

  const GempadAirdropFactory = await ethers.getContractFactory('GempadAirdropFactory');
  const factory = await GempadAirdropFactory.deploy(airdrop.address);

  await factory.deployed();

  console.log('GempadAirdropFactory deployed: ', factory.address);

  await hre.run('verify:verify', {
    address: airdrop.address,
    constructorArguments: []
  });
  await hre.run('verify:verify', {
    address: factory.address,
    constructorArguments: [airdrop.address]
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
