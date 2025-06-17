import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Image from 'next/image';
import images from '@/public/assets/images/images';

interface AvatarProps {
    url: string;
    chainId: number;
}
const SmallAvatar = styled(Avatar)({
    width: '22px',
    height: '22px',
});

export default function BadgeAvatars(props: AvatarProps) {
    const { url, chainId } = props;

    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={<SmallAvatar alt="Remy Sharp" src={images.smallUrl.src} />}
        >
            <Avatar alt="token/profile" src={url} sx={{ width: '52px', height: '52px' }}>
                <Image src={images.Gem} alt="token/profile" />
            </Avatar>
        </Badge>
    );
}
