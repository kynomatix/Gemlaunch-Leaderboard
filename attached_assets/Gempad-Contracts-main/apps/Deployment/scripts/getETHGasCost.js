const { default: axios } = require('axios');
const fs = require('fs');
const file = require('../contracts.json');
// One unit of gas is equal to 0.000000001 ETH
// https://www.linkedin.com/pulse/understanding-ethereum-gas-dmitry-ukhanov/

const chainId = 11155111; // sepolia-Testnet
let gasAmount;
let ethGasPrice;
let totalGasConsumed;
const unitInETH = 0.000000001;
async function getGasPrice() {
  try {
    const apiKey = process.env.ETHERSCAN_API_KEY;
    const url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.status === 200) {
      const gasPrice = {
        low: response.data.result.SafeGasPrice, // in wei
        medium: response.data.result.ProposeGasPrice, // in wei
        high: response.data.result.FastGasPrice // in wei
      };
      console.log('Current gas price (Wei):', gasPrice);
      return gasPrice;
    } else {
      console.error('Failed to fetch gas price:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Error fetching gas price:', error.message);
    return null;
  }
}

function getGasUsedByChainId(chainId) {
  const contracts = file.contracts;

  const gasUsedList = [];

  for (const contract of contracts) {
    if (contract.chainId === chainId) {
      gasUsedList.push(contract.gasUsed);
    }
  }
  totalGasConsumed = gasUsedList.reduce((acc, curr) => acc + parseInt(curr), 0);
  console.log(`Gas Used for Chain ID ${chainId}:`, gasUsedList);
  console.log(`OverAll Gas Consumed for Chain ID ${chainId}:`, totalGasConsumed);

  return totalGasConsumed;
}
async function estimateGas() {
  const gas = await getGasPrice();

  if (gas !== null) {
    const { low, medium, high } = gas;
    const gasConsume = getGasUsedByChainId(chainId);

    if (gasConsume !== null) {
      const gasAmountLow = parseFloat(low) * parseFloat(gasConsume);
      const gasAmountMedium = parseFloat(medium) * parseFloat(gasConsume);
      const gasAmountHigh = parseFloat(high) * parseFloat(gasConsume);

      console.log({
        lowGasPrice: parseFloat(low),
        mediumGasPrice: parseFloat(medium),
        highGasPrice: parseFloat(high),
        gasConsume,
        gasAmountLow,
        gasAmountMedium,
        gasAmountHigh
      });

      console.log(`Total Cost of Deployment (Low Gas Price): ${gasAmountLow * unitInETH} ETH`);
      console.log(`Total Cost of Deployment (Medium Gas Price): ${gasAmountMedium * unitInETH} ETH`);
      console.log(`Total Cost of Deployment (High Gas Price): ${gasAmountHigh * unitInETH} ETH`);
    } else {
      console.log('Failed to fetch gas consumption. Cannot estimate gas.');
    }
  } else {
    console.log('Failed to fetch gas price. Cannot estimate gas.');
  }
}
estimateGas();
