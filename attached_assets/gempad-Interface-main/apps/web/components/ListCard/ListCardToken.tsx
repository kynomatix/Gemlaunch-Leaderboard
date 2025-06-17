'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import TokenIcon from 'public/assets/icons/new-tokens.svg';
import SecondaryCard from '../Cards/SecondaryCard';
import ListCardRow from './ListCardRow';
import { GemTokensQueryData, ListType } from './types';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_GEM_TOKENS } from './query';
import NoData from '../NoData/NoData';
import { getBlockExploreLink } from '@/utils';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import Link from 'next/link';

const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    mb: '20px',
    ml: '20px',
};

const ListCardToken = () => {
    const { data: gemTokens, loading } = useQuery<GemTokensQueryData, OperationVariables>(
        GET_GEM_TOKENS,
        {
            variables: {
                limit: 3,
            },
        },
    );

    const gemlaunchTokens = gemTokens?.gemlaunchTokens;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={styles}>
                <TokenIcon fill="#2DFE87" />
                <Link href="/create-token">
                    <Typography sx={{ ':hover': { textDecoration: 'underline' } }}>
                        New Tokens
                    </Typography>
                </Link>
            </Box>
            {!!gemlaunchTokens?.length && (
                <SecondaryCard px={20} py={25}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            minHeight: '155px',
                        }}
                    >
                        {gemlaunchTokens?.map((x) => (
                            <ListCardRow
                                key={x.id}
                                title={x?.name}
                                desc={x?.symbol}
                                image={x?.image}
                                addr={x?.id}
                                buttonTitle="View"
                                chainId={x?.chainId}
                                listType={ListType.TOKEN}
                            />
                        ))}
                    </Box>
                </SecondaryCard>
            )}
            {!gemlaunchTokens?.length && !loading && (
                <SecondaryCard px={20} py={70}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <NoData msg="No Data" />
                    </Box>
                </SecondaryCard>
            )}
            {loading && (
                <Skeleton
                    height={200}
                    animation="wave"
                    variant="rounded"
                    sx={{ borderRadius: '15px' }}
                />
            )}
        </Box>
    );
};

export default ListCardToken;
