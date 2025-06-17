import { LaunchpadAffiliateProgram, ListingOptions } from '@/components/LaunchpadForm/types';
import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import { isValidUrl } from '@/utils/isValidUrl';
import dayjs from 'dayjs';
import * as yup from 'yup';
import { Labels } from './constants';

export const STEP1_VALIDATION = yup.object().shape({
    affiliateProgram: yup.string().required(),
    listingOptions: yup.string(),
    tokenAddress: yup
        .string()
        .label('Token Address')
        .required()
        .test(
            'is-address',
            (x) => `${x.label} is not in valid format`,
            (v) => {
                if (v.trim() !== '') {
                    return isValidAddress(v.toLowerCase());
                }
                return true;
            },
        )
        .test(
            'is-token',
            (x) => `${x.label} is not a valid token`,
            (v) => {
                if (v.trim() !== '') {
                    return isValidToken(v);
                }
                return true;
            },
        ),
    affiliatePercentage: yup
        .number()
        .label('Affiliate Percentage')
        .transform((v) => (isNaN(v) ? undefined : v))
        .max(5)
        .positive()
        .integer()
        .when('affiliateProgram', {
            is: (x) => x === LaunchpadAffiliateProgram.ENABLED,
            then: (yup) => yup.required(),
        }),
});

export const STEP2_FAIR_LAUNCH_SCHEMA_VALIDATION = yup.object().shape({
    totalSellingAmount: yup
        .number()
        .required()
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .label('Total Selling Amount'),
    softcap: yup
        .number()
        .required()
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),
    isMaxContribution: yup.boolean(),
    maxContribution: yup
        .number()
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isMaxContribution', {
            is: (x: boolean) => x === true,
            then: (yup) => yup.required(),
        }),
    liquidity: yup
        .number()
        .positive()
        .integer()
        .required()
        .max(100)
        .min(30)
        .when('listingOptions', {
            is: (v) => v === ListingOptions.AUTO,
            then: (y) =>
                y
                    .required()
                    .positive()
                    .integer()
                    .required()
                    .min(30)
                    .max(100)
                    .test(
                        'isGreaterThen100',
                        'Liquidity percent + Buyback percent must be greater than 51% and less than equal to 100%',
                        (v, { parent }) => {
                            const { buybackPercent } = parent;
                            const max: number = v + buybackPercent || 0;
                            return max <= 100 && max > 50;
                        },
                    ),
            otherwise: (y) => yup.mixed().nullable().notRequired(),
        })
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),

    buybackPercent: yup
        .number()
        .max(100)
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isEnableBuyback', {
            is: (x: boolean) => x,
            then: (yup) => yup.required().positive(),
        })
        .test(
            'isGreaterThen100',
            'Liquidity percent + Buyback percent must be greater than 50% and less than equal to 100%',
            (v, { parent }) => {
                const { liquidity, listingOptions } = parent;
                if (listingOptions === ListingOptions.MANUAL) return true;
                const max: number = v + liquidity ?? 0;
                return max <= 100 && max > 50;
            },
        ),

    startTime: yup
        .date()
        .required()
        .label('Start Time')
        .test('startTimeBeforeEndTime', '${path} must be before End Time', (v, { parent }) => {
            const { endTime } = parent;
            if (!v || !endTime || v <= endTime) {
                return true;
            }
            return false;
        })
        .test('isValidDuration', 'Invalid Duration', (v, { parent }) => {
            if (!v || !parent.endTime) {
                return true;
            }

            const { endTime } = parent;
            const ST = dayjs(v);
            const ET = dayjs(endTime);
            const duration = ET.diff(ST, 'minute');
            return duration <= 10080;
        })
        .test('startTimeAfterCurrentTime', '${path} must be after the current time', (v) => {
            const currentTime = dayjs();
            if (!v || dayjs(v).isAfter(currentTime)) {
                return true;
            }
            return false;
        }),
    endTime: yup
        .date()
        .required()
        .label('End Time')
        .test('endTimeAfterStartTime', '${path} must be after Start Time', (v, { parent }) => {
            const { startTime } = parent;
            if (!v || !startTime || v > startTime) {
                return true;
            }
            return false;
        })
        .test('isValidDuration', 'Invalid Duration', (v, { parent }) => {
            if (!v || !parent.endTime) {
                return true;
            }

            const { startTime } = parent;
            const ST = dayjs(startTime);
            const ET = dayjs(v);
            const duration = ET.diff(ST, 'minute');
            return duration <= 10080;
        }),

    liquidityLockup: yup
        .number()
        .required()
        .min(5)
        .transform((v) => (isNaN(v) ? undefined : v))
        .when('listingOptions', {
            is: (v) => {
                return v === ListingOptions.AUTO;
            },
            then: (y) => {
                return y.required().positive().required().min(5);
            },
            otherwise: (y) => yup.mixed().nullable().notRequired(),
        }),
});

