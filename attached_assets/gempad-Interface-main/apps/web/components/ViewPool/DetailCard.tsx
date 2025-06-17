'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Image from 'next/image';
import images from '@/public/assets/images/images';
// import StatusChip, { BGStates, States, Status } from './StatusChip';
import useMediaQuery from '@mui/material/useMediaQuery';
import { shortenAddress } from '@/utils/format';

// import icons
import LinkIcon from 'public/assets/icons/link.svg';
import Website from 'public/assets/icons/website-icon.svg';
import Discord from 'public/assets/icons/discord-icon.svg';
import Github from 'public/assets/icons/github-icon.svg';
import Twitter from 'public/assets/icons/twitter-icon.svg';
import Telegram from 'public/assets/icons/telegram-icon.svg';
import Youtube from 'public/assets/icons/youtube-icon.svg';
import Link from 'next/link';
import StatusChip, { Status } from '../ExploreAirdrops/StatusChip';

interface RowProps {
    property: string;
    value: string;
    isLink?: boolean;
    id?: number;
}

const Row = ({ property, value, isLink, id }: RowProps) => {
    const isMobile = useMediaQuery('(max-width: 700px)');
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                borderBottom: '1px solid #ffffff25',
                pb: '9px',
                mt: '15px',
                flexWrap: 'wrap',
            }}
        >
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap' }}>
                {property}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography
                    color={isLink ? 'primary' : id === 3 ? 'common.blue' : 'common.white'}
                    variant="body1"
                    fontSize={14}
                >
                    {isLink && isMobile ? shortenAddress(value) : value}
                </Typography>
                {isLink ? <LinkIcon /> : ''}
            </Box>
        </Box>
    );
};

const data = [
    {
        id: 1,
        property: 'Airdrop Address',
        value: '0x00Dd585ba94807C621716D82579fa9F870495131',
        isLink: true,
    },
    {
        id: 2,
        property: 'Token Address',
        value: '0x00Dd585ba94807C621716D82579fa9F870495131',
        isLink: true,
    },
    { id: 3, property: 'Name', value: 'CBD' },
    { id: 4, property: 'Symbol', value: 'CDV2' },
    { id: 5, property: 'Total Tokens', value: '182,122 CDV2' },
    { id: 6, property: 'TGE Release Percent', value: '90%' },
    { id: 7, property: 'Cycle', value: '15 days' },
    { id: 8, property: 'Cycle Release Percent', value: '10%' },
];

const icons = [Website, Telegram, Github, Youtube, Twitter, Discord];

interface DetailsCardProps {
    status: Status;
}

const DetailCard = () => {
    const isMobile = useMediaQuery('(max-width:400px)');
    return (
        <Box sx={{ width: '100%' }}>
            <PrimaryCard py={25}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'space-between',
                        flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            flexWrap: isMobile ? 'wrap' : 'nowrap',
                        }}
                    >
                        <Image src={images.AirdropUser} alt="user" />
                        <Box>
                            <Typography variant="h5" fontSize={20}>
                                Bolic Pass NFT Holders Airdrop Phase 1
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                }}
                            >
                                {icons.map((Icon, idx) => (
                                    <Box
                                        key={idx}
                                        sx={{
                                            cursor: 'pointer',
                                            color: '#ffffff',
                                            '&:hover': { color: '#2DFE87' },
                                        }}
                                    >
                                        <Link href="#">
                                            <Icon />
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                    <StatusChip status={0} />
                </Box>

                <Box sx={{ mt: '24px', mb: '10px' }}>
                    <Typography variant="body1" maxWidth={654} pr={1}>
                        Bolic AI is a cutting-edge platform that is committed to accelerating the
                        adoption of AI in the cryptocurrency market. Our platform offers a full
                        suite of services, including web development, smart contract deployment,
                        visual branding, project governance, and AI integrations, all powered by the
                        BOAI Token.
                    </Typography>
                </Box>

                <Box>
                    {data.map((item) => (
                        <Row key={item.id} {...item} />
                    ))}
                </Box>
            </PrimaryCard>
        </Box>
    );
};

export default DetailCard;
