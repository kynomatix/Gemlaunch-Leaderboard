import { ethers, run } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';
// import { GempadV2Factory, GempadV2Router02, factories, WETH9 } from '../typechain-types';

async function main() {
  const [owner, user] = await ethers.getSigners();

  let antiBot = '0x16aCfa215a754F30c9084a4eF6fa7Db37eaCFBD4';
  let antiBotBsc = '0xb2cda8027519fF0F708A03056115f32eead702f1';

  let managerAddressGoerli = '0x1DA9730E3807C44d27443F7c43dcF5F90ad76a62';
  let managerAddressBSC = '0x2904aC36f5f63ABb1DaFd95FB3182bfedBFD8424';

  // const Factory = await ethers.getContractFactory('GempadV1Factory');
  // const factoryV2 = await Factory.deploy(owner.address);

  // const WETH = await ethers.getContractFactory('WETH9');
  // const weth = await WETH.deploy();

  // const Router = await ethers.getContractFactory('GempadV1Router02');
  // const router = await Router.deploy(factoryV2.address, weth.address);

  // console.log('router deployed: ', router.address);

  //Goerli network

  const AntiBotLiquidityGeneratorToken = await ethers.getContractFactory('AntiBotLiquidityGeneratorToken');
  const token = await AntiBotLiquidityGeneratorToken.deploy(
    owner.address,
    'AntiBotLiquidityGeneratorToken',
    'LGT',
    parseEther('100000'),
    '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918', // UniswapV2Router02
    user.address,
    300,
    800,
    200,
    antiBot,
    { value: parseEther('0.01') }
  );

  //BSC network
  // const AntiBotLiquidityGeneratorToken = await ethers.getContractFactory('AntiBotLiquidityGeneratorToken');
  // const token = await AntiBotLiquidityGeneratorToken.deploy(
  //   owner.address,
  //   'AntiBotLiquidityGeneratorToken',
  //   'LGT',
  //   parseEther('100000'),
  //   '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
  //   user.address,
  //   300,
  //   800,
  //   200,
  //   antiBotBsc,
  //   { value: parseEther('0.01') }
  // );

  console.log('AntiBotLiquidityGeneratorToken deployed: ', token.address);

  // const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
  // const manager = await TokenFactoryManager.deploy();

  // console.log('TokenFactoryManager deployed: ', manager.address);

  // /deploy StandardTokenFactory
  const AntibotLiquidityGeneratorTokenFactory = await ethers.getContractFactory(
    'AntibotLiquidityGeneratorTokenFactory'
  );
  const factory = await AntibotLiquidityGeneratorTokenFactory.deploy(managerAddressGoerli, token.address);

  console.log('AntibotLiquidityGeneratorTokenFactory: ', factory.address);

  // await manager.addTokenFactory(factory.address);

  // await factory.create(
  //   'AntiBotLiquidityGeneratorToken',
  //   'LGT',
  //   parseEther('100000'),
  //   router.address,
  //   user.address,
  //   300,
  //   800,
  //   200,
  //   antiBot.address,
  //   { value: parseEther('0.01') }
  // );

  await run('verify:verify', {
    address: token.address,
    constructorArguments: [
      owner.address,
      'AntiBotLiquidityGeneratorToken',
      'LGT',
      parseEther('100000'),
      '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
      user.address,
      300,
      800,
      200,
      antiBot
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
