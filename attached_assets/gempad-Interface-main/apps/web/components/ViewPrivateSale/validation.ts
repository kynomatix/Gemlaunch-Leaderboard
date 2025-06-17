import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import dayjs from 'dayjs';
import * as yup from 'yup';

export const publicModeModalValidation = yup.object().shape({
    timeType: yup.number().required(),
    startTime: yup
        .date()
        .label('Start Time')
        .test('startTimeAfterCurrentTime', '${path} must be after the current time', (v) => {
            const currentTime = dayjs();
            if (!v || dayjs(v).isAfter(currentTime)) {
                return true;
            }
            return false;
        })
        .when('timeType', {
            is: (v) => Number(v) === 1,
            then: (y) => y.required(),
        }),
});

export const antibotModeModalValidation = yup.object().shape({
    addr: yup
        .string()
        .label('Token Address')
        .notRequired()
        .test(
            'is-address',
            (x) => `${x.label} is not in valid format`,
            (v) => {
                if (v?.trim() !== '') {
                    return isValidAddress(v?.toLowerCase());
                }
                return true;
            },
        )
        .test(
            'is-token',
            (x) => `${x.label} is not a valid token`,
            (v) => {
                if (v?.trim() !== '') {
                    return isValidToken(v);
                }
                return true;
            },
        ),
    minHoldingAmount: yup.number().label('Min Holding Amount').required().positive(),
});

export const whitelistValidation = yup.object().shape({
    users: yup
        .string()
        .required()
        .label('Token Addresses')
        .test('isAddressDuplicate', 'Remove duplicate addresses', (value) => {
            if (value) {
                const addresses = value
                    .split('\n')
                    .map((addr) => addr.trim())
                    .filter((addr) => addr !== '');

                return new Set(addresses).size === addresses.length;
            }

            return true;
        })
        .test('isAddressValid', 'Missing or Invalid address', (value) => {
            if (value) {
                const addresses = value
                    .split('\n')
                    .map((addr) => addr.trim())
                    .filter((addr) => addr !== '');
                let valid = true;

                addresses.forEach((addr) => {
                    if (!isValidAddress(addr.toLowerCase())) {
                        valid = false;
                        return;
                    }
                });

                return valid;
            }

            return true;
        }),
});

export const contributionValidation = (userBalance: number, maxLimit: number) =>
    yup.object().shape({
        amount: yup
            .number()
            .required()
            .label('Amount')
            .transform((x) => (isNaN(x) ? undefined : x))
            .test('isLessAccountBalanceEnough', 'Low Account Balance', (v) => {
                return v <= userBalance;
            })
            .test('isLessThenMaxLimit', 'Max limit reached', (v) => {
                return v <= maxLimit;
            }),
    });
