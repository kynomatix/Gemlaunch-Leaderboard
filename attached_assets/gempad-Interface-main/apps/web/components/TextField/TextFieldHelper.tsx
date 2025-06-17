import { Typography } from '@mui/material';
import React from 'react';

interface TextFieldHelperProps {
    msg: string;
}

const TextFieldHelper = ({ msg }: TextFieldHelperProps) => {
    return (
        <Typography color="primary" variant="h5" fontSize={12}>
            {msg}
        </Typography>
    );
};

export default TextFieldHelper;
