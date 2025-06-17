import AirdropStats from '@/components/ExploreAirdrops/AirdropStats';
import AirdropsTabs from '@/components/ExploreAirdrops/AirdropsTabs';
import { Box } from '@mui/material';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Airdrop List | Gemlaunch',
    description: 'Airdrop List | Gemlaunch',
};

export default function AirDropList() {
    return (
        <Box>
            <Box sx={{ mt: '30px' }}>
                <AirdropStats />
            </Box>

            <Box sx={{ mt: '20px' }}>
                <AirdropsTabs />
            </Box>
        </Box>
    );
}
