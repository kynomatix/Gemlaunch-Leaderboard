'use client';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PrimaryCard from '../Cards/PrimaryCard';
import TableSearchIcon from 'public/assets/icons/table-search.svg';
import images from '@/public/assets/images/images';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import AppPagination from '../AppPagination/AppPagination';
import { Avatar, AvatarGroup, Skeleton } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { shortenAddress } from '@/utils/format';

import request, { gql } from 'graphql-request';
import { useMutation, useQuery } from '@tanstack/react-query';
import { formatUnits } from 'viem';
import { useAccount, useNetwork } from 'wagmi';
import Loader from './Loader';
import debounce from 'lodash/debounce';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';
import SingleLoader from './SingleLoader';
import { DEFAULT_CHAIN_ID, SUBSQUID_URLS } from '@/constants';
import { tableContainerStyles } from '../AntiBot/constants';
import { QueryData, ViewOptions } from './types';
import { getAllLocksQuery } from './query';
import { OperationVariables } from '@apollo/client';
import { formatAmount } from '@/utils/formatAmount';

export default function TokenTable({
    isLpToken,
    baseRoute,
}: {
    isLpToken: boolean;
    baseRoute: string;
}) {
    const { address } = useAccount();
    const { chain } = useNetwork();

    const isMobile = useMediaQuery('(max-width:800px)');
    const [viewOption, setViewOption] = React.useState<ViewOptions>('All');

    const limit = 5;
    const queryVariables = React.useMemo(() => {
        return {
            first: limit,
            after: null,
            searchTerm: undefined,
            ownerAddress: undefined,
            isLpToken,
        };
    }, [isLpToken]);

    const { data, refetch, isLoading } = useQuery<QueryData, OperationVariables>({
        queryKey: ['locks'],
        queryFn: async () =>
            request(SUBSQUID_URLS[chain?.id || DEFAULT_CHAIN_ID], getAllLocksQuery, queryVariables),
    });

    const locks = data?.locksConnection?.edges;

    const handleSearchDebounced = debounce(async (value) => {
        if (value) {
            queryVariables.searchTerm = value.trim().toLowerCase();
        } else {
            queryVariables.searchTerm = undefined;
        }
        await refetch();
    }, 450);

    const handlePegination = async (_, pageNumber: number) => {
        queryVariables.after = pageNumber === 1 ? null : ((pageNumber - 1) * limit).toString();
        await refetch();
    };

    React.useEffect(() => {
        const fetchData = async () => {
            if (viewOption === 'All') {
                queryVariables.ownerAddress = undefined;
            } else {
                queryVariables.ownerAddress = address || '0x';
            }
            await refetch();
        };

        fetchData();
    }, [viewOption, address, chain, queryVariables, refetch]);

    return (
        <PrimaryCard py={25} mt={30} mb={100}>
            <Box>
                <TextField
                    type="text"
                    fullWidth
                    placeholder="Search by token address..."
                    onChange={(e) => {
                        const { value } = e.target;
                        handleSearchDebounced(value);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <TableSearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '13px',
                        mt: '10px',
                    }}
                >
                    {['All', 'My Locks'].map((option) => (
                        <Box key={option} onClick={() => setViewOption(option as ViewOptions)}>
                            <Typography
                                sx={{
                                    color: viewOption === option ? '#22CDA6' : '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                                fontWeight={viewOption === option ? 600 : 500}
                            >
                                {option}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <TableContainer sx={tableContainerStyles} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ border: 0 }}>
                                    <Typography color="common.white" variant="h5" fontWeight={600}>
                                        Token
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ border: 0 }}>
                                    <Typography color="common.white" variant="h5" fontWeight={600}>
                                        Amount
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ border: 0 }}>
                                    <Typography color="common.white" variant="h5" fontWeight={600}>
                                        Owners
                                    </Typography>
                                </TableCell>
                                <TableCell sx={{ border: 0 }}></TableCell>
                            </TableRow>
                        </TableHead>
                        {data ? (
                            <>
                                <TableBody>
                                    {locks
                                        ?.map((x) => x.node)
                                        .map((lock) => (
                                            <React.Fragment key={lock?.id}>
                                                <TableRow key={lock.id}>
                                                    <TableCell
                                                        sx={{ borderBottom: '1px solid #ffffff30' }}
                                                    >
                                                        {isLpToken ? (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px',
                                                                }}
                                                            >
                                                                <Box>
                                                                    <AvatarGroup
                                                                        spacing={25}
                                                                        max={3}
                                                                        sx={{
                                                                            '.MuiAvatarGroup-avatar':
                                                                                {
                                                                                    border: '1px solid #22CDA6',
                                                                                    width: '20px',
                                                                                    height: '20px',
                                                                                    p: 1,
                                                                                    backgroundColor:
                                                                                        '#000',
                                                                                },
                                                                        }}
                                                                    >
                                                                        <Avatar
                                                                            alt="profile"
                                                                            src={images.Gem.src}
                                                                        />
                                                                        <Avatar
                                                                            alt="profile"
                                                                            src={images.Gem.src}
                                                                        />
                                                                    </AvatarGroup>
                                                                </Box>
                                                                <Box>
                                                                    <Typography
                                                                        variant="h5"
                                                                        fontWeight={600}
                                                                        color="common.white"
                                                                    >
                                                                        {lock.token.name}/
                                                                        {lock.token.name}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={14}
                                                                        color="common.white"
                                                                    >
                                                                        {lock.token.symbol}/
                                                                        {lock.token.symbol}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        ) : (
                                                            <Box
                                                                sx={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '10px',
                                                                }}
                                                            >
                                                                <Avatar
                                                                    alt="profile"
                                                                    src={images.Gem.src}
                                                                    sx={{
                                                                        border: '1px solid #22CDA6',
                                                                        borderRadius: '50%',
                                                                        p: 1,
                                                                        backgroundColor: '#000',
                                                                    }}
                                                                />
                                                                <Box>
                                                                    <Typography
                                                                        variant="h5"
                                                                        fontWeight={600}
                                                                        color="common.white"
                                                                    >
                                                                        {lock.token.name}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body1"
                                                                        fontSize={14}
                                                                        color="common.white"
                                                                    >
                                                                        {lock.token.symbol}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ borderBottom: '1px solid #ffffff30' }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            fontSize={14}
                                                            color="common.white"
                                                        >{`${formatAmount(
                                                            +formatUnits(
                                                                BigInt(lock.amount),
                                                                lock.token.decimals,
                                                            ),
                                                        )}
                                                        
                                                        ${lock.token.symbol}`}</Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ borderBottom: '1px solid #ffffff30' }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            fontSize={14}
                                                            color="primary"
                                                        >
                                                            {isMobile
                                                                ? shortenAddress(lock.owner.id)
                                                                : lock.owner.id}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        align="right"
                                                        sx={{ borderBottom: '1px solid #ffffff30' }}
                                                    >
                                                        <Link
                                                            href={
                                                                lock?.owner?.id.toLowerCase() ===
                                                                address?.toLowerCase().toString()
                                                                    ? `/record/${lock.id}`
                                                                    : `/${baseRoute}/${lock.token.id}`
                                                            }
                                                        >
                                                            <Typography
                                                                fontSize={14}
                                                                fontWeight={600}
                                                                color="primary"
                                                                sx={{ cursor: 'pointer' }}
                                                            >
                                                                View
                                                            </Typography>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}

                                    {!locks?.map((x) => x.node).length && !isLoading && (
                                        <Box
                                            component={TableRow}
                                            sx={{
                                                // background: '#252136',
                                                '&:last-child td': { border: 'none' },
                                                width: '100%',
                                            }}
                                        >
                                            <TableCell colSpan={4} align="center">
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        py: '100px',
                                                        px: '20px',
                                                        gap: '5px',
                                                    }}
                                                >
                                                    <AllInboxIcon
                                                        sx={{ color: '#FFFFFF' }}
                                                        fontSize={'large'}
                                                    />
                                                    <Typography
                                                        color="common.white"
                                                        sx={{ fontWeight: 600, mt: '10px' }}
                                                    >
                                                        No Tokens found
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </Box>
                                    )}

                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            sx={{ pt: '20px', pb: '10px', borderBottom: 'none' }}
                                        >
                                            <Box
                                                sx={{
                                                    display: data?.locksConnection?.edges?.map(
                                                        (x) => x.node,
                                                    )
                                                        ? 'flex'
                                                        : 'none',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <AppPagination
                                                    onChange={handlePegination}
                                                    count={Math.ceil(
                                                        Number(data?.locksConnection?.totalCount) /
                                                            limit,
                                                    )}
                                                />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </>
                        ) : (
                            <Loader isLpToken={isLpToken} />
                        )}
                    </Table>
                </TableContainer>
            </Box>
        </PrimaryCard>
    );
}
