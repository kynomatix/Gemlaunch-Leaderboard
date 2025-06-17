'use client';
import React from 'react';
import {
    Box,
    Typography,
    Button,
    TextField,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import BNB from 'public/assets/icons/BNB.svg';

const InputCurrencyPanel = () => {
    return (
        <Box
            sx={{
                borderRadius: '15px',
                backgroundColor: 'rgba(34, 205, 166, 0.30)',
                px: '12px',
                py: '20px',
                width: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                }}
            >
                <TextField
                    fullWidth
                    defaultValue="1"
                    InputProps={{
                        endAdornment: (
                            <Button variant="contained" size="small" sx={{ px: '10px' }}>
                                Max
                            </Button>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<BNB />}
                    endIcon={<ArrowDropDownIcon />}
                    sx={{
                        px: '28px',
                        background:
                            'linear-gradient(90deg, #0FD7D2 -0.04%, #17D8CA 3.63%, #39DFA7 22.68%, #54E48B 41.91%, #68E877 61.17%, #73EA6B 80.5%, #77EB67 100.01%)',
                    }}
                >
                    BNB
                </Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    justifyContent: 'space-between',
                    mt: '10px',
                }}
            >
                <Typography variant="h5">$0.451</Typography>
                <Typography variant="h5">Balance: 10,000</Typography>
            </Box>
        </Box>
    );
};

export default InputCurrencyPanel;
