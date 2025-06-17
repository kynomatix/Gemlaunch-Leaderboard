import { time } from '@nomicfoundation/hardhat-network-helpers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { constants } from 'ethers';
import { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
let factoryV2: GempadV2Factory;
let router: GempadV2Router02;

import {
  ServiceReceiver,
  GempadV2Factory,
  GempadV2Router02,
  WETH9,
  GempadSubscriptionPool
} from '../typechain-types';

enum Mode {
  PENDING = 0,
  PRIVATE,
  PUBLIC
}

describe('Gempad airdrop', function () {
  let owner: SignerWithAddress, user: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;
  let user3: SignerWithAddress,
    user4: SignerWithAddress,
    user5: SignerWithAddress,
    user6: SignerWithAddress,
    user7: SignerWithAddress,
    user8: SignerWithAddress;
  let poolDecimal: GempadSubscriptionPool;
  let pool: GempadSubscriptionPool;
  let poolToken: GempadSubscriptionPool;
  let fairLaunchDecimal: any;
  let token: any, token2: any, decimalToken: any;
  let saleToken: any;
  let serviceFeeReceiver: ServiceReceiver;
  let fee: number;
  let startTime: number, endTime: number;
  let interval: number;
  let factory: any;
  let locker: any;
  let contributors: SignerWithAddress[];
  async function deploySubscriptionPool(_params?: any, _lparams?: any) {
    [owner, user, user1, user2, user3, user4, user5, user6, user7, user8] = await ethers.getSigners();

    const BotToken = await ethers.getContractFactory('TestToken');
    token = await BotToken.deploy();

    const botToke = await ethers.getContractFactory('TestToken');
    token2 = await botToke.deploy();

    const DecimalToken = await ethers.getContractFactory('DecimalToken');
    decimalToken = await DecimalToken.deploy();

    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();

    await serviceFeeReceiver.setPrice('GempadSubscriptionPool', parseEther('1'));
    await serviceFeeReceiver.setFee('GempadSubscriptionPool', 5e3);

    let tokenFee = await serviceFeeReceiver.getFee('GempadSubscriptionPool');

    const GempadSubscriptionPool = await ethers.getContractFactory('GempadSubscriptionPool');
    const subscriptionPool = await GempadSubscriptionPool.deploy();

    await subscriptionPool.deployed();

    ///deploy exchange contracts;

    const Factory = await ethers.getContractFactory('GempadV2Factory');
    factoryV2 = await Factory.deploy(owner.address);
    const WETH = await ethers.getContractFactory('WETH9');
    const weth = await WETH.deploy();

    const Router = await ethers.getContractFactory('GempadV2Router02');
    router = await Router.deploy(factoryV2.address, weth.address);

    const GempadVestingLock = await ethers.getContractFactory('GempadVestingLock');
    locker = await GempadVestingLock.deploy();

    await locker.deployed();

    let timeNow = await time.latest();
    startTime = timeNow + 3600;
    endTime = startTime + 604800;

    fee = +tokenFee;
    interval = 3600;

    let SubscriptionPoolDetailsDecimal = {
      token: decimalToken.address,
      hardCap: parseEther('100000'),
      softCap: parseEther('60000'),
      userHardCap: parseEther('10000'),
      sellRate: parseEther('10000'),
      listingRate: parseEther('5000'),
      startTime: startTime,
      endTime: endTime,
      finalizeTime: endTime,
      publicSaleTime: 0,
      ...(_params || {})
    };

    let SubscriptionPoolDetails = {
      token: token.address,
      hardCap: parseEther('100000'),
      softCap: parseEther('60000'),
      userHardCap: parseEther('10000'),
      sellRate: parseEther('10000'),
      listingRate: parseEther('5000'),
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
      ...(_lparams || {})
    };

    const PoolFactory = await ethers.getContractFactory('GempadSubscriptionPoolFactory');
    factory = await PoolFactory.deploy(subscriptionPool.address);

    await factory.deployed();
    // console.log('factory deployed:', factory.address);

    await token.approve(factory.address, parseEther('128500'));

    await factory.createSubscriptionPool(
      SubscriptionPoolDetails,
      liquidityInfo,
      constants.AddressZero,
      false,
      false,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    await token.approve(factory.address, parseEther('128500'));

    await factory.createSubscriptionPool(
      SubscriptionPoolDetails,
      liquidityInfo,
      token2.address,
      false,
      false,
      serviceFeeReceiver.address,
      { value: parseEther('1') }
    );

    let decimals = await decimalToken.decimals();
    await decimalToken.approve(factory.address, 128500 * 10 ** decimals);

    // await factory.createSubscriptionPool(
    //   SubscriptionPoolDetailsDecimal,
    //   liquidityInfo,
    //   token2.address,
    //   false,
    //   false,
    //   serviceFeeReceiver.address,
    //   { value: parseEther('1') }
    // );

    let pools = await factory.getAllSubscriptionPools();
    // console.log("sale ==>",pools);

    pool = new ethers.Contract(pools[0], GempadSubscriptionPool.interface, owner);
    poolToken = new ethers.Contract(pools[1], GempadSubscriptionPool.interface, owner);
    // fairLaunchDecimal = new ethers.Contract(pools[2], GempadSubscriptionPool.interface, owner);
  }

  async function getUserAddressArray(length: number) {
    const accounts = [];
    for (let i = 0; i < length; i++) {
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      accounts.push(wallet);
    }
    return accounts;
  }

  async function distributeEther(sender: SignerWithAddress[], recipients: SignerWithAddress[]) {
    for (let i = 0; i < sender.length; i++) {
      for (let j = 0; j < recipients.length; j++) {
        const transaction = {
          from: sender[i].address,
          to: recipients[j].address, // Use the individual recipient address here
          value: ethers.utils.parseEther('30')
        };

        // Use sendTransaction to send the transaction
        await sender[i].sendTransaction(transaction);

        // console.log(`Sent 10 ethers from ${sender[i].address} to ${recipients[j]}`);
      }
    }
  }

  async function getRandomNumberArray(length: number, minValue: number, maxValue: number) {
    const randomArray = [];

    for (let i = 0; i < length; i++) {
      const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      randomArray.push(parseEther(randomValue.toString()));
    }

    return randomArray;
  }

  describe('Deployment test with all peramters', function () {
    it('pass: Should deploy pool contract', async function () {
      await deploySubscriptionPool();
      expect(pool.address).to.not.equal(constants.AddressZero);
    });

    it('revert: Start Time cannot be less than current time', async function () {
      const params = { startTime: (await time.latest()) - 500 };
      await expect(deploySubscriptionPool(params)).to.be.revertedWith('Invalid start time');
    });
    it('revert: Start Time must be less than end time', async function () {
      const params = { startTime: endTime + 500 };
      await expect(deploySubscriptionPool(params)).to.be.revertedWith('Invalid start time');
    });

    it('pass: invest should be in native currency if address zero pass as token address', async function () {
      await deploySubscriptionPool();
      let fundButoken = await pool.fundByTokens();
      expect(fundButoken).to.be.false;
    });

    it('pass: current mode should be public sale ', async function () {
      await deploySubscriptionPool();
      let mode = await pool.getCurrentMode();
      expect(mode).to.be.equal(Mode.PENDING);
    });

    it('pass: if sale mode is public, public sale time should be start time', async function () {
      await deploySubscriptionPool();
      let info = await pool.pool();
      expect(Number(info[6])).to.be.equal(startTime);
    });

    it('revert: SoftCap must be greater than 50% of hardh cap', async function () {
      const params = { softCap: parseEther('50000') };
      await expect(deploySubscriptionPool(params)).to.be.revertedWith(
        'SoftCap must be greater than 50% of hardh cap'
      );
    });

    it('revert: Invalid User max buy limit', async function () {
      const params = { userHardCap: parseEther('100001') };
      await expect(deploySubscriptionPool(params)).to.be.revertedWith('Invalid User max buy limit');
    });
    it('revert: liquidity must be greater than 50% ', async function () {
      const params = { liquidityPercent: 40e6, isAutolisting: true };
      await expect(deploySubscriptionPool({}, params)).to.be.revertedWith('Invalid liquidity percentage');
    });

    it('revert: liquidity lock time must be greater than 5 minutes', async function () {
      const params = { lockTime: 60, isAutolisting: true };
      await expect(deploySubscriptionPool({}, params)).to.be.revertedWith(
        "Lock time can't be less than 5 minuts"
      );
    });
  });

  ///// Invest funds with public sale live
  describe('Invest fund in public Sale test ', function () {
    this.beforeEach(async function () {
      await deploySubscriptionPool();
    });

    it('revert: sale should be active', async function () {
      await expect(pool.buyToken(parseEther('2'))).to.be.revertedWith('Sale is not active');
    });
    it('revert: insufficient ether amoutn sent', async function () {
      await time.increaseTo(startTime);
      await expect(
        pool.connect(user3).buyToken(parseEther('10'), { value: parseEther('1') })
      ).to.be.revertedWith('Insufficient funds sent');
    });

    it('pass: check user deposit amount', async function () {
      await time.increaseTo(startTime);

      await pool.connect(user).buyToken(parseEther('10'), { value: parseEther('10') });
      let deposit = await pool.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await pool.totalContribution()).to.be.equal(parseEther('10'));

      expect((await pool.getAllInvestors()).length).to.be.equal(1);
    });
  });

  ///// Invest funds with private sale live
  describe('Invest fund in private (whitelist) Sale test ', function () {
    this.beforeEach(async function () {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.addWhitelist([user.address, user2.address, user3.address]);
      await pool.enablePublicSale(endTime);
    });

    it('pass: current mode should be private', async function () {
      let mode = await pool.getCurrentMode();
      let info = await pool.pool();
      expect(mode).to.be.equal(Mode.PRIVATE);
      expect(info[8]).to.be.equal(endTime);
    });

    it('revert: investor is not whitelisted', async function () {
      await expect(
        pool.connect(user4).buyToken(parseEther('10'), { value: parseEther('10') })
      ).to.be.revertedWith('User is not whitelisted');
    });

    it('pass: disable whitelisting', async function () {
      let Now = await time.latest();
      await pool.enablePublicSale(await time.latest());
      await pool.connect(user4).buyToken(parseEther('10'), { value: parseEther('10') });
      let mode = await pool.getCurrentMode();
      expect(mode).to.be.equal(Mode.PUBLIC);
    });

    it('pass: whitelisted user can invest', async function () {
      await pool.connect(user).buyToken(parseEther('10'), { value: parseEther('10') });

      await pool.connect(user2).buyToken(parseEther('10'), { value: parseEther('10') });

      let deposit = await pool.userInfo(user.address);
      let deposit2 = await pool.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(deposit2[0]).to.be.equal(parseEther('10'));

      expect(await pool.totalContribution()).to.be.equal(parseEther('20'));
    });

    describe('change mode to public from private', function () {
      it('pass: start public sale from private mode', async function () {
        let now = await time.latest();
        await pool.enablePublicSale(now);
        let mode = await pool.getCurrentMode();

        expect(mode).to.be.equal(Mode.PUBLIC);
        await pool.connect(user4).buyToken(parseEther('10'), { value: parseEther('10') });

        let deposit = await pool.userInfo(user4.address);
        expect(deposit[0]).to.be.equal(parseEther('10'));
      });

      it('revert: whitelisted user can buy during scheduled time', async function () {
        let publicTime = (await time.latest()) + 500;

        await pool.enablePublicSale(publicTime);

        let mode = await pool.getCurrentMode();
        expect(mode).to.be.equal(Mode.PRIVATE);

        let status = await pool.getCurrentSatus();

        expect(status).to.be.equal(1);
        await pool.connect(user).buyToken(parseEther('10'), { value: parseEther('10') });

        await expect(
          pool.connect(user4).buyToken(parseEther('10'), { value: parseEther('10') })
        ).to.be.revertedWith('User is not whitelisted');
      });

      it('pass: user can invest after scheduled public sale time', async function () {
        let publicTime = (await time.latest()) + 500;

        await pool.enablePublicSale(publicTime);
        await time.increaseTo(publicTime);

        let mode = await pool.getCurrentMode();
        expect(mode).to.be.equal(Mode.PUBLIC);
        await pool.connect(user4).buyToken(parseEther('10'), { value: parseEther('10') });
        let deposit = await pool.userInfo(user4.address);

        expect(deposit[0]).to.be.equal(parseEther('10'));
      });
    });
  });

  describe('Calcualte Tokens and finalize sale', function () {
    let participants: SignerWithAddress[];
    beforeEach(async () => {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('10'), { value: parseEther('10') });
      await deploySubscriptionPool();
      await time.increaseTo(startTime);

      let investment: number[] = [10, 12, 8, 5, 15, 5, 9, 20, 13, 10];
      participants = [owner, user, user1, user2, user3, user4, user5, user6, user7, user8];

      for (let i = 0; i < participants.length; i++) {
        await pool
          .connect(participants[i])
          .buyToken(parseEther(investment[i].toString()), { value: parseEther(investment[i].toString()) });
      }

      await time.increaseTo(endTime);

      let investors = await pool.getAllInvestors();

      for (let i = 0; i < investors.length; i += 2) {
        const user = investors.slice(i, i + 2);
        await pool.updateCalculation(user);
      }

      // await pool.updateCalculation(investors);

      for (const element of participants) {
        let allo = await pool.userInfo(element.address);
        // console.log('allocation', allo.userAllocation);
      }
      let data2 = await pool.getSurplusData();

      for (let i = 0; i < investors.length; i += 2) {
        const user = data2[3].slice(i, i + 2);
        const value = data2[4].slice(i, i + 2);
        await pool.calculateShare(data2[1], data2[2], user, value);
      }

      // await pool.calculateShare(data2[1],data2[2],data2[3],data2[4]);
      // await pool.calculateShare(investors);

      // contributors = await getUserAddressArray(10);

      // let senders = [owner, user, user1, user2, user3, user4, user5, user6, user7, user8];
      // await distributeEther(senders, contributors);
    });

    it('revert: Sale End Time or soft cap not reached', async function () {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('4'), { value: parseEther('4') });

      let investors = await pool.getAllInvestors();

      await expect(pool.updateCalculation(investors)).to.be.revertedWith('Sale End Time or cap not reached');
    });

    it('revert: Sale already finalized', async function () {
      await pool.finalize();
      await expect(pool.finalize()).to.be.revertedWith('Sale already finalized');
    });

    it('pass: Calculate tokens and finalize pool', async function () {
      // let investment = await getRandomNumberArray(300, 1, 12);
      await deploySubscriptionPool();
      await time.increaseTo(startTime);

      let investment: number[] = [10, 12, 8, 5, 15, 5, 9, 20, 13, 10];
      let senders = [owner, user, user1, user2, user3, user4, user5, user6, user7, user8];

      for (let i = 0; i < senders.length; i++) {
        await pool
          .connect(senders[i])
          .buyToken(parseEther(investment[i].toString()), { value: parseEther(investment[i].toString()) });
      }

      await time.increaseTo(endTime);

      let investors = await pool.getAllInvestors();

      await pool.updateCalculation(investors);
      await pool.updateCalculation(investors);

      let data2 = await pool.getSurplusData();

      await pool.calculateShare(data2[1], data2[2], data2[3], data2[4]);

      // for (const element of investors) {
      //   let bal = await pool.userInfo(element);
      //   console.log("Balance of tokens for", element, "==>", bal.userAllocation);
      // }

      let balanceBefore = await token.balanceOf(user.address);

      await pool.finalize();
      await pool.connect(user8).claimTokens();

      let balanceAfter = await token.balanceOf(user8.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
    });

    it('pass: fee shoudl transfer to fee receiver', async function () {
      let balanceBefore = await ethers.provider.getBalance(serviceFeeReceiver.address);

      await pool.finalize();

      let balanceAfter = await ethers.provider.getBalance(serviceFeeReceiver.address);

      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('0.449254324915490156')));
    });

    it('pass: user claim tokens ', async function () {
      let balanceBefore = await token.balanceOf(user3.address);
      let balBefore = await token.balanceOf(user.address);
      await pool.finalize();

      await pool.connect(user).claimTokens();
      await pool.connect(user3).claimTokens();

      let balAfter = await token.balanceOf(user.address);

      let balanceAfter = await token.balanceOf(user3.address);

      //balance refunded
      expect(balanceAfter).to.be.equal(balanceBefore.add(parseEther('10000')));
      expect(balAfter).to.be.equal(balBefore.add(parseEther('10000')));
    });

    it('revert: All tokens claimed ', async function () {
      let balBefore = await token.balanceOf(pool.address);
      await pool.finalize();

      let investors = await pool.getAllInvestors();

      for (const element of participants) {
        await pool.connect(element).claimTokens();
        let allo = await pool.userInfo(element.address);
        // console.log('allocation', allo.userAllocation);
      }
      // console.log('allocation', await pool.totalClaimed());
      let balAfter = await token.balanceOf(pool.address);

      //  expect(balAfter).to.be.equal(0);
    });
  });

  describe('Cancel sale and claim refund', function () {
    beforeEach(async () => {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('10'), { value: parseEther('10') });
    });

    it('pass: cancel sale', async function () {
      await pool.cancel();
      let status = await pool.getCurrentSatus();
      expect(status).to.be.equal(2);
    });
    it('revert: cannot cancel sale after finalize', async function () {
      await pool.connect(user2).buyToken(parseEther('10'), { value: parseEther('10') });
      // await pool.setCanFinalize();
      await pool.finalize();
      await expect(pool.cancel()).to.be.revertedWith('Sale cannot be cancelled after finalize');
      let status = await pool.getCurrentSatus();
      expect(status).to.be.equal(3);
    });

    it('revert: cannot cancel again', async function () {
      await pool.cancel();
      await expect(pool.cancel()).to.be.revertedWith('Sale already cancelled');
      let status = await pool.getCurrentSatus();
      expect(status).to.be.equal(2);
    });

    it('revert:refund soft cap not reached', async function () {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('5'), { value: parseEther('5') });
      await time.increaseTo(endTime - 500);
      await expect(pool.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: sale is not cancelled', async function () {
      await expect(pool.connect(user).claimUserRefund()).to.be.revertedWith('Refund is not allowed');
    });

    it('revert: user has no investment', async function () {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('5'), { value: parseEther('5') });
      await time.increaseTo(endTime);
      await expect(pool.connect(user3).claimUserRefund()).to.be.revertedWith('User has not invested');
    });

    it('pass: user claim refund', async function () {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('5'), { value: parseEther('5') });
      await time.increaseTo(endTime);
      await pool.connect(user).claimUserRefund();
      let share = await pool.userInfo(user.address);
      expect(share[0]).to.be.equal(0);
    });
  });

  describe('after start sale test', function () {
    beforeEach(async () => {
      await deploySubscriptionPool();
      await time.increaseTo(startTime);
      await pool.connect(user).buyToken(parseEther('10'), { value: parseEther('10') });
    });

    it('revert: time cant set if sale already started', async function () {
      await expect(pool.setTime(startTime, endTime)).to.be.revertedWith('Sale already started');
    });

    it('revert: start time before time now ', async function () {
      await deploySubscriptionPool();
      await expect(pool.setTime((await time.latest()) - 1, endTime)).to.be.revertedWith('Invalid start time');
    });

    it('revert: start time should be less than end ', async function () {
      await deploySubscriptionPool();
      await expect(pool.setTime(endTime, startTime)).to.be.revertedWith('Invalid start time');
    });

    it('pass: set start and end time', async function () {
      await deploySubscriptionPool();
      await pool.setTime(startTime, endTime);
    });
  });

  describe('Invest with custom token', function () {
    beforeEach(async () => {
      await deploySubscriptionPool();
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(poolToken.address, parseEther('10'));
      await poolToken.connect(user).buyToken(parseEther('10'));
    });
    it.only('pass: deposit tokens and claim funds', async function () {
      await deploySubscriptionPool();
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(poolToken.address, parseEther('10'));
      await poolToken.connect(user).buyToken(parseEther('10'));
      let deposit = await poolToken.userInfo(user.address);
      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await poolToken.totalRaised()).to.be.equal(parseEther('10'));

      let before = await token2.balanceOf(owner.address);
      let before2 = await token2.balanceOf(user2.address);

      await poolToken.finalize();

      let after = await token2.balanceOf(owner.address);
      let after2 = await token2.balanceOf(user2.address);

      expect(after).to.be.equal(before.add(parseEther('3.61')));
      expect(after2).to.be.equal(before2.add(parseEther('.475')));
    });

    it('pass: deposit tokens and claim funds', async function () {
      let deposit = await poolToken.userInfo(user.address);

      expect(deposit[0]).to.be.equal(parseEther('10'));
      expect(await poolToken.totalRaised()).to.be.equal(parseEther('10'));

      let before = await token2.balanceOf(owner.address);
      let before2 = await token2.balanceOf(user2.address);

      await time.increaseTo(endTime);

      await poolToken.finalize();

      let after = await token2.balanceOf(owner.address);
      let after2 = await token2.balanceOf(user2.address);

      expect(after).to.be.equal(before.add(parseEther('1.805')));
      expect(after2).to.be.equal(before2.add(parseEther('.475')));
    });
  });

  describe('Sell tokens Not having 18 decimals test ', function () {
    beforeEach(async () => {
      await deploySubscriptionPool();
      await token2.mint(user.address, parseEther('10'));

      await time.increaseTo(startTime);
      await token2.connect(user).approve(fairLaunchDecimal.address, parseEther('10'));
      await fairLaunchDecimal.connect(user).buyToken(parseEther('10'), user2.address);
    });

    it('pass: deposit tokens and claim funds, tokens without Buyback', async function () {
      await deploySubscriptionPool();
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

      expect(after).to.be.equal(before.add(100000 * 10 ** 9));
    });

    it('pass: unlock Lp tokens ', async function () {
      await time.increaseTo(endTime);

      await fairLaunchDecimal.finalize();

      await time.increaseTo(endTime + 86500);

      await locker.unlock(1000000);
    });
  });
});
