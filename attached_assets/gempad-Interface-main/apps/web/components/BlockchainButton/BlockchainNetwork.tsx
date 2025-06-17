import { Box, Button } from '@mui/material';
import { useAccount, useNetwork } from 'wagmi';
import BNBIcon from 'public/assets/icons/BNB.svg';
import ETHIcon from 'public/assets/icons/eth.svg';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ArrowUpDownIcon from 'public/assets/icons/arrow-up-down.svg';
import { CHAIN_QUERY_NAME } from '@/config/chains';
import { NETWORK_ICON, NETWORK_LABEL } from '@/config/network';

const BlockchainNetwork = () => {
    const { chain } = useNetwork();
    const { address } = useAccount();

    const chainId = chain?.id;
    const Icon = NETWORK_ICON[chainId];
    const chainName = NETWORK_LABEL[chainId?.toString()];

    return (
        <Box>
            {/* <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                <Button variant="contained" size="large" sx={{ px: '10px' }}>
                    {Icon ? <Icon /> : <QuestionMarkIcon />}
                </Button>
            </Box> */}

            <Box
            // sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
                <Button
                    variant="contained"
                    size="large"
                    startIcon={Icon ? <Icon /> : <QuestionMarkIcon />}
                    endIcon={<ArrowUpDownIcon />}
                    sx={{ px: '18px' }}
                >
                    {chainName ? chainName : address ? 'Wrong Network' : 'Not Connected'}
                </Button>
            </Box>
        </Box>
    );
};

export default BlockchainNetwork;