export const STEP2_LAUNCHPAD_SCHEMA_VALIDATION = yup.object().shape({
    presaleRate: yup
        .number()
        .positive()
        .required()
        .transform((v) => (isNaN(v) ? undefined : v)),
    hardcap: yup
        .number()
        .positive()
        .label(Labels.hardcap)
        .required()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),
    softcap: yup
        .number()
        .required()
        .label(Labels.softcap)
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isGreaterThanOrEqualTo25PercentOfHardCap',
            '${path} must be greater than or equal to 25 percent of hardcap!',
            (v, { parent }) => {
                const { hardcap } = parent;
                const min = (25 / 100) * hardcap;
                return v >= min;
            },
        )
        .test(
            'isLessThanOrEqualToHardCap',
            '${path} must be less than or equal to hardcap!',
            (v, { parent }) => {
                const { hardcap } = parent;
                return v <= hardcap;
            },
        ),
    minBuy: yup
        .number()
        .positive()
        .label(Labels.minBuy)
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test('isLessThanMaxBuy', '${path} must be less than max buy', (v, { parent }) => {
            const { maxBuy } = parent;
            return v < maxBuy;
        }),
    maxBuy: yup
        .number()
        .positive()
        .label(Labels.maxBuy)
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test('isGreaterThanMinBuy', '${path} must be greater than min buy', (v, { parent }) => {
            const { minBuy } = parent;
            return v > minBuy;
        }),

    startTime: yup
        .date()
        .required()
        .label('Start Time')
        .test('startTimeBeforeEndTime', '${path} must be before End Time', (v, { parent }) => {
            const { endTime } = parent;
            if (!v || !endTime || v <= endTime) {
                return true;
            }
            return false;
        })
        .test('startTimeAfterCurrentTime', '${path} must be after the current time', (v) => {
            const currentTime = dayjs();
            if (!v || dayjs(v).isAfter(currentTime)) {
                return true;
            }
            return false;
        }),

    endTime: yup
        .date()
        .required()
        .label('End Time')
        .test('endTimeAfterStartTime', '${path} must be after Start Time', (v, { parent }) => {
            const { startTime } = parent;
            if (!v || !startTime || v > startTime) {
                return true;
            }
            return false;
        }),
    refundType: yup.string().label(Labels.refundType).required(),
    liquidity: yup
        .number()
        // .required()
        .transform((v, originalValue) =>
            isNaN(Number(v)) || originalValue.listingOptions === ListingOptions.AUTO
                ? undefined
                : v,
        )
        .when('listingOptions', {
            is: (v) => v === ListingOptions.AUTO,
            then: (y) => y.required().positive().integer().required().min(51).max(100),
            otherwise: (y) => yup.mixed().nullable().notRequired(),
        }),
    listingRate: yup
        .number()
        // .required()
        .transform((v, originalValue) =>
            isNaN(Number(v)) || originalValue.listingOptions === ListingOptions.AUTO
                ? undefined
                : v,
        )
        .when('listingOptions', {
            is: (v) => v === ListingOptions.AUTO,
            then: (y) => y.positive().required(),
            otherwise: (y) => yup.mixed().nullable().notRequired(),
        }),
    liquidityLockup: yup
        .number()
        .transform((v, originalValue) => {
            return isNaN(Number(v)) || originalValue.listingOptions === ListingOptions.AUTO
                ? undefined
                : v;
        })
        .when('listingOptions', {
            is: (v) => {
                return v === ListingOptions.AUTO;
            },
            then: (y) => {
                return y.required().positive().required().min(5);
            },
            otherwise: (y) => yup.mixed().nullable().notRequired(),
        }),

    isVestingActive: yup.boolean(),

    releasePresale: yup
        .number()
        .positive()
        .min(1)
        .max(100)
        .label('First release for presale')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isVestingActive', {
            is: (v) => v === true,
            then: (y) => y.required(),
            otherwise: (y) => y.nullable(),
        }),
    vestingPeriod: yup
        .number()
        .positive()
        .min(1)
        .label('Vesting Period')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isVestingActive', {
            is: (v) => v === true,
            then: (y) => y.required(),
            otherwise: (y) => y.nullable(),
        }),
    presaleTokenRelease: yup
        .number()
        .positive()
        .min(1)
        .max(100)
        .label('Presale Token Release')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isVestingActive', {
            is: (v) => v === true,
            then: (y) => y.required(),
            otherwise: (y) => y.nullable(),
        }),
});

