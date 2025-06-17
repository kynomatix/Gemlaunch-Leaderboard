'use client';

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    LinearProgress,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getProgress } from '@/utils/getProgress';
import { Address, formatUnits } from 'viem';
import { useAccount, useContractRead } from 'wagmi';
import React, { useMemo } from 'react';
import useFairLaunchBuyback from '../../hooks/fairlaunchHooks/useFairLaunchBuybackDetails';
import useFundTokenDetails from '../../hooks/useFundTokenDetails';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { FairLaunchBuybackDetails, LaunchpadSaleStatus, Tx } from '../../types';
import { useFairLaunchContract } from '@/hooks/useContract';
import DescriptionWithTx from '@/components/Toast/DescriptionWithTx';
import { waitForTransaction } from 'wagmi/actions';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import toast from 'react-hot-toast';
import ButtonLoader from '@/components/ButtonLoader/ButtonLoader';
import moment from 'moment';

interface IBuybackDetails {
    launchpadAddress: Address;
    buybackDetails: FairLaunchBuybackDetails;
}

const BuybackDetails = ({ launchpadAddress, buybackDetails }: IBuybackDetails) => {
    const [txBuyback, setTxBuyback] = React.useState<Tx>(Tx.Idle);
    const { chainId } = useActiveChainId();

    const isBuybackIdle = txBuyback === Tx.Idle;
    const isBuybackPending = txBuyback === Tx.Pending;
    const isBuybackProcessing = txBuyback === Tx.Processing;

    const currentTime = moment().utc();
    const {
        amountPerBuyback,
        boughtBackAmount,
        buyBackPercent,
        maxDelay,
        minDelay,
        totalBuyBackAmount,
        lastBuyTime,
        refetch,
    } = buybackDetails;
    const fairlaunchContract = useFairLaunchContract(launchpadAddress);

    const { fundTokenDecimals, fundTokenSymbol } = useFundTokenDetails(launchpadAddress);
    const totalBuyback = formatUnits(totalBuyBackAmount, fundTokenDecimals);
    const boughtBack = formatUnits(boughtBackAmount, fundTokenDecimals);
    const perBuyback = formatUnits(amountPerBuyback, fundTokenDecimals);
    const buybackPercent = Number(buyBackPercent) / 1000;
    const lastBuyBackTime = moment(Number(lastBuyTime) * 1000)
        .utc()
        .format('YYYY-MM-DD hh:mm a (UTC)');
    // as min delay is 1 min so adding 1 min to last claim time
    const nextBuybackTime = moment(Number(lastBuyTime) * 1000)
        .add(1, 'minute')
        .utc()
        .format('YYYY-MM-DD hh:mm a (UTC)');
    const nextBuyTime = moment(Number(lastBuyTime) * 1000)
        .add(1, 'minute')
        .utc();

    const canBuyback = currentTime.isSameOrBefore(nextBuyTime);

    const { data: currentSaleStatus } = useContractRead({
        address: fairlaunchContract.address,
        abi: fairlaunchContract.abi,
        functionName: 'getCurrentStatus',
    });

    const enableBuyback = currentSaleStatus !== LaunchpadSaleStatus.CLOSED;

    const statics = [
        {
            id: 1,
            property: 'Total Buyback Amount',
            value: `${totalBuyback} ${fundTokenSymbol}`,
        },
        { id: 2, property: 'Boughtback Amount', value: `${boughtBack} ${fundTokenSymbol}` },
        {
            id: 3,
            property: 'Boughtback Remain Amount	',
            value: `${perBuyback} ${fundTokenSymbol}`,
        },
        {
            id: 4,
            property: 'Buyback Percent',
            value: `${buybackPercent}%`,
        },
        { id: 5, property: 'Min Buyback Delay', value: `${Number(minDelay) / 60} minutes` },
        { id: 6, property: 'Max Buyback Delay', value: `${Number(maxDelay) / 60} minutes` },
    ];

    if (lastBuyTime > 0n) {
        statics.push(
            { id: 7, property: 'Next Buyback', value: `${nextBuybackTime}` },
            { id: 8, property: 'Last Buyback Time', value: `${lastBuyBackTime}` },
        );
    }

    const buyback = async () => {
        try {
            setTxBuyback(Tx.Pending);
            let hash;
            hash = await fairlaunchContract.write.buyBackTokens({});
            await waitForTransaction({ hash, chainId });
            refetch();
            setTxBuyback(Tx.Processing);
        } catch (error: any) {
            console.error(error);
            toast.error(
                <DescriptionWithTx
                    title={error.name || 'Error'}
                    description={error.shortMessage || 'BuybackTokens Error'}
                />,
            );
        } finally {
            refetch();
            setTxBuyback(Tx.Idle);
        }
    };
    // eslint-disable-next-line consistent-return
    return (
        <>
            <Typography fontWeight={600} fontSize={'18px'} mt={3} mb={1}>
                Buyback Info
            </Typography>
            <PrimaryCard sx={{ paddingTop: '25px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        paddingTop: '5px',
                    }}
                >
                    {statics.map(({ id, property, value }, key) => {
                        const isLast = key === statics.length - 1;
                        return (
                            <Box
                                key={id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottom: isLast ? 'none' : '1px solid #ffffff30',
                                    pb: '5px',
                                }}
                            >
                                <Typography fontSize="12px">{property}</Typography>
                                <Typography fontSize="12px" sx={{ whiteSpace: 'nowrap' }}>
                                    {String(value)}
                                </Typography>
                            </Box>
                        );
                    })}
                </Box>
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    mt={1}
                >
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={buyback}
                        disabled={
                            isBuybackPending || isBuybackProcessing || canBuyback || enableBuyback
                        }
                    >
                        {isBuybackIdle && 'buyback'}
                        {isBuybackPending && <ButtonLoader text="Pending..." />}
                        {isBuybackProcessing && <ButtonLoader text="Processing..." />}
                    </Button>
                </Box>
            </PrimaryCard>
        </>
    );
};

export default BuybackDetails;
