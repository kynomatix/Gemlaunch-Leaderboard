import AppPagination from '@/components/AppPagination/AppPagination';
import MainModal from '@/components/Modals';
import { usePrivateSaleContract } from '@/hooks/useContract';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import { Address } from 'viem';
import { ModalProps } from '../types';

const ContributorsListModal: React.FC<ModalProps> = ({ open, handleClose, contractAddress }) => {
    const privateSaleContract = usePrivateSaleContract(contractAddress as Address);
    const { result, loading } = useSingleCallResult({
        contract: privateSaleContract,
        functionName: 'getAllInvestors',
    });

    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
        <MainModal title="Contributors List" openModal={open} onClose={handleClose}>
            <Typography variant="h5" fontSize={14} color="common.white">
                Users
            </Typography>
            <Box mt={2}>
                {result &&
                    [...result]
                        ?.reverse()
                        ?.slice(startIndex, endIndex)
                        ?.map((x, i) => (
                            <Grid container spacing={2}>
                                <Grid item xs={1} mb={1}>
                                    <Typography color="common.white" variant="body1" fontSize={14}>
                                        {String(startIndex + i + 1)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={10}>
                                    <Typography color="common.white" variant="body1" fontSize={14}>
                                        {x}
                                    </Typography>
                                </Grid>
                            </Grid>
                        ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
                <AppPagination
                    count={Math.ceil((result?.length || 1) / itemsPerPage)}
                    onChange={(_, page) => setCurrentPage(page)}
                />
            </Box>
        </MainModal>
    );
};

export default ContributorsListModal;
