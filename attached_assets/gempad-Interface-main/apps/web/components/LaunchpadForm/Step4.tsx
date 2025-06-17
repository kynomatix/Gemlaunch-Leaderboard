import {
    LaunchpadCurrencies,
    LaunchpadFormInput,
    ListingOptions,
} from '@/components/LaunchpadForm/types';
import {
    DEFAULT_CHAIN_ID,
    DUTCH_AUCTION_CONTRACT_ADDRESSES,
    NATIVE_CURRENCY_SYMBOLS,
} from '@/constants';
import { fixNumberPoints } from '@/utils/fixNumberPoints';
import { shortenAddress } from '@/utils/format';
import { Box, Typography, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import { useNetwork } from 'wagmi';

interface RowProps {
    property: string;
    value: string;
    isAddress?: boolean;
}

interface Step4Props {
    tokenNeedToCreateFairLaunch: number;
    tokenDetails: any[];
    tokenNeedToCreateLaunchpad: number;
}

const Row = ({ property, value, isAddress }: RowProps) => {
    const isMobile = useMediaQuery('(max-width:500px)');
    return (
        <>
            {value === 'undefined' || value === undefined ? (
                <></>
            ) : (
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
                        <Typography variant="body1" fontSize={14}>
                            {property}
                        </Typography>
                        <Typography
                            variant="body1"
                            fontSize={14}
                            color={isAddress ? 'primary' : 'common.white'}
                            sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                maxWidth: '80%',
                            }}
                        >
                            {isAddress && isMobile ? shortenAddress(value) : value}
                        </Typography>
                    </Box>
                    <Box sx={{ borderBottom: '1px solid #fff', opacity: '0.25', my: '15px' }} />
                </>
            )}
        </>
    );
};


