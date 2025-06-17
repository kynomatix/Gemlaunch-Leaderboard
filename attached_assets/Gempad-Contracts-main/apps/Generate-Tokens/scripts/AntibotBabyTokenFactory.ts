import { ethers } from 'hardhat';
import hre from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { GempadV1Factory, GempadV1Router02, factories, WETH9 } from '../typechain-types';
async function main() {
  const [owner, user] = await hre.ethers.getSigners();

  // const TestToken = await ethers.getContractFactory('TestToken');
  // const testToken = await TestToken.deploy();

  const testTokenGoerli = '0x7BD270F74cE8964e4c41DecAFF07059aa6885F6e';
  const testTokenBsc = '0x755f088dC1811e3712f459E8e6939d241680A1D1';

  let antiBotGoerli = '0xF87fa195AB51b635E60Ed6F6C7B6d7F55D81AA4D';
  let antiBot = '0x16aCfa215a754F30c9084a4eF6fa7Db37eaCFBD4';

  let managerAddressGoerli = '0x8C81db60B98c28d270559B3C0A6f131eaad77318';
  let managerAddress = '0x1DA9730E3807C44d27443F7c43dcF5F90ad76a62';

  let dividendTrackerGoerli = '0x7fDd5B2e0EDA09174aF68397FD021c6E7f2B7531';
  let dividendTrackerBsc = '0x16Ff12D2A73494d8201dA8504F793D202b7DcEe9';

  // const Factory = await ethers.getContractFactory('GempadV1Factory');
  // const factoryV2 = await Factory.deploy(owner.address);

  // const WETH = await ethers.getContractFactory('WETH9');
  // const weth = await WETH.deploy();

  // const Router = await ethers.getContractFactory('GempadV1Router02');
  // const router = await Router.deploy(factoryV2.address, weth.address);

  // const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  // const manager = await TokenFactoryManager.deploy();

  // console.log('TokenFactoryManager deployed: ', manager.address);

  // let manager = '0x53B49a9bC4cf351ab78dC7De199F9f56A5DCFf93';

  // const IterableMapping = await ethers.getContractFactory('IterableMapping');
  // const iterableMapping = await IterableMapping.deploy();

  // const BabyTokenDividendTracker = await ethers.getContractFactory('BabyTokenDividendTracker', {
  //   libraries: {
  //     IterableMapping: iterableMapping.address
  //   }
  // });
  // const dividendTracker = await BabyTokenDividendTracker.deploy();

  // await dividendTracker.initialize(testToken.address, parseEther('100'));

  // const GemAntiBot = await ethers.getContractFactory('GemAntiBot');
  // const antiBot = await GemAntiBot.deploy();

  // console.log('antiBot deployed: ', antiBot.address);

  //Goerli network

  // const AntiBotBabyToken = await ethers.getContractFactory('AntiBotBabyToken');
  // const token = await AntiBotBabyToken.deploy(
  //   owner.address,
  //   'AntiBotbabyToken',
  //   'ABBT',
  //   parseEther('100000'),
  //   [
  //     testTokenGoerli,
  //     '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  //     user.address,
  //     dividendTrackerGoerli,
  //     antiBotGoerli
  //   ],
  //   [5, 5, 5],
  //   parseEther('1000'),
  //   { value: parseEther('0.01') }
  // );

  //BSC network

  const AntiBotBabyToken = await ethers.getContractFactory('AntiBotBabyToken');
  const token = await AntiBotBabyToken.deploy(
    owner.address,
    'AntiBotbabyToken',
    'ABBT',
    parseEther('100000'),
    [
      '0x5E96fF318D0A306ddCea45e78E5000C0a6E8569C',
      '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
      user.address,
      '0x68A9FbDfab50B0B4F9D55Bdd9db633788BC8cE67', //dividen tracker
      antiBot
    ],
    [5, 5, 5],
    parseEther('1000'),
    { value: parseEther('0.01') }
  );

  console.log('AntiBotBabyToken deployed: ', token.address);

  // /deploy StandardTokenFactory
  const AntibotBabyTokenFactory = await ethers.getContractFactory('AntibotBabyTokenFactory');
  const factory = await AntibotBabyTokenFactory.deploy(managerAddress, token.address);

  console.log('AntibotBabyTokenFactory  deployed: ', factory.address);

  await hre.run('verify:verify', {
    address: token.address,
    constructorArguments: [
      owner.address,
      'AntiBotbabyToken',
      'ABBT',
      parseEther('100000'),
      [
        '0x5E96fF318D0A306ddCea45e78E5000C0a6E8569C',
        '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
        user.address,
        '0x68A9FbDfab50B0B4F9D55Bdd9db633788BC8cE67', //dividen tracker
        antiBot
      ],
      [5, 5, 5],
      parseEther('1000')
    ]
  });
  await hre.run('verify:verify', {
    address: factory.address,
    constructorArguments: [managerAddress, token.address]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
