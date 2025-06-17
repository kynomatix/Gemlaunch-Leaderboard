import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { constants } from 'ethers';
import BigNumber, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { ServiceReceiver, GempadPrivateSaleFactory, GempadPrivateSale } from '../typechain-types';

describe('Gempad airdrop', function () {
  let owner: SignerWithAddress, user: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;
  let user3: SignerWithAddress,
    user4: SignerWithAddress,
    user5: SignerWithAddress,
    feeReceiver: SignerWithAddress;
  let sale: GempadPrivateSale;
  let salePrivate: any;
  let botToken: any;
  let serviceFeeReceiver: ServiceReceiver;
  let fee: number;
  let startTime: number, endTime: number;
  let interval: number;
  let factory: GempadPrivateSaleFactory;

  async function deployPrivateSale(_params?: any) {
    [owner, user, user1, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

    const BotToken = await ethers.getContractFactory('TestToken');
    botToken = await BotToken.deploy();

    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();

    // balanceBefore = parseInt((await ethers.provider.getBalance(serviceFeeReceiver.address)).toString());
    // feeReceiver = service.address;
    let timeNow = await time.latest();
    startTime = timeNow + 3600;
    endTime = startTime + 36000;
    interval = 3600;
    fee = 5e3;

    await serviceFeeReceiver.setPrice('GempadPrivateSale', parseEther('1'));
    await serviceFeeReceiver.setFee('GempadPrivateSale', 5e3);
    // Dummy data for constructor arguments
    let params = {
      name: 'Gempad Private Sale',
      softCap: parseEther('1000'),
      hardCap: parseEther('2000'),
      minBuyLimit: parseEther('0.1'),
      maxBuyLimit: parseEther('1'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: 0,
      publicSaleTime: 0,
      ...(_params || {})
    };
    let vestingParams = {
      initialRelease: 40e3,
      cyclePercent: 30e3,
      cycleInterval: 3600,
      ...(_params || {})
    };

    const GempadPrivatesale = await ethers.getContractFactory('GempadPrivateSale');
    const privateSale = await GempadPrivatesale.deploy();

    await privateSale.deployed();

    // console.log('Private Sale deployed at:', sale.address);

    const GempadPrivateSaleFactory = await ethers.getContractFactory('GempadPrivateSaleFactory');
    factory = await GempadPrivateSaleFactory.deploy(privateSale.address);

    await factory.deployed();

    await factory.createPrivateSale(
      params,
      vestingParams,
      0,
      serviceFeeReceiver.address,
      constants.AddressZero,
      {
        value: parseEther('1')
      }
    );

    await factory.createPrivateSale(params, vestingParams, 0, serviceFeeReceiver.address, botToken.address, {
      value: parseEther('1')
    });

    let privateSales = await factory.getAllPrivateSales();

    sale = new ethers.Contract(privateSales[0], privateSale.interface, owner);
    salePrivate = new ethers.Contract(privateSales[1], privateSale.interface, owner);

    return sale;
  }

  function getUserAddressArray(length: number) {
    const addresses = [];

    for (let i = 0; i < length; i++) {
      const wallet = ethers.Wallet.createRandom();
      addresses.push(wallet.address);
    }

    return addresses;
  }

  function getRandomNumberArray(length: number, minValue: number, maxValue: number) {
    const randomArray = [];

    for (let i = 0; i < length; i++) {
      const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      randomArray.push(parseEther(randomValue.toString()));
    }

    return randomArray;
  }

  describe('Deployment test with all peramters', function () {
    // this.beforeEach(async function () {
    //   await deployPrivateSale()
    // })
    it('pass: Should deploy GempadPrivateSale contract', async function () {
      await deployPrivateSale();
      expect(sale.address).to.not.equal(constants.AddressZero);
    });

    it('revert: Softcap must be greater than or equal 50% of Hardcap', async function () {
      const params = { softCap: parseEther('100') };
      await expect(deployPrivateSale(params)).to.be.revertedWith(
        'Softcap must be greater than or equal 50% of Hardcap'
      );
    });

    it('revert: Soft-Cap should be less than or equal to hardcap', async function () {
      const params = { softCap: parseEther('3000') };
      await expect(deployPrivateSale(params)).to.be.revertedWith(
        'Soft-Cap should be less than or equal to hardcap'
      );
    });

    it('revert: Hard-Cap must be greater than softcap', async function () {
      const params = { hardCap: parseEther('999') };
      await expect(deployPrivateSale(params)).to.be.revertedWith(
        'Soft-Cap should be less than or equal to hardcap'
      );
    });

    it('revert: Min-Buy Limit cannot be zero', async function () {
      const params = { minBuyLimit: parseEther('0') };
      await expect(deployPrivateSale(params)).to.be.revertedWith('Invalid min and max buy limit');
    });

    it('revert: Min-Buy Limit cannot be zero', async function () {
      const params = { minBuyLimit: parseEther('0') };
      await expect(deployPrivateSale(params)).to.be.revertedWith('Invalid min and max buy limit');
    });
    it('revert: Start Time cannot be less than current time', async function () {
      const params = { startTime: (await time.latest()) - 500 };
      await expect(deployPrivateSale(params)).to.be.revertedWith('Invalid start time');
    });
    it('revert: Start Time must be less than end time', async function () {
      const params = { startTime: endTime + 500 };
      await expect(deployPrivateSale(params)).to.be.revertedWith('Invalid start time');
    });
    it('revert: Initial Release pecentage percentage should be > 0 and <= 95', async function () {
      const params = { initialRelease: 0 };
      await expect(deployPrivateSale(params)).to.be.revertedWith('Invalid Initial Release pecentage');

      const params2 = { initialRelease: 1e8 };
      await expect(deployPrivateSale(params2)).to.be.revertedWith('Invalid Initial Release pecentage');
    });

    it('revert: Cycle pecentage must be greater than zero', async function () {
      const params = { cyclePercent: 0 };
      await expect(deployPrivateSale(params)).to.be.revertedWith('Cycle pecentage must be greater than zero');
    });

    it('revert: interval must be greater than zero', async function () {
      const params = { cycleInterval: 0 };
      await expect(deployPrivateSale(params)).to.be.revertedWith('interval must be greater than zero');
    });
    it('revert: combination of initial release and cycle combination shoule 100%', async function () {
      const params = { initialRelease: 40e3, cyclePercent: 70e3 };
      await expect(deployPrivateSale(params)).to.be.revertedWith(
        'Sum of TGE bps and cycle should be less than 100'
      );
    });

    it('pass: invest should be in native currency if address zero pass as token address', async function () {
      await deployPrivateSale();
      let fundButoken = await sale.fundByTokens();
      expect(fundButoken).to.be.false;
    });

    it('pass: current mode should be public sale ', async function () {
      await deployPrivateSale();
      let mode = await sale.getCurrentMode();
      expect(mode).to.be.equal(1);

      await time.increaseTo(startTime);

      expect(await sale.getCurrentMode()).to.be.equal(0);
    });
  });

  ///// Invest funds with public sale live
  describe('Invest fund in public Sale test ', function () {
    this.beforeEach(async function () {
      await deployPrivateSale();
    });

    it('revert: sale should be active', async function () {
      await expect(sale.investFunds(parseEther('0.2'))).to.be.revertedWith('Sale is not active');
    });

    it('revert: buyin amount shoudl be satisfy minimum purchase limit criteria', async function () {
      await time.increaseTo(startTime);
      await expect(sale.investFunds(parseEther('0.01'))).to.be.revertedWith(
        'Amount is les than min buy limit'
      );
    });

    it('revert: maximum buy limit reached', async function () {
      await time.increaseTo(startTime);
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      await expect(
        sale.connect(user).investFunds(parseEther('0.1'), { value: parseEther('.1') })
      ).to.be.revertedWith('Maximum buy limit reached');
    });

    it('revert: hard cap reached', async function () {
      const params = { softCap: parseEther('1'), hardCap: parseEther('2') };
      await deployPrivateSale(params);
      await time.increaseTo(startTime);
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      await sale.connect(user2).investFunds(parseEther('1'), { value: parseEther('1') });
      await expect(
        sale.connect(user3).investFunds(parseEther('0.1'), { value: parseEther('.1') })
      ).to.be.revertedWith('Maximum sale limit reached');
    });

    it('revert: insufficient ether amoutn sent', async function () {
      await time.increaseTo(startTime);
      await expect(
        sale.connect(user3).investFunds(parseEther('1'), { value: parseEther('.1') })
      ).to.be.revertedWith('Insufficient funds sent');
    });

    it('pass: user deposit amount', async function () {
      await time.increaseTo(startTime);
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      let deposit = await sale.depositOf(user.address);
      expect(deposit).to.be.equal(parseEther('1'));
      expect(await sale.totalSale()).to.be.equal(parseEther('1'));
    });

    it('pass: total despot amout of multi user', async function () {
      await time.increaseTo(startTime);
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      await sale.connect(user2).investFunds(parseEther('1'), { value: parseEther('1') });
      let deposit = await sale.depositOf(user.address);
      let deposit2 = await sale.depositOf(user2.address);
      expect(await sale.totalSale()).to.be.equal(parseEther('2'));
    });
  });

  ///// Invest funds with private sale live
  describe('Invest fund in private (whitelist) Sale test ', function () {
    this.beforeEach(async function () {
      await deployPrivateSale();
      await time.increaseTo(startTime);
      await sale.addWhitelist([user.address, user2.address, user3.address]);
      await sale.enablePublicSale(endTime);
    });

    it('pass: current mode should be private', async function () {
      let mode = await sale.getCurrentMode();
      let info = await sale.saleInfo();
      expect(mode).to.be.equal(1);
      expect(info[6]).to.be.equal(endTime);
    });

    it('revert: investor is not whitelisted', async function () {
      await expect(
        sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('.1') })
      ).to.be.revertedWith('User is not whitelisted');
    });

    it('pass: disable whitelisting', async function () {
      let Now = await time.latest();
      await sale.enablePublicSale(Now);
      let mode = await sale.getCurrentMode();
      let info = await sale.saleInfo();
      expect(mode).to.be.equal(0);
      expect(info[8]).to.be.equal(Now);
    });

    it('pass: whitelisted user can invest', async function () {
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      await sale.connect(user2).investFunds(parseEther('1'), { value: parseEther('1') });
      let deposit = await sale.depositOf(user.address);
      let deposit2 = await sale.depositOf(user.address);
      expect(deposit).to.be.equal(parseEther('1'));
      expect(deposit2).to.be.equal(parseEther('1'));
      expect(await sale.totalSale()).to.be.equal(parseEther('2'));
    });

    describe('change mode to public from private', function () {
      it('pass: enable public sale', async function () {
        let now = await time.latest();
        await sale.enablePublicSale(now);
        let mode = await sale.getCurrentMode();
        let info = await sale.saleInfo();
        expect(mode).to.be.equal(0);
        expect(info[8]).to.be.equal(now);
      });

      it('pass: start public sale from private mode', async function () {
        let now = await time.latest();
        await sale.enablePublicSale(now);
        let mode = await sale.getCurrentMode();
        expect(mode).to.be.equal(0);
        await sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('1') });
        let deposit = await sale.depositOf(user4.address);
        expect(deposit).to.be.equal(parseEther('1'));
      });

      it('revert: whitelisted user can buy during scheduled time', async function () {
        let publicTime = (await time.latest()) + 500;
        await sale.enablePublicSale(publicTime);
        let mode = await sale.getCurrentMode();
        expect(mode).to.be.equal(1);
        let status = await sale.getCurrentStatus();
        expect(status).to.be.equal(1);
        await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
        await expect(
          sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('1') })
        ).to.be.revertedWith('User is not whitelisted');
      });

      it('pass: user can invest after scheduled public sale time', async function () {
        let publicTime = (await time.latest()) + 500;
        await sale.enablePublicSale(publicTime);
        await time.increaseTo(publicTime);
        let mode = await sale.getCurrentMode();
        expect(mode).to.be.equal(0);
        await sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('1') });
        let deposit = await sale.depositOf(user4.address);
        expect(deposit).to.be.equal(parseEther('1'));
      });
    });
  });
  describe('Invest fund in anti-bot mode Sale test ', function () {
    let timeNow: number;
    this.beforeEach(async function () {
      await deployPrivateSale();
      await time.increaseTo(startTime);
      timeNow = await time.latest();
      await sale.enableAntibotMode(botToken.address, parseEther('100'));

      await botToken.mint(user.address, parseEther('1000'));
      await botToken.mint(user2.address, parseEther('1000'));
      await botToken.mint(user3.address, parseEther('1000'));
    });

    it('pass: current mode should be antibot', async function () {
      let mode = await sale.getCurrentMode();
      let info = await sale.saleInfo();
      expect(mode).to.be.equal(2);
      expect(info[8]).to.be.equal(endTime);
    });

    it('revert: investor is not does not have antibot token', async function () {
      await expect(
        sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('.1') })
      ).to.be.revertedWith('Insufficient Token balance');
    });

    it('pass: disable antibot mode', async function () {
      let now = await time.latest();
      await sale.enablePublicSale(now);
      let mode = await sale.getCurrentMode();
      let info = await sale.saleInfo();
      expect(mode).to.be.equal(0);
      expect(info[8]).to.be.equal(now);
    });

    it('pass: antibot token holders can invest', async function () {
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      await sale.connect(user2).investFunds(parseEther('1'), { value: parseEther('1') });
      let deposit = await sale.depositOf(user.address);
      let deposit2 = await sale.depositOf(user.address);
      expect(deposit).to.be.equal(parseEther('1'));
      expect(deposit2).to.be.equal(parseEther('1'));
      expect(await sale.totalSale()).to.be.equal(parseEther('2'));
    });

    describe('change modes test', function () {
      it('pass: start public sale mode from antibot mode', async function () {
        let now = await time.latest();
        await sale.enablePublicSale(now);
        let mode = await sale.getCurrentMode();
        expect(mode).to.be.equal(0);
        await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
        let deposit = await sale.depositOf(user.address);
        expect(deposit).to.be.equal(parseEther('1'));
      });

      it('revert: antibot token holder can buy during scheduled time', async function () {
        let publicTime = (await time.latest()) + 500;
        await sale.enablePublicSale(publicTime);
        let mode = await sale.getCurrentMode();
        expect(mode).to.be.equal(2);
        await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
        await expect(
          sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('1') })
        ).to.be.revertedWith('Insufficient Token balance');
      });

      it('pass: user can invest after scheduled public sale time', async function () {
        let publicTime = (await time.latest()) + 500;
        await sale.enablePublicSale(publicTime);
        await time.increaseTo(publicTime);
        let mode = await sale.getCurrentMode();
        let status = await sale.getCurrentStatus();
        expect(status).to.be.equal(1);
        expect(mode).to.be.equal(0);
        await sale.connect(user2).investFunds(parseEther('1'), { value: parseEther('1') });
        let deposit = await sale.depositOf(user2.address);
        expect(deposit).to.be.equal(parseEther('1'));
      });

      it('pass: change modes and test current mode', async function () {
        await deployPrivateSale();

        await botToken.mint(user.address, parseEther('1000'));
        await botToken.mint(user2.address, parseEther('1000'));
        await botToken.mint(user3.address, parseEther('1000'));

        expect(await sale.getCurrentMode()).to.be.equal(1);

        await time.increaseTo(startTime);

        expect(await sale.getCurrentMode()).to.be.equal(0);

        expect(await sale.getCurrentMode()).to.be.equal(0);

        await sale.connect(user4).investFunds(parseEther('1'), { value: parseEther('1') });

        await sale.enablePublicSale(endTime);

        expect(await sale.getCurrentMode()).to.be.equal(1);

        await sale.addWhitelist([user2.address]);

        await sale.connect(user2).investFunds(parseEther('.1'), { value: parseEther('.1') });

        await sale.enableAntibotMode(botToken.address, parseEther('100'));

        expect(await sale.getCurrentMode()).to.be.equal(2);

        await sale.connect(user).investFunds(parseEther('.1'), { value: parseEther('.1') });

        await sale.enablePublicSale((await time.latest()) + 100);

        expect(await sale.getCurrentMode()).to.be.equal(2);

        await expect(
          sale.connect(user5).investFunds(parseEther('.1'), { value: parseEther('.1') })
        ).to.be.revertedWith('Insufficient Token balance');

        await time.increaseTo((await time.latest()) + 100);

        expect(await sale.getCurrentMode()).to.be.equal(0);

        await sale.connect(user5).investFunds(parseEther('.1'), { value: parseEther('.1') });

        await sale.enablePublicSale(endTime);

        expect(await sale.getCurrentMode()).to.be.equal(1);

        await expect(
          sale.connect(user3).investFunds(parseEther('.1'), { value: parseEther('.1') })
        ).to.be.revertedWith('User is not whitelisted');

        await sale.enablePublicSale((await time.latest()) + 100);

        expect(await sale.getCurrentMode()).to.be.equal(1);

        await expect(
          sale.connect(user3).investFunds(parseEther('.1'), { value: parseEther('.1') })
        ).to.be.revertedWith('User is not whitelisted');

        await sale.enablePublicSale(await time.latest());
        expect(await sale.getCurrentMode()).to.be.equal(0);

        await sale.connect(user5).investFunds(parseEther('.1'), { value: parseEther('.1') });
      });
    });
  });

  describe('claim tokens test', function () {
    beforeEach(async () => {
      const params = { softCap: parseEther('1'), hardCap: parseEther('2') };
      await deployPrivateSale(params);
      await time.increaseTo(startTime);
      await sale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
      // await sale.connect(user2).investFunds(parseEther('1'), { value: parseEther('1') });
    });

    it('revert: cannot claim before finalize', async function () {
      await expect(sale.claimTokens()).to.be.revertedWith('Sale in not finalized');
    });
    it('pass: claim initial release after finalize', async function () {
      await time.increaseTo(endTime);
      await sale.finalize();
      await sale.claimTokens();
      let claimed = await sale.claimedAmount();
      let totalSales = await sale.totalSale();

      let balanceA = await ethers.provider.getBalance(feeReceiver.address);
      let share = (+totalSales * 40e3) / 100e3;
      expect(+claimed).to.be.equal(+share);
    });
    it('pass: claim initial release and cycle ', async function () {
      await time.increaseTo(endTime);
      await sale.finalize();
      await time.increaseTo(endTime + interval);
      await sale.claimTokens();
      let claimed = await sale.claimedAmount();
      let totalSales = await sale.totalSale();

      let share = (+totalSales * 70e3) / 100e3;
      expect(+claimed).to.be.equal(+share);
    });
    it('pass: claim all funds after time ', async function () {
      await time.increaseTo(endTime);
      await sale.finalize();
      let status = await sale.getCurrentStatus();
      await time.increaseTo(endTime + interval * 2);
      await sale.claimTokens();
      let claimed = await sale.claimedAmount();

      expect(claimed).to.be.equal(parseEther('1'));
      expect(status).to.be.equal(3);
    });

    it('pass: claim token with cycle and tge flow ', async function () {
      await time.increaseTo(endTime);
      await sale.finalize();
      let status = await sale.getCurrentStatus();
      await time.increaseTo(endTime + interval);
      await sale.claimTokens();
      let claimed = await sale.claimedAmount();
      let totalSales = await sale.totalSale();

      let share = (+totalSales * 70e3) / 100e3;
      expect(+claimed).to.be.equal(+share);

      let claimedBefore = claimed;

      await time.increaseTo(endTime + interval * 5);

      await sale.claimTokens();
      claimed = await sale.claimedAmount();
      totalSales = await sale.totalSale();

      expect(claimed).to.be.equal(claimedBefore.add(parseEther('.3')));

      await time.increaseTo(endTime + interval * 6);

      await expect(sale.claimTokens()).to.be.revertedWith('Total funds claimed');
    });
    describe('claim refund', function () {
      it('revert: user has not invested', async function () {
        let balanceB = await ethers.provider.getBalance(user.address);
        await time.increaseTo(endTime);
        await sale.cancel();
        let status = await sale.getCurrentStatus();
        await expect(sale.connect(user4).claimRefund()).to.be.revertedWith('User has not invested any funds');
        expect(status).to.be.equal(2);
      });
      it('pass: claim refund after cancel', async function () {
        let balanceB = await ethers.provider.getBalance(user.address);
        await time.increaseTo(endTime);
        await sale.cancel();
        let depositBefore = await sale.depositOf(user.address);
        await sale.connect(user).claimRefund();

        let depositAfter = await sale.depositOf(user.address);

        let balanceA = await ethers.provider.getBalance(user.address);
        expect(depositAfter).to.be.equal(depositBefore.sub(parseEther('1')));
      });

      it('revert: claim refund after time and soft cap reach', async function () {
        const params = { softCap: parseEther('1'), hardCap: parseEther('2') };
        let pSale = await deployPrivateSale(params);
        await time.increaseTo(startTime);
        await pSale.connect(user).investFunds(parseEther('1'), { value: parseEther('1') });
        await time.increaseTo(endTime);

        await expect(pSale.connect(user).claimRefund()).to.be.revertedWith('Refund is not allowed');
      });
    });
  });

  describe('Invest with custom token', function () {
    let sale: any;
    let sale2: any;
    beforeEach(async () => {
      await deployPrivateSale();
      await botToken.mint(user.address, parseEther('10'));
    });
    it('pass: user deposit tokens', async function () {
      await time.increaseTo(startTime);
      await botToken.connect(user).approve(salePrivate.address, parseEther('2'));
      await salePrivate.connect(user).investFunds(parseEther('1'));
      let deposit = await salePrivate.depositOf(user.address);
      expect(deposit).to.be.equal(parseEther('1'));
      expect(await salePrivate.totalSale()).to.be.equal(parseEther('1'));
    });
  });
});
