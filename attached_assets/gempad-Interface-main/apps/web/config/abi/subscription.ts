export const SubscriptionABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'Id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'enum GempadSubscriptionPool.Status',
                name: 'status',
                type: 'uint8',
            },
        ],
        name: 'Cancelled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'Id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'finzlizeTime',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'enum GempadSubscriptionPool.Status',
                name: 'status',
                type: 'uint8',
            },
        ],
        name: 'Finalized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'uint8',
                name: 'version',
                type: 'uint8',
            },
        ],
        name: 'Initialized',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'Id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'time',
                type: 'uint256',
            },
        ],
        name: 'PublicSaleEnabled',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'Id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'Purchased',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'Id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'start',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'end',
                type: 'uint256',
            },
        ],
        name: 'UpdateTime',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address[]',
                name: 'account',
                type: 'address[]',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'WhitelistUpdated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'Id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'pair',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'liquidity',
                type: 'uint256',
            },
        ],
        name: 'liquidityAdded',
        type: 'event',
    },
    {
        inputs: [],
        name: 'Id',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_id',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'contract IERC20Extented',
                        name: 'token',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'hardCap',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'softCap',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'userHardCap',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'sellRate',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'listingRate',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'startTime',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'endTime',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'finalizeTime',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'publicSaleTime',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct GempadSubscriptionPool.SubscriptionPoolDetails',
                name: 'info',
                type: 'tuple',
            },
            {
                components: [
                    {
                        internalType: 'contract IUniswapV2Router02',
                        name: 'router',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'liquidityPercent',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lockTime',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'locker',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'liquidityAdded',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct GempadSubscriptionPool.LiquidityDetails',
                name: '_liquidity',
                type: 'tuple',
            },
            {
                internalType: 'address',
                name: '_fundToken',
                type: 'address',
            },
            {
                internalType: 'bool',
                name: '_isPrivateMode',
                type: 'bool',
            },
            {
                internalType: 'bool',
                name: '_isRefund',
                type: 'bool',
            },
            {
                internalType: 'address payable',
                name: '_feeReceiver',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: '__GempadSubscriptionPool_init',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address payable',
                name: 'receiver',
                type: 'address',
            },
            {
                internalType: 'string',
                name: 'serviceName',
                type: 'string',
            },
        ],
        name: '__ServicePayer_init',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_participants',
                type: 'address[]',
            },
        ],
        name: 'addWhitelist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_amount',
                type: 'uint256',
            },
        ],
        name: 'buyToken',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_totalTokens',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_totalFunds',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: '_contributors',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: '_amounts',
                type: 'uint256[]',
            },
        ],
        name: 'calculateShare',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'canCalculate',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'canFinalize',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'cancel',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimTokens',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'claimUserRefund',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'currentStatus',
        outputs: [
            {
                internalType: 'enum GempadSubscriptionPool.Status',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_startTime',
                type: 'uint256',
            },
        ],
        name: 'enablePublicSale',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'finalize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fundByTokens',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'fundToken',
        outputs: [
            {
                internalType: 'contract IERC20Extented',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getAllInvestors',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getCurrentMode',
        outputs: [
            {
                internalType: 'enum GempadSubscriptionPool.Mode',
                name: 'mode',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getCurrentStatus',
        outputs: [
            {
                internalType: 'enum GempadSubscriptionPool.Status',
                name: 'status',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getDistribution',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getSurplusData',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'totalAllocated',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'surplusTokens',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalSurplusFunds',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address[]',
                        name: 'leftInvestors',
                        type: 'address[]',
                    },
                    {
                        internalType: 'uint256[]',
                        name: 'amounts',
                        type: 'uint256[]',
                    },
                ],
                internalType: 'struct GempadSubscriptionPool.tokenDistribution',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getUserRemainingFunds',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [],
        name: 'isInitialized',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_address',
                type: 'address',
            },
        ],
        name: 'isWhitelisted',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'liquidity',
        outputs: [
            {
                internalType: 'contract IUniswapV2Router02',
                name: 'router',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'liquidityPercent',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'lockTime',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'locker',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'liquidityAdded',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pool',
        outputs: [
            {
                internalType: 'contract IERC20Extented',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'hardCap',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'softCap',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'userHardCap',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'sellRate',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'listingRate',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'startTime',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'endTime',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'finalizeTime',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'publicSaleTime',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_participants',
                type: 'address[]',
            },
        ],
        name: 'removeWhitelist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_startTime',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_endTime',
                type: 'uint256',
            },
        ],
        name: 'setTime',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalClaimed',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalContribution',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalRaised',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: '_contributors',
                type: 'address[]',
            },
        ],
        name: 'updateCalculation',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'userInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'userInvest',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'userDeposit',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'userAllocation',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'userClaimed',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
