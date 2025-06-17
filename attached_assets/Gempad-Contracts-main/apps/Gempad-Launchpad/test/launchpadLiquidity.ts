import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { Signer, constants } from 'ethers';
import { ethers } from 'hardhat';
import BigNumber from 'bignumber.js';
import { parseEther, formatEther, parseUnits } from 'ethers/lib/utils';
import axios from 'axios';

import {
  ServiceReceiver,
  GempadV2Factory,
  GempadV2Router02,
  WETH9,
  GempadVestingLock
} from '../typechain-types';

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
  let launchpadUsdt: any;
  let token: any, token2: any;
  let usdt: any;
  let decimalToken: any;
  let serviceFeeReceiver: ServiceReceiver;
  let fee: number;
  let startTime: number, endTime: number;
  let interval: number;
  let factory: any;
  let factoryV2: GempadV2Factory;
  let router: GempadV2Router02;

  async function signer() {
    [owner, user, vip, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();
  }

  async function deployExchangeContracts() {
    const Factory = await ethers.getContractFactory('GempadV2Factory');
    factoryV2 = await Factory.deploy(owner.address);
    const WETH = await ethers.getContractFactory('WETH9');
    const weth = await WETH.deploy();

    const Router = await ethers.getContractFactory('GempadV2Router02');
    router = await Router.deploy(factoryV2.address, weth.address);

    let code = await factoryV2.getInitCodeHash();

    // console.log('init hash code ===>', code);

    return { factoryV2, weth, router };
  }

  async function deployLaunchpad(_params?: any, _vparams?: any, _lparams?: any) {
    const BotToken = await ethers.getContractFactory('TestToken');
    token = await BotToken.deploy();

    const BotToken2 = await ethers.getContractFactory('TestToken');
    token2 = await BotToken2.deploy();

    const MockUsdt = await ethers.getContractFactory('MockUsdt');
    usdt = await MockUsdt.deploy();

    const DecimalToken = await ethers.getContractFactory('DecimalToken');
    decimalToken = await DecimalToken.deploy();

    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();

    await serviceFeeReceiver.setPrice('GempadLaunchpad', parseEther('1'));
    await serviceFeeReceiver.setFee('GempadLaunchpad', 5e3);

    let Tokenfee = await serviceFeeReceiver.getFee('GempadLaunchpad');

    const GempadLaunchpad = await ethers.getContractFactory('GempadLaunchpad');
    const gempadLaunchpad = await GempadLaunchpad.deploy();

    await gempadLaunchpad.deployed();

    const GempadVestingLock = await ethers.getContractFactory('GempadVestingLock');
    const locker = await GempadVestingLock.deploy();

    await locker.deployed();

    let timeNow = await time.latest();
    startTime = timeNow + 3600;
    endTime = startTime + 36000;
    fee = +Tokenfee;
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

    let launchpadDecimalInfo = {
      token: decimalToken.address,
      sellPrice: parseUnits('1000', 9),
      listingPrice: parseUnits('500', 9),
      softCap: parseUnits('10', 6),
      hardCap: parseUnits('20', 6),
      minBuyLimit: parseUnits('2', 6),
      maxBuyLimit: parseUnits('15', 6),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      ...(_params || {})
    };

    let liquidityInfo = {
      router: router.address,
      liquidityPercent: 60e3,
      lockTime: 86400,
      locker: locker.address,
      liquidityAdded: 0,
      isAutolisting: true,
      ...(_lparams || {})
    };

    let vestingInfo = {
      isVestingEnable: false,
      TGEPercent: 40e3,
      cyclePercent: 20e3,
      cycleInterval: interval,
      ...(_vparams || {})
    };

    const GempadFactory = await ethers.getContractFactory('GempadLaunchpadFactory');
    factory = await GempadFactory.deploy(gempadLaunchpad.address);

    await factory.deployed();
    // console.log('factory deployed:', factory.address);

    await token.approve(factory.address, parseEther('25700'));

    await factory.createLaunchpad(
      launchpadInfo,
      liquidityInfo,
      vestingInfo,
      constants.AddressZero,
      false,
      false,
      5e3,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await token.approve(factory.address, parseEther('25700'));

    await factory.createLaunchpad(
      launchpadInfo,
      liquidityInfo,
      vestingInfo,
      token2.address,
      false,
      false,
      5e3,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await decimalToken.approve(factory.address, parseUnits('25700', 9));
    await factory.createLaunchpad(
      launchpadDecimalInfo,
      liquidityInfo,
      vestingInfo,
      usdt.address,
      false,
      false,
      5e3,
      true,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    let pads = await factory.getAllLaunchpads();
    // console.log("sale ==>",pads);

    launchpad = new ethers.Contract(pads[0], GempadLaunchpad.interface, owner);
    launchpadToken = new ethers.Contract(pads[1], GempadLaunchpad.interface, owner);
    launchpadUsdt = new ethers.Contract(pads[2], GempadLaunchpad.interface, owner);

    // console.log("owner of launchpad", await launchpad.owner(), await factory.owner(), factory.address, owner.address);
    // console.log("owner balance", await token.balanceOf(launchpad.address, launchpad.address));
  }

  async function deployExchangeContractsAndProvideLiquidity() {
    const data = await deployExchangeContracts();
    const { factoryV2, weth, router } = data;
    await factoryV2.setFeeTo(user.address);
    expect(await factoryV2.feeTo()).to.equal(user.address);
    expect(await token.approve(router.address, ethers.constants.MaxUint256)).to.be.ok;
    expect(await token2.approve(router.address, ethers.constants.MaxUint256)).to.be.ok;

    expect(
      await router.addLiquidity(
        token.address,
        token2.address,
        parseEther('100000'),
        parseEther('100000'),
        parseEther('1000'),
        parseEther('1000'),
        owner.address,
        ethers.constants.MaxUint256
      )
    ).to.be.ok;
    return data;
  }

  async function deployExchangeContractsAndProvideLiquidityETH() {
    const data = await deployExchangeContracts();
    const { factoryV2, weth, router } = data;
    await factoryV2.setFeeTo(user.address);
    expect(await factoryV2.feeTo()).to.equal(user.address);
    expect(await token.approve(router.address, ethers.constants.MaxUint256)).to.be.ok;
    // expect(await token2.approve(router.address, ethers.constants.MaxUint256)).to.be.ok;
    expect(
      await router.addLiquidityETH(
        token.address,
        parseEther('1000'),
        0,
        0,
        owner.address,
        ethers.constants.MaxUint256,
        { value: parseEther('100') }
      )
    ).to.be.ok;
    return data;
  }

  describe('With liquidity add', function () {
    let beforebal: any;
    let factory: GempadV2Factory;
    let weth: WETH9;
    let router: GempadV2Router02;

    beforeEach(async () => {
      await signer();
      ({ factoryV2, weth, router } = await deployExchangeContracts());
      await deployLaunchpad();
      await time.increaseTo(startTime);
      await launchpad
        .connect(user)
        .buyToken(parseEther('10'), constants.AddressZero, { value: parseEther('10') });
    });

    it('pass: add liquidity: ', async function () {
      await deployExchangeContractsAndProvideLiquidity();
      await deployExchangeContractsAndProvideLiquidityETH();
    });

    it('pass: add eth liquidity: ', async function () {
      await time.increaseTo(endTime);
      await launchpad.finalize();
    });

    it('pass: add token liquidity: ', async function () {
      await token2.mint(user.address, parseEther('10000'));
      await token2.connect(user).approve(launchpadToken.address, parseEther('10'));
      await launchpadToken.connect(user).buyToken(parseEther('10'), constants.AddressZero);

      await time.increaseTo(endTime);
      await launchpad.finalize();
    });

    it('pass:  fund balance received after liquidity: ', async function () {
      await token2.mint(user.address, parseEther('10000'));
      let balBefore = await token2.balanceOf(owner.address);

      await token2.connect(user).approve(launchpadToken.address, parseEther('10'));
      await launchpadToken.connect(user).buyToken(parseEther('10'), constants.AddressZero);

      await time.increaseTo(endTime);
      await launchpadToken.finalize();

      let balAfter = await token2.balanceOf(owner.address);

      expect(balAfter).to.be.equal(balBefore.add(parseEther('3.8')));
    });

    it('pass: total token received to launchpad', async function () {
      let bal = await token.balanceOf(launchpad.address);
      expect(bal).to.be.equal(parseEther('25700'));
    });

    describe('after finalize ', function () {
      let beforeBal: any;
      beforeEach(async () => {
        await time.increaseTo(endTime);
        beforeBal = await token.balanceOf(owner.address);
        await launchpad.finalize();
      });

      it('pass: check unsold balance after finalize :', async function () {
        await launchpad.connect(user).claimTokens();
        let afterBal = await token.balanceOf(owner.address);
        expect(afterBal).to.be.equal(beforeBal.add(parseEther('12850')));
      });

      it('pass: check liquidity amount added of funds:', async function () {
        let liq = await launchpad.liquidity();
        expect(liq[4]).to.be.equal(parseEther('5.7'));
      });

      it('pass: fee transferd:', async function () {
        let bal = await ethers.provider.getBalance(serviceFeeReceiver.address);

        expect(bal).to.be.equal(parseEther('3.5')); //.5 fee and 3eth laucnpad create fee
      });
    });
  });
  describe('sell Token with 9 decimal and buying currency USDT', function () {
    let before: any;
    let beforeToken: any;
    let beforeTokenOwner: any;
    beforeEach(async () => {
      await deployLaunchpad();
      await usdt.mint(user.address, parseUnits('10', 6));

      await time.increaseTo(startTime);
      await usdt.connect(user).approve(launchpadUsdt.address, parseUnits('10', 6));
      await launchpadUsdt.connect(user).buyToken(parseUnits('10', 6), constants.AddressZero);

      before = await usdt.balanceOf(owner.address);
      beforeToken = await decimalToken.balanceOf(launchpadUsdt.address);
      beforeTokenOwner = await decimalToken.balanceOf(owner.address);

      await launchpadUsdt.finalize();
    });
    it('pass: user deposit funds', async function () {
      let deposit = await launchpadUsdt.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseUnits('10', 6));
      expect(await launchpadUsdt.totalRaised()).to.be.equal(parseUnits('10', 6));
    });

    it('pass: liquidity added amount ', async function () {
      let liq = await launchpadUsdt.liquidity();
      expect(liq[4]).to.be.equal(parseUnits('5.7', 6));
    });

    it('pass:user claim Tokens  ', async function () {
      let before = await decimalToken.balanceOf(user.address);
      await launchpadUsdt.connect(user).claimTokens();

      let after = await decimalToken.balanceOf(user.address);
      expect(after).to.be.equal(before.add(parseUnits('10000', 9)));
    });

    it('pass: Owner withdraw funds', async function () {
      let after = await usdt.balanceOf(owner.address);
      expect(after).to.be.equal(before.add(parseUnits('3.8', 6)));
    });

    it('pass: unsold tokens should withdrawn', async function () {
      let afterToken = await decimalToken.balanceOf(launchpadUsdt.address);
      let afterTokenOwner = await decimalToken.balanceOf(owner.address);

      expect(afterToken).to.be.equal(parseUnits('10000', 9));
      expect(afterTokenOwner).to.be.equal(beforeTokenOwner.add(parseUnits('12850', 9)));
    });
  });
});
