'use client';

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Timer from './Timer';
import LinearProgressCustom from '../LinearProgress/LinearProgressCustom';
import CountdownTimer from '../CountdownTimer';
import { Airdrop } from '@/src/gql/graphql';
import dayjs from 'dayjs';
import { Address, useAccount, useContractReads, useNetwork } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import { useSingleCallResult, useSingleContractMultipleData } from '@/state/multicall/hooks';
import { useAirdropContract } from '@/hooks/useContract';
import { getProgress } from '@/utils/getProgress';
import { DefaultGasLimit } from '@/constants';
import { waitForTransaction } from 'wagmi/actions';
import { Tx } from './types';
import ButtonLoader from '../ButtonLoader/ButtonLoader';

const AirdropTimer: React.FC<Airdrop> = ({
    allocations,
    token: { decimals, symbol },
    contractAddress,
}) => {
    const airdropContract = useAirdropContract(contractAddress as Address);
    const { address } = useAccount();

    const { chain } = useNetwork();
    const chainId = chain?.id;

    const [tx, setTx] = React.useState<Tx>(Tx.IDLE);

    const { result } = useSingleCallResult({
        contract: airdropContract,
        functionName: 'getUserAllocation',
        args: [address],
    });

    const { result: participants } = useSingleCallResult({
        contract: airdropContract,
        functionName: 'getParticipants',
    });

    const isParticipants = participants
        ?.map((x) => x.toLowerCase())
        ?.includes(address.toLowerCase());

    const { data, isLoading } = useContractReads({
        contracts: [
            { ...airdropContract, args: [address], functionName: 'getClaimedAmount' },
            { ...airdropContract, args: [address], functionName: 'getRemainingClaimabaleAmount' },
            { ...airdropContract, functionName: 'totalTokens' },
            { ...airdropContract, functionName: 'totalClaimedTokens' },
            { ...airdropContract, functionName: 'getCurrentStatus' },
            { ...airdropContract, functionName: 'startTime' },
            { ...airdropContract, functionName: 'getClaimable', args: [address] },
        ],
        watch: true,
    });

    // Extracting-Data:
    const ca = data?.[0]?.result ?? 0n;
    const rca = data?.[1].result ?? 0n;
    const tt = data?.[2].result ?? 0n;
    const tct = data?.[3].result ?? 0n;
    const currentStatus = data?.[4].result ?? 0;
    const time = data?.[5]?.result;
    const getClaimable = (data?.[6]?.result as bigint) ?? 0n;

    const claimableTokensByUser = formatUnits(getClaimable, decimals);

    // Formating-Data:
    const claimedAmount = formatUnits(ca, decimals);
    const remainingClaimableAmount = formatUnits(rca, decimals);
    const totalClaimabaleAmount = formatUnits(tt, decimals);
    const totalClaimedTokens = formatUnits(tct, decimals);
    const startTime = dayjs.utc(+String(time) * 1000).format('YYYY-MM-DD HH:mm:ss UTC');
    // new Date(Number(time) * 1000)?.toLocaleString();

    // Methods:
    const getAirdropTimerTitle = (status: number): string => {
        if (+totalClaimedTokens === +totalClaimabaleAmount && status === 1) {
            return 'Airdrop Ended';
        }

        if (status === 0) return 'Waiting for Airdrop to start';
        if (status === 1) return 'Airdrop is live now';
        if (status === 2) return 'Airdrop Cancelled';
        return 'Airdrop Ended';
    };

    const handleClaim = async () => {
        try {
            setTx(Tx.PENDING);
            const {
                estimateGas: { claimTokens: claimTokensGas },
                write: { claimTokens },
            } = airdropContract;
            const estimatedGas = await claimTokensGas({} as never);
            const hash = await claimTokens({ gas: estimatedGas || DefaultGasLimit });
            setTx(Tx.PROCESSING);
            await waitForTransaction({ hash, chainId });
        } catch (e) {
            console.error(e);
        } finally {
            setTx(Tx.IDLE);
        }
    };

    // Row-Data:
    const row = [
        { id: 1, property: 'Start Time', value: time?.toString() !== '0' ? startTime : 'N/A' },
        {
            id: 2,
            property: 'Your Allocation',
            value: isParticipants ? `${formatUnits(result ?? 0n, decimals)}` : `0`,
        },
        { id: 3, property: 'Your Claimed', value: claimedAmount ? claimedAmount : 'N/A' },
    ];

    return (
        <PrimaryCard py={25} height="100%">
            <Box sx={{ width: '100%', height: '100%' }}>
                <Typography variant="body1" fontSize={18} textAlign="center" sx={{ mb: '14px' }}>
                    {getAirdropTimerTitle(currentStatus)}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '15px',
                    }}
                >
                    <CountdownTimer endTime={startTime} />
                </Box>

                <Box sx={{ mt: '16px', mb: '30px' }}>
                    <LinearProgressCustom
                        value={getProgress(+totalClaimedTokens, +totalClaimabaleAmount)}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '10px',
                            mt: '6px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Typography fontSize={12} variant="body1">
                            {totalClaimedTokens} {symbol}
                        </Typography>
                        <Typography fontSize={12} variant="body1">
                            {totalClaimabaleAmount} {symbol}
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    {row.map(({ id, property, value }) => (
                        <Box
                            key={id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '10px',
                                borderBottom: '1px solid #ffffff25',
                                pb: '9px',
                                mt: '15px',
                            }}
                        >
                            <Typography variant="body1" fontSize={14}>
                                {property}
                            </Typography>
                            <Typography variant="body1" fontSize={14}>
                                {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                {currentStatus === 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }} mt={3}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleClaim}
                            disabled={+claimableTokensByUser === 0 || tx !== Tx.IDLE}
                        >
                            {tx === Tx.IDLE && `Claim (${claimableTokensByUser})`}
                            {tx === Tx.PENDING && <ButtonLoader text="Pending" />}
                            {tx === Tx.PROCESSING && (
                                <ButtonLoader text={`Claiming (${claimableTokensByUser})`} />
                            )}
                        </Button>
                    </Box>
                )}
            </Box>
        </PrimaryCard>
    );
};

export default AirdropTimer;
