import axios from 'axios';

// Function to fetch Ethereum price from CoinGecko
export const fetchEthUsd = async (): Promise<number> => {
    try {
        const response = await axios.get(
            // 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
            'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
            {
                headers: {
                    'X-CMC_PRO_API_KEY': 'c2b2589e-2004-423f-89a2-789e70253297',
                },
            },
        );

        console.log({ response }, 'coinmarketcap');

        return response.data.ethereum.usd as number;
    } catch (e: any) {
        console.error('Error fetching Ethereum price:', e?.message);
        return null;
    }
};

export const fetchBnbUsd = async (): Promise<number> => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
        );
        return response.data.ethereum.usd as number;
    } catch (e: any) {
        console.error('Error fetching Binance price:', e?.message);
        return null;
    }
};

export const fetchUsdtPrice = async (): Promise<number> => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd',
        );
        return response.data.tether.usd as number;
    } catch (e: any) {
        console.error('Error fetching tether price:', e?.message);
        return null;
    }
};
export const fetchUsdcPrice = async (): Promise<number> => {
    try {
        const response = await axios.get(
            'https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd',
        );
        return response.data['usd-coin'].usd as number;
    } catch (e: any) {
        console.error('Error fetching usd price:', e?.message);
        return null;
    }
};