export const STEP3_VALIDATION = yup.object().shape({
    logoUrl: yup
        .string()
        .required()
        .label(Labels.logoUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    websiteUrl: yup
        .string()
        .required()
        .label(Labels.logoUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    facebookUrl: yup
        .string()
        .label(Labels.facebookUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    twitterUrl: yup
        .string()
        .label(Labels.twitterUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    githubUrl: yup
        .string()
        .label(Labels.githubUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    telegramUrl: yup
        .string()
        .label(Labels.telegramUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    redditUrl: yup
        .string()
        .label(Labels.redditUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    youtubeUrl: yup
        .string()
        .label(Labels.youtubeUrl)
        .test('isValidUrl', '${path} is invalid', (v) => {
            return v ? isValidUrl(v) : true;
        }),
    description: yup.string(),
});

export const STEP2_SUBSCRIPTION_SCHEMA_VALIDATION = yup.object().shape({
    hardcap: yup
        .number()
        .positive()
        .label('Hardcap Tokens')
        .required()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),
    softcap: yup
        .number()
        .required()
        .label('Softcap Tokens')
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isGreaterThanOrEqualTo25PercentOfHardCap',
            '${path} must be greater than or equal to 51 percent of hardcap!',
            (v, { parent }) => {
                const { hardcap } = parent;
                const min = (51 / 100) * hardcap;
                return v >= min;
            },
        )
        .test('isLessThanHardCap', '${path} must be less than hardcap!', (v, { parent }) => {
            const { hardcap } = parent;
            return v < hardcap;
        }),
    hardcapTokensPerUser: yup
        .number()
        .required()
        .label('Hardcap Tokens Per User')
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test('isLessThanHardCap', '${path} must be less than hardcap!', (v, { parent }) => {
            const { hardcap } = parent;
            return v < hardcap;
        }),
    startTime: yup
        .date()
        .required()
        .label('Start Time')
        .test(
            'startTimeBeforeEndTime',
            '${path} must be before End Time',
            (startTime, { parent }) => {
                const { endTime } = parent;
                if (!startTime || !endTime || startTime < endTime) {
                    return true;
                }
                return false;
            },
        )
        .test('startTimeAfterCurrentTime', '${path} must be after the current time', (v) => {
            const currentTime = dayjs();
            if (!v || dayjs(v).isAfter(currentTime)) {
                return true;
            }
            return false;
        }),

    endTime: yup
        .date()
        .required()
        .label('End Time')
        .test('endTimeAfterStartTime', '${path} must be after Start Time', (v, { parent }) => {
            const { startTime } = parent;
            if (!v || !startTime || v > startTime) {
                return true;
            }
            return false;
        }),
    refundType: yup.string().label(Labels.refundType).required(),
    liquidity: yup
        .number()
        .positive()
        .integer()
        .required()
        .max(100)
        .min(51)
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),

    liquidityLockup: yup
        .number()
        .required()
        .label('Listing Rate')
        .min(5)
        .transform((v) => (isNaN(v) ? undefined : v)),

    subscriptionRate: yup
        .number()
        .required()
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isGreaterThanListingRate',
            '${path} must be greater than listing rate',
            (v, { parent }) => {
                const { listingRate } = parent;
                return v > listingRate;
            },
        ),
    listingRate: yup
        .number()
        .required()
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isLessThanSubscriptionRate',
            '${path} must be less than subscription rate',
            (v, { parent }) => {
                const { subscriptionRate } = parent;
                return v < subscriptionRate;
            },
        ),
});
export const STEP2_DUTCH_AUCTION_SCHEMA_VALIDATION = yup.object().shape({
    totalSellingAmount: yup
        .number()
        .required()
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .label('Total Selling Amount'),
    hardcap: yup
        .number()
        .positive()
        .label(Labels.hardcap)
        .required()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),
    softcap: yup
        .number()
        .required()
        .label(Labels.softcap)
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isGreaterThanOrEqualTo25PercentOfHardCap',
            '${path} must be greater than or equal to 25 percent of hardcap!',
            (v, { parent }) => {
                const { hardcap } = parent;
                const min = (25 / 100) * hardcap;
                return v >= min;
            },
        )
        .test(
            'isLessThanOrEqualToHardCap',
            '${path} must be less than or equal to hardcap!',
            (v, { parent }) => {
                const { hardcap } = parent;
                return v <= hardcap;
            },
        ),
    startPrice: yup
        .number()
        .required()
        .label(Labels.startPrice)
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isGreaterThanEndPrice',
            '${path} must be greater than End Price!',
            (v, { parent }) => {
                const { endPrice } = parent;
                return v > endPrice;
            },
        ),
    endPrice: yup
        .number()
        .required()
        .label(Labels.endPrice)
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test('isLessThanEndPrice', '${path} must be less than Start Price!', (v, { parent }) => {
            const { startPrice } = parent;
            return v < startPrice;
        }),
    minContribution: yup
        .number()
        .required()
        .label(Labels.minContribution)
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test('isLessThanMax', '${path} must be less than max contribution!', (v, { parent }) => {
            const { maxContribution } = parent;
            return v < maxContribution;
        }),

    maxContribution: yup
        .number()
        .required()
        .label(Labels.maxContribution)
        .positive()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'isGreaterThanMax',
            '${path} must be greater than min contribution!',
            (v, { parent }) => {
                const { minContribution } = parent;
                return v > minContribution;
            },
        ),
    startTime: yup
        .date()
        .required()
        .label('Start Time')
        .test(
            'startTimeBeforeEndTime',
            '${path} must be before End Time',
            (startTime, { parent }) => {
                const { endTime } = parent;
                if (!startTime || !endTime || startTime < endTime) {
                    return true;
                }
                return false;
            },
        )
        .test('startTimeAfterCurrentTime', '${path} must be after the current time', (v) => {
            const currentTime = dayjs();
            if (!v || dayjs(v).isAfter(currentTime)) {
                return true;
            }
            return false;
        }),

    endTime: yup
        .date()
        .required()
        .label('End Time')
        .test('endTimeAfterStartTime', '${path} must be after Start Time', (v, { parent }) => {
            const { startTime } = parent;
            if (!v || !startTime || v > startTime) {
                return true;
            }
            return false;
        }),
    refundType: yup.string().label(Labels.refundType).required(),
    liquidity: yup
        .number()
        .positive()
        .integer()
        .required()
        .max(100)
        .min(51)
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),

    liquidityLockup: yup
        .number()
        .required()
        .min(5)
        .transform((v) => (isNaN(v) ? undefined : v)),
    isVestingActive: yup.boolean(),
    tgeReleasePercent: yup
        .number()
        .positive()
        .min(1)
        .max(100)
        .label('First release for presale')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isVestingActive', {
            is: (v) => v === true,
            then: (y) => y.required(),
        }),
    cycle: yup
        .number()
        .positive()
        .min(1)
        .label('Vesting Period')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isVestingActive', {
            is: (v) => v === true,
            then: (y) => y.required(),
        }),
    cycleReleasePercent: yup
        .number()
        .positive()
        .min(1)
        .max(100)
        .label('Presale Token Release')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .when('isVestingActive', {
            is: (v) => v === true,
            then: (y) => y.required(),
        }),
    decreasePriceCycle: yup
        .number()
        .positive()
        .required()
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),
});

// functions realted to validations
export function getStep2ValidationSchema(pathname: string) {
    switch (pathname) {
        case '/create-launchpad':
            return STEP2_LAUNCHPAD_SCHEMA_VALIDATION;
        case '/create-fair-launch':
            return STEP2_FAIR_LAUNCH_SCHEMA_VALIDATION;
        case '/create-subscription':
            return STEP2_SUBSCRIPTION_SCHEMA_VALIDATION;
        case '/create-dutch-auction':
            return STEP2_DUTCH_AUCTION_SCHEMA_VALIDATION;
        default:
            return null;
    }
}

export function getMessage(amount: number, balance: number, tokenSymbol: string): string {
    if (amount > balance) {
        return `Not enough balance in your wallet. Need ${amount} ${tokenSymbol} to create launchpad. (Your balance: ${balance} ${tokenSymbol})`;
    }

    return `Need ${amount} ${tokenSymbol} to create launchpad.`;
}
