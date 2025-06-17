import { CreateLockFormInput } from './types';

export const CREATE_LOCK_DEFAULTS: CreateLockFormInput = {
    tokenAddress: undefined,
    isAnotherOwner: false,
    title: undefined,
    isVestingActive: false,
    ownerAddress: undefined,
    amount: undefined,
    TGE: undefined,
    cycle: undefined,
    cycleRelease: undefined,
    timeUTC: undefined,
};
