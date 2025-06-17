import React from 'react';

import Website from 'public/assets/icons/website-icon.svg';
import Reddit from 'public/assets/icons/reddit-icon.svg';
import Facebook from 'public/assets/icons/facebook-icon.svg';
import Github from 'public/assets/icons/github-icon.svg';
import Twitter from 'public/assets/icons/twitter-icon.svg';
import Telegram from 'public/assets/icons/telegram-icon.svg';
import Youtube from 'public/assets/icons/youtube-icon.svg';
import Link from 'next/link';
import { Box } from '@mui/material';

interface Socials {
    logoUrl?: string;
    webUrl?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    githubUrl?: string;
    telegramUrl?: string;
    redditUrl?: string;
    youtubeUrl?: string;
    description?: string;
}

const RenderSocialIcon = (key: string, url?: string) => {
    if (!url) return null;

    const iconMap: { [key: string]: any } = {
        webUrl: Website,
        facebookUrl: Facebook,
        twitterUrl: Twitter,
        githubUrl: Github,
        telegramUrl: Telegram,
        redditUrl: Reddit,
        youtubeUrl: Youtube,
    };

    const IconComponent = iconMap[key];
    if (!IconComponent) return null;

    return (
        <Box sx={{ color: '#ffffff', '&:hover': { color: '#2DFE87' } }}>
            <a key={key} href={url} target="_blank" rel="noreferrer">
                <IconComponent />
            </a>
        </Box>
    );
};

const SocialIcons: React.FC<{ socials: Socials }> = ({ socials }) => {
    if (!socials) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
            }}
        >
            {Object.entries(socials).map(([key, value]) => {
                if (key === 'logoUrl' || key === 'description' || !value) return null;
                return RenderSocialIcon(key, value);
            })}
        </Box>
    );
};

export default SocialIcons;
