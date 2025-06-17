import Services from '@/components/Services/Services';
import Stats from '@/components/Stats/Stats';
import TokenSales from '@/components/TokenSales/TokenSales';
import React from 'react';

import 'aos/dist/aos.css';

import Comunity from '@/components/Comunity/Comunity';
import NewsLetter from '@/components/NewsLetter/NewsLetter';
import Hero from '@/components/Hero/Hero';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import Landing from './Landing';
import { CurrencyData } from '@/constants/types';

async function fetchData() {
    try {
        const response = await axios.get(
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_COIN_MARKET_CAP_API,
                },
            },
        );

        return response.data as CurrencyData; // Return the actual data from the response
    } catch (error: any) {
        console.error('Error fetching data:', error.message);
        throw error; // Re-throw for component handling
    }
}

export default async function Page() {
    const data = await fetchData();

    // Handle potential errors during data fetching
    if (!data) {
        return (
            <Box>
                <Typography>Error fetching data. Please try again later.</Typography>
            </Box>
        );
    }

    return <Landing currencyData={data} />;
}
