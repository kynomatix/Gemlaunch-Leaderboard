import { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function main() {
  const [owner, user] = await ethers.getSigners();

  const TestToken = await ethers.getContractFactory('TestToken');
  const testToken = await TestToken.deploy();

  console.log('TestToken deployed: ', testToken.address);

  const Factory = await ethers.getContractFactory('GempadV2Factory');
  const factoryV2 = await Factory.deploy(owner.address);

  const WETH = await ethers.getContractFactory('WETH9');
  const weth = await WETH.deploy();

  const Router = await ethers.getContractFactory('GempadV2Router02');
  const router = await Router.deploy(factoryV2.address, weth.address);

  const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  const manager = await TokenFactoryManager.deploy();

  console.log('TokenFactoryManager deployed: ', manager.address);

  // let manager = '0x53B49a9bC4cf351ab78dC7De199F9f56A5DCFf93';

  const IterableMapping = await ethers.getContractFactory('IterableMapping');
  const iterableMapping = await IterableMapping.deploy();

  const BabyTokenDividendTracker = await ethers.getContractFactory('BabyTokenDividendTracker', {
    libraries: {
      IterableMapping: iterableMapping.address
    }
  });
  const dividendTracker = await BabyTokenDividendTracker.deploy();

  const BabyToken = await ethers.getContractFactory('BabyToken');
  const token = await BabyToken.deploy();

  console.log('BabyToken deployed: ', token.address);

  let managerAddressGoerli = '0x8C81db60B98c28d270559B3C0A6f131eaad77318';
  let managerAddressBSC = '0x2904aC36f5f63ABb1DaFd95FB3182bfedBFD8424';

  // /deploy StandardTokenFactory
  const BabyTokenFactory = await ethers.getContractFactory('BabyTokenFactory');
  const factory = await BabyTokenFactory.deploy(managerAddressBSC, token.address);

  console.log('BabyTokenFactory deployed: ', factory.address);

  // await manager.addTokenFactory(factory.address);

  // await factory.create(
  //   'babyToken',
  //   'BBT',
  //   parseEther('100000'),
  //   [testToken.address, router.address, user.address, dividendTracker.address],
  //   [5, 5, 5],
  //   parseEther('1000'),
  //   { value: parseEther('0.01') }
  // );

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
