const fs = require('fs');

// const goerliDeployments = `${__dirname}/../deployments/goerli`;
// const sepoliaDeployment = `${__dirname}/../deployments/sepolia`;
// const fantomTestnetDeployment = `${__dirname}/../deployments/fantom`;
const bscTestnetDeployment = `${__dirname}/../deployments/bscTestnet`;

// console.log({ goerliDeployments });

const networkDeploymentPaths = [
  // goerliDeployments,
  // sepoliaDeployment,
  // fantomTestnetDeployment,
  bscTestnetDeployment
];

const CURRENT_VERSION = {
  major: 1,
  minor: 1,
  patch: 0
};

const contractList = {
  name: 'Testnet Contract Deployment Details',
  version: CURRENT_VERSION,
  tags: {},
  contracts: []
};

const formatContract = (chainId, contractName, deploymentBlob) => {
  const regex = /V[1-9+]((.[0-9+]){0,2})$/g;
  const version = contractName.match(regex)?.[0]?.slice(1).split('.') || [1, 0, 0];
  const type = contractName.split(regex)[0];

  return {
    chainId,
    address: deploymentBlob.address,
    version: {
      major: Number(version[0]),
      minor: Number(version[1]) || 0,
      patch: Number(version[2]) || 0
    },
    gasUsed: deploymentBlob.receipt.gasUsed,
    cumulativeGasUsed: deploymentBlob.receipt.cumulativeGasUsed,
    type: type,
    abi: deploymentBlob.abi,
    tags: [],
    extensions: {}
  };
};

networkDeploymentPaths.forEach((networkDeploymentPath) => {
  const contractDeploymentPaths = fs
    .readdirSync(networkDeploymentPath)
    .filter((path) => path.endsWith('.json'));
  const chainId = Number(fs.readFileSync(`${networkDeploymentPath}/.chainId`, 'utf8'));

  contractDeploymentPaths.forEach((contractDeploymentFileName) => {
    const contractName = contractDeploymentFileName.split('.')[0];
    const contractDeployment = JSON.parse(
      fs.readFileSync(`${networkDeploymentPath}/${contractDeploymentFileName}`, 'utf8')
    );
    contractList.contracts.push(formatContract(chainId, contractName, contractDeployment));
  });
});

console.log({ __dirname });
fs.writeFile(`${__dirname}/../contracts.json`, JSON.stringify(contractList), (err) => {
  if (err) {
    console.error(err);
    return;
  }
});
