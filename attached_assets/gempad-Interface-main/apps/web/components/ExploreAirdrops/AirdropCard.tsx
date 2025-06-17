import React from 'react';
import { Box, Typography, Button, colors, Avatar } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Image, { StaticImageData } from 'next/image';
import images from '@/public/assets/images/images';
import StatusChip, { BGStates, States, Status } from './StatusChip';
import Link from 'next/link';
import { Address, formatUnits, parseUnits } from 'viem';
import { Airdrop } from '@/src/gql/graphql';
import { useAirdropContract } from '@/hooks/useContract';
import { useContractReads } from 'wagmi';

interface RowProps {
    property: string;
    value: string;
}

const Row = ({ property, value }: RowProps) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
                borderBottom: '1px solid #ffffff25',
                pb: '9px',
            }}
        >
            <Typography variant="h5" fontSize={14}>
                {property}
            </Typography>
            <Typography variant="body1" fontSize={14}>
                {value}
            </Typography>
        </Box>
    );
};

const AirdropCard = (props: Airdrop) => {
    const {
        name,
        metadata,
        token: { decimals, name: tokenName },
        contractAddress,
    } = props;

    const airdropContract = useAirdropContract(contractAddress as Address);

    const { data, isLoading } = useContractReads({
        contracts: [
            { ...airdropContract, functionName: 'totalTokens' },
            { ...airdropContract, functionName: 'getParticipants' },
            { ...airdropContract, functionName: 'getCurrentStatus' },
            { ...airdropContract, functionName: 'totalTokens' },
            { ...airdropContract, functionName: 'totalClaimedTokens' },
        ],
        watch: true,
    });

    // Extracting Data:
    const totalTokens = !isLoading && formatUnits(data?.[0]?.result || 0n, decimals);
    const totalAllocations = !isLoading && data?.[1]?.result?.length;
    const currentStatus = !isLoading && data?.[2]?.result;
    const tt = !isLoading && data?.[3]?.result;
    const tct = !isLoading && data?.[4]?.result;

    const totalClaimabaleAmount = formatUnits(tt, decimals);
    const totalClaimedTokens = formatUnits(tct, decimals);

    const isAllTokensClaimed = +totalClaimabaleAmount === +totalClaimedTokens;

    const rowData = [
        { id: 1, property: 'Token', value: tokenName },
        { id: 2, property: 'Total Tokens', value: totalTokens },
        { id: 3, property: 'Participants', value: totalAllocations?.toString() },
    ];

    // Methods:
    const getCurrentStatus = (status: number): string => {
        // Upcomming
        if (status === 0) {
            return 'Starts in:';
        }

        // Live
        if (status === 1) {
            return '';
        }

        // Cancelled
        if (status === 2) {
            return 'Cancelled';
        }

        return '';
    };

    return (
        <PrimaryCard py={25}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                }}
            >
                <Avatar src={metadata?.socials?.logoUrl} alt={name}>
                    <Image src={images.Gem} alt={name} />
                </Avatar>
                <StatusChip
                    status={isAllTokensClaimed && currentStatus === 1 ? 3 : currentStatus}
                />
            </Box>
            <Typography variant="h5" fontSize={20} mt={'12px'}>
                {name}
            </Typography>
            <Box sx={{ mt: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {rowData.map(({ id, ...rest }) => (
                    <Row {...rest} />
                ))}
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    mt: '25px',
                }}
            >
                <Box>{getCurrentStatus(currentStatus)}</Box>
                <Link href={`/airdrop-list/${contractAddress}`}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ px: '18px', whiteSpace: 'nowrap' }}
                    >
                        View Airdrop
                    </Button>
                </Link>
            </Box>
        </PrimaryCard>
    );
};

export default AirdropCard;
