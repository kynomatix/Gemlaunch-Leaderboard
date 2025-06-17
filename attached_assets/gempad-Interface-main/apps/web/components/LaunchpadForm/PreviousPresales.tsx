import React from 'react';
import { PreviousPresalesProps, PreviousPresalesQueryData } from './types';
import { OperationVariables, useQuery } from '@apollo/client';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { GET_PREVIOUS_PRESALES } from './query';
import {
    Avatar,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { tableContainerStyles } from './constants';
import Link from 'next/link';
import PrimaryCard from '../Cards/PrimaryCard';
import Image from 'next/image';
import images from '@/public/assets/images/images';
import { getLaunchpadRouteByContractName } from '../ViewPool/utils';

const PreviousPresales: React.FC<PreviousPresalesProps> = ({
    userAddress,
    currentPresaleAddress,
}) => {
    const { chainId } = useActiveChainId();
    const { data } = useQuery<PreviousPresalesQueryData, OperationVariables>(
        GET_PREVIOUS_PRESALES,
        {
            variables: {
                ownerId: userAddress,
                limit: 5,
                orderBy: 'createdAt_DESC',
                currentPresaleAddress,
            },
            context: { chainId },
        },
    );

    const isDataAvailable = data && data?.launchPads.length > 0;
    if (!isDataAvailable) return null;

    const presales = data.launchPads;

    return (
        <Box>
            <Typography variant="subtitle2" fontSize={20} ml={4} mb={2} mt={4} fontWeight={600}>
                Previous Presales
            </Typography>

            <PrimaryCard py={25}>
                <TableContainer component={Paper} sx={tableContainerStyles}>
                    <Table  aria-label="simple table">
                        <TableBody>
                            {presales &&
                                presales.map((row, id) => (
                                    <TableRow
                                        key={id}
                                        sx={{
                                            '&:last-child td, &:last-child th': {
                                                border: 0,
                                            },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                }}
                                            >
                                                <Avatar
                                                    src={row?.metadata?.socials?.logoUrl}
                                                    alt={row.name}
                                                >
                                                    <Image src={images.Gem} alt={row.name} />
                                                </Avatar>
                                                <Box>
                                                    <Typography fontSize={14} fontWeight={500}>
                                                        {row.token?.name}
                                                    </Typography>
                                                    <Typography fontSize={12}>
                                                        {row.token?.symbol}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="right">
                                            <Link
                                                href={`/${getLaunchpadRouteByContractName(
                                                    row.name,
                                                    row.contractAddress,
                                                )}`}
                                                style={{ color: '#22CDA6' }}
                                            >
                                                View
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </PrimaryCard>
        </Box>
    );
};

export default PreviousPresales;
