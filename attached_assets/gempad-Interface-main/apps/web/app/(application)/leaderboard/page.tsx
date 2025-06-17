import { Typography } from '@mui/material';
import Leaderboard from './Leaderboard';
import axios from 'axios';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Leaderboard | Gemlaunch',
    description: 'Gemlaunch Leaderboard',
    openGraph: {
        images: 'https://e346cce1445d0ba99bdec75f38daf5cf.ipfscdn.io/ipfs/bafybeig7mehu3mh7fendhchrsgvgowqkbpc4qwcec7ufwv2dekg6xcipjq/leaderboard.jpg',
    },
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

        return response.data; // Return the actual data from the response
    } catch (error: any) {
        console.error('Error fetching data:', error.message);
        throw error; // Re-throw for component handling
    }
}

export default async function Page() {
    const data = await fetchData();

    // Handle potential errors during data fetching
    if (!data)
        <Typography textAlign="center">Error fetching Prices. Please try again later.</Typography>;

    return <Leaderboard data={data} />;
}
