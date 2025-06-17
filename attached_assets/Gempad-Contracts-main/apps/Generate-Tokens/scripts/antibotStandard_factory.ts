import { ethers, run } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function main() {
  const [owner] = await ethers.getSigners();

  const AntiBotStandardToken = await ethers.getContractFactory('AntiBotStandardToken');
  const token = await AntiBotStandardToken.deploy();

  console.log('StandardToken deployed: ', token.address);

  // await run('verify:verify', {
  //   address: token.address,
  //   constructorArguments: []
  // });

  let managerAddressGoerli = '0x8C81db60B98c28d270559B3C0A6f131eaad77318';
  let managerAddressfantom = '0x1DA9730E3807C44d27443F7c43dcF5F90ad76a62';

  ///deploy StandardTokenFactory
  const AntiBotStandardTokenFactory = await ethers.getContractFactory('AntiBotStandardTokenFactory');
  const standardFactory = await AntiBotStandardTokenFactory.deploy(managerAddressfantom, token.address);

  console.log('AntiBotStandardTokenFactory deployed: ', standardFactory.address);

  // await run('verify:verify', {
  //   address: standardFactory.address,
  //   constructorArguments: [managerAddressfantom, token.address]
  // });
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
