import { ADDRESS_ZERO, CURRENCY_SYMBOLS, NATIVE_CURRENCY_SYMBOLS } from '@/constants';

export const getCurrencySymbol = (addr: string, chainId: number): string => {
    if (addr === ADDRESS_ZERO) {
        return NATIVE_CURRENCY_SYMBOLS[chainId];
    }

    return CURRENCY_SYMBOLS[addr];
};
