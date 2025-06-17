import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { constants } from 'ethers';
import { ethers } from 'hardhat';
import { parseEther, formatEther, parseUnits, formatUnits } from 'ethers/lib/utils';
import {
  ServiceReceiver,
  GempadDutchAuction,
  GempadV2Factory,
  GempadV2Router02,
  WETH9
} from '../typechain-types';

describe('Gempad dutchAuction', function () {
  let owner: SignerWithAddress, user: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;
  let user3: SignerWithAddress,
    user4: SignerWithAddress,
    user5: SignerWithAddress,
    feeReceiver: SignerWithAddress;
  let auction: GempadDutchAuction;
  let auctionToken: GempadDutchAuction;
  let token: any;
  let usdt: any;
  let dxt: any;
  let auction9: any;
  let saleToken: any;
  let auctionUsdt: any;
  let serviceFeeReceiver: ServiceReceiver;
  let fee: number;
  let startTime: number, endTime: number;
  let interval: number;
  let decreaseInterval: number;
  let factoryV2: GempadV2Factory;
  let router: GempadV2Router02;

  // async function deployExchangeContracts() {

  // }

  enum Mode {
    PENDING = 0,
    PRIVATE,
    PUBLIC
  }

  async function deployDuctchAuction(_params?: any, _vparams?: any, _lparams?: any) {
    [owner, user, user1, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory('GempadV2Factory');
    factoryV2 = await Factory.deploy(owner.address);
    const WETH = await ethers.getContractFactory('WETH9');
    const weth = await WETH.deploy();

    const Router = await ethers.getContractFactory('GempadV2Router02');
    router = await Router.deploy(factoryV2.address, weth.address);

    const GempadVestingLock = await ethers.getContractFactory('GempadVestingLock');
    const locker = await GempadVestingLock.deploy();

    await locker.deployed();

    // return { factoryV2, weth, router };

    const BotToken = await ethers.getContractFactory('TestToken');
    token = await BotToken.deploy();

    const SaleToken = await ethers.getContractFactory('TestToken2');
    saleToken = await SaleToken.deploy();

    const MockUsdt = await ethers.getContractFactory('MockUsdt');
    usdt = await MockUsdt.deploy();

    const Dxt = await ethers.getContractFactory('Dxt');
    dxt = await Dxt.deploy();

    ///deploy service receiver
    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();

    await serviceFeeReceiver.setPrice('GempadDutchAuction', parseEther('1'));
    await serviceFeeReceiver.setFee('GempadDutchAuction', 5e3);

    let tokenFee = await serviceFeeReceiver.getFee('GempadDutchAuction');

    // console.log('service receiver deployed:', serviceFeeReceiver.address);

    ///deploy dutch auction
    const GempadDutchAuction = await ethers.getContractFactory('GempadDutchAuction');
    const gempadAuction = await GempadDutchAuction.deploy();

    await gempadAuction.deployed();

    // console.log('GempadDutchAuction deployed:', gempadAuction.address);

    ///deploy factory
    const GempadDutchAuctionFactory = await ethers.getContractFactory('GempadDutchAuctionFactory');
    const factory = await GempadDutchAuctionFactory.deploy(gempadAuction.address);

    await factory.deployed();
    // console.log('factory deployed:', factory.address);

    // console.log('GempadLaunchpad deployed:', gempadLaunchpad.address);
    // locktime = 86400;

    let balanceBeforeowner = await token.balanceOf(owner.address);

    let timeNow = await time.latest();
    startTime = timeNow + 3600;
    endTime = startTime + 36000;
    fee = +tokenFee;
    interval = 3600;
    decreaseInterval = 12000;

    let launchpadInfo = {
      token: token.address,
      totalSaleAmount: parseEther('100000'),
      startPrice: parseEther('0.01'),
      endPrice: parseEther('0.005'),
      softCap: parseEther('500'),
      hardCap: parseEther('1000'),
      minBuyLimit: parseEther('300'),
      maxBuyLimit: parseEther('1000'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      decreaseInterval: decreaseInterval,
      ...(_params || {})
    };

    let launchpadInfowith9 = {
      token: dxt.address,
      totalSaleAmount: parseUnits('100000', 9),
      startPrice: parseEther('0.01'),
      endPrice: parseEther('0.005'),
      softCap: parseEther('500'),
      hardCap: parseEther('1000'),
      minBuyLimit: parseEther('300'),
      maxBuyLimit: parseEther('1000'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      decreaseInterval: decreaseInterval,
      ...(_params || {})
    };

    let launchpadDecimalInfo = {
      token: dxt.address,
      totalSaleAmount: parseUnits('100000', 9),
      startPrice: parseUnits('0.01', 6),
      endPrice: parseUnits('0.005', 6),
      softCap: parseUnits('50', 6),
      hardCap: parseUnits('100', 6),
      minBuyLimit: parseUnits('5', 6),
      maxBuyLimit: parseUnits('100', 6),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      decreaseInterval: decreaseInterval,
      ...(_params || {})
    };

    let liquidityInfo = {
      router: router.address,
      liquidityPercent: 60e3,
      lockTime: 86400,
      locker: locker.address,
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

    await token.approve(factory.address, parseEther('214000'));

    await factory.createDutchAuction(
      launchpadInfo,
      liquidityInfo,
      vestingInfo,
      constants.AddressZero,
      false,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await token.approve(factory.address, parseEther('214000'));

    await factory.createDutchAuction(
      launchpadInfo,
      liquidityInfo,
      vestingInfo,
      saleToken.address,
      false,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await dxt.approve(factory.address, parseUnits('214000', 9));

    await factory.createDutchAuction(
      launchpadDecimalInfo,
      liquidityInfo,
      vestingInfo,
      usdt.address,
      false,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await dxt.approve(factory.address, parseUnits('214000', 9));

    await factory.createDutchAuction(
      launchpadInfowith9,
      liquidityInfo,
      vestingInfo,
      saleToken.address,
      false,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await dxt.approve(factory.address, parseUnits('214000', 9));

    let pads = await factory.getAllDutchAuctions();
    // console.log("sale ==>",pads);

    auction = new ethers.Contract(pads[0], gempadAuction.interface, owner);
    auctionToken = new ethers.Contract(pads[1], gempadAuction.interface, owner);
    auctionUsdt = new ethers.Contract(pads[2], gempadAuction.interface, owner);
    auction9 = new ethers.Contract(pads[3], gempadAuction.interface, owner);

    let balanceBeforeowner2 = await token.balanceOf(owner.address);
  }

  async function calculateCurrentPrice() {
    // let info = await auction.auction();
    // let startTime: any = info[8];
    // let endTime: any = info[9];
    // let decreaseInterval: any = info[12];
    // // let currentTime:any = await time.latest();
    //     let endPrice = (info.totalSaleAmount * (10 ** decimals)) / info.softCap;
    //     let startPrice = (info.totalSaleAmount * (10 ** decimals)) / info.hardCap;
    //     let totalIntervals = (info.endTime - info.startTime) / info.decreaseInterval;
    //     let reductionAmount = (endPrice - startPrice) / totalIntervals;
    //     let intervalsElapsed = (block.timestamp - info.startTime) / info.decreaseInterval;
    //     if (intervalsElapsed > totalIntervals) {
    //         intervalsElapsed = totalIntervals;
    //     }
    //     if (intervalsElapsed <= 0) {
    //         return startPrice;
    //     } else {
    //         let newPrice = startPrice + (reductionAmount * intervalsElapsed);
    //         return newPrice;
    //     }
  }

  describe('Deployment test with all peramters', function () {
    it('pass: Should deploy Gempadlaunchpad contract', async function () {
      await deployDuctchAuction();
      expect(auction.address).to.not.equal(constants.AddressZero);
    });

    it('revert: End price must be less than start price', async function () {
      const params = { endPrice: parseEther('2') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('End price must be less than start price');
    });
    it('revert: Softcap must be greater than or equal 20% of Hardcap', async function () {
      const params = { softCap: parseEther('100') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith(
        'Softcap must be greater than or equal 20% of Hardcap'
      );
    });

    it('revert: Soft-Cap should be less than or equal to hardcap', async function () {
      const params = { softCap: parseEther('300000') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith(
        'Soft-Cap should be less than or equal to hardcap'
      );
    });

    it('revert: if SoftCap * endPrice < TotalSaleAmount', async function () {
      const params = { softCap: parseEther('999') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('SoftCap * endPrice = TotalSaleAmount');
    });

    it('revert: if hardCap * startPrice < TotalSaleAmount', async function () {
      const params = { hardCap: parseEther('999') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('hardCap * startPrice = TotalSaleAmount');
    });

    it('revert: if hardCap * startPrice > TotalSaleAmount ', async function () {
      const params = { hardCap: parseEther('1000.01') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('hardCap * startPrice = TotalSaleAmount');
    });

    it('revert: Hard-Cap must be greater than softcap', async function () {
      const params = { hardCap: parseEther('400') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith(
        'Soft-Cap should be less than or equal to hardcap'
      );
    });

    it('revert: Min-Buy Limit cannot be zero', async function () {
      const params = { minBuyLimit: parseEther('0') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('Invalid minimum buy limit');
    });

    it('revert: Min-Buy Limit lessthan max', async function () {
      const params = { minBuyLimit: parseEther('1100') };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('Invalid minimum buy limit');
    });

    it('revert: Start Time cannot be less than current time', async function () {
      const params = { startTime: (await time.latest()) - 500 };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('Invalid start time');
    });
    it('revert: Start Time must be less than end time', async function () {
      const params = { startTime: endTime + 500 };
      await expect(deployDuctchAuction(params)).to.be.revertedWith('Invalid start time');
    });

    it('revert: Auction duration must be greater than decrease price interval', async function () {
      const params = { startTime: endTime - 100 };
      await expect(deployDuctchAuction(params)).to.be.revertedWith(
        'Auction duration must be greater than decrease price interval'
      );
    });

    it('revert: Price decrease interval cant be zero', async function () {
      const params = { decreaseInterval: 0 };
      await expect(deployDuctchAuction(params)).to.be.revertedWith("Price decrease interval can't be zero");
    });

    it('pass: vesting checks when enabled vesting', async function () {
      const params = { isVestingEnable: true };
      await deployDuctchAuction({}, params, {});
    });

    it('pass: ignore liquidity checks when not enabled vesting', async function () {
      const params = { TGEPercent: 0, isVestingEnable: false };
      await deployDuctchAuction({}, params);
    });

    it('revert: Initial Release pecentage percentage should be > 0', async function () {
      const params = { TGEPercent: 0, isVestingEnable: true };
      await expect(deployDuctchAuction({}, params, {})).to.be.revertedWith(
        'Invalid Initial Release pecentage'
      );
    });
    it('revert: Initial Release pecentage percentage should be < 100', async function () {
      const params2 = { TGEPercent: 100e3, isVestingEnable: true };
      await expect(deployDuctchAuction({}, params2)).to.be.revertedWith('Invalid Initial Release pecentage');
    });

    it('revert: Cycle pecentage must be greater than zero', async function () {
      const params = { cyclePercent: 0, isVestingEnable: true };
      await expect(deployDuctchAuction({}, params)).to.be.revertedWith(
        'Cycle pecentage must be greater than zero'
      );
    });

    it('revert: interval must be greater than zero', async function () {
      const params = { cycleInterval: 0, isVestingEnable: true };
      await expect(deployDuctchAuction({}, params)).to.be.revertedWith('interval must be greater than zero');
    });
    it('revert: combination of initial release and cycle% combination shoule 100%', async function () {
      const params = { TGEPercent: 40e3, cyclePercent: 70e3, isVestingEnable: true };
      await expect(deployDuctchAuction({}, params)).to.be.revertedWith(
        'Sum of TGE and cycle should be less than 100'
      );
    });

    it('pass: invest should be in native currency if address zero pass as token address', async function () {
      await deployDuctchAuction();
      let fundButoken = await auction.fundByTokens();
      expect(fundButoken).to.be.false;
    });

    it('pass: current mode should be waiting sale ', async function () {
      await deployDuctchAuction();
      let mode = await auction.getCurrentMode();
      expect(mode).to.be.equal(Mode.PENDING);
    });

    it('pass: if sale mode is public, public sale time should be start time', async function () {
      await deployDuctchAuction();
      let info = await auction.auction();
      // console.log("info sale time", info);
      expect(Number(info[8])).to.be.equal(startTime);
    });

    it('revert: liquidity must be greater than 50% ', async function () {
      const params = { liquidityPercent: 40e3, isAutolisting: true };
      await expect(deployDuctchAuction({}, {}, params)).to.be.revertedWith(
        'Liquidity percentage must be greater than 50'
      );
    });

    it('revert: liquidity lock time must be greater than 5 minutes', async function () {
      const params = { lockTime: 60, isAutolisting: true };
      await expect(deployDuctchAuction({}, {}, params)).to.be.revertedWith(
        "Lock time can't be less than 5 minuts"
      );
    });
  });

  ///// Invest funds with public sale live
  describe('Invest fund in public Sale test ', function () {
    this.beforeEach(async function () {
      await deployDuctchAuction();
    });

    it('revert: sale should be active', async function () {
      await expect(auction.buyToken(parseEther('2'))).to.be.revertedWith('Sale is not active');
    });

    it('revert: buyin amount shoudl be satisfy minimum purchase limit criteria', async function () {
      await time.increaseTo(startTime);
      await expect(auction.buyToken(parseEther('100'))).to.be.revertedWith(
        'Amount is less than min buy limit'
      );
    });

    it('revert: maximum buy limit reached', async function () {
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      await expect(
        auction.connect(user).buyToken(parseEther('6000'), { value: parseEther('6000') })
      ).to.be.revertedWith('Maximum buy limit reached');
    });

    it('revert: hard cap reached', async function () {
      // const params = { softCap: parseEther('10'), hardCap: parseEther('20') };
      await deployDuctchAuction();
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      await auction.connect(user2).buyToken(parseEther('500'), { value: parseEther('500') });
      await expect(
        auction.connect(user3).buyToken(parseEther('500'), { value: parseEther('500') })
      ).to.be.revertedWith('HardCap reached');
    });

    it('revert: insufficient ether amoutn sent', async function () {
      await time.increaseTo(startTime);
      await expect(
        auction.connect(user3).buyToken(parseEther('500'), { value: parseEther('1') })
      ).to.be.revertedWith('Insufficient funds sent');
    });

    it('pass: check user deposit amount', async function () {
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      let deposit = await auction.userInfo(user.address);
      expect(deposit[1]).to.be.equal(parseEther('500'));
      expect(await auction.totalRaised()).to.be.equal(parseEther('500'));
    });

    it('pass: total despot amout of multi user', async function () {
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      await auction.connect(user2).buyToken(parseEther('400'), { value: parseEther('400') });
      let userToken = await auction.userInfo(user.address);
      let user2Token = await auction.userInfo(user2.address);
      expect(await auction.totalRaised()).to.be.equal(parseEther('900'));
      expect(userToken[0]).to.be.equal(parseEther('50000'));
      expect(user2Token[0]).to.be.equal(parseEther('40000'));
    });

    it('pass: buy Toeksn after decrease intrvals', async function () {
      await time.increaseTo(startTime + 24000);

      await auction.connect(user).buyToken(parseEther('400'), { value: parseEther('400') });
      let price = await calculateCurrentPrice();
      let tokens = (parseEther('400') * price) / 1e18;
      //  (1e36 / await token.decimals());

      let userToken = await auction.userInfo(user.address);

      // console.log("price and tokens ====>", price, tokens, userToken[0] );
      // expect(userToken[0]).to.be.equal(BigInt(tokens));
    });
  });

  ///// Invest funds with private sale live
  describe('Invest fund in private (whitelist) Sale test ', function () {
    this.beforeEach(async function () {
      await deployDuctchAuction();
      await time.increaseTo(startTime);
      await auction.addWhitelist([user.address, user2.address, user3.address]);
      // await auction.toggleWhitelist();
      await auction.enablePublicSale(endTime);
    });

    it('pass: current mode should be private', async function () {
      let mode = await auction.getCurrentMode();
      let info = await auction.auction();
      expect(mode).to.be.equal(Mode.PRIVATE);
      expect(info[11]).to.be.equal(endTime);
    });

    it('revert: investor is not whitelisted', async function () {
      await expect(
        auction.connect(user4).buyToken(parseEther('500'), { value: parseEther('500') })
      ).to.be.revertedWith('User is not whitelisted');
    });

    it('pass: disable whitelisting', async function () {
      // await auction.toggleWhitelist();
      let Now = await time.latest();
      await auction.enablePublicSale(await time.latest());
      await auction.connect(user4).buyToken(parseEther('500'), { value: parseEther('500') });
      let mode = await auction.getCurrentMode();
      expect(mode).to.be.equal(Mode.PUBLIC);
    });

    it('pass: whitelisted user can invest', async function () {
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      await auction.connect(user2).buyToken(parseEther('500'), { value: parseEther('500') });
      let deposit = await auction.userInfo(user.address);
      let deposit2 = await auction.userInfo(user2.address);
      expect(deposit[1]).to.be.equal(parseEther('500'));
      expect(deposit2[1]).to.be.equal(parseEther('500'));
      expect(await auction.totalRaised()).to.be.equal(parseEther('1000'));
    });

    describe('change mode to public from private', function () {
      it('pass: start public sale from private mode', async function () {
        let now = await time.latest();
        await auction.enablePublicSale(now);
        let mode = await auction.getCurrentMode();
        expect(mode).to.be.equal(Mode.PUBLIC);
        await auction.connect(user4).buyToken(parseEther('500'), { value: parseEther('500') });
        let deposit = await auction.userInfo(user4.address);
        expect(deposit[1]).to.be.equal(parseEther('500'));
      });

      it('revert: whitelisted user can buy during scheduled time', async function () {
        let publicTime = (await time.latest()) + 500;
        await auction.enablePublicSale(publicTime);
        let mode = await auction.getCurrentMode();
        expect(mode).to.be.equal(Mode.PRIVATE);
        let status = await auction.getCurrentSatus();
        expect(status).to.be.equal(1);
        await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
        await expect(
          auction.connect(user4).buyToken(parseEther('300'), { value: parseEther('300') })
        ).to.be.revertedWith('User is not whitelisted');
      });

      it('pass: user can invest after scheduled public sale time', async function () {
        let publicTime = (await time.latest()) + 500;
        await auction.enablePublicSale(publicTime);
        await time.increaseTo(publicTime);
        let mode = await auction.getCurrentMode();
        expect(mode).to.be.equal(Mode.PUBLIC);
        await auction.connect(user4).buyToken(parseEther('300'), { value: parseEther('300') });
        let deposit = await auction.userInfo(user4.address);
        expect(deposit[1]).to.be.equal(parseEther('300'));
      });
    });
  });

  describe('finalize sale test', function () {
    beforeEach(async () => {
      await deployDuctchAuction();
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
    });

    it('revert: Sale End Time or soft cap not reached', async function () {
      await deployDuctchAuction();
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('300'), { value: parseEther('300') });

      await expect(auction.finalize()).to.be.revertedWith('Sale End Time or cap not reached');
    });

    it('revert: Sale already finalized', async function () {
      await time.increaseTo(endTime);
      await auction.finalize();
      await expect(auction.finalize()).to.be.revertedWith('Sale already finalized');
    });

    it('pass: finalize auction before end time', async function () {
      let balanceBefore = await token.balanceOf(owner.address);

      await auction.finalize();

      let balanceAfter = await token.balanceOf(owner.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('135500')));
    });

    it('pass: finalize auction after end time', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(owner.address);

      await auction.finalize();

      let balanceAfter = await token.balanceOf(owner.address);

      //balance refunded
      // expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('107000.00000000003')));
    });

    it('pass: fee shoudl transfer to fee receiver', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await ethers.provider.getBalance(serviceFeeReceiver.address);

      await auction.finalize();

      let balanceAfter = await ethers.provider.getBalance(serviceFeeReceiver.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('25')));
    });
  });

  describe('Cancel sale and claim refund', function () {
    beforeEach(async () => {
      await deployDuctchAuction();
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('400'), { value: parseEther('400') });
    });

    it('pass: cancel sale', async function () {
      await auction.cancel();
      let status = await auction.getCurrentSatus();
      expect(status).to.be.equal(2);
    });
    it('revert: cannot cancel sale after finalize', async function () {
      await auction.connect(user2).buyToken(parseEther('400'), { value: parseEther('400') });
      await auction.finalize();
      await expect(auction.cancel()).to.be.revertedWith('Sale cannot be cancelled after finalize');
      let status = await auction.getCurrentSatus();
      expect(status).to.be.equal(3);
    });

    it('revert: cannot cancel again', async function () {
      await auction.cancel();
      await expect(auction.cancel()).to.be.revertedWith('Sale already cancelled');
      let status = await auction.getCurrentSatus();
      expect(status).to.be.equal(2);
    });

    it('revert: soft cap not reached', async function () {
      await time.increaseTo(endTime - 500);
      await expect(auction.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: sale is not cancelled', async function () {
      await expect(auction.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: user has no investment', async function () {
      await time.increaseTo(endTime);
      await expect(auction.connect(user3).claimUserRefund()).to.be.revertedWith('User has not invested');
    });

    it('pass: user claim refund', async function () {
      await time.increaseTo(endTime);
      await auction.connect(user).claimUserRefund();
      let share = await auction.userInfo(user.address);
      expect(share[1]).to.be.equal(0);
    });
    it('pass: owner withdraw tokens after time end and soft cap not reached', async function () {
      await time.increaseTo(endTime);
      let before = await token.balanceOf(owner.address);
      await auction.withdrawTokens();

      let after = await token.balanceOf(owner.address);

      expect(after).to.be.equal(before.add(parseEther('214000')));
    });

    it('pass: owner withdraw tokens after cancel', async function () {
      await time.increaseTo(endTime);
      await auction.cancel();
      let before = await token.balanceOf(owner.address);
      await auction.withdrawTokens();

      let after = await token.balanceOf(owner.address);

      expect(after).to.be.equal(before.add(parseEther('214000')));
    });
  });

  describe('claim tokens without vesting ', function () {
    beforeEach(async () => {
      await deployDuctchAuction();
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      await auction.connect(user2).buyToken(parseEther('400'), { value: parseEther('400') });
    });

    it('revert: cannot claim before finalize', async function () {
      await expect(auction.connect(user).claimTokens()).to.be.revertedWith('Sale is not finalized');
    });
    it('revert: cannot claim before finalize', async function () {
      await auction.cancel();
      await expect(auction.connect(user).claimTokens()).to.be.revertedWith('Sale in cancelled');
    });

    it('revert: Insufficient available funds', async function () {
      await time.increaseTo(endTime);
      await auction.finalize();
      await auction.connect(user).claimTokens();
      await expect(auction.connect(user).claimTokens()).to.be.revertedWith('Total tokens claimed');
    });
    it('pass: claim tokens without vesting', async function () {
      await time.increaseTo(endTime);
      let balanceBefore = await token.balanceOf(user.address);
      let balanceBefore2 = await token.balanceOf(user2.address);

      await auction.finalize();
      await auction.connect(user).claimTokens();
      await auction.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('50000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('40000')));
    });
  });

  describe('claim tokens with vesting', function () {
    let balanceBefore: any, balanceBefore2: any, balanceBeforeowner: any;
    beforeEach(async () => {
      let params = { isVestingEnable: true };
      await deployDuctchAuction({}, params);
      await time.increaseTo(startTime);
      await auction.connect(user).buyToken(parseEther('500'), { value: parseEther('500') });
      await auction.connect(user2).buyToken(parseEther('400'), { value: parseEther('400') });

      await time.increaseTo(endTime);

      balanceBefore = await token.balanceOf(user.address);
      balanceBefore2 = await token.balanceOf(user2.address);
      balanceBeforeowner = await token.balanceOf(owner.address);
      await auction.finalize();
    });

    it('pass: TGE share should claimed', async function () {
      await auction.connect(user).claimTokens();
      await auction.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('20000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('16000')));
    });

    it('pass: TGE share + first cycle share should claimed', async function () {
      await time.increaseTo((await time.latest()) + interval);

      await auction.connect(user).claimTokens();
      await auction.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('30000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('24000')));
    });

    it('pass: TGE share + 2 cycle share should claimed', async function () {
      await time.increaseTo((await time.latest()) + interval * 2);

      await auction.connect(user).claimTokens();
      await auction.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('40000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('32000')));
    });

    it('pass: TGE share + all 3 cycle share should claimed', async function () {
      await time.increaseTo((await time.latest()) + interval * 3);

      await auction.connect(user).claimTokens();
      await auction.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('50000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('40000')));
    });

    it('pass: all token should claimed after long time pass', async function () {
      await time.increaseTo((await time.latest()) + 100000);

      await auction.connect(user).claimTokens();
      await auction.connect(user2).claimTokens();

      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('50000')));
      expect(balanceAfter2).to.be.equal(balanceBefore2.add(parseEther('40000')));
    });

    it('revert: cannot claim after all tokens claimed', async function () {
      await time.increaseTo((await time.latest()) + 100000);

      await auction.connect(user).claimTokens();
      await time.increaseTo((await time.latest()) + 200000);
      await expect(auction.connect(user).claimTokens()).to.be.revertedWith('Total tokens claimed');
    });
    describe('claim tokens with vesting and cycles share', function () {
      let claimTime: number;
      let claimTime2: number;
      let info: any;
      beforeEach(async () => {
        await auction.connect(user).claimTokens();
        await auction.connect(user2).claimTokens();
        info = await auction.userInfo(user.address);
        claimTime = info[3];
        claimTime2 = info[3];
      });

      it('pass: cycle share should claimed', async function () {
        await time.increaseTo(Number(claimTime) + interval);

        await auction.connect(user).claimTokens();
        await auction.connect(user2).claimTokens();

        let balance = await token.balanceOf(user.address);
        let balance2 = await token.balanceOf(user2.address);

        expect(balance).to.be.equal(balanceBefore.add(parseEther('30000')));
        expect(balance2).to.be.equal(balanceBefore2.add(parseEther('24000')));

        info = await auction.userInfo(user.address);
        claimTime = info[3];
        claimTime = info[3];
        await time.increaseTo(Number(claimTime) + interval);

        await auction.connect(user).claimTokens();
        await auction.connect(user2).claimTokens();

        let balance1 = await token.balanceOf(user.address);
        let balance22 = await token.balanceOf(user2.address);

        expect(balance1).to.be.equal(balanceBefore.add(parseEther('40000')));
        expect(balance22).to.be.equal(balanceBefore2.add(parseEther('32000')));

        info = await auction.userInfo(user.address);
        claimTime = info[3];
        claimTime = info[3];
        await time.increaseTo(Number(claimTime) + interval * 5);

        await auction.connect(user).claimTokens();
        await auction.connect(user2).claimTokens();

        let balance11 = await token.balanceOf(user.address);
        let balance33 = await token.balanceOf(user2.address);

        expect(balance11).to.be.equal(balanceBefore.add(parseEther('50000')));
        expect(balance33).to.be.equal(balanceBefore2.add(parseEther('40000')));

        info = await auction.userInfo(user.address);
        claimTime = info[3];
        claimTime = info[3];
        await time.increaseTo(Number(claimTime) + interval * 5);

        await expect(auction.connect(user).claimTokens()).to.be.revertedWith('Total tokens claimed');
      });
    });
  });

  describe('Invest with custom token', function () {
    let sale: any;
    let sale2: any;
    beforeEach(async () => {
      await deployDuctchAuction();
      await saleToken.mint(user.address, parseEther('10000'));
    });
    it('pass: user deposit tokens', async function () {
      await time.increaseTo(startTime);
      await saleToken.connect(user).approve(auctionToken.address, parseEther('500'));
      await auctionToken.connect(user).buyToken(parseEther('500'));
      let deposit = await auctionToken.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('50000'));
      expect(await auctionToken.totalRaised()).to.be.equal(parseEther('500'));

      await time.increaseTo(endTime);

      let before = await saleToken.balanceOf(owner.address);
      await auctionToken.finalize();

      let after = await saleToken.balanceOf(owner.address);

      expect(after).to.be.equal(before.add(parseEther('190')));
    });
  });

  describe('Invest with custom token and sell 9 decimal token', function () {
    let sale: any;
    let sale2: any;
    beforeEach(async () => {
      await deployDuctchAuction();
      await saleToken.mint(user.address, parseEther('10000'));
    });
    it('pass: user deposit tokens', async function () {
      await time.increaseTo(startTime);
      await saleToken.connect(user).approve(auction9.address, parseEther('500'));

      await auction9.connect(user).buyToken(parseEther('500'));
      let deposit = await auction9.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseUnits('50000', 9));

      expect(await auction9.totalRaised()).to.be.equal(parseEther('500'));

      await time.increaseTo(endTime);

      let before = await saleToken.balanceOf(owner.address);
      await auction9.finalize();

      let after = await saleToken.balanceOf(owner.address);

      expect(after).to.be.equal(before.add(parseEther('190')));
    });
  });

  describe('Sell tokens with 9 decimals and buy with usdt ', function () {
    beforeEach(async () => {
      const params = { isAutolisting: true };
      await deployDuctchAuction({}, {}, params);
      await usdt.mint(user.address, parseUnits('1000', 6));
      await usdt.mint(user2.address, parseUnits('1000', 6));

      await time.increaseTo(startTime);
      await usdt.connect(user).approve(auctionUsdt.address, parseUnits('50', 6));
      await auctionUsdt.connect(user).buyToken(parseUnits('50', 6));
    });

    it('pass: user invested usdt', async function () {
      let deposit = await auctionUsdt.userInfo(user.address);
      expect(deposit[1]).to.be.equal(parseUnits('50', 6));
    });

    it('pass: user tokens share', async function () {
      let deposit = await auctionUsdt.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseUnits('50000', 9));

      //buyToken after fee reduction interval pas;

      await time.increaseTo(startTime + 12000);
      await usdt.connect(user2).approve(auctionUsdt.address, parseUnits('50', 6));
      await auctionUsdt.connect(user2).buyToken(parseUnits('50', 6));

      let deposit2 = await auctionUsdt.userInfo(user2.address);
      expect(deposit2[0]).to.be.equal(66666666666650);
    });

    it('pass: finalize sale ', async function () {
      await time.increaseTo(endTime);
      await auctionUsdt.finalize();
    });

    it('pass: user claim tokens ', async function () {
      await time.increaseTo(endTime);
      await auctionUsdt.finalize();

      await auctionUsdt.connect(user).claimTokens();

      expect(await dxt.balanceOf(user.address)).to.be.equal(parseUnits('50000', 9));
    });

    it('pass: owner claimed funds ', async function () {
      await time.increaseTo(endTime);
      let before = await usdt.balanceOf(owner.address);
      await auctionUsdt.finalize();

      let after = await usdt.balanceOf(owner.address);

      expect(after).to.be.equal(before.add(parseUnits('19', 6)));
    });

    it('pass: amount of liquidity added ', async function () {
      await time.increaseTo(endTime);
      await auctionUsdt.finalize();

      let liq = await auctionUsdt.liquidity();
      expect(liq[4]).to.be.equal(parseUnits('28.5', 6));
    });

    it('pass: owner claimed funds ', async function () {
      await time.increaseTo(endTime);
      let before = await dxt.balanceOf(owner.address);
      await auctionUsdt.finalize();

      let after = await dxt.balanceOf(owner.address);

      expect(after).to.be.equal(679000000000029);
    });
  });
});
