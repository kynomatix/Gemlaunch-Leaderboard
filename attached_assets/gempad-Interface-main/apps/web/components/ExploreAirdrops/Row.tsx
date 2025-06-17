import { useActiveChainId } from '@/hooks/useActiveChainId';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { RowProps } from './types';
import { shortenAddress } from '@/utils/format';
import { getBlockExploreLink } from '@/utils';
import Link from 'next/link';
import LinkIcon from 'public/assets/icons/link.svg';

export const Row: React.FC<RowProps> = ({ property, value, isLink, id }) => {
    const { chainId } = useActiveChainId();
    const isMobile = useMediaQuery('(max-width: 700px)');

    return (
        value && (
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
                <Typography variant="body1" fontSize={14} sx={{ whiteSpace: 'nowrap' }}>
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
                    {isLink && (
                        <Link href={getBlockExploreLink(value, 'address', chainId)} target="_blank">
                            <LinkIcon />
                        </Link>
                    )}
                </Box>
            </Box>
        )
    );
};
