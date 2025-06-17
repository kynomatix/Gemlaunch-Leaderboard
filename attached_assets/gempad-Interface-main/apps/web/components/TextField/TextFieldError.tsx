import { Typography } from '@mui/material';
import React from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface TextFieldProps {
    fieldName: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const TextFieldError = ({ fieldName }: TextFieldProps) => {
    return <Typography variant="body2">{fieldName?.message?.toString()}</Typography>;
};

export default TextFieldError;
