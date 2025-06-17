import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import * as yup from 'yup';
import { TokenAddress } from './types';

export const MULTISENDER_VALIDATION = yup.object().shape({
    tokenAddress: yup
        .string()
        .label('Token Address')
        .transform((x) => (!x ? '' : x))
        .notRequired()
        .test(
            'is-address',
            (x) => `${x.label} is not in valid format`,
            (v) => {
                if (v?.trim()) {
                    return isValidAddress(v?.toLowerCase());
                }
                return true;
            },
        )
        .test(
            'is-token',
            (x) => `${x.label} is not a valid token`,
            (v) => {
                if (v?.trim()) {
                    return isValidToken(v);
                }
                return true;
            },
        ),

    allocations: yup
        .string()
        .label('Token Addresses')
        .required()
        .test('isAddressValid', 'Missing or Invalid address', (value) => {
            if (value) {
                const lines = value.trim().split('\n');
                let valid = true;

                lines.forEach((line) => {
                    const [address, amount] = line.split(',');
                    if (!isValidAddress(address.toLowerCase())) {
                        valid = false;
                        return;
                    }
                });

                return valid;
            }

            return true;
        })
        .test('isValidAmount', 'Missing Amount or Invalid amount', (value) => {
            if (value) {
                const lines = value.trim().split('\n');
                let valid = true;

                lines.forEach((line) => {
                    const [address, amount] = line.split(',');
                    if (!amount || isNaN(+amount) || line.split(',').length > 2 || +amount <= 0) {
                        valid = false;
                        return;
                    }
                });

                return valid;
            }

            return true;
        })
        .test('isAddressDuplicate', 'Duplicate address not allowed', (value) => {
            if (value) {
                const lines = value.trim().split('\n');
                let valid = true;
                const addressSet = new Set();

                lines.forEach((line) => {
                    const [address, amount] = line.split(',');
                    if (addressSet.has(address.toLowerCase())) {
                        valid = false;
                        return;
                    }
                    addressSet.add(address.toLowerCase());
                });
                return valid;
            }

            return true;
        }),
});

export const uniqueValidation = (objects: TokenAddress[]) => {
    const walletAddresses = new Set();

    for (const obj of objects) {
        if (obj.address) {
            if (walletAddresses.has(obj.address.toLowerCase())) {
                return false;
            }
            walletAddresses.add(obj.address.toLowerCase());
        }
    }
    return true;
};
