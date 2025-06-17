import { isValidAddress } from '@/utils/format';
import { isAddress } from 'viem';
import * as yup from 'yup';

export function csvRowValidation() {
    // validation
    return yup.object().shape({
        address: yup
            .string()
            .required()
            .test('isValidAddress', 'address is not valid', (v) =>
                v ? isValidAddress(v?.toLowerCase()) : true,
            ),
        amount: yup.number().required(),
    });
}
