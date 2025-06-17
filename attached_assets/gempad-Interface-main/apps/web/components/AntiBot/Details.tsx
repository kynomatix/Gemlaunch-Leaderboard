'use client';

import React from 'react';
import { Box } from '@mui/material';
import Status from './Status';
import Config from './Config';
import BlackWhiteList from './BlackWhiteList';
import EnableAntiBot from './EnableAntiBot';
import { Address } from 'viem';
import Infobar from '../Infobar/Infobar';
import { useCreateAntibotContract, useStandardAntibot } from '@/hooks/useContract';
import { useAccount, useNetwork } from 'wagmi';
import { ANTIBOT_CONTRACT_ADDRESSES } from '@/constants';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const Details = ({ tokenAddress }: { tokenAddress: string }) => {
    const { chainId } = useActiveChainId();

    const ANTIBOT = useCreateAntibotContract(ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address);
    const TOKEN = useStandardAntibot(tokenAddress as Address);

    const { result: isConfigSet } = useSingleCallResult({
        contract: ANTIBOT,
        functionName: 'isConfigSet',
        args: [tokenAddress as Address],
    });

    const { result: isEnable } = useSingleCallResult({
        contract: TOKEN,
        functionName: 'enableAntiBot',
    });

    return (
        <Box mt={5}>
            <Box mb={1}>
                <Infobar
                    dismissable={false}
                    message="You have not configured Gem Anti-Bot"
                    open={!isConfigSet}
                    variant="error"
                />
                <Infobar
                    dismissable={false}
                    message="You have not actived Gem Anti-Bot"
                    open={isConfigSet && !isEnable}
                    variant="error"
                />
                <Infobar
                    dismissable={false}
                    message="You already actived Gemlaunch Anti-Bot"
                    open={isConfigSet && isEnable}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: '30px',
                    flexWrap: { xs: 'wrap', md: 'nowrap' },
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <EnableAntiBot
                        tokenAddress={tokenAddress as Address}
                        isConfigSet={isConfigSet}
                        isEnable={isEnable}
                    />
                    <Status isEnable={isEnable} tokenAddress={tokenAddress as Address} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <Config tokenAddress={tokenAddress as Address} />
                </Box>
            </Box>

            <Box sx={{ mb: '100px' }}>
                <BlackWhiteList label="Blacklist" tokenAddress={tokenAddress as Address} />
                <BlackWhiteList label="Whitelist" tokenAddress={tokenAddress as Address} />
            </Box>
        </Box>
    );
};

export default Details;
