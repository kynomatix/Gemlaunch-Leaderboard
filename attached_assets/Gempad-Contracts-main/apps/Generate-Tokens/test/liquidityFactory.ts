import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants } from 'ethers';

describe('Generatetoken', function () {
  let factory: any;
  let owner: any;
  let manager: any;
  let token: any;

  async function main() {
    [owner] = await ethers.getSigners();

    const LiquidityGeneratorToken = await ethers.getContractFactory('LiquidityGeneratorToken');
    token = await LiquidityGeneratorToken.deploy();

    console.log('StandardToken deployed: ', token.address);

    const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
    manager = await TokenFactoryManager.deploy();

    console.log('TokenFactoryManager deployed: ', manager.address);

    ///deploy StandardTokenFactory
    const LiquidityGeneratorTokenFactory = await ethers.getContractFactory('LiquidityGeneratorTokenFactory');
    factory = await LiquidityGeneratorTokenFactory.deploy(manager.address, token.address);

    console.log('factory deployed: ', factory.address);

    await manager.addTokenFactory(factory.address);
  }

  describe('Deployment', async function () {
    this.beforeEach(async () => {
      await main();
      // await manager.addTokenFactory(factory.address);
    });
    it('create new Token ', async function () {
      let router = '0x7a250d5630b4cf539739df2c5dacb4c659f2488d';
      await factory.create(
        'TestToken',
        'TT',
        parseEther('100000'),
        router,
        constants.AddressZero,
        500,
        1000,
        0,
        { value: parseEther('.01'), gasLimit: 3000000 }
      );

      console.log('get Tokens', await manager.getAllTokens(owner.address));
    });

    // it('create new Token ', async function () {
    //   await main();

    //   await token.initialize(
    //     owner.address,
    //     "TestToken",
    //     "TT",
    //     18,
    //     parseEther("100000")
    //   )
    //   console.log("get Tokens", await manager.getAllTokens(owner.address));
    // });
  });
});
