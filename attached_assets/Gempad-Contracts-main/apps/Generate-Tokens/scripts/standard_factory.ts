import { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function main() {
  const [owner] = await ethers.getSigners();

  const StandardToken = await ethers.getContractFactory('StandardToken');
  const token = await StandardToken.deploy();

  console.log('StandardToken deployed: ', token.address);

  // const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  // const manager = await TokenFactoryManager.deploy();

  // console.log('TokenFactoryManager deployed: ', manager.address);

  let managerAddressGoerli = '0x8C81db60B98c28d270559B3C0A6f131eaad77318';
  let managerAddressBSC = '0x2904aC36f5f63ABb1DaFd95FB3182bfedBFD8424';

  ///deploy StandardTokenFactory
  const StandardTokenFactory = await ethers.getContractFactory('StandardTokenFactory');
  const standardFactory = await StandardTokenFactory.deploy(managerAddressBSC, token.address);

  console.log('standardFactory deployed: ', standardFactory.address);

  // /verify smart contract
  // await hre.run("verify:verify", {
  //   address: standardFactory.address,
  //   constructorArguments: [
  //     manager.address,
  //     token.address
  //   ],
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
