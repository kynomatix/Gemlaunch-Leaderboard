'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import PrivateSaleIcon from 'public/assets/icons/private-sale-home.svg';
import SecondaryCard from '../Cards/SecondaryCard';
import ListCardRow from './ListCardRow';
import { GemTokensQueryData, LatestPoolsQueryData, ListType, PrivateSaleQueryData } from './types';
import { OperationVariables, useQuery } from '@apollo/client';
import { GET_LAUNCHPADS, GET_PRIVATE_SALES } from './query';
import NoData from '../NoData/NoData';
import Link from 'next/link';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getBlockExploreLink } from '@/utils';

const styles = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    mb: '20px',
    ml: '20px',
};

const ListCardPrivateSale = () => {
    const { data, loading } = useQuery<PrivateSaleQueryData, OperationVariables>(
        GET_PRIVATE_SALES,
        {
            variables: {
                limit: 3,
            },
        },
    );

    const privateSales = data?.privateSales;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={styles}>
                <PrivateSaleIcon fill="#2DFE87" />
                <Link href="/private-sale-list">
                    <Typography sx={{ ':hover': { textDecoration: 'underline' } }}>
                        Private Sales
                    </Typography>
                </Link>
            </Box>
            {!!privateSales?.length && (
                <SecondaryCard px={15} py={25}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            minHeight: '155px',
                        }}
                    >
                        {privateSales?.map((x) => (
                            <ListCardRow
                                key={x.id}
                                title={x?.name}
                                desc={x?.tokenSymbol}
                                image={x?.metadata?.socials?.logoUrl}
                                chainId={x?.chainId}
                                buttonTitle="View"
                                addr={`/private-sale-list/${x?.contractAddress}`}
                                listType={ListType.PRIVATE_SALE}
                            />
                        ))}
                    </Box>
                </SecondaryCard>
            )}
            {!privateSales?.length && !loading && (
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

export default ListCardPrivateSale;
