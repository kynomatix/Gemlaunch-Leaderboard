import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { abi, bytecode } from '../artifacts/contracts/GempadFairLaunch.sol/GempadFairLaunch.json';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Signer, constants } from 'ethers';
import { ethers } from 'hardhat';
import BigNumber from 'bignumber.js';
import { parseEther, formatEther, parseUnits } from 'ethers/lib/utils';
import { bytecode } from '@gempad/gempadv2/artifacts/contracts/GempadV2Factory.sol/GempadV2Pair.json';
// import { bytecode } from '../artifacts/contracts/mock/GempadV2Factory.sol/GempadV2Pair.json';
let factoryV2: GempadV2Factory;
let router: GempadV2Router02;

import {
  ServiceReceiver,
  GempadV2Factory,
  GempadV2Router02,
  WETH9,
  GempadVestingLock
} from '../typechain-types';

enum Mode {
  PENDING = 0,
  PRIVATE = 1,
  PUBLIC = 2
}

describe('Gempad airdrop', function () {
  let owner: SignerWithAddress, user: SignerWithAddress, vip: SignerWithAddress, user2: SignerWithAddress;
  let user3: SignerWithAddress,
    user4: SignerWithAddress,
    user5: SignerWithAddress,
    feeReceiver: SignerWithAddress;
  let decimalToken: any;
  let locktime: BigNumber;
  let fairLaunch: any;
  let fairLaunchToken: any;
  let fairLaunchDecimal: any;
  let fairLaunchUsdt: any;
  let token: any, token2: any, usdt: any;
  let saleToken: any;
  let serviceFeeReceiver: ServiceReceiver;
  let fee: number;
  let startTime: number, endTime: number;
  let interval: number;
  let factory: any;
  let locker: any;

  async function deployFairLaunch(_params?: any, _lparams?: any, _bparams?: any) {
    [owner, user, vip, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

    const BotToken = await ethers.getContractFactory('TestToken');
    token = await BotToken.deploy();

    const botToke = await ethers.getContractFactory('TestToken');
    token2 = await botToke.deploy();

    const MockToken = await ethers.getContractFactory('MockUsdt');
    usdt = await MockToken.deploy();

    const DecimalToken = await ethers.getContractFactory('DecimalToken');
    decimalToken = await DecimalToken.deploy();

    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();

    await serviceFeeReceiver.setPrice('GempadFairLaunch', parseEther('1'));
    await serviceFeeReceiver.setFee('GempadFairLaunch', 5e3);

    let tokenFee = await serviceFeeReceiver.getFee('GempadFairLaunch');

    const GempadLaunchpad = await ethers.getContractFactory('GempadFairLaunch');
    const gempadLaunchpad = await GempadLaunchpad.deploy();

    await gempadLaunchpad.deployed();

    ///deploy exchange contracts;

    const Factory = await ethers.getContractFactory('GempadV2Factory');
    factoryV2 = await Factory.deploy(owner.address);

    const WETH = await ethers.getContractFactory('WETH9');
    const weth = await WETH.deploy();

    const Router = await ethers.getContractFactory('GempadV2Router02');
    router = await Router.deploy(factoryV2.address, weth.address);

    let code = await factoryV2.getInitCodeHash();

    console.log('init hash code', code);

    const GempadVestingLock = await ethers.getContractFactory('GempadVestingLock');
    locker = await GempadVestingLock.deploy();

    await locker.deployed();

    //===================================================================

    let timeNow = await time.latest();
    startTime = timeNow + 3600;
    endTime = startTime + 604800;

    fee = +tokenFee;
    interval = 3600;

    let fairLaunchInfoUsdt = {
      token: decimalToken.address,
      totalsellTokens: parseUnits('100000', 9),
      softCap: parseUnits('10', 6),
      isMaxLimit: false,
      maxBuyLimit: parseUnits('10', 6),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      isAffiliate: false,
      affiliateReward: 5e3,
      ...(_params || {})
    };

    let fairLaunchInfoDecimal = {
      token: decimalToken.address,
      totalsellTokens: parseUnits('100000', 9),
      softCap: parseEther('10'),
      isMaxLimit: false,
      maxBuyLimit: parseEther('15'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      isAffiliate: false,
      affiliateReward: 5e3,
      ...(_params || {})
    };

    let fairLaunchInfo = {
      token: token.address,
      totalsellTokens: parseEther('100000'),
      softCap: parseEther('10'),
      isMaxLimit: false,
      maxBuyLimit: parseEther('15'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      isAffiliate: false,
      affiliateReward: 5e3,
      ...(_params || {})
    };

    let liquidityInfo = {
      router: router.address,
      liquidityPercent: 60e3,
      lockTime: 86400,
      locker: locker.address,
      liquidityAdded: 0,
      ...(_lparams || {})
    };

    let buybackDetails = {
      isBuyback: true,
      buyBackPercent: 20e3,
      totalBuyBackAmount: 0,
      boughtBackAmount: 0,
      amountPerBuyback: parseEther('0.5'),
      minDelay: 60,
      maxDelay: 300,
      lastBuyTime: 0,
      ...(_bparams || {})
    };

    let buybackDetailsUsdt = {
      isBuyback: true,
      buyBackPercent: 20e3,
      totalBuyBackAmount: 0,
      boughtBackAmount: 0,
      amountPerBuyback: parseUnits('0.5', 6),
      minDelay: 60,
      maxDelay: 300,
      lastBuyTime: 0,
      ...(_bparams || {})
    };

    const GempadFactory = await ethers.getContractFactory('GempadFairLuanchFactory');
    factory = await GempadFactory.deploy(gempadLaunchpad.address);

    await factory.deployed();
    // console.log('factory deployed:', factory.address);

    await token.approve(factory.address, parseEther('157000'));

    await factory.createFairLaunch(
      fairLaunchInfo,
      liquidityInfo,
      buybackDetails,
      constants.AddressZero,
      false,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await token.approve(factory.address, parseEther('157000'));

    await factory.createFairLaunch(
      fairLaunchInfo,
      liquidityInfo,
      buybackDetails,
      token2.address,
      false,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    let decimals = await decimalToken.decimals();
    await decimalToken.approve(factory.address, 157000 * 10 ** decimals);

    await factory.createFairLaunch(
      fairLaunchInfoDecimal,
      liquidityInfo,
      buybackDetails,
      token2.address,
      false,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await decimalToken.approve(factory.address, 157000 * 10 ** decimals);

    await factory.createFairLaunch(
      fairLaunchInfoUsdt,
      liquidityInfo,
      buybackDetailsUsdt,
      usdt.address,
      false,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    let pads = await factory.getAllFairLaunches();
    // console.log("sale ==>",pads);

    fairLaunch = new ethers.Contract(pads[0], abi, owner);
    fairLaunchToken = new ethers.Contract(pads[1], abi, owner);
    fairLaunchDecimal = new ethers.Contract(pads[2], abi, owner);
    fairLaunchUsdt = new ethers.Contract(pads[3], abi, owner);
  }

  describe('Deployment test with all peramters', function () {
    it('pass: Should deploy Gempadlaunchpad contract', async function () {
      await deployFairLaunch();
      expect(fairLaunch.address).to.not.equal(constants.AddressZero);
    });

    it('revert: Start Time cannot be less than current time', async function () {
      const params = { startTime: (await time.latest()) - 500 };
      await expect(deployFairLaunch(params)).to.be.revertedWith('Invalid start time');
    });
    it('revert: Start Time must be less than end time', async function () {
      const params = { startTime: endTime + 500 };
      await expect(deployFairLaunch(params)).to.be.revertedWith('Invalid start time');
    });

    it('revert: start Time and end time interval must be less than 7 days ', async function () {
      const params = { endTime: 2696683808 };

      await expect(deployFairLaunch(params)).to.be.revertedWith('Invalid duration');
    });

    it('pass: invest should be in native currency if address zero pass as token address', async function () {
      await deployFairLaunch();
      let fundButoken = await fairLaunch.fundByTokens();
      expect(fundButoken).to.be.false;
    });

    it('pass: current mode should be pending ', async function () {
      await deployFairLaunch();
      let mode = await fairLaunch.getCurrentMode();
      expect(mode).to.be.equal(Mode.PENDING);
    });

    it('pass: if sale mode is public, public sale time should be start time', async function () {
      await deployFairLaunch();
      let info = await fairLaunch.fairlaunch();
      expect(Number(info[8])).to.be.equal(startTime);
    });

    it('revert: liquidity must be greater than 50% ', async function () {
      const params = { liquidityPercent: 40e6, isAutolisting: true };
      await expect(deployFairLaunch({}, params)).to.be.revertedWith('Invalid liquidity percentage');
    });

    it('revert: if buyback enable liquidity % must be greater than 30% ', async function () {
      const params = { isbuyBack: true, liquidityPercent: 20e6, buyBackPercent: 80e3 };
      await expect(deployFairLaunch({}, params)).to.be.revertedWith('Invalid liquidity percentage');
    });

    it('revert: Liquidity + Buyback must be greater than 50%', async function () {
      const params = { isbuyBack: true, liquidityPercent: 30e3, buyBackPercent: 20e3 };
      await expect(deployFairLaunch({}, params)).to.be.revertedWith(
        'Liquidity + Buyback must be greater than 50% and equal to 100%'
      );
    });

    it('revert: Liquidity + Buyback must be equal or less to 100%', async function () {
      const params = { isbuyBack: true, liquidityPercent: 30e3, buyBackPercent: 90e3 };
      await expect(deployFairLaunch({}, params)).to.be.revertedWith(
        'Liquidity + Buyback must be greater than 50% and equal to 100%'
      );
    });

    it('pass: deploy with buy back enabled', async function () {
      const params = { isbuyBack: true, liquidityPercent: 30e3, buyBackPercent: 70e3 };
      deployFairLaunch({}, params);
    });

    it('revert: liquidity lock time must be greater than 5 minutes', async function () {
      const params = { lockTime: 60, isAutolisting: true };
      await expect(deployFairLaunch({}, params)).to.be.revertedWith("Lock time can't be less than 5 minuts");
    });

    it('revert: affliate reward can be max 5%', async function () {
      const params = { isAffiliate: true, affiliateReward: 6e3 };
      await expect(deployFairLaunch(params)).to.be.revertedWith('MAX reward limit exceeded');
    });
  });

  ///// Invest funds with public sale live
  describe('Invest fund in public Sale test ', function () {
    this.beforeEach(async function () {
      await deployFairLaunch();
    });

    it('revert: sale should be active', async function () {
      await expect(fairLaunch.buyToken(parseEther('2'), constants.AddressZero)).to.be.revertedWith(
        'Sale is not active'
      );
    });

    it('revert: maximum buy limit reached', async function () {
      let param = { isMaxLimit: true };
      await deployFairLaunch(param);
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await expect(
        fairLaunch
          .connect(user)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') })
      ).to.be.revertedWith('Maximum buy limit reached');
    });

    it('revert: insufficient ether amoutn sent', async function () {
      await time.increaseTo(startTime);
      await expect(
        fairLaunch
          .connect(user3)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('1') })
      ).to.be.revertedWith('Insufficient funds sent');
    });

    it('pass: check user deposit amount', async function () {
      await time.increaseTo(startTime);

      await fairLaunch
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      let deposit = await fairLaunch.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await fairLaunch.totalRaised()).to.be.equal(parseEther('10'));

      expect((await fairLaunch.getAllInvestors()).length).to.be.equal(1);
      expect((await fairLaunch.getAllReferrers()).length).to.be.equal(0);
    });

    it('pass: current price of tokens ', async function () {
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await fairLaunch
        .connect(user2)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });

      let price = await fairLaunch.currentPrice();

      expect(price).to.be.equal(parseEther('5000'));
    });
  });

  ///// Invest funds with private sale live
  describe('Invest fund in private (whitelist) Sale test ', function () {
    this.beforeEach(async function () {
      await deployFairLaunch();
      await time.increaseTo(startTime);
      await fairLaunch.addWhitelist([user.address, user2.address, user3.address]);
      await fairLaunch.enablePublicSale(endTime);
    });

    it('pass: current mode should be private', async function () {
      let mode = await fairLaunch.getCurrentMode();
      let info = await fairLaunch.fairlaunch();
      expect(mode).to.be.equal(Mode.PRIVATE);
      expect(info[8]).to.be.equal(endTime);
    });

    it('revert: investor is not whitelisted', async function () {
      await expect(
        fairLaunch
          .connect(user4)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') })
      ).to.be.revertedWith('User is not whitelisted');
    });

    it('pass: disable whitelisting', async function () {
      let Now = await time.latest();
      await fairLaunch.enablePublicSale(await time.latest());
      await fairLaunch
        .connect(user4)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      let mode = await fairLaunch.getCurrentMode();
      expect(mode).to.be.equal(Mode.PUBLIC);
    });

    it('pass: whitelisted user can invest', async function () {
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });

      await fairLaunch
        .connect(user2)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });

      let deposit = await fairLaunch.userInfo(user.address);
      let deposit2 = await fairLaunch.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(deposit2[0]).to.be.equal(parseEther('10'));

      expect(await fairLaunch.totalRaised()).to.be.equal(parseEther('20'));
    });

    describe('change mode to public from private', function () {
      it('pass: start public sale from private mode', async function () {
        let now = await time.latest();
        await fairLaunch.enablePublicSale(now);
        let mode = await fairLaunch.getCurrentMode();

        expect(mode).to.be.equal(Mode.PUBLIC);
        await fairLaunch
          .connect(user4)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });

        let deposit = await fairLaunch.userInfo(user4.address);
        expect(deposit[0]).to.be.equal(parseEther('10'));
      });

      it('revert: whitelisted user can buy during scheduled time', async function () {
        let publicTime = (await time.latest()) + 500;

        await fairLaunch.enablePublicSale(publicTime);

        let mode = await fairLaunch.getCurrentMode();
        expect(mode).to.be.equal(Mode.PRIVATE);

        let status = await fairLaunch.getCurrentSatus();

        expect(status).to.be.equal(1);
        await fairLaunch
          .connect(user)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });

        await expect(
          fairLaunch
            .connect(user4)
            .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') })
        ).to.be.revertedWith('User is not whitelisted');
      });

      it('pass: user can invest after scheduled public sale time', async function () {
        let publicTime = (await time.latest()) + 500;

        await fairLaunch.enablePublicSale(publicTime);
        await time.increaseTo(publicTime);

        let mode = await fairLaunch.getCurrentMode();
        expect(mode).to.be.equal(Mode.PUBLIC);
        await fairLaunch
          .connect(user4)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
        let deposit = await fairLaunch.userInfo(user4.address);

        expect(deposit[0]).to.be.equal(parseEther('10'));
      });
    });
  });

  describe('finalize sale without reward and buyback', function () {
    beforeEach(async () => {
      let param = { isBuyback: false };
      await deployFairLaunch({}, {}, param);
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
    });

    it('revert: Sale End Time or soft cap not reached', async function () {
      await deployFairLaunch();
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });

      await expect(fairLaunch.finalize()).to.be.revertedWith('Sale End Time or cap not reached');
    });

    it('revert: Sale already finalized', async function () {
      await time.increaseTo(endTime);
      await fairLaunch.finalize();
      await expect(fairLaunch.finalize()).to.be.revertedWith('Sale already finalized');
    });

    it('pass: finalize fairLaunch', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);

      await fairLaunch.finalize();
      await fairLaunch.connect(user).claimTokens();

      let balanceAfter = await token.balanceOf(fairLaunch.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(0);
    });

    it('pass: fee shoudl transfer to fee receiver', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await ethers.provider.getBalance(serviceFeeReceiver.address);

      await fairLaunch.finalize();

      let balanceAfter = await ethers.provider.getBalance(serviceFeeReceiver.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('.5')));
    });

    it('pass: user claim tokens ', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);
      let balBefore = await token.balanceOf(user.address);
      await fairLaunch.finalize();
      await fairLaunch.connect(user).claimTokens();

      let balAfter = await token.balanceOf(user.address);

      let balanceAfter = await token.balanceOf(fairLaunch.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(0);
      expect(balAfter).to.be.equal(balBefore.add(parseEther('100000')));
    });

    it('revert: All tokens claimed ', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);
      let balBefore = await token.balanceOf(user.address);
      await fairLaunch.finalize();
      await fairLaunch.connect(user).claimTokens();

      await expect(fairLaunch.connect(user).claimTokens()).to.be.revertedWith('All tokens claimed');
    });
  });

  describe('finalize sale with reward and no referrer and no buyback', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      let param = { isBuyback: false };
      await deployFairLaunch({}, params, param);
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
    });

    it('pass: referrer length shoudl be zero', async function () {
      await time.increaseTo(endTime);

      await fairLaunch.finalize();

      let ref = await fairLaunch.getAllReferrers();
      expect(ref.length).to.be.equal(0);
    });
  });
  describe('claim reward ,finalize sale with reward and no buyback', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      let param = { isBuyback: false };
      await deployFairLaunch(params, {}, param);
      await time.increaseTo(startTime);
      await fairLaunch.connect(user).buyToken(parseEther('10'), user4.address, { value: parseEther('10') });
    });

    it('revert: reward: user is not referrrer', async function () {
      await time.increaseTo(endTime);

      await fairLaunch.finalize();
      await expect(fairLaunch.connect(user2).claimReward()).to.be.revertedWith('User is not referrer');
    });

    it('revert: reward: sale is not closed', async function () {
      await time.increaseTo(endTime);

      await expect(fairLaunch.connect(user4).claimReward()).to.be.revertedWith('Sale is not closed');
    });

    it('pass: finalize fairLaunch with reward', async function () {
      await time.increaseTo(endTime);

      await fairLaunch.finalize();

      let reward = await fairLaunch.rewardInfo(user4.address);

      expect(reward[1]).to.be.equal(parseEther('.475'));
    });

    it('pass: claim reward after finalize', async function () {
      await fairLaunch.connect(user2).buyToken(parseEther('5'), user5.address, { value: parseEther('5') });

      await time.increaseTo(endTime);

      await fairLaunch.finalize();

      let reward = await fairLaunch.rewardInfo(user4.address);
      let reward5 = await fairLaunch.rewardInfo(user5.address);

      expect(reward[1]).to.be.equal(parseEther('.475'));
      expect(reward5[1]).to.be.equal(parseEther('.2375'));

      await fairLaunch.connect(user4).claimReward();
      await fairLaunch.connect(user5).claimReward();

      reward = await fairLaunch.rewardInfo(user4.address);
      reward5 = await fairLaunch.rewardInfo(user5.address);

      expect(reward[1]).to.be.equal(parseEther('0'));
      expect(reward5[1]).to.be.equal(parseEther('0'));
    });
  });

  describe('Cancel sale and claim refund with no buyback', function () {
    beforeEach(async () => {
      let param = { isBuyback: false };
      await deployFairLaunch({}, {}, param);
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
    });

    it('pass: cancel sale', async function () {
      await fairLaunch.cancel();
      let status = await fairLaunch.getCurrentSatus();
      expect(status).to.be.equal(2);
    });
    it('revert: cannot cancel sale after finalize', async function () {
      await fairLaunch
        .connect(user2)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
      await fairLaunch.finalize();
      await expect(fairLaunch.cancel()).to.be.revertedWith('Sale cannot be cancelled after finalize');
      let status = await fairLaunch.getCurrentSatus();
      expect(status).to.be.equal(3);
    });

    it('revert: cannot cancel again', async function () {
      await fairLaunch.cancel();
      await expect(fairLaunch.cancel()).to.be.revertedWith('Sale already cancelled');
      let status = await fairLaunch.getCurrentSatus();
      expect(status).to.be.equal(2);
    });

    it('revert: soft cap not reached', async function () {
      await time.increaseTo(endTime - 500);
      await expect(fairLaunch.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: sale is not cancelled', async function () {
      await expect(fairLaunch.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: user has no investment', async function () {
      await time.increaseTo(endTime);
      await expect(fairLaunch.connect(user3).claimUserRefund()).to.be.revertedWith('User has not invested');
    });

    it('pass: user claim refund', async function () {
      await time.increaseTo(endTime);
      await fairLaunch.connect(user).claimUserRefund();
      let share = await fairLaunch.userInfo(user.address);
      expect(share[0]).to.be.equal(0);
    });
  });

  describe('after start sale test', function () {
    beforeEach(async () => {
      let param = { isBuyback: false };
      await deployFairLaunch({}, {}, param);
      await time.increaseTo(startTime);
      await fairLaunch
        .connect(user)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
    });

    it('pass: set affiliate reward fee', async function () {
      await fairLaunch.setAffiliation(3e3);
      let info = await fairLaunch.fairlaunch();
      expect(info[10]).to.be.equal(3e3);
    });
    it('revert: reward fee cant be greater than 5% of raised', async function () {
      await expect(fairLaunch.setAffiliation(6e3)).to.be.revertedWith("Reward can't be greater than 5%");
    });

    it('revert: sale must not cancel or closed to set Affilate reward', async function () {
      await fairLaunch.cancel();
      await expect(fairLaunch.setAffiliation(4e3)).to.be.revertedWith('Sale is cancelled');
    });

    it('revert: time cant set if sale already started', async function () {
      await expect(fairLaunch.setTime(startTime, endTime)).to.be.revertedWith('Sale already started');
    });

    it('revert: start time before time now ', async function () {
      await deployFairLaunch();
      await expect(fairLaunch.setTime(await time.latest(), endTime)).to.be.revertedWith('Invalid start time');
    });

    it('revert: start time should be less than end ', async function () {
      await deployFairLaunch();
      await expect(fairLaunch.setTime(endTime, startTime)).to.be.revertedWith('Invalid start time');
    });

    it('pass: set start and end time', async function () {
      await deployFairLaunch();
      await fairLaunch.setTime(startTime, endTime);
    });

    it('pass: set end time  ', async function () {
      await fairLaunch.setEndTime(endTime - 5000);
      let info = await fairLaunch.fairlaunch();
      expect(info[6]).to.be.equal(endTime - 5000);
    });

    it('pass: set end time should not less than start time   ', async function () {
      await expect(fairLaunch.setEndTime(startTime - 5000)).to.be.revertedWith('Invalid end time');
    });

    it('pass: set end time should not less than start time   ', async function () {
      await fairLaunch.cancel();
      await expect(fairLaunch.setEndTime(endTime - 5000)).to.be.revertedWith('Sale is cancelled');
    });
  });

  describe('buy back with eth', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, {});

      await time.increaseTo(startTime);
      await fairLaunch.connect(user).buyToken(parseEther('10'), user2.address, { value: parseEther('10') });
    });

    it('pass: Buyback tokens ', async function () {
      await time.increaseTo(endTime);

      await fairLaunch.finalize();

      let intervalAfter = endTime + 400;
      await time.increaseTo(intervalAfter);

      let before = await ethers.provider.getBalance(fairLaunch.address);

      await fairLaunch.buyBackTokens();

      let after = await ethers.provider.getBalance(fairLaunch.address);

      expect(after).to.be.equal(before.sub(parseEther('0.5')));

      await time.increaseTo(intervalAfter + 60);

      await fairLaunch.buyBackTokens();

      await time.increaseTo(intervalAfter + 120);

      await fairLaunch.buyBackTokens();

      await time.increaseTo(intervalAfter + 180);
      await fairLaunch.buyBackTokens();

      await time.increaseTo(intervalAfter + 240);

      await expect(fairLaunch.buyBackTokens()).to.be.revertedWith('Insuffcient funds');

      after = await ethers.provider.getBalance(fairLaunch.address);

      expect(after).to.be.equal(before.sub(parseEther('1.805')));
    });
  });

  describe('Invest with custom token and buy back', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, {});
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(fairLaunchToken.address, parseEther('10'));
      await fairLaunchToken.connect(user).buyToken(parseEther('10'), user2.address);
    });
    it('pass: deposit tokens and claim funds, tokens without Buyback', async function () {
      let param = { isBuyback: false };
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, param);
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(fairLaunchToken.address, parseEther('10'));
      await fairLaunchToken.connect(user).buyToken(parseEther('10'), user2.address);
      let deposit = await fairLaunchToken.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await fairLaunchToken.totalRaised()).to.be.equal(parseEther('10'));

      let before = await token2.balanceOf(owner.address);
      let before2 = await token2.balanceOf(user2.address);

      await fairLaunchToken.finalize();
      await fairLaunchToken.connect(user2).claimReward();

      let after = await token2.balanceOf(owner.address);
      let after2 = await token2.balanceOf(user2.address);

      expect(after).to.be.equal(before.add(parseEther('3.61')));
      expect(after2).to.be.equal(before2.add(parseEther('.475')));
    });

    it('pass: deposit tokens and claim funds, tokens with Buyback', async function () {
      let deposit = await fairLaunchToken.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await fairLaunchToken.totalRaised()).to.be.equal(parseEther('10'));

      let before = await token2.balanceOf(owner.address);
      let before2 = await token2.balanceOf(user2.address);

      await time.increaseTo(endTime);

      await fairLaunchToken.finalize();
      await fairLaunchToken.connect(user2).claimReward();

      let after = await token2.balanceOf(owner.address);
      let after2 = await token2.balanceOf(user2.address);

      expect(after).to.be.equal(before.add(parseEther('1.805')));
      expect(after2).to.be.equal(before2.add(parseEther('.475')));
    });

    it('pass: Buyback tokens without eth ', async function () {
      await time.increaseTo(endTime);

      await fairLaunchToken.finalize();

      let before = await token2.balanceOf(fairLaunchToken.address);
      let before1 = await token.balanceOf(fairLaunchToken.address);

      await time.increaseTo(endTime + 400);

      await fairLaunchToken.buyBackTokens();

      let after = await token2.balanceOf(fairLaunchToken.address);
      let after1 = await token.balanceOf(fairLaunchToken.address);

      expect(after).to.be.equal(before.sub(parseEther('0.5')));
      expect(after1).to.be.equal(before1);
    });
  });

  describe('Sell tokens Not having 18 decimals test ', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, {});
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(fairLaunchDecimal.address, parseEther('10'));
      await fairLaunchDecimal.connect(user).buyToken(parseEther('10'), user2.address);
    });

    it('pass: deposit tokens and claim funds, tokens without Buyback', async function () {
      let param = { isBuyback: false };
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, param);
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(fairLaunchDecimal.address, parseEther('10'));
      await fairLaunchDecimal.connect(user).buyToken(parseEther('10'), user2.address);

      let deposit = await fairLaunchDecimal.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await fairLaunchDecimal.totalRaised()).to.be.equal(parseEther('10'));

      let before = await token2.balanceOf(owner.address);
      let before2 = await token2.balanceOf(user2.address);

      await fairLaunchDecimal.finalize();

      await fairLaunchDecimal.connect(user2).claimReward();

      let after = await token2.balanceOf(owner.address);
      let after2 = await token2.balanceOf(user2.address);

      expect(after).to.be.equal(before.add(parseEther('3.61')));
      expect(after2).to.be.equal(before2.add(parseEther('.475')));
    });

    it('pass: deposit tokens and claim funds, tokens with Buyback', async function () {
      let before = await decimalToken.balanceOf(user.address);

      await time.increaseTo(endTime);

      await fairLaunchDecimal.finalize();
      await fairLaunchDecimal.connect(user).claimTokens();

      await time.increaseTo(endTime + 400);
      await fairLaunchDecimal.buyBackTokens();

      let after = await decimalToken.balanceOf(user.address);

      expect(after).to.be.equal(before.add(parseUnits('100000', 9)));
    });

    it('pass: unlock Lp tokens ', async function () {
      await time.increaseTo(endTime);

      await fairLaunchDecimal.finalize();

      await time.increaseTo(endTime + 86500);

      await locker.unlock(1000000);
    });
  });

  describe('Buy Tokens with usdt 6 decimals currency ', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, {});
      await usdt.mint(user.address, parseUnits('10', 6));

      await time.increaseTo(startTime);
      await usdt.connect(user).approve(fairLaunchUsdt.address, parseUnits('10', 6));
      await fairLaunchUsdt.connect(user).buyToken(parseUnits('10', 6), user2.address);
    });

    it('pass: user claim refund', async function () {
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, {});
      await usdt.mint(user.address, parseUnits('10', 6));

      await time.increaseTo(startTime);
      await usdt.connect(user).approve(fairLaunchUsdt.address, parseUnits('10', 6));

      await fairLaunchUsdt.connect(user).buyToken(parseUnits('10', 6), user2.address);

      await fairLaunchUsdt.cancel();

      let before = await usdt.balanceOf(user.address);

      await time.increaseTo(endTime);
      await fairLaunchUsdt.connect(user).claimUserRefund();

      let after = await usdt.balanceOf(user.address);

      let share = await fairLaunchUsdt.userInfo(user.address);

      expect(share[0]).to.be.equal(0);
      expect(after).to.be.equal(before.add(parseUnits('10', 6)));
    });

    it('pass: deposit tokens and claim funds, tokens without Buyback', async function () {
      let param = { isBuyback: false };
      let params = { isAffiliate: true };
      await deployFairLaunch(params, {}, param);
      await usdt.mint(user.address, parseUnits('10', 6));

      await time.increaseTo(startTime);
      await usdt.connect(user).approve(fairLaunchUsdt.address, parseUnits('10', 6));
      await fairLaunchUsdt.connect(user).buyToken(parseUnits('10', 6), user2.address);

      let deposit = await fairLaunchUsdt.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseUnits('10', 6));
      expect(await fairLaunchUsdt.totalRaised()).to.be.equal(parseUnits('10', 6));

      let before = await usdt.balanceOf(owner.address);
      let before2 = await usdt.balanceOf(user2.address);

      await fairLaunchUsdt.finalize();

      await fairLaunchUsdt.connect(user2).claimReward();

      let after = await usdt.balanceOf(owner.address);
      let after2 = await usdt.balanceOf(user2.address);

      expect(after).to.be.equal(before.add(parseUnits('3.61', 6)));
      expect(after2).to.be.equal(before2.add(parseUnits('.475', 6)));
    });

    it('pass: deposit tokens and claim funds, tokens with Buyback', async function () {
      let before = await decimalToken.balanceOf(user.address);

      await time.increaseTo(endTime);

      await fairLaunchUsdt.finalize();
      await fairLaunchUsdt.connect(user).claimTokens();

      await time.increaseTo(endTime + 400);
      await fairLaunchUsdt.buyBackTokens();

      let after = await decimalToken.balanceOf(user.address);

      expect(after).to.be.equal(before.add(parseUnits('100000', 9)));
    });

    it('pass: unlock Lp tokens ', async function () {
      await time.increaseTo(endTime);

      await fairLaunchUsdt.finalize();

      await time.increaseTo(endTime + 86500);

      await locker.unlock(1000000);
    });
  });
});
