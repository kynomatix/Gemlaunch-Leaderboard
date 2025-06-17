import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Signer, constants } from 'ethers';
import { ethers } from 'hardhat';
import BigNumber from 'bignumber.js';
import { parseEther, formatEther } from 'ethers/lib/utils';
import axios from 'axios';

import { ServiceReceiver, GempadV2Factory, GempadV2Router02, WETH9 } from '../typechain-types';

describe('Gempad airdrop', function () {
  let owner: SignerWithAddress, user: SignerWithAddress, vip: SignerWithAddress, user2: SignerWithAddress;
  let user3: SignerWithAddress,
    user4: SignerWithAddress,
    user5: SignerWithAddress,
    feeReceiver: SignerWithAddress;
  let tokenFee: Number;
  let locktime: BigNumber;
  let launchpad: any;
  let launchpadToken: any;
  let salePrivate: any;
  let token: any;
  let saleToken: any;
  let balanceBefore: any;
  let serviceFeeReceiver: ServiceReceiver;
  let fee: number;
  let startTime: number, endTime: number;
  let interval: number;
  let factory: any;

  async function deployLaunchpad(_params?: any, _vparams?: any, _lparams?: any) {
    [owner, user, vip, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

    const BotToken = await ethers.getContractFactory('TestToken');
    token = await BotToken.deploy();

    const SaleToken = await ethers.getContractFactory('TestToken');
    saleToken = await SaleToken.deploy();

    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();

    await serviceFeeReceiver.setPrice('GempadLaunchpad', parseEther('1'));

    const GempadLaunchpad = await ethers.getContractFactory('GempadLaunchpad');
    const gempadLaunchpad = await GempadLaunchpad.deploy();

    await gempadLaunchpad.deployed();

    // console.log('GempadLaunchpad deployed:', gempadLaunchpad.address);
    // locktime = 86400;

    let timeNow = await time.latest();
    startTime = timeNow + 3600;
    endTime = startTime + 36000;
    fee = 5e3;
    interval = 3600;

    let launchpadInfo = {
      token: token.address,
      sellPrice: parseEther('1000'),
      listingPrice: parseEther('500'),
      softCap: parseEther('10'),
      hardCap: parseEther('20'),
      minBuyLimit: parseEther('2'),
      maxBuyLimit: parseEther('15'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      ...(_params || {})
    };

    let liquidityInfo = {
      router: '0x1234567890123456789012345678901234567890',
      liquidityPercent: 60e3,
      lockTime: 86400,
      locker: '0x1234567890123456789012345678901234567890',
      liquidityAdded: 0,
      isAutolisting: false,
      ...(_lparams || {})
    };

    let vestingInfo = {
      isVestingEnable: false,
      TGEPercent: 40e3,
      cyclePercent: 20e3,
      cycleInterval: interval,
      ...(_vparams || {})
    };

    // console.log("TGE percent ===>", vestingInfo, _vparams);

    const GempadBeacon = await ethers.getContractFactory('GempadLaunchpadBeacon');
    const beacon = await GempadBeacon.deploy(gempadLaunchpad.address, owner.address);

    await beacon.deployed();
    // console.log('beacon deployed:', beacon.address);

    const GempadFactory = await ethers.getContractFactory('GempadLaunchpadFactory');
    factory = await GempadFactory.deploy(gempadLaunchpad.address);

    await factory.deployed();
    // console.log('factory deployed:', factory.address);

    await token.approve(factory.address, parseEther('80000'));

    await factory.createLaunchpad(
      launchpadInfo,
      liquidityInfo,
      vestingInfo,
      constants.AddressZero,
      false,
      false,
      5e3,
      true,
      5e3,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await factory.createLaunchpad(
      launchpadInfo,
      liquidityInfo,
      vestingInfo,
      token.address,
      false,
      false,
      5e3,
      true,
      5e3,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    let pads = await factory.getAllLaunchpads();
    // console.log("sale ==>",pads);

    launchpad = new ethers.Contract(pads[0], GempadLaunchpad.interface, owner);
    launchpadToken = new ethers.Contract(pads[1], GempadLaunchpad.interface, owner);

    // console.log("owner of launchpad", await launchpad.owner(), await factory.owner(), factory.address, owner.address);
    // console.log("owner balance", await token.balanceOf(launchpad.address, launchpad.address));
  }

  describe('Deployment test with all peramters', function () {
    // this.beforeEach(async function () {
    //   await deployLaunchpad()
    // })
    it('pass: Should deploy Gempadlaunchpad contract', async function () {
      await deployLaunchpad();
      expect(launchpad.address).to.not.equal(constants.AddressZero);
    });

    it('revert: Softcap must be greater than or equal 50% of Hardcap', async function () {
      const params = { softCap: parseEther('4') };
      await expect(deployLaunchpad(params)).to.be.revertedWith(
        'Softcap must be greater than or equal 25% of Hardcap'
      );
    });

    it('revert: Soft-Cap should be less than or equal to hardcap', async function () {
      const params = { softCap: parseEther('21') };
      await expect(deployLaunchpad(params)).to.be.revertedWith(
        'Soft-Cap should be less than or equal to hardcap'
      );
    });

    it('revert: Hard-Cap must be greater than softcap', async function () {
      const params = { hardCap: parseEther('9') };
      await expect(deployLaunchpad(params)).to.be.revertedWith(
        'Soft-Cap should be less than or equal to hardcap'
      );
    });

    it('revert: Min-Buy Limit cannot be zero', async function () {
      const params = { minBuyLimit: parseEther('0') };
      await expect(deployLaunchpad(params)).to.be.revertedWith(
        'Minimum-buy limit must be less than max-but limit'
      );
    });

    it('revert: Start Time cannot be less than current time', async function () {
      const params = { startTime: (await time.latest()) - 500 };
      await expect(deployLaunchpad(params)).to.be.revertedWith('Invalid start time');
    });
    it('revert: Start Time must be less than end time', async function () {
      const params = { startTime: endTime + 500 };
      await expect(deployLaunchpad(params)).to.be.revertedWith('Invalid start time');
    });
    it('pass: vesting checks when enabled vesting', async function () {
      const params = { isVestingEnable: true };
      await deployLaunchpad({}, params);
    });

    it('pass: ignore liquidity checks when not enabled vesting', async function () {
      const params = { TGEPercent: 0, isVestingEnable: false };
      await deployLaunchpad({}, params);
    });

    it('revert: Initial Release pecentage percentage should be > 0', async function () {
      const params = { TGEPercent: 0, isVestingEnable: true };
      await expect(deployLaunchpad({}, params)).to.be.revertedWith('Invalid Initial Release pecentage');
    });
    it('revert: Initial Release pecentage percentage should be < 100', async function () {
      const params2 = { TGEPercent: 100e3, isVestingEnable: true };
      await expect(deployLaunchpad({}, params2)).to.be.revertedWith('Invalid Initial Release pecentage');
    });

    it('revert: Cycle pecentage must be greater than zero', async function () {
      const params = { cyclePercent: 0, isVestingEnable: true };
      await expect(deployLaunchpad({}, params)).to.be.revertedWith(
        'Cycle pecentage must be greater than zero'
      );
    });

    it('revert: interval must be greater than zero', async function () {
      const params = { cycleInterval: 0, isVestingEnable: true };
      await expect(deployLaunchpad({}, params)).to.be.revertedWith('interval must be greater than zero');
    });
    it('revert: combination of initial release and all of cycle% combination shoule 100%', async function () {
      const params = { TGEPercent: 40e3, cyclePercent: 70e3, isVestingEnable: true };
      await expect(deployLaunchpad({}, params)).to.be.revertedWith(
        'Sum of TGE bps and cycle should be less than 100'
      );
    });

    it('pass: invest should be in native currency if address zero pass as token address', async function () {
      await deployLaunchpad();
      let fundButoken = await launchpad.fundByTokens();
      expect(fundButoken).to.be.false;
    });

    it('pass: current mode should be public sale ', async function () {
      await deployLaunchpad();
      let mode = await launchpad.getCurrentMode();
      expect(mode).to.be.equal(0);
    });

    it('pass: if sale mode is public, public sale time should be start time', async function () {
      await deployLaunchpad();
      let info = await launchpad.launchpad();
      // console.log("info sale time", info);
      expect(Number(info[7])).to.be.equal(startTime);
    });

    it('revert: liquidity must be greater than 50% ', async function () {
      const params = { liquidityPercent: 40e3, isAutolisting: true };
      await expect(deployLaunchpad({}, {}, params)).to.be.revertedWith('Invalid liquidity percentage');
    });

    it('revert: liquidity lock time must be greater than 5 minutes', async function () {
      const params = { lockTime: 60, isAutolisting: true };
      await expect(deployLaunchpad({}, {}, params)).to.be.revertedWith(
        "Lock time can't be less than 5 minuts"
      );
    });
  });

  ///// Invest funds with public sale live
  describe('Invest fund in public Sale test ', function () {
    this.beforeEach(async function () {
      let params = { isAffiliate: false };
      await deployLaunchpad(params);
    });

    it('revert: sale should be active', async function () {
      await expect(launchpad.buyToken(parseEther('2'), constants.AddressZero)).to.be.revertedWith(
        'Sale is not active'
      );
    });

    it('revert: buyin amount shoudl be satisfy minimum purchase limit criteria', async function () {
      await time.increaseTo(startTime);
      await expect(launchpad.buyToken(parseEther('0.01'), constants.AddressZero)).to.be.revertedWith(
        'Amount is less than min buy limit'
      );
    });

    it('revert: maximum buy limit reached', async function () {
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await expect(
        launchpad.connect(user).buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('1') })
      ).to.be.revertedWith('Maximum buy limit reached');
    });

    it('revert: hard cap reached', async function () {
      const params = { softCap: parseEther('10'), hardCap: parseEther('20') };
      await deployLaunchpad(params);
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await launchpad
        .connect(user2)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await expect(
        launchpad
          .connect(user3)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') })
      ).to.be.revertedWith('Maximum sale limit reached');
    });

    it('revert: insufficient ether amoutn sent', async function () {
      await time.increaseTo(startTime);
      await expect(
        launchpad.connect(user3).buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('1') })
      ).to.be.revertedWith('Insufficient funds sent');
    });

    it('pass: check user deposit amount', async function () {
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      let deposit = await launchpad.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await launchpad.totalRaised()).to.be.equal(parseEther('10'));
    });

    it('pass: total despot amout of multi user', async function () {
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await launchpad
        .connect(user2)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      let userToken = await launchpad.getUserTokens(user.address);
      let user2Token = await launchpad.getUserTokens(user2.address);
      expect(await launchpad.totalRaised()).to.be.equal(parseEther('20'));
      expect(userToken).to.be.equal(parseEther('10000'));
      expect(user2Token).to.be.equal(parseEther('10000'));
    });
  });

  ///// Invest funds with private sale live
  describe('Invest fund in private (whitelist) Sale test ', function () {
    this.beforeEach(async function () {
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad.addWhitelist([user.address, user2.address, user3.address]);
      // await launchpad.toggleWhitelist();
      await launchpad.enablePublicSale(endTime);
    });

    it('pass: current mode should be private', async function () {
      let mode = await launchpad.getCurrentMode();
      let info = await launchpad.launchpad();
      expect(mode).to.be.equal(2);
      expect(info[8]).to.be.equal(endTime);
    });

    it('revert: investor is not whitelisted', async function () {
      await expect(
        launchpad
          .connect(user4)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') })
      ).to.be.revertedWith('User is not whitelisted');
    });

    it('pass: disable whitelisting', async function () {
      // await launchpad.toggleWhitelist();
      let Now = await time.latest();
      await launchpad.enablePublicSale(await time.latest());
      await launchpad
        .connect(user4)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      let mode = await launchpad.getCurrentMode();
      expect(mode).to.be.equal(1);
    });

    it('pass: whitelisted user can invest', async function () {
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await launchpad
        .connect(user2)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      let deposit = await launchpad.userInfo(user.address);
      let deposit2 = await launchpad.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(deposit2[0]).to.be.equal(parseEther('10'));
      expect(await launchpad.totalRaised()).to.be.equal(parseEther('20'));
    });

    describe('change mode to public from private', function () {
      it('pass: start public sale from private mode', async function () {
        let now = await time.latest();
        await launchpad.enablePublicSale(now);
        let mode = await launchpad.getCurrentMode();
        expect(mode).to.be.equal(1);
        await launchpad
          .connect(user4)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
        let deposit = await launchpad.userInfo(user4.address);
        expect(deposit[0]).to.be.equal(parseEther('10'));
      });

      it('revert: whitelisted user can buy during scheduled time', async function () {
        let publicTime = (await time.latest()) + 500;
        await launchpad.enablePublicSale(publicTime);
        let mode = await launchpad.getCurrentMode();
        expect(mode).to.be.equal(2);
        let status = await launchpad.getCurrentSatus();
        expect(status).to.be.equal(1);
        await launchpad
          .connect(user)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
        await expect(
          launchpad
            .connect(user4)
            .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') })
        ).to.be.revertedWith('User is not whitelisted');
      });

      it('pass: user can invest after scheduled public sale time', async function () {
        let publicTime = (await time.latest()) + 500;
        await launchpad.enablePublicSale(publicTime);
        await time.increaseTo(publicTime);
        let mode = await launchpad.getCurrentMode();
        expect(mode).to.be.equal(1);
        await launchpad
          .connect(user4)
          .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
        let deposit = await launchpad.userInfo(user4.address);
        expect(deposit[0]).to.be.equal(parseEther('10'));
      });
    });
  });

  describe('finalize sale without reward and auto liquidity', function () {
    beforeEach(async () => {
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
    });

    it('revert: Sale End Time or soft cap not reached', async function () {
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });

      await expect(launchpad.finalize()).to.be.revertedWith('Sale End Time or cap not reached');
    });

    it('revert: Sale already finalized', async function () {
      await time.increaseTo(endTime);
      await launchpad.finalize();
      // await expect(launchpad.finalize()).to.be.revertedWith('Sale already finalized');
    });

    it('pass: finalize launchpad', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);

      await launchpad.finalize();

      let balanceAfter = await token.balanceOf(owner.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
    });

    it('pass: fee shoudl transfer to fee receiver', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await ethers.provider.getBalance(serviceFeeReceiver.address);

      await launchpad.finalize();

      let balanceAfter = await ethers.provider.getBalance(serviceFeeReceiver.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('.5')));
    });
  });

  describe('finalize sale with reward but no referrer', function () {
    beforeEach(async () => {
      let params = { isAffiliate: true };
      await deployLaunchpad(params);
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
    });

    it('pass: finalize launchpad', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);

      let gas = await launchpad.estimateGas.finalize();
      await launchpad.finalize();

      let balanceAfter = await token.balanceOf(owner.address);
      let ref = await launchpad.getAllReferrers();
      expect(ref.length).to.be.equal(0);
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
    });
  });

  describe('claim reward ,finalize sale with reward and no auto liquidity', function () {
    beforeEach(async () => {
      await deployLaunchpad();
      await launchpad.setAffiliation(5e3);
      await time.increaseTo(startTime);
      await launchpad.connect(user).buyToken(parseEther('10'), user4.address, { value: parseEther('10') });
    });

    it('revert: reward: user is not referrrer', async function () {
      await time.increaseTo(endTime);

      await launchpad.finalize();
      await expect(launchpad.connect(user2).claimReward()).to.be.revertedWith('User is not referrer');
    });

    it('revert: reward: sale is not closed', async function () {
      await time.increaseTo(endTime);

      await expect(launchpad.connect(user4).claimReward()).to.be.revertedWith('Sale is not closed');
    });

    it('pass: finalize launchpad with reward', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);

      await launchpad.finalize();

      let balanceAfter = await token.balanceOf(owner.address);
      let reward = await launchpad.rewardInfo(user4.address);

      expect(reward[1]).to.be.equal(parseEther('.475'));
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
    });

    it('pass: claim reward after finalize', async function () {
      await launchpad.connect(user2).buyToken(parseEther('5'), user5.address, { value: parseEther('5') });

      await time.increaseTo(endTime);

      await launchpad.finalize();

      let reward = await launchpad.rewardInfo(user4.address);
      let reward5 = await launchpad.rewardInfo(user5.address);

      expect(reward[1]).to.be.equal(parseEther('.475'));
      expect(reward5[1]).to.be.equal(parseEther('.2375'));

      await launchpad.connect(user4).claimReward();
      await launchpad.connect(user5).claimReward();

      reward = await launchpad.rewardInfo(user4.address);
      reward5 = await launchpad.rewardInfo(user5.address);

      expect(reward[1]).to.be.equal(parseEther('0'));
      expect(reward5[1]).to.be.equal(parseEther('0'));
    });
  });

  describe('Cancel sale and claim refund', function () {
    beforeEach(async () => {
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
    });

    it('pass: cancel sale', async function () {
      await launchpad.cancel();
      let status = await launchpad.getCurrentSatus();
      expect(status).to.be.equal(2);
    });
    it('revert: cannot cancel sale after finalize', async function () {
      await launchpad
        .connect(user2)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
      await launchpad.finalize();
      await expect(launchpad.cancel()).to.be.revertedWith('Sale cannot be cancelled after finalize');
      let status = await launchpad.getCurrentSatus();
      expect(status).to.be.equal(3);
    });

    it('revert: cannot cancel again', async function () {
      await launchpad.cancel();
      await expect(launchpad.cancel()).to.be.revertedWith('Sale already cancelled');
      let status = await launchpad.getCurrentSatus();
      expect(status).to.be.equal(2);
    });

    it('revert: soft cap not reached', async function () {
      await time.increaseTo(endTime - 500);
      await expect(launchpad.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: sale is not cancelled', async function () {
      await expect(launchpad.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: user has no investment', async function () {
      await time.increaseTo(endTime);
      await expect(launchpad.connect(user3).claimUserRefund()).to.be.revertedWith('User has not invested');
    });

    it('pass: user claim refund', async function () {
      await time.increaseTo(endTime);
      await launchpad.connect(user).claimUserRefund();
      let share = await launchpad.userInfo(user.address);
      expect(share[0]).to.be.equal(0);
    });
    it('pass: owner withdraw tokens', async function () {
      await time.increaseTo(endTime);
      await launchpad.cancel();
      let before = await token.balanceOf(owner.address);
      await launchpad.withdrawTokens();

      let after = await token.balanceOf(owner.address);

      expect(after).to.be.equal(before.add(parseEther('20000')));
    });
  });

  describe('after start sale test', function () {
    beforeEach(async () => {
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
    });

    it('pass: set affiliate reward fee', async function () {
      await launchpad.setAffiliation(3e3);
      let info = await launchpad.launchpad();
      expect(await launchpad.affiliateReward()).to.be.equal(3e3);
    });
    it('revert: reward fee cant be greater than 5% of raised', async function () {
      await expect(launchpad.setAffiliation(6e3)).to.be.revertedWith("Reward can't be greater than 5%");
    });

    it('revert: sale must not cancel or closed', async function () {
      await launchpad
        .connect(user2)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });
      await time.increaseTo(endTime);
      await launchpad.finalize();
      await expect(launchpad.setAffiliation(4e3)).to.be.revertedWith('Sale is not active');
    });

    it('revert: sale already started', async function () {
      await expect(launchpad.setTime(startTime, endTime)).to.be.revertedWith('Sale already started');
    });

    it('revert: start time before time now ', async function () {
      await deployLaunchpad();
      await expect(launchpad.setTime(await time.latest(), endTime)).to.be.revertedWith('Invalid start time');
    });

    it('revert: start time before time now ', async function () {
      await deployLaunchpad();
      await expect(launchpad.setTime(endTime, startTime)).to.be.revertedWith('Invalid start time');
    });

    it('pass: set start and end time  ', async function () {
      await deployLaunchpad();
      await launchpad.setTime(startTime, endTime);
    });

    it('pass: get total tokens for sale  ', async function () {
      let saleable = await launchpad.getTotalSaleTokens();
      expect(saleable).to.be.equal(parseEther('20000'));
    });

    it('pass: get total sold ', async function () {
      let sold = await launchpad.getTotalTokensSold();
      expect(sold).to.be.equal(parseEther('8000'));
    });

    it('revert: set claim time', async function () {
      let params = { isAutolisting: true };
      await deployLaunchpad({}, {}, params);
      await expect(launchpad.setClaimTime(endTime)).to.be.revertedWith(
        'Cannot set with Auto liquidity enabled'
      );
    });

    it('pass: auto liquidity should not enabled', async function () {
      await launchpad.setClaimTime(endTime);
      let claim = await launchpad.claimTime();
      expect(claim).to.be.equal(endTime);
    });
  });

  describe('claim tokens without vesting ', function () {
    beforeEach(async () => {
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await launchpad
        .connect(user2)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
    });

    it('revert: cannot claim before finalize', async function () {
      await expect(launchpad.connect(user).claimTokens()).to.be.revertedWith('Sale is not finalized');
    });
    it('revert: cannot claim before finalize', async function () {
      await launchpad.cancel();
      await expect(launchpad.connect(user).claimTokens()).to.be.revertedWith('Sale in cancelled');
    });

    it('revert: Insufficient available funds', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(user.address);
      await launchpad.finalize();
      await launchpad.connect(user).claimTokens();
      await expect(launchpad.connect(user).claimTokens()).to.be.revertedWith('Total tokens claimed');
    });
    it('pass: claim tokens without vesting', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(user.address);
      let balanceBefore2 = await token.balanceOf(user2.address);

      await launchpad.finalize();
      await launchpad.connect(user).claimTokens();
      await launchpad.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('10000')));
    });
  });

  describe('claim tokens with vesting', function () {
    let balanceBefore: any, balanceBefore2: any, balanceBeforeowner: any;
    beforeEach(async () => {
      let params = { isVestingEnable: true };
      await deployLaunchpad({}, params);
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
      await launchpad
        .connect(user2)
        .buyToken(parseEther('8'), constants.AddressZero, { value: parseEther('8') });

      await time.increaseTo(endTime);

      balanceBefore = await token.balanceOf(user.address);
      balanceBefore2 = await token.balanceOf(user2.address);
      balanceBeforeowner = await token.balanceOf(owner.address);

      await launchpad.finalize();
    });

    it('pass: TGE share should claimed', async function () {
      await launchpad.connect(user).claimTokens();
      await launchpad.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('4000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('3200')));
    });

    it('pass: TGE share + first cycle share should claimed', async function () {
      await time.increaseTo((await time.latest()) + interval);

      await launchpad.connect(user).claimTokens();
      await launchpad.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('6000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('4800')));
    });

    it('pass: TGE share + 2 cycle share should claimed', async function () {
      await time.increaseTo((await time.latest()) + interval * 2);

      await launchpad.connect(user).claimTokens();
      await launchpad.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('8000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('6400')));
    });

    it('pass: TGE share + all 3 cycle share should claimed', async function () {
      await time.increaseTo((await time.latest()) + interval * 3);

      await launchpad.connect(user).claimTokens();
      await launchpad.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('8000')));
    });

    it('pass: all token should claimed after long time pass', async function () {
      await time.increaseTo((await time.latest()) + 100000);

      await launchpad.connect(user).claimTokens();
      await launchpad.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('8000')));
    });

    it('pass: balance shoudl be refuded to owner', async function () {
      await time.increaseTo((await time.latest()) + 100000);

      await launchpad.connect(user).claimTokens();

      let balanceAfterowner = await token.balanceOf(owner.address);

      expect(balanceAfterowner).to.be.equal(balanceBeforeowner.add(parseEther('2000')));
    });

    // it('revert: cannot claim after all tokens claimed', async function () {
    //   await time.increaseTo((await time.latest() + 100000));

    //   await (launchpad.connect(user).claimTokens());
    //   await time.increaseTo((await time.latest() + 200000));
    //   await expect(launchpad.connect(user).claimTokens())
    //     .to.be.revertedWith("Total tokens claimed");
    // });
    describe('claim tokens with vesting and cycles share', function () {
      let claimTime: number;
      let claimTime2: number;
      let info: any;
      beforeEach(async () => {
        await launchpad.connect(user).claimTokens();
        await launchpad.connect(user2).claimTokens();
        info = await launchpad.userInfo(user.address);
        claimTime = info[2];
        claimTime2 = info[2];
      });

      it('pass: cycle share should claimed', async function () {
        await time.increaseTo(Number(claimTime) + interval);

        await launchpad.connect(user).claimTokens();
        await launchpad.connect(user2).claimTokens();

        let balance = await token.balanceOf(user.address);
        let balance2 = await token.balanceOf(user2.address);

        expect(balance).to.be.equal(balanceBefore.add(parseEther('6000')));
        expect(balance2).to.be.equal(balanceBefore2.add(parseEther('4800')));

        info = await launchpad.userInfo(user.address);
        claimTime = info[2];
        claimTime2 = info[2];
        await time.increaseTo(Number(claimTime) + interval);

        await launchpad.connect(user).claimTokens();
        await launchpad.connect(user2).claimTokens();

        let balance1 = await token.balanceOf(user.address);
        let balance22 = await token.balanceOf(user2.address);

        expect(balance1).to.be.equal(balanceBefore.add(parseEther('8000')));
        expect(balance22).to.be.equal(balanceBefore2.add(parseEther('6400')));

        info = await launchpad.userInfo(user.address);
        claimTime = info[2];
        claimTime2 = info[2];
        await time.increaseTo(Number(claimTime) + interval * 5);

        await launchpad.connect(user).claimTokens();
        await launchpad.connect(user2).claimTokens();

        let balance11 = await token.balanceOf(user.address);
        let balance33 = await token.balanceOf(user2.address);

        expect(balance11).to.be.equal(balanceBefore.add(parseEther('10000')));
        expect(balance33).to.be.equal(balanceBefore2.add(parseEther('8000')));

        info = await launchpad.userInfo(user.address);
        claimTime = info[2];
        claimTime2 = info[2];
        await time.increaseTo(Number(claimTime) + interval * 5);

        await expect(launchpad.connect(user).claimTokens()).to.be.revertedWith('Total tokens claimed');
        // await (launchpad.connect(user2).claimTokens());

        // let balance111 = await token.balanceOf(user.address);
        // let balance333 = await token.balanceOf(user2.address);

        // expect(balance111).to.be.equal(balanceBefore.add(parseEther("10000")))
        // expect(balance333).to.be.equal(balanceBefore2.add(parseEther("8000")))
      });
    });
  });

  describe('Invest with custom token', function () {
    let sale: any;
    let sale2: any;
    beforeEach(async () => {
      await deployLaunchpad();
      await token.mint(user.address, parseEther('10'));
    });
    it('pass: user deposit tokens', async function () {
      await time.increaseTo(startTime);
      await token.connect(user).approve(launchpadToken.address, parseEther('10'));
      await launchpadToken.connect(user).buyToken(parseEther('10'), constants.AddressZero);
      let deposit = await launchpadToken.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await launchpadToken.totalRaised()).to.be.equal(parseEther('10'));
    });
  });
});
