import { CURRENCY_SYMBOLS, NATIVE_CURRENCY_SYMBOLS } from '@/constants';
import { Address } from 'viem';

export function getTokenSymbolByAddress(addr: Address, chainId: number): string {
    const symbol = CURRENCY_SYMBOLS[addr];
    if (symbol) return symbol;
    return NATIVE_CURRENCY_SYMBOLS[chainId];
}
