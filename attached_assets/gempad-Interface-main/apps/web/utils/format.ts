import { Address } from 'wagmi';
import { getAddress } from 'viem';

export function isAddress(value: any): Address | false {
    try {
        return getAddress(value);
    } catch {
        return false;
    }
}

export function isValidAddress(value: any, chainId?: number | undefined): boolean {
    try {
        return getAddress(value, chainId) && true;
    } catch {
        return false;
    }
}

export function shortenAddress(address: any, chars = 4): string {
    const parsed = isAddress(address);
    if (!parsed) {
        return address;
        // throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`;
}

export const formatText = (text: string, showFullDescription: boolean, lineCount: number = 3) => {
    if (!text) return null;
    const lines = text.split('\n');
    if (lines.length > lineCount && !showFullDescription)
        return lines.slice(0, lineCount).join('\n');
    return text;
};
