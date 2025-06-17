import {
    Avatar,
    AvatarGroup,
    Box,
    Skeleton,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import React from 'react';

const SingleLoader = ({ isLpToken }: { isLpToken: boolean }) => {
    return (
        <TableBody>
            {[1].map((x) => (
                <TableRow key={x}>
                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
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
                                        spacing={20}
                                        max={2}
                                        sx={{
                                            '.MuiAvatarGroup-avatar': {
                                                border: 'none',
                                            },
                                        }}
                                    >
                                        <Skeleton animation="wave">
                                            <Avatar alt="profile" src={''} variant="circular" />
                                        </Skeleton>
                                        <Skeleton animation="wave">
                                            <Avatar
                                                alt="profile"
                                                src={''}
                                                sx={{ zIndex: 100 }}
                                                variant="circular"
                                            />
                                        </Skeleton>
                                    </AvatarGroup>
                                </Box>
                                <Box>
                                    <Skeleton
                                        variant="rounded"
                                        animation="wave"
                                        width={100}
                                        sx={{ mb: 0.5 }}
                                    />

                                    <Skeleton variant="rounded" animation="wave" width={60} />
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
                                <Box>
                                    <Skeleton
                                        animation="wave"
                                        variant="rectangular"
                                        width={50}
                                        height={50}
                                        sx={{ borderRadius: '25px' }}
                                    />
                                </Box>
                                <Box>
                                    <Skeleton
                                        animation="wave"
                                        variant="rounded"
                                        width={100}
                                        sx={{ mb: 0.5 }}
                                    />
                                    <Skeleton animation="wave" variant="rounded" width={60} />
                                </Box>
                            </Box>
                        )}
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                        <Skeleton animation="wave" variant="rounded" width={220} />
                    </TableCell>
                    <TableCell sx={{ borderBottom: '1px solid #ffffff30' }}>
                        <Skeleton animation="wave" variant="rounded" width={220} />
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: '1px solid #ffffff30' }}>
                        <Skeleton animation="wave" variant="rounded" width={40} />
                    </TableCell>
                </TableRow>
            ))}
        </TableBody>
    );
};

export default SingleLoader;
