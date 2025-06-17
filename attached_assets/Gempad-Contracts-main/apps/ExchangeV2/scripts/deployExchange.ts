import { ethers, run } from 'hardhat';
import { parseEther, formatEther } from 'ethers/lib/utils';

import { bytecode } from '../artifacts/contracts/GempadV2Factory.sol/GempadV2Pair.json';

async function main() {
  const [owner, user, user2] = await ethers.getSigners();


  // 1.deploy factory and verify it 
  // 2. get initcodehash from factory pass it to router(library) and then compile the contracts
  // 3. deploy router to the blockchain

  // const Factory = await ethers.getContractFactory('GempadV2Factory');
  // const factoryV2 = await Factory.deploy(owner.address);
  // console.log(owner.getAddress);



  // console.log('GempadV2 Factory deployed:', factoryV2.address);

  // let inItCode = ethers.utils.keccak256(bytecode);
  // console.log('init hash code', inItCode);
  // // /ce3df20814eb6fe7d396528974c64609a2be9e39bc353ff1ee44baba0d87b80a

  // const WETH = await ethers.getContractFactory('WETH9');
  // const weth = await WETH.deploy();

  // console.log('Weth deployed:', weth.address);

  const Router = await ethers.getContractFactory('GempadV2Router02');
  // const router = await Router.deploy(factoryV2.address, weth.address);

  const router = await Router.deploy('0xB0eF3b7e8F46792e5703dc0a0149927A1BB2D3E4', '0x72E13834ad80233eA603A7E6858Aa55B052e3569');

  console.log('GempadV2 Router deployed:', router.address);


  console.log("Contract Deployment")


  // await run('verify:verify', {
  //   address: factoryV2.address,
  //   constructorArguments: [owner.address],
  // });


  await run('verify:verify', {
    address: router.address,
    constructorArguments: ['0xB0eF3b7e8F46792e5703dc0a0149927A1BB2D3E4', '0x72E13834ad80233eA603A7E6858Aa55B052e3569'],
  });

  // await run('verify:verify', {
  //   address: weth.address,
  //   constructorArguments: [],
  // });

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
