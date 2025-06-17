import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { parseEther, formatEther } from 'ethers/lib/utils';

describe('Generatetoken', function () {
  let standardFactory: any;
  let owner: any;
  let manager: any;
  let token: any;

  async function main() {
    [owner] = await ethers.getSigners();

    const StandardToken = await ethers.getContractFactory('StandardToken');
    token = await StandardToken.deploy();

    console.log('StandardToken deployed: ', token.address);

    const TokenFactoryManager = await ethers.getContractFactory('TokenFactoryManager');
    manager = await TokenFactoryManager.deploy();

    console.log('TokenFactoryManager deployed: ', manager.address);

    ///deploy StandardTokenFactory
    const StandardTokenFactory = await ethers.getContractFactory('StandardTokenFactory');
    standardFactory = await StandardTokenFactory.deploy(manager.address, token.address);

    console.log('standardFactory deployed: ', standardFactory.address);
  }

  describe('Deployment', async function () {
    it('create new Token ', async function () {
      await main();

      await manager.addTokenFactory(standardFactory.address);

      await standardFactory.create('TestToken', 'TT', 18, parseEther('100000'), { value: parseEther('.01'), gasLimit: 3000000 });

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
