import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { RowProps } from './types';
import Tooltip from '@mui/material/Tooltip';
import CopyIcon from 'public/assets/icons/copy.svg';
import { shortenAddress } from '@/utils/format';
import { handleCopy } from '@/utils/handleCopy';
import LinkIcon from 'public/assets/icons/link.svg';
import { getBlockExploreLink } from '@/utils';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import Link from 'next/link';

const Row = ({ property, value, isPrimary, id }: RowProps) => {
    const isMobile = useMediaQuery('(max-width: 700px)');
    const [open, setOpen] = React.useState(false);
    const { chainId } = useActiveChainId();

    const handleTooltipOpen = () => {
        setOpen(true);
        setTimeout(() => {
            setOpen(false);
        }, 2000);
    };

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
            <Typography variant="body1" fontSize={14} sx={{ whiteSpace: 'nowrap' }}>
                {property}
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px' }}>
                <Typography
                    color={isPrimary ? 'primary' : 'common.white'}
                    variant="body1"
                    fontSize={14}
                >
                    {isPrimary && isMobile && id !== 13 ? shortenAddress(value) : value} <br />
                </Typography>
                {id === 1 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Tooltip
                            placement="top"
                            PopperProps={{
                                disablePortal: true,
                            }}
                            open={open}
                            disableFocusListener
                            disableHoverListener
                            disableTouchListener
                            title="copied"
                        >
                            <Box
                                onClick={() => handleCopy(value, handleTooltipOpen)}
                                sx={{ cursor: 'pointer' }}
                            >
                                <CopyIcon />
                            </Box>
                        </Tooltip>
                        <Link href={getBlockExploreLink(value, 'address', chainId)} target="_blank">
                            <LinkIcon />
                        </Link>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Row;
