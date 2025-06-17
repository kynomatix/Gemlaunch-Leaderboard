import React, { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { Address, erc20ABI, readContracts, useAccount } from 'wagmi';

interface ReturnProps {
    balance: bigint;
    decimals: number;
    symbol: string;
    name: string;
    totalSupply: number;
}

const useTokenInformation = (tokenAddress: Address): ReturnProps => {
    const { address } = useAccount();
    const [tokenInfo, setTokenInfo] = useState<ReturnProps>({
        balance: 0n,
        decimals: 0,
        symbol: '',
        name: '',
        totalSupply: 0,
    });

    useEffect(() => {
        async function getTokenInfo() {
            const [symbol, decimals, balance, name, totalSupply] = await readContracts({
                contracts: [
                    { address: tokenAddress, abi: erc20ABI, functionName: 'symbol' },
                    { address: tokenAddress, abi: erc20ABI, functionName: 'decimals' },
                    {
                        address: tokenAddress,
                        abi: erc20ABI,
                        functionName: 'balanceOf',
                        args: [address],
                    },
                    { address: tokenAddress, abi: erc20ABI, functionName: 'name' },
                    { address: tokenAddress, abi: erc20ABI, functionName: 'totalSupply' },
                ],
            });

            const token = {
                symbol: symbol?.result || '',
                decimals: decimals?.result || 0,
                balance: balance?.result || 0n,
                name: name?.result || 'unknown',
                totalSupply: Number(totalSupply?.result) || 0,
            };

            setTokenInfo(token);
        }

        getTokenInfo();
    }, [tokenAddress, address]);

    return tokenInfo;
};

export default useTokenInformation;