interface List {
    id: number;
    property: string;
    value: string;
}
const Step4 = ({
    tokenNeedToCreateFairLaunch,
    tokenDetails,
    tokenNeedToCreateLaunchpad,
}: Step4Props) => {
    const FAIRLAUNCH = '/create-fair-launch';
    const LAUNCHPAD = '/create-launchpad';
    const DUTCH_AUCTION = '/create-dutch-auction';
    const SUBSCRIPTION = '/create-subscription';

    const { watch } = useFormContext<LaunchpadFormInput>();
    const { chain } = useNetwork();
    const chainId = chain?.id;
    const pathname = usePathname();

    const tokenName = tokenDetails?.[0]?.value;
    const tokenDecimals = tokenDetails?.[2]?.value;
    const tokenSymbol = tokenDetails?.[1]?.value;

    const data = watch();
    const {
        tokenAddress,
        totalSellingAmount,
        softcap,
        maxContribution,
        buybackPercent,
        liquidity,
        startTime,
        endTime,
        liquidityLockup,
        presaleRate,
        listingRate,
        hardcap,
        minBuy,
        maxBuy,
        refundType,
        websiteUrl,
        facebookUrl,
        githubUrl,
        redditUrl,
        youtubeUrl,
        telegramUrl,
        twitterUrl,
        description,
        releasePresale,
        vestingPeriod,
        presaleTokenRelease,
        startPrice,
        endPrice,
        whitelist,
        minContribution,
        decreasePriceCycle,
        router,
        isVestingActive,
        tgeReleasePercent,
        cycle,
        cycleReleasePercent,
        logoUrl,
        subscriptionRate,
        hardcapTokensPerUser,
        listingOptions,
    } = data;

    const currency = watch('currency');
    const currencySymbol =
        currency === LaunchpadCurrencies.NATIVE
            ? NATIVE_CURRENCY_SYMBOLS[chainId || DEFAULT_CHAIN_ID]
            : currency;

    const isAutoListing = listingOptions === ListingOptions.AUTO;

    const fairlaunch = [
        {
            id: 1,
            property: 'Total Tokens',
            value: `${fixNumberPoints(tokenNeedToCreateFairLaunch, 3)} ${tokenSymbol}`,
        },
        { id: 2, property: 'Token Name', value: `${tokenName}` },
        { id: 3, property: 'Token Symbol', value: `${tokenSymbol}` },
        { id: 4, property: 'Token Decimals', value: `${tokenDecimals}` },
        { id: 5, property: 'Total Selling Amount', value: `${totalSellingAmount} ${tokenSymbol}` },
        { id: 6, property: 'Soft Cap', value: `${softcap} ${tokenSymbol}` },
        { id: 7, property: 'Max Contribution', value: `${maxContribution ?? 0} ${tokenSymbol}` },
        { id: 8, property: 'Buyback Percent', value: `${buybackPercent}%` },
        { id: 9, property: 'Liquidity', value: isAutoListing ? `${liquidity}%` : undefined },
        { id: 10, property: 'Start Time', value: `${startTime}` },
        { id: 11, property: 'End Time', value: `${endTime}` },
        {
            id: 12,
            property: 'Liquidity Lockup Time',
            value: isAutoListing ? `${liquidityLockup} minutes` : undefined,
        },
        { id: 13, property: 'Website', value: `${websiteUrl}` },
        { id: 14, property: 'Facebook', value: `${facebookUrl}` },
        { id: 15, property: 'Github', value: `${githubUrl}` },
        { id: 16, property: 'Youtube', value: `${youtubeUrl}` },
        { id: 17, property: 'Telegram', value: `${telegramUrl}` },
        { id: 18, property: 'Twitter', value: `${twitterUrl}` },
        { id: 19, property: 'Reddit', value: `${redditUrl}` },
        { id: 20, property: 'Description', value: `${description}` },
    ];

    const launchpad = [
        {
            id: 1,
            property: 'Total Tokens',
            value: `${fixNumberPoints(tokenNeedToCreateLaunchpad, 3)} ${tokenSymbol}`,
        },
        { id: 2, property: 'Token Name', value: `${tokenName}` },
        { id: 3, property: 'Token Symbol', value: `${tokenSymbol}` },
        { id: 4, property: 'Token Decimals', value: `${tokenDecimals}` },
        { id: 5, property: 'Presale Rate', value: `${presaleRate} ${tokenSymbol}` },
        // { id: 6, property: 'Listing Rate', value:`${listingRate} ${tokenSymbol}`},
        { id: 8, property: 'Softcap', value: `${softcap} ${currencySymbol}` },
        { id: 9, property: 'Hardcap ', value: `${hardcap} ${currencySymbol}` },
        { id: 10, property: 'Minimum Buy', value: `${minBuy}  ${currencySymbol}` },
        { id: 11, property: 'Maximum Buy', value: `${maxBuy}  ${currencySymbol}` },
        { id: 12, property: 'Unsoled Tokens', value: `${refundType}` },
        // { id: 13, property: 'Liquidity', value: `${liquidity}` },
        // { id: 14, property: 'Liquidity Lockup Time', value: `${liquidityLockup}` },
        { id: 15, property: 'First Release for Presale (%)', value: `${releasePresale}` },
        { id: 16, property: 'Vesting Period Each Cycle (Min)', value: `${vestingPeriod}` },
        {
            id: 17,
            property: 'Preslae Token Release Each Cycle (%)',
            value: `${presaleTokenRelease}`,
        },
        { id: 18, property: 'Logo Url', value: `${logoUrl}` },
        { id: 19, property: 'Website', value: `${websiteUrl}` },
        { id: 20, property: 'Facebook', value: `${facebookUrl}` },
        { id: 21, property: 'Twitter', value: `${githubUrl}` },
        { id: 22, property: 'Youtube', value: `${youtubeUrl}` },
        { id: 23, property: 'Telegram', value: `${telegramUrl}` },
        { id: 24, property: 'Twitter', value: `${twitterUrl}` },
        { id: 25, property: 'Reddit', value: `${redditUrl}` },
        { id: 26, property: 'Description', value: `${description}` },
    ];

    const autoListingData = [
        { id: 6, property: 'Listing Rate', value: `${listingRate} ${tokenSymbol}` },
        { id: 13, property: 'Liquidity', value: `${liquidity}` },
        { id: 14, property: 'Liquidity Lockup Time', value: `${liquidityLockup}` },
    ];

    if (listingOptions === ListingOptions.AUTO) {
        const middle = Math.floor(launchpad.length / 2);
        autoListingData.forEach((item: List) => {
            launchpad.splice(middle, 0, item);
        });
    }

    const dutchAuction = [
        {
            id: 1,
            property: 'Factory Address',
            value: DUTCH_AUCTION_CONTRACT_ADDRESSES[chainId],
            isAddress: true,
        },
        { id: 2, property: 'Token Address', value: tokenAddress, isAddress: true },
        { id: 3, property: 'Total Selling Amount', value: totalSellingAmount },
        { id: 4, property: 'Currency', value: currencySymbol },
        { id: 5, property: 'Fee Options', value: '5' },
        { id: 6, property: `Start Price (${currencySymbol})`, value: startPrice },
        { id: 7, property: `End Price (${currencySymbol})`, value: endPrice },
        { id: 8, property: `Softcap (${currencySymbol})`, value: softcap },
        { id: 9, property: `Hardcap (${currencySymbol}})`, value: hardcap },
        { id: 10, property: 'Whitelist', value: whitelist },
        { id: 11, property: `Min Contribution (${currencySymbol})`, value: minContribution },
        { id: 12, property: `Max Contribution (${currencySymbol})`, value: maxContribution },
        { id: 13, property: 'Decrease Price Cycle (min)', value: decreasePriceCycle },
        { id: 14, property: 'Liquidity Percent (%)', value: liquidity },
        { id: 15, property: 'Router', value: router, isAddress: true },
        { id: 16, property: 'Refund Type', value: refundType },
        { id: 17, property: 'Liquidity Lock Time (min)', value: liquidityLockup },
        { id: 18, property: 'Start Time (UTC)', value: `${startTime}` },
        { id: 19, property: 'End Time (UTC)', value: `${endTime}` },
        { id: 20, property: 'Using Vesging Contribution', value: `${isVestingActive}` },
        { id: 21, property: 'TGE Release Percent (%)', value: tgeReleasePercent },
        { id: 22, property: 'Cycle (min)', value: cycle },
        { id: 23, property: 'Cycle Relase Percent (%)', value: cycleReleasePercent },
        { id: 24, property: 'Logo Url', value: `${logoUrl}` },
        { id: 25, property: 'Website', value: `${websiteUrl}` },
        { id: 26, property: 'Facebook', value: `${facebookUrl}` },
        { id: 27, property: 'Twitter', value: `${githubUrl}` },
        { id: 28, property: 'Youtube', value: `${youtubeUrl}` },
        { id: 29, property: 'Telegram', value: `${telegramUrl}` },
        { id: 30, property: 'Twitter', value: `${twitterUrl}` },
        { id: 31, property: 'Reddit', value: `${redditUrl}` },
        { id: 32, property: 'Description', value: `${description}` },
    ];

    const subscription = [
        { id: 1, property: 'Token Address', value: tokenAddress, isAddress: true },
        { id: 2, property: `Hardcap Tokens (${tokenSymbol})`, value: hardcap },
        { id: 3, property: 'Subscription Rate', value: subscriptionRate },
        { id: 4, property: 'Listing Rate', value: listingRate },
        { id: 5, property: 'Currency', value: currencySymbol },
        { id: 6, property: 'Fee Options', value: '5' },
        { id: 7, property: `Softcap Tokens (${tokenSymbol})`, value: softcap },
        {
            id: 8,
            property: `Hardcap Tokens Per User (${tokenSymbol})`,
            value: hardcapTokensPerUser,
        },
        { id: 9, property: 'Whitelist', value: whitelist },
        { id: 10, property: 'Liquidity Percent (%)', value: liquidity },
        { id: 11, property: 'Router', value: router, isAddress: true },
        { id: 12, property: 'Refund Type', value: refundType },
        { id: 13, property: 'Liquidity Lock Time (min)', value: liquidityLockup },
        { id: 14, property: 'Start Time (UTC)', value: `${startTime}` },
        { id: 15, property: 'End Time (UTC)', value: `${endTime}` },
        { id: 16, property: 'Logo Url', value: `${logoUrl}` },
        { id: 17, property: 'Website', value: `${websiteUrl}` },
        { id: 18, property: 'Facebook', value: `${facebookUrl}` },
        { id: 19, property: 'Twitter', value: `${githubUrl}` },
        { id: 20, property: 'Youtube', value: `${youtubeUrl}` },
        { id: 21, property: 'Telegram', value: `${telegramUrl}` },
        { id: 22, property: 'Twitter', value: `${twitterUrl}` },
        { id: 23, property: 'Reddit', value: `${redditUrl}` },
        { id: 24, property: 'Description', value: `${description}` },
    ];

    const DETAILS = {
        [FAIRLAUNCH]: fairlaunch,
        [LAUNCHPAD]: launchpad,
        [DUTCH_AUCTION]: dutchAuction,
        [SUBSCRIPTION]: subscription,
    };

    const list: List[] = DETAILS[pathname];

    return (
        <Box>
      {list?.map(({ id, property, value, ...rest }) => {
        if (!value) return null;

        if (property === 'Description') {
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
                <Typography variant="body1" fontSize={14}>
                    {property}
                </Typography>
                <Typography
                    variant="body1"
                    fontSize={14}
                    color={'primary'}
                    sx={{
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        maxWidth: '80%',
                    }}
                >
                    <span style={{color: "#fff"}} dangerouslySetInnerHTML={{ __html: value }} />
                </Typography>
            </Box>
            <Box sx={{ borderBottom: '1px solid #fff', opacity: '0.25', my: '15px' }} />
        </>
          );
        }

        return <Row key={id} property={property} value={value} {...rest} />;
      })}
    </Box>
        // <Box>
        //     {list?.map(({ id, ...rest }) => (rest?.value ? <Row key={id} {...rest} /> : null))}
        // </Box>
    );
};

export default Step4;
