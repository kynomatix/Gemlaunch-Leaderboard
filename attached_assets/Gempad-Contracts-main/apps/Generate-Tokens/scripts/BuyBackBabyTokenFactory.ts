import { ethers, run } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const [owner, user] = await ethers.getSigners();

  // /goerli chain

  const BuybackBabyToken = await ethers.getContractFactory('BuybackBabyToken');
  const token = await BuybackBabyToken.deploy(
    owner.address,
    'BuybackBabyToken',
    'BBT',
    parseEther('100000'),
    '0x0ae91CA2F067495a08FEa32a8800347adB3B1953',
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    [200, 300, 800, 100, 10000],
    {
      value: parseEther('0.01'),
      gasLimit: 3000000,
    }
  );

  // bsc chain

  // const BuybackBabyToken = await ethers.getContractFactory('BuybackBabyToken');
  // const token = await BuybackBabyToken.deploy(
  //   owner.address,
  //   'BuybackBabyToken',
  //   'BBT',
  //   parseEther('100000'),
  //   '0x6a0454a31E591B94BaA839996EDb35090bEb7A19',
  //   '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
  //   [200, 300, 800, 100, 10000],
  //   { value: parseEther('0.01') }
  // );

  console.log('BuybackBabyToken deployed: ', token.address);

  let managerAddressGoerli = '0x8C81db60B98c28d270559B3C0A6f131eaad77318';
  let managerAddressBSC = '0x2904aC36f5f63ABb1DaFd95FB3182bfedBFD8424';

  ///deploy StandardTokenFactory
  const BuyBackBabyTokenFactory = await ethers.getContractFactory('BuyBackBabyTokenFactory');
  const factory = await BuyBackBabyTokenFactory.deploy(managerAddressBSC, token.address);

  console.log('BuyBackBabyTokenFactory deployed: ', factory.address);

  await run('verify:verify', {
    address: '0xf97AB51D76c768620B1199FAf86A5732011CAB11',
    constructorArguments: [
      owner.address,
      'BuybackBabyToken',
      'BBT',
      parseEther('100000'),
      '0x6a0454a31E591B94BaA839996EDb35090bEb7A19',
      '0xe0286F994749c7eE1d6eBEA97782C5FB08B6b918',
      [200, 300, 800, 100, 10000]
    ]
  });

  console.log('buyback token verified...');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
