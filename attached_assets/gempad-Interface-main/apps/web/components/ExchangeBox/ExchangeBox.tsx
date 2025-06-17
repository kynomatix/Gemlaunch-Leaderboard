'use client';
import React from 'react';
import {
    Box,
    Typography,
    FormControlLabel,
    Checkbox,
    Button,
    IconButton,
    Chip,
} from '@mui/material';
import ExchangeIcon from 'public/assets/icons/exchange-black.svg';
import RefreshIcon from 'public/assets/icons/refresh.svg';
import SwapIcon from 'public/assets/icons/swap-icon.svg';
import Divider from '../Divider/Divider';
import InputCurrencyPanel from '../InputCurrencyPanel/InputCurrencyPanel';

const stats = [
    { id: 1, property: 'Rate', value: '1 BNB = 59,26' },
    { id: 2, property: 'Minimum Received', value: '0.04 BNB' },
    { id: 3, property: 'Price Impact', value: '0.39%' },
    { id: 4, property: 'Fee', value: '0.003 BNB (0.3%)' },
];

const slippages = ['0.1', '0.5', '1.0', '2.0'];

const ExchangeBox = () => {
    const [activeSlippage, setActiveSlippage] = React.useState('0.1');
    return (
        <Box
            sx={{
                p: '20px',
                borderRadius: '15px',
                background: '#314D47B2',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ExchangeIcon />
                    <Typography>Swap</Typography>
                </Box>
                {/* <IconButton> */}
                <RefreshIcon />
                {/* </IconButton> */}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    mt: '35px',
                }}
            >
                <InputCurrencyPanel />
                <SwapIcon />
                <InputCurrencyPanel />
            </Box>

            <Divider mt={25} />

            <Typography variant="h5">Slippage Tolerance:</Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    my: '12px',
                    flexWrap: 'wrap',
                }}
            >
                {slippages.map((slippage) => (
                    <Chip
                        key={slippage}
                        label={
                            <Typography
                                variant="h5"
                                fontWeight={activeSlippage === slippage ? 600 : 500}
                            >
                                {slippage} %
                            </Typography>
                        }
                        sx={{
                            background: activeSlippage === slippage ? '#22CDA6' : '#6A6A6A',
                            cursor: 'pointer',
                        }}
                        onClick={() => setActiveSlippage(slippage)}
                    />
                ))}
            </Box>
            <FormControlLabel label="Accept the high price impact" control={<Checkbox />} />

            <Box
                sx={{
                    mt: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                }}
            >
                {stats.map(({ id, property, value }) => (
                    <Box
                        key={id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '20px',
                        }}
                    >
                        <Typography variant="h5">{property}</Typography>
                        <Typography variant="h5" fontWeight={600} textAlign="right">
                            {value}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Divider />

            <Button variant="contained" size="large" sx={{ width: '100%' }}>
                Conncet Wallet
            </Button>
        </Box>
    );
};

export default ExchangeBox;
