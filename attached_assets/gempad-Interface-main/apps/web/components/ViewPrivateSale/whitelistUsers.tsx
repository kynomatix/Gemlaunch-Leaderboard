import { Box, Skeleton, Typography } from '@mui/material';
import React from 'react';
import AppPagination from '../AppPagination/AppPagination';
import Address from './Address';
import { whitelistStyles } from './constants';
import { WhitelistUsersProps } from './types';
import { useTransactionTracking } from '@/hooks/useTransactionTracking';

const WhitelistUsers: React.FC<WhitelistUsersProps> = ({ users, refetch }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const { tracking: whitelistAddedTracking, transaction } = useTransactionTracking(
        'private-sale-whitelist-added',
        {
            onCompleted: () => refetch(),
        },
    );
    const { tracking: whitelistRemovedTracking } = useTransactionTracking(
        'private-sale-whitelist-removed',
        {
            onCompleted: () => refetch(),
        },
    );

    const isTracking = whitelistRemovedTracking || whitelistAddedTracking;

    return (
        <Box>
            {isTracking && (
                <Skeleton animation="wave" variant="rounded" height={40} sx={{ my: 2, mx: 5 }} />
            )}
            {users
                ?.reverse()
                ?.slice(startIndex, endIndex)
                ?.map((user, idx) => (
                    <Box key={user} px={5} sx={whitelistStyles}>
                        <Typography fontSize={14}>
                            {String(startIndex + idx + 1).padStart(2, '0')}
                        </Typography>
                        <Address idx={idx} user={user} />
                    </Box>
                ))}

            <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={2}>
                <AppPagination
                    count={Math.ceil((users?.length || 1) / itemsPerPage)}
                    onChange={(_, page) => setCurrentPage(page)}
                />
            </Box>
        </Box>
    );
};

export default WhitelistUsers;
