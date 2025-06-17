import { parseEther } from 'ethers/lib/utils';
import { ethers, run } from 'hardhat';
import React from 'react'
import { cyan, green } from '../src/colors';

const TokenGeneratorDeployment = async () => {
  const [owner] = await ethers.getSigners();





  const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  const manager = await TokenFactoryManager.deploy();


  green(`\n TokenFactoryManager Contract Deployed at ${manager.address} `);



  const StandardToken = await ethers.getContractFactory('StandardToken');
  const token = await StandardToken.deploy();


  green(`\n StandardToken Contract Deployed at ${token.address} `);


  ///deploy LiquidityGeneratorToken
  const StandardTokenFactory = await ethers.getContractFactory('StandardTokenFactory');
  const standardFactory = await StandardTokenFactory.deploy(manager.address, token.address);


  green(`\n StandardTokenFactory Contract Deployed at ${standardFactory.address} `);


  const LiquidityGeneratorToken = await ethers.getContractFactory('LiquidityGeneratorToken');
  const liquiditytoken = await LiquidityGeneratorToken.deploy();

  green(`\n LiquidityGeneratorToken Contract Deployed at ${liquiditytoken.address} `);


  ///deploy LiquidityGeneratorTokenFactory
  const LiquidityGeneratorTokenFactory = await ethers.getContractFactory('LiquidityGeneratorTokenFactory');
  const factory = await LiquidityGeneratorTokenFactory.deploy(manager.address, liquiditytoken.address);

  green(`\n LiquidityGeneratorTokenFactory Contract Deployed at ${factory.address} `);


  // // TODO: Causing Issue : non-contract account function call
  // const BuybackBabyToken = await ethers.getContractFactory('BuybackBabyToken');



  // const bbtoken = await BuybackBabyToken.deploy(
  //   owner.address,
  //   'BuybackBabyToken',
  //   'BBT',
  //   parseEther('100000'),
  //   token.address, // rewardToken -> StandardToken Address
  //   '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918', // UniswapV2Router02 Address
  //   [200, 300, 800, 100, 10000], // [liquidityFee ,buybackFee ,reflectionFee ,marketingFee , feeDenominator]
  //   { value: parseEther('0.01') }
  // );

  // console.log('BuybackBabyToken deployed: ', bbtoken.address);

  // const BuyBackBabyTokenFactory = await ethers.getContractFactory('BuyBackBabyTokenFactory');
  // const bbfactory = await BuyBackBabyTokenFactory.deploy(manager.address, bbtoken.address);

  // console.log('BuyBackBabyTokenFactory deployed: ', bbfactory.address);

  // // TODO:Causing Issue : non-contract account function call

  // baby Token

  const IterableMapping = await ethers.getContractFactory('IterableMapping');
  const iterableMapping = await IterableMapping.deploy();


  green(`\n IterableMapping Contract Deployed at ${iterableMapping.address} `);

  // Continue
  const BabyTokenDividendTracker = await ethers.getContractFactory('BabyTokenDividendTracker', {
    libraries: {
      IterableMapping: iterableMapping.address
    }
  });
  const dividendTracker = await BabyTokenDividendTracker.deploy();

  green(`\n BabyTokenDividendTracker Contract Deployed at ${dividendTracker.address} `);


  const BabyToken = await ethers.getContractFactory('BabyToken');
  const btoken = await BabyToken.deploy();

  green(`\n BabyToken Contract Deployed at ${btoken.address} `);



  // /deploy StandardTokenFactory
  const BabyTokenFactory = await ethers.getContractFactory('BabyTokenFactory');
  const bfactory = await BabyTokenFactory.deploy(manager.address, btoken.address);
  green(`\n BabyTokenFactory Contract Deployed at ${bfactory.address} `);



  green(`\n GenerateToken Contract Verification Process Start...`);
  // Contract Verification Process

  await run('verify:verify', {
    address: manager.address,
    constructorArguments: []
  });

  cyan(`\n Manager Contract Verified  `);

  await run('verify:verify', {
    address: token.address,
    constructorArguments: []
  });

  cyan(`\n StandardToken Contract Verified  `);


  await run('verify:verify', {
    address: standardFactory.address,
    constructorArguments: [manager.address, token.address]
  });

  cyan(`\n StandardTokenFactory Contract Verified  `);

  await run('verify:verify', {
    address: liquiditytoken.address,
    constructorArguments: []
  });

  cyan(`\n LiquidityToken Contract Verified  `);

  await run('verify:verify', {
    address: factory.address,
    constructorArguments: [manager.address, liquiditytoken.address]
  });

  cyan(`\n LiquidityGenerator Token Verified`)


  // TODO:Causing Issue : non-contract account function call

  // await run('verify:verify', {
  //   address: bbtoken.address,
  //   constructorArguments: [
  //     owner.address,
  //     'BuybackBabyToken',
  //     'BBT',
  //     parseEther('100000'),
  //     '0x6a0454a31E591B94BaA839996EDb35090bEb7A19',
  //     '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
  //     [200, 300, 800, 100, 10000]
  //   ]
  // });

  // console.log('buyback token verified...');

  // await run('verify:verify', {
  //   address: bbfactory.address,
  //   constructorArguments: [manager.address, bbtoken.address]
  // });

  // console.log('buyback factory verified...');

  // TODO:Causing Issue : non-contract account function call


  await run('verify:verify', {
    address: iterableMapping.address,
    constructorArguments: []
  });

  cyan(`\n IterableMapping Token Verified`)


  await run('verify:verify', {
    address: dividendTracker.address,
    constructorArguments: []
  });

  cyan(`\n DividendTracker Token Verified`)


  await run('verify:verify', {
    address: btoken.address,
    constructorArguments: []
  });


  cyan(`\n BabyToken Verified`)


  await run('verify:verify', {
    address: bfactory.address,
    constructorArguments: [manager.address, btoken.address]
  });

  cyan(`\n BabyTokenFactory Verified`)

}

export default TokenGeneratorDeployment