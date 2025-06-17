const { default: axios } = require('axios');
const fs = require('fs');
const file = require('../contracts.json');

// One unit of gas is equal to 0.000000001 BNB
// https://support.bitcoin.com/en/articles/7894845-bnb-fees
const chainId = 56; // BSC-Testnet
let totalGasConsumed;
let bnbGasPrice;
let gasAmount;
const unitInBNB = 0.000000001;
const apiKey = process.env.BSC_API_KEY;

async function getGasPrice() {
  try {
    const url = `https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;

    const response = await axios.get(url);

    if (response.status === 200) {
      const gasPrice = response.data.result.ProposeGasPrice;
      console.log('Current gas price:', gasPrice);
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
  // Fetch gas price and wait for the response
  const gas = await getGasPrice();

  // Only proceed if gas price was fetched successfully
  if (gas !== null) {
    bnbGasPrice = gas;
    // bnbGasPrice = 35;

    const gasConsume = getGasUsedByChainId(chainId);

    gasAmount = parseFloat(bnbGasPrice) * parseFloat(gasConsume);

    console.log({
      bnbGasPrice,
      gasConsume,
      unitInBNB,
      gasAmount,
      totalGas: gasAmount * unitInBNB
    });
    console.log(`total Cost of Deployment ${gasAmount * unitInBNB} BNB`);
  } else {
    console.log('Failed to fetch gas price. Cannot estimate gas.');
  }
}

estimateGas();
