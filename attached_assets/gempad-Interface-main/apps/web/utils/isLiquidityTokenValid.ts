import { uniswapV2PairABI } from '@/config/abi/uniswapV2PairABI';
import { Address } from 'viem';
import { readContracts } from 'wagmi/actions';

export async function isLiquidityTokenValid(tokenAddress: string | undefined) {
    if (!tokenAddress) return false;

    const address = tokenAddress.toLowerCase() as Address;

    const [token0, token1, factory] = await readContracts({
        contracts: [
            { address, abi: uniswapV2PairABI, functionName: 'token0' },
            { address, abi: uniswapV2PairABI, functionName: 'token1' },
            { address, abi: uniswapV2PairABI, functionName: 'factory' },
        ],
    });

    return Boolean(
        token0.status === 'success' && token1.status === 'success' && factory.status === 'success',
    );
}
