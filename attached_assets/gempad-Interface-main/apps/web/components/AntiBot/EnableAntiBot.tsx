'use client';

import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Button, Box, Typography } from '@mui/material';
import Divider from '../Divider/Divider';
import { Address } from 'viem';
import { useContractRead, useNetwork } from 'wagmi';
import { useCreateAntibotContract, useStandardAntibot } from '@/hooks/useContract';
import { ANTIBOT_CONTRACT_ADDRESSES, DefaultGasLimit } from '@/constants';
import { useRouter } from 'next/router';
import { useSingleCallResult } from '@/state/multicall/hooks';
import { AntibotABI } from '@/config/abi/antibot';
import { waitForTransaction } from 'wagmi/actions';
import toast from 'react-hot-toast';
import DescriptionWithTx from '../Toast/DescriptionWithTx';
import ButtonLoader from '../ButtonLoader/ButtonLoader';

interface EnableAntibotProps {
    tokenAddress: Address;
    isConfigSet: boolean;
    isEnable: boolean;
}

enum Transaction {
    IDLE,
    PENDING,
    PROCESSING,
}

const EnableAntiBot = ({ tokenAddress, isConfigSet, isEnable }: EnableAntibotProps) => {
    const [transaction, setTransaction] = React.useState<Transaction>(Transaction.IDLE);

    const isPending = transaction === Transaction.PENDING;
    const isProcessing = transaction === Transaction.PROCESSING;
    const isIdle = transaction === Transaction.IDLE;
    const isDisabled = transaction !== Transaction.IDLE;

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const TOKEN = useStandardAntibot(tokenAddress);

    const enalbeOrDisableAntibot = React.useCallback(async () => {
        setTransaction(Transaction.PENDING);
        try {
            const { estimateGas, write } = TOKEN;

            const estimatedGas = await estimateGas.setEnableAntiBot([!isEnable], {} as never);
            const hash = await write.setEnableAntiBot([!isEnable], {
                gas: estimatedGas || DefaultGasLimit,
            });
            setTransaction(Transaction.PROCESSING);
            await waitForTransaction({ hash, chainId });
            toast.success(
                <DescriptionWithTx
                    title="Success"
                    description="Transaction Successfull"
                    txHash={hash}
                    txChainId={chainId}
                />,
            );
        } catch (e: any) {
            console.error(e);
            toast.error(
                <DescriptionWithTx
                    title={e.name || 'Error'}
                    description={e.shortMessage || 'Something went wrong'}
                />,
            );
        } finally {
            setTransaction(Transaction.IDLE);
        }
    }, [TOKEN, chainId, isEnable]);

    return (
        <PrimaryCard py={30}>
            <Typography variant="h5">Enable Gem Anti-bot</Typography>
            <Divider color="#ffffff" />
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    flexWrap: 'wrap',
                }}
            >
                <Button
                    onClick={enalbeOrDisableAntibot}
                    variant="contained"
                    disabled={!isConfigSet || !isEnable || isDisabled}
                    sx={{ flexGrow: 1 }}
                >
                    {isPending && <ButtonLoader text="Pending" />}
                    {isProcessing && <ButtonLoader text="Processing" />}
                    {isIdle && 'Disable Antibot'}
                </Button>
                <Button
                    onClick={enalbeOrDisableAntibot}
                    variant="contained"
                    disabled={!isConfigSet || isEnable || isDisabled}
                    sx={{ flexGrow: 1 }}
                >
                    {isPending && <ButtonLoader text="Pending" />}
                    {isProcessing && <ButtonLoader text="Processing" />}
                    {isIdle && 'Enable Antibot'}
                </Button>
            </Box>
            <Typography fontSize={12} variant="h5" color="primary" mt="23px" textAlign="center">
                You need to pay 0.01 BNBat first time enable
            </Typography>
        </PrimaryCard>
    );
};

export default EnableAntiBot;
