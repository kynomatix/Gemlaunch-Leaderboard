import { getAddress } from 'viem';
import { Currency } from '@dapp/sdk';
import { ChainId } from '@dapp/chains';
import { bsc } from 'wagmi/chains';
import memoize from 'lodash/memoize';
import { TokenAddressMap } from '@dapp/token-lists';
import { chains } from './wagmi';
import dayjs, { Dayjs } from 'dayjs';

// returns the checksummed address if the address is valid, otherwise returns false
export const isAddress = memoize((value: any): `0x${string}` | false => {
    try {
        let value_ = value;
        if (typeof value === 'string' && !value.startsWith('0x')) {
            value_ = `0x${value}`;
        }
        return getAddress(value_);
    } catch {
        return false;
    }
});

export function getBlockExploreLink(
    data: string | number,
    type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
    chainIdOverride?: number,
): string {
    const chainId = chainIdOverride || ChainId.GOERLI;
    const chain = chains.find((c) => c.id === chainId);
    if (!chain) return bsc.blockExplorers.default.url;
    switch (type) {
        case 'transaction': {
            return `${chain.blockExplorers.default.url}/tx/${data}`;
        }
        case 'token': {
            return `${chain.blockExplorers.default.url}/token/${data}`;
        }
        case 'block': {
            return `${chain.blockExplorers.default.url}/block/${data}`;
        }
        case 'countdown': {
            return `${chain.blockExplorers.default.url}/block/countdown/${data}`;
        }
        default: {
            return `${chain.blockExplorers.default.url}/address/${data}`;
        }
    }
}

export function getBlockExploreName(chainIdOverride?: number) {
    const chainId = chainIdOverride || ChainId.BSC;
    const chain = chains.find((c) => c.id === chainId);

    return chain?.blockExplorers?.default.name || bsc.blockExplorers.default.name;
}

export function getBscScanLinkForNft(collectionAddress: string, tokenId: string): string {
    return `${bsc.blockExplorers.default.url}/token/${collectionAddress}?a=${tokenId}`;
}

// add 10%
export function calculateGasMargin(value: bigint, margin = 1000n): bigint {
    return (value * (10000n + margin)) / 10000n;
}

export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function isTokenOnList(
    defaultTokens: TokenAddressMap<ChainId>,
    currency?: Currency,
): boolean {
    if (currency?.isNative) return true;
    return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address]);
}

// *** DATE TO UNIX *** //
export const dateToUnix = (_date: Date): bigint => {
    const date = dayjs(_date);
    if (date.isValid()) {
        const unix = BigInt(date.unix());
        return unix;
    }
    return undefined;
};

export const daysToMinutes = (days: number): number => {
    // Calculate the Unix timestamp in milliseconds
    const millisecondsPerDay = 24 * 60 * 60 * 1000; // 24 hours/day, 60 minutes/hour, 60 seconds/minute, 1000 milliseconds/second
    const currentDate = new Date();
    const unixTimestamp = currentDate.getTime() + days * millisecondsPerDay;

    return Math.floor(unixTimestamp / 1000); // Convert to seconds
};
