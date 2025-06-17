import { CircularProgress } from '@mui/material';
import React from 'react';

const ButtonLoader = ({ text }: { text: string }) => {
    return (
        <>
            <CircularProgress size={15} sx={{ mr: 1, color: '#9E9E9E' }} />
            {text}
        </>
    );
};

export default ButtonLoader;
