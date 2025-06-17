import { NATIVE_CURRENCY_SYMBOLS } from '@/constants';

export const getCurrencySymbolByEnum = (chainId: number, currency: number) => {
    const sym = {
        0: NATIVE_CURRENCY_SYMBOLS[chainId],
        1: 'USDT',
        2: 'USDC',
    };

    return sym[currency];
};
