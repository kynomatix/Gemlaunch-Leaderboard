import { Box, Typography } from '@mui/material';
import axios from 'axios';
// eslint-disable-next-line import/no-named-as-default
import Home from './Home';
import { CurrencyData } from '@/constants/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home | Gemlaunch',
    description: 'Gemlaunch Home',
};

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
    return <Home currencyData={data} />;
}
