import { isValidAddress } from '@/utils/format';
import dayjs from 'dayjs';
import * as yup from 'yup';

export const LAUNCHPAD_TOKEN_BUY = (minBuyLimit: number, maxBuyLimit: number) => {
    return yup.object().shape({
        buyAmount: yup
            .number()
            .positive('must be a positive number')
            .required()
            .label('buyAmount')
            .typeError('${path} is required field')
            .test(
                'maxBuyLimit',
                'Amount must be less than or equal to max buy limit',
                function (value) {
                    return value <= maxBuyLimit;
                },
            )
            .test(
                'minBuyLimit',
                'Amount must be greater then or equal to min buy limit',
                function (value) {
                    return value >= minBuyLimit;
                },
            ),
    });
};

export const WHITELIST_VALIDATION = yup.object().shape({
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

export const PUBLICSALE_VALIDATION = yup.object().shape({
    startTime: yup
        .date()
        .nullable('Date must not be empty!')
        .required('Start Time is required')
        .label('Start Time')
        .test('startTimeNotInPast', 'Start Time cannot be in the past', (value) => {
            if (!value) {
                return true; // Allow empty values (handled by required validation)
            }
            const currentTime = new Date();
            return value >= currentTime;
        }),
});
export const CLAIMTIME_VALIDATION = yup.object().shape({
    startTime: yup
        .date()
        .nullable('Date must not be empty!')
        .required('Start Time is required')
        .label('Start Time')
        .test('startTimeNotInPast', 'Start Time cannot be in the past', (value) => {
            if (!value) {
                return true; // Allow empty values (handled by required validation)
            }
            const currentTime = new Date();
            return value > currentTime;
        }),
});

export const AFFILIATION_VALIDATION = yup.object().shape({
    amount: yup
        .number()
        .positive('must be a positive number')
        .required()
        .label('amount')
        .typeError('${path} is required field')
        .test('Max 5%', 'Amount must be Less then or equal to 5%', function (value) {
            return value <= 5;
        }),
});

export const SALETIME_VALIDATION = yup.object().shape({
    startTime: yup
        .date()
        .required('Start Time is required')
        .label('Start Time')
        .test(
            'startTimeBeforeEndTime',
            'Start Time must be before End Time',
            (startTime, { parent }) => {
                const { endTime } = parent;
                if (!startTime || !endTime || startTime < endTime) {
                    return true;
                }
                return false;
            },
        )
        .test(
            'startTimeAfterCurrentTime',
            'Start Time must be after the current time',
            (startTime) => {
                const currentTime = dayjs();
                if (!startTime || dayjs(startTime).isAfter(currentTime)) {
                    return true;
                }
                return false;
            },
        ),
    endTime: yup
        .date()
        .required('End Time is required')
        .label('End Time')
        .test(
            'endTimeAfterStartTime',
            'End Time must be after Start Time',
            (endTime, { parent }) => {
                const { startTime } = parent;
                if (!endTime || !startTime || endTime > startTime) {
                    return true;
                }
                return false;
            },
        ),
});

export const UPDATE_END_TIME = yup.object().shape({
    updateEndTime: yup.date().required('End Time is required').label('Update End Time'),
});
