import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { bytecode } from '../artifacts/contracts/GempadV1Factory.sol/GempadV1Pair.json';
import { expect } from 'chai';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

describe('exchange', function () {
  async function deployExchangeContracts() {
    const signers = await ethers.getSigners();
    const [owner, bob, alice, doctor] = signers;
    const Factory = await ethers.getContractFactory('GempadV1Factory');
    const factory = await Factory.deploy(owner.address);
    const WETH = await ethers.getContractFactory('WETH9');
    const weth = await WETH.deploy();

    const Router = await ethers.getContractFactory('GempadV1Router02');
    const router = await Router.deploy(factory.address, weth.address);
    const tokens = [];
    const Token = await ethers.getContractFactory('TestToken');
    for (let i = 0; i < 5; i++) {
      tokens[i] = await Token.deploy();
      await tokens[i].deployed();
    }
    return { owner, alice, bob, doctor, factory, weth, router, tokens };
  }
  async function deployExchangeContractsAndProvideLiquidity() {
    const data = await deployExchangeContracts();
    const { router, tokens, owner, factory, alice } = data;
    await factory.setFeeTo(alice.address);
    expect(await factory.feeTo()).to.equal(alice.address);
    expect(await tokens[0].approve(router.address, ethers.constants.MaxUint256)).to.be.ok;
    expect(await tokens[1].approve(router.address, ethers.constants.MaxUint256)).to.be.ok;
    expect(
      await router.addLiquidity(
        tokens[0].address,
        tokens[1].address,
        parseEther('1000000000'),
        parseEther('1000000000'),
        parseEther('10000'),
        parseEther('10000'),
        owner.address,
        ethers.constants.MaxUint256
      )
    ).to.be.ok;
    return data;
  }
  async function swapTokens() {
    const data = await loadFixture(deployExchangeContractsAndProvideLiquidity);
    const { tokens, factory, alice, router, owner, bob } = data;

    await router.swapExactTokensForTokens(
      parseUnits('1000'),
      0,
      [tokens[0].address, tokens[1].address],
      bob.address,
      ethers.constants.MaxUint256
    );
    expect(await tokens[1].balanceOf(bob.address)).equal('996999005991991025984');
    return data;
  }
  async function removeLiquidity() {
    const data = await swapTokens();
    const { tokens, router, owner, factory, doctor } = data;
    const pair = await factory.getPair(tokens[0].address, tokens[1].address);
    const pairContract = tokens[0].attach(pair);
    await pairContract.approve(router.address, ethers.constants.MaxUint256);
    const pairBalance = await pairContract.balanceOf(owner.address);
    expect(
      await router.removeLiquidity(
        tokens[0].address,
        tokens[1].address,
        pairBalance,
        0,
        0,
        doctor.address,
        ethers.constants.MaxUint256
      )
    ).to.be.ok;
    expect((await tokens[1].balanceOf(doctor.address)).toString()).equal('999999002550994906320128075');
    expect((await tokens[0].balanceOf(doctor.address)).toString()).equal('1000000999549999999662499337');
    return data;
  }
  it.only('should be able to set fee to ', async () => {
    const { factory, alice } = await loadFixture(deployExchangeContracts);
    await factory.setFeeTo(alice.address);
    expect(await factory.feeTo()).to.equal(alice.address);

    const hash = ethers.utils.keccak256(bytecode);
    console.log('hash here ===>', hash);
  });
  it.only('should provide liquidity ', async () => {
    const { tokens, router, owner } = await loadFixture(deployExchangeContractsAndProvideLiquidity);

    const amounts = await router.getAmountsOut(parseUnits('0.1'), [tokens[0].address, tokens[1].address]);
    expect(amounts[1].toString()).to.equal('99699999990059910');
  });
  it('should be able to swap tokens', async () => {
    await swapTokens();
  });
  it('should be able to remove liquidity ', async () => {
    await removeLiquidity();
  });
  it('fee to should be able to get fee', async () => {
    const { tokens, router, owner, bob, factory, alice } = await removeLiquidity();
    const pair = await factory.getPair(tokens[0].address, tokens[1].address);
    const PairContract = await ethers.getContractFactory('GempadV1Pair');
    const pairContract = PairContract.attach(pair);

    const pairBalance = (await pairContract.balanceOf(alice.address)).toString();
    expect(pairBalance).equal('449999550540448920');
  });
});
