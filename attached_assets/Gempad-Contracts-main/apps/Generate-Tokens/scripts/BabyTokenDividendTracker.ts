import { ethers } from 'hardhat';
import { parseEther } from 'ethers/lib/utils';

async function main() {
  const [owner] = await ethers.getSigners();
  const IterableMapping = await ethers.getContractFactory('IterableMapping');
  const iterableMapping = await IterableMapping.deploy();

  const BabyTokenDividendTracker = await ethers.getContractFactory('BabyTokenDividendTracker', {
    libraries: {
      IterableMapping: iterableMapping.address
    }
  });
  const dividendTracker = await BabyTokenDividendTracker.deploy();

  console.log('BabyTokenDividendTracker deployed: ', dividendTracker.address);
  //0x8eC6b5E5b244071244F978d7f12ba5a14E13B381
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
