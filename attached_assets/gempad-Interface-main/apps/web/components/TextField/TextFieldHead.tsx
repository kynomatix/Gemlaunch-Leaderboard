import { Typography } from '@mui/material';
import React from 'react';

interface TextFieldProps {
    title: string;
    isRequired?: boolean;
    mb?: number;
    ml?: number;
    mr?: number;
    mt?: number;
    fontSize?: number;
}

const TextFieldHead = ({
    title,
    mb = 1,
    mr = 0,
    ml = 2,
    mt = 0,
    fontSize = 14,
    isRequired = false,
}: TextFieldProps) => {
    return (
        <Typography color="common.white" ml={ml} mr={mr} mt={mt} mb={mb} fontSize={fontSize}>
            {title} {isRequired && <span style={{ color: '#FF8484' }}>*</span>}
        </Typography>
    );
};

export default TextFieldHead;
