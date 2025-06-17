import { isValidAddress } from '@/utils/format';
import { Labels, TokenType } from './types';
import * as yup from 'yup';

export const CREATE_TOKEN_VALIDATION = (ownerAddress: string) => {
    return yup.object().shape({
        tokenType: yup.string().required(),
        router: yup.string().required(),
        tokenName: yup
            .string()
            .label(Labels.TokenName)
            .required()
            .min(2)
            .max(50)
            .test('isEmpty', '${path} cannot be just spaces', (v) => {
                if (v.trim() === '') return false;
                return true;
            }),
        tokenSymbol: yup
            .string()
            .required()
            .label(Labels.TokenSymbol)
            .min(2)
            .max(11)
            .test('isEmpty', '${path} cannot be just spaces', (v) => {
                if (v.trim() === '') return false;
                return true;
            }),
        tokenDecimals: yup
            .number()
            .positive()
            .integer()
            .max(18)
            .label(Labels.TokenDecimals)
            .when('tokenType', {
                is: (tokeType: TokenType) => tokeType === TokenType.Standard,
                then: (yup) => yup.required().typeError('${path} must be a number'),
            }),
        tokenSupply: yup
            .number()
            .typeError('${path} must be a number')
            .label(Labels.TokenSupply)
            .required()
            .positive()
            .integer()
            .max(Number.MAX_SAFE_INTEGER),
        gemlaunchAntiBotSystem: yup.boolean(),
        rewardToken: yup
            .string()
            .label(Labels.RewardToken)
            .test('isValidAddress', 'Address is invalid', (v) =>
                v ? isValidAddress(v?.toLowerCase()) : true,
            )
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.Baby,
                then: (yup) => yup.required('${path} is a required field'),
            }),
        generateYieldFee: yup
            .number()
            .label(Labels.TaxFeeBps)
            .typeError('${path} is a required filed')
            .positive()
            .min(0.01)
            .max(25)
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.LiquidityGenerator,
                then: (yup) => yup.required('It is a required field'),
            }),
        generateLiquidityFee: yup
            .number()
            .label(Labels.LiquidityFeeBps)
            .typeError('${path} is a required filed')
            .positive()
            .min(0.01)
            .max(25)
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.LiquidityGenerator,
                then: (yup) => yup.required('It is a required field'),
            }),
        charityMarketingPercent: yup
            .number()
            .label(Labels.CharityBps)
            .positive()
            .max(25)
            .transform((v) => (isNaN(v) ? undefined : v))
            .typeError('${path} must be a number')
            .when('charityMarketingAddress', {
                is: (CMA: string) => CMA,
                then: (yup) => yup.required(),
            }),
        charityMarketingAddress: yup
            .string()
            .test('isValidAddress', 'Address is invalid', (v) =>
                v ? isValidAddress(v?.toLowerCase()) : true,
            )
            .test('isOwnerAddress', '${path} must not be the address of the creator', (v) => {
                if (!v) return true;
                if (v.toLowerCase() === ownerAddress?.toLowerCase()) return false;
                return true;
            }),
        minTokenBalanceForDividends: yup
            .number()
            .label(Labels.MinTokenBalanceForDividends)
            .positive()
            .integer()
            .transform((v) => (isNaN(v) ? undefined : v))
            .typeError('${path} must be a number')
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.Baby,
                then: (yup) =>
                    yup
                        .required('It is a required field')
                        .test(
                            'isLessThenMax',
                            '${path} must be less than or equal 0.1% total supply',
                            (value, { parent }) => {
                                return value <= (parent.tokenSupply * 0.1) / 100; // it should be less or equal to 0.1% of tokensupply
                            },
                        ),
            }),
        tokenRewardFee: yup
            .number()
            .label(Labels.TokenRewardFee)
            .typeError('${path} is a required field')
            .min(0.01)
            .max(100)
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.Baby,
                then: (yup) => yup.required('It is a required field'),
            }),
        autoAddLiquidity: yup
            .number()
            .label(Labels.AutoAddLiquidity)
            .min(0.01)
            .max(100)
            .typeError('${path} is a required filed')
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.Baby,
                then: (yup) => yup.required('It is a required field'),
            }),
        marketingFee: yup
            .number()
            .label(Labels.MarketingFee)
            .typeError('${path} is a required field')
            .min(0.01)
            .max(100)
            .transform((v) => (isNaN(v) ? undefined : v))
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.Baby,
                then: (yup) => yup.required('It is a required field'),
            }),
        marketingWallet: yup
            .string()
            .label(Labels.MarketingWallet)
            .test('isValidAddress', 'Address is invalid', (v) =>
                v ? isValidAddress(v?.toLowerCase()) : true,
            )
            .test('isOwnerAddress', 'Owner and marketing wallet cannot be the same', (v) => {
                if (!v) return true;
                if (v.toLowerCase() === ownerAddress?.toLowerCase()) return false;
                return true;
            })
            .when('tokenType', {
                is: (tokenType: TokenType) => tokenType === TokenType.Baby,
                then: (yup) => yup.required('It is a required field'),
            }),
    });
};
