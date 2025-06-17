import { isValidUrl } from '@/utils/isValidUrl';
import { Labels } from './constants';

import * as yup from 'yup';
import dayjs from 'dayjs';

export const STEP_ONE = yup.object().shape({
    title: yup
        .string()
        .label(Labels.title)
        .required()
        .test('notEmpty', '${path} cannot be empty', (v) => {
            return v.trim() !== '';
        }),
});

export const STEP_TWO = yup.object().shape({
    hardCap: yup
        .number()
        .required()
        .label(Labels.hardCap)
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive(),
    softCap: yup
        .number()
        .required()
        .label(Labels.softCap)
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive()
        .test(
            'isGreaterThenFiftyPercentOfHardCap',
            '${path} must be greater the or equal to 50% of hardcap',
            (v, { parent }) => {
                const min = parent.hardCap / 2;
                return v >= min;
            },
        )
        .test(
            'isLessThenHardCap',
            '${path} must be less the or equal to hardcap',
            (v, { parent }) => {
                const max = parent.hardCap;
                return v <= max;
            },
        ),
    minBuy: yup
        .number()
        .label(Labels.minBuy)
        .required()
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive()
        .test('isLessThenMaxBuy', '${path} must be less then max buy', (v, { parent }) => {
            const max = parent.maxBuy;
            return v < max;
        }),
    maxBuy: yup
        .number()
        .label(Labels.maxBuy)
        .required()
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive()
        .test('isGreaterThenMinBuy', '${path} must be greater then min buy', (v, { parent }) => {
            const max = parent.minBuy;
            return v > max;
        }),
    startTime: yup
        .date()
        .required()
        .label(Labels.startTime)
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
        .label(Labels.endTime)
        .test('endTimeAfterStartTime', '${path} must be after Start Time', (v, { parent }) => {
            const { startTime } = parent;
            if (!v || !startTime || v > startTime) {
                return true;
            }
            return false;
        }),
    firstFundRelease: yup
        .number()
        .required()
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive()
        .label(Labels.firstFundRelease)
        .min(1)
        .max(95),
    vestingPeriodEachCycle: yup
        .number()
        .required()
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive()
        .label(Labels.vestingPeriodEachCycle)
        .min(1),
    cycleReleasePercent: yup
        .number()
        .required()
        .transform((v) => (isNaN(v) ? undefined : v))
        .positive()
        .label(Labels.cycleReleasePercent)
        .min(1)
        .max(100),
});

export const STEP_THREE = yup.object().shape({
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

export const VALIDATIONS = {
    0: STEP_ONE,
    1: STEP_TWO,
    2: STEP_THREE,
};
