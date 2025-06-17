import dayjs from 'dayjs';
import * as yup from 'yup';

export const LOCKER_VALIDATION = (
    lockedAmount: number,
    tokenBalance: number,
    newAmount: number,
) => {
    return yup.object().shape({
        amount: yup
            .number()
            .label('Amount')
            .typeError('${path} is required field')
            .required()
            .positive()
            .test('isLessThenMax', 'Insufficent balance', (v) => {
                if (newAmount <= lockedAmount) return true;
                const max = tokenBalance;
                return v <= max;
            })
            .test('isGraterThenCurrentAmount', 'Invalid Amount', (v) => {
                return v >= lockedAmount;
            }),

        TGE: yup.number(),
        timeUTC: yup
            .date()
            .label('Time')
            .required()
            .test('isInFuture', '${path} must be in future', (v) => {
                const currentDate = dayjs();
                return dayjs(v).isAfter(currentDate);
            }),
    });
};
