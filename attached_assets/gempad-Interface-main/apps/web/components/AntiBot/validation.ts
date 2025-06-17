import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import * as yup from 'yup';

export const ANTIBOT_VALIDATION = yup.object().shape({
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
});

export const SAVE_CONFIG_VALIDATION = yup.object().shape({
    amountLimitPerTrade: yup
        .number()
        .label('Amount Limit Per Trade')
        .required()
        .positive()
        .transform((v) => (isNaN(v) ? undefined : v)),
    amountPerBlock: yup
        .number()
        .label('Amount Per Block ')
        .required()
        .positive()
        .transform((v) => (isNaN(v) ? undefined : v)),
    timLimitPerTrade: yup
        .number()
        .label('Time Limit Per Trade')
        .required()
        .positive()
        .integer()
        .transform((v) => (isNaN(v) ? undefined : v)),
    blockNumber: yup
        .number()
        .label('Block Number')
        .required()
        .positive()
        .integer()
        .min(21)
        .transform((v) => (isNaN(v) ? undefined : v)),
});

export const WHITE_BLACK_LIST_VALIDATION = yup.object().shape({
    users: yup
        .string()
        .required()
        .label('Token Addresses')
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
