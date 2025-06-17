import hre, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';

async function main() {
  const [owner, user, vip, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

  const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
  const service = await ServiceReceiver.deploy();

  console.log('ServiceReceiver deoloyed:', service.address);

  //private Sale
  await service.setPrice('GempadPrivateSale', parseEther('0.001'));
  await service.setFee('GempadPrivateSale', 5000);

  //Launchpad
  await service.setPrice('GempadLaunchpad', parseEther('0.001'));
  await service.setFee('GempadLaunchpad', 5000);

  //Airdrop
  await service.setPrice('GempadAirdrop', parseEther('0.001'));
  await service.setFee('GempadAirdrop', 5000);

  //DutchAuction
  await service.setPrice('GempadDutchAuction', parseEther('0.001'));
  await service.setFee('GempadDutchAuction', 5000);

  //DutchAuction
  await service.setPrice('GempadFairLaunch', parseEther('0.001'));
  await service.setFee('GempadFairLaunch', 5000);

  //SubscriptionPool
  await service.setPrice('GempadSubscriptionPool', parseEther('0.001'));
  await service.setFee('GempadSubscriptionPool', 5000);

  console.log('fee added....!!');

  //verify
  await hre.run('verify:verify', {
    address: service.address,
    args: []
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
