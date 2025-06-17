import { Box, Typography } from '@mui/material';
import { RowProps } from './types';

const styles = {
    display: 'flex',
    alignitems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
};

const Row = ({ property, value }: RowProps) => {
    return (
        <>
            <Box sx={styles}>
                <Typography variant="h5" fontSize={14}>
                    {property}
                </Typography>
                <Typography variant="body1" fontSize={14}>
                    {value?.toString()}
                </Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid #fff', opacity: '0.25', my: '15px' }} />
        </>
    );
};

export default Row;
