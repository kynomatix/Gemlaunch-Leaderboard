import { Dayjs } from 'dayjs';
import { calculatePercentage } from './calculatePercent';

interface ResultProps {
    id: number;
    timeUTC: bigint;
    amount: string;
}

export const getVestingInfo = (
    tge: number, // initial %
    cycle: number, // interval
    cyclsShare: number, // interval %
    amount: number, // number of tokens to lock
    unlockDate: bigint, // date in unix format
) => {
    const result: ResultProps[] = [];

    const initailAmount = calculatePercentage(amount, tge);
    result.push({ id: 1, timeUTC: unlockDate, amount: `${initailAmount} ${tge}` });

    return result;
};
