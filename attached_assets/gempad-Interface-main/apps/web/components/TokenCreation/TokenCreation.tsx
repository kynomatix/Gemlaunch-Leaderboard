import {
    Box,
    Button,
    ClickAwayListener,
    Tooltip,
    Typography,
    Zoom,
    useMediaQuery,
} from '@mui/material';
import React from 'react';
import PrimaryCard from '../Cards/PrimaryCard';
import { Address } from 'viem';
import Link from 'next/link';
import { getBlockExploreLink } from '@/utils';
import { useNetwork } from 'wagmi';
import { shortenAddress } from '@/utils/format';
import { CreateTokenInput, TokenType } from '@/app/(application)/create-token/types';
import LinkIcon from 'public/assets/icons/link.svg';
import CopyIcon from 'public/assets/icons/copy.svg';
import { TokenCreationProps } from './types';
import { useActiveChainId } from '@/hooks/useActiveChainId';

const TokenCreation = ({
    address,
    txHash,
    data,
    setShowTokenCreation,
    reset,
}: TokenCreationProps) => {
    const isMobile = useMediaQuery('(max-width:500px)');
    const { chainId } = useActiveChainId();

    const [open, setOpen] = React.useState(false);
    const [openAddr, setOpenAddr] = React.useState(false);

    const handleTooltipClose = () => {
        setOpen(false);
        setOpenAddr(false);
    };

    const handleTooltipOpen = (v: number) => {
        navigator.clipboard.writeText(address);
        if (v === 1) {
            setOpen(true);
        } else {
            setOpenAddr(true);
        }
        setTimeout(() => {
            setOpen(false);
        }, 1500);
    };

    const {
        tokenName,
        buybackFee,
        liquidityFee,
        marketingFee,
        marketingWallet,
        gemlaunchAntiBotSystem,
        reflectionFee,
        tokenSupply,
        tokenSymbol,
        tokenType,
        charityMarketingPercent,
        generateLiquidityFee,
        generateYieldFee,
        tokenDecimals,
    } = data;

    const baseTokens = [
        { id: 1, title: 'Name', value: tokenName },
        { id: 2, title: 'Symbol', value: tokenSymbol },
        { id: 3, title: 'Total Supply', value: tokenSupply },
        { id: 4, title: 'Address', value: address },
        {
            id: 5,
            title: 'Gemlaunch Anti-bot Sysytem',
            value: gemlaunchAntiBotSystem ? 'Enabled' : 'Disabled',
        },
    ];

    const liquidityToken = [
        { id: 1, title: 'Name', value: tokenName },
        { id: 2, title: 'Symbol', value: tokenSymbol },
        { id: 3, title: 'Total Supply', value: tokenSupply },
        { id: 4, title: 'Address', value: address },
        { id: 5, title: 'Generate Yield Fee (%)', value: `${generateYieldFee}%` },
        { id: 6, title: 'Generate Liquidity Fee (%)', value: `${generateLiquidityFee}%` },
        {
            id: 7,
            title: 'Gemlaunch Anti-bot Sysytem',
            value: gemlaunchAntiBotSystem ? 'Enabled' : 'Disabled',
        },
    ];

    const stats = tokenType === TokenType.LiquidityGenerator ? liquidityToken : baseTokens;

    return (
        <PrimaryCard py={30} px={25}>
            <Box>
                <Typography variant="h5" textAlign="center">
                    Your Token Is Created!
                </Typography>
            </Box>

            <Box>
                {stats?.map(({ title, value, id }) => (
                    <>
                        {value && (
                            <Box
                                key={id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '10px',
                                    borderBottom: '1px solid #ffffff25',
                                    py: 2,
                                }}
                            >
                                <Typography variant="body1" fontSize={14}>
                                    {title}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Typography
                                        variant="body1"
                                        fontSize={14}
                                        color={id === 4 ? 'primary' : 'common.white'}
                                    >
                                        {id === 4 && isMobile ? shortenAddress(value) : value}
                                    </Typography>
                                    {id === 4 && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Tooltip
                                                PopperProps={{
                                                    disablePortal: true,
                                                }}
                                                onClose={handleTooltipClose}
                                                open={openAddr}
                                                disableFocusListener
                                                disableHoverListener
                                                disableTouchListener
                                                title="Address Copied"
                                                placement="top"
                                                TransitionComponent={Zoom}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <Box onClick={() => handleTooltipOpen(0)}>
                                                    <CopyIcon />
                                                </Box>
                                            </Tooltip>
                                            <Link
                                                href={getBlockExploreLink(
                                                    value as string | number,
                                                    'address',
                                                    chainId,
                                                )}
                                                target="_blank"
                                            >
                                                <LinkIcon />
                                            </Link>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </>
                ))}
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: ['1fr', '1fr 1fr', '1fr 1fr 1fr 1fr'], // Adjust as needed
                    gap: 2, // Adjust spacing between buttons
                    maxWidth: 800,
                    width: '100%',
                    mx: 'auto',
                    mt: 3,
                }}
            >
                <Link href={getBlockExploreLink(txHash, 'transaction', chainId)} target="_blank">
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{ whiteSpace: 'nowrap', width: '100%', px: 3 }}
                    >
                        View Transaction
                    </Button>
                </Link>

                <Box>
                    <Button
                        onClick={() => {
                            setShowTokenCreation(false);
                            reset();
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ whiteSpace: 'nowrap', width: '100%', px: 3 }}
                    >
                        New Token
                    </Button>
                </Box>

                <Link href={`/create-launchpad?address=${address}`}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ whiteSpace: 'nowrap', width: '100%', px: 3 }}
                    >
                        Create Launchpad
                    </Button>
                </Link>
                <Link href={`/create-fair-launch?address=${address}`}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ whiteSpace: 'nowrap', width: '100%', px: 3 }}
                    >
                        Create FairLaunch
                    </Button>
                </Link>
            </Box>
        </PrimaryCard>
    );
};

export default TokenCreation;
