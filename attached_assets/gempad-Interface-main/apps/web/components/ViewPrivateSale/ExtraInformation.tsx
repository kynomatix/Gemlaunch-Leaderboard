import { Box, Typography } from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import Row from './Row';
import { Address, useAccount, useContractReads, useNetwork } from 'wagmi';
import { PrivateSale } from '@/src/gql/graphql';
import { usePrivateSaleContract } from '@/hooks/useContract';
import { formatUnits } from 'viem';
import { CURRENCY_DECIMALS } from '@/constants';
import { getTokenSymbolByAddress } from '@/utils/getTokenSymbolByAddress';

const ExtraInformation: React.FC<PrivateSale> = ({ id, currency }) => {
    const { address } = useAccount();

    const { chain } = useNetwork();
    const chainId = chain?.id;
    const privateSaleContract = usePrivateSaleContract(id as Address);
    const { data, isLoading } = useContractReads({
        contracts: [
            { ...privateSaleContract, functionName: 'getCurrentStatus' },
            { ...privateSaleContract, functionName: 'saleInfo' },
            { ...privateSaleContract, functionName: 'totalSale' },
            { ...privateSaleContract, functionName: 'getAllInvestors' },
            { ...privateSaleContract, functionName: 'depositOf', args: [address] },
        ],
        watch: true,
    });

    const status = !isLoading && data[0].result;
    const saleInfo = data?.[1]?.result;
    const _totalSale = !isLoading && data[2].result;
    const totalInvestors = !isLoading && data[3].result?.length;
    const _userContribution = !isLoading && data[4].result;

    const [
        name,
        softcap,
        hardcap,
        minBuy,
        maxBuy,
        startTime,
        endTime,
        finalizeTime,
        publicSaleTime,
    ] = saleInfo ?? [];

    const decimals = CURRENCY_DECIMALS[currency];
    const totalSale = formatUnits(_totalSale ?? 0n, decimals ?? 18);
    const hardcapFormated = formatUnits(hardcap ?? 0n, decimals ?? 18);
    const unsoledTokens = +hardcapFormated - +totalSale;
    const minBuyFormated = formatUnits(minBuy ?? 0n, decimals ?? 18);
    const maxBuyFormated = formatUnits(maxBuy ?? 0n, decimals ?? 18);
    const tokenSymbol = getTokenSymbolByAddress(currency as Address, chainId);
    const userContribution = formatUnits(_userContribution ?? 0n, decimals ?? 18);

    const getStatusTitle: Record<number, string> = {
        0: 'Upcoming',
        1: 'Live',
        2: 'Cancelled',
        3: 'Ended',
    };

    const row = [
        { id: 1, prop: 'Status', val: getStatusTitle[status] },
        { id: 2, prop: 'Unsold token', val: `${unsoledTokens}` },
        { id: 3, prop: 'Minimum Buy', val: `${minBuyFormated} ${tokenSymbol}` },
        { id: 4, prop: 'Maximum Buy', val: `${maxBuyFormated} ${tokenSymbol}` },
        { id: 5, prop: 'Your Contributions', val: `${userContribution}` },
        { id: 6, prop: 'Total Contributors', val: `${totalInvestors}` },
    ];

    return (
        <PrimaryCard mt={30} py={25}>
            {row.map(({ id, prop, val }) => (
                <Row key={id} property={prop} value={val} />
            ))}
        </PrimaryCard>
    );
};

export default ExtraInformation;
