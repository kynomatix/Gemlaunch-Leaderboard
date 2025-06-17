import { erc20ABI } from '../config/abi/erc20';
import { Address } from 'viem';
import { readContracts } from 'wagmi/actions';

export async function isValidToken(tokenAddress: string | undefined) {
    if (!tokenAddress) return false;

    const address = tokenAddress.toLowerCase() as Address;

    const [name, symbol, decimals] = await readContracts({
        contracts: [
            { address, abi: erc20ABI, functionName: 'name' },
            { address, abi: erc20ABI, functionName: 'symbol' },
            { address, abi: erc20ABI, functionName: 'decimals' },
        ],
    });

    return Boolean(
        name.status === 'success' && symbol.status === 'success' && decimals.status === 'success',
    );
}
