import hre, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants } from 'ethers';

async function main() {
  const [owner] = await ethers.getSigners();
  const currentTime = Math.round(Date.now() / 1000);
  const startTime = currentTime + 3600;
  const endTime = startTime + 84600;

  let params = {
    name: 'Gempad Private Sale',
    softCap: parseEther('1000'),
    hardCap: parseEther('2000'),
    minBuyLimit: parseEther('0.1'),
    maxBuyLimit: parseEther('1'),
    startTime: startTime,
    endTime: endTime,
    finalizeTime: 0,
    publicSaleTime: 0
  };
  let vestingParams = {
    initialRelease: 40e3,
    cyclePercent: 30e3,
    cycleInterval: 3600
  };

  // const ServiceReceiver = await ethers.getContractFactory('ServiceReceiver');
  // const serviceFeeReceiver = await ServiceReceiver.deploy();

  let ServiceReceiver = '0x8D9AC9f8d13586D0683B745bd8943F35c49CAB1e';

  // await serviceFeeReceiver.setPrice('GempadPrivateSale', parseEther('1'));

  // console.log('service receiver deployed:', serviceFeeReceiver.address);

  const GempadPrivatesale = await ethers.getContractFactory('GempadPrivateSale');
  const sale = await GempadPrivatesale.deploy();

  await sale.deployed();

  console.log('Private Sale deployed at:', sale.address);

  const GempadPrivateSaleFactory = await ethers.getContractFactory('GempadPrivateSaleFactory');
  const factory = await GempadPrivateSaleFactory.deploy(sale.address);

  await factory.deployed();

  console.log('factory deployed at:', factory.address);

  // /verify smart contract
  await hre.run('verify:verify', {
    address: sale.address,
    constructorArguments: []
  });

  await hre.run('verify:verify', {
    address: factory.address,
    constructorArguments: [sale.address]
  });

  //   await factory.createPrivateSale(
  //     params,
  //     vestingParams,
  //     0,
  //     serviceFeeReceiver.address,
  //     constants.AddressZero
  //     { value: parseEther('1') }
  //   )

  //   let sales = await factory.getAllPrivateSales();
  //   let userSales = await factory.getUserPrivateSales(owner.address);
  //   console.log("private sale ==>", sales[0]);
  //   console.log("private sale ==>", userSales[0]);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
