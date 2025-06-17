import { Lock } from '@/src/gql/graphql';
import dayjs from 'dayjs';

export const isUnlocked = (record: Lock) => {
    const now = dayjs();
    return now.isSame(record.unlockDate) || now.isAfter(record.unlockDate);
};

export const isWithdrawn = (record: Lock) => {
    return record.status === 'Withdrawn';
};

export const canWithDraw = (record: Lock) => {
    return !isWithdrawn(record) && isUnlocked(record);
};
