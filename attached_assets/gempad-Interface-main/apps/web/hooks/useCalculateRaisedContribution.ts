import React from 'react';
import { useActiveChainId } from './useActiveChainId';
import { Address, formatUnits } from 'viem';
import {
    NATIVE_CURRENCY_SYMBOLS,
    USDC_CURRENCY_ADDRESSES,
    USDT_CURRENCY_ADDRESSES,
} from '@/constants';
// import { useERC20 } from './useContract';
import { useToken } from './Tokens';
import { CurrencyData } from '@/constants/types';

const useCalculateRaisedContribution = (
    nativeAmount: bigint,
    usdcAmount: bigint,
    usdtAmount: bigint,
    currencyData: CurrencyData,
) => {
    const [raisedContribution, setRaisedContribution] = React.useState<number>();
    const { chainId } = useActiveChainId();

    const usdtToken = useToken(USDT_CURRENCY_ADDRESSES[chainId] as Address);
    const usdcToken = useToken(USDC_CURRENCY_ADDRESSES[chainId] as Address);

    React.useEffect(() => {
        (async () => {
            const pricesUSD = currencyData?.data
                ?.filter((x) => x.symbol === 'BNB' || x.symbol === 'USDT' || x.symbol === 'USDC')
                .map((x) => {
                    return {
                        symbol: x.symbol,
                        price: x.quote?.USD?.price,
                    };
                });

            const nativePrice = pricesUSD.filter(
                (x) => x.symbol === NATIVE_CURRENCY_SYMBOLS[chainId],
            )?.[0]?.price;
            const usdcPrice = pricesUSD.filter((x) => x.symbol === 'USDC')?.[0]?.price;
            const usdtPriceUsd = pricesUSD.filter((x) => x.symbol === 'USDT')?.[0]?.price;

            const total =
                nativePrice * +formatUnits(nativeAmount ?? 0n, 18) +
                usdcPrice * +formatUnits(usdcAmount ?? 0n, usdcToken?.decimals ?? 6) +
                usdtPriceUsd * +formatUnits(usdtAmount ?? 0n, usdtToken?.decimals ?? 18);

            setRaisedContribution(total);
            console.log({ pricesUSD, total, nativePrice, usdcPrice, usdtPriceUsd });
        })();
    }, [chainId, currencyData?.data, nativeAmount, usdcAmount, usdtAmount]);

    return {
        raisedContribution,
    };
};

export default useCalculateRaisedContribution;
