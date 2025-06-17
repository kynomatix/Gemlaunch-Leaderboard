'use client';

import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Box, Typography } from '@mui/material';
import Divider from '../Divider/Divider';
import { Address, useNetwork } from 'wagmi';
import { useCreateAntibotContract } from '@/hooks/useContract';
import { ANTIBOT_CONTRACT_ADDRESSES } from '@/constants';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { current } from '@reduxjs/toolkit';

interface StatusProps {
    tokenAddress: Address;
    isEnable: boolean;
}

const Status = ({ tokenAddress, isEnable }: StatusProps) => {
    const { chain } = useNetwork();
    const chainId = chain?.id;

    const ANTIBOT = useCreateAntibotContract(ANTIBOT_CONTRACT_ADDRESSES[chainId] as Address);

    const { result: configs } = useSingleCallResult({
        contract: ANTIBOT,
        functionName: 'configs',
        args: [tokenAddress],
    });
    const { result: _currentBlock } = useSingleCallResult({
        contract: ANTIBOT,
        functionName: 'getCurrrentBlock',
    });

    const getBlocksLeft = React.useCallback(
        (currentBlock: bigint, blocksLeft: bigint | string): number => {
            const val = Number(blocksLeft) - Number(currentBlock);
            if (val <= 0) return 0;
            return val;
        },
        [],
    );

    const configData = {
        amountLimit: isEnable ? configs?.[2] : 'N/A',
        timeLimit: isEnable ? configs?.[3] : 'N/A',
        blockLeftToDisable: isEnable ? configs?.[4] : 'N/A',
        currentBlock: isEnable ? _currentBlock : 'N/A',
    };

    const { amountLimit, timeLimit, blockLeftToDisable, currentBlock } = configData;

    const data = [
        {
            id: 1,
            property: 'Protect Status',
            value: isEnable ? 'Waiting liquidity' : 'Not protected',
        },
        { id: 2, property: 'Amount Limit', value: amountLimit },
        { id: 3, property: 'Time Limit', value: timeLimit },
        {
            id: 4,
            property: 'Blocks left to disable',
            value: getBlocksLeft(_currentBlock, blockLeftToDisable),
        },
        { id: 5, property: 'Current Block', value: currentBlock },
    ];

    return (
        <PrimaryCard py={24} mt={30}>
            <Typography variant="h5">Status</Typography>
            <Divider color="#ffffff" />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {data.map(({ id, property, value }) => (
                    <Box
                        key={id}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #ffffff25',
                            pb: '10px',
                        }}
                    >
                        <Typography variant="h5" fontSize={14}>
                            {property}
                        </Typography>
                        <Typography
                            variant="h5"
                            fontSize={14}
                            color={id === 1 ? 'primary' : 'common.white'}
                        >
                            {value?.toString()}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </PrimaryCard>
    );
};

export default Status;
