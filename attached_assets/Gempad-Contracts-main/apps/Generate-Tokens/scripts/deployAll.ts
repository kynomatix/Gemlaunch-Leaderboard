import { ethers, run } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

async function main() {
  const [owner] = await ethers.getSigners();

  const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  const manager = await TokenFactoryManager.deploy();

  console.log('TokenFactoryManager deployed: ', manager.address);

  const StandardToken = await ethers.getContractFactory('StandardToken');
  const standardToken = await StandardToken.deploy();

  console.log('StandardToken deployed: ', standardToken.address);

  // ///deploy LiquidityGeneratorToken
  // const StandardTokenFactory = await ethers.getContractFactory('StandardTokenFactory');
  // const standardFactory = await StandardTokenFactory.deploy(manager.address, token.address);

  // console.log('standardFactory deployed: ', standardFactory.address);

  // const LiquidityGeneratorToken = await ethers.getContractFactory('LiquidityGeneratorToken');
  // const liquiditytoken = await LiquidityGeneratorToken.deploy();

  // console.log('LiquidityGeneratorToken deployed: ', liquiditytoken.address);

  ///deploy LiquidityGeneratorTokenFactory
  // const LiquidityGeneratorTokenFactory = await ethers.getContractFactory('LiquidityGeneratorTokenFactory');
  // const factory = await LiquidityGeneratorTokenFactory.deploy(manager.address, liquiditytoken.address);

  // console.log('Liquidity Generator Token Factory deployed: ', factory.address);

  const BuybackBabyToken = await ethers.getContractFactory('BuybackBabyToken');
  const bbtoken = await BuybackBabyToken.deploy(
    owner.address,
    'BuybackBabyToken',
    'BBT',
    parseEther('100000'),
    // '0x6a0454a31E591B94BaA839996EDb35090bEb7A19',
    standardToken.address,
    '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
    [200, 300, 800, 100, 10000],
    { value: parseEther('0.01'), gasLimit: 3000000 }
  );

  console.log('BuybackBabyToken deployed: ', bbtoken.address);

  const BuyBackBabyTokenFactory = await ethers.getContractFactory('BuyBackBabyTokenFactory');
  const bbfactory = await BuyBackBabyTokenFactory.deploy(manager.address, bbtoken.address);

  console.log('BuyBackBabyTokenFactory deployed: ', bbfactory.address);

  // //baby Token

  // const IterableMapping = await ethers.getContractFactory('IterableMapping');
  // const iterableMapping = await IterableMapping.deploy();

  // console.log('iterableMapping deployed: ', iterableMapping.address);

  // const BabyTokenDividendTracker = await ethers.getContractFactory('BabyTokenDividendTracker', {
  //   libraries: {
  //     IterableMapping: iterableMapping.address
  //   }
  // });
  // const dividendTracker = await BabyTokenDividendTracker.deploy();

  // console.log('dividendTracker deployed: ', dividendTracker.address);

  // const BabyToken = await ethers.getContractFactory('BabyToken');
  // const btoken = await BabyToken.deploy();

  // console.log('BabyToken deployed: ', btoken.address);

  // // /deploy StandardTokenFactory
  // const BabyTokenFactory = await ethers.getContractFactory('BabyTokenFactory');
  // const bfactory = await BabyTokenFactory.deploy(manager.address, btoken.address);

  // console.log('BabyTokenFactory deployed: ', bfactory.address);

  // await run('verify:verify', {
  //   address: manager.address,
  //   constructorArguments: []
  // });

  // console.log('manager verified...');

  // await run('verify:verify', {
  //   address: standardToken.address,
  //   constructorArguments: []
  // });

  // console.log('token verified...');

  // await run('verify:verify', {
  //   address: standardFactory.address,
  //   constructorArguments: [manager.address, standardToken.address]
  // });

  // console.log('standard factory verified...');

  // await run('verify:verify', {
  //   address: liquiditytoken.address,
  //   constructorArguments: []
  // });

  // console.log('liquidity token verified...');

  // await run('verify:verify', {
  //   address: factory.address,
  //   constructorArguments: [manager.address, liquiditytoken.address]
  // });

  console.log('liquidity generator factory verified...');

  await run('verify:verify', {
    // address: bbtoken.address,
    address: '0xBA039CFE60FD8413A87AAc1C6115cE41c1a79869',
    constructorArguments: [
      owner.address,
      'BuybackBabyToken',
      'BBT',
      parseEther('100000'),
      standardToken.address,
      '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
      [200, 300, 800, 100, 10000]
    ]
  });

  console.log('buyback token verified...');

  await run('verify:verify', {
    address: bbfactory.address,
    constructorArguments: [manager.address, bbtoken.address]
  });

  // console.log('buyback factory verified...');

  // await run('verify:verify', {
  //   address: iterableMapping.address,
  //   constructorArguments: []
  // });

  // console.log('iterableMapping verified...');

  // await run('verify:verify', {
  //   address: dividendTracker.address,
  //   constructorArguments: []
  // });

  // console.log('dividendTracker verified...');

  // await run('verify:verify', {
  //   address: btoken.address,
  //   constructorArguments: []
  // });

  // console.log('baby token verified...');

  // await run('verify:verify', {
  //   address: bfactory.address,
  //   constructorArguments: [manager.address, btoken.address]
  // });

  // console.log('baby token verified...');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
