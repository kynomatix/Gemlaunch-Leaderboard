import { Box, Skeleton, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface CountdownProps {
    endTime: string;
}

interface Time {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
}

const boxStyles = {
    borderRadius: '5px',
    background: '#22CDA6',
    minHeight: '44px',
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    px: '10px',
};

const CountdownTimer: React.FC<CountdownProps> = ({ endTime }) => {
    const [timeRemaining, setTimeRemaining] = useState<Time>();

    const calculateTimeRemaining = React.useCallback((): Time => {
        if (!endTime) {
            const a: Time = {
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00',
            };
            return a;
        }
        const endDate = new Date(endTime).getTime();

        const difference = endDate - new Date().getTime();

        if (difference <= 0) {
            const a: Time = {
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00',
            };
            return a;
        }

        const remainingTime: Time = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24))
                .toString()
                .padStart(2, '0'),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24)
                .toString()
                .padStart(2, '0'),
            minutes: Math.floor((difference / 1000 / 60) % 60)
                .toString()
                .padStart(2, '0'),
            seconds: Math.floor((difference / 1000) % 60)
                .toString()
                .padStart(2, '0'),
        };

        return remainingTime;
    }, [endTime]);

    useEffect(() => {
        const timer = setInterval(() => {
            const res = calculateTimeRemaining();
            setTimeRemaining(res);
            if (
                res &&
                res.days === '00' &&
                res.hours === '00' &&
                res.minutes === '00' &&
                res.seconds === '00'
            ) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, calculateTimeRemaining]);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '15px',
                mt: '10px',
            }}
        >
            {timeRemaining ? (
                <>
                    <Box sx={boxStyles}>
                        <Typography fontSize={20} fontWeight={600} sx={{ color: '#090909' }}>
                            {timeRemaining?.days || '00'}
                        </Typography>
                    </Box>
                    <Box sx={boxStyles}>
                        <Typography fontSize={20} fontWeight={600} sx={{ color: '#090909' }}>
                            {timeRemaining?.hours || '00'}
                        </Typography>
                    </Box>
                    <Box sx={boxStyles}>
                        <Typography fontSize={20} fontWeight={600} sx={{ color: '#090909' }}>
                            {timeRemaining?.minutes || '00'}
                        </Typography>
                    </Box>
                    <Box sx={boxStyles}>
                        <Typography fontSize={20} fontWeight={600} sx={{ color: '#090909' }}>
                            {timeRemaining?.seconds || '00'}
                        </Typography>
                    </Box>
                </>
            ) : (
                <>
                    <Skeleton animation="wave" height={44} width={44} variant="rounded" />
                    <Skeleton animation="wave" height={44} width={44} variant="rounded" />
                    <Skeleton animation="wave" height={44} width={44} variant="rounded" />
                    <Skeleton animation="wave" height={44} width={44} variant="rounded" />
                </>
            )}
        </Box>
    );
};

export default CountdownTimer;
