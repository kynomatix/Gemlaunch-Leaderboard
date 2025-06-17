'use client';

import React from 'react';
import { Pagination, PaginationProps } from '@mui/material';

interface AppPaginationProps extends PaginationProps {
    count: number;
    showFirstButton?: boolean;
    showLastButton?: boolean;
}

const AppPagination = ({
    count,
    showFirstButton = true,
    showLastButton = false,
    ...rest
}: AppPaginationProps) => {
    return (
        <Pagination
            {...rest}
            count={count}
            showFirstButton
            showLastButton
            color="primary"
            sx={{
                '& .MuiPaginationItem-page:not(.Mui-selected)': {
                    border: '1px solid #22CDA6',
                    borderRadius: '50%',
                    color: '#fff',
                },
                '& .MuiPaginationItem-icon': {
                    color: 'white',
                    border: '1px solid #22CDA6',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    p: '6px',
                },
                '& .MuiPaginationItem-ellipsis': {
                    color: 'white',
                },
            }}
        />
    );
};

export default AppPagination;
