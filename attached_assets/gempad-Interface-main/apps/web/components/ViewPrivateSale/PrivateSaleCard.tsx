import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Avatar, Box, Button, Divider, Typography } from '@mui/material';
import StatusChip from '../ExploreAirdrops/StatusChip';
import images from '@/public/assets/images/images';
import Image from 'next/image';
import Link from 'next/link';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';
import { Address, formatUnits } from 'viem';
import { CURRENCY_DECIMALS, CURRENCY_SYMBOLS, NATIVE_CURRENCY_SYMBOLS } from '@/constants';
import { formatAmount } from '@/utils/formatAmount';
import { getProgress } from '@/utils/getProgress';
import {} from './types';
import { usePrivateSaleContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useContractReads, useNetwork } from 'wagmi';
import { getTokenSymbolByAddress } from '@/utils/getTokenSymbolByAddress';
import { getCurrentStatus } from '@/utils/getCurrentStatus';
import { PrivateSale } from '@/src/gql/graphql';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { formatText } from '@/utils/format';

const PrivateSaleCard: React.FC<PrivateSale> = ({ initialRelease, id, currency, metadata }) => {
    const { chainId } = useActiveChainId();

    const privateSaleContract = usePrivateSaleContract(id as Address);
    const { data, isLoading } = useContractReads({
        contracts: [
            { ...privateSaleContract, functionName: 'saleInfo' },
            { ...privateSaleContract, functionName: 'totalSale' },
            { ...privateSaleContract, functionName: 'getCurrentStatus' },
        ],
        watch: true,
    });

    const saleInfo = data?.[0]?.result;
    const totalSale: bigint = data?.[1]?.result ?? 0n;
    const currentStatus: number = data?.[2]?.result;

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

    // formattingValues:
    const firstRelease = Number(initialRelease) / 1000; // removing bips : 1e3
    const decimals = CURRENCY_DECIMALS[currency];
    const softcapFormated = +formatUnits(softcap ?? 0n, decimals);
    const hardcapFormated = +formatUnits(hardcap ?? 0n, decimals);
    const totalSaleFormated = +formatUnits(totalSale, decimals ?? 18);
    const progress = getProgress(totalSaleFormated, hardcapFormated);
    const tokenSymbol = getTokenSymbolByAddress(currency as Address, chainId);

    return (
        <PrimaryCard py={35}>
            <Box sx={{ minHeight: 'auto', display: 'flex', flexDirection: 'column' }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                    }}
                >
                    <Avatar
                        src={metadata?.socials?.logoUrl}
                        sx={{ border: '2px solid #fff', width: 50, height: 50 }}
                    >
                        <Image src={images.Gem} alt="logo" />
                    </Avatar>
                    <StatusChip status={currentStatus} />
                </Box>

                <Box mt={2}>
                    <Typography fontSize={20} variant="h5" sx={{ wordBreak: 'break-all' }}>
                        {name?.slice(0, 14)}
                        {name?.length > 15 && '...'}
                    </Typography>
                    <Typography fontSize={14} variant="h5" sx={{ color: '#B9B9B9' }}>
                        {`Project will receive ${firstRelease}% at first release`}
                    </Typography>
                </Box>

                <Box mt={3} mb={1}>
                    <Typography fontSize={14} variant="h5">
                        softcap/hardcap
                    </Typography>
                    <Typography fontSize={18} variant="h5" sx={{ color: '#0FD7D2' }}>
                        {`${formatAmount(softcapFormated, 2)} ${tokenSymbol} - ${formatAmount(
                            hardcapFormated,
                            2,
                        )} ${tokenSymbol}`}
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant="h5" fontSize={14} sx={{ mb: '4px' }}>
                        Progress ({progress}%)
                    </Typography>
                    <Box mt={0.5} mb={0.5}>
                        <LinearProgressCustom bgColor="#BFFFD5" value={progress} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <Typography variant="h5" fontSize={12}>
                            {`${totalSaleFormated} ${tokenSymbol}`}
                        </Typography>
                        <Typography fontWeight={600} fontSize={12}>
                            {`${hardcapFormated} ${tokenSymbol}`}
                        </Typography>
                    </Box>
                </Box>

                <Divider color="#ffffff" />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <Box>
                        <Typography fontSize={12}>Presale</Typography>
                        <Typography fontSize={12} fontWeight={600}>
                            {getCurrentStatus(currentStatus)}
                        </Typography>
                    </Box>
                    <Box mt={2} sx={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Link href={`/private-sale-list/${id}`}>
                            <Button variant="contained" sx={{ px: '17px' }}>
                                View Pool
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Box>
        </PrimaryCard>
    );
};

export default PrivateSaleCard;
