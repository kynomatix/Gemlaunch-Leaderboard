import { isValidAddress } from '@/utils/format';
import { isValidToken } from '@/utils/isValidToken';
import dayjs from 'dayjs';
import * as yup from 'yup';

export const CREATE_LOCK_VALIDATION = yup.object().shape({
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
    isAnotherOwner: yup.boolean(),
    isVestingActive: yup.boolean(),
    ownerAddress: yup
        .string()
        .label('Owner Address')
        .when('isAnotherOwner', {
            is: (isAnotherOwner: boolean) => isAnotherOwner, // if isAnotherToken is true only then required this field
            then: (yup) => yup.required(),
        }),
    title: yup.string(),
    timeUTC: yup
        .date()
        .label('UTC Time')
        .required()
        .test('startTimeAfterCurrentTime', '${path} must be after the current time', (v) => {
            const currentTime = dayjs();
            if (!v || dayjs(v).isAfter(currentTime)) {
                return true;
            }
            return false;
        }),
    TGE: yup
        .number()
        .integer()
        .label('TGE bps')
        .typeError('${path} is a required field')
        .positive()
        .max(99)
        .transform((v) => (isNaN(v) ? undefined : v))
        .when('isVestingActive', {
            is: (isVestingActive: boolean) => isVestingActive, // if isVestingActive true then it is a required field
            then: (yup) => yup.required(),
        }),
    cycleRelease: yup
        .number()
        .integer()
        .label('cycle release bps')
        .typeError('${path} is a required field')
        .positive()
        .max(99)
        .transform((v) => (isNaN(v) ? undefined : v))
        .when('isVestingActive', {
            is: (isVestingActive: boolean) => isVestingActive, // if isVestingActive true then it is a required field
            then: (yup) => yup.required(),
        }),
    cycle: yup
        .number()
        .label('cycle')
        .typeError('${path} is a required field')
        .positive()
        .transform((v) => (isNaN(v) ? undefined : v))
        .when('isVestingActive', {
            is: (isVestingActive: boolean) => isVestingActive, // if isVestingActive true then it is a required field
            then: (yup) => yup.required(),
        }),
    amount: yup
        .number()
        .label('Amount')
        .typeError('${path} is required field')
        .required()
        .positive()
        .test('isLessThenMax', 'Insufficent balance', (v, obj) => {
            // const max = this.options.context._amount;
            const max = obj.options.context._amount;
            // const {options: {context: {_amount}}} = obj;
            return v <= max;
        }),
});
