import { ethers, run } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const [owner, user] = await ethers.getSigners();

  //   const TestToken = await ethers.getContractFactory('TestToken');
  //   const testToken = await TestToken.deploy();

  //   console.log('testToken deployed: ', testToken.address);

  const testTokenGoerli = '0x7BD270F74cE8964e4c41DecAFF07059aa6885F6e';
  const testTokenBsc = '0x755f088dC1811e3712f459E8e6939d241680A1D1';

  let antiBotGoerli = '0xF87fa195AB51b635E60Ed6F6C7B6d7F55D81AA4D';
  let antiBot = '0x16aCfa215a754F30c9084a4eF6fa7Db37eaCFBD4';

  let managerAddressGoerli = '0x8C81db60B98c28d270559B3C0A6f131eaad77318';
  let managerAddress = '0x1DA9730E3807C44d27443F7c43dcF5F90ad76a62';

  //Goerli Network

  //   const AntiBotBuybackBabyToken = await ethers.getContractFactory('AntiBotBuybackBabyToken');
  //   const token = await AntiBotBuybackBabyToken.deploy(
  //     owner.address,
  //     'BuybackBabyToken',
  //     'BBT',
  //     parseEther('100000'),
  //     // testToken.address,
  //     testTokenGoerli,
  //     '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  //     antiBotGoerli,
  //     [200, 300, 800, 100, 10000]
  //   );

  //   BSC Network

  const AntiBotBuybackBabyToken = await ethers.getContractFactory('AntiBotBuybackBabyToken');
  const token = await AntiBotBuybackBabyToken.deploy(
    owner.address,
    'BuybackBabyToken',
    'BBT',
    parseEther('100000'),
    '0x5E96fF318D0A306ddCea45e78E5000C0a6E8569C',
    '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
    antiBot,
    [200, 300, 800, 100, 10000],
    { value: parseEther('0.01') }
  );

  console.log('AntiBotBuybackBabyToken deployed: ', token.address);

  ///deploy StandardTokenFactory
  const AntibotBuyBackBabyTokenFactory = await ethers.getContractFactory('AntibotBuyBackBabyTokenFactory');
  const factory = await AntibotBuyBackBabyTokenFactory.deploy(managerAddress, token.address);

  console.log('AntibotBuyBackBabyTokenFactory deployed: ', factory.address);

  //   // await manager.addTokenFactory(factory.address);

  //   let newtoken = await factory.create(
  //     'BuybackBabyToken',
  //     'BBT',
  //     parseEther('100000'),
  //     testToken.address,
  //     '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  //     antiBot.address,
  //     [200, 300, 800, 100, 10000],
  //     { value: parseEther('0.01') }
  //   );

  //   console.log('new token ==>', newtoken);

  await run('verify:verify', {
    address: token.address,
    constructorArguments: [
      owner.address,
      'BuybackBabyToken',
      'BBT',
      parseEther('100000'),
      '0x5E96fF318D0A306ddCea45e78E5000C0a6E8569C',
      '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
      antiBot,
      [200, 300, 800, 100, 10000]
    ]
  });
  await run('verify:verify', {
    address: factory.address,
    constructorArguments: [managerAddress, token.address]
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
