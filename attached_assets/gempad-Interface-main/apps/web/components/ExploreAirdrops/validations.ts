import { isValidAddress } from '@/utils/format';
import { isValidUrl } from '@/utils/isValidUrl';
import dayjs from 'dayjs';
import * as yup from 'yup';

export const vestingModalValidation = yup.object().shape({
    tge: yup
        .number()
        .positive()
        .required()
        .min(1)
        .max(100)
        .label('TGE Release Percent')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'sumOfTGEAndCycleLessThen100',
            'Sum of TGE and cycleRelease should be less than 100.',
            (v, { parent }) => {
                const { cycleRelease } = parent;
                return cycleRelease + v < 100;
            },
        ),
    cycle: yup
        .number()
        .positive()
        .required()
        .min(1)
        .label('Cycle')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v)),

    cycleRelease: yup
        .number()
        .positive()
        .required()
        .min(1)
        .max(100)
        .label('Cycle Release Percent')
        .transform((v: string) => (isNaN(Number(v)) ? undefined : v))
        .test(
            'sumOfTGEAndCycleLessThen100',
            'Sum of TGE and cycleRelease should be less than 100.',
            (v, { parent }) => {
                const { tge } = parent;
                return tge + v < 100;
            },
        ),
});

export const airdropModalValidation = yup.object().shape({
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
            is: (v: string) => v === '1',
            then: (y) => y.required(),
        }),
});

export const allocationsModalValidation = yup.object().shape({
    allocations: yup
        .string()
        .required()
        .label('Allocations')
        .test('isAddressValid', 'Missing or Invalid address', (value) => {
            if (value) {
                const lines = value.trim().split('\n');
                let valid = true;

                lines.forEach((line) => {
                    const [address, _] = line.split(',');
                    if (!isValidAddress(address.toLowerCase())) {
                        valid = false;
                        return;
                    }
                });

                return valid;
            }

            return true;
        })
        .test('isAddressDuplicate', 'Remove duplicate addresses', (value) => {
            if (value) {
                const lines = value.trim().split('\n');
                const addresses = lines.map((x) => {
                    const [addr, amount] = x.split(',');
                    return addr.toLowerCase();
                });

                return new Set(addresses).size === addresses.length;
            }

            return true;
        })
        .test('isAddressContainedAmount', 'Missing or Invalid Amount', (value) => {
            if (value) {
                const lines = value.trim().split('\n');
                let valid = true;

                lines.forEach((line) => {
                    const [_, amount] = line.split(',');
                    if (!amount || isNaN(+amount) || +amount === 0) {
                        valid = false;
                        return;
                    }
                });

                return valid;
            }

            return true;
        }),
});
