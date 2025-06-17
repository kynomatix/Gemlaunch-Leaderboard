import React from 'react';
import { TablePaginationProps } from './types';
import { Box, TableCell, TableRow } from '@mui/material';
import AppPagination from '../AppPagination/AppPagination';
import { PaginationWrapperStyles, tableCellStyles } from './constants';

const TablePagination: React.FC<TablePaginationProps> = ({ colspan, count, onChange }) => {
    return (
        <TableRow>
            <TableCell colSpan={colspan} sx={tableCellStyles}>
                <Box sx={PaginationWrapperStyles}>
                    <AppPagination count={count} onChange={onChange} />
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default TablePagination;
