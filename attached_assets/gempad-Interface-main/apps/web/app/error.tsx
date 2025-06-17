'use client';

import { Box, Button, Typography } from '@mui/material';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'center',
                    width: 'fit-content',
                }}
            >
                <Typography variant="h2">Something went wrong!</Typography>
                <Button
                    sx={{ width: 'fit-content' }}
                    variant="contained"
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                >
                    Try again
                </Button>
            </Box>
        </Box>
    );
}
