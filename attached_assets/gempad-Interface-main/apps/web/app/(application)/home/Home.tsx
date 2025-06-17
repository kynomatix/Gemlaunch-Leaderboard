'use client';

import AppStatsCard from '@/components/AppStatsCard/AppStatsCard';
import BlackGlowCard from '@/components/Cards/BlackGlowCard';
import PrimaryCard from '@/components/Cards/PrimaryCard';
import { GET_TRENDING_TOKENS } from '@/components/Home/query';
import { LaunchpadsIdsQyueryData } from '@/components/Home/types';
import ListCardLaunchpad from '@/components/ListCard/ListCardLaunchpad';
import ListCardPrivateSale from '@/components/ListCard/ListCardPrivateSale';
import ListCardToken from '@/components/ListCard/ListCardToken';
import ProjectsAggregation from '@/components/ProjectsAggregation/ProjectsAggregation';
import { getLaunchpadRouteByContractName } from '@/components/ViewPool/utils';
import { CurrencyData } from '@/constants/types';
import { useActiveChainId } from '@/hooks/useActiveChainId';
import { OperationVariables, useQuery } from '@apollo/client';

import {
    Box,
    Button,
    Grid,
    styled,
    Tooltip,
    tooltipClasses,
    TooltipProps,
    Typography,
    useMediaQuery,
} from '@mui/material';
import Link from 'next/link';
import Fire from 'public/assets/icons/fire.svg';
import { Address } from 'viem';

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

export const Home = ({ currencyData }: { currencyData: CurrencyData }) => {
    const isTab = useMediaQuery('(max-width: 1197px)');
    const { chainId } = useActiveChainId();
    const { data } = useQuery<LaunchpadsIdsQyueryData, OperationVariables>(GET_TRENDING_TOKENS, {
        variables: {
            limit: 10,
            orderBy: 'investedAmount_DESC',
        },
        context: { chainId },
    });

    const trendingTokens =
        data &&
        data.launchPads?.filter((lp, idx, self) => {
            return self.findIndex((x) => x.token.id === lp.token.id) === idx;
        });

    return (
        <Box>
            <PrimaryCard px={18} py={16} mt={20}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <Box sx={{ flexShrink: 0 }}>
                        <Fire />
                    </Box>
                    <Typography fontSize={16} fontWeight={600}>
                        Trending:{' '}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            ml: 1,
                        }}
                    >
                        {trendingTokens?.map((x) => (
                            <LightTooltip title={x.token.name} placement="top">
                                <Typography
                                    fontSize={14}
                                    fontWeight={500}
                                    sx={{
                                        textDecoration: 'underline',
                                        ':hover': { color: '#22CDA6', cursor: 'pointer' },
                                    }}
                                >
                                    <Link
                                        href={`/${getLaunchpadRouteByContractName(x.name, x.id)}`}
                                        target="_blank"
                                    >
                                        {x.token.symbol}
                                    </Link>
                                </Typography>
                            </LightTooltip>
                        ))}
                    </Box>
                </Box>
            </PrimaryCard>
            <BlackGlowCard px={22} py={22} mt={20}>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '10px',
                    }}
                >
                    <Box>
                        <Typography variant="h5" fontSize={20}>
                            Innovating the BNB ecosystem through the Gem Launchpad
                        </Typography>
                        <Typography variant="h5" fontSize={14} mt={1}>
                            By virtue of its efficient and user-friendly interface, Gemlaunch
                            enables projects to create tokens presales.
                        </Typography>
                    </Box>

                    <Link href="/create-launchpad">
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{ width: { xs: '100%', md: 'auto' } }}
                        >
                            Create
                        </Button>
                    </Link>
                </Box>
            </BlackGlowCard>
            <Grid container spacing={4} mt={0}>
                <Grid item xs={12} md={12} lg={4}>
                    <ListCardLaunchpad />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                    <ListCardPrivateSale />
                </Grid>
                <Grid item xs={12} md={12} lg={4}>
                    <ListCardToken />
                </Grid>
            </Grid>

            <ProjectsAggregation currencyData={currencyData} />
        </Box>
    );
};
export default Home;
