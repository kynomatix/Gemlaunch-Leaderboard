import { expect } from 'chai';
import { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

describe('Gempad airdrop', function () {
  let owner: any, user: any, vip: any, user2: any;
  let multisender: any;
  let token: any;

  async function deployMultiSender() {
    const [owner, user1, user2] = await ethers.getSigners();
    const GempadSender = await ethers.getContractFactory('GempadMultiSender');
    multisender = await GempadSender.deploy();

    const TestToken = await ethers.getContractFactory('TestToken');
    token = await TestToken.deploy();
  }

  function getUserAddressArray(length: number) {
    const addresses = [];

    for (let i = 0; i < length; i++) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      addresses.push(wallet.address);
    }

    return addresses;
  }

  function getRandomNumberArray(length: number, minValue: number, maxValue: number) {
    const randomArray = [];
    let total = 0;

    for (let i = 0; i < length; i++) {
      const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      total += randomValue;
      randomArray.push(parseEther(randomValue.toString()));
    }

    return { randomArray, total };
  }

  this.beforeEach(async () => {
    await deployMultiSender();
  });

  describe('User and fee test', function () {
    it('multi send token ', async function () {
      let users = getUserAddressArray(1000);

      let { randomArray, total } = getRandomNumberArray(1000, 1, 10);

      await token.approve(multisender.address, parseEther(total.toString()));

      for (let i = 0; i < users.length; i += 100) {
        const user = users.slice(i, i + 100);
        const num = randomArray.slice(i, i + 100);

        await multisender.multisendToken(token.address, false, user, num);
      }
    });

    it('estimate gas ', async function () {
      let users = getUserAddressArray(800);
      let { randomArray, total } = getRandomNumberArray(800, 1, 10);

      await token.approve(multisender.address, parseEther(total.toString()));

      for (let i = 0; i < users.length; i += 100) {
        const chunk = users.slice(i, i + 100);
        const num = randomArray.slice(i, i + 100);

        let gas = await multisender.estimateGas.multisendToken(token.address, false, chunk, num);
        console.log('GAs===>', gas);
      }
    });
  });
});
