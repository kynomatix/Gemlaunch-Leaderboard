import * as React from 'react';
import { Address, formatUnits } from 'viem';
import { useActiveChainId } from './useActiveChainId';
import { erc20ABI, readContracts, useAccount, useNetwork } from 'wagmi';
import { isValidAddress } from '@/utils/format';
import { isLiquidityTokenValid } from '@/utils/isLiquidityTokenValid';
import { isValidToken } from '@/utils/isValidToken';
import { uniswapV2PairABI } from '@/config/abi/uniswapV2PairABI';
import { readContract } from 'wagmi/actions';

export interface TokenDetails {
    id: number;
    property: string;
    value: string | number;
}

interface TokenDetailsState {
    tokenDetails: TokenDetails[];
    isFetching: boolean;
}

const useTokenDetails = (tokenAddress: Address) => {
    const { chain } = useNetwork();
    const chainId = chain?.id;
    const { address: ownerAddress } = useAccount();
    // const [loading, setLoading] = React.useState<boolean>(false);
    const [state, setState] = React.useState<TokenDetailsState>({
        isFetching: false,
        tokenDetails: undefined,
    });

    const fetchTokenDetails = React.useCallback(async () => {
        try {
            setState({ tokenDetails: undefined, isFetching: true });
            // token address shoudl be present and valid.
            if (!tokenAddress || !isValidAddress(tokenAddress, chainId)) {
                setState({ tokenDetails: undefined, isFetching: false });
                return;
            }

            // Fetch Pair Token Details
            if (isLiquidityTokenValid(tokenAddress)) {
                const [token0, token1, decimals, balance] = await readContracts({
                    contracts: [
                        { address: tokenAddress, abi: uniswapV2PairABI, functionName: 'token0' },
                        { address: tokenAddress, abi: uniswapV2PairABI, functionName: 'token1' },
                        { address: tokenAddress, abi: uniswapV2PairABI, functionName: 'decimals' },
                        {
                            address: tokenAddress,
                            abi: uniswapV2PairABI,
                            functionName: 'balanceOf',
                            args: [ownerAddress],
                        },
                    ],
                });

                if (
                    token0.status === 'success' &&
                    token1.status === 'success' &&
                    balance.status === 'success' &&
                    decimals.status === 'success'
                ) {
                    const [symbol0, symbol1, name] = await readContracts({
                        contracts: [
                            { address: token0.result, abi: erc20ABI, functionName: 'symbol' },
                            { address: token1.result, abi: erc20ABI, functionName: 'symbol' },
                            { address: tokenAddress, abi: erc20ABI, functionName: 'name' },
                        ],
                    });

                    const data = [
                        { id: 1, property: 'Name', value: `${name.result}` },
                        { id: 2, property: 'Pair', value: `${symbol0.result}/${symbol1.result}` },
                        { id: 3, property: 'Decimals', value: decimals.result },
                        {
                            id: 4,
                            property: 'balance',
                            value: formatUnits(balance.result, decimals.result),
                        },
                    ];

                    setState({ tokenDetails: data, isFetching: false });
                    return;
                }
            }

            // fetch simple token details
            if (isValidToken(tokenAddress)) {
                const [name, symbol, decimals, balance] = await readContracts({
                    contracts: [
                        { address: tokenAddress, abi: erc20ABI, functionName: 'name' },
                        { address: tokenAddress, abi: erc20ABI, functionName: 'symbol' },
                        { address: tokenAddress, abi: erc20ABI, functionName: 'decimals' },
                        {
                            address: tokenAddress,
                            abi: erc20ABI,
                            functionName: 'balanceOf',
                            args: [ownerAddress],
                        },
                    ],
                });

                if (
                    name.status === 'success' &&
                    symbol.status === 'success' &&
                    decimals.status === 'success' &&
                    balance.status === 'success'
                ) {
                    const data = [
                        { id: 1, property: 'Name', value: name.result },
                        { id: 2, property: 'Symbol', value: symbol.result },
                        { id: 3, property: 'Decimals', value: decimals.result },
                        {
                            id: 4,
                            property: 'Balance',
                            value: formatUnits(balance.result, decimals.result),
                        },
                    ];
                    setState({ tokenDetails: data, isFetching: false });
                    return;
                }
            }
        } catch (error) {
            console.error('Error fetching token details!', error);
        } finally {
            setState((prev) => ({ ...prev, isFetching: false }));
        }
    }, [chainId, ownerAddress, tokenAddress]);

    React.useEffect(() => {
        (async () => {
            await fetchTokenDetails();
        })();
    }, [fetchTokenDetails, tokenAddress, ownerAddress]);

    return { state };
};

export default useTokenDetails;
