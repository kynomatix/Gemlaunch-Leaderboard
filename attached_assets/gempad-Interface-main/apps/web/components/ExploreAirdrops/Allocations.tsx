'use client';

import React from 'react';
import { Box, Pagination, Skeleton, Tooltip, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Link from 'next/link';

import useMediaQuery from '@mui/material/useMediaQuery';
import { shortenAddress } from '@/utils/format';
import { Airdrop } from '@/src/gql/graphql';
import { Address, formatUnits } from 'viem';
import LinkIcon from 'public/assets/icons/link.svg';
import CopyIcon from 'public/assets/icons/copy.svg';
import { getBlockExploreLink } from '@/utils';
import { useContractReads, useNetwork } from 'wagmi';
import AppPagination from '../AppPagination/AppPagination';
import NotFound from '../NotFound/NotFound';
import { useAirdropContract } from '@/hooks/useContract';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import { TransactionTrackingContext } from '../Provider/TransactionTrackingProvider';
import { useSingleCallResult, useSingleContractMultipleData } from '@/state/multicall/hooks';
import { useActiveChainId } from '@/hooks/useActiveChainId';

interface AllocationProps {
    refetch: any;
    airdrop: Airdrop;
}

const Allocations = ({ airdrop, refetch }: AllocationProps) => {
    const {
        allocations,
        token: { decimals, symbol },
        contractAddress,
        id,
    } = airdrop;
    const isMobile = useMediaQuery('(max-width: 700px)');

    const { chainId } = useActiveChainId();

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const airdropContract = useAirdropContract(contractAddress as Address);
    const { result: participants, loading: participantsLoading } = useSingleCallResult({
        contract: airdropContract,
        functionName: 'getParticipants',
    });

    const response = useSingleContractMultipleData({
        contract: {
            abi: airdropContract.abi,
            address: airdropContract.address,
        },
        functionName: 'getUserAllocation',
        args: participants ? participants.map((x) => [x] as [`0x${string}`]) : [],
    });

    return (
        <Box sx={{ mt: '30px' }}>
            <Typography variant="h5" fontSize={20} sx={{ mb: '15px', ml: '32px' }}>
                Allocations ({participants?.length})
            </Typography>
            <PrimaryCard py={25}>
                {participantsLoading && (
                    <>
                        {[1, 2, 3, 4, 5].map((x) => (
                            <Skeleton
                                key={x}
                                animation="wave"
                                variant="rounded"
                                height={40}
                                sx={{ my: 0.5 }}
                            />
                        ))}
                    </>
                )}
                {!!participants?.length && (
                    <Box>
                        {participants?.slice(startIndex, endIndex)?.map((x, i) => (
                            <Box
                                key={x}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    borderBottom: '1px solid #ffffff25',
                                    pb: '9px',
                                    mt: '14px',
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography color="primary" fontSize={14}>
                                        {isMobile ? shortenAddress(x) : x}
                                    </Typography>
                                    <Link href={getBlockExploreLink(x, 'address', chainId)}>
                                        <LinkIcon />
                                    </Link>
                                </Box>
                                <Typography color="common.white" fontSize={14}>
                                    {formatUnits(
                                        response?.[i + startIndex]?.result ?? 0n,
                                        decimals,
                                    ).toString()}{' '}
                                    {symbol}
                                </Typography>
                            </Box>
                        ))}

                        <Box
                            mt={2}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <AppPagination
                                count={Math.ceil((participants?.length ?? 1) / itemsPerPage)}
                                onChange={(_, page) => setCurrentPage(page)}
                            />
                        </Box>
                    </Box>
                )}
                {!participants?.length && !participantsLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <NotFound msg="Add allocations to see them here" />
                    </Box>
                )}
            </PrimaryCard>
        </Box>
    );
};

export default Allocations;
