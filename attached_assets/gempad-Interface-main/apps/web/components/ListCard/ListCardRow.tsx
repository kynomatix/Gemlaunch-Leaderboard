import { Avatar, Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import images from '../../public/assets/images/images';
import { ListCardRowProps, ListType } from './types';
import Link from 'next/link';
import { getBlockExploreLink } from '@/utils';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import LinkIcon from '@/public/assets/icons/link.svg';

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#178F74',
        color: 'white',
        boxShadow: theme.shadows[1],
        fontSize: 12,
    },
}));

const ListCardRow: React.FC<ListCardRowProps> = ({
    buttonTitle,
    desc,
    image,
    title,
    addr,
    chainId,
    listType,
}) => {
    let link: string;
    let target: string;
    if (listType === ListType.TOKEN) {
        link = getBlockExploreLink(addr, 'address', chainId);
        target = '_blank';
    }
    if (listType === ListType.LAUNCHPAD) {
        link = addr;
        target = '_self';
    }
    if (listType === ListType.PRIVATE_SALE) {
        link = addr;
        target = '_self';
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Avatar
                    alt="image"
                    src={image}
                    sx={{ width: '42px', height: '42px', borderRadius: '50%' }}
                >
                    <Image src={images.Gem} alt="profile" />
                </Avatar>
                <Box>
                    <LightTooltip title={title} placement="right-end">
                        <Typography
                            variant="body1"
                            fontWeight={600}
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {title?.length <= 12 ? title : `${title?.slice(0, 12)}...`}
                        </Typography>
                    </LightTooltip>
                    <Typography fontSize={14}>{desc}</Typography>
                </Box>
            </Box>
            {/* <Box sx={{ flex: 1, display: 'flex', justifyContent: 'end' }}> */}
            <Link href={link.toLowerCase()} target={target}>
                {/* <Button variant="contained">{buttonTitle} </Button> */}
                <Typography
                    variant="body1"
                    color="primary"
                    sx={{ ':hover': { textDecoration: 'underline', cursor: 'pointer' } }}
                >
                    {buttonTitle}
                </Typography>
                {/* <LinkIcon /> */}
            </Link>
            {/* </Box> */}
        </Box>
    );
};

export default ListCardRow;
