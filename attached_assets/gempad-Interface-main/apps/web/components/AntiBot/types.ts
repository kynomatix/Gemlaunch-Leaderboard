import { Router } from '@/constants';
import { Address } from 'viem';

export interface AntibotFormInput {
    tokenAddress: Address;
}

export interface SaveConfigFormInput {
    router: Address;
    pairToken: Address;
    amountLimitPerTrade: number;
    amountPerBlock: number;
    timLimitPerTrade: number;
    blockNumber: number;
}
