import React from 'react';
import { Box, Typography } from '@mui/material';
import PrimaryCard from '../Cards/PrimaryCard';
import Divider from '../Divider/Divider';
import { useFormContext } from 'react-hook-form';
import { shortenUrl } from '@/utils/shortenUrl';
import { PrivateSaleFormInput } from './types';
import { NATIVE_CURRENCY_SYMBOLS } from '@/constants';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { getCurrencySymbolByEnum } from './utils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'; // Enable UTC plugin

dayjs.extend(utc);

interface RowProps {
    property: string;
    value: string;
}
const Row = ({ property, value }: RowProps) => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignitems: 'center',
                    justifyContent: 'space-between',
                    gap: '15px',
                    flexDirection: { xs: 'column', md: 'row' },
                }}
            >
                <Typography variant="h5" fontSize={14}>
                    {property}
                </Typography>
                <Typography variant="body1" fontSize={14}>
                    {typeof value === 'object' ? value!.toString() : value}
                </Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid #fff', opacity: '0.25', my: '15px' }} />
        </>
    );
};

const Step4 = () => {
    const { chainId } = useActiveChainId();

    const { watch } = useFormContext<PrivateSaleFormInput>();
    const data = watch();
    const {
        title,
        currency,
        whitelist,
        softCap,
        hardCap,
        maxBuy,
        minBuy,
        startTime,
        endTime,
        firstFundRelease,
        vestingPeriodEachCycle,
        cycleReleasePercent,
        logoUrl,
        websiteUrl,
        facebookUrl,
        twitterUrl,
        githubUrl,
        telegramUrl,
        redditUrl,
        youtubeUrl,
        description,
    } = data;

    const statics: { id: number; property: string; value: string }[] = [
        { id: 1, property: 'Title', value: title },
        { id: 2, property: 'Currency', value: getCurrencySymbolByEnum(chainId, currency) },
        { id: 3, property: 'Whitelist', value: whitelist },
        {
            id: 4,
            property: 'Soft Cap',
            value: `${softCap} ${getCurrencySymbolByEnum(chainId, currency)}`,
        },
        {
            id: 5,
            property: 'Hard Cap',
            value: `${hardCap} ${getCurrencySymbolByEnum(chainId, currency)}`,
        },
        {
            id: 6,
            property: 'Min Buy',
            value: `${minBuy} ${getCurrencySymbolByEnum(chainId, currency)}`,
        },
        {
            id: 7,
            property: 'Max Buy',
            value: `${maxBuy} ${getCurrencySymbolByEnum(chainId, currency)}`,
        },
        {
            id: 8,
            property: 'Start Time (UTC)',
            value: dayjs.utc(Number(startTime)).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            id: 9,
            property: 'End Time (UTC)',
            value: dayjs.utc(Number(endTime)).format('YYYY-MM-DD HH:mm:ss'),
        },
        { id: 10, property: 'First Fund Release', value: `${firstFundRelease}%` },
        { id: 11, property: 'Vesting Period Each Cycle (Days)', value: vestingPeriodEachCycle },
        { id: 12, property: 'Cycle Release Percent', value: `${cycleReleasePercent}%` },
        { id: 13, property: 'Website ', value: shortenUrl(websiteUrl || '', 40) },
        { id: 14, property: 'Facebook', value: shortenUrl(facebookUrl || '', 40) },
        { id: 15, property: 'Twitter', value: shortenUrl(twitterUrl || '', 40) },
        { id: 16, property: 'Github', value: shortenUrl(githubUrl || '', 40) },
        { id: 17, property: 'Telegram', value: shortenUrl(telegramUrl || '', 40) },
        { id: 18, property: 'Reddit', value: shortenUrl(redditUrl || '', 40) },
        { id: 19, property: 'Youtube', value: shortenUrl(youtubeUrl || '', 40) },
        { id: 20, property: 'Description', value: description },
    ];
    return (
        <Box>
            {statics.map(({ id, property, value }) => {
                if (value) {
                    return <Row key={id} property={property} value={value} />;
                }
                return null;
            })}
        </Box>
    );
};

export default Step4;
