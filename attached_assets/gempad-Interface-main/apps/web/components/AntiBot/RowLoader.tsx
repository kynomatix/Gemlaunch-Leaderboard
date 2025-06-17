import { Skeleton, TableCell, TableRow, Typography } from '@mui/material';
import React from 'react';

const RowLoader = () => {
    return (
        <TableRow sx={{ borderBottom: '1px solid #ffffff25' }}>
            <TableCell sx={{ border: 0, width: '50%' }}>
                <Skeleton variant="rounded" animation="wave">
                    <Typography>01000</Typography>
                </Skeleton>
            </TableCell>
            <TableCell sx={{ border: 0 }}>
                <Skeleton variant="rounded" animation="wave">
                    <Typography>0x9091EfDcb98c3993dc9BB6714c52Ec2B52efA997</Typography>
                </Skeleton>
            </TableCell>
        </TableRow>
    );
};

export default RowLoader;
