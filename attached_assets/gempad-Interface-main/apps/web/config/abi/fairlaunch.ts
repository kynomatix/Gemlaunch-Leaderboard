export const FairLaunchABI = [
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
                internalType: 'enum GempadFairLaunch.Status',
                name: 'status',
                type: 'uint8',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'time',
                type: 'uint256',
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
                internalType: 'enum GempadFairLaunch.Status',
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
                name: 'id',
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
                name: 'id',
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
                name: 'id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'share',
                type: 'uint256',
            },
        ],
        name: 'RewardsCalimed',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'timeNow',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'end',
                type: 'uint256',
            },
        ],
        name: 'UpdateEndTime',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'id',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'reward',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
        ],
        name: 'UpdateReward',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'id',
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
                name: 'id',
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
                        name: 'totalsellTokens',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'softCap',
                        type: 'uint256',
                    },
                    {
                        internalType: 'bool',
                        name: 'isMaxLimit',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxBuyLimit',
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
                    {
                        internalType: 'bool',
                        name: 'isAffiliate',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'affiliateReward',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct GempadFairLaunch.FairLaunchDetails',
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
                internalType: 'struct GempadFairLaunch.LiquidityDetails',
                name: '_liquidity',
                type: 'tuple',
            },
            {
                components: [
                    {
                        internalType: 'bool',
                        name: 'isBuyback',
                        type: 'bool',
                    },
                    {
                        internalType: 'uint256',
                        name: 'buyBackPercent',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'totalBuyBackAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'boughtBackAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amountPerBuyback',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'minDelay',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'maxDelay',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'lastBuyTime',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct GempadFairLaunch.BuybackDetails',
                name: '_buyBack',
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
        name: '__GempadFairLaunch_init',
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
        inputs: [],
        name: 'buyBack',
        outputs: [
            {
                internalType: 'bool',
                name: 'isBuyback',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'buyBackPercent',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'totalBuyBackAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'boughtBackAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amountPerBuyback',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'minDelay',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'maxDelay',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'lastBuyTime',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'buyBackTokens',
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
            {
                internalType: 'address',
                name: '_referrer',
                type: 'address',
            },
        ],
        name: 'buyToken',
        outputs: [],
        stateMutability: 'payable',
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
        name: 'claimReward',
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
        name: 'currentPrice',
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
        name: 'currentStatus',
        outputs: [
            {
                internalType: 'enum GempadFairLaunch.Status',
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
        name: 'getAllReferrers',
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
                internalType: 'enum GempadFairLaunch.Mode',
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
                internalType: 'enum GempadFairLaunch.Status',
                name: 'status',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '_user',
                type: 'address',
            },
        ],
        name: 'getUserTokens',
        outputs: [
            {
                internalType: 'uint256',
                name: 'tokens',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
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
                name: 'totalsellTokens',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'softCap',
                type: 'uint256',
            },
            {
                internalType: 'bool',
                name: 'isMaxLimit',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'maxBuyLimit',
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
            {
                internalType: 'bool',
                name: 'isAffiliate',
                type: 'bool',
            },
            {
                internalType: 'uint256',
                name: 'affiliateReward',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'remainingBuybackAmount',
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
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'rewardInfo',
        outputs: [
            {
                internalType: 'uint256',
                name: 'referralInvest',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'rewardShare',
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
                name: '_reward',
                type: 'uint256',
            },
        ],
        name: 'setAffiliation',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: '_endTime',
                type: 'uint256',
            },
        ],
        name: 'setEndTime',
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
        name: 'tokenFee',
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
        name: 'tokenToReceive',
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
        inputs: [],
        name: 'totalReferralInvest',
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
        name: 'totalReward',
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
                name: 'userCalimed',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;
