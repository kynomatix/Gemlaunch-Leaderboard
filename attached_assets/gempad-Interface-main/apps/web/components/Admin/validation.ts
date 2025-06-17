import { isValidUrl } from '@/utils/isValidUrl';
import * as yup from 'yup';

export const kycAuditValidation = yup.lazy((values) =>
    yup
        .object()
        .shape({
            audit: yup
                .string()
                .label('Audit')
                .test('isValidUrl', '${path} is invalid', (v) => !v || isValidUrl(v)),
            kyc: yup
                .string()
                .label('Kyc')
                .test('isValidUrl', '${path} is invalid', (v) => !v || isValidUrl(v)),
        })
        .test({
            name: 'atLeastOneRequired',
            message: 'At least one of Audit or Kyc is required',
            test: (value) => {
                const { audit, kyc } = value;
                return audit !== '' || kyc !== '';
            },
        }),
);
