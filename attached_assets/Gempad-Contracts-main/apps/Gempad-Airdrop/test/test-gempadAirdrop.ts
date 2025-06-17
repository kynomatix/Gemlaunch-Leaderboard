import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs';
import { expect } from 'chai';
import { constants } from 'ethers';
import { ethers } from 'hardhat';
import BigNumber from 'bignumber.js';
import { parseEther, formatEther, parseUnits, formatUnits } from 'ethers/lib/utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ServiceReceiver, GempadAirdropFactory } from '../typechain-types';

describe('Gempad airdrop', function () {
  let owner: SignerWithAddress, user: SignerWithAddress, user1: SignerWithAddress, user2: SignerWithAddress;
  let user3: SignerWithAddress,
    user4: SignerWithAddress,
    user5: SignerWithAddress,
    feeReceiver: SignerWithAddress;
  let airdrop: any, airdrop2: any, token: any;
  let balanceBefore: any;
  let serviceFeeReceiver: ServiceReceiver;
  let tokenFee: number;
  let factory: GempadAirdropFactory;

  async function deployAirdrop() {
    [owner, user, user1, user2, user3, user4, user5, feeReceiver] = await ethers.getSigners();

    const TestToken = await ethers.getContractFactory('TestToken');
    token = await TestToken.deploy();

    const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
    serviceFeeReceiver = await ServiceReceiver.deploy();
    await serviceFeeReceiver.setFee('GempadAirdrop', 1e3);

    balanceBefore = parseInt((await ethers.provider.getBalance(serviceFeeReceiver.address)).toString());
    // feeReceiver = service.address;

    await serviceFeeReceiver.setPrice('GempadAirdrop', parseEther('1'));

    tokenFee = 1e3;
    const Airdrop = await ethers.getContractFactory('GempadAirdrop');
    const airdropContract = await Airdrop.deploy();
    await airdropContract.deployed();

    const GempadAirdropFactory = await ethers.getContractFactory('GempadAirdropFactory');
    factory = await GempadAirdropFactory.deploy(airdropContract.address);
    await factory.deployed();

    await factory.createGempadAirdrop(token.address, 'Airdrop', serviceFeeReceiver.address, {
      value: parseEther('1')
    });

    let imp = await factory.getAllGempadAirdrop();

    airdrop = new ethers.Contract(imp[0], airdropContract.interface, owner);

    await token.transfer(user1.address, parseEther('30000'));

    return airdrop;
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

  this.beforeEach(async () => {
    airdrop = await deployAirdrop();
  });

  describe('Pre-claim test', function () {
    it('pass: eth fee should be transfered to fee receiver', async function () {
      let balanceAfter = parseInt((await ethers.provider.getBalance(serviceFeeReceiver.address)).toString());
      let fee = parseInt(parseEther('1').toString());
      expect(balanceAfter).to.be.equal(balanceBefore + fee);
    });

    it('pass: Add Participants And Allocation', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let info = await airdrop.getClaimInfo(user.address);
      expect(info[1]).to.be.equal(parseEther('1000'));
    });

    it('pass: add of new participants apend array witout duplication', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      await airdrop.addParticipantsAndAllocation(
        [user.address, user3.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let info = await airdrop.getParticipants();
      expect(info.length).to.be.equal(3);
    });

    it('pass: adding participant shoudl update balance and total tokens', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      await airdrop.addParticipantsAndAllocation(
        [user.address, user3.address],
        [parseEther('500'), parseEther('2000')]
      );

      let info = await airdrop.getParticipants();
      let totalToken = await airdrop.totalTokens();
      expect(info.length).to.be.equal(3);
      expect(totalToken).to.be.equal(parseEther('4500'));
    });

    it('revert: airdrop status should not be active to add participants', async function () {
      await airdrop.cancelAirdrop();
      await expect(
        airdrop.addParticipantsAndAllocation(
          [user.address, user2.address],
          [parseEther('1000'), parseEther('2000')]
        )
      ).to.be.revertedWith('Airdrop must not be active');
    });

    it('revert: participants and values array length must be same', async function () {
      await expect(
        airdrop.addParticipantsAndAllocation([user.address, user2.address], [parseEther('1000')])
      ).to.be.revertedWith('Input arrays must have the same length');
    });

    it('revert: participants address cant be zero', async function () {
      await expect(
        airdrop.addParticipantsAndAllocation(
          [constants.AddressZero, user2.address],
          [parseEther('1000'), parseEther('2000')]
        )
      ).to.be.revertedWith('Invalid address');
    });

    it('revert: token value must be not zero', async function () {
      await expect(
        airdrop.addParticipantsAndAllocation(
          [user.address, user2.address],
          [parseEther('1000'), parseEther('00')]
        )
      ).to.be.revertedWith('Amount must be greater than zero');
    });

    it('pass: Set vesting information', async function () {
      let interval = 3600;
      await airdrop.setVestingInfo(40e3, 20e3, interval);
      let info = await airdrop.vestingInfo();
      expect(info.TGEPercent).to.be.equal(40e3);
      expect(info.cycleInterval).to.be.equal(interval);
    });

    it('revert: TGE percent must not be zero ', async function () {
      let interval = 3600;
      await expect(airdrop.setVestingInfo(0, 20e3, interval)).to.be.revertedWith(
        'TGE pecentage must be greater than zero'
      );
    });

    it('revert: cycle percent must not be zero ', async function () {
      let interval = 3600;
      await expect(airdrop.setVestingInfo(40e3, 0, interval)).to.be.revertedWith(
        'Cycle pecentage must be greater than zero'
      );
    });
    it('revert: TGE and all Cycle percentage combination must be equal to 100', async function () {
      let interval = 3600;
      await expect(airdrop.setVestingInfo(40e3, 70e3, interval)).to.be.revertedWith(
        'Sum of TGE and cycle should be less than 100'
      );
    });

    it('revert: interval must not be zero ', async function () {
      let interval = 0;
      await expect(airdrop.setVestingInfo(40e3, 20e3, interval)).to.be.revertedWith(
        'interval must be greater than zero'
      );
    });

    it('revert: Airdrop status must be pending ', async function () {
      await airdrop.cancelAirdrop();
      let interval = 600;
      await expect(airdrop.setVestingInfo(40e3, 20e3, interval)).to.be.revertedWith(
        'Airdrop must not be active'
      );
    });

    it('pass: remove Participants And Allocation', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );
      let info = await airdrop.getClaimInfo(user.address);
      let info2 = await airdrop.getClaimInfo(user2.address);
      expect(info[1]).to.be.equal(parseEther('1000'));
      expect(info2[1]).to.be.equal(parseEther('2000'));

      await airdrop.removeAllocations();
      info = await airdrop.getParticipants();
      info2 = await airdrop.totalTokens();
      expect(info.length).to.equal(0);
      expect(info2).to.equal(0);
    });

    it('pass: start airdrop without schedule', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );
      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;
      await token.approve(airdrop.address, parseEther('3030'));
      await airdrop.startAirdrop(await time.latest());

      let OwnerbalanceAfter = await token.balanceOf(owner.address);

      expect(OwnerbalanceAfter).to.be.equal(parseEther('966970'));

      let status = await airdrop.getCurrentStatus();
      expect(status).to.be.equal(1);
    });

    it('pass: start airdrop and set status and start schedule', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

      await token.approve(airdrop.address, parseEther('3030'));

      let timeNow = await time.latest();
      let startTime = timeNow + 600;

      await airdrop.startAirdrop(startTime);

      let OwnerbalanceAfter = await token.balanceOf(owner.address);

      expect(OwnerbalanceAfter).to.be.equal(parseEther('966970'));

      let status = await airdrop.getCurrentStatus();
      expect(status).to.be.equal(0);
    });

    it('pass: updated current status ', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

      await token.approve(airdrop.address, parseEther('3030'));

      let timeNow = await time.latest();
      let startTime = timeNow + 600;

      let statusPend = await airdrop.getCurrentStatus();
      expect(statusPend).to.be.equal(0);

      await airdrop.startAirdrop(startTime);

      let statusSc = await airdrop.getCurrentStatus();
      expect(statusSc).to.be.equal(0);

      await time.increaseTo(startTime);

      let status = await airdrop.getCurrentStatus();
      expect(status).to.be.equal(1);

      await airdrop.cancelAirdrop();

      let statusCan = await airdrop.getCurrentStatus();
      expect(statusCan).to.be.equal(2);
    });

    it('pass: start airdrop and status should be pending', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

      await token.approve(airdrop.address, parseEther('3030'));

      let timeNow = await time.latest();
      let startTime = timeNow + 600;
      await airdrop.startAirdrop(startTime);

      let OwnerbalanceAfter = await token.balanceOf(owner.address);

      expect(OwnerbalanceAfter).to.be.equal(parseEther('966970'));

      let status = await airdrop.getCurrentStatus();
      expect(status).to.be.equal(0);
    });

    it('revert: airdrop should be in pending state to start', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

      await token.approve(airdrop.address, parseEther('3030'));
      await airdrop.startAirdrop(await time.latest());

      await expect(airdrop.startAirdrop(await time.latest())).to.be.revertedWith(
        'Airdrop must not be active'
      );
    });

    it('revert: Owner should have enough tokens to start ', async function () {
      await token.transfer(user5.address, parseEther('960000'));
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('10000'), parseEther('20000')]
      );

      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

      await token.approve(airdrop.address, parseEther('30300'));
      await expect(airdrop.startAirdrop(0)).to.be.revertedWith('Insufficient Tokens Balance');
    });

    it('revert: cancel airdrop ', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

      await token.approve(airdrop.address, parseEther('3030'));
      await airdrop.startAirdrop(0);

      await airdrop.cancelAirdrop();
      let ownerBalanceAfter = await token.balanceOf(owner.address);
      let status = await airdrop.getCurrentStatus();

      expect(ownerBalanceAfter).to.be.equal(parseEther('970000'));
      expect(status).to.be.equal(2);
    });

    it('revert: start airdrop after remove allocations ', async function () {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );
      await airdrop.removeAllocations();
      await token.approve(airdrop.address, parseEther('3030'));
      await expect(airdrop.startAirdrop(0)).to.be.revertedWith(
        'Airdrop participants must be greater than zero'
      );
    });
  });

  describe('claim airdrop tokens test', function () {
    let startTime: number, interval: number;
    let vestingInfo: any;
    this.beforeEach(async () => {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );
      interval = 3600;
      await airdrop.setVestingInfo(40e3, 30e3, interval);

      await token.approve(airdrop.address, parseEther('3030'));
      let timenNow = await time.latest();
      startTime = timenNow + 3600;

      await airdrop.startAirdrop(startTime);
      vestingInfo = await airdrop.vestingInfo();
    });

    it('revert: Token distribution must be started', async function () {
      await expect(airdrop.connect(user).claimTokens()).to.be.revertedWith(
        "Token distribution hasn't started"
      );
    });
    it('revert: tokens must be allocated to user', async function () {
      await time.increaseTo(startTime);
      await expect(airdrop.connect(user3).claimTokens()).to.be.revertedWith('User has no token allocation');
    });

    describe('start claim TGE tokens', function () {
      let userAllocation: any, tgeShare: any;
      let user2Allocation: any, user2tgeShare: any;
      this.beforeEach(async () => {
        await time.increaseTo(startTime);
        await airdrop.connect(user).claimTokens();
        await airdrop.connect(user2).claimTokens();

        userAllocation = formatEther(await airdrop.getUserAllocation(user.address));
        user2Allocation = formatEther(await airdrop.getUserAllocation(user2.address));
        tgeShare = ((userAllocation as any) * vestingInfo.TGEPercent) / 100e3;
        user2tgeShare = ((user2Allocation as any) * vestingInfo.TGEPercent) / 100e3;
      });
      it('pass: fee tokens should be transfered to fee receiver', async function () {
        let fee = ((await airdrop.totalTokens()) * tokenFee) / 100e3;

        let feeReceiverbalanceAfter = await token.balanceOf(serviceFeeReceiver.address);

        let balanceAfter = await token.balanceOf(user.address);
        let balanceAfter2 = await token.balanceOf(user2.address);
        expect(balanceAfter).to.be.equal(parseEther(tgeShare.toString()));
        expect(balanceAfter2).to.be.equal(parseEther(user2tgeShare.toString()));
        expect(feeReceiverbalanceAfter).to.be.equal(parseEther('12'));
      });

      it('pass: TGE tokens should be transfered', async function () {
        let balanceAfter = await token.balanceOf(user.address);
        expect(balanceAfter).to.be.equal(parseEther(tgeShare.toString()));
      });
      it('pass: total claimed should equal to TGE', async function () {
        let claimed = await airdrop.totalClaimedTokens();
        expect(claimed).to.be.equal(parseEther('1200'));
      });
      it('pass: user claimed should equal to TGE claimed', async function () {
        let userclaimed = await airdrop.getClaimedAmount(user.address);
        expect(userclaimed).to.be.equal(parseEther(tgeShare.toString()));
      });
      it('pass: user remaing claimable tokens', async function () {
        let remaining = await airdrop.getRemainingClaimabaleAmount(user.address);
        let remaining2 = await airdrop.getRemainingClaimabaleAmount(user2.address);
        expect(remaining).to.be.equal(parseEther(((userAllocation as bigint) - tgeShare).toString()));
        expect(remaining2).to.be.equal(parseEther(((user2Allocation as bigint) - user2tgeShare).toString()));
      });
      it('revert: cycle token cannot be claimed before interval', async function () {
        await expect(airdrop.connect(user).claimTokens()).to.be.revertedWith('Tokens are not unlocked');
        await expect(airdrop.connect(user2).claimTokens()).to.be.revertedWith('Tokens are not unlocked');
      });

      describe('start claim Initial Cycle tokens', function () {
        let cycleShare: any;
        let cycleShare2: any;
        let getClaimInfo: any;
        let user2Info: any;
        this.beforeEach(async () => {
          getClaimInfo = await airdrop.getClaimInfo(user.address);
          user2Info = await airdrop.getClaimInfo(user2.address);
          await time.increaseTo(parseInt(getClaimInfo.lastClaimTime) + interval);
          await time.increaseTo(parseInt(user2Info.lastClaimTime) + interval);
          await airdrop.connect(user).claimTokens();
          await airdrop.connect(user2).claimTokens();
          getClaimInfo = await airdrop.getClaimInfo(user.address);
          user2Info = await airdrop.getClaimInfo(user2.address);
          // let remainingclaimabale = userAllocation - tgeShare;
          cycleShare = ((userAllocation as any) * vestingInfo.cyclePercent) / 100e3;
          cycleShare2 = ((user2Allocation as any) * vestingInfo.cyclePercent) / 100e3;
        });

        it('pass: Cycele tokens should be transfered', async function () {
          let balanceAfter = await token.balanceOf(user.address);
          let balanceAfter2 = await token.balanceOf(user2.address);
          expect(balanceAfter).to.be.equal(parseEther((tgeShare + cycleShare).toString()));
          expect(balanceAfter2).to.be.equal(parseEther((user2tgeShare + cycleShare2).toString()));
        });
        it('pass: total claimed should equal to TGE + 1st cycle share', async function () {
          let claimed = await airdrop.totalClaimedTokens();
          expect(claimed).to.be.equal(parseEther('2100'));
        });
        it('pass: user claimed should equal to TGE claimed plus 1st cycle claim', async function () {
          expect(getClaimInfo.claimed).to.be.equal(parseEther((tgeShare + cycleShare).toString()));

          expect(getClaimInfo.claimed).to.be.equal(parseEther((tgeShare + cycleShare).toString()));
          expect(user2Info.claimed).to.be.equal(parseEther((user2tgeShare + cycleShare2).toString()));
        });
        it('pass: user remaing claimable tokens', async function () {
          let remaining = await airdrop.getRemainingClaimabaleAmount(user.address);
          let remaining2 = await airdrop.getRemainingClaimabaleAmount(user2.address);
          expect(remaining).to.be.equal(
            parseEther(((userAllocation as bigint) - (tgeShare + cycleShare)).toString())
          );
          expect(remaining2).to.be.equal(
            parseEther(((user2Allocation as bigint) - (user2tgeShare + cycleShare2)).toString())
          );
        });
        it('revert: next cycle claim should not be claimed', async function () {
          await expect(airdrop.connect(user).claimTokens()).to.be.revertedWith('Tokens are not unlocked');
          await expect(airdrop.connect(user2).claimTokens()).to.be.revertedWith('Tokens are not unlocked');
        });

        describe('claim final Cycle tokens', function () {
          let cycleShare: any;
          let userData: any;
          let userData2: any;
          this.beforeEach(async () => {
            // let lastclaimeTime = parseInt(await airdrop.lastClaimTime());
            let getClaimInfo = await airdrop.getClaimInfo(user.address);
            let getClaimInfo2 = await airdrop.getClaimInfo(user2.address);
            await time.increaseTo(parseInt(getClaimInfo.lastClaimTime) + interval);
            await time.increaseTo(parseInt(getClaimInfo2.lastClaimTime) + interval);
            await airdrop.connect(user).claimTokens();
            await airdrop.connect(user2).claimTokens();
            userData = await airdrop.getClaimInfo(user.address);
            userData2 = await airdrop.getClaimInfo(user2.address);
            // let remainingclaimabale = userAllocation - tgeShare;
            cycleShare = ((userAllocation as any) * vestingInfo.cyclePercent) / 100e3;
            cycleShare2 = ((user2Allocation as any) * vestingInfo.cyclePercent) / 100e3;
          });

          it('pass: final Cycele tokens should be transfered', async function () {
            let balanceAfter = await token.balanceOf(user.address);
            let balanceAfter2 = await token.balanceOf(user2.address);
            expect(balanceAfter).to.be.equal(parseEther((tgeShare + cycleShare + cycleShare).toString()));
            expect(balanceAfter2).to.be.equal(
              parseEther((user2tgeShare + cycleShare2 + cycleShare2).toString())
            );
            expect(balanceAfter2).to.be.equal(parseEther('2000'));
            let status = await airdrop.getCurrentStatus();
            expect(status).to.be.equal(1);
          });
          it('pass: total claimed token should equal to user total claimed', async function () {
            let claimed = await airdrop.totalClaimedTokens();
            // let userclaimed = await airdrop.getclaimed(user.address);
            expect(claimed).to.be.equal(parseEther('3000'));
          });
          it('pass: total user token should be claimed', async function () {
            // let userclaimed = await airdrop.getclaimed(user.address);
            expect(userData.claimed).to.be.equal(parseEther((tgeShare + cycleShare + cycleShare).toString()));
            expect(userData2.claimed).to.be.equal(
              parseEther((user2tgeShare + cycleShare2 + cycleShare2).toString())
            );
          });
          it('pass: user remaing claimable tokens should be zero', async function () {
            let remaining = await airdrop.getRemainingClaimabaleAmount(user.address);

            expect(remaining).to.be.equal(0);
          });
        });
      });
    });
  });

  describe('combine claim test', function () {
    let startTime: number, interval: number;
    let vestingInfo: any;
    let drop: any;
    this.beforeEach(async () => {
      drop = await deployAirdrop();

      await drop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );
      interval = 3600;
      await drop.setVestingInfo(40e3, 25e3, interval);

      await token.approve(drop.address, parseEther('3030'));
      let timenNow = await time.latest();
      startTime = timenNow + 3600;

      await drop.startAirdrop(startTime);
      vestingInfo = await drop.vestingInfo();
    });

    it('pass: claim all tokens', async function () {
      expect(await drop.getCurrentStatus()).to.be.equal(0);

      await time.increaseTo(startTime + interval * interval + interval);

      expect(await drop.getCurrentStatus()).to.be.equal(1);

      let before = await token.balanceOf(user.address);
      let before2 = await token.balanceOf(user2.address);

      await drop.connect(user).claimTokens();
      await drop.connect(user2).claimTokens();

      expect(await token.balanceOf(user.address)).to.equal(before.add(parseEther('1000')));
      expect(await token.balanceOf(user2.address)).to.equal(before.add(parseEther('2000')));
    });

    it('pass: claim all tokens with cycles', async function () {
      expect(await drop.getCurrentStatus()).to.be.equal(0);

      await time.increaseTo(startTime + interval);

      expect(await drop.getCurrentStatus()).to.be.equal(1);

      let before = await token.balanceOf(user.address);
      let before2 = await token.balanceOf(user2.address);

      await drop.connect(user).claimTokens();
      await drop.connect(user2).claimTokens();

      expect(await token.balanceOf(user.address)).to.equal(before.add(parseEther('650')));
      expect(await token.balanceOf(user2.address)).to.equal(before.add(parseEther('1300')));

      await time.increaseTo(startTime + interval * 2);
      await drop.connect(user).claimTokens();
      await drop.connect(user2).claimTokens();

      //one cycle tokens 250 and 300 claim
      expect(await token.balanceOf(user.address)).to.equal(before.add(parseEther('900')));
      expect(await token.balanceOf(user2.address)).to.equal(before.add(parseEther('1800')));

      await expect(drop.connect(user2).claimTokens()).to.be.revertedWith('Tokens are not unlocked');

      await time.increaseTo(startTime + interval * 10);

      await drop.connect(user).claimTokens();
      await drop.connect(user2).claimTokens();

      //remaing amount tokend 100and 200 claim
      expect(await token.balanceOf(user.address)).to.equal(before.add(parseEther('1000')));
      expect(await token.balanceOf(user2.address)).to.equal(before.add(parseEther('2000')));
    });

    it('claim without vesting', async () => {
      let drop = await deployAirdrop();

      await drop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      await token.approve(drop.address, parseEther('3030'));
      let timenNow = await time.latest();
      let startTime = timenNow + 3600;

      await drop.startAirdrop(startTime);
      await time.increaseTo(startTime);

      let before = await token.balanceOf(user.address);
      let before2 = await token.balanceOf(user2.address);

      await drop.connect(user).claimTokens();
      await drop.connect(user2).claimTokens();

      expect(await token.balanceOf(user.address)).to.equal(before.add(parseEther('1000')));
      expect(await token.balanceOf(user2.address)).to.equal(before.add(parseEther('2000')));
    });
  });

  describe('claim tokens after multi cycle pass without claim', function () {
    let startTime: number, interval: number;
    let vestingInfo: any;
    let cycleShare: any, tgeShare: any;
    let cycleShare2: any, tgeShare2: any;
    let lastclaimeTime: any;
    let lastclaimeTime2: any;
    this.beforeEach(async () => {
      await airdrop.addParticipantsAndAllocation(
        [user.address, user2.address, user3.address],
        [parseEther('1000'), parseEther('2000'), parseEther('1000')]
      );
      interval = 3600;
      await airdrop.setVestingInfo(40e3, 20e3, interval);

      await token.approve(airdrop.address, parseEther('4040'));
      let timenNow = await time.latest();
      startTime = timenNow + 3600;

      await airdrop.startAirdrop(startTime);
      let userData = await airdrop.getClaimInfo(user.address);
      let userData2 = await airdrop.getClaimInfo(user2.address);
      vestingInfo = await airdrop.vestingInfo();

      cycleShare = ((userData.userAllocation as any) * vestingInfo.cyclePercent) / 100e3;
      cycleShare2 = ((userData2.userAllocation as any) * vestingInfo.cyclePercent) / 100e3;
      tgeShare = ((userData.userAllocation as any) * vestingInfo.TGEPercent) / 100e3;
      tgeShare2 = ((userData2.userAllocation as any) * vestingInfo.TGEPercent) / 100e3;
      await time.increaseTo(startTime);
      await airdrop.connect(user).claimTokens();
      await airdrop.connect(user2).claimTokens();
      lastclaimeTime = parseInt(userData.lastClaimTime);
      lastclaimeTime2 = parseInt(userData2.lastClaimTime);
    });

    it('pass: token equal to two cycles should be claimed', async function () {
      await time.increaseTo(startTime + interval + interval);
      await airdrop.connect(user).claimTokens();
      await airdrop.connect(user2).claimTokens();
      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(parseEther('800'));
      expect(balanceAfter2).to.be.equal(parseEther('1600'));
    });
    it('pass: token equal to all cycles should be claimed', async function () {
      await time.increaseTo(startTime + interval + interval + interval);
      await airdrop.connect(user).claimTokens();
      await airdrop.connect(user2).claimTokens();
      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);

      expect(balanceAfter).to.be.equal(parseEther('1000'));
      expect(balanceAfter2).to.be.equal(parseEther('2000'));
    });
    it('pass: only allocated should be claimed after long time pass', async function () {
      await time.increaseTo(startTime + interval * 5);
      await airdrop.connect(user).claimTokens();
      await airdrop.connect(user2).claimTokens();
      let balanceAfter = await token.balanceOf(user.address);
      let balanceAfter2 = await token.balanceOf(user2.address);
      let remaining = await airdrop.getRemainingClaimabaleAmount(user.address);
      let remaining2 = await airdrop.getRemainingClaimabaleAmount(user2.address);

      expect(balanceAfter).to.be.equal(parseEther('1000'));
      expect(balanceAfter2).to.be.equal(parseEther('2000'));
      expect(remaining).to.be.equal(0);
      expect(remaining2).to.be.equal(0);
    });
    it('revert: All tokens have been claimed ', async function () {
      await time.increaseTo(startTime + interval * 5);
      await airdrop.connect(user).claimTokens();
      await airdrop.connect(user2).claimTokens();
      await time.increaseTo(startTime + interval * 7);
      await expect(airdrop.connect(user).claimTokens()).to.be.revertedWith('User has no token to claim');
      await expect(airdrop.connect(user2).claimTokens()).to.be.revertedWith('User has no token to claim');
    });
    it('pass: Tge token of user 3  ', async function () {
      await time.increaseTo(startTime + interval * 5);
      await airdrop.connect(user).claimTokens();
      await airdrop.connect(user3).claimTokens();
      await time.increaseTo(startTime + interval * 7);
      let balanceAfter3 = await token.balanceOf(user3.address);
      let remaining3 = await airdrop.getRemainingClaimabaleAmount(user3.address);

      expect(balanceAfter3).to.be.equal(parseEther('1000'));
      expect(remaining3).to.be.equal(parseEther('0'));
      await expect(airdrop.connect(user).claimTokens()).to.be.revertedWith('User has no token to claim');
    });
  });

  describe('Add participanst after removing', function () {
    let startTime: number, interval: number;
    let vestingInfo: any;
    let drop: any;
    this.beforeEach(async () => {
      drop = await deployAirdrop();

      await drop.addParticipantsAndAllocation(
        [user.address, user2.address],
        [parseEther('1000'), parseEther('2000')]
      );

      await token.approve(drop.address, parseEther('3030'));
      let timenNow = await time.latest();
      startTime = timenNow + 3600;

      // await drop.startAirdrop(startTime);
    });

    it('pass: remove all participants', async function () {
      await drop.removeAllocations();
      let partci = await drop.getParticipants();
      expect(partci.length).to.equal(0);
    });

    it('pass: add after remove should replace the amount and user', async function () {
      await drop.removeAllocations();
      await drop.addParticipantsAndAllocation(
        [user.address, user2.address, user3.address],
        [parseEther('1000'), parseEther('1000'), parseEther('1000')]
      );
      let partci = await drop.getParticipants();
      let data = await drop.getClaimInfo(user2.address);
      expect(partci.length).to.equal(3);
      expect(data[1]).to.equal(parseEther('1000'));
    });

    it('pass: adding without remobe should append the participanst array', async function () {
      await drop.addParticipantsAndAllocation(
        [user.address, user2.address, user3.address],
        [parseEther('1000'), parseEther('1000'), parseEther('1000')]
      );
      let partci = await drop.getParticipants();
      let data = await drop.totalTokens();
      expect(partci.length).to.equal(3);
      expect(data).to.equal(parseEther('3000'));
    });
  });

  describe.skip('Estimate gas cost and max users', () => {
    let usersArray: string[], numbersArray: any[];
    it('pass: added user batch', async function () {
      usersArray = getUserAddressArray(400);
      numbersArray = getRandomNumberArray(400, 100, 1000);

      await airdrop.addParticipantsAndAllocation(usersArray, numbersArray);
      await airdrop.addParticipantsAndAllocation(usersArray, numbersArray);
      let info = await airdrop.getParticipants();
      expect(info.length).to.be.equal(400);

      const gasUsed = await airdrop.estimateGas.addParticipantsAndAllocation(usersArray, numbersArray, {
        gasLimit: 30000000
      });
      expect(gasUsed).to.be.lessThan(30000000);
    });
  });
});
