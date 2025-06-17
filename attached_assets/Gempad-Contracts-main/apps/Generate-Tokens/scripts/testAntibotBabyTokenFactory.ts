import { ethers } from 'hardhat';
import hre from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { GempadV1Factory, GempadV1Router02, factories, WETH9 } from '../typechain-types';
async function main() {
  const [owner, user] = await hre.ethers.getSigners();

  const TestToken = await ethers.getContractFactory('TestToken');
  const testToken = await TestToken.deploy();

  const TestToken2 = await ethers.getContractFactory('TestToken');
  const testToken2 = await TestToken2.deploy();

  console.log('TestToken deployed: ', testToken.address);

  const Factory = await ethers.getContractFactory('GempadV1Factory');
  const factoryV2 = await Factory.deploy(owner.address);

  const WETH = await ethers.getContractFactory('WETH9');
  const weth = await WETH.deploy();

  const Router = await ethers.getContractFactory('GempadV1Router02');
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

  await dividendTracker.initialize(testToken.address, parseEther('100'));

  const GemAntiBot = await ethers.getContractFactory('GemAntiBot');
  const antiBot = await GemAntiBot.deploy();

  console.log('antiBot deployed: ', antiBot.address);

  const AntiBotBabyToken = await ethers.getContractFactory('AntiBotBabyToken');
  const token = await AntiBotBabyToken.deploy(
    owner.address,
    'AntiBotbabyToken',
    'ABBT',
    parseEther('100000'),
    [testToken.address, router.address, user.address, dividendTracker.address, antiBot.address],
    [5, 5, 5],
    parseEther('1000'),
    { value: parseEther('0.01') }
  );

  console.log('AntiBotBabyToken deployed: ', token.address);

  // /deploy StandardTokenFactory
  const AntibotBabyTokenFactory = await ethers.getContractFactory('AntibotBabyTokenFactory');
  const factory = await AntibotBabyTokenFactory.deploy(manager.address, token.address);

  console.log('BabyTokenFactory deployed: ', factory.address);

  await manager.addTokenFactory(factory.address);

  await factory.create(
    'AntiBotbabyToken',
    'ABBT',
    parseEther('100000'),
    [testToken.address, router.address, user.address, dividendTracker.address, antiBot.address],
    [5, 5, 5],
    parseEther('1000'),
    { value: parseEther('0.01') }
  );

  await factory.create(
    'BotbabyToken',
    'BBT',
    parseEther('100000'),
    [testToken2.address, router.address, user.address, dividendTracker.address, antiBot.address],
    [5, 5, 5],
    parseEther('1000'),
    { value: parseEther('0.01') }
  );

  let newToken = await manager.getToken(owner.address, 0);
  let newToken2 = await manager.getToken(owner.address, 1);

  let tok = new ethers.Contract(newToken[0], AntiBotBabyToken.interface, owner);
  let tok2 = new ethers.Contract(newToken2[0], AntiBotBabyToken.interface, owner);

  console.log('token address', tok.address, await tok.symbol());
  console.log('token address', tok2.address, await tok2.symbol());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
