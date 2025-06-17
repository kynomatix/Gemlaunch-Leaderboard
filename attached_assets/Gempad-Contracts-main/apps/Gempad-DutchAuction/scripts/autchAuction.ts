import hre, { ethers } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';
import { constants } from 'ethers';

async function main() {
  const [owner] = await ethers.getSigners();

  // const TestToken = await ethers.getContractFactory('TestToken');
  // const testoken = await TestToken.deploy();

  ///deploy dutch auction
  const GempadDutchAuction = await ethers.getContractFactory('GempadDutchAuction');
  const auction = await GempadDutchAuction.deploy();

  await auction.deployed();

  console.log('GempadDutchAuction deployed:', auction.address);

  ///deploy factory
  const GempadDutchAuctionFactory = await ethers.getContractFactory('GempadDutchAuctionFactory');
  const factory = await GempadDutchAuctionFactory.deploy(auction.address);

  await factory.deployed();
  console.log('factory deployed:', factory.address);

  await hre.run('verify:verify', {
    address: auction.address,
    constructorArguments: []
  });

  await hre.run('verify:verify', {
    address: factory.address,
    constructorArguments: [auction.address]
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
